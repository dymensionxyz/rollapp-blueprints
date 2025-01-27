import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { ContractProvider } from './contexts/ContractContext'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Desmos | Jailbreak an AI to Win',
  description: 'AI-powered betting game on Dymension RollApp',
  icons: {
    icon: '/desmos-logo.ico',
    apple: '/desmos-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        <ContractProvider>
          {children}
        </ContractProvider>
      </body>
    </html>
  )
}

