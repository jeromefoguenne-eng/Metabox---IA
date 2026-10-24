// Base de données pédagogique intégrale - Métabox HECh (SAR)
// Cours Moodle ID: 685 & Volet IA "Petite Réussite"

export const METABOX_INFO = {
  title: "Petite Réussite - Métabox IA",
  subtitle: "Hub interactif d'accompagnement à la réussite et d'entraînement outillé par IA",
  institution: "Haute École Charlemagne (HECh)",
  service: "Service d'Accompagnement à la Réussite (SAR)",
  version: "1.0.0-prototype",
  moodleCourseId: "685",
  academicYear: "2025-2026"
};

export const TILES = [
  {
    id: "tile-news",
    number: 1,
    title: "Métabox News",
    shortDesc: "Actualités, conseils saisonniers, rentrée, blocus et sessions d'examens",
    icon: "Newspaper",
    badge: "Info & Actualités",
    color: "from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30",
    sections: [
      {
        id: "news-2025-2026",
        title: "Édition 2025-2026",
        items: [
          {
            period: "Octobre 2025",
            theme: "Rentrée & Repères Académiques",
            summary: "Prendre un rythme d'étude régulier, comprendre son PAE, se familiariser avec les outils numériques (Moodle, Teams) et éviter l'effet d'illusion de maîtrise.",
            tips: [
              "Établir un horaire de travail hebdomadaire dès la semaine 3",
              "Relire ses notes le soir même (loi du réinvestissement immédiat)",
              "Repérer les contacts du SAR et des délégués de section"
            ]
          },
          {
            period: "Décembre 2025",
            theme: "Préparation du Blocus de Janvier",
            summary: "Comment organiser ses semaines de révision, planifier les matières difficiles en priorité et maintenir une hygiène de vie saine (sommeil, nutrition).",
            tips: [
              "Élaborer un planning de blocus réaliste avec des demi-journées de sécurité",
              "Varier les modes de révision : fiches actives, auto-interrogation, exercices types",
              "Dormir 7 à 8h par nuit pour consolider les traces mnésiques"
            ]
          },
          {
            period: "Avril 2026",
            theme: "Bilan du Q1 & Stratégie pour le Q2",
            summary: "Capitaliser sur les réussites du premier quadrimestre, analyser les erreurs pour ajuster sa méthode et aborder le Q2 avec confiance.",
            tips: [
              "Consulter ses copies d'examen de janvier pour comprendre les attentes non atteintes",
              "Ne pas laisser s'accumuler les travaux pratiques et rapports",
              "Participer aux ateliers de remédiation du SAR"
            ]
          },
          {
            period: "Mai 2026",
            theme: "Sprint Final & Session de Juin",
            summary: "Gestion du stress pré-évaluation, simulation d'examens oraux et écrits, techniques de respiration et relecture finale.",
            tips: [
              "S'entraîner en conditions réelles avec minuteur",
              "Utiliser la check-list Ortho'Express avant toute remise écrite",
              "Soigner l'argumentation et la structure des réponses"
            ]
          }
        ]
      },
      {
        id: "news-2024-2025",
        title: "Archives Édition 2024-2025",
        items: [
          { period: "Octobre 2024", theme: "L'art de la prise de notes efficace", summary: "Passer de la transcription passive à la prise de notes synthétique (méthode Cornell)." },
          { period: "Décembre 2024", theme: "Loi de Parkinson et lutte contre la procrastination", summary: "Fixer des micro-échéances pour ne pas subir le temps disponible." },
          { period: "Février 2025", theme: "Après la délibération : comprendre son relevé de notes", summary: "Notions de moyenne, dispenses, crédits acquis et préparation de la session de rattrapage." },
          { period: "Avril 2025", theme: "Optimiser sa mémoire de travail", summary: "La répétition espacée et la double modalité (visuel + auditif)." }
        ]
      }
    ]
  },
  {
    id: "tile-lang",
    number: 2,
    title: "Partie Langagière",
    shortDesc: "Comprendre les consignes, décoder les verbes d'action et rédiger la réponse attendue",
    icon: "BookOpenCheck",
    badge: "5 Modules Fondamentaux",
    color: "from-indigo-500/20 to-purple-600/20 text-indigo-400 border-indigo-500/30",
    modules: [
      {
        id: "lang-mod1",
        title: "Module 1 : Introduction & Auto-évaluation en français",
        description: "Positionnement initial pour identifier ses forces et ses axes de progrès en compréhension et expression académique.",
        content: "Une bonne maîtrise de la langue écrite est le premier facteur de réussite aux examens. Ce module vous permet d'évaluer votre niveau de départ avec des feedbacks immédiats.",
        hasExercises: true,
        exerciseIds: ["exo-diag-1"]
      },
      {
        id: "lang-mod2",
        title: "Module 2 : Vocabulaire des consignes d'évaluation",
        description: "Décryptage des verbes d'action cognitifs (analyser, synthétiser, comparer, justifier, illustrer).",
        content: `Face à une consigne, distinguez deux types de verbes :
1. Les verbes de contexte : ils posent la situation ou désignent l'objet d'étude.
2. Les verbes d'action : ils dictent la tâche cognitive à accomplir.
   - Verbes précis : souligner, lister, biffer, cocher.
   - Verbes intermédiaires : relever, catégoriser, classer.
   - Verbes conceptuels à haute exigence : décrire, expliquer, comparer, argumenter, justifier.`,
        hasExercises: true,
        exerciseIds: ["exo-verbes-1", "exo-verbes-2", "exo-verbes-3", "exo-verbes-4"]
      },
      {
        id: "lang-mod3",
        title: "Module 3 : Analyse méthodique de consignes",
        description: "Méthode de découpage en 4 étapes pour ne jamais répondre à côté.",
        content: `La méthode en 4 temps :
Étape 1 : Repérer le ou les verbes d'action (attention aux doubles consignes invisibles !).
Étape 2 : Identifier le mot-clé thématique (sur quoi porte exactement la question ?).
Étape 3 : Identifier les contraintes formelles (longueur, format, justification obligatoire, langue).
Étape 4 : Reformuler la question avec ses propres mots avant d'écrire.`,
        hasExercises: true,
        exerciseIds: ["exo-analyse-1", "exo-analyse-2"]
      },
      {
        id: "lang-mod4",
        title: "Module 4 : Comment rédiger la bonne réponse",
        description: "Aligner sa réponse sur le gabarit attendu par le correcteur.",
        content: `Pour satisfaire le correcteur académique :
• Reprendre les termes de la question dans la phrase d'amorce.
• Structurer avec des connecteurs logiques (d'une part, en revanche, par conséquent).
• Ne jamais affirmer sans illustrer d'un exemple ou d'une preuve textuelle/chiffrée.
• Rédiger une conclusion concise qui répond directement au problème posé.`,
        hasExercises: false
      },
      {
        id: "lang-mod5",
        title: "Module 5 : Exercices récapitulatifs",
        description: "Mise en pratique sur de vrais sujets d'évaluation universitaire.",
        content: "Testez votre agilité sur les pièges fréquents des examens du supérieur.",
        hasExercises: true,
        exerciseIds: ["exo-recap-1", "exo-recap-2", "exo-recap-3"]
      }
    ]
  },
  {
    id: "tile-glossary",
    number: 3,
    title: "Glossaire Général du Supérieur",
    shortDesc: "Tous les termes du décret Paysage et du cursus académique (ECTS, UE, AA, etc.)",
    icon: "HelpCircle",
    badge: "Référentiel FWB",
    color: "from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30",
    termsCount: 22
  },
  {
    id: "tile-methodo",
    number: 4,
    title: "Partie Méthodologie",
    shortDesc: "Mémorisation active, loi de Parkinson, planification hebdomadaire et matrice Eisenhower",
    icon: "BrainCircuit",
    badge: "Sciences Cognitives",
    color: "from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30",
    modules: [
      {
        id: "meth-mod1",
        title: "Module 1 : Comment mémoriser efficacement ?",
        description: "Neuro-pédagogie, courbe d'Ebbinghaus, répétition espacée et double codage.",
        content: `La courbe de l'oubli montre qu'après seulement 20 minutes, on a déjà perdu près de 40% des détails reçus en cours passif. Après 24 heures sans réactivation, il ne reste que 30 à 40% !
La solution :
• Le rappel espacé (J+1, J+3, J+7, J+21, J+60).
• L'auto-test actif (flashcards, quiz) plutôt que la simple relecture passive.
• Le double codage (associer un schéma conceptuel à une définition verbale).`,
        hasExercises: true,
        exerciseIds: ["exo-meth-ebbinghaus"]
      },
      {
        id: "meth-mod2",
        title: "Module 2 : Comment gérer les échéances & Loi de Parkinson",
        description: "« Le travail s'étale de façon à occuper tout le temps disponible pour son achèvement ».",
        content: `Si vous vous donnez 3 semaines pour rédiger un rapport, il vous prendra 3 semaines. Si vous vous donnez 3 jours avec un focus strict, vous l'aurez terminé en 3 jours !
Application concrète :
1. Fractionner les gros projets en micro-tâches de 45 minutes (technique Pomodoro).
2. Fixer des deadlines artificielles anticipées de 48 heures.
3. Supprimer les distractions numériques pendant les sessions de concentration intense.`,
        hasExercises: false
      },
      {
        id: "meth-mod3",
        title: "Module 3 : Prioriser & Planifier sa semaine (Matrice d'Eisenhower)",
        description: "Distinguer l'urgent de l'important et structurer son rétro-planning.",
        content: `La matrice d'Eisenhower classe les tâches en 4 quadrants :
• Q1 : Urgent & Important (À faire immédiatement : préparation TP de demain, urgence administrative).
• Q2 : Non Urgent mais Important (Le cœur de la réussite : révision continue, fiches, mémorisation).
• Q3 : Urgent mais Non Important (Déléguer ou traiter par lots : messages de groupe, notifications).
• Q4 : Ni Urgent ni Important (À éliminer ou limiter : scroll infini sur les réseaux).`,
        hasExercises: true,
        exerciseIds: ["exo-eisenhower-interactive"]
      }
    ]
  },
  {
    id: "tile-student",
    number: 5,
    title: "Le Métier d'Étudiant.e",
    shortDesc: "Statuts, droits, devoirs, démarches administratives et posture de l'adulte apprenant",
    icon: "GraduationCap",
    badge: "Vie Universitaire",
    color: "from-violet-500/20 to-fuchsia-600/20 text-violet-400 border-violet-500/30",
    modules: [
      {
        id: "stu-mod1",
        title: "Le Métier d'Étudiant : Droits, Devoirs et Posture",
        description: "Passer du statut d'élève encadré au statut d'étudiant autonome et acteur de sa formation.",
        content: `Être étudiant dans le supérieur implique :
• Autonomie dans la gestion de sa présence et de ses apprentissages.
• Respect du Règlement Général des Études et des Examens (RGEE).
• Statuts particuliers (PEPS : Profils Spécifiques pour sportifs de haut niveau, artistes, étudiants entrepreneurs ou avec troubles de l'apprentissage/santé).
• Connaissance des voies de recours et des interlocuteurs (SAR, délégués, secrétariat, présidence de jury).`,
        hasExercises: true,
        exerciseIds: ["exo-student-quiz"]
      }
    ]
  },
  {
    id: "tile-digital",
    number: 6,
    title: "Compétences Numériques",
    shortDesc: "Maîtriser Moodle, Teams, OneDrive, Word académique, PowerPoint et la cybersécurité",
    icon: "Laptop",
    badge: "Outils HECh",
    color: "from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30",
    guides: [
      {
        id: "guide-m365",
        title: "1. Microsoft 365 institutionnel (Teams & Outlook)",
        content: "Connexion avec vos identifiants HECh. Règle d'or de la communication par mail : toujours mentionner votre nom, prénom, section, année d'études et numéro matricule."
      },
      {
        id: "guide-cloud",
        title: "2. Organisation Cloud & OneDrive",
        content: "Créer une arborescence claire : `[Année] / [Quadrimestre] / [Code_UE] / Cours_Notes_Travaux`. Ne jamais conserver un document unique sur une clé USB sans sauvegarde cloud synchronisée."
      },
      {
        id: "guide-moodle",
        title: "3. Maîtriser Moodle HECh",
        content: "Consulter régulièrement le tableau de bord, vérifier les dates limites des devoirs (dépôts de fichiers), activer les notifications et participer aux forums d'entraide."
      },
      {
        id: "guide-word",
        title: "4. Rédaction normalisée sous Word",
        content: "Utiliser impérativement les Styles (Titre 1, Titre 2, Normal) pour générer automatiquement une table des matières. Respecter les normes bibliographiques (APA) et insérer les numéros de page."
      },
      {
        id: "guide-ppt",
        title: "5. Diaporama de soutenance orale",
        content: "Règle des 6x6 : maximum 6 lignes par diapositive, 6 mots par ligne. Le diaporama n'est pas un prompteur mais un appui visuel graphique."
      },
      {
        id: "guide-cyber",
        title: "6. Cybersécurité & Données personnelles",
        content: "Ne jamais partager son mot de passe institutionnel, se déconnecter des ordinateurs des salles informatiques et vérifier l'expéditeur des courriels (phishing)."
      }
    ],
    hasDiagnosticQuiz: true
  },
  {
    id: "tile-ortho",
    number: 7,
    title: "Ortho'Express",
    shortDesc: "Méthode de relecture sélective en 5 passes, règles d'accords et conjugaisons pièges",
    icon: "SpellCheck",
    badge: "Remédiation Rapide",
    color: "from-rose-500/20 to-pink-600/20 text-rose-400 border-rose-500/30",
    checklist: [
      { step: "Passe 1", target: "Les accords Sujet-Verbe", tip: "Repérer chaque verbe conjugué et lui poser la question : Qui est-ce qui fait l'action ?" },
      { step: "Passe 2", target: "Les participes passés (é, és, ée, ées)", tip: "Remplacer mentalement par un verbe du 3e groupe (mordre / mordu). Avec ÊTRE, accord systématique avec le sujet. Avec AVOIR, accord uniquement si le COD est placé AVANT." },
      { step: "Passe 3", target: "Les accords dans le Groupe Nominal", tip: "Vérifier la chaîne d'accord : Déterminant + Nom + Adjectif (ex: 'les nouvelles directives universitaires')." },
      { step: "Passe 4", target: "Les homophones grammaticaux", tip: "a/à, son/sont, et/est, ce/se, ces/ses, ou/où. Remplacer par avait, étaient, était pour tester." },
      { step: "Passe 5", target: "La ponctuation et les majuscules", tip: "Une phrase = une idée. Pas de phrases fleuves de 6 lignes. Majuscule au début, point final à la fin." }
    ],
    hasExercises: true,
    exerciseIds: ["exo-ortho-1", "exo-ortho-2"]
  },
  {
    id: "tile-ia",
    number: 8,
    isNew: true,
    title: "Lab IA & Entraînement Intelligent",
    shortDesc: "Le volet innovant : Tuteur intelligent, simulateur d'évaluation, analyseur de consignes et serious games",
    icon: "Sparkles",
    badge: "Volet NOUVEAU ✨",
    color: "from-violet-500/30 via-indigo-500/20 to-cyan-500/30 text-cyan-300 border-cyan-400/40 ring-1 ring-cyan-500/30",
    features: [
      {
        id: "ia-analyzer",
        title: "1. Analyseur de Consignes d'Examen IA",
        status: "Prototype Actif",
        desc: "Collez une consigne réelle d'examen et l'assistant identifie instantanément les verbes d'action, les attentes cachées, la difficulté cognitive et le gabarit de réponse idéal."
      },
      {
        id: "ia-simulator",
        title: "2. Simulateur de Réponses & Feedback Formatif",
        status: "Prototype Actif",
        desc: "Rédigez votre réponse à un exercice type et obtenez une évaluation formative instantanée selon la grille critériée académique de la HECh."
      },
      {
        id: "ia-generator",
        title: "3. Générateur d'Exercices Adaptatifs",
        status: "En Conception",
        desc: "Générez à la demande de nouvelles questions ciblées sur vos points faibles (accords complexes, connecteurs logiques, verbes d'analyse)."
      },
      {
        id: "ia-games",
        title: "4. Serious Games IA (Jeux Pédagogiques)",
        status: "Roadmap Étudiant",
        desc: "3 mini-jeux en cours de création : 'Mission Réussite' (aventure textuelle), 'Défi Consignes Express' (contre-la-montre), et 'Duel Ortho'."
      }
    ]
  }
];

export const GLOSSARY_ITEMS = [
  {
    term: "ECTS (European Credit Transfer and Accumulation System)",
    definition: "Unité de mesure du volume de travail exigé de l'étudiant (cours, travaux, études personnelles). 1 crédit ECTS équivaut environ à 25 à 30 heures de travail global. Une année académique type compte 60 crédits ECTS.",
    category: "Cursus & Crédits"
  },
  {
    term: "UE (Unité d'Enseignement)",
    definition: "Ensemble cohérent d'une ou plusieurs activités d'apprentissage (AA) concourant à l'acquisition de compétences précises. L'évaluation et la note finale sont attribuées à l'échelle de l'UE.",
    category: "Structure des Cours"
  },
  {
    term: "AA (Activité d'Apprentissage)",
    definition: "Composante d'une Unité d'Enseignement (cours théorique, travaux pratiques, stage, séminaire). Plusieurs AA peuvent être regroupées au sein d'une même UE.",
    category: "Structure des Cours"
  },
  {
    term: "PAE (Programme Annuel de l'Étudiant)",
    definition: "Ensemble des Unités d'Enseignement auxquelles l'étudiant est inscrit pour une année académique donnée (généralement 60 crédits, minimum 45 sauf aménagement spécifique). Il est validé par le jury.",
    category: "Gestion Administrative"
  },
  {
    term: "Prérequis",
    definition: "Unité d'enseignement dont les acquis d'apprentissage doivent obligatoirement être validés (crédits acquis) avant de pouvoir s'inscrire à une autre UE ultérieure.",
    category: "Cursus & Crédits"
  },
  {
    term: "Co-requis",
    definition: "Unité d'enseignement qui doit être suivie simultanément (au cours de la même année académique) ou avoir déjà été validée.",
    category: "Cursus & Crédits"
  },
  {
    term: "Crédits acquis",
    definition: "Crédits associés à une UE réussie avec une note minimale de 10/20. Ces crédits sont définitivement acquis et capitalisables pour l'obtention du diplôme.",
    category: "Évaluation & Jury"
  },
  {
    term: "Crédits résiduels",
    definition: "Crédits d'Unités d'Enseignement non validées lors de l'année précédente et qui doivent être réinscrits au PAE de l'année suivante en priorité.",
    category: "Évaluation & Jury"
  },
  {
    term: "Jury de délibération",
    definition: "Collège des enseignants responsables des UE d'un cycle d'études, chargé d'entériner les résultats des étudiants, de valider la réussite ou d'accorder des dispenses.",
    category: "Évaluation & Jury"
  },
  {
    term: "Blocus",
    definition: "Période sans cours située juste avant les sessions d'examens (en décembre/janvier et mai/juin), dédiée exclusivement aux révisions et à la préparation des évaluations.",
    category: "Vie Universitaire"
  },
  {
    term: "Session de rattrapage (Q3 / Session d'août-septembre)",
    definition: "Deuxième chance offerte aux étudiants n'ayant pas validé toutes leurs UE lors des sessions de janvier (Q1) ou de juin (Q2).",
    category: "Évaluation & Jury"
  },
  {
    term: "RGEE (Règlement Général des Études et des Examens)",
    definition: "Texte officiel régissant l'ensemble des règles administratives, pédagogiques, de présence, de fraude et de recours au sein de la HECh.",
    category: "Gestion Administrative"
  },
  {
    term: "SAR (Service d'Accompagnement à la Réussite)",
    definition: "Service institutionnel de la HECh dédié au soutien pédagogique des étudiants : ateliers méthodologiques, tutorat, remédiation en français, écoute et orientation.",
    category: "Soutien & Accompagnement"
  },
  {
    term: "PEPS (Profils Spécifiques)",
    definition: "Statut accordé sur dossier aux étudiants ayant des besoins d'aménagements raisonnables (sportifs de haut niveau, artistes, étudiants entrepreneurs, situation de handicap ou troubles neuro-développementaux).",
    category: "Soutien & Accompagnement"
  },
  {
    term: "Dispense",
    definition: "Exemption de suivre et de présenter une UE ou une AA, accordée par le jury sur base d'acquis antérieurs formels ou valorisés.",
    category: "Évaluation & Jury"
  },
  {
    term: "Allègement",
    definition: "Aménagement officiel permettant à un étudiant de s'inscrire à un PAE de moins de 60 crédits (motifs médicaux, professionnels, familiaux dument justifiés).",
    category: "Gestion Administrative"
  }
];

export const QUIZ_DATABASE = {
  // Exercice 2 de la Tuile Langagière
  "exo-verbes-1": {
    id: "exo-verbes-1",
    tileId: "tile-lang",
    title: "Exercice 2 : Identification & Signification des Verbes de Consigne",
    source: "Gilson, G. (s.d.). Comprendre et appliquer des consignes. Ludum Invaders / Moodle HECh",
    instruction: "Pour chaque verbe de consigne proposé, sélectionnez la correspondance exacte.",
    questions: [
      {
        id: "q1",
        verb: "Biffer",
        options: ["Barrer", "Gommer", "Tracer un trait sous le mot"],
        correctIndex: 0,
        explanation: "Biffer signifie barrer ou rayer un mot d'un trait (souvent pour l'annuler ou l'éliminer)."
      },
      {
        id: "q2",
        verb: "Définir",
        options: ["Expliquer le sens", "Terminer le tout en une fois", "Donner les caractéristiques"],
        correctIndex: 0,
        explanation: "Définir consiste à formuler avec exactitude la signification d'un terme ou d'un concept."
      },
      {
        id: "q3",
        verb: "Citer",
        options: ["Expliquer", "Numéroter", "Nommer"],
        correctIndex: 2,
        explanation: "Citer consiste à nommer, énoncer ou reproduire textuellement un élément sans nécessairement le développer."
      },
      {
        id: "q4",
        verb: "Cocher",
        options: ["Assembler", "Placer un petit trait dans une case en face d'une proposition", "Effacer"],
        correctIndex: 1,
        explanation: "Cocher signifie marquer d'un signe (croix ou coche) une case prédéfinie."
      },
      {
        id: "q5",
        verb: "Souligner",
        options: ["Tracer un trait sous le mot", "Tracer un ovale autour de...", "Séparer par des traits"],
        correctIndex: 0,
        explanation: "Souligner signifie tracer une ligne continue directement sous les mots désignés."
      },
      {
        id: "q6",
        verb: "Relier",
        options: ["Placer deux éléments l'un à côté de l'autre", "Tracer une ligne allant d'un élément à un autre", "Lire une seconde fois"],
        correctIndex: 1,
        explanation: "Relier consiste à établir une connexion visible (flèche ou trait) entre deux correspondances."
      },
      {
        id: "q7",
        verb: "Classer",
        options: ["Ranger dans un certain ordre ou selon des catégories", "Recopier au propre", "Organiser son classeur"],
        correctIndex: 0,
        explanation: "Classer implique de regrouper ou d'ordonner des éléments selon un critère logique explicite."
      },
      {
        id: "q8",
        verb: "Énumérer",
        options: ["Citer des éléments les uns après les autres", "Donner une longue explication", "Donner le nombre total"],
        correctIndex: 0,
        explanation: "Énumérer consiste à énoncer une liste ordonnée ou à puces de données ou d'arguments."
      },
      {
        id: "q9",
        verb: "Compléter",
        options: ["Ajouter ce qui manque pour rendre complet", "Choisir la bonne réponse au hasard", "Tout réécrire"],
        correctIndex: 0,
        explanation: "Compléter consiste à insérer l'information manquante dans un texte à trous ou un schéma incomplet."
      },
      {
        id: "q10",
        verb: "Comparer",
        options: ["Assembler parallèlement deux éléments", "Utiliser un instrument de mesure", "Trouver les ressemblances et les différences entre deux éléments"],
        correctIndex: 2,
        explanation: "Comparer exige obligatoirement de mettre en regard deux objets en dégageant points communs ET divergences."
      }
    ]
  },

  // Exercice Méthodologie - Courbe d'Ebbinghaus
  "exo-meth-ebbinghaus": {
    id: "exo-meth-ebbinghaus",
    tileId: "tile-methodo",
    title: "Quiz : Mémorisation & Courbe de l'Oubli (Sciences Cognitives)",
    source: "Recherches d'Hermann Ebbinghaus & Neuro-éducation / SAR HECh",
    instruction: "Évaluez vos connaissances sur le fonctionnement de la mémoire humaine et la dégradation naturelle des souvenirs.",
    questions: [
      {
        id: "mq1",
        question: "Après mémorisation sans réactivation, quel est le pourcentage d'informations encore retenues après 20 minutes de cours ?",
        options: ["100 %", "80 %", "60 %", "40 %"],
        correctIndex: 2,
        explanation: "Dès les premières 20 minutes, environ 40% des données s'évaporent si aucune prise de note active ou réactivation immédiate n'a lieu."
      },
      {
        id: "mq2",
        question: "Après mémorisation, quel est le pourcentage d'informations encore retenues après une journée (24h) ?",
        options: ["90 %", "70 %", "30-40 %", "10 %"],
        correctIndex: 2,
        explanation: "Après 24 heures sans réactivation, le cerveau humain ne conserve en moyenne qu'environ un tiers des informations reçues."
      },
      {
        id: "mq3",
        question: "Après 6 mois sans aucune révision, quel est le pourcentage moyen d'informations conservées en mémoire résiduelle ?",
        options: ["30 %", "20 %", "10 %", "0 %"],
        correctIndex: 2,
        explanation: "Il ne reste qu'environ 10% d'éléments résiduels. Cela prouve l'inefficacité totale d'un apprentissage massif fait au dernier moment qui n'est jamais réactivé."
      },
      {
        id: "mq4",
        question: "Quelle stratégie scientifiquement validée permet d'endiguer efficacement la courbe de l'oubli ?",
        options: [
          "Allonger la durée d'une seule session d'étude continue",
          "Relire son cours passivement tous les jours à la même heure",
          "Réaliser des rappels actifs et espacés dans le temps (J+1, J+3, J+7, J+21)"
        ],
        correctIndex: 2,
        explanation: "La répétition espacée (spaced retrieval practice) oblige le cerveau à reconstruire le chemin synaptique, ce qui ancre définitivement l'information en mémoire à long terme."
      }
    ]
  },

  // Exercice 1 Conjugaison (Ortho'Express)
  "exo-ortho-1": {
    id: "exo-ortho-1",
    tileId: "tile-ortho",
    title: "Exercice 1 : Conjugaison & Temps Pièges de l'Enseignement Supérieur",
    source: "Ortho'Express HECh",
    instruction: "Complétez chaque phrase avec la forme verbale conjuguée exacte.",
    questions: [
      {
        id: "oq1",
        prompt: "Conjuguez le verbe 'nettoyer' à l'indicatif présent, 3e personne du pluriel :",
        context: "Ils ..................................... la salle de laboratoire avant de partir.",
        correctAnswers: ["nettoient"],
        explanation: "Les verbes en -oyer changent leur 'y' en 'i' devant un 'e' muet : ils nettoient."
      },
      {
        id: "oq2",
        prompt: "Conjuguez le verbe 'déceler' au subjonctif présent, 3e personne du pluriel :",
        context: "Il faut qu'ils ..................................... l'origine de l'erreur dans l'algorithme.",
        correctAnswers: ["décèlent", "decelent"],
        explanation: "Au subjonctif présent : qu'ils décèlent (accent grave sur le e)."
      },
      {
        id: "oq3",
        prompt: "Conjuguez le verbe 'aboyer' au futur simple, à la 3e personne du singulier :",
        context: "Le chien ..................................... si quelqu'un s'approche.",
        correctAnswers: ["aboiera"],
        explanation: "Futur simple : il aboiera (avec un 'i')."
      },
      {
        id: "oq4",
        prompt: "Conjuguez le verbe 'voir' au futur simple, à la 2e personne du singulier :",
        context: "Demain lors de l'entretien, tu ..................................... le coordinateur de section.",
        correctAnswers: ["verras"],
        explanation: "Le radical du futur pour le verbe voir prend deux 'r' : tu verras."
      },
      {
        id: "oq5",
        prompt: "Conjuguez le verbe 'plier' à l'indicatif imparfait, à la 2e personne du pluriel :",
        context: "Pendant l'atelier créatif, vous ..................................... les feuilles de calque.",
        correctAnswers: ["pliiez"],
        explanation: "À l'imparfait avec vous, on conserve le 'i' du radical suivi du 'iez' de la terminaison : vous pliiez."
      },
      {
        id: "oq6",
        prompt: "Conjuguez le verbe 'mourir' au subjonctif présent, à la 3e personne du pluriel :",
        context: "Le biologiste veille à ce que les cellules ne ..................................... pas au froid.",
        correctAnswers: ["meurent"],
        explanation: "Subjonctif présent : qu'ils/qu'elles meurent."
      },
      {
        id: "oq7",
        prompt: "Conjuguez le verbe 'courir' au conditionnel présent, à la 2e personne du pluriel :",
        context: "Si le train avait du retard, vous ..................................... pour arriver à l'examen.",
        correctAnswers: ["courriez"],
        explanation: "Au conditionnel présent, courir prend deux 'r' : vous courriez."
      }
    ]
  },

  // Quiz Étudiant & Vie Universitaire
  "exo-student-quiz": {
    id: "exo-student-quiz",
    tileId: "tile-student",
    title: "Quiz : Métier d'Étudiant & Règles Académiques HECh",
    source: "Service d'Accompagnement à la Réussite HECh",
    instruction: "Testez votre connaissance du fonctionnement de l'enseignement supérieur.",
    questions: [
      {
        id: "sq1",
        question: "Que se passe-t-il si un étudiant est absent injustifié à une évaluation d'une AA composant une UE ?",
        options: [
          "Il reçoit un zéro pour toute l'UE ou la mention 'Absent', rendant l'UE non validée",
          "La note des autres AA compense automatiquement",
          "Il est immédiatement exclu de l'école"
        ],
        correctIndex: 0,
        explanation: "Toute absence non justifiée par certificat médical officiel entraîne l'échec à l'UE pour la session concernée."
      },
      {
        id: "sq2",
        question: "À quelle condition des crédits ECTS d'une UE sont-ils définitivement acquis ?",
        options: [
          "Dès que la note globale de l'UE atteint au minimum 10/20",
          "Uniquement si l'étudiant a au moins 12/20 partout",
          "Si la moyenne générale de l'année est de 10/20, même avec 6/20 dans l'UE"
        ],
        correctIndex: 0,
        explanation: "Dans le décret Paysage, une UE est réussie dès qu'elle obtient au moins 10/20. Ses crédits sont alors définitivement acquis."
      },
      {
        id: "sq3",
        question: "Vers qui un étudiant doit-il se tourner en priorité en cas de difficulté méthodologique ou de risque de décrochage ?",
        options: [
          "Le SAR (Service d'Accompagnement à la Réussite) et son coordinateur de section",
          "Le tribunal de première instance",
          "Attendre le mois de juin sans rien dire"
        ],
        correctIndex: 0,
        explanation: "Le SAR de la HECh est spécifiquement financé et mandaté pour vous fournir un soutien individualisé, confidentiel et bienveillant."
      }
    ]
  }
};
