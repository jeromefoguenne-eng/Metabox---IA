// Banque de données officielle pour « Le Grand Concours de la HECh »
// 3 Manches inspirées des grands jeux télévisés académiques (Questions pour un Champion)
// Manche 1 : Questions de rapidité au buzzer (saisie au clavier en 10 secondes, premier à 3 points qualifié)
// Manche 2 : Le 4 à la suite (10 rubriques au choix)
// Manche 3 : Le Face-à-Face (indices descendants contre un finaliste)

// ============================================================================
// OUTILS DE VALIDATION INTELLIGENTE DES RÉPONSES TEXTUELLES
// (Normalisation accents, casse, ponctuation, articles et tolérance Levenshtein)
// ============================================================================
export function normalizeRapiditeAnswer(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/['’\-–—/]/g, " ") // Remplace apostrophes, slashs et tirets par des espaces
    .replace(/[^a-z0-9\s]/g, "") // Supprime la ponctuation restante
    .replace(/\b(le|la|les|l|un|une|des|du|de|d|en|au|aux)\b/g, "") // Supprime les articles français
    .replace(/\s+/g, " ") // Compresse les espaces multiples
    .trim();
}

function computeLevenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function isRapiditeAnswerCorrect(userInput, acceptedAnswers) {
  if (!userInput || !acceptedAnswers) return false;
  const cleanInput = normalizeRapiditeAnswer(userInput);
  if (!cleanInput) return false;

  for (const accepted of acceptedAnswers) {
    const cleanAccepted = normalizeRapiditeAnswer(accepted);
    if (!cleanAccepted) continue;

    // Correspondance exacte
    if (cleanInput === cleanAccepted) return true;

    // Inclusion mutuelle (ex: "hermann ebbinghaus" pour "ebbinghaus", ou "ects" dans "credit ects")
    if (cleanInput.includes(cleanAccepted) || cleanAccepted.includes(cleanInput)) {
      if (cleanAccepted.length >= 3 && cleanInput.length >= 3) {
        return true;
      }
    }

    // Tolérance d'une faute de frappe pour les mots de 5 lettres ou plus
    if (cleanAccepted.length >= 5 && Math.abs(cleanInput.length - cleanAccepted.length) <= 1) {
      if (computeLevenshtein(cleanInput, cleanAccepted) <= 1) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================================
// MANCHE 1 : BANQUE DE QUESTIONS DE RAPIDITÉ AU BUZZER (PAS DE QCM)
// Course aux 3 points : le premier candidat qui inscrit 3 bonnes réponses est qualifié !
// ============================================================================
export const RAPIDITE_QUESTIONS = [
  {
    id: "rap_1",
    theme: "DÉCRET PAYSAGE & ÉTUDES",
    question: "Quel système européen officiel de transfert et d'accumulation de crédits attribue forfaitairement 60 crédits par bloc annuel ?",
    displayAnswer: "ECTS (European Credit Transfer and Accumulation System)",
    acceptedAnswers: ["ects", "credit ects", "credits ects", "systeme ects", "european credit transfer system"],
    explanation: "Le système ECTS harmonise l'enseignement supérieur européen à raison de 60 crédits par bloc annuel (environ 1800h de travail)."
  },
  {
    id: "rap_2",
    theme: "SCIENCES COGNITIVES",
    question: "Quel psychologue allemand a théorisé la courbe exponentielle de l'oubli et la réactivation espacée en 1885 ?",
    displayAnswer: "Hermann Ebbinghaus",
    acceptedAnswers: ["ebbinghaus", "hermann ebbinghaus", "ebinghaus", "herman ebbinghaus"],
    explanation: "Hermann Ebbinghaus a démontré que sans réactivation rapide, plus des deux tiers des apprentissages s'évaporent en 24h."
  },
  {
    id: "rap_3",
    theme: "DURÉE DES ÉTUDES",
    question: "Combien de crédits ECTS au total composent le cursus complet d'un Bachelier de plein exercice en Haute École ?",
    displayAnswer: "180 crédits ECTS",
    acceptedAnswers: ["180", "180 ects", "180 credits", "cent quatre vingts", "cent quatre vingt", "180 credits ects"],
    explanation: "Un bachelier professionnalisant compte 180 crédits ECTS répartis en 3 blocs d'études annuels de 60 crédits."
  },
  {
    id: "rap_4",
    theme: "ORGANISATION ACADÉMIQUE",
    question: "Comment appelle-t-on le sous-ensemble pédagogique autonome qui compose une Unité d'Enseignement, abrégé par le sigle AA ?",
    displayAnswer: "Activité d'Apprentissage (AA)",
    acceptedAnswers: ["activite d'apprentissage", "activites d'apprentissage", "activite apprentissage", "activites apprentissage", "apprentissage"],
    explanation: "Une Unité d'Enseignement (UE) regroupe une ou plusieurs Activités d'Apprentissage (AA) complémentaires."
  },
  {
    id: "rap_5",
    theme: "SYSTÈME DE NOTATION",
    question: "En Fédération Wallonie-Bruxelles, quelle est la note minimale sur 20 exigée pour valider une Unité d'Enseignement sans compensation ?",
    displayAnswer: "10 / 20",
    acceptedAnswers: ["10", "10/20", "10 sur 20", "dix", "10 / 20"],
    explanation: "La note de 10/20 est le seuil légal de réussite garantissant l'octroi définitif des crédits ECTS associés à l'UE."
  },
  {
    id: "rap_6",
    theme: "INTELLIGENCE ARTIFICIELLE",
    question: "Quel terme désigne la fabrication d'affirmations plausibles mais totalement fausses et inventées par un modèle d'IA comme ChatGPT ?",
    displayAnswer: "Une hallucination (ou fabulation)",
    acceptedAnswers: ["hallucination", "hallucinations", "hallucination d'ia", "fabulation", "halluciner"],
    explanation: "L'hallucination survient quand le modèle prédit des mots statistiquement cohérents sans ancrage dans la réalité factuelle."
  },
  {
    id: "rap_7",
    theme: "INTELLIGENCE ARTIFICIELLE",
    question: "Quel acronyme anglophone désigne les grands modèles de langage basés sur l'architecture Transformer (ex: GPT, Claude, Gemma) ?",
    displayAnswer: "LLM (Large Language Model)",
    acceptedAnswers: ["llm", "large language model", "large language models", "modele de langage"],
    explanation: "LLM signifie Large Language Model, désignant les modèles massifs entraînés sur des centaines de milliards de tokens textuels."
  },
  {
    id: "rap_8",
    theme: "CAMPUS DE LA HECH",
    question: "Dans quelle ville francophone se situe le campus historique des Rivageois de la Haute École Charlemagne ?",
    displayAnswer: "Liège",
    acceptedAnswers: ["liege", "liége"],
    explanation: "Le campus des Rivageois est implanté au bord de la Meuse à Liège, à proximité de la gare des Guillemins."
  },
  {
    id: "rap_9",
    theme: "PROTECTION DES DONNÉES",
    question: "Quel règlement général européen, abrégé en 4 lettres, protège la vie privée et les données personnelles des étudiants face aux IA ?",
    displayAnswer: "Le RGPD (ou GDPR en anglais)",
    acceptedAnswers: ["rgpd", "gdpr", "reglement general sur la protection des donnees"],
    explanation: "Le RGPD encadre strictement la collecte, l'hébergement et le traitement des données nominatives au sein de l'UE."
  },
  {
    id: "rap_10",
    theme: "VERBES DE CONSIGNE",
    question: "Quel verbe de consigne d'examen exige de dégager simultanément les points communs ET les divergences entre deux concepts ?",
    displayAnswer: "Comparer (la comparaison)",
    acceptedAnswers: ["comparer", "comparaison", "mettre en regard"],
    explanation: "Comparer impose un examen bilatéral : isoler ce qui rapproche deux notions tout en mettant en lumière ce qui les distingue."
  },
  {
    id: "rap_11",
    theme: "CHARGE DE TRAVAIL",
    question: "Combien d'heures d'activités d'apprentissage (cours + travail personnel) représente forfaitairement 1 crédit ECTS ?",
    displayAnswer: "30 heures",
    acceptedAnswers: ["30", "30 heures", "30h", "trente", "trente heures"],
    explanation: "Le Décret Paysage fixe à 30 heures de charge globale pour l'étudiant l'équivalent d'un crédit ECTS."
  },
  {
    id: "rap_12",
    theme: "MÉTHODOLOGIE DE TRAVAIL",
    question: "Quel président et général américain a donné son nom à la célèbre matrice classant les tâches selon l'urgence et l'importance ?",
    displayAnswer: "Dwight D. Eisenhower",
    acceptedAnswers: ["eisenhower", "dwight eisenhower", "matrice d'eisenhower", "matrice eisenhower"],
    explanation: "La matrice d'Eisenhower aide les étudiants à privilégier le Cadran 2 (Important mais Non Urgent : révisions anticipées)."
  },
  {
    id: "rap_13",
    theme: "CYBERSÉCURITÉ & MÉDIAS",
    question: "Quel terme anglophone désigne une vidéo ou un enregistrement audio hyperréaliste falsifié par intelligence artificielle ?",
    displayAnswer: "Un deepfake (hypertrucage)",
    acceptedAnswers: ["deepfake", "deep fake", "deepfakes", "hypertrucage", "hyper-trucage"],
    explanation: "Les deepfakes utilisent des réseaux de neurones génératifs pour substituer des visages ou cloner des timbres vocaux."
  },
  {
    id: "rap_14",
    theme: "VERBES DE CONSIGNE",
    question: "Quel verbe de consigne ordonne à l'étudiant d'étayer son affirmation par des arguments rationnels, des preuves ou des calculs ?",
    displayAnswer: "Justifier (la justification)",
    acceptedAnswers: ["justifier", "justification", "argumenter", "prouver"],
    explanation: "Justifier interdit l'affirmation gratuite : l'étudiant doit impérativement fournir la chaîne logique et factuelle de la preuve."
  },
  {
    id: "rap_15",
    theme: "PARCOURS DE L'ÉTUDIANT",
    question: "Quel sigle officiel en 3 lettres désigne le Programme Annuel de l'Étudiant, validé par le jury en début d'année académique ?",
    displayAnswer: "Le PAE (Programme Annuel de l'Étudiant)",
    acceptedAnswers: ["pae", "programme annuel de l'etudiant", "programme annuel d'etudes", "programme annuel d'etude"],
    explanation: "Le PAE est le contrat académique annuel qui regroupe la liste des Unités d'Enseignement suivies par l'étudiant."
  },
  {
    id: "rap_16",
    theme: "CAMPUS DE LA HECH",
    question: "Combien d'implantations géographiques majeures composent la Haute École Charlemagne (Rivageois, Outremeuse, Huy et Verviers) ?",
    displayAnswer: "4 campus",
    acceptedAnswers: ["4", "quatre", "4 campus", "quatre campus"],
    explanation: "La Haute École Charlemagne déploie ses formations sur 4 sites en province de Liège : Liège (2 sites), Huy et Verviers."
  },
  {
    id: "rap_17",
    theme: "RECHERCHE SCIENTIFIQUE",
    question: "Quel identifiant numérique persistant et universel, abrégé en 3 lettres (DOI), garantit l'accès officiel à un article scientifique ?",
    displayAnswer: "Le DOI (Digital Object Identifier)",
    acceptedAnswers: ["doi", "digital object identifier"],
    explanation: "Le DOI fournit un lien pérenne infalsifiable vers les publications scientifiques certifiées par les pairs."
  },
  {
    id: "rap_18",
    theme: "CAMPUS DE LA HECH",
    question: "Dans quelle ville située le long de la Meuse se trouve le campus de la HECh réputé pour ses formations en agronomie et gestion ?",
    displayAnswer: "Huy",
    acceptedAnswers: ["huy"],
    explanation: "Le campus de Huy de la HECh accueille notamment les bacheliers en agronomie et les filières de gestion."
  },
  {
    id: "rap_19",
    theme: "ARCHITECTURE MATÉRIELLE",
    question: "Quel type de processeur graphique haute performance (carte graphique), abrégé en 3 lettres, alimente les supercalculateurs d'IA ?",
    displayAnswer: "Le GPU (Graphics Processing Unit)",
    acceptedAnswers: ["gpu", "processeur graphique", "carte graphique", "cartes graphiques"],
    explanation: "Les GPU excellent dans le calcul matriciel parallèle massif, indispensable pour exécuter et entraîner les réseaux de neurones."
  },
  {
    id: "rap_20",
    theme: "DÉCISION ACADÉMIQUE",
    question: "Quel organe collégial d'enseignants se réunit en fin de session pour délibérer souverainement sur la réussite des étudiants ?",
    displayAnswer: "Le Jury (de délibération)",
    acceptedAnswers: ["jury", "le jury", "jury de deliberation", "deliberation", "conseil de classe"],
    explanation: "Le jury de délibération examine les dossiers académiques dans le respect strict du Règlement Général des Études (RGE)."
  },
  {
    id: "rap_21",
    theme: "PROMPT ENGINEERING",
    question: "Quel mot d'origine anglaise désigne l'instruction textuelle soumise à une intelligence artificielle pour obtenir une réponse précise ?",
    displayAnswer: "Un prompt",
    acceptedAnswers: ["prompt", "prompts", "prompting", "invite"],
    explanation: "Le prompt définit le rôle, le contexte, les contraintes et le format attendu pour orienter le modèle de langage."
  },
  {
    id: "rap_22",
    theme: "OUTILS DU CAMPUS",
    question: "Quel environnement numérique d'apprentissage en ligne open-source (LMS) est officiellement utilisé à la HECh pour les cours ?",
    displayAnswer: "Moodle",
    acceptedAnswers: ["moodle"],
    explanation: "Moodle centralise les syllabus, consignes d'examens, dépôts de travaux et exercices interactifs de la Haute École."
  },
  {
    id: "rap_23",
    theme: "PÉDAGOGIE INTERACTIVE",
    question: "Quel outil belge de participation interactive en auditoire permet aux professeurs de sonder les étudiants en direct sur smartphone ?",
    displayAnswer: "Wooclap",
    acceptedAnswers: ["wooclap"],
    explanation: "Créé en Belgique, Wooclap stimule l'attention et teste la compréhension en temps réel dans les auditoires universitaires."
  },
  {
    id: "rap_24",
    theme: "LÉGISLATION ENSEIGNEMENT",
    question: "Quel décret promulgué en 2013 par le ministre Marcourt a réformé l'organisation modulaire des études supérieures en FWB ?",
    displayAnswer: "Le Décret Paysage",
    acceptedAnswers: ["paysage", "decret paysage", "le decret paysage", "decret marcourt"],
    explanation: "Le Décret Paysage a introduit les crédits ECTS capitalisables, les blocs annuels et la fin du redoublement automatique intégral."
  },
  {
    id: "rap_25",
    theme: "SCIENCES COGNITIVES",
    question: "Quelle expression désigne le piège psychologique où un étudiant pense maîtriser son cours simplement en le survolant des yeux ?",
    displayAnswer: "L'illusion de compétence (ou illusion de savoir)",
    acceptedAnswers: ["illusion de competence", "illusion de savoir", "illusion cognitive", "effet dunning kruger", "dunning kruger"],
    explanation: "La lecture passive trompe le cerveau : seul le rappel actif (s'interroger soi-même sans notes) consolide les connaissances."
  }
];

export const JUSTE_PRIX_QUESTIONS = [
  {
    id: "jp_1",
    question: "Selon le décret Paysage en Fédération Wallonie-Bruxelles, combien d'heures d'activités d'apprentissage (cours + travail personnel) représente forfaitairement 1 crédit ECTS ?",
    targetValue: 30,
    unit: "heures",
    minRange: 10,
    maxRange: 60,
    explanation: "1 crédit ECTS équivaut forfaitairement à 30 heures de charge de travail globale pour l'étudiant (cours magistraux, TP, études et révisions)."
  },
  {
    id: "jp_2",
    question: "Combien de crédits ECTS au total composent le cursus complet d'un Bachelier de plein exercice en Haute École (hors passerelles) ?",
    targetValue: 180,
    unit: "crédits ECTS",
    minRange: 60,
    maxRange: 300,
    explanation: "Un Bachelier en Haute École compte 180 crédits ECTS répartis sur 3 blocs annuels de 60 crédits chacun."
  },
  {
    id: "jp_3",
    question: "D'après la courbe d'oubli d'Hermann Ebbinghaus, quel pourcentage d'informations nouvelles est oublié au bout de seulement 24 heures sans réactivation ?",
    targetValue: 67,
    unit: "%",
    minRange: 20,
    maxRange: 90,
    explanation: "Sans réactivation active dans les 24h, environ 67% des notions apprises s'évaporent de la mémoire de travail (il ne reste qu'environ un tiers des données)."
  },
  {
    id: "jp_4",
    question: "D'après les analyses d'impact écologique de l'IA (Shaolei Ren et al.), combien de millilitres d'eau potable sont évaporés par les centres de données pour refroidir les serveurs lors d'une session de 25 à 50 requêtes sur un grand modèle LLM ?",
    targetValue: 500,
    unit: "ml d'eau",
    minRange: 50,
    maxRange: 2000,
    explanation: "Une cinquantaine d'échanges avec un LLM consomme environ un demi-litre d'eau potable (500 ml) pour le refroidissement thermodynamique des clusters de calcul."
  },
  {
    id: "jp_5",
    question: "En quelle année le Décret définissant le paysage de l'enseignement supérieur et l'organisation académique des études (dit 'Décret Paysage') a-t-il été initialement promulgué en FWB ?",
    targetValue: 2013,
    unit: "année",
    minRange: 2000,
    maxRange: 2024,
    explanation: "Le Décret Paysage a été promulgué le 7 novembre 2013 sous la ministre Jean-Claude Marcourt, instaurant le système modulaire par Unités d'Enseignement (UE)."
  },
  {
    id: "jp_6",
    question: "Dans le cadre de la gestion du temps par la matrice d'Eisenhower, quel pourcentage idéal de son temps hebdomadaire un étudiant performant devrait-il consacrer au Cadran 2 (Important mais Non Urgent : révisions anticipées, hygiène de vie, fiches) ?",
    targetValue: 65,
    unit: "% du temps",
    minRange: 20,
    maxRange: 90,
    explanation: "Les spécialistes de neuro-ergonomie recommandent de passer au moins 60 à 70% de son énergie dans le Cadran 2 pour prévenir les urgences de dernière minute."
  },
  {
    id: "jp_7",
    question: "Dans le système de notation de l'enseignement supérieur en Belgique francophone, quelle est la note minimale sur 20 requise pour valider une Unité d'Enseignement sans compensation ?",
    targetValue: 10,
    unit: "/ 20",
    minRange: 8,
    maxRange: 16,
    explanation: "La note de 10/20 est le seuil légal de réussite pour acquérir définitivement les crédits ECTS d'une Unité d'Enseignement."
  },
  {
    id: "jp_8",
    question: "Combien de campus et implantations géographiques composent la Haute École Charlemagne en région liégeoise et wallonne ?",
    targetValue: 4,
    unit: "campus principaux",
    minRange: 1,
    maxRange: 10,
    explanation: "La HECh regroupe les campus des Rivageois (Liège), Outremeuse (Liège), Huy et Verviers."
  }
];

export const QUATRE_A_LA_SUITE_THEMES = [
  {
    id: "theme_paysage",
    title: "1. Le Décret Paysage & Crédits ECTS",
    badge: "Cadre Légal & Cursus",
    description: "Règles d'accumulation, prérequis, Unités d'Enseignement et jury académique.",
    color: "from-blue-600 to-indigo-700",
    questions: [
      {
        q: "Que signifie le sigle officiel ECTS ?",
        options: ["European Credit Transfer and Accumulation System", "Enseignement Certifié Technique Supérieur", "Évaluation Commune des Travaux Scientifiques", "Espace Commun des Titres Scolaires"],
        correct: 0
      },
      {
        q: "Comment appelle-t-on le sous-ensemble pédagogique autonome qui compose une Unité d'Enseignement (UE) ?",
        options: ["Une Activité d'Apprentissage (AA)", "Un Module Électif (ME)", "Un Travail Pratique (TP)", "Un Crédit Partiel (CP)"],
        correct: 0
      },
      {
        q: "Combien de crédits ECTS un étudiant doit-il inscrire au minimum à son Programme Annuel d'Études (PAE) standard de Bloc 1 ?",
        options: ["60 crédits", "45 crédits", "30 crédits", "75 crédits"],
        correct: 0
      },
      {
        q: "Que se passe-t-il si un étudiant obtient 8/20 à une Activité d'Apprentissage mais que la moyenne pondérée de l'UE est de 11/20 ?",
        options: ["L'UE peut être délibérée et validée selon le Règlement des Études (RGE)", "L'étudiant est immédiatement exclu", "La note est arrondie à 0/20", "L'étudiant doit recommencer tout son bloc"],
        correct: 0
      },
      {
        q: "Quelle est l'instance souveraine qui proclame la réussite et octroie les crédits en fin d'année académique ?",
        options: ["Le Jury de délibération", "Le délégué de classe", "Le ministère de l'Éducation", "Le recteur de l'Université"],
        correct: 0
      },
      {
        q: "Combien de sessions d'examens officielles existent obligatoirement par année académique en Haute École ?",
        options: ["Deux sessions (janvier/juin et août/septembre)", "Une seule session en juin", "Trois sessions trimestrielles", "Quatre sessions sans rattrapage"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_verbes",
    title: "2. Verbes d'Action & Consignes",
    badge: "Exigences d'Évaluation",
    description: "Distinguer les tâches cognitives : comparer, justifier, analyser, illustrer.",
    color: "from-sky-600 to-cyan-700",
    questions: [
      {
        q: "Face à la consigne « Justifier votre réponse », que doit impérativement fournir l'étudiant ?",
        options: ["Des arguments logiques, preuves ou citations démontrant le bien-fondé", "La reformulation de la question en 10 lignes", "Un avis personnel basé sur son ressenti", "Le recopiage de la consigne"],
        correct: 0
      },
      {
        q: "Que commande le verbe « Comparer deux théories » ?",
        options: ["Dégager à la fois leurs ressemblances ET leurs divergences fondamentales", "Choisir la théorie préférée sans parler de l'autre", "Résumer uniquement la première théorie", "Traduire les termes en latin"],
        correct: 0
      },
      {
        q: "Que signifie le verbe « Synthétiser un texte de 5 pages » ?",
        options: ["Restituer les idées essentielles de façon concise et structurée", "Recopier le texte en supprimant un mot sur deux", "Écrire un texte deux fois plus long", "Critiquer négativement l'auteur"],
        correct: 0
      },
      {
        q: "Quelle est la différence fondamentale entre « Expliquer » et « Décrire » ?",
        options: ["Décrire montre comment c'est fait, expliquer démontre POURQUOI et COMMENT cela fonctionne", "Il n'y a aucune différence, ce sont des synonymes parfaits", "Expliquer se fait toujours par un dessin", "Décrire impose un calcul mathématique"],
        correct: 0
      },
      {
        q: "Si la consigne dit « Relever les trois arguments du texte », que devez-vous faire ?",
        options: ["Extraire précisément 3 arguments présents dans le texte sans en inventer", "Donner son propre avis en 3 points", "Corriger les fautes d'orthographe de l'auteur", "Traduire en anglais"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_neuro",
    title: "3. Neuro-Éducation & Mémoire",
    badge: "Sciences Cognitives",
    description: "Courbe d'Ebbinghaus, répétition espacée, sommeil et consolidation synaptique.",
    color: "from-emerald-600 to-teal-700",
    questions: [
      {
        q: "Quel chercheur a modélisé pour la première fois la « courbe de l'oubli » en psychologie cognitive ?",
        options: ["Hermann Ebbinghaus", "Jean Piaget", "Sigmund Freud", "Ivan Pavlov"],
        correct: 0
      },
      {
        q: "Quelle stratégie de révision combat le plus efficacement la dégradation naturelle des souvenirs ?",
        options: ["La réactivation active espacée dans le temps (spaced retrieval)", "Le relire passif en surlignant tout en fluo", "Le bachotage intensif la veille au soir", "Écouter le cours en dormant"],
        correct: 0
      },
      {
        q: "Quel rôle physiologique capital joue le sommeil profond dans l'apprentissage académique ?",
        options: ["La consolidation synaptique et le transfert de la mémoire temporaire vers le cortex à long terme", "La suppression totale des souvenirs récents", "Le repos exclusif des muscles sans impact cérébral", "L'arrêt de l'activité neuronale"],
        correct: 0
      },
      {
        q: "Pourquoi l'illusion de compétence survient-elle souvent lors de la simple relecture d'un syllabus ?",
        options: ["Reconnaître une notion familière n'est pas synonyme de savoir la restituer spontanément de mémoire", "Parce que le cerveau stocke les mots dans la rétine", "Parce que les syllabi contiennent toujours trop d'images", "Parce que lire fatigue les yeux"],
        correct: 0
      },
      {
        q: "Qu'appelle-t-on l'effet de test (testing effect) en sciences de l'éducation ?",
        options: ["Se tester activement renforce plus durablement la mémoire que réviser passivement", "Avoir peur des examens améliore les réflexes", "Ne jamais faire d'exercices évite de se tromper", "Les examens écrits sont supérieurs aux oraux"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_gestion",
    title: "4. Gestion du Temps & Efficacité",
    badge: "Matrice & Planification",
    description: "Matrice d'Eisenhower, loi de Parkinson, méthode Pomodoro et charge cognitive.",
    color: "from-amber-600 to-orange-700",
    questions: [
      {
        q: "Dans la matrice d'Eisenhower, que doit-on faire des tâches situées dans le cadran 'Non Important et Urgent' ?",
        options: ["Les déléguer, les regrouper ou les automatiser au maximum", "Y consacrer 80% de ses journées", "Les reporter indéfiniment sans prévenir", "Les traiter en priorité absolue avant tout"],
        correct: 0
      },
      {
        q: "Que stipule la célèbre 'Loi de Parkinson' en organisation du travail ?",
        options: ["Le travail s'étale de façon à occuper tout le temps disponible pour son achèvement", "Plus on étudie la nuit, plus on réussit", "La fatigue diminue avec la charge de travail", "Un travail n'est jamais terminé"],
        correct: 0
      },
      {
        q: "Quelle est la durée de concentration standard d'un cycle de la méthode Pomodoro ?",
        options: ["25 minutes d'effort focalisé suivies de 5 minutes de pause", "60 minutes sans pause", "10 minutes d'effort et 20 minutes de pause", "4 heures d'affilée"],
        correct: 0
      },
      {
        q: "Pourquoi le multitâche (multitasking) est-il un mythe contre-productif selon les neurosciences ?",
        options: ["Le cerveau alterne rapidement entre les tâches, ce qui entraîne un coût attentionnel de réengagement élevé", "Le cerveau humain peut traiter 5 pensées complexes en même temps", "Le multitâche améliore le QI de 10 points", "Seuls les ordinateurs peuvent être distraits"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_ecologie_ia",
    title: "5. Sobriété Numérique & Écologie IA",
    badge: "RSE & Climat",
    description: "Consommation d'eau, serveurs GPU, kWh, impact carbone des modèles de langage.",
    color: "from-green-600 to-emerald-800",
    questions: [
      {
        q: "Pourquoi les centres de données hébergeant des clusters de GPU consomment-ils d'immenses volumes d'eau potable ?",
        options: ["Pour le refroidissement évaporatif des racks serveurs afin d'éviter la surchauffe thermique", "Pour nettoyer les écrans des serveurs", "Pour générer de l'électricité hydraulique sur place", "Pour fabriquer le silicium des puces"],
        correct: 0
      },
      {
        q: "Quelle attitude relève de la sobriété numérique dans l'utilisation de l'intelligence artificielle ?",
        options: ["Utiliser des modèles adaptés et locaux plutôt que de solliciter des méga-LLM pour des tâches triviales", "Laisser des bots poser 10 000 requêtes en boucle", "Générer 50 images en 4K juste pour choisir une couleur", "Toujours utiliser le modèle le plus lourd du marché"],
        correct: 0
      },
      {
        q: "Qu'est-ce que l'effet rebond (paradoxe de Jevons) appliqué au numérique ?",
        options: ["Les gains d'efficacité d'un outil entraînent une hausse disproportionnée de son usage global", "Les ordinateurs rebondissent s'ils tombent au sol", "Plus un modèle est rapide, moins on l'utilise", "La baisse des coûts réduit la consommation"],
        correct: 0
      },
      {
        q: "Quelle est la source principale d'empreinte carbone liée à un cycle de vie d'ordinateur portable étudiant ?",
        options: ["Sa phase de fabrication et d'extraction des terres rares (jusqu'à 75-80% de l'impact total)", "Son emballage en carton", "La recharge de sa batterie sur le réseau électrique", "La souris sans fil"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_ortho",
    title: "6. Orthographe & Rigueur de la Langue",
    badge: "Grammaire & Rédaction",
    description: "Accords du participe passé, homophones grammaticaux et syntaxe académique.",
    color: "from-rose-600 to-pink-700",
    questions: [
      {
        q: "Dans la phrase : « Les compétences que cette formation m'a... », quelle est la bonne graphie ?",
        options: ["apportées (accord avec le COD 'que' placé avant l'auxiliaire avoir)", "apporté (invariable car verbe au passé)", "apporter (infinitif)", "apportez (deuxième personne)"],
        correct: 0
      },
      {
        q: "Quelle phrase est correctement orthographiée selon les normes académiques ?",
        options: ["Quels que soient les obstacles, les étudiants persévèrent.", "Quelque soient les obstacles, les étudiants persévèrent.", "Quelques soient les obstacles, les étudiants persévèrent.", "Quel que soit les obstacles, les étudiants persévèrent."],
        correct: 0
      },
      {
        q: "Quelle est la bonne orthographe : « Il faut que nous... » ?",
        options: ["comprenions (subjonctif présent)", "comprenons (indicatif)", "comprenionss", "compreniez"],
        correct: 0
      },
      {
        q: "Dans la phrase : « Elle s'est... compte de son erreur », quel est le bon accord ?",
        options: ["rendu (le COD 'compte' est placé après le verbe pronominal)", "rendue (accord avec le sujet)", "rendus (pluriel)", "rendre (infinitif)"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_esprit_critique",
    title: "7. Esprit Critique & Biais Cognitifs",
    badge: "Fact-Checking & Épistémique",
    description: "Biais de confirmation, hallucinations des IA, triangulation et sources fiables.",
    color: "from-purple-600 to-violet-800",
    questions: [
      {
        q: "Qu'est-ce que le 'biais de confirmation' lors d'une recherche documentaire sur le web ?",
        options: ["La tendance naturelle à ne retenir que les informations qui confortent nos croyances préexistantes", "Vérifier 3 fois la confirmation d'un mot de passe", "Confirmer une source par un article scientifique", "Ne faire confiance à aucun moteur de recherche"],
        correct: 0
      },
      {
        q: "Pourquoi les grands modèles de langage (LLM) sont-ils sujets aux 'hallucinations' factuelles ?",
        options: ["Ils prédisent statistiquement le mot le plus probable sans comprendre la vérité factuelle du monde", "Ils ont contracté un virus informatique", "Leurs créateurs introduisent volontairement des mensonges", "Ils ont besoin de lunettes"],
        correct: 0
      },
      {
        q: "Quelle est la règle d'or pour valider une affirmation scientifique trouvée sur les réseaux sociaux ?",
        options: ["Trianguler en remontant à la source primaire originelle et croiser avec des revues à comité de lecture", "Vérifier si le post a plus de 10 000 likes", "Se fier au badge bleu du compte", "Croire le premier commentaire sous la vidéo"],
        correct: 0
      },
      {
        q: "Que désigne l'effet Dunning-Kruger dans le monde académique ?",
        options: ["Le biais cognitif où les personnes les moins qualifiées surestiment démesurément leurs compétences", "La peur panique de parler en public", "La capacité à tout mémoriser en 5 minutes", "L'angoisse de la page blanche"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_campus_hech",
    title: "8. Vie Étudiante & Services HECh",
    badge: "Campus & Accompagnement",
    description: "Service d'Aide à la Réussite (SAR), secrétariats, bibliothèques et statut étudiant.",
    color: "from-indigo-600 to-blue-800",
    questions: [
      {
        q: "Que propose prioritairement le Service d'Aide à la Réussite (SAR) de la Haute École Charlemagne ?",
        options: ["Des ateliers de méthodologie, du tutorat entre pairs et un soutien psycho-pédagogique individualisé", "Le prêt de voitures de fonction", "La vente de repas gastronomiques", "La gestion des parkings de la ville"],
        correct: 0
      },
      {
        q: "À quoi donne accès la suite Microsoft 365 offerte gratuitement à chaque étudiant inscrit à la HECh ?",
        options: ["À l'adresse mail institutionnelle @student.hech.be, OneDrive et toute la suite Office", "À un abonnement Netflix Premium", "À des jeux vidéo gratuits sur Steam", "À un compte bancaire étudiant"],
        correct: 0
      },
      {
        q: "Quel document officiel fixe les droits, devoirs et modalités d'évaluation de tous les étudiants de la HECh ?",
        options: ["Le Règlement Général des Études (RGE)", "La convention de Genève", "Le code de la route belge", "La charte du voyageur SNCB"],
        correct: 0
      },
      {
        q: "Sur quel campus de la HECh se situe la direction générale et la section pédagogique historique ?",
        options: ["Le Campus des Rivageois à Liège", "Le Campus de Verviers", "Le Campus de Huy", "Le Campus d'Outremeuse"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_methodes_revision",
    title: "9. Prise de Notes & Fiches Efficaces",
    badge: "Outils de Réussite",
    description: "Méthode Cornell, Mind Mapping, flashcards et auto-évaluation.",
    color: "from-teal-600 to-emerald-700",
    questions: [
      {
        q: "Dans la prise de notes selon la méthode de Cornell, que place-t-on dans la colonne de gauche (marge) ?",
        options: ["Les mots-clés, indices de rappel et questions de révision", "Les calculs financiers détaillés", "Les dessins et gribouillages", "La date de naissance du professeur"],
        correct: 0
      },
      {
        q: "Quel est l'avantage cognitif majeur des 'flashcards' (cartes mémoire recto-verso) ?",
        options: ["Elles forcent la mémoire à faire un effort de récupération active (Active Recall)", "Elles sont plus légères qu'un cahier", "Elles permettent d'écrire en couleur", "Elles remplacent la présence aux cours"],
        correct: 0
      },
      {
        q: "Pourquoi transformer un cours textuel en carte mentale (Mind Map) stimule-t-il la mémorisation ?",
        options: ["La visualisation spatiale et les connexions arborescentes exploitent la mémoire visuelle et associative", "Parce que le cerveau ne lit que les cercles", "Parce que cela évite d'apprendre les définitions", "Parce que les lignes droites fatiguent le cerveau"],
        correct: 0
      },
      {
        q: "Quel est le pire moment pour relire ses fiches de révision la veille d'un examen ?",
        options: ["Tard dans la nuit en sacrifiant son temps de sommeil réparateur", "En fin d'après-midi au calme", "Au réveil après un bon petit-déjeuner", "Deux jours avant l'épreuve"],
        correct: 0
      }
    ]
  },
  {
    id: "theme_droit_auteur",
    title: "10. Droit d'Auteur & Intégrité Académique",
    badge: "Éthique Universitaire",
    description: "Plagiat, citations aux normes APA, paraphrase et utilisation responsable des IA.",
    color: "from-red-600 to-rose-800",
    questions: [
      {
        q: "Qu'est-ce qui caractérise formellement le plagiat dans un travail académique ?",
        options: ["S'attribuer des idées, textes ou données d'un tiers sans en citer explicitement la source et les auteurs", "Écrire une bibliographie de 20 pages", "Partager son syllabus avec un camarade", "Acheter un livre à la bibliothèque"],
        correct: 0
      },
      {
        q: "Si vous reformulez avec vos propres mots l'idée d'un auteur dans votre mémoire, devez-vous citer la source ?",
        options: ["OUI obligatoirement, car l'idée originale appartient à l'auteur (paraphrase sourcée)", "NON, car une fois réécrite avec ses mots, l'idée devient la nôtre", "Uniquement si l'auteur est encore vivant", "Seulement si l'auteur est belge"],
        correct: 0
      },
      {
        q: "Quelle est la règle déontologique concernant le contenu brut généré par ChatGPT dans un travail noté ?",
        options: ["Le copier-coller sans mention constitue une fraude académique ; l'usage d'outils d'IA doit être transparent et documenté", "C'est totalement interdit d'ouvrir un ordinateur", "C'est autorisé et conseillé pour remplacer les examens", "L'IA a tous les droits d'auteur légaux"],
        correct: 0
      },
      {
        q: "Selon les normes bibliographiques APA 7, quel élément suit immédiatement le nom de l'auteur dans une référence ?",
        options: ["L'année de publication entre parenthèses : (2024)", "Le numéro de téléphone de l'éditeur", "Le prix du livre en euros", "La photo de l'auteur"],
        correct: 0
      }
    ]
  }
];

export const FACE_A_FACE_QUESTIONS = [
  {
    id: "faf_1",
    targetTerm: "LA MATRICE D'EISENHOWER",
    category: "Méthodologie & Priorisation",
    clues: [
      { points: 4, text: "Théorisée par un président américain, elle permet de classer toutes les activités humaines sur un repère orthogonal." },
      { points: 3, text: "Elle sépare de manière méthodique deux critères souvent confondus : l'importance et l'urgence." },
      { points: 2, text: "Composée de 4 quadrants, elle conseille d'automatiser le cadran 3 et d'éliminer impérativement le cadran 4." },
      { points: 1, text: "Outil incontournable de la gestion du temps étudiante pour dompter la procrastination..." }
    ],
    options: ["La Matrice d'Eisenhower", "Le Diagramme de Gantt", "La Courbe d'Ebbinghaus", "La Roue de Deming"],
    correctIndex: 0
  },
  {
    id: "faf_2",
    targetTerm: "LE DÉCRET PAYSAGE",
    category: "Cadre Académique FWB",
    clues: [
      { points: 4, text: "Promulgué en novembre 2013 en Fédération Wallonie-Bruxelles, il a restructuré tout le supérieur." },
      { points: 3, text: "Il a aboli le concept d'année fermée au profit d'un système modulaire par accumulation de crédits ECTS." },
      { points: 2, text: "Il régit les jurys, le Programme Annuel d'Études (PAE) et les conditions de réussite à 10/20." },
      { points: 1, text: "Texte de loi fondamental qui organise votre parcours en Haute École..." }
    ],
    options: ["Le Décret Paysage", "Le Traité de Bologne", "Le Décret Missions", "Le Pacte d'Excellence"],
    correctIndex: 0
  },
  {
    id: "faf_3",
    targetTerm: "LA COURBE D'EBBINGHAUS",
    category: "Neurosciences & Mémoire",
    clues: [
      { points: 4, text: "Expérimentée à la fin du XIXe siècle à l'aide de syllabes sans signification (ZIK, ROL)." },
      { points: 3, text: "Elle démontre une perte exponentielle de données dès les 20 premières minutes suivant l'apprentissage." },
      { points: 2, text: "Seule la réactivation active à intervalles réguliers permet d'en aplatir la trajectoire descendante." },
      { points: 1, text: "Courbe mathématique célèbre modélisant la vitesse de l'oubli humain..." }
    ],
    options: ["La Courbe d'Ebbinghaus", "La Courbe de Gauss", "La Spirale de Skinner", "La Pyramide de Maslow"],
    correctIndex: 0
  },
  {
    id: "faf_4",
    targetTerm: "LE BIAIS DE CONFIRMATION",
    category: "Esprit Critique & Épistémique",
    clues: [
      { points: 4, text: "Biais cognitif identifié par Peter Wason en 1960 lors de ses expériences de test d'hypothèses." },
      { points: 3, text: "Il pousse l'individu à privilégier aveuglément les indices qui valident ses préjugés initiaux." },
      { points: 2, text: "Particulièrement amplifié par les bulles de filtres des algorithmes et les prompts d'IA orientés." },
      { points: 1, text: "Tendance humaine à ne chercher que les preuves qui nous donnent raison..." }
    ],
    options: ["Le Biais de Confirmation", "L'Effet Dunning-Kruger", "L'Ancrage Mental", "Le Biais d'Attribution"],
    correctIndex: 0
  },
  {
    id: "faf_5",
    targetTerm: "LE SERVICE D'AIDE À LA RÉUSSITE (SAR)",
    category: "Accompagnement HECh",
    clues: [
      { points: 4, text: "Dispositif légal financé par la FWB pour démocratiser la réussite dans l'enseignement supérieur." },
      { points: 3, text: "Présent sur tous les campus de la HECh, il propose du tutorat par les pairs et des ateliers méthodologiques." },
      { points: 2, text: "Il accompagne les étudiants en difficulté face aux examens et aux consignes complexes." },
      { points: 1, text: "Service universitaire clé dont l'acronyme en 3 lettres commence par S..." }
    ],
    options: ["Le Service d'Aide à la Réussite (SAR)", "Le Service des Relations Internationales", "Le Conseil des Étudiants", "L'Office Régional de l'Emploi"],
    correctIndex: 0
  },
  {
    id: "faf_6",
    targetTerm: "L'EFFET DE TEST (TESTING EFFECT)",
    category: "Psychologie des Apprentissages",
    clues: [
      { points: 4, text: "Phénomène cognitif robuste validé par les travaux de Roediger et Karpicke en 2006." },
      { points: 3, text: "Il démontre qu'interroger activement sa mémoire crée des chemins synaptiques plus solides qu'une relecture passive." },
      { points: 2, text: "Base fondamentale de l'usage des flashcards, des quiz auto-générés et des examens blancs." },
      { points: 1, text: "Principe selon lequel 's'auto-évaluer' est la méthode de révision suprême..." }
    ],
    options: ["L'Effet de Test (Testing Effect)", "L'Effet Halo", "L'Effet Placebo", "L'Effet Pygmalion"],
    correctIndex: 0
  }
];
