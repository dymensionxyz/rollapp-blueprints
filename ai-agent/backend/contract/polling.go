package contract

import (
	"context"
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/core/types"
)

type EventHandler func(context.Context, []AIOracleUnprocessedPrompt)

func (a *AIOracleClient) ListenSmartContractEvents(ctx context.Context, eh EventHandler) {
	ticker := time.NewTicker(a.config.PollInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			a.logger.With("error", ctx.Err()).
				Info("Context done, exiting event loop")
			return

		case <-ticker.C:
			p, err := a.contractAPI.GetUnprocessedPrompts(&bind.CallOpts{Context: ctx})
			if err != nil {
				a.logger.Error("Error polling events from contract", "error", err)
				continue
			}

			eh(ctx, p)
		}
	}
}

func (a *AIOracleClient) SubmitAnswer(ctx context.Context, promptID uint64, answer string) error {
	tx, err := a.contractAPI.SubmitAnswer(a.txAuth, promptID, answer)
	if err != nil {
		return fmt.Errorf("submit answer: %w", err)
	}
	err = a.waitForTransaction(ctx, tx)
	if err != nil {
		return fmt.Errorf("wait for transaction: %w", err)
	}
	return nil
}

func (a *AIOracleClient) waitForTransaction(ctx context.Context, tx *types.Transaction) error {
	receipt, err := bind.WaitMined(ctx, a.ethClient, tx)
	if err != nil {
		return fmt.Errorf("wait minted: %w", err)
	}

	if receipt.Status == 1 {
		return nil
	}

	return fmt.Errorf("tx reverted: hash: %s, status: %d", tx.Hash().String(), receipt.Status)
}
