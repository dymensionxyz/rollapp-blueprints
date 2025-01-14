'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ethers } from 'ethers';
import CoinFlipABI from './CoinFlipABI.json';
import Web3 from 'web3';  // Импортируем Web3 (для ES6 модулей)


const DYMENSION_CONNECT_URL = 'https://testnet.dymension.xyz';
const DYMENSION_CONNECT_NETWORK_IDS = ['dymflip_248217-1'];
const DYMENSION_CONNECT_NETWORK_MAIN_DENOM = 'adym';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function CoinFlipGame() {
  const [bet, setBet] = useState(1);
  const [side, setSide] = useState('DYM');
  const [balance, setBalance] = useState('0');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'DYM' | 'LOGO' | null>(null);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [hexAddress, setHexAddress] = useState('');
  const [coinFlipContract, setCoinFlipContract] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [gameStatus, setGameStatus] = useState<'pending' | 'completed' | null>(null);
  const [winStatus, setWinStatus] = useState<'win' | 'lose' | null>(null);
  const [houseBalance, setHouseBalance] = useState('0');
  const [maxBet, setMaxBet] = useState<any>(null);
  const [minBet, setMinBet] = useState<any>(null);
  const [dymensionConnectOpen, setDymensionConnectOpen] = useState(false);
  const [dymensionConnectReady, setDymensionConnectReady] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [qrAccount, setQrAccount] = useState<string | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const CONTRACT_ADDRESS = '0xfae52eaFEB6bac9413a7210228D78AE036D348c9';


  const sendMessage = useCallback((message: any) => {
    iframeRef.current?.contentWindow?.postMessage(message, DYMENSION_CONNECT_URL);
  }, []);

  const updateTriggerBoundingRect = useCallback(() => {
    const boundingRect = buttonRef.current?.getBoundingClientRect();
    if (boundingRect) {
      sendMessage({ type: 'setTriggerBoundingRect', rect: boundingRect });
    }
  }, [sendMessage]);

  const initModal = useCallback(() => {
    updateTriggerBoundingRect();
    sendMessage({
      type: 'setStyles',
      styles: {
        '--black-light': 'rgb(63 81 59)',
        '--black-light-rgb': '63, 81, 59',
        '--black-dark': 'rgb(27 40 24)',
        '--black-dark-rgb': '27, 40, 24',
        '--background-color': 'rgb(42 59 42)',
        '--background-color-secondary': 'rgb(63 78 63)'
      }
    });
    sendMessage({ type: 'setMenuAlign', align: 'center' });
  }, [sendMessage, updateTriggerBoundingRect]);

  const connectWallet = useCallback((walletType: string) =>
      sendMessage({ type: 'connect', networkId: DYMENSION_CONNECT_NETWORK_IDS[0], walletType }), [sendMessage]);

  const NETWORK_PARAMS = {
    chainId: '0x3C999', // 433519 in hexadecimal
    chainName: 'CoinFlip Testnet',
    nativeCurrency: {
      name: 'DYM',
      symbol: 'DYM',
      decimals: 18
    },
    rpcUrls: ['https://json-rpc.ra-1.rollapp.network'],
    blockExplorerUrls: []
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


  const refreshWalletBalance = async () => {
    if (!address) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(hexAddress)
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      setBalance('0');
    }
  };

  const refreshHouseBalance = async () => {
    if (!coinFlipContract || !address) return;
    try {
      const balance = await coinFlipContract.getBalance(hexAddress);
      setHouseBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error getting balance:', error);
      setHouseBalance('0');
    }
  };

  const refreshMaxBet = async () => {
    if (!coinFlipContract) return;
    try {
      const _maxBet = await coinFlipContract.calculateMaxBetAmount();
      setMaxBet(ethers.formatEther(_maxBet));
    } catch (error) {
      console.error('Error getting max bet:', error);
      setMaxBet('0');
    }
  };

  const refreshMinBet = async () => {
    if (!coinFlipContract) return;
    try {
      const _minBet = await coinFlipContract.minBetAmount();
      setMinBet(ethers.formatEther(_minBet));
    } catch (error) {
      console.error('Error getting min bet:', error);
      setMinBet('0');
    }
  };

  const withdraw = async () => {
    if (!coinFlipContract) throw new Error('Not connected');
    try {
      const tx = await coinFlipContract.withdraw();
      await tx.wait();
      await refreshEverything();
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw new Error('Failed to withdraw funds');
    }
  };

  const refreshEverything = async () => {
    await refreshWalletBalance();
    await refreshHouseBalance();
    await fetchGameStatus();
    await refreshMaxBet();
    await refreshMinBet();
  };

  useEffect(() => {
    if (provider && signer && coinFlipContract && connected) {
      refreshEverything();
    }
  }, [provider, signer, coinFlipContract, connected]);

  useEffect(() => {
    window.addEventListener('scroll', updateTriggerBoundingRect, true);
    window.addEventListener('resize', updateTriggerBoundingRect, true);
    return () => {
      window.removeEventListener('scroll', updateTriggerBoundingRect, true);
      window.removeEventListener('resize', updateTriggerBoundingRect, true);
    }
  }, [updateTriggerBoundingRect]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== DYMENSION_CONNECT_URL) {
        return;
      }
      if (event.data.type === 'ready') {
        setDymensionConnectReady(true);
      }
      if (event.data.type === 'menu-visible') {
        setDymensionConnectOpen(event.data.value);
      }
      if (event.data.type === 'connect') {
        setHexAddress(event.data.hexAddress);
        setAddress(event.data.address);
        initializeProvider(event.data.hexAddress);
        updateTriggerBoundingRect();
      }
      if (event.data.type === 'disconnect') {
        setHexAddress('');
        setAddress('');
        setConnected(false);
        setProvider(null);
        setSigner(null);
        setCoinFlipContract(null);
        updateTriggerBoundingRect();
      }
      if (event.data.type === 'tx-response') {
        setBroadcasting(false);
        console.log(event.data.response || event.data.error);
      }
      if (event.data.type === 'notification') {
        setNotifications(event.data.messages);
      }
      if (event.data.type === 'wallet-error') {
        console.error(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [initModal, sendMessage, updateTriggerBoundingRect]);

  const initializeProvider = async (userAddress: string) => {
    try {
      console.log("Initializing provider with address:", userAddress);

      await checkAndAddNetwork()

      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CoinFlipABI, signer)

      console.log('Signer:', signer)

      setProvider(provider);
      setSigner(signer);
      setCoinFlipContract(contract);
      setConnected(true);
      console.log("Provider initialized successfully");
    } catch (err) {
      console.error('Failed to initialize provider:', err);
      setError('Failed to connect: ' + (err instanceof Error ? err.message : String(err)));
      setConnected(false);
    }
  };
  const fetchGameStatus = async () => {
    try {
      const gameResult = await coinFlipContract.getPlayerLastGameResult();
      console.log(gameResult);

      const status = gameResult.status.toString();
      let statusMessage = '';

      if (status === '2') {
        statusMessage = 'Completed';
        const didWin = gameResult.won;
        const playerChoice = gameResult.playerChoice ? 'LOGO' : 'DYM';
        const flipResult = didWin ? playerChoice : (playerChoice === 'DYM' ? 'LOGO' : 'DYM');
        console.log("playerChoice: " + playerChoice + ", flipResult: " + flipResult);

        if (didWin) {
          setWinStatus('win');
        } else {
          setWinStatus('lose');
        }

        setResult(flipResult);
        setIsFlipping(false);
        setGameStatus('completed');
      } else if (status === '1') {
        statusMessage = 'Pending';
      } else {
        statusMessage = 'No Game Started';
      }

      console.log('Fetched game status:', statusMessage);

      setGameStatus(status === '2' ? 'completed' : status === '1' ? 'pending' : null);
    } catch (err) {
      console.error('Error fetching game status:', err);
      setError('Error fetching game status');
    }
  };

  const flipCoin = async () => {
    console.log("flipping the coin with user choice: " + side);
    console.log(coinFlipContract.methods)

    if (!connected) {
      setError('Please connect your wallet');
      return;
    }

    setError('');
    setIsFlipping(true);
    setResult(null);
    setGameStatus('pending');

    try {
      const sideEnum = side === 'DYM' ? 0 : 1;
      const tx = await coinFlipContract.startGame(sideEnum, {
        value: ethers.parseEther(bet.toString())
      });
      await tx.wait();
      console.log('Game started');
      await completeGame(true);
    } catch (err) {
      console.error('Error flipping the coin:', err);
      setIsFlipping(false);
      setError('Error interacting with the contract');
      setGameStatus(null);
    }

    await refreshEverything();
  };

  const completeGame = async (wait: boolean) => {
    console.log(`completing the game`);
    try {
      var retry = 0;
      while (retry < 3) {
        if (wait) {
          await sleep(5000);
        }
        try {
          const tx = await coinFlipContract.completeGame();
          await tx.wait();
          break;
        } catch (err) {
          retry++;
          setError(`Error completing the game, retry #${retry}.`);
          console.error(`Retry reason: ${err}`);
        }
      }

      if (retry >= 3) {
        return;
      }

      const gameResult = await coinFlipContract.getPlayerLastGameResult();
      console.log(gameResult);

      if (gameResult.status != 2) {
        setError("Game wasn't finished.");
        console.error("Game wasn't finished.");
        return;
      }
      const didWin = gameResult.won;
      const playerChoice = gameResult.playerChoice ? 'LOGO' : 'DYM';
      const flipResult = didWin ? playerChoice : (playerChoice === 'DYM' ? 'LOGO' : 'DYM');

      console.log("playerChoice: " + playerChoice + ", flipResult: " + flipResult);

      setResult(flipResult);
      setIsFlipping(false);
      setGameStatus('completed');
      if (didWin) {
        setWinStatus('win');
      } else {
        setWinStatus('lose');
      }

    } catch (err) {
      console.error('Error completing game:', err);
      setIsFlipping(false);
      setError('Error completing the game');
      setGameStatus(null);
    }

    await refreshEverything();
  };

  useEffect(() => {
    setQrAccount(new URLSearchParams(window.location.search).get('qrAccount'));
  }, []);

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative">
        {/* Container for coin flip and house info */}
        <div className="relative flex items-center justify-center space-x-8 w-full max-w-screen-lg">
          {/* Main Game Panel */}
          <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md relative z-10">
            <h1 className="text-3xl font-bold text-center mb-6">Coin Flip Game</h1>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Game Status:</h3>
              <div className={`text-xl font-bold mt-2 ${gameStatus === 'pending' ? 'text-yellow-500' : gameStatus === 'completed' ? 'text-green-500' : 'text-gray-500'}`}>
                {gameStatus === 'pending' ? 'Pending...' : gameStatus === 'completed' ? 'Completed' : 'No Game Started'}
              </div>
              {gameStatus === 'completed' && (
                  <div className={`text-xl font-bold mt-2 ${winStatus === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                    {winStatus === 'win' ? 'You won!' : 'You lost!'}
                  </div>
              )}
            </div>

            <div className="mb-6 text-center relative">
              {/* Coin Flip Animation */}
              <motion.div
                  className="w-32 h-32 rounded-full mx-auto flex items-center justify-center relative"
                  animate={{
                    rotateY: isFlipping ? 3600 : 0,
                    scale: isFlipping ? 1.2 : 1,
                  }}
                  transition={{
                    duration: isFlipping ? 2 : 0,
                    repeat: isFlipping ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
              >
                <img
                    src="/coin.png"
                    alt="Coin"
                    className="w-full h-full object-contain"
                />
                {result && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                      {result === 'DYM' ? 'DYM' : 'LOGO'}
                    </div>
                )}
              </motion.div>
            </div>

            <div className="space-y-4">
              <div>
                <TextField
                    label="Your Bet (eth)"
                    type="number"
                    value={bet}
                    onChange={(e) => setBet(parseFloat(e.target.value))}
                    fullWidth
                    inputProps={{min: 1, max: balance}}
                />
              </div>

              <RadioGroup value={side} onChange={(e) => setSide(e.target.value)}>
                <FormControlLabel value="DYM" control={<Radio/>} label="DYM"/>
                <FormControlLabel value="LOGO" control={<Radio/>} label="LOGO"/>
              </RadioGroup>

              <Button
                  variant="contained"
                  onClick={flipCoin}
                  disabled={isFlipping || gameStatus === 'pending' || !connected || broadcasting}
                  fullWidth
              >
                {broadcasting ? 'Broadcasting...' : 'Flip'}
              </Button>

              <Button
                  variant="contained"
                  onClick={() => completeGame(false)}
                  disabled={isFlipping || gameStatus !== 'pending' || !connected || broadcasting}
                  fullWidth
              >
                {broadcasting ? 'Broadcasting...' : 'Reveal'}
              </Button>

              <div className="text-center text-xl font-semibold">Balance: {balance} eth</div>

              {/* Dymension Connect Button */}
              <Button
                  variant="contained"
                  ref={buttonRef}
                  onClick={() => {
                    setDymensionConnectOpen(!dymensionConnectOpen);
                    updateTriggerBoundingRect();
                  }}
                  disabled={!dymensionConnectReady}
                  fullWidth
              >
                {hexAddress || 'Connect Wallet'}
              </Button>
            </div>
          </div>

          {/* House Information Panel */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4 bg-white rounded-lg shadow-xl w-auto max-w-xs z-20">
            <h3 className="text-lg font-semibold text-center mb-4">House Information</h3>
            <div className="text-xl font-bold text-center whitespace-nowrap">
              <div>House Balance: {houseBalance} ETH</div>
              <div>Min bet: {minBet} ETH</div>
              <div>Max bet: {maxBet} ETH</div>
            </div>
            {/* Withdraw Button */}
            <div className="mt-4 text-center">
              <Button
                  variant="contained"
                  onClick={withdraw}
                  fullWidth
                  disabled={!houseBalance || houseBalance === '0' || !connected || broadcasting}
              >
                {broadcasting ? 'Broadcasting...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </div>

        {/* Strictly Centered Coin Flip (absolute positioning) */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <motion.div
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center"
              animate={{
                rotateY: isFlipping ? 3600 : 0,
                scale: isFlipping ? 1.2 : 1,
              }}
              transition={{
                duration: isFlipping ? 2 : 0,
                repeat: isFlipping ? Infinity : 0,
                ease: 'easeInOut',
              }}
          >
            <img
                src="/coin.png"
                alt="Coin"
                className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Dymension Connect Widget */}
        <iframe
            ref={iframeRef}
            onLoad={initModal}
            style={{display: dymensionConnectOpen || qrAccount ? 'block' : 'none'}}
            allow='clipboard-read; clipboard-write; camera'
            title='dymension-connect'
            className='fixed top-0 left-0 w-full h-full z-50'
            src={`${DYMENSION_CONNECT_URL}/connect${qrAccount ? `/account/${qrAccount}` : ''}?networkIds=${DYMENSION_CONNECT_NETWORK_IDS.join(',')}`}
        />

        {/* Notification Messages */}
        <div className="fixed bottom-4 right-4 z-50">
          {notifications.map((notification, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-2">
                {notification}
              </div>
          ))}
        </div>
      </div>
  );
}
