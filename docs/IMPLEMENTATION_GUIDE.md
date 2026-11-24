# 🎬 Implementação Passo a Passo

Guia visual e interativo para implementação.

## ✨ O que você vai conseguir

Depois de seguir esses passos:

```
Seu código local
    ↓ git push
GitHub (main branch)
    ↓ GitHub Actions (automático)
Build da aplicação
    ↓ npm run build
Arquivos estáticos em .output/public/
    ↓ rsync via SSH
VPS /var/www/clipper/
    ↓ Nginx/Apache serve
seu-dominio.com (LIVE! 🎉)
```

**Resultado**: Toda vez que você faz `git push`, o site é automaticamente atualizado.

---

## 🏃 Implementação Rápida (10 minutos)

### Fase 1: SSH Setup (Local Computer)

```bash
# 1. Gerar chave SSH se não tiver
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# 2. Copiar para VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@seu-vps.com

# 3. Testar
ssh usuario@seu-vps.com
# Teste: você consegue logar sem senha? ✅
exit
```

### Fase 2: VPS Prep (5 minutos)

```bash
# 1. Logar na VPS
ssh usuario@seu-vps.com

# 2. Criar diretório
mkdir -p /var/www/clipper
chmod 755 /var/www/clipper

# 3. Testar permissões
touch /var/www/clipper/.test
rm /var/www/clipper/.test
# Conseguiu criar arquivo? ✅

# 4. Sair
exit
```

### Fase 3: GitHub Secrets (3 minutos)

1. Vá para: `github.com/joao-belmiro/clipper/settings/secrets/actions`

2. Clique **New repository secret**

3. Adicione 4 secrets:

```yaml
VPS_HOST
Valor: seu-vps.com

VPS_USER
Valor: usuario

VPS_PATH
Valor: /var/www/clipper

SSH_PRIVATE_KEY
Valor: (Cole aqui o conteúdo completo de ~/.ssh/id_rsa)
```

**Como copiar a chave privada:**
```bash
cat ~/.ssh/id_rsa | pbcopy  # macOS
cat ~/.ssh/id_rsa | xclip   # Linux
# Depois cola no secret do GitHub
```

### Fase 4: Testar Deploy (2 minutos)

```bash
# No seu repositório local:
git add .
git commit -m "chore: add deployment automation"
git push origin main

# Depois:
# 1. Vá para github.com/joao-belmiro/clipper/actions
# 2. Clique no workflow mais recente
# 3. Veja rodando em tempo real ✅
# 4. Se der sucesso (green checkmark), deploy funcionou!
```

**Para confirmar na VPS:**
```bash
ssh usuario@seu-vps.com
ls -la /var/www/clipper/
# Você deve ver os arquivos lá! ✨
```

---

## 🔧 Configuração do Servidor Web

Depois que os arquivos estão na VPS, configure o servidor para servir:

### Nginx (Recomendado)

```bash
# 1. Instalar Nginx (se não tiver)
sudo apt update
sudo apt install nginx

# 2. Criar configuração
sudo tee /etc/nginx/sites-available/clipper > /dev/null <<EOF
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/clipper;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 3. Ativar
sudo ln -s /etc/nginx/sites-available/clipper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 4. Testar
curl http://localhost/
```

### Com SSL (Certificado HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado (substitua seu-dominio.com)
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Depois editar a config Nginx para incluir SSL
# (ver WEB_SERVER_CONFIG.md para exemplo completo)
```

---

## 📊 Checklist de Implementação

```
Phase 1: SSH Setup
  ☐ ssh-keygen (gerar chave)
  ☐ ssh-copy-id (copiar para VPS)
  ☐ ssh teste (logar sem senha)

Phase 2: VPS Prep
  ☐ mkdir /var/www/clipper
  ☐ chmod 755 /var/www/clipper
  ☐ Testar permissões

Phase 3: GitHub
  ☐ VPS_HOST secret
  ☐ VPS_USER secret
  ☐ VPS_PATH secret
  ☐ SSH_PRIVATE_KEY secret

Phase 4: Test Deploy
  ☐ git push origin main
  ☐ Ver workflow rodar em Actions
  ☐ Verificar arquivos na VPS

Phase 5: Web Server
  ☐ Instalar Nginx/Apache
  ☐ Configurar vhost
  ☐ Certificado SSL (opcional mas recomendado)
  ☐ Testar acesso via navegador

✅ DONE! Deploy automático funcionando!
```

---

## 🎓 Próximas Implementações (Opcional)

Depois que tudo está funcionando, você pode adicionar:

### 1. Notificações via Slack

Editar `.github/workflows/deploy.yml` e adicionar:

```yaml
- name: Notify Slack on Success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "✅ Deploy de Clipper concluído com sucesso!"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

Adicione o secret `SLACK_WEBHOOK_URL` com seu webhook do Slack.

### 2. Deploy em Múltiplas Branches

Editar `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: 
      - main
      - staging
      - production
```

### 3. Adicionar Testes Antes do Deploy

Editar `.github/workflows/deploy.yml`:

```yaml
- name: Run Tests
  run: npm test

- name: Run Linter
  run: npm run lint
```

### 4. Adicionar Versioning/Releases

```bash
# No repositório local
git tag v1.0.0
git push origin v1.0.0
# O workflow pode detectar tags e fazer builds diferentes
```

---

## 🚨 Problemas Frequentes

| Problema | Solução |
|----------|---------|
| SSH falha com "Permission denied" | Verifique se a chave pública está em `~/.ssh/authorized_keys` na VPS |
| GitHub Actions falha com "rsync not found" | Na VPS: `sudo apt install rsync` |
| Pode fazer push mas site não atualiza | Verifique se VPS_PATH está correto e permissões da pasta |
| Vê "index of /" ao invés do site | Configure `index.html` como arquivo padrão no servidor web |
| CSS/JS não carregam corretamente | Verifique `baseURL` em `nuxt.config.ts` |

Ver **DEPLOYMENT.md** para troubleshooting detalhado.

---

## 📈 Monitoramento Contínuo

```bash
# Ver logs do último deploy
ssh usuario@seu-vps.com
tail -f /var/log/nginx/access.log  # Nginx
tail -f /var/log/apache2/error.log  # Apache

# Ver tamanho dos arquivos
du -sh /var/www/clipper/

# Contar arquivos
find /var/www/clipper -type f | wc -l

# Ver permissões
ls -la /var/www/clipper/
```

---

## 🎉 Parabéns!

Você agora tem:

✅ Build automático  
✅ Deploy automático  
✅ Site live na VPS  
✅ Atualizações instantâneas com `git push`

**Tempo investido**: ~30-45 minutos  
**Tempo economizado por deploy**: 10+ minutos  
**Facilidade de rollback**: 1 comando Git  

---

## 📚 Documentos Relacionados

- **QUICK_SETUP.md** - Setup rápido (este é o resumo)
- **DEPLOYMENT.md** - Referência completa
- **WEB_SERVER_CONFIG.md** - Configurações de servidor
- **.github/workflows/deploy.yml** - O workflow automático

---

**Dúvidas?** Veja DEPLOYMENT.md para documentação completa.

**Pronto para começar?** Execute Fase 1 acima! 🚀
