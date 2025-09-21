'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Check if user is authenticated
      if (!ctx.state.user) {
        return ctx.unauthorized('Você precisa estar logado para fazer pedidos');
      }
      
      const data = ctx.request.body.data || ctx.request.body;
      const { numero_pedido, data_pedido, status, valor_total, valor_frete, forma_pagamento, itens } = data;

      if (!itens || itens.length === 0) {
        return ctx.badRequest('Carrinho vazio');
      }

      // 2. VALIDATE AND RECALCULATE PRICES FROM DATABASE - NEVER TRUST FRONTEND
      let calculatedTotal = 0;
      const validatedItems = [];

      for (const item of itens) {
        // Get pokemon card from database to get REAL price
        const card = await strapi.db.query('api::pokemon-card.pokemon-card').findOne({
          where: { id: item.id },
        });

        if (!card) {
          return ctx.badRequest(`Carta ${item.id} não encontrada`);
        }

        // Check stock
        if (!card.em_estoque || card.quantidade_estoque < item.quantity) {
          return ctx.badRequest(`Carta ${card.nome} tem apenas ${card.quantidade_estoque} unidades em estoque`);
        }

        // Calculate using DATABASE price, not frontend price!
        const itemTotal = parseFloat(card.preco) * item.quantity;
        calculatedTotal += itemTotal;

        validatedItems.push({
          card_id: card.id,
          card_name: card.nome,
          quantity: item.quantity,
          unit_price: parseFloat(card.preco), // Price from DATABASE
          total_price: itemTotal
        });
      }

      // 3. FIND OR CREATE CUSTOMER RECORD
      let customer = await strapi.db.query('api::customer.customer').findOne({
        where: { email: ctx.state.user.email },
      });

      if (!customer) {
        // Create customer record from user data
        customer = await strapi.entityService.create('api::customer.customer', {
          data: {
            nome: ctx.state.user.nome || ctx.state.user.email,
            email: ctx.state.user.email,
            telefone: ctx.state.user.telefone || '',
            // Leave other fields empty for now - user can fill them later
          }
        });
        console.log(`Created customer record for user: ${ctx.state.user.email}`);
      }

      // 4. CREATE ORDER WITH SERVER-CALCULATED TOTAL
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          numero_pedido: numero_pedido || `ORD${Date.now()}`,
          data_pedido: new Date(),
          customer: customer.id, // Link to customer record
          itens: validatedItems, // Store validated items with real prices
          valor_total: calculatedTotal, // SERVER calculated total, not frontend!
          valor_frete: 0, // Free shipping for now
          status: 'Pendente',
          forma_pagamento: forma_pagamento || 'PIX',
          endereco_entrega: '', // TODO: Add address later
          observacoes: ''
        }
      });

      // 5. UPDATE POKEMON CARD STOCK
      for (const item of validatedItems) {
        await strapi.db.query('api::pokemon-card.pokemon-card').update({
          where: { id: item.card_id },
          data: {
            quantidade_estoque: {
              $raw: `quantidade_estoque - ${item.quantity}`
            }
          }
        });
        
        // Update em_estoque flag
        const updatedCard = await strapi.db.query('api::pokemon-card.pokemon-card').findOne({
          where: { id: item.card_id }
        });
        
        if (updatedCard.quantidade_estoque <= 0) {
          await strapi.db.query('api::pokemon-card.pokemon-card').update({
            where: { id: item.card_id },
            data: { em_estoque: false }
          });
        }
      }

      console.log(`Novo pedido criado: ${order.numero_pedido} - Total: R$ ${calculatedTotal}`);

      return {
        data: {
          id: order.id,
          numero_pedido: order.numero_pedido,
          valor_total: order.valor_total,
          status: order.status
        }
      };
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return ctx.internalServerError('Erro ao processar pedido');
    }
  },

  // For now, let the default find and findOne work without authentication
  // You can add authentication later when you implement user login
}));