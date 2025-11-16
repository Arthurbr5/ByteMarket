# 🚀 Deploy no Render - ByteMarket

## Passo a Passo

### 1. Criar Conta no Render
1. Acesse [render.com](https://render.com)
2. Crie conta (pode usar GitHub)
3. Confirme email

### 2. Preparar Repositório Git

**Opção A: Criar Repositório Local**
```bash
cd c:\Users\Alucard69\Documents\BeamNG.drive\settings\escala
git init
git add .
git commit -m "Initial commit - ByteMarket"
```

**Opção B: Conectar com GitHub**
```bash
# Criar repo no GitHub primeiro: https://github.com/new
git remote add origin https://github.com/seu-usuario/bytemarket.git
git branch -M main
git push -u origin main
```

### 3. Deploy no Render

#### Via Dashboard (Recomendado)

1. **Login no Render** → Dashboard

2. **New +** → **Web Service**

3. **Connect Repository**
   - Se GitHub: Autorize e selecione o repositório
   - Se não tem GitHub: Use "Public Git Repository" e cole a URL

4. **Configurar Serviço**
   ```
   Name: bytemarket
   Region: Oregon (US West) ou Frankfurt (Europe)
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Plan**: Free (para testar)

6. **Environment Variables** (Adicionar depois)
   - Clique em "Advanced" antes de criar
   - Ou adicione depois em Settings → Environment

7. **Create Web Service**

### 4. Configurar Variáveis de Ambiente

No painel do Render, vá em **Environment**:

```env
NODE_ENV=production
PORT=10000
SESSION_SECRET=sua-chave-secreta-forte-aqui-min-32-chars
CLIENT_URL=https://bytemarket.onrender.com

# OAuth Google (opcional - configure depois)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth GitHub (opcional - configure depois)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**Importante:** Clique em "Save Changes" após adicionar

### 5. Deploy Automático

- Render vai detectar mudanças no código
- Build automático em ~2-5 minutos
- URL final: `https://bytemarket.onrender.com`

### 6. Verificar Deploy

Acesse a URL fornecida pelo Render. Você deve ver:
- ✅ Homepage carregando
- ✅ Login funcionando (sem OAuth ainda)
- ✅ Sistema de planos funcional
- ✅ Carrinho e favoritos operando

### 7. Configurar OAuth (Opcional)

#### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Create Credentials → OAuth client ID
4. Application type: Web application
5. Authorized redirect URIs:
   ```
   https://bytemarket.onrender.com/auth/google/callback
   ```
6. Copie Client ID e Client Secret
7. Adicione nas Environment Variables do Render

#### GitHub OAuth
1. [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Homepage URL: `https://bytemarket.onrender.com`
4. Callback URL: `https://bytemarket.onrender.com/auth/github/callback`
5. Copie Client ID e gere Client Secret
6. Adicione nas Environment Variables do Render

### 8. Domínio Customizado (Opcional)

1. **Comprar domínio** (Registro.br, GoDaddy, Namecheap)

2. **No Render:**
   - Settings → Custom Domain
   - Adicionar: `seusite.com.br`

3. **No provedor do domínio:**
   - Adicionar registro CNAME:
     ```
     CNAME @ bytemarket.onrender.com
     ```
   - Ou registro A apontando para IP do Render

4. **SSL automático** (Let's Encrypt) - Render configura sozinho

## 🔧 Troubleshooting

### Deploy Falhou

**Erro: "Build failed"**
```bash
# Verifique package.json localmente
npm install
npm start
```

**Erro: "Port already in use"**
- Render usa variável PORT automaticamente
- Código já está configurado: `process.env.PORT || 3000`

### Site Não Carrega

1. **Check Logs:** Render Dashboard → Logs
2. **Verificar variáveis:** Environment tab
3. **Testar localmente:**
   ```bash
   npm install
   npm start
   # Acesse http://localhost:3000
   ```

### OAuth Não Funciona

1. **Callback URLs:** Devem ser HTTPS e exatas
2. **Environment Variables:** CLIENT_ID e SECRET configurados?
3. **Redirect URI:** Deve estar autorizada no Google/GitHub

## 💰 Custos

### Plano Free (Render)
- ✅ 750 horas/mês (suficiente para 1 serviço 24/7)
- ✅ SSL grátis
- ✅ Deploy automático
- ⚠️ "Dorme" após 15 min de inatividade
- ⚠️ 512 MB RAM

### Plano Pago ($7/mês)
- ✅ Sem sleep
- ✅ 512 MB RAM
- ✅ Deploy mais rápido
- ✅ Suporte prioritário

**Recomendação:** Comece no Free, upgrade quando tiver tráfego

## 🎯 Próximos Passos Após Deploy

1. ✅ **Testar site completo**
   - Login/registro
   - Sistema de planos
   - Carrinho
   - Todas as páginas

2. ✅ **Configurar OAuth** (se quiser login social)

3. ✅ **Analytics** 
   - Adicionar Google Analytics
   - Script no <head> de todas as páginas

4. ✅ **Domínio próprio** (opcional)

5. ✅ **SEO**
   - Meta tags
   - Sitemap.xml
   - robots.txt

6. ✅ **Integrar Pagamentos**
   - Stripe / Mercado Pago
   - Adicionar gateway de pagamento real

## 📊 Monitoramento

**Render fornece:**
- Logs em tempo real
- Métricas de uso (CPU, RAM)
- Uptime monitoring
- Email de alertas

**Adicionar depois:**
- Google Analytics (tráfego)
- Sentry (erros)
- UptimeRobot (monitoramento externo)

## 🔄 Atualizações

**Deploy automático:**
1. Faça mudanças no código
2. Commit no Git
3. Push para GitHub/repositório
4. Render detecta e faz deploy automático

```bash
git add .
git commit -m "Atualização XYZ"
git push
# Render faz deploy em ~2 minutos
```

## 🆘 Suporte

**Render:**
- Docs: [render.com/docs](https://render.com/docs)
- Discord: [render.com/discord](https://render.com/discord)
- Email: support@render.com

**ByteMarket:**
- README.md
- INTEGRACAO.md
- Código comentado

---

## ✅ Checklist de Deploy

- [ ] Conta criada no Render
- [ ] Repositório Git criado
- [ ] Código commitado
- [ ] Web Service criado no Render
- [ ] Build concluído com sucesso
- [ ] Site acessível via URL do Render
- [ ] Variáveis de ambiente configuradas
- [ ] Login básico funcionando
- [ ] OAuth configurado (opcional)
- [ ] Domínio customizado (opcional)
- [ ] Analytics adicionado (opcional)

**Tempo estimado: 15-30 minutos** ⏱️

---

**Pronto! Seu ByteMarket está no ar! 🎉**

URL: `https://bytemarket.onrender.com`
