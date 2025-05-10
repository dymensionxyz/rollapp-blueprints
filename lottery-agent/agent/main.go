package main

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/tyler-smith/go-bip32"
	"github.com/tyler-smith/go-bip39"
	"log"
	"math/big"
	"strings"
	"time"
)

type LAClient struct {
	config      ContractConfig
	ethClient   *ethclient.Client
	contractAPI *LotteryAgent
	txAuth      *bind.TransactOpts
}

type ContractConfig struct {
	NodeURL         string   `json:"node_url" mapstructure:"node_url"`
	Mnemonic        string   `json:"mnemonic" mapstructure:"mnemonic"`
	ContractAddress string   `json:"contract_address" mapstructure:"contract_address"`
	DerivationPath  string   `json:"derivation_path" mapstructure:"derivation_path"`
	GasLimit        uint64   `json:"gas_limit" mapstructure:"gas_limit"`
	GasFeeCap       *big.Int `json:"gas_fee_cap" mapstructure:"gas_fee_cap"`
	GasTipCap       *big.Int `json:"gas_tip_cap" mapstructure:"gas_tip_cap"`
}

func NewLAClient(ctx context.Context, config ContractConfig) (*LAClient, error) {
	client, err := ethclient.Dial(config.NodeURL)
	if err != nil {
		return nil, fmt.Errorf("eth client dial: %w", err)
	}

	contractAddress := common.HexToAddress(config.ContractAddress)

	contract, err := NewLotteryAgent(contractAddress, client)
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

	priKey, _, err := derivePrivateKey(config.Mnemonic, config.DerivationPath)
	if err != nil {
		return nil, fmt.Errorf("derive private key: %w", err)
	}

	auth, err := createTransactor(ctx, client, priKey, config)
	if err != nil {
		return nil, fmt.Errorf("create transactor: %w", err)
	}

	return &LAClient{
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
func createTransactor(ctx context.Context, client *ethclient.Client, privateKey *ecdsa.PrivateKey, config ContractConfig) (*bind.TransactOpts, error) {
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

// derivePrivateKey derives the ECDSA private key and returns the key along with the address
func derivePrivateKey(mnemonic, derivationPath string) (*ecdsa.PrivateKey, common.Address, error) {
	seed := bip39.NewSeed(mnemonic, "") // No passphrase
	masterKey, err := bip32.NewMasterKey(seed)
	if err != nil {
		return nil, common.Address{}, fmt.Errorf("new master key: %w", err)
	}

	childKey, err := deriveKey(masterKey, derivationPath)
	if err != nil {
		return nil, common.Address{}, fmt.Errorf("derive key from master key and derivatoin path: %w", err)
	}

	privateKeyECDSA, err := crypto.ToECDSA(childKey.Key)
	if err != nil {
		return nil, common.Address{}, fmt.Errorf("bytes to ECDSA: %w", err)
	}

	publicKey := privateKeyECDSA.Public().(*ecdsa.PublicKey)
	fromAddress := crypto.PubkeyToAddress(*publicKey)

	return privateKeyECDSA, fromAddress, nil
}

// deriveKey derives a private key using a BIP32 derivation path
func deriveKey(master *bip32.Key, path string) (*bip32.Key, error) {
	parts := strings.Split(path, "/")
	key := master
	for _, p := range parts[1:] { // Skip the 'm'
		hardened := false
		if strings.HasSuffix(p, "'") {
			hardened = true
			p = strings.TrimSuffix(p, "'")
		}
		index := 0
		_, err := fmt.Sscanf(p, "%d", &index)
		if err != nil {
			return nil, fmt.Errorf("invalid path element %s: %v", p, err)
		}

		if hardened {
			key, err = key.NewChildKey(uint32(index) + bip32.FirstHardenedChild)
		} else {
			key, err = key.NewChildKey(uint32(index))
		}
		if err != nil {
			return nil, fmt.Errorf("failed to derive key at index %d: %v", index, err)
		}
	}
	return key, nil
}

func (a *LAClient) waitForTransaction(ctx context.Context, tx *types.Transaction) error {
	receipt, err := bind.WaitMined(ctx, a.ethClient, tx)
	if err != nil {
		return fmt.Errorf("error waiting for transaction confirmation: %w", err)
	}

	if receipt.Status == 1 {
		return nil
	}

	revertReason, err := a.getRevertReason(ctx, tx, receipt)
	if err != nil {
		return fmt.Errorf("error getting revert reason: %w", err)
	}

	return fmt.Errorf("tx reverted: hash: %s, reason: %s", tx.Hash().String(), revertReason)
}

func (a *LAClient) getRevertReason(ctx context.Context, tx *types.Transaction, receipt *types.Receipt) (string, error) {
	msg := ethereum.CallMsg{
		To:   tx.To(),
		Data: tx.Data(),
	}

	res, err := a.ethClient.CallContract(ctx, msg, receipt.BlockNumber)
	if err != nil {
		return "", fmt.Errorf("call contract: %w", err)
	}

	if len(res) < 4 {
		return "", fmt.Errorf("no revert reason found")
	}

	const errorMethodID = "0x08c379a0"
	if fmt.Sprintf("0x%x", res[:4]) != errorMethodID {
		return "", fmt.Errorf("no revert reason found")
	}

	abiError, err := abi.JSON(strings.NewReader(`[{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"Error","type":"function"}]`))
	if err != nil {
		return "", fmt.Errorf("parse revert reason ABI: %w", err)
	}

	var errorMsg string
	err = abiError.UnpackIntoInterface(&errorMsg, "Error", res[4:])
	if err != nil {
		return "", fmt.Errorf("unpack revert reason: %w", err)
	}

	return errorMsg, nil
}

func main() {
	config := ContractConfig{
		NodeURL:         "https://json-rpc.ra-2.rollapp.network",
		Mnemonic:        "chalk excess welcome pool sea session pencil health region lamp library today",
		ContractAddress: "0xAEb1cc59bD804DD3ADA20C405e61B4E05e908874",
		DerivationPath:  "m/44'/60'/0'/0/0",
		GasLimit:        50000000,
		GasFeeCap:       big.NewInt(30000000000),
		GasTipCap:       big.NewInt(10000000),
	}

	la, err := NewLAClient(context.Background(), config)
	if err != nil {
		log.Fatalf("error creating la client: %s", err.Error())
	}

	_, err = la.contractAPI.AllRandomnessPostedForCurDraw(nil)
	shouldCallPrepareFinalizeDraw := err != nil

	for {
		if shouldCallPrepareFinalizeDraw {
			tx, err := la.contractAPI.PrepareFinalizeDraw(la.txAuth)
			if err != nil {
				log.Printf("error calling PrepareFinalizeDraw: %s", err.Error())
				time.Sleep(10 * time.Minute) // Ждем перед повторной попыткой
				continue
			}

			err = la.waitForTransaction(context.Background(), tx)
			if err != nil {
				log.Printf("error waiting for PrepareFinalizeDraw transaction: %s", err.Error())
				time.Sleep(10 * time.Minute) // Ждем перед повторной попыткой
				continue
			}

			log.Println("PrepareFinalizeDraw transaction confirmed")
			shouldCallPrepareFinalizeDraw = false
		} else {
			allPosted, err := la.contractAPI.AllRandomnessPostedForCurDraw(nil)
			if err != nil {
				log.Printf("error calling AllRandomnessPostedForCurDraw: %s", err.Error())
				time.Sleep(30 * time.Second)
				continue
			}

			if allPosted {
				tx, err := la.contractAPI.FinalizeDraw(la.txAuth)
				if err != nil {
					log.Printf("error calling FinalizeDraw: %s", err.Error())
					time.Sleep(30 * time.Second)
					continue
				}

				err = la.waitForTransaction(context.Background(), tx)
				if err != nil {
					log.Printf("error waiting for FinalizeDraw transaction: %s", err.Error())
					time.Sleep(30 * time.Second)
					continue
				}

				log.Println("FinalizeDraw transaction confirmed")
				shouldCallPrepareFinalizeDraw = true
			} else {
				log.Println("AllRandomnessPostedForCurDraw returned false, waiting...")
				time.Sleep(30 * time.Second)
			}
		}
	}
}
