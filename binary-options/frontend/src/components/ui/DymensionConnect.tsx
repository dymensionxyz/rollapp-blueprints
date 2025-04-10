// DymensionConnect.jsx
'use client'

// @ts-ignore
import React, { useCallback, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Wallet } from "lucide-react";

const DYMENSION_CONNECT_URL = 'https://portal.dymension.xyz';
const DYMENSION_CONNECT_NETWORK_IDS = ['upordowngame_689603-1'];

interface DymensionConnectProps {
    onTxStatus?: (status: 'success' | 'error', txData?: any) => void;
    onConnectChange?: (isConnected: boolean) => void;
}

export const DymensionConnect = forwardRef((props: DymensionConnectProps, ref) => {
    const [dymensionConnectOpen, setDymensionConnectOpen] = useState(false);
    const [dymensionConnectReady, setDymensionConnectReady] = useState(false);
    const buttonRef = useRef(null);
    const iframeRef = useRef(null);

    const [address, setAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);

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
        sendMessage({ type: 'setMenuAlign', align: 'right' });
    }, [sendMessage, updateTriggerBoundingRect]);

    useEffect(() => {
        window.addEventListener('scroll', updateTriggerBoundingRect, true);
        window.addEventListener('resize', updateTriggerBoundingRect, true);
        return () => {
            window.removeEventListener('scroll', updateTriggerBoundingRect, true);
            window.removeEventListener('resize', updateTriggerBoundingRect, true);
        };
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
                setAddress(event.data.address);
                setIsConnected(true);
                props.onConnectChange?.(true);
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'disconnect') {
                setAddress("");
                setIsConnected(false);
                props.onConnectChange?.(false);
                updateTriggerBoundingRect();
            }
            if (event.data.type === 'tx-response') {
                try {
                    const responseData = JSON.parse(event.data.response);
                    console.log('[DEBUG] Parsed transaction response:', responseData);

                    const nativeResponse = responseData.nativeResponse;
                    const success = nativeResponse?.code === 0;
                    const hasNonCriticalErrors = nativeResponse?.rawLog?.includes('fee_consumption');

                    props.onTxStatus?.(success ? 'success' : 'error', {
                        hash: responseData.hash,
                        rawData: responseData,
                        isNonCriticalError: hasNonCriticalErrors,
                    });

                    if (!success || hasNonCriticalErrors) {
                        console.log('[DEBUG] Transaction details:', {
                            code: nativeResponse?.code,
                            rawLog: nativeResponse?.rawLog,
                            gasUsed: nativeResponse?.gasUsed,
                            gasWanted: nativeResponse?.gasWanted
                        });
                    }

                } catch (error) {
                    console.error('[ERROR] Failed to parse transaction response:', error);
                    props.onTxStatus?.('error', { rawData: event.data });
                }
            }
            if (event.data.type === 'wallet-error') {
                console.error('Wallet error:', event.data.error);
                props.onTxStatus?.('error', { error: event.data.error });
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [updateTriggerBoundingRect]);

    useImperativeHandle(ref, () => ({
        sendMessage,
        isConnected,
        address,
    }));

    return (
        <div className="flex items-center relative">
            <button
                disabled={!dymensionConnectReady}
                ref={buttonRef}
                onClick={() => {
                    setDymensionConnectOpen(!dymensionConnectOpen);
                    updateTriggerBoundingRect();
                }}
                className="px-4 py-2 bg-[rgb(34,34,34)] text-white border border-[rgb(60,179,113)] rounded-md hover:bg-[rgb(60,179,113)] hover:text-black transition-all flex items-center space-x-2 shadow-md relative"
            >
                <Wallet className="w-5 h-5" />
                <span>
                {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect'}
            </span>
                {!isConnected && (
                    <div className="absolute inset-0 overflow-hidden rounded-md">
                        <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(60,179,113,0.4)] to-transparent"></div>
                    </div>
                )}
            </button>

            {!isConnected && (
                <div className="absolute top-full right-0 mt-4 w-full min-w-[220px]">
                    <div className="bg-[rgb(60,179,113)] text-black px-3 py-2 rounded-md text-sm font-medium animate-bounce">
                        🔥 Connect to start winning!
                        <div className="absolute -top-1 right-16 w-3 h-3 bg-[rgb(60,179,113)] rotate-45"></div>
                    </div>
                </div>
            )}
            <iframe
                ref={iframeRef}
                onLoad={initModal}
                style={{ display: dymensionConnectOpen || qrAccount ? 'block' : 'none' }}
                allow='clipboard-read; clipboard-write; camera'
                title='dymension-connect'
                className='fixed left-0 top-0 w-full h-full border-0 outline-none z-[100000000000]'
                src={`${DYMENSION_CONNECT_URL}/connect${qrAccount ? `/account/${qrAccount}` : ''}?networkIds=${DYMENSION_CONNECT_NETWORK_IDS.join(',')}`}
            />
        </div>
    );
});
