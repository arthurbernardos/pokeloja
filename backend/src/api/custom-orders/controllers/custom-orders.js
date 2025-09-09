'use strict';

const emailService = require('../../../services/email');

module.exports = {
  async create(ctx) {
    try {
      const data = ctx.request.body;
      
      // Validate required fields
      if (!data.nome || !data.email || !data.cardNome) {
        return ctx.badRequest('Nome, email e nome da carta são obrigatórios');
      }

      console.log('📧 Processing custom order:', data.nome, data.email);

      // Create description from form data
      const description = `
Nome da Carta: ${data.cardNome}
Descrição: ${data.cardDescricao || 'Não informado'}
Categoria: ${data.categoria}
Tipo: ${data.tipo}
Raridade: ${data.raridade}
Condição: ${data.condicao}
Nacionalidade: ${data.nacionalidade}
Set/Coleção: ${data.setNome || 'Não informado'}
Número da Carta: ${data.numeroCarta || 'Não informado'}
Quantidade: ${data.quantidade}
Produto Lacrado: ${data.lacrado ? 'Sim' : 'Não'}
Observações: ${data.observacoes || 'Nenhuma'}
      `.trim();

      // Prepare data for email
      const customOrderData = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        descricao: description,
        orcamento: data.orcamento || null
      };

      // Send notification email to admin
      try {
        await emailService.notifyAdminCustomOrder(customOrderData);
        console.log('✅ Custom order notification sent to admin');
      } catch (emailError) {
        console.error('❌ Failed to send custom order email:', emailError);
        // Don't fail the request if email fails
      }

      // Send confirmation email to customer
      try {
        await emailService.sendCustomOrderConfirmation(data);
        console.log('✅ Customer confirmation sent');
      } catch (emailError) {
        console.error('❌ Failed to send customer confirmation:', emailError);
      }

      return ctx.send({
        success: true,
        message: 'Pedido personalizado enviado com sucesso! Entraremos em contato em breve.'
      });

    } catch (error) {
      console.error('❌ Custom order error:', error);
      return ctx.internalServerError('Erro ao processar pedido personalizado: ' + error.message);
    }
  }
};