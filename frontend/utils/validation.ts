// Brazilian validation utilities

export interface ValidationResult {
  isValid: boolean
  message?: string
}

// Full name validation (at least name and surname)
export const validateFullName = (name: string): ValidationResult => {
  const trimmedName = name.trim()
  
  if (!trimmedName) {
    return { isValid: false, message: 'Nome completo é obrigatório' }
  }
  
  const nameParts = trimmedName.split(' ').filter(part => part.length > 0)
  
  if (nameParts.length < 2) {
    return { isValid: false, message: 'Informe nome e sobrenome' }
  }
  
  if (nameParts.some(part => part.length < 2)) {
    return { isValid: false, message: 'Nome e sobrenome devem ter pelo menos 2 caracteres cada' }
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
    return { isValid: false, message: 'Nome deve conter apenas letras' }
  }
  
  return { isValid: true }
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!email) {
    return { isValid: false, message: 'E-mail é obrigatório' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'E-mail deve ter formato válido (exemplo@email.com)' }
  }
  
  return { isValid: true }
}

// Password validation (8+ chars, 1 uppercase, 1 number, 1 special char)
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Senha é obrigatória' }
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Senha deve ter pelo menos uma letra maiúscula' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Senha deve ter pelo menos um número' }
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Senha deve ter pelo menos um caractere especial (!@#$%^&*...)' }
  }
  
  return { isValid: true }
}

// Phone validation (DDD + 9 digits = 11 total)
export const validatePhone = (phone: string): ValidationResult => {
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (!cleanPhone) {
    return { isValid: false, message: 'Telefone é obrigatório' }
  }
  
  if (cleanPhone.length !== 11) {
    return { isValid: false, message: 'Telefone deve ter 11 dígitos (DDD + 9 números)' }
  }
  
  const ddd = parseInt(cleanPhone.substring(0, 2))
  if (ddd < 11 || ddd > 99) {
    return { isValid: false, message: 'DDD inválido (deve ser entre 11 e 99)' }
  }
  
  if (cleanPhone[2] !== '9') {
    return { isValid: false, message: 'Número deve começar com 9 após o DDD' }
  }
  
  return { isValid: true }
}

// CPF validation with digit verification
export const validateCPF = (cpf: string): ValidationResult => {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (!cleanCPF) {
    return { isValid: false, message: 'CPF é obrigatório' }
  }
  
  if (cleanCPF.length !== 11) {
    return { isValid: false, message: 'CPF deve ter 11 dígitos' }
  }
  
  // Check for known invalid patterns
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { isValid: false, message: 'CPF inválido' }
  }
  
  // Calculate first verification digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0
  
  // Calculate second verification digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0
  
  // Verify digits
  if (parseInt(cleanCPF.charAt(9)) !== digit1 || parseInt(cleanCPF.charAt(10)) !== digit2) {
    return { isValid: false, message: 'CPF inválido' }
  }
  
  return { isValid: true }
}

// CEP validation and format
export const validateCEP = (cep: string): ValidationResult => {
  const cleanCEP = cep.replace(/\D/g, '')
  
  if (!cleanCEP) {
    return { isValid: false, message: 'CEP é obrigatório' }
  }
  
  if (cleanCEP.length !== 8) {
    return { isValid: false, message: 'CEP deve ter 8 dígitos' }
  }
  
  return { isValid: true }
}

// Format functions for display
export const formatCPF = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, '')
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '')
  return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const formatCEP = (cep: string): string => {
  const clean = cep.replace(/\D/g, '')
  return clean.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// CEP API call to get address
export const fetchAddressByCEP = async (cep: string): Promise<{
  logradouro: string
  bairro: string
  localidade: string
  uf: string
} | null> => {
  try {
    const cleanCEP = cep.replace(/\D/g, '')
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      throw new Error('CEP não encontrado')
    }
    
    return data
  } catch (error) {
    console.error('Error fetching address:', error)
    return null
  }
}