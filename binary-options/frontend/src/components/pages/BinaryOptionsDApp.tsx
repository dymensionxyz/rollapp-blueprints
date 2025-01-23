'use client'

// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

import { DymensionConnect } from "../ui/DymensionConnect";
import config from "../../config/config";
import BtcPriceDisplay from "../ui/BtcPriceDisplay";
import BetHistoryDialog, { BetHistoryItem } from "../ui/BetHistoryDialog";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import ProgressBar from "../ui/ProgressBar";
import BetButton from "../ui/BetButton";
import logo from "../../assets/logo.png";

const COUNT_DOWN_INTERVAL = 15;

const BinaryOptionsDApp = () => {
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(COUNT_DOWN_INTERVAL);
    const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
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
    const [expiredBetsCount, setExpiredBetsCount] = useState(0);


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
            setTimeout(() => {
                fetchBetHistory();
                setSettlingIds(prev => prev.filter(id => id !== optionId));
            }, 5000);
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
        const count = betHistory.filter(bet =>
            !bet.settled && Date.now() > bet.expiration * 1000
        ).length;
        setExpiredBetsCount(count);
    }, [betHistory]);

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
            <div className="fixed bottom-4 right-4 space-y-2">
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
                    Fixed bet amount: 1 {config.screenDenom}
                </div>

                {/* Bet History Button */}
                <button
                    onClick={() => setShowHistory(true)}
                    className="w-full bg-gray-800 p-4 rounded-lg flex justify-between items-center relative"
                >
                    <div className="flex items-center gap-2">
                        <span>Bet History</span>
                        {expiredBetsCount > 0 && (
                            <span
                                className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {expiredBetsCount}
                        </span>
                        )}
                    </div>
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
                settlingIds={settlingIds}
            />
        </div>
    );
};

export default BinaryOptionsDApp;