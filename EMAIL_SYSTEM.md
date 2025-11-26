# 📧 Sistema de Emails - ByteMarket

## ✅ Implementado com Sucesso!

Sistema completo de emails transacionais usando **Resend** - enviados automaticamente em eventos importantes.

---

## 🚀 Emails Implementados

### 1. 🎉 Boas-vindas (Welcome)
**Quando:** Usuário se registra no site
**Para:** Novo usuário
**Conteúdo:**
- Mensagem de boas-vindas personalizada
- Explicação dos recursos (comprar, vender, gerenciar)
- Call-to-action para explorar produtos
- Link para planos PRO/PREMIUM

### 2. ✅ Compra Confirmada (Purchase Confirmed)
**Quando:** Pagamento aprovado via Mercado Pago
**Para:** Comprador
**Conteúdo:**
- Confirmação do pagamento
- Detalhes do produto comprado
- Botão de download imediato
- Link para página de downloads

### 3. 💰 Venda Realizada (Sale Notification)
**Quando:** Produto do vendedor é comprado
**Para:** Vendedor
**Conteúdo:**
- Notificação de nova venda
- Nome do comprador
- Valor da venda e lucro líquido (após taxa)
- Link para painel de controle

### 4. 🚀 Plano Ativado (Plan Activated)
**Quando:** Assinatura PRO/PREMIUM confirmada
**Para:** Assinante
**Conteúdo:**
- Confirmação de ativação do plano
- Benefícios desbloqueados
- Taxa reduzida e limite de produtos
- Data de expiração

### 5. ⏰ Pagamento Pendente (Payment Pending)
**Quando:** Pagamento em processamento (PIX/Boleto)
**Para:** Comprador
**Conteúdo:**
- Status do pagamento
- Tempo estimado de confirmação
- Instruções para cada método de pagamento

---

## 🔧 Tecnologia

### Resend
- **Free Tier**: 3.000 emails/mês
- **Velocidade**: Entrega em segundos
- **Confiabilidade**: 99.9% uptime
- **Domínio**: Suporta domínio customizado
- **API Simples**: Apenas 1 linha de código

### Templates HTML
- Design responsivo (mobile-friendly)
- Cores da marca ByteMarket
- Inline CSS (compatibilidade com clientes de email)
- Botões de call-to-action
- Links diretos para ações

---

## 📡 Endpoints da API

### Enviar Email de Boas-vindas
```http
POST /api/email/welcome
Content-Type: application/json

Body:
{
  "name": "João Silva",
  "email": "joao@email.com"
}

Response:
{
  "success": true,
  "id": "email_id_resend"
}
```

### Enviar Email de Teste
```http
POST /api/email/test
Content-Type: application/json

Body:
{
  "email": "teste@email.com",
  "type": "welcome" | "purchase" | "sale" | "plan",
  "data": {
    // Dados específicos do template
  }
}

Response:
{
  "success": true,
  "id": "email_id_resend"
}
```

**Tipos de Email (type):**
- `welcome` - Boas-vindas
- `purchase` - Compra confirmada
- `sale` - Venda realizada
- `plan` - Plano ativado

---

## 🔐 Configuração

### 1. Criar Conta no Resend
1. Acesse: https://resend.com/
2. Crie conta gratuita
3. Verifique seu email

### 2. Gerar API Key
1. Vá em: https://resend.com/api-keys
2. Clique em "Create API Key"
3. Copie a chave (começa com `re_`)

### 3. Configurar Domínio (Opcional - Recomendado)
**Sem domínio:**
- Use: `onboarding@resend.dev`
- Limitação: 3.000 emails/mês

**Com domínio verificado:**
- Use: `noreply@seudominio.com`
- Benefícios: Aumenta limite, melhor deliverability

**Como verificar domínio:**
1. Vá em: https://resend.com/domains
2. Adicione seu domínio
3. Configure registros DNS (SPF, DKIM, DMARC)
4. Aguarde verificação (5-10 minutos)

### 4. Variáveis de Ambiente

**Localmente (.env):**
```env
RESEND_API_KEY=re_sua_api_key_aqui
FROM_EMAIL=noreply@seudominio.com
```

**No Render:**
1. Acesse: https://dashboard.render.com/
2. Selecione seu serviço
3. Vá em "Environment"
4. Adicione:
   - `RESEND_API_KEY` = sua API key
   - `FROM_EMAIL` = seu email de envio

---

## 🎯 Fluxos Automáticos

### Fluxo 1: Novo Usuário
```
Usuário preenche formulário de registro
    ↓
auth-simple.js: register()
    ↓
Salva no localStorage
    ↓
Chama sendWelcomeEmail()
    ↓
POST /api/email/welcome
    ↓
Resend envia email
    ↓
✅ Email recebido em segundos
```

### Fluxo 2: Compra de Produto
```
Usuário clica em "Comprar"
    ↓
Mercado Pago: Pagamento aprovado
    ↓
Webhook: POST /api/mercadopago/webhook
    ↓
Identifica compra de produto
    ↓
Libera download (userPurchases)
    ↓
Envia email para comprador (purchaseConfirmed)
    ↓
Envia email para vendedor (saleNotification)
    ↓
✅ Ambos notificados
```

### Fluxo 3: Assinatura de Plano
```
Usuário assina PRO/PREMIUM
    ↓
Mercado Pago: Pagamento aprovado
    ↓
Webhook: POST /api/mercadopago/webhook
    ↓
Ativa plano (userPlans)
    ↓
Envia email (planActivated)
    ↓
✅ Usuário notificado com benefícios
```

---

## 📊 Arquivos Modificados

### Novos Arquivos
1. **email-templates.js** (380 linhas)
   - 5 templates HTML completos
   - Função baseTemplate() reutilizável
   - Inline CSS para compatibilidade

### Arquivos Atualizados
1. **server-mercadopago.js**
   - `require('resend')` importado
   - Função `sendEmail()` criada
   - Rotas `/api/email/welcome` e `/api/email/test`
   - Webhook integrado com envio de emails

2. **auth-simple.js**
   - Método `sendWelcomeEmail()` adicionado
   - Chamado automaticamente no `register()`
   - Não bloqueia o registro (async)

3. **.env.example**
   - Variáveis `RESEND_API_KEY` e `FROM_EMAIL`
   - Documentação atualizada

4. **package.json**
   - Dependência `resend` adicionada

---

## 🧪 Como Testar

### Teste 1: Email de Boas-vindas
```bash
# Método 1: Registrar novo usuário
1. Acesse: http://localhost:3000/login.html
2. Crie nova conta
3. Verifique email de boas-vindas

# Método 2: API direta
curl -X POST http://localhost:3000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "seu@email.com"}'
```

### Teste 2: Email de Compra
```bash
# Endpoint de teste
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "type": "purchase",
    "data": {
      "buyerName": "João Silva",
      "productTitle": "Bot Premium",
      "productPrice": 49.90,
      "productId": "prod-123",
      "downloadLink": "https://bytemarketapp.netlify.app/downloads.html"
    }
  }'
```

### Teste 3: Email de Venda
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "type": "sale",
    "data": {
      "sellerName": "Maria",
      "buyerName": "João",
      "productTitle": "Script Python",
      "productPrice": 29.90,
      "earnings": 26.91
    }
  }'
```

### Teste 4: Email de Plano
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "type": "plan",
    "data": {
      "userName": "João",
      "planName": "PRO",
      "planFee": 10,
      "expiresAt": "2025-12-26T00:00:00Z"
    }
  }'
```

---

## ⚠️ IMPORTANTE - Produção

### 1. Configure Variáveis no Render
```bash
# Dashboard do Render > Environment
RESEND_API_KEY=re_sua_chave_real
FROM_EMAIL=noreply@bytemarketapp.com
```

### 2. Verifique Domínio
- Sem domínio verificado = `onboarding@resend.dev`
- Com domínio verificado = Melhor deliverability

### 3. Monitore Envios
- Dashboard Resend: https://resend.com/emails
- Veja status de cada email
- Taxa de entrega e aberturas

### 4. Limites
- **Free Tier**: 3.000 emails/mês (≈100 por dia)
- **Crescimento**: Upgrade para 50k emails/mês ($20/mês)

---

## 🎯 Próximas Melhorias

### Curto Prazo
- [ ] Email de recuperação de senha
- [ ] Email de notificação de nova mensagem
- [ ] Email semanal com resumo de vendas

### Médio Prazo
- [ ] Templates personalizáveis por vendedor
- [ ] Anexar PDFs com nota fiscal
- [ ] A/B testing de assuntos

### Longo Prazo
- [ ] Campanhas de email marketing
- [ ] Automações baseadas em comportamento
- [ ] Segmentação de usuários

---

## 📊 Status Atual

✅ **5 Templates** criados e testados
✅ **3 Rotas de API** implementadas
✅ **Webhook** integrado com envio automático
✅ **Registro** envia email de boas-vindas
✅ **Pagamentos** disparam notificações
✅ **Deploy** realizado (commit fec7f3b)

---

## 💡 Dicas de Uso

### Para Testes
Use seu próprio email para receber os testes rapidamente.

### Para Produção
1. Verifique domínio no Resend
2. Configure SPF/DKIM corretamente
3. Monitore taxa de bounce
4. Respeite opt-out (descadastro)

### Deliverability
- Use `noreply@` para emails transacionais
- Evite palavras spam ("grátis", "ganhe agora")
- Inclua link de descadastro
- Mantenha lista limpa (remova bounces)

---

**Desenvolvido para ByteMarket** 📧
Commit: fec7f3b | Data: 26/11/2025
