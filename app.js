// Sistema Global de Navegação e Autenticação do ByteMarket
// Gerencia estado de login, menu dinâmico e integrações entre páginas

class ByteMarketApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.init();
    }

    init() {
        // Carregar dados do usuário
        this.loadUser();
        
        // Atualizar navegação
        this.updateNavigation();
        
        // Carregar carrinho
        this.loadCart();
        
        // Configurar eventos globais
        this.setupGlobalEvents();
    }

    // Carregar usuário do localStorage
    loadUser() {
        const userData = localStorage.getItem('bytemarket_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // Verificar se está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Atualizar navegação baseada no estado de login
    updateNavigation() {
        const navMenus = document.querySelectorAll('.nav-menu');
        
        navMenus.forEach(menu => {
            // Remover itens de login/painel existentes
            const loginItem = menu.querySelector('a[href="login.html"]')?.parentElement;
            const painelItem = menu.querySelector('a[href="painel.html"]')?.parentElement;
            
            if (this.isLoggedIn()) {
                // Usuário logado - mostrar menu do usuário
                if (loginItem) loginItem.remove();
                
                if (!painelItem) {
                    const userMenu = this.createUserMenu();
                    menu.appendChild(userMenu);
                }
            } else {
                // Usuário deslogado - mostrar botão de login
                if (painelItem) painelItem.remove();
                
                if (!loginItem) {
                    const li = document.createElement('li');
                    li.innerHTML = '<a href="login.html" class="btn-login">Entrar</a>';
                    menu.appendChild(li);
                }
            }
        });

        // Atualizar contador do carrinho
        this.updateCartBadge();
    }

    // Criar menu dropdown do usuário
    createUserMenu() {
        const li = document.createElement('li');
        li.className = 'user-menu-item';
        
        const userName = this.currentUser.name.split(' ')[0];
        const userPhoto = this.currentUser.photo || '👤';
        
        li.innerHTML = `
            <a href="#" class="user-menu-toggle" onclick="return false;">
                <img src="${userPhoto}" alt="${userName}" class="user-avatar-small" onerror="this.outerHTML='<span class=user-avatar-small>👤</span>'">
                <span>${userName}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 4l4 4 4-4"/>
                </svg>
            </a>
            <div class="user-dropdown">
                <a href="painel.html">📊 Meu Painel</a>
                <a href="downloads.html">📥 Downloads</a>
                <a href="favoritos.html">❤️ Favoritos</a>
                <a href="mensagens.html">💬 Mensagens</a>
                <a href="notificacoes.html">🔔 Notificações</a>
                <a href="carrinho.html">🛒 Carrinho <span class="cart-badge">0</span></a>
                <div class="dropdown-divider"></div>
                <a href="#" onclick="app.logout(); return false;">🚪 Sair</a>
            </div>
        `;

        // Toggle dropdown
        const toggle = li.querySelector('.user-menu-toggle');
        const dropdown = li.querySelector('.user-dropdown');
        
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('show');
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!li.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        return li;
    }

    // Logout
    logout() {
        if (confirm('Deseja realmente sair?')) {
            localStorage.removeItem('bytemarket_user');
            localStorage.removeItem('bytemarket_cart');
            showMessage('Logout realizado com sucesso!');
            setTimeout(() => window.location.href = 'index.html', 1000);
        }
    }

    // Carregar carrinho
    loadCart() {
        const cartData = localStorage.getItem('bytemarket_cart');
        this.cart = cartData ? JSON.parse(cartData) : [];
    }

    // Adicionar ao carrinho
    addToCart(product) {
        const exists = this.cart.find(item => item.id === product.id);
        
        if (exists) {
            showMessage('Produto já está no carrinho', 'info');
            return;
        }

        this.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            seller: product.seller,
            addedAt: new Date().toISOString()
        });

        this.saveCart();
        showMessage('Produto adicionado ao carrinho!');
        this.updateCartBadge();
    }

    // Remover do carrinho
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartBadge();
    }

    // Salvar carrinho
    saveCart() {
        localStorage.setItem('bytemarket_cart', JSON.stringify(this.cart));
    }

    // Atualizar badge do carrinho
    updateCartBadge() {
        const count = this.cart.length;
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        });

        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
        });
    }

    // Obter total do carrinho
    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    }

    // Configurar eventos globais
    setupGlobalEvents() {
        // Adicionar estilos CSS para menu dropdown
        this.injectStyles();

        // Prevenir submit de formulários sem handler
        document.addEventListener('submit', (e) => {
            if (!e.target.hasAttribute('data-handled')) {
                console.log('Form submission:', e.target);
            }
        });
    }

    // Injetar estilos necessários
    injectStyles() {
        if (document.getElementById('bytemarket-global-styles')) return;

        const style = document.createElement('style');
        style.id = 'bytemarket-global-styles';
        style.textContent = `
            /* Menu do usuário */
            .user-menu-item {
                position: relative;
            }

            .user-menu-toggle {
                display: flex !important;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem !important;
                border-radius: 8px;
                transition: background 0.3s;
            }

            .user-menu-toggle:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .user-avatar-small {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 0.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                min-width: 220px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .user-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .user-dropdown a {
                display: flex !important;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.25rem !important;
                color: #374151 !important;
                text-decoration: none;
                transition: background 0.2s;
                font-size: 0.95rem;
            }

            .user-dropdown a:first-child {
                border-radius: 12px 12px 0 0;
            }

            .user-dropdown a:last-child {
                border-radius: 0 0 12px 12px;
            }

            .user-dropdown a:hover {
                background: #f3f4f6;
            }

            .dropdown-divider {
                height: 1px;
                background: #e5e7eb;
                margin: 0.5rem 0;
            }

            .cart-badge {
                background: #ef4444;
                color: white;
                font-size: 0.7rem;
                padding: 0.15rem 0.4rem;
                border-radius: 10px;
                font-weight: 600;
                margin-left: auto;
            }

            .btn-login {
                background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
                color: white !important;
                padding: 0.6rem 1.5rem !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                transition: transform 0.3s, box-shadow 0.3s !important;
            }

            .btn-login:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }

            /* Proteger páginas */
            .page-protected {
                filter: blur(5px);
                pointer-events: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Proteger página (requer login)
    requireAuth() {
        if (!this.isLoggedIn()) {
            document.body.classList.add('page-protected');
            
            setTimeout(() => {
                showMessage('Você precisa fazer login para acessar esta página', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 100);
            
            return false;
        }
        return true;
    }

    // Atualizar perfil do usuário
    updateUserProfile() {
        if (!this.isLoggedIn()) return;

        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = this.currentUser.name;
        });

        document.querySelectorAll('[data-user-email]').forEach(el => {
            el.textContent = this.currentUser.email;
        });

        document.querySelectorAll('[data-user-photo]').forEach(el => {
            if (el.tagName === 'IMG') {
                el.src = this.currentUser.photo;
                el.alt = this.currentUser.name;
            } else {
                el.style.backgroundImage = `url(${this.currentUser.photo})`;
            }
        });
    }

    // Favoritar produto
    toggleFavorite(productId) {
        if (!this.isLoggedIn()) {
            showMessage('Faça login para favoritar produtos', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        let favorites = JSON.parse(localStorage.getItem('bytemarket_favorites') || '[]');
        const index = favorites.indexOf(productId);

        if (index > -1) {
            favorites.splice(index, 1);
            showMessage('Removido dos favoritos');
        } else {
            favorites.push(productId);
            showMessage('Adicionado aos favoritos!');
        }

        localStorage.setItem('bytemarket_favorites', JSON.stringify(favorites));
        
        // Atualizar UI
        document.querySelectorAll(`[data-product-id="${productId}"] .btn-favorite`).forEach(btn => {
            btn.classList.toggle('active', favorites.includes(productId));
        });

        return favorites.includes(productId);
    }

    // Verificar se produto está favoritado
    isFavorite(productId) {
        const favorites = JSON.parse(localStorage.getItem('bytemarket_favorites') || '[]');
        return favorites.includes(productId);
    }
}

// Instância global
const app = new ByteMarketApp();

// Expor funções globais para retrocompatibilidade
window.bytemarket = {
    isLoggedIn: () => app.isLoggedIn(),
    requireAuth: () => app.requireAuth(),
    updateUserProfile: () => app.updateUserProfile(),
    addToCart: (product) => app.addToCart(product),
    removeFromCart: (id) => app.removeFromCart(id),
    toggleFavorite: (id) => app.toggleFavorite(id),
    isFavorite: (id) => app.isFavorite(id),
    logout: () => app.logout()
};
