'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useContract } from '../contexts/ContractContext'
import { ErrorDisplay } from './ErrorDisplay'
import { Loader2 } from 'lucide-react'

export function WalletConnect() {
    const { isConnected, address, connect, disconnect } = useContract()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleConnect = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await connect()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect wallet')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnect = () => {
        disconnect()
        setError(null)
    }

    return (
        <div className="glass-effect rounded-lg p-2">
            {error && <ErrorDisplay title="Connection Error" message={error} />}
            {isConnected ? (
                <div className="px-3 py-2">
                    <p className="text-xs text-[rgb(var(--neon-green))] mb-1">Connected</p>
                    <p className="text-xs text-gray-300 font-mono truncate max-w-[150px]">{address}</p>
                    <Button
                        onClick={handleDisconnect}
                        className="mt-2 bg-transparent hover:bg-red-500 hover:text-white border border-red-500 text-red-500 text-xs"
                    >
                        Disconnect
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                        </>
                    ) : (
                        'Connect Wallet'
                    )}
                </Button>
            )}
        </div>
    )
}