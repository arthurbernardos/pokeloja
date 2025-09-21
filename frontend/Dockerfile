FROM node:18-alpine AS builder

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

# Set build time environment variables
ENV NEXT_PUBLIC_STRAPI_API_URL=/api
ENV NEXT_PUBLIC_STRAPI_UPLOADS_URL=""

# Build Next.js para produção
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expor porta
EXPOSE 3000

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Comando para produção standalone
CMD ["node", "server.js"]
