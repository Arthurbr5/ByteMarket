// Templates de Email - ByteMarket
// Usando HTML inline para emails transacionais

const emailTemplates = {
    // Template base com header e footer
    baseTemplate: (content) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ByteMarket</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">ByteMarket</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Marketplace de Produtos Digitais</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                <strong>ByteMarket</strong> - Marketplace de Produtos Digitais
                            </p>
                            <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                                Este é um email automático, não responda.
                            </p>
                            <div style="margin: 20px 0 0 0;">
                                <a href="https://bytemarketapp.netlify.app/" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Site</a>
                                <span style="color: #d1d5db;">|</span>
                                <a href="https://bytemarketapp.netlify.app/planos.html" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Planos</a>
                                <span style="color: #d1d5db;">|</span>
                                <a href="https://bytemarketapp.netlify.app/painel.html" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Minha Conta</a>
                            </div>
                            <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 11px;">
                                © 2025 ByteMarket. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,

    // 1. Boas-vindas ao cadastrar
    welcome: (userName, userEmail) => {
        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px;">Bem-vindo(a) ao ByteMarket!</h2>
                <p style="margin: 0; color: #6b7280; font-size: 16px;">Olá, ${userName}! 👋</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Sua conta foi criada com sucesso! Agora você pode:
            </p>
            
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 24px; margin-right: 10px;">🛒</span>
                    <strong style="color: #1f2937;">Comprar produtos digitais</strong>
                    <p style="margin: 5px 0 0 34px; color: #6b7280; font-size: 14px;">Scripts, bots, cursos e muito mais</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 24px; margin-right: 10px;">💼</span>
                    <strong style="color: #1f2937;">Vender seus produtos</strong>
                    <p style="margin: 5px 0 0 34px; color: #6b7280; font-size: 14px;">Publique e comece a lucrar hoje mesmo</p>
                </div>
                <div>
                    <span style="font-size: 24px; margin-right: 10px;">📊</span>
                    <strong style="color: #1f2937;">Gerenciar tudo no painel</strong>
                    <p style="margin: 5px 0 0 34px; color: #6b7280; font-size: 14px;">Acompanhe vendas, compras e ganhos</p>
                </div>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                Quer vender mais e ganhar mais? Conheça nossos <strong>Planos PRO e PREMIUM</strong> com taxas reduzidas e produtos ilimitados!
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://bytemarketapp.netlify.app/explorar.html" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Começar a Explorar 🚀
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                Qualquer dúvida, estamos aqui para ajudar! 💜
            </p>
        `;
        return emailTemplates.baseTemplate(content);
    },

    // 2. Compra confirmada (para comprador)
    purchaseConfirmed: (buyerName, productTitle, productPrice, productId, downloadLink) => {
        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px;">Pagamento Confirmado!</h2>
                <p style="margin: 0; color: #10b981; font-size: 16px; font-weight: 600;">Sua compra foi aprovada</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Olá, <strong>${buyerName}</strong>! 👋
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Seu pagamento foi processado com sucesso e você já pode acessar seu produto:
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 20px;">📦 ${productTitle}</h3>
                <p style="margin: 0; color: #1e40af; font-size: 18px; font-weight: 700;">R$ ${productPrice.toFixed(2)}</p>
            </div>
            
            <div style="background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #065f46; font-size: 16px; font-weight: 600;">
                    🎉 Download Liberado!
                </p>
                <a href="${downloadLink}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 10px;">
                    ⬇️ Baixar Agora
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                <strong>Dica:</strong> Você pode acessar todos os seus produtos comprados a qualquer momento na página de <a href="https://bytemarketapp.netlify.app/downloads.html" style="color: #667eea;">Downloads</a>.
            </p>
        `;
        return emailTemplates.baseTemplate(content);
    },

    // 3. Venda realizada (para vendedor)
    saleNotification: (sellerName, buyerName, productTitle, productPrice, earnings) => {
        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 20px;">💰</div>
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px;">Nova Venda Realizada!</h2>
                <p style="margin: 0; color: #10b981; font-size: 16px; font-weight: 600;">Você acabou de lucrar!</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Parabéns, <strong>${sellerName}</strong>! 🎉
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Seu produto foi vendido com sucesso:
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 20px;">📦 ${productTitle}</h3>
                <p style="margin: 5px 0; color: #78350f; font-size: 14px;">Comprador: ${buyerName}</p>
                <p style="margin: 10px 0 0 0; color: #78350f; font-size: 16px;">Valor da Venda: <strong>R$ ${productPrice.toFixed(2)}</strong></p>
            </div>
            
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #065f46; font-size: 14px;">Seu Lucro:</p>
                <p style="margin: 0; color: #10b981; font-size: 36px; font-weight: 700;">R$ ${earnings.toFixed(2)}</p>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px;">Taxa da plataforma já descontada</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                Continue vendendo e maximize seus ganhos! Atualize seu plano para taxas ainda menores.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://bytemarketapp.netlify.app/painel.html" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Ver no Painel 📊
                </a>
            </div>
        `;
        return emailTemplates.baseTemplate(content);
    },

    // 4. Novo plano ativado
    planActivated: (userName, planName, planFee, expiresAt) => {
        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🚀</div>
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px;">Plano Ativado com Sucesso!</h2>
                <p style="margin: 0; color: #667eea; font-size: 20px; font-weight: 700;">Bem-vindo ao ${planName}</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Olá, <strong>${userName}</strong>! 🎉
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Seu pagamento foi confirmado e seu plano já está ativo!
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="margin: 0 0 20px 0; color: #1e40af; font-size: 22px; text-align: center;">✨ Benefícios Ativados</h3>
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 20px; margin-right: 10px;">💸</span>
                    <strong style="color: #1e40af;">Taxa reduzida: ${planFee}%</strong>
                    <p style="margin: 5px 0 0 30px; color: #3b82f6; font-size: 14px;">Menos taxas = Mais lucro para você!</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 20px; margin-right: 10px;">📦</span>
                    <strong style="color: #1e40af;">Produtos ${planName === 'PRO' ? '50' : 'Ilimitados'}</strong>
                    <p style="margin: 5px 0 0 30px; color: #3b82f6; font-size: 14px;">Venda sem limites!</p>
                </div>
                <div>
                    <span style="font-size: 20px; margin-right: 10px;">⚡</span>
                    <strong style="color: #1e40af;">Suporte prioritário</strong>
                    <p style="margin: 5px 0 0 30px; color: #3b82f6; font-size: 14px;">Atendimento rápido quando precisar</p>
                </div>
            </div>
            
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                    ⏰ Válido até: <strong>${new Date(expiresAt).toLocaleDateString('pt-BR')}</strong>
                </p>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://bytemarketapp.netlify.app/vender.html" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Começar a Vender 🚀
                </a>
            </div>
        `;
        return emailTemplates.baseTemplate(content);
    },

    // 5. Lembrete de pagamento pendente
    paymentPending: (userName, productTitle, productPrice) => {
        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 20px;">⏰</div>
                <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px;">Pagamento Pendente</h2>
                <p style="margin: 0; color: #f59e0b; font-size: 16px; font-weight: 600;">Aguardando confirmação</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Olá, <strong>${userName}</strong>! 👋
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Identificamos que seu pagamento ainda está pendente:
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 20px;">📦 ${productTitle}</h3>
                <p style="margin: 0; color: #78350f; font-size: 18px; font-weight: 700;">R$ ${productPrice.toFixed(2)}</p>
            </div>
            
            <div style="background-color: #fffbeb; border: 2px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                    ℹ️ O que fazer agora?
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                    <li><strong>PIX:</strong> Geralmente confirmado em segundos</li>
                    <li><strong>Boleto:</strong> Pode levar até 3 dias úteis</li>
                    <li><strong>Cartão:</strong> Processamento automático</li>
                </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                Assim que o pagamento for confirmado, você receberá um email com o link de download!
            </p>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                Problemas com o pagamento? Entre em contato com nosso suporte.
            </p>
        `;
        return emailTemplates.baseTemplate(content);
    }
};

module.exports = emailTemplates;
