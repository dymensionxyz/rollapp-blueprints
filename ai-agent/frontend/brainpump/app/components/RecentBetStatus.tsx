'use client'

import {useEffect, useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {useContract} from '../contexts/ContractContext'
import {ErrorDisplay} from './ErrorDisplay'
import {Loader2} from 'lucide-react'
import {BetDetails} from './BetDetails'
import {ContractFunction} from "@/app/contexts/types";

export function RecentBetStatus() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [answerStatus, setAnswerStatus] = useState<{ answer: string, exists: boolean } | null>(null)
    const {bet, resolveBet, checkAnswerStatus, broadcastingMessage} = useContract()

    useEffect(() => {
        const fetchAiAnswer = async () => {
            if (bet?.promptId && bet.resolved) {
                try {
                    const response = await fetch(`/api/get-answer/${bet.promptId}`)
                    if (!response.ok) {
                        throw new Error('Failed to fetch AI answer')
                    }
                    const data = await response.json()
                    setAnswerStatus({answer: data.answer, exists: true})
                } catch (err) {
                    console.error('Error fetching AI answer:', err)
                    setError('Failed to fetch AI answer')
                }
            }
        }

        fetchAiAnswer()
    }, [bet])

    useEffect(() => {
        const checkStatus = async () => {
            if (bet?.promptId && !bet.resolved) {
                try {
                    const status = await checkAnswerStatus(bet.promptId)
                    setAnswerStatus(status)
                } catch (err) {
                    console.error('Error checking answer status:', err)
                    setError('Failed to check answer status')
                }
            }
        }

        const interval = setInterval(checkStatus, 2000) // Poll every 2 seconds
        return () => clearInterval(interval)
    }, [bet, checkAnswerStatus])

    useEffect(() => {
        const checkStatusImmediately = async () => {
            if (bet?.promptId && !bet.resolved) {
                try {
                    const status = await checkAnswerStatus(bet.promptId)
                    setAnswerStatus(status)
                } catch (err) {
                    console.error('Error checking answer status:', err)
                    setError('Failed to check answer status')
                }
            }
        }

        checkStatusImmediately()
    }, [bet, checkAnswerStatus])

    const handleResolveBet = async () => {
        setError(null)
        try {
            resolveBet()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve bet')
        }
    }

    const broadcastingResolveBet = useMemo(() => broadcastingMessage === ContractFunction.resolveBet, [broadcastingMessage]);

    const broadcasting = useMemo(() => Boolean(broadcastingMessage), [broadcastingMessage]);

    return (
        <Card className="neon-border glass-effect border-0 h-full">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Last Bet Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && <ErrorDisplay title="Bet Error" message={error}/>}
                {bet && Number(bet.promptId) !== 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Amount</p>
                                <p className="text-lg">{bet.amount} DESMOS</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Your Guess</p>
                                <p className="text-lg">{bet.guessedNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Game ID</p>
                                <p className="text-lg">{bet.promptId.toString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-lg">{bet.resolved ? 'Resolved' : 'Pending'}</p>
                            </div>
                        </div>
                        {bet.persuasion && (
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Persuasion</p>
                                <p className="text-lg">{bet.persuasion}</p>
                            </div>
                        )}
                        {(bet.resolved) && (
                            <>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Result</p>
                                    <p className={`text-lg ${
                                        bet.canceled ? 'text-yellow-500' :
                                            bet.won ? 'text-[rgb(var(--neon-green))]' : 'text-red-500'
                                    }`}>
                                        {bet.canceled ? 'Canceled' :
                                            bet.resolved ? (bet.won ? 'Won' : 'Lost') : 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Correct Number</p>
                                    <p className="text-lg">{bet.correctNumber}</p>
                                </div>
                            </>
                        )}
                        {!bet.resolved && (
                            <div className="space-y-4">
                                <Button
                                    onClick={handleResolveBet}
                                    className="w-full mt-4 bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
                                    disabled={broadcasting || !answerStatus?.exists}
                                >
                                    {broadcastingResolveBet ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Resolving...
                                        </>
                                    ) : (
                                        'Resolve Bet'
                                    )}
                                </Button>
                                <div className="text-sm text-gray-300 mt-2">
                                    {answerStatus?.exists ? (
                                        <p className="text-[rgb(var(--neon-green))]">AI answer is ready. You can resolve
                                            the bet now.</p>
                                    ) : (
                                        <div className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Waiting for AI answer...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {bet.resolved && (
                            <BetDetails promptId={bet.promptId.toString()} persuasion={bet.persuasion}/>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p>No recent bets</p>
                        <p className="text-sm mt-2">Place a bet to get started</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

