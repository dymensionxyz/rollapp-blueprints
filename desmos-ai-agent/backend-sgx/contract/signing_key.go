package contract

import (
	"crypto/ecdsa"
	"errors"
	"fmt"
	"log/slog"
	"os"

	"github.com/edgelesssys/ego/ecrypto"
	"github.com/ethereum/go-ethereum/crypto"
)

const signingKeyFile = "/signing_key"

func getSigningKey(logger *slog.Logger) (*ecdsa.PrivateKey, error) {
	var priKey *ecdsa.PrivateKey
	sealedKey, err := os.ReadFile(signingKeyFile)
	if err == nil {
		logger.Info("Found existing signing key")
		priKey, err = openExistingSigningKey(sealedKey)
	} else if errors.Is(err, os.ErrNotExist) {
		logger.Info("Creating new signing key")
		priKey, err = createNewSigningKey()
	}
	if err != nil {
		return nil, fmt.Errorf("create signing key: %w", err)
	}

	publicKey := priKey.Public().(*ecdsa.PublicKey)
	logger.Info("Signing key", "address", crypto.PubkeyToAddress(*publicKey).Hex())

	return priKey, nil
}

func createNewSigningKey() (*ecdsa.PrivateKey, error) {
	priKey, err := crypto.GenerateKey()
	if err != nil {
		return nil, fmt.Errorf("generate ECDSA pri key: %w", err)
	}
	binaryKey := crypto.FromECDSA(priKey)

	sealedKey, err := ecrypto.SealWithUniqueKey(binaryKey, nil)
	if err != nil {
		return nil, fmt.Errorf("create new signing key: %w", err)
	}

	err = os.WriteFile(signingKeyFile, sealedKey, 0o600)
	if err != nil {
		return nil, fmt.Errorf("write new signing key: %w", err)
	}

	return priKey, nil
}

func openExistingSigningKey(sealedKey []byte) (*ecdsa.PrivateKey, error) {
	binaryKey, err := ecrypto.Unseal(sealedKey, nil)
	if err != nil {
		return nil, fmt.Errorf("unseal existing DB: %w", err)
	}
	priKey, err := crypto.ToECDSA(binaryKey)
	if err != nil {
		return nil, fmt.Errorf("convert ECDSA to private key: %w", err)
	}
	return priKey, nil
}
