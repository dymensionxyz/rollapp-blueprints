package repository

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"os"

	"github.com/edgelesssys/estore"
)

const (
	dbPath  = "/db"
	keyFile = "/store_sealed_key"
	keyPath = dbPath + keyFile
)

type DB struct {
	db *estore.DB
}

func NewEStore(logger *slog.Logger) (*DB, error) {
	var db *estore.DB
	storeSealedKey, err := os.ReadFile(keyPath)
	if err == nil {
		logger.Info("Found existing DB")
		db, err = openExistingDB(storeSealedKey)
	} else if errors.Is(err, os.ErrNotExist) {
		logger.Info("Found existing DB")
		db, err = createNewDB()
	}
	if err != nil {
		return nil, fmt.Errorf("can't connect to DB: %v", err)
	}
	return &DB{db: db}, nil
}

func (db *DB) Get(promptID uint64) (Answer, error) {
	key := make([]byte, 8)
	binary.BigEndian.PutUint64(key, promptID)
	b, closer, err := db.db.Get(key)
	if err != nil {
		return Answer{}, fmt.Errorf("get answer from DB: %v", err)
	}
	defer closer.Close()
	var a Answer
	a.MustFromBytes(b)
	return a, nil
}

func (db *DB) Save(promptID uint64, a Answer) error {
	key := make([]byte, 8)
	binary.BigEndian.PutUint64(key, promptID)
	return db.db.Set(key, a.MustToBytes(), nil)
}

func (db *DB) Close() error {
	return db.db.Close()
}

type Answer struct {
	Answer      string `json:"answer,omitempty"`
	MessageID   string `json:"message_id,omitempty"`
	ThreadID    string `json:"thread_id,omitempty"`
	RunID       string `json:"run_id,omitempty"`
	AssistantID string `json:"assistant_id,omitempty"`
}

// MustToBytes converts SubmitPromptResponse to bytes
func (a Answer) MustToBytes() []byte {
	b, err := json.Marshal(a)
	if err != nil {
		panic(fmt.Errorf("marshal answer: %w", err))
	}
	return b
}

// MustFromBytes converts bytes to SubmitPromptResponse
func (a *Answer) MustFromBytes(data []byte) {
	err := json.Unmarshal(data, a)
	if err != nil {
		panic(fmt.Errorf("unmarshal answer: %w", err))
	}
}
