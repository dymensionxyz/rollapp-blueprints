import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./AlertDialog";

export interface BetHistoryItem {
    id: number;
    direction: 'up' | 'down';
    strikePrice: number;
    expiration: number;
    betAmount: string;
    outcome: boolean | null;
    settled: boolean;
}

interface BetHistoryDialogProps {
    isOpen: boolean;
    history: BetHistoryItem[];
    onClose: () => void;
    onSettle: (optionId: number) => void;
}

const BetHistoryDialog = ({ isOpen, history, onClose, onSettle }: BetHistoryDialogProps) => {
    const getResultStatus = (outcome: boolean | null, settled: boolean, expiration: number) => {
        if (!settled) {
            return Date.now() > expiration * 1000 ? "Expired" : "Pending";
        }
        return outcome ? "Win" : "Loss";
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-gray-800 text-white max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Bet History</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4 p-4">
                    {history.map((bet) => (
                        <div
                            key={bet.id}
                            className="bg-gray-700 p-4 rounded-lg flex flex-col space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    {bet.direction === 'up' ? (
                                        <ArrowUpCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <ArrowDownCircle className="w-6 h-6 text-red-500" />
                                    )}
                                    <div>
                                        <div className="font-medium">
                                            {bet.direction.toUpperCase()} • {bet.betAmount}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Strike: ${bet.strikePrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-sm ${
                                    getResultStatus(bet.outcome, bet.settled, bet.expiration) === 'Win'
                                        ? 'text-green-500'
                                        : getResultStatus(bet.outcome, bet.settled, bet.expiration) === 'Loss'
                                            ? 'text-red-500'
                                            : 'text-yellow-500'
                                }`}>
                                    {getResultStatus(bet.outcome, bet.settled, bet.expiration)}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400">
                                Expiration: {new Date(bet.expiration * 1000).toLocaleString()}
                            </div>

                            {/* Settlement button */}
                            {!bet.settled && Date.now() > bet.expiration * 1000 && (
                                <button
                                    onClick={() => onSettle(bet.id)}
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded self-end"
                                >
                                    Settle Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={onClose}
                    >
                        Close
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BetHistoryDialog;