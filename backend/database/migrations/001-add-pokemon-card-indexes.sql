-- Migration: Add indexes for better query performance on pokemon_cards table
-- This migration adds indexes on commonly filtered and sorted columns

-- Index on raridade for rarity filtering
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_raridade ON pokemon_cards(raridade);

-- Index on tipo for type filtering  
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_tipo ON pokemon_cards(tipo);

-- Index on categoria for category filtering
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_categoria ON pokemon_cards(categoria);

-- Index on em_estoque for stock filtering
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_em_estoque ON pokemon_cards(em_estoque);

-- Index on preco for price sorting
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_preco ON pokemon_cards(preco);

-- Index on published_at for published content filtering
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_published_at ON pokemon_cards(published_at);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_filters ON pokemon_cards(em_estoque, raridade, tipo);

-- Index on nome for text search
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_nome ON pokemon_cards(nome);

-- Index on set_nome for set filtering
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_set_nome ON pokemon_cards(set_nome);
