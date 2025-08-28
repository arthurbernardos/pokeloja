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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pokemon-blue"></div>
          <p className="mt-4 text-lg">Carregando cartas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12 bg-gradient-to-r from-pokemon-blue to-pokemon-red text-white py-16 rounded-lg">
        <h1 className="text-5xl font-bold mb-4">PokeLS</h1>
        <p className="text-xl mb-8">A melhor loja de cartas Pokémon do Brasil</p>
        <Link 
          href="/cartas" 
          className="bg-pokemon-yellow text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
        >
          Ver Todas as Cartas
        </Link>
      </section>

      {/* Featured Cards */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Cartas em Destaque</h2>
        
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              Nenhuma carta encontrada. O banco de dados pode estar vazio ou o Strapi pode estar carregando.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Acesse o painel admin em http://localhost:1337/admin para adicionar cartas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.slice(0, 8).map((card) => (
              <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {card.attributes.imagem?.data ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL}${card.attributes.imagem.data.attributes.url}`}
                      alt={card.attributes.nome}
                      width={200}
                      height={280}
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-center p-4">
                      <p className="font-semibold">{card.attributes.nome}</p>
                      <p className="text-sm">{card.attributes.tipo}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{card.attributes.nome}</h3>
                  <p className="text-sm text-gray-600 mb-2">{card.attributes.set_nome}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      card.attributes.raridade === 'Ultra Rara' || card.attributes.raridade === 'Secreta' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : card.attributes.raridade === 'Holo Rara' || card.attributes.raridade === 'Rara'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {card.attributes.raridade}
                    </span>
                    
                    {card.attributes.hp && (
                      <span className="text-sm font-medium">HP {card.attributes.hp}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pokemon-blue">
                      R$ {card.attributes.preco.toFixed(2)}
                    </span>
                    
                    <span className={`text-sm ${
                      card.attributes.em_estoque ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.attributes.em_estoque 
                        ? `${card.attributes.quantidade_estoque} em estoque`
                        : 'Fora de estoque'
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      {cards.length > 0 && (
        <section className="text-center mt-12">
          <Link 
            href="/cartas"
            className="inline-block bg-pokemon-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Ver Todas as {cards.length} Cartas
          </Link>
        </section>
      )}
    </div>
  )
}
