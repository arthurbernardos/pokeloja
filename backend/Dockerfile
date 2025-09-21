FROM node:18-alpine

# Definir variáveis de ambiente para evitar prompts interativos
ENV NPM_CONFIG_YES=true
ENV CI=true

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instalar dependências
RUN npm install --no-optional

# Copiar código fonte
COPY . .

# Build admin panel with correct URL
ENV STRAPI_ADMIN_BACKEND_URL=https://api.kairyuutcg.com.br
RUN npm run build

# Expor porta
EXPOSE 1337

# Comando para produção
CMD ["npm", "run", "start"]
