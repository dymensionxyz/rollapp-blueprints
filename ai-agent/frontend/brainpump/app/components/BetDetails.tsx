'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { FraudForm } from './FraudForm'
import { Button } from '@/components/ui/button'
import Link from "next/link";

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

export function BetDetails({ promptId, persuasion, answer }: BetDetailsProps) {
    const [isFraudFormOpen, setIsFraudFormOpen] = useState(false)

    return (
        <Card className="mt-4 neon-border glass-effect border-0">
            <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2 text-[rgb(var(--neon-green))]">Bet Details</h4>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm text-gray-400">AI Answer</p>
                        <p className="text-lg">{answer}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Jailbreak</p>
                        <p className="text-lg">{persuasion || 'No Jailbreak provided'}</p>
                    </div>
                </div>
                <div className="pt-4">
                    <Link href={`/verify1/${promptId}`} target="_blank">
                        <Button
                            className="w-full bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]">
                            Verify Game Result
                        </Button>
                    </Link>
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

