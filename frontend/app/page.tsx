'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

export default function Home() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pokemon-cards?populate=*`)
      const data = await response.json()
      console.log('API Response:', data)
      setCards(data.data || [])
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter cards based on selected filters
  const filteredCards = cards.filter(card => {
    if (selectedCategory !== 'all' && card.attributes.categoria !== selectedCategory) return false
    if (selectedRarity !== 'all' && card.attributes.raridade !== selectedRarity) return false
    return true
  })

  // Get rarity color
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

  // Get type color
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
        {/* Loading Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Hero Skeleton */}
            <div className="h-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl mb-8"></div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-card p-4">
                  <div className="aspect-[3/4] bg-slate-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3 mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-slate-200 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pokemon-blue via-pokemon-purple to-pokemon-red opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-float">
              Poke<span className="text-pokemon-yellow-light">LS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              A melhor loja de cartas Pokémon do Brasil
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-xl mx-auto">
              Cartas raras, preços justos e entrega rápida para toda sua coleção
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#cartas"
                className="group bg-pokemon-yellow hover:bg-pokemon-yellow-light text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-yellow"
              >
                <span className="group-hover:animate-pulse">🃏 Ver Cartas</span>
              </Link>
              <Link 
                href="#categorias"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-pokemon-blue text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                📦 Categorias
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating decoration */}
        <div className="absolute top-10 left-10 animate-bounce-slow opacity-20">
          <div className="w-16 h-16 bg-pokemon-yellow rounded-full"></div>
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse-slow opacity-20">
          <div className="w-12 h-12 bg-pokemon-red rounded-full"></div>
        </div>
      </section>

      {/* Category Navigation */}
      <section id="categorias" className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Categorias Populares</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {/* Category buttons */}
            {['Pokémon Básico', 'Pokémon-EX', 'Pokémon-GX', 'Pokémon-V', 'Pokémon-VMAX', 'Treinador'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'border-pokemon-blue bg-pokemon-blue text-white shadow-glow-blue'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-pokemon-blue-light hover:shadow-md'
                }`}
              >
                <div className="font-semibold text-sm">{category.split(' ')[0]}</div>
                <div className="text-xs opacity-80">{category.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>

          {/* Rarity filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm font-medium text-gray-600 mr-2">Raridade:</span>
            {['Comum', 'Incomum', 'Rara', 'Holo Rara', 'Ultra Rara', 'Secreta'].map(rarity => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(selectedRarity === rarity ? 'all' : rarity)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:transform hover:scale-105 ${
                  selectedRarity === rarity
                    ? getRarityColor(rarity) + ' shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cards */}
      <section id="cartas" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Cartas em <span className="text-pokemon-blue">Destaque</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra nossa seleção de cartas Pokémon raras e colecionáveis
            </p>
          </div>
          
          {filteredCards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-card">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 mb-2">
                Nenhuma carta encontrada para os filtros selecionados
              </p>
              <p className="text-gray-500 mb-6">
                Tente ajustar os filtros ou adicione mais cartas no painel admin
              </p>
              <button 
                onClick={() => {setSelectedCategory('all'); setSelectedRarity('all')}}
                className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-6 py-3 rounded-full transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCards.slice(0, 12).map((card) => (
                <div 
                  key={card.id} 
                  className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden cursor-pointer"
                >
                  <div className="relative">
                    <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                      {card.attributes.imagem?.data ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL}${card.attributes.imagem.data.attributes.url}`}
                          alt={card.attributes.nome}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center p-6">
                          <div className="text-4xl mb-2">🃏</div>
                          <p className="font-semibold text-gray-600">{card.attributes.nome}</p>
                          <p className="text-sm text-gray-500">{card.attributes.tipo}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="text-white p-4">
                        <p className="text-sm opacity-90">Clique para ver detalhes</p>
                      </div>
                    </div>
                    
                    {/* Stock badge */}
                    {!card.attributes.em_estoque && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Esgotado
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-pokemon-blue transition-colors capitalize">
                        {card.attributes.nome}
                      </h3>
                      {card.attributes.hp && (
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                          HP {card.attributes.hp}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">{card.attributes.set_nome}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(card.attributes.raridade)}`}>
                        {card.attributes.raridade}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getTypeColor(card.attributes.tipo)}`}>
                        {card.attributes.tipo}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold text-pokemon-blue">
                        R$ {card.attributes.preco.toFixed(2)}
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          card.attributes.em_estoque ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {card.attributes.em_estoque 
                            ? `✓ ${card.attributes.quantidade_estoque} disponível${card.attributes.quantidade_estoque > 1 ? 'is' : ''}`
                            : '✗ Indisponível'
                          }
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {card.attributes.condicao}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load more button */}
          {filteredCards.length > 12 && (
            <div className="text-center mt-12">
              <Link 
                href="/cartas"
                className="group bg-gradient-to-r from-pokemon-blue to-pokemon-purple hover:from-pokemon-purple hover:to-pokemon-blue text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-purple inline-flex items-center gap-2"
              >
                Ver Todas as {filteredCards.length} Cartas
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-pokemon-blue mb-2">{cards.length}+</div>
              <div className="text-gray-600">Cartas Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pokemon-green mb-2">100%</div>
              <div className="text-gray-600">Cartas Originais</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pokemon-yellow mb-2">24h</div>
              <div className="text-gray-600">Envio Rápido</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pokemon-red mb-2">5★</div>
              <div className="text-gray-600">Avaliação</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
