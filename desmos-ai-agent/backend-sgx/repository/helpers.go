package repository

import (
	"crypto/rand"
	"fmt"
	"os"

	"github.com/edgelesssys/ego/ecrypto"
	"github.com/edgelesssys/estore"
)

func createNewDB() (*estore.DB, error) {
	// Generate an encryption key. This is the key used for store encryption and decryption.
	storeEncKey := make([]byte, 32)
	_, err := rand.Read(storeEncKey)
	if err != nil {
		return nil, fmt.Errorf("generate store encryption key: %w", err)
	}

	// Seal the encryption key
	storeSealedKey, err := ecrypto.SealWithUniqueKey(storeEncKey, nil)
	if err != nil {
		return nil, fmt.Errorf("generate store sealed key: %w", err)
	}
	if err := os.Mkdir(dbPath, 0o700); err != nil {
		return nil, fmt.Errorf("create database path: %w", err)
	}
	if err := os.WriteFile(keyPath, storeSealedKey, 0o600); err != nil {
		return nil, fmt.Errorf("write store sealed key: %w", err)
	}

	// Create an encrypted store
	opts := &estore.Options{
		EncryptionKey: storeEncKey,
	}
	db, err := estore.Open(dbPath, opts)
	if err != nil {
		return nil, fmt.Errorf("open estore: %w", err)
	}

	return db, nil
}

func openExistingDB(sealedKey []byte) (*estore.DB, error) {
	storeEncKey, err := ecrypto.Unseal(sealedKey, nil)
	if err != nil {
		return nil, fmt.Errorf("unseal store encryption key: %w", err)
	}
	opts := &estore.Options{
		EncryptionKey: storeEncKey,
	}
	db, err := estore.Open(dbPath, opts)
	if err != nil {
		return nil, fmt.Errorf("open estore: %w", err)
	}
	return db, nil
}
