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

// LotteryAgentDraw is an auto generated low-level Go binding around an user-defined struct.
type LotteryAgentDraw struct {
	RandomnessIDs                 []*big.Int
	WinningNumbers                []bool
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	Tickets                       []LotteryAgentTicket
	PrepareFinalizeCalled         bool
}

// LotteryAgentTicket is an auto generated low-level Go binding around an user-defined struct.
type LotteryAgentTicket struct {
	Player        common.Address
	ChosenNumbers []bool
	Claimed       bool
	Winner        bool
	Id            *big.Int
}

// LotteryAgentMetaData contains all meta data concerning the LotteryAgent contract.
var LotteryAgentMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_randomnessGenerator\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"drawId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool[]\",\"name\":\"winningNumbers\",\"type\":\"bool[]\"}],\"name\":\"DrawFinalized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"prizeAmount\",\"type\":\"uint256\"}],\"name\":\"PrizeClaimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"ticketId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"chosenNumbers\",\"type\":\"uint256[]\"}],\"name\":\"TicketPurchased\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"NUMBERS_COUNT\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"NUMBER_TO_CHOOSE\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"activeBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"allRandomnessPostedForCurDraw\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"drawId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"ticketId\",\"type\":\"uint256\"}],\"name\":\"claimPrize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"curDraw\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalWinnings\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"winnersCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"ticketRevenue\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"stackersPoolDistributionRatio\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"prepareFinalizeCalled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"depositSupply\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"drawBeginTime\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"drawFrequency\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"drawHistory\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalWinnings\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"winnersCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"ticketRevenue\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"stackersPoolDistributionRatio\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"prepareFinalizeCalled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"finalizeDraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCurDrawRemainingTime\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCurDrawTotalWinnings\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"idx\",\"type\":\"uint256\"}],\"name\":\"getDraw\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256[]\",\"name\":\"randomnessIDs\",\"type\":\"uint256[]\"},{\"internalType\":\"bool[]\",\"name\":\"winningNumbers\",\"type\":\"bool[]\"},{\"internalType\":\"uint256\",\"name\":\"totalWinnings\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"winnersCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"ticketRevenue\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"stackersPoolDistributionRatio\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"internalType\":\"bool[]\",\"name\":\"chosenNumbers\",\"type\":\"bool[]\"},{\"internalType\":\"bool\",\"name\":\"claimed\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"winner\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"internalType\":\"structLotteryAgent.Ticket[]\",\"name\":\"tickets\",\"type\":\"tuple[]\"},{\"internalType\":\"bool\",\"name\":\"prepareFinalizeCalled\",\"type\":\"bool\"}],\"internalType\":\"structLotteryAgent.Draw\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getDrawCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"idx\",\"type\":\"uint256\"}],\"name\":\"getDrawShortInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalWinnings\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"winningNumbers\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256\",\"name\":\"winnersCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"ticketCount\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"drawId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getUserTickets\",\"outputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"internalType\":\"bool[]\",\"name\":\"chosenNumbers\",\"type\":\"bool[]\"},{\"internalType\":\"bool\",\"name\":\"claimed\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"winner\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"internalType\":\"structLotteryAgent.Ticket[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"prepareFinalizeDraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_chosenNumbers\",\"type\":\"uint256[]\"}],\"name\":\"purchaseTicket\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"randomnessGenerator\",\"outputs\":[{\"internalType\":\"contractRandomnessGenerator\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newFrequency\",\"type\":\"uint256\"}],\"name\":\"setDrawFrequency\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setNewRngAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newRatio\",\"type\":\"uint256\"}],\"name\":\"setStackersPoolDistributionRatio\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newTicketPrice\",\"type\":\"uint256\"}],\"name\":\"setTicketPrice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stackersPoolDistributionRatio\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"ticketCounter\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"ticketPrice\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"}],\"name\":\"withdrawSupply\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// LotteryAgentABI is the input ABI used to generate the binding from.
// Deprecated: Use LotteryAgentMetaData.ABI instead.
var LotteryAgentABI = LotteryAgentMetaData.ABI

// LotteryAgent is an auto generated Go binding around an Ethereum contract.
type LotteryAgent struct {
	LotteryAgentCaller     // Read-only binding to the contract
	LotteryAgentTransactor // Write-only binding to the contract
	LotteryAgentFilterer   // Log filterer for contract events
}

// LotteryAgentCaller is an auto generated read-only Go binding around an Ethereum contract.
type LotteryAgentCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LotteryAgentTransactor is an auto generated write-only Go binding around an Ethereum contract.
type LotteryAgentTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LotteryAgentFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type LotteryAgentFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LotteryAgentSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type LotteryAgentSession struct {
	Contract     *LotteryAgent     // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// LotteryAgentCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type LotteryAgentCallerSession struct {
	Contract *LotteryAgentCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts       // Call options to use throughout this session
}

// LotteryAgentTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type LotteryAgentTransactorSession struct {
	Contract     *LotteryAgentTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts       // Transaction auth options to use throughout this session
}

// LotteryAgentRaw is an auto generated low-level Go binding around an Ethereum contract.
type LotteryAgentRaw struct {
	Contract *LotteryAgent // Generic contract binding to access the raw methods on
}

// LotteryAgentCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type LotteryAgentCallerRaw struct {
	Contract *LotteryAgentCaller // Generic read-only contract binding to access the raw methods on
}

// LotteryAgentTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type LotteryAgentTransactorRaw struct {
	Contract *LotteryAgentTransactor // Generic write-only contract binding to access the raw methods on
}

// NewLotteryAgent creates a new instance of LotteryAgent, bound to a specific deployed contract.
func NewLotteryAgent(address common.Address, backend bind.ContractBackend) (*LotteryAgent, error) {
	contract, err := bindLotteryAgent(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &LotteryAgent{LotteryAgentCaller: LotteryAgentCaller{contract: contract}, LotteryAgentTransactor: LotteryAgentTransactor{contract: contract}, LotteryAgentFilterer: LotteryAgentFilterer{contract: contract}}, nil
}

// NewLotteryAgentCaller creates a new read-only instance of LotteryAgent, bound to a specific deployed contract.
func NewLotteryAgentCaller(address common.Address, caller bind.ContractCaller) (*LotteryAgentCaller, error) {
	contract, err := bindLotteryAgent(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentCaller{contract: contract}, nil
}

// NewLotteryAgentTransactor creates a new write-only instance of LotteryAgent, bound to a specific deployed contract.
func NewLotteryAgentTransactor(address common.Address, transactor bind.ContractTransactor) (*LotteryAgentTransactor, error) {
	contract, err := bindLotteryAgent(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentTransactor{contract: contract}, nil
}

// NewLotteryAgentFilterer creates a new log filterer instance of LotteryAgent, bound to a specific deployed contract.
func NewLotteryAgentFilterer(address common.Address, filterer bind.ContractFilterer) (*LotteryAgentFilterer, error) {
	contract, err := bindLotteryAgent(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentFilterer{contract: contract}, nil
}

// bindLotteryAgent binds a generic wrapper to an already deployed contract.
func bindLotteryAgent(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := LotteryAgentMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_LotteryAgent *LotteryAgentRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _LotteryAgent.Contract.LotteryAgentCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_LotteryAgent *LotteryAgentRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.Contract.LotteryAgentTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_LotteryAgent *LotteryAgentRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _LotteryAgent.Contract.LotteryAgentTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_LotteryAgent *LotteryAgentCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _LotteryAgent.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_LotteryAgent *LotteryAgentTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_LotteryAgent *LotteryAgentTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _LotteryAgent.Contract.contract.Transact(opts, method, params...)
}

// NUMBERSCOUNT is a free data retrieval call binding the contract method 0x3a3442c5.
//
// Solidity: function NUMBERS_COUNT() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) NUMBERSCOUNT(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "NUMBERS_COUNT")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// NUMBERSCOUNT is a free data retrieval call binding the contract method 0x3a3442c5.
//
// Solidity: function NUMBERS_COUNT() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) NUMBERSCOUNT() (*big.Int, error) {
	return _LotteryAgent.Contract.NUMBERSCOUNT(&_LotteryAgent.CallOpts)
}

// NUMBERSCOUNT is a free data retrieval call binding the contract method 0x3a3442c5.
//
// Solidity: function NUMBERS_COUNT() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) NUMBERSCOUNT() (*big.Int, error) {
	return _LotteryAgent.Contract.NUMBERSCOUNT(&_LotteryAgent.CallOpts)
}

// NUMBERTOCHOOSE is a free data retrieval call binding the contract method 0xa7021835.
//
// Solidity: function NUMBER_TO_CHOOSE() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) NUMBERTOCHOOSE(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "NUMBER_TO_CHOOSE")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// NUMBERTOCHOOSE is a free data retrieval call binding the contract method 0xa7021835.
//
// Solidity: function NUMBER_TO_CHOOSE() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) NUMBERTOCHOOSE() (*big.Int, error) {
	return _LotteryAgent.Contract.NUMBERTOCHOOSE(&_LotteryAgent.CallOpts)
}

// NUMBERTOCHOOSE is a free data retrieval call binding the contract method 0xa7021835.
//
// Solidity: function NUMBER_TO_CHOOSE() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) NUMBERTOCHOOSE() (*big.Int, error) {
	return _LotteryAgent.Contract.NUMBERTOCHOOSE(&_LotteryAgent.CallOpts)
}

// ActiveBalance is a free data retrieval call binding the contract method 0x08998c93.
//
// Solidity: function activeBalance() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) ActiveBalance(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "activeBalance")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ActiveBalance is a free data retrieval call binding the contract method 0x08998c93.
//
// Solidity: function activeBalance() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) ActiveBalance() (*big.Int, error) {
	return _LotteryAgent.Contract.ActiveBalance(&_LotteryAgent.CallOpts)
}

// ActiveBalance is a free data retrieval call binding the contract method 0x08998c93.
//
// Solidity: function activeBalance() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) ActiveBalance() (*big.Int, error) {
	return _LotteryAgent.Contract.ActiveBalance(&_LotteryAgent.CallOpts)
}

// AllRandomnessPostedForCurDraw is a free data retrieval call binding the contract method 0xeda26381.
//
// Solidity: function allRandomnessPostedForCurDraw() view returns(bool)
func (_LotteryAgent *LotteryAgentCaller) AllRandomnessPostedForCurDraw(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "allRandomnessPostedForCurDraw")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// AllRandomnessPostedForCurDraw is a free data retrieval call binding the contract method 0xeda26381.
//
// Solidity: function allRandomnessPostedForCurDraw() view returns(bool)
func (_LotteryAgent *LotteryAgentSession) AllRandomnessPostedForCurDraw() (bool, error) {
	return _LotteryAgent.Contract.AllRandomnessPostedForCurDraw(&_LotteryAgent.CallOpts)
}

// AllRandomnessPostedForCurDraw is a free data retrieval call binding the contract method 0xeda26381.
//
// Solidity: function allRandomnessPostedForCurDraw() view returns(bool)
func (_LotteryAgent *LotteryAgentCallerSession) AllRandomnessPostedForCurDraw() (bool, error) {
	return _LotteryAgent.Contract.AllRandomnessPostedForCurDraw(&_LotteryAgent.CallOpts)
}

// CurDraw is a free data retrieval call binding the contract method 0x8f874de2.
//
// Solidity: function curDraw() view returns(uint256 totalWinnings, uint256 winnersCount, uint256 ticketRevenue, uint256 stackersPoolDistributionRatio, bool prepareFinalizeCalled)
func (_LotteryAgent *LotteryAgentCaller) CurDraw(opts *bind.CallOpts) (struct {
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	PrepareFinalizeCalled         bool
}, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "curDraw")

	outstruct := new(struct {
		TotalWinnings                 *big.Int
		WinnersCount                  *big.Int
		TicketRevenue                 *big.Int
		StackersPoolDistributionRatio *big.Int
		PrepareFinalizeCalled         bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.TotalWinnings = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.WinnersCount = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.TicketRevenue = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.StackersPoolDistributionRatio = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.PrepareFinalizeCalled = *abi.ConvertType(out[4], new(bool)).(*bool)

	return *outstruct, err

}

// CurDraw is a free data retrieval call binding the contract method 0x8f874de2.
//
// Solidity: function curDraw() view returns(uint256 totalWinnings, uint256 winnersCount, uint256 ticketRevenue, uint256 stackersPoolDistributionRatio, bool prepareFinalizeCalled)
func (_LotteryAgent *LotteryAgentSession) CurDraw() (struct {
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	PrepareFinalizeCalled         bool
}, error) {
	return _LotteryAgent.Contract.CurDraw(&_LotteryAgent.CallOpts)
}

// CurDraw is a free data retrieval call binding the contract method 0x8f874de2.
//
// Solidity: function curDraw() view returns(uint256 totalWinnings, uint256 winnersCount, uint256 ticketRevenue, uint256 stackersPoolDistributionRatio, bool prepareFinalizeCalled)
func (_LotteryAgent *LotteryAgentCallerSession) CurDraw() (struct {
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	PrepareFinalizeCalled         bool
}, error) {
	return _LotteryAgent.Contract.CurDraw(&_LotteryAgent.CallOpts)
}

// DrawBeginTime is a free data retrieval call binding the contract method 0x1e79ad49.
//
// Solidity: function drawBeginTime() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) DrawBeginTime(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "drawBeginTime")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// DrawBeginTime is a free data retrieval call binding the contract method 0x1e79ad49.
//
// Solidity: function drawBeginTime() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) DrawBeginTime() (*big.Int, error) {
	return _LotteryAgent.Contract.DrawBeginTime(&_LotteryAgent.CallOpts)
}

// DrawBeginTime is a free data retrieval call binding the contract method 0x1e79ad49.
//
// Solidity: function drawBeginTime() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) DrawBeginTime() (*big.Int, error) {
	return _LotteryAgent.Contract.DrawBeginTime(&_LotteryAgent.CallOpts)
}

// DrawFrequency is a free data retrieval call binding the contract method 0xa5a40544.
//
// Solidity: function drawFrequency() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) DrawFrequency(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "drawFrequency")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// DrawFrequency is a free data retrieval call binding the contract method 0xa5a40544.
//
// Solidity: function drawFrequency() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) DrawFrequency() (*big.Int, error) {
	return _LotteryAgent.Contract.DrawFrequency(&_LotteryAgent.CallOpts)
}

// DrawFrequency is a free data retrieval call binding the contract method 0xa5a40544.
//
// Solidity: function drawFrequency() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) DrawFrequency() (*big.Int, error) {
	return _LotteryAgent.Contract.DrawFrequency(&_LotteryAgent.CallOpts)
}

// DrawHistory is a free data retrieval call binding the contract method 0xfc46925f.
//
// Solidity: function drawHistory(uint256 ) view returns(uint256 totalWinnings, uint256 winnersCount, uint256 ticketRevenue, uint256 stackersPoolDistributionRatio, bool prepareFinalizeCalled)
func (_LotteryAgent *LotteryAgentCaller) DrawHistory(opts *bind.CallOpts, arg0 *big.Int) (struct {
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	PrepareFinalizeCalled         bool
}, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "drawHistory", arg0)

	outstruct := new(struct {
		TotalWinnings                 *big.Int
		WinnersCount                  *big.Int
		TicketRevenue                 *big.Int
		StackersPoolDistributionRatio *big.Int
		PrepareFinalizeCalled         bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.TotalWinnings = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.WinnersCount = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.TicketRevenue = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.StackersPoolDistributionRatio = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.PrepareFinalizeCalled = *abi.ConvertType(out[4], new(bool)).(*bool)

	return *outstruct, err

}

// DrawHistory is a free data retrieval call binding the contract method 0xfc46925f.
//
// Solidity: function drawHistory(uint256 ) view returns(uint256 totalWinnings, uint256 winnersCount, uint256 ticketRevenue, uint256 stackersPoolDistributionRatio, bool prepareFinalizeCalled)
func (_LotteryAgent *LotteryAgentSession) DrawHistory(arg0 *big.Int) (struct {
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	PrepareFinalizeCalled         bool
}, error) {
	return _LotteryAgent.Contract.DrawHistory(&_LotteryAgent.CallOpts, arg0)
}

// DrawHistory is a free data retrieval call binding the contract method 0xfc46925f.
//
// Solidity: function drawHistory(uint256 ) view returns(uint256 totalWinnings, uint256 winnersCount, uint256 ticketRevenue, uint256 stackersPoolDistributionRatio, bool prepareFinalizeCalled)
func (_LotteryAgent *LotteryAgentCallerSession) DrawHistory(arg0 *big.Int) (struct {
	TotalWinnings                 *big.Int
	WinnersCount                  *big.Int
	TicketRevenue                 *big.Int
	StackersPoolDistributionRatio *big.Int
	PrepareFinalizeCalled         bool
}, error) {
	return _LotteryAgent.Contract.DrawHistory(&_LotteryAgent.CallOpts, arg0)
}

// GetCurDrawRemainingTime is a free data retrieval call binding the contract method 0x4d2dec78.
//
// Solidity: function getCurDrawRemainingTime() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) GetCurDrawRemainingTime(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "getCurDrawRemainingTime")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetCurDrawRemainingTime is a free data retrieval call binding the contract method 0x4d2dec78.
//
// Solidity: function getCurDrawRemainingTime() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) GetCurDrawRemainingTime() (*big.Int, error) {
	return _LotteryAgent.Contract.GetCurDrawRemainingTime(&_LotteryAgent.CallOpts)
}

// GetCurDrawRemainingTime is a free data retrieval call binding the contract method 0x4d2dec78.
//
// Solidity: function getCurDrawRemainingTime() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) GetCurDrawRemainingTime() (*big.Int, error) {
	return _LotteryAgent.Contract.GetCurDrawRemainingTime(&_LotteryAgent.CallOpts)
}

// GetCurDrawTotalWinnings is a free data retrieval call binding the contract method 0xcc0a001b.
//
// Solidity: function getCurDrawTotalWinnings() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) GetCurDrawTotalWinnings(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "getCurDrawTotalWinnings")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetCurDrawTotalWinnings is a free data retrieval call binding the contract method 0xcc0a001b.
//
// Solidity: function getCurDrawTotalWinnings() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) GetCurDrawTotalWinnings() (*big.Int, error) {
	return _LotteryAgent.Contract.GetCurDrawTotalWinnings(&_LotteryAgent.CallOpts)
}

// GetCurDrawTotalWinnings is a free data retrieval call binding the contract method 0xcc0a001b.
//
// Solidity: function getCurDrawTotalWinnings() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) GetCurDrawTotalWinnings() (*big.Int, error) {
	return _LotteryAgent.Contract.GetCurDrawTotalWinnings(&_LotteryAgent.CallOpts)
}

// GetDraw is a free data retrieval call binding the contract method 0xbe6307c8.
//
// Solidity: function getDraw(uint256 idx) view returns((uint256[],bool[],uint256,uint256,uint256,uint256,(address,bool[],bool,bool,uint256)[],bool))
func (_LotteryAgent *LotteryAgentCaller) GetDraw(opts *bind.CallOpts, idx *big.Int) (LotteryAgentDraw, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "getDraw", idx)

	if err != nil {
		return *new(LotteryAgentDraw), err
	}

	out0 := *abi.ConvertType(out[0], new(LotteryAgentDraw)).(*LotteryAgentDraw)

	return out0, err

}

// GetDraw is a free data retrieval call binding the contract method 0xbe6307c8.
//
// Solidity: function getDraw(uint256 idx) view returns((uint256[],bool[],uint256,uint256,uint256,uint256,(address,bool[],bool,bool,uint256)[],bool))
func (_LotteryAgent *LotteryAgentSession) GetDraw(idx *big.Int) (LotteryAgentDraw, error) {
	return _LotteryAgent.Contract.GetDraw(&_LotteryAgent.CallOpts, idx)
}

// GetDraw is a free data retrieval call binding the contract method 0xbe6307c8.
//
// Solidity: function getDraw(uint256 idx) view returns((uint256[],bool[],uint256,uint256,uint256,uint256,(address,bool[],bool,bool,uint256)[],bool))
func (_LotteryAgent *LotteryAgentCallerSession) GetDraw(idx *big.Int) (LotteryAgentDraw, error) {
	return _LotteryAgent.Contract.GetDraw(&_LotteryAgent.CallOpts, idx)
}

// GetDrawCount is a free data retrieval call binding the contract method 0xc4df5fed.
//
// Solidity: function getDrawCount() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) GetDrawCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "getDrawCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetDrawCount is a free data retrieval call binding the contract method 0xc4df5fed.
//
// Solidity: function getDrawCount() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) GetDrawCount() (*big.Int, error) {
	return _LotteryAgent.Contract.GetDrawCount(&_LotteryAgent.CallOpts)
}

// GetDrawCount is a free data retrieval call binding the contract method 0xc4df5fed.
//
// Solidity: function getDrawCount() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) GetDrawCount() (*big.Int, error) {
	return _LotteryAgent.Contract.GetDrawCount(&_LotteryAgent.CallOpts)
}

// GetDrawShortInfo is a free data retrieval call binding the contract method 0x32150d8c.
//
// Solidity: function getDrawShortInfo(uint256 idx) view returns(uint256 totalWinnings, uint256[] winningNumbers, uint256 winnersCount, uint256 ticketCount)
func (_LotteryAgent *LotteryAgentCaller) GetDrawShortInfo(opts *bind.CallOpts, idx *big.Int) (struct {
	TotalWinnings  *big.Int
	WinningNumbers []*big.Int
	WinnersCount   *big.Int
	TicketCount    *big.Int
}, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "getDrawShortInfo", idx)

	outstruct := new(struct {
		TotalWinnings  *big.Int
		WinningNumbers []*big.Int
		WinnersCount   *big.Int
		TicketCount    *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.TotalWinnings = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.WinningNumbers = *abi.ConvertType(out[1], new([]*big.Int)).(*[]*big.Int)
	outstruct.WinnersCount = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.TicketCount = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// GetDrawShortInfo is a free data retrieval call binding the contract method 0x32150d8c.
//
// Solidity: function getDrawShortInfo(uint256 idx) view returns(uint256 totalWinnings, uint256[] winningNumbers, uint256 winnersCount, uint256 ticketCount)
func (_LotteryAgent *LotteryAgentSession) GetDrawShortInfo(idx *big.Int) (struct {
	TotalWinnings  *big.Int
	WinningNumbers []*big.Int
	WinnersCount   *big.Int
	TicketCount    *big.Int
}, error) {
	return _LotteryAgent.Contract.GetDrawShortInfo(&_LotteryAgent.CallOpts, idx)
}

// GetDrawShortInfo is a free data retrieval call binding the contract method 0x32150d8c.
//
// Solidity: function getDrawShortInfo(uint256 idx) view returns(uint256 totalWinnings, uint256[] winningNumbers, uint256 winnersCount, uint256 ticketCount)
func (_LotteryAgent *LotteryAgentCallerSession) GetDrawShortInfo(idx *big.Int) (struct {
	TotalWinnings  *big.Int
	WinningNumbers []*big.Int
	WinnersCount   *big.Int
	TicketCount    *big.Int
}, error) {
	return _LotteryAgent.Contract.GetDrawShortInfo(&_LotteryAgent.CallOpts, idx)
}

// GetUserTickets is a free data retrieval call binding the contract method 0xe7a7f65c.
//
// Solidity: function getUserTickets(uint256 drawId, address user) view returns((address,bool[],bool,bool,uint256)[])
func (_LotteryAgent *LotteryAgentCaller) GetUserTickets(opts *bind.CallOpts, drawId *big.Int, user common.Address) ([]LotteryAgentTicket, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "getUserTickets", drawId, user)

	if err != nil {
		return *new([]LotteryAgentTicket), err
	}

	out0 := *abi.ConvertType(out[0], new([]LotteryAgentTicket)).(*[]LotteryAgentTicket)

	return out0, err

}

// GetUserTickets is a free data retrieval call binding the contract method 0xe7a7f65c.
//
// Solidity: function getUserTickets(uint256 drawId, address user) view returns((address,bool[],bool,bool,uint256)[])
func (_LotteryAgent *LotteryAgentSession) GetUserTickets(drawId *big.Int, user common.Address) ([]LotteryAgentTicket, error) {
	return _LotteryAgent.Contract.GetUserTickets(&_LotteryAgent.CallOpts, drawId, user)
}

// GetUserTickets is a free data retrieval call binding the contract method 0xe7a7f65c.
//
// Solidity: function getUserTickets(uint256 drawId, address user) view returns((address,bool[],bool,bool,uint256)[])
func (_LotteryAgent *LotteryAgentCallerSession) GetUserTickets(drawId *big.Int, user common.Address) ([]LotteryAgentTicket, error) {
	return _LotteryAgent.Contract.GetUserTickets(&_LotteryAgent.CallOpts, drawId, user)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LotteryAgent *LotteryAgentCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LotteryAgent *LotteryAgentSession) Owner() (common.Address, error) {
	return _LotteryAgent.Contract.Owner(&_LotteryAgent.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LotteryAgent *LotteryAgentCallerSession) Owner() (common.Address, error) {
	return _LotteryAgent.Contract.Owner(&_LotteryAgent.CallOpts)
}

// RandomnessGenerator is a free data retrieval call binding the contract method 0xd208f650.
//
// Solidity: function randomnessGenerator() view returns(address)
func (_LotteryAgent *LotteryAgentCaller) RandomnessGenerator(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "randomnessGenerator")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// RandomnessGenerator is a free data retrieval call binding the contract method 0xd208f650.
//
// Solidity: function randomnessGenerator() view returns(address)
func (_LotteryAgent *LotteryAgentSession) RandomnessGenerator() (common.Address, error) {
	return _LotteryAgent.Contract.RandomnessGenerator(&_LotteryAgent.CallOpts)
}

// RandomnessGenerator is a free data retrieval call binding the contract method 0xd208f650.
//
// Solidity: function randomnessGenerator() view returns(address)
func (_LotteryAgent *LotteryAgentCallerSession) RandomnessGenerator() (common.Address, error) {
	return _LotteryAgent.Contract.RandomnessGenerator(&_LotteryAgent.CallOpts)
}

// StackersPoolDistributionRatio is a free data retrieval call binding the contract method 0x84f51a44.
//
// Solidity: function stackersPoolDistributionRatio() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) StackersPoolDistributionRatio(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "stackersPoolDistributionRatio")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StackersPoolDistributionRatio is a free data retrieval call binding the contract method 0x84f51a44.
//
// Solidity: function stackersPoolDistributionRatio() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) StackersPoolDistributionRatio() (*big.Int, error) {
	return _LotteryAgent.Contract.StackersPoolDistributionRatio(&_LotteryAgent.CallOpts)
}

// StackersPoolDistributionRatio is a free data retrieval call binding the contract method 0x84f51a44.
//
// Solidity: function stackersPoolDistributionRatio() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) StackersPoolDistributionRatio() (*big.Int, error) {
	return _LotteryAgent.Contract.StackersPoolDistributionRatio(&_LotteryAgent.CallOpts)
}

// TicketCounter is a free data retrieval call binding the contract method 0x8c4d59d0.
//
// Solidity: function ticketCounter() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) TicketCounter(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "ticketCounter")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TicketCounter is a free data retrieval call binding the contract method 0x8c4d59d0.
//
// Solidity: function ticketCounter() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) TicketCounter() (*big.Int, error) {
	return _LotteryAgent.Contract.TicketCounter(&_LotteryAgent.CallOpts)
}

// TicketCounter is a free data retrieval call binding the contract method 0x8c4d59d0.
//
// Solidity: function ticketCounter() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) TicketCounter() (*big.Int, error) {
	return _LotteryAgent.Contract.TicketCounter(&_LotteryAgent.CallOpts)
}

// TicketPrice is a free data retrieval call binding the contract method 0x1209b1f6.
//
// Solidity: function ticketPrice() view returns(uint256)
func (_LotteryAgent *LotteryAgentCaller) TicketPrice(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LotteryAgent.contract.Call(opts, &out, "ticketPrice")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TicketPrice is a free data retrieval call binding the contract method 0x1209b1f6.
//
// Solidity: function ticketPrice() view returns(uint256)
func (_LotteryAgent *LotteryAgentSession) TicketPrice() (*big.Int, error) {
	return _LotteryAgent.Contract.TicketPrice(&_LotteryAgent.CallOpts)
}

// TicketPrice is a free data retrieval call binding the contract method 0x1209b1f6.
//
// Solidity: function ticketPrice() view returns(uint256)
func (_LotteryAgent *LotteryAgentCallerSession) TicketPrice() (*big.Int, error) {
	return _LotteryAgent.Contract.TicketPrice(&_LotteryAgent.CallOpts)
}

// ClaimPrize is a paid mutator transaction binding the contract method 0x7b154140.
//
// Solidity: function claimPrize(uint256 drawId, uint256 ticketId) returns()
func (_LotteryAgent *LotteryAgentTransactor) ClaimPrize(opts *bind.TransactOpts, drawId *big.Int, ticketId *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "claimPrize", drawId, ticketId)
}

// ClaimPrize is a paid mutator transaction binding the contract method 0x7b154140.
//
// Solidity: function claimPrize(uint256 drawId, uint256 ticketId) returns()
func (_LotteryAgent *LotteryAgentSession) ClaimPrize(drawId *big.Int, ticketId *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.ClaimPrize(&_LotteryAgent.TransactOpts, drawId, ticketId)
}

// ClaimPrize is a paid mutator transaction binding the contract method 0x7b154140.
//
// Solidity: function claimPrize(uint256 drawId, uint256 ticketId) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) ClaimPrize(drawId *big.Int, ticketId *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.ClaimPrize(&_LotteryAgent.TransactOpts, drawId, ticketId)
}

// DepositSupply is a paid mutator transaction binding the contract method 0xc86b5b4b.
//
// Solidity: function depositSupply() payable returns()
func (_LotteryAgent *LotteryAgentTransactor) DepositSupply(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "depositSupply")
}

// DepositSupply is a paid mutator transaction binding the contract method 0xc86b5b4b.
//
// Solidity: function depositSupply() payable returns()
func (_LotteryAgent *LotteryAgentSession) DepositSupply() (*types.Transaction, error) {
	return _LotteryAgent.Contract.DepositSupply(&_LotteryAgent.TransactOpts)
}

// DepositSupply is a paid mutator transaction binding the contract method 0xc86b5b4b.
//
// Solidity: function depositSupply() payable returns()
func (_LotteryAgent *LotteryAgentTransactorSession) DepositSupply() (*types.Transaction, error) {
	return _LotteryAgent.Contract.DepositSupply(&_LotteryAgent.TransactOpts)
}

// FinalizeDraw is a paid mutator transaction binding the contract method 0x862f96b8.
//
// Solidity: function finalizeDraw() returns()
func (_LotteryAgent *LotteryAgentTransactor) FinalizeDraw(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "finalizeDraw")
}

// FinalizeDraw is a paid mutator transaction binding the contract method 0x862f96b8.
//
// Solidity: function finalizeDraw() returns()
func (_LotteryAgent *LotteryAgentSession) FinalizeDraw() (*types.Transaction, error) {
	return _LotteryAgent.Contract.FinalizeDraw(&_LotteryAgent.TransactOpts)
}

// FinalizeDraw is a paid mutator transaction binding the contract method 0x862f96b8.
//
// Solidity: function finalizeDraw() returns()
func (_LotteryAgent *LotteryAgentTransactorSession) FinalizeDraw() (*types.Transaction, error) {
	return _LotteryAgent.Contract.FinalizeDraw(&_LotteryAgent.TransactOpts)
}

// PrepareFinalizeDraw is a paid mutator transaction binding the contract method 0x46b96298.
//
// Solidity: function prepareFinalizeDraw() returns()
func (_LotteryAgent *LotteryAgentTransactor) PrepareFinalizeDraw(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "prepareFinalizeDraw")
}

// PrepareFinalizeDraw is a paid mutator transaction binding the contract method 0x46b96298.
//
// Solidity: function prepareFinalizeDraw() returns()
func (_LotteryAgent *LotteryAgentSession) PrepareFinalizeDraw() (*types.Transaction, error) {
	return _LotteryAgent.Contract.PrepareFinalizeDraw(&_LotteryAgent.TransactOpts)
}

// PrepareFinalizeDraw is a paid mutator transaction binding the contract method 0x46b96298.
//
// Solidity: function prepareFinalizeDraw() returns()
func (_LotteryAgent *LotteryAgentTransactorSession) PrepareFinalizeDraw() (*types.Transaction, error) {
	return _LotteryAgent.Contract.PrepareFinalizeDraw(&_LotteryAgent.TransactOpts)
}

// PurchaseTicket is a paid mutator transaction binding the contract method 0xd0072ec4.
//
// Solidity: function purchaseTicket(uint256[] _chosenNumbers) payable returns()
func (_LotteryAgent *LotteryAgentTransactor) PurchaseTicket(opts *bind.TransactOpts, _chosenNumbers []*big.Int) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "purchaseTicket", _chosenNumbers)
}

// PurchaseTicket is a paid mutator transaction binding the contract method 0xd0072ec4.
//
// Solidity: function purchaseTicket(uint256[] _chosenNumbers) payable returns()
func (_LotteryAgent *LotteryAgentSession) PurchaseTicket(_chosenNumbers []*big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.PurchaseTicket(&_LotteryAgent.TransactOpts, _chosenNumbers)
}

// PurchaseTicket is a paid mutator transaction binding the contract method 0xd0072ec4.
//
// Solidity: function purchaseTicket(uint256[] _chosenNumbers) payable returns()
func (_LotteryAgent *LotteryAgentTransactorSession) PurchaseTicket(_chosenNumbers []*big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.PurchaseTicket(&_LotteryAgent.TransactOpts, _chosenNumbers)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LotteryAgent *LotteryAgentTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LotteryAgent *LotteryAgentSession) RenounceOwnership() (*types.Transaction, error) {
	return _LotteryAgent.Contract.RenounceOwnership(&_LotteryAgent.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LotteryAgent *LotteryAgentTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _LotteryAgent.Contract.RenounceOwnership(&_LotteryAgent.TransactOpts)
}

// SetDrawFrequency is a paid mutator transaction binding the contract method 0x6318076a.
//
// Solidity: function setDrawFrequency(uint256 newFrequency) returns()
func (_LotteryAgent *LotteryAgentTransactor) SetDrawFrequency(opts *bind.TransactOpts, newFrequency *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "setDrawFrequency", newFrequency)
}

// SetDrawFrequency is a paid mutator transaction binding the contract method 0x6318076a.
//
// Solidity: function setDrawFrequency(uint256 newFrequency) returns()
func (_LotteryAgent *LotteryAgentSession) SetDrawFrequency(newFrequency *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetDrawFrequency(&_LotteryAgent.TransactOpts, newFrequency)
}

// SetDrawFrequency is a paid mutator transaction binding the contract method 0x6318076a.
//
// Solidity: function setDrawFrequency(uint256 newFrequency) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) SetDrawFrequency(newFrequency *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetDrawFrequency(&_LotteryAgent.TransactOpts, newFrequency)
}

// SetNewRngAddress is a paid mutator transaction binding the contract method 0xdd86e109.
//
// Solidity: function setNewRngAddress(address addr) returns()
func (_LotteryAgent *LotteryAgentTransactor) SetNewRngAddress(opts *bind.TransactOpts, addr common.Address) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "setNewRngAddress", addr)
}

// SetNewRngAddress is a paid mutator transaction binding the contract method 0xdd86e109.
//
// Solidity: function setNewRngAddress(address addr) returns()
func (_LotteryAgent *LotteryAgentSession) SetNewRngAddress(addr common.Address) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetNewRngAddress(&_LotteryAgent.TransactOpts, addr)
}

// SetNewRngAddress is a paid mutator transaction binding the contract method 0xdd86e109.
//
// Solidity: function setNewRngAddress(address addr) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) SetNewRngAddress(addr common.Address) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetNewRngAddress(&_LotteryAgent.TransactOpts, addr)
}

// SetStackersPoolDistributionRatio is a paid mutator transaction binding the contract method 0xd219135c.
//
// Solidity: function setStackersPoolDistributionRatio(uint256 newRatio) returns()
func (_LotteryAgent *LotteryAgentTransactor) SetStackersPoolDistributionRatio(opts *bind.TransactOpts, newRatio *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "setStackersPoolDistributionRatio", newRatio)
}

// SetStackersPoolDistributionRatio is a paid mutator transaction binding the contract method 0xd219135c.
//
// Solidity: function setStackersPoolDistributionRatio(uint256 newRatio) returns()
func (_LotteryAgent *LotteryAgentSession) SetStackersPoolDistributionRatio(newRatio *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetStackersPoolDistributionRatio(&_LotteryAgent.TransactOpts, newRatio)
}

// SetStackersPoolDistributionRatio is a paid mutator transaction binding the contract method 0xd219135c.
//
// Solidity: function setStackersPoolDistributionRatio(uint256 newRatio) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) SetStackersPoolDistributionRatio(newRatio *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetStackersPoolDistributionRatio(&_LotteryAgent.TransactOpts, newRatio)
}

// SetTicketPrice is a paid mutator transaction binding the contract method 0x15981650.
//
// Solidity: function setTicketPrice(uint256 newTicketPrice) returns()
func (_LotteryAgent *LotteryAgentTransactor) SetTicketPrice(opts *bind.TransactOpts, newTicketPrice *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "setTicketPrice", newTicketPrice)
}

// SetTicketPrice is a paid mutator transaction binding the contract method 0x15981650.
//
// Solidity: function setTicketPrice(uint256 newTicketPrice) returns()
func (_LotteryAgent *LotteryAgentSession) SetTicketPrice(newTicketPrice *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetTicketPrice(&_LotteryAgent.TransactOpts, newTicketPrice)
}

// SetTicketPrice is a paid mutator transaction binding the contract method 0x15981650.
//
// Solidity: function setTicketPrice(uint256 newTicketPrice) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) SetTicketPrice(newTicketPrice *big.Int) (*types.Transaction, error) {
	return _LotteryAgent.Contract.SetTicketPrice(&_LotteryAgent.TransactOpts, newTicketPrice)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LotteryAgent *LotteryAgentTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LotteryAgent *LotteryAgentSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _LotteryAgent.Contract.TransferOwnership(&_LotteryAgent.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _LotteryAgent.Contract.TransferOwnership(&_LotteryAgent.TransactOpts, newOwner)
}

// WithdrawSupply is a paid mutator transaction binding the contract method 0xadd63bf1.
//
// Solidity: function withdrawSupply(uint256 amount, address receiver) returns()
func (_LotteryAgent *LotteryAgentTransactor) WithdrawSupply(opts *bind.TransactOpts, amount *big.Int, receiver common.Address) (*types.Transaction, error) {
	return _LotteryAgent.contract.Transact(opts, "withdrawSupply", amount, receiver)
}

// WithdrawSupply is a paid mutator transaction binding the contract method 0xadd63bf1.
//
// Solidity: function withdrawSupply(uint256 amount, address receiver) returns()
func (_LotteryAgent *LotteryAgentSession) WithdrawSupply(amount *big.Int, receiver common.Address) (*types.Transaction, error) {
	return _LotteryAgent.Contract.WithdrawSupply(&_LotteryAgent.TransactOpts, amount, receiver)
}

// WithdrawSupply is a paid mutator transaction binding the contract method 0xadd63bf1.
//
// Solidity: function withdrawSupply(uint256 amount, address receiver) returns()
func (_LotteryAgent *LotteryAgentTransactorSession) WithdrawSupply(amount *big.Int, receiver common.Address) (*types.Transaction, error) {
	return _LotteryAgent.Contract.WithdrawSupply(&_LotteryAgent.TransactOpts, amount, receiver)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LotteryAgent *LotteryAgentTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LotteryAgent.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LotteryAgent *LotteryAgentSession) Receive() (*types.Transaction, error) {
	return _LotteryAgent.Contract.Receive(&_LotteryAgent.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LotteryAgent *LotteryAgentTransactorSession) Receive() (*types.Transaction, error) {
	return _LotteryAgent.Contract.Receive(&_LotteryAgent.TransactOpts)
}

// LotteryAgentDrawFinalizedIterator is returned from FilterDrawFinalized and is used to iterate over the raw logs and unpacked data for DrawFinalized events raised by the LotteryAgent contract.
type LotteryAgentDrawFinalizedIterator struct {
	Event *LotteryAgentDrawFinalized // Event containing the contract specifics and raw log

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
func (it *LotteryAgentDrawFinalizedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LotteryAgentDrawFinalized)
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
		it.Event = new(LotteryAgentDrawFinalized)
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
func (it *LotteryAgentDrawFinalizedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LotteryAgentDrawFinalizedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LotteryAgentDrawFinalized represents a DrawFinalized event raised by the LotteryAgent contract.
type LotteryAgentDrawFinalized struct {
	DrawId         *big.Int
	WinningNumbers []bool
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterDrawFinalized is a free log retrieval operation binding the contract event 0xacd842f6a15015065eb47695a388cb958a5945d32252682b04651180b42bf275.
//
// Solidity: event DrawFinalized(uint256 indexed drawId, bool[] winningNumbers)
func (_LotteryAgent *LotteryAgentFilterer) FilterDrawFinalized(opts *bind.FilterOpts, drawId []*big.Int) (*LotteryAgentDrawFinalizedIterator, error) {

	var drawIdRule []interface{}
	for _, drawIdItem := range drawId {
		drawIdRule = append(drawIdRule, drawIdItem)
	}

	logs, sub, err := _LotteryAgent.contract.FilterLogs(opts, "DrawFinalized", drawIdRule)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentDrawFinalizedIterator{contract: _LotteryAgent.contract, event: "DrawFinalized", logs: logs, sub: sub}, nil
}

// WatchDrawFinalized is a free log subscription operation binding the contract event 0xacd842f6a15015065eb47695a388cb958a5945d32252682b04651180b42bf275.
//
// Solidity: event DrawFinalized(uint256 indexed drawId, bool[] winningNumbers)
func (_LotteryAgent *LotteryAgentFilterer) WatchDrawFinalized(opts *bind.WatchOpts, sink chan<- *LotteryAgentDrawFinalized, drawId []*big.Int) (event.Subscription, error) {

	var drawIdRule []interface{}
	for _, drawIdItem := range drawId {
		drawIdRule = append(drawIdRule, drawIdItem)
	}

	logs, sub, err := _LotteryAgent.contract.WatchLogs(opts, "DrawFinalized", drawIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LotteryAgentDrawFinalized)
				if err := _LotteryAgent.contract.UnpackLog(event, "DrawFinalized", log); err != nil {
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

// ParseDrawFinalized is a log parse operation binding the contract event 0xacd842f6a15015065eb47695a388cb958a5945d32252682b04651180b42bf275.
//
// Solidity: event DrawFinalized(uint256 indexed drawId, bool[] winningNumbers)
func (_LotteryAgent *LotteryAgentFilterer) ParseDrawFinalized(log types.Log) (*LotteryAgentDrawFinalized, error) {
	event := new(LotteryAgentDrawFinalized)
	if err := _LotteryAgent.contract.UnpackLog(event, "DrawFinalized", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LotteryAgentOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the LotteryAgent contract.
type LotteryAgentOwnershipTransferredIterator struct {
	Event *LotteryAgentOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *LotteryAgentOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LotteryAgentOwnershipTransferred)
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
		it.Event = new(LotteryAgentOwnershipTransferred)
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
func (it *LotteryAgentOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LotteryAgentOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LotteryAgentOwnershipTransferred represents a OwnershipTransferred event raised by the LotteryAgent contract.
type LotteryAgentOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_LotteryAgent *LotteryAgentFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*LotteryAgentOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _LotteryAgent.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentOwnershipTransferredIterator{contract: _LotteryAgent.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_LotteryAgent *LotteryAgentFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *LotteryAgentOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _LotteryAgent.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LotteryAgentOwnershipTransferred)
				if err := _LotteryAgent.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_LotteryAgent *LotteryAgentFilterer) ParseOwnershipTransferred(log types.Log) (*LotteryAgentOwnershipTransferred, error) {
	event := new(LotteryAgentOwnershipTransferred)
	if err := _LotteryAgent.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LotteryAgentPrizeClaimedIterator is returned from FilterPrizeClaimed and is used to iterate over the raw logs and unpacked data for PrizeClaimed events raised by the LotteryAgent contract.
type LotteryAgentPrizeClaimedIterator struct {
	Event *LotteryAgentPrizeClaimed // Event containing the contract specifics and raw log

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
func (it *LotteryAgentPrizeClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LotteryAgentPrizeClaimed)
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
		it.Event = new(LotteryAgentPrizeClaimed)
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
func (it *LotteryAgentPrizeClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LotteryAgentPrizeClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LotteryAgentPrizeClaimed represents a PrizeClaimed event raised by the LotteryAgent contract.
type LotteryAgentPrizeClaimed struct {
	Player      common.Address
	PrizeAmount *big.Int
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterPrizeClaimed is a free log retrieval operation binding the contract event 0x95681e512bc0fe659e195e06c283eada494316f3d801213e48e7101af92bf770.
//
// Solidity: event PrizeClaimed(address indexed player, uint256 prizeAmount)
func (_LotteryAgent *LotteryAgentFilterer) FilterPrizeClaimed(opts *bind.FilterOpts, player []common.Address) (*LotteryAgentPrizeClaimedIterator, error) {

	var playerRule []interface{}
	for _, playerItem := range player {
		playerRule = append(playerRule, playerItem)
	}

	logs, sub, err := _LotteryAgent.contract.FilterLogs(opts, "PrizeClaimed", playerRule)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentPrizeClaimedIterator{contract: _LotteryAgent.contract, event: "PrizeClaimed", logs: logs, sub: sub}, nil
}

// WatchPrizeClaimed is a free log subscription operation binding the contract event 0x95681e512bc0fe659e195e06c283eada494316f3d801213e48e7101af92bf770.
//
// Solidity: event PrizeClaimed(address indexed player, uint256 prizeAmount)
func (_LotteryAgent *LotteryAgentFilterer) WatchPrizeClaimed(opts *bind.WatchOpts, sink chan<- *LotteryAgentPrizeClaimed, player []common.Address) (event.Subscription, error) {

	var playerRule []interface{}
	for _, playerItem := range player {
		playerRule = append(playerRule, playerItem)
	}

	logs, sub, err := _LotteryAgent.contract.WatchLogs(opts, "PrizeClaimed", playerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LotteryAgentPrizeClaimed)
				if err := _LotteryAgent.contract.UnpackLog(event, "PrizeClaimed", log); err != nil {
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

// ParsePrizeClaimed is a log parse operation binding the contract event 0x95681e512bc0fe659e195e06c283eada494316f3d801213e48e7101af92bf770.
//
// Solidity: event PrizeClaimed(address indexed player, uint256 prizeAmount)
func (_LotteryAgent *LotteryAgentFilterer) ParsePrizeClaimed(log types.Log) (*LotteryAgentPrizeClaimed, error) {
	event := new(LotteryAgentPrizeClaimed)
	if err := _LotteryAgent.contract.UnpackLog(event, "PrizeClaimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LotteryAgentTicketPurchasedIterator is returned from FilterTicketPurchased and is used to iterate over the raw logs and unpacked data for TicketPurchased events raised by the LotteryAgent contract.
type LotteryAgentTicketPurchasedIterator struct {
	Event *LotteryAgentTicketPurchased // Event containing the contract specifics and raw log

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
func (it *LotteryAgentTicketPurchasedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LotteryAgentTicketPurchased)
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
		it.Event = new(LotteryAgentTicketPurchased)
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
func (it *LotteryAgentTicketPurchasedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LotteryAgentTicketPurchasedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LotteryAgentTicketPurchased represents a TicketPurchased event raised by the LotteryAgent contract.
type LotteryAgentTicketPurchased struct {
	Player        common.Address
	TicketId      *big.Int
	ChosenNumbers []*big.Int
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterTicketPurchased is a free log retrieval operation binding the contract event 0x2546fcbd360d6d1cc109f2e4ab1f9d658fe6067fd8d3640cd5dd9c3940e19d6f.
//
// Solidity: event TicketPurchased(address indexed player, uint256 ticketId, uint256[] chosenNumbers)
func (_LotteryAgent *LotteryAgentFilterer) FilterTicketPurchased(opts *bind.FilterOpts, player []common.Address) (*LotteryAgentTicketPurchasedIterator, error) {

	var playerRule []interface{}
	for _, playerItem := range player {
		playerRule = append(playerRule, playerItem)
	}

	logs, sub, err := _LotteryAgent.contract.FilterLogs(opts, "TicketPurchased", playerRule)
	if err != nil {
		return nil, err
	}
	return &LotteryAgentTicketPurchasedIterator{contract: _LotteryAgent.contract, event: "TicketPurchased", logs: logs, sub: sub}, nil
}

// WatchTicketPurchased is a free log subscription operation binding the contract event 0x2546fcbd360d6d1cc109f2e4ab1f9d658fe6067fd8d3640cd5dd9c3940e19d6f.
//
// Solidity: event TicketPurchased(address indexed player, uint256 ticketId, uint256[] chosenNumbers)
func (_LotteryAgent *LotteryAgentFilterer) WatchTicketPurchased(opts *bind.WatchOpts, sink chan<- *LotteryAgentTicketPurchased, player []common.Address) (event.Subscription, error) {

	var playerRule []interface{}
	for _, playerItem := range player {
		playerRule = append(playerRule, playerItem)
	}

	logs, sub, err := _LotteryAgent.contract.WatchLogs(opts, "TicketPurchased", playerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LotteryAgentTicketPurchased)
				if err := _LotteryAgent.contract.UnpackLog(event, "TicketPurchased", log); err != nil {
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

// ParseTicketPurchased is a log parse operation binding the contract event 0x2546fcbd360d6d1cc109f2e4ab1f9d658fe6067fd8d3640cd5dd9c3940e19d6f.
//
// Solidity: event TicketPurchased(address indexed player, uint256 ticketId, uint256[] chosenNumbers)
func (_LotteryAgent *LotteryAgentFilterer) ParseTicketPurchased(log types.Log) (*LotteryAgentTicketPurchased, error) {
	event := new(LotteryAgentTicketPurchased)
	if err := _LotteryAgent.contract.UnpackLog(event, "TicketPurchased", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
