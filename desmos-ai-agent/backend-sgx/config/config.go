package config

import (
	"math/big"
	"time"
)

type Config struct {
	External OpenAIConfig   `json:"external" mapstructure:"external"`
	Agent    AgentConfig    `json:"agent" mapstructure:"agent"`
	Contract ContractConfig `json:"contract" mapstructure:"contract"`
}

type OpenAIConfig struct {
	APIKey               string        `json:"open_ai_api_key" mapstructure:"api_key"`
	BaseURL              string        `json:"open_ai_base_url" mapstructure:"base_url"`
	PollRetryCount       int           `json:"poll_retry_count" mapstructure:"poll_retry_count"`
	PollRetryWaitTime    time.Duration `json:"poll_retry_wait_time" mapstructure:"poll_retry_wait_time"`
	PollRetryMaxWaitTime time.Duration `json:"poll_retry_max_wait_time" mapstructure:"poll_retry_max_wait_time"`
}

func DefaultOpenAIConfig() OpenAIConfig {
	return OpenAIConfig{
		APIKey:               "",
		BaseURL:              "https://api.openai.com",
		PollRetryCount:       10,
		PollRetryWaitTime:    10 * time.Millisecond,
		PollRetryMaxWaitTime: 4 * time.Second,
	}
}

type AgentConfig struct {
	HTTPServerAddress string `json:"http_server_address" mapstructure:"http_server_address"`
}

func DefaultAgentConfig() AgentConfig {
	return AgentConfig{
		HTTPServerAddress: ":8080",
	}
}

type ContractConfig struct {
	PollInterval    time.Duration `json:"poll_interval" mapstructure:"poll_interval"`
	NodeURL         string        `json:"node_url" mapstructure:"node_url"`
	ContractAddress string        `json:"contract_address" mapstructure:"contract_address"`
	GasLimit        uint64        `json:"gas_limit" mapstructure:"gas_limit"`
	GasFeeCap       *big.Int      `json:"gas_fee_cap" mapstructure:"gas_fee_cap"`
	GasTipCap       *big.Int      `json:"gas_tip_cap" mapstructure:"gas_tip_cap"`
}

func DefaultContractConfig() ContractConfig {
	return ContractConfig{
		PollInterval:    10 * time.Second,
		NodeURL:         "http://127.0.0.1:8545",
		ContractAddress: "",
		GasLimit:        1e8,
		GasFeeCap:       big.NewInt(3e16),
		GasTipCap:       big.NewInt(1e13),
	}
}

// DefaultConfig returns a Config with default values
func DefaultConfig() Config {
	return Config{
		External: DefaultOpenAIConfig(),
		Agent:    DefaultAgentConfig(),
		Contract: DefaultContractConfig(),
	}
}
