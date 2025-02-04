package cmd

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/spf13/cobra"

	"randomnessgenerator/agent/agent"
	"randomnessgenerator/agent/contract"
	"randomnessgenerator/agent/external"
	"randomnessgenerator/agent/repository"
)

const (
	configFileName = "config"
	configFileExt  = "json"
	configFile     = configFileName + "." + configFileExt
)

var DefaultAppDir = ".rollapp-agent"

// RootCmd builds commands for the CLI
func RootCmd() (*cobra.Command, error) {
	cmd := &cobra.Command{}
	cmd.AddCommand(
		InitCmd(),
		StartCmd(),
	)
	return cmd, nil
}

func InitCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "init",
		Short: "Init agent",
		RunE: func(cmd *cobra.Command, args []string) error {
			logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

			configPath, err := cmd.Flags().GetString("config-path")
			if err != nil {
				return fmt.Errorf("get config path flag: %w", err)
			}

			err = InitConfig(logger, configPath, configFile)
			if err != nil {
				return fmt.Errorf("can't init observer config: %w", err)
			}

			return nil
		},
	}

	err := addConfigFlags(cmd)
	if err != nil {
		panic(err)
	}

	return cmd
}

func StartCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "start",
		Short: "Start agent",
		RunE: func(cmd *cobra.Command, args []string) error {
			configPath, err := cmd.Flags().GetString("config-path")
			if err != nil {
				return fmt.Errorf("get config path flag: %w", err)
			}

			cmdCtx, err := InitContext(configPath)
			if err != nil {
				return fmt.Errorf("init command context: %w", err)
			}

			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()

			rngService := external.NewRNGServiceClient(cmdCtx.Logger, cmdCtx.Config.External)

			rng, err := contract.NewRNGClient(ctx, cmdCtx.Logger, cmdCtx.Config.Contract)
			if err != nil {
				return fmt.Errorf("new RNG oracle client: %w", err)
			}

			levelDB, err := repository.NewLevelDB(cmdCtx.Config.DB.DBPath)
			if err != nil {
				return fmt.Errorf("new levelDB: %w", err)
			}

			rngAgent := agent.NewAgent(
				cmdCtx.Logger,
				cmdCtx.Config.Agent.HTTPServerAddress,
				rng,
				rngService,
				levelDB,
			)

			go rngAgent.Run(ctx)

			cmdCtx.Logger.Info("Agent started")

			stop := make(chan os.Signal, 1)
			signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
			<-stop

			cancel()
			_ = rngAgent.Close()

			cmdCtx.Logger.Info("Agent stopped")

			return nil
		},
	}

	err := addConfigFlags(cmd)
	if err != nil {
		panic(err)
	}

	return cmd
}

func addConfigFlags(cmd *cobra.Command) error {
	defaultConfigPath, err := GetHomeDir()
	if err != nil {
		return fmt.Errorf("get default config path: %w", err)
	}

	cmd.Flags().StringP("config-path", "", filepath.Join(defaultConfigPath, configFile), "config file")

	return nil
}
