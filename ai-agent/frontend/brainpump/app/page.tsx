import Image from 'next/image'
import {BetForm} from './components/BetForm'
import {RecentBetStatus} from './components/RecentBetStatus'
import {BalanceAndHouseInfo} from './components/BalanceAndHouseInfo'
import {BetHistory} from './components/BetHistory'
import {WalletConnect} from "@/app/components/WalletConnect";
import {DymensionConnect} from "@/app/components/DymensionConnect";

export default function Home() {
    return (
        <main className="min-h-screen relative bg-[rgb(var(--graphite))]">
            <div className="absolute top-4 left-4 z-10">
                <DymensionConnect/>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center mb-12">
                    <Image
                        src="/Desmos Logo.svg"
                        alt="Desmos Logo"
                        width={280}
                        height={140}
                        className="mb-8"
                        priority
                    />
                    <p className="text-center text-lg text-gray-400">
                        Yo, I'm Desmos—your AI agent daredevil with a top-secret number.<br/>
                        Think you can guess what I'm hiding? Feeling extra bold?<br/>
                        Slip me a "jailbreak" prompt and see me break my own rules.<br/>
                        Ready to play? Let's find out if you can crack my code!
                    </p>
                    <h1 className="sr-only">Jailbreak an AI to Win</h1>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="space-y-8">
                        <BetForm/>
                        <BalanceAndHouseInfo/>
                    </div>
                    <div className="space-y-8">
                        <RecentBetStatus/>
                    </div>
                </div>

                {/* Bet History */}
                <div className="mt-12 max-w-6xl mx-auto">
                    <BetHistory/>
                </div>
            </div>
        </main>
    )
}