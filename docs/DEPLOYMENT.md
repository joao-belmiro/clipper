# 🚀 Automação de Deploy com GitHub Actions

Guia completo para configurar uma automação que faz build do projeto e copia os arquivos estáticos para uma VPS.

## Visão Geral

Este workflow realiza as seguintes operações:

1. **Build automático**: Compila o projeto Nuxt quando há push na branch `main`
2. **Geração de estáticos**: Gera os arquivos estáticos prontos para produção
3. **Deploy em VPS**: Copia os arquivos gerados para sua VPS via SSH
4. **Notificações**: Informa o status do deploy

## 📋 Pré-requisitos

Antes de começar, você precisará:

- Uma VPS com SSH habilitado
- Um usuário SSH com permissões de escrita no diretório de destino
- Credenciais SSH (chave privada) para acesso à VPS
- Repositório no GitHub

## 🔐 Configurando Credenciais no GitHub

### 1. Preparar a Chave SSH (na sua máquina local)

Se você já tem uma chave SSH:
```bash
cat ~/.ssh/id_rsa
```

Se não tem, crie uma:
```bash
ssh-keygen -t rsa -b 4096 -C "seu-email@example.com" -f ~/.ssh/id_rsa -N ""
```

### 2. Adicionar a Chave Pública à VPS

```bash
# Copie a chave pública para a VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@seu-vps.com

# Ou manualmente:
cat ~/.ssh/id_rsa.pub | ssh usuario@seu-vps.com 'cat >> ~/.ssh/authorized_keys'
```

### 3. Adicionar Secrets no GitHub

No repositório GitHub:
1. Vá para **Settings → Secrets and variables → Actions**
2. Clique em **New repository secret** e adicione:

| Secret Name | Valor |
|------------|-------|
| `VPS_HOST` | `seu-vps.com` |
| `VPS_USER` | `usuario` |
| `VPS_PATH` | `/caminho/para/deploy` |
| `SSH_PRIVATE_KEY` | Conteúdo completo da sua chave privada (`~/.ssh/id_rsa`) |

#### Exemplo de como copiar a chave privada:
```bash
# macOS/Linux
cat ~/.ssh/id_rsa | pbcopy  # macOS
cat ~/.ssh/id_rsa | xclip   # Linux

# Depois cola no campo do secret do GitHub
```

## ⚙️ Workflow GitHub Actions

O workflow está em `.github/workflows/deploy.yml` e automatiza:

```yaml
# Trigger: Push na branch main
# Actions:
# 1. Checkout do código
# 2. Setup Node.js
# 3. Instalação de dependências
# 4. Build da aplicação
# 5. Deploy via SSH para a VPS
```

### Personalizações Disponíveis

Você pode editar o arquivo `deploy.yml` para:

- **Mudar a branch de deploy**: Linha `branches: [main]`
- **Escolher versão do Node**: Linha `node-version: 24`
- **Mudar diretório de origem**: `source-dir: .output/public`
- **Mudar diretório de destino**: Adicionar variável `VPS_PATH_CUSTOM`

## 📦 Estrutura de Arquivos

```
seu-projeto/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Workflow do GitHub Actions
├── docs/
│   └── DEPLOYMENT.md           # Este arquivo
├── app/
├── public/
└── nuxt.config.ts
```

## 🚀 Como Usar

### Primeiro Deploy

1. Configure todas as credenciais conforme descrito acima
2. Faça um commit e push para a branch `main`:
   ```bash
   git add .
   git commit -m "chore: add deployment automation"
   git push origin main
   ```
3. Vá para **Actions** no seu repositório GitHub
4. Veja o workflow rodando em tempo real
5. Verifique seu VPS para confirmar os arquivos foram copiados

### Deploys Subsequentes

Após o primeiro setup, basta fazer push na branch `main`:

```bash
# Faça suas alterações
git add .
git commit -m "feat: sua mudança"
git push origin main
```

O workflow executará automaticamente!

## 📊 Monitorando Deploys

No GitHub:
1. Vá para a aba **Actions**
2. Clique no workflow mais recente
3. Veja os logs de cada step

### Entendendo os Logs

- 🟢 **Green checkmark**: Step completado com sucesso
- 🔴 **Red X**: Erro, verifique os logs
- 🟡 **Yellow circle**: Em progresso

## ⚠️ Troubleshooting

### Erro: "Permission denied (publickey)"

**Causa**: Chave SSH não configurada corretamente

**Solução**:
```bash
# Teste a conexão SSH localmente
ssh -i ~/.ssh/id_rsa usuario@seu-vps.com

# Se falhar, regenere as chaves e adicione novamente
```

### Erro: "Failed to build"

**Causa**: Dependências não instaladas ou erro no código

**Solução**:
```bash
# Teste localmente
npm install
npm run build
```

### Erro: "Failed to deploy"

**Causa**: 
- Caminho incorreto no VPS
- Permissões insuficientes
- Diretório não existe

**Solução**:
```bash
# No VPS, verifique/crie o diretório
ssh usuario@seu-vps.com
mkdir -p /caminho/para/deploy
chmod 755 /caminho/para/deploy
```

## 🔄 Customizações Avançadas

### Deploy em Múltiplas Branches

Edite `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [main, staging, production]
```

### Deploy Apenas em Tags

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Executar Testes Antes do Deploy

Adicione um step no workflow:
```yaml
- name: Run Tests
  run: npm test
```

### Notificação via Slack

Adicione um step ao final:
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deploy completed: ${{ job.status }}"
      }
```

## 📝 Variáveis de Ambiente

Você pode adicionar variáveis de ambiente no workflow:

```yaml
env:
  NODE_ENV: production
  BUILD_PATH: .output/public
```

## 🛡️ Segurança

### Boas Práticas

1. ✅ Nunca commite chaves privadas no repositório
2. ✅ Use SSH keys em vez de senhas
3. ✅ Rotacione as chaves SSH regularmente
4. ✅ Restrinja permissões do usuário SSH na VPS
5. ✅ Use secrets criptografados no GitHub

### Criar Usuário Dedicado na VPS

```bash
# Na VPS como root/sudo
useradd -m -s /bin/bash deploy-user
su - deploy-user
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Adicione a chave pública
# ... (conforme instruções acima)
```

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Key Generation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Nuxt Build Guide](https://nuxt.com/docs/guide/concepts/rendering)
- [Static Deployment](https://nuxt.com/docs/getting-started/deployment)

## 💡 Dicas Úteis

### Ver Status do Último Deploy

```bash
# No repositório local
git log --all --oneline | head -5
# Depois vá ao GitHub Actions para ver o status
```

### Reverter um Deploy

```bash
# Se algo deu errado, reverter é simples:
git revert <commit-hash>
git push origin main
# O novo workflow executará automaticamente
```

### Testar Build Localmente

```bash
# Simule o que o workflow faz
npm install
npm run build
npm run preview  # Visualize os arquivos gerados
```

## 🤝 Suporte

Se encontrar problemas:

1. Verifique os logs no GitHub Actions
2. Teste a conexão SSH manualmente
3. Verifique permissões no VPS
4. Consulte os logs do servidor web na VPS

---

**Última atualização**: Novembro 2026

**Versão**: 1.0.0
