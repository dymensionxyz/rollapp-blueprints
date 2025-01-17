package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/common"
	rpcfilters "github.com/evmos/evmos/v12/rpc/namespaces/ethereum/eth/filters"
	evmtypes "github.com/evmos/evmos/v12/x/evm/types"
	tmjson "github.com/tendermint/tendermint/libs/json"
	tmlog "github.com/tendermint/tendermint/libs/log"
	coretypes "github.com/tendermint/tendermint/rpc/core/types"
	rpcclient "github.com/tendermint/tendermint/rpc/jsonrpc/client"
	tmtypes "github.com/tendermint/tendermint/types"
)

func ConnectTmWS(tmRPCAddr, tmEndpoint string, logger tmlog.Logger) *rpcclient.WSClient {
	tmWsClient, err := rpcclient.NewWS(tmRPCAddr, tmEndpoint,
		rpcclient.MaxReconnectAttempts(256),
		rpcclient.ReadWait(120*time.Second),
		rpcclient.WriteWait(120*time.Second),
		rpcclient.PingPeriod(50*time.Second),
		rpcclient.OnReconnect(func() {
			logger.Debug("EVM RPC reconnects to Tendermint WS", "address", tmRPCAddr+tmEndpoint)
		}),
	)

	if err != nil {
		logger.Error(
			"Tendermint WS client could not be created",
			"address", tmRPCAddr+tmEndpoint,
			"error", err,
		)
	} else if err := tmWsClient.OnStart(); err != nil {
		logger.Error(
			"Tendermint WS client could not start",
			"address", tmRPCAddr+tmEndpoint,
			"error", err,
		)
	}

	return tmWsClient
}

func main() {
	logger := tmlog.NewTMLogger(tmlog.NewSyncWriter(os.Stdout))
	ws := ConnectTmWS("http://127.0.0.1:26657", "/websocket", logger)
	defer ws.Stop()

	err := ws.Subscribe(context.Background(), "tm.event='Tx' AND message.module='evm'")
	if err != nil {
		logger.Error("Failed to subscribe", "error", err)
		return
	}

	for rpcResp := range ws.ResponsesCh {
		var ev coretypes.ResultEvent

		if rpcResp.Error != nil {
			time.Sleep(5 * time.Second)
			continue
		} else if err := tmjson.Unmarshal(rpcResp.Result, &ev); err != nil {
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
			return
		}

		addresses := []common.Address{common.HexToAddress("0xADD60403BFc7e76C0670E835cAEb606569bc9ddE")}
		logs := rpcfilters.FilterLogs(evmtypes.LogsToEthereum(txResponse.Logs), nil, nil, addresses, nil)
		if len(logs) == 0 {
			continue
		}

		for _, ethLog := range logs {
			logger.Info("EVM Log", "log", ethLog)

			event := new(AIGamblingBetPlaced)
			if err := _AIGambling.contract.UnpackLog(event, "BetPlaced", log); err != nil {
				return err
			}
		}
	}
}
