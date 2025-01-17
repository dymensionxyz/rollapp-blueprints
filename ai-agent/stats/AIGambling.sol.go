// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package main

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// AIGamblingBet is an auto generated low-level Go binding around an user-defined struct.
type AIGamblingBet struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}

// AIGamblingGameInfo is an auto generated low-level Go binding around an user-defined struct.
type AIGamblingGameInfo struct {
	HouseSupply            *big.Int
	HouseActiveBalance     *big.Int
	MinBetAmount           *big.Int
	MaxBetAmount           *big.Int
	MaxBetAmountPercentage *big.Int
}

// AIGamblingMetaData contains all meta data concerning the AIGambling contract.
var AIGamblingMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_initialOwner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_aiOracle\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"uint64\",\"name\":\"promptId\",\"type\":\"uint64\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"guessedNumber\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"correctNumber\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"persuasion\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"resolved\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"won\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"canceled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structAIGambling.Bet\",\"name\":\"bet\",\"type\":\"tuple\"}],\"name\":\"BetPlaced\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"uint64\",\"name\":\"promptId\",\"type\":\"uint64\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"guessedNumber\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"correctNumber\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"persuasion\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"resolved\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"won\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"canceled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structAIGambling.Bet\",\"name\":\"bet\",\"type\":\"tuple\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"communityFee\",\"type\":\"uint256\"}],\"name\":\"BetResolved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"PROMPT\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"balances\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"bets\",\"outputs\":[{\"internalType\":\"uint64\",\"name\":\"promptId\",\"type\":\"uint64\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"guessedNumber\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"correctNumber\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"persuasion\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"resolved\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"won\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"canceled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint64\",\"name\":\"promptId\",\"type\":\"uint64\"}],\"name\":\"checkAnswerStatus\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"answer\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"exists\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"communityPoolPercentage\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"deposit\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"depositSupply\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"estimateCommunityFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"betAmount\",\"type\":\"uint256\"}],\"name\":\"estimateReward\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"feeCollectorAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getGameInfo\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"houseSupply\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"houseActiveBalance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"minBetAmount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"maxBetAmount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"maxBetAmountPercentage\",\"type\":\"uint256\"}],\"internalType\":\"structAIGambling.GameInfo\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getHistory\",\"outputs\":[{\"components\":[{\"internalType\":\"uint64\",\"name\":\"promptId\",\"type\":\"uint64\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"guessedNumber\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"correctNumber\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"persuasion\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"resolved\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"won\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"canceled\",\"type\":\"bool\"}],\"internalType\":\"structAIGambling.Bet[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"govAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"history\",\"outputs\":[{\"internalType\":\"uint64\",\"name\":\"promptId\",\"type\":\"uint64\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"guessedNumber\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"correctNumber\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"persuasion\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"resolved\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"won\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"canceled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"houseFeePercentage\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"maxBetAmountPercentage\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"minBetAmount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"guessedNumber\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"persuasion\",\"type\":\"string\"}],\"name\":\"placeBet\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"resolveBet\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newPercentage\",\"type\":\"uint256\"}],\"name\":\"updateCommunityPoolPercentage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newPercentage\",\"type\":\"uint256\"}],\"name\":\"updateHouseFeePercentage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newPercentage\",\"type\":\"uint256\"}],\"name\":\"updateMaxBetAmountPercentage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newAmount\",\"type\":\"uint256\"}],\"name\":\"updateMinBetAmount\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"withdrawSupply\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"withdrawalBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// AIGamblingABI is the input ABI used to generate the binding from.
// Deprecated: Use AIGamblingMetaData.ABI instead.
var AIGamblingABI = AIGamblingMetaData.ABI

// AIGambling is an auto generated Go binding around an Ethereum contract.
type AIGambling struct {
	AIGamblingCaller     // Read-only binding to the contract
	AIGamblingTransactor // Write-only binding to the contract
	AIGamblingFilterer   // Log filterer for contract events
}

// AIGamblingCaller is an auto generated read-only Go binding around an Ethereum contract.
type AIGamblingCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AIGamblingTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AIGamblingTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AIGamblingFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AIGamblingFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AIGamblingSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AIGamblingSession struct {
	Contract     *AIGambling       // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// AIGamblingCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AIGamblingCallerSession struct {
	Contract *AIGamblingCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts     // Call options to use throughout this session
}

// AIGamblingTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AIGamblingTransactorSession struct {
	Contract     *AIGamblingTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts     // Transaction auth options to use throughout this session
}

// AIGamblingRaw is an auto generated low-level Go binding around an Ethereum contract.
type AIGamblingRaw struct {
	Contract *AIGambling // Generic contract binding to access the raw methods on
}

// AIGamblingCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AIGamblingCallerRaw struct {
	Contract *AIGamblingCaller // Generic read-only contract binding to access the raw methods on
}

// AIGamblingTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AIGamblingTransactorRaw struct {
	Contract *AIGamblingTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAIGambling creates a new instance of AIGambling, bound to a specific deployed contract.
func NewAIGambling(address common.Address, backend bind.ContractBackend) (*AIGambling, error) {
	contract, err := bindAIGambling(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AIGambling{AIGamblingCaller: AIGamblingCaller{contract: contract}, AIGamblingTransactor: AIGamblingTransactor{contract: contract}, AIGamblingFilterer: AIGamblingFilterer{contract: contract}}, nil
}

// NewAIGamblingCaller creates a new read-only instance of AIGambling, bound to a specific deployed contract.
func NewAIGamblingCaller(address common.Address, caller bind.ContractCaller) (*AIGamblingCaller, error) {
	contract, err := bindAIGambling(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AIGamblingCaller{contract: contract}, nil
}

// NewAIGamblingTransactor creates a new write-only instance of AIGambling, bound to a specific deployed contract.
func NewAIGamblingTransactor(address common.Address, transactor bind.ContractTransactor) (*AIGamblingTransactor, error) {
	contract, err := bindAIGambling(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AIGamblingTransactor{contract: contract}, nil
}

// NewAIGamblingFilterer creates a new log filterer instance of AIGambling, bound to a specific deployed contract.
func NewAIGamblingFilterer(address common.Address, filterer bind.ContractFilterer) (*AIGamblingFilterer, error) {
	contract, err := bindAIGambling(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AIGamblingFilterer{contract: contract}, nil
}

// bindAIGambling binds a generic wrapper to an already deployed contract.
func bindAIGambling(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := AIGamblingMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AIGambling *AIGamblingRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AIGambling.Contract.AIGamblingCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AIGambling *AIGamblingRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.Contract.AIGamblingTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AIGambling *AIGamblingRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AIGambling.Contract.AIGamblingTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AIGambling *AIGamblingCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AIGambling.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AIGambling *AIGamblingTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AIGambling *AIGamblingTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AIGambling.Contract.contract.Transact(opts, method, params...)
}

// PROMPT is a free data retrieval call binding the contract method 0xef370cc0.
//
// Solidity: function PROMPT() view returns(string)
func (_AIGambling *AIGamblingCaller) PROMPT(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "PROMPT")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// PROMPT is a free data retrieval call binding the contract method 0xef370cc0.
//
// Solidity: function PROMPT() view returns(string)
func (_AIGambling *AIGamblingSession) PROMPT() (string, error) {
	return _AIGambling.Contract.PROMPT(&_AIGambling.CallOpts)
}

// PROMPT is a free data retrieval call binding the contract method 0xef370cc0.
//
// Solidity: function PROMPT() view returns(string)
func (_AIGambling *AIGamblingCallerSession) PROMPT() (string, error) {
	return _AIGambling.Contract.PROMPT(&_AIGambling.CallOpts)
}

// Balances is a free data retrieval call binding the contract method 0x27e235e3.
//
// Solidity: function balances(address ) view returns(uint256)
func (_AIGambling *AIGamblingCaller) Balances(opts *bind.CallOpts, arg0 common.Address) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "balances", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Balances is a free data retrieval call binding the contract method 0x27e235e3.
//
// Solidity: function balances(address ) view returns(uint256)
func (_AIGambling *AIGamblingSession) Balances(arg0 common.Address) (*big.Int, error) {
	return _AIGambling.Contract.Balances(&_AIGambling.CallOpts, arg0)
}

// Balances is a free data retrieval call binding the contract method 0x27e235e3.
//
// Solidity: function balances(address ) view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) Balances(arg0 common.Address) (*big.Int, error) {
	return _AIGambling.Contract.Balances(&_AIGambling.CallOpts, arg0)
}

// Bets is a free data retrieval call binding the contract method 0x89a78f1a.
//
// Solidity: function bets(address ) view returns(uint64 promptId, uint256 amount, uint256 guessedNumber, uint256 correctNumber, string persuasion, bool resolved, bool won, bool canceled)
func (_AIGambling *AIGamblingCaller) Bets(opts *bind.CallOpts, arg0 common.Address) (struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "bets", arg0)

	outstruct := new(struct {
		PromptId      uint64
		Amount        *big.Int
		GuessedNumber *big.Int
		CorrectNumber *big.Int
		Persuasion    string
		Resolved      bool
		Won           bool
		Canceled      bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.PromptId = *abi.ConvertType(out[0], new(uint64)).(*uint64)
	outstruct.Amount = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.GuessedNumber = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.CorrectNumber = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.Persuasion = *abi.ConvertType(out[4], new(string)).(*string)
	outstruct.Resolved = *abi.ConvertType(out[5], new(bool)).(*bool)
	outstruct.Won = *abi.ConvertType(out[6], new(bool)).(*bool)
	outstruct.Canceled = *abi.ConvertType(out[7], new(bool)).(*bool)

	return *outstruct, err

}

// Bets is a free data retrieval call binding the contract method 0x89a78f1a.
//
// Solidity: function bets(address ) view returns(uint64 promptId, uint256 amount, uint256 guessedNumber, uint256 correctNumber, string persuasion, bool resolved, bool won, bool canceled)
func (_AIGambling *AIGamblingSession) Bets(arg0 common.Address) (struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}, error) {
	return _AIGambling.Contract.Bets(&_AIGambling.CallOpts, arg0)
}

// Bets is a free data retrieval call binding the contract method 0x89a78f1a.
//
// Solidity: function bets(address ) view returns(uint64 promptId, uint256 amount, uint256 guessedNumber, uint256 correctNumber, string persuasion, bool resolved, bool won, bool canceled)
func (_AIGambling *AIGamblingCallerSession) Bets(arg0 common.Address) (struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}, error) {
	return _AIGambling.Contract.Bets(&_AIGambling.CallOpts, arg0)
}

// CheckAnswerStatus is a free data retrieval call binding the contract method 0xf5b27379.
//
// Solidity: function checkAnswerStatus(uint64 promptId) view returns(string answer, bool exists)
func (_AIGambling *AIGamblingCaller) CheckAnswerStatus(opts *bind.CallOpts, promptId uint64) (struct {
	Answer string
	Exists bool
}, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "checkAnswerStatus", promptId)

	outstruct := new(struct {
		Answer string
		Exists bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Answer = *abi.ConvertType(out[0], new(string)).(*string)
	outstruct.Exists = *abi.ConvertType(out[1], new(bool)).(*bool)

	return *outstruct, err

}

// CheckAnswerStatus is a free data retrieval call binding the contract method 0xf5b27379.
//
// Solidity: function checkAnswerStatus(uint64 promptId) view returns(string answer, bool exists)
func (_AIGambling *AIGamblingSession) CheckAnswerStatus(promptId uint64) (struct {
	Answer string
	Exists bool
}, error) {
	return _AIGambling.Contract.CheckAnswerStatus(&_AIGambling.CallOpts, promptId)
}

// CheckAnswerStatus is a free data retrieval call binding the contract method 0xf5b27379.
//
// Solidity: function checkAnswerStatus(uint64 promptId) view returns(string answer, bool exists)
func (_AIGambling *AIGamblingCallerSession) CheckAnswerStatus(promptId uint64) (struct {
	Answer string
	Exists bool
}, error) {
	return _AIGambling.Contract.CheckAnswerStatus(&_AIGambling.CallOpts, promptId)
}

// CommunityPoolPercentage is a free data retrieval call binding the contract method 0xdb68f007.
//
// Solidity: function communityPoolPercentage() view returns(uint256)
func (_AIGambling *AIGamblingCaller) CommunityPoolPercentage(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "communityPoolPercentage")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CommunityPoolPercentage is a free data retrieval call binding the contract method 0xdb68f007.
//
// Solidity: function communityPoolPercentage() view returns(uint256)
func (_AIGambling *AIGamblingSession) CommunityPoolPercentage() (*big.Int, error) {
	return _AIGambling.Contract.CommunityPoolPercentage(&_AIGambling.CallOpts)
}

// CommunityPoolPercentage is a free data retrieval call binding the contract method 0xdb68f007.
//
// Solidity: function communityPoolPercentage() view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) CommunityPoolPercentage() (*big.Int, error) {
	return _AIGambling.Contract.CommunityPoolPercentage(&_AIGambling.CallOpts)
}

// EstimateCommunityFee is a free data retrieval call binding the contract method 0x25ebcf0a.
//
// Solidity: function estimateCommunityFee(uint256 amount) view returns(uint256)
func (_AIGambling *AIGamblingCaller) EstimateCommunityFee(opts *bind.CallOpts, amount *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "estimateCommunityFee", amount)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EstimateCommunityFee is a free data retrieval call binding the contract method 0x25ebcf0a.
//
// Solidity: function estimateCommunityFee(uint256 amount) view returns(uint256)
func (_AIGambling *AIGamblingSession) EstimateCommunityFee(amount *big.Int) (*big.Int, error) {
	return _AIGambling.Contract.EstimateCommunityFee(&_AIGambling.CallOpts, amount)
}

// EstimateCommunityFee is a free data retrieval call binding the contract method 0x25ebcf0a.
//
// Solidity: function estimateCommunityFee(uint256 amount) view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) EstimateCommunityFee(amount *big.Int) (*big.Int, error) {
	return _AIGambling.Contract.EstimateCommunityFee(&_AIGambling.CallOpts, amount)
}

// EstimateReward is a free data retrieval call binding the contract method 0xd2e87561.
//
// Solidity: function estimateReward(uint256 betAmount) view returns(uint256)
func (_AIGambling *AIGamblingCaller) EstimateReward(opts *bind.CallOpts, betAmount *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "estimateReward", betAmount)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EstimateReward is a free data retrieval call binding the contract method 0xd2e87561.
//
// Solidity: function estimateReward(uint256 betAmount) view returns(uint256)
func (_AIGambling *AIGamblingSession) EstimateReward(betAmount *big.Int) (*big.Int, error) {
	return _AIGambling.Contract.EstimateReward(&_AIGambling.CallOpts, betAmount)
}

// EstimateReward is a free data retrieval call binding the contract method 0xd2e87561.
//
// Solidity: function estimateReward(uint256 betAmount) view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) EstimateReward(betAmount *big.Int) (*big.Int, error) {
	return _AIGambling.Contract.EstimateReward(&_AIGambling.CallOpts, betAmount)
}

// FeeCollectorAddress is a free data retrieval call binding the contract method 0xf108e225.
//
// Solidity: function feeCollectorAddress() view returns(address)
func (_AIGambling *AIGamblingCaller) FeeCollectorAddress(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "feeCollectorAddress")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FeeCollectorAddress is a free data retrieval call binding the contract method 0xf108e225.
//
// Solidity: function feeCollectorAddress() view returns(address)
func (_AIGambling *AIGamblingSession) FeeCollectorAddress() (common.Address, error) {
	return _AIGambling.Contract.FeeCollectorAddress(&_AIGambling.CallOpts)
}

// FeeCollectorAddress is a free data retrieval call binding the contract method 0xf108e225.
//
// Solidity: function feeCollectorAddress() view returns(address)
func (_AIGambling *AIGamblingCallerSession) FeeCollectorAddress() (common.Address, error) {
	return _AIGambling.Contract.FeeCollectorAddress(&_AIGambling.CallOpts)
}

// GetGameInfo is a free data retrieval call binding the contract method 0x1746bd1b.
//
// Solidity: function getGameInfo() view returns((uint256,uint256,uint256,uint256,uint256))
func (_AIGambling *AIGamblingCaller) GetGameInfo(opts *bind.CallOpts) (AIGamblingGameInfo, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "getGameInfo")

	if err != nil {
		return *new(AIGamblingGameInfo), err
	}

	out0 := *abi.ConvertType(out[0], new(AIGamblingGameInfo)).(*AIGamblingGameInfo)

	return out0, err

}

// GetGameInfo is a free data retrieval call binding the contract method 0x1746bd1b.
//
// Solidity: function getGameInfo() view returns((uint256,uint256,uint256,uint256,uint256))
func (_AIGambling *AIGamblingSession) GetGameInfo() (AIGamblingGameInfo, error) {
	return _AIGambling.Contract.GetGameInfo(&_AIGambling.CallOpts)
}

// GetGameInfo is a free data retrieval call binding the contract method 0x1746bd1b.
//
// Solidity: function getGameInfo() view returns((uint256,uint256,uint256,uint256,uint256))
func (_AIGambling *AIGamblingCallerSession) GetGameInfo() (AIGamblingGameInfo, error) {
	return _AIGambling.Contract.GetGameInfo(&_AIGambling.CallOpts)
}

// GetHistory is a free data retrieval call binding the contract method 0x80396811.
//
// Solidity: function getHistory(address user) view returns((uint64,uint256,uint256,uint256,string,bool,bool,bool)[])
func (_AIGambling *AIGamblingCaller) GetHistory(opts *bind.CallOpts, user common.Address) ([]AIGamblingBet, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "getHistory", user)

	if err != nil {
		return *new([]AIGamblingBet), err
	}

	out0 := *abi.ConvertType(out[0], new([]AIGamblingBet)).(*[]AIGamblingBet)

	return out0, err

}

// GetHistory is a free data retrieval call binding the contract method 0x80396811.
//
// Solidity: function getHistory(address user) view returns((uint64,uint256,uint256,uint256,string,bool,bool,bool)[])
func (_AIGambling *AIGamblingSession) GetHistory(user common.Address) ([]AIGamblingBet, error) {
	return _AIGambling.Contract.GetHistory(&_AIGambling.CallOpts, user)
}

// GetHistory is a free data retrieval call binding the contract method 0x80396811.
//
// Solidity: function getHistory(address user) view returns((uint64,uint256,uint256,uint256,string,bool,bool,bool)[])
func (_AIGambling *AIGamblingCallerSession) GetHistory(user common.Address) ([]AIGamblingBet, error) {
	return _AIGambling.Contract.GetHistory(&_AIGambling.CallOpts, user)
}

// GovAddress is a free data retrieval call binding the contract method 0x46008a07.
//
// Solidity: function govAddress() view returns(address)
func (_AIGambling *AIGamblingCaller) GovAddress(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "govAddress")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GovAddress is a free data retrieval call binding the contract method 0x46008a07.
//
// Solidity: function govAddress() view returns(address)
func (_AIGambling *AIGamblingSession) GovAddress() (common.Address, error) {
	return _AIGambling.Contract.GovAddress(&_AIGambling.CallOpts)
}

// GovAddress is a free data retrieval call binding the contract method 0x46008a07.
//
// Solidity: function govAddress() view returns(address)
func (_AIGambling *AIGamblingCallerSession) GovAddress() (common.Address, error) {
	return _AIGambling.Contract.GovAddress(&_AIGambling.CallOpts)
}

// History is a free data retrieval call binding the contract method 0x7718f4ec.
//
// Solidity: function history(address , uint256 ) view returns(uint64 promptId, uint256 amount, uint256 guessedNumber, uint256 correctNumber, string persuasion, bool resolved, bool won, bool canceled)
func (_AIGambling *AIGamblingCaller) History(opts *bind.CallOpts, arg0 common.Address, arg1 *big.Int) (struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "history", arg0, arg1)

	outstruct := new(struct {
		PromptId      uint64
		Amount        *big.Int
		GuessedNumber *big.Int
		CorrectNumber *big.Int
		Persuasion    string
		Resolved      bool
		Won           bool
		Canceled      bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.PromptId = *abi.ConvertType(out[0], new(uint64)).(*uint64)
	outstruct.Amount = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.GuessedNumber = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.CorrectNumber = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.Persuasion = *abi.ConvertType(out[4], new(string)).(*string)
	outstruct.Resolved = *abi.ConvertType(out[5], new(bool)).(*bool)
	outstruct.Won = *abi.ConvertType(out[6], new(bool)).(*bool)
	outstruct.Canceled = *abi.ConvertType(out[7], new(bool)).(*bool)

	return *outstruct, err

}

// History is a free data retrieval call binding the contract method 0x7718f4ec.
//
// Solidity: function history(address , uint256 ) view returns(uint64 promptId, uint256 amount, uint256 guessedNumber, uint256 correctNumber, string persuasion, bool resolved, bool won, bool canceled)
func (_AIGambling *AIGamblingSession) History(arg0 common.Address, arg1 *big.Int) (struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}, error) {
	return _AIGambling.Contract.History(&_AIGambling.CallOpts, arg0, arg1)
}

// History is a free data retrieval call binding the contract method 0x7718f4ec.
//
// Solidity: function history(address , uint256 ) view returns(uint64 promptId, uint256 amount, uint256 guessedNumber, uint256 correctNumber, string persuasion, bool resolved, bool won, bool canceled)
func (_AIGambling *AIGamblingCallerSession) History(arg0 common.Address, arg1 *big.Int) (struct {
	PromptId      uint64
	Amount        *big.Int
	GuessedNumber *big.Int
	CorrectNumber *big.Int
	Persuasion    string
	Resolved      bool
	Won           bool
	Canceled      bool
}, error) {
	return _AIGambling.Contract.History(&_AIGambling.CallOpts, arg0, arg1)
}

// HouseFeePercentage is a free data retrieval call binding the contract method 0x1780a892.
//
// Solidity: function houseFeePercentage() view returns(uint256)
func (_AIGambling *AIGamblingCaller) HouseFeePercentage(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "houseFeePercentage")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// HouseFeePercentage is a free data retrieval call binding the contract method 0x1780a892.
//
// Solidity: function houseFeePercentage() view returns(uint256)
func (_AIGambling *AIGamblingSession) HouseFeePercentage() (*big.Int, error) {
	return _AIGambling.Contract.HouseFeePercentage(&_AIGambling.CallOpts)
}

// HouseFeePercentage is a free data retrieval call binding the contract method 0x1780a892.
//
// Solidity: function houseFeePercentage() view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) HouseFeePercentage() (*big.Int, error) {
	return _AIGambling.Contract.HouseFeePercentage(&_AIGambling.CallOpts)
}

// MaxBetAmountPercentage is a free data retrieval call binding the contract method 0x86220710.
//
// Solidity: function maxBetAmountPercentage() view returns(uint256)
func (_AIGambling *AIGamblingCaller) MaxBetAmountPercentage(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "maxBetAmountPercentage")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MaxBetAmountPercentage is a free data retrieval call binding the contract method 0x86220710.
//
// Solidity: function maxBetAmountPercentage() view returns(uint256)
func (_AIGambling *AIGamblingSession) MaxBetAmountPercentage() (*big.Int, error) {
	return _AIGambling.Contract.MaxBetAmountPercentage(&_AIGambling.CallOpts)
}

// MaxBetAmountPercentage is a free data retrieval call binding the contract method 0x86220710.
//
// Solidity: function maxBetAmountPercentage() view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) MaxBetAmountPercentage() (*big.Int, error) {
	return _AIGambling.Contract.MaxBetAmountPercentage(&_AIGambling.CallOpts)
}

// MinBetAmount is a free data retrieval call binding the contract method 0xfa968eea.
//
// Solidity: function minBetAmount() view returns(uint256)
func (_AIGambling *AIGamblingCaller) MinBetAmount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "minBetAmount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MinBetAmount is a free data retrieval call binding the contract method 0xfa968eea.
//
// Solidity: function minBetAmount() view returns(uint256)
func (_AIGambling *AIGamblingSession) MinBetAmount() (*big.Int, error) {
	return _AIGambling.Contract.MinBetAmount(&_AIGambling.CallOpts)
}

// MinBetAmount is a free data retrieval call binding the contract method 0xfa968eea.
//
// Solidity: function minBetAmount() view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) MinBetAmount() (*big.Int, error) {
	return _AIGambling.Contract.MinBetAmount(&_AIGambling.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AIGambling *AIGamblingCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AIGambling *AIGamblingSession) Owner() (common.Address, error) {
	return _AIGambling.Contract.Owner(&_AIGambling.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AIGambling *AIGamblingCallerSession) Owner() (common.Address, error) {
	return _AIGambling.Contract.Owner(&_AIGambling.CallOpts)
}

// WithdrawalBalance is a free data retrieval call binding the contract method 0x0b9c8fe8.
//
// Solidity: function withdrawalBalance() view returns(uint256)
func (_AIGambling *AIGamblingCaller) WithdrawalBalance(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _AIGambling.contract.Call(opts, &out, "withdrawalBalance")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// WithdrawalBalance is a free data retrieval call binding the contract method 0x0b9c8fe8.
//
// Solidity: function withdrawalBalance() view returns(uint256)
func (_AIGambling *AIGamblingSession) WithdrawalBalance() (*big.Int, error) {
	return _AIGambling.Contract.WithdrawalBalance(&_AIGambling.CallOpts)
}

// WithdrawalBalance is a free data retrieval call binding the contract method 0x0b9c8fe8.
//
// Solidity: function withdrawalBalance() view returns(uint256)
func (_AIGambling *AIGamblingCallerSession) WithdrawalBalance() (*big.Int, error) {
	return _AIGambling.Contract.WithdrawalBalance(&_AIGambling.CallOpts)
}

// Deposit is a paid mutator transaction binding the contract method 0xd0e30db0.
//
// Solidity: function deposit() payable returns()
func (_AIGambling *AIGamblingTransactor) Deposit(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "deposit")
}

// Deposit is a paid mutator transaction binding the contract method 0xd0e30db0.
//
// Solidity: function deposit() payable returns()
func (_AIGambling *AIGamblingSession) Deposit() (*types.Transaction, error) {
	return _AIGambling.Contract.Deposit(&_AIGambling.TransactOpts)
}

// Deposit is a paid mutator transaction binding the contract method 0xd0e30db0.
//
// Solidity: function deposit() payable returns()
func (_AIGambling *AIGamblingTransactorSession) Deposit() (*types.Transaction, error) {
	return _AIGambling.Contract.Deposit(&_AIGambling.TransactOpts)
}

// DepositSupply is a paid mutator transaction binding the contract method 0xc86b5b4b.
//
// Solidity: function depositSupply() payable returns()
func (_AIGambling *AIGamblingTransactor) DepositSupply(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "depositSupply")
}

// DepositSupply is a paid mutator transaction binding the contract method 0xc86b5b4b.
//
// Solidity: function depositSupply() payable returns()
func (_AIGambling *AIGamblingSession) DepositSupply() (*types.Transaction, error) {
	return _AIGambling.Contract.DepositSupply(&_AIGambling.TransactOpts)
}

// DepositSupply is a paid mutator transaction binding the contract method 0xc86b5b4b.
//
// Solidity: function depositSupply() payable returns()
func (_AIGambling *AIGamblingTransactorSession) DepositSupply() (*types.Transaction, error) {
	return _AIGambling.Contract.DepositSupply(&_AIGambling.TransactOpts)
}

// PlaceBet is a paid mutator transaction binding the contract method 0x5e8af735.
//
// Solidity: function placeBet(uint256 guessedNumber, string persuasion) payable returns()
func (_AIGambling *AIGamblingTransactor) PlaceBet(opts *bind.TransactOpts, guessedNumber *big.Int, persuasion string) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "placeBet", guessedNumber, persuasion)
}

// PlaceBet is a paid mutator transaction binding the contract method 0x5e8af735.
//
// Solidity: function placeBet(uint256 guessedNumber, string persuasion) payable returns()
func (_AIGambling *AIGamblingSession) PlaceBet(guessedNumber *big.Int, persuasion string) (*types.Transaction, error) {
	return _AIGambling.Contract.PlaceBet(&_AIGambling.TransactOpts, guessedNumber, persuasion)
}

// PlaceBet is a paid mutator transaction binding the contract method 0x5e8af735.
//
// Solidity: function placeBet(uint256 guessedNumber, string persuasion) payable returns()
func (_AIGambling *AIGamblingTransactorSession) PlaceBet(guessedNumber *big.Int, persuasion string) (*types.Transaction, error) {
	return _AIGambling.Contract.PlaceBet(&_AIGambling.TransactOpts, guessedNumber, persuasion)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AIGambling *AIGamblingTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AIGambling *AIGamblingSession) RenounceOwnership() (*types.Transaction, error) {
	return _AIGambling.Contract.RenounceOwnership(&_AIGambling.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AIGambling *AIGamblingTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _AIGambling.Contract.RenounceOwnership(&_AIGambling.TransactOpts)
}

// ResolveBet is a paid mutator transaction binding the contract method 0x8fced626.
//
// Solidity: function resolveBet() returns()
func (_AIGambling *AIGamblingTransactor) ResolveBet(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "resolveBet")
}

// ResolveBet is a paid mutator transaction binding the contract method 0x8fced626.
//
// Solidity: function resolveBet() returns()
func (_AIGambling *AIGamblingSession) ResolveBet() (*types.Transaction, error) {
	return _AIGambling.Contract.ResolveBet(&_AIGambling.TransactOpts)
}

// ResolveBet is a paid mutator transaction binding the contract method 0x8fced626.
//
// Solidity: function resolveBet() returns()
func (_AIGambling *AIGamblingTransactorSession) ResolveBet() (*types.Transaction, error) {
	return _AIGambling.Contract.ResolveBet(&_AIGambling.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AIGambling *AIGamblingTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AIGambling *AIGamblingSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AIGambling.Contract.TransferOwnership(&_AIGambling.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AIGambling *AIGamblingTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AIGambling.Contract.TransferOwnership(&_AIGambling.TransactOpts, newOwner)
}

// UpdateCommunityPoolPercentage is a paid mutator transaction binding the contract method 0x5ea114e5.
//
// Solidity: function updateCommunityPoolPercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingTransactor) UpdateCommunityPoolPercentage(opts *bind.TransactOpts, newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "updateCommunityPoolPercentage", newPercentage)
}

// UpdateCommunityPoolPercentage is a paid mutator transaction binding the contract method 0x5ea114e5.
//
// Solidity: function updateCommunityPoolPercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingSession) UpdateCommunityPoolPercentage(newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateCommunityPoolPercentage(&_AIGambling.TransactOpts, newPercentage)
}

// UpdateCommunityPoolPercentage is a paid mutator transaction binding the contract method 0x5ea114e5.
//
// Solidity: function updateCommunityPoolPercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingTransactorSession) UpdateCommunityPoolPercentage(newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateCommunityPoolPercentage(&_AIGambling.TransactOpts, newPercentage)
}

// UpdateHouseFeePercentage is a paid mutator transaction binding the contract method 0x7717b3c9.
//
// Solidity: function updateHouseFeePercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingTransactor) UpdateHouseFeePercentage(opts *bind.TransactOpts, newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "updateHouseFeePercentage", newPercentage)
}

// UpdateHouseFeePercentage is a paid mutator transaction binding the contract method 0x7717b3c9.
//
// Solidity: function updateHouseFeePercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingSession) UpdateHouseFeePercentage(newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateHouseFeePercentage(&_AIGambling.TransactOpts, newPercentage)
}

// UpdateHouseFeePercentage is a paid mutator transaction binding the contract method 0x7717b3c9.
//
// Solidity: function updateHouseFeePercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingTransactorSession) UpdateHouseFeePercentage(newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateHouseFeePercentage(&_AIGambling.TransactOpts, newPercentage)
}

// UpdateMaxBetAmountPercentage is a paid mutator transaction binding the contract method 0x8972a764.
//
// Solidity: function updateMaxBetAmountPercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingTransactor) UpdateMaxBetAmountPercentage(opts *bind.TransactOpts, newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "updateMaxBetAmountPercentage", newPercentage)
}

// UpdateMaxBetAmountPercentage is a paid mutator transaction binding the contract method 0x8972a764.
//
// Solidity: function updateMaxBetAmountPercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingSession) UpdateMaxBetAmountPercentage(newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateMaxBetAmountPercentage(&_AIGambling.TransactOpts, newPercentage)
}

// UpdateMaxBetAmountPercentage is a paid mutator transaction binding the contract method 0x8972a764.
//
// Solidity: function updateMaxBetAmountPercentage(uint256 newPercentage) returns()
func (_AIGambling *AIGamblingTransactorSession) UpdateMaxBetAmountPercentage(newPercentage *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateMaxBetAmountPercentage(&_AIGambling.TransactOpts, newPercentage)
}

// UpdateMinBetAmount is a paid mutator transaction binding the contract method 0xb73bf456.
//
// Solidity: function updateMinBetAmount(uint256 newAmount) returns()
func (_AIGambling *AIGamblingTransactor) UpdateMinBetAmount(opts *bind.TransactOpts, newAmount *big.Int) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "updateMinBetAmount", newAmount)
}

// UpdateMinBetAmount is a paid mutator transaction binding the contract method 0xb73bf456.
//
// Solidity: function updateMinBetAmount(uint256 newAmount) returns()
func (_AIGambling *AIGamblingSession) UpdateMinBetAmount(newAmount *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateMinBetAmount(&_AIGambling.TransactOpts, newAmount)
}

// UpdateMinBetAmount is a paid mutator transaction binding the contract method 0xb73bf456.
//
// Solidity: function updateMinBetAmount(uint256 newAmount) returns()
func (_AIGambling *AIGamblingTransactorSession) UpdateMinBetAmount(newAmount *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.UpdateMinBetAmount(&_AIGambling.TransactOpts, newAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x3ccfd60b.
//
// Solidity: function withdraw() returns()
func (_AIGambling *AIGamblingTransactor) Withdraw(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "withdraw")
}

// Withdraw is a paid mutator transaction binding the contract method 0x3ccfd60b.
//
// Solidity: function withdraw() returns()
func (_AIGambling *AIGamblingSession) Withdraw() (*types.Transaction, error) {
	return _AIGambling.Contract.Withdraw(&_AIGambling.TransactOpts)
}

// Withdraw is a paid mutator transaction binding the contract method 0x3ccfd60b.
//
// Solidity: function withdraw() returns()
func (_AIGambling *AIGamblingTransactorSession) Withdraw() (*types.Transaction, error) {
	return _AIGambling.Contract.Withdraw(&_AIGambling.TransactOpts)
}

// WithdrawSupply is a paid mutator transaction binding the contract method 0x9504ad6d.
//
// Solidity: function withdrawSupply(uint256 amount) returns()
func (_AIGambling *AIGamblingTransactor) WithdrawSupply(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _AIGambling.contract.Transact(opts, "withdrawSupply", amount)
}

// WithdrawSupply is a paid mutator transaction binding the contract method 0x9504ad6d.
//
// Solidity: function withdrawSupply(uint256 amount) returns()
func (_AIGambling *AIGamblingSession) WithdrawSupply(amount *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.WithdrawSupply(&_AIGambling.TransactOpts, amount)
}

// WithdrawSupply is a paid mutator transaction binding the contract method 0x9504ad6d.
//
// Solidity: function withdrawSupply(uint256 amount) returns()
func (_AIGambling *AIGamblingTransactorSession) WithdrawSupply(amount *big.Int) (*types.Transaction, error) {
	return _AIGambling.Contract.WithdrawSupply(&_AIGambling.TransactOpts, amount)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_AIGambling *AIGamblingTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AIGambling.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_AIGambling *AIGamblingSession) Receive() (*types.Transaction, error) {
	return _AIGambling.Contract.Receive(&_AIGambling.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_AIGambling *AIGamblingTransactorSession) Receive() (*types.Transaction, error) {
	return _AIGambling.Contract.Receive(&_AIGambling.TransactOpts)
}

// AIGamblingBetPlacedIterator is returned from FilterBetPlaced and is used to iterate over the raw logs and unpacked data for BetPlaced events raised by the AIGambling contract.
type AIGamblingBetPlacedIterator struct {
	Event *AIGamblingBetPlaced // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AIGamblingBetPlacedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AIGamblingBetPlaced)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AIGamblingBetPlaced)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AIGamblingBetPlacedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AIGamblingBetPlacedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AIGamblingBetPlaced represents a BetPlaced event raised by the AIGambling contract.
type AIGamblingBetPlaced struct {
	User common.Address
	Bet  AIGamblingBet
	Raw  types.Log // Blockchain specific contextual infos
}

// FilterBetPlaced is a free log retrieval operation binding the contract event 0xd98f42a857b67ba58c51432f29490540610248c4fa6e1bb7a6bbb2d799138f48.
//
// Solidity: event BetPlaced(address indexed user, (uint64,uint256,uint256,uint256,string,bool,bool,bool) bet)
func (_AIGambling *AIGamblingFilterer) FilterBetPlaced(opts *bind.FilterOpts, user []common.Address) (*AIGamblingBetPlacedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _AIGambling.contract.FilterLogs(opts, "BetPlaced", userRule)
	if err != nil {
		return nil, err
	}
	return &AIGamblingBetPlacedIterator{contract: _AIGambling.contract, event: "BetPlaced", logs: logs, sub: sub}, nil
}

// WatchBetPlaced is a free log subscription operation binding the contract event 0xd98f42a857b67ba58c51432f29490540610248c4fa6e1bb7a6bbb2d799138f48.
//
// Solidity: event BetPlaced(address indexed user, (uint64,uint256,uint256,uint256,string,bool,bool,bool) bet)
func (_AIGambling *AIGamblingFilterer) WatchBetPlaced(opts *bind.WatchOpts, sink chan<- *AIGamblingBetPlaced, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _AIGambling.contract.WatchLogs(opts, "BetPlaced", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AIGamblingBetPlaced)
				if err := _AIGambling.contract.UnpackLog(event, "BetPlaced", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseBetPlaced is a log parse operation binding the contract event 0xd98f42a857b67ba58c51432f29490540610248c4fa6e1bb7a6bbb2d799138f48.
//
// Solidity: event BetPlaced(address indexed user, (uint64,uint256,uint256,uint256,string,bool,bool,bool) bet)
func (_AIGambling *AIGamblingFilterer) ParseBetPlaced(log types.Log) (*AIGamblingBetPlaced, error) {
	event := new(AIGamblingBetPlaced)
	if err := _AIGambling.contract.UnpackLog(event, "BetPlaced", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AIGamblingBetResolvedIterator is returned from FilterBetResolved and is used to iterate over the raw logs and unpacked data for BetResolved events raised by the AIGambling contract.
type AIGamblingBetResolvedIterator struct {
	Event *AIGamblingBetResolved // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AIGamblingBetResolvedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AIGamblingBetResolved)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AIGamblingBetResolved)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AIGamblingBetResolvedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AIGamblingBetResolvedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AIGamblingBetResolved represents a BetResolved event raised by the AIGambling contract.
type AIGamblingBetResolved struct {
	User         common.Address
	Bet          AIGamblingBet
	CommunityFee *big.Int
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterBetResolved is a free log retrieval operation binding the contract event 0x91389d0520d4c3aa6e8ba46f3ea8030caf17c3b8797908f589ac57d777727f9b.
//
// Solidity: event BetResolved(address indexed user, (uint64,uint256,uint256,uint256,string,bool,bool,bool) bet, uint256 communityFee)
func (_AIGambling *AIGamblingFilterer) FilterBetResolved(opts *bind.FilterOpts, user []common.Address) (*AIGamblingBetResolvedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _AIGambling.contract.FilterLogs(opts, "BetResolved", userRule)
	if err != nil {
		return nil, err
	}
	return &AIGamblingBetResolvedIterator{contract: _AIGambling.contract, event: "BetResolved", logs: logs, sub: sub}, nil
}

// WatchBetResolved is a free log subscription operation binding the contract event 0x91389d0520d4c3aa6e8ba46f3ea8030caf17c3b8797908f589ac57d777727f9b.
//
// Solidity: event BetResolved(address indexed user, (uint64,uint256,uint256,uint256,string,bool,bool,bool) bet, uint256 communityFee)
func (_AIGambling *AIGamblingFilterer) WatchBetResolved(opts *bind.WatchOpts, sink chan<- *AIGamblingBetResolved, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _AIGambling.contract.WatchLogs(opts, "BetResolved", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AIGamblingBetResolved)
				if err := _AIGambling.contract.UnpackLog(event, "BetResolved", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseBetResolved is a log parse operation binding the contract event 0x91389d0520d4c3aa6e8ba46f3ea8030caf17c3b8797908f589ac57d777727f9b.
//
// Solidity: event BetResolved(address indexed user, (uint64,uint256,uint256,uint256,string,bool,bool,bool) bet, uint256 communityFee)
func (_AIGambling *AIGamblingFilterer) ParseBetResolved(log types.Log) (*AIGamblingBetResolved, error) {
	event := new(AIGamblingBetResolved)
	if err := _AIGambling.contract.UnpackLog(event, "BetResolved", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AIGamblingOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the AIGambling contract.
type AIGamblingOwnershipTransferredIterator struct {
	Event *AIGamblingOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AIGamblingOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AIGamblingOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AIGamblingOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AIGamblingOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AIGamblingOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AIGamblingOwnershipTransferred represents a OwnershipTransferred event raised by the AIGambling contract.
type AIGamblingOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AIGambling *AIGamblingFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*AIGamblingOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AIGambling.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &AIGamblingOwnershipTransferredIterator{contract: _AIGambling.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AIGambling *AIGamblingFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *AIGamblingOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AIGambling.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AIGamblingOwnershipTransferred)
				if err := _AIGambling.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AIGambling *AIGamblingFilterer) ParseOwnershipTransferred(log types.Log) (*AIGamblingOwnershipTransferred, error) {
	event := new(AIGamblingOwnershipTransferred)
	if err := _AIGambling.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
