'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

declare global {
    interface Window {
        keplr?: any;
        getOfflineSigner?: any;
    }
}

// types.ts
export interface MarketPair {
    base: string
    quote: string
}

export type Direction = "up" | "down"

// Message for PlaceOption
export interface PlaceOptionMsg {
    direction: Direction
    expiration: number
    bet_amount: {
        denom: string
        amount: string
    }
    market: MarketPair
}

// Execute Messages
export type ExecuteMsg =
    | { place_option: PlaceOptionMsg }
    | { settle_option: { option_id: number } }

// Query Messages
export type QueryMsg =
    | { get_option: { option_id: number } }
    | { list_options: { start_after?: number; limit?: number } }
    | { get_config: {} }

// Query Responses
export interface OptionInfo {
    id: number
    owner: string
    market: MarketPair
    direction: Direction
    strike_price: string
    expiration: number
    bet_amount: {
        denom: string
        amount: string
    }
    settled: boolean
    outcome: boolean | null
}

export interface ListOptionsResponse {
    options: OptionInfo[]
}

export interface Config {
    oracle_addr: string
    payout_multiplier: string
}


// Adjust these values according to your chain:
const CHAIN_ID = "upordown_30607-1"
const RPC_ENDPOINT = "https://rpc.ra-3.rollapp.network/"
const CONTRACT_ADDRESS = "uod1aakfpghcanxtc45gpqlx8j3rq0zcpyf49qmhm9mdjrfx036h4z5sm3q99x"
const FEE_DENOM = "uuod" // Denomination for the fee
const GAS_PRICE = "0.025" // Adjust according to your network

// Interface for our context
interface CosmWasmContextType {
    // Connection state
    client: SigningCosmWasmClient | null
    address: string
    isConnected: boolean

    // Data we want to store locally:
    config: Config | null
    options: OptionInfo[]

    // Main methods
    connect: () => Promise<void>
    disconnect: () => void

    // Contract executions
    placeOption: (msg: PlaceOptionMsg) => Promise<void>
    settleOption: (optionId: number) => Promise<void>

    // Queries
    getOption: (optionId: number) => Promise<OptionInfo | null>
    listOptions: (startAfter?: number, limit?: number) => Promise<OptionInfo[]>
    getConfig: () => Promise<Config | null>

    // Helper to refresh data
    refreshAll: () => Promise<void>
}

// Create the context
const CosmWasmContext = createContext<CosmWasmContextType>(
    {} as CosmWasmContextType
)

// Export a `useContract` hook to consume the context
export const useContract = () => useContext(CosmWasmContext)

// The provider itself:
export function ContractProvider({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<SigningCosmWasmClient | null>(null)
    const [address, setAddress] = useState("")
    const [isConnected, setIsConnected] = useState(false)

    const [config, setConfig] = useState<Config | null>(null)
    const [options, setOptions] = useState<OptionInfo[]>([])

    /**
     * Connects with Keplr, creates a SigningCosmWasmClient, and saves the user's address.
     */
    const connect = async () => {
        console.log("Connecting...")
        try {
            if (!window.keplr) {
                throw new Error("Keplr extension not found")
            }

            const response = await fetch(RPC_ENDPOINT)
            if (!response.ok) {
                throw new Error(`RPC endpoint error: ${response.statusText}`)
            }

            await window.keplr.enable(CHAIN_ID)
            const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID)

            const signingClient = await SigningCosmWasmClient.connectWithSigner(
                RPC_ENDPOINT,
                offlineSigner,
                {
                    gasPrice: GasPrice.fromString(`${GAS_PRICE}${FEE_DENOM}`),
                }
            )

            const accounts = await offlineSigner.getAccounts()
            console.log("Accounts:", accounts)
            const walletAddress = accounts[0]?.address
            console.log("Wallet address:", walletAddress)

            if (!walletAddress) {
                throw new Error("No account found")
            }

            setClient(signingClient)
            setAddress(walletAddress)
            setIsConnected(true)

            console.log({
                title: "Connection Successful",
                description: `Connected to wallet: ${walletAddress}`,
            })

            await refreshAll()
        } catch (error: any) {
            console.error("Detailed connection error:", error)
            throw error
        }
    }

    /**
     * Disconnects the wallet and clears states.
     */
    const disconnect = () => {
        setClient(null)
        setAddress("")
        setIsConnected(false)
        setConfig(null)
        setOptions([])
        console.log({
            title: "Disconnected",
        })
    }

    // --------------------------------------------------------------------------
    //                          EXECUTION FUNCTIONS
    // --------------------------------------------------------------------------
    /**
     * placeOption: Executes the "PlaceOption" message by sending the coin specified in `bet_amount`.
     */
    const placeOption = async (msg: PlaceOptionMsg) => {
        if (!client || !isConnected) {
            throw new Error("You are not connected to the wallet")
        }

        const execMsg: ExecuteMsg = {
            place_option: msg,
        }



        try {
            console.log("address before execute:", address);

            const result = await client.execute(
                address,
                CONTRACT_ADDRESS,
                execMsg,
                "auto",
                "Place Option",
                [
                    {
                        denom: msg.bet_amount.denom,
                        amount: msg.bet_amount.amount,
                    },
                ]
            )
            console.log("placeOption Result:", result)
            console.log({
                title: "Option Created",
                description: `Your option has been placed.`,
            })

            // After placing the option, refresh the list
            await refreshAll()
        } catch (error: any) {
            console.error("Error in placeOption:", error)
            console.log({
                title: "Error Placing Option",
                description: error?.message || String(error),
                variant: "destructive",
            })
            throw error
        }
    }

    /**
     * settleOption: Executes "SettleOption" for the given ID.
     */
    const settleOption = async (optionId: number) => {
        if (!client || !isConnected) {
            throw new Error("You are not connected to the wallet")
        }

        const execMsg: ExecuteMsg = {
            settle_option: {
                option_id: optionId,
            },
        }

        try {
            const result = await client.execute(
                address,
                CONTRACT_ADDRESS,
                execMsg,
                "auto",
                "Settle Option"
            )
            console.log("settleOption Result:", result)
            console.log({
                title: `Option ${optionId} Settled`,
            })
            await refreshAll()
        } catch (error: any) {
            console.error("Error in settleOption:", error)
            console.log({
                title: "Error Settling Option",
                description: error?.message || String(error),
                variant: "destructive",
            })
            throw error
        }
    }

    // --------------------------------------------------------------------------
    //                          QUERY FUNCTIONS
    // --------------------------------------------------------------------------

    /**
     * getOption: Queries a single option (by ID).
     */
    const getOption = async (optionId: number): Promise<OptionInfo | null> => {
        if (!client) return null
        try {
            const query: QueryMsg = {
                get_option: { option_id: optionId },
            }
            const response = await client.queryContractSmart(CONTRACT_ADDRESS, query)
            // response should already be an OptionInfo
            return response as OptionInfo
        } catch (error) {
            console.error("Error in getOption:", error)
            return null
        }
    }

    /**
     * listOptions: Lists all options (with optional pagination).
     */
    const listOptions = async (
        startAfter?: number,
        limit?: number
    ): Promise<OptionInfo[]> => {
        if (!client) return []
        try {
            const query: QueryMsg = {
                list_options: { start_after: startAfter, limit },
            }
            const response = await client.queryContractSmart(CONTRACT_ADDRESS, query)
            // { options: [ ... ] }
            const data = response as ListOptionsResponse
            return data.options
        } catch (error) {
            console.error("Error in listOptions:", error)
            return []
        }
    }

    /**
     * getConfig: Queries the contract configuration (payout_multiplier, oracle_addr, etc.).
     */
    const getConfig = async (): Promise<Config | null> => {
        if (!client) return null
        try {
            const query: QueryMsg = {
                get_config: {},
            }
            const response = await client.queryContractSmart(CONTRACT_ADDRESS, query)
            return response as Config
        } catch (error) {
            console.error("Error in getConfig:", error)
            return null
        }
    }

    // --------------------------------------------------------------------------
    //                 Function to Reload All Information
    // --------------------------------------------------------------------------
    const refreshAll = async () => {
        if (!client) return
        try {
            const cfg = await getConfig()
            setConfig(cfg)

            const allOptions = await listOptions()
            setOptions(allOptions)
        } catch (error: any) {
            console.error("Error in refreshAll:", error)
            console.log({
                title: "Error Refreshing Data",
                description: error?.message || String(error),
                variant: "destructive",
            })
        }
    }

    // --------------------------------------------------------------------------
    // Effects for “automatic” reconnection or cleaning up listeners
    // --------------------------------------------------------------------------
    useEffect(() => {
        // Each time `isConnected` becomes true, refresh
        if (isConnected && client) {
            refreshAll()
        }
    }, [isConnected, client])

    // (Optional) Handle Keplr events, disconnection, network changes, etc.
    // useEffect(() => {
    //   // ...
    // }, [])

    // --------------------------------------------------------------------------
    // Provider Render
    // --------------------------------------------------------------------------
    return (
        <CosmWasmContext.Provider
            value={{
                client,
                address,
                isConnected,
                config,
                options,
                connect,
                disconnect,
                placeOption,
                settleOption,
                getOption,
                listOptions,
                getConfig,
                refreshAll,
            }}
        >
            {children}
        </CosmWasmContext.Provider>
    )
}