'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useContract } from '../contexts/ContractContext';

const DYMENSION_CONNECT_URL = 'https://testnet.dymension.xyz';
const DYMENSION_CONNECT_NETWORK_IDS = ['desmosai_433519-1'];
const DYMENSION_CONNECT_NETWORK_MAIN_DENOM = 'adesmos'

export function DymensionConnect() {
    const [dymensionConnectOpen, setDymensionConnectOpen] = useState(false);
    const [dymensionConnectReady, setDymensionConnectReady] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { address, connect, disconnect } = useContract();

    const qrAccount = useMemo(() => new URLSearchParams(window.location.search).get('qrAccount'), []);

    const sendMessage = useCallback((message: any) => {
        iframeRef.current?.contentWindow?.postMessage(message, DYMENSION_CONNECT_URL);
    }, []);

    const updateTriggerBoundingRect = useCallback(() => {
        const boundingRect = buttonRef.current?.getBoundingClientRect();
        if (boundingRect) {
            sendMessage({ type: 'setTriggerBoundingRect', rect: boundingRect });
        }
    }, [sendMessage]);

    const initModal = useCallback(() => {
        updateTriggerBoundingRect();
        sendMessage({
            type: 'setStyles',
            styles: {
                '--black-light': 'rgb(63 81 59)',
                '--black-light-rgb': '63, 81, 59',
                '--black-dark': 'rgb(27 40 24)',
                '--black-dark-rgb': '27, 40, 24',
                '--background-color': 'rgb(42 59 42)',
                '--background-color-secondary': 'rgb(63 78 63)'
            }
        });
        sendMessage({ type: 'setMenuAlign', align: 'center' });
    }, [sendMessage, updateTriggerBoundingRect]);

    useEffect(() => {
        window.addEventListener('scroll', updateTriggerBoundingRect, true);
        window.addEventListener('resize', updateTriggerBoundingRect, true);
        return () => {
            window.removeEventListener('scroll', updateTriggerBoundingRect, true);
            window.removeEventListener('resize', updateTriggerBoundingRect, true);
        }
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
                connect();
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'disconnect') {
                disconnect();
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'wallet-error') {
                console.error('Wallet error:', event.data.error);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [connect, disconnect, updateTriggerBoundingRect]);

    return (
        <div className="relative">
            <button
                disabled={!dymensionConnectReady}
                ref={buttonRef}
                onClick={() => {
                    setDymensionConnectOpen(!dymensionConnectOpen)
                    updateTriggerBoundingRect();
                }}
                className="px-4 py-2 bg-[rgb(var(--neon-green))] text-black rounded-md hover:opacity-90 transition-opacity"
            >
                {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect'}
            </button>
            <iframe
                ref={iframeRef}
                onLoad={initModal}
                style={{ display: dymensionConnectOpen || qrAccount ? 'block' : 'none' }}
                allow='clipboard-read; clipboard-write; camera'
                title='dymension-connect'
                className='absolute top-full right-0 mt-2 w-80 h-96 z-50'
                src={`${DYMENSION_CONNECT_URL}/connect${qrAccount ? `/account/${qrAccount}` : ''}?networkIds=${DYMENSION_CONNECT_NETWORK_IDS.join(',')}`}
            />
        </div>
    );
}

