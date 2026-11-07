// Banque étendue de questions pour « Qui veut gagner des Crédits ? »
// Référentiel des verbes de consigne académiques FWB & Haute École Charlemagne
// 3 Paliers d'exigence :
// - Palier 1 (Questions 1 à 3 : 6, 12, 18 ECTS) : Tâches mécaniques directes & repérage
// - Palier 2 (Questions 4 à 7 : 24, 30, 36, 42 ECTS) : Traitement intermédiaire & structuration (Paliers garantis à Q4 et Q7)
// - Palier 3 (Questions 8 à 10 : 48, 54, 60 ECTS) : Haute exigence conceptuelle, analyse critique & synthèse

export const VERBES_BANK_TIER_1 = [
  {
    verb: "Souligner",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer un trait continu sous le mot ou la proposition sans masquer les caractères",
      "Recouvrir les lettres d'une couche de surligneur jaune ou vert fluorescent",
      "Tracer un encadrement rectangulaire fermé autour du mot",
      "Barrer d'un trait horizontal médian le mot pour signaler une correction"
    ],
    correctIndex: 0,
    explanation: "Souligner consiste à tracer une ligne continue directement sous les termes ciblés, sans toucher ni masquer les lettres."
  },
  {
    verb: "Cocher",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Placer un signe distinctif (✓ ou ✗) à l'intérieur de la case prévue à cet effet",
      "Noircir et remplir intégralement la case au stylo ou au feutre",
      "Inscrire le numéro de la réponse dans la marge gauche de la feuille",
      "Relier la question à la bonne réponse par un trait continu"
    ],
    correctIndex: 0,
    explanation: "Cocher impose de marquer la case d'une croix ou d'un trait sans déborder ni noircir la case."
  },
  {
    verb: "Biffer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Barrer d'un trait net un mot ou une mention pour l'annuler et l'exclure formellement",
      "Recouvrir d'un correcteur blanc opaque pour faire disparaître l'encre",
      "Mettre le terme entre parenthèses sans le rayer pour indiquer un doute",
      "Gommer le mot au crayon pour effacer toute trace d'écriture"
    ],
    correctIndex: 0,
    explanation: "Biffer consiste à tracer un trait horizontal sur un élément pour signifier son annulation sans ambiguïté."
  },
  {
    verb: "Entourer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer une ligne continue fermée (cercle ou ovale) englobant l'élément cible",
      "Tracer une ligne droite sous le groupe de mots",
      "Placer deux astérisques ou guillemets de part et d'autre de l'expression",
      "Tracer quatre segments à la règle formant un polygone rectangulaire"
    ],
    correctIndex: 0,
    explanation: "Entourer exige d'enfermer l'élément dans un contour continu sans sectionner les lettres."
  },
  {
    verb: "Encadrer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer un rectangle ou un carré fermé dont les bordures délimitent la réponse",
      "Tracer un ovale fluide à main levée autour du terme",
      "Colorier la zone d'arrière-plan de la formule ou de la réponse",
      "Placer des crochets droits au début et à la fin de la proposition"
    ],
    correctIndex: 0,
    explanation: "Encadrer consiste à enfermer la formule ou la phrase dans les quatre côtés d'un cadre géométrique net."
  },
  {
    verb: "Surligner",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Appliquer une couleur transparente vive par-dessus le texte pour le mettre en valeur",
      "Tracer un trait à la règle sous la ligne de base du texte",
      "Réécrire le terme en lettres majuscules d'imprimerie épaisses",
      "Entourer les mots clés d'un tracé au stylo à bille"
    ],
    correctIndex: 0,
    explanation: "Surligner consiste à faire ressortir une information par transparence colorée sans en masquer la lisibilité."
  },
  {
    verb: "Numéroter",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Attribuer un chiffre d'ordre séquentiel (1, 2, 3...) à chaque élément selon une logique précise",
      "Compter le nombre total de mots ou d'occurrences présents dans le texte",
      "Calculer la moyenne arithmétique ou le pourcentage des résultats",
      "Classer par ordre alphabétique sans inscrire de chiffres"
    ],
    correctIndex: 0,
    explanation: "Numéroter impose d'affecter un numéro d'ordre identifiable (1, 2, 3...) à chaque item d'un ensemble."
  },
  {
    verb: "Recopier",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Reproduire fidèlement et intégralement un texte ou un extrait sans aucune modification",
      "Reformuler l'idée principale dans un vocabulaire personnel plus moderne",
      "Résumer le passage en sélectionnant uniquement les mots porteurs de sens",
      "Traduire le passage dans une autre langue ou un autre registre"
    ],
    correctIndex: 0,
    explanation: "Recopier exige une reproduction à l'identique (mots, ponctuation, orthographe) sans aucune altération."
  },
  {
    verb: "Compléter",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Ajouter les éléments manquants dans un énoncé lacunaire pour le rendre complet",
      "Rédiger un paragraphe inédit prolongeant la réflexion de l'auteur",
      "Corriger les erreurs d'orthographe présentes dans le texte source",
      "Remplacer l'ensemble de la phrase par une formulation synonyme"
    ],
    correctIndex: 0,
    explanation: "Compléter consiste à renseigner avec exactitude les blancs laissés vides dans une structure préexistante."
  },
  {
    verb: "Nommer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Désigner un objet, un concept ou une personne par son terme propre ou son appellation exacte",
      "Fournir une définition détaillée en plusieurs phrases des caractéristiques de l'objet",
      "Expliquer l'origine étymologique et historique de l'appellation",
      "Donner une métaphore ou une image poétique pour évoquer la réalité"
    ],
    correctIndex: 0,
    explanation: "Nommer se limite à énoncer l'appellation exacte (le nom propre ou le substantif précis) sans développement."
  },
  {
    verb: "Pointer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Désigner ou marquer précisément l'emplacement exact d'un élément sur un schéma ou un texte",
      "Faire un commentaire général sur l'esthétique du document graphique",
      "Mesurer la distance en centimètres entre deux points du schéma",
      "Redessiner entièrement la figure sur une feuille annexe"
    ],
    correctIndex: 0,
    explanation: "Pointer consiste à cibler visuellement et de manière univoque un endroit précis du document."
  },
  {
    verb: "Rayer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer une ligne continue sur un mot pour signifier son rejet ou son invalidation",
      "Souligner le mot deux fois d'affilée pour insister sur son importance",
      "Écrire la mention 'Faux' en rouge au-dessus du mot sans y toucher",
      "Découper aux ciseaux la partie de la feuille contenant l'erreur"
    ],
    correctIndex: 0,
    explanation: "Rayer consiste à neutraliser un mot ou une phrase en le biffant d'un trait horizontal net."
  }
];

export const VERBES_BANK_TIER_2 = [
  {
    verb: "Relier",
    difficulty: "Intermédiaire",
    tier: 2,
    isSafetyTier: true, // ⭐ PALIER DE SÉCURITÉ GARANTI 1 (Q4 = 24 ECTS)
    options: [
      "Tracer un trait ou une flèche matérialisant la correspondance exacte entre deux éléments associés",
      "Placer les deux éléments dans une même phrase rédigée sans symbole graphique",
      "Fusionner les deux définitions en un paragraphe synthétique unique",
      "Classer les éléments par ordre alphabétique dans deux colonnes séparées"
    ],
    correctIndex: 0,
    explanation: "Relier exige d'établir un lien visuel direct (segment ou flèche) entre les items appariés."
  },
  {
    verb: "Citer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Rapporter textuellement et fidèlement un passage ou des données entre guillemets sans les altérer",
      "Résumer l'idée générale de l'auteur avec ses propres mots sans reproduire le texte",
      "Exprimer son accord ou son désaccord argumenté avec la position de l'auteur",
      "Traduire le terme technique dans un registre de langue plus courant"
    ],
    correctIndex: 0,
    explanation: "Citer exige de retranscrire à la lettre l'énoncé source entre guillemets sans en modifier un seul terme."
  },
  {
    verb: "Énumérer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Nommer successivement et de façon exhaustive tous les composants d'un ensemble sans omission",
      "Rédiger un paragraphe narratif continu décrivant l'évolution historique du sujet",
      "Sélectionner un seul exemple significatif et le développer sur une page",
      "Regrouper les composantes en catégories abstraites hiérarchisées"
    ],
    correctIndex: 0,
    explanation: "Énumérer consiste à dresser la liste complète, terme à terme, de tous les éléments sans omission."
  },
  {
    verb: "Classer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Distribuer des éléments dans des catégories ordonnées selon un critère logique ou une grille explicite",
      "Lister les éléments au fil de la plume sans distinction de catégorie ni de hiérarchie",
      "Séparer arbitrairement les éléments en deux moitiés égales sans règle directrice",
      "Nommer chaque élément par son appellation officielle sans créer de groupes"
    ],
    correctIndex: 0,
    explanation: "Classer implique d'appliquer un critère taxonomique logique pour regrouper ou hiérarchiser des items."
  },
  {
    verb: "Décrire",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Présenter les caractéristiques observables, l'aspect et la structure d'un fait sans spéculer sur les causes",
      "Démontrer les mécanismes de cause à effet qui produisent le phénomène",
      "Porter un jugement de valeur moral ou esthétique sur l'objet étudié",
      "Formuler une hypothèse prospective sur l'évolution future du fait"
    ],
    correctIndex: 0,
    explanation: "Décrire consiste à faire un état des lieux factuel et minutieux de ce qui est observable sans chercher le pourquoi profond."
  },
  {
    verb: "Illustrer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Appuyer une règle abstraite ou un concept par un exemple contextualisé, un fait réel ou une donnée concrète",
      "Établir la validité formelle d'un théorème par une démonstration mathématique",
      "Tracer obligatoirement un schéma abstrait ou un organigramme sans texte",
      "Reformuler la définition théorique en employant d'autres mots savants"
    ],
    correctIndex: 0,
    explanation: "Illustrer signifie rendre tangible une notion abstraite au moyen d'un cas pratique ou d'un exemple probant."
  },
  {
    verb: "Identifier",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Reconnaître et isoler avec certitude un élément précis au sein d'un corpus d'après ses propriétés caractéristiques",
      "Créer une nouvelle catégorie théorique pour regrouper des éléments disparates",
      "Expliquer en détail les causes de l'apparition de l'élément dans le document",
      "Donner son avis sur l'utilité pratique de l'élément dans la vie courante"
    ],
    correctIndex: 0,
    explanation: "Identifier consiste à repérer et désigner un composant cible en s'appuyant sur ses indices distinctifs."
  },
  {
    verb: "Distinguer",
    difficulty: "Intermédiaire",
    tier: 2,
    isSafetyTier: true, // ⭐ PALIER DE SÉCURITÉ GARANTI 2 (Q7 = 42 ECTS)
    options: [
      "Discerner et expliciter les différences singulières qui empêchent de confondre deux notions voisines",
      "Traiter les deux notions comme strictement équivalentes et interchangeables",
      "Raconter la genèse historique commune des deux concepts",
      "Choisir arbitrairement l'une des deux notions en ignorant l'autre"
    ],
    correctIndex: 0,
    explanation: "Distinguer exige d'isoler les critères spécifiques qui discriminent sans confusion deux éléments proches."
  },
  {
    verb: "Schématiser",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Représenter sous une forme graphique simplifiée les relations fonctionnelles et composantes clés",
      "Rédiger un essai discursif exhaustif de plusieurs pages sans support visuel",
      "Reproduire un dessin hyperréaliste avec ombrages et détails minutieux",
      "Lister les formules mathématiques brutes sans symboles relationnels"
    ],
    correctIndex: 0,
    explanation: "Schématiser consiste à épurer la complexité d'une réalité pour en faire ressortir la logique fonctionnelle en un tracé clair."
  },
  {
    verb: "Traduire",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Transposer un message d'un système de signes vers un autre (langue, graphique, code) en préservant son sens exact",
      "Commenter librement les intentions cachées de l'auteur d'un document",
      "Raccourcir un texte en éliminant les passages les plus complexes",
      "Améliorer le style littéraire d'un auteur en modifiant ses idées d'origine"
    ],
    correctIndex: 0,
    explanation: "Traduire impose de transférer fidèlement le sens d'un langage source vers un langage cible sans trahison conceptuelle."
  },
  {
    verb: "Expliciter",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Exprimer clairement et formellement ce qui était sous-entendu, implicite ou resté à l'état d'intuition",
      "Répéter exactement la phrase initiale sans aucun apport de clarification",
      "Résumer le texte en masquant les détails techniques délicats",
      "Insérer des digressions personnelles pour enrichir le sujet"
    ],
    correctIndex: 0,
    explanation: "Expliciter consiste à dévoiler et formuler en termes limpides ce que l'énoncé laissait implicite."
  },
  {
    verb: "Ordonner",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Disposer des éléments selon une progression logique, chronologique ou hiérarchique déterminée",
      "Mélanger aléatoirement les propositions pour tester l'attention du lecteur",
      "Regrouper les termes uniquement en fonction de leur longueur en lettres",
      "Conserver strictement l'ordre d'apparition sans poser de critère de tri"
    ],
    correctIndex: 0,
    explanation: "Ordonner exige d'agencer les données selon une suite structurée continue (temporelle, causale ou déductive)."
  }
];

export const VERBES_BANK_TIER_3 = [
  {
    verb: "Comparer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Confronter méthodiquement deux objets ou thèses pour dégager à la fois leurs convergences ET divergences",
      "Décrire successivement le premier élément puis le second sans croiser les critères d'analyse",
      "Désigner le meilleur des deux éléments en émettant une préférence subjective immédiate",
      "Relever exclusivement les points de désaccord en occultant tout terrain d'entente"
    ],
    correctIndex: 0,
    explanation: "Comparer impose une analyse croisée bilatérale : pointer les points de convergence ET les dissemblances fondamentales."
  },
  {
    verb: "Analyser",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Décomposer un tout complexe en ses éléments constitutifs pour comprendre leur agencement et leurs interactions",
      "Faire une lecture rapide superficielle et formuler une appréciation globale en une phrase",
      "Recopier l'introduction et la conclusion pour en extraire le message général",
      "Condenser le texte de manière linéaire sans interroger les ressorts de son argumentation"
    ],
    correctIndex: 0,
    explanation: "Analyser consiste à disséquer la structure interne d'une réalité pour en comprendre les rouages invisibles."
  },
  {
    verb: "Synthétiser",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Rassembler et restructurer les idées maîtresses de sources diverses en une production unifiée et cohérente",
      "Résumer un document unique en suivant pas à pas l'ordre linéaire des paragraphes d'origine",
      "Compiler bout à bout des extraits choisis sans articulation conceptuelle personnelle",
      "Rédiger une dissertation littéraire sans contrainte de concision ni d'objectivité"
    ],
    correctIndex: 0,
    explanation: "Synthétiser est l'art de refondre des éléments hétérogènes en une vision globale, hiérarchisée et autonome."
  },
  {
    verb: "Justifier",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Apporter les arguments rationnels, références textuelles ou preuves empiriques qui légitiment une affirmation",
      "Répéter sa réponse avec plus d'insistance stylistique pour convaincre son correcteur",
      "Formuler une affirmation péremptoire en soutenant qu'elle relève de l'évidence absolue",
      "Paraphraser l'énoncé de la question en modifiant simplement quelques synonymes"
    ],
    correctIndex: 0,
    explanation: "Justifier interdit l'affirmation gratuite : chaque allégation doit être adossée à une démonstration probante."
  },
  {
    verb: "Argumenter",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Développer une suite méthodique de prémisses, preuves et conclusions logiques visant à emporter l'adhésion rationnelle",
      "Imposer son opinion par un ton assertif et l'accumulation d'exclamations",
      "Exprimer une conviction personnelle intime fondée sur son ressenti émotionnel",
      "Citer une suite de faits bruts sans jamais expliciter le lien logique qui les relie"
    ],
    correctIndex: 0,
    explanation: "Argumenter exige d'agencer des preuves solides au sein d'une rhétorique rigoureuse pour emporter l'adhésion de la raison."
  },
  {
    verb: "Expliquer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Faire comprendre un phénomène en détaillant son fonctionnement, ses causes profondes et ses mécanismes déterministes",
      "Se borner à décrire l'aspect visuel extérieur ou le déroulement chronologique superficiel",
      "Formuler une règle prescriptive ou des conseils pratiques sur ce qu'il conviendrait de faire",
      "Traduire le vocabulaire de la consigne dans un registre familier sans analyser la causalité"
    ],
    correctIndex: 0,
    explanation: "Expliquer va au-delà de la description : il dévoile la causalité invisible et la chaîne déterministe d'un phénomène."
  },
  {
    verb: "Évaluer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Porter un jugement raisonné sur la valeur, l'efficience ou la pertinence d'un travail à l'aide de critères explicites",
      "Attribuer une appréciation impulsive et arbitraire sans grille de référence",
      "Approuver par complaisance l'ensemble de la proposition pour éviter tout conflit",
      "Rejeter un dispositif sur la base d'un détail secondaire sans considérer l'ensemble"
    ],
    correctIndex: 0,
    explanation: "Évaluer requiert de confronter une réalité à une grille de standards ou d'objectifs pour en apprécier la pertinence."
  },
  {
    verb: "Critiquer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Examiner avec méthode les forces, limites, postulats et biais d'une démarche d'après des critères fondés",
      "Dénigrer systématiquement une thèse par hostilité ou parti pris idéologique",
      "Accepter passivement l'autorité de l'auteur en s'interdisant toute mise en perspective",
      "Se contenter de relever les coquilles typographiques et la mise en page du document"
    ],
    correctIndex: 0,
    explanation: "Au sens noble académique, critiquer n'est pas dénigrer : c'est peser le pour et le contre avec rigueur épistémique."
  },
  {
    verb: "Déduire",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Tirer logiquement une conséquence nécessaire et spécifique à partir de lois générales ou de prémisses vérifiées",
      "Généraliser abusivement à tout un domaine une conclusion tirée d'une seule observation isolée",
      "Deviner par intuition spontanée le résultat attendu sans pouvoir retracer le calcul",
      "Attendre la fin de l'épreuve pour demander la réponse officielle au professeur"
    ],
    correctIndex: 0,
    explanation: "La déduction est le mouvement rigoureux qui va du général ou de la règle vers l'application particulière nécessaire."
  },
  {
    verb: "Induire",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Formuler une loi générale ou un principe théorique à partir de l'observation répétée de faits particuliers",
      "Appliquer machinalement une formule mathématique préétablie à un cas particulier",
      "Inventer une hypothèse sans aucun ancrage dans l'observation des faits",
      "Réfuter une théorie sans apporter de contre-exemple empirique tangible"
    ],
    correctIndex: 0,
    explanation: "L'induction est le processus qui s'élève de l'observation empirique de cas particuliers vers la loi générale."
  },
  {
    verb: "Démontrer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Établir la vérité irréfutable d'une proposition par un enchaînement déductif contraignant selon des règles formelles",
      "Convaincre son auditoire en faisant appel à ses émotions et à son empathie",
      "Multiplier les exemples isolés pour donner l'impression que la règle est universelle",
      "Affirmer son accord personnel avec l'opinion majoritaire du groupe"
    ],
    correctIndex: 0,
    explanation: "Démontrer consiste à prouver la nécessité logique d'une conclusion par un raisonnement exempt de faille."
  },
  {
    verb: "Confronter",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Mettre face à face deux théories ou points de vue contradictoires pour éprouver leur robustesse et leurs limites",
      "Éviter délibérément de mentionner la thèse adverse pour préserver la paix académique",
      "Déclarer arbitrairement qu'une thèse est nulle sans examiner ses arguments",
      "Fusionner artificiellement deux thèses opposées en niant leurs contradictions réelles"
    ],
    correctIndex: 0,
    explanation: "Confronter consiste à orchestrer le débat contradictoire entre deux positions pour tester leur robustesse respective."
  }
];

/**
 * Générateur de 10 questions aléatoires progressives pour une partie unique de Millionnaire :
 * - 3 questions tirées au hasard dans le Palier 1 (Paliers 6, 12, 18 ECTS)
 * - 4 questions tirées au hasard dans le Palier 2 (Paliers 24, 30, 36, 42 ECTS) - Paliers Garantis à Q4 (24) et Q7 (42)
 * - 3 questions tirées au hasard dans le Palier 3 (Paliers 48, 54, 60 ECTS)
 */
export function generateMillionnaireSessionQuestions() {
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const tier1Selection = shuffle(VERBES_BANK_TIER_1).slice(0, 3);
  const tier2Selection = shuffle(VERBES_BANK_TIER_2).slice(0, 4);
  const tier3Selection = shuffle(VERBES_BANK_TIER_3).slice(0, 3);

  const rewards = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60];

  const all = [...tier1Selection, ...tier2Selection, ...tier3Selection];

  return all.map((item, idx) => {
    // Mélange des 4 options pour chaque question afin que la bonne réponse ne soit pas toujours en premier
    const originalOptions = item.options.map((opt, i) => ({
      text: opt,
      isCorrect: i === item.correctIndex
    }));
    const shuffledOptions = shuffle(originalOptions);
    const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);

    return {
      id: `millionnaire_q_${idx + 1}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      verb: item.verb,
      difficulty: item.difficulty,
      tier: item.tier,
      isSafetyTier: idx === 3 || idx === 6, // Paliers garantis : Q4 (24 ECTS) & Q7 (42 ECTS)
      rewardEcts: rewards[idx],
      options: shuffledOptions.map(o => o.text),
      correctIndex: newCorrectIndex,
      explanation: item.explanation
    };
  });
}
