# SEO do Clipper

## Implementado

- Título e meta description direcionados a "free online clipboard manager".
- Canonical e URLs Open Graph para `https://retrocore.dev/retro-clipper/`.
- Imagem social 1200 × 630 em `/retro-clipper/og-image.png`.
- H1 descritivo e conteúdo HTML visível sobre recursos, armazenamento local e perguntas frequentes.
- Sitemap estático do app em `/retro-clipper/sitemap.xml`.

## Publicar o sitemap na raiz do domínio

O projeto Clipper é publicado em `/retro-clipper/`, enquanto o `robots.txt` e o sitemap da raiz pertencem ao site principal `retrocore.dev`. O sitemap deste app não consegue atualizar o sitemap mantido fora deste repositório.

Inclua esta URL no sitemap XML da raiz do domínio:

```xml
<url>
  <loc>https://retrocore.dev/retro-clipper/</loc>
</url>
```

O `robots.txt` atual da raiz já aponta para `https://retrocore.dev/sitemap.xml`. Depois de atualizar o sitemap principal, envie-o no Google Search Console e solicite a inspeção da URL do Clipper.

## Verificação após publicar

1. Confirme que `/retro-clipper/sitemap.xml` responde com XML e inclui a URL canônica.
2. Confira o título, canonical, Open Graph e a descrição no HTML da página.
3. Use a inspeção de URL do Google Search Console para verificar rastreamento e indexação.
4. Acompanhe impressões e consultas no Search Console; posições e tráfego dependem também da concorrência, conteúdo e referências externas.
