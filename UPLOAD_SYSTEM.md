# 📦 Sistema de Upload e Download - ByteMarket

## ✅ Implementado com Sucesso!

Sistema completo de upload de arquivos digitais para vendedores e download seguro para compradores.

---

## 🚀 Funcionalidades

### Para Vendedores (vender.html)
- **Upload de Imagens**: Até 5 imagens por produto (máx. 5MB cada)
- **Upload de Arquivos**: Até 10 arquivos digitais (máx. 100MB cada)
- **Drag & Drop**: Interface moderna com arrastar e soltar
- **Preview em Tempo Real**: Visualização dos arquivos antes de publicar
- **Validação**: Verificação de tamanho e tipo de arquivo

### Para Compradores (downloads.html)
- **Listagem de Produtos**: Visualização de todos os produtos comprados
- **Download Individual**: Baixar arquivos um por um
- **Download em Lote**: Baixar todos os arquivos de um produto de uma vez
- **Proteção**: Apenas compradores autorizados podem baixar

---

## 🔧 Tecnologias Utilizadas

### Backend
- **Multer**: Upload de arquivos multipart/form-data
- **UUID**: Geração de IDs únicos para arquivos
- **Express**: Rotas de upload, download e listagem
- **File System (fs)**: Gerenciamento de arquivos no servidor

### Frontend
- **Fetch API**: Requisições HTTP assíncronas
- **FormData**: Envio de arquivos para o backend
- **Blob API**: Download de arquivos no navegador
- **LocalStorage**: Cache de metadata dos produtos

---

## 📡 Endpoints da API

### Upload de Imagens
```
POST /api/upload/product-images
Content-Type: multipart/form-data

Body:
- images: File[] (até 5 imagens)

Response:
{
  "success": true,
  "images": [
    {
      "id": "uuid",
      "filename": "original.jpg",
      "url": "/api/image/uuid",
      "size": 123456
    }
  ]
}
```

### Upload de Arquivos de Produto
```
POST /api/upload/product-files
Content-Type: multipart/form-data

Body:
- files: File[] (até 10 arquivos)
- productId: string
- userId: string

Response:
{
  "success": true,
  "files": [
    {
      "id": "uuid",
      "filename": "script.zip",
      "size": 45678900
    }
  ]
}
```

### Download de Arquivo (Protegido)
```
GET /api/download/:fileId?userId=xxx

Headers:
- Authorization necessária via userId

Response:
- File download (binary stream)
- Content-Disposition: attachment; filename="script.zip"
```

### Visualizar Imagem (Público)
```
GET /api/image/:fileId

Response:
- Image file (binary)
- Content-Type: image/jpeg | image/png | image/gif
```

### Listar Arquivos de Produto
```
GET /api/product/:productId/files?userId=xxx

Response:
{
  "files": [
    {
      "id": "uuid",
      "filename": "script.zip",
      "size": 45678900,
      "canDownload": true
    }
  ]
}
```

---

## 🔐 Segurança

### Proteção de Downloads
- **Autenticação**: Apenas usuários logados podem baixar
- **Autorização**: Verifica se usuário é vendedor OU comprador
- **Validação**: Confirma existência do arquivo antes de enviar

### Validações de Upload
- **Tamanho de Imagens**: Máximo 5MB por imagem
- **Tamanho de Arquivos**: Máximo 100MB por arquivo
- **Quantidade**: Até 5 imagens e 10 arquivos por produto
- **Nomes Únicos**: UUID garante sem conflitos

---

## 💾 Armazenamento

### Estrutura de Pastas
```
bytemarket/
├── uploads/              # Pasta de arquivos (não commitada no Git)
│   ├── uuid1.jpg         # Imagens de produtos
│   ├── uuid2.zip         # Arquivos digitais
│   └── ...
├── server-mercadopago.js # Backend com endpoints de upload
├── vender.html           # Interface de vendedor
└── downloads.html        # Interface de comprador
```

### Metadata
- **productFiles Map**: Armazena informações dos arquivos na memória
- **userPurchases Map**: Rastreia compras e permissões de download
- **LocalStorage**: Cache no navegador para produtos do usuário

---

## 📝 Fluxo de Uso

### 1. Vendedor Publica Produto
1. Acessa `vender.html`
2. Preenche informações do produto
3. Faz upload de imagens (drag & drop ou clique)
4. Faz upload de arquivos digitais (ZIP, PDF, etc.)
5. Clica em "Publicar Produto"
6. Arquivos são enviados ao servidor
7. Produto é salvo com referências aos arquivos

### 2. Comprador Adquire Produto
1. Navega em `explorar.html`
2. Clica em produto desejado
3. Paga via Mercado Pago
4. Webhook registra compra e libera download
5. Comprador acessa `downloads.html`
6. Vê produtos comprados com botão de download

### 3. Download de Arquivos
1. Comprador clica em "Baixar Arquivos"
2. Modal mostra lista de arquivos disponíveis
3. Pode baixar individualmente ou todos de uma vez
4. Backend valida permissão antes de liberar
5. Arquivo é baixado no navegador

---

## 🚀 Deploy no Render

### Variáveis de Ambiente (já configuradas)
```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-3146747756346764-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-666913ce-1616-429f-...
```

### Arquivos Importantes
- `server-mercadopago.js`: Backend com upload system
- `render.yaml`: Configuração de deploy
- `package.json`: Dependências (multer, uuid, express)

### Persistência de Arquivos
⚠️ **IMPORTANTE**: Render free tier NÃO persiste uploads em disco.
Para produção, considere:
- **AWS S3**: Storage escalável e confiável
- **Cloudflare R2**: Compatível com S3, generous free tier
- **Backblaze B2**: Alternativa econômica

---

## 🎯 Próximos Passos (Recomendado)

### Curto Prazo
- [ ] Integrar AWS S3 ou Cloudflare R2 para storage permanente
- [ ] Adicionar barra de progresso visual no upload
- [ ] Implementar compressão automática de imagens

### Médio Prazo
- [ ] Sistema de versionamento de arquivos
- [ ] Suporte a preview de PDFs
- [ ] Limite de downloads por compra
- [ ] Estatísticas de downloads por produto

### Longo Prazo
- [ ] CDN para distribuição global de arquivos
- [ ] Streaming de vídeos para cursos
- [ ] Proteção DRM para arquivos sensíveis

---

## 📊 Status Atual

✅ **Upload de imagens** - Funcionando
✅ **Upload de arquivos** - Funcionando
✅ **Download protegido** - Funcionando
✅ **Interface de vendedor** - Completa
✅ **Interface de comprador** - Completa
✅ **Validações de segurança** - Implementadas
✅ **Deploy no Render** - Realizado (commit a1fbd53)

---

## 💡 Dicas de Uso

### Para Testes Locais
1. Execute: `node server-mercadopago.js`
2. Acesse: `http://localhost:3000/vender.html`
3. Faça upload de arquivos de teste
4. Verifique pasta `uploads/`
5. Teste download em `downloads.html`

### Para Produção
1. Configure S3/R2 para storage
2. Adicione variáveis de ambiente no Render
3. Atualize URLs de upload no código
4. Teste fluxo completo em produção

---

**Desenvolvido para ByteMarket** 🚀
Commit: a1fbd53 | Data: 26/11/2025
