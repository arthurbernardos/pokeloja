'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: number
  attributes: {
    numero_pedido: string
    data_pedido: string
    status: string
    valor_total: number
    itens: any[]
  }
}

export default function AccountPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchOrders()
    }
  }, [user, loading, router])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders?filters[customer][email][$eq]=${user?.email}&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      setOrders(data.data || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800'
      case 'Processando': return 'bg-blue-100 text-blue-800'
      case 'Enviado': return 'bg-purple-100 text-purple-800'
      case 'Entregue': return 'bg-green-100 text-green-800'
      case 'Cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pokemon-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Minha Conta
                </h1>
                <p className="text-gray-600">
                  Olá, {user.nome || user.email}! Gerencie sua conta e pedidos.
                </p>
              </div>
              <button
                onClick={logout}
                className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-pokemon-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👤 Perfil
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-pokemon-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📦 Pedidos ({orders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'addresses'
                        ? 'bg-pokemon-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📍 Endereços
                  </button>
                  <Link
                    href="/pedido-personalizado"
                    className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    ✨ Pedido Personalizado
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações do Perfil</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={user.nome || ''}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={user.telefone || ''}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Membro desde
                        </label>
                        <input
                          type="text"
                          value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <button className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-6 py-2 rounded-lg transition-colors">
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h2>
                    
                    {loadingOrders ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pokemon-blue mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando pedidos...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Nenhum pedido encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Você ainda não fez nenhum pedido. Que tal começar agora?
                        </p>
                        <Link
                          href="/cartas"
                          className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Ver Produtos
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="flex items-center gap-4 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    Pedido #{order.attributes.numero_pedido}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.attributes.status)}`}>
                                    {order.attributes.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Data: {new Date(order.attributes.data_pedido).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.attributes.itens?.length || 0} item(s)
                                </p>
                              </div>
                              <div className="text-right mt-4 md:mt-0">
                                <div className="text-xl font-bold text-pokemon-blue">
                                  R$ {order.attributes.valor_total.toFixed(2)}
                                </div>
                                <button className="text-sm text-pokemon-blue hover:text-pokemon-blue-light mt-1">
                                  Ver detalhes →
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Endereços</h2>
                    
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📍</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Em breve
                      </h3>
                      <p className="text-gray-600">
                        A funcionalidade de gerenciar endereços estará disponível em breve.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}