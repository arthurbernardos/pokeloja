'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../../contexts/CartContext'
import { useNotification } from '../../../contexts/NotificationContext'
import CardImage from '@/components/CardImage'

interface PokemonCard {
  id: number
  attributes: {
    nome: string
    descricao: string
    preco: number
    raridade: string
    tipo: string
    hp: number
    set_nome: string
    numero_carta: string
    em_estoque: boolean
    quantidade_estoque: number
    categoria: string
    condicao: string
    slug: string
    lacrado: boolean
    nacionalidade: string
    imagem?: {
      data?: {
        attributes: {
          url: string
          name: string
        }
      }
    }
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { showNotification } = useNotification()
  const [card, setCard] = useState<PokemonCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCard(params.id as string)
    }
  }, [params.id])

  const fetchCard = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pokemon-cards/${id}?populate=*`)
      const data = await response.json()
      setCard(data.data)
    } catch (error) {
      console.error('Erro ao buscar carta:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!card) return
    
    addItem({
      id: card.id,
      name: card.attributes.nome,
      price: card.attributes.preco,
      quantity: quantity,
      image: card.attributes.imagem?.data?.attributes.url,
      maxStock: card.attributes.quantidade_estoque
    })
    
    // Show success notification
    showNotification(`${card.attributes.nome} foi adicionado ao carrinho!`, 'success', 3000)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'bg-rarity-common text-white'
      case 'Incomum': return 'bg-rarity-uncommon text-white'
      case 'Rara': case 'Holo Rara': return 'bg-rarity-rare text-white'
      case 'Ultra Rara': return 'bg-rarity-ultra text-white'
      case 'Secreta': return 'bg-rarity-secret text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fogo': return 'bg-pokemon-red'
      case 'Água': return 'bg-pokemon-blue'
      case 'Grama': return 'bg-pokemon-green'
      case 'Elétrico': return 'bg-pokemon-yellow'
      case 'Psíquico': return 'bg-pokemon-purple'
      case 'Lutador': return 'bg-pokemon-orange'
      case 'Sombrio': return 'bg-gray-800'
      case 'Metal': return 'bg-gray-600'
      case 'Fada': return 'bg-pink-500'
      case 'Dragão': return 'bg-indigo-600'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-slate-200 rounded-xl"></div>
              <div>
                <div className="h-8 bg-slate-200 rounded mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Carta não encontrada</h1>
          <p className="text-gray-600 mb-6">A carta que você está procurando não existe.</p>
          <Link 
            href="/cartas"
            className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-6 py-3 rounded-full transition-colors"
          >
            Ver todas as cartas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-pokemon-blue transition-colors">
              Início
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/cartas" className="text-gray-600 hover:text-pokemon-blue transition-colors">
              Cartas
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{card.attributes.nome}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-white rounded-3xl shadow-card-hover p-8">
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <CardImage
                    src={card.attributes.imagem?.data && !imageError ? `${process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL}${card.attributes.imagem.data.attributes.url}` : undefined}
                    alt={card.attributes.nome}
                    className="w-full h-full"
                    nome={card.attributes.nome}
                    tipo={card.attributes.tipo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 capitalize">
                {card.attributes.nome}
              </h1>
              <p className="text-lg text-gray-600">
                {card.attributes.set_nome} • #{card.attributes.numero_carta}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getRarityColor(card.attributes.raridade)}`}>
                {card.attributes.raridade}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${getTypeColor(card.attributes.tipo)}`}>
                {card.attributes.tipo}
              </span>
              {card.attributes.hp && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-600">
                  HP {card.attributes.hp}
                </span>
              )}
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-700">
                {card.attributes.categoria}
              </span>
            </div>

            {/* Description */}
            {card.attributes.descricao && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Descrição</h2>
                <p className="text-gray-600 leading-relaxed">
                  {card.attributes.descricao}
                </p>
              </div>
            )}

            {/* Condition and Details */}
            <div className="mb-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Detalhes do Produto</h2>
              <div className="flex flex-wrap gap-3">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <span className="text-xs text-gray-500">Condição</span>
                  <p className="font-medium text-gray-700">{card.attributes.condicao}</p>
                </div>
                
                {card.attributes.nacionalidade && (
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <span className="text-xs text-gray-500">Nacionalidade</span>
                    <p className="font-medium text-gray-700">
                      {card.attributes.nacionalidade === 'Português' && '🇧🇷'}
                      {card.attributes.nacionalidade === 'Inglês' && '🇺🇸'}
                      {card.attributes.nacionalidade === 'Japonês' && '🇯🇵'}
                      {card.attributes.nacionalidade === 'Chinês' && '🇨🇳'}
                      {' '}{card.attributes.nacionalidade}
                    </p>
                  </div>
                )}
                
                {card.attributes.lacrado && (
                  <div className="bg-green-100 rounded-lg px-4 py-2">
                    <span className="text-xs text-gray-500">Status</span>
                    <p className="font-medium text-green-700">📦 Produto Lacrado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price and Purchase */}
            <div className="bg-white rounded-2xl shadow-card p-8">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <p className="text-gray-600 mb-1">Preço</p>
                  <div className="text-4xl font-bold text-pokemon-blue">
                    R$ {card.attributes.preco.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-medium ${
                    card.attributes.em_estoque ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.attributes.em_estoque 
                      ? `✓ ${card.attributes.quantidade_estoque} em estoque`
                      : '✗ Fora de estoque'
                    }
                  </div>
                </div>
              </div>

              {card.attributes.em_estoque ? (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(card.attributes.quantidade_estoque, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                        />
                        <button
                          onClick={() => setQuantity(Math.min(card.attributes.quantidade_estoque, quantity + 1))}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-pokemon-blue to-pokemon-purple hover:from-pokemon-purple hover:to-pokemon-blue text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-glow-purple flex items-center justify-center gap-2"
                  >
                    <span>🛒</span>
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-600 font-medium mb-4">
                    Este produto está fora de estoque
                  </p>
                  <button
                    disabled
                    className="bg-gray-200 text-gray-500 px-8 py-4 rounded-full font-bold text-lg cursor-not-allowed w-full"
                  >
                    Indisponível
                  </button>
                </div>
              )}
            </div>

            {/* Back to cards link */}
            <div className="mt-8 text-center">
              <Link 
                href="/cartas"
                className="text-pokemon-blue hover:text-pokemon-blue-light font-medium transition-colors inline-flex items-center gap-2"
              >
                <span>←</span>
                <span>Ver mais cartas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}