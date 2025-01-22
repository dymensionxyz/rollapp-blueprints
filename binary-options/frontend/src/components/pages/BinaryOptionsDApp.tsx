// BinaryOptionsDApp.jsx
'use client'

// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronRight
} from 'lucide-react';

import {DymensionConnect} from "../ui/DymensionConnect";
import config from "../../config/config";
import BtcPriceDisplay from "../ui/BtcPriceDisplay";
import BetHistoryDialog, {BetHistoryItem} from "../ui/BetHistoryDialog";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import ProgressBar from "../ui/ProgressBar";
import BetButton from "../ui/BetButton";

const COUNT_DOWN_INTERVAL = 60;

const BinaryOptionsDApp = () => {
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(COUNT_DOWN_INTERVAL);
    const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betResult] = useState<null | string>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<string>("0");
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const [balanceError, setBalanceError] = useState<string | null>(null);
    const [isTxPending, setIsTxPending] = useState(false);
    const [txNotification, setTxNotification] = useState<{
        message: string;
        type: 'pending' | 'success' | 'error';
    } | null>(null);

    const dymensionConnectRef = useRef(null);

    const fetchUserBalance = async () => {
        try {
            setIsBalanceLoading(true);
            setBalanceError(null);

            const address = dymensionConnectRef.current?.address;
            if (!address) {
                setBalanceError("Wallet not connected");
                return;
            }

            const response = await fetch(
                `${config.apiBaseUrl}/cosmos/bank/v1beta1/balances/${address}`
            );

            if (!response.ok) throw new Error("Error fetching balance");

            const { balances } = await response.json();
            const auodBalance = balances.find((c: any) => c.denom === "auod")?.amount || "0";

            setUserBalance(auodBalance);
        } catch (err) {
            console.error("Balance fetch failed:", err);
            setBalanceError("Error fetching balance");
        } finally {
            setIsBalanceLoading(false);
        }
    };

    const handleSettleOption = async (optionId: number) => {
        try {
            if (!dymensionConnectRef.current?.address) return;

            const msg = {
                type: "executeTx",
                messages: [
                    {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: {
                            sender: dymensionConnectRef.current.address,
                            contract: config.binaryOptionsContractAddress,
                            msg: new TextEncoder().encode(
                                JSON.stringify({
                                    settle_option: { option_id: optionId },
                                })
                            ),
                            funds: [],
                        },
                    },
                ],
            };

            await dymensionConnectRef.current.sendMessage(msg);
            setTimeout(fetchBetHistory, 5000);
        } catch (error) {
            console.error("Error settling option:", error);
        }
    };

    const fetchBetHistory = async () => {
        try {
            const query = {
                list_options: {
                    start_after: null,
                    limit: 10
                }
            };

            const encodedQuery = btoa(JSON.stringify(query));
            const url = `${config.apiBaseUrl}/cosmwasm/wasm/v1/contract/${config.binaryOptionsContractAddress}/smart/${encodedQuery}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error fetching history');

            const { data } = await response.json();
            const formattedHistory = data.options.map((option: any) => ({
                id: option.id,
                direction: option.direction === "Up" ? "up" : "down",
                strikePrice: parseFloat(option.strike_price),
                expiration: option.expiration,
                betAmount: `${parseInt(option.bet_amount.amount) / 1000000} AUOD`,
                outcome: option.outcome,
                settled: option.settled
            }));

            setBetHistory(formattedHistory);
        } catch (err) {
            console.error("Failed to load bet history:", err);
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const checkAndFetchBalance = async () => {
            if (dymensionConnectRef.current?.address) {
                await fetchUserBalance();
                clearInterval(intervalId);
            }
        };

        intervalId = setInterval(checkAndFetchBalance, 500);

        return () => clearInterval(intervalId);
    }, [dymensionConnectRef.current?.address]);


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
            const url = `${config.apiBaseUrl}/cosmwasm/wasm/v1/contract/${config.oracleContractAddress}/smart/${encodedQuery}`;

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
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    fetchBTCPrice();
                    return COUNT_DOWN_INTERVAL;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchBTCPrice();
        fetchUserBalance();
        fetchBetHistory();
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
                                "contract": `${config.binaryOptionsContractAddress}`,
                                "msg": new TextEncoder().encode(JSON.stringify({
                                    "place_option": {
                                        "direction": selectedDirection,
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

                setIsTxPending(true);
                setTxNotification({ message: 'Sending transaction...', type: 'pending' });

                dymensionConnectRef.current.sendMessage(msg);

                setTimeout(() => {
                    fetchBetHistory();
                    fetchUserBalance();
                }, 5000);
            }

        } catch (error) {
            console.error("Error placing bet:", error);
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const handleTxStatus = (status: 'success' | 'error') => {
        setTxNotification({
            message: status === 'success'
                ? 'Transaction successfully sent!'
                : 'Transaction failed',
            type: status
        });
        setIsTxPending(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="fixed bottom-4 right-4 space-y-2">
                {txNotification && (
                    <div className={`p-4 rounded-lg ${
                        txNotification.type === 'pending' ? 'bg-blue-600' :
                            txNotification.type === 'success' ? 'bg-green-600' :
                                'bg-red-600'
                    } text-white flex items-center space-x-3`}>
                        {txNotification.type === 'pending' && (
                            <div className="animate-spin">🌀</div>
                        )}
                        <span>{txNotification.message}</span>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <DymensionConnect ref={dymensionConnectRef} onTxStatus={handleTxStatus}/>
                <div className="bg-gray-800 px-4 py-2 rounded-lg min-w-[160px] text-center">
                    {isBalanceLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">🌀</span>
                            Loading...
                        </div>
                    ) : balanceError ? (
                        <div className="text-red-400 text-sm">{balanceError}</div>
                    ) : (
                        `Balance: ${(Number(userBalance) / 1000000000000000000).toFixed(2)} AUOD`
                    )}
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

                <ProgressBar
                    progress={(timeLeft / COUNT_DOWN_INTERVAL) * 100}
                    label={`Next price update in ${timeLeft}s`}
                />

                {/* Bet Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <BetButton
                        direction="up"
                        onSelect={handleDirectionSelect}
                        disabled={isLoading || !dymensionConnectRef.current?.isConnected}
                    />
                    <BetButton
                        direction="down"
                        onSelect={handleDirectionSelect}
                        disabled={isLoading || !dymensionConnectRef.current?.isConnected}
                    />
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
                    <ChevronRight className="w-5 h-5"/>
                </button>
            </div>

            <ConfirmationDialog
                isOpen={showConfirmation}
                direction={selectedDirection}
                onConfirm={handleConfirmBet}
                onCancel={() => setShowConfirmation(false)}
            />

            <BetHistoryDialog
                isOpen={showHistory}
                history={betHistory}
                onClose={() => setShowHistory(false)}
                onSettle={handleSettleOption}
            />
        </div>
    );
};

export default BinaryOptionsDApp;