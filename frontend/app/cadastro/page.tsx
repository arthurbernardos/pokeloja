'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useNotification } from '@/contexts/NotificationContext'
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePhone,
  validateCPF,
  validateCEP,
  formatCPF,
  formatPhone,
  formatCEP,
  fetchAddressByCEP
} from '@/utils/validation'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { showNotification } = useNotification()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    cpf: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      const step1Errors = validateStep1()
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors)
        return
      }
      setErrors({})
      setStep(2)
    } else {
      const step2Errors = validateStep2()
      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors)
        return
      }
      
      // Submit registration
      setErrors({})
      setLoading(true)

      try {
        await register(formData)
        showNotification('Conta criada com sucesso!', 'success')
        router.push('/')
      } catch (err: any) {
        showNotification(err.message || 'Erro ao criar conta', 'error')
      } finally {
        setLoading(false)
      }
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    const nameValidation = validateFullName(formData.nome)
    if (!nameValidation.isValid) {
      newErrors.nome = nameValidation.message!
    }
    
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message!
    }
    
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message!
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }
    
    const phoneValidation = validatePhone(formData.telefone)
    if (!phoneValidation.isValid) {
      newErrors.telefone = phoneValidation.message!
    }
    
    return newErrors
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    const cpfValidation = validateCPF(formData.cpf)
    if (!cpfValidation.isValid) {
      newErrors.cpf = cpfValidation.message!
    }
    
    const cepValidation = validateCEP(formData.cep)
    if (!cepValidation.isValid) {
      newErrors.cep = cepValidation.message!
    }
    
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório'
    }
    
    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória'
    }
    
    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório'
    }
    
    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    let formattedValue = value
    
    // Auto-format fields
    if (name === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value)
    } else if (name === 'cep') {
      formattedValue = formatCEP(value)
      // Auto-fill address when CEP is complete
      if (value.replace(/\D/g, '').length === 8) {
        handleCEPLookup(value)
      }
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    })
  }

  const handleCEPLookup = async (cep: string) => {
    setCepLoading(true)
    try {
      const address = await fetchAddressByCEP(cep)
      if (address) {
        setFormData(prev => ({
          ...prev,
          endereco: address.logradouro,
          cidade: address.localidade,
          estado: address.uf
        }))
        showNotification('Endereço preenchido automaticamente!', 'success', 2000)
      } else {
        showNotification('CEP não encontrado', 'warning', 3000)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    } finally {
      setCepLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Criar nova conta
            </h1>
            <p className="text-gray-600">
              Junte-se à maior comunidade de TCG do Brasil
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-pokemon-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-24 h-1 ${step >= 2 ? 'bg-pokemon-blue' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-pokemon-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium mb-2">Por favor, corrija os seguintes erros:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Básicas</h2>
                
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                      errors.nome ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nome Sobrenome"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="exemplo@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600">A senha deve conter:</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                          {formData.password.length >= 8 ? '✅' : '⭕'} 8+ caracteres
                        </div>
                        <div className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[A-Z]/.test(formData.password) ? '✅' : '⭕'} 1 maiúscula
                        </div>
                        <div className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[0-9]/.test(formData.password) ? '✅' : '⭕'} 1 número
                        </div>
                        <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✅' : '⭕'} 1 especial
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                      errors.telefone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(11) 98765-4321"
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Adicionais</h2>
                
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    required
                    maxLength={14}
                    value={formData.cpf}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                      errors.cpf ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="123.456.789-00"
                  />
                  {errors.cpf && (
                    <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                    {cepLoading && <span className="text-sm text-blue-600 ml-2">🔍 Buscando...</span>}
                  </label>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    required
                    maxLength={9}
                    value={formData.cep}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                      errors.cep ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="12345-678"
                  />
                  {errors.cep && (
                    <p className="mt-1 text-sm text-red-600">{errors.cep}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Endereço será preenchido automaticamente</p>
                </div>

                <div>
                  <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço *
                  </label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    required
                    value={formData.endereco}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                      errors.endereco ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Rua, número, complemento"
                  />
                  {errors.endereco && (
                    <p className="mt-1 text-sm text-red-600">{errors.endereco}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                        errors.cidade ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.cidade && (
                      <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      required
                      value={formData.estado}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-pokemon-blue ${
                        errors.estado ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                    {errors.estado && (
                      <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-full font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokemon-blue transition-all duration-300"
                >
                  Voltar
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 border border-transparent rounded-full font-bold text-white bg-gradient-to-r from-pokemon-blue to-pokemon-purple hover:from-pokemon-purple hover:to-pokemon-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokemon-blue transition-all duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {loading ? 'Criando conta...' : step === 1 ? 'Próximo' : 'Criar Conta'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-pokemon-blue hover:text-pokemon-blue-light">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}