'use strict';

/**
 * pokemon-card service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pokemon-card.pokemon-card');
