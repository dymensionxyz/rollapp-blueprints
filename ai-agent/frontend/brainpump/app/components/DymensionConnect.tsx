'use client'

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useContract} from '../contexts/ContractContext';
import {showErrorToast, showWarningToast} from "@/app/utils/toast-utils";
import {formatEther} from "ethers";
import {getShortenedAddress} from "@/app/utils/address-utils";

const DYMENSION_CONNECT_URL = 'https://testnet.dymension.xyz';
const DYMENSION_CONNECT_NETWORK_IDS = ['desmosai_433519-1'];
const DYMENSION_CONNECT_NETWORK_MAIN_DENOM = 'adesmos'

export function DymensionConnect() {
    const [dymensionConnectOpen, setDymensionConnectOpen] = useState(false);
    const [dymensionConnectReady, setDymensionConnectReady] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const {
        hexAddress,
        contractMessageToExecute,
        setContractMessageExecuted,
        setAddresses,
        setWalletBalance,
        handleTxResponse,
        setPersuasion,
        setGuessedNumber,
        setBetAmount,
    } = useContract();

    const qrAccount = useMemo(() => typeof window !==
        'undefined' &&
        new URLSearchParams(window?.location.search).get('qrAccount'), []);

    const dymensionConnectUrl = useMemo(
        () => `${DYMENSION_CONNECT_URL}/connect` +
            `${qrAccount ? `/account/${qrAccount}` : ''}?networkIds=${DYMENSION_CONNECT_NETWORK_IDS.join(',')}`,
        [qrAccount],
    );

    const sendMessage = useCallback((message: any) =>
        iframeRef.current?.contentWindow?.postMessage(message, DYMENSION_CONNECT_URL), []);

    const updateTriggerBoundingRect = useCallback(() => {
        const boundingRect = buttonRef.current?.getBoundingClientRect();
        if (boundingRect) {
            sendMessage({type: 'setTriggerBoundingRect', rect: boundingRect});
        }
    }, [sendMessage]);

    const initModal = useCallback(() => {
        updateTriggerBoundingRect();
        sendMessage({
            type: "setStyles",
            styles: {
                "--black-light": "rgb(63 81 59)",
                "--black-light-rgb": "63, 81, 59",
                "--black-dark": "rgb(27 40 24)",
                "--black-dark-rgb": "27, 40, 24",
                "--background-color": "rgb(42 59 42)",
                "--background-color-secondary": "rgb(63 78 63)",
            },
        });
        sendMessage({type: 'setMenuAlign', align: 'right'});
    }, [sendMessage, updateTriggerBoundingRect]);

    const handleWalletError = useCallback(({
                                               code,
                                               walletType,
                                               originalError,
                                           }: { code?: string, walletType?: string, originalError?: any }) => {
        if (!code) {
            return;
        }
        switch (code) {
            case 'FAILED_INTEGRATE_CHAIN':
                if (originalError?.message?.toLowerCase()?.includes('ledger is unsupported')) {
                    showErrorToast(`${walletType || 'The wallet'} is currently not supporting this chain with Ledger.`);
                } else {
                    showErrorToast(`Failed integrate chain with ${walletType || 'the wallet'}`);
                }
                break;
            case 'FAILED_INIT_WALLET':
                showErrorToast(`Failed init ${walletType || 'the wallet'}`);
                break;
            case 'KEY_NOT_FOUND':
                showWarningToast(`Create or import an account in your ${walletType || 'wallet'}`);
                break;
            case 'NO_OFFLINE_SIGNER':
                showErrorToast(`${walletType || 'The wallet'} account not detected`);
                break;
            case 'UNSUPPORTED_WALLET':
                showErrorToast(`${walletType || 'The selected wallet is'} not supported`);
                break;
            case 'UPGRADE_WALLET':
                showWarningToast(`Please use the recent version of ${walletType || 'the wallet'} extension`);
                break;
            case 'WALLET_NOT_CONNECTED':
                showWarningToast('No wallet connected for this chain');
                break;
            case 'INSTALL_WALLET':
                showWarningToast(`${walletType || 'The'} wallet not installed`);
                break;
            case 'UNSUPPORTED_NETWORK':
                showErrorToast(`Can't link ${walletType || 'the'} wallet to the designated network`);
                break;
            case 'ACCOUNTS_ALREADY_REQUESTED':
                showErrorToast(`Connect to ${walletType || 'the wallet'}`);
                break;
            case 'REQUEST_REJECTED':
                showWarningToast(`Connecting to ${walletType || 'the wallet'} rejected by the user`);
                break;
            case 'SWITCH_NETWORK':
                showErrorToast(`Switch to this chain in ${walletType || 'the wallet'}`);
                break;
            case 'UNSUPPORTED_MESSAGE':
                if (walletType === 'Quick Auth') {
                    showWarningToast('Quick Auth session has expired');
                } else {
                    showWarningToast(`This message not supported by ${walletType || 'the wallet'}`);
                }
                break;
            default:
                showWarningToast(`${walletType || 'Wallet'} connection failed, please try again later`);
        }
    }, []);

    useEffect(() => {
        if (contractMessageToExecute) {
            sendMessage({type: 'executeEthTx', contract: contractMessageToExecute});
            setContractMessageExecuted();
        }
    }, [contractMessageToExecute, sendMessage, setContractMessageExecuted]);

    useEffect(() => {
        window.addEventListener('scroll', updateTriggerBoundingRect, true);
        window.addEventListener('resize', updateTriggerBoundingRect, true);
        return () => {
            window.removeEventListener('scroll', updateTriggerBoundingRect, true);
            window.removeEventListener('resize', updateTriggerBoundingRect, true);
        };
    }, [updateTriggerBoundingRect]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== DYMENSION_CONNECT_URL) {
                return;
            }
            if (event.data.type === 'ready') {
                setDymensionConnectReady(true);
            }
            if (event.data.type === 'menu-visible') {
                setDymensionConnectOpen(event.data.value);
            }
            if (event.data.type === 'connect') {
                setAddresses(event.data.address, event.data.hexAddress);
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'balances') {
                setWalletBalance(formatEther(event.data.balances[0]?.amount || '0'));
            }
            if (event.data.type === 'disconnect') {
                setAddresses('', '');
                setPersuasion('');
                setGuessedNumber(undefined);
                setBetAmount(undefined);
                setWalletBalance('0');
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'tx-response') {
                handleTxResponse({
                    response: event.data.response && JSON.parse(event.data.response),
                    error: event.data.error && JSON.parse(event.data.error),
                });
            }
            if (event.data.type === 'wallet-error') {
                handleWalletError(JSON.parse(event.data.error || '{}'));
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [
        initModal,
        setAddresses,
        sendMessage,
        setWalletBalance,
        updateTriggerBoundingRect,
        handleTxResponse,
        handleWalletError,
    ]);

    return (
        <div className="absolute">
            <button
                className="px-4 py-2 bg-[rgb(var(--neon-green))] text-black rounded-md hover:opacity-90 transition-opacity"
                disabled={!dymensionConnectReady}
                ref={buttonRef}
                onClick={() => {
                    setDymensionConnectOpen(!dymensionConnectOpen);
                    updateTriggerBoundingRect();
                }}
            >
                {hexAddress ? getShortenedAddress(hexAddress) : 'Connect Wallet'}
            </button>
            <iframe
                ref={iframeRef}
                onLoad={initModal}
                style={{display: dymensionConnectOpen || qrAccount ? 'block' : 'none'}}
                allow='clipboard-read; clipboard-write; camera'
                title='dymension-connect'
                className='relative w-70 h-96 z-10'
                src={dymensionConnectUrl}
            />
        </div>
    );
}
