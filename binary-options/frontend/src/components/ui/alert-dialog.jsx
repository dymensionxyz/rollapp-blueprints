// src/components/ui/alert-dialog.jsx
import * as Dialog from '@radix-ui/react-dialog'
import { MdClose } from 'react-icons/md'

// Exporta los componentes personalizados de AlertDialog
export const AlertDialog = Dialog.Root
export const AlertDialogTrigger = Dialog.Trigger

// Actualiza AlertDialogContent para incluir el ícono de cierre
export const AlertDialogContent = ({ children, className }) => (
    <Dialog.Content className={`bg-gray-800 text-white p-6 rounded-lg relative ${className}`}>
        <Dialog.Close asChild>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white">
                <MdClose size={24} />
            </button>
        </Dialog.Close>
        {children}
    </Dialog.Content>
)

export const AlertDialogHeader = ({ children }) => (
    <Dialog.Title className="text-lg font-semibold">{children}</Dialog.Title>
)

export const AlertDialogDescription = ({ children }) => (
    <Dialog.Description className="mt-2 text-sm text-gray-400">{children}</Dialog.Description>
)

export const AlertDialogFooter = ({ children }) => (
    <div className="mt-4 flex justify-end space-x-2">{children}</div>
)

export const AlertDialogTitle = Dialog.Title
export const AlertDialogAction = Dialog.Trigger
export const AlertDialogCancel = Dialog.Close