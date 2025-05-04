package main

import (
	"bytes"
	"crypto/tls"
	"encoding/binary"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/edgelesssys/ego/attestation"
	"github.com/edgelesssys/ego/eclient"
)

var signer []byte

func main() {
	signerArg := "45b53b8770c322dcf1305c394bee9ff89ea8fbc5a1b6d00ba19204db0abacb54"
	serverAddr := "localhost:8080"

	// get signer command line argument
	var err error
	signer, err = hex.DecodeString(signerArg)
	if err != nil {
		panic(err)
	}

	// Create a TLS config that verifies a certificate with embedded report.
	tlsConfig := eclient.CreateAttestationClientTLSConfig(verifyReport)

	secret := "aaa"

	_, err = httpGet(tlsConfig, "https://"+serverAddr+"/open_ai_key?s="+secret)
	if err != nil {
		panic(fmt.Sprintf("httpGet err: %s", err.Error()))
	}
	fmt.Println("Sent secret over attested TLS channel.")
}

func verifyReport(report attestation.Report) error {
	// You can either verify the UniqueID or the tuple (SignerID, ProductID, SecurityVersion, Debug).

	if report.SecurityVersion != 1 {
		return errors.New("invalid security version")
	}
	if binary.LittleEndian.Uint16(report.ProductID) != 1 {
		return errors.New("invalid product")
	}
	if !bytes.Equal(report.SignerID, signer) {
		return errors.New("invalid signer")
	}

	// For production, you must also verify that report.Debug == false

	return nil
}

func httpGet(tlsConfig *tls.Config, url string) ([]byte, error) {
	client := http.Client{Transport: &http.Transport{TLSClientConfig: tlsConfig}}
	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("http get error: %v", err)
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("http get body error: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		fmt.Println(string(body))
		return nil, fmt.Errorf("http get error: %v", err)
	}
	return body, nil
}
