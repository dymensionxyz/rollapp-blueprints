package main

import (
	"context"
	"fmt"
	"log"

	"github.com/edgelesssys/ego/enclave"
	"oracle/agent"
	"oracle/contract"
	"oracle/external"
	"oracle/repository"
)

func f() error {
	cmdCtx, err := InitContext()
	if err != nil {
		return fmt.Errorf("init command context: %w", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	openAI := external.NewOpenAIClient(
		cmdCtx.Logger.With("module", "openAI"),
		cmdCtx.Config.External,
	)

	aiOracle, err := contract.NewAIOracleClient(
		ctx,
		cmdCtx.Logger.With("module", "contract"),
		cmdCtx.Config.Contract,
	)
	if err != nil {
		return fmt.Errorf("new AI oracle client: %w", err)
	}

	estore, err := repository.NewEStore(cmdCtx.Logger.With("module", "estore"))
	if err != nil {
		return fmt.Errorf("new estore: %w", err)
	}

	sealKey, _, err := enclave.GetUniqueSealKey()
	if err != nil {
		return fmt.Errorf("get unique seal key: %w", err)
	}
	sealKeyID, err := enclave.GetSealKeyID()
	if err != nil {
		return fmt.Errorf("get seal key id: %w", err)
	}
	productSealKey, _, err := enclave.GetProductSealKey()
	if err != nil {
		return fmt.Errorf("get product seal key: %w", err)
	}
	cmdCtx.Logger.
		With("seal_key", sealKey, "seal_key_id", sealKeyID, "product_seal_key", productSealKey).
		Info("Starting Oracle")

	aiAgent := agent.NewAgent(cmdCtx.Logger, aiOracle, openAI, estore)
	aiAgent.Run(ctx)

	return nil
}

func main() {
	err := f()
	if err != nil {
		log.Fatalf("init command context: %v", err)
		return
	}
}
