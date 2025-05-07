package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	"oracle/keys"
	"oracle/repository"
)

const configFile = "config.json"

type Context struct {
	Logger *slog.Logger
	Config Config
}

// InitContext initializes Context from config file and cmd flags
func InitContext() (Context, error) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := GetConfig(configFile)
	if err != nil {
		return Context{}, fmt.Errorf("can't get observer config: %w", err)
	}

	// Create a directory for keys and database
	err = os.MkdirAll(filepath.Join(keys.AppdataDir, repository.DBDir), 0o700)
	if err != nil {
		return Context{}, fmt.Errorf("create database dir: %w", err)
	}

	return Context{
		Logger: logger,
		Config: cfg,
	}, nil
}

func GetConfig(configPath string) (Config, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return Config{}, fmt.Errorf("read file: %w", err)
	}

	var cfg Config
	err = json.Unmarshal(data, &cfg)
	if err != nil {
		return Config{}, fmt.Errorf("unmarshal config: %w", err)
	}

	return cfg, nil
}
