import { useState, useEffect } from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
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
} from "@/components/ui/alert-dialog";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {calculateFee, GasPrice} from "@cosmjs/stargate";
import { coin } from "@cosmjs/proto-signing";

// Contract Addresses
const CONTRACT_ADDRESS = "rol1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqg3zqxw";
const BINARY_OPTIONS_CONTRACT_ADDRESS = "rol17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgss2u902";

// Fixed Values
const FIXED_EXPIRATION = 1700000000;
const FIXED_BET_AMOUNT_AWSM = "10000"; // 0.01 AWSM

// Chain Configuration
const chainConfig = {
    chainId: "rollappwasm_1234-1",
    chainName: "RollApp Local Chain",
    rpc: "http://localhost:26657",
    rest: "http://localhost:1317",
    stakeCurrency: {
        coinDenom: "AWSM",
        coinMinimalDenom: "awsm",
        coinDecimals: 18,
        coinGeckoId: "local-coin",
    },
    bip44: {
        coinType: 118,
    },
    bech32Config: {
        bech32PrefixAccAddr: "rol",
        bech32PrefixAccPub: "rolpub",
        bech32PrefixValAddr: "rolvaloper",
        bech32PrefixValPub: "rolvaloperpub",
        bech32PrefixConsAddr: "rolvalcons",
        bech32PrefixConsPub: "rolvalconspub",
    },
    currencies: [
        {
            coinDenom: "AWSM",
            coinMinimalDenom: "awsm",
            coinDecimals: 18,
        },
    ],
    feeCurrencies: [
        {
            coinDenom: "AWSM",
            coinMinimalDenom: "awsm",
            coinDecimals: 18,
        },
    ],
};

const BinaryOptionsDApp = () => {
    // Constants
    const COUNT_DOWN_INTERVAL = 60;
    const FIXED_BET_AMOUNT = 0.01; // Fixed bet amount in AWSM

    // States
    const [currentPrice, setCurrentPrice] = useState(null);
    const [balance, setBalance] = useState(0.5);
    const [timeLeft, setTimeLeft] = useState(COUNT_DOWN_INTERVAL);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betResult, setBetResult] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [keplrConnected, setKeplrConnected] = useState(false);

    // Simulated bet history
    const betHistory = [
        { direction: 'up', entryPrice: 44950.20, finalPrice: 45100.30, result: 'win' },
        { direction: 'down', entryPrice: 45200.10, finalPrice: 45150.40, result: 'loss' },
    ];

    // Function to connect Keplr
    const connectKeplr = async () => {
        if (!window.keplr) {
            alert('Please install the Keplr extension to continue.');
            return;
        }

        try {
            await window.keplr.experimentalSuggestChain(chainConfig);
            await window.keplr.enable(chainConfig.chainId);

            const offlineSigner = window.getOfflineSigner(chainConfig.chainId);
            const accounts = await offlineSigner.getAccounts();
            setWalletAddress(accounts[0].address);
            setKeplrConnected(true);

            await getBalance(accounts[0].address);
        } catch (error) {
            console.error("Error connecting to Keplr:", error);
            alert('Could not connect to Keplr. Please try again.');
        }
    };

    // Function to disconnect Keplr
    const disconnectKeplr = () => {
        setWalletAddress(null);
        setKeplrConnected(false);
        setBalance(0.0);
    };

    // Function to get balance
    const getBalance = async (address) => {
        try {
            const response = await fetch(`${chainConfig.rest}/cosmos/bank/v1beta1/balances/${address}`);
            if (!response.ok) throw new Error('Error fetching balance');

            const data = await response.json();
            const balanceData = data.balances.find(coin => coin.denom === chainConfig.stakeCurrency.coinMinimalDenom);
            setBalance(balanceData ? parseFloat(balanceData.amount) / 10 ** chainConfig.stakeCurrency.coinDecimals : 0.0);
        } catch (error) {
            console.error("Error fetching balance:", error);
            alert('Could not retrieve wallet balance.');
        }
    };

    // Function to place a bet
    const placeOption = async (direction) => {
        if (!keplrConnected || !walletAddress) {
            alert("Please connect your wallet first.");
            return;
        }

        try {
            setIsLoading(true);

            const msg = {
                place_option: {
                    direction: direction === "up" ? "up" : "down",
                    expiration: FIXED_EXPIRATION,
                    bet_amount: {
                        denom: chainConfig.stakeCurrency.coinMinimalDenom,
                        amount: FIXED_BET_AMOUNT_AWSM,
                    },
                    market: {
                        base: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/ubtc",
                        quote: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/uusdc",
                    },
                },
            };

            const funds = [
                {
                    denom: chainConfig.stakeCurrency.coinMinimalDenom,
                    amount: FIXED_BET_AMOUNT_AWSM,
                },
            ];

            const offlineSigner = window.getOfflineSigner(chainConfig.chainId);
            const client = await SigningCosmWasmClient.connectWithSigner(
                chainConfig.rpc,
                offlineSigner
            );

            const msgExecuteContract = {
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: {
                    sender: walletAddress,
                    contract: BINARY_OPTIONS_CONTRACT_ADDRESS,
                    msg: new TextEncoder().encode(JSON.stringify(msg)),
                    funds: funds,
                },
            };

            const gasSimulation = await client.simulate(walletAddress, [msgExecuteContract], "");
            console.log("gas simulation", gasSimulation);

            const gas = parseInt(gasSimulation * 1.4 * 1_000_000);
            console.log("gas", gas);

            const fee = {
                amount: [
                    {
                        denom: chainConfig.stakeCurrency.coinMinimalDenom,
                        amount: String(parseInt(gasSimulation)),
                    },
                ],
                gas: String(gas),
            };

            const result = await client.signAndBroadcast(walletAddress, [msgExecuteContract], fee);

            if (result.code === 0) {
                console.log("Transaction successful:", result);
                // Vuelves a pedir el balance, etc.
                await getBalance(walletAddress);
            } else {
                console.error("Transaction failed:", result);
                alert(`Transaction failed with code: ${result.code}`);
            }

        } catch (error) {
            console.error("Error placing bet:", error);
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    // Function to fetch BTC price
    const fetchBTCPrice = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const queryMsg = {
                get_price: {
                    base: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/ubtc",
                    quote: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/uusdc"
                }
            };

            const encodedQuery = btoa(JSON.stringify(queryMsg));
            const url = `${chainConfig.rest}/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS}/smart/${encodedQuery}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error fetching BTC price from contract');

            const result = await response.json();
            const priceString = result.data?.price;

            if (!priceString) throw new Error('Response does not contain "price" property');

            setCurrentPrice(parseFloat(priceString));
        } catch (err) {
            console.error(err);
            setError('Could not fetch BTC price. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to fetch initial price and update every minute
    useEffect(() => {
        fetchBTCPrice();

        const interval = setInterval(fetchBTCPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    // Effect to handle countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    // Function to format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle direction selection
    const handleDirectionSelect = (direction) => {
        if (balance < FIXED_BET_AMOUNT) {
            alert('Insufficient balance to place the bet.');
            return;
        }
        setSelectedDirection(direction);
        setShowConfirmation(true);
    };

    // Confirm bet
    const handleConfirmBet = () => {
        if (selectedDirection) {
            placeOption(selectedDirection);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">
                        {keplrConnected ? `${balance.toFixed(4)} AWSM` : 'Disconnected'}
                    </span>
                </div>
                <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Keplr Connection */}
            <div className="mb-6">
                {keplrConnected ? (
                    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                        <span>Connected: {walletAddress}</span>
                        <button
                            onClick={disconnectKeplr}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connectKeplr}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg flex justify-center items-center space-x-2"
                    >
                        <Wallet className="w-5 h-5" />
                        <span>Connect with Keplr</span>
                    </button>
                )}
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Current BTC Price */}
                <div className="text-center">
                    <h2 className="text-gray-400 mb-2">Current BTC Price</h2>
                    {isLoading ? (
                        <div className="text-2xl">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="text-4xl font-bold">${currentPrice.toLocaleString()}</div>
                    )}
                </div>

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
                        disabled={isLoading || error || !keplrConnected}
                    >
                        <ArrowUpCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Up</span>
                    </button>

                    <button
                        onClick={() => handleDirectionSelect('down')}
                        className="bg-red-600 hover:bg-red-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                        disabled={isLoading || error || !keplrConnected}
                    >
                        <ArrowDownCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Down</span>
                    </button>
                </div>

                {/* Bet Information */}
                <div className="text-center text-gray-400">
                    Fixed bet amount: {FIXED_BET_AMOUNT} AWSM
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
                            You are betting {FIXED_BET_AMOUNT} AWSM that the price
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
                                <span className={bet.result === 'win' ? 'text-green-500' : 'text-red-500'}>
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