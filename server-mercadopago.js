// Backend Node.js - API Mercado Pago + Upload de Arquivos + Email
const express = require('express');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Resend } = require('resend');
const emailTemplates = require('./email-templates');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve arquivos estáticos

// Configurar Resend
const resend = new Resend(process.env.RESEND_API_KEY || 'YOUR_API_KEY');
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

// Configurar pasta de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max
    },
    fileFilter: (req, file, cb) => {
        // Aceita qualquer tipo de arquivo para produtos digitais
        cb(null, true);
    }
});

// Configuração Mercado Pago (SDK v2)
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST_TOKEN'
});

// Database simulado (use PostgreSQL/MongoDB em produção)
const payments = new Map();
const userPlans = new Map();
const productFiles = new Map(); // Armazena metadata dos arquivos
const userPurchases = new Map(); // Rastreia compras dos usuários

// ==================== ROTAS ====================

// ==================== UPLOAD DE ARQUIVOS ====================

// Upload de arquivos de produto
app.post('/api/upload/product-files', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
        }

        const { productId, userId } = req.body;
        
        if (!productId || !userId) {
            return res.status(400).json({ success: false, error: 'productId e userId são obrigatórios' });
        }

        const uploadedFiles = req.files.map(file => ({
            id: path.parse(file.filename).name,
            filename: file.originalname,
            storedName: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            uploadedAt: new Date(),
            productId: productId,
            userId: userId
        }));

        // Armazena metadata dos arquivos
        uploadedFiles.forEach(file => {
            productFiles.set(file.id, file);
        });

        console.log(`📁 ${uploadedFiles.length} arquivo(s) enviado(s) para produto ${productId}`);

        res.json({
            success: true,
            files: uploadedFiles.map(f => ({
                id: f.id,
                filename: f.filename,
                size: f.size
            }))
        });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload de imagens de produto
app.post('/api/upload/product-images', upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'Nenhuma imagem enviada' });
        }

        const uploadedImages = req.files.map(file => ({
            id: path.parse(file.filename).name,
            filename: file.originalname,
            url: `/api/image/${path.parse(file.filename).name}`,
            size: file.size
        }));

        res.json({
            success: true,
            images: uploadedImages
        });
    } catch (error) {
        console.error('Erro no upload de imagens:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Servir imagem pública (sem autenticação)
app.get('/api/image/:fileId', (req, res) => {
    try {
        const { fileId } = req.params;
        const files = fs.readdirSync(uploadDir);
        const file = files.find(f => f.startsWith(fileId));
        
        if (!file) {
            return res.status(404).send('Imagem não encontrada');
        }

        const filePath = path.join(uploadDir, file);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).send('Erro ao carregar imagem');
    }
});

// Download de arquivo (protegido - apenas compradores)
app.get('/api/download/:fileId', (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.query;
        
        const fileMetadata = productFiles.get(fileId);
        
        if (!fileMetadata) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }

        // Verificar se usuário tem permissão (é o vendedor ou comprou o produto)
        const isOwner = fileMetadata.userId === userId;
        const hasPurchased = userPurchases.has(`${userId}_${fileMetadata.productId}`);
        
        if (!isOwner && !hasPurchased) {
            return res.status(403).json({ error: 'Você não tem permissão para baixar este arquivo' });
        }

        const filePath = path.join(uploadDir, fileMetadata.storedName);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
        }

        console.log(`📥 Download: ${fileMetadata.filename} por usuário ${userId}`);
        
        res.download(filePath, fileMetadata.filename);
    } catch (error) {
        console.error('Erro no download:', error);
        res.status(500).json({ error: error.message });
    }
});

// Listar arquivos de um produto
app.get('/api/product/:productId/files', (req, res) => {
    try {
        const { productId } = req.params;
        const { userId } = req.query;
        
        const files = Array.from(productFiles.values())
            .filter(f => f.productId === productId)
            .map(f => ({
                id: f.id,
                filename: f.filename,
                size: f.size,
                canDownload: f.userId === userId || userPurchases.has(`${userId}_${productId}`)
            }));
        
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROTAS MERCADO PAGO ====================

// ==================== SERVIÇO DE EMAIL ====================

async function sendEmail(to, subject, html) {
    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: to,
            subject: subject,
            html: html
        });
        console.log(`📧 Email enviado para ${to}: ${subject}`);
        return { success: true, id: result.id };
    } catch (error) {
        console.error(`❌ Erro ao enviar email para ${to}:`, error);
        return { success: false, error: error.message };
    }
}

// Endpoints de email para testes
app.post('/api/email/welcome', async (req, res) => {
    try {
        const { email, name } = req.body;
        const html = emailTemplates.welcome(name, email);
        const result = await sendEmail(email, '🎉 Bem-vindo ao ByteMarket!', html);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/email/test', async (req, res) => {
    try {
        const { email, type, data } = req.body;
        
        let html, subject;
        
        switch(type) {
            case 'welcome':
                html = emailTemplates.welcome(data.name, email);
                subject = '🎉 Bem-vindo ao ByteMarket!';
                break;
            case 'purchase':
                html = emailTemplates.purchaseConfirmed(
                    data.buyerName,
                    data.productTitle,
                    data.productPrice,
                    data.productId,
                    data.downloadLink
                );
                subject = '✅ Compra Confirmada - ByteMarket';
                break;
            case 'sale':
                html = emailTemplates.saleNotification(
                    data.sellerName,
                    data.buyerName,
                    data.productTitle,
                    data.productPrice,
                    data.earnings
                );
                subject = '💰 Nova Venda Realizada!';
                break;
            case 'plan':
                html = emailTemplates.planActivated(
                    data.userName,
                    data.planName,
                    data.planFee,
                    data.expiresAt
                );
                subject = '🚀 Plano Ativado com Sucesso!';
                break;
            default:
                return res.status(400).json({ success: false, error: 'Tipo de email inválido' });
        }
        
        const result = await sendEmail(email, subject, html);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ROTAS MERCADO PAGO ====================

// Criar preferência de pagamento para plano
app.post('/api/mercadopago/create-preference', async (req, res) => {
    try {
        const { planType, userId, userEmail } = req.body;

        const plans = {
            pro: { title: 'ByteMarket - Plano PRO', price: 29.90 },
            premium: { title: 'ByteMarket - Plano PREMIUM', price: 29.90 }
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
                payment_methods: {
                    excluded_payment_types: [],
                    installments: 12
                },
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
                payment_methods: {
                    excluded_payment_types: [],
                    installments: 12
                },
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
                // Verificar se external_reference existe
                if (!externalRef) {
                    console.error('❌ External reference não encontrado');
                    return res.sendStatus(200);
                }
                
                // Pagamento aprovado - ativar plano
                const refParts = externalRef.split('_');
                const userId = refParts[0];
                const planType = refParts[1];
                
                if (planType === 'pro' || planType === 'premium') {
                    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    
                    // Ativa plano do usuário
                    userPlans.set(userId, {
                        plan: planType,
                        activatedAt: new Date(),
                        expiresAt: expiresAt
                    });
                    
                    console.log(`✅ Plano ${planType} ativado para usuário ${userId}`);
                    
                    // Enviar email de confirmação do plano
                    const planDetails = {
                        pro: { name: 'PRO', fee: 10 },
                        premium: { name: 'PREMIUM', fee: 5 }
                    };
                    
                    const plan = planDetails[planType];
                    
                    // Verificar se payer.email existe
                    if (!paymentData.payer || !paymentData.payer.email) {
                        console.error('❌ Email do pagador não encontrado');
                        return res.sendStatus(200);
                    }
                    const html = emailTemplates.planActivated(
                        paymentData.payer.email.split('@')[0], // Nome do email
                        plan.name,
                        plan.fee,
                        expiresAt
                    );
                    
                    sendEmail(
                        paymentData.payer.email,
                        '🚀 Plano Ativado com Sucesso!',
                        html
                    );
                    
                } else if (externalRef.includes('product_')) {
                    // Compra de produto - liberar download
                    // Format: product_{productId}_{buyerId}_{timestamp}
                    const parts = externalRef.split('_');
                    const productId = parts[1];
                    const buyerId = parts[2];
                    
                    // Registrar compra
                    userPurchases.set(`${buyerId}_${productId}`, {
                        productId,
                        buyerId,
                        purchasedAt: new Date(),
                        paymentId
                    });
                    
                    console.log(`✅ Produto ${productId} comprado por usuário ${buyerId} - Download liberado`);
                    
                    // Enviar email para o comprador
                    const downloadLink = `https://bytemarketapp.netlify.app/downloads.html`;
                    
                    // Buscar título do produto do description ou usar genérico
                    const productTitle = paymentData.description || 'Produto Digital';
                    const buyerName = paymentData.payer.email.split('@')[0];
                    
                    const html = emailTemplates.purchaseConfirmed(
                        buyerName,
                        productTitle,
                        paymentData.transaction_amount,
                        productId,
                        downloadLink
                    );
                    
                    sendEmail(
                        paymentData.payer.email,
                        '✅ Compra Confirmada - ByteMarket',
                        html
                    );
                    
                    // Enviar email para o vendedor (buscar do localStorage ou database)
                    // Por enquanto, apenas logamos - em produção, buscar seller_email do produto
                    console.log(`💰 Notificar vendedor sobre venda de produto ${productId}`);
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
