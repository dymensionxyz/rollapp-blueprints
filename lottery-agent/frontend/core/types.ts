export const JSON_RPC = 'https://json-rpc.ra-2.rollapp.network';
export const LOTTERY_CONTRACT_ADDRESS = '0xAEb1cc59bD804DD3ADA20C405e61B4E05e908874';

export const DEFAULT_BROADCAST_ATTEMPTS = 3;

export interface ContractMessage {
    address: string;
    data: string;
    value?: string;
}

export enum LotteryAgentFunction {
    purchaseTicket = 'purchaseTicket'
}
