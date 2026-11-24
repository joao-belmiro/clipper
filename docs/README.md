# 📚 Documentação de Deployment - Índice

Bem-vindo à documentação de automação de deploy do projeto Clipper!

Este diretório contém guias completos para configurar e manter uma automação de build e deploy.

## 🗺️ Guias Disponíveis

### 1. **[QUICK_SETUP.md](./QUICK_SETUP.md)** ⚡ START HERE
Guia resumido com 5 passos principais. Comece por aqui se você quer sair do zero para funcionando em ~10 minutos.

**Tempo estimado**: 5-10 minutos  
**Recomendado para**: Primeira vez

### 2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** 📖 Referência Completa
Documentação detalhada com:
- Explicação de como tudo funciona
- Troubleshooting completo
- Customizações avançadas
- Melhores práticas de segurança

**Tempo estimado**: Leitura rápida 15 min, implantação 15-20 min  
**Recomendado para**: Compreender fundo, troubleshooting

### 3. **[WEB_SERVER_CONFIG.md](./WEB_SERVER_CONFIG.md)** 🌐 Configuração de Servidor
Configurações prontas para Nginx, Apache e Caddy.

**Tempo estimado**: 5-10 minutos  
**Recomendado para**: Depois de fazer deploy, configurar servidor web

### 4. **[.github/workflows/deploy.yml](../.github/workflows/deploy.yml)** ⚙️ Workflow GitHub Actions
O arquivo que faz a automação rodar.

**Comumente editado para**: Mudar branches, versão do Node, adicionar steps

---

## 🚀 Fluxo de Implementação Recomendado

```
┌─────────────────────────────────────────────────────────┐
│ Passo 1: Ler QUICK_SETUP.md (5 min)                    │
├─────────────────────────────────────────────────────────┤
│ Passo 2: Preparar SSH na sua máquina (5 min)           │
├─────────────────────────────────────────────────────────┤
│ Passo 3: Configurar VPS (5 min)                        │
├─────────────────────────────────────────────────────────┤
│ Passo 4: Adicionar Secrets no GitHub (3 min)          │
├─────────────────────────────────────────────────────────┤
│ Passo 5: Fazer primeiro push e testar (3 min)         │
├─────────────────────────────────────────────────────────┤
│ Passo 6: Configurar servidor web com WEB_SERVER_CONFIG │
├─────────────────────────────────────────────────────────┤
│ ✅ Deploy automático funcionando!                      │
└─────────────────────────────────────────────────────────┘
```

**Tempo total**: ~30-45 minutos para primeira implementação

---

## 📋 Arquitetura do Sistema

```
Seu Repositório (GitHub)
│
├── .github/workflows/deploy.yml  ← Automação aqui
│
└── Código do projeto
    └── npm run build  ← Compilação
        └── .output/public/  ← Arquivos estáticos
            └── rsync → SSH → VPS
                        └── /var/www/clipper/  ← Servidor web aqui
                            └── Nginx/Apache serve HTTP/HTTPS
                                └── seu-dominio.com (live! 🎉)
```

---

## 🔐 Segurança - 5 Pontos Importantes

1. ✅ Nunca commit sua chave privada SSH
2. ✅ Use SSH keys ao invés de senhas
3. ✅ Rotacione chaves SSH a cada 6-12 meses
4. ✅ Restrinja permissões do usuário SSH na VPS
5. ✅ Use HTTPS com certificado SSL

Ver: [DEPLOYMENT.md - Segurança](./DEPLOYMENT.md#🛡️-segurança)

---

## 🎯 Funcionalidades Incluídas

| Funcionalidade | Status | Documento |
|----------------|--------|-----------|
| Build automático | ✅ | deploy.yml |
| Deploy via SSH | ✅ | deploy.yml |
| Cache de dependências | ✅ | deploy.yml |
| Trigger manual | ✅ | deploy.yml |
| Múltiplas branches | ⚙️ | DEPLOYMENT.md |
| Notificações | ⚙️ | DEPLOYMENT.md |
| Rollback automático | ⚠️ | - |
| Testes antes do deploy | ⚙️ | DEPLOYMENT.md |

**✅ = Implementado | ⚙️ = Configurável | ⚠️ = Não implementado**

---

## 🆘 Precisa de Ajuda?

| Problema | Ir para |
|----------|---------|
| Estou perdido, não sei por onde começar | QUICK_SETUP.md |
| Erro "Permission denied" | DEPLOYMENT.md → Troubleshooting |
| Erro "Failed to build" | DEPLOYMENT.md → Troubleshooting |
| Como configurar o servidor web | WEB_SERVER_CONFIG.md |
| Quero entender tudo | DEPLOYMENT.md |
| Quero customizar o workflow | DEPLOYMENT.md → Customizações Avançadas |

---

## 📊 Monitoramento

Depois de configurado, você pode:

```bash
# Ver os últimos deploys
https://github.com/joao-belmiro/clipper/actions

# Testar deploy manualmente (via GitHub Actions)
# Vá para Actions → Deploy Workflow → Run workflow

# Ver logs completos
# Actions → Workflow → Ver cada step
```

---

## 🔄 Próximos Passos Após Primeira Implementação

1. **Teste com pequenas mudanças**
   ```bash
   git commit -m "test: small change"
   git push origin main
   # Veja o deploy automático acontecer!
   ```

2. **Configure alertas** (opcional)
   - Slack notifications
   - Email notifications
   - Discord webhooks

3. **Monitore performance**
   - Tempo de deploy
   - Tamanho dos assets
   - Cache hits

4. **Escale conforme necessário**
   - Múltiplas VPS
   - Load balancer
   - CDN para assets

---

## 📝 Versão e Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | Nov 2026 | Versão inicial |

---

## 🤝 Contribuindo

Encontrou um problema? Sugestões?

1. Teste a solução localmente
2. Documente o problema e solução
3. Abra uma issue ou PR

---

## 📚 Referências Externas

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Nuxt.js Deploy Guide](https://nuxt.com/docs/getting-started/deployment)
- [SSH Best Practices](https://www.ssh.com/ssh/best-practices/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Apache Docs](https://httpd.apache.org/docs/)

---

## 🎓 Aprenda Mais

**Se você quer aprofundar em:**

- **GitHub Actions**: DEPLOYMENT.md → Customizações Avançadas
- **SSH/Segurança**: DEPLOYMENT.md → Segurança
- **Servidores Web**: WEB_SERVER_CONFIG.md
- **Nuxt.js Build**: Ver `package.json` scripts

---

**Última atualização**: Novembro 2026  
**Status**: ✅ Pronto para produção

**Tempo para começar**: ~10 minutos com QUICK_SETUP.md
