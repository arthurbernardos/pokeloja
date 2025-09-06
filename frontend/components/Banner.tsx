'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const banners = [
  {
    id: 1,
    title: 'Pokémon TCG',
    subtitle: 'As melhores cartas Pokémon',
    description: 'Coleção completa com cartas raras e exclusivas',
    gradient: 'from-pokemon-red via-pokemon-orange to-pokemon-yellow',
    image: '🎴',
    link: '/cartas?categoria=pokemon'
  },
  {
    id: 2,
    title: 'Magic: The Gathering',
    subtitle: 'O primeiro TCG do mundo',
    description: 'Decks competitivos e cartas colecionáveis',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    image: '🪄',
    link: '/cartas?categoria=magic'
  },
  {
    id: 3,
    title: 'Yu-Gi-Oh! TCG',
    subtitle: 'É hora do duelo!',
    description: 'Cartas raras e decks estruturados',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    image: '🎯',
    link: '/cartas?categoria=yugioh'
  },
  {
    id: 4,
    title: 'Produtos Lacrados',
    subtitle: 'Booster Boxes e Displays',
    description: 'Produtos selados para colecionadores',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    image: '📦',
    link: '/cartas?lacrado=true'
  }
]

export default function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0)

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${banner.gradient} relative`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">
                        {banner.title}
                      </h2>
                      <p className="text-xl md:text-2xl mb-3 opacity-90 animate-fadeInUp animation-delay-100">
                        {banner.subtitle}
                      </p>
                      <p className="text-lg mb-6 opacity-80 animate-fadeInUp animation-delay-200">
                        {banner.description}
                      </p>
                      <Link 
                        href={banner.link}
                        className="inline-block bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 animate-fadeInUp animation-delay-300"
                      >
                        Explorar Coleção →
                      </Link>
                    </div>
                    <div className="hidden md:flex justify-center items-center">
                      <div className="text-[150px] animate-bounce-slow opacity-50">
                        {banner.image}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Banner anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Próximo banner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Banner indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentBanner 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}