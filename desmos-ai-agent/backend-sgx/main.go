package main

import (
	"context"
	"fmt"
	"log"

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

	openAIKey := make(chan string)
	defer close(openAIKey)

	go RunServer(ctx, cmdCtx.Logger, openAIKey)

	aiOracle, err := contract.NewAIOracleClient(
		ctx,
		cmdCtx.Logger.With("module", "contract"),
		cmdCtx.Config.Contract,
	)
	if err != nil {
		return fmt.Errorf("new AI oracle client: %w", err)
	}

	estore, err := repository.NewEStore()
	if err != nil {
		return fmt.Errorf("new estore: %w", err)
	}

	openAI, err := external.NewOpenAIClient(
		cmdCtx.Logger.With("module", "openAI"),
		cmdCtx.Config.External,
		openAIKey,
	)
	if err != nil {
		return fmt.Errorf("new openAI client: %w", err)
	}

	cmdCtx.Logger.Info("Starting Oracle")

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
