'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NumberSelection from './NumberSelection'
import CountdownTimer from './CountdownTimer'
import TicketConfirmation from './TicketConfirmation'
import WinningResults from './WinningResults'
import DrawHistory, { type DrawHistoryItem } from './DrawHistory'
import { useGame } from '@/core/game-context'

export default function LotteryAgent() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [winningNumbers, setWinningNumbers] = useState<number[]>([])
  const [currentPrize, setCurrentPrize] = useState<number>(100000) // Initial prize of 100,000 DYM
  const [drawHistory, setDrawHistory] = useState<DrawHistoryItem[]>([])

  const {
    setTicketNumbers,
    purchaseTicket,
    curDrawTotalWinnings,
    ticketCost,
    houseBalance,
    ticketBought,
    setTicketBought
  } = useGame()

  useEffect(() => {
    if (selectedNumbers.length === 10) {
      setTicketNumbers(selectedNumbers);
    } else {
      setTicketBought(false);
    }
  }, [selectedNumbers]); // следим за изменениями selectedNumbers

  const handlePurchaseTicket = () => {
    if (selectedNumbers.length === 10) {
      purchaseTicket();
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="container mx-auto p-4">
          <h1 className="text-5xl font-bold text-center mb-8 py-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
            Prize Pool: {curDrawTotalWinnings.toLocaleString()} DYM
          </h1>

          <div className="flex gap-8 justify-center">
            <div className="w-full max-w-md">
              <div className="grid grid-cols-1 gap-8">
                {ticketBought && (
                    <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                      <CardHeader>
                        <CardTitle className="text-2xl">Ticket bought</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TicketConfirmation numbers={selectedNumbers} />
                      </CardContent>
                    </Card>
                )}
                <Card className="bg-gradient-to-br from-pink-400 to-red-500 text-white">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Ticket</CardTitle>
                    <CardDescription className="text-white text-opacity-80">
                      Select 10 unique numbers from 1 to 20
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NumberSelection selectedNumbers={selectedNumbers} setSelectedNumbers={setSelectedNumbers} />
                    <Button
                        className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                        onClick={handlePurchaseTicket}
                        disabled={selectedNumbers.length !== 10}
                    >
                      Purchase {ticketCost} DYM
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Next Draw</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CountdownTimer />
                    <div className="mt-4 text-center">
                      <p className="text-lg font-semibold mb-2">House Revenue: {houseBalance} DYM</p>
                      <Button
                          className="w-full max-w-xs bg-green-400 hover:bg-green-500 text-black font-bold"
                          onClick={() => alert("Staking functionality not implemented")}
                      >
                        Stake and Share Revenue
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {winningNumbers.length > 0 && (
                    <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                      <CardHeader>
                        <CardTitle className="text-2xl">Winning Numbers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <WinningResults winningNumbers={winningNumbers} />
                      </CardContent>
                    </Card>
                )}
              </div>
            </div>
            <div className="w-80">
              <DrawHistory drawHistory={drawHistory} />
            </div>
          </div>
        </div>
      </div>
  )
}
