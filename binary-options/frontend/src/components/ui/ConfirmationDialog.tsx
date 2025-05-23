import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./AlertDialog";
import config from "../../config/config";

interface ConfirmationDialogProps {
    isOpen: boolean;
    direction: 'up' | 'down' | null;
    onConfirm: () => void;
    onCancel: () => void;
    betAmount: number;
}

const ConfirmationDialog = ({ isOpen, direction, onConfirm, onCancel, betAmount }: ConfirmationDialogProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialogContent className="bg-gray-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mb-4">Confirm Your Bet</AlertDialogTitle> {/* Añadido mb-4 */}
                    <AlertDialogDescription>
                        You are betting {Intl.NumberFormat().format(betAmount)} {config.screenDenom} that the price
                        {direction === 'up' ? ' will go up ' : ' will go down '}
                        in 60 seconds.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                    >
                        Confirm Bet
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationDialog;
