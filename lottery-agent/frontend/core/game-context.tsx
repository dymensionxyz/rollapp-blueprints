'use client';

import { LOTTERY_ABI } from '@/core/contracts/lottery-abi';
import {
    LOTTERY_CONTRACT_ADDRESS, DEFAULT_BROADCAST_ATTEMPTS, JSON_RPC, ContractMessage, LotteryAgentFunction
} from '@/core/types';
import { ethers, formatEther } from 'ethers';
import { showErrorToast } from '@/core/utils/toast-utils';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useCountdown } from '@/components/CountdownTimer'
import Web3 from 'web3';
import LotteryAgent from "@/components/LotteryAgent";


const web3 = new Web3(new Web3.providers.HttpProvider(JSON_RPC));
const lotteryContract = new web3.eth.Contract(LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS);

interface Ticket {
    numbers: number[]
    isWinner: boolean
    isClaimed: boolean
    id: number
}


export interface DrawHistoryItem {
    id: number
    ticketCount: number
    winningNumbers: number[]
    winnersCount: number
}

interface GameContextValue {
    address: string;
    hexAddress: string;
    broadcastingMessage?: string;
    contractMessageToExecute?: ContractMessage
    setContractMessageExecuted: () => void;
    setAddresses: (address: string, hexAddress: string) => void;
    setBalance: (value?: number) => void;
    setTicketNumbers: (value?: number[]) => void;
    purchaseTicket: () => void;
    handleTxResponse: (response: any) => void;
    curDrawTotalWinnings: number;
    ticketCost: string;
    houseBalance: string;
    ticketBought: boolean;
    setTicketBought: (value: boolean) => void;
    drawCount: number;
    requestDrawShortInfo: (value: number) => void;
    requestedDrawShortInfo: DrawInfo | null
    requestedTickets: Ticket[]
    requestUserTickets: (v1: number, v2: string) => void;
    setRequestedTickets: (v: Ticket[]) => void;
    setRequestedDrawShortInfo: (v: DrawInfo | null) => void;
    claimPrize: (v1: number, v2: number) => void;
}

export type DrawInfo = {
    totalWinnings: number;
    winningNumbers: Array<number>; // Adjust this if the elements are not of type number
    winnersCount: number;
    ticketCount: number;
};

export const GameContext = createContext<GameContextValue>({} as GameContextValue);

export const useGame = (): GameContextValue => useContext(GameContext);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
    const [ address, setAddress ] = useState('');
    const [ hexAddress, setHexAddress ] = useState('');
    const [ broadcastingMessage, setBroadcastingMessage ] = useState<string>();
    const [ balance, setBalance ] = useState<number>();
    const [ broadcastingAttempts, setBroadcastingAttempts ] = useState(0);
    const [ contractMessageToExecute, setContractMessageToExecute ] = useState<ContractMessage>();
    const [ ticketNumbers, setTicketNumbers ] = useState<number[]>();
    const [ gameStatusLoading, setGameStatusLoading ] = useState(true);
    const [ curDrawTotalWinnings, setCurDrawTotalWinnings ] = useState<number>(0);
    const [ ticketCost, setTicketCost] = useState<string>('0');
    const [ houseBalance, setHouseBalance ] = useState<string>('0');
    const [ ticketBought, setTicketBought ] = useState<boolean>(false);
    const [ drawCount, setDrawCount ] = useState<number>(0);
    const [ requestedDrawShortInfo, setRequestedDrawShortInfo ] = useState<DrawInfo | null>(null)
    const [ requestedTickets, setRequestedTickets ] = useState<Ticket[]>([]);
    const [ prepareFinalizeCalled, setPrepareFinalizeCalled ] = useState<boolean>(false);

    const {
        setTimeLeft
    } = useCountdown();

    const updateGameStatus = useCallback((lastGameResult?: boolean) => {
        console.log("updating game status...");
        if (hexAddress === undefined || balance === undefined) {
            return;
        }
        if (!hexAddress) {
            setGameStatusLoading(false);
            setBroadcastingMessage(undefined);
            setBroadcastingAttempts(0);
            return;
        }
        const promises = [
            lotteryContract.methods.getCurDrawTotalWinnings().call()
                .then((result) => setCurDrawTotalWinnings(Number(formatEther(result?.toString() || '0')))),
            lotteryContract.methods.getCurDrawRemainingTime().call()
                .then((result) => {
                    const remainingTimeSeconds = Number(result?.toString() || '0'); // оставшееся время в секундах
                    const currentTimeSeconds = Math.floor(Date.now() / 1000); // текущее время в секундах
                    const timeLeft = Math.max(remainingTimeSeconds - currentTimeSeconds, 0); // разница во времени в секундах
                    setTimeLeft(timeLeft);
                })
                .catch((error) => {
                    console.error('Error getting remaining time:', error);
                    setTimeLeft(0); // Или другой подходящий способ обработки ошибки
                }),
            lotteryContract.methods.ticketPrice().call()
                .then((result) => setTicketCost(formatEther(result?.toString() || '0'))),
            lotteryContract.methods.activeBalance().call()
                .then((result) => setHouseBalance(formatEther(result?.toString() || '0'))),
            lotteryContract.methods.getDrawCount().call()
                .then((result) => setDrawCount(Number(result?.toString() || '0'))),
            lotteryContract.methods.curDraw().call()
                .then((result) => setPrepareFinalizeCalled(result?.prepareFinalizeCalled))
        ];

        Promise.all(promises).catch((error) => {
            console.error(error);
            showErrorToast(`Can't load data, please try again later`);
        }).finally(() => setGameStatusLoading(false));
    }, [ balance, hexAddress ]);

    useEffect(() => updateGameStatus(true), [ updateGameStatus ]);

    const purchaseTicket = useCallback((retry?: boolean) => {
        if (!hexAddress || contractMessageToExecute || (!retry && broadcastingMessage)) {
            return;
        }

        if (prepareFinalizeCalled) {
            showErrorToast(`Purchasing tickets for the current draw is blocked. Winners computing process has been started.`);
            return;
        }

        const data = lotteryContract.methods.purchaseTicket(ticketNumbers).encodeABI();
        const value = ethers.parseEther(ticketCost).toString();
        setContractMessageToExecute({ address: LOTTERY_CONTRACT_ADDRESS, data, value});
        setBroadcastingMessage(LotteryAgentFunction.purchaseTicket);
        if (!retry) {
            setBroadcastingAttempts(DEFAULT_BROADCAST_ATTEMPTS);
        }
    }, [ broadcastingMessage, ticketNumbers, contractMessageToExecute, hexAddress ]);

    const claimPrize = useCallback((drawId: number, ticketId: number) => {
        if (!hexAddress) {
            return;
        }

        const data = lotteryContract.methods.claimPrize(drawId, ticketId).encodeABI();
        setContractMessageToExecute({ address: LOTTERY_CONTRACT_ADDRESS, data });
    }, [ hexAddress ]);

    const requestDrawShortInfo = useCallback((idx: number) => {
        lotteryContract.methods.getDrawShortInfo(idx).call()
            .then((result: any) => {
                const drawInfo: DrawInfo = {
                    totalWinnings: Number(formatEther(result.totalWinnings.toString() || '0')),
                    winningNumbers: result.winningNumbers,
                    winnersCount: result.winnersCount,
                    ticketCount: result.ticketCount,
                };
                setRequestedDrawShortInfo(drawInfo);
            })
            .catch((error: any) => {
                // Handle the error appropriately
                console.error("Error fetching draw short info:", error);
            });
    }, []);

    const requestUserTickets = useCallback((drawId: number, userAddress: string) => {
        lotteryContract.methods.getUserTickets(drawId, userAddress).call()
            .then((result: any) => {
                const tickets: Ticket[] = result.map((ticket: any) => {
                    const numbers = ticket.chosenNumbers
                        .map((isChosen: boolean, index: number) => isChosen ? index : null)
                        .filter((index: number | null) => index !== null);

                    return {
                        numbers,
                        isClaimed: ticket.claimed,
                        isWinner: ticket.winner,
                        id: ticket.id
                    };
                });

                tickets.sort((a: Ticket, b: Ticket) => {
                    return (b.isWinner === a.isWinner) ? 0 : b.isWinner ? 1 : -1;
                });

                setRequestedTickets(tickets);
            })
            .catch((error: any) => {
                console.error("Error fetching user tickets:", error);
            });
    }, []);

    const setAddresses = useCallback((address: string, hexAddress: string): void => {
        setAddress(address);
        setHexAddress(hexAddress);
    }, []);

    const setContractMessageExecuted = useCallback(() => setContractMessageToExecute(undefined), [setContractMessageToExecute]);

    const handleTxResponse = useCallback(({ response, error }: { response: any, error: any }) => {
        const isUserReject = error?.originalError?.reason?.toLowerCase().includes('reject') ||
            error?.originalError?.message?.toLowerCase().includes('reject') ||
            error?.originalError?.shortMessage?.toLowerCase().includes('reject');

        if (response?.deliveryTxCode === 0 && !error) {
            if (broadcastingMessage == LotteryAgentFunction.purchaseTicket) {
                setTicketBought(true);
            }
            setBroadcastingMessage(undefined);
            setBroadcastingAttempts(0);
        } else if (broadcastingAttempts > 0 && !isUserReject) {
            setBroadcastingAttempts(broadcastingAttempts - 1);
            if (broadcastingMessage === LotteryAgentFunction.purchaseTicket) {
                purchaseTicket(true);
            }
        } else {
            setBroadcastingAttempts(0);
            setBroadcastingMessage(undefined);
            showErrorToast('Transaction delivery failed, please try again later');
        }
    }, [
        broadcastingAttempts,
        broadcastingMessage,
        purchaseTicket,
        updateGameStatus,
    ]);

    return (
        <GameContext.Provider
            value={{
                address,
                hexAddress,
                broadcastingMessage,
                contractMessageToExecute,
                setContractMessageExecuted,
                setAddresses,
                setBalance,
                setTicketNumbers,
                purchaseTicket,
                handleTxResponse,
                curDrawTotalWinnings,
                ticketCost,
                houseBalance,
                ticketBought,
                setTicketBought,
                drawCount,
                requestDrawShortInfo,
                requestedDrawShortInfo,
                requestedTickets,
                requestUserTickets,
                setRequestedTickets,
                setRequestedDrawShortInfo,
                claimPrize
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
