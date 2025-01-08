import Image from 'next/image'
import { WalletConnect } from './components/WalletConnect'
import { BetForm } from './components/BetForm'
import { BetInfo } from './components/BetInfo'
import { HouseInfo } from './components/HouseInfo'
import { BetHistory } from './components/BetHistory'

export default function Home() {
  return (
      <main className="min-h-screen relative bg-[rgb(var(--graphite))]">
        <div className="absolute top-4 right-4 z-10">
          <WalletConnect />
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center mb-12">
            <Image
                src="/brainpump_logo.png"
                alt="BrainPump Logo"
                width={280}
                height={140}
                className="mb-8"
                priority
            />
            <h1 className="sr-only">BrainPump - Jailbreak an AI to Win</h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-8">
              <BetForm />
              <HouseInfo />
            </div>
            <div className="space-y-8">
              <BetInfo />
            </div>
          </div>

          {/* Bet History */}
          <div className="mt-12 max-w-6xl mx-auto">
            <BetHistory />
          </div>
        </div>
      </main>
  )
}

