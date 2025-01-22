import React from "react";

interface BtcPriceDisplayProps {
    currentPrice: number | null;
    isLoading: boolean;
    error: string | null;
}

const BtcPriceDisplay: React.FC<BtcPriceDisplayProps> = ({ currentPrice, isLoading, error }) => {
    return (
        <div className="text-center">
            <h2 className="text-gray-400 mb-2">Current BTC Price</h2>
            {isLoading ? (
                <div className="text-2xl">Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                currentPrice && (
                    <div className="text-4xl font-bold">
                        ${currentPrice.toLocaleString()}
                    </div>
                )
            )}
        </div>
    );
};

export default BtcPriceDisplay;
