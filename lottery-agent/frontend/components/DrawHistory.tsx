"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {useGame, DrawInfo} from "@/core/game-context";

export interface DrawHistoryItem {
    id: number
    data: DrawInfo
}

interface DrawHistoryProps {
    drawHistory: DrawHistoryItem[]
}

export default function DrawHistory({ drawHistory }: DrawHistoryProps) {
    const [selectedDraw, setSelectedDraw] = useState<DrawHistoryItem | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const drawsPerPage = 7
    const {
       drawCount,
        requestDrawShortInfo,
        requestedDrawShortInfo,
        hexAddress,
        requestUserTickets,
        requestedTickets,
        setRequestedTickets,
        setRequestedDrawShortInfo,
        claimPrize
    } = useGame();

    const [totalPages, setTotalPages] = useState(0);
    const [paginatedDraws, setPaginatedDraws] = useState<DrawHistoryItem[]>([])

    useEffect(() => {
        setTotalPages(Math.floor(drawCount / drawsPerPage));

        // Генерация массива объектов DrawHistoryItem с только заполненными полями id
        const startIndex = currentPage * drawsPerPage;
        const endIndex = Math.min(startIndex + drawsPerPage, drawCount);

        const empty : DrawInfo = {
            ticketCount: 0,
            winningNumbers: [],
            winnersCount: 0,
            totalWinnings: 0
        }
        const paginatedDraws = Array.from({ length: endIndex - startIndex }, (_, index) => ({
            id: drawCount - 1 - (startIndex + index),
            data: empty
        }));

        setPaginatedDraws(paginatedDraws);
    }, [drawCount, currentPage, drawsPerPage]);

    useEffect(() => {
        if (!selectedDraw || !hexAddress) {
            return ;
        }

        const drawIdx = Number(selectedDraw.id.toString())
        requestDrawShortInfo(drawIdx)
        requestUserTickets(drawIdx, hexAddress)
    }, [selectedDraw]);


    useEffect(() => {
        if (!selectedDraw || !requestedDrawShortInfo) {
            return;
        }

        selectedDraw.data = requestedDrawShortInfo;
        setSelectedDraw(selectedDraw)
    }, [requestedDrawShortInfo])

    const handleClaimPrize = (drawId: number) => {
        alert(`Claiming prize for draw #${drawId}`)
        // Implement the actual claim logic here
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    return (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white h-[calc(100vh-8rem)] sticky top-4">
            <CardHeader>
                <CardTitle className="text-2xl">Draw History</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)]">
                    <div className="grid grid-cols-1 gap-4">
                        {paginatedDraws.map((draw) => (
                            <Button
                                key={draw.id}
                                variant="outline"
                                className="w-full text-left justify-start h-auto py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
                                onClick={() => setSelectedDraw(draw)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-lg font-semibold">Draw</span>
                                    <span className="text-2xl font-bold">#{draw.id}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>
              Page {currentPage} of {totalPages}
            </span>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </ScrollArea>
            </CardContent>
            {selectedDraw && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Card className="bg-gray-800 text-white w-96">
                        <CardHeader>
                            <CardTitle className="text-2xl">Draw #{selectedDraw.id}, Details:</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Status: {selectedDraw.data.winningNumbers.length > 0? "Completed": "Not finished"} </p>
                            <p>Draw Tickets Bought: {selectedDraw.data.ticketCount.toString()}</p>
                            <p>Prize Pool: {selectedDraw.data.totalWinnings.toString()}</p>
                            {selectedDraw.data.winningNumbers.length > 0 && <p>Winning Numbers: {selectedDraw.data.winningNumbers.join(", ")}</p>}
                            {selectedDraw.data.winningNumbers.length > 0 && <p>Winners Count: {selectedDraw.data.winnersCount.toString()}</p>}
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-2">Your Tickets:</h4>
                                {/* Simulated user tickets */}
                                <div className="space-y-2">
                                    {requestedTickets.map((ticket, index) => (
                                        <TicketItem
                                            key={index}
                                            numbers={ticket.numbers}
                                            isWinner={ticket.isWinner}
                                            isClaimed={ticket.isClaimed}
                                            onClaim={ticket.isWinner && !ticket.isClaimed && selectedDraw? () => claimPrize(selectedDraw.id, ticket.id) : undefined}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button className="mt-4 w-full bg-red-500 hover:bg-red-600" onClick={() => { setSelectedDraw(null); setRequestedTickets([]); setRequestedDrawShortInfo(null) }} >
                                Close
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Card>
    )
}

interface TicketItemProps {
    numbers: number[]
    isWinner: boolean
    isClaimed: boolean
    onClaim?: () => void
}

function TicketItem({ numbers, isWinner, isClaimed, onClaim }: TicketItemProps) {
    return (
        <div className={`p-2 rounded ${isWinner ? "bg-green-700" : "bg-gray-700"}`}>
            <p className="text-sm">{numbers.join(", ")}</p>
            {isWinner && !isClaimed && (
                <Button className="mt-1 w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={onClaim}>
                    Claim Prize
                </Button>
            )}
        </div>
    )
}

