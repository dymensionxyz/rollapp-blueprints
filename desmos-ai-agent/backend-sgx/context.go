package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"

	"oracle/config"
)

const (
	configFileName = "config"
	configFileExt  = "json"
	configFile     = configFileName + "." + configFileExt
)

type Context struct {
	Logger *slog.Logger
	Config config.Config
}

// InitContext initializes Context from config file and cmd flags
func InitContext() (Context, error) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := GetConfig(configFile)
	if err != nil {
		return Context{}, fmt.Errorf("can't get observer config: %w", err)
	}

	return Context{
		Logger: logger,
		Config: cfg,
	}, nil
}

func GetConfig(configPath string) (config.Config, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return config.Config{}, fmt.Errorf("read file: %w", err)
	}

	var cfg config.Config
	err = json.Unmarshal(data, &cfg)
	if err != nil {
		return config.Config{}, fmt.Errorf("unmarshal config: %w", err)
	}

	return cfg, nil
}
