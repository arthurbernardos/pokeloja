'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::custom-order.custom-order');