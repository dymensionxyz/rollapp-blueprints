interface TicketConfirmationProps {
  numbers: number[]
}

export default function TicketConfirmation({  numbers }: TicketConfirmationProps) {
  return (
    <div className="text-center">
      <p className="text-lg">Numbers: <span className="font-bold text-yellow-300">{numbers.sort((a, b) => a - b).join(', ')}</span></p>
    </div>
  )
}

