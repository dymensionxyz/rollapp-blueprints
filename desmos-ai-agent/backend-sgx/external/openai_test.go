package external_test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"oracle/config"
	"oracle/external"
)

func TestOpenAIClient_SubmitPrompt(t *testing.T) {
	t.Skip("provide your OpenAI API key to run this test")

	apiKey := "put your OpenAI API key here"
	baseUrl := "https://api.openai.com"

	client := external.NewOpenAIClient(nil, config.OpenAIConfig{
		APIKey:               apiKey,
		BaseURL:              baseUrl,
		PollRetryCount:       10,
		PollRetryWaitTime:    100 * time.Millisecond,
		PollRetryMaxWaitTime: 4 * time.Second,
	})

	tests := []struct {
		name     string
		prompt   string
		promptID uint64
	}{
		{
			name:     "Valid prompt",
			prompt:   "Generate a random number between 1 and 100",
			promptID: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := client.SubmitPrompt(context.Background(), tt.promptID, []string{tt.prompt})

			t.Logf("result: %+v\n", result)

			require.NoError(t, err)
			require.NotEmpty(t, result.Answer)
			require.NotEmpty(t, result.MessageID)
			require.NotEmpty(t, result.ThreadID)
			require.NotEmpty(t, result.RunID)
			require.NotEmpty(t, result.AssistantID)
		})
	}
}
