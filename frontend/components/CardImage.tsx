'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CardImageProps {
  src?: string
  alt: string
  className?: string
  nome?: string
  tipo?: string
}

export default function CardImage({ src, alt, className = '', nome, tipo }: CardImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const placeholderUrl = '/placeholder-card.png' // Placeholder image path

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background gradient based on card type */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${
          tipo === 'Fogo' ? 'from-red-100 to-orange-100' :
          tipo === 'Água' ? 'from-blue-100 to-cyan-100' :
          tipo === 'Grama' ? 'from-green-100 to-emerald-100' :
          tipo === 'Elétrico' ? 'from-yellow-100 to-amber-100' :
          tipo === 'Psíquico' ? 'from-purple-100 to-pink-100' :
          tipo === 'Lutador' ? 'from-orange-200 to-red-100' :
          tipo === 'Sombrio' ? 'from-gray-200 to-gray-300' :
          tipo === 'Metal' ? 'from-gray-100 to-slate-200' :
          tipo === 'Fada' ? 'from-pink-100 to-rose-100' :
          tipo === 'Dragão' ? 'from-indigo-100 to-purple-100' :
          'from-gray-100 to-gray-200'
        }`}
      />
      
      {/* Card image */}
      {src && !hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mb-2"></div>
                <p className="text-sm text-gray-500">Carregando...</p>
              </div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`relative z-10 w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true)
              setIsLoading(false)
            }}
          />
        </>
      ) : (
        <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-6xl mb-3 opacity-50">🎴</div>
            <p className="font-semibold text-gray-600">{nome || 'Card Image'}</p>
            {tipo && <p className="text-sm text-gray-500">{tipo}</p>}
            <p className="text-xs text-gray-400 mt-2">Imagem em breve</p>
          </div>
        </div>
      )}
      
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 transform rotate-45 translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 transform rotate-45 -translate-x-8 translate-y-8"></div>
    </div>
  )
}