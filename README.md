# Louise Doces 🧁

Landpage institucional de uma mini doceria artesanal.

## Estrutura

```
├── index.html        # Página única (hero, sobre, produtos, pedido, depoimentos, entrega, FAQ, contato)
├── css/style.css     # Estilos (rosa/creme/chocolate, responsivo, animações)
├── js/main.js        # Menu mobile, filtros, pedido interativo, FAQ, animações
├── robots.txt        # Instruções para robôs do Google
├── sitemap.xml       # Mapa do site para o Google
└── img/              # Imagens dos doces
```

## Como visualizar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## SEO / Google

O `<head>` do `index.html` já inclui: title e description otimizados, canonical,
Open Graph (card do WhatsApp/Instagram), Twitter Card, dados geográficos de
Rorainópolis/RR e dados estruturados JSON-LD (tipo `Bakery`).

Quando o site for publicado, **troque o domínio de exemplo**
(`https://www.lousdoces.com.br`) em:

- `<head>` do `index.html` (canonical, og:*, twitter:*, JSON-LD)
- `robots.txt` (linha `Sitemap:`)
- `sitemap.xml` (linha `<loc>`)

Depois, cadastre o site no [Google Search Console](https://search.google.com/search-console)
e envie o sitemap para indexação. O `og:image` usa `img/hero.jpg` — o ideal é uma
imagem de 1200×630 px.

## Personalizar

- **Nome / slogan / textos** → `index.html`
- **Cores / fontes** → variáveis em `css/style.css` (topo do arquivo)
- **WhatsApp** → trocar `5511999999999` em todos os links `wa.me`
- **Instagram** → trocar o link `instagram.com/louisedoces`
- **Preços e produtos** → seção `#produtos` do `index.html`
- **Imagens** → substituir os arquivos em `img/` mantendo os mesmos nomes
