package keys

import (
	"errors"
	"fmt"
	"os"

	"github.com/edgelesssys/ego/ecrypto"
)

const AppdataDir = "appdata"

func OpenCreateData(dataFileName string, generateFn func() ([]byte, error)) ([]byte, error) {
	data, err := OpenData(dataFileName)
	if err == nil {
		return data, nil
	}
	if !errors.Is(err, os.ErrNotExist) {
		return nil, fmt.Errorf("open key: %w", err)
	}
	// Here the data does not exist,

	data, err = CreateData(dataFileName, generateFn)
	if err != nil {
		return nil, fmt.Errorf("create data: %w", err)
	}
	return data, nil
}

func CreateData(keyFileName string, generateFn func() ([]byte, error)) ([]byte, error) {
	data, err := generateFn()
	if err != nil {
		return nil, fmt.Errorf("generate data: %w", err)
	}
	sealedKey, err := ecrypto.SealWithUniqueKey(data, nil)
	if err != nil {
		return nil, fmt.Errorf("create new signing key: %w", err)
	}
	err = os.WriteFile(keyFileName, sealedKey, 0o600)
	if err != nil {
		return nil, fmt.Errorf("write new signing key: %w", err)
	}
	return data, nil
}

func OpenData(keyFileName string) ([]byte, error) {
	sealedKey, err := os.ReadFile(keyFileName)
	if err != nil {
		return nil, fmt.Errorf("open key file: %w", err)
	}
	unsealed, err := ecrypto.Unseal(sealedKey, nil)
	if err != nil {
		return nil, fmt.Errorf("unseal key: %w", err)
	}
	return unsealed, nil
}
