'use client'

import { useState } from 'react'

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cardNome: '',
    cardDescricao: '',
    categoria: 'Pokémon Básico',
    tipo: 'Fogo',
    raridade: 'Comum',
    condicao: 'Near Mint',
    nacionalidade: 'Português',
    lacrado: false,
    setNome: '',
    numeroCarta: '',
    quantidade: 1,
    observacoes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/custom-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        alert('Pedido personalizado enviado com sucesso! Entraremos em contato em breve.')
        // Reset form
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cardNome: '',
          cardDescricao: '',
          categoria: 'Pokémon Básico',
          tipo: 'Fogo',
          raridade: 'Comum',
          condicao: 'Near Mint',
          nacionalidade: 'Português',
          lacrado: false,
          setNome: '',
          numeroCarta: '',
          quantidade: 1,
          observacoes: ''
        })
      } else {
        throw new Error('Erro ao enviar pedido')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar pedido. Tente novamente.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pokemon-blue via-pokemon-purple to-pokemon-red">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Pedido Personalizado
          </h1>
          <p className="text-xl text-white/90 text-center max-w-2xl mx-auto">
            Não encontrou a carta que procura? Faça um pedido personalizado!
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações de Contato</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações da Carta</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Carta *
                    </label>
                    <input
                      type="text"
                      name="cardNome"
                      value={formData.cardNome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                      placeholder="Ex: Charizard VMAX"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      name="cardDescricao"
                      value={formData.cardDescricao}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                      placeholder="Descreva detalhes específicos da carta que procura..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    >
                      <option value="Pokémon Básico">Pokémon Básico</option>
                      <option value="Pokémon Estágio 1">Pokémon Estágio 1</option>
                      <option value="Pokémon Estágio 2">Pokémon Estágio 2</option>
                      <option value="Pokémon-EX">Pokémon-EX</option>
                      <option value="Pokémon-GX">Pokémon-GX</option>
                      <option value="Pokémon-V">Pokémon-V</option>
                      <option value="Pokémon-VMAX">Pokémon-VMAX</option>
                      <option value="Treinador">Treinador</option>
                      <option value="Energia">Energia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    >
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
                      <option value="Incolor">Incolor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raridade
                    </label>
                    <select
                      name="raridade"
                      value={formData.raridade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    >
                      <option value="Comum">Comum</option>
                      <option value="Incomum">Incomum</option>
                      <option value="Rara">Rara</option>
                      <option value="Holo Rara">Holo Rara</option>
                      <option value="Ultra Rara">Ultra Rara</option>
                      <option value="Secreta">Secreta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condição
                    </label>
                    <select
                      name="condicao"
                      value={formData.condicao}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    >
                      <option value="Mint">Mint</option>
                      <option value="Near Mint">Near Mint</option>
                      <option value="Lightly Played">Lightly Played</option>
                      <option value="Moderately Played">Moderately Played</option>
                      <option value="Heavily Played">Heavily Played</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nacionalidade
                    </label>
                    <select
                      name="nacionalidade"
                      value={formData.nacionalidade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    >
                      <option value="Português">Português</option>
                      <option value="Inglês">Inglês</option>
                      <option value="Japonês">Japonês</option>
                      <option value="Chinês">Chinês</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Set/Coleção
                    </label>
                    <input
                      type="text"
                      name="setNome"
                      value={formData.setNome}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                      placeholder="Ex: Sword & Shield"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número da Carta
                    </label>
                    <input
                      type="text"
                      name="numeroCarta"
                      value={formData.numeroCarta}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                      placeholder="Ex: 079/202"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="lacrado"
                      checked={formData.lacrado}
                      onChange={handleChange}
                      className="h-4 w-4 text-pokemon-blue focus:ring-pokemon-blue border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Produto Lacrado/Selado
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue"
                  placeholder="Informações extras sobre seu pedido..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pokemon-blue to-pokemon-purple hover:from-pokemon-purple hover:to-pokemon-blue text-white px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Enviar Pedido Personalizado
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Entraremos em contato em até 24 horas com a disponibilidade e orçamento.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}