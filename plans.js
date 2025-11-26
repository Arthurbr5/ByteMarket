// Sistema de Planos Premium do ByteMarket
// Gerencia assinaturas, benefícios e recursos premium

class PlanSystem {
    constructor() {
        this.plans = {
            free: {
                id: 'free',
                name: 'Grátis',
                price: 0,
                fee: 15, // Taxa de 15%
                features: {
                    listProducts: true,
                    maxProducts: 5,
                    analytics: false,
                    priority: false,
                    badge: false,
                    customization: false,
                    support: 'email'
                }
            },
            pro: {
                id: 'pro',
                name: 'Pro',
                price: 29.90,
                fee: 10, // Taxa de 10%
                features: {
                    listProducts: true,
                    maxProducts: 50,
                    analytics: true,
                    priority: true,
                    badge: true,
                    customization: true,
                    support: 'priority'
                }
            },
            premium: {
                id: 'premium',
                name: 'Premium',
                price: 29.90,
                fee: 5, // Taxa de 5%
                features: {
                    listProducts: true,
                    maxProducts: -1, // Ilimitado
                    analytics: true,
                    priority: true,
                    badge: true,
                    customization: true,
                    support: '24/7'
                }
            }
        };
        
        this.init();
    }

    init() {
        // Carregar plano do usuário
        this.loadUserPlan();
    }

    // Carregar plano do usuário
    loadUserPlan() {
        const user = JSON.parse(localStorage.getItem('bytemarket_user'));
        if (!user) return null;

        const subscription = JSON.parse(localStorage.getItem('bytemarket_subscription') || 'null');
        
        if (!subscription || this.isExpired(subscription)) {
            return this.plans.free;
        }

        return this.plans[subscription.planId] || this.plans.free;
    }

    // Verificar se assinatura expirou
    isExpired(subscription) {
        if (!subscription.expiresAt) return false;
        return new Date(subscription.expiresAt) < new Date();
    }

    // Obter plano atual do usuário
    getCurrentPlan() {
        return this.loadUserPlan();
    }

    // Assinar plano
    subscribePlan(planId) {
        const user = JSON.parse(localStorage.getItem('bytemarket_user'));
        if (!user) {
            showMessage('Faça login para assinar um plano', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return false;
        }

        const plan = this.plans[planId];
        if (!plan) {
            showMessage('Plano não encontrado', 'error');
            return false;
        }

        // Criar assinatura
        const subscription = {
            planId: planId,
            planName: plan.name,
            price: plan.price,
            subscribedAt: new Date().toISOString(),
            expiresAt: this.calculateExpiration(),
            status: 'active'
        };

        // Salvar assinatura
        localStorage.setItem('bytemarket_subscription', JSON.stringify(subscription));

        // Atualizar badge do usuário
        this.updateUserBadge(planId);

        showMessage(`Plano ${plan.name} ativado com sucesso! 🎉`);
        
        return true;
    }

    // Calcular data de expiração (30 dias)
    calculateExpiration() {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString();
    }

    // Atualizar badge do usuário
    updateUserBadge(planId) {
        const user = JSON.parse(localStorage.getItem('bytemarket_user'));
        if (!user) return;

        user.planBadge = planId;
        localStorage.setItem('bytemarket_user', JSON.stringify(user));
    }

    // Cancelar assinatura
    cancelSubscription() {
        if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
            const subscription = JSON.parse(localStorage.getItem('bytemarket_subscription'));
            if (subscription) {
                subscription.status = 'cancelled';
                subscription.cancelledAt = new Date().toISOString();
                localStorage.setItem('bytemarket_subscription', JSON.stringify(subscription));
            }

            showMessage('Assinatura cancelada. Você ainda tem acesso até o fim do período.', 'info');
            return true;
        }
        return false;
    }

    // Verificar se tem acesso a recurso
    hasFeature(featureName) {
        const plan = this.getCurrentPlan();
        return plan.features[featureName] || false;
    }

    // Obter limite de produtos
    getProductLimit() {
        const plan = this.getCurrentPlan();
        return plan.features.maxProducts;
    }

    // Verificar se pode adicionar mais produtos
    canAddProduct() {
        const limit = this.getProductLimit();
        if (limit === -1) return true; // Ilimitado

        const userProducts = JSON.parse(localStorage.getItem('bytemarket_user_products') || '[]');
        return userProducts.length < limit;
    }

    // Obter taxa de comissão
    getFee() {
        const plan = this.getCurrentPlan();
        return plan.fee;
    }

    // Calcular valor líquido após taxa
    calculateNetAmount(grossAmount) {
        // BUG FIX #13: Validar se grossAmount é número válido
        if (typeof grossAmount !== 'number' || isNaN(grossAmount) || grossAmount <= 0) {
            return {
                gross: 0,
                fee: 0,
                net: 0,
                feePercent: 0
            };
        }
        
        const fee = this.getFee();
        const feeAmount = (grossAmount * fee) / 100;
        return {
            gross: grossAmount,
            fee: feeAmount,
            net: grossAmount - feeAmount,
            feePercent: fee
        };
    }

    // Exibir badge do plano
    renderPlanBadge(planId) {
        const badges = {
            free: '',
            pro: '<span class="plan-badge plan-badge-pro">⭐ PRO</span>',
            premium: '<span class="plan-badge plan-badge-premium">👑 PREMIUM</span>'
        };
        return badges[planId] || '';
    }

    // Comparar planos
    comparePlans(planId1, planId2) {
        const plan1 = this.plans[planId1];
        const plan2 = this.plans[planId2];

        return {
            plan1: plan1,
            plan2: plan2,
            differences: {
                price: plan2.price - plan1.price,
                feeSavings: plan1.fee - plan2.fee,
                productLimit: plan2.features.maxProducts - plan1.features.maxProducts
            }
        };
    }

    // Renderizar card de benefícios
    renderBenefitsCard() {
        const plan = this.getCurrentPlan();
        const subscription = JSON.parse(localStorage.getItem('bytemarket_subscription') || 'null');

        if (!subscription || plan.id === 'free') {
            return `
                <div class="benefits-card">
                    <h3>🎁 Desbloqueie Benefícios</h3>
                    <p>Assine um plano premium e ganhe:</p>
                    <ul>
                        <li>✅ Taxa reduzida de ${this.plans.pro.fee}% (Pro) ou ${this.plans.premium.fee}% (Premium)</li>
                        <li>✅ Mais produtos publicados</li>
                        <li>✅ Badge exclusivo no perfil</li>
                        <li>✅ Prioridade no suporte</li>
                        <li>✅ Estatísticas avançadas</li>
                    </ul>
                    <a href="planos.html" class="btn btn-primary">Ver Planos</a>
                </div>
            `;
        }

        const daysLeft = Math.ceil((new Date(subscription.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));

        return `
            <div class="benefits-card active">
                <div class="plan-header">
                    ${this.renderPlanBadge(plan.id)}
                    <h3>Plano ${plan.name}</h3>
                </div>
                <div class="plan-info">
                    <p><strong>Taxa:</strong> ${plan.fee}% por venda</p>
                    <p><strong>Produtos:</strong> ${plan.features.maxProducts === -1 ? 'Ilimitados' : plan.features.maxProducts}</p>
                    <p><strong>Válido por:</strong> ${daysLeft} dias</p>
                </div>
                <div class="plan-features">
                    ${plan.features.analytics ? '✅ Estatísticas Avançadas' : ''}
                    ${plan.features.priority ? '✅ Prioridade no Suporte' : ''}
                    ${plan.features.customization ? '✅ Personalização Avançada' : ''}
                </div>
                <button onclick="planSystem.cancelSubscription()" class="btn btn-secondary">Cancelar Assinatura</button>
            </div>
        `;
    }

    // Renderizar informações de taxa
    renderFeeInfo() {
        const plan = this.getCurrentPlan();
        const example = this.calculateNetAmount(100);

        return `
            <div class="fee-info">
                <h4>💰 Sua Taxa Atual: ${plan.fee}%</h4>
                <p>Exemplo: Em uma venda de R$ 100,00</p>
                <div class="fee-breakdown">
                    <div class="fee-item">
                        <span>Valor Bruto:</span>
                        <strong>R$ ${example.gross.toFixed(2)}</strong>
                    </div>
                    <div class="fee-item negative">
                        <span>Taxa ByteMarket (${example.feePercent}%):</span>
                        <strong>- R$ ${example.fee.toFixed(2)}</strong>
                    </div>
                    <div class="fee-item positive">
                        <span>Você Recebe:</span>
                        <strong>R$ ${example.net.toFixed(2)}</strong>
                    </div>
                </div>
                ${plan.id === 'free' ? `
                    <p class="upgrade-tip">💡 Com o plano Premium, você receberia R$ ${this.calculateNetAmount(100, this.plans.premium.fee).net.toFixed(2)}!</p>
                ` : ''}
            </div>
        `;
    }

    // Verificar limite de produtos antes de publicar
    checkProductLimit() {
        if (!this.canAddProduct()) {
            const plan = this.getCurrentPlan();
            const limit = this.getProductLimit();
            
            showMessage(`Você atingiu o limite de ${limit} produtos do plano ${plan.name}. Atualize para publicar mais!`, 'error');
            
            setTimeout(() => {
                if (confirm('Deseja ver os planos disponíveis?')) {
                    window.location.href = 'planos.html';
                }
            }, 2000);
            
            return false;
        }
        return true;
    }
}

// Instância global
const planSystem = new PlanSystem();

// Expor funções globais
window.planSystem = planSystem;
