'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '@/components/ui/use-toast'
import { ErrorDisplay } from './ErrorDisplay'
import { Loader2 } from 'lucide-react'

export function BetInfo() {
  const [aiAnswer, setAiAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentBet, resolveBet, isConnected, refreshBetInfo } = useContract()
  const { toast } = useToast()

  useEffect(() => {
    const fetchAiAnswer = async () => {
      if (currentBet?.promptId && currentBet.resolved) {
        try {
          const response = await fetch(`/api/get-answer/${currentBet.promptId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch AI answer')
          }
          const data = await response.json()
          setAiAnswer(data)
        } catch (err) {
          console.error('Error fetching AI answer:', err)
          setError('Failed to fetch AI answer')
        }
      }
    }

    fetchAiAnswer()
  }, [currentBet])

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshBetInfo, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isConnected, refreshBetInfo])

  const handleResolveBet = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await resolveBet()
      toast({
        title: "Bet Resolved",
        description: "Your bet has been successfully resolved!",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="neon-border glass-effect border-0 h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Current Bet Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <ErrorDisplay title="Bet Error" message={error} />}
        {currentBet && currentBet.active ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-lg">{currentBet.amount} ETH</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Your Guess</p>
                  <p className="text-lg">{currentBet.guessedNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-lg">{currentBet.resolved ? 'Resolved' : 'Pending'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Prompt ID</p>
                  <p className="text-lg">{currentBet.promptId}</p>
                </div>
              </div>
              {currentBet.resolved && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Result</p>
                    <p className={`text-lg ${currentBet.won ? 'text-[rgb(var(--neon-green))]' : 'text-red-500'}`}>
                      {currentBet.won ? 'Won' : 'Lost'}
                    </p>
                  </div>
              )}
              {aiAnswer && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">AI Answer</p>
                    <pre className="text-lg">{JSON.stringify(aiAnswer, null, 2)}</pre>
                  </div>
              )}
              {!currentBet.resolved && (
                  <Button
                      onClick={handleResolveBet}
                      className="w-full mt-4 bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
                      disabled={isLoading}
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                          Resolving...
                        </>
                    ) : (
                        'Resolve Bet'
                    )}
                  </Button>
              )}
            </div>
        ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No active bet</p>
              <p className="text-sm mt-2">Place a bet to get started</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

