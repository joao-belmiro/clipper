# 🌐 Configuração de Servidor Web para Deploy Estático

Depois que os arquivos estiverem na sua VPS, configure seu servidor web para servir a aplicação.

## Nginx

### Configuração Básica

```nginx
# /etc/nginx/sites-available/clipper

server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Redireciona HTTP para HTTPS (opcional)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Certificado SSL (usar Let's Encrypt via certbot)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # Raiz do site (deve corresponder a VPS_PATH no GitHub)
    root /var/www/clipper;
    
    # Arquivo padrão
    index index.html;
    
    # Roteamento para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache de assets estáticos (CSS, JS, imagens)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Desabilita cache para HTML
    location ~* \.html?$ {
        expires -1;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }
    
    # Segurança - bloqueia alguns arquivos
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### Ativar a Configuração

```bash
# Na VPS como root
sudo ln -s /etc/nginx/sites-available/clipper /etc/nginx/sites-enabled/
sudo nginx -t  # Testa a sintaxe
sudo systemctl restart nginx
```

### Com SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com
```

---

## Apache

### Configuração Básica

```apache
# /etc/apache2/sites-available/clipper.conf

<VirtualHost *:80>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    
    # Redireciona para HTTPS
    Redirect / https://seu-dominio.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    
    # SSL
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/seu-dominio.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/seu-dominio.com/privkey.pem
    
    # Raiz do site
    DocumentRoot /var/www/clipper
    
    <Directory /var/www/clipper>
        # Permite .htaccess
        AllowOverride All
        
        # Permite acesso
        Require all granted
        
        # Roteamento para SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Cache de assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    # Sem cache para HTML
    <FilesMatch "\.html?$">
        Header set Cache-Control "no-cache, must-revalidate"
    </FilesMatch>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/clipper-error.log
    CustomLog ${APACHE_LOG_DIR}/clipper-access.log combined
</VirtualHost>
```

### Ativar a Configuração

```bash
# Na VPS como root
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod headers
sudo a2ensite clipper
sudo apache2ctl configtest  # Testa a sintaxe
sudo systemctl restart apache2
```

---

## Caddy (Mais Simples)

```caddy
# /etc/caddy/Caddyfile

seu-dominio.com www.seu-dominio.com {
    root * /var/www/clipper
    
    # Servir arquivos estáticos
    file_server
    
    # Roteamento para SPA
    try_files {path} /index.html
    
    # Compressão
    encode gzip
    
    # Cache headers
    @static {
        path_regexp \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$
    }
    
    header @static Cache-Control "max-age=31536000, public"
    header !@static Cache-Control "no-cache, must-revalidate"
}
```

Reiniciar:
```bash
sudo systemctl restart caddy
```

---

## 🔧 Checklist Pós-Deploy

Depois de configurar o servidor:

```bash
# 1. Verificar se os arquivos estão lá
ls -la /var/www/clipper/

# 2. Verificar permissões
chmod 755 /var/www/clipper
chmod 644 /var/www/clipper/*

# 3. Testar o servidor web
curl http://localhost/
# Ou: curl -v http://localhost/

# 4. Ver logs de erro
tail -f /var/log/nginx/error.log  # Nginx
tail -f /var/log/apache2/error.log  # Apache
tail -f /var/log/caddy/caddy.log  # Caddy

# 5. Verificar porta 80/443 aberta
netstat -tlnp | grep LISTEN
```

---

## 📋 Variáveis a Customizar

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `seu-dominio.com` | `clipper.example.com` | Seu domínio |
| `seu-vps.com` | `192.168.1.100` | IP ou hostname da VPS |
| `/var/www/clipper` | `/home/deploy/apps/clipper` | Caminho no VPS (deve ser o `VPS_PATH` do GitHub) |
| `usuario` | `deploy` | Usuário SSH |

---

## 🔐 Certificado SSL com Let's Encrypt

### Nginx (Automático com Certbot)

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### Apache

```bash
sudo certbot --apache -d seu-dominio.com -d www.seu-dominio.com
```

### Manual/Caddy

Caddy gerencia certificados automaticamente!

```bash
# Caddy renovará certificados automaticamente
sudo systemctl restart caddy
```

---

## 🚀 Monitorar Depois do Deploy

```bash
# Ver tamanho dos arquivos
du -sh /var/www/clipper/

# Contar arquivos
find /var/www/clipper -type f | wc -l

# Ver os principais diretórios
ls -lh /var/www/clipper/
```

---

## 💡 Troubleshooting

| Problema | Solução |
|----------|---------|
| Página exibe diretórios ao invés do site | Configure `index.html` como padrão; verifique permissões |
| 404 ao recarregar página | Configure roteamento SPA no servidor (try_files, RewriteRule, etc) |
| Arquivos não carregam (CSS/JS) | Verifique `baseURL` em `nuxt.config.ts` |
| Certificado SSL inválido | Regenere com `certbot renew --force-renewal` |

---

## 📝 Resumo do Fluxo Completo

```
1. GitHub Actions faz push na main
2. ↓ Build da aplicação
3. ↓ Rsync copia para VPS em /var/www/clipper
4. ↓ Nginx/Apache/Caddy serve os arquivos
5. ✅ Site live em seu-dominio.com
```

**Total**: ~2-3 minutos do push ao site atualizado!

---

Escolha o servidor que mais se adequa ao seu ambiente. Nginx é a escolha mais popular por performance, mas Caddy é mais simples de configurar.
