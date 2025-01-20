'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import {GameContext} from "@/core/game-context";

type CountdownContextValue = {
  timeLeft: number
  setTimeLeft: (time: number) => void
}

export function CountdownProvider({ children }: { children: ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(0) // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) return 0 // Reset to 24 hours
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
      <CountdownContext.Provider value={{ timeLeft, setTimeLeft }}>
        {children}
      </CountdownContext.Provider>
  )
}

export const CountdownContext = createContext<CountdownContextValue>({} as CountdownContextValue);
export const useCountdown = (): CountdownContextValue => useContext(CountdownContext);

export default function CountdownTimer() {
  const { timeLeft } = useCountdown()

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
      <div className="text-4xl font-bold text-center">
        <div className="flex justify-center items-center space-x-2">
          <TimeUnit value={hours} label="HOURS" />
          <span className="text-yellow-400">:</span>
          <TimeUnit value={minutes} label="MINUTES" />
          <span className="text-yellow-400">:</span>
          <TimeUnit value={seconds} label="SECONDS" />
        </div>
      </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
      <div className="flex flex-col items-center">
      <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
        {value.toString().padStart(2, '0')}
      </span>
        <span className="text-xs mt-1 text-white text-opacity-80">{label}</span>
      </div>
  )
}
