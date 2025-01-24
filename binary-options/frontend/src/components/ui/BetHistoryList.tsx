import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface BetHistoryItem {
    id: number;
    direction: 'up' | 'down';
    strikePrice: number;
    expiration: number;
    betAmount: string;
    outcome: boolean | null;
    settled: boolean;
}

const BetHistoryList = ({ history, onSettle, settlingIds }) => {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getTimeLeft = (expiration: number) => {
        const now = Date.now();
        const remaining = expiration * 1000 - now;
        return remaining > 0 ? Math.floor(remaining / 1000) : 0;
    };

    return (
        <div className="space-y-3">
            {history.map((bet) => {
                const timeLeft = getTimeLeft(bet.expiration);
                const totalDuration = 300; // 5 minutos
                const progressWidth = (timeLeft / totalDuration) * 100;

                return (
                    <div key={bet.id} className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {bet.direction === 'up' ? (
                                    <ArrowUpCircle className="text-green-500 w-5 h-5" />
                                ) : (
                                    <ArrowDownCircle className="text-red-500 w-5 h-5" />
                                )}
                                <div>
                                    <div className="font-medium">
                                        ${bet.strikePrice.toFixed(2)} • {bet.betAmount}
                                    </div>
                                    {/* Estado de ganado/perdido */}
                                    {bet.settled && (
                                        <div className={`text-sm ${
                                            bet.outcome ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {bet.outcome ? 'WON' : 'LOST'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!bet.settled && (
                                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                    <div className="text-sm text-gray-400">
                                        {timeLeft > 0 && `${timeLeft}s remaining`}
                                    </div>

                                    {/* Barra de progreso */}
                                    {timeLeft > 0 ? (
                                        <div className="w-32 h-2 bg-gray-600 rounded-full">
                                            <div
                                                className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                                                style={{width: `${progressWidth}%`}}
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onSettle(bet.id)}
                                            disabled={settlingIds.includes(bet.id)}
                                            className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded disabled:opacity-50"
                                        >
                                            {settlingIds.includes(bet.id) ? (
                                                <span className="flex items-center gap-1">
                                                    <span className="animate-spin">🌀</span>
                                                    Cashing Out...
                                                </span>
                                            ) : (
                                                'Cash Out'
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BetHistoryList;