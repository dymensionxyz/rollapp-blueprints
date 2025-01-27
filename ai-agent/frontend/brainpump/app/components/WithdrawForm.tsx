'use client'

import {useState, useEffect, useMemo} from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '@/components/ui/use-toast'
import { ErrorDisplay } from './ErrorDisplay'
import { Loader2 } from 'lucide-react'
import {ContractFunction} from "@/app/contexts/types";

export function WithdrawForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { withdraw, balance, broadcastingMessage } = useContract()

  const handleWithdraw = async () => {
    setError(null)
    try {
      withdraw()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw funds')
    }
  }

  const broadcastingWithdraw = useMemo(() => broadcastingMessage === ContractFunction.withdraw, [broadcastingMessage]);

  const broadcasting = useMemo(() => Boolean(broadcastingMessage), [broadcastingMessage]);

  return (
    <Card className="neon-border glass-effect border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Your House Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorDisplay title="Withdrawal Error" message={error} />}
        <div className="text-center mb-6">
          <p className="text-3xl font-mono text-[rgb(var(--neon-green))]">{balance} DESMOS</p>
        </div>
        <Button 
          onClick={handleWithdraw} 
          className="w-full bg-transparent hover:bg-[rgb(var(--neon-green))] hover:text-black border border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))]"
          disabled={broadcasting || balance === '0'}
        >
          {broadcastingWithdraw ? (
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

