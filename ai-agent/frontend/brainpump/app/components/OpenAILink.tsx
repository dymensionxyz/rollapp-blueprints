import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface OpenAILinkProps {
    type: 'thread' | 'message' | 'run' | 'assistant'
    id: string
    threadId?: string
}

export function OpenAILink({ type, id, threadId }: OpenAILinkProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        try {
            let url = `/api/openai/${type}?id=${id}`
            if (type === 'message' || type === 'run') {
                url += `&threadId=${threadId}`
            }
            window.open(url, '_blank')
        } catch (error) {
            console.error('Error opening OpenAI link:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            className="text-[rgb(var(--neon-green))] hover:underline focus:outline-none"
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : id}
        </button>
    )
}

