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

interface ConfirmationDialogProps {
    isOpen: boolean;
    direction: 'up' | 'down' | null;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog = ({ isOpen, direction, onConfirm, onCancel }: ConfirmationDialogProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialogContent className="bg-gray-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Bet</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                        You are betting 0.01 AUOD that the price
                        {direction === 'up' ? ' will go up ' : ' will go down '}
                        in the next block.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Confirm Bet
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationDialog;