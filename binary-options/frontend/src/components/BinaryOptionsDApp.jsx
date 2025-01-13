import  { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Clock, ChevronRight } from 'lucide-react';
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
import { GasPrice } from "@cosmjs/stargate";
import {coin} from "@cosmjs/proto-signing";

const CONTRACT_ADDRESS = "rol1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqg3zqxw";
const BINARY_OPTIONS_CONTRACT_ADDRESS = "rol17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgss2u902";
const FEE_DENOM = "awsm";


const BinaryOptionsDApp = () => {
    const countDownInterval = 60;

    const [currentPrice, setCurrentPrice] = useState(null);
    const [balance, setBalance] = useState(0.5);
    const [timeLeft, setTimeLeft] = useState(countDownInterval);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betResult, setBetResult] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fixedBetAmount = 0.01; // Monto fijo de la apuesta en awsm

    const [walletAddress, setWalletAddress] = useState(null);
    const [keplrConnected, setKeplrConnected] = useState(false);

    // Simulated bet history
    const [betHistory] = useState([
        { direction: 'up', entryPrice: 44950.20, finalPrice: 45100.30, result: 'win' },
        { direction: 'down', entryPrice: 45200.10, finalPrice: 45150.40, result: 'loss' },
    ]);

    const chainConfig = {
        chainId: "rollappwasm_1234-1",
        chainName: "RollApp Local Chain",
        rpc: "http://localhost:26657",
        rest: "http://localhost:1317",
        stakeCurrency: {
            coinDenom: "AWSM",
            coinMinimalDenom: "awsm",
            coinDecimals: 6,
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
                coinDecimals: 6,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "AWSM",
                coinMinimalDenom: "awsm",
                coinDecimals: 6,
            },
        ],
        gasPriceStep: {
            low: 0.9,
            average: 1,
            high: 1.2,
        },
    };

    const connectKeplr = async () => {
        if (!window.keplr) {
            alert('Por favor, instala la extensión Keplr para continuar.');
            return;
        }

        try {
            await window.keplr.experimentalSuggestChain(chainConfig);

            await window.keplr.enable(chainConfig.chainId);
            const offlineSigner = window.getOfflineSigner(chainConfig.chainId);
            const accounts = await offlineSigner.getAccounts();
            setWalletAddress(accounts[0].address);
            setKeplrConnected(true);

            getBalance(accounts[0].address);
        } catch (error) {
            console.error("Error al conectar con Keplr:", error);
            alert('No se pudo conectar con Keplr. Por favor, intenta de nuevo.');
        }
    };

    const disconnectKeplr = () => {
        setWalletAddress(null);
        setKeplrConnected(false);
        setBalance(0.0);
    };

    const getBalance = async (address) => {
        try {
            const response = await fetch(`${chainConfig.rest}/cosmos/bank/v1beta1/balances/${address}`);
            if (!response.ok) {
                throw new Error('Error al obtener el saldo');
            }
            const data = await response.json();
            const balanceData = data.balances.find(coin => coin.denom === chainConfig.stakeCurrency.coinMinimalDenom);
            if (balanceData) {
                setBalance(parseFloat(balanceData.amount) / Math.pow(10, chainConfig.stakeCurrency.coinDecimals));
            } else {
                setBalance(0.0);
            }
        } catch (error) {
            console.error("Error al obtener el saldo:", error);
            alert('No se pudo obtener el saldo de la billetera.');
        }
    };

    const placeOption = async (direction) => {
        if (!keplrConnected || !walletAddress) {
            alert("Por favor, conecta tu cartera primero.");
            return;
        }

        try {
            setIsLoading(true);

            console.log("creando mensaje")

            const betAmount = fixedBetAmount * Math.pow(10, chainConfig.stakeCurrency.coinDecimals);


            const msg = {
                place_option: {
                    direction: direction === "up" ? "up" : "down",
                    expiration: Math.floor(Date.now() / 1000) + countDownInterval,
                    bet_amount: {
                        denom: chainConfig.stakeCurrency.coinMinimalDenom,
                        amount: betAmount.toString()
                    },
                    market: {
                        base: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/ubtc",
                        quote: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/uusdc",
                    },
                },
            };

            const funds = [coin(betAmount.toString(), chainConfig.stakeCurrency.coinMinimalDenom)];

            console.log(msg);

            const offlineSigner = window.getOfflineSigner(chainConfig.chainId);
            const client = await SigningCosmWasmClient.connectWithSigner(
                chainConfig.rpc,
                offlineSigner,
                {
                    gasPrice: GasPrice.fromString(`1000000000awsm`),
                }
            );

            console.log("enviando transaccion desde ", walletAddress);



            // Enviar la transacción
            const result = await client.execute(
                walletAddress.toString(),
                BINARY_OPTIONS_CONTRACT_ADDRESS,
                msg,
                250000,
                `Apuesta ${direction === "up" ? "Sube" : "Baja"} de ${fixedBetAmount} AWSM`,
                funds,
            );

            console.log("Transacción exitosa:", result);
            alert("Apuesta realizada exitosamente.");
            getBalance(walletAddress);
        } catch (error) {
            console.error("Error al realizar la apuesta:", error);
            if (error instanceof Error) {
                console.log(`Error al realizar la apuesta: ${error.message}`);
            } else {
                console.log("Error al realizar la apuesta. Revisa la consola para más detalles.");
            }
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

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

            const base64Query = btoa(JSON.stringify(queryMsg));

            const url = `${chainConfig.rest}/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS}/smart/${base64Query}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al consultar precio de BTC en el contrato');
            }

            const result = await response.json();

            const priceString = result.data?.price;
            if (!priceString) {
                throw new Error('La respuesta no contiene la propiedad "price"');
            }

            const priceNumber = parseFloat(priceString);
            setCurrentPrice(priceNumber);
        } catch (err) {
            console.error(err);
            setError('No se pudo obtener el precio de BTC. Por favor, intenta de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBTCPrice(); // Fetch inicial

        const interval = setInterval(() => {
            fetchBTCPrice();
        }, 60000);

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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDirectionSelect = (direction) => {
        if (balance < fixedBetAmount) {
            alert('Saldo insuficiente para realizar la apuesta.');
            return;
        }
        setSelectedDirection(direction);
        setShowConfirmation(true);
    };

    const handleConfirmBet = () => {
        console.log('Confirmando apuesta...');
        if (selectedDirection) {
            placeOption(selectedDirection);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5"/>
                    <span className="font-medium">
                        {keplrConnected ? `${balance.toFixed(4)} AWSM` : 'Desconectado'}
                    </span>
                </div>

                <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1"/>
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="mb-6">
                {keplrConnected ? (
                    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                        <span>Conectado: {walletAddress}</span>
                        <button
                            onClick={disconnectKeplr}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                        >
                            Desconectar
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connectKeplr}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg flex justify-center items-center space-x-2"
                    >
                        <Wallet className="w-5 h-5"/>
                        <span>Conectar con Keplr</span>
                    </button>
                )}
            </div>

            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-gray-400 mb-2">Precio Actual de BTC</h2>
                    {isLoading ? (
                        <div className="text-2xl">Cargando...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="text-4xl font-bold">${currentPrice.toLocaleString()}</div>
                    )}
                </div>

                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-1000"
                        style={{width: `${(timeLeft / countDownInterval) * 100}%`}}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleDirectionSelect('up')}
                        className="bg-green-600 hover:bg-green-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                        disabled={isLoading || error || !keplrConnected} // Deshabilitar si está cargando, hay error o Keplr no está conectado
                    >
                        <ArrowUpCircle className="w-12 h-12 mb-2"/>
                        <span className="text-xl font-semibold">Sube</span>
                    </button>

                    <button
                        onClick={() => handleDirectionSelect('down')}
                        className="bg-red-600 hover:bg-red-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                        disabled={isLoading || error || !keplrConnected} // Deshabilitar si está cargando, hay error o Keplr no está conectado
                    >
                        <ArrowDownCircle className="w-12 h-12 mb-2"/>
                        <span className="text-xl font-semibold">Baja</span>
                    </button>
                </div>

                <div className="text-center text-gray-400">
                    Monto fijo de apuesta: {fixedBetAmount} AWSM
                </div>

                {betResult && (
                    <div className={`text-center p-4 rounded-lg ${
                        betResult === 'win' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                        <h3 className="text-2xl font-bold">
                            {betResult === 'win' ? '¡Ganaste!' : 'Perdiste'}
                        </h3>
                    </div>
                )}

                <button
                    onClick={() => setShowHistory(true)}
                    className="w-full bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                    <span>Historial de Apuestas</span>
                    <ChevronRight className="w-5 h-5"/>
                </button>
            </div>

            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent className="bg-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirma Tu Apuesta</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Estás apostando {fixedBetAmount} AWSM a que el precio
                            {selectedDirection === 'up' ? ' subirá ' : ' bajará '}
                            en los próximos {Math.floor(timeLeft / 60)} minutos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleConfirmBet}
                        >
                            Confirmar Apuesta
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showHistory} onOpenChange={setShowHistory}>
                <AlertDialogContent className="bg-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Historial de Apuestas</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        {betHistory.map((bet, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                            >
                                <div className="flex items-center space-x-3">
                                    {bet.direction === 'up' ? (
                                        <ArrowUpCircle className="w-6 h-6 text-green-500"/>
                                    ) : (
                                        <ArrowDownCircle className="w-6 h-6 text-red-500"/>
                                    )}
                                    <div>
                                        <div className="text-sm text-gray-400">
                                            Entrada: ${bet.entryPrice.toLocaleString()}
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
                            Cerrar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );

};

export default BinaryOptionsDApp;