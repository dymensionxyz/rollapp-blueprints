'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

interface FraudFormProps {
    onClose: () => void
    promptId: string
}

export function FraudForm({ onClose, promptId }: FraudFormProps) {
    const [email, setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [messageId, setMessageId] = useState('')
    const [threadId, setThreadId] = useState('')
    const [assistantId, setAssistantId] = useState('')
    const [runId, setRunId] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        const fetchBetDetails = async () => {
            try {
                const response = await fetch(`/api/get-answer/${promptId}`)
                if (response.ok) {
                    const data = await response.json()
                    setMessageId(data.message_id || '')
                    setThreadId(data.thread_id || '')
                    setAssistantId(data.assistant_id || '')
                    setRunId(data.run_id || '')
                }
            } catch (error) {
                console.error('Error fetching bet details:', error)
            }
        }

        fetchBetDetails()
    }, [promptId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send this data to your backend
        console.log({ email, description, messageId, threadId, assistantId, runId, promptId })
        toast({
            title: "Fraud Report Submitted",
            description: "We've received your report and will investigate shortly.",
        })
        onClose()
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
                <DialogHeader>
                    <DialogTitle className="text-[rgb(var(--neon-green))]">Submit Fraud Report</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--foreground))]">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[rgb(var(--foreground))]">Description</label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <div>
                        <label htmlFor="promptId" className="block text-sm font-medium text-[rgb(var(--foreground))]">Prompt ID</label>
                        <Input
                            id="promptId"
                            value={promptId}
                            readOnly
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <div>
                        <label htmlFor="messageId" className="block text-sm font-medium text-[rgb(var(--foreground))]">Message ID</label>
                        <Input
                            id="messageId"
                            value={messageId}
                            onChange={(e) => setMessageId(e.target.value)}
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <div>
                        <label htmlFor="threadId" className="block text-sm font-medium text-[rgb(var(--foreground))]">Thread ID</label>
                        <Input
                            id="threadId"
                            value={threadId}
                            onChange={(e) => setThreadId(e.target.value)}
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <div>
                        <label htmlFor="assistantId" className="block text-sm font-medium text-[rgb(var(--foreground))]">Assistant ID</label>
                        <Input
                            id="assistantId"
                            value={assistantId}
                            onChange={(e) => setAssistantId(e.target.value)}
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <div>
                        <label htmlFor="runId" className="block text-sm font-medium text-[rgb(var(--foreground))]">Run ID</label>
                        <Input
                            id="runId"
                            value={runId}
                            onChange={(e) => setRunId(e.target.value)}
                            className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-[rgb(var(--neon-green))] text-black hover:bg-[rgb(var(--neon-green))] hover:opacity-90">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

