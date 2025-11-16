# 🚀 Deploy Backend com Mercado Pago

## Opção 1: Render (Recomendado - Grátis)

### Passo a Passo:

1. **Acesse:** https://render.com/
2. **New** → **Web Service**
3. **Connect GitHub:** Selecione `ByteMarket`
4. **Configurações:**
   - **Name:** bytemarket-api
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. **Environment Variables:**
   ```
   MERCADOPAGO_ACCESS_TOKEN = seu_access_token
   MERCADOPAGO_PUBLIC_KEY = sua_public_key
   PORT = 3000
   FRONTEND_URL = https://bytemarketapp.netlify.app
   ```

6. **Deploy!**

7. **Copie a URL** do backend (ex: `https://bytemarket-api.onrender.com`)

8. **Atualize o frontend** (`mercadopago-config.js`):
   ```javascript
   const response = await fetch('https://bytemarket-api.onrender.com/api/mercadopago/create-preference', {
   ```

---

## Opção 2: Railway

1. **Acesse:** https://railway.app/
2. **New Project** → **Deploy from GitHub**
3. **Selecione:** ByteMarket
4. **Adicione variáveis** (mesmas do Render)
5. **Deploy**

---

## Opção 3: Vercel (Serverless)

1. **Instale CLI:** `npm i -g vercel`
2. **Execute:** `vercel`
3. **Adicione variáveis** no painel
4. **Deploy:** `vercel --prod`

---

## Como Obter Credenciais do Mercado Pago

### 1. Criar Conta:
- Acesse: https://www.mercadopago.com.br/
- Crie conta (gratuito)

### 2. Criar Aplicação:
- Vá em: https://www.mercadopago.com.br/developers/panel/app
- Clique **"Criar aplicação"**
- Nome: **ByteMarket**
- Produto: **Pagamentos online**

### 3. Pegar Credenciais:
- Clique na aplicação criada
- Vá em **"Credenciais"**
- **Modo Teste:** Para testar (use cartões de teste)
- **Modo Produção:** Para receber pagamentos reais

**Copie:**
- ✅ **Public Key** → Cola no `mercadopago-config.js` (linha 3)
- ✅ **Access Token** → Cola no `.env` do backend

### 4. Configurar Webhook:
- Em **"Webhooks"**
- **URL:** `https://seu-backend.onrender.com/api/mercadopago/webhook`
- **Eventos:** Selecione "Pagamentos"

---

## Testar Localmente

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env e adicionar suas credenciais

# Iniciar servidor
npm start
```

**Servidor vai rodar em:** http://localhost:3000

**Testar webhook localmente:**
- Use **ngrok**: `npx ngrok http 3000`
- Configure webhook no Mercado Pago com a URL do ngrok

---

## Cartões de Teste

**Cartão Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: Qualquer nome

**Cartão Recusado:**
- Número: `5031 7557 3453 0604`

Mais cartões: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

---

## Próximos Passos

1. ✅ **Deploy do backend** (Render/Railway)
2. ✅ **Obter credenciais** do Mercado Pago
3. ✅ **Configurar variáveis** de ambiente
4. ✅ **Atualizar frontend** com URL do backend
5. ✅ **Testar com cartão de teste**
6. ✅ **Ativar modo produção** quando estiver tudo OK

---

## Custos

**Mercado Pago:**
- Taxa: **4,99% + R$ 0,39** por transação aprovada
- Plano Free: Ilimitado

**Render Free Tier:**
- 750 horas/mês (suficiente)
- Sleep após 15min sem uso
- Grátis forever

**Total:** ~R$ 0/mês (só paga taxas quando vender)
