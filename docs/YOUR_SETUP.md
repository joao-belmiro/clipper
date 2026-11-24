# 🎯 Setup Rápido - Branch Master + Nginx na VPS

**Para a branch `master` e o Nginx da VPS em `/opt/nginx/html/retro-clipper/`**

## ⚡ 5 Passos (10 minutos)

### 1️⃣ SSH Setup (Sua Máquina)

```bash
# Gere uma chave dedicada no seu Linux local
ssh-keygen -t ed25519 -f ~/.ssh/github-actions-vps -C "github-actions-deploy" -N ""

# Instale a chave pública na conta correta DA VPS
ssh-copy-id -i ~/.ssh/github-actions-vps.pub SEU_USUARIO@IP_PUBLICO_DA_VPS

# Teste a chave privada contra a VPS
ssh -i ~/.ssh/github-actions-vps -o IdentitiesOnly=yes SEU_USUARIO@IP_PUBLICO_DA_VPS
```

### 2️⃣ Preparar Nginx na VPS

Execute esses comandos conectado à VPS; substitua `SEU_USUARIO` pelo valor que será usado em `VPS_USER`.

```bash
sudo mkdir -p /opt/nginx/html/retro-clipper
sudo chown SEU_USUARIO:SEU_USUARIO /opt/nginx/html/retro-clipper
```

### 3️⃣ Adicionar Secrets no GitHub

GitHub → Settings → Secrets and variables → Actions

Clique em **New repository secret** e adicione:

**Secret 1: `VPS_HOST`**
```
IP público ou hostname da VPS (ex.: 203.0.113.10 ou vps.seudominio.com)
```

**Secret 2: `VPS_USER`**
```
Usuário SSH da VPS autorizado para essa chave e com permissão de escrita no diretório
```

**Secret 3: `SSH_PRIVATE_KEY`**
```
(Cole todo o conteúdo de ~/.ssh/github-actions-vps, sem .pub)
Inclua as linhas BEGIN/END e preserve as quebras de linha
```

Como copiar:
```bash
cat ~/.ssh/github-actions-vps
```
Copie o conteúdo no Secret do GitHub. Nunca compartilhe ou faça commit da chave privada. Não use `localhost` ou `127.0.0.1` em `VPS_HOST`: o workflow roda nos servidores do GitHub.

### 4️⃣ Testar Deploy

```bash
# No repositório local
git push origin master

# Depois vá para:
# https://github.com/joao-belmiro/clipper/actions

# Clique no workflow mais recente
# Veja rodando em tempo real ✨
```

### 5️⃣ Confirmar na VPS

```bash
# Na VPS, verificar se os arquivos foram copiados
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
# 3. Nginx serve o site no domínio configurado
```

## 🔍 Verificar que Está Funcionando

```bash
# 1. Na VPS, ver os arquivos
ls -lh /opt/nginx/html/retro-clipper/ | head -10

# 2. Contar arquivos
find /opt/nginx/html/retro-clipper -type f | wc -l

# 3. Ver tamanho
du -sh /opt/nginx/html/retro-clipper/

# 4. Testar acesso pelo domínio configurado no Nginx
curl https://retrocore.dev/retro-clipper/
# Deve retornar o HTML ✅
```

## 🌐 No Navegador

```
https://retrocore.dev/retro-clipper/
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
| "Permission denied" | Confira `VPS_HOST`, `VPS_USER` e se a chave pública correspondente está em `~/.ssh/authorized_keys` do usuário na VPS. Teste localmente com `ssh -i ~/.ssh/github-actions-vps -o IdentitiesOnly=yes SEU_USUARIO@IP_PUBLICO_DA_VPS`. |
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
