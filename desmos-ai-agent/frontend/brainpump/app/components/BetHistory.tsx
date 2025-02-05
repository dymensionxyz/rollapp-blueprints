'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useContract } from '../contexts/ContractContext'
import { BetDetails } from './BetDetails'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function BetHistory() {
    const { betHistory } = useContract()
    const [expandedBetIndex, setExpandedBetIndex] = useState<number | null>(null)

    const toggleBetDetails = (index: number) => {
        setExpandedBetIndex(expandedBetIndex === index ? null : index)
    }

    // Sort betHistory in descending order by promptId (newer bets on top)
    const sortedBetHistory = [...betHistory].sort((a, b) => Number(b.promptId) - Number(a.promptId));

    return (
        <Card className="neon-border glass-effect border-0 w-full mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Bet History</CardTitle>
            </CardHeader>
            <CardContent>
                {sortedBetHistory.length > 0 ? (
                    <div className="space-y-4">
                        {sortedBetHistory.map((bet, index) => (
                            <div key={index}>
                                <div
                                    className="bg-[rgb(var(--dark-gray))] p-4 rounded-md cursor-pointer hover:bg-[rgb(var(--graphite))] transition-colors duration-200"
                                    onClick={() => toggleBetDetails(index)}
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400">Game ID</p>
                                            <p className="text-lg">{bet.promptId}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400">Amount</p>
                                            <p className="text-lg">{bet.amount} DESMOS</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400">Guessed Number</p>
                                            <p className="text-lg">{bet.guessedNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400">Correct Number</p>
                                            <p className="text-lg">{bet.correctNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400">Status</p>
                                            <p className="text-lg">{bet.resolved ? 'Resolved' : 'Pending'}</p>
                                        </div>
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
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        {expandedBetIndex === index ? (
                                            <ChevronUp className="h-5 w-5 text-[rgb(var(--neon-green))]"/>
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-[rgb(var(--neon-green))]"/>
                                        )}
                                    </div>
                                </div>
                                {expandedBetIndex === index && (
                                    <BetDetails promptId={bet.promptId.toString()} persuasion={bet.persuasion} answer={bet.correctNumber} />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No bet history available</p>
                )}
            </CardContent>
        </Card>
    )
}

