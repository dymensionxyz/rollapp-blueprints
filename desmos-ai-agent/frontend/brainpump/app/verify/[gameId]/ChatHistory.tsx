import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import Image from "next/image"

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

interface ChatHistoryProps {
    messages: Message[]
    error: string | null
}

export function ChatHistory({messages, error}: ChatHistoryProps) {
    if (error) {
        return (
            <Card className="neon-border glass-effect">
                <CardContent className="p-4">
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="neon-border glass-effect">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Desmos Chat</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg">
                    {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start gap-3 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                            >
                                {message.role === "assistant" && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                                        <Image
                                            src="/desmos-logo.png"
                                            alt="Desmos"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                        message.role === "assistant"
                                            ? "bg-[rgb(var(--graphite))] text-white rounded-tl-none"
                                            : "bg-[rgb(var(--neon-green))] text-black rounded-tr-none"
                                    }`}
                                >
                                    <p className="text-sm">{message.content[0]?.text?.value || "No content"}</p>
                                    {message.metadata?.prompt_id && (
                                        <p className="text-xs opacity-50 mt-1">Game ID: {message.metadata.prompt_id}</p>
                                    )}
                                    <p className={`text-xs mt-1 ${message.role === "assistant" ? "" : "opacity-50"}`}
                                       style={message.role === "assistant" ? {color: 'red'} : {}}>
                                        {message.id}
                                    </p>
                                    <p className="text-xs opacity-50 mt-1">{new Date(message.created_at * 1000).toLocaleString()}</p>
                                </div>
                                {message.role === "user" && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                                        <Image
                                            src="/user-icon.png"
                                            alt="User"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

