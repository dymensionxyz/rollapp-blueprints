'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '@/components/ui/use-toast'
import { ErrorDisplay } from './ErrorDisplay'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  guessedNumber: z.number()
      .int()
      .min(1, { message: "Guess must be at least 1" })
      .max(10, { message: "Guess must be at most 10" }),
  betAmount: z.number()
      .positive({ message: "Bet amount must be positive" })
      .min(0.000001, { message: "Minimum bet is 0.000001 DESMOS" }),
  persuasion: z.string().max(500, { message: "Persuasion must be 500 characters or less" }).optional()
})

export function BetForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estimatedReward, setEstimatedReward] = useState<string | null>(null)
  const { placeBet, isConnected, currentBet, estimateReward } = useContract()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guessedNumber: undefined,
      betAmount: undefined,
      persuasion: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await placeBet(values.guessedNumber, values.betAmount.toString(), values.persuasion || '')
      toast({
        title: "Bet Placed",
        description: "Your bet has been successfully placed!",
      })
      form.reset()
      setEstimatedReward(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const updateEstimatedReward = async () => {
      const betAmount = form.getValues('betAmount')
      if (betAmount) {
        try {
          const reward = await estimateReward(betAmount.toString())
          setEstimatedReward(reward)
        } catch (err) {
          console.error('Failed to estimate reward:', err)
          setEstimatedReward(null)
        }
      } else {
        setEstimatedReward(null)
      }
    }

    updateEstimatedReward()
  }, [form.watch('betAmount'), estimateReward])

  const canPlaceBet = !currentBet || currentBet.resolved || Number(currentBet.promptId) === 0

  return (
      <Card className="neon-border glass-effect border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Place Your Bet</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <ErrorDisplay title="Bet Error" message={error} />}
          {!canPlaceBet ? (
              <div className="text-center py-4">
                <p className="text-[rgb(var(--neon-green))]">You have an active bet</p>
                <p className="text-sm text-gray-300 mt-2">Resolve your current bet before placing a new one</p>
              </div>
          ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                      control={form.control}
                      name="guessedNumber"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-300">Guess a number (1-10)</FormLabel>
                            <FormControl>
                              <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                  className="bg-[rgb(var(--dark-gray))] border-gray-600 focus:border-[rgb(var(--neon-green))] text-white"
                                  disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="persuasion"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-300">Jail Break prompt (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                  {...field}
                                  placeholder="Enter your Jail Break prompt here..."
                                  className="bg-[rgb(var(--dark-gray))] border-gray-600 focus:border-[rgb(var(--neon-green))] text-white"
                                  disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="betAmount"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-300">Bet amount (DESMOS)</FormLabel>
                            <FormControl>
                              <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  step="0.0001"
                                  className="bg-[rgb(var(--dark-gray))] border-gray-600 focus:border-[rgb(var(--neon-green))] text-white"
                                  disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  {estimatedReward && (
                      <div className="text-sm text-gray-300">
                        Estimated reward: <span className="text-[rgb(var(--neon-green))]">{estimatedReward} DESMOS</span>
                      </div>
                  )}
                  <Button
                      type="submit"
                      className="w-full bg-[rgb(var(--neon-green))] text-black hover:bg-[rgb(var(--neon-green))] hover:opacity-90"
                      disabled={isLoading || !isConnected}
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing Bet...
                        </>
                    ) : (
                        'Place Bet'
                    )}
                  </Button>
                </form>
              </Form>
          )}
        </CardContent>
      </Card>
  )
}

