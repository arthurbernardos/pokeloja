'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 Starting bootstrap process...');
    
    try {
      // Get public role
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });
      
      if (!publicRole) {
        console.error('❌ Public role not found!');
        return;
      }
      
      console.log('✅ Found public role:', publicRole.id);
      
      // Define all required permissions
      const requiredPermissions = [
        // Pokemon card public permissions
        { action: 'api::pokemon-card.pokemon-card.find', public: true },
        { action: 'api::pokemon-card.pokemon-card.findOne', public: true },
        { action: 'api::pokemon-card.pokemon-card.stats', public: true },
        { action: 'api::pokemon-card.pokemon-card.search', public: true },
        { action: 'api::pokemon-card.pokemon-card.featured', public: true },
        // Analytics public permissions
        { action: 'api::analytic.analytic.find', public: true },
        { action: 'api::analytic.analytic.create', public: true },
        // Customer permissions (public can create for checkout)
        { action: 'api::customer.customer.find', public: true },
        { action: 'api::customer.customer.findOne', public: false },
        { action: 'api::customer.customer.create', public: true },
        { action: 'api::customer.customer.update', public: false },
        // Order permissions (public can create for checkout)
        { action: 'api::order.order.find', public: false },
        { action: 'api::order.order.findOne', public: false },
        { action: 'api::order.order.create', public: true },
        { action: 'api::order.order.update', public: false },
        // Payment permissions (handled by webhook, not public)
        { action: 'api::payment.payment.find', public: false },
        { action: 'api::payment.payment.findOne', public: false },
        { action: 'api::payment.payment.create', public: false },
        { action: 'api::payment.payment.update', public: false },
      ];
      
      // Check and create permissions
      for (const { action, public: isPublic } of requiredPermissions) {
        try {
          // Check if permission exists
          const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { action },
          });
          
          if (!existingPermission) {
            // Create permission
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: {
                action,
                enabled: isPublic,
                role: isPublic ? publicRole.id : null,
              },
            });
            console.log(`✅ Created permission: ${action}`);
          } else if (isPublic && existingPermission.role !== publicRole.id) {
            // Update permission to be public
            await strapi.db.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: {
                enabled: true,
                role: publicRole.id,
              },
            });
            console.log(`🔄 Updated permission: ${action}`);
          }
        } catch (error) {
          console.error(`❌ Error handling permission ${action}:`, error.message);
        }
      }
      
      console.log('✅ Bootstrap completed successfully!');
    } catch (error) {
      console.error('❌ Bootstrap error:', error);
    }
  },
};
