'use client'

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
} from "./ui/alert-dialog";

// Importas tu hook y tipos desde el contexto
import { useContract } from './contexts/ContractContext';
import { PlaceOptionMsg } from './contexts/ContractContext';

// Importas tu componente DymensionConnect (el nuevo)
import { DymensionConnect } from "./DymensionConnect";

// Direcciones de contrato que puedas necesitar
const CONTRACT_ADDRESS = "rol1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqg3zqxw";
const BINARY_OPTIONS_CONTRACT_ADDRESS = "rol17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgss2u902";

// Valores fijos
const FIXED_EXPIRATION = 1700000000;
const FIXED_BET_AMOUNT_AWSM = "10000"; // "10000" = 0.01 AWSM (asumiendo 6 decimales, etc.)
const COUNT_DOWN_INTERVAL = 60;

const BinaryOptionsDApp = () => {
    // ------------------------------------------------------------------
    // ESTADOS de la UI
    // ------------------------------------------------------------------
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(COUNT_DOWN_INTERVAL);
    const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betResult] = useState<null | string>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Historial simulado (o lo que uses para mostrar tus apuestas pasadas)
    const betHistory = [
        { direction: 'up', entryPrice: 44950.20, finalPrice: 45100.30, result: 'win' },
        { direction: 'down', entryPrice: 45200.10, finalPrice: 45150.40, result: 'loss' },
    ];

    // ------------------------------------------------------------------
    // OBTENER DATOS DEL CONTEXTO
    // ------------------------------------------------------------------
    const { address, isConnected, placeOption } = useContract();

    // ------------------------------------------------------------------
    // FUNCIÓN PARA TRAER EL PRECIO (por ejemplo, desde tu contrato)
    // ------------------------------------------------------------------
    const fetchBTCPrice = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Aquí puedes hacer la query a tu contrato o a una API.
            // Como ejemplo rápido simulo un fetch a tu contrato:
            const encodedQuery = btoa(JSON.stringify({
                get_price: {
                    base: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/ubtc",
                    quote: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/uusdc"
                }
            }));
            const url = `http://localhost:1317/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS}/smart/${encodedQuery}`;
            // Nota: Ajusta la URL real de tu REST endpoint.

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error fetching BTC price from contract');

            const result = await response.json();
            const priceString = result.data?.price;
            if (!priceString) throw new Error('No "price" property in response');

            setCurrentPrice(parseFloat(priceString));
        } catch (err: any) {
            console.error(err);
            setError('Could not fetch BTC price. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // USE EFFECTS
    // ------------------------------------------------------------------
    // 1) Cargar precio inicial y refrescar cada minuto
    useEffect(() => {
        fetchBTCPrice();

        const interval = setInterval(fetchBTCPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    // 2) Temporizador para el contador
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    // ------------------------------------------------------------------
    // MANEJO DE APUESTAS
    // ------------------------------------------------------------------
    const handleDirectionSelect = (direction: 'up' | 'down') => {
        // Aquí podrías checar balance, etc.
        // En este ejemplo, lo omito para simplificar.
        setSelectedDirection(direction);
        setShowConfirmation(true);
    };

    const handleConfirmBet = async () => {
        if (!selectedDirection) return;

        try {
            setIsLoading(true);

            // Preparamos el mensaje que espera tu `placeOption` (desde el contexto)
            const msg: PlaceOptionMsg = {
                direction: selectedDirection === 'up' ? 'Up' : 'Down',
                expiration: FIXED_EXPIRATION,
                bet_amount: {
                    denom: "awsm", // Ajusta si tu token es "awsm" u otro
                    amount: FIXED_BET_AMOUNT_AWSM,
                },
                market: {
                    base:  "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/ubtc",
                    quote: "factory/osmo13s0f55s8ppwm35npn53pkndphzyctfl7gu8q9d/uusdc",
                },
            };

            // Llamamos la función del contexto
            await placeOption(msg);
            console.log("Option placed!");

            // Aquí podrías refrescar balance, precio, etc. si tu contexto
            // no lo hace automáticamente (ej: refreshAll).
        } catch (error) {
            console.error("Error placing bet:", error);
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    // ------------------------------------------------------------------
    // UTILIDADES DE UI
    // ------------------------------------------------------------------
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">
            {/* Si estás conectado, muestra la dirección abreviada, sino “Disconnected” */}
                        {isConnected && address
                            ? address.slice(0, 6) + '...' + address.slice(-4)
                            : 'Disconnected'}
          </span>
                </div>
                <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* DymensionConnect (el nuevo) */}
            <div className="mb-6">
                <DymensionConnect />
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
                        currentPrice && (
                            <div className="text-4xl font-bold">
                                ${currentPrice.toLocaleString()}
                            </div>
                        )
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
                        disabled={isLoading || !isConnected}
                    >
                        <ArrowUpCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Up</span>
                    </button>

                    <button
                        onClick={() => handleDirectionSelect('down')}
                        className="bg-red-600 hover:bg-red-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                        disabled={isLoading || !isConnected}
                    >
                        <ArrowDownCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Down</span>
                    </button>
                </div>

                {/* Bet Information */}
                <div className="text-center text-gray-400">
                    Fixed bet amount: 0.01 AWSM
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
                            You are betting 0.01 AWSM that the price
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
                                <span
                                    className={
                                        bet.result === 'win' ? 'text-green-500' : 'text-red-500'
                                    }
                                >
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