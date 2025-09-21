'use client'

import { useEffect, useState } from 'react'
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

export default function CartasPage() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('nome')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pokemon-cards?populate=*`)
      const data = await response.json()
      setCards(data.data || [])
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort cards
  const filteredAndSortedCards = cards
    .filter(card => {
      if (selectedCategory !== 'all' && card.attributes.categoria !== selectedCategory) return false
      if (selectedRarity !== 'all' && card.attributes.raridade !== selectedRarity) return false
      if (selectedType !== 'all' && card.attributes.tipo !== selectedType) return false
      if (searchQuery && !card.attributes.nome.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !card.attributes.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !card.attributes.set_nome?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let aValue = a.attributes[sortBy as keyof typeof a.attributes]
      let bValue = b.attributes[sortBy as keyof typeof b.attributes]
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
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
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-200 rounded mb-8 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Todas as <span className="text-pokemon-blue">Cartas</span>
              </h1>
              <p className="text-gray-600">
                {filteredAndSortedCards.length} cartas encontradas
              </p>
            </div>
            <Link 
              href="/"
              className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-6 py-3 rounded-full transition-colors"
            >
              ← Voltar ao Início
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Nome, descrição, set..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              >
                <option value="all">Todas</option>
                <option value="Pokémon Básico">Pokémon Básico</option>
                <option value="Pokémon-EX">Pokémon-EX</option>
                <option value="Pokémon-GX">Pokémon-GX</option>
                <option value="Pokémon-V">Pokémon-V</option>
                <option value="Pokémon-VMAX">Pokémon-VMAX</option>
                <option value="Treinador">Treinador</option>
              </select>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Raridade</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              >
                <option value="all">Todas</option>
                <option value="Comum">Comum</option>
                <option value="Incomum">Incomum</option>
                <option value="Rara">Rara</option>
                <option value="Holo Rara">Holo Rara</option>
                <option value="Ultra Rara">Ultra Rara</option>
                <option value="Secreta">Secreta</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              >
                <option value="all">Todos</option>
                <option value="Fogo">Fogo</option>
                <option value="Água">Água</option>
                <option value="Grama">Grama</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Psíquico">Psíquico</option>
                <option value="Lutador">Lutador</option>
                <option value="Sombrio">Sombrio</option>
                <option value="Metal">Metal</option>
                <option value="Fada">Fada</option>
                <option value="Dragão">Dragão</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              >
                <option value="nome">Nome</option>
                <option value="preco">Preço</option>
                <option value="raridade">Raridade</option>
                <option value="hp">HP</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedCards.length} de {cards.length} cartas
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredAndSortedCards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 mb-2">
              Nenhuma carta encontrada
            </p>
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all')
                setSelectedRarity('all')
                setSelectedType('all')
                setSearchQuery('')
              }}
              className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-6 py-3 rounded-full transition-colors"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedCards.map((card) => (
              <Link
                href={`/carta/${card.id}`}
                key={card.id} 
                className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden cursor-pointer block"
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
                      <p className="text-sm opacity-90">Ver detalhes</p>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
