// components/ProgressBar.tsx
// @ts-ignore
import React from 'react';

interface ProgressBarProps {
    progress: number; // Valor entre 0 y 100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
    return (
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
                className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
};

export default ProgressBar;