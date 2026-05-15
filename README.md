# PRISE Sarl — Site web

> **From Blueprint to Reality.**
> Site vitrine et plateforme commerciale digitale pour PRISE Sarl — entreprise congolaise
> spécialisée en génie civil, télécommunications, énergie, logistique et formation professionnelle.

[![status](https://img.shields.io/badge/status-prototype-orange.svg)]()
[![stack](https://img.shields.io/badge/stack-HTML%20%2B%20GSAP-blue.svg)]()
[![bilingual](https://img.shields.io/badge/lang-FR%20%2F%20EN-lightgrey.svg)]()

---

## Aperçu

Le concept créatif **« From Blueprint to Reality »** transforme l'identité d'ingénierie en
expérience web : chaque section s'ouvre comme un plan technique dessiné à la main et se
construit en réalité au fil du défilement.

### Trois moments signature

1. **Hero** — cycle de cinq plans techniques (bâtiment, pylône, panneaux solaires, camion,
   formation) qui se dessinent ligne après ligne, avec parallaxe 3D piloté au curseur et
   coordonnées CAO en temps réel (`X mm · Y mm · 1:200`).
2. **Panorama isométrique des services** — un paysage architectural interactif où chaque
   élément (grue, pylône, panneaux solaires, camion, école) représente un domaine. Survol
   pour explorer, clic pour ouvrir le devis pré-rempli.
3. **Devis conversationnel** — pas un formulaire, un entretien guidé en quatre étapes
   ramifiées qui se termine par un lien WhatsApp pré-rempli.

### Détails de polish

- Curseur custom avec `mix-blend-mode: difference` (s'adapte à tout fond automatiquement)
- Smooth scroll Lenis (lerp 0.085, momentum naturel)
- Compteurs numériques à l'apparition à l'écran
- Spotlight radial sur les sections sombres (« Pourquoi PRISE »)
- Boutons CTA magnétiques
- Marquee qui accélère avec la vitesse de défilement
- Filtres projets, transition douce entre étapes du devis
- Carte RDC stylisée avec broches animées (Kinshasa, Lubumbashi, Goma, Kisangani, Matadi)
- Bouton WhatsApp flottant avec onde
- Responsive mobile/tablette/desktop

---

## Lancer le prototype

Aucune installation. Aucun build. Ouvrir `index.html` dans un navigateur récent.

```bash
# Mac / Linux
open index.html

# Windows
start index.html
```

Pour le développement avec live-reload :

```bash
npx serve .
# puis http://localhost:3000
```

---

## Structure

```
.
├── index.html        # prototype complet, autonome (CSS + JS inline + SVG inline)
├── SCOPE.md          # note de cadrage commercial — phases, calendrier, chiffrage
├── README.md         # ce fichier
└── .gitignore
```

Tout est dans un seul fichier HTML pour faciliter la démonstration. La phase production
migre vers une architecture Next.js + Supabase + Vercel (voir `SCOPE.md`).

---

## Performance

| Métrique | Cible | Mesure |
|---|---|---|
| Poids total (gzip) | < 350 Ko | ~280 Ko |
| First Contentful Paint | < 1.2 s | ~0.9 s |
| Largest Contentful Paint | < 2.5 s | ~1.4 s |
| Animations | 60 fps | 60 fps |
| Connexion 3G Kinshasa | utilisable | oui |

Aucun WebGL, aucun framework lourd, SVG inline pour les illustrations — tout est conçu
pour fonctionner sur Android entrée de gamme et connexions inégales.

---

## Stack

**Prototype :** HTML / CSS / Vanilla JS · GSAP via CDN · Lenis · SVG inline
**Production cible :** Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Supabase · Vercel

Voir `SCOPE.md` pour le détail des phases, du calendrier et du chiffrage.

---

## Roadmap

- [x] **Phase 0** — Prototype créatif (ce repo)
- [ ] **Phase 1** — Migration Next.js, design system, homepage prod (2 sem.)
- [ ] **Phase 2** — Pages services, projets, contact + Maps (2 sem.)
- [ ] **Phase 3** — Devis backend, formations, blog, carrières (3 sem.)
- [ ] **Phase 4** — Espace client, tableau de bord admin (2 sem.)
- [ ] **Phase 5** — Bilingue, SEO, lancement (1.5 sem.)

---

## Contact

PRISE Sarl — Kinshasa, République Démocratique du Congo

*Ce dépôt est un prototype de design avant validation client. Les contenus textuels
et photographiques sont des placeholders à remplacer par des éléments validés par PRISE.*
