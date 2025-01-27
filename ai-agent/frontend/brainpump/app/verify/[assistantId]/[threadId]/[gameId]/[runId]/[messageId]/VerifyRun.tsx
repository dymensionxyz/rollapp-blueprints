"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Check, Copy, Loader2} from "lucide-react"
import {OPENAI_API_KEY} from "@/app/verify/[assistantId]/[threadId]/[gameId]/[runId]/[messageId]/types";

interface VerifyRunProps {
    threadId: string
    runId: string
    onRunSuccess: (data: any) => void
}

export function VerifyRun({threadId, runId, onRunSuccess}: VerifyRunProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        const curlCommand = `curl https://api.openai.com/v1/threads/${threadId}/runs/${runId} \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer ${OPENAI_API_KEY}" \\
-H "OpenAI-Beta: assistants=v2"`

        try {
            await navigator.clipboard.writeText(curlCommand)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const handleRun = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/openai/run?id=${runId}&threadId=${threadId}`)
            if (!response.ok) throw new Error("Failed to fetch run data")
            const data = await response.json()
            onRunSuccess(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load run data")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="neon-border glass-effect">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Verify Desmos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
          <pre className="bg-[rgb(var(--darker-green))] p-4 rounded-lg overflow-x-auto text-sm text-white">
            <code>
    {`curl https://api.openai.com/v1/threads/`}
                <span style={{color: 'red'}}>{threadId}</span>
                {`/runs/`}
                <span style={{color: 'red'}}>{runId}</span>
                {` \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer ${OPENAI_API_KEY}" \\
-H "OpenAI-Beta: assistants=v2"`}
  </code>
          </pre>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-[rgb(var(--neon-green))] hover:text-black"
                            onClick={copyToClipboard}
                        >
                            {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-[rgb(var(--neon-green))] hover:text-black"
                            onClick={handleRun}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin"/>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            )}
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                    You can use this curl command to verify the run data directly with OpenAI&apos;s API.
                </p>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
        </Card>
    )
}

