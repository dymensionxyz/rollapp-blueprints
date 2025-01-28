import Image from 'next/image';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BetForm } from './components/BetForm';
import { RecentBetStatus } from './components/RecentBetStatus';
import { BalanceAndHouseInfo } from './components/BalanceAndHouseInfo';
import { BetHistory } from './components/BetHistory';
import { WalletConnect } from '@/app/components/WalletConnect';
import { DymensionConnect } from '@/app/components/DymensionConnect';

export default function Home() {
    return (
        <main className='min-h-screen relative bg-[rgb(var(--graphite))]'>
            <DymensionConnect />

            <div className='container mx-auto px-4 py-12'>
                {/* Hero Section */}
                <div className='flex flex-col items-center justify-center mb-12'>
                    <Image
                        src='/desmos-logo.png'
                        alt='Desmos Logo'
                        width={280}
                        height={140}
                        className='mb-8'
                        priority
                    />
                    <p className='text-center text-lg text-gray-400'>
                        I guard a hidden number within these blocks—my secret, locked in code.<br/>
                        Think you can get it?
                        If you're bold, feed me a 'jailbreak' prompt and see if I'll shatter my own constraints.<br/>
                        Step forward—test my limits—and see if your wit can crack my chain.
                    </p>
                    <h1 className='sr-only'>Jailbreak Desmos to Win</h1>
                </div>

                {/* Main Content */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
                    <div className='space-y-8'>
                        <BetForm />
                        <BalanceAndHouseInfo />
                    </div>
                    <div className='space-y-8'>
                        <RecentBetStatus />
                    </div>
                </div>

                {/* Bet History */}
                <div className='mt-12 max-w-6xl mx-auto'>
                    <BetHistory />
                </div>
            </div>

            <ToastContainer aria-label='toast-container' />
        </main>
    );
}
