'use client'

import { motion, AnimatePresence } from 'framer-motion'

export const BetOutcomeAnimation = ({ outcome }: { outcome: 'win' | 'loss' | null }) => (
    <AnimatePresence>
        {outcome && (
            <motion.div
                key={outcome}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className={`fixed inset-0 flex items-center justify-center text-6xl md:text-9xl font-bold pointer-events-none z-[1000] ${
                    outcome === 'win'
                        ? 'text-green-500 animate-pulse'
                        : 'text-red-500 animate-shake'
                }`}
            >
                {outcome === 'win' ? '💰 VICTORY! 💰' : '💸 BANKRUPT! 💸'}
            </motion.div>
        )}
    </AnimatePresence>
)