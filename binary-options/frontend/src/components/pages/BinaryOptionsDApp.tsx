'use client';

// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import TradingViewWidget from '../trading-view-widget/TradingViewWidget';

import { DymensionConnect } from '../ui/DymensionConnect';
import config from '../../config/config';
import BtcPriceDisplay from '../ui/BtcPriceDisplay';
import BetHistoryList, { BetHistoryItem } from '../ui/BetHistoryList';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import BetButton from '../ui/BetButton';
import logo from '../../assets/logo.png';
import { useReward } from 'react-rewards';
import { BetOutcomeAnimation } from '../ui/BetOutcomeAnimation';
import { BetAmountSelector } from '../ui/BetAmountSelector';


const PRICE_UPDATE_INTERVAL = 15;

const BinaryOptionsDApp = () => {
    const [ currentPrice, setCurrentPrice ] = useState<number | null>(null);
    const [ timeLeft, setTimeLeft ] = useState(PRICE_UPDATE_INTERVAL);
    const [ selectedDirection, setSelectedDirection ] = useState<'up' | 'down' | null>(null);
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ betHistory, setBetHistory ] = useState<BetHistoryItem[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);
    const [ userBalance, setUserBalance ] = useState<string>('0');
    const [ isBalanceLoading, setIsBalanceLoading ] = useState(false);
    const [ balanceError, setBalanceError ] = useState<string | null>(null);
    const [ lastTxHash, setLastTxHash ] = useState<string | null>(null);
    const [ txNotification, setTxNotification ] = useState<{
        message: string;
        type: 'pending' | 'success' | 'error';
    } | null>(null);
    const [ settlingIds, setSettlingIds ] = useState<number[]>([]);
    const [ currentOutcome, setCurrentOutcome ] = useState<'win' | 'loss' | null>(null);
    const [ betAmount, setBetAmount ] = useState<string>(config.betAmount);

    const dymensionConnectRef = useRef<{
        address?: string;
        isConnected?: boolean;
        sendMessage?: (msg: any) => void;
    }>(null);

    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        elementCount: 150,
        spread: 100,
        lifetime: 300,
        colors: [ '#FFD700', '#FF0000', '#00FF00', '#0000FF' ],
    });
    const { reward: explosionReward } = useReward('explosionReward', 'emoji', {
        emoji: [ '💥', '😭', '💸', '🔥' ],
        elementCount: 20,
        spread: 100,
        lifetime: 300,
    });

    const fetchUserBalance = async () => {
        try {
            setIsBalanceLoading(true);
            setBalanceError(null);

            const address = dymensionConnectRef.current?.address;
            if (!address) {
                setBalanceError('Wallet not connected');
                return;
            }

            const response = await fetch(
                `${config.apiBaseUrl}/cosmos/bank/v1beta1/balances/${address}`,
            );

            if (!response.ok) {
                throw new Error('Error fetching balance');
            }

            const { balances } = await response.json();
            const auodBalance = balances.find((c: any) => c.denom === 'auod')?.amount || '0';

            setUserBalance(auodBalance);
        } catch (err) {
            console.error('Balance fetch failed:', err);
            setBalanceError('Error fetching balance');
        } finally {
            setIsBalanceLoading(false);
        }
    };

    const handleSettleOption = async (optionId: number) => {
        try {
            if (!dymensionConnectRef.current?.address) {
                return;
            }

            setSettlingIds(prev => [ ...prev, optionId ]);

            const msg = {
                type: 'executeTx',
                messages: [
                    {
                        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                        value: {
                            sender: dymensionConnectRef.current.address,
                            contract: config.binaryOptionsContractAddress,
                            msg: new TextEncoder().encode(
                                JSON.stringify({
                                    settle_option: { option_id: optionId },
                                }),
                            ),
                            funds: [],
                        },
                    },
                ],
            };

            await dymensionConnectRef.current.sendMessage(msg);
        } catch (error) {
            console.error('Error settling option:', error);
            setSettlingIds(prev => prev.filter(id => id !== optionId));
        }
    };

    const handleConnectChange = (isConnected: boolean) => {
        if (isConnected) {
            fetchBetHistory();
            fetchUserBalance();
        } else {
            setBetHistory([]);
            setUserBalance('0');
        }
    };

    const fetchBetHistory = async () => {
        try {
            const userAddress = dymensionConnectRef.current?.address;
            if (!userAddress) {
                return [];
            }

            const query = {
                list_options_by_user: {
                    user: userAddress,
                    start_after: null,
                    limit: 10,
                },
            };

            const encodedQuery = btoa(JSON.stringify(query));
            const url = `${config.apiBaseUrl}/cosmwasm/wasm/v1/contract/${config.binaryOptionsContractAddress}/smart/${encodedQuery}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching history');
            }

            const { data } = await response.json();
            const formattedHistory = data.options.map((option: any) => ({
                id: option.id,
                direction: option.direction === 'up' ? 'up' : 'down',
                strikePrice: parseFloat(option.strike_price),
                expiration: Number(option.expiration) + 5,
                betAmount: `${parseInt(option.bet_amount.amount) / config.denomPrecision} ${config.screenDenom}`,
                outcome: option.outcome,
                settled: option.settled,
            }));

            setBetHistory(formattedHistory);
            return formattedHistory;
        } catch (err) {
            console.error('Failed to load bet history:', err);
            return [];
        }
    };

    useEffect(() => {
        if (txNotification) {
            const timer = setTimeout(() => {
                setTxNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [ txNotification ]);

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
    }, [ dymensionConnectRef.current?.address ]);

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
            if (!response.ok) {
                throw new Error('Failed to fetch BTC price');
            }

            const { data } = await response.json();
            if (!data?.price) {
                throw new Error('Price data missing');
            }

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
        const fetchData = async () => {
            await Promise.all([
                fetchBTCPrice(),
                fetchUserBalance(),
                fetchBetHistory(),
            ]);
        };

        const interval = setInterval(fetchBetHistory, 30000);
        fetchData();

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [ timeLeft ]);

    const handleDirectionSelect = (direction: 'up' | 'down') => {
        setSelectedDirection(direction);
        setShowConfirmation(true);
    };

    const handleConfirmBet = async () => {
        if (!selectedDirection || !betAmount) {
            return;
        }

        if (Number(userBalance) < Number(betAmount) * config.denomPrecision) {
            setTxNotification({
                message: 'Insufficient balance',
                type: 'error',
            });

            return;
        }

        try {
            setIsLoading(true);

            if (dymensionConnectRef.current) {
                let msg = {
                    type: 'executeTx',
                    messages: [
                        {
                            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                            value: {
                                'sender': dymensionConnectRef.current.address,
                                'contract': `${config.binaryOptionsContractAddress}`,
                                'msg': new TextEncoder().encode(JSON.stringify({
                                    'place_option': {
                                        'direction': selectedDirection,
                                        'bet_amount': {
                                            'denom': config.denom,
                                            'amount': BigInt(Number(betAmount) * config.denomPrecision).toString(),
                                        },
                                        'market': {
                                            'base': config.base,
                                            'quote': config.quote,
                                        },
                                    },
                                })),
                                'funds': [
                                    {
                                        'denom': config.denom,
                                        'amount': BigInt(Number(betAmount) * config.denomPrecision).toString(),
                                    },
                                ],
                            },
                        },
                    ],
                };

                setTxNotification({ message: 'Sending transaction...', type: 'pending' });

                dymensionConnectRef.current.sendMessage(msg);
            }

        } catch (error) {
            console.error('Error placing bet:', error);
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const handleTxStatus = (status: 'success' | 'error', txData?: any) => {
        setLastTxHash(txData?.hash || null);

        if (status === 'success' && txData?.isNonCriticalError) {
            setTxNotification({
                message: 'Transaction successful with warnings (check logs)',
                type: 'pending',
            });
        } else {
            setTxNotification({
                message: status === 'success'
                    ? 'Transaction confirmed in block!'
                    : `Error (Code: ${txData?.rawData?.nativeResponse?.code || 'unknown'})`,
                type: status,
            });
        }

        if (status === 'success') {
            try {
                const rawLog = txData.rawData.nativeResponse?.rawLog;
                const logs = JSON.parse(rawLog);

                const settleEvent = logs.flatMap((log: any) =>
                    log.events?.filter((e: any) =>
                        e.type === 'wasm' &&
                        e.attributes?.some((a: any) => a.key === 'action' && a.value === 'settle_option'),
                    ),
                ).flat()[0];

                if (settleEvent) {
                    const resultAttr = settleEvent.attributes.find((a: any) => a.key === 'result');
                    const optionIdAttr = settleEvent.attributes.find((a: any) => a.key === 'option_id');

                    if (resultAttr && optionIdAttr) {
                        const outcome = resultAttr.value === 'won' ? 'win' : 'loss';
                        const optionId = parseInt(optionIdAttr.value);

                        setBetHistory(prev => prev.map(bet =>
                            bet.id === optionId ? { ...bet, settled: true, outcome: outcome === 'win' } : bet,
                        ));

                        if (outcome === 'win') {
                            confettiReward();
                            setCurrentOutcome('win');
                        } else {
                            explosionReward();
                            setCurrentOutcome('loss');
                        }

                        setTimeout(() => setCurrentOutcome(null), 3000);
                    }
                }
            } catch (error) {
                console.error('Error parsing transaction logs:', error);
            }
        }

        fetchUserBalance();
        fetchBetHistory();
    };

    return (
        <div className='min-h-screen bg-gray-900 text-white p-4 pb-16'>
            <div className='fixed bottom-4 right-4 space-y-2 z-[1000]'>
                {txNotification && (
                    <div
                        className={`p-4 rounded-lg ${
                            txNotification.type === 'pending' ? 'bg-blue-600' :
                                txNotification.type === 'success' ? 'bg-green-600' :
                                    'bg-red-600'
                        } text-white flex items-center space-x-3 min-w-[300px]`}
                    >
                        {txNotification.type === 'pending' && (
                            <div className='animate-spin'>🌀</div>
                        )}
                        <div className='flex-1'>
                            <div className='font-medium'>{txNotification.message}</div>
                            {txNotification.type === 'success' && (
                                <div className='text-xs mt-1 opacity-80'>
                                    TX Hash: {lastTxHash?.slice(0, 6)}...{lastTxHash?.slice(-4)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className='flex justify-between items-center px-4 py-4 bg-gray-900 h-20 max-[480px]:p-0'>
                <img
                    src={logo}
                    alt='Logo'
                    className='-ml-[0.7rem] w-32 h-32 object-contain hover:scale-105 transition-transform'
                />

                <DymensionConnect
                    ref={dymensionConnectRef}
                    onTxStatus={handleTxStatus}
                    onConnectChange={handleConnectChange}
                />
            </div>

            <div className='space-y-4 min-[720px]:space-y-8 max-w-[720px] mx-auto min-[720px]:mt-[-32px]'>
                <BtcPriceDisplay
                    currentPrice={currentPrice}
                    isLoading={isLoading}
                    error={error}
                />

                <TradingViewWidget />

                <div className='text-center animate-pulse'>
                    <h2 className='text-xl min-[720px]:text-2xl font-bold text-[#f5f5f5]'>
                        WILL BTC PUMP 🚀 OR DUMP 💥 IN 60 SECONDS?
                        <span
                            className='block mt-2 min-[720px]:mt-4 text-[18px] min-[720px]:text-xl min-[720px]:text-xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-extrabold'
                        >
            BET NOW - DOUBLE YOUR MONEY!
        </span>
                    </h2>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <BetButton
                        direction='up'
                        onSelect={handleDirectionSelect}
                        disabled={(isLoading && !currentPrice) || !dymensionConnectRef.current?.isConnected}
                    />
                    <BetButton
                        direction='down'
                        onSelect={handleDirectionSelect}
                        disabled={(isLoading && !currentPrice) || !dymensionConnectRef.current?.isConnected}
                    />
                </div>

                <div className='text-center text-gray-400'>
                    <BetAmountSelector
                        balance={Number(userBalance)}
                        selectedAmount={Number(betAmount)}
                        onAmountChange={(amount) => setBetAmount(String(amount))}
                    />
                </div>
            </div>

            <ConfirmationDialog
                isOpen={showConfirmation}
                direction={selectedDirection}
                onConfirm={handleConfirmBet}
                onCancel={() => setShowConfirmation(false)}
                betAmount={Number(betAmount)}
            />

            <div className='mt-8 bg-gray-800 p-4 max-w-[720px] mx-auto rounded-lg border border-gray-700  overflow-y-auto'>
                <h3 className='text-lg font-bold mb-4'>Active Bets</h3>
                <BetHistoryList
                    history={betHistory}
                    onSettle={handleSettleOption}
                    settlingIds={settlingIds}
                />
            </div>
            <BetOutcomeAnimation outcome={currentOutcome} />
            <span id='confettiReward' className='fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none' />
            <span id='explosionReward' className='fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none' />
        </div>
    );
};

export default BinaryOptionsDApp;
