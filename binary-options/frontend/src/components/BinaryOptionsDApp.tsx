// BinaryOptionsDApp.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Clock,
    ChevronRight
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";

import { DymensionConnect } from "./DymensionConnect";
import BtcPriceDisplay from "./BtcPriceDisplay";
import config from "../config/config"; // Import the new component

const FIXED_EXPIRATION = 1700000000;
const FIXED_BET_AMOUNT_AUOD = "10000";
const COUNT_DOWN_INTERVAL = 60;

const BinaryOptionsDApp = () => {
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(COUNT_DOWN_INTERVAL);
    const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betResult] = useState<null | string>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const betHistory = [
        { direction: 'up', entryPrice: 44950.20, finalPrice: 45100.30, result: 'win' },
        { direction: 'down', entryPrice: 45200.10, finalPrice: 45150.40, result: 'loss' },
    ];

    const dymensionConnectRef = useRef(null);

    const fetchBTCPrice = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const query = {
                get_price: {
                    base: config.base,
                    quote: config.quote,
                },
            };
            const encodedQuery = btoa(JSON.stringify(query));
            const url = `${config.apiBaseUrl}/cosmwasm/wasm/v1/contract/${config.contractAddress}/smart/${encodedQuery}`;

            console.log(`Fetching BTC price from contract: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch BTC price');

            const { data } = await response.json();
            if (!data?.price) throw new Error('Price data missing');

            setCurrentPrice(parseFloat(data.price));
        } catch (err) {
            console.error(err);
            setError('Unable to retrieve BTC price. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBTCPrice();

        const interval = setInterval(fetchBTCPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleDirectionSelect = (direction: 'up' | 'down') => {
        setSelectedDirection(direction);
        setShowConfirmation(true);
    };

    const handleConfirmBet = async () => {
        if (!selectedDirection) return;

        try {
            setIsLoading(true);

            console.log("Option placed!");

            if (dymensionConnectRef.current) {
                console.log("Sending message to Dymension Connect");
                let msg = {
                    type: "executeTx",
                    messages: [
                        {
                            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                            value: {
                                "sender": dymensionConnectRef.current.address,
                                "contract": "uod1aakfpghcanxtc45gpqlx8j3rq0zcpyf49qmhm9mdjrfx036h4z5sm3q99x",
                                "msg": new TextEncoder().encode(JSON.stringify({
                                    "place_option": {
                                        "direction": "up",
                                        "expiration": 1700000000,
                                        "bet_amount": {
                                            "denom": "auod",
                                            "amount": "10000"
                                        },
                                        "market": {
                                            "base": "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/ubtc",
                                            "quote": "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/uusdc"
                                        }
                                    }
                                })),
                                "funds": [
                                    {
                                        "denom": "auod",
                                        "amount": "10000"
                                    }
                                ]
                            }
                        },
                    ],
                };
                dymensionConnectRef.current.sendMessage(msg);
            }

        } catch (error) {
            console.error("Error placing bet:", error);
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <DymensionConnect ref={dymensionConnectRef} />
                <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Current BTC Price */}
                <BtcPriceDisplay
                    currentPrice={currentPrice}
                    isLoading={isLoading}
                    error={error}
                />

                {/* Time Progress Bar */}
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-1000"
                        style={{ width: `${(timeLeft / COUNT_DOWN_INTERVAL) * 100}%` }}
                    />
                </div>

                {/* Bet Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleDirectionSelect('up')}
                        className="bg-green-600 hover:bg-green-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                        disabled={isLoading || !dymensionConnectRef.current?.isConnected}
                    >
                        <ArrowUpCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Up</span>
                    </button>

                    <button
                        onClick={() => handleDirectionSelect('down')}
                        className="bg-red-600 hover:bg-red-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                        disabled={isLoading || !dymensionConnectRef.current?.isConnected}
                    >
                        <ArrowDownCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Down</span>
                    </button>
                </div>

                {/* Bet Information */}
                <div className="text-center text-gray-400">
                    Fixed bet amount: 0.01 AUOD
                </div>

                {/* Bet Result */}
                {betResult && (
                    <div
                        className={`text-center p-4 rounded-lg ${
                            betResult === 'win' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        <h3 className="text-2xl font-bold">
                            {betResult === 'win' ? 'You Won!' : 'You Lost'}
                        </h3>
                    </div>
                )}

                {/* Bet History Button */}
                <button
                    onClick={() => setShowHistory(true)}
                    className="w-full bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                    <span>Bet History</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Bet Confirmation Dialog */}
            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent className="bg-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Bet</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            You are betting 0.01 AUOD that the price
                            {selectedDirection === 'up' ? ' will go up ' : ' will go down '}
                            in the next block.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleConfirmBet}
                        >
                            Confirm Bet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bet History Dialog */}
            <AlertDialog open={showHistory} onOpenChange={setShowHistory}>
                <AlertDialogContent className="bg-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bet History</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4 p-4">
                        {betHistory.map((bet, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                            >
                                <div className="flex items-center space-x-3">
                                    {bet.direction === 'up' ? (
                                        <ArrowUpCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <ArrowDownCircle className="w-6 h-6 text-red-500" />
                                    )}
                                    <div>
                                        <div className="text-sm text-gray-400">
                                            Entry: ${bet.entryPrice.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Final: ${bet.finalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={
                                        bet.result === 'win' ? 'text-green-500' : 'text-red-500'
                                    }
                                >
                                  {bet.result.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => setShowHistory(false)}
                        >
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default BinaryOptionsDApp;