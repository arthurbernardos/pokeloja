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
      const { forma_pagamento, itens } = data;
      // Note: We ignore numero_pedido, valor_total, etc. from frontend for security

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
          numero_pedido: `ORD${Date.now()}`,
          data_pedido: new Date(),
          customer: customer.id,
          itens: validatedItems,
          valor_total: calculatedTotal,
          valor_frete: 0,
          status: 'Pendente',
          forma_pagamento: forma_pagamento || 'PIX',
          endereco_entrega: '',
          observacoes: ''
        }
      });

      // 5. UPDATE POKEMON CARD STOCK
      for (const item of validatedItems) {
        const currentCard = await strapi.db.query('api::pokemon-card.pokemon-card').findOne({
          where: { id: item.card_id }
        });

        const newStock = currentCard.quantidade_estoque - item.quantity;

        await strapi.db.query('api::pokemon-card.pokemon-card').update({
          where: { id: item.card_id },
          data: {
            quantidade_estoque: newStock,
            em_estoque: newStock > 0
          }
        });
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

  // Override find to only show user's own orders if authenticated
  async find(ctx) {
    if (ctx.state.user) {
      // Find customer record for this user
      const customer = await strapi.db.query('api::customer.customer').findOne({
        where: { email: ctx.state.user.email },
      });
      
      if (customer) {
        // Filter orders by customer
        ctx.query.filters = {
          ...ctx.query.filters,
          customer: customer.id
        };
      } else {
        // No customer record = no orders
        return { data: [], meta: { pagination: { total: 0 } } };
      }
    } else {
      // Not authenticated = no access
      return ctx.unauthorized('Login necessário');
    }

    return super.find(ctx);
  },

  // Override findOne to check ownership
  async findOne(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Login necessário');
    }

    const { id } = ctx.params;
    const order = await strapi.entityService.findOne('api::order.order', id, {
      populate: ['customer']
    });

    if (!order) {
      return ctx.notFound('Pedido não encontrado');
    }

    // Check if order belongs to user
    if (order.customer?.email !== ctx.state.user.email) {
      return ctx.forbidden('Acesso negado');
    }

    return { data: order };
  }
}));