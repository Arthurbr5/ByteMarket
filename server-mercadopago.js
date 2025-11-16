// Backend Node.js - API Mercado Pago
const express = require('express');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve arquivos estáticos

// Configuração Mercado Pago (SDK v2)
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST_TOKEN'
});

// Database simulado (use PostgreSQL/MongoDB em produção)
const payments = new Map();
const userPlans = new Map();

// ==================== ROTAS ====================

// Criar preferência de pagamento para plano
app.post('/api/mercadopago/create-preference', async (req, res) => {
    try {
        const { planType, userId, userEmail } = req.body;

        const plans = {
            pro: { title: 'ByteMarket - Plano PRO', price: 29.90 },
            premium: { title: 'ByteMarket - Plano PREMIUM', price: 79.90 }
        };

        const plan = plans[planType];
        if (!plan) {
            return res.json({ success: false, error: 'Plano inválido' });
        }

        const preference = new Preference(client);
        
        const response = await preference.create({
            body: {
                items: [
                    {
                        title: plan.title,
                        unit_price: plan.price,
                        quantity: 1,
                    }
                ],
                back_urls: {
                    success: `https://bytemarketapp.netlify.app/painel.html?status=approved`,
                    failure: `https://bytemarketapp.netlify.app/planos.html?status=rejected`,
                    pending: `https://bytemarketapp.netlify.app/painel.html?status=pending`
                },
                auto_return: 'approved',
                external_reference: `${userId}_${planType}_${Date.now()}`,
                payer: {
                    email: userEmail
                }
            }
        });

        // Salva referência do pagamento
        payments.set(response.id, {
            userId,
            planType,
            status: 'pending',
            createdAt: new Date()
        });

        res.json({
            success: true,
            init_point: response.init_point,
            preference_id: response.id
        });
    } catch (error) {
        console.error('Erro ao criar preferência:', error);
        res.json({ success: false, error: error.message });
    }
});

// Criar pagamento de produto
app.post('/api/mercadopago/create-payment', async (req, res) => {
    try {
        const { productId, title, price, buyerId, buyerEmail } = req.body;

        const preference = new Preference(client);
        
        const response = await preference.create({
            body: {
                items: [
                    {
                        title: title,
                        unit_price: price,
                        quantity: 1,
                    }
                ],
                back_urls: {
                    success: `https://bytemarketapp.netlify.app/downloads.html?status=approved&product=${productId}`,
                    failure: `https://bytemarketapp.netlify.app/produto.html?id=${productId}&status=rejected`,
                    pending: `https://bytemarketapp.netlify.app/produto.html?id=${productId}&status=pending`
                },
                auto_return: 'approved',
                external_reference: `product_${productId}_${buyerId}_${Date.now()}`,
                payer: {
                    email: buyerEmail
                }
            }
        });

        res.json({
            success: true,
            init_point: response.init_point,
            preference_id: response.id
        });
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        res.json({ success: false, error: error.message });
    }
});

// Webhook - Recebe notificações do Mercado Pago
app.post('/api/mercadopago/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;
            
            // Busca detalhes do pagamento
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: paymentId });
            const externalRef = paymentData.external_reference;
            
            console.log(`📦 Pagamento recebido: ${paymentId} - Status: ${paymentData.status}`);

            if (paymentData.status === 'approved') {
                // Pagamento aprovado - ativar plano
                const [userId, planType] = externalRef.split('_');
                
                if (planType === 'pro' || planType === 'premium') {
                    // Ativa plano do usuário
                    userPlans.set(userId, {
                        plan: planType,
                        activatedAt: new Date(),
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
                    });
                    
                    console.log(`✅ Plano ${planType} ativado para usuário ${userId}`);
                    
                    // TODO: Enviar email de confirmação
                } else if (externalRef.includes('product_')) {
                    // Compra de produto - liberar download
                    console.log(`✅ Produto comprado: ${externalRef}`);
                    
                    // TODO: Registrar compra e liberar download
                }
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.sendStatus(500);
    }
});

// Verificar pagamento e atualizar plano
app.post('/api/mercadopago/verify-payment', async (req, res) => {
    try {
        const { userId } = req.body;
        
        const userPlan = userPlans.get(userId);
        
        if (userPlan) {
            res.json({
                planUpdated: true,
                plan: userPlan.plan,
                expiresAt: userPlan.expiresAt
            });
        } else {
            res.json({ planUpdated: false });
        }
    } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        res.json({ planUpdated: false, error: error.message });
    }
});

// Buscar plano do usuário
app.get('/api/user/:userId/plan', (req, res) => {
    const { userId } = req.params;
    const userPlan = userPlans.get(userId) || { plan: 'free' };
    res.json(userPlan);
});

// ==================== INICIALIZAÇÃO ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📦 Mercado Pago configurado`);
    console.log(`\n⚠️  IMPORTANTE: Configure as variáveis de ambiente:`);
    console.log(`   - MERCADOPAGO_ACCESS_TOKEN (Access Token do Mercado Pago)`);
    console.log(`\n📖 Documentação: https://www.mercadopago.com.br/developers/pt/docs`);
});
