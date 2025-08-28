'use strict';

/**
 * pokemon-card controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pokemon-card.pokemon-card', ({ strapi }) => ({
  // Override default find method with advanced filtering
  async find(ctx) {
    // Call default find first
    const { data, meta } = await super.find(ctx);
    
    // Add any additional processing here if needed
    return { data, meta };
  },

  // Custom endpoint for statistics
  async stats(ctx) {
    try {
      const entity = strapi.entityService;
      
      // Get total count
      const total = await entity.count('api::pokemon-card.pokemon-card', {
        filters: { publishedAt: { $notNull: true } }
      });
      
      // Get count by rarity
      const rarityStats = {};
      const rarities = ['Comum', 'Incomum', 'Rara', 'Holo Rara', 'Ultra Rara', 'Secreta'];
      for (const rarity of rarities) {
        rarityStats[rarity] = await entity.count('api::pokemon-card.pokemon-card', {
          filters: { 
            raridade: rarity,
            publishedAt: { $notNull: true }
          }
        });
      }
      
      // Get count by category
      const categoryStats = {};
      const categories = ['Pokémon Básico', 'Pokémon Estágio 1', 'Pokémon Estágio 2', 'Pokémon-EX', 'Pokémon-GX', 'Pokémon-V', 'Pokémon-VMAX', 'Treinador', 'Energia'];
      for (const category of categories) {
        categoryStats[category] = await entity.count('api::pokemon-card.pokemon-card', {
          filters: { 
            categoria: category,
            publishedAt: { $notNull: true }
          }
        });
      }
      
      // Get count by type
      const typeStats = {};
      const types = ['Fogo', 'Água', 'Grama', 'Elétrico', 'Psíquico', 'Lutador', 'Sombrio', 'Metal', 'Fada', 'Dragão', 'Incolor'];
      for (const type of types) {
        typeStats[type] = await entity.count('api::pokemon-card.pokemon-card', {
          filters: { 
            tipo: type,
            publishedAt: { $notNull: true }
          }
        });
      }
      
      // Get in stock count
      const inStock = await entity.count('api::pokemon-card.pokemon-card', {
        filters: { 
          em_estoque: true,
          publishedAt: { $notNull: true }
        }
      });
      
      return {
        data: {
          total,
          inStock,
          outOfStock: total - inStock,
          rarityStats,
          categoryStats,
          typeStats
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Custom search endpoint
  async search(ctx) {
    try {
      const { query } = ctx.request.query;
      
      if (!query) {
        return { data: [], meta: { pagination: { total: 0 } } };
      }
      
      const entities = await strapi.entityService.findMany('api::pokemon-card.pokemon-card', {
        filters: {
          $or: [
            { nome: { $containsi: query } },
            { descricao: { $containsi: query } },
            { set_nome: { $containsi: query } },
            { numero_carta: { $containsi: query } }
          ],
          publishedAt: { $notNull: true }
        },
        populate: {
          imagem: true
        },
        sort: [{ nome: 'asc' }]
      });
      
      // Transform entities to match API format
      const data = entities.map(entity => ({
        id: entity.id,
        attributes: {
          ...entity,
          id: undefined
        }
      }));
      
      return {
        data,
        meta: {
          pagination: {
            total: data.length
          }
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Custom endpoint for featured/popular cards
  async featured(ctx) {
    try {
      const entities = await strapi.entityService.findMany('api::pokemon-card.pokemon-card', {
        filters: {
          $or: [
            { raridade: 'Ultra Rara' },
            { raridade: 'Secreta' },
            { raridade: 'Holo Rara' }
          ],
          em_estoque: true,
          publishedAt: { $notNull: true }
        },
        populate: {
          imagem: true
        },
        sort: [{ preco: 'desc' }],
        limit: 8
      });
      
      // Transform entities to match API format
      const data = entities.map(entity => ({
        id: entity.id,
        attributes: {
          ...entity,
          id: undefined
        }
      }));
      
      return {
        data,
        meta: {
          pagination: {
            total: data.length
          }
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));
