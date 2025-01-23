'use client'

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react'
import type {BigNumberish} from 'ethers'
import {ethers} from 'ethers'
import {AIGamblingABI} from '@/app/contexts/AIGamblingABI';
import {showErrorToast, showSuccessToast} from '@/app/utils/toast-utils';
import Web3 from 'web3';
import {
    CONTRACT_ADDRESS,
    ContractFunction,
    DEFAULT_BROADCAST_ATTEMPTS,
    JSON_RPC,
    LOSING_MESSAGES,
    SUCCESS_MESSAGES,
} from "@/app/contexts/types";

interface ContractMessage {
    address: string;
    data: string;
    value?: string;
}

interface BetInfo {
    promptId: BigNumberish
    amount: string
    communityFee: number
    guessedNumber: number
    correctNumber: number
    persuasion: string
    resolved: boolean
    won: boolean
    canceled: boolean
}

interface GameInfo {
    houseSupply: string
    houseActiveBalance: string
    minBetAmount: string
    maxBetAmount: string
    maxBetAmountPercentage: number
}

interface ContractContextType {
    address: string
    hexAddress: string
    bet: BetInfo | null
    betAmount?: string
    balance: string
    gameInfo: GameInfo | null
    walletBalance: string
    betHistory: BetInfo[]
    placeBet: (retry?: boolean) => void
    resolveBet: (retry?: boolean) => void
    withdraw: (retry?: boolean) => void
    estimateReward: (betAmount: string) => Promise<string>
    estimateCommunityFee: (betAmount: string) => Promise<string>
    checkAnswerStatus: (promptId: BigNumberish) => Promise<{ answer: string, exists: boolean }>
    broadcastingMessage?: string;
    contractMessageToExecute?: ContractMessage;
    setContractMessageExecuted: () => void;
    handleTxResponse: (response: any) => void;
    setBetAmount: (amount?: string) => void;
    setGuessedNumber: (number?: number) => void;
    setPersuasion: (persuasion?: string) => void;
    setAddresses: (address: string, hexAddress: string) => void;
    setBalance: (balance: string) => void;
    setWalletBalance: (balance: string) => void;
    guessedNumber?: number;
    persuasion?: string;
}

const ContractContext = createContext<ContractContextType>({} as ContractContextType)
const web3 = new Web3(new Web3.providers.HttpProvider(JSON_RPC));
const aiGamblingContract = new web3.eth.Contract(AIGamblingABI, CONTRACT_ADDRESS);

export function ContractProvider({children}: { children: ReactNode }) {
    const [address, setAddress] = useState('')
    const [hexAddress, setHexAddress] = useState('');
    const [bet, setBet] = useState<BetInfo | null>(null)
    const [betAmount, setBetAmount] = useState<string>();
    const [guessedNumber, setGuessedNumber] = useState<number>()
    const [persuasion, setPersuasion] = useState<string>()
    const [balance, setBalance] = useState('0')
    const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)
    const [walletBalance, setWalletBalance] = useState('0')
    const [betHistory, setBetHistory] = useState<BetInfo[]>([])
    const [broadcastingMessage, setBroadcastingMessage] = useState<string>();
    const [broadcastingAttempts, setBroadcastingAttempts] = useState(0);
    const [contractMessageToExecute, setContractMessageToExecute] = useState<ContractMessage>();
    const [gameStatusLoading, setGameStatusLoading] = useState(true);

    const setAddresses = useCallback((address: string, hexAddress: string): void => {
        setAddress(address);
        setHexAddress(hexAddress);
    }, []);

    const placeBet = useCallback((retry?: boolean) => {
        if (!hexAddress || contractMessageToExecute || !betAmount || !guessedNumber || (!retry && broadcastingMessage)) throw new Error('Not connected')

        const persuasionString = persuasion || '';
        const data = aiGamblingContract.methods.placeBet(guessedNumber, persuasionString).encodeABI();
        const value = ethers.parseEther(betAmount).toString();
        setContractMessageToExecute({address: CONTRACT_ADDRESS, data, value});
        setBroadcastingMessage(ContractFunction.placeBet);
        if (!retry) {
            setBroadcastingAttempts(DEFAULT_BROADCAST_ATTEMPTS);
        }
    }, [betAmount, persuasion, guessedNumber, broadcastingMessage, contractMessageToExecute, hexAddress])

    const resolveBet = useCallback((retry?: boolean,) => {
        if (!hexAddress || contractMessageToExecute || (!retry && broadcastingMessage)) throw new Error('Not connected')

        const data = aiGamblingContract.methods.resolveBet().encodeABI();
        setContractMessageToExecute({address: CONTRACT_ADDRESS, data});
        setBroadcastingMessage(ContractFunction.resolveBet);
        if (!retry) {
            setBroadcastingAttempts(DEFAULT_BROADCAST_ATTEMPTS);
        }
    }, [broadcastingMessage, contractMessageToExecute, hexAddress])

    const withdraw = useCallback((retry?: boolean,) => {
        if (!hexAddress || contractMessageToExecute || (!retry && broadcastingMessage)) throw new Error('Not connected')

        const data = aiGamblingContract.methods.withdraw().encodeABI();
        setContractMessageToExecute({address: CONTRACT_ADDRESS, data});
        setBroadcastingMessage(ContractFunction.withdraw);
        if (!retry) {
            setBroadcastingAttempts(DEFAULT_BROADCAST_ATTEMPTS);
        }
    }, [broadcastingMessage, contractMessageToExecute, hexAddress])

    const refreshAllInfo = useCallback(() => {
        if (hexAddress === undefined || balance === undefined) {
            return;
        }

        if (!hexAddress) {
            setGameStatusLoading(false);
            setBroadcastingMessage(undefined);
            setBroadcastingAttempts(0);
            setBet(null)
            setBalance('0')
            setGameInfo(null)
            setWalletBalance('0')
            setBetHistory([])
            return;
        }

        const promises = [
            // Bet Info
            aiGamblingContract.methods.bets(hexAddress).call().then((bet: any) => {
                setBet({
                    promptId: bet[0],
                    amount: ethers.formatEther(bet[1]),
                    communityFee: Number(bet[2]),
                    guessedNumber: Number(bet[3]),
                    correctNumber: Number(bet[4]),
                    persuasion: bet[5],
                    resolved: bet[6],
                    won: bet[7],
                    canceled: bet[8]
                })
            }),

            // House Balance
            aiGamblingContract.methods.balances(hexAddress).call().then((balance: any) => setBalance(ethers.formatEther(balance))),

            // Game Info
            aiGamblingContract.methods.getGameInfo().call().then((info: any) => setGameInfo({
                houseSupply: ethers.formatEther(info.houseSupply),
                houseActiveBalance: ethers.formatEther(info.houseActiveBalance),
                minBetAmount: ethers.formatEther(info.minBetAmount),
                maxBetAmount: ethers.formatEther(info.maxBetAmount),
                maxBetAmountPercentage: Number(info.maxBetAmountPercentage)
            })),

            // Bet History
            aiGamblingContract.methods.getHistory(hexAddress).call().then((history: any) => setBetHistory(history.map((bet: any) => ({
                promptId: bet[0],
                amount: ethers.formatEther(bet[1]),
                communityFee: ethers.formatEther(bet[2]),
                guessedNumber: Number(bet[3]),
                correctNumber: Number(bet[4]),
                persuasion: bet[5],
                resolved: bet[6],
                won: bet[7],
                canceled: bet[8]
            }))))

            // TODO: add wallet balance
        ]

        Promise.all(promises).catch((error) => {
            console.error(error);
            showErrorToast(`Can't load data, please try again later`);
        }).finally(() => setGameStatusLoading(false));
    }, [balance, hexAddress])

    const setContractMessageExecuted = useCallback(() => setContractMessageToExecute(undefined), []);

    const handleLastGameResult = useCallback(async () => {
        try {
            console.log(">>>>>>>>2")
            const gameResult = (await aiGamblingContract.methods.bets(hexAddress).call()) as BetInfo;

            console.log(">>>>>>>>3", gameResult)

            if (gameResult.won) {
                console.log(">>>>>>>>4")
                const successMessage = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
                showSuccessToast(successMessage);
            } else {
                console.log(">>>>>>>>5")
                const losingMessage = LOSING_MESSAGES[Math.floor(Math.random() * LOSING_MESSAGES.length)];
                showErrorToast(losingMessage);
            }
        } catch (error) {
            console.log(">>>>>>>>6")
            console.error(error);
            showErrorToast(`Can't fetch game status, please try again later`);
        }
    }, [balance, hexAddress, betAmount]);

    const handleTxResponse = useCallback(({response, error}: { response: any, error: any }) => {
        const isUserReject = error?.originalError?.reason?.toLowerCase().includes('reject') ||
            error?.originalError?.message?.toLowerCase().includes('reject') ||
            error?.originalError?.shortMessage?.toLowerCase().includes('reject');

        console.log(">>>>>>>>", response, error, broadcastingMessage)
        if (response?.deliveryTxCode === 0 && !error) {
            setBroadcastingMessage(undefined);
            setBroadcastingAttempts(0);
            if (broadcastingMessage === ContractFunction.placeBet) {
                refreshAllInfo();
            } else if (broadcastingMessage === ContractFunction.resolveBet) {
                console.log(">>>>>>>>1")
                refreshAllInfo();
                setPersuasion('');
                setGuessedNumber(undefined);
                setBetAmount(undefined);
                handleLastGameResult().then();
            } else if (broadcastingMessage === ContractFunction.withdraw) {
                refreshAllInfo();
                showSuccessToast('🏆 Congratulations! Your rewards have been successfully claimed!');
            }
        } else if (broadcastingAttempts > 0 && !isUserReject) {
            setBroadcastingAttempts(broadcastingAttempts - 1);
            if (broadcastingMessage === ContractFunction.placeBet) {
                placeBet(true);
            } else if (broadcastingMessage === ContractFunction.resolveBet) {
                resolveBet(true);
            } else if (broadcastingMessage === ContractFunction.withdraw) {
                withdraw(true);
            }
        } else {
            setBroadcastingAttempts(0);
            setBroadcastingMessage(undefined);
            showErrorToast('Transaction delivery failed, please try again later');
        }
    }, [
        broadcastingAttempts,
        broadcastingMessage,
        withdraw,
        refreshAllInfo,
        handleLastGameResult,
        placeBet,
        resolveBet,
    ]);

    const estimateReward = useCallback(async (betAmount: string) => {
        if (!hexAddress) throw new Error('Not connected')

        const reward = (await aiGamblingContract.methods.estimateReward(ethers.parseEther(betAmount)).call()) as string;
        return ethers.formatEther(reward)
    }, [hexAddress, betAmount])

    const estimateCommunityFee = useCallback(async (betAmount: string) => {
        if (!hexAddress) throw new Error('Not connected')

        const reward = (await aiGamblingContract.methods.estimateCommunityFee(ethers.parseEther(betAmount)).call()) as string
        return ethers.formatEther(reward)
    }, [hexAddress, betAmount])

    const checkAnswerStatus = useCallback(async (promptId: BigNumberish) => {
        if (!hexAddress) throw new Error('Not connected')

        const {answer, exists} = (await aiGamblingContract.methods.checkAnswerStatus(promptId).call()) as {
            answer: string,
            exists: boolean
        }
        return {answer, exists}
    }, [hexAddress])

    useEffect(() => refreshAllInfo(), [refreshAllInfo]);

    return (
        <ContractContext.Provider value={{
            address,
            hexAddress,
            bet,
            betAmount,
            balance,
            gameInfo,
            walletBalance,
            betHistory,
            placeBet,
            resolveBet,
            withdraw,
            estimateReward,
            estimateCommunityFee,
            checkAnswerStatus,
            broadcastingMessage,
            contractMessageToExecute,
            setContractMessageExecuted,
            handleTxResponse,
            setBetAmount,
            setGuessedNumber,
            setPersuasion,
            setAddresses,
            setBalance,
            setWalletBalance,
            guessedNumber,
            persuasion,
        }}>
            {children}
        </ContractContext.Provider>
    )
}

export const useContract = () => useContext(ContractContext)

