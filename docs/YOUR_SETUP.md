# 🎯 Setup Rápido - Branch Master + Nginx Local

**Para você que está usando branch `master` e Nginx em `/opt/nginx/html/retro-clipper/`**

## ⚡ 5 Passos (10 minutos)

### 1️⃣ SSH Setup (Sua Máquina)

```bash
# Se não tiver chave SSH
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Autorizar sua própria máquina (para localhost)
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Testar
ssh localhost
# Deve logar sem pedir senha
exit
```

### 2️⃣ Preparar Nginx

```bash
# Criar/confirmar diretório
mkdir -p /opt/nginx/html/retro-clipper

# Dar permissões
chmod 755 /opt/nginx/html/retro-clipper

# Testar permissões
touch /opt/nginx/html/retro-clipper/.test && rm /opt/nginx/html/retro-clipper/.test
# Deve funcionar ✅
```

### 3️⃣ Adicionar Secrets no GitHub

GitHub → Settings → Secrets and variables → Actions

Clique em **New repository secret** e adicione:

**Secret 1: `VPS_HOST`**
```
127.0.0.1
```

**Secret 2: `VPS_USER`**
```
seu-usuario-linux
```

**Secret 3: `SSH_PRIVATE_KEY`**
```
(Cole todo o conteúdo de ~/.ssh/id_rsa)
Inclua as linhas -----BEGIN RSA PRIVATE KEY----- e -----END RSA PRIVATE KEY-----
```

Como copiar:
```bash
# macOS
cat ~/.ssh/id_rsa | pbcopy

# Linux
cat ~/.ssh/id_rsa | xclip -selection clipboard
```

### 4️⃣ Testar Deploy

```bash
# No repositório local
git push origin master

# Depois vá para:
# https://github.com/joao-belmiro/clipper/actions

# Clique no workflow mais recente
# Veja rodando em tempo real ✨
```

### 5️⃣ Confirmar na VPS (Localhost)

```bash
# Verificar se os arquivos foram copiados
ls -la /opt/nginx/html/retro-clipper/

# Você deve ver os arquivos do projeto:
# index.html
# .nuxt/
# public/
# ... etc
```

## ✅ Pronto!

Deploy automático está funcionando! 🎉

Próximas vezes basta fazer:
```bash
git push origin master
# Automáticamente:
# 1. Build (npm run build)
# 2. Deploy (/opt/nginx/html/retro-clipper/)
# 3. Nginx serve em http://localhost/retro-clipper/
```

## 🔍 Verificar que Está Funcionando

```bash
# 1. Ver os arquivos
ls -lh /opt/nginx/html/retro-clipper/ | head -10

# 2. Contar arquivos
find /opt/nginx/html/retro-clipper -type f | wc -l

# 3. Ver tamanho
du -sh /opt/nginx/html/retro-clipper/

# 4. Testar acesso
curl http://localhost/retro-clipper/
# Deve retornar o HTML ✅
```

## 🌐 No Navegador

```
http://localhost/retro-clipper/
http://127.0.0.1/retro-clipper/
```

## 📊 Monitorar Deploy

```bash
# Ver logs em tempo real
# GitHub Actions → Clique no workflow

# Ver cada step:
# ✅ Checkout code
# ✅ Setup Node.js
# ✅ Install dependencies
# ✅ Build application
# ✅ Setup SSH
# ✅ Deploy to Nginx
```

## ⏱️ Timing

- SSH setup: 2 min
- Nginx prep: 2 min
- GitHub secrets: 3 min
- Primeiro push: 2-3 min
- **Total: ~10 minutos**

Próximos deploys: **~2-3 minutos** (automático!)

## 🚨 Problemas Comuns

| Erro | Solução |
|------|---------|
| "Permission denied" | SSH não está funcionando. Teste: `ssh localhost` |
| "Directory not found" | Crie: `mkdir -p /opt/nginx/html/retro-clipper` |
| Workflow não dispara | Fez push na branch `master` (não main)? |
| Arquivos não aparecem | Verifique: `ls /opt/nginx/html/retro-clipper/` |
| Vê erro 404 no navegador | Verifique `baseURL: '/retro-clipper/'` em `nuxt.config.ts` |

## 📚 Documentação Completa

Para mais detalhes:
- **docs/SETUP_MASTER_NGINX.md** - Setup completo com troubleshooting
- **docs/DEPLOYMENT.md** - Referência técnica completa
- **docs/INDEX.md** - Tabela de problemas

---

**Status**: ✅ Pronto para usar!  
**Branch**: master  
**Destino**: /opt/nginx/html/retro-clipper/  
**Deploy automático**: Ativado! 🚀

**Próximo passo**: Execute os 5 passos acima!
