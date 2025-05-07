package main

import (
	"oracle/contract"
	"oracle/external"
)

type Config struct {
	External external.Config `json:"external" mapstructure:"external"`
	Contract contract.Config `json:"contract" mapstructure:"contract"`
}

// DefaultConfig returns a Config with default values
func DefaultConfig() Config {
	return Config{
		External: external.DefaultConfig(),
		Contract: contract.DefaultConfig(),
	}
}
