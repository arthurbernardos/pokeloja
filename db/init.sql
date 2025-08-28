-- Script de inicialização do banco PostgreSQL
-- Este arquivo será executado quando o container do banco for criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- O Strapi vai criar suas próprias tabelas automaticamente
-- Este arquivo serve para configurações iniciais se necessário

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Logs
\echo 'Banco de dados inicializado para PokeLS loja!';
