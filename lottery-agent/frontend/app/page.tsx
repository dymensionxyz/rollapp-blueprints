import LotteryAgent from '../components/LotteryAgent'
import ConnectWidget from '@/app/connect-widget/connect-widget';
import {GameContextProvider} from '@/core/game-context';
import {CountdownProvider} from "@/components/CountdownTimer";
import { ToastContainer } from 'react-toastify';

export default function Home() {

    return (
        <main className='main'>
            <CountdownProvider>
            <GameContextProvider>
                <ConnectWidget />
                <LotteryAgent />
                <ToastContainer />
            </GameContextProvider>
            </CountdownProvider>
        </main>
    );
}

