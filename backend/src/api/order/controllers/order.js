'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      // 1. REQUIRE AUTHENTICATION
      if (!ctx.state.user) {
        return ctx.unauthorized('Você precisa estar logado para fazer pedidos');
      }

      const { items, shipping_address } = ctx.request.body.data;

      if (!items || items.length === 0) {
        return ctx.badRequest('Carrinho vazio');
      }

      // 2. VALIDATE AND RECALCULATE PRICES FROM DATABASE
      let calculatedTotal = 0;
      const validatedItems = [];

      for (const item of items) {
        // Get product from database
        const product = await strapi.db.query('api::product.product').findOne({
          where: { id: item.product_id },
        });

        if (!product) {
          return ctx.badRequest(`Produto ${item.product_id} não encontrado`);
        }

        // Check stock
        if (product.estoque < item.quantity) {
          return ctx.badRequest(`Produto ${product.nome} tem apenas ${product.estoque} unidades em estoque`);
        }

        // Use price from DATABASE, not from frontend
        const itemTotal = product.preco * item.quantity;
        calculatedTotal += itemTotal;

        validatedItems.push({
          product: product.id,
          quantity: item.quantity,
          unit_price: product.preco, // Price from database
          total_price: itemTotal
        });
      }

      // 3. CREATE ORDER WITH SERVER-CALCULATED TOTAL
      const orderNumber = `KRY${Date.now()}`;
      
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          numero_pedido: orderNumber,
          customer: ctx.state.user.id,
          items: validatedItems,
          valor_total: calculatedTotal, // Server calculated total
          status: 'Pendente',
          shipping_address: shipping_address,
          payment_status: 'Aguardando',
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // 4. UPDATE PRODUCT STOCK
      for (const item of validatedItems) {
        const product = await strapi.db.query('api::product.product').findOne({
          where: { id: item.product }
        });

        await strapi.db.query('api::product.product').update({
          where: { id: item.product },
          data: {
            estoque: product.estoque - item.quantity
          }
        });
      }

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

  // Override find to only show user's own orders
  async find(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Login necessário');
    }

    // Add user filter to query
    ctx.query.filters = {
      ...ctx.query.filters,
      customer: ctx.state.user.id
    };

    // Call the default find
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  // Override findOne to check ownership
  async findOne(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Login necessário');
    }

    const { id } = ctx.params;
    
    const order = await strapi.entityService.findOne('api::order.order', id, {
      populate: ['customer', 'items', 'items.product']
    });

    if (!order) {
      return ctx.notFound('Pedido não encontrado');
    }

    // Check if order belongs to user
    if (order.customer.id !== ctx.state.user.id) {
      return ctx.forbidden('Acesso negado');
    }

    return { data: order };
  },

  // Prevent updates from API
  async update(ctx) {
    return ctx.forbidden('Pedidos não podem ser alterados pela API');
  },

  // Prevent deletion from API  
  async delete(ctx) {
    return ctx.forbidden('Pedidos não podem ser excluídos pela API');
  }
}));