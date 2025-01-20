'use client'

import  { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {Wallet} from "lucide-react";
import {useContract} from "./contexts/ContractContext";

const DYMENSION_CONNECT_URL = 'https://testnet.dymension.xyz';
const DYMENSION_CONNECT_NETWORK_IDS = ['upordown_30607-1'];
const DYMENSION_CONNECT_NETWORK_MAIN_DENOM = 'auod'

export function DymensionConnect() {
    const [dymensionConnectOpen, setDymensionConnectOpen] = useState(false);
    const [dymensionConnectReady, setDymensionConnectReady] = useState(false);
    const buttonRef = useRef(null);
    const iframeRef = useRef(null);

    const { connect } = useContract();

    const [address, setAddress] = useState("")

    const qrAccount = useMemo(() => new URLSearchParams(window.location.search).get('qrAccount'), []);

    const sendMessage = useCallback((message) => {
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
        const handleMessage = (event) => {
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
                setAddress(event.data.address);
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'disconnect') {
                setAddress("");
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'wallet-error') {
                console.error('Wallet error:', event.data.error);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [updateTriggerBoundingRect]);

    return (
        <div className="flex items-center space-x-2 relative">
            <button
                disabled={!dymensionConnectReady}
                ref={buttonRef}
                onClick={() => {
                    setDymensionConnectOpen(!dymensionConnectOpen)
                    updateTriggerBoundingRect();
                }}
                className="px-4 py-2 bg-[rgb(34,34,34)] text-white border border-[rgb(60,179,113)] rounded-md hover:bg-[rgb(60,179,113)] hover:text-black transition-all flex items-center space-x-2 shadow-md"

            >
                <Wallet className="w-5 h-5"/>
                <span>
                    {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect'}
                </span>
            </button>
            <iframe
                ref={iframeRef}
                onLoad={initModal}
                style={{display: dymensionConnectOpen || qrAccount ? 'block' : 'none'}}
                allow='clipboard-read; clipboard-write; camera'
                title='dymension-connect'
                className='absolute top-full left-0 mt-2 w-80 h-96 z-50'
                src={`${DYMENSION_CONNECT_URL}/connect${qrAccount ? `/account/${qrAccount}` : ''}?networkIds=${DYMENSION_CONNECT_NETWORK_IDS.join(',')}`}
            />
        </div>
    );
}