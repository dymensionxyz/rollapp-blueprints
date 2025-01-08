'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '@/components/ui/use-toast'
import { ErrorDisplay } from './ErrorDisplay'
import { Loader2 } from 'lucide-react'

export function WithdrawForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { withdraw, isConnected, balance, refreshBalance } = useContract()
  const { toast } = useToast()

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshBalance, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isConnected, refreshBalance])

  const handleWithdraw = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await withdraw()
      toast({
        title: "Withdrawal Successful",
        description: "Your funds have been withdrawn!",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw funds')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="neon-border glass-effect border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Your House Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorDisplay title="Withdrawal Error" message={error} />}
        <div className="text-center mb-6">
          <p className="text-3xl font-mono text-[rgb(var(--neon-green))]">{balance} ETH</p>
        </div>
        <Button 
          onClick={handleWithdraw} 
          className="w-full bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
          disabled={balance === '0' || isLoading || !isConnected}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Withdrawing...
            </>
          ) : (
            'Withdraw Funds'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

