"use client"

import {use, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ChatHistory} from "./ChatHistory"
import {VerifyManually} from "./VerifyManually"
import {VerifyRun} from "./VerifyRun"
import {RunResult} from "./RunResult"

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

export default function VerifyPage(
    {params}: {
        params: Promise<{ assistantId: string; threadId: string; gameId: string; runId: string; messageId: string }>
    }
) {
    const {assistantId, threadId, gameId, runId, messageId} = use(params)
    const [showChat, setShowChat] = useState(false)
    const [showRunResult, setShowRunResult] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [runResult, setRunResult] = useState<RunResultData | null>(null)
    const [error, setError] = useState<string | null>(null)

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
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{assistantId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Thread ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{threadId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Run ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{runId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Message ID</p>
                            <p className="text-lg font-mono text-[rgb(var(--neon-green))]">{messageId}</p>
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
                <VerifyManually
                        threadId={threadId}
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
                        threadId={threadId}
                        runId={runId}
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

