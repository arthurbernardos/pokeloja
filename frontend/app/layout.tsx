import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PokeLS - Loja de Cartas Pokémon',
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
        <nav className="bg-pokemon-blue text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-pokemon-yellow transition-colors">
              PokeLS
            </Link>
            <div className="flex space-x-4">
              <Link href="/" className="hover:text-pokemon-yellow transition-colors">
                Home
              </Link>
              <Link href="/cartas" className="hover:text-pokemon-yellow transition-colors">
                Cartas
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white p-8 mt-12">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 PokeLS - Loja de Cartas Pokémon</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
