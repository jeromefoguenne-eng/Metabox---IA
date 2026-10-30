// Banque étendue de questions pour « Qui veut gagner des Crédits ? »
// Référentiel des verbes de consigne académiques FWB & Haute École Charlemagne
// 3 Paliers d'exigence :
// - Palier 1 (Questions 1 à 3 : 6, 12, 18 ECTS) : Tâches mécaniques directes
// - Palier 2 (Questions 4 à 7 : 24, 30, 36, 42 ECTS) : Traitement intermédiaire & structuration
// - Palier 3 (Questions 8 à 10 : 48, 54, 60 ECTS) : Haute exigence conceptuelle & esprit critique

export const VERBES_BANK_TIER_1 = [
  {
    verb: "Souligner",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer un trait continu sous le mot ou la proposition désignée",
      "Tracer un cercle ou un ovale fermé autour de l'élément",
      "Séparer les mots par des barres obliques",
      "Recopier le mot en lettres majuscules d'imprimerie"
    ],
    correctIndex: 0,
    explanation: "Souligner signifie tracer une ligne continue directement sous les termes ciblés."
  },
  {
    verb: "Cocher",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Assembler plusieurs feuillets d'examen",
      "Placer un petit trait ou une croix (✓ ou ✗) dans une case prédéfinie",
      "Effacer au correcteur blanc les mauvaises réponses",
      "Numéroter les paragraphes dans la marge de droite"
    ],
    correctIndex: 1,
    explanation: "Cocher impose de marquer une case à l'aide d'un signe distinctif sans déborder."
  },
  {
    verb: "Biffer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Barrer d'un trait net pour annuler ou éliminer un élément erroné",
      "Gommer soigneusement pour faire disparaître l'encre",
      "Surligner au feutre jaune fluorescent",
      "Mettre le terme entre parenthèses sans le rayer"
    ],
    correctIndex: 0,
    explanation: "Biffer consiste à tracer un trait sur un mot ou une phrase pour l'annuler formellement."
  },
  {
    verb: "Entourer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer une ligne fermée (cercle ou boucle) englobant l'élément cible",
      "Tracer un trait horizontal sous le groupe de mots",
      "Placer deux astérisques de part et d'autre du texte",
      "Encadrer dans un rectangle tracé à la règle"
    ],
    correctIndex: 0,
    explanation: "Entourer exige de cercler l'élément sans couper les lettres."
  },
  {
    verb: "Encadrer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer un cadre rectangulaire ou carré autour de la réponse",
      "Colorier entièrement l'arrière-plan de la phrase",
      "Tracer une ligne ondulée sous la formule mathématique",
      "Placer la réponse tout en haut de la page"
    ],
    correctIndex: 0,
    explanation: "Encadrer consiste à tracer les quatre côtés d'un rectangle entourant la formule ou le mot."
  },
  {
    verb: "Surligner",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Appliquer une couleur transparente vive par-dessus le texte pour le mettre en valeur",
      "Écrire en caractères gras avec un stylo plume",
      "Tracer une flèche dans la marge pointant vers le mot",
      "Effacer les mots inutiles au blanco"
    ],
    correctIndex: 0,
    explanation: "Surligner consiste à rendre visible une information par transparence colorée sans masquer le texte."
  },
  {
    verb: "Numéroter",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Attribuer un ordre chiffré séquentiel (1, 2, 3...) aux différents éléments",
      "Compter le nombre total de mots du texte",
      "Calculer la moyenne arithmétique des notes",
      "Indiquer l'heure exacte de remise de la copie"
    ],
    correctIndex: 0,
    explanation: "Numéroter impose d'affecter un numéro d'ordre logique ou chronologique à chaque item."
  },
  {
    verb: "Recopier",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Reproduire fidèlement et à l'identique un texte ou une citation sans altération",
      "Résumer le texte avec ses propres mots",
      "Traduire le texte dans un registre plus familier",
      "Corriger les fautes de l'auteur original"
    ],
    correctIndex: 0,
    explanation: "Recopier exige une transcription littérale exacte sans aucune modification."
  },
  {
    verb: "Compléter",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Insérer l'information ou le terme manquant dans un texte à trous ou un schéma",
      "Rédiger un paragraphe entièrement nouveau de 20 lignes",
      "Choisir une réponse au hasard parmi des distracteurs",
      "Signer son nom au bas du document d'évaluation"
    ],
    correctIndex: 0,
    explanation: "Compléter implique d'ajouter uniquement les pièces manquantes pour rendre l'ensemble cohérent."
  },
  {
    verb: "Lister",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Écrire une suite d'éléments les uns en dessous des autres sous forme d'énumération",
      "Rédiger une dissertation littéraire continue sans retours à la ligne",
      "Donner son avis argumenté sur le sujet",
      "Tracer un graphique en courbes statistiques"
    ],
    correctIndex: 0,
    explanation: "Lister impose une présentation aérée sous forme de tirets ou de puces verticales."
  },
  {
    verb: "Pointer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Désigner ou marquer précisément un élément d'une flèche ou d'un symbole",
      "Écrire un poème en rimes croisées",
      "Contredire le professeur pendant l'épreuve",
      "Effacer une erreur d'un coup de gomme"
    ],
    correctIndex: 0,
    explanation: "Pointer consiste à cibler visuellement et de manière univoque un endroit précis du document."
  },
  {
    verb: "Rayer",
    difficulty: "Facile",
    tier: 1,
    options: [
      "Tracer une ligne continue sur un mot pour signifier son rejet ou son erreur",
      "Dessiner des rayures décoratives dans la marge",
      "Mettre le texte en italique",
      "Agrafer deux feuilles ensemble"
    ],
    correctIndex: 0,
    explanation: "Rayer consiste à neutraliser un mot ou une phrase en le biffant d'un trait horizontal."
  }
];

export const VERBES_BANK_TIER_2 = [
  {
    verb: "Relier",
    difficulty: "Intermédiaire",
    tier: 2,
    isSafetyTier: true, // PALIER DE SÉCURITÉ GARANTI !
    options: [
      "Tracer un trait ou une flèche matérialisant la correspondance exacte entre deux éléments",
      "Placer deux feuilles côte à côte sans les attacher",
      "Lire une seconde fois la consigne à voix haute",
      "Fusionner deux paragraphes en un seul bloc compact"
    ],
    correctIndex: 0,
    explanation: "Relier exige d'établir un lien visuel direct (flèche ou segment) entre les deux correspondances."
  },
  {
    verb: "Citer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Nommer ou reproduire textuellement un passage, auteur ou donnée sans le paraphraser",
      "Développer une longue explication philosophique de 3 pages",
      "Donner son opinion personnelle sur la moralité de l'auteur",
      "Traduire le terme technique en anglais des affaires"
    ],
    correctIndex: 0,
    explanation: "Citer exige de rapporter fidèlement l'énoncé ou la source (souvent entre guillemets) sans digression."
  },
  {
    verb: "Énumérer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Nommer successivement et de façon exhaustive les composantes d'un ensemble",
      "Rédiger un paragraphe narratif sans alinéa",
      "Effectuer un calcul intégral complexe",
      "Donner un seul exemple anecdotique"
    ],
    correctIndex: 0,
    explanation: "Énumérer consiste à passer en revue l'un après l'autre tous les éléments d'une liste finie."
  },
  {
    verb: "Classer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Distribuer des éléments dans des catégories ordonnées selon un critère rationnel précis",
      "Ranger ses stylos dans sa trousse avant la fin du cours",
      "Recopier sa copie au propre sans ratures",
      "Mettre toutes les dates en gras dans le texte"
    ],
    correctIndex: 0,
    explanation: "Classer implique d'appliquer un critère taxonomique logique pour regrouper ou hiérarchiser."
  },
  {
    verb: "Décrire",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Détailler les caractéristiques observables, la structure et l'état d'un objet ou phénomène",
      "Démontrer mathématiquement le pourquoi d'une réaction chimique",
      "Prendre position pour ou contre une thèse politique",
      "Résumer un livre entier en un seul mot"
    ],
    correctIndex: 0,
    explanation: "Décrire consiste à faire un état des lieux minutieux de 'comment c'est fait' sans spéculer sur les causes profondes."
  },
  {
    verb: "Illustrer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Appuyer et éclairer une affirmation abstraite par un exemple concret, une donnée ou un cas réel",
      "Faire obligatoirement un dessin artistique aux crayons de couleur",
      "Répéter la consigne deux fois de suite",
      "Souligner tous les adjectifs qualificatifs du texte"
    ],
    correctIndex: 0,
    explanation: "Illustrer signifie rendre tangible une notion théorique au moyen d'un cas pratique ou d'un exemple probant."
  },
  {
    verb: "Identifier",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Reconnaître et désigner avec précision un élément précis parmi plusieurs d'après ses critères spécifiques",
      "Inventer un nouveau concept théorique",
      "Donner son propre nom sur le document",
      "Calculer la racine carrée d'un nombre"
    ],
    correctIndex: 0,
    explanation: "Identifier exige de repérer sans ambiguïté la nature ou la fonction exacte de l'objet d'étude."
  },
  {
    verb: "Résumer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Restituer de manière condensée et neutre la substantifique moelle d'un texte sans avis personnel",
      "Recopier le texte en supprimant seulement un paragraphe sur deux",
      "Rédiger une critique cinglante de l'argumentation de l'auteur",
      "Doubler la longueur du texte initial avec des métaphores"
    ],
    correctIndex: 0,
    explanation: "Résumer exige de respecter la pensée de l'auteur en éliminant les détails superflus tout en restant concis."
  },
  {
    verb: "Schématiser",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Représenter de manière simplifiée et synthétique les relations clés d'un système (flèches, blocs, flux)",
      "Écrire un roman de fiction sur le sujet",
      "Dessiner un portrait réaliste d'une personne",
      "Recopier un dictionnaire médical"
    ],
    correctIndex: 0,
    explanation: "Schématiser consiste à traduire visuellement la logique fonctionnelle d'un concept en dépouillant les détails secondaires."
  },
  {
    verb: "Reformuler",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Exprimer la même idée fondamentale avec d'autres termes plus clairs sans en dénaturer le sens",
      "Traduire mot à mot avec un dictionnaire bilingue",
      "Changer complètement le sens de la phrase originale",
      "Mettre la phrase à la voix passive sans réfléchir"
    ],
    correctIndex: 0,
    explanation: "Reformuler teste la compréhension véritable : dire la même vérité avec un vocabulaire personnel et rigoureux."
  },
  {
    verb: "Distinguer",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Faire ressortir nettement la différence spécifique qui sépare deux notions facilement confondues",
      "Traiter les deux notions comme parfaitement identiques",
      "Attribuer une médaille d'honneur à un étudiant",
      "Supprimer les deux termes du syllabus"
    ],
    correctIndex: 0,
    explanation: "Distinguer exige d'isoler la ligne de démarcation conceptuelle qui empêche toute confusion sémantique."
  },
  {
    verb: "Catégoriser",
    difficulty: "Intermédiaire",
    tier: 2,
    options: [
      "Regrouper des données ou concepts dans des classes logiques selon leurs propriétés communes",
      "Écrire en caractères gothiques",
      "Attribuer une note chiffrée de 0 à 20",
      "Mélanger tous les arguments sans structure"
    ],
    correctIndex: 0,
    explanation: "Catégoriser consiste à ordonner la réalité dans des tiroirs conceptuels étanches et pertinents."
  }
];

export const VERBES_BANK_TIER_3 = [
  {
    verb: "Définir",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Énoncer avec rigueur et exactitude la signification essentielle et les limites d'un concept",
      "Donner son sentiment intime sur un mot sans référence théorique",
      "Terminer l'examen le premier en rendant sa copie en avance",
      "Citer un exemple anecdotique sans expliquer le principe"
    ],
    correctIndex: 0,
    explanation: "Définir exige d'isoler le genre prochain et la différence spécifique d'un concept pour le circonscrire sans faille."
  },
  {
    verb: "Comparer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Mettre en regard deux objets ou théories en dégageant obligatoirement leurs ressemblances ET leurs divergences",
      "Choisir son camp et insulter les partisans de l'autre théorie",
      "Résumer la première théorie sans jamais mentionner la seconde",
      "Classer par ordre purement chronologique d'invention"
    ],
    correctIndex: 0,
    explanation: "Comparer impose une analyse croisée bilatérale : pointer les points de convergence ET les dissemblances fondamentales."
  },
  {
    verb: "Analyser",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Décomposer un ensemble complexe en ses éléments constituants pour en élucider les interactions et la logique interne",
      "Donner un rapide avis superficiel en 2 lignes",
      "Recopier l'introduction et la conclusion du texte",
      "Compter le nombre de voyelles et de consonnes d'un texte"
    ],
    correctIndex: 0,
    explanation: "Analyser consiste à disséquer la mécanique d'une pensée pour en comprendre les rouages invisibles."
  },
  {
    verb: "Synthétiser",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Rassembler divers éléments d'information hétérogènes en un tout cohérent, structuré et unifié",
      "Écrire une liste d'idées en vrac sans aucun lien logique",
      "Séparer définitivement les arguments en les isolant",
      "Traduire un texte en langage SMS"
    ],
    correctIndex: 0,
    explanation: "Synthétiser est le mouvement inverse de l'analyse : c'est l'art de recomposer une vue globale harmonieuse et limpide."
  },
  {
    verb: "Justifier",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Apporter des preuves rationnelles, arguments logiques ou données tangibles qui démontrent le bien-fondé de la réponse",
      "Répéter son affirmation avec plus de points d'exclamation",
      "Dire que 'c'est évident' sans rien expliquer d'autre",
      "Affirmer que c'est une intuition personnelle inexplicable"
    ],
    correctIndex: 0,
    explanation: "Justifier interdit l'affirmation gratuite : chaque allégation doit être adossée à une démonstration irréfutable."
  },
  {
    verb: "Argumenter",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Construire un raisonnement méthodique agencé de prémisses, de liens logiques et de conclusions pour convaincre rationnellement",
      "Hauser le ton pour intimider son interlocuteur",
      "Affirmer son opinion sans jamais fournir de preuve",
      "Recopier la thèse d'autrui sans la comprendre"
    ],
    correctIndex: 0,
    explanation: "Argumenter exige d'agencer des preuves solides au sein d'une rhétorique rigoureuse pour emporter l'adhésion de la raison."
  },
  {
    verb: "Expliquer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Faire comprendre les causes, les mécanismes et le fonctionnement sous-jacent d'un phénomène (le 'POURQUOI' et le 'COMMENT')",
      "Décrire simplement l'apparence visuelle extérieure sans rien analyser",
      "Se contenter de dire que c'est le hasard de la nature",
      "Résumer le texte en trois mots vagues"
    ],
    correctIndex: 0,
    explanation: "Expliquer va au-delà de la description : il dévoile la causalité invisible et la chaîne déterministe d'un phénomène."
  },
  {
    verb: "Évaluer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Porter un jugement raisonné et critique sur la valeur, la portée ou l'efficacité d'un dispositif à l'aide de critères explicites",
      "Attribuer une note au hasard sans grille critériée",
      "Féliciter tout le monde sans lire le travail",
      "Rejeter un travail simplement parce qu'on n'aime pas la mise en page"
    ],
    correctIndex: 0,
    explanation: "Évaluer requiert de confronter une réalité à une grille de standards ou d'objectifs pour en apprécier la pertinence."
  },
  {
    verb: "Critiquer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Examiner de manière objective les forces, les faiblesses, les postulats et les limites d'une thèse ou méthodologie",
      "Dénigrer méchamment et insulter l'auteur d'une étude",
      "Accepter béatement tout ce qui est écrit sur internet",
      "Refuser de lire un texte sous prétexte qu'il est trop difficile"
    ],
    correctIndex: 0,
    explanation: "Au sens noble académique, critiquer n'est pas dénigrer : c'est peser le pour et le contre avec rigueur épistémique."
  },
  {
    verb: "Déduire",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Tirer logiquement une conséquence nécessaire et irréfutable à partir de prémisses ou de lois générales vérifiées",
      "Deviner au pifomètre ce qui pourrait arriver",
      "Interroger un astrologue sur l'avenir de l'école",
      "Inventer une nouvelle loi physique"
    ],
    correctIndex: 0,
    explanation: "Déduire procède du général vers le particulier selon les lois strictes du syllogisme et de la logique pure."
  },
  {
    verb: "Démontrer",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Établir la vérité incontestable d'une proposition par un enchaînement déductif sans faille appuyé sur des axiomes",
      "Répéter dix fois que l'on a raison jusqu'à ce que l'autre cède",
      "Demander à l'auditoire de voter à main levée",
      "Montrer une photo sans légende"
    ],
    correctIndex: 0,
    explanation: "Démontrer ne laisse aucune place au doute : le raisonnement lie les vérités de manière mathématique et nécessaire."
  },
  {
    verb: "Confronter",
    difficulty: "Haute Exigence",
    tier: 3,
    options: [
      "Mettre face à face deux théories divergentes ou deux témoignages pour faire éclater leurs contradictions et leurs complémentarités",
      "Organiser un combat de boxe entre deux chercheurs",
      "Faire semblant que tout le monde est d'accord",
      "Ignorer les arguments de la partie adverse"
    ],
    correctIndex: 0,
    explanation: "Confronter consiste à orchestrer le débat contradictoire entre deux positions pour tester leur robustesse respective."
  }
];

/**
 * Générateur de 10 questions aléatoires progressives pour une partie unique de Millionnaire :
 * - 3 questions tirées au hasard dans le Palier 1 (Paliers 6, 12, 18 ECTS)
 * - 4 questions tirées au hasard dans le Palier 2 (Paliers 24, 30, 36, 42 ECTS)
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
      id: `millionnaire_q_${idx + 1}_${Date.now()}`,
      verb: item.verb,
      difficulty: item.difficulty,
      tier: item.tier,
      isSafetyTier: idx === 3, // Palier 24 crédits garanti
      rewardEcts: rewards[idx],
      options: shuffledOptions.map(o => o.text),
      correctIndex: newCorrectIndex,
      explanation: item.explanation
    };
  });
}
