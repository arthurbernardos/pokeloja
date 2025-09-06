'use client'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pokemon-blue via-pokemon-purple to-pokemon-red">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">
            Comunidade PokeLoja
          </h1>
          <p className="text-xl text-white/90 text-center max-w-2xl mx-auto">
            Conecte-se com outros treinadores, compartilhe suas coleções e participe de eventos exclusivos
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-6">🏗️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Em Construção
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Estamos trabalhando duro para criar um espaço incrível onde a comunidade de TCG pode se reunir. 
                Em breve você poderá:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                <div className="bg-gradient-to-br from-pokemon-blue/10 to-pokemon-blue/5 rounded-xl p-6">
                  <div className="text-2xl mb-3">💬</div>
                  <h3 className="font-bold text-lg mb-2 text-pokemon-blue">Fórum de Discussão</h3>
                  <p className="text-gray-600">
                    Discuta estratégias, decks e as últimas novidades do mundo Pokémon TCG
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pokemon-green/10 to-pokemon-green/5 rounded-xl p-6">
                  <div className="text-2xl mb-3">🏆</div>
                  <h3 className="font-bold text-lg mb-2 text-pokemon-green">Torneios Online</h3>
                  <p className="text-gray-600">
                    Participe de torneios exclusivos e ganhe prêmios incríveis
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pokemon-yellow/10 to-pokemon-yellow/5 rounded-xl p-6">
                  <div className="text-2xl mb-3">📸</div>
                  <h3 className="font-bold text-lg mb-2 text-pokemon-yellow-dark">Galeria de Coleções</h3>
                  <p className="text-gray-600">
                    Mostre suas cartas mais raras e veja as coleções de outros treinadores
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pokemon-purple/10 to-pokemon-purple/5 rounded-xl p-6">
                  <div className="text-2xl mb-3">🤝</div>
                  <h3 className="font-bold text-lg mb-2 text-pokemon-purple">Sistema de Trocas</h3>
                  <p className="text-gray-600">
                    Encontre as cartas que faltam em sua coleção através de trocas seguras
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-pokemon-blue to-pokemon-purple text-white rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-3">🎉 Seja o Primeiro a Saber!</h3>
                <p className="mb-4">
                  Cadastre seu e-mail para receber novidades sobre o lançamento da comunidade
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                  <button className="bg-pokemon-yellow hover:bg-pokemon-yellow-light text-black px-6 py-3 rounded-full font-bold transition-colors">
                    Cadastrar
                  </button>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm">
                Enquanto isso, siga-nos nas redes sociais para ficar por dentro das novidades!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}