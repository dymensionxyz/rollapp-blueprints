import React from "react";

interface BtcPriceDisplayProps {
    currentPrice: number | null;
    isLoading: boolean;
    error: string | null;
}

const BtcPriceDisplay: React.FC<BtcPriceDisplayProps> = ({ currentPrice, isLoading, error }) => {
    return (
        <div className="text-center min-[720px]:-mb-2">
            <h2 className="text-[#f5f5f5] mb-1">Current BTC Price</h2>
            {isLoading && !currentPrice ? (
                <div className="text-2xl h-10 leading-[40px] text-[rgb(247,147,26)]">Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                currentPrice && (
                    <div className="text-4xl font-bold text-[#f7931a] [text-shadow:0_0_10px_rgba(247,147,26,0.5),_0_0_20px_rgba(247,147,26,0.3),_0_0_30px_rgba(247,147,26,0.1)]">
                        ${currentPrice.toLocaleString()}
                    </div>
                )
            )}
        </div>
    );
};

export default BtcPriceDisplay;
