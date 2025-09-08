module.exports = (plugin) => {
  const emailService = require('../../services/email');

  // Override the register controller
  plugin.controllers.auth.register = async (ctx) => {
    const { email, username, password, nome, cpf, telefone } = ctx.request.body;

    // Basic validation
    if (!email || !username || !password) {
      return ctx.badRequest('Email, username, and password are required');
    }

    try {
      // Check if user already exists
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: email.toLowerCase() },
            { username }
          ]
        }
      });

      if (existingUser) {
        return ctx.badRequest('Email or username already taken');
      }

      // Get the authenticated role (default role for new users)
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      // Create the user
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          email: email.toLowerCase(),
          username,
          password,
          nome,
          cpf,
          telefone,
          role: role.id,
          confirmed: true, // Auto-confirm for now
          provider: 'local'
        }
      });

      // Generate JWT token
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Don't fail registration if email fails
      }

      // Return user data (without password)
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        nome: user.nome,
        cpf: user.cpf,
        telefone: user.telefone,
        confirmed: user.confirmed,
        blocked: user.blocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      ctx.send({
        jwt,
        user: sanitizedUser
      });

    } catch (error) {
      console.error('Registration error:', error);
      return ctx.internalServerError('Registration failed');
    }
  };

  return plugin;
};