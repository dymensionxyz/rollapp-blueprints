import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Clock, ChevronRight, AlertCircle } from 'lucide-react';
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

const BinaryOptionsDApp = () => {
    const [currentPrice, setCurrentPrice] = useState(45123.45);
    const [balance, setBalance] = useState(0.5);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [betResult, setBetResult] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const fixedBetAmount = 0.01; // Fixed bet amount in BTC

    // Simulated bet history
    const [betHistory] = useState([
        { direction: 'up', entryPrice: 44950.20, finalPrice: 45100.30, result: 'win' },
        { direction: 'down', entryPrice: 45200.10, finalPrice: 45150.40, result: 'loss' },
    ]);

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    // Format time remaining
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDirectionSelect = (direction) => {
        if (balance < fixedBetAmount) {
            // Show insufficient balance error
            return;
        }
        setSelectedDirection(direction);
        setShowConfirmation(true);
    };

    const handleConfirmBet = () => {
        setShowConfirmation(false);
        setBalance(prev => prev - fixedBetAmount);
        // Simulate bet outcome after timer ends
        setTimeout(() => {
            const won = Math.random() > 0.5;
            setBetResult(won ? 'win' : 'loss');
            if (won) {
                setBalance(prev => prev + (fixedBetAmount * 1.9));
            }
        }, timeLeft * 1000);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Status Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">{balance.toFixed(4)} BTC</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Price Display */}
                <div className="text-center">
                    <h2 className="text-gray-400 mb-2">Current BTC Price</h2>
                    <div className="text-4xl font-bold">${currentPrice.toLocaleString()}</div>
                </div>

                {/* Timer Progress Bar */}
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-1000"
                        style={{ width: `${(timeLeft / 300) * 100}%` }}
                    />
                </div>

                {/* Betting Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleDirectionSelect('up')}
                        className="bg-green-600 hover:bg-green-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                    >
                        <ArrowUpCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Up</span>
                    </button>

                    <button
                        onClick={() => handleDirectionSelect('down')}
                        className="bg-red-600 hover:bg-red-700 p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95"
                    >
                        <ArrowDownCircle className="w-12 h-12 mb-2" />
                        <span className="text-xl font-semibold">Down</span>
                    </button>
                </div>

                {/* Fixed Bet Amount Display */}
                <div className="text-center text-gray-400">
                    Fixed bet amount: {fixedBetAmount} BTC
                </div>

                {/* Bet Result */}
                {betResult && (
                    <div className={`text-center p-4 rounded-lg ${
                        betResult === 'win' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                        <h3 className="text-2xl font-bold">
                            {betResult === 'win' ? 'You Won!' : 'You Lost'}
                        </h3>
                    </div>
                )}

                {/* History Button */}
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
                            You are betting {fixedBetAmount} BTC that the price will go
                            {selectedDirection === 'up' ? ' up ' : ' down '}
                            in the next {Math.floor(timeLeft / 60)} minutes.
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

            {/* History Modal */}
            <AlertDialog open={showHistory} onOpenChange={setShowHistory}>
                <AlertDialogContent className="bg-gray-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bet History</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4">
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
