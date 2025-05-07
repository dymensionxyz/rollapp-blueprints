package external

import "time"

type Config struct {
	APIKey               string        `json:"open_ai_api_key_hash" mapstructure:"api_key"`
	BaseURL              string        `json:"open_ai_base_url" mapstructure:"base_url"`
	AssistantID          string        `json:"assistant_id" mapstructure:"assistant_id"`
	PollRetryCount       int           `json:"poll_retry_count" mapstructure:"poll_retry_count"`
	PollRetryWaitTime    time.Duration `json:"poll_retry_wait_time" mapstructure:"poll_retry_wait_time"`
	PollRetryMaxWaitTime time.Duration `json:"poll_retry_max_wait_time" mapstructure:"poll_retry_max_wait_time"`
}

func DefaultConfig() Config {
	return Config{
		APIKey:               "",
		BaseURL:              "https://api.openai.com",
		AssistantID:          "",
		PollRetryCount:       10,
		PollRetryWaitTime:    10 * time.Millisecond,
		PollRetryMaxWaitTime: 4 * time.Second,
	}
}
