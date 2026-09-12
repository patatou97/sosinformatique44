# CONSIGNES — sos-informatique44.fr

Fichier de contexte permanent. À lire au début de chaque session.

---

## 1. Règles absolues (aucune exception)

**Garantie**
12 mois sur la pièce remplacée et la main-d'œuvre associée.
Exclusions : casse, dégât d'eau, intervention d'un tiers.
Aucune autre durée ne doit apparaître nulle part (ni 90 jours, ni 3 mois).
À vérifier dans : page d'accueil, pages services, CGV, articles de blog, FAQ.

**E-mail**
Adresse de référence, affichée partout : **contact@sos-informatique44.fr**
(pied de page, mentions légales, formulaire, JSON-LD, fiche Google, annuaires, devis, factures)

- `reparationexpress44@hotmail.com` : **supprimée**, ne doit plus apparaître nulle part.
- `contact@sos-informatique44.com` : **conservée en réception** (redirection vers le .fr), mais **jamais affichée**.

**Adresses**

Deux adresses distinctes, à ne jamais confondre :
- **Siège social** : 9 allée du Québec — apparaît **uniquement** dans les mentions légales, explicitement libellé « siège social ».
- **Atelier / accueil client** : 27 rue de la Vrière, 44240 La Chapelle-sur-Erdre.

Règle : **partout ailleurs que dans les mentions légales, seule l'adresse de l'atelier apparaît.**
Concerné : pied de page, pages services, pages zones, JSON-LD, fiche Google, annuaires.

L'adresse « rue Martin Luther King » est erronée et ne doit apparaître nulle part.

**Horaires**
Lundi au vendredi : 9h – 18h
Samedi : 9h – 13h

**Service à domicile**
Il est maintenu. Formulation identique sur toutes les pages.
La FAQ ne doit pas le contredire.

---

## 2. Principes de travail

- **Approche additive.** On ajoute des pages, on ne restructure pas l'existant. Les positions acquises ne doivent pas être perdues.
- **Mobile d'abord.**
- **Bouton d'appel visible sur toute page.**
- **Prix en HTML statique**, jamais uniquement dans un calculateur JavaScript.
- **Toute donnée chiffrée doit être extractible du texte** (lisible sans exécuter de script).
- **Un commit Git par correction.**

---

## 3. Contrainte Google Ads

La publicité Google est **fermée** pour l'assistance technique et la réparation grand public (règlement « Assistance technique tierce pour les consommateurs »).

Deux exceptions exploitables :
- pages **entreprises** (B2B)
- pages **vente de matériel** (PC gamer)

Ces deux types de pages doivent être conçus pour être éligibles comme URL finale d'annonce.

---

## 4. Projet PC gamer

- Intégré au domaine existant. **Pas de site séparé.**
- Une seule machine de référence montée à l'atelier. Les autres configs sont en montage sur commande.
- Tableau de performances : 8 jeux à 3 résolutions (1080p, 1440p, 4K).
  - Populaires : Counter-Strike 2, Battlefield 6, Call of Duty Black Ops 7, ARC Raiders
  - Exigeants : Cyberpunk 2077, Alan Wake 2, Black Myth Wukong, Doom The Dark Ages
- Protocole : qualité élevée, **upscaling désactivé**.
- Chiffres **mesurés** à l'atelier : datés, machine identifiée.
- Chiffres **estimés** : étiquetés comme tels, avec source et date.
- Tableau HTML statique. Pas de base de données ni d'interface d'administration au lancement.

---

## 5. Référence

Le cahier des charges complet se trouve dans le même dossier :
`cahier-des-charges-geo-sos44.md`
