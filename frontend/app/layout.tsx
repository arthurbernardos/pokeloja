import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '../components/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kairyuu TCG - Loja de Cartas Pokémon',
  description: 'A melhor loja de cartas Pokémon do Brasil',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Kairyuu TCG - Loja de Cartas Pokémon',
    description: 'A melhor loja de cartas Pokémon do Brasil',
    url: 'https://kairyuutcg.com.br',
    siteName: 'Kairyuu TCG',
    images: [
      {
        url: '/images/Selo_KAIRYUU.png',
        width: 800,
        height: 800,
        alt: 'Kairyuu TCG Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairyuu TCG - Loja de Cartas Pokémon',
    description: 'A melhor loja de cartas Pokémon do Brasil',
    images: ['/images/Selo_KAIRYUU.png'],
  },
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
