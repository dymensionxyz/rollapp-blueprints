import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface RunResultProps {
    result: {
        instructions: string
        metadata?: {
            prompt_id?: string
        }
        assistant_id: string
    }
}

export function RunResult({ result }: RunResultProps) {
    return (
        <Card className="neon-border glass-effect">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Desmos Chat Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-[rgb(var(--neon-green))]">Instructions</h3>
                        <p className="text-sm text-gray-300">{result.instructions}</p>
                    </div>
                    {result.metadata?.prompt_id && (
                        <div>
                            <h3 className="text-lg font-semibold text-[rgb(var(--neon-green))]">Game ID</h3>
                            <p className="text-sm text-gray-300" style={{ color: 'red' }}>{result.metadata.prompt_id}</p>
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-[rgb(var(--neon-green))]">Assistant ID</h3>
                        <p className="text-sm text-gray-300" style={{ color: 'red' }}>{result.assistant_id}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

