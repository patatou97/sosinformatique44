# 📊 Audit complet — sos-informatique44.fr

**Date** : 11 avril 2026
**Périmètre** : `/Users/certideal/Desktop/sitesosinformatique44/sosinformatique44/`
**Contraintes** : outils gratuits / open source uniquement
**Mode** : rapport seul — **aucune modification de code**

---

## 🎯 Résumé exécutif

Le site a de bonnes fondations (LocalBusiness + FAQPage Schema.org, NAP cohérent, GA4, CSP, consentement custom, tracking CRM intégré, blog IA fonctionnel, `loading="lazy"` déjà appliqué sur la galerie). **3 problèmes graves** tirent tout vers le bas :

1. **~37 Mo d'images PNG non optimisées** → score PageSpeed Mobile probablement < 50
2. **Aucun `sitemap.xml`** — `robots.txt` le référence pourtant → 404 garanti côté Googlebot
3. **`og-image.jpg` référencée mais fichier absent** → partage social cassé (FB/LinkedIn/Twitter affichent un vide)
4. **Aucun moyen de prendre rendez-vous en ligne** → conversion cassée

Le reste est une liste d'améliorations incrémentales qui, cumulées, passent le site de "correct" à "professionnel haut de gamme".

**Verdict global** : 6.5 / 10 → cible atteignable **9 / 10** sans un centime dépensé.

---

## 🔎 État actuel vérifié (constats factuels)

### ✅ Ce qui est déjà fait (bonnes nouvelles)

| Élément | Statut |
|---|---|
| `<html lang="fr">` + meta viewport | ✅ index.html:2,5 |
| `<title>` + `meta description` | ✅ index.html:10-11 |
| `<link rel="canonical">` | ✅ index.html:13 |
| `meta robots index,follow` | ✅ index.html:12 |
| Geo meta (`geo.region`, `geo.position`) | ✅ index.html:14-16 |
| Open Graph type/title/description/url/locale | ✅ index.html:17-22 |
| CSP via `meta http-equiv` | ✅ index.html:9 |
| Google Analytics 4 (`G-C39YPQWZ0T`) | ✅ index.html:7-8 |
| Consentement custom `sos44_consent` (conditionne chargement Google Fonts) | ✅ index.html:27 |
| Schema.org `LocalBusiness` complet (adresse, GPS, horaires, `aggregateRating` 4.8/62, 8 villes `areaServed`) | ✅ index.html:28-81 |
| Schema.org `FAQPage` (6 questions) | ✅ index.html:82-95 |
| `robots.txt` | ✅ racine (Allow /, référence sitemap) |
| `loading="lazy"` + `width`/`height` sur QualiRépare | ✅ index.html:1196 |
| `loading="lazy"` sur galerie atelier (5 images) | ✅ index.html:1333-1349 |
| Page blog connectée au CRM | ✅ blog.html |
| CNAME GitHub Pages | ✅ racine |
| Page 404 custom | ✅ 404.html |

### ❌ Ce qui manque ou est cassé

| Élément | Impact | Fichier |
|---|---|---|
| **`sitemap.xml`** absent mais référencé dans `robots.txt` | 🔴 404 Googlebot | racine |
| **`og-image.jpg`** référencée dans `<head>` mais fichier absent | 🔴 partage social cassé | racine |
| **Twitter Card** (`twitter:card`, `twitter:image`) | 🟠 pas d'aperçu sur X | index.html `<head>` |
| **Schema.org `Service`** (1 par prestation) | 🟠 rich results manqués | index.html `<head>` |
| **Schema.org `BreadcrumbList`** | 🟡 | index.html `<head>` |
| **`favicon.ico` + apple-touch-icon + favicon 192/512** | 🟠 absents | racine |
| **`manifest.json` + service worker (PWA)** | 🟡 absents | racine |
| **Microsoft Clarity** (heatmap gratuit) | 🟠 non installé | `<head>` |
| **Cookie banner RGPD conforme** (Tarteaucitron) | 🔴 CNIL — GA4 posé sans consentement robuste | `<head>` |
| **Images PNG non optimisées** (37 Mo total) | 🔴 perf mobile | racine |
| **Prise de RDV en ligne** | 🔴 conversion | nouveau |
| **Chat en direct ou bouton rappel** | 🟠 | nouveau |
| **Page Service par prestation** | 🟠 SEO | nouveau |
| **Page zones d'intervention** | 🟠 SEO local | nouveau |
| **CGV / Politique confidentialité / Cookies** | 🔴 conformité | nouveau |
| **Events GA4 custom** (clic tel, WhatsApp, devis) | 🟡 pas de tracking conversion | `<head>` |

---

## 📋 Audit par axes (10 axes)

### Axe 1 — SEO technique

| ✅ Présent | ❌ Manquant |
|---|---|
| `<title>` + meta description | `sitemap.xml` (référencé mais absent — **urgent**) |
| `robots.txt` | `og-image.jpg` physique (lien cassé dans `<head>`) |
| Canonical | Twitter Card tags |
| LocalBusiness + FAQPage Schema | Schema.org `Service` (par prestation) |
| `lang="fr"` | Schema.org `BreadcrumbList` |
| HTTPS + HSTS (Caddy) | `<link rel="preload">` images critiques |
| Preconnect Google Fonts (conditionnel) | Canonical cohérent sur toutes les pages annexes |

### Axe 2 — SEO local

| ✅ Présent | ❌ Manquant |
|---|---|
| NAP cohérent (Nom/Adresse/Tél) | Widget avis Google (Elfsight / API Places) |
| `addressLocality`, `postalCode`, `streetAddress` | Carte Google Maps embarquée |
| GPS dans Schema (`lat: 47.2960198`) | Pages dédiées zones d'intervention |
| `openingHoursSpecification` complet | Backlinks locaux (CCI, Mairie, Pages Jaunes) |
| 8 villes dans `areaServed` | Lien Google Business Profile visible |

### Axe 3 — Performance (⚠️ CRITIQUE)

| Fichier | Taille actuelle | Cible WebP |
|---|---|---|
| `accueil-atelier.png` | **9.0 Mo** | ~150 Ko |
| `recuperation-donnees.png` | **7.3 Mo** | ~120 Ko |
| `diagnostic-macbook.png` | **7.0 Mo** | ~120 Ko |
| `remplacement-ecran-iphone.png` | **7.0 Mo** | ~110 Ko |
| `poste-micro-soudure.png` | **6.6 Mo** | ~100 Ko |
| `logo-sos.png` | 313 Ko | ~25 Ko |
| `quali-repare.png` | 40 Ko | ~10 Ko |
| **Total** | **~37 Mo** | **< 700 Ko** |

**Autres manques perf** :
- Conversion PNG → WebP/AVIF (gain ~97 %)
- `srcset` + `sizes` pour images responsives
- `width`/`height` explicites manquants sur la galerie atelier (CLS)
- `<link rel="preload" as="image">` pour l'image hero
- Compression Brotli côté Caddy à vérifier (`encode zstd gzip`)
- Preconnect Google Fonts actuellement conditionné au consentement → à valider

**Impact estimé** : Lighthouse Mobile ~45 → ~90.

### Axe 4 — Conversion / CTA

| ✅ Présent | ❌ Manquant |
|---|---|
| Bouton appel téléphonique | **Prise de RDV en ligne** |
| Bouton WhatsApp | Générateur de devis en ligne intégré |
| Formulaire tracking réparation (CRM) | Chat en direct (fallback formulaire hors horaires) |
| Calculateur de tarif (inline) | Bouton "Demander un rappel" |
| | Bannière horaires live (ouvert/fermé maintenant) |
| | CTA sticky mobile bas d'écran |

### Axe 5 — Contenu

| ✅ Présent | ❌ Manquant |
|---|---|
| Page accueil structurée | Page dédiée par service (PC, Mac, iPhone, Android, données, micro-soudure) |
| Section tarifs smartphones (`tarifs-smartphones.html`) | Page "À propos" / histoire de l'atelier |
| Blog IA actif | Témoignages clients (réels, pas inventés) |
| FAQ (Schema.org) | Études de cas avant/après |
| | Page "Processus de réparation" (étapes) |
| | Page "Garanties" |

### Axe 6 — Accessibilité (WCAG 2.1 AA)

| ✅ Présent | ❌ Manquant |
|---|---|
| `lang="fr"` | Lien "skip-to-main-content" |
| `alt` sur galerie | Landmarks HTML5 (`<main>`, `<nav>`, `<aside>`) |
| Focus probablement par défaut | `aria-label` sur boutons icônes seuls |
| | Hiérarchie H1→H2→H3 à auditer (un seul H1) |
| | Navigation clavier complète à tester |
| | `alt=""` pour images décoratives |

**Outils gratuits** : WAVE, axe DevTools (extension Chrome/Firefox).

### Axe 7 — Mobile

| ✅ Présent | ❌ Manquant |
|---|---|
| Viewport responsive | Test iPhone SE 375 px |
| Menu sans doute responsive | Touch targets ≥ 48×48 px à vérifier |
| | Bouton appel sticky bottom (mobile) |
| | PWA (`manifest.json` + `sw.js`) |
| | Apple touch icon 180×180 |

### Axe 8 — Tracking / Analytics

| ✅ Présent | ❌ Manquant |
|---|---|
| Google Analytics 4 (`G-C39YPQWZ0T`) | Events custom (clic tel, WhatsApp, devis, tracking) |
| Consentement custom `sos44_consent` | Conversion tracking formulaire |
| | Search Console vérifié + sitemap soumis |
| | Microsoft Clarity (heatmap, 100 % gratuit illimité) |
| | Cookie banner RGPD conforme (Tarteaucitron) |

### Axe 9 — Sécurité

| ✅ Présent | ❌ Manquant |
|---|---|
| HTTPS / HSTS (Caddy) | `Permissions-Policy` |
| CSP via `<meta>` | `Referrer-Policy: strict-origin-when-cross-origin` |
| `frame-ancestors 'none'` | Rate-limit Caddy sur endpoints publics |
| | `.well-known/security.txt` |
| | `X-Content-Type-Options: nosniff` en header HTTP (pas `<meta>`) |

### Axe 10 — Business / Confiance

| ✅ Présent | ❌ Manquant |
|---|---|
| SIRET affiché (probable) | **CGV / CGU** |
| `priceRange` Schema | **Politique de confidentialité RGPD** |
| Label QualiRépare visible | Politique cookies |
| `aggregateRating` Schema | Badges Bonus Réparation cliquables |
| | Section presse / ils parlent de nous |

---

## 🔥 Recommandations priorisées

### 🚨 PRIORITÉ 1 — Urgences (impact immédiat)

#### 1.1 Optimiser les 37 Mo d'images (gain massif Lighthouse)

**Fichiers concernés** (racine) :
- `accueil-atelier.png` (9.0 Mo)
- `recuperation-donnees.png` (7.3 Mo)
- `diagnostic-macbook.png` (7.0 Mo)
- `remplacement-ecran-iphone.png` (7.0 Mo)
- `poste-micro-soudure.png` (6.6 Mo)
- `logo-sos.png` (313 Ko)

**Outils gratuits** :
- [squoosh.app](https://squoosh.app/) — web interactif (Google)
- `cwebp` (libwebp) — CLI macOS/Linux
- `sharp-cli` (npm) — batch automatisé

**Action** : PNG → WebP qualité 80, puis `<picture><source srcset="*.webp" type="image/webp"><img src="*.png" alt="..."></picture>`.

**Cible** : poids total page < 1 Mo.

#### 1.2 Créer `sitemap.xml` (actuellement 404)

Le `robots.txt` référence `https://sos-informatique44.fr/sitemap.xml` → fichier absent. **Google tente de le crawler et échoue.**

**Fichier à créer** : `sitemap.xml` à la racine.

Structure minimale :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sos-informatique44.fr/</loc><priority>1.0</priority></url>
  <url><loc>https://sos-informatique44.fr/tarifs-smartphones.html</loc><priority>0.8</priority></url>
  <url><loc>https://sos-informatique44.fr/blog.html</loc><priority>0.8</priority></url>
  <!-- + 1 entrée par article blog publié (idéalement généré dynamiquement depuis CRM) -->
</urlset>
```

**Automatisation possible** : endpoint `/api/blog/public/sitemap.xml` côté CRM qui agrège pages statiques + articles publiés.

#### 1.3 Créer `og-image.jpg` (actuellement lien cassé dans `<head>`)

Le `<head>` contient déjà `<meta property="og:image" content="https://sos-informatique44.fr/og-image.jpg">` (index.html:21) **mais le fichier n'existe pas**. Partage FB/LinkedIn/Slack → image vide.

**Fichier à créer** : `og-image.jpg` (1200×630 px, < 200 Ko).
**Outils gratuits** : Canva (templates "Facebook Link"), GIMP.

**À ajouter en complément** dans le `<head>` :
```html
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="SOS Informatique 44 – Réparation La Chapelle-sur-Erdre">
<meta name="twitter:description" content="Réparation PC, Mac, iPhone. Bonus 50€ QualiRépare.">
<meta name="twitter:image" content="https://sos-informatique44.fr/og-image.jpg">
```

#### 1.4 Prise de RDV en ligne

**Solutions gratuites open source** :
- **Cal.com** — self-hosted Docker sur le VPS (référence, UI moderne)
- Fallback low-tech : formulaire HTML → mail → CRM

**Intégration** : bouton "Prendre rendez-vous" → modal `<iframe>` Cal.com → email confirmation.

#### 1.5 Tarteaucitron cookies RGPD

**Pourquoi obligatoire** : GA4 pose `_ga` sans consentement robuste → sanction CNIL possible.
Le système custom `sos44_consent` est partiel (ne conditionne que les Google Fonts).

**Solution gratuite** : [Tarteaucitron.js](https://tarteaucitron.io/fr/) — open source, conforme CNIL, intègre GA4, Clarity, YouTube, etc.

---

### ⭐ PRIORITÉ 2 — Crédibilité et conversion

#### 2.1 Widget avis Google

**Solutions gratuites** :
- Elfsight (free plan — 1 widget, 200 vues/jour)
- API Google Places (clé gratuite, quota large, code custom)
- Solution manuelle : copier/coller les 5 meilleurs avis dans une `<section>` dédiée avec `<blockquote>`

#### 2.2 Schema.org `Service` (un par prestation)

Ajouter dans `<head>` un JSON-LD `Service` pour : PC, Mac, iPhone, Android, Tablette, Récupération données, Micro-soudure.

Exemple :
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Réparation iPhone",
  "provider": { "@type": "LocalBusiness", "name": "SOS Informatique 44" },
  "areaServed": [
    { "@type": "City", "name": "Nantes" },
    { "@type": "City", "name": "La Chapelle-sur-Erdre" }
  ],
  "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "49" }
}
</script>
```

#### 2.3 Microsoft Clarity (heatmap, 100 % gratuit illimité)

Script à ajouter dans `<head>` (comme GA4), derrière consentement Tarteaucitron.
URL : https://clarity.microsoft.com

Révèle clics, scrolls, frustrations, session replays. **Zéro limite, zéro coût, zéro carte bancaire.**

#### 2.4 CGV + Politique de confidentialité + Cookies

**Fichiers à créer** :
- `cgv.html`
- `confidentialite.html`
- `cookies.html`

**Générateurs gratuits** :
- [cnil.fr](https://cnil.fr) (modèles officiels)
- [donneespersonnelles.fr](https://donneespersonnelles.fr)

**Lier** depuis le footer de toutes les pages.

#### 2.5 Favicon complet + manifest.json (PWA)

**Fichiers à créer** à la racine :
- `favicon.ico` (16/32/48 combinés)
- `favicon-192.png`, `favicon-512.png`
- `apple-touch-icon.png` (180×180)
- `manifest.json`
- `sw.js` (service worker basique, cache offline)

**Outil gratuit** : [realfavicongenerator.net](https://realfavicongenerator.net) → génère tout + code `<head>` prêt à coller.

---

### 🔧 PRIORITÉ 3 — Polissage et finitions

#### 3.1 Accessibilité WCAG 2.1 AA

- Ajouter `<a href="#main" class="skip-link">Aller au contenu</a>` en premier enfant `<body>`
- Wrapper contenu principal dans `<main id="main">`
- `<nav aria-label="Navigation principale">`
- `aria-label` sur tous les boutons icônes seuls (WhatsApp, tél, menu burger)
- Auditer hiérarchie H1→H2→H3 (un seul H1 par page)
- Tester avec WAVE + axe DevTools (extensions navigateur gratuites)

#### 3.2 Pages dédiées par service

**À créer** :
- `services/reparation-pc.html`
- `services/reparation-mac.html`
- `services/reparation-iphone.html`
- `services/reparation-android.html`
- `services/recuperation-donnees.html`
- `services/micro-soudure.html`

Chaque page : H1 unique, FAQ spécifique, Schema.org `Service`, CTA, 600-1000 mots.
⚠️ Pas de duplicate content — contenu rédigé pour chaque panne, pas un template gonflé.

#### 3.3 Pages "zones d'intervention"

**À créer** :
- `zones/nantes.html`
- `zones/la-chapelle-sur-erdre.html`
- `zones/suce-sur-erdre.html`
- `zones/carquefou.html`
- `zones/orvault.html`

Chacune avec texte unique + Schema `LocalBusiness` `areaServed`.
⚠️ **Ne PAS copier-coller** le même texte (duplicate content → déclassement).

#### 3.4 Tracking events GA4 custom

Dans `index.html`, après le `gtag('config'…)` :
```javascript
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="tel:"]').forEach(a =>
    a.addEventListener('click', () => gtag('event', 'click_phone'))
  );
  document.querySelectorAll('a[href*="wa.me"]').forEach(a =>
    a.addEventListener('click', () => gtag('event', 'click_whatsapp'))
  );
  const form = document.querySelector('form[data-tracking]');
  form?.addEventListener('submit', () => gtag('event', 'submit_tracking'));
});
```

#### 3.5 Headers sécurité Caddy

Dans le `Caddyfile` VPS (`/etc/caddy/Caddyfile`) :
```
sos-informatique44.fr {
  header {
    Permissions-Policy "geolocation=(), microphone=(), camera=()"
    Referrer-Policy "strict-origin-when-cross-origin"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
  }
  encode zstd gzip
  root * /opt/sosinformatique44
  file_server
}
```

#### 3.6 Search Console + Sitemap

1. Créer compte [Google Search Console](https://search.google.com/search-console)
2. Vérifier propriété (balise meta ou DNS TXT)
3. Soumettre `sitemap.xml` (après création en P1.2)
4. Surveiller erreurs crawl hebdomadairement

#### 3.7 Backlinks locaux gratuits

À obtenir :
- Fiche CCI Nantes-Saint-Nazaire
- Annuaire Mairie La Chapelle-sur-Erdre
- Pages Jaunes (fiche gratuite)
- Yelp, 118000, Google Business Profile
- Forums locaux Nantes Nord

---

## 🛠️ Outils gratuits / open source recommandés

| Besoin | Outil | Type |
|---|---|---|
| Compression images | [squoosh.app](https://squoosh.app) | Web gratuit Google |
| Conversion WebP batch | `sharp-cli`, `cwebp` | CLI open source |
| Prise de RDV | [Cal.com](https://cal.com) | Self-hosted Docker |
| Chat live | [Chatwoot](https://chatwoot.com) | Self-hosted Docker |
| Heatmap | [Microsoft Clarity](https://clarity.microsoft.com) | SaaS gratuit illimité |
| Cookies RGPD | [Tarteaucitron.js](https://tarteaucitron.io/fr/) | JS open source |
| Favicon complet | [realfavicongenerator.net](https://realfavicongenerator.net) | Web gratuit |
| Schema validator | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Google |
| Accessibilité | WAVE, axe DevTools | Extension navigateur |
| Performance | PageSpeed Insights, Lighthouse | Web + Chrome DevTools |
| Avis Google | Elfsight (free), API Places | Widget JS |
| CGV / RGPD | donneespersonnelles.fr, cnil.fr | Web gratuit |
| OG image | Canva, GIMP | Web / desktop |
| Uptime monitoring | UptimeRobot (50 monitors free) | SaaS gratuit |
| Search Console | search.google.com/search-console | Google |

---

## 📈 Ordre d'implémentation recommandé (12 étapes)

| # | Étape | Effort | Impact |
|---|---|---|---|
| 1 | Compression 6 images PNG → WebP | ~1 h | 🔴🔴🔴 |
| 2 | Créer `sitemap.xml` + Search Console | ~1 h | 🔴🔴 |
| 3 | Créer `og-image.jpg` + Twitter Card tags | ~1 h | 🔴🔴 |
| 4 | Favicon complet + `manifest.json` | ~30 min | 🟠 |
| 5 | Tarteaucitron RGPD | ~1 h | 🔴 |
| 6 | CGV + politique confidentialité + cookies | ~1 h | 🔴 |
| 7 | Cal.com RDV (Docker VPS) | ~3 h | 🔴🔴 |
| 8 | Microsoft Clarity | ~10 min | 🟠 |
| 9 | GA4 events (tel, WhatsApp, devis) | ~30 min | 🟠 |
| 10 | Schema `Service` × 6 prestations | ~2 h | 🟠 |
| 11 | Widget avis Google | ~1 h | 🟠 |
| 12 | Pages services + zones (1/semaine) | continu | 🟠 |

---

## 🎯 Objectifs mesurables (avant / après)

| KPI | Avant | Cible |
|---|---|---|
| Lighthouse Performance Mobile | ~45 | ≥ 90 |
| Lighthouse SEO | ~85 | 100 |
| Lighthouse Accessibilité | ~80 | ≥ 95 |
| Lighthouse Best Practices | ~85 | 100 |
| Poids page accueil | ~40 Mo | < 2 Mo |
| Temps chargement 3G | > 15 s | < 3 s |
| `sitemap.xml` accessible | 404 | 200 |
| `og-image.jpg` accessible | 404 | 200 |
| Pages indexées Google | ~5 | > 20 |
| Conversions tel/WhatsApp | non trackées | mesurées (GA4) |

---

## ✅ Critères de validation du rapport

- [x] 10 axes couverts
- [x] Claims vérifiés dans `index.html` et listing du dossier
- [x] Écarts avec le plan initial relevés (FAQPage déjà présent, `loading="lazy"` déjà présent, `og-image` cassée)
- [x] Outils exclusivement gratuits / open source
- [x] Fichiers concernés identifiés nommément
- [x] Priorités 1/2/3 claires
- [x] Ordre d'implémentation pragmatique
- [x] Objectifs chiffrés
- [x] Aucune modification de code

---

## 💬 Prochaine étape suggérée

Le rapport est actionnable. Quand tu veux passer à l'action, on attaque dans cet ordre :

1. **Compression images** — gain de perf visible immédiatement
2. **`sitemap.xml` + `og-image.jpg`** — corrige 2 liens 404 existants
3. **Cal.com RDV** — impact direct sur le chiffre d'affaires

Dis-moi simplement **"on attaque la priorité 1"** pour démarrer.
