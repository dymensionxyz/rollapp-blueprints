package contract

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log/slog"
	"path/filepath"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"oracle/keys"
)

const signingKeyFile = "/signing_key"

type AIOracleClient struct {
	logger *slog.Logger

	config      Config
	ethClient   *ethclient.Client
	contractAPI *AIOracle
	txAuth      *bind.TransactOpts
}

func NewAIOracleClient(ctx context.Context, logger *slog.Logger, config Config) (*AIOracleClient, error) {
	client, err := ethclient.Dial(config.NodeURL)
	if err != nil {
		return nil, fmt.Errorf("eth client dial: %w", err)
	}

	contractAddress := common.HexToAddress(config.ContractAddress)

	contract, err := NewAIOracle(contractAddress, client)
	if err != nil {
		return nil, fmt.Errorf("can't use rng smart-contract API: %w", err)
	}

	exists, err := contractExists(ctx, client, contractAddress)
	if err != nil {
		return nil, fmt.Errorf("contract exists: %w", err)
	}
	if !exists {
		return nil, fmt.Errorf("contract does not exist at address: %s", contractAddress.Hex())
	}

	rawPriKey, err := keys.OpenCreateData(filepath.Join(keys.AppdataDir, signingKeyFile), func() ([]byte, error) {
		priKey, err := crypto.GenerateKey()
		if err != nil {
			return nil, fmt.Errorf("generate private key: %w", err)
		}
		return crypto.FromECDSA(priKey), nil
	})
	if err != nil {
		return nil, fmt.Errorf("seal private key: %w", err)
	}
	priKey := crypto.ToECDSAUnsafe(rawPriKey)

	publicKey := priKey.Public().(*ecdsa.PublicKey)
	logger.Info("Signing key", "address", crypto.PubkeyToAddress(*publicKey).Hex())

	auth, err := createTransactor(ctx, client, priKey, config)
	if err != nil {
		return nil, fmt.Errorf("create transactor: %w", err)
	}

	return &AIOracleClient{
		logger:      logger,
		config:      config,
		ethClient:   client,
		contractAPI: contract,
		txAuth:      auth,
	}, nil
}

func contractExists(ctx context.Context, client *ethclient.Client, address common.Address) (bool, error) {
	code, err := client.CodeAt(ctx, address, nil)
	if err != nil {
		return false, fmt.Errorf("code at: %w", err)
	}
	return len(code) > 0, nil
}

// createTransactor creates a signed transactor for sending transactions
func createTransactor(ctx context.Context, client *ethclient.Client, privateKey *ecdsa.PrivateKey, config Config) (*bind.TransactOpts, error) {
	chainID, err := client.NetworkID(ctx)
	if err != nil {
		return nil, fmt.Errorf("get network ID: %w", err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return nil, fmt.Errorf("new keyed transactor with chain id %s: %w", chainID, err)
	}

	auth.GasLimit = config.GasLimit
	auth.GasFeeCap = config.GasFeeCap
	auth.GasTipCap = config.GasTipCap

	return auth, nil
}
