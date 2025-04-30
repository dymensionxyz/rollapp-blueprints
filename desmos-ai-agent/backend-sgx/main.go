package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/edgelesssys/estore"
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

	levelDB, err := repository.NewLevelDB(cmdCtx.Config.DB.DBPath)
	if err != nil {
		return fmt.Errorf("new levelDB: %w", err)
	}

	cmdCtx.Logger.Info("Starting Oracle")

	aiAgent := agent.NewAgent(cmdCtx.Logger, aiOracle, openAI, levelDB)
	aiAgent.Run(ctx)

	return nil
}

func main() {
	var db *estore.DB
	sealedKey, err := os.ReadFile(keyFile)
	if err == nil {
		fmt.Println("Found existing DB")
		db, err = openExistingDB(sealedKey)
	} else if errors.Is(err, os.ErrNotExist) {
		fmt.Println("Creating new DB")
		db, err = createNewDB()
	}
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Get the value of the key
	value, closer, err := db.Get([]byte("hello"))
	if err != nil {
		log.Fatal(err)
	}
	defer closer.Close()
	fmt.Printf("hello=%s\n", value)

	err = f()
	if err != nil {
		log.Fatalf("init command context: %v", err)
		return
	}
}
