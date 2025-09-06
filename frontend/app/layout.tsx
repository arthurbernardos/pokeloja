import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '../components/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kaiyuu TCG - Loja de Cartas Pokémon',
  description: 'A melhor loja de cartas Pokémon do Brasil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
