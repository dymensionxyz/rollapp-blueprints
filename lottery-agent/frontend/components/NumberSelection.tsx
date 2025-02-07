import { Button } from "@/components/ui/button"

interface NumberSelectionProps {
  selectedNumbers: number[]
  setSelectedNumbers: React.Dispatch<React.SetStateAction<number[]>>
}

export default function NumberSelection({ selectedNumbers, setSelectedNumbers }: NumberSelectionProps) {
  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num))
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num])
    }
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 justify-center">
        {Array.from({length: 20}, (_, i) => i + 1).map(num => (
          <Button
            key={num - 1}
            variant={selectedNumbers.includes(num - 1) ? "default" : "outline"}
            onClick={() => toggleNumber(num - 1)}
            className={`
              ${selectedNumbers.includes(num - 1) 
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black' 
                : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'}
              transition-all duration-200 ease-in-out transform hover:scale-105
            `}
          >
            {num - 1}
          </Button>
        ))}
      </div>
      <p className="mt-2 text-sm text-white text-opacity-80">Selected: {selectedNumbers.length}/10</p>
    </div>
  )
}

