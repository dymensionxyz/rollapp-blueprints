// components/BetHistoryDialog.tsx
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    buttonBase,
} from "./ui/alert-dialog";

interface BetHistoryItem {
    direction: 'up' | 'down';
    entryPrice: number;
    finalPrice: number;
    result: 'win' | 'loss';
}

interface BetHistoryDialogProps {
    isOpen: boolean;
    history: BetHistoryItem[];
    onClose: () => void;
}

const BetHistoryDialog = ({ isOpen, history, onClose }: BetHistoryDialogProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-gray-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Bet History</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4 p-4">
                    {history.map((bet, index) => (
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
                        className={`${buttonBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`}
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