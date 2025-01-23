'use client'

// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';

import { DymensionConnect } from "../ui/DymensionConnect";
import config from "../../config/config";
import BtcPriceDisplay from "../ui/BtcPriceDisplay";
import BetHistoryList, {BetHistoryItem} from "../ui/BetHistoryList";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import BetButton from "../ui/BetButton";
import logo from "../../assets/logo.png";
import { useReward } from 'react-rewards';
import { BetOutcomeAnimation } from '../ui/BetOutcomeAnimation'



const PRICE_UPDATE_INTERVAL = 15;

const BinaryOptionsDApp = () => {
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(PRICE_UPDATE_INTERVAL);
    const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<string>("0");
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const [balanceError, setBalanceError] = useState<string | null>(null);
    const [lastTxHash, setLastTxHash] = useState<string | null>(null);
    const [txNotification, setTxNotification] = useState<{
        message: string;
        type: 'pending' | 'success' | 'error';
    } | null>(null);
    const [settlingIds, setSettlingIds] = useState<number[]>([]);
    const [currentOutcome, setCurrentOutcome] = useState<'win' | 'loss' | null>(null)

    const dymensionConnectRef = useRef(null);

    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        elementCount: 150,
        spread: 100,
        lifetime: 300,
        colors: ['#FFD700', '#FF0000', '#00FF00', '#0000FF']
    });
    const { reward: explosionReward } = useReward('explosionReward', 'emoji', {
        emoji: ['💥','😭','💸','🔥'],
        elementCount: 20,
        spread: 100,
        lifetime: 300
    });

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

            setSettlingIds(prev => [...prev, optionId]);

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
            setTimeout(async () => {
                await fetchBetHistory()
                const settledBet = betHistory.find(b => b.id === optionId)

                if (settledBet?.outcome === 'win') {
                    confettiReward()
                    new Audio('/sounds/win.mp3').play().catch(() => {})
                    setCurrentOutcome('win')
                } else if (settledBet?.outcome === 'loss') {
                    explosionReward()
                    new Audio('/sounds/loss.mp3').play().catch(() => {})
                    setCurrentOutcome('loss')
                }

                setTimeout(() => setCurrentOutcome(null), 3000)
                setSettlingIds(prev => prev.filter(id => id !== optionId))
            }, 5000)
        } catch (error) {
            console.error("Error settling option:", error);
        }
    };

    const handleConnectChange = (isConnected: boolean) => {
        if (isConnected) {
            fetchBetHistory();
            fetchUserBalance();
        } else {
            setBetHistory([]);
            setUserBalance("0");
        }
    };

    const fetchBetHistory = async () => {
        try {
            const userAddress = dymensionConnectRef.current?.address;
            if (!userAddress) return;

            const query = {
                list_options_by_user: {
                    user: userAddress,
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
                direction: option.direction === "up" ? "up" : "down",
                strikePrice: parseFloat(option.strike_price),
                expiration: option.expiration,
                betAmount: `${parseInt(option.bet_amount.amount) / config.denomPrecision} ${config.screenDenom}`,
                outcome: option.outcome,
                settled: option.settled
            }));

            setBetHistory(formattedHistory);
        } catch (err) {
            console.error("Failed to load bet history:", err);
        }
    };

    useEffect(() => {
        if (txNotification) {
            const timer = setTimeout(() => {
                setTxNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [txNotification]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const checkAndFetchBalance = async () => {
            if (dymensionConnectRef.current?.address) {
                await fetchUserBalance();
                await fetchBetHistory();
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
                    return PRICE_UPDATE_INTERVAL;
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

        const historyInterval = setInterval(fetchBetHistory, 30000);

        return () => {
            clearInterval(historyInterval);
        };
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

            if (dymensionConnectRef.current) {
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
                                            "denom": config.denom,
                                            "amount": config.betAmount
                                        },
                                        "market": {
                                            "base": config.base,
                                            "quote": config.quote,
                                        }
                                    }
                                })),
                                "funds": [
                                    {
                                        "denom": config.denom,
                                        "amount": config.betAmount
                                    }
                                ]
                            }
                        },
                    ],
                };

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

    const handleTxStatus = (status: 'success' | 'error', txData?: any) => {
        console.log('[DEBUG] Transaction status:', status, txData);

        setLastTxHash(txData?.hash || null);

        // Handle non-critical errors
        if (status === 'success' && txData?.isNonCriticalError) {
            setTxNotification({
                message: 'Transaction successful with warnings (check logs)',
                type: 'pending'
            });
        } else {
            setTxNotification({
                message: status === 'success'
                    ? 'Transaction confirmed in block!'
                    : `Error (Code: ${txData?.rawData?.nativeResponse?.code || 'unknown'})`,
                type: status
            });
        }

        if (status === 'success') {
            setTimeout(() => {
                fetchBetHistory();
                fetchUserBalance();
            }, 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="fixed bottom-4 right-4 space-y-2 z-[1000]">
                {txNotification && (
                    <div className={`p-4 rounded-lg ${
                        txNotification.type === 'pending' ? 'bg-blue-600' :
                            txNotification.type === 'success' ? 'bg-green-600' :
                                'bg-red-600'
                    } text-white flex items-center space-x-3 min-w-[300px]`}>
                        {txNotification.type === 'pending' && (
                            <div className="animate-spin">🌀</div>
                        )}
                        <div className="flex-1">
                            <div className="font-medium">{txNotification.message}</div>
                            {txNotification.type === 'success' && (
                                <div className="text-xs mt-1 opacity-80">
                                    TX Hash: {lastTxHash?.slice(0, 6)}...{lastTxHash?.slice(-4)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-10 px-4 py-4 bg-gray-900">
                <div className="bg-gray-800 px-4 py-2 rounded-lg min-w-[160px] text-center">
                    {isBalanceLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">🌀</span>
                            Loading...
                        </div>
                    ) : balanceError ? (
                        <div className="text-red-400 text-sm">{balanceError}</div>
                    ) : (
                        `Balance: ${(Number(userBalance) / config.denomPrecision).toFixed(2)} ${config.screenDenom}`
                    )}
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-40 h-40 object-contain hover:scale-105 transition-transform"
                    />
                </div>

                <DymensionConnect
                    ref={dymensionConnectRef}
                    onTxStatus={handleTxStatus}
                    onConnectChange={handleConnectChange}
                />
            </div>

            <div className="space-y-8">
                <BtcPriceDisplay
                    currentPrice={currentPrice}
                    isLoading={isLoading}
                    error={error}
                />

                <div className="text-center animate-pulse">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-4">
                        🚨 BITCOIN SHOWDOWN! 🚨
                    </h1>
                    <h2 className="text-3xl font-bold text-gray-200">
                        WILL BTC PUMP 🚀 OR DUMP 💥 IN 5 MINUTES?
                        <span
                            className="block mt-4 text-2xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-extrabold">
            BET NOW - DOUBLE YOUR MONEY!
        </span>
                    </h2>
                    <div className="mt-6 text-xl text-gray-400 flex justify-center items-center gap-2">
                        <span>🔥 LIMITED TIME ACTION 🔥</span>
                    </div>
                </div>

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

                <div className="text-center text-gray-400">
                    Fixed bet amount: 1 {config.screenDenom}
                </div>
            </div>

            <ConfirmationDialog
                isOpen={showConfirmation}
                direction={selectedDirection}
                onConfirm={handleConfirmBet}
                onCancel={() => setShowConfirmation(false)}
            />

            <div
                className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 h-[300px] overflow-y-auto border-t border-gray-700">
                <h3 className="text-lg font-bold mb-4">Active Bets</h3>
                <BetHistoryList
                    history={betHistory}
                    onSettle={handleSettleOption}
                    settlingIds={settlingIds}
                />
            </div>
            <BetOutcomeAnimation outcome={currentOutcome} />
            <span id="confettiReward" className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"/>
            <span id="explosionReward" className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"/>
        </div>
    );
};

export default BinaryOptionsDApp;