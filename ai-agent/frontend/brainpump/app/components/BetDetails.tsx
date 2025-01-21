'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { OpenAILink } from './OpenAILink'
import { FraudForm } from './FraudForm'
import { Button } from '@/components/ui/button'

interface BetDetailsProps {
    promptId: string
    persuasion?: string
}

interface BetDetailsData {
    answer: string
    message_id: string
    thread_id: string
    run_id: string
    assistant_id: string
    persuasion: string
}

export function BetDetails({ promptId, persuasion }: BetDetailsProps) {
    const [details, setDetails] = useState<BetDetailsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFraudFormOpen, setIsFraudFormOpen] = useState(false)

    useEffect(() => {
        const fetchBetDetails = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch(`/api/get-answer/${promptId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch bet details')
                }
                const data: BetDetailsData = await response.json()
                data.persuasion = persuasion || data.persuasion
                setDetails(data)
            } catch (err) {
                setError('Failed to load bet details')
                console.error('Error fetching bet details:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBetDetails()
    }, [promptId])

    if (isLoading) {
        return (
            <Card className="mt-4 p-4 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-[rgb(var(--neon-green))]" />
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="mt-4 p-4 text-red-500">
                {error}
            </Card>
        )
    }

    if (!details) {
        return null
    }

    return (
        <Card className="mt-4 neon-border glass-effect border-0">
            <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2 text-[rgb(var(--neon-green))]">Bet Details</h4>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm text-gray-400">AI Answer</p>
                        <p className="text-lg">{details.answer}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Jailbreak</p>
                        <p className="text-lg">{details.persuasion || 'No Jailbreak provided'}</p>
                    </div>
                </div>
                <div>
                    <OpenAILink type="thread" id={details.thread_id}/>
                </div>
                <Button
                    onClick={() => setIsFraudFormOpen(true)}
                    className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white"
                >
                    Submit Fraud
                </Button>

                {isFraudFormOpen && (
                    <FraudForm
                        onClose={() => setIsFraudFormOpen(false)}
                        promptId={promptId}
                    />
                )}
            </CardContent>
        </Card>
    )
}

