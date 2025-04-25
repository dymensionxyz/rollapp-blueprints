// Package attestation provides the server logic for handling TEE attestation requests.
// The binary should be run in the Confidential VM from GCP as it uses built-in
// attestation and bindings for the TEE.
package attestation

import (
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"strings"
	"time"

	"golang.org/x/net/http2"

	"github.com/gorilla/websocket"
)

var (
	socketPath    = "/run/container_launcher/teeserver.sock"
	tokenEndpoint = "http://localhost/v1/token"
	contentType   = "application/json"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Handler creates a multiplexer configured with the attestation connection handler.
func Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/connection", handleConnectionRequest)
	return mux
}

func getCustomToken(nonce string) ([]byte, error) {
	httpClient := http.Client{
		Transport: &http.Transport{
			DialContext: func(_ context.Context, _, _ string) (net.Conn, error) {
				return net.Dial("unix", socketPath)
			},
		},
	}

	body := fmt.Sprintf(`{
		"audience": "uwear",
		"nonces": ["%s"],
		"token_type": "PKI"
	}`, nonce)

	resp, err := httpClient.Post(tokenEndpoint, contentType, strings.NewReader(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close() // Ensure body is closed

	fmt.Printf("Response from launcher: %v\n", resp)
	text, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read resp.Body: %w", err)
	}
	fmt.Printf("Token from the attestation service: %s\n", text)

	return text, nil
}

func getEKMHashFromRequest(r *http.Request) (string, error) {
	if r.TLS == nil {
		return "", fmt.Errorf("request TLS state is nil, cannot get EKM")
	}
	ekm, err := r.TLS.ExportKeyingMaterial("testing_nonce", nil, 32)
	if err != nil {
		err = fmt.Errorf("failed to get EKM from inbound http request: %w", err)
		return "", err
	}

	sha := sha256.New()
	sha.Write(ekm)
	hash := base64.StdEncoding.EncodeToString(sha.Sum(nil))

	fmt.Printf("EKM: %v\nSHA hash: %v\n", ekm, hash) // Added newline for clarity
	return hash, nil
}

func handleConnectionRequest(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("failed to upgrade connection to a websocket with err: %v\n", err)
		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError) // Inform client
		return
	}
	defer conn.Close()

	hash, err := getEKMHashFromRequest(r)
	if err != nil {
		fmt.Printf("Failed to get EKM: %v\n", err)
		// Optionally inform the client, but might leak info. Consider just closing.
		return
	}

	token, err := getCustomToken(hash)
	if err != nil {
		fmt.Printf("failed to get custom token from token endpoint: %v\n", err)
		// Optionally inform the client
		return
	}

	err = conn.WriteMessage(websocket.TextMessage, token)
	if err != nil {
		fmt.Printf("Failed to write token message: %v\n", err)
		// Error occurred, connection might be broken, defer will handle close.
		return
	}

	fmt.Println("Token sent, terminating connection")
}

type Server struct {
	logger *slog.Logger
	s      *http.Server
}

func NewServer(logger *slog.Logger, addr string) (*Server, error) {
	tlsConfig := &tls.Config{
		// In a real scenario, configure TLS properly.
		// For this example, we rely on the certificates being present.
	}

	// Create a server instance using the package's handler
	server := &http.Server{
		Addr:      addr,
		Handler:   Handler(), // Use the package's handler
		TLSConfig: tlsConfig,
	}

	// Configure HTTP/2
	// Note: Go's server supports HTTP/2 by default if TLSConfig is non-nil.
	// Explicit configuration might be needed for specific settings.
	err := http2.ConfigureServer(server, &http2.Server{})
	if err != nil {
		return nil, fmt.Errorf("failed to configure HTTP/2: %w", err)
	}

	return &Server{logger: logger, s: server}, nil
}

func (s *Server) Run(certFile, keyFile string) {
	s.logger.Info("Starting attestation server", "address", s.s.Addr)

	if certFile != "" && keyFile != "" {
		certFile = "./server.crt"
		keyFile = "./server.key"
	}
	err := s.s.ListenAndServeTLS(certFile, keyFile)
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		// ErrServerClosed is expected on graceful shutdown, don't wrap it.
		s.logger.With("error", err).Error("attestation server error")
	}

	s.logger.Info("attestation server stopped")
}

func (s *Server) Stop() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return s.s.Shutdown(ctx)
}
