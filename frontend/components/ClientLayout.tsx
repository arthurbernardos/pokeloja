'use client'

import Link from 'next/link'
import { CartProvider } from '../contexts/CartContext'
import { AuthProvider } from '../contexts/AuthContext'
import { AnalyticsProvider } from '../contexts/AnalyticsContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import Notifications from './Notifications'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Navigation() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load initial cart count
    const loadCartCount = () => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        try {
          const items = JSON.parse(cart)
          const count = items.reduce((total: number, item: any) => total + item.quantity, 0)
          setCartCount(count)
        } catch (error) {
          console.error('Error loading cart count:', error)
        }
      }
    }

    loadCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => loadCartCount()
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const { user, logout } = useAuth()

  return (
    <nav className="bg-pokemon-blue text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-pokemon-yellow transition-colors">
            Kaiyuu TCG
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-pokemon-yellow transition-colors">
              Home
            </Link>
            <Link href="/cartas" className="hover:text-pokemon-yellow transition-colors">
              Cartas
            </Link>
            <Link href="/comunidade" className="hover:text-pokemon-yellow transition-colors">
              Comunidade
            </Link>
            <Link href="/pedido-personalizado" className="hover:text-pokemon-yellow transition-colors">
              Pedido Personalizado
            </Link>
            <Link 
              href="/carrinho" 
              className="relative hover:text-pokemon-yellow transition-colors flex items-center gap-2"
            >
              <span className="text-xl">🛒</span>
              <span>Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pokemon-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User section */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Olá, {user.nome || user.email}</span>
                <Link 
                  href="/conta"
                  className="hover:text-pokemon-yellow transition-colors text-sm"
                >
                  Minha Conta
                </Link>
                <button 
                  onClick={logout}
                  className="bg-pokemon-red hover:bg-red-600 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login"
                  className="hover:text-pokemon-yellow transition-colors text-sm"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro"
                  className="bg-pokemon-yellow hover:bg-pokemon-yellow-light text-pokemon-blue px-3 py-1 rounded-full text-sm font-bold transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <NotificationProvider>
          <CartProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-gray-800 text-white p-8 mt-12">
              <div className="container mx-auto text-center">
                <p>&copy; 2024 Kaiyuu TCG - Loja de Cartas Pokémon</p>
              </div>
            </footer>
            <Notifications />
          </CartProvider>
        </NotificationProvider>
      </AnalyticsProvider>
    </AuthProvider>
  )
}