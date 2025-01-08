'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface BetDetailsProps {
    promptId: string
}

interface BetDetailsData {
    answer: string
    message_id: string
    thread_id: string
    run_id: string
    assistant_id: string
}

export function BetDetails({ promptId }: BetDetailsProps) {
    const [details, setDetails] = useState<BetDetailsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-sm text-gray-400">AI Answer</p>
                        <p className="text-lg">{details.answer}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Message ID</p>
                        <p className="text-xs truncate">{details.message_id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Thread ID</p>
                        <p className="text-xs truncate">{details.thread_id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Run ID</p>
                        <p className="text-xs truncate">{details.run_id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Assistant ID</p>
                        <p className="text-xs truncate">{details.assistant_id}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

