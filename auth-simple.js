// Sistema de Autenticação Simples - Sem Backend
// Usa localStorage para simular login

class SimpleAuth {
    constructor() {
        this.storageKey = 'bytemarket_user';
        this.init();
    }

    init() {
        // Verificar se já está logado ao carregar a página
        const user = this.getCurrentUser();
        if (user && window.location.pathname.includes('login.html')) {
            window.location.href = 'painel.html';
        }
    }

    // Login com email e senha
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Preencha todos os campos' };
        }

        // Simular login (em produção, validar com backend)
        const user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            photo: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
            loginDate: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(user));
        return { success: true, user };
    }

    // Login social (Google/GitHub)
    socialLogin(provider) {
        // Simular login social
        const providers = {
            google: {
                name: 'Usuário Google',
                email: 'usuario@gmail.com',
                photo: 'https://ui-avatars.com/api/?name=Google&background=4285F4&color=fff'
            },
            github: {
                name: 'Usuário GitHub',
                email: 'usuario@github.com',
                photo: 'https://ui-avatars.com/api/?name=GitHub&background=333&color=fff'
            }
        };

        const providerData = providers[provider];
        const user = {
            id: Date.now(),
            provider: provider,
            email: providerData.email,
            name: providerData.name,
            photo: providerData.photo,
            loginDate: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(user));
        return { success: true, user };
    }

    // Registro
    register(name, email, password, passwordConfirm) {
        if (!name || !email || !password || !passwordConfirm) {
            return { success: false, message: 'Preencha todos os campos' };
        }

        if (password !== passwordConfirm) {
            return { success: false, message: 'As senhas não coincidem' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Senha deve ter no mínimo 6 caracteres' };
        }

        const user = {
            id: Date.now(),
            name: name,
            email: email,
            photo: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
            loginDate: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(user));
        
        // Enviar email de boas-vindas
        this.sendWelcomeEmail(name, email);
        
        return { success: true, user };
    }

    // Enviar email de boas-vindas (assíncrono, não bloqueia o registro)
    async sendWelcomeEmail(name, email) {
        try {
            const BACKEND_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000' 
                : 'https://bytemarket-a4t8.onrender.com';
                
            await fetch(`${BACKEND_URL}/api/email/welcome`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
        } catch (error) {
            // Não mostrar erro para o usuário, apenas logar
            console.log('Email de boas-vindas será enviado em breve');
        }
    }

    // Logout
    logout() {
        localStorage.removeItem(this.storageKey);
        window.location.href = 'login.html';
    }

    // Verificar se está logado
    isAuthenticated() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Pegar usuário atual
    getCurrentUser() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    // Proteger página (redireciona para login se não estiver autenticado)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Atualizar UI com dados do usuário
    updateUI() {
        const user = this.getCurrentUser();
        if (!user) return;

        // Atualizar nome
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = user.name;
        });

        // Atualizar email
        document.querySelectorAll('[data-user-email]').forEach(el => {
            el.textContent = user.email;
        });

        // Atualizar foto
        document.querySelectorAll('[data-user-photo]').forEach(el => {
            if (el.tagName === 'IMG') {
                el.src = user.photo;
            } else {
                el.style.backgroundImage = `url(${user.photo})`;
            }
        });
    }
}

// Instância global
const auth = new SimpleAuth();

// Helper para mostrar mensagens
function showMessage(message, type = 'success') {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    msgDiv.textContent = message;

    document.body.appendChild(msgDiv);

    setTimeout(() => {
        msgDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Adicionar animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
