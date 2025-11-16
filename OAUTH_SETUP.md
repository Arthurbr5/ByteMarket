# ByteMarket - Configuração OAuth

## 🔐 Como Configurar OAuth Social Login

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Google OAuth 2.0

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth client ID**
5. Configure:
   - Application type: **Web application**
   - Name: `ByteMarket`
   - Authorized redirect URIs: 
     - `http://localhost:3000/auth/google/callback` (desenvolvimento)
     - `https://seudominio.com/auth/google/callback` (produção)
6. Copie **Client ID** e **Client Secret**

### 3️⃣ Configurar GitHub OAuth

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em **New OAuth App**
3. Configure:
   - Application name: `ByteMarket`
   - Homepage URL: `http://localhost:3000` (desenvolvimento)
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Registre a aplicação
5. Copie **Client ID** e gere um **Client Secret**

### 4️⃣ Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
copy .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
SESSION_SECRET=gere-uma-chave-forte-aleatoria
```

### 5️⃣ Mover Arquivos HTML para Public

Mova todos os arquivos HTML, CSS e JS para a pasta `public/`:

```bash
mkdir public
move *.html public/
move *.css public/
move *.js public/
```

### 6️⃣ Iniciar o Servidor

```bash
npm start
```

Ou com auto-reload:
```bash
npm run dev
```

### 7️⃣ Testar

1. Abra `http://localhost:3000` no navegador
2. Vá para a página de login
3. Clique em **Entrar com Google** ou **Entrar com GitHub**
4. Autorize o aplicativo
5. Você será redirecionado para o painel

## 📋 Endpoints da API

- `GET /auth/google` - Iniciar login com Google
- `GET /auth/google/callback` - Callback do Google
- `GET /auth/github` - Iniciar login com GitHub
- `GET /auth/github/callback` - Callback do GitHub
- `GET /auth/user` - Verificar usuário autenticado
- `GET /auth/logout` - Fazer logout
- `GET /api/user/profile` - Perfil do usuário (requer autenticação)

## ⚠️ Importante

### Desenvolvimento
- Use `http://localhost:3000`
- Configure callback URLs no Google e GitHub com HTTP
- `SESSION_SECRET` pode ser qualquer string

### Produção
- **OBRIGATÓRIO usar HTTPS** (`https://seudominio.com`)
- Atualize callback URLs nos consoles do Google e GitHub
- Use um `SESSION_SECRET` forte e aleatório
- Configure `NODE_ENV=production` no `.env`
- Adicione `.env` no `.gitignore`

## 🗄️ Próximos Passos (Opcional)

Para um sistema completo, considere adicionar:

1. **Banco de Dados** (MongoDB, PostgreSQL)
   - Salvar usuários permanentemente
   - Vincular produtos e compras ao usuário

2. **JWT Tokens**
   - Autenticação stateless
   - API REST segura

3. **Rate Limiting**
   - Prevenir abuso
   - Limitar requisições por IP

4. **Email Verification**
   - Confirmar email do usuário
   - Recuperação de senha

## 📝 Exemplo de Uso no Frontend

```javascript
// Verificar se está autenticado
fetch('/auth/user')
    .then(res => res.json())
    .then(data => {
        if (data.authenticated) {
            console.log('Usuário:', data.user);
            // Atualizar UI com dados do usuário
        } else {
            // Redirecionar para login
        }
    });

// Fazer logout
document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '/auth/logout';
});
```

## 🆘 Problemas Comuns

**Erro: "redirect_uri_mismatch"**
- Verifique se o callback URL está exatamente igual nos consoles do Google/GitHub

**Erro: "Cannot GET /auth/google/callback"**
- Certifique-se de que o servidor está rodando
- Verifique se todas as dependências foram instaladas

**Sessão não persiste**
- Verifique se `SESSION_SECRET` está configurado
- Em produção, use `secure: true` apenas com HTTPS

**Email não retorna do GitHub**
- Configure scope `user:email` (já está no código)
- Verifique permissões do OAuth App no GitHub
