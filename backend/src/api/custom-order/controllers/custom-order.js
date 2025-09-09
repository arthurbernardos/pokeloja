'use strict';

const emailService = require('../../../services/email');

module.exports = {
  async create(ctx) {
    try {
      const { body } = ctx.request;
      
      // Validate required fields
      if (!body.nome || !body.email || !body.cardNome) {
        return ctx.badRequest('Nome, email e nome da carta são obrigatórios');
      }

      // Create description from form data
      const description = `
Nome da Carta: ${body.cardNome}
Descrição: ${body.cardDescricao || 'Não informado'}
Categoria: ${body.categoria}
Tipo: ${body.tipo}
Raridade: ${body.raridade}
Condição: ${body.condicao}
Nacionalidade: ${body.nacionalidade}
Set/Coleção: ${body.setNome || 'Não informado'}
Número da Carta: ${body.numeroCarta || 'Não informado'}
Quantidade: ${body.quantidade}
Produto Lacrado: ${body.lacrado ? 'Sim' : 'Não'}
Observações: ${body.observacoes || 'Nenhuma'}
      `.trim();

      // Prepare data for email
      const customOrderData = {
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        descricao: description,
        orcamento: body.orcamento || null
      };

      // Send notification email to admin
      try {
        await emailService.notifyAdminCustomOrder(customOrderData);
        console.log('Custom order notification sent to admin');
      } catch (emailError) {
        console.error('Failed to send custom order email:', emailError);
        // Don't fail the request if email fails
      }

      // Send confirmation email to customer
      try {
        await emailService.sendCustomOrderConfirmation(body);
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError);
      }

      return ctx.send({
        success: true,
        message: 'Pedido personalizado enviado com sucesso! Entraremos em contato em breve.'
      });

    } catch (error) {
      console.error('Custom order error:', error);
      return ctx.internalServerError('Erro ao processar pedido personalizado');
    }
  }
};