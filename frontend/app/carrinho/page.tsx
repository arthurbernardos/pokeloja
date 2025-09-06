'use client'

import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/login?redirect=carrinho')
      return
    }
    setShowCheckout(true)
  }

  const handleCheckout = async (paymentMethod: string) => {
    if (items.length === 0 || !user) return
    
    setIsProcessing(true)
    
    try {
      const token = localStorage.getItem('token')
      const orderNumber = 'KTC' + Date.now()
      
      // Create order in Strapi first
      const orderData = {
        data: {
          numero_pedido: orderNumber,
          data_pedido: new Date().toISOString(),
          status: 'Pendente',
          valor_total: getTotalPrice(),
          valor_frete: 0,
          forma_pagamento: paymentMethod,
          itens: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }
      }

      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        throw new Error('Falha ao criar pedido')
      }

      const orderResult = await orderResponse.json()
      const orderId = orderResult.data.id

      // Process payment with Asaas
      let paymentEndpoint = ''
      let paymentData: any = {
        orderId,
        customerData: {
          name: user.nome || user.email,
          email: user.email,
          cpfCnpj: '', // This should come from user profile
          phone: user.telefone || '',
          mobilePhone: user.telefone || '',
          address: 'Rua Exemplo, 123', // This should come from user profile
          addressNumber: '123',
          complement: '',
          province: 'Centro',
          city: 'São Paulo',
          postalCode: '01000-000'
        }
      }

      switch (paymentMethod) {
        case 'PIX':
          paymentEndpoint = '/payments/pix'
          break
        case 'Cartão de Crédito':
          paymentEndpoint = '/payments/credit-card'
          // For credit card, we would need to collect card data
          // For now, this is a placeholder
          paymentData.cardData = {
            holderName: user.nome,
            number: '4000000000000010', // Test card number
            expiryMonth: '12',
            expiryYear: '2030',
            ccv: '123',
            installmentCount: 1
          }
          break
        case 'Boleto':
          paymentEndpoint = '/payments/boleto'
          break
        default:
          throw new Error('Método de pagamento não suportado')
      }

      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${paymentEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      })

      if (!paymentResponse.ok) {
        throw new Error('Falha ao processar pagamento')
      }

      const paymentResult = await paymentResponse.json()

      clearCart()

      // Show payment-specific success message
      if (paymentMethod === 'PIX' && paymentResult.payment.pixCode) {
        alert(`Pedido #${orderNumber} criado com sucesso!\n\n` +
              `💰 PIX criado no valor de R$ ${paymentResult.payment.value.toFixed(2)}\n` +
              `📱 Use o QR Code ou cole o código PIX para pagar\n\n` +
              `⏰ Pagamento expira em 24 horas`)
      } else if (paymentMethod === 'Boleto' && paymentResult.payment.boletoUrl) {
        alert(`Pedido #${orderNumber} criado com sucesso!\n\n` +
              `📄 Boleto gerado no valor de R$ ${paymentResult.payment.value.toFixed(2)}\n` +
              `🏦 Acesse o link do boleto para imprimir e pagar\n\n` +
              `⏰ Vencimento em 1 dia útil`)
      } else {
        alert(`Pedido #${orderNumber} realizado com sucesso!\n` +
              `Forma de pagamento: ${paymentMethod}\n\n` +
              `Em breve você receberá um e-mail de confirmação.`)
      }

      router.push('/conta?tab=orders')
    } catch (error) {
      console.error('Erro no checkout:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Adicione algumas cartas incríveis ao seu carrinho!
            </p>
            <Link 
              href="/cartas"
              className="bg-pokemon-blue hover:bg-pokemon-blue-light text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Explorar Cartas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Meu Carrinho
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-card p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-24 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL}${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl">🃏</div>
                        <p className="text-xs text-gray-600">{item.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 capitalize">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remover do carrinho"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-pokemon-blue mb-2">
                          R$ {item.price.toFixed(2)}
                        </p>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Math.min(item.maxStock, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Máx: {item.maxStock} unidades
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-xl font-bold text-gray-800">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Limpar carrinho
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-pokemon-blue">
                      R$ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={isProcessing}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pokemon-blue to-pokemon-purple hover:from-pokemon-purple hover:to-pokemon-blue text-white hover:shadow-glow-purple'
                }`}
              >
                {isProcessing ? 'Processando...' : user ? 'Finalizar Compra' : 'Faça login para comprar'}
              </button>

              <Link 
                href="/cartas"
                className="block text-center mt-4 text-pokemon-blue hover:text-pokemon-blue-light font-medium transition-colors"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Pedido</h2>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm text-gray-800">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>{item.name} ({item.quantity}x)</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total:</span>
                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Forma de Pagamento</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout('PIX')}
                  disabled={isProcessing}
                  className={`w-full p-4 border border-gray-200 rounded-lg text-left hover:border-pokemon-blue transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="font-medium">🏦 PIX</div>
                  <div className="text-sm text-gray-600">Pagamento instantâneo</div>
                </button>
                
                <button
                  onClick={() => handleCheckout('Cartão de Crédito')}
                  disabled={isProcessing}
                  className={`w-full p-4 border border-gray-200 rounded-lg text-left hover:border-pokemon-blue transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="font-medium">💳 Cartão de Crédito</div>
                  <div className="text-sm text-gray-600">Em até 12x sem juros</div>
                </button>
                
                <button
                  onClick={() => handleCheckout('Boleto')}
                  disabled={isProcessing}
                  className={`w-full p-4 border border-gray-200 rounded-lg text-left hover:border-pokemon-blue transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="font-medium">🧾 Boleto Bancário</div>
                  <div className="text-sm text-gray-600">Vencimento em 1 dia útil</div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}