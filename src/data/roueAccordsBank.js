/**
 * BANQUE DE PHRASES CONJUGUÉES & ACCORDS - LA ROUE DES ACCORDS (HECh)
 * Vaste référentiel de phrases académiques graduées sur 5 niveaux d'exigence orthographique :
 * - Niveau 1 : Présent de l'indicatif & alternances régulières (-oyer, -eler, -eter, -cer, -ger)
 * - Niveau 2 : Futur simple & verbes du 3e groupe à radical transformé
 * - Niveau 3 : Imparfait piège (-ii-, -yi-) & Subjonctif présent des verbes du 3e groupe
 * - Niveau 4 : Conditionnel présent à double consonne & Subjonctifs irréguliers
 * - Niveau 5 : Accords experts du participe passé (COD antéposé, verbes pronominaux, impersonnels)
 */

export const ROUE_ACCORDS_BANK = [
  // =========================================================================
  // NIVEAU 1 : PRÉSENT DE L'INDICATIF & ALTERNANCES ORTHOGRAPHIQUES
  // =========================================================================
  {
    id: "roue-n1-01",
    level: 1,
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
    id: "roue-n1-02",
    level: 1,
    difficulty: "Niveau 1 : Alternance 'e' muet et accent grave",
    category: "INDICATIF PRÉSENT DU VERBE DÉCELER",
    prompt: "Conjuguez le verbe 'déceler' à l'indicatif présent, 3e personne du pluriel :",
    context: "Les auditeurs décèlent plusieurs failles dans le protocole de sécurité.",
    fullSentence: "LES AUDITEURS DÉCÈLENT PLUSIEURS FAILLES DANS LE PROTOCOLE DE SÉCURITÉ",
    verbForm: "DÉCÈLENT",
    initialRevealed: ["E", "L"],
    correctAnswers: ["décèlent", "decelent", "LES AUDITEURS DÉCÈLENT PLUSIEURS FAILLES DANS LE PROTOCOLE DE SÉCURITÉ"],
    explanation: "Devant une syllabe muette, le 'e' prend un accent grave : ils décèlent."
  },
  {
    id: "roue-n1-03",
    level: 1,
    difficulty: "Niveau 1 : Verbes en -cer (Cédille)",
    category: "INDICATIF PRÉSENT DU VERBE COMMENCER",
    prompt: "Conjuguez le verbe 'commencer' à l'indicatif présent, 1re personne du pluriel :",
    context: "Nous commençons le blocus de révision dès le début du mois de mai.",
    fullSentence: "NOUS COMMENÇONS LE BLOCUS DE RÉVISION DÈS LE DÉBUT DU MOIS DE MAI",
    verbForm: "COMMENÇONS",
    initialRevealed: ["O", "N"],
    correctAnswers: ["commençons", "commencons", "NOUS COMMENÇONS LE BLOCUS DE RÉVISION DÈS LE DÉBUT DU MOIS DE MAI"],
    explanation: "Devant les voyelles 'a' et 'o', le 'c' prend une cédille pour conserver le son [s] : nous commençons."
  },
  {
    id: "roue-n1-04",
    level: 1,
    difficulty: "Niveau 1 : Verbes en -ger (Maintien du 'e')",
    category: "INDICATIF PRÉSENT DU VERBE PARTAGER",
    prompt: "Conjuguez le verbe 'partager' à l'indicatif présent, 1re personne du pluriel :",
    context: "Nous partageons les synthèses de cours sur le groupe d'études du campus.",
    fullSentence: "NOUS PARTAGEONS LES SYNTHÈSES DE COURS SUR LE GROUPE D'ÉTUDES DU CAMPUS",
    verbForm: "PARTAGEONS",
    initialRevealed: ["A", "E"],
    correctAnswers: ["partageons", "NOUS PARTAGEONS LES SYNTHÈSES DE COURS SUR LE GROUPE D'ÉTUDES DU CAMPUS"],
    explanation: "Pour conserver le son [ʒ] devant 'a' ou 'o', on ajoute un 'e' muet après le 'g' : nous partageons."
  },
  {
    id: "roue-n1-05",
    level: 1,
    difficulty: "Niveau 1 : Verbes en -eler (Double consonne)",
    category: "INDICATIF PRÉSENT DU VERBE APPELER",
    prompt: "Conjuguez le verbe 'appeler' à l'indicatif présent, 3e personne du pluriel :",
    context: "Les professeurs appellent chaque étudiant pour la restitution orale.",
    fullSentence: "LES PROFESSEURS APPELLENT CHAQUE ÉTUDIANT POUR LA RESTITUTION ORALE",
    verbForm: "APPELLENT",
    initialRevealed: ["E", "P"],
    correctAnswers: ["appellent", "LES PROFESSEURS APPELLENT CHAQUE ÉTUDIANT POUR LA RESTITUTION ORALE"],
    explanation: "Le verbe appeler double son 'l' devant une syllabe muette : ils appellent."
  },
  {
    id: "roue-n1-06",
    level: 1,
    difficulty: "Niveau 1 : Verbes en -eter (Double consonne)",
    category: "INDICATIF PRÉSENT DU VERBE JETER",
    prompt: "Conjuguez le verbe 'jeter' à l'indicatif présent, 3e personne du singulier :",
    context: "L'assistant jette un regard attentif sur les brouillons de l'évaluation.",
    fullSentence: "L'ASSISTANT JETTE UN REGARD ATTENTIF SUR LES BROUILLONS DE L'ÉVALUATION",
    verbForm: "JETTE",
    initialRevealed: ["E", "T"],
    correctAnswers: ["jette", "L'ASSISTANT JETTE UN REGARD ATTENTIF SUR LES BROUILLONS DE L'ÉVALUATION"],
    explanation: "Le verbe jeter double son 't' devant un 'e' muet : il jette."
  },
  {
    id: "roue-n1-07",
    level: 1,
    difficulty: "Niveau 1 : Verbes en -ayer (Choix graphique)",
    category: "INDICATIF PRÉSENT DU VERBE PAYER",
    prompt: "Conjuguez le verbe 'payer' à l'indicatif présent, 3e personne du pluriel :",
    context: "Les candidats paient les droits d'inscription avant la date limite.",
    fullSentence: "LES CANDIDATS PAIENT LES DROITS D'INSCRIPTION AVANT LA DATE LIMITE",
    verbForm: "PAIENT",
    initialRevealed: ["A", "I"],
    correctAnswers: ["paient", "payent", "LES CANDIDATS PAIENT LES DROITS D'INSCRIPTION AVANT LA DATE LIMITE"],
    explanation: "Les verbes en -ayer peuvent s'écrire avec un 'i' ou un 'y' : ils paient (recommandé) ou ils payent."
  },
  {
    id: "roue-n1-08",
    level: 1,
    difficulty: "Niveau 1 : Alternance du 'y' et du 'i'",
    category: "INDICATIF PRÉSENT DU VERBE EMPLOYER",
    prompt: "Conjuguez le verbe 'employer' à l'indicatif présent, 3e personne du pluriel :",
    context: "Les chercheurs emploient des méthodes statistiques rigoureuses.",
    fullSentence: "LES CHERCHEURS EMPLOIENT DES MÉTHODES STATISTIQUES RIGOUREUSES",
    verbForm: "EMPLOIENT",
    initialRevealed: ["O", "E"],
    correctAnswers: ["emploient", "LES CHERCHEURS EMPLOIENT DES MÉTHODES STATISTIQUES RIGOUREUSES"],
    explanation: "Le 'y' devient 'i' devant une syllabe muette : ils emploient."
  },

  // =========================================================================
  // NIVEAU 2 : FUTUR SIMPLE & VERBES À RADICAL PARTICULIER
  // =========================================================================
  {
    id: "roue-n2-01",
    level: 2,
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
    id: "roue-n2-02",
    level: 2,
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
    id: "roue-n2-03",
    level: 2,
    difficulty: "Niveau 2 : Futur du verbe pouvoir",
    category: "FUTUR SIMPLE DU VERBE POUVOIR",
    prompt: "Conjuguez le verbe 'pouvoir' au futur simple, à la 1re personne du pluriel :",
    context: "Après la délibération finale, nous pourrons fêter l'obtention du diplôme.",
    fullSentence: "APRÈS LA DÉLIBÉRATION FINALE NOUS POURRONS FÊTER L'OBTENTION DU DIPLÔME",
    verbForm: "POURRONS",
    initialRevealed: ["R", "O"],
    correctAnswers: ["pourrons", "APRÈS LA DÉLIBÉRATION FINALE NOUS POURRONS FÊTER L'OBTENTION DU DIPLÔME"],
    explanation: "Le radical du futur de pouvoir s'écrit avec deux 'r' : nous pourrons (ne pas confondre avec le conditionnel : nous pourrions)."
  },
  {
    id: "roue-n2-04",
    level: 2,
    difficulty: "Niveau 2 : Futur du verbe vouloir",
    category: "FUTUR SIMPLE DU VERBE VOULOIR",
    prompt: "Conjuguez le verbe 'vouloir' au futur simple, à la 2e personne du pluriel :",
    context: "Si le projet vous plaît, vous voudrez sans doute le poursuivre en master.",
    fullSentence: "SI LE PROJET VOUS PLAÎT VOUS VOUDREZ SANS DOUTE LE POURSUIVRE EN MASTER",
    verbForm: "VOUDREZ",
    initialRevealed: ["U", "D"],
    correctAnswers: ["voudrez", "SI LE PROJET VOUS PLAÎT VOUS VOUDREZ SANS DOUTE LE POURSUIVRE EN MASTER"],
    explanation: "Le radical du futur de vouloir est voudr- : vous voudrez."
  },
  {
    id: "roue-n2-05",
    level: 2,
    difficulty: "Niveau 2 : Futur du verbe falloir",
    category: "FUTUR SIMPLE DU VERBE FALLOIR",
    prompt: "Conjuguez le verbe défectif 'falloir' au futur simple, à la 3e personne du singulier :",
    context: "Dès la rentrée académique, il faudra valider votre programme annuel.",
    fullSentence: "DÈS LA RENTRÉE ACADÉMIQUE IL FAUDRA VALIDER VOTRE PROGRAMME ANNUEL",
    verbForm: "FAUDRA",
    initialRevealed: ["A", "U"],
    correctAnswers: ["faudra", "DÈS LA RENTRÉE ACADÉMIQUE IL FAUDRA VALIDER VOTRE PROGRAMME ANNUEL"],
    explanation: "Le verbe impersonnel falloir prend la forme 'il faudra' au futur simple."
  },
  {
    id: "roue-n2-06",
    level: 2,
    difficulty: "Niveau 2 : Futur du verbe tenir",
    category: "FUTUR SIMPLE DU VERBE TENIR",
    prompt: "Conjuguez le verbe 'tenir' au futur simple, à la 3e personne du singulier :",
    context: "La déléguée tiendra une permanence hebdomadaire au local étudiant.",
    fullSentence: "LA DÉLÉGUÉE TIENDRA UNE PERMANENCE HEBDOMADAIRE AU LOCAL ÉTUDIANT",
    verbForm: "TIENDRA",
    initialRevealed: ["I", "E"],
    correctAnswers: ["tiendra", "LA DÉLÉGUÉE TIENDRA UNE PERMANENCE HEBDOMADAIRE AU LOCAL ÉTUDIANT"],
    explanation: "Le radical du futur de tenir est tiendr- : elle tiendra."
  },
  {
    id: "roue-n2-07",
    level: 2,
    difficulty: "Niveau 2 : Futur du verbe devoir",
    category: "FUTUR SIMPLE DU VERBE DEVOIR",
    prompt: "Conjuguez le verbe 'devoir' au futur simple, à la 3e personne du pluriel :",
    context: "Tous les étudiants devront rendre leur rapport de stage avant le quinze juin.",
    fullSentence: "TOUS LES ÉTUDIANTS DEVRONT RENDRE LEUR RAPPORT DE STAGE AVANT LE QUINZE JUIN",
    verbForm: "DEVRONT",
    initialRevealed: ["E", "O"],
    correctAnswers: ["devront", "TOUS LES ÉTUDIANTS DEVRONT RENDRE LEUR RAPPORT DE STAGE AVANT LE QUINZE JUIN"],
    explanation: "Au futur simple, le radical de devoir est devr- : ils devront."
  },
  {
    id: "roue-n2-08",
    level: 2,
    difficulty: "Niveau 2 : Futur du verbe savoir",
    category: "FUTUR SIMPLE DU VERBE SAVOIR",
    prompt: "Conjuguez le verbe 'savoir' au futur simple, à la 2e personne du pluriel :",
    context: "Dès vendredi midi, vous saurez si votre demande de dispense est accordée.",
    fullSentence: "DÈS VENDREDI MIDI VOUS SAUREZ SI VOTRE DEMANDE DE DISPENSE EST ACCORDÉE",
    verbForm: "SAUREZ",
    initialRevealed: ["A", "U"],
    correctAnswers: ["saurez", "DÈS VENDREDI MIDI VOUS SAUREZ SI VOTRE DEMANDE DE DISPENSE EST ACCORDÉE"],
    explanation: "Le futur simple du verbe savoir utilise le radical saur- : vous saurez."
  },

  // =========================================================================
  // NIVEAU 3 : IMPARFAIT PIÈGES (-II-, -YI-) & SUBJONCTIF DU 3E GROUPE
  // =========================================================================
  {
    id: "roue-n3-01",
    level: 3,
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
    id: "roue-n3-02",
    level: 3,
    difficulty: "Niveau 3 : Imparfait en -ier (Piège du double i)",
    category: "INDICATIF IMPARFAIT DU VERBE ÉTUDIER",
    prompt: "Conjuguez le verbe 'étudier' à l'indicatif imparfait, à la 1re personne du pluriel :",
    context: "L'an passé, nous étudiions tard le soir dans les locaux de la bibliothèque.",
    fullSentence: "L'AN PASSÉ NOUS ÉTUDIIONS TARD LE SOIR DANS LES LOCAUX DE LA BIBLIOTHÈQUE",
    verbForm: "ÉTUDIIONS",
    initialRevealed: ["I", "O"],
    correctAnswers: ["étudiions", "etudiions", "L'AN PASSÉ NOUS ÉTUDIIONS TARD LE SOIR DANS LES LOCAUX DE LA BIBLIOTHÈQUE"],
    explanation: "À l'imparfait avec nous, les verbes en -ier prennent deux 'i' consécutifs : nous étudiions."
  },
  {
    id: "roue-n3-03",
    level: 3,
    difficulty: "Niveau 3 : Imparfait en -yer (Rencontre y et i)",
    category: "INDICATIF IMPARFAIT DU VERBE APPUYER",
    prompt: "Conjuguez le verbe 'appuyer' à l'indicatif imparfait, à la 2e personne du pluriel :",
    context: "Pour argumenter, vous appuyiez votre thèse sur des publications solides.",
    fullSentence: "POUR ARGUMENTER VOUS APPUYIEZ VOTRE THÈSE SUR DES PUBLICATIONS SOLIDES",
    verbForm: "APPUYIEZ",
    initialRevealed: ["Y", "I"],
    correctAnswers: ["appuyiez", "POUR ARGUMENTER VOUS APPUYIEZ VOTRE THÈSE SUR DES PUBLICATIONS SOLIDES"],
    explanation: "À l'imparfait, le 'y' du radical est maintenu et suivi de -iez : vous appuyiez."
  },
  {
    id: "roue-n3-04",
    level: 3,
    difficulty: "Niveau 3 : Imparfait en -yer (Rencontre y et i)",
    category: "INDICATIF IMPARFAIT DU VERBE BALAYER",
    prompt: "Conjuguez le verbe 'balayer' à l'indicatif imparfait, à la 1re personne du pluriel :",
    context: "Durant la séance méthodologique, nous balayions l'ensemble des questions types.",
    fullSentence: "DURANT LA SÉANCE MÉTHODOLOGIQUE NOUS BALAYIONS L'ENSEMBLE DES QUESTIONS TYPES",
    verbForm: "BALAYIONS",
    initialRevealed: ["Y", "O"],
    correctAnswers: ["balayions", "DURANT LA SÉANCE MÉTHODOLOGIQUE NOUS BALAYIONS L'ENSEMBLE DES QUESTIONS TYPES"],
    explanation: "À l'imparfait avec nous, le 'y' est suivi de -ions : nous balayions."
  },
  {
    id: "roue-n3-05",
    level: 3,
    difficulty: "Niveau 3 : Subjonctif verbe du 3e groupe",
    category: "SUBJONCTIF PRÉSENT DU VERBE MOURIR",
    prompt: "Conjuguez le verbe 'mourir' au subjonctif présent, à la 3e personne du pluriel :",
    context: "Le biologiste veille à ce que les cellules ne meurent pas au froid.",
    fullSentence: "LE BIOLOGISTE VEILLE À CE QUE LES CELLULES NE MEURENT PAS AU FROID",
    verbForm: "MEURENT",
    initialRevealed: ["E", "T"],
    correctAnswers: ["meurent", "LE BIOLOGISTE VEILLE À CE QUE LES CELLULES NE MEURENT PAS AU FROID"],
    explanation: "Subjonctif présent : qu'ils/qu'elles meurent (radical meu- et terminaison -ent)."
  },
  {
    id: "roue-n3-06",
    level: 3,
    difficulty: "Niveau 3 : Subjonctif du verbe craindre",
    category: "SUBJONCTIF PRÉSENT DU VERBE CRAINDRE",
    prompt: "Conjuguez le verbe 'craindre' au subjonctif présent, à la 3e personne du pluriel :",
    context: "Il n'est pas nécessaire que les candidats craignent l'épreuve de synthèse.",
    fullSentence: "IL N'EST PAS NÉCESSAIRE QUE LES CANDIDATS CRAIGNENT L'ÉPREUVE DE SYNTHÈSE",
    verbForm: "CRAIGNENT",
    initialRevealed: ["A", "G"],
    correctAnswers: ["craignent", "IL N'EST PAS NÉCESSAIRE QUE LES CANDIDATS CRAIGNENT L'ÉPREUVE DE SYNTHÈSE"],
    explanation: "Au subjonctif présent, craindre forme son radical en craign- : qu'ils craignent."
  },
  {
    id: "roue-n3-07",
    level: 3,
    difficulty: "Niveau 3 : Subjonctif du verbe prendre",
    category: "SUBJONCTIF PRÉSENT DU VERBE PRENDRE",
    prompt: "Conjuguez le verbe 'prendre' au subjonctif présent, à la 3e personne du pluriel :",
    context: "Il est indispensable qu'ils prennent des notes précises pendant la conférence.",
    fullSentence: "IL EST INDISPENSABLE QU'ILS PRENNENT DES NOTES PRÉCISES PENDANT LA CONFÉRENCE",
    verbForm: "PRENNENT",
    initialRevealed: ["E", "N"],
    correctAnswers: ["prennent", "IL EST INDISPENSABLE QU'ILS PRENNENT DES NOTES PRÉCISES PENDANT LA CONFÉRENCE"],
    explanation: "Au subjonctif présent avec ils/elles, prendre double son 'n' : qu'ils prennent."
  },
  {
    id: "roue-n3-08",
    level: 3,
    difficulty: "Niveau 3 : Subjonctif du verbe croire",
    category: "SUBJONCTIF PRÉSENT DU VERBE CROIRE",
    prompt: "Conjuguez le verbe 'croire' au subjonctif présent, à la 2e personne du pluriel :",
    context: "Bien que vous croyiez avoir terminé, relisez attentivement la consigne.",
    fullSentence: "BIEN QUE VOUS CROYIEZ AVOIR TERMINÉ RELISEZ ATTENTIVEMENT LA CONSIGNE",
    verbForm: "CROYIEZ",
    initialRevealed: ["Y", "Z"],
    correctAnswers: ["croyiez", "BIEN QUE VOUS CROYIEZ AVOIR TERMINÉ RELISEZ ATTENTIVEMENT LA CONSIGNE"],
    explanation: "Au subjonctif présent avec vous, le radical croy- est suivi de -iez : que vous croyiez."
  },

  // =========================================================================
  // NIVEAU 4 : CONDITIONNEL PRÉSENT & SUBJONCTIFS IRRÉGULIERS
  // =========================================================================
  {
    id: "roue-n4-01",
    level: 4,
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
    id: "roue-n4-02",
    level: 4,
    difficulty: "Niveau 4 : Conditionnel avec double consonne",
    category: "CONDITIONNEL PRÉSENT DU VERBE MOURIR",
    prompt: "Conjuguez le verbe 'mourir' au conditionnel présent, à la 3e personne du pluriel :",
    context: "Sans apport d'oxygène, les cultures cellulaires mourraient rapidement.",
    fullSentence: "SANS APPORT D'OXYGÈNE LES CULTURES CELLULAIRES MOURRAIENT RAPIDEMENT",
    verbForm: "MOURRAIENT",
    initialRevealed: ["R", "A"],
    correctAnswers: ["mourraient", "SANS APPORT D'OXYGÈNE LES CULTURES CELLULAIRES MOURRAIENT RAPIDEMENT"],
    explanation: "Au conditionnel présent, le verbe mourir prend deux 'r' : elles mourraient."
  },
  {
    id: "roue-n4-03",
    level: 4,
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
    id: "roue-n4-04",
    level: 4,
    difficulty: "Niveau 4 : Subjonctif du verbe valoir",
    category: "SUBJONCTIF PRÉSENT DU VERBE VALOIR",
    prompt: "Conjuguez le verbe 'valoir' au subjonctif présent, à la 3e personne du singulier :",
    context: "Il est préférable que cette dispense vaille pour l'ensemble du cursus.",
    fullSentence: "IL EST PRÉFÉRABLE QUE CETTE DISPENSE VAILLE POUR L'ENSEMBLE DU CURSUS",
    verbForm: "VAILLE",
    initialRevealed: ["A", "L"],
    correctAnswers: ["vaille", "IL EST PRÉFÉRABLE QUE CETTE DISPENSE VAILLE POUR L'ENSEMBLE DU CURSUS"],
    explanation: "Le subjonctif présent du verbe valoir est irrégulier : qu'il/elle vaille."
  },
  {
    id: "roue-n4-05",
    level: 4,
    difficulty: "Niveau 4 : Subjonctif du verbe savoir",
    category: "SUBJONCTIF PRÉSENT DU VERBE SAVOIR",
    prompt: "Conjuguez le verbe 'savoir' au subjonctif présent, à la 3e personne du pluriel :",
    context: "Le jury exige que les candidats sachent justifier chaque choix statistique.",
    fullSentence: "LE JURY EXIGE QUE LES CANDIDATS SACHENT JUSTIFIER CHAQUE CHOIX STATISTIQUE",
    verbForm: "SACHENT",
    initialRevealed: ["S", "H"],
    correctAnswers: ["sachent", "LE JURY EXIGE QUE LES CANDIDATS SACHENT JUSTIFIER CHAQUE CHOIX STATISTIQUE"],
    explanation: "Au subjonctif présent, savoir prend le radical sach- : qu'ils sachent."
  },
  {
    id: "roue-n4-06",
    level: 4,
    difficulty: "Niveau 4 : Subjonctif du verbe pouvoir",
    category: "SUBJONCTIF PRÉSENT DU VERBE POUVOIR",
    prompt: "Conjuguez le verbe 'pouvoir' au subjonctif présent, à la 3e personne du pluriel :",
    context: "Il faut que les étudiants puissent accéder aux ressources numériques du campus.",
    fullSentence: "IL FAUT QUE LES ÉTUDIANTS PUISSENT ACCÉDER AUX RESSOURCES NUMÉRIQUES DU CAMPUS",
    verbForm: "PUISSENT",
    initialRevealed: ["P", "S"],
    correctAnswers: ["puissent", "IL FAUT QUE LES ÉTUDIANTS PUISSENT ACCÉDER AUX RESSOURCES NUMÉRIQUES DU CAMPUS"],
    explanation: "Le subjonctif présent de pouvoir utilise le radical puiss- : qu'ils puissent."
  },
  {
    id: "roue-n4-07",
    level: 4,
    difficulty: "Niveau 4 : Conditionnel du verbe envoyer",
    category: "CONDITIONNEL PRÉSENT DU VERBE ENVOYER",
    prompt: "Conjuguez le verbe 'envoyer' au conditionnel présent, à la 1re personne du pluriel :",
    context: "En cas d'urgence administrative, nous vous enverrions un courriel prioritaire.",
    fullSentence: "EN CAS D'URGENCE ADMINISTRATIVE NOUS VOUS ENVERRIONS UN COURRIEL PRIORITAIRE",
    verbForm: "ENVERRIONS",
    initialRevealed: ["N", "O"],
    correctAnswers: ["enverrions", "EN CAS D'URGENCE ADMINISTRATIVE NOUS VOUS ENVERRIONS UN COURRIEL PRIORITAIRE"],
    explanation: "Le conditionnel présent d'envoyer prend deux 'r' : nous enverrions."
  },
  {
    id: "roue-n4-08",
    level: 4,
    difficulty: "Niveau 4 : Subjonctif du verbe résoudre",
    category: "SUBJONCTIF PRÉSENT DU VERBE RÉSOUDRE",
    prompt: "Conjuguez le verbe 'résoudre' au subjonctif présent, à la 3e personne du pluriel :",
    context: "Il importe que les ingénieurs résolvent ce dysfonctionnement sans délai.",
    fullSentence: "IL IMPORTE QUE LES INGÉNIEURS RÉSOLVENT CE DYSFONCTIONNEMENT SANS DÉLAI",
    verbForm: "RÉSOLVENT",
    initialRevealed: ["É", "V"],
    correctAnswers: ["résolvent", "resolvent", "IL IMPORTE QUE LES INGÉNIEURS RÉSOLVENT CE DYSFONCTIONNEMENT SANS DÉLAI"],
    explanation: "Au subjonctif présent, le verbe résoudre forme son radical en résolv- : qu'ils résolvent."
  },

  // =========================================================================
  // NIVEAU 5 : ACCORDS DU PARTICIPE PASSÉ (COD ANTÉPOSÉ, PRONOMINAUX & PARTICULIERS)
  // =========================================================================
  {
    id: "roue-n5-01",
    level: 5,
    difficulty: "Niveau 5 : Accord du participe passé avec être",
    category: "PARTICIPE PASSÉ DU VERBE RÉSOUDRE",
    prompt: "Conjuguez le verbe 'résoudre' au participe passé au masculin pluriel :",
    context: "Tous les cas litigieux ont été résolus en séance plénière.",
    fullSentence: "TOUS LES CAS LITIGIEUX ONT ÉTÉ RÉSOLUS EN SÉANCE PLÉNIÈRE",
    verbForm: "RÉSOLUS",
    initialRevealed: ["S", "E"],
    correctAnswers: ["résolus", "resolus", "TOUS LES CAS LITIGIEUX ONT ÉTÉ RÉSOLUS EN SÉANCE PLÉNIÈRE"],
    explanation: "Le participe passé de résoudre est résolu (sans t). Au masculin pluriel accordé avec le sujet : résolus."
  },
  {
    id: "roue-n5-02",
    level: 5,
    difficulty: "Niveau 5 : Participe passé avec COD antéposé",
    category: "ACCORD DU PARTICIPE PASSÉ ÉCRIRE (COD AVANT)",
    prompt: "Accordez le participe passé du verbe 'écrire' dans le contexte suivant :",
    context: "Les recommandations officielles qu'elle a écrites figurent dans le guide.",
    fullSentence: "LES RECOMMANDATIONS OFFICIELLES QU'ELLE A ÉCRITES FIGURENT DANS LE GUIDE",
    verbForm: "ÉCRITES",
    initialRevealed: ["C", "T"],
    correctAnswers: ["écrites", "ecrites", "LES RECOMMANDATIONS OFFICIELLES QU'ELLE A ÉCRITES FIGURENT DANS LE GUIDE"],
    explanation: "Le COD 'les recommandations officielles' (féminin pluriel) est placé avant l'auxiliaire avoir : écrites."
  },
  {
    id: "roue-n5-03",
    level: 5,
    difficulty: "Niveau 5 : Verbe pronominal sans COD (Invariable)",
    category: "ACCORD DU PARTICIPE PASSÉ SUCCÉDER",
    prompt: "Accordez le participe passé du verbe pronominal 'se succéder' :",
    context: "Trois directeurs de département se sont succédé durant la dernière décennie.",
    fullSentence: "TROIS DIRECTEURS DE DÉPARTEMENT SE SONT SUCCÉDÉ DURANT LA DERNIÈRE DÉCENNIE",
    verbForm: "SUCCÉDÉ",
    initialRevealed: ["C", "É"],
    correctAnswers: ["succédé", "succede", "TROIS DIRECTEURS DE DÉPARTEMENT SE SONT SUCCÉDÉ DURANT LA DERNIÈRE DÉCENNIE"],
    explanation: "On succède 'à' quelqu'un : le pronom 'se' est un COI (complément d'objet indirect). Le participe passé reste invariable : succédé."
  },
  {
    id: "roue-n5-04",
    level: 5,
    difficulty: "Niveau 5 : Verbe pronominal sans COD (Invariable)",
    category: "ACCORD DU PARTICIPE PASSÉ TÉLÉPHONER",
    prompt: "Accordez le participe passé du verbe pronominal 'se téléphoner' :",
    context: "Les deux membres du binôme se sont téléphoné pour synchroniser leurs diapositives.",
    fullSentence: "LES DEUX MEMBRES DU BINÔME SE SONT TÉLÉPHONÉ POUR SYNCHRONISER LEURS DIAPOSITIVES",
    verbForm: "TÉLÉPHONÉ",
    initialRevealed: ["T", "H"],
    correctAnswers: ["téléphoné", "telephone", "LES DEUX MEMBRES DU BINÔME SE SONT TÉLÉPHONÉ POUR SYNCHRONISER LEURS DIAPOSITIVES"],
    explanation: "On téléphone 'à' quelqu'un : le pronom réfléchi 'se' est COI. Pas de COD, donc invariabilité : téléphoné."
  },
  {
    id: "roue-n5-05",
    level: 5,
    difficulty: "Niveau 5 : Verbe pronominal avec COD placé après",
    category: "ACCORD DU PARTICIPE PASSÉ LAVER (COD APRÈS)",
    prompt: "Accordez le participe passé du verbe pronominal 'se laver' :",
    context: "Après la manipulation chimique, l'étudiante s'est lavé les mains au savon antiseptique.",
    fullSentence: "APRÈS LA MANIPULATION CHIMIQUE L'ÉTUDIANTE S'EST LAVÉ LES MAINS AU SAVON ANTISEPTIQUE",
    verbForm: "LAVÉ",
    initialRevealed: ["L", "V"],
    correctAnswers: ["lavé", "lave", "APRÈS LA MANIPULATION CHIMIQUE L'ÉTUDIANTE S'EST LAVÉ LES MAINS AU SAVON ANTISEPTIQUE"],
    explanation: "Le COD 'les mains' est placé après le verbe. Le participe passé ne s'accorde pas : lavé."
  },
  {
    id: "roue-n5-06",
    level: 5,
    difficulty: "Niveau 5 : Participe passé avec COD antéposé",
    category: "ACCORD DU PARTICIPE PASSÉ TRANSMETTRE (COD AVANT)",
    prompt: "Accordez le participe passé du verbe 'transmettre' dans le contexte suivant :",
    context: "Voici les consignes académiques que le secrétariat nous a transmises ce matin.",
    fullSentence: "VOICI LES CONSIGNES ACADÉMIQUES QUE LE SECRÉTARIAT NOUS A TRANSMISES CE MATIN",
    verbForm: "TRANSMISES",
    initialRevealed: ["S", "M"],
    correctAnswers: ["transmises", "VOICI LES CONSIGNES ACADÉMIQUES QUE LE SECRÉTARIAT NOUS A TRANSMISES CE MATIN"],
    explanation: "Le pronom relatif 'que' a pour antécédent 'les consignes académiques' (féminin pluriel), placé avant avoir : transmises."
  },
  {
    id: "roue-n5-07",
    level: 5,
    difficulty: "Niveau 5 : Expression figée 'se rendre compte'",
    category: "ACCORD DU PARTICIPE PASSÉ SE RENDRE COMPTE",
    prompt: "Accordez le participe passé dans l'expression 'se rendre compte' :",
    context: "Les étudiants se sont rendu compte de l'importance capitale du travail régulier.",
    fullSentence: "LES ÉTUDIANTS SE SONT RENDU COMPTE DE L'IMPORTANCE CAPITALE DU TRAVAIL RÉGULIER",
    verbForm: "RENDU",
    initialRevealed: ["R", "D"],
    correctAnswers: ["rendu", "LES ÉTUDIANTS SE SONT RENDU COMPTE DE L'IMPORTANCE CAPITALE DU TRAVAIL RÉGULIER"],
    explanation: "Dans la locution 'se rendre compte', le mot 'compte' est le COD placé après le verbe. Le participe reste invariable : rendu."
  },
  {
    id: "roue-n5-08",
    level: 5,
    difficulty: "Niveau 5 : Verbe impersonnel (Invariabilité absolue)",
    category: "ACCORD DU PARTICIPE PASSÉ DU VERBE FALLOIR",
    prompt: "Accordez le participe passé du verbe 'falloir' dans le contexte suivant :",
    context: "Considérez les efforts considérables qu'il a fallu pour mener ce projet à terme.",
    fullSentence: "CONSIDÉREZ LES EFFORTS CONSIDÉRABLES QU'IL A FALLU POUR MENER CE PROJET À TERME",
    verbForm: "FALLU",
    initialRevealed: ["F", "L"],
    correctAnswers: ["fallu", "CONSIDÉREZ LES EFFORTS CONSIDÉRABLES QU'IL A FALLU POUR MENER CE PROJET À TERME"],
    explanation: "Le participe passé des verbes impersonnels est TOUJOURS invariable : fallu (même si 'les efforts' précède)."
  }
];

/**
 * Génère une session de jeu de 10 manches pour La Roue des Accords
 * Garantit une progression strictement graduée en 5 niveaux :
 * - Manches 1 et 2 : Niveau 1 (Présent d'usage & alternances régulières)
 * - Manches 3 et 4 : Niveau 2 (Futur simple & verbes du 3e groupe)
 * - Manches 5 et 6 : Niveau 3 (Imparfait pièges & Subjonctif du 3e groupe)
 * - Manches 7 et 8 : Niveau 4 (Conditionnel double consonne & Subjonctifs irréguliers)
 * - Manches 9 et 10 : Niveau 5 (Participes passés complexes, COD antéposé, pronominaux)
 */
export function generateRoueSessionQuestions() {
  const getQuestionsByLevel = (lvl) => {
    return ROUE_ACCORDS_BANK.filter(q => q.level === lvl);
  };

  const pickRandomN = (arr, n) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };

  const n1 = pickRandomN(getQuestionsByLevel(1), 2);
  const n2 = pickRandomN(getQuestionsByLevel(2), 2);
  const n3 = pickRandomN(getQuestionsByLevel(3), 2);
  const n4 = pickRandomN(getQuestionsByLevel(4), 2);
  const n5 = pickRandomN(getQuestionsByLevel(5), 2);

  // Assemblage dans l'ordre strict de la graduation académique
  return [...n1, ...n2, ...n3, ...n4, ...n5];
}
