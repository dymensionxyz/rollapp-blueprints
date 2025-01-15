'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FraudFormProps {
    onClose: () => void
    promptId: string
}

export function FraudForm({ onClose, promptId }: FraudFormProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit Fraud Report</DialogTitle>
                </DialogHeader>
                <div className="text-start">
                    <p>In order to submit fraud, please submit a <a href="https://portal.dymension.xyz/dymension/create-proposal" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">gov proposal</a> with the following details:</p>
                    <br />
                    <p>Title: Sequencer cheated in game result</p>
                    <p>Description: In Desmos, the sequencer cheated for game result with Game ID {promptId};</p>
                    <p>Rollapp ID : &lt;desmos-rollapp-id&gt;</p>
                    <p>IBC Client ID: &lt;desmos-ibc-client-id&gt;</p>
                    <p>Fraudlent Height: &lt;resolve-tx-height&gt;</p>
                    <p>Fraudlent Sequencer Address: &lt;desmose-sequencer-address&gt;</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

