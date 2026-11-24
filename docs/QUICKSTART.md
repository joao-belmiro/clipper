# 🎯 Guia Rápido - Deploy Automático Clipper

**TL;DR**: Adicione 4 secrets no GitHub, faça um push, e seu site será buildado e enviado para a VPS automaticamente.

---

## 📋 O Que Foi Criado Para Você

| Arquivo | Propósito |
|---------|-----------|
| `.github/workflows/deploy.yml` | Workflow GitHub Actions que faz build e deploy |
| `docs/README.md` | Índice da documentação |
| `docs/QUICK_SETUP.md` | Setup em 5 passos (comece aqui!) |
| `docs/DEPLOYMENT.md` | Documentação completa e troubleshooting |
| `docs/IMPLEMENTATION_GUIDE.md` | Passo a passo visual |
| `docs/WEB_SERVER_CONFIG.md` | Configurações Nginx/Apache/Caddy |

---

## 🚀 Setup em 10 Minutos

### 1️⃣ Preparar SSH

```bash
# Sua máquina local
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@seu-vps.com
ssh usuario@seu-vps.com  # Teste: deve logar sem senha
```

### 2️⃣ Preparar VPS

```bash
# Na VPS
mkdir -p /var/www/clipper
chmod 755 /var/www/clipper
```

### 3️⃣ Adicionar Secrets no GitHub

GitHub → Settings → Secrets → New Repository Secret

```
VPS_HOST = seu-vps.com
VPS_USER = usuario
VPS_PATH = /var/www/clipper
SSH_PRIVATE_KEY = (cola aqui o conteúdo de ~/.ssh/id_rsa)
```

### 4️⃣ Testar

```bash
# Repositório local
git add .
git commit -m "chore: add deploy automation"
git push origin main

# Depois vá para: github.com/joao-belmiro/clipper/actions
# Veja o workflow rodando! ✨
```

---

## 🎬 O Que Acontece A Cada Push

```
git push origin main
    ↓ GitHub Actions dispara
    ↓ Faz checkout do código
    ↓ Instala dependências (npm ci)
    ↓ Executa build (npm run build)
    ↓ Conecta via SSH com chave privada
    ↓ Faz rsync dos arquivos para VPS
    ↓ Pronto! Site atualizado 🎉
```

**Tempo total**: ~2-3 minutos

---

## 📂 Estrutura Criada

```
seu-projeto/
├── .github/
│   └── workflows/
│       └── deploy.yml                    ← Automação
├── docs/
│   ├── README.md                         ← Comece aqui!
│   ├── QUICK_SETUP.md                    ← Setup rápido
│   ├── DEPLOYMENT.md                     ← Ref. completa
│   ├── IMPLEMENTATION_GUIDE.md           ← Passo a passo
│   └── WEB_SERVER_CONFIG.md              ← Config servidor
├── app/
├── package.json
└── nuxt.config.ts
```

---

## 🔐 Segurança

✅ Chave SSH armazenada como secret (criptografado no GitHub)  
✅ SSH keys ao invés de senhas  
✅ Nunca commita secrets no repositório  
✅ Cada operação é logged no GitHub Actions  

Ver `docs/DEPLOYMENT.md` para mais detalhes de segurança.

---

## 🌐 Próximo Passo: Configurar Servidor Web

Depois que o deploy automático estiver funcionando:

```bash
# Na VPS, instale Nginx
sudo apt update && sudo apt install nginx

# Copie a configuração de docs/WEB_SERVER_CONFIG.md
# (Seção Nginx)

# Ou use a mais simples (caddy):
sudo apt install caddy
# Caddy gerencia SSL automaticamente!
```

---

## 📚 Documentação Completa

Cada documento serve um propósito:

- **README.md**: Comece aqui para entender tudo
- **QUICK_SETUP.md**: 5 passos, 10 minutos
- **DEPLOYMENT.md**: Tudo em detalhes + troubleshooting
- **IMPLEMENTATION_GUIDE.md**: Passo a passo visual
- **WEB_SERVER_CONFIG.md**: Nginx/Apache/Caddy config

---

## ⚡ Depois De Pronto

Nunca mais você precisa:
- ❌ Compilar manualmente
- ❌ Copiar arquivos via FTP/SCP
- ❌ SSH na VPS para fazer deploy
- ❌ Testar em produção manualmente

Basta:
- ✅ Fazer `git push`
- ✅ Deploy automático acontece
- ✅ Site atualizado em 2-3 minutos

---

## 🎓 Aprenda Mais

**GitHub Actions**:  
Documentação em: https://docs.github.com/en/actions

**Nuxt Build**:  
Documentação em: https://nuxt.com/docs/guide/concepts/rendering

**SSH Best Practices**:  
Documentação em: https://www.ssh.com/ssh/best-practices/

---

## 🆘 Precisa de Ajuda?

| Situação | Ir Para |
|----------|---------|
| Estou completamente perdido | docs/README.md |
| Quero implementar agora | docs/QUICK_SETUP.md |
| Erro ao fazer deploy | docs/DEPLOYMENT.md → Troubleshooting |
| Como configurar servidor | docs/WEB_SERVER_CONFIG.md |
| Quero entender tudo | docs/DEPLOYMENT.md |

---

## ✅ Checklist Final

- [ ] SSH configurado (consegue logar sem senha)
- [ ] VPS preparada (diretório criado)
- [ ] GitHub Secrets adicionados (4 secrets)
- [ ] Workflow rodou (viu em Actions)
- [ ] Arquivos na VPS (confirmou via SSH)
- [ ] Servidor web configurado (opcional, mas recomendado)
- [ ] Site live na VPS ✨

---

**Status**: Pronto para produção  
**Tempo de setup**: 10-30 minutos  
**Tempo economizado por deploy**: 10+ minutos  
**Número de etapas reduzidas**: De 5-6 para 1 (git push)  

🚀 **Bora começar!**
