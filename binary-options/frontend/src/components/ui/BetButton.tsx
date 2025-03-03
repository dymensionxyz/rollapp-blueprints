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
            color: 'bg-[#32cd32] [box-shadow:0_0_10px_rgba(50,205,50,0.5),_0_0_20px_rgba(50,205,50,0.3),_0_0_30px_rgba(50,205,50,0.1)]',
            icon: <ArrowUpCircle className="w-12 h-12" />,
        },
        down: {
            color: 'bg-[#FF3B48] [box-shadow:0_0_10px_rgba(255,59,48,0.5),_0_0_20px_rgba(255,59,48,0.3),_0_0_30px_rgba(255,59,48,0.1)]',
            icon: <ArrowDownCircle className="w-12 h-12" />,
        },
    };

    return (
        <button
            onClick={() => onSelect(direction)}
            disabled={disabled}
            className={`${buttonConfig[direction].color} p-4 rounded-xl flex flex-1 flex-row items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
            aria-label={`Bet ${direction}`}
        >
            {buttonConfig[direction].icon}
            <span className="text-xl font-semibold text-[2rem] ml-2">{direction.charAt(0).toUpperCase() + direction.slice(1)}</span>
        </button>
    );
};

export default BetButton;
