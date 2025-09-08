# Kaiyruu TCG - Loja de Cartas Pokémon

## Descrição

Uma aplicação completa para loja de cartas Pokémon construída com:
- **Backend**: Strapi (Headless CMS)
- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **Banco de Dados**: PostgreSQL
- **Orquestração**: Docker Compose

## Estrutura do Projeto

```
pokeloja/
├── backend/           # Strapi API + Admin Panel
├── frontend/          # Next.js Frontend
├── db/               # Scripts de inicialização do banco
├── docker-compose.yml # Orquestração dos serviços
└── README.md         # Este arquivo
```

## Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (opcional, para desenvolvimento local)

### 1. Clonar/Baixar o projeto
```bash
cd pokeloja
```

### 2. Subir os containers
```bash
docker-compose up --build
```

### 3. Acessar os serviços

#### Frontend (Next.js)
- URL: http://localhost:3000
- Interface da loja para os clientes

#### Backend Admin (Strapi)
- URL: http://localhost:1337/admin
- Painel administrativo para gerenciar cartas

#### Banco de Dados (PostgreSQL)
- Host: localhost:5432
- Database: pokeloja
- Usuário: pokeloja_user
- Senha: pokeloja_password

## Primeiro Acesso

### 1. Configurar Admin do Strapi
1. Acesse http://localhost:1337/admin
2. Crie sua conta de administrador
3. Faça login no painel admin

### 2. Adicionar Cartas Pokémon
1. No painel admin, vá em "Content Manager"
2. Clique em "Pokemon Card"
3. Adicione cartas usando os dados mockados abaixo

## Dados Mockados para Teste

### Carta 1 - Charizard
- Nome: Charizard
- Descrição: Pokémon dragão de fogo lendário
- Preço: 150.00
- Raridade: Ultra Rara
- Tipo: Fogo
- HP: 180
- Set: Base Set
- Número da Carta: 4/102
- Em Estoque: Sim
- Quantidade: 3
- Categoria: Pokémon Estágio 2
- Condição: Near Mint

### Carta 2 - Pikachu
- Nome: Pikachu
- Descrição: O mascote da franquia Pokémon
- Preço: 25.50
- Raridade: Comum
- Tipo: Elétrico
- HP: 60
- Set: Base Set
- Número da Carta: 25/102
- Em Estoque: Sim
- Quantidade: 15
- Categoria: Pokémon Básico
- Condição: Near Mint

### Carta 3 - Blastoise
- Nome: Blastoise
- Descrição: Pokémon tartaruga d'água poderoso
- Preço: 95.00
- Raridade: Holo Rara
- Tipo: Água
- HP: 150
- Set: Base Set
- Número da Carta: 2/102
- Em Estoque: Sim
- Quantidade: 5
- Categoria: Pokémon Estágio 2
- Condição: Near Mint

### Carta 4 - Venusaur
- Nome: Venusaur
- Descrição: Pokémon planta final da linha evolutiva do Bulbasaur
- Preço: 85.00
- Raridade: Holo Rara
- Tipo: Grama
- HP: 140
- Set: Base Set
- Número da Carta: 15/102
- Em Estoque: Sim
- Quantidade: 7
- Categoria: Pokémon Estágio 2
- Condição: Near Mint

### Carta 5 - Mew
- Nome: Mew
- Descrição: Pokémon psíquico mítico extremamente raro
- Preço: 300.00
- Raridade: Secreta
- Tipo: Psíquico
- HP: 100
- Set: Hidden Fates
- Número da Carta: SV1/SV94
- Em Estoque: Sim
- Quantidade: 1
- Categoria: Pokémon Básico
- Condição: Mint

## Comandos Úteis

### Parar os containers
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f [serviço]
# Exemplos:
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild específico
```bash
docker-compose build [serviço]
docker-compose up -d [serviço]
```

### Limpar volumes (CUIDADO: apaga dados do banco)
```bash
docker-compose down -v
```

## API Endpoints

### Cartas Pokémon
- `GET /api/pokemon-cards` - Listar todas as cartas
- `GET /api/pokemon-cards/:id` - Buscar carta por ID
- `GET /api/pokemon-cards?populate=*` - Listar com imagens

### Filtros de exemplo
- `GET /api/pokemon-cards?filters[raridade][$eq]=Ultra Rara`
- `GET /api/pokemon-cards?filters[tipo][$eq]=Fogo`
- `GET /api/pokemon-cards?filters[em_estoque][$eq]=true`

## Desenvolvimento

### Modo desenvolvimento local (sem Docker)

#### Backend
```bash
cd backend
npm install
npm run develop
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Variáveis de ambiente
Crie arquivos `.env.local` conforme necessário.

## Deploy para Produção

### Preparar para deploy
1. Alterar senhas e secrets no docker-compose.yml
2. Configurar domínio nos arquivos de configuração
3. Adicionar certificado SSL
4. Usar volumes persistentes para uploads

### VPS Deploy
```bash
# Na VPS
git clone seu-repositorio
cd pokeloja
docker-compose up -d --build
```

## Troubleshooting

### Problemas comuns

#### Container não conecta no banco
- Aguarde alguns segundos para o PostgreSQL inicializar
- Verifique se as credenciais estão corretas

#### Frontend não carrega cartas
- Certifique-se de que o Strapi está rodando
- Adicione cartas pelo admin panel primeiro
- Verifique se o Content Type está publicado

#### Erro de permissão no Docker
- No Windows/Mac: certifique-se de que o Docker Desktop está rodando
- No Linux: adicione seu usuário ao grupo docker

## Próximos Passos

1. [ ] Implementar autenticação de usuários
2. [ ] Adicionar carrinho de compras
3. [ ] Integrar gateway de pagamento
4. [ ] Implementar sistema de busca avançada
5. [ ] Adicionar filtros por raridade, tipo, etc.
6. [ ] Criar página de produto individual
7. [ ] Implementar sistema de avaliações
8. [ ] Adicionar área do cliente

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Strapi 4.15, Node.js 18
- **Banco**: PostgreSQL 15
- **Containerização**: Docker, Docker Compose
- **UI**: Tailwind CSS, Heroicons

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

MIT License - veja o arquivo LICENSE para detalhes.
