package main

import (
	"context"
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	rpcfilters "github.com/evmos/evmos/v12/rpc/namespaces/ethereum/eth/filters"
	evmtypes "github.com/evmos/evmos/v12/x/evm/types"
	tmjson "github.com/tendermint/tendermint/libs/json"
	tmlog "github.com/tendermint/tendermint/libs/log"
	coretypes "github.com/tendermint/tendermint/rpc/core/types"
	rpcclient "github.com/tendermint/tendermint/rpc/jsonrpc/client"
	tmtypes "github.com/tendermint/tendermint/types"
)

func ConnectContract(nodeURL string, contractAddr common.Address) (*AIGambling, error) {
	client, err := ethclient.Dial(nodeURL)
	if err != nil {
		return nil, fmt.Errorf("eth client dial: %w", err)
	}

	contract, err := NewAIGambling(contractAddr, client)
	if err != nil {
		return nil, fmt.Errorf("can't use rng smart-contract API: %w", err)
	}

	return contract, nil
}

func WatchContractLogs(
	ctx context.Context,
	logger tmlog.Logger,
	tmRPCAddr, tmEndpoint string,
	contractAddr common.Address,
	logCallback func(types.Log) error,
) error {
	reconnectCh := make(chan struct{})
	ws, err := rpcclient.NewWS(tmRPCAddr, tmEndpoint,
		rpcclient.MaxReconnectAttempts(256),
		rpcclient.ReadWait(120*time.Second),
		rpcclient.WriteWait(120*time.Second),
		rpcclient.PingPeriod(50*time.Second),
		rpcclient.OnReconnect(func() {
			reconnectCh <- struct{}{}
		}),
	)
	if err != nil {
		return fmt.Errorf("tendermint WS client could not be created: %w", err)
	}
	defer ws.Stop()

	err = ws.OnStart()
	if err != nil {
		return fmt.Errorf("tendermint WS client could not start: %w", err)
	}

	err = ws.Subscribe(ctx, "tm.event='Tx' AND message.module='evm'")
	if err != nil {
		return fmt.Errorf("ws subscribe: %w", err)
	}

	for {
		select {
		case <-ctx.Done():
			return nil

		case <-reconnectCh:
			logger.Info("Reconnecting to WS")

			err = ws.UnsubscribeAll(ctx)
			if err != nil {
				return fmt.Errorf("ws unsubscribe all: %w", err)
			}

			err = ws.Subscribe(ctx, "tm.event='Tx' AND message.module='evm'")
			if err != nil {
				return fmt.Errorf("ws subscribe: %w", err)
			}

		case rpcResp := <-ws.ResponsesCh:
			var ev coretypes.ResultEvent

			if rpcResp.Error != nil {
				time.Sleep(5 * time.Second)
				continue
			}

			if err := tmjson.Unmarshal(rpcResp.Result, &ev); err != nil {
				logger.Error("failed to JSON unmarshal ResponsesCh result event", "error", err.Error())
				continue
			}

			if len(ev.Query) == 0 {
				// skip empty responses
				continue
			}

			dataTx, ok := ev.Data.(tmtypes.EventDataTx)
			if !ok {
				logger.Debug("event data type mismatch", "type", fmt.Sprintf("%T", ev.Data))
				continue
			}

			txResponse, err := evmtypes.DecodeTxResponse(dataTx.TxResult.Result.Data)
			if err != nil {
				logger.Error("failed to decode tx response", "error", err.Error())
				continue
			}

			addresses := []common.Address{contractAddr}
			logs := rpcfilters.FilterLogs(evmtypes.LogsToEthereum(txResponse.Logs), nil, nil, addresses, nil)
			if len(logs) == 0 {
				continue
			}

			for _, ethLog := range logs {
				logErr := logCallback(*ethLog)
				if logErr != nil {
					logger.Error("failed process eth log", "error", logErr.Error())
				}
			}
		}
	}
}

func HandleEventLog(logger tmlog.Logger, contract *AIGambling) func(types.Log) error {
	return func(log types.Log) error {
		betPlaced, err := contract.ParseBetPlaced(log)
		if err == nil {
			logger.Info("Got BetPlaced!", "event", betPlaced)
			return nil
		}

		betResolved, err := contract.ParseBetResolved(log)
		if err == nil {
			logger.Info("Got BetResolved!", "event", betResolved)
			return nil
		}

		return fmt.Errorf("unknown event log: %v", log)
	}
}
