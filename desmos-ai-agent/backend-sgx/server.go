package main

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/edgelesssys/ego/enclave"
)

func RunServer(ctx context.Context, logger *slog.Logger, openAIKey chan<- string) {
	// Create a TLS config with a self-signed certificate and an embedded report.
	tlsCfg, err := enclave.CreateAttestationServerTLSConfig()
	if err != nil {
		panic(err)
	}

	// Create HTTPS server.

	http.HandleFunc("/open-ai-key", func(w http.ResponseWriter, r *http.Request) {
		key, ok := r.URL.Query()["s"]
		if !ok || len(key) != 1 || key[0] == "" {
			w.WriteHeader(http.StatusBadRequest)
		}
		openAIKey <- key[0]
	})

	server := http.Server{Addr: "0.0.0.0:8080", TLSConfig: tlsCfg}

	go func() {
		<-ctx.Done()
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownCancel()
		_ = server.Shutdown(shutdownCtx)
	}()

	logger.Info("Starting HTTPS server at http://0.0.0.0:8080/")
	err = server.ListenAndServeTLS("", "")
	if err != nil {
		logger.Error("ListenAndServeTLS", "err", err)
	}
}
