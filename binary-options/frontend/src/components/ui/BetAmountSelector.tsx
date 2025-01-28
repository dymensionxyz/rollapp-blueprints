'use client'

// @ts-ignore
import React, { useState, useEffect } from 'react';
import config from "../../config/config";

const PRESET_AMOUNTS = [1, 5, 10, 25];

interface BetAmountSelectorProps {
    balance: number;
    selectedAmount: number;
    onAmountChange: (amount: number) => void;
}

export const BetAmountSelector = ({
                                      balance,
                                      selectedAmount,
                                      onAmountChange
                                  }: BetAmountSelectorProps) => {
    const [customAmount, setCustomAmount] = useState('');

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setCustomAmount(value);
        if (/^\d*\.?\d*$/.test(value)) {
            onAmountChange(Number(value));
        }
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AMOUNTS.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => onAmountChange(amount)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                            selectedAmount === amount
                                ? "border-green-400 bg-green-400/10 scale-105"
                                : "border-gray-600 hover:border-green-300 hover:bg-green-400/5"
                        }`}
                    >
                        <span className="text-xl font-bold">{amount}</span>
                        <span className="block text-xs text-gray-400 mt-1">{config.screenDenom}</span>
                    </button>
                ))}
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Custom amount"
                    className="w-full p-3 bg-gray-800 rounded-lg border-2 border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {config.screenDenom}
                </div>
            </div>

            <div className="text-center text-sm text-gray-400">
                Available: {(balance / config.denomPrecision).toFixed(2)} {config.screenDenom}
            </div>
        </div>
    );
};