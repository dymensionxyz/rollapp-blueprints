"use client"

import {use, useState, useEffect} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ChatHistory} from "./ChatHistory"
import {VerifyChat} from "./VerifyChat"
import {VerifyRun} from "./VerifyRun"
import {RunResult} from "./RunResult"
import {Loader2} from "lucide-react";

interface Message {
    id: string
    role: "assistant" | "user"
    content: Array<{
        type: string
        text: {
            value: string
        }
    }>
    created_at: number
    metadata?: {
        prompt_id?: string
    }
}

interface RunResultData {
    instructions: string
    metadata?: {
        prompt_id?: string
    }
    assistant_id: string
}

interface BetDetailsData {
    answer: string
    message_id: string
    thread_id: string
    run_id: string
    assistant_id: string
}

export default function VerifyPage(
    {params}: {
        params: Promise<{ gameId: string }>
    }
) {
    const {gameId} = use(params)
    const [betDetails, setBetDetails] = useState<BetDetailsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const betDetailsFn = async (gameId: string) => {
            try {
                const response = await fetch(`/api/get-answer/${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch bet details');
                }
                const data: BetDetailsData = await response.json();
                setBetDetails(data);
            } catch (err) {
                setError('Failed to load bet details');
                console.error('Error fetching bet details:', err);
            }
        };

        betDetailsFn(gameId);
    }, [gameId]);

    if (error) {
        return (
            <Card className="mt-4 p-4 text-red-500">
                {error}
            </Card>
        )
    }

    if (!betDetails) {
        return (
            <Card className="mt-4 p-4 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-[rgb(var(--neon-green))]" />
            </Card>
        )
    }

    const [showChat, setShowChat] = useState(false)
    const [showRunResult, setShowRunResult] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [runResult, setRunResult] = useState<RunResultData | null>(null)

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Card className="mb-8 neon-border glass-effect">
                <CardHeader>
                    <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Game Result</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Game ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{gameId}</p>
                        </div>
                        <div></div>
                        <div>
                            <p className="text-sm text-gray-400">Assistant ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{betDetails.assistant_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Thread ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{betDetails.thread_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Run ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{betDetails.run_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Message ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{betDetails.message_id}</p>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                            Trace the following IDs throughout the requests
                        </p>
                        <div></div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
                <div className="space-y-8">
                    <VerifyChat
                        threadId={betDetails.thread_id}
                        onRunSuccess={(data) => {
                            setMessages(data.data.sort((a: { created_at: number }, b: {
                                created_at: number
                            }) => a.created_at - b.created_at))
                            setShowChat(true)
                            setError(null)
                        }}
                    />
                    {showChat && <ChatHistory messages={messages} error={error}/>}
                </div>
                <div className="space-y-8">
                    <VerifyRun
                        threadId={betDetails.thread_id}
                        runId={betDetails.run_id}
                        onRunSuccess={(data) => {
                            setRunResult(data)
                            setShowRunResult(true)
                            setError(null)
                        }}
                    />
                    {showRunResult && runResult && <RunResult result={runResult}/>}
                </div>
            </div>
        </div>
    )
}

