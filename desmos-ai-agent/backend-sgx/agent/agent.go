package agent

import (
	"context"
	"fmt"
	"log/slog"
	"math/rand/v2"
	"sync"
	"time"

	"oracle/contract"
	"oracle/external"
	"oracle/repository"
)

type Agent struct {
	logger *slog.Logger

	contract *contract.AIOracleClient
	external *external.OpenAIClient
	repo     *repository.DB
}

func NewAgent(
	logger *slog.Logger,
	contract *contract.AIOracleClient,
	external *external.OpenAIClient,
	repo *repository.DB,
) *Agent {
	return &Agent{
		logger:   logger,
		contract: contract,
		external: external,
		repo:     repo,
	}
}

func (a *Agent) Run(ctx context.Context) {
	a.contract.ListenSmartContractEvents(ctx, a.handleEvents)
}

func (a *Agent) handleEvents(ctx context.Context, ps []contract.AIOracleUnprocessedPrompt) {
	if len(ps) != 0 {
		a.logger.Info("Got unprocessed prompts", "count", len(ps), "prompts", ps)
	}
	// We don't care about batching. We can process each event individually.
	// If there are any errors, we will skip the event and try processing it on the next poll.
	var wg sync.WaitGroup
	wg.Add(len(ps))
	for _, p := range ps {
		// TODO: Implement rate limiting
		// TODO: Make configurable
		time.Sleep(500 * time.Millisecond) // Sleep for 500ms to avoid rate limiting

		// OpenAI calls may be time-consuming, so we process them concurrently.
		go func() {
			defer wg.Done()

			// TODO: remove this hack and make the solution more generic

			// The last element is always a "generate number" prompt.
			// If there are two element, then the first one is the user's message.
			// We modify it in a different way:
			// - The first message is always a random number from 1 to 10.
			// - The second message is the user's message if any.

			/*** Hack start ***/

			if len(p.Prompt) < 1 {
				panic("prompt is empty")
			}

			if 2 < len(p.Prompt) {
				panic("prompt is too long")
			}

			if len(p.Prompt) == 2 {
				p.Prompt[0], p.Prompt[1] = p.Prompt[1], p.Prompt[0]
			}

			p.Prompt[0] = fmt.Sprintf("%d", rand.UintN(10)+1)

			/*** Hack end ***/

			a.logger.Info("Processing prompt", "promptId", p.PromptId, "prompt", p.Prompt)
			// External query is not a stateful operation, it can fail without side effects.
			r, err := a.external.SubmitPrompt(ctx, p.PromptId, p.Prompt)
			if err != nil {
				a.logger.With("error", err, "promptId", p.PromptId).
					Error("Error on submitting prompt to AI")
				return
			}

			a.logger.Info("Got prompt answer", "promptId", p.PromptId, "answer", r.Answer)
			// Committing the result is a stateful operation. If it fails, we do not want to
			// save the result to the repository. Contract should ensure that commit is atomic.
			tx, err := a.contract.SubmitAnswer(ctx, p.PromptId, r.Answer)
			if err != nil {
				a.logger.With("error", err, "promptId", p.PromptId).
					Info("Error on submitting answer to contract")
				return
			}

			a.logger.Info("Answer committed to contract", "promptId", p.PromptId, "answer", r.Answer, "txHash", tx.Hash().String())
			// It's not a big deal if we fail to save the response. At this point, the result
			// is already committed to the contract, so this event will not be processed again.
			err = a.repo.Save(p.PromptId, repository.Answer{
				Answer:      r.Answer,
				MessageID:   r.MessageID,
				ThreadID:    r.ThreadID,
				RunID:       r.RunID,
				AssistantID: r.AssistantID,
			})
			if err != nil {
				a.logger.With("error", err, "promptId", p.PromptId).
					Info("Error on saving response to DB")
				return
			}
			a.logger.Info("Answer stored in database", "promptId", p.PromptId)
		}()
	}
	wg.Wait()
}
