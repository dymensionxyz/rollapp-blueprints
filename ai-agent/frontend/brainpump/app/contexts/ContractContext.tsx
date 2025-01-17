'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ethers } from 'ethers'
import type { Contract, BigNumberish } from 'ethers'
import AIGamblingABI from './AIGamblingABI.json';
import { useToast } from '@/components/ui/use-toast'

interface BetInfo {
  promptId: BigNumberish
  amount: string
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
  contract: Contract | null
  isConnected: boolean
  address: string
  currentBet: BetInfo | null
  balance: string
  gameInfo: GameInfo | null
  walletBalance: string
  betHistory: BetInfo[]
  hexAddress: string
  connect: () => Promise<void>
  disconnect: () => void
  placeBet: (guessedNumber: number, amount: string, persuasion: string) => Promise<void>
  resolveBet: () => Promise<void>
  withdraw: () => Promise<void>
  refreshBetInfo: () => Promise<void>
  refreshBalance: () => Promise<void>
  refreshGameInfo: () => Promise<void>
  refreshWalletBalance: () => Promise<void>
  refreshBetHistory: () => Promise<void>
  estimateReward: (betAmount: string) => Promise<string>
  estimateCommunityFee: (betAmount: string) => Promise<string>
  checkAnswerStatus: (promptId: BigNumberish) => Promise<{ answer: string, exists: boolean }>
}

const ContractContext = createContext<ContractContextType>({} as ContractContextType)

const CONTRACT_ADDRESS = "0xADD60403BFc7e76C0670E835cAEb606569bc9ddE" // Replace with actual address

const NETWORK_PARAMS = {
    chainId: '0x69D6F', // 433519 in hexadecimal
    chainName: 'Desmos Testnet',
    nativeCurrency: {
        name: 'NIM',
        symbol: 'NIM',
        decimals: 18
    },
    rpcUrls: ['https://json-rpc.ra-2.rollapp.network'],
    blockExplorerUrls: []
}

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contract, setContract] = useState<Contract | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [hexAddress, setHexAddress] = useState('')
  const [currentBet, setCurrentBet] = useState<BetInfo | null>(null)
  const [balance, setBalance] = useState('0')
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)
  const [walletBalance, setWalletBalance] = useState('0')
  const [betHistory, setBetHistory] = useState<BetInfo[]>([])
  const { toast } = useToast()

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // await checkAndAddNetwork()

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AIGamblingABI, signer)

        setContract(contract)
        setAddress(await signer.getAddress())
        setIsConnected(true)

        // Refresh bet info and balance after connecting
        await refreshAllInfo()
      } catch (error) {
        console.error('Failed to connect:', error)
        throw new Error('Failed to connect to wallet')
      }
    } else {
      throw new Error('MetaMask not detected')
    }
  }

  const checkAndAddNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Check if the network is already added
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORK_PARAMS.chainId }],
        })
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [NETWORK_PARAMS],
            })
            toast({
              title: "Network Added",
              description: "The Dymension RollApp network has been added to your wallet.",
            })
          } catch (addError) {
            console.error('Error adding network:', addError)
            setError('Failed to add network to wallet')
          }
        } else {
          console.error('Error switching network:', switchError)
          setError('Failed to switch network')
        }
      }
    }
  }

  const disconnect = () => {
    setContract(null)
    setIsConnected(false)
    setAddress('')
    setHexAddress('')
    setCurrentBet(null)
    setBalance('0')
    setGameInfo(null)
    setWalletBalance('0')
    setBetHistory([])
  }

  const placeBet = async (guessedNumber: number, amount: string, persuasion: string) => {
    if (!contract) throw new Error('Not connected')
    if (guessedNumber < 1 || guessedNumber > 10) throw new Error('Invalid guess number')
    if (parseFloat(amount) <= 0) throw new Error('Invalid bet amount')

    try {
      const tx = await contract.placeBet(guessedNumber, persuasion, {
        value: ethers.parseEther(amount)
      })
      await tx.wait()
      await refreshAllInfo()
    } catch (error) {
      console.error('Error placing bet:', error)
      throw new Error('Failed to place bet')
    }
  }

  const resolveBet = async () => {
    if (!contract) throw new Error('Not connected')
    try {
      const tx = await contract.resolveBet()
      await tx.wait()
      await refreshAllInfo()
    } catch (error) {
      console.error('Error resolving bet:', error)
      throw new Error('Failed to resolve bet')
    }
  }

  const withdraw = async () => {
    if (!contract) throw new Error('Not connected')
    try {
      const tx = await contract.withdraw()
      await tx.wait()
      await refreshAllInfo()
    } catch (error) {
      console.error('Error withdrawing:', error)
      throw new Error('Failed to withdraw funds')
    }
  }

  const refreshBetInfo = async () => {
    if (!contract || !address) return
    try {
      const bet = await contract.bets(address)
      setCurrentBet({
        promptId: bet[0],
        amount: ethers.formatEther(bet[1]),
        guessedNumber: Number(bet[2]),
        correctNumber: Number(bet[3]),
        persuasion: bet[4],
        resolved: bet[5],
        won: bet[6],
        canceled: bet[7]
      })
    } catch (error) {
      console.error('Error getting bet info:', error)
      setCurrentBet(null)
    }
  }

  const refreshBalance = async () => {
    if (!contract || !address) return
    try {
      const balance = await contract.balances(address)
      setBalance(ethers.formatEther(balance))
    } catch (error) {
      console.error('Error getting balance:', error)
      setBalance('0')
    }
  }

  const refreshGameInfo = async () => {
    if (!contract) return
    try {
      const info = await contract.getGameInfo()
      setGameInfo({
        houseSupply: ethers.formatEther(info.houseSupply),
        houseActiveBalance: ethers.formatEther(info.houseActiveBalance),
        minBetAmount: ethers.formatEther(info.minBetAmount),
        maxBetAmount: ethers.formatEther(info.maxBetAmount),
        maxBetAmountPercentage: Number(info.maxBetAmountPercentage)
      })
    } catch (error) {
      console.error('Error getting game info:', error)
      setGameInfo(null)
    }
  }

  const refreshWalletBalance = async () => {
    if (!address) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(address)
      setWalletBalance(ethers.formatEther(balance))
    } catch (error) {
      console.error('Error getting wallet balance:', error)
      setWalletBalance('0')
    }
  }

  const refreshBetHistory = async () => {
    if (!contract || !address) return
    try {
      const history = await contract.getHistory(address)
      setBetHistory(history.map((bet: any) => ({
        promptId: bet[0],
        amount: ethers.formatEther(bet[1]),
        guessedNumber: Number(bet[2]),
        correctNumber: Number(bet[3]),
        persuasion: bet[4],
        resolved: bet[5],
        won: bet[6],
        canceled: bet[7]
      })))
    } catch (error) {
      console.error('Error getting bet history:', error)
      setBetHistory([])
    }
  }

  const refreshAllInfo = async () => {
    await Promise.all([
      refreshBetInfo(),
      refreshBalance(),
      refreshGameInfo(),
      refreshWalletBalance(),
      refreshBetHistory()
    ])
  }

  const estimateReward = async (betAmount: string) => {
    if (!contract) throw new Error('Not connected')
    try {
      const reward = await contract.estimateReward(ethers.parseEther(betAmount))
      return ethers.formatEther(reward)
    } catch (error) {
      console.error('Error estimating reward:', error)
      throw new Error('Failed to estimate reward')
    }
  }

  const estimateCommunityFee = async (betAmount: string) => {
    if (!contract) throw new Error('Not connected')
    try {
      const reward = await contract.estimateCommunityFee(ethers.parseEther(betAmount))
      return ethers.formatEther(reward)
    } catch (error) {
      console.error('Error estimating community fee:', error)
      throw new Error('Failed to estimate community fee')
    }
  }

  const checkAnswerStatus = async (promptId: BigNumberish) => {
    if (!contract) throw new Error('Not connected')
    try {
      const [answer, exists] = await contract.checkAnswerStatus(promptId)
      return { answer, exists }
    } catch (error) {
      console.error('Error checking answer status:', error)
      throw new Error('Failed to check answer status')
    }
  }

  useEffect(() => {
    if (isConnected) {
      refreshAllInfo()
      const interval = setInterval(refreshAllInfo, 10000) // Poll every 10 seconds
      return () => clearInterval(interval)

    }
  }, [isConnected])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        disconnect()
      })
      window.ethereum.on('chainChanged', () => {
        disconnect()
      })
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [])

  return (
    <ContractContext.Provider value={{
      contract,
      isConnected,
      address,
      hexAddress,
      currentBet,
      balance,
      gameInfo,
      walletBalance,
      betHistory,
      connect,
      disconnect,
      placeBet,
      resolveBet,
      withdraw,
      refreshBetInfo,
      refreshBalance,
      refreshGameInfo,
      refreshWalletBalance,
      refreshBetHistory,
      estimateReward,
      estimateCommunityFee,
      checkAnswerStatus
    }}>
      {children}
    </ContractContext.Provider>
  )
}

export const useContract = () => useContext(ContractContext)

