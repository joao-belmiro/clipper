# ⚡ Setup Rápido - Automação de Deploy

Guia resumido para colocar a automação em produção em 5 minutos.

## ✅ Checklist de Setup (Execute na Ordem)

### 1️⃣ Preparar SSH na VPS

```bash
# Na sua máquina local
# Se não tem chave SSH, crie:
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Copie a chave pública para a VPS:
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@seu-vps.com

# Teste a conexão:
ssh usuario@seu-vps.com
```

### 2️⃣ Preparar Diretório na VPS

```bash
# Na sua VPS via SSH:
ssh usuario@seu-vps.com

# Crie o diretório de deploy
mkdir -p /var/www/clipper
chmod 755 /var/www/clipper

# Se tiver um servidor web, aponte para cá
# Nginx: location / { root /var/www/clipper; }
# Apache: DocumentRoot /var/www/clipper
```

### 3️⃣ Obter a Chave Privada SSH

```bash
# No seu computador:
# macOS:
cat ~/.ssh/id_rsa | pbcopy

# Linux:
cat ~/.ssh/id_rsa | xclip -selection clipboard

# Windows (PowerShell):
Get-Content ~/.ssh/id_rsa | Set-Clipboard
```

### 4️⃣ Adicionar Secrets no GitHub

1. Acesse: `https://github.com/joao-belmiro/clipper/settings/secrets/actions`
2. Clique em **New repository secret**
3. Adicione cada secret:

#### Secret 1: `VPS_HOST`
- **Value**: `seu-vps.com` ou `123.45.67.89`

#### Secret 2: `VPS_USER`
- **Value**: `usuario` (seu usuário SSH)

#### Secret 3: `VPS_PATH`
- **Value**: `/var/www/clipper`

#### Secret 4: `SSH_PRIVATE_KEY`
- **Value**: Cole todo o conteúdo da sua chave privada (já copiada no passo 3)
- Inclua as linhas `-----BEGIN RSA PRIVATE KEY-----` e `-----END RSA PRIVATE KEY-----`

### 5️⃣ Testar o Deploy

```bash
# No repositório local:
git add .
git commit -m "chore: add deployment automation"
git push origin main

# Vá para: https://github.com/joao-belmiro/clipper/actions
# Veja o workflow executando em tempo real
```

## 📊 Verificar Status

**Durante o build:**
- Vá para a aba **Actions** no GitHub
- Clique no workflow mais recente
- Acompanhe cada step em tempo real

**Após o build:**
```bash
# Na sua VPS:
ssh usuario@seu-vps.com
ls -la /var/www/clipper/
# Você deve ver os arquivos `.nuxt` e estáticos
```

## 🔗 URLs Importantes

| Item | URL |
|------|-----|
| **Secrets do GitHub** | `https://github.com/joao-belmiro/clipper/settings/secrets/actions` |
| **GitHub Actions** | `https://github.com/joao-belmiro/clipper/actions` |
| **Workflow File** | `https://github.com/joao-belmiro/clipper/blob/main/.github/workflows/deploy.yml` |
| **Documentação Completa** | `./DEPLOYMENT.md` |

## 🚨 Problemas Comuns

| Erro | Solução |
|------|---------|
| `Permission denied (publickey)` | Chave SSH não está correta. Teste: `ssh usuario@seu-vps.com` |
| `Failed to build` | Rode `npm install && npm run build` localmente para ver o erro |
| `rsync: command not found` | Instale rsync na VPS: `sudo apt install rsync` |
| `Connect to server... Connection timeout` | Verifique firewall e porta SSH (padrão: 22) |

## 💾 Pronto para Deploy Automático!

Depois de tudo configurado:

```bash
# Basta fazer push na main
git push origin main
# E pronto! Os arquivos serão buildados e enviados automaticamente
```

---

**Tempo de setup**: ~5-10 minutos  
**Tempo de cada deploy**: ~2-3 minutos  
**Próximos pushes em main**: Deploy automático ✨
