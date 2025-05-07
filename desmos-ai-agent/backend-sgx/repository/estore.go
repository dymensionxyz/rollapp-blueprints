package repository

import (
	"crypto/rand"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"path/filepath"

	"github.com/edgelesssys/estore"
	"oracle/keys"
)

const (
	DBDir    = "db"
	storeKey = "/store_key"
)

type DB struct {
	db *estore.DB
}

func NewEStore() (*DB, error) {
	encKey, err := keys.OpenCreateData(filepath.Join(keys.AppdataDir, storeKey), func() ([]byte, error) {
		// Generate an encryption key. This is the key used for store encryption and decryption.
		storeEncKey := make([]byte, 32)
		_, err := rand.Read(storeEncKey)
		return storeEncKey, err
	})
	if err != nil {
		return nil, fmt.Errorf("create encryption key: %w", err)
	}

	// Create an encrypted store
	db, err := estore.Open(filepath.Join(keys.AppdataDir, DBDir), &estore.Options{
		EncryptionKey: encKey,
	})
	if err != nil {
		return nil, fmt.Errorf("open estore: %w", err)
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
