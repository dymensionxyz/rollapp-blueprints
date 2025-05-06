package external

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log/slog"
	"path/filepath"

	"github.com/go-resty/resty/v2"
	"oracle/keys"
)

const openAIKeyFile = "/open_ai_key"

type OpenAIClient struct {
	logger *slog.Logger
	http   *resty.Client
	config Config
}

// NewOpenAIClient creates and returns a new instance of OpenAIClient.
func NewOpenAIClient(logger *slog.Logger, config Config, openAIKey <-chan string) (*OpenAIClient, error) {
	key, err := keys.OpenCreateData(filepath.Join(keys.AppdataDir, openAIKeyFile), func() ([]byte, error) {
		logger.Info("Waiting for OpenAI API key injection...")
		key := <-openAIKey

		hash := sha256.Sum256([]byte(key))
		hexHash := hex.EncodeToString(hash[:])

		if hexHash != config.APIKey {
			return nil, fmt.Errorf("injected OpenAI API key does not match hash from config")
		}
		return []byte(key), nil
	})
	if err != nil {
		return nil, fmt.Errorf("seal OpenAI API key: %w", err)
	}

	return &OpenAIClient{
		logger: logger,
		http: resty.New().
			SetBaseURL(config.BaseURL).
			SetAuthToken(string(key)).
			SetAuthScheme("Bearer").
			SetHeader("Content-Type", "application/json").
			SetHeader("OpenAI-Beta", "assistants=v2"),
		config: config,
	}, nil
}

type SubmitPromptResponse struct {
	Answer      string
	MessageID   string
	ThreadID    string
	RunID       string
	AssistantID string
}

func (SubmitPromptResponse) IsResponse() {}

// SubmitPrompt sends a prompt to the OpenAI API.
func (c *OpenAIClient) SubmitPrompt(ctx context.Context, promptID uint64, prompt []string) (SubmitPromptResponse, error) {
	run, err := c.CreateThreadAndRunMessage(ctx, "user", prompt, promptID)
	if err != nil {
		return SubmitPromptResponse{}, fmt.Errorf("create run: %w", err)
	}

	_, err = c.PollRunResult(ctx, run.ThreadId, run.Id)
	if err != nil {
		return SubmitPromptResponse{}, fmt.Errorf("poll run result: thread ID: %s: run ID: %s: %w", run.ThreadId, run.Id, err)
	}

	msgs, err := c.ListMessagesByRun(ctx, run.ThreadId, run.Id)
	if err != nil {
		return SubmitPromptResponse{}, fmt.Errorf("list messages by run: thread ID: %s: run ID: %s: %w", run.ThreadId, run.Id, err)
	}

	if len(msgs.Data) != 1 {
		return SubmitPromptResponse{}, fmt.Errorf("expected 1 message from AI in a single run, got %d: thread ID: %s: run ID %s", len(msgs.Data), run.ThreadId, run.Id)
	}

	if len(msgs.Data[0].Content) != 1 {
		return SubmitPromptResponse{}, fmt.Errorf("expected 1 answer from AI in a single message, got %d: thread ID: %s: run ID %s: message ID %s", len(msgs.Data), run.ThreadId, run.Id, msgs.Data[0].Id)
	}

	return SubmitPromptResponse{
		Answer:      msgs.Data[0].Content[0].Text.Value,
		MessageID:   msgs.Data[0].Id,
		ThreadID:    msgs.Data[0].ThreadId,
		RunID:       msgs.Data[0].RunId,
		AssistantID: msgs.Data[0].AssistantId,
	}, nil
}
