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
    // Set default permissions for pokemon-card API
    try {
      const publicRole = await strapi.entityService.findMany('plugin::users-permissions.role', {
        where: { type: 'public' },
      });
      
      if (publicRole && publicRole.length > 0) {
        const publicRoleId = publicRole[0].id;
        
        // Set permissions for pokemon-card API
        const permissions = await strapi.entityService.findMany('plugin::users-permissions.permission', {
          where: {
            role: publicRoleId,
            controller: 'pokemon-card'
          }
        });
        
        // Enable permissions for pokemon-card (including custom endpoints)
        for (const permission of permissions) {
          const allowedActions = ['find', 'findOne', 'stats', 'search', 'featured'];
          if (allowedActions.includes(permission.action)) {
            await strapi.entityService.update('plugin::users-permissions.permission', permission.id, {
              data: { enabled: true }
            });
            console.log(`✅ Enabled ${permission.action} permission for pokemon-card`);
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Could not set default permissions:', error.message);
    }
  },
};
