# 🔗 Sistema Integrado ByteMarket

## 📋 Visão Geral

O ByteMarket agora possui um **sistema completamente integrado** onde:
- ✅ Login funciona em todas as páginas
- ✅ Menu se adapta automaticamente (usuário logado/deslogado)
- ✅ Páginas protegidas redirecionam para login
- ✅ Carrinho sincronizado entre páginas
- ✅ Favoritos funcionam globalmente
- ✅ Dados do usuário aparecem em todo o site

## 🗂️ Arquitetura

### Arquivos Principais

1. **auth-simple.js** - Sistema de autenticação
   - Login com email/senha
   - Login social (Google/GitHub)
   - Registro de usuários
   - Logout
   - Validações

2. **app.js** - Sistema global de integração
   - Gerenciamento de estado
   - Menu dinâmico
   - Proteção de páginas
   - Carrinho de compras
   - Sistema de favoritos

3. **script.js** - Funcionalidades específicas de cada página

### Como Funciona

```
Carregamento de qualquer página:
  ↓
1. auth-simple.js carrega
  → Verifica localStorage por usuário logado
  → Cria classe SimpleAuth
  ↓
2. app.js carrega
  → Cria classe ByteMarketApp
  → Atualiza navegação (adiciona menu do usuário OU botão login)
  → Carrega carrinho
  → Carrega favoritos
  ↓
3. script.js carrega
  → Funcionalidades específicas da página
```

## 🔐 Sistema de Autenticação

### Login

**Arquivo:** `login.html`

**Como funciona:**
1. Usuário clica "Entrar com Google" ou "Entrar com GitHub"
2. `auth.socialLogin(provider)` é chamado
3. Cria usuário simulado no localStorage
4. Redireciona para `painel.html`

**Código:**
```javascript
// Login social
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.onclick = () => {
        const result = auth.socialLogin('google');
        showMessage('Login com Google realizado!');
        setTimeout(() => window.location.href = 'painel.html', 1000);
    };
});
```

### Logout

**Como funciona:**
1. Usuário clica no menu dropdown → "🚪 Sair"
2. Confirma com alert
3. `app.logout()` remove dados do localStorage
4. Redireciona para `index.html`

## 🧭 Menu Dinâmico

### Usuário Deslogado
```html
<ul class="nav-menu">
    <li><a href="index.html">Home</a></li>
    <li><a href="explorar.html">Explorar</a></li>
    <li><a href="vender.html">Vender</a></li>
    <li><a href="planos.html">Planos</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="login.html" class="btn-login">Entrar</a></li>
</ul>
```

### Usuário Logado
```html
<ul class="nav-menu">
    <li><a href="index.html">Home</a></li>
    <li><a href="explorar.html">Explorar</a></li>
    <li><a href="vender.html">Vender</a></li>
    <li><a href="planos.html">Planos</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li class="user-menu-item">
        <a href="#" class="user-menu-toggle">
            <img src="[FOTO]" alt="[NOME]">
            <span>[NOME]</span>
            ↓
        </a>
        <div class="user-dropdown">
            <a href="painel.html">📊 Meu Painel</a>
            <a href="downloads.html">📥 Downloads</a>
            <a href="favoritos.html">❤️ Favoritos</a>
            <a href="mensagens.html">💬 Mensagens</a>
            <a href="notificacoes.html">🔔 Notificações</a>
            <a href="carrinho.html">🛒 Carrinho <span class="cart-badge">3</span></a>
            ---
            <a href="#" onclick="app.logout()">🚪 Sair</a>
        </div>
    </li>
</ul>
```

## 🔒 Páginas Protegidas

Páginas que **exigem login**:
- `painel.html` - Painel do usuário
- `downloads.html` - Downloads comprados
- `mensagens.html` - Sistema de mensagens
- `notificacoes.html` - Notificações
- `favoritos.html` - Produtos favoritados
- `cupons.html` - Cupons do usuário
- `checkout.html` - Finalizar compra
- `admin.html` - Painel administrativo

**Como proteger uma página:**

```javascript
// No final do HTML, adicione:
<script>
    // Proteger página - redireciona se não estiver logado
    if (!app.isLoggedIn()) {
        app.requireAuth();
    }
</script>
```

## 🛒 Sistema de Carrinho

### Adicionar ao Carrinho

```javascript
// Em qualquer página de produto
const product = {
    id: 'prod-123',
    name: 'Script Python Bot',
    price: 99.90,
    image: 'url-da-imagem',
    seller: 'Vendedor XYZ'
};

app.addToCart(product);
// Resultado: Carrinho atualizado, badge mostra quantidade
```

### Remover do Carrinho

```javascript
app.removeFromCart('prod-123');
```

### Badge do Carrinho

O badge é atualizado automaticamente em **todas as páginas** quando:
- Produto é adicionado
- Produto é removido
- Página é carregada

## ❤️ Sistema de Favoritos

### Favoritar Produto

```javascript
// Botão de favoritar
<button onclick="app.toggleFavorite('prod-123')">❤️</button>
```

**Comportamento:**
- Se deslogado: Redireciona para login
- Se logado: Adiciona/remove dos favoritos
- Estado persiste entre páginas

### Verificar se Está Favoritado

```javascript
if (app.isFavorite('prod-123')) {
    // Produto está nos favoritos
    button.classList.add('active');
}
```

## 📊 Dados do Usuário

### Exibir Informações

Use atributos `data-*` no HTML:

```html
<!-- Nome do usuário -->
<h3 data-user-name>Usuário</h3>

<!-- Email -->
<p data-user-email>usuario@email.com</p>

<!-- Foto (como src) -->
<img data-user-photo src="#" alt="Foto">

<!-- Foto (como background) -->
<div data-user-photo style="background-size: cover;"></div>
```

**Atualização automática:**
```javascript
app.updateUserProfile();
```

## 🎨 Personalização CSS

### Menu Dropdown

```css
.user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    min-width: 220px;
}

.user-dropdown.show {
    opacity: 1;
    visibility: visible;
}
```

### Badge do Carrinho

```css
.cart-badge {
    background: #ef4444;
    color: white;
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    border-radius: 10px;
}
```

### Botão de Login

```css
.btn-login {
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    color: white !important;
    padding: 0.6rem 1.5rem !important;
    border-radius: 8px !important;
}
```

## 🔧 Funções Úteis

### Globais (disponíveis em qualquer página)

```javascript
// Verificar se está logado
if (app.isLoggedIn()) { }

// Obter usuário atual
const user = app.currentUser;

// Proteger página
app.requireAuth();

// Atualizar perfil
app.updateUserProfile();

// Carrinho
app.addToCart(product);
app.removeFromCart(id);
app.getCartTotal();

// Favoritos
app.toggleFavorite(id);
app.isFavorite(id);

// Logout
app.logout();
```

### Compatibilidade

Para código legado, também disponível em:
```javascript
window.bytemarket.isLoggedIn()
window.bytemarket.addToCart(product)
// etc...
```

## 📝 Estrutura de Dados

### Usuário (localStorage: `bytemarket_user`)
```json
{
    "id": 1637012345678,
    "name": "João Silva",
    "email": "joao@email.com",
    "photo": "https://ui-avatars.com/api/?name=João+Silva",
    "provider": "google",
    "loginDate": "2025-11-14T10:30:00.000Z"
}
```

### Carrinho (localStorage: `bytemarket_cart`)
```json
[
    {
        "id": "prod-123",
        "name": "Script Python Bot",
        "price": 99.90,
        "image": "url",
        "seller": "Vendedor XYZ",
        "addedAt": "2025-11-14T10:35:00.000Z"
    }
]
```

### Favoritos (localStorage: `bytemarket_favorites`)
```json
["prod-123", "prod-456", "prod-789"]
```

## 🚀 Fluxo Completo

### 1. Usuário Entra no Site

```
index.html carrega
  ↓
app.js verifica localStorage
  ↓
Não encontra usuário
  ↓
Mostra menu com botão "Entrar"
```

### 2. Usuário Faz Login

```
Clica em "Entrar" → login.html
  ↓
Clica em "Entrar com Google"
  ↓
auth.socialLogin('google') cria usuário
  ↓
Salva no localStorage
  ↓
Redireciona para painel.html
```

### 3. Navega pelo Site

```
Abre explorar.html
  ↓
app.js carrega
  ↓
Encontra usuário no localStorage
  ↓
Mostra menu dropdown com nome e foto
```

### 4. Adiciona ao Carrinho

```
Clica em "Comprar" em produto
  ↓
app.addToCart(product)
  ↓
Salva no localStorage
  ↓
Badge do carrinho mostra "1"
```

### 5. Vai ao Carrinho

```
Clica em "🛒 Carrinho" no menu
  ↓
carrinho.html carrega
  ↓
Lê bytemarket_cart do localStorage
  ↓
Exibe produtos
```

### 6. Faz Logout

```
Clica no menu → "🚪 Sair"
  ↓
Confirma
  ↓
app.logout() limpa localStorage
  ↓
Redireciona para index.html
  ↓
Menu volta a mostrar "Entrar"
```

## ✅ Checklist de Integração

### Em Todas as Páginas HTML

- [x] Menu padronizado (Home, Explorar, Vender, Planos, Blog)
- [x] Logo clicável `<a href="index.html"><h1>ByteMarket</h1></a>`
- [x] Scripts carregados: `auth-simple.js` → `app.js` → `script.js`
- [x] Footer padronizado

### Em Páginas Protegidas

- [x] Script de proteção:
```javascript
<script>
    if (!app.isLoggedIn()) {
        app.requireAuth();
    }
</script>
```

### Em Páginas de Produto

- [x] Botão "Adicionar ao Carrinho" chama `app.addToCart()`
- [x] Botão "Favoritar" chama `app.toggleFavorite()`

### Em Páginas de Perfil

- [x] Elementos com `data-user-name`, `data-user-email`, `data-user-photo`
- [x] Script chama `app.updateUserProfile()`

## 🐛 Troubleshooting

### Menu não aparece
- Verifique se `app.js` está sendo carregado
- Abra console: `console.log(app)`

### Login não funciona
- Verifique se `auth-simple.js` está carregado
- Abra console: `console.log(auth)`

### Carrinho não atualiza
- Verifique localStorage: `localStorage.getItem('bytemarket_cart')`
- Limpe cache: `localStorage.clear()`

### Página protegida não redireciona
- Verifique se script de proteção está presente
- Deve estar DEPOIS de carregar `app.js`

## 🎯 Resultado Final

✅ **Sistema Completo e Integrado**
- Login funciona instantaneamente (sem backend)
- Menu se adapta automaticamente
- Carrinho sincronizado em todas as páginas
- Favoritos globais
- Páginas protegidas redirecionam
- Dados do usuário aparecem em todo lugar
- Experiência fluida e profissional

**Tudo interligado e fazendo sentido! 🎉**
