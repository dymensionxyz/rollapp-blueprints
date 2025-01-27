import { Bounce, toast, TypeOptions } from 'react-toastify';
import {ReactNode} from "react";

export const showToast = (message: string | ReactNode, type: TypeOptions) => toast(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    theme: 'colored',
    transition: Bounce,
    type,
});

export const showErrorToast = (message: string | ReactNode) => showToast(message, 'error');

export const showWarningToast = (message: string | ReactNode) => showToast(message, 'warning');

export const showSuccessToast = (message: string | ReactNode) => showToast(message, 'success');

export const showInfoToast = (message: string | ReactNode) => showToast(message, 'info');