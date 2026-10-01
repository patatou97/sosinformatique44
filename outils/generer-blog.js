#!/usr/bin/env node
/* Génère les pages du blog à partir des articles publiés dans le CRM.
 *
 *   - blog/<slug>.html : une page par article, servie à l'adresse /blog/<slug> (Caddy : try_files)
 *                        — la même adresse que celle annoncée par le CRM (canonical, sitemap)
 *   - blog.html        : la liste des articles, entre les marqueurs ARTICLES:DEBUT / ARTICLES:FIN
 *   - sitemap.xml      : les adresses des articles, entre les marqueurs BLOG:DEBUT / BLOG:FIN
 *
 * Sur le VPS, lancé chaque heure par cron :
 *   SITE_DIR=/opt/sosinformatique44 BLOG_API=http://127.0.0.1:3002/api/blog/public/articles node generer-blog.js
 * En local (sans variables) : écrit dans le dossier du site, lit l'API publique du CRM.
 *
 * Pour retirer un article du site : le passer en « archivé » dans le CRM.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = process.env.SITE_DIR || path.resolve(__dirname, '..');
const BLOG_API = process.env.BLOG_API || 'https://crm.sos-informatique44.fr/api/blog/public/articles';
const CRM_PUBLIC = 'https://crm.sos-informatique44.fr';
const SITE = 'https://sos-informatique44.fr';
const AUTEUR = 'Patrick Pied';

const CATEGORIES = {
  pc: 'PC Windows', mac: 'Apple', phone: 'iPhone/iPad', security: 'Sécurité', data: 'Données',
  qualire: 'QualiRépar', micro: 'Micro-soudure', trends: 'Tendances',
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const dateFr = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
const dateIso = (iso) => new Date(iso).toISOString();
const dateJour = (iso) => dateIso(iso).slice(0, 10);

function imageUrl(art) {
  const u = art.image_url || '';
  if (u.startsWith('/api/')) return CRM_PUBLIC + u;
  if (/^https:\/\//.test(u)) return u;
  return '';
}

/* Contenu rédigé par l'IA du CRM : on ne garde que les balises de mise en forme. */
const BALISES = new Set(['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'br', 'a']);
function nettoyer(html) {
  return String(html || '')
    .replace(/<(script|style|iframe|object|embed|form)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-zA-Z0-9]+)\b[^>]*>/g, (tag, nom) => {
      nom = nom.toLowerCase();
      if (!BALISES.has(nom)) return '';
      if (tag.startsWith('</')) return nom === 'br' ? '' : `</${nom}>`;
      if (nom === 'a') {
        const m = tag.match(/\shref\s*=\s*"((?:https?:\/\/|\/|tel:)[^"]*)"/i);
        if (!m) return '<a>';
        const externe = /^https?:/i.test(m[1]) && !m[1].startsWith(SITE);
        return `<a href="${esc(m[1])}"${externe ? ' target="_blank" rel="noopener noreferrer"' : ''}>`;
      }
      return `<${nom}>`;
    });
}

function extrait(art) {
  if (art.excerpt) return art.excerpt;
  const t = String(art.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > 150 ? t.slice(0, 148) + '…' : t;
}

/* Les pages d'article sont dans /blog/ : les liens relatifs du gabarit doivent partir de la racine. */
function liensDepuisRacine(html) {
  return html.replace(/(\s(?:href|src)=")(?!https?:|\/|#|mailto:|tel:|data:|javascript:)([^"]*)"/g, '$1/$2"');
}

function remplacerEntre(texte, debut, fin, contenu) {
  const a = texte.indexOf(debut);
  const b = texte.indexOf(fin, a);
  if (a === -1 || b === -1) throw new Error(`Marqueurs ${debut} / ${fin} introuvables`);
  return texte.slice(0, a + debut.length) + contenu + texte.slice(b);
}

function remplacerMeta(html, motif, valeur) {
  if (!motif.test(html)) throw new Error(`Balise introuvable dans le gabarit : ${motif}`);
  return html.replace(motif, (m, avant, apres) => avant + esc(valeur) + apres);
}

const STYLE_ARTICLE = `<style>
.article-wrap{max-width:760px;margin:0 auto;padding:120px 16px 64px}
.article-crumbs{font-size:.8125rem;color:var(--text-muted);margin-bottom:18px}
.article-crumbs a{color:var(--text-secondary);text-decoration:none}
.article-crumbs a:hover{color:var(--blue)}
.article-wrap h1{font-family:var(--font-heading);font-size:clamp(1.75rem,4vw,2.5rem);line-height:1.2;color:var(--text);margin-bottom:14px}
.article-meta{color:var(--text-secondary);font-size:.9375rem;margin-bottom:28px}
.article-hero{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:var(--radius);margin-bottom:32px;background:var(--bg-alt)}
.article-body{color:var(--text);font-size:1.0625rem;line-height:1.75}
.article-body h2{font-family:var(--font-heading);font-size:1.5rem;margin:40px 0 14px;color:var(--text)}
.article-body h3{font-family:var(--font-heading);font-size:1.1875rem;margin:28px 0 10px;color:var(--text)}
.article-body p,.article-body ul,.article-body ol{margin-bottom:18px}
.article-body ul,.article-body ol{padding-left:24px}
.article-body li{margin-bottom:6px}
.article-body a{color:var(--blue)}
.article-body blockquote{border-left:4px solid var(--blue);background:var(--bg-alt);padding:16px 20px;margin:28px 0;border-radius:0 var(--radius-sm) var(--radius-sm) 0}
.article-cta{margin-top:44px;padding:28px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-alt)}
.article-cta h2{font-family:var(--font-heading);font-size:1.25rem;margin-bottom:8px;color:var(--text)}
.article-cta p{color:var(--text-secondary);margin-bottom:18px}
.article-cta-btns{display:flex;flex-wrap:wrap;gap:12px}
.article-cta .btn-whatsapp{background:#0B7A3E;color:#fff}
.article-cta .btn-whatsapp:hover{background:#096632;color:#fff}
.article-back{margin-top:32px}
.article-back a{color:var(--blue);font-weight:600;text-decoration:none}
</style>`;

function pageArticle(gabarit, art) {
  const url = `${SITE}/blog/${art.slug}`;
  const titreSeo = art.seo_title || `${art.title} | SOS Informatique 44`;
  const description = art.seo_description || extrait(art);
  const img = imageUrl(art);
  const imgPartage = img || `${SITE}/og-image.jpg`;
  const categorie = CATEGORIES[art.category] || 'Tech';

  let html = gabarit;
  html = remplacerMeta(html, /(<title>)[^<]*(<\/title>)/, titreSeo);
  html = remplacerMeta(html, /(<meta name="description" content=")[^"]*(")/, description);
  html = remplacerMeta(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  html = remplacerMeta(html, /(<meta property="og:type" content=")[^"]*(")/, 'article');
  html = remplacerMeta(html, /(<meta property="og:title" content=")[^"]*(")/, titreSeo);
  html = remplacerMeta(html, /(<meta property="og:description" content=")[^"]*(")/, description);
  html = remplacerMeta(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = remplacerMeta(html, /(<meta property="og:image" content=")[^"]*(")/, imgPartage);
  html = remplacerMeta(html, /(<meta name="twitter:title" content=")[^"]*(")/, titreSeo);
  html = remplacerMeta(html, /(<meta name="twitter:description" content=")[^"]*(")/, description);
  html = remplacerMeta(html, /(<meta name="twitter:image" content=")[^"]*(")/, imgPartage);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: art.title,
    description,
    datePublished: dateIso(art.published_at),
    dateModified: dateIso(art.published_at),
    inLanguage: 'fr-FR',
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: AUTEUR, url: `${SITE}/a-propos.html` },
    publisher: { '@type': 'Organization', name: 'SOS Informatique 44', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/logo-sos.webp` } },
    ...(img ? { image: img } : {}),
  };
  const fil = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog.html` },
      { '@type': 'ListItem', position: 3, name: art.title, item: url },
    ],
  };
  const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
  html = html.replace('</head>', `${ld(jsonLd)}\n${ld(fil)}\n${STYLE_ARTICLE}\n</head>`);

  const corps = `<main id="main">
<article class="article-wrap">
  <nav class="article-crumbs" aria-label="Fil d'Ariane"><a href="/">Accueil</a> › <a href="/blog.html">Blog</a> › ${esc(categorie)}</nav>
  <h1>${esc(art.title)}</h1>
  <p class="article-meta">Par <strong>${AUTEUR}</strong>, SOS Informatique 44 · Publié le <time datetime="${dateIso(art.published_at)}">${dateFr(art.published_at)}</time></p>
  ${img ? `<img class="article-hero" src="${esc(img)}" alt="${esc(art.title)}" width="1200" height="675" decoding="async" referrerpolicy="no-referrer">` : ''}
  <div class="article-body">
${nettoyer(art.content)}
  </div>
  <aside class="article-cta">
    <h2>Un souci avec votre appareil ?</h2>
    <p>Apportez-le à l'atelier, 27 rue de la Vrière à La Chapelle-sur-Erdre, ou décrivez-nous la panne : on vous répond avec un devis avant toute intervention.</p>
    <div class="article-cta-btns">
      <a href="tel:0285523814" class="btn btn-blue">Appeler le 02 85 52 38 14</a>
      <a href="https://wa.me/33658458091?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20une%20r%C3%A9paration" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" data-wa>WhatsApp</a>
    </div>
  </aside>
  <p class="article-back"><a href="/blog.html">← Tous les articles</a></p>
</article>
</main>`;
  const a = html.indexOf('<main id="main">');
  const b = html.indexOf('</main>', a);
  if (a === -1 || b === -1) throw new Error('<main id="main"> introuvable dans le gabarit');
  html = html.slice(0, a) + corps + html.slice(b + '</main>'.length);
  return liensDepuisRacine(html);
}

function carte(art) {
  const img = imageUrl(art);
  const lien = `blog/${art.slug}`;
  const cat = CATEGORIES[art.category] ? art.category : 'trends';
  return `<article class="blog-card" data-category="${cat}" id="article-${esc(art.slug)}">
  <a class="blog-card-img${img ? '' : ' bg-gradient-blog'}" href="${lien}" tabindex="-1" aria-hidden="true"${img ? ' style="padding:0"' : ''}>${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;display:block">` : ''}</a>
  <div class="blog-card-body">
    <span class="blog-card-tag">${esc(CATEGORIES[cat])}</span>
    <h2 class="blog-card-title"><a href="${lien}">${esc(art.title)}</a></h2>
    <p class="blog-card-excerpt">${esc(extrait(art))}</p>
    <div class="blog-card-footer">
      <time class="blog-card-date" datetime="${dateJour(art.published_at)}">${dateFr(art.published_at)}</time>
      <a class="blog-card-toggle" href="${lien}">Lire l'article</a>
    </div>
  </div>
</article>`;
}

function ecrireSiChange(fichier, contenu) {
  if (fs.existsSync(fichier) && fs.readFileSync(fichier, 'utf8') === contenu) return false;
  const tmp = `${fichier}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, contenu);
  fs.renameSync(tmp, fichier);
  return true;
}

async function main() {
  const rep = await fetch(BLOG_API, { signal: AbortSignal.timeout(20000) });
  if (!rep.ok) throw new Error(`API du CRM : HTTP ${rep.status}`);
  const brut = await rep.json();
  if (!Array.isArray(brut)) throw new Error('API du CRM : réponse inattendue');
  const articles = brut
    .filter((a) => a && a.title && a.content && a.published_at && /^[a-z0-9-]+$/.test(a.slug || ''))
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  /* Sécurité : une API vide ou en panne ne doit jamais effacer le blog. */
  if (articles.length === 0) throw new Error('Aucun article publié reçu : rien n\'est modifié');

  const fichierBlog = path.join(SITE_DIR, 'blog.html');
  const blog = fs.readFileSync(fichierBlog, 'utf8');

  const dossier = path.join(SITE_DIR, 'blog');
  fs.mkdirSync(dossier, { recursive: true });
  const attendus = new Set();
  let modifies = 0;
  for (const art of articles) {
    const nom = `${art.slug}.html`;
    attendus.add(nom);
    if (ecrireSiChange(path.join(dossier, nom), pageArticle(blog, art))) modifies++;
  }
  let retires = 0;
  for (const nom of fs.readdirSync(dossier)) {
    if (nom.endsWith('.html') && !attendus.has(nom)) { fs.unlinkSync(path.join(dossier, nom)); retires++; }
  }

  const n = articles.length;
  let nouveauBlog = remplacerEntre(blog, '<!-- ARTICLES:DEBUT -->', '<!-- ARTICLES:FIN -->', `\n${articles.map(carte).join('\n')}\n`);
  nouveauBlog = remplacerEntre(nouveauBlog, '<!-- COMPTE:DEBUT -->', '<!-- COMPTE:FIN -->', n === 1 ? '1 article' : `${n} articles`);
  if (ecrireSiChange(fichierBlog, nouveauBlog)) modifies++;

  const fichierPlan = path.join(SITE_DIR, 'sitemap.xml');
  let plan = fs.readFileSync(fichierPlan, 'utf8');
  const debutPlan = '<!-- BLOG:DEBUT (généré par outils/generer-blog.js) -->';
  if (!plan.includes(debutPlan)) plan = plan.replace('</urlset>', `  ${debutPlan}\n  <!-- BLOG:FIN -->\n</urlset>`);
  const urls = articles.map((a) => `  <url>\n    <loc>${SITE}/blog/${a.slug}</loc>\n    <lastmod>${dateJour(a.published_at)}</lastmod>\n    <changefreq>yearly</changefreq>\n  </url>`).join('\n');
  plan = remplacerEntre(plan, debutPlan, '  <!-- BLOG:FIN -->', `\n${urls}\n`);
  if (ecrireSiChange(fichierPlan, plan)) modifies++;

  console.log(`${new Date().toISOString()} blog : ${n} articles, ${modifies} fichier(s) mis à jour, ${retires} page(s) retirée(s)`);
}

main().catch((err) => {
  console.error(`${new Date().toISOString()} ERREUR blog : ${err.message}`);
  process.exit(1);
});
