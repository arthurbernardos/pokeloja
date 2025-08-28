CREATE TABLE IF NOT EXISTS pokemon_cards (
id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
descricao TEXT,
preco DECIMAL NOT NULL,
raridade VARCHAR(255),
tipo VARCHAR(255),
hp INTEGER,
set_nome VARCHAR(100),
numero_carta VARCHAR(20),
em_estoque BOOLEAN DEFAULT TRUE,
quantidade_estoque INTEGER DEFAULT 1,
categoria VARCHAR(255),
condicao VARCHAR(255),
slug VARCHAR(255) UNIQUE,
created_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ,
published_at TIMESTAMPTZ,
created_by_id INTEGER,
updated_by_id INTEGER
); 
 -- Grant permissions to the app user
GRANT ALL PRIVILEGES ON TABLE pokemon_cards TO pokeloja_user;
GRANT USAGE, SELECT ON SEQUENCE pokemon_cards_id_seq TO pokeloja_user; 
-- Add all the indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_raridade ON pokemon_cards(raridade);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_tipo ON pokemon_cards(tipo);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_categoria ON pokemon_cards(categoria);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_em_estoque ON pokemon_cards(em_estoque);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_preco ON pokemon_cards(preco);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_published_at ON pokemon_cards(published_at);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_filters ON pokemon_cards(em_estoque, raridade, tipo);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_nome ON pokemon_cards(nome);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_set_nome ON pokemon_cards(set_nome);