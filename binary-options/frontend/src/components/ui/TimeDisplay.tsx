import { Clock } from 'lucide-react';

interface TimeDisplayProps {
    timeLeft: number;
}

const TimeDisplay = ({ timeLeft }: TimeDisplayProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
    );
};

export default TimeDisplay;