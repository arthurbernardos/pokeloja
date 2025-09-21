FROM node:18-alpine

# Install sharp for image optimization
RUN apk add --no-cache libc6-compat

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instalar dependências incluindo sharp
RUN npm install
RUN npm install sharp

# Copiar código fonte
COPY . .

# Build Next.js para produção
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para produção standalone
CMD ["node", ".next/standalone/server.js"]
