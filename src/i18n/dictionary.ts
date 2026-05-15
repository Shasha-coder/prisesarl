/**
 * Bilingual dictionary for PRISE Sarl.
 *
 * Keep keys flat-namespaced (e.g. "hero.cta.devis") for grep-ability.
 * Markdown-style asterisks are stripped at render time so we can mark
 * emphasized fragments without escaping JSX.
 */

export type Lang = "fr" | "en";

export const DICT = {
  fr: {
    // Navigation
    "nav.services":   "Services",
    "nav.methode":    "Méthode",
    "nav.projets":    "Projets",
    "nav.pourquoi":   "Pourquoi PRISE",
    "nav.formations": "Formations",
    "nav.devis":      "Demander un devis",

    // Hero
    "hero.eyebrow":         "Kinshasa · RDC · est. 2013",
    "hero.title.line1a":    "Construire,",
    "hero.title.line1b":    "connecter,",
    "hero.title.line2a":    "alimenter,",
    "hero.title.line2b":    "former",
    "hero.title.line3":     "— l'avenir, par étapes mesurées.",
    "hero.lede":            "PRISE Sarl conçoit, bâtit et opère les infrastructures qui tiennent l'Afrique centrale en marche — du plan coté au chantier livré, sans sous-traitance déguisée.",
    "hero.cta.devis":       "Demander un devis",
    "hero.cta.services":    "Découvrir nos cinq métiers",
    "hero.stat.years":      "années d'expertise",
    "hero.stat.domains":    "domaines intégrés",
    "hero.stat.projects":   "projets livrés",
    "hero.stat.retention":  "clients récurrents",
    "hero.ticker":          "Plan en cours",

    // Domains section
    "domains.eyebrow":  "Nos domaines",
    "domains.title":    "Cinq métiers, une seule équipe de bout en bout.",
    "domains.lede":     "Du dimensionnement à la mise en service, PRISE intègre l'ensemble de la chaîne : études techniques, construction, télécommunications, énergie, logistique chantier et formation des équipes locales. Un interlocuteur, une responsabilité.",
    "domains.more":     "En savoir plus",

    // Methodology
    "method.eyebrow":   "Méthode",
    "method.title":     "Du plan coté au chantier livré, en six gestes propres.",
    "method.lede":      "Aucun projet ne quitte le bureau d'études sans plan signé. Aucun chantier ne ferme sans procès-verbal contradictoire. Notre méthode tient parce qu'elle est répétable.",

    // Atlas
    "atlas.eyebrow":    "Atlas RDC",
    "atlas.title":      "Là où PRISE a déjà posé le pied.",
    "atlas.lede":       "Onze provinces, des bâtiments à Matadi aux pylônes de Goma. Filtrez par métier pour voir comment nos cinq spécialités se connectent sur le terrain.",
    "atlas.filter.all": "Tous les projets",

    // Trust
    "trust.eyebrow":    "Pourquoi PRISE",
    "trust.title":      "Huit raisons, aucun argumentaire creux.",
    "trust.lede":       "Une entreprise d'ingénierie se juge sur ce qui tient après la livraison. Voici ce qui nous distingue, signé en bas de chaque PV.",

    // Formations
    "formations.eyebrow": "Catalogue formations",
    "formations.title":   "La compétence reste sur le terrain.",
    "formations.lede":    "Nos formations sont conçues par des ingénieurs qui font le métier au quotidien. Certifications ISO 21001, sessions à Kinshasa + provinces.",
    "formations.enroll":  "S'inscrire",
    "formations.catalog": "Voir le catalogue complet",

    // Quote
    "quote.eyebrow":    "Concierge intelligent",
    "quote.title":      "Évaluez votre projet en temps réel.",
    "quote.lede":       "Oubliez les formulaires interminables. Notre système qualifie votre besoin, estime les délais et pré-remplit votre dossier en 3 étapes.",
    "quote.step.domain":  "Dans quel domaine se situe votre besoin ?",
    "quote.step.details": "Pouvez-vous décrire brièvement votre projet ?",
    "quote.step.contact": "Comment pouvons-nous vous recontacter ?",
    "quote.step.done":    "Demande envoyée avec succès",

    // Agent dock
    "agent.title":      "Ernest · Concierge PRISE",
    "agent.tagline":    "Posez votre question, je vous oriente.",
    "agent.placeholder": "Écrivez un message…",
    "agent.mode.text":  "Texte",
    "agent.mode.voice": "Voix",
    "agent.start":      "Démarrer la conversation vocale",
    "agent.stop":       "Terminer",
    "agent.listening":  "À l'écoute…",
    "agent.thinking":   "Réflexion…",
    "agent.connecting": "Connexion…",
    "agent.error":      "Connexion impossible. Réessayez.",
    "agent.welcome":    "Bonjour. Je suis Ernest, votre concierge chez PRISE Sarl. Je parle plus de soixante langues — dites-moi ce que vous cherchez, ou laissez-moi vous présenter nos métiers. Que puis-je faire pour vous aider ?",

    // Footer
    "footer.tagline":   "PRISE Sarl est une entreprise congolaise spécialisée en ingénierie globale. De la conception à la réalisation, nous construisons, connectons, alimentons et formons pour un avenir durable.",
    "footer.domains":   "Domaines",
    "footer.links":     "Liens rapides",
    "footer.contact":   "Contact",
    "footer.privacy":   "Politique de confidentialité",
    "footer.terms":     "Mentions légales",
    "footer.copyright": "Tous droits réservés.",
  },
  en: {
    // Navigation
    "nav.services":   "Services",
    "nav.methode":    "Method",
    "nav.projets":    "Projects",
    "nav.pourquoi":   "Why PRISE",
    "nav.formations": "Training",
    "nav.devis":      "Request a quote",

    // Hero
    "hero.eyebrow":         "Kinshasa · DR Congo · est. 2013",
    "hero.title.line1a":    "Build,",
    "hero.title.line1b":    "connect,",
    "hero.title.line2a":    "power,",
    "hero.title.line2b":    "train",
    "hero.title.line3":     "— the future, step by measured step.",
    "hero.lede":            "PRISE Sarl designs, builds and operates the infrastructure that keeps Central Africa running — from signed drawings to commissioned sites, with no hidden subcontracting.",
    "hero.cta.devis":       "Request a quote",
    "hero.cta.services":    "Explore our five disciplines",
    "hero.stat.years":      "years of expertise",
    "hero.stat.domains":    "integrated disciplines",
    "hero.stat.projects":   "projects delivered",
    "hero.stat.retention":  "returning clients",
    "hero.ticker":          "Drawing in progress",

    // Domains
    "domains.eyebrow":  "Our disciplines",
    "domains.title":    "Five trades, one team, end to end.",
    "domains.lede":     "From sizing to commissioning, PRISE owns the full chain: engineering studies, construction, telecoms, energy, site logistics and crew training. One point of contact, one liability.",
    "domains.more":     "Learn more",

    // Methodology
    "method.eyebrow":   "Method",
    "method.title":     "From signed drawing to handover, in six clean moves.",
    "method.lede":      "No project leaves the engineering office without a signed drawing. No site closes without a contradictory acceptance report. Our method holds because it is repeatable.",

    // Atlas
    "atlas.eyebrow":    "DRC Atlas",
    "atlas.title":      "Where PRISE has already worked.",
    "atlas.lede":       "Eleven provinces, from buildings in Matadi to towers in Goma. Filter by trade to see how our five specialties connect on the ground.",
    "atlas.filter.all": "All projects",

    // Trust
    "trust.eyebrow":    "Why PRISE",
    "trust.title":      "Eight reasons, no empty pitch.",
    "trust.lede":       "An engineering firm is judged by what holds after delivery. Here is what sets us apart, signed at the bottom of every acceptance report.",

    // Formations
    "formations.eyebrow": "Training catalog",
    "formations.title":   "Skill stays on the ground.",
    "formations.lede":    "Our training is designed by engineers who do the work daily. ISO 21001 certified, sessions in Kinshasa and provincial sites.",
    "formations.enroll":  "Enroll",
    "formations.catalog": "View full catalog",

    // Quote
    "quote.eyebrow":    "Smart concierge",
    "quote.title":      "Scope your project in real time.",
    "quote.lede":       "Forget endless forms. Our system qualifies your need, estimates timelines, and pre-fills your brief in three steps.",
    "quote.step.domain":  "Which discipline does your need fall into?",
    "quote.step.details": "Can you briefly describe your project?",
    "quote.step.contact": "How can we get back to you?",
    "quote.step.done":    "Request sent successfully",

    // Agent
    "agent.title":      "Ernest · PRISE Concierge",
    "agent.tagline":    "Ask anything, I'll guide you.",
    "agent.placeholder": "Write a message…",
    "agent.mode.text":  "Text",
    "agent.mode.voice": "Voice",
    "agent.start":      "Start the voice conversation",
    "agent.stop":       "End",
    "agent.listening":  "Listening…",
    "agent.thinking":   "Thinking…",
    "agent.connecting": "Connecting…",
    "agent.error":      "Connection failed. Try again.",
    "agent.welcome":    "Hello. I'm Ernest, your concierge at PRISE Sarl. I speak more than sixty languages — tell me what you're looking for, or let me walk you through what we do. How can I help?",

    // Footer
    "footer.tagline":   "PRISE Sarl is a Congolese firm specialized in integrated engineering. From design to delivery, we build, connect, power and train for a durable future.",
    "footer.domains":   "Disciplines",
    "footer.links":     "Quick links",
    "footer.contact":   "Contact",
    "footer.privacy":   "Privacy policy",
    "footer.terms":     "Legal notice",
    "footer.copyright": "All rights reserved.",
  },
} as const;

export type TKey = keyof typeof DICT.fr;
