// Base de données pédagogique intégrale - Métabox HECh (SAR)
// Cours Moodle ID: 685 & Volet IA "Petite Réussite" (Version Gamifiée 2.0)

export const METABOX_INFO = {
  title: "Petite Réussite - Métabox IA",
  subtitle: "Plateforme gamifiée d'apprentissage, d'aide à la réussite et d'entraînement outillé par IA",
  institution: "Haute École Charlemagne (HECh)",
  service: "Service d'Accompagnement à la Réussite (SAR)",
  version: "2.0.0-ludique",
  moodleCourseId: "685",
  academicYear: "2025-2026"
};

export const TILES = [
  {
    id: "tile-news",
    number: 1,
    title: "Métabox News",
    shortDesc: "Actualités, conseils saisonniers, rentrée, blocus et sessions d'examens",
    questTitle: "Quête 1 : Anticiper le Rythme Académique",
    icon: "Newspaper",
    badge: "Info & Stratégie",
    xp: 50,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
    color: "from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30",
    accent: "sky",
    sections: [
      {
        id: "news-2025-2026",
        title: "Édition 2025-2026",
        items: [
          {
            period: "Octobre 2025",
            theme: "Rentrée & Repères Académiques",
            summary: "Prendre un rythme d'étude régulier, comprendre son PAE, se familiariser avec les outils numériques (Moodle, Teams) et éviter l'illusion de maîtrise.",
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
    questTitle: "Quête 2 : Maîtriser le Code des Évaluateurs",
    icon: "BookOpenCheck",
    badge: "5 Modules · Quiz 10 Q",
    xp: 100,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    color: "from-indigo-500/20 to-purple-600/20 text-indigo-400 border-indigo-500/30",
    accent: "indigo",
    modules: [
      {
        id: "lang-mod1",
        title: "Module 1 : Introduction & Auto-évaluation en français",
        description: "Positionnement initial pour identifier ses forces et ses axes de progrès en compréhension et expression académique.",
        content: "Une bonne maîtrise de la langue écrite est le premier facteur de réussite aux examens. Ce module vous permet d'évaluer votre niveau de départ avec des feedbacks immédiats.",
        hasExercises: true,
        exerciseIds: ["exo-verbes-1"]
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
        exerciseIds: ["exo-verbes-1"]
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
        hasExercises: false
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
        exerciseIds: ["exo-verbes-1"]
      }
    ]
  },
  {
    id: "tile-glossary",
    number: 3,
    title: "Glossaire du Supérieur",
    shortDesc: "Tous les termes du décret Paysage et du cursus académique (ECTS, UE, AA, etc.)",
    questTitle: "Quête 3 : Décrypter le Décret Paysage",
    icon: "HelpCircle",
    badge: "22 Définitions Clés",
    xp: 50,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80",
    color: "from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30",
    accent: "emerald"
  },
  {
    id: "tile-methodo",
    number: 4,
    title: "Méthodologie Active",
    shortDesc: "Mémorisation active, loi de Parkinson, planification hebdomadaire et matrice Eisenhower",
    questTitle: "Quête 4 : Dompter la Courbe de l'Oubli",
    icon: "BrainCircuit",
    badge: "Sciences Cognitives · Outils",
    xp: 120,
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80",
    color: "from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30",
    accent: "amber",
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
    questTitle: "Quête 5 : Devenir un Étudiant Autonome",
    icon: "GraduationCap",
    badge: "Vie de Campus · Quiz",
    xp: 60,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    color: "from-violet-500/20 to-fuchsia-600/20 text-violet-400 border-violet-500/30",
    accent: "violet",
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
    questTitle: "Quête 6 : L'Armure Numérique de l'Étudiant",
    icon: "Laptop",
    badge: "6 Guides Pratiques",
    xp: 80,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
    color: "from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30",
    accent: "cyan",
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
    ]
  },
  {
    id: "tile-ortho",
    number: 7,
    title: "Ortho'Express",
    shortDesc: "Méthode de relecture sélective en 5 passes, règles d'accords et conjugaisons pièges",
    questTitle: "Quête 7 : Le Bouclier Anti-Fautes",
    icon: "SpellCheck",
    badge: "5 Passes · Quiz Piège",
    xp: 100,
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
    color: "from-rose-500/20 to-pink-600/20 text-rose-400 border-rose-500/30",
    accent: "rose",
    checklist: [
      { step: "Passe 1", target: "Les accords Sujet-Verbe", tip: "Repérer chaque verbe conjugué et lui poser la question : Qui est-ce qui fait l'action ?" },
      { step: "Passe 2", target: "Les participes passés (é, és, ée, ées)", tip: "Remplacer mentalement par un verbe du 3e groupe (mordre / mordu). Avec ÊTRE, accord systématique avec le sujet. Avec AVOIR, accord uniquement si le COD est placé AVANT." },
      { step: "Passe 3", target: "Les accords dans le Groupe Nominal", tip: "Vérifier la chaîne d'accord : Déterminant + Nom + Adjectif (ex: 'les nouvelles directives universitaires')." },
      { step: "Passe 4", target: "Les homophones grammaticaux", tip: "a/à, son/sont, et/est, ce/se, ces/ses, ou/où. Remplacer par avait, étaient, était pour tester." },
      { step: "Passe 5", target: "La ponctuation et les majuscules", tip: "Une phrase = une idée. Pas de phrases fleuves de 6 lignes. Majuscule au début, point final à la fin." }
    ]
  },
  {
    id: "tile-ia",
    number: 8,
    isNew: true,
    title: "Lab IA & Entraînement",
    shortDesc: "Tuteur intelligent, simulateur d'évaluation, analyseur de consignes et Serious Games",
    questTitle: "Quête 8 : Dompter l'IA Pédagogique",
    icon: "Sparkles",
    badge: "Volet IA ✨ · Jeux Actifs",
    xp: 150,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    color: "from-violet-500/30 via-indigo-500/20 to-cyan-500/30 text-cyan-300 border-cyan-400/40 ring-1 ring-cyan-500/30",
    accent: "cyan",
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
        id: "ia-games",
        title: "3. Serious Games & Mini-Jeux IA",
        status: "Mini-Jeu Jouable !",
        desc: "Jouez au 'Défi Consignes Express' : sprint chronométré de 45 secondes pour tester vos réflexes d'examen !"
      },
      {
        id: "ia-creator",
        title: "4. Atelier Enseignant (Co-Création)",
        status: "Espace Formateur",
        desc: "Espace prêt à recevoir les futurs exercices, scénarios et jeux conçus avec le professeur Jérôme Foguenne."
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
  // Exercice 2 de la Tuile Langagière (Ordonné par graduation de difficulté croissante pour Qui veut gagner des crédits)
  "exo-verbes-1": {
    id: "exo-verbes-1",
    tileId: "tile-lang",
    title: "Exercice 2 : Identification & Signification des Verbes de Consigne",
    source: "Gilson, G. (s.d.). Comprendre et appliquer des consignes. Ludum Invaders / Moodle HECh",
    instruction: "Pour chaque verbe de consigne proposé, sélectionnez la correspondance exacte.",
    questions: [
      // Palier 1 : Tâches mécaniques directes (Facile - Paliers 6, 12, 18 ECTS)
      {
        id: "q1",
        verb: "Souligner",
        difficulty: "Facile",
        tier: 1,
        rewardEcts: 6,
        options: [
          "Tracer un trait continu sous le mot désigné",
          "Tracer un cercle ou un ovale autour de...",
          "Séparer par des traits obliques",
          "Mettre le mot en gras ou le surligner au feutre"
        ],
        correctIndex: 0,
        explanation: "Souligner signifie tracer une ligne continue directement sous les mots désignés."
      },
      {
        id: "q2",
        verb: "Cocher",
        difficulty: "Facile",
        tier: 1,
        rewardEcts: 12,
        options: [
          "Assembler plusieurs documents entre eux",
          "Placer un petit trait ou une croix dans une case en face d'une proposition",
          "Effacer définitivement la mauvaise réponse",
          "Numéroter les paragraphes dans la marge de la copie"
        ],
        correctIndex: 1,
        explanation: "Cocher signifie marquer d'un signe (croix ou coche) une case prédéfinie."
      },
      {
        id: "q3",
        verb: "Biffer",
        difficulty: "Facile",
        tier: 1,
        rewardEcts: 18,
        options: [
          "Barrer d'un trait continu pour éliminer ou annuler",
          "Gommer pour faire disparaître l'encre",
          "Tracer un trait sous le mot",
          "Surligner en couleur fluorescente"
        ],
        correctIndex: 0,
        explanation: "Biffer signifie barrer ou rayer un mot d'un trait (pour l'annuler ou l'éliminer)."
      },

      // Palier 2 : Organisation & Traitement intermédiaire (Intermédiaire - Paliers 24, 30, 36, 42 ECTS)
      {
        id: "q4",
        verb: "Relier",
        difficulty: "Intermédiaire",
        tier: 2,
        isSafetyTier: true, // PALIER DE SÉCURITÉ GARANTI !
        rewardEcts: 24,
        options: [
          "Placer deux éléments côte à côte sans les lier",
          "Tracer une ligne ou une flèche reliant deux correspondances",
          "Lire une seconde fois à voix haute",
          "Regrouper les termes dans un tableau à double entrée"
        ],
        correctIndex: 1,
        explanation: "Relier consiste à établir une connexion visible (flèche ou trait) entre deux correspondances."
      },
      {
        id: "q5",
        verb: "Citer",
        difficulty: "Intermédiaire",
        tier: 2,
        rewardEcts: 30,
        options: [
          "Expliquer en détail avec ses propres mots",
          "Numéroter les étapes d'un protocole",
          "Nommer ou reproduire textuellement un élément sans le développer",
          "Démontrer mathématiquement un théorème"
        ],
        correctIndex: 2,
        explanation: "Citer consiste à nommer, énoncer ou reproduire textuellement un élément sans nécessairement le développer."
      },
      {
        id: "q6",
        verb: "Énumérer",
        difficulty: "Intermédiaire",
        tier: 2,
        rewardEcts: 36,
        options: [
          "Citer des éléments les uns après les autres sous forme de liste",
          "Rédiger une longue explication continue",
          "Donner le nombre total de données chiffrées",
          "Créer une carte conceptuelle heuristique"
        ],
        correctIndex: 0,
        explanation: "Énumérer consiste à énoncer une liste ordonnée ou à puces de données ou d'arguments."
      },
      {
        id: "q7",
        verb: "Classer",
        difficulty: "Intermédiaire",
        tier: 2,
        rewardEcts: 42,
        options: [
          "Ranger dans un certain ordre ou selon des catégories logiques explicites",
          "Recopier au propre sans ratures",
          "Organiser ses feuilles dans un classeur",
          "Corriger les accords grammaticaux"
        ],
        correctIndex: 0,
        explanation: "Classer implique de regrouper ou d'ordonner des éléments selon un critère logique explicite."
      },

      // Palier 3 : Haute Exigence Conceptuelle (Difficile - Paliers 48, 54, 60 ECTS)
      {
        id: "q8",
        verb: "Définir",
        difficulty: "Haute Exigence",
        tier: 3,
        rewardEcts: 48,
        options: [
          "Énoncer avec rigueur et exactitude la signification d'un terme",
          "Terminer le devoir en une seule session continue",
          "Donner son avis personnel sur le concept",
          "Illustrer uniquement par un exemple anecdotique"
        ],
        correctIndex: 0,
        explanation: "Définir consiste à formuler avec exactitude la signification d'un terme ou d'un concept."
      },
      {
        id: "q9",
        verb: "Compléter",
        difficulty: "Haute Exigence",
        tier: 3,
        rewardEcts: 54,
        options: [
          "Insérer ce qui manque pour rendre un texte ou schéma complet",
          "Choisir la réponse au hasard parmi des distracteurs",
          "Tout réécrire depuis le début de la consigne",
          "Traduire les termes techniques en français courant"
        ],
        correctIndex: 0,
        explanation: "Compléter consiste à insérer l'information manquante dans un texte à trous ou un schéma incomplet."
      },
      {
        id: "q10",
        verb: "Comparer",
        difficulty: "Haute Exigence",
        tier: 3,
        rewardEcts: 60,
        options: [
          "Assembler parallèlement deux éléments sans les analyser",
          "Utiliser un instrument de mesure quantitatif",
          "Mettre en regard deux objets en dégageant ressemblances ET différences",
          "Classer par ordre chronologique de découverte"
        ],
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

  // Exercice 1 Conjugaison (Ortho'Express) - La Roue des Accords
  "exo-ortho-1": {
    id: "exo-ortho-1",
    tileId: "tile-ortho",
    title: "La Roue des Accords : Les Grandes Énigmes de la Conjugaison",
    source: "Ortho'Express HECh",
    instruction: "Faites tourner la roue, découvrez les lettres et reconstituez les phrases entières sur le mur de mots !",
    questions: [
      {
        id: "oq1",
        difficulty: "Niveau 1 : Présent d'usage",
        category: "ACCORD VERBES EN -OYER (PRÉSENT)",
        prompt: "Conjuguez le verbe 'nettoyer' à l'indicatif présent, 3e personne du pluriel :",
        context: "Ils nettoient la salle de laboratoire avant de partir.",
        fullSentence: "ILS NETTOIENT LA SALLE DE LABORATOIRE AVANT DE PARTIR",
        verbForm: "NETTOIENT",
        initialRevealed: ["E", "A"],
        correctAnswers: ["nettoient", "ILS NETTOIENT LA SALLE DE LABORATOIRE AVANT DE PARTIR"],
        explanation: "Les verbes en -oyer changent leur 'y' en 'i' devant un 'e' muet : ils nettoient."
      },
      {
        id: "oq2",
        difficulty: "Niveau 1 : Subjonctif présent",
        category: "SUBJONCTIF PRÉSENT DU VERBE DÉCELER",
        prompt: "Conjuguez le verbe 'déceler' au subjonctif présent, 3e personne du pluriel :",
        context: "Il faut qu'ils décèlent l'origine de l'erreur dans l'algorithme.",
        fullSentence: "IL FAUT QU'ILS DÉCÈLENT L'ORIGINE DE L'ERREUR DANS L'ALGORITHME",
        verbForm: "DÉCÈLENT",
        initialRevealed: ["E", "L"],
        correctAnswers: ["décèlent", "decelent", "IL FAUT QU'ILS DÉCÈLENT L'ORIGINE DE L'ERREUR DANS L'ALGORITHME"],
        explanation: "Au subjonctif présent : qu'ils décèlent (accent grave sur le e)."
      },
      {
        id: "oq3",
        difficulty: "Niveau 2 : Futur verbe en -oyer",
        category: "FUTUR SIMPLE DU VERBE ABOYER",
        prompt: "Conjuguez le verbe 'aboyer' au futur simple, à la 3e personne du singulier :",
        context: "Le chien aboiera si quelqu'un s'approche du bâtiment.",
        fullSentence: "LE CHIEN ABOIERA SI QUELQU'UN S'APPROCHE DU BÂTIMENT",
        verbForm: "ABOIERA",
        initialRevealed: ["I", "E"],
        correctAnswers: ["aboiera", "LE CHIEN ABOIERA SI QUELQU'UN S'APPROCHE DU BÂTIMENT"],
        explanation: "Futur simple : il aboiera (avec un 'i' devant la terminaison -era)."
      },
      {
        id: "oq4",
        difficulty: "Niveau 2 : Futur avec radical double consonne",
        category: "FUTUR SIMPLE DU VERBE VOIR",
        prompt: "Conjuguez le verbe 'voir' au futur simple, à la 2e personne du singulier :",
        context: "Demain lors de l'entretien, tu verras le coordinateur de section.",
        fullSentence: "DEMAIN LORS DE L'ENTRETIEN TU VERRAS LE COORDINATEUR DE SECTION",
        verbForm: "VERRAS",
        initialRevealed: ["R", "E"],
        correctAnswers: ["verras", "DEMAIN LORS DE L'ENTRETIEN TU VERRAS LE COORDINATEUR DE SECTION"],
        explanation: "Le radical du futur pour le verbe voir prend deux 'r' : tu verras."
      },
      {
        id: "oq5",
        difficulty: "Niveau 3 : Imparfait en -ier (Piège du double i)",
        category: "INDICATIF IMPARFAIT DU VERBE PLIER",
        prompt: "Conjuguez le verbe 'plier' à l'indicatif imparfait, à la 2e personne du pluriel :",
        context: "Pendant l'atelier créatif, vous pliiez les feuilles de calque.",
        fullSentence: "PENDANT L'ATELIER CRÉATIF VOUS PLIIEZ LES FEUILLES DE CALQUE",
        verbForm: "PLIIEZ",
        initialRevealed: ["I", "S"],
        correctAnswers: ["pliiez", "PENDANT L'ATELIER CRÉATIF VOUS PLIIEZ LES FEUILLES DE CALQUE"],
        explanation: "À l'imparfait avec vous, on conserve le 'i' du radical suivi du 'iez' de la terminaison : vous pliiez."
      },
      {
        id: "oq6",
        difficulty: "Niveau 3 : Subjonctif verbe du 3e groupe",
        category: "SUBJONCTIF PRÉSENT DU VERBE MOURIR",
        prompt: "Conjuguez le verbe 'mourir' au subjonctif présent, à la 3e personne du pluriel :",
        context: "Le biologiste veille à ce que les cellules ne meurent pas au froid.",
        fullSentence: "LE BIOLOGISTE VEILLE À CE QUE LES CELLULES NE MEURENT PAS AU FROID",
        verbForm: "MEURENT",
        initialRevealed: ["E", "T"],
        correctAnswers: ["meurent", "LE BIOLOGISTE VEILLE À CE QUE LES CELLULES NE MEURENT PAS AU FROID"],
        explanation: "Subjonctif présent : qu'ils/qu'elles meurent (radical meu-)."
      },
      {
        id: "oq7",
        difficulty: "Niveau 4 : Conditionnel avec double consonne",
        category: "CONDITIONNEL PRÉSENT DU VERBE COURIR",
        prompt: "Conjuguez le verbe 'courir' au conditionnel présent, à la 2e personne du pluriel :",
        context: "Si le train avait du retard, vous courriez pour arriver à l'examen.",
        fullSentence: "SI LE TRAIN AVAIT DU RETARD VOUS COURRIEZ POUR ARRIVER À L'EXAMEN",
        verbForm: "COURRIEZ",
        initialRevealed: ["R", "U"],
        correctAnswers: ["courriez", "SI LE TRAIN AVAIT DU RETARD VOUS COURRIEZ POUR ARRIVER À L'EXAMEN"],
        explanation: "Au conditionnel présent, courir prend deux 'r' : vous courriez (contrairement à l'imparfait : vous couriez)."
      },
      {
        id: "oq8",
        difficulty: "Niveau 4 : Subjonctif irrégulier",
        category: "SUBJONCTIF PRÉSENT DU VERBE ACQUÉRIR",
        prompt: "Conjuguez le verbe 'acquérir' au subjonctif présent, à la 3e personne du singulier :",
        context: "Il est impératif que chaque étudiant acquière les crédits de son bloc un.",
        fullSentence: "IL EST IMPÉRATIF QUE CHAQUE ÉTUDIANT ACQUIÈRE LES CRÉDITS DE SON BLOC UN",
        verbForm: "ACQUIÈRE",
        initialRevealed: ["A", "E"],
        correctAnswers: ["acquière", "acquiere", "IL EST IMPÉRATIF QUE CHAQUE ÉTUDIANT ACQUIÈRE LES CRÉDITS DE SON BLOC UN"],
        explanation: "Au subjonctif présent : qu'il acquière (avec accent grave sur le e et terminaison en -e)."
      },
      {
        id: "oq9",
        difficulty: "Niveau 5 : Futur irrégulier avec double r",
        category: "FUTUR SIMPLE DU VERBE ENVOYER",
        prompt: "Conjuguez le verbe 'envoyer' au futur simple, à la 1re personne du pluriel :",
        context: "Dès lundi matin, nous vous enverrons le relevé de notes officiel.",
        fullSentence: "DÈS LUNDI MATIN NOUS VOUS ENVERRONS LE RELEVÉ DE NOTES OFFICIEL",
        verbForm: "ENVERRONS",
        initialRevealed: ["O", "N"],
        correctAnswers: ["enverrons", "DÈS LUNDI MATIN NOUS VOUS ENVERRONS LE RELEVÉ DE NOTES OFFICIEL"],
        explanation: "Au futur simple, envoyer a pour radical enverr- avec deux 'r' : nous enverrons."
      },
      {
        id: "oq10",
        difficulty: "Niveau 5 : Accord du participe passé avec être",
        category: "PARTICIPE PASSÉ DU VERBE RÉSOUDRE",
        prompt: "Conjuguez le verbe 'résoudre' au participe passé au masculin pluriel :",
        context: "Tous les cas litigieux ont été résolus en séance plénière.",
        fullSentence: "TOUS LES CAS LITIGIEUX ONT ÉTÉ RÉSOLUS EN SÉANCE PLÉNIÈRE",
        verbForm: "RÉSOLUS",
        initialRevealed: ["S", "E"],
        correctAnswers: ["résolus", "resolus", "TOUS LES CAS LITIGIEUX ONT ÉTÉ RÉSOLUS EN SÉANCE PLÉNIÈRE"],
        explanation: "Le participe passé de résoudre est résolu (sans t). Au masculin pluriel accordé avec le sujet : résolus."
      }
    ]
  },

  // Quiz Étudiant & Vie Universitaire - Le Grand Concours de la HECh
  "exo-student-quiz": {
    id: "exo-student-quiz",
    tileId: "tile-student",
    title: "Le Grand Concours de la HECh : Règlements, Décret Paysage & Statuts",
    source: "Service d'Accompagnement à la Réussite HECh",
    instruction: "Affrontez les meilleurs étudiants des campus Rivageois, Huy, Verviers et Outremeuse sur le métier d'étudiant !",
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

export const BADGES_LIST = [
  { id: "badge-first-step", title: "Premier Pas", desc: "Avoir exploré votre 1ère tuile Métabox", icon: "Compass", color: "from-sky-500 to-blue-600" },
  { id: "badge-sniper", title: "Sniper de Consignes", desc: "Avoir réussi l'Exercice 2 sur les verbes", icon: "Target", color: "from-indigo-500 to-purple-600" },
  { id: "badge-ebbinghaus", title: "Cerveau Mnésique", desc: "Avoir dompté la courbe de l'oubli", icon: "Brain", color: "from-amber-500 to-orange-600" },
  { id: "badge-ortho", title: "Plume d'Or", desc: "Avoir complété le test de conjugaison", icon: "Feather", color: "from-rose-500 to-pink-600" },
  { id: "badge-ai", title: "Initié IA", desc: "Avoir analysé une consigne dans le Lab IA", icon: "Sparkles", color: "from-cyan-400 to-indigo-500" },
  { id: "badge-speedster", title: "Maître du Sprint", desc: "Avoir joué au Défi Consignes Express", icon: "Zap", color: "from-emerald-400 to-teal-500" }
];
