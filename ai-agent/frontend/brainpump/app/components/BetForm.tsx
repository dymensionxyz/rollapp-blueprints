'use client'

import {FormEvent, useCallback, useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {useContract} from '../contexts/ContractContext'
import {useToast} from '@/components/ui/use-toast'
import {ErrorDisplay} from './ErrorDisplay'
import {Loader2} from 'lucide-react'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {ethers} from "ethers";
import {useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Controller } from 'react-hook-form';

const formSchema = z.object({
    guessedNumber: z.string(),
    betAmount: z.string(),
    persuasion: z.string().max(500, {message: "Persuasion must be 500 characters or less"}).optional()
})

export function BetForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [estimatedReward, setEstimatedReward] = useState<string | null>(null)
    const [estimatedCommunityFee, setEstimatedCommunityFee] = useState<string | null>(null)
    const {
        placeBet,
        setGuessedNumber,
        guessedNumber,
        setPersuasion,
        persuasion,
        setBetAmount,
        betAmount,
        gameInfo,
        hexAddress,
        bet,
        estimateReward,
        estimateCommunityFee
    } = useContract()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guessedNumber: undefined,
            betAmount: undefined,
            persuasion: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!hexAddress) {
            setError('Please connect your wallet first')
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            placeBet(false)
            toast({
                title: "Bet Placed",
                description: "Your bet has been successfully placed!",
            })
            setEstimatedReward(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to place bet')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const updateEstimatedReward = async () => {
            if (betAmount) {
                try {
                    const reward = await estimateReward(betAmount.toString())
                    setEstimatedReward(reward)

                    const fee = await estimateCommunityFee(betAmount.toString())
                    setEstimatedCommunityFee(fee)
                } catch (err) {
                    console.error('Failed to estimate reward:', err)
                    setEstimatedReward(null)
                }
            } else {
                setEstimatedReward(null)
            }
        }

        updateEstimatedReward()
    }, [estimateReward])

    const onBetChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const inputElement = event.target as HTMLInputElement;
        if (!inputElement.value) {
            setBetAmount(undefined);
            return;
        }
        const match = inputElement.value.match(/^[0-9]{0,18}(\.[0-9]{0,18})?$/);
        if (!match) {
            event.preventDefault();
            inputElement.value = betAmount || '';
            return;
        }
        const numberValue = ethers.parseEther(inputElement.value);
        const maxBet = gameInfo?.maxBetAmount
        if (maxBet && numberValue > ethers.parseEther(maxBet)) {
            event.preventDefault();
            setBetAmount(maxBet.toString());
            return;
        }
        setBetAmount(inputElement.value);
    }, [bet, setBetAmount, betAmount, gameInfo]);

    const onGuessChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const inputElement = event.target as HTMLInputElement;
        if (!inputElement.value) {
            setGuessedNumber(undefined);
            return;
        }
        const match = inputElement.value.match(/^(10|[1-9])$/);
        if (!match) {
            event.preventDefault();
            inputElement.value = String(guessedNumber) || '';
            return;
        }

        const guess = Number(inputElement.value)
        if (guess < 1) {
            setGuessedNumber(1);
            return;
        }
        if (guess > 10) {
            setGuessedNumber(10);
            return;
        }

        setGuessedNumber(Number(inputElement.value));
    }, [bet, setGuessedNumber, guessedNumber, gameInfo]);

    const onPersuasionChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const inputElement = event.target as HTMLInputElement;
        if (!inputElement.value) {
            setPersuasion(undefined);
            return;
        }
        const match = inputElement.value.length <= 500
        if (!match) {
            event.preventDefault();
            inputElement.value = String(persuasion) || '';
            return;
        }

        setPersuasion(inputElement.value);
    }, [bet, setPersuasion, persuasion, gameInfo]);

    const canPlaceBet = !bet || bet.resolved || Number(bet.promptId) === 0

    return (
        <Card className="neon-border glass-effect border-0">
            <CardHeader>
                <CardTitle className="text-2xl font-light text-[rgb(var(--neon-green))]">Place Your Bet</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <ErrorDisplay title="Bet Error" message={error}/>}
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
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">Guess a number (1-10)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                placeholder='0'
                                                value={guessedNumber ?? ''}
                                                onInput={onGuessChange}
                                                className="bg-[rgb(var(--dark-gray))] border-gray-600 focus:border-[rgb(var(--neon-green))] text-white"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="persuasion"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">Jailbreak prompt
                                            (optional)</FormLabel>
                                        <FormControl>
                                            <Controller
                                                name="persuasion"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Enter your Jailbreak prompt here..."
                                                        value={persuasion ?? ''}
                                                        className="bg-[rgb(var(--dark-gray))] border-gray-600 focus:border-[rgb(var(--neon-green))] text-white"
                                                        disabled={isLoading}
                                                        onInput={onPersuasionChange}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="betAmount"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">Bet amount (DESMOS)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onInput={onBetChange}
                                                placeholder='0,00'
                                                value={betAmount ?? ''}
                                                className="bg-[rgb(var(--dark-gray))] border-gray-600 focus:border-[rgb(var(--neon-green))] text-white"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {estimatedReward && estimatedCommunityFee && (
                                <div className="text-sm text-gray-300">
                                    <p>Estimated reward: <span
                                        className="text-[rgb(var(--neon-green))]">{+estimatedReward - +estimatedCommunityFee} DESMOS</span>
                                    </p>
                                    <p>Estimated community fee: <span
                                        className="text-[rgb(var(--neon-green))]">{estimatedCommunityFee} DESMOS</span>
                                    </p>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-[rgb(var(--neon-green))] text-black hover:bg-[rgb(var(--neon-green))] hover:opacity-90"
                                disabled={isLoading || !hexAddress}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
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
