#!/bin/bash

# Function to kill background processes
cleanup() {
  echo "Cleaning up..."
  if [ -n "$AGENT_PID" ]; then
    kill $AGENT_PID 2>/dev/null
    echo "Agent-binary process killed."
  fi
  if [ -n "$RANDOMSERVICE_PID" ]; then
    kill $RANDOMSERVICE_PID 2>/dev/null
    echo "Randomservice-binary process killed."
  fi
  exit 0
}

# Trap Ctrl+C (SIGINT) and call cleanup
trap cleanup SIGINT

cd ./backend || { echo "Directory 'backend' not found"; exit 1; }

echo "Building agent-binary..."
go build -o bin/agent-binary ./agent/main.go
if [ $? -ne 0 ]; then
  echo "Failed to build agent-binary"
  exit 1
fi

echo "Initing agent-binary..."
bin/agent-binary init
if [ $? -ne 0 ]; then
  echo "Failed to init agent-binary"
  exit 1
fi

echo "Copying agent config..."
cp ../agent_config.json ~/.rollapp-agent/config/config.json
if [ $? -ne 0 ]; then
  echo "Failed to copy config"
  exit 1
fi

echo "Building randomservice-binary..."
go build -o bin/randomservice-binary ./randomservice/main.go
if [ $? -ne 0 ]; then
  echo "Failed to build randomservice-binary"
  exit 1
fi

echo "Build completed successfully."

echo "Running agent-binary..."
bin/agent-binary start &  # Запуск в фоновом режиме
AGENT_PID=$!

echo "Running randomservice-binary..."
bin/randomservice-binary &  # Запуск в фоновом режиме
RANDOMSERVICE_PID=$!

# Wait until the process is finished
wait $AGENT_PID
wait $RANDOMSERVICE_PID

echo "Both binaries have been executed."