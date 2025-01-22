// components/ProgressBar.tsx
// @ts-ignore
import React from 'react';

interface ProgressBarProps {
    progress: number;
    label?: string; // Nueva prop
}

const ProgressBar = ({ progress, label }: ProgressBarProps) => {
    return (
        <div className="w-full space-y-2">
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
            </div>
            {label && <div className="text-sm text-gray-400 text-center">{label}</div>}
        </div>
    );
};

export default ProgressBar;