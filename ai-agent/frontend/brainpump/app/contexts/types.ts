export const JSON_RPC = 'https://json-rpc.ra-2.rollapp.network';

export const CONTRACT_ADDRESS = "0x323EE43220aa77144375ed1128bf8ECf0c526328"

export const DEFAULT_BROADCAST_ATTEMPTS = 3;

export const NETWORK_PARAMS = {
    chainId: '0x69D6F', // 433519 in hexadecimal
    chainName: 'Desmos Testnet',
    nativeCurrency: {
        name: 'DESMOS',
        symbol: 'DESMOS',
        decimals: 18
    },
    rpcUrls: ['https://json-rpc.ra-2.rollapp.network'],
    blockExplorerUrls: []
}

export const SUCCESS_MESSAGES = [
    '🏆 Another win! Congratulations!',
    '🥳 Great job! You’ve won again!',
    '🎉 You’re on a roll! Another win!',
    '🌟 You’ve done it again! Well played!',
    '👏 Victory! You’re unstoppable!',
    '🪙 Flip success! Another win for you!',
    '💰 Winner again! Keep it up!',
    '🎊 You’re racking up wins! Nice flip!',
];

export const LOSING_MESSAGES = [
    '😔 Better luck next time!',
    '🪙 You lost this flip, but don’t give up!',
    '🤷 Not your day, but keep flipping!',
    '🌧️ This one didn’t go your way. Try again!',
    '😅 So close! Maybe next time.',
    '💔 You’ve lost this round. Flip again!',
    '❌ Oh no! The coin wasn’t in your favor.',
    '🥶 Tough break! Don’t lose hope!',
    '🐾 The coin walked away from you this time!',
    '🤞 Not a win, but your next flip could be the one!',
];

export enum ContractFunction {
    placeBet = 'placeBet', resolveBet = 'resolveBet', withdraw = 'withdraw'
}
