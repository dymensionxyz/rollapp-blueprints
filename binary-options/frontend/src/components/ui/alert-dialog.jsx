import * as Dialog from '@radix-ui/react-dialog'
import { MdClose } from 'react-icons/md'

export const AlertDialog = Dialog.Root
export const AlertDialogTrigger = Dialog.Trigger

export const AlertDialogContent = ({ children, className }) => (
    <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[90vw] max-w-md bg-gray-800 text-white p-6 rounded-lg shadow-xl
        focus:outline-none z-50 ${className}`}
        >
            {children}
            <Dialog.Close asChild>
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <MdClose size={24} aria-hidden />
                </button>
            </Dialog.Close>
        </Dialog.Content>
    </Dialog.Portal>
)

export const AlertDialogHeader = ({ children }) => (
    <div className="mb-4">
        <Dialog.Title className="text-xl font-bold text-white">
            {children}
        </Dialog.Title>
    </div>
)

export const AlertDialogDescription = ({ children }) => (
    <Dialog.Description className="mb-6 text-gray-300">
        {children}
    </Dialog.Description>
)

export const AlertDialogFooter = ({ children }) => (
    <div className="mt-6 flex justify-end gap-3">{children}</div>
)

export const AlertDialogTitle = Dialog.Title
export const AlertDialogAction = Dialog.Close
export const AlertDialogCancel = Dialog.Close