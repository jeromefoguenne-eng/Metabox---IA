/**
 * auroreBriefingsData.js
 * Banque officielle des briefings d'A.U.R.O.R.E. pour l'ensemble des jeux et épreuves :
 * 1. Lien direct avec le scénario de l'Escape Game (« Panique au Jury : L'Algorithme Fantôme »)
 * 2. Explication de l'enjeu académique et pourquoi cette partie doit être réalisée
 * 3. Règles détaillées, mécaniques de jeu et conditions de victoire
 */

export const AURORE_GAME_BRIEFINGS = {
  // 1. FACT-CHECKING 3D (AILE NORD)
  factcheck: {
    gameId: 'factcheck',
    title: "Laboratoire Forensique de Fact-Checking 3D",
    subtitle: "Démystification de Deepfakes & Hallucinations d'IA",
    wing: "AILE NORD · QUAI DE ROME",
    keyReward: "Clé Alpha (Esprit Critique & Vérité)",
    badgeColor: "from-cyan-500 to-blue-600",
    scenarioLink: "Les serveurs du jury de délibération de la HECh ont été verrouillés en urgence suite à l'injection massive de faux documents académiques générés par IA. L'algorithme central A.U.R.O.R.E. refuse de valider les délibérations de fin d'année tant que le registre mondial des sources de l'école n'aura pas été nettoyé de toutes ses hallucinations.",
    whyPlay: "Pour déverrouiller la Clé Alpha indispensable à l'ouverture du jury, vous devez prouver que votre discernement humain surpasse les illusions algorithmiques. Vous devez inspecter 10 dossiers forensiques suspects (faux articles scientifiques, fausses déclarations orales synthétisées, prompts d'examen piégés et photos retouchées) et isoler scientifiquement chaque tromperie.",
    rules: [
      "Explorez les 10 stations d'investigation dans le laboratoire 3D interactif.",
      "Ouvrez le terminal Cyberscope OS pour consulter les documents, vérifier les faux DOI CrossRef et analyser les spectres audio.",
      "Consultez les indices gradués (1 à 3) si vous avez un doute méthodologique sans aucune pénalité.",
      "Sélectionnez le verdict technique exact qui démontre la manipulation d'IA ou la falsification de la source.",
      "Résolvez l'ensemble des 10 énigmes pour purifier le réseau de la HECh et obtenir la Clé Alpha."
    ],
    auroreSpokenText: "Alerte délibération au Quai de Rome. L'Aile Nord est saturée d'hallucinations d'IA et de faux documents. Examinez les dix stations forensiques, débusquez chaque falsification et restaurez la vérité pour débloquer la Clé Alpha."
  },

  // 2. GRAND PROCÈS DU BLACKOUT 24H (AILE OUEST)
  tribunal: {
    gameId: 'tribunal',
    title: "Le Grand Procès : L'Affaire du Blackout 24h",
    subtitle: "Plaidoirie Éthique & Tribunal d'Honneur",
    wing: "AILE OUEST · RUE DES RIVAGEOIS",
    keyReward: "Clé Beta (Intégrité & Éthique Académique)",
    badgeColor: "from-purple-500 to-indigo-600",
    scenarioLink: "À la veille des examens, Maxime, étudiant délégué de Bloc 1, a coupé l'alimentation principale du cluster d'IA du campus. Le Procureur du Roi l'accuse de cyber-sabotage et de fraude pour paralyser le jury. En vérité, Maxime a disjoncté les serveurs pour dénoncer un plagiat automatisé à grande échelle et stopper le gaspillage écologique intolérable d'eau potable et d'électricité.",
    whyPlay: "A.U.R.O.R.E. refuse toute validation de diplôme tant que la Cour d'honneur n'aura pas établi la justice éthique. Vous incarnez Maître Alex, l'avocat de Maxime. Vous devez affronter le Procureur du Roi, convaincre le Juge de la légitimité de l'état de nécessité environnementale et méthodologique, et faire acquitter Maxime pour restaurer la Clé Beta.",
    rules: [
      "Écoutez attentivement le réquisitoire passionné et sévère du Procureur du Roi.",
      "Analysez les 4 arguments juridiques et techniques à votre disposition sur votre pupitre d'avocat.",
      "Sélectionnez l'argument le plus percutant (état de nécessité, absence de bris de clôture, proportionnalité écologique).",
      "Surveillez la jauge de Conviction du Juge : faites-la grimper jusqu'au verdict d'acquittement tout en maîtrisant les réactions de la salle.",
      "Obtenez l'acquittement plein et entier de Maxime pour libérer la Clé Beta."
    ],
    auroreSpokenText: "Silence dans la salle. Maxime comparaît à la barre du tribunal d'honneur. Le Procureur réclame son exclusion pour le blackout du campus. Prenez sa défense, invoquez l'état de nécessité environnementale et convainquez le Juge pour décrocher la Clé Beta."
  },

  // 3. GUIDE DU SURVIVANT CONNECTÉ (AILE SUD)
  survivant: {
    gameId: 'survivant',
    title: "Le Guide du Survivant Connecté",
    wing: "AILE SUD · SOUS-SOLS & FAILLE VITRÉE",
    keyReward: "Clé Gamma (Sobriété Numérique & Méthodologie)",
    badgeColor: "from-emerald-500 to-teal-600",
    scenarioLink: "Dans les sous-sols du campus, le datacenter surchauffe dangereusement à cause des requêtes massives d'étudiants paniqués qui délèguent l'intégralité de leurs révisions à des serveurs cloud énergivores. Les baies de serveurs menacent de s'effondrer sous la chaleur, menaçant d'effacer les sauvegardes des délibérations.",
    whyPlay: "A.U.R.O.R.E. exige que les étudiants démontrent leur capacité à adopter une hygiène numérique saine et des méthodes d'apprentissage durables (frugalité des SLM locaux, réactivation mémorielle espacée, conformité stricte au RGPD). Vous devez guider les étudiants à travers leurs dilemmes quotidiens pour refroidir le datacenter et obtenir la Clé Gamma.",
    rules: [
      "Progressez dans le visual novel interactif et découvrez les situations concrètes d'étudiants en détresse de révision.",
      "À chaque carrefour décisionnel, choisissez l'arbitrage méthodologique vertueux (travail actif plutôt que béquille passive d'IA).",
      "Gérez la consommation en watts et la protection des données personnelles étudiantes.",
      "Menez l'histoire à une conclusion équilibrée et durable pour déverrouiller la Clé Gamma."
    ],
    auroreSpokenText: "Alerte thermique dans les sous-sols. Le cluster de calcul surchauffe sous l'avalanche de requêtes redondantes. Guidez les étudiants vers la sobriété numérique et des méthodes de révision autonomes pour remporter la Clé Gamma."
  },

  // 4. PROMPT WARS : DUEL D'ESPRIT CRITIQUE (AILE EST)
  promptwars: {
    gameId: 'promptwars',
    title: "Prompt Wars : Duel d'Esprit Critique",
    wing: "AILE EST · COUR DU VIEUX HÊTRE",
    keyReward: "Clé Delta (Maîtrise Algorithmique & Anti-Biais)",
    badgeColor: "from-pink-500 to-rose-600",
    scenarioLink: "Le dernier sas d'accès au serveur du jury central est contrôlé par un agent autonome corrompu. Cet algorithme bombarde les étudiants de biais de genre, d'arguments d'autorité bidons et de sophismes pour tester leur résistance psychologique et leur esprit critique.",
    whyPlay: "Pour obtenir la quatrième et ultime clé (la Clé Delta), vous devez neutraliser ce bot retors dans un jeu de duel tactique de cartes. Seuls des prompts méthodologiquement irréprochables permettront de contrer ses fausses vérités et de forcer l'ouverture du sas.",
    rules: [
      "Le bot adverse formule des affirmations péremptoires truffées de biais algorithmiques et d'illusions.",
      "Analysez votre main de cartes de contre-prompt (Contrainte Socratique, Vérification DOI Primaire, Filtre Anti-Stéréotypes, Few-Shot Vérifié).",
      "Jouez la carte qui désamorce exactement le type de sophisme formulé par le bot.",
      "Réduisez la barre d'illusion du bot à zéro pour remporter le duel.",
      "Saisissez la Clé Delta pour déverrouiller l'accès au grand amphi final !"
    ],
    auroreSpokenText: "Dernier rempart dans la cour du Vieux Hêtre. Le bot conversationnel autonome tente d'imposer ses biais cognitifs. Utilisez vos cartes de prompt engineering pour déconstruire ses sophismes et vous emparer de la Clé Delta."
  },

  // 5. QUI VEUT GAGNER DES CRÉDITS ? (MILLIONNAIRE)
  millionnaire: {
    gameId: 'millionnaire',
    title: "Qui veut gagner des Crédits ? (Verbes de Consigne)",
    subtitle: "Le Grand Jeu TV du Palier Académique ECTS",
    wing: "MODULE LANGAGIER & MÉTHODOLOGIE · ÉMISSION TV 3D",
    keyReward: "Validation des 60 Crédits ECTS & Déverrouillage Académique",
    badgeColor: "from-sky-500 via-indigo-600 to-amber-500",
    scenarioLink: "Dans le cadre de l'escape game, A.U.R.O.R.E. a identifié que le premier facteur d'échec aux examens de la HECh est la mauvaise compréhension des verbes de consigne ('Expliquer' confondu avec 'Lister', 'Comparer' réduit à une simple description). Pour prouver que vous méritez vos crédits ECTS bloqués, elle vous met au défi sur ce plateau TV.",
    whyPlay: "Vous devez gravir l'échelle des questions pour prouver que vous comprenez exactement ce que les professeurs de la HECh attendent de vous lors de chaque énoncé d'examen. Atteindre le sommet prouve votre rigueur intellectuelle.",
    rules: [
      "Grimpez l'échelle des 10 paliers de crédits ECTS jusqu'aux 60 Crédits officiels.",
      "Chaque question propose 4 réponses rigoureuses (A, B, C, D).",
      "Vous disposez de 3 jokers précieux : le 50/50, l'Avis de l'Auditoire, et l'Appel à un Professeur.",
      "Attention impérative : toute mauvaise réponse est éliminatoire et provoque la perte de la partie !",
      "Restez concentré et atteignez le palier suprême pour convaincre A.U.R.O.R.E."
    ],
    auroreSpokenText: "Bienvenue sur le plateau de Qui veut gagner des crédits. Pour débloquer vos soixante crédits ECTS auprès du jury, vous devez dompter les verbes de consigne. Quatre propositions, un seul choix exact. Aucune erreur n'est permise."
  },

  // 6. QUESTIONS POUR UN MAJOR (CHAMPION)
  champion: {
    gameId: 'champion',
    title: "Questions pour un Major (Sciences Cognitives)",
    subtitle: "Chrono 12 Secondes · Neuro-Éducation & Mémoire",
    wing: "MODULE MÉTHODOLOGIE & NEURO-ÉDUCATION · ÉMISSION TV 3D",
    keyReward: "Validation des Processus Mémoriels & Neuro-Apprentissage",
    badgeColor: "from-amber-500 via-orange-600 to-cyan-500",
    scenarioLink: "A.U.R.O.R.E. refuse de débloquer le jury si les étudiants persistent dans le bachotage intensif la veille des examens, une illusion cognitive qui s'effondre face à l'IA. Cette épreuve teste vos connaissances scientifiques sur les rouages de la mémorisation humaine.",
    whyPlay: "Vous devez prouver que vous maîtrisez les sciences de l'apprentissage (courbe d'oubli d'Ebbinghaus, sommeil paradoxal, surcharge cognitive, effet de test) pour prouver au jury votre autonomie intellectuelle pérenne.",
    rules: [
      "Chaque question dispose d'un chrono ultra-rapide de 12 secondes.",
      "Buzzez et répondez sans hésitation aux questions de neuro-éducation.",
      "Cumulez un maximum de points d'excellence cognitive.",
      "Validez l'épreuve pour prouver que le cerveau humain apprend mieux et plus durablement que n'importe quelle machine."
    ],
    auroreSpokenText: "Le bachotage est une illusion cognitive sans lendemain. Dans Questions pour un Major, vous avez douze secondes par question pour démontrer votre maîtrise des neurosciences de l'apprentissage. Soyez vif et rigoureux."
  },

  // 7. LA ROUE DES ACCORDS (ROUE DE LA FORTUNE)
  roue: {
    gameId: 'roue',
    title: "La Roue des Accords (Ortho'Express)",
    subtitle: "Mur de Mots & 10 Manches pour 3 Vies",
    wing: "MODULE ORTHOGRAPHE & MAÎTRISE DU FRANÇAIS · ÉMISSION TV 3D",
    keyReward: "Immunité contre le Seuil Éliminatoire des Fautes",
    badgeColor: "from-fuchsia-500 via-purple-600 to-pink-500",
    scenarioLink: "Dans les critères officiels de la HECh, une orthographe défaillante et des fautes d'accord inacceptables entraînent une pénalité éliminatoire immédiate. Pour lever le verrouillage d'A.U.R.O.R.E., vous devez prouver votre maîtrise irréprochable de la langue française.",
    whyPlay: "Vous devez triompher des 10 manches de phrases conjuguées graduées (participes passés complexes, accords pronominaux, homophones) sans épuiser vos 3 vies pour certifier la qualité académique de vos futures copies.",
    rules: [
      "Faites tourner la Roue des Accords pour accumuler des ECTS (100 à 1000 ECTS, Hold-Up, ou évitez la redoutable Banqueroute !).",
      "Une phrase lacunaire progressive (du niveau 1 au niveau 5) vous est présentée.",
      "Sélectionnez l'orthographe grammaticalement exacte.",
      "Attention : vous disposez de seulement 3 vies pour l'ensemble des 10 manches. Chaque erreur coûte une vie.",
      "Terminez les 10 manches victorieusement pour effacer toute pénalité de langue."
    ],
    auroreSpokenText: "Bienvenue à la Roue des Accords. Une faute d'orthographe peut détruire la crédibilité d'un travail de fin d'études. Tournez la roue, évitez la banqueroute et résolvez les dix accords sans perdre vos trois vies."
  },

  // 8. LE GRAND CONCOURS DE LA HECH (3 MANCHES)
  concours: {
    gameId: 'concours',
    title: "Le Grand Concours de la HECh (Tournoi en 3 Manches)",
    subtitle: "Questions de Rapidité · Le Quatre à la Suite · Le Face à Face",
    wing: "TOURNOI INTER-CAMPUS HECH · ARÈNE 3D COMPLÈTE",
    keyReward: "Trophée Suprême des Délibérations & Coupe Inter-Campus",
    badgeColor: "from-cyan-400 via-blue-600 to-violet-600",
    scenarioLink: "L'épreuve reine de l'escape game ! Pour lever définitivement l'ensemble des restrictions d'A.U.R.O.R.E. et prouver l'excellence de votre campus (Rivageois, Huy, Verviers, Outremeuse), vous participez au grand tournoi télévisé académique en 3 manches inspiré des grands jeux de culture générale.",
    whyPlay: "Ce tournoi synthétise l'intégralité des compétences : esprit critique, culture de l'IA, méthodologie et réactivité. Arriver au bout de la troisième manche est indispensable pour empocher la coupe et déverrouiller la proclamation des résultats.",
    rules: [
      "MANCHE 1 - QUESTIONS DE RAPIDITÉ : Appuyez sur le buzzer dès que vous connaissez la réponse et inscrivez-la au clavier en moins de 10 secondes (pas de QCM). Le premier candidat à cumuler 3 bonnes réponses est directement qualifié !",
      "MANCHE 2 - LE QUATRE À LA SUITE : Choisissez une rubrique parmi 10 thèmes académiques renouvelés et réussissez 4 bonnes réponses consécutives avant l'expiration du chrono !",
      "MANCHE 3 - LE FACE À FACE : Affrontez le meilleur candidat virtuel dans un duel palpitant avec 4 indices descendants. Marquez 12 points pour remporter la victoire suprême !"
    ],
    auroreSpokenText: "Voici l'arène ultime : Le Grand Concours de la Haute École en trois manches. Les questions de rapidité au buzzer, le Quatre à la suite, puis le Face à Face final. Atteignez le bout du duel pour remporter le trophée du campus."
  }
};
