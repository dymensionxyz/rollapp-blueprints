import * as Dialog from '@radix-ui/react-dialog'
import { MdClose } from 'react-icons/md'

export const buttonBase = "px-5 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";

export const AlertDialog = Dialog.Root

export const AlertDialogContent = ({ children, className }) => (
    <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[90vw] max-w-md bg-gray-800 text-white p-6 rounded-xl shadow-2xl
        border border-gray-700 focus:outline-none z-50 ${className}`}
        >
            {children}

            <Dialog.Close asChild>
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white
            focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                >
                    <MdClose size={20} aria-hidden />
                </button>
            </Dialog.Close>
        </Dialog.Content>
    </Dialog.Portal>
)

export const AlertDialogHeader = ({ children }) => (
    <div className="mb-3">
        <Dialog.Title className="text-xl font-semibold text-white">
            {children}
        </Dialog.Title>
    </div>
)

export const AlertDialogDescription = ({ children }) => (
    <Dialog.Description className="mb-4 text-gray-400 text-base leading-tight">
        {children}
    </Dialog.Description>
)

export const AlertDialogFooter = ({ children }) => (
    <div className="mt-8 flex justify-end gap-4">{children}</div>
)

export const AlertDialogTitle = Dialog.Title

export const AlertDialogAction = ({ children, ...props }) => (
    <Dialog.Close
        className={`${buttonBase} bg-blue-600 hover:bg-blue-700 
      text-white focus:ring-blue-500`}
        {...props}
    >
        {children}
    </Dialog.Close>
)

export const AlertDialogCancel = ({ children, ...props }) => (
    <Dialog.Close
        className={`${buttonBase} bg-gray-700 hover:bg-gray-600 
      text-gray-100 focus:ring-gray-500`}
        {...props}
    >
        {children}
    </Dialog.Close>
)
