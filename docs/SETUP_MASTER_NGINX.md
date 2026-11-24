# 🚀 Setup para Branch Master + Nginx na VPS

Guia para configurar a automação da branch `master` com o Nginx da VPS em `/opt/nginx/html/retro-clipper/`.

## 🎯 Configuração Específica

Seu projeto:
- **Branch**: `master` (não main)
- **Destino**: `/opt/nginx/html/retro-clipper/` (na VPS)
- **Método de cópia**: SSH + `cp` ou `rsync`

## ⚙️ Secrets do GitHub

Adicione em: `GitHub Settings → Secrets and variables → Actions`

```yaml
VPS_HOST
Valor: IP público ou hostname da VPS (não use localhost/127.0.0.1)

VPS_USER
Valor: conta SSH da VPS que receberá a chave pública
Nota: Deve ter permissões de escrita em /opt/nginx/html/

VPS_PATH (Alternativa 1 - rsync)
Valor: /opt/nginx/html/retro-clipper
Nota: Usado no workflow deploy.yml

SSH_PRIVATE_KEY
Valor: Conteúdo completo da chave privada dedicada (sem .pub)
Nota: Preserve as linhas BEGIN/END e as quebras de linha
```

## 📂 Dois Workflows Disponíveis

### Opção 1: deploy.yml (Recomendado - rsync)

```bash
# Localização: .github/workflows/deploy.yml
# Trigger: Manual (workflow_dispatch)
# Método: rsync (mais eficiente, copia apenas mudanças)
# Comando: rsync -avz --delete .output/public/ user@host:/opt/nginx/html/retro-clipper/
```

Este workflow é manual para evitar que dois deploys publiquem no mesmo diretório ao mesmo tempo. Ele exige também o Secret `VPS_PATH=/opt/nginx/html/retro-clipper`.

**Vantagens:**
- Mais rápido (copia só mudanças)
- Suporta --delete (remove arquivos deletados)
- Padrão da indústria

**Como usar:**
```bash
# GitHub → Actions → Build & Deploy to VPS → Run workflow
```

### Opção 2: deploy-local.yml (SCP)

```bash
# Localização: .github/workflows/deploy-local.yml
# Trigger automático: Push na branch master; também aceita execução manual
# Método: SSH remove o conteúdo antigo e SCP envia .output/public para a VPS
```

**Vantagens:**
- Mais simples de entender
- Funciona quando a VPS é acessível pelos runners do GitHub

Somente este workflow publica automaticamente em cada push na `master`. `deploy.yml` fica disponível para deploy manual com rsync.

## 🔐 SSH Setup da VPS

Gere uma chave dedicada no Linux local e instale a chave pública na conta correta da VPS. O GitHub Actions roda fora da sua máquina, portanto `VPS_HOST` deve ser o endereço público da VPS, não `localhost` ou `127.0.0.1`.

```bash
# No Linux local
ssh-keygen -t ed25519 -f ~/.ssh/github-actions-vps -C "github-actions-deploy" -N ""

# Instalar a chave pública NA VPS
ssh-copy-id -i ~/.ssh/github-actions-vps.pub SEU_USUARIO@IP_PUBLICO_DA_VPS

# Testar a mesma chave e usuário que serão usados no Actions
ssh -i ~/.ssh/github-actions-vps -o IdentitiesOnly=yes SEU_USUARIO@IP_PUBLICO_DA_VPS
```

## 🛡️ Permissões no Nginx

```bash
# Na VPS; use o nome do usuário definido em VPS_USER
sudo mkdir -p /opt/nginx/html/retro-clipper
sudo chown SEU_USUARIO:SEU_USUARIO /opt/nginx/html/retro-clipper
touch /opt/nginx/html/retro-clipper/.test
rm /opt/nginx/html/retro-clipper/.test
```

## 📋 Passo a Passo

### 1. SSH Setup (sua máquina)

```bash
# Gere uma chave dedicada no Linux local
ssh-keygen -t ed25519 -f ~/.ssh/github-actions-vps -C "github-actions-deploy" -N ""

# Autorize a chave pública no usuário da VPS
ssh-copy-id -i ~/.ssh/github-actions-vps.pub SEU_USUARIO@IP_PUBLICO_DA_VPS

# Teste a conexão antes de configurar os Secrets
ssh -i ~/.ssh/github-actions-vps -o IdentitiesOnly=yes SEU_USUARIO@IP_PUBLICO_DA_VPS
```

### 2. Preparar Nginx (na VPS)

```bash
# Substitua SEU_USUARIO pelo usuário definido em VPS_USER
sudo mkdir -p /opt/nginx/html/retro-clipper
sudo chown SEU_USUARIO:SEU_USUARIO /opt/nginx/html/retro-clipper
```

### 3. GitHub Secrets

GitHub → Settings → Secrets → 3 secrets:

```yaml
VPS_HOST
IP público ou hostname da VPS

VPS_USER
usuário SSH da VPS autorizado para a chave

SSH_PRIVATE_KEY
(conteúdo completo de ~/.ssh/github-actions-vps, sem .pub)
```

`SSH_PRIVATE_KEY` é a chave privada; o arquivo `.pub` é a chave pública e deve estar em `~/.ssh/authorized_keys` do usuário da VPS. Nunca compartilhe nem faça commit da chave privada.

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

# No navegador, use o domínio público configurado no Nginx
https://retrocore.dev/retro-clipper/
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
   └─→ Conecta ao IP público/hostname da VPS com SSH
   └─→ Executa rsync/scp/cp
   └─→ Copia para /opt/nginx/html/retro-clipper/
   ↓
5. Pronto! Site atualizado
   └─→ https://retrocore.dev/retro-clipper/ (LIVE)
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
| "Permission denied (publickey)" | Confira `VPS_USER`, `VPS_HOST` e se a chave pública correspondente está em `~/.ssh/authorized_keys` desse usuário na VPS. Teste com `ssh -i ~/.ssh/github-actions-vps -o IdentitiesOnly=yes SEU_USUARIO@IP_PUBLICO_DA_VPS`. |
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
3. ✅ Acessar no navegador: https://retrocore.dev/retro-clipper/
4. ✅ Fazer mais um push para confirmar que é automático

Depois:
- Monitorar logs do Nginx
- Testar cache (Ctrl+Shift+R)
- Adicionar certificado SSL (se produção)

---

**Branch**: master
**Destino**: /opt/nginx/html/retro-clipper/
**Deploy automático**: SCP (via deploy-local.yml)
**Deploy manual alternativo**: rsync (via deploy.yml)
**Status**: ✅ Pronto para deploy contínuo!
