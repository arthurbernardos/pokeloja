FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]
