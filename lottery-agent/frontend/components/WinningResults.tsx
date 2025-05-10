interface WinningResultsProps {
  winningNumbers: number[]
}

export default function WinningResults({ winningNumbers }: WinningResultsProps) {
  return (
    <div className="text-center">
      <p className="mb-2 text-lg">Today's winning numbers:</p>
      <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
        {winningNumbers.sort((a, b) => a - b).join(', ')}
      </p>
    </div>
  )
}

