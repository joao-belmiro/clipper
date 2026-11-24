# 🚀 Setup para Branch Master + Nginx Local

Guia para configurar a automação com a branch `master` e usando `/opt/nginx/html/retro-clipper/` como destino.

## 🎯 Configuração Específica

Seu projeto:
- **Branch**: `master` (não main)
- **Destino**: `/opt/nginx/html/retro-clipper/` (Nginx local)
- **Método de cópia**: SSH + `cp` ou `rsync`

## ⚙️ Secrets do GitHub

Adicione em: `GitHub Settings → Secrets and variables → Actions`

```yaml
VPS_HOST
Valor: 127.0.0.1 (ou seu IP/hostname)
Nota: Se for local, pode ser localhost ou o IP da sua máquina

VPS_USER
Valor: seu-usuario (mesmo usuário que roda Nginx)
Nota: Deve ter permissões em /opt/nginx/html/

VPS_PATH (Alternativa 1 - rsync)
Valor: /opt/nginx/html/retro-clipper
Nota: Usado no workflow deploy.yml

SSH_PRIVATE_KEY
Valor: (Conteúdo completo de ~/.ssh/id_rsa)
Nota: Inclua as linhas -----BEGIN e -----END
```

## 📂 Dois Workflows Disponíveis

### Opção 1: deploy.yml (Recomendado - rsync)

```bash
# Localização: .github/workflows/deploy.yml
# Trigger: Push na branch master
# Método: rsync (mais eficiente, copia apenas mudanças)
# Comando: rsync -avz --delete .output/public/ user@host:/opt/nginx/html/retro-clipper/
```

**Vantagens:**
- Mais rápido (copia só mudanças)
- Suporta --delete (remove arquivos deletados)
- Padrão da indústria

**Como usar:**
```bash
git push origin master
# GitHub Actions dispara automaticamente
# Workflow: deploy.yml
```

### Opção 2: deploy-local.yml (Alternative - scp + cp)

```bash
# Localização: .github/workflows/deploy-local.yml
# Trigger: Push na branch master
# Método: scp (copia arquivos) + ssh + cp (copia local)
# Comando: 
#   1. SSH: rm -rf /opt/nginx/html/retro-clipper/*
#   2. SCP: Copia .output/public/* para VPS
#   3. SSH: cp move arquivos para destino final
```

**Vantagens:**
- Mais simples de entender
- Funciona bem em redes locais

**Para usar (se preferir):**
```bash
# Renomear o workflow
mv .github/workflows/deploy.yml .github/workflows/deploy-rsync.yml
mv .github/workflows/deploy-local.yml .github/workflows/deploy.yml

git push origin master
# GitHub Actions usa deploy-local.yml
```

## 🔐 SSH Setup para Localhost/Local

Se está usando localmente (127.0.0.1):

```bash
# Sua máquina
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Autorizar sua própria máquina
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Testar
ssh localhost
# Deve logar sem senha ✅
```

## 🛡️ Permissões no Nginx

```bash
# No seu servidor (pode ser localhost)

# Criar diretório se não existir
mkdir -p /opt/nginx/html/retro-clipper

# Dar permissões apropriadas
# (assumindo que você/seu usuário SSH roda Nginx)
chmod 755 /opt/nginx/html/retro-clipper

# Testar permissões
touch /opt/nginx/html/retro-clipper/.test
rm /opt/nginx/html/retro-clipper/.test
# Deve funcionar sem erro ✅
```

## 📋 Passo a Passo

### 1. SSH Setup (sua máquina)

```bash
# Se ainda não tem SSH com localhost
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Testar
ssh localhost
exit
```

### 2. Preparar Nginx (sua máquina)

```bash
# Criar/confirmar diretório
mkdir -p /opt/nginx/html/retro-clipper
chmod 755 /opt/nginx/html/retro-clipper

# Testar permissões
ls -la /opt/nginx/html/ | grep retro-clipper
```

### 3. GitHub Secrets

GitHub → Settings → Secrets → 3 secrets:

```yaml
VPS_HOST
127.0.0.1

VPS_USER
seu-usuario-local

SSH_PRIVATE_KEY
(copia de ~/.ssh/id_rsa)
```

### 4. Testar Deploy

```bash
git push origin master

# Ver em: github.com/joao-belmiro/clipper/actions
# Esperar ~2-3 minutos
# Verificar se arquivos foram copiados:
ls -la /opt/nginx/html/retro-clipper/
```

## ✅ Verificar Deploy

```bash
# Verificar arquivos
ls -la /opt/nginx/html/retro-clipper/

# Ver tamanho
du -sh /opt/nginx/html/retro-clipper/

# Contar arquivos
find /opt/nginx/html/retro-clipper -type f | wc -l

# Ver permissões
ls -la /opt/nginx/html/retro-clipper/index.html
```

## 🌐 Verificar no Nginx

```bash
# Teste local
curl http://localhost/retro-clipper/

# Ou no navegador
http://localhost/retro-clipper/
http://127.0.0.1/retro-clipper/
```

## 🔄 Fluxo Completo

```
1. Você faz git push origin master
   ↓
2. GitHub Actions dispara (branch master)
   ↓
3. Build: npm run build
   └─→ Gera arquivos em .output/public/
   ↓
4. Deploy SSH
   └─→ Conecta em 127.0.0.1 com SSH
   └─→ Executa rsync/scp/cp
   └─→ Copia para /opt/nginx/html/retro-clipper/
   ↓
5. Pronto! Site atualizado
   └─→ http://localhost/retro-clipper/ (LIVE)
```

**Tempo total**: ~2-3 minutos

## 📊 Logs

Ver o que está acontecendo:

1. **GitHub Actions**: github.com/joao-belmiro/clipper/actions
2. **Clique no workflow mais recente**
3. **Veja cada step sendo executado em tempo real**

Logs importantes:
- ✅ Build application (40-60 seg)
- ✅ Deploy to Nginx (10-30 seg)
- ✅ All green = Sucesso! ✨

## 🆘 Troubleshooting

| Erro | Solução |
|------|---------|
| "Permission denied (publickey)" | SSH não está configurado. Rodou `ssh localhost` com sucesso? |
| "Directory not found" | `/opt/nginx/html/retro-clipper/` não existe. Crie com `mkdir -p` |
| "rsync command not found" | SSH na VPS falhou. Testar: `ssh VPS_USER@VPS_HOST "which rsync"` |
| Arquivos não aparecem | Verificar permissões: `ls -la /opt/nginx/html/retro-clipper/` |
| Nginx não serve | Verificar `baseURL` em `nuxt.config.ts` (deve ser `/retro-clipper/`) |

## 📝 Nuxt Config

Verifique se seu `nuxt.config.ts` tem:

```typescript
export default defineNuxtConfig({
  app: {
    baseURL: '/retro-clipper/',  // ← Importante!
    // ... resto da config
  },
});
```

Se mudar o `baseURL`, precisa fazer rebuild!

## 🎯 Próximos Passos

1. ✅ Testar primeiro deploy
2. ✅ Confirmar arquivos em `/opt/nginx/html/retro-clipper/`
3. ✅ Acessar no navegador: http://localhost/retro-clipper/
4. ✅ Fazer mais um push para confirmar que é automático

Depois:
- Monitorar logs do Nginx
- Testar cache (Ctrl+Shift+R)
- Adicionar certificado SSL (se produção)

---

**Branch**: master  
**Destino**: /opt/nginx/html/retro-clipper/  
**Método**: rsync (via deploy.yml) ou scp (via deploy-local.yml)  
**Status**: ✅ Pronto para deploy contínuo!
