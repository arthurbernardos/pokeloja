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
      // Get both roles
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });
      
      const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });
      
      if (!publicRole || !authenticatedRole) {
        console.error('❌ Roles not found!');
        return;
      }
      
      console.log('✅ Found roles - Public:', publicRole.id, 'Authenticated:', authenticatedRole.id);
      
      // Define all required permissions
      const requiredPermissions = [
        // Pokemon card permissions
        { action: 'api::pokemon-card.pokemon-card.find', roles: ['public', 'authenticated'] },
        { action: 'api::pokemon-card.pokemon-card.findOne', roles: ['public', 'authenticated'] },
        { action: 'api::pokemon-card.pokemon-card.stats', roles: ['public', 'authenticated'] },
        { action: 'api::pokemon-card.pokemon-card.search', roles: ['public', 'authenticated'] },
        { action: 'api::pokemon-card.pokemon-card.featured', roles: ['public', 'authenticated'] },
        // Analytics permissions
        { action: 'api::analytic.analytic.find', roles: ['public', 'authenticated'] },
        { action: 'api::analytic.analytic.create', roles: ['public', 'authenticated'] },
        // Customer permissions
        { action: 'api::customer.customer.find', roles: ['public', 'authenticated'] },
        { action: 'api::customer.customer.findOne', roles: ['authenticated'] },
        { action: 'api::customer.customer.create', roles: ['public', 'authenticated'] },
        { action: 'api::customer.customer.update', roles: ['authenticated'] },
        // Order permissions - BOTH public and authenticated can create
        { action: 'api::order.order.find', roles: ['authenticated'] },
        { action: 'api::order.order.findOne', roles: ['authenticated'] },
        { action: 'api::order.order.create', roles: ['public', 'authenticated'] },
        { action: 'api::order.order.update', roles: [] }, // Nobody can update via API
        // Payment permissions (webhook only)
        { action: 'api::payment.payment.find', roles: ['authenticated'] },
        { action: 'api::payment.payment.findOne', roles: ['authenticated'] },
        { action: 'api::payment.payment.create', roles: [] }, // Only webhook
        { action: 'api::payment.payment.update', roles: [] }, // Only webhook
      ];
      
      // Process each permission
      for (const { action, roles } of requiredPermissions) {
        try {
          // Get or create the permission
          let permission = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { action },
          });
          
          if (!permission) {
            // Create base permission
            permission = await strapi.db.query('plugin::users-permissions.permission').create({
              data: {
                action,
                enabled: true,
              },
            });
            console.log(`✅ Created permission: ${action}`);
          }
          
          // Get current role links
          const currentLinks = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { id: permission.id },
            populate: ['role'],
          });
          
          // Determine which roles should have this permission
          const roleMap = {
            'public': publicRole.id,
            'authenticated': authenticatedRole.id
          };
          
          // Remove existing links
          await strapi.db.connection.raw(
            'DELETE FROM up_permissions_role_links WHERE permission_id = ?',
            [permission.id]
          );
          
          // Add new links for specified roles
          for (const roleName of roles) {
            const roleId = roleMap[roleName];
            if (roleId) {
              await strapi.db.connection.raw(
                'INSERT INTO up_permissions_role_links (permission_id, role_id) VALUES (?, ?) ON CONFLICT DO NOTHING',
                [permission.id, roleId]
              );
              console.log(`🔗 Linked ${action} to ${roleName} role`);
            }
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
