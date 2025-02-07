'use client'

import {useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {useContract} from '../contexts/ContractContext'
import {useToast} from '@/components/ui/use-toast'
import {ErrorDisplay} from './ErrorDisplay'
import {Loader2} from 'lucide-react'
import {ContractFunction} from "@/app/contexts/types";

export function BalanceAndHouseInfo() {
    const [error, setError] = useState<string | null>(null)
    const {withdraw, hexAddress, balance, gameInfo, walletBalance, broadcastingMessage} = useContract()
    const {toast} = useToast()

    const handleWithdraw = async () => {
        setError(null)
        try {
            withdraw()
            toast({
                title: "Withdrawal Successful",
                description: "Your funds have been withdrawn!",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to withdraw funds')
        }
    }

    const broadcastingWithdraw = useMemo(() => broadcastingMessage === ContractFunction.withdraw, [broadcastingMessage]);

    const broadcasting = useMemo(() => Boolean(broadcastingMessage), [broadcastingMessage]);

    return (
        <Card className="neon-border glass-effect border-0">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Balance & House
                    Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && <ErrorDisplay title="Withdrawal Error" message={error}/>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-400">Your Withdrawal Balance</p>
                        <p className="text-2xl font-mono text-[rgb(var(--neon-green))]">{balance} DESMOS</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-400">Your Wallet Balance</p>
                        <p className="text-lg">{walletBalance} DESMOS</p>
                    </div>
                    {gameInfo && (
                        <>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Min Bet Amount</p>
                                <p className="text-lg">{gameInfo.minBetAmount} DESMOS</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Max Bet Amount</p>
                                <p className="text-lg">{gameInfo.maxBetAmount} DESMOS</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Total House Supply</p>
                                <p className="text-lg">{gameInfo.houseActiveBalance} DESMOS</p>
                            </div>
                        </>
                    )}
                </div>
                <Button
                    onClick={handleWithdraw}
                    className="w-full bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
                    disabled={broadcasting || balance === '0' || balance === '0.0' || !hexAddress}
                >
                    {broadcastingWithdraw ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Withdrawing...
                        </>
                    ) : (
                        'Withdraw Funds'
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

