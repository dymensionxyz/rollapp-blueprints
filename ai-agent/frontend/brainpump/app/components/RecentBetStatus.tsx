'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '@/components/ui/use-toast'
import { ErrorDisplay } from './ErrorDisplay'
import { Loader2 } from 'lucide-react'
import { BetDetails } from './BetDetails'

export function RecentBetStatus() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [answerStatus, setAnswerStatus] = useState<{ answer: string, exists: boolean } | null>(null)
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
    const { currentBet, resolveBet, cancelBet, isConnected, refreshBetInfo, checkAnswerStatus } = useContract()
    const { toast } = useToast()

    useEffect(() => {
        const fetchAiAnswer = async () => {
            if (currentBet?.promptId && (currentBet.resolved || isAnswerRevealed)) {
                try {
                    const response = await fetch(`/api/get-answer/${currentBet.promptId}`)
                    if (!response.ok) {
                        throw new Error('Failed to fetch AI answer')
                    }
                    const data = await response.json()
                } catch (err) {
                    console.error('Error fetching AI answer:', err)
                    setError('Failed to fetch AI answer')
                }
            }
        }

        fetchAiAnswer()
    }, [currentBet, isAnswerRevealed])

    useEffect(() => {
        const checkStatus = async () => {
            if (currentBet?.promptId && !currentBet.resolved) {
                try {
                    const status = await checkAnswerStatus(currentBet.promptId)
                    setAnswerStatus(status)
                } catch (err) {
                    console.error('Error checking answer status:', err)
                    setError('Failed to check answer status')
                }
            }
        }

        const interval = setInterval(checkStatus, 2000) // Poll every 2 seconds
        return () => clearInterval(interval)
    }, [currentBet, checkAnswerStatus])

    useEffect(() => {
        const checkStatusImmediately = async () => {
            if (currentBet?.promptId && !currentBet.resolved) {
                try {
                    const status = await checkAnswerStatus(currentBet.promptId)
                    setAnswerStatus(status)
                } catch (err) {
                    console.error('Error checking answer status:', err)
                    setError('Failed to check answer status')
                }
            }
        }

        checkStatusImmediately()
    }, [currentBet, checkAnswerStatus])

    useEffect(() => {
        if (isConnected) {
            const interval = setInterval(refreshBetInfo, 2000) // Poll every 2 seconds
            return () => clearInterval(interval)
        }
    }, [isConnected, refreshBetInfo])

    const handleResolveBet = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await resolveBet()
            toast({
                title: "Bet Resolved",
                description: "Your bet has been successfully resolved!",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve bet')
        } finally {
            setIsLoading(false)
            setIsAnswerRevealed(false)
        }
    }

    const handleCancelBet = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await cancelBet()
            toast({
                title: "Bet Canceled",
                description: "Your bet has been successfully canceled and refunded.",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel bet')
        } finally {
            setIsLoading(false)
            setIsAnswerRevealed(false)
        }
    }

    const handleRevealAnswer = () => {
        setIsAnswerRevealed(true);
    }

    return (
        <Card className="neon-border glass-effect border-0 h-full">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Recent Bet Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && <ErrorDisplay title="Bet Error" message={error} />}
                {currentBet && Number(currentBet.promptId) !== 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Amount</p>
                                <p className="text-lg">{currentBet.amount} DESMOS</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Your Guess</p>
                                <p className="text-lg">{currentBet.guessedNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Prompt ID</p>
                                <p className="text-lg">{currentBet.promptId.toString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-lg">{currentBet.resolved ? 'Resolved' : 'Pending'}</p>
                            </div>
                        </div>
                        {(currentBet.resolved) && (
                            <>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Result</p>
                                    <p className={`text-lg ${
                                        currentBet.canceled ? 'text-yellow-500' :
                                            currentBet.won ? 'text-[rgb(var(--neon-green))]' : 'text-red-500'
                                    }`}>
                                        {currentBet.canceled ? 'Canceled' :
                                            currentBet.resolved ? (currentBet.won ? 'Won' : 'Lost') : 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Correct Number</p>
                                    <p className="text-lg">{currentBet.correctNumber}</p>
                                </div>
                            </>
                        )}
                        {!currentBet.resolved && (
                            <div className="space-y-4">
                                <Button
                                    onClick={handleResolveBet}
                                    className="w-full mt-4 bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
                                    disabled={isLoading || !answerStatus?.exists}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resolving...
                                        </>
                                    ) : (
                                        'Resolve Bet'
                                    )}
                                </Button>
                                <Button
                                    onClick={handleRevealAnswer}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                    disabled={isLoading || !answerStatus?.exists}
                                >
                                    Reveal Answer
                                </Button>
                                <Button
                                    onClick={handleCancelBet}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                                    disabled={isLoading}
                                >
                                    Cancel Bet
                                </Button>
                                <p className="text-sm text-gray-300 my-2">
                                    Feel free to cancel the bet and submit fraud in case of any problems.
                                </p>
                                <div className="text-sm text-gray-300 mt-2">
                                    {answerStatus?.exists ? (
                                        <p className="text-[rgb(var(--neon-green))]">AI answer is ready. You can resolve the bet now.</p>
                                    ) : (
                                        <p>Waiting for AI answer...</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {(currentBet.resolved || isAnswerRevealed) && (
                            <>
                                <BetDetails promptId={currentBet.promptId.toString()} persuasion={currentBet.persuasion} />
                            </>
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

