package contract

import (
	"math/big"
	"time"
)

type Config struct {
	PollInterval    time.Duration `json:"poll_interval" mapstructure:"poll_interval"`
	NodeURL         string        `json:"node_url" mapstructure:"node_url"`
	ContractAddress string        `json:"contract_address" mapstructure:"contract_address"`
	GasLimit        uint64        `json:"gas_limit" mapstructure:"gas_limit"`
	GasFeeCap       *big.Int      `json:"gas_fee_cap" mapstructure:"gas_fee_cap"`
	GasTipCap       *big.Int      `json:"gas_tip_cap" mapstructure:"gas_tip_cap"`
}

func DefaultConfig() Config {
	return Config{
		PollInterval:    10 * time.Second,
		NodeURL:         "http://127.0.0.1:8545",
		ContractAddress: "",
		GasLimit:        1e8,
		GasFeeCap:       big.NewInt(3e16),
		GasTipCap:       big.NewInt(1e13),
	}
}
