// Mercado Pago - Configuração Frontend
class MercadoPagoIntegration {
    constructor() {
        this.publicKey = 'APP_USR-48c776d7-e25f-4ca6-abe7-5b6909e58bb9'; // Public Key do Mercado Pago
        this.mp = null;
        this.init();
    }

    init() {
        // Carrega SDK do Mercado Pago
        if (!document.getElementById('mercadopago-sdk')) {
            const script = document.createElement('script');
            script.id = 'mercadopago-sdk';
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.onload = () => {
                this.mp = new MercadoPago(this.publicKey);
                console.log('✅ Mercado Pago SDK carregado');
            };
            document.head.appendChild(script);
        }
    }

    // Cria preferência de pagamento para planos
    async createSubscription(planType) {
        const plans = {
            pro: {
                title: 'ByteMarket - Plano PRO',
                price: 99.00,
                description: 'Acesso ao plano PRO (Taxa 10%, 50 produtos)'
            },
            premium: {
                title: 'ByteMarket - Plano PREMIUM',
                price: 49.00,
                description: 'Acesso ao plano PREMIUM (Taxa 5%, produtos ilimitados)'
            }
        };

        const plan = plans[planType];
        if (!plan) {
            throw new Error('Plano inválido');
        }

        try {
            // Envia pro backend criar a preferência
            const response = await fetch('https://bytemarket-a4t8.onrender.com/api/mercadopago/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planType: planType,
                    userId: this.getCurrentUserId(),
                    userEmail: this.getCurrentUserEmail()
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Redireciona pro checkout do Mercado Pago
                window.location.href = data.init_point;
            } else {
                throw new Error(data.error || 'Erro ao criar pagamento');
            }
        } catch (error) {
            console.error('Erro ao criar assinatura:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
        }
    }

    // Cria pagamento único (para vendas de produtos)
    async createProductPayment(productId, productTitle, price) {
        try {
            const response = await fetch('https://bytemarket-a4t8.onrender.com/api/mercadopago/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    title: productTitle,
                    price: price,
                    buyerId: this.getCurrentUserId(),
                    buyerEmail: this.getCurrentUserEmail()
                })
            });

            const data = await response.json();
            
            if (data.success) {
                window.location.href = data.init_point;
            } else {
                throw new Error(data.error || 'Erro ao criar pagamento');
            }
        } catch (error) {
            console.error('Erro ao criar pagamento:', error);
            alert('Erro ao processar compra. Tente novamente.');
        }
    }

    getCurrentUserId() {
        const user = JSON.parse(localStorage.getItem('bytemarket_user') || '{}');
        return user.id || null;
    }

    getCurrentUserEmail() {
        const user = JSON.parse(localStorage.getItem('bytemarket_user') || '{}');
        return user.email || null;
    }

    // Processa retorno do pagamento (success/failure)
    handlePaymentReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const paymentId = urlParams.get('payment_id');

        if (status === 'approved') {
            this.showSuccess('Pagamento aprovado! Seu plano foi ativado.');
            // Atualiza o plano do usuário
            this.updateUserPlan();
        } else if (status === 'pending') {
            this.showWarning('Pagamento pendente. Você receberá um email quando for aprovado.');
        } else if (status === 'rejected') {
            this.showError('Pagamento recusado. Tente novamente.');
        }
    }

    async updateUserPlan() {
        // Verifica com o backend qual plano foi pago
        try {
            const response = await fetch('https://bytemarket-a4t8.onrender.com/api/mercadopago/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.getCurrentUserId()
                })
            });

            const data = await response.json();
            
            if (data.planUpdated) {
                // Atualiza localStorage
                const user = JSON.parse(localStorage.getItem('bytemarket_user') || '{}');
                user.plan = data.plan;
                localStorage.setItem('bytemarket_user', JSON.stringify(user));
                
                // Redireciona pro painel
                setTimeout(() => {
                    window.location.href = '/painel.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao atualizar plano:', error);
        }
    }

    showSuccess(message) {
        alert('✅ ' + message);
    }

    showWarning(message) {
        alert('⚠️ ' + message);
    }

    showError(message) {
        alert('❌ ' + message);
    }
}

// Inicializa globalmente
const mercadoPagoIntegration = new MercadoPagoIntegration();

// Processa retorno de pagamento se estiver na URL
if (window.location.search.includes('payment_id')) {
    mercadoPagoIntegration.handlePaymentReturn();
}
