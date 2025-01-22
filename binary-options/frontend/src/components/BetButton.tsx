import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
// @ts-ignore
import React from 'react';

interface BetButtonProps {
    direction: 'up' | 'down';
    onSelect: (direction: 'up' | 'down') => void;
    disabled?: boolean;
}

const BetButton = ({ direction, onSelect, disabled }: BetButtonProps) => {
    const buttonConfig = {
        up: {
            color: 'bg-green-600 hover:bg-green-700',
            icon: <ArrowUpCircle className="w-12 h-12 mb-2" />,
        },
        down: {
            color: 'bg-red-600 hover:bg-red-700',
            icon: <ArrowDownCircle className="w-12 h-12 mb-2" />,
        },
    };

    return (
        <button
            onClick={() => onSelect(direction)}
            disabled={disabled}
            className={`${buttonConfig[direction].color} p-6 rounded-xl flex flex-col items-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
            aria-label={`Bet ${direction}`}
        >
            {buttonConfig[direction].icon}
            <span className="text-xl font-semibold">{direction.charAt(0).toUpperCase() + direction.slice(1)}</span>
        </button>
    );
};

export default BetButton;