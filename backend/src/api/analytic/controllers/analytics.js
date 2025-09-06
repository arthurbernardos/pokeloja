'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::analytic.analytic', ({ strapi }) => ({
  async getPopularCategories(ctx) {
    try {
      // Get category click analytics from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const analytics = await strapi.db.query('api::analytic.analytic').findMany({
        where: {
          event_type: 'category_click',
          timestamp: {
            $gte: thirtyDaysAgo.toISOString()
          }
        }
      });

      // Count clicks per category
      const categoryCount = {};
      analytics.forEach(event => {
        const category = event.event_data?.category;
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });

      // Sort by popularity and return top 6
      const popularCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([category, count]) => ({ category, count }));

      // Fallback to default categories if no analytics data
      if (popularCategories.length === 0) {
        const defaultCategories = [
          'Pokémon Básico', 'Pokémon-EX', 'Pokémon-GX', 
          'Pokémon-V', 'Pokémon-VMAX', 'Treinador'
        ];
        return { data: defaultCategories.map(cat => ({ category: cat, count: 0 })) };
      }

      return { data: popularCategories };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async track(ctx) {
    try {
      const { event_type, event_data, user_id, session_id } = ctx.request.body;
      
      const analyticsData = {
        event_type,
        event_data,
        user_id,
        session_id,
        ip_address: ctx.request.ip,
        user_agent: ctx.request.get('User-Agent'),
        timestamp: new Date().toISOString()
      };

      const result = await strapi.db.query('api::analytic.analytic').create({
        data: analyticsData
      });

      return { success: true, id: result.id };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));