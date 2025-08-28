#!/usr/bin/env node

const API_URL = 'http://localhost:1337/api/pokemon-cards';

// Card data - includes README examples + additional variety
const cards = [
  // README Examples
  {
    nome: 'Charizard',
    descricao: 'Pokémon dragão de fogo lendário',
    preco: 150.00,
    raridade: 'Ultra Rara',
    tipo: 'Fogo',
    hp: 180,
    set_nome: 'Base Set',
    numero_carta: '4/102',
    em_estoque: true,
    quantidade_estoque: 3,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Near Mint'
  },
  {
    nome: 'Blastoise',
    descricao: 'Pokémon tartaruga d\'água poderoso',
    preco: 95.00,
    raridade: 'Holo Rara',
    tipo: 'Água',
    hp: 150,
    set_nome: 'Base Set',
    numero_carta: '2/102',
    em_estoque: true,
    quantidade_estoque: 5,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Near Mint'
  },
  {
    nome: 'Venusaur',
    descricao: 'Pokémon planta final da linha evolutiva do Bulbasaur',
    preco: 85.00,
    raridade: 'Holo Rara',
    tipo: 'Grama',
    hp: 140,
    set_nome: 'Base Set',
    numero_carta: '15/102',
    em_estoque: true,
    quantidade_estoque: 7,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Near Mint'
  },
  {
    nome: 'Mew',
    descricao: 'Pokémon psíquico mítico extremamente raro',
    preco: 300.00,
    raridade: 'Secreta',
    tipo: 'Psíquico',
    hp: 100,
    set_nome: 'Hidden Fates',
    numero_carta: 'SV1/SV94',
    em_estoque: true,
    quantidade_estoque: 1,
    categoria: 'Pokémon Básico',
    condicao: 'Mint'
  },
  
  // Additional variety cards
  {
    nome: 'Mewtwo-EX',
    descricao: 'Pokémon psíquico artificialmente criado com poder imenso',
    preco: 180.00,
    raridade: 'Ultra Rara',
    tipo: 'Psíquico',
    hp: 170,
    set_nome: 'BREAKthrough',
    numero_carta: '61/162',
    em_estoque: true,
    quantidade_estoque: 2,
    categoria: 'Pokémon-EX',
    condicao: 'Near Mint'
  },
  {
    nome: 'Rayquaza-GX',
    descricao: 'Pokémon dragão lendário dos céus',
    preco: 220.00,
    raridade: 'Secreta',
    tipo: 'Dragão',
    hp: 180,
    set_nome: 'Celestial Storm',
    numero_carta: '177/168',
    em_estoque: true,
    quantidade_estoque: 1,
    categoria: 'Pokémon-GX',
    condicao: 'Mint'
  },
  {
    nome: 'Lucario-V',
    descricao: 'Pokémon lutador com habilidades de aura especiais',
    preco: 45.00,
    raridade: 'Rara',
    tipo: 'Lutador',
    hp: 210,
    set_nome: 'Astral Radiance',
    numero_carta: '78/189',
    em_estoque: true,
    quantidade_estoque: 8,
    categoria: 'Pokémon-V',
    condicao: 'Near Mint'
  },
  {
    nome: 'Charizard-VMAX',
    descricao: 'A forma maximizada do poderoso Charizard',
    preco: 350.00,
    raridade: 'Secreta',
    tipo: 'Fogo',
    hp: 330,
    set_nome: 'Champion\'s Path',
    numero_carta: '74/73',
    em_estoque: false,
    quantidade_estoque: 0,
    categoria: 'Pokémon-VMAX',
    condicao: 'Near Mint'
  },
  {
    nome: 'Eevee',
    descricao: 'Pokémon evolutivo com múltiplas possibilidades',
    preco: 12.00,
    raridade: 'Comum',
    tipo: 'Incolor',
    hp: 50,
    set_nome: 'Evolving Skies',
    numero_carta: '125/203',
    em_estoque: true,
    quantidade_estoque: 25,
    categoria: 'Pokémon Básico',
    condicao: 'Near Mint'
  },
  {
    nome: 'Garchomp',
    descricao: 'Pokémon dragão terrestre extremamente rápido',
    preco: 35.00,
    raridade: 'Rara',
    tipo: 'Dragão',
    hp: 150,
    set_nome: 'Ultra Prism',
    numero_carta: '99/156',
    em_estoque: true,
    quantidade_estoque: 6,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Lightly Played'
  },
  {
    nome: 'Alakazam',
    descricao: 'Pokémon psíquico com QI excepcional',
    preco: 28.00,
    raridade: 'Incomum',
    tipo: 'Psíquico',
    hp: 80,
    set_nome: 'Base Set',
    numero_carta: '1/102',
    em_estoque: true,
    quantidade_estoque: 12,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Near Mint'
  },
  {
    nome: 'Gengar',
    descricao: 'Pokémon fantasma que se esconde nas sombras',
    preco: 42.00,
    raridade: 'Holo Rara',
    tipo: 'Sombrio',
    hp: 110,
    set_nome: 'Fossil',
    numero_carta: '5/62',
    em_estoque: true,
    quantidade_estoque: 4,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Near Mint'
  },
  {
    nome: 'Scizor',
    descricao: 'Pokémon inseto metálico com garras afiadas',
    preco: 32.00,
    raridade: 'Rara',
    tipo: 'Metal',
    hp: 120,
    set_nome: 'Neo Discovery',
    numero_carta: '10/75',
    em_estoque: true,
    quantidade_estoque: 9,
    categoria: 'Pokémon Estágio 1',
    condicao: 'Near Mint'
  },
  {
    nome: 'Sylveon',
    descricao: 'Pokémon fada com fitas sensoriais',
    preco: 38.00,
    raridade: 'Rara',
    tipo: 'Fada',
    hp: 95,
    set_nome: 'XY',
    numero_carta: '92/146',
    em_estoque: true,
    quantidade_estoque: 7,
    categoria: 'Pokémon Estágio 1',
    condicao: 'Near Mint'
  },
  {
    nome: 'Professor Oak',
    descricao: 'Descarte sua mão e compre 7 cartas',
    preco: 15.00,
    raridade: 'Incomum',
    tipo: 'Incolor',
    hp: null,
    set_nome: 'Base Set',
    numero_carta: '88/102',
    em_estoque: true,
    quantidade_estoque: 20,
    categoria: 'Treinador',
    condicao: 'Near Mint'
  },
  {
    nome: 'Pokeball',
    descricao: 'Procure por um Pokémon em seu deck',
    preco: 8.00,
    raridade: 'Comum',
    tipo: 'Incolor',
    hp: null,
    set_nome: 'Base Set',
    numero_carta: '85/102',
    em_estoque: true,
    quantidade_estoque: 30,
    categoria: 'Treinador',
    condicao: 'Near Mint'
  },
  {
    nome: 'Energia Fogo Básica',
    descricao: 'Energia básica do tipo Fogo',
    preco: 2.00,
    raridade: 'Comum',
    tipo: 'Fogo',
    hp: null,
    set_nome: 'Base Set',
    numero_carta: '98/102',
    em_estoque: true,
    quantidade_estoque: 50,
    categoria: 'Energia',
    condicao: 'Near Mint'
  },
  {
    nome: 'Gyarados',
    descricao: 'Pokémon serpente aquática feroz e imponente',
    preco: 48.00,
    raridade: 'Holo Rara',
    tipo: 'Água',
    hp: 130,
    set_nome: 'Base Set',
    numero_carta: '6/102',
    em_estoque: false,
    quantidade_estoque: 0,
    categoria: 'Pokémon Estágio 1',
    condicao: 'Moderately Played'
  },
  {
    nome: 'Dragonite',
    descricao: 'Pokémon dragão gentil que pode voar ao redor do mundo',
    preco: 65.00,
    raridade: 'Holo Rara',
    tipo: 'Dragão',
    hp: 170,
    set_nome: 'Fossil',
    numero_carta: '19/62',
    em_estoque: true,
    quantidade_estoque: 3,
    categoria: 'Pokémon Estágio 2',
    condicao: 'Near Mint'
  },
  {
    nome: 'Snorlax',
    descricao: 'Pokémon normal conhecido por dormir e comer muito',
    preco: 22.00,
    raridade: 'Incomum',
    tipo: 'Incolor',
    hp: 120,
    set_nome: 'Jungle',
    numero_carta: '27/64',
    em_estoque: true,
    quantidade_estoque: 15,
    categoria: 'Pokémon Básico',
    condicao: 'Near Mint'
  }
];

async function createCard(cardData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: cardData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Created: ${cardData.nome} (ID: ${result.data.id})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create ${cardData.nome}:`, error.message);
    return null;
  }
}

async function publishCard(cardId) {
  try {
    const response = await fetch(`${API_URL}/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          publishedAt: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`📢 Published card ID: ${cardId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish card ${cardId}:`, error.message);
    return false;
  }
}

async function populateCards() {
  console.log('🚀 Starting to populate Pokemon cards...');
  console.log(`📊 Total cards to create: ${cards.length}`);
  console.log('');

  let successCount = 0;
  let failureCount = 0;

  for (const cardData of cards) {
    const result = await createCard(cardData);
    
    if (result) {
      // Publish the card immediately
      await publishCard(result.data.id);
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('');
  console.log('🎉 Population complete!');
  console.log(`✅ Successfully created: ${successCount} cards`);
  console.log(`❌ Failed: ${failureCount} cards`);
  
  if (successCount > 0) {
    console.log('');
    console.log('🃏 Your store now has cards with:');
    console.log('   • All rarities: Comum, Incomum, Rara, Holo Rara, Ultra Rara, Secreta');
    console.log('   • All types: Fogo, Água, Grama, Elétrico, Psíquico, Lutador, Sombrio, Metal, Fada, Dragão, Incolor');
    console.log('   • All categories: Básico, Estágio 1, Estágio 2, EX, GX, V, VMAX, Treinador, Energia');
    console.log('   • Mixed stock status (some in stock, some out of stock)');
    console.log('   • Various conditions and price ranges');
    console.log('');
    console.log('🌐 Visit http://localhost:3000 to see your populated store!');
  }
}

// Add error handling for fetch
global.fetch = require('node-fetch');

populateCards().catch(console.error);
