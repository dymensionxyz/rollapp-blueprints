package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/ethereum/go-ethereum/common"
	tmlog "github.com/tendermint/tendermint/libs/log"
)

type IndexerConfig struct {
	ContractAddress string
	NodeEvmRpcUrl   string
	NodeRpcUrl      string
	WSEndpoint      string
}

func DefaultConfig() IndexerConfig {
	return IndexerConfig{
		ContractAddress: "0xEAcA423bF35A0C41d80d37Dc89C87C47baceE4FF",
		NodeEvmRpcUrl:   "http://0.0.0.0:8545",
		NodeRpcUrl:      "http://127.0.0.1:26657",
		WSEndpoint:      "/websocket",
	}
}

func main() {
	var (
		logger       = tmlog.NewTMLogger(tmlog.NewSyncWriter(os.Stdout))
		config       = DefaultConfig()
		contractAddr = common.HexToAddress(config.ContractAddress)
		ctx, cancel  = context.WithCancel(context.Background())
	)

	contract, err := ConnectContract(config.NodeEvmRpcUrl, contractAddr)
	if err != nil {
		logger.Error("Failed to connect to contract", "error", err)
		return
	}

	watchFinished := make(chan struct{})
	go func() {
		err = WatchContractLogs(
			ctx,
			logger,
			config.NodeRpcUrl,
			config.WSEndpoint,
			contractAddr,
			HandleEventLog(logger, contract),
		)
		if err != nil {
			logger.Error("Failed to watch contract logs", "error", err)
		}
		watchFinished <- struct{}{}
	}()

	logger.Info("Indexer started")

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	// Stop the contract watcher
	cancel()

	// Wait until the contract watcher processes the last event
	<-watchFinished

	logger.Info("Indexer stopped")
}
