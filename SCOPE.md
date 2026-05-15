# PRISE Sarl — Site web · Note de cadrage et chiffrage

> **Document de travail** — à présenter au client pour valider la portée, le calendrier
> et le budget avant la phase production. Le prototype `index.html` accompagne ce document
> comme démonstration visuelle du parti pris créatif.

---

## 1 · Concept créatif retenu

**« From Blueprint to Reality »** — l'identité visuelle est l'ingénierie elle-même.
Chaque section s'ouvre comme un plan technique dessiné à la main et se construit en réalité au fil du défilement.

Trois moments signature (volontairement limités à trois — pas de gadget partout) :

1. **Hero** — cycle de cinq plans techniques (bâtiment, pylône, panneaux solaires, camion, formation) qui se dessinent ligne après ligne, accompagnés du verbe correspondant (Construire, Connecter, Alimenter, Acheminer, Former).
2. **Devis conversationnel** — pas de formulaire générique, mais un entretien guidé en quatre étapes qui se ramifie selon le service choisi. Termine par une option WhatsApp pré-remplie.
3. **Carte RDC interactive** — présence sur le territoire matérialisée par des points cliquables (Kinshasa, Lubumbashi, Goma, Kisangani, Matadi).

Tout le reste — services, projets, valeurs, formations, contact, footer — est rapide,
propre, professionnel. **Le luxe est dans la retenue.**

---

## 2 · Architecture livrée

| Page / Section | Statut prototype | Phase prod |
|---|---|---|
| Accueil (Hero · About · Services · Pourquoi · Projets · Devis · Formations · Contact · Footer) | ✅ Complet | Polissage + photos |
| Pages services détaillées (5) | À construire | Phase 2 |
| Page Projets — galerie complète + dossiers | Aperçu (6 cartes) | Phase 2 |
| Page Formations — catalogue + inscription + paiement | Aperçu (3 cartes) | Phase 3 |
| Blog / Actualités | À construire | Phase 3 |
| Carrières + module candidature | À construire | Phase 3 |
| Contact + Google Maps | Carte stylisée | Phase 2 (intégrer Maps) |
| Espace client | À construire | Phase 4 |
| Tableau de bord admin (CMS) | À construire | Phase 4 |
| Devis intelligent | ✅ Complet (4 étapes branchantes + WhatsApp) | Connecter au backend |

---

## 3 · Stack technique recommandée

**Frontend production :** Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion / GSAP
- SEO server-rendered, performance native, FR/EN routing intégré
- Animations identiques au prototype (le code GSAP est portable tel quel)

**Backend :** Supabase (PostgreSQL managé)
- Auth (espace client + admin)
- Storage (brochures PDF, photos projets)
- Realtime (suivi de demande de devis)
- Edge Functions pour webhooks

**Hébergement :** Vercel (frontend) + Supabase (DB)
- ~0 USD/mois en démarrage (free tiers)
- ~25 USD/mois à 10 000+ visiteurs/mois
- ~80 USD/mois à 100 000+ visiteurs/mois et stockage médias

**Intégrations externes :**
- WhatsApp Business API via wa.me link (gratuit) ou Meta Cloud API (gratuit jusqu'à 1 000 conversations/mois)
- Google Maps Embed API (gratuit jusqu'à 28 500 chargements/mois)
- Email transactionnel : Resend ou Postmark (3–10 USD/mois)
- Paiements formations : **à valider** — Flutterwave (couvre RDC, mobile money) ou Stripe + virement
- Analytics : Plausible (9 USD/mois, RGPD-friendly) ou Google Analytics 4 (gratuit)
- Chatbot : à phase 4 — recommandation OpenAI Assistants API ou Tidio

**Domaine + SSL :** ~15 USD/an (`.cd` ou `.com`), SSL gratuit via Vercel.

---

## 4 · Phases et calendrier

| Phase | Livrables | Durée | Effort dev |
|---|---|---|---|
| **0 · Validation** | Prototype, scope, brief assets | Fait | — |
| **1 · Design system + Homepage prod** | Migration Next.js, design tokens, homepage complète FR, optimisations, déploiement Vercel | 2 semaines | 60 h |
| **2 · Pages internes** | 5 pages services, page projets complète, page contact + Maps, blog squelette | 2 semaines | 60 h |
| **3 · Modules dynamiques** | Devis backend (Supabase + email), formations (catalogue + inscription + paiement), blog CMS, carrières | 3 semaines | 90 h |
| **4 · Espace client + admin** | Auth, dashboard suivi devis, CMS admin, statistiques | 2 semaines | 60 h |
| **5 · Bilingue + SEO + lancement** | Traduction EN intégrée, schema.org, sitemap, perf audit, formation client, lancement | 1,5 semaine | 40 h |

**Total : 10,5 semaines · ~310 heures de développement.**

(Calendrier compressible à 7 semaines avec deux développeurs en parallèle.)

---

## 5 · Brackets de chiffrage indicatifs

> Tarifs basés sur le marché agence francophone. À ajuster selon votre positionnement.

| Phase | Bracket bas (freelance) | Bracket agence |
|---|---|---|
| 1 · Homepage prod | 3 000 – 4 500 USD | 6 000 – 9 000 USD |
| 2 · Pages internes | 3 000 – 4 500 USD | 6 000 – 9 000 USD |
| 3 · Modules dynamiques | 4 500 – 7 000 USD | 9 000 – 14 000 USD |
| 4 · Espace client + admin | 3 000 – 4 500 USD | 6 000 – 9 000 USD |
| 5 · Bilingue + SEO + lancement | 2 000 – 3 000 USD | 4 000 – 6 000 USD |
| **Total projet** | **15 500 – 23 500 USD** | **31 000 – 47 000 USD** |
| Maintenance mensuelle | 200 – 400 USD/mois | 600 – 1 200 USD/mois |
| Hébergement & services | ~25 USD/mois (démarrage) | — |

**Négociables séparément :**
- Production photo / vidéo professionnelle des projets et de l'équipe : 2 000 – 5 000 USD
- Refonte logo / charte graphique étendue : 1 500 – 4 000 USD
- Rédaction copywriting FR + traduction EN par rédacteur natif : 1 800 – 3 500 USD
- SEO continu (3 articles/mois) : 800 – 1 500 USD/mois

---

## 6 · Ce que le client doit fournir

Sans ces éléments, la phase 2 stagne. À demander dès la signature :

- [ ] **Logo PRISE** en SVG vectoriel + variations (mono, foncé, clair)
- [ ] **Charte graphique** : couleurs exactes (Pantone / HEX), typographies validées
- [ ] **Photos haute résolution** : équipe, locaux, 10–15 chantiers significatifs (avec autorisation des clients pour l'affichage)
- [ ] **Brochures PDF existantes** : services, formations, présentation entreprise
- [ ] **Fiches projets** : pour chaque projet vitrine — client, lieu, surface/spécifications, dates, budget (si communicable), témoignage
- [ ] **Catalogue formations détaillé** : 7 domaines, durées, prix USD, prérequis, certificats émis, calendrier 12 mois
- [ ] **Coordonnées exactes** : adresse Kinshasa, téléphone, email, numéro WhatsApp Business
- [ ] **Mentions légales** : statuts juridiques (Sarl, RCCM, NIF), conditions générales, politique de confidentialité
- [ ] **Compte WhatsApp Business** vérifié + accès Meta Business Manager
- [ ] **Compte Google Business** + accès Search Console
- [ ] **Accès domaine** ou autorisation de l'enregistrer à leur nom
- [ ] **Compte de paiement** pour les formations : Flutterwave / banque / mobile money — selon stratégie validée
- [ ] **Validation du contenu rédigé** sous 5 jours ouvrés par cycle (sinon le calendrier glisse)
- [ ] **Versions anglaises** des contenus clés (ou budget pour traduction par rédacteur natif)

---

## 7 · Risques et hypothèses

**Bande passante RDC** — Kinshasa et hors-Kinshasa ont une connectivité variable. Le site doit fonctionner sur 3G : pas d'animations WebGL lourdes, images compressées (AVIF/WebP), lazy-loading systématique, vidéo hero limitée à 2 Mo. **Le prototype respecte déjà cette contrainte (~250 Ko hors fonts).**

**Devices** — audience institutionnelle (ministères, opérateurs) souvent sur Windows + Edge ; audience mobile sur Android entrée de gamme. Tester sur ces deux profils minimum.

**Contenu rédactionnel** — actuellement le prototype utilise des textes plausibles mais non validés. Une relecture par un référent métier PRISE est indispensable avant lancement.

**Conformité données** — le formulaire de devis collecte des données personnelles. Une politique de confidentialité conforme à la loi RDC + RGPD européen (si clients UE) est requise avant ouverture publique.

**Photos de projets** — les illustrations actuelles sont des plans techniques génériques en SVG. Pour le lancement, il faut **soit** des photos réelles de chantiers PRISE, **soit** un budget production photo (cf. section 5).

---

## 8 · Plan de validation

1. **Aujourd'hui** — vous présentez le prototype et ce scope au client.
2. **Sous 5 jours** — retour client : ajustements créatifs, validation budget, fourniture des assets prioritaires (logo, photos, fiches projets phares).
3. **J+10** — signature contrat, lancement phase 1.
4. **J+24** — homepage production en ligne sur sous-domaine `staging.prise-sarl.cd` pour validation client.
5. **J+75** — lancement public.

---

*Document généré pour la phase d'avant-projet. Toute valeur monétaire est indicative et à confirmer après cadrage final.*
