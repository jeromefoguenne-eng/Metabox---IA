import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  Camera, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Trophy, 
  ArrowRight, 
  RotateCcw, 
  ZoomIn, 
  FileText, 
  Cpu, 
  Mic, 
  Activity, 
  Radio, 
  Terminal as TermIcon, 
  Lock, 
  Unlock,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

// ============================================================================
// TEXTURES PROCÉDURALES POUR LE LABO (Parquet composite, liège, circuits, métal)
// ============================================================================

function createFloorTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Fond gris ardoise technique
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 512);

  // Dalles modulaires 128x128
  const tileSize = 128;
  for (let y = 0; y < 512; y += tileSize) {
    for (let x = 0; x < 512; x += tileSize) {
      const shade = Math.sin(x * 0.05 + y * 0.05) * 8;
      ctx.fillStyle = `rgb(${18 + shade}, ${26 + shade}, ${44 + shade})`;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Micro-texture métallique
      ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 8 + i * 28, y + 8, 14, tileSize - 16);
      }
    }
  }

  // Lignes de joints luminescents cyan discrets
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  for (let i = 0; i <= 512; i += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createCorkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const s = Math.random() * 3 + 1;
    const shade = Math.floor(Math.random() * 60) - 30;
    ctx.fillStyle = `rgba(${180 + shade}, ${100 + shade}, ${20 + shade}, 0.6)`;
    ctx.fillRect(x, y, s, s);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createScreenGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 256; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }
  for (let y = 0; y < 256; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
  }

  // Scanlines horizontales
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 1.5);
  }

  // Texte cyber vert fluo
  ctx.fillStyle = '#34d399';
  ctx.font = '10px monospace';
  ctx.fillText('FORENSIC_DEEPFAKE_SCAN', 14, 28);
  ctx.fillText('STATUS: ANALYZING_ARTEFACTS', 14, 46);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('RVC_VOICE_SPECTRUM: 11.2 kHz', 14, 64);
  ctx.fillText('CONFIDENCE: 98.4%', 14, 82);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ============================================================================
// DÉFINITION DES 10 ÉNIGMES DE FACT-CHECKING IA
// ============================================================================

export const FACT_CHECK_ENIGMAS = [
  {
    id: 'enigma_1',
    station: 'terminal',
    title: "1. L'Hallucination du Faux DOI & de la Revue Fantôme",
    category: "Hallucination Bibliographique",
    stationName: "Terminal de Requêtes IA",
    difficulty: "Initié",
    xp: 60,
    clue: "Inspectez la citation produite par ChatGPT dans le mémoire de fin d'études.",
    context: `Dans un mémoire déposé au SAR, l'étudiant cite l'affirmation suivante générée par une IA :
« D'après l'étude phare de Dr. Alistair Vance (2024), l'apprentissage sans smartphone réduit la plasticité synaptique de 42%, Journal of Cognitive AI & Neuro-Learning, Vol. 14, DOI: 10.1016/j.jcna.2024.9912. »`,
    evidenceType: "document",
    documentSnippet: {
      type: "doi_verification",
      doi: "10.1016/j.jcna.2024.9912",
      crossrefStatus: "404 NOT FOUND",
      scopusIndex: "NON INDEXÉ",
      authorStatus: "AUCUNE PUBLICATION ACADÉMIQUE RÉPERTORIÉE"
    },
    question: "Quelle méthode scientifique rigoureuse prouve irréfutablement que cette source est une hallucination pure ?",
    options: [
      { id: 'a', text: "Le DOI a été vérifié sur doi.org et Crossref : le préfixe n'existe pas, la revue est fictive et l'auteur n'a aucune affiliation académique réelle.", isCorrect: true },
      { id: 'b', text: "L'auteur utilise un prénom anglais, donc l'étude ne peut pas s'appliquer au système universitaire belge francophone.", isCorrect: false },
      { id: 'c', text: "Le chiffre de 42% est trop précis, une étude scientifique donne toujours des nombres pairs arrondis.", isCorrect: false }
    ],
    feedbackSuccess: "Brillant réflexe de fact-checking ! Les LLM inventent des DOI et des revues qui ont une consonance très académique mais sont inexistants sur Crossref et PubMed.",
    takeaway: "Règle d'or : Ne JAMAIS citer une référence bibliographique fournie par une IA sans l'ouvrir physiquement via son DOI sur une base de données certifiée (Scopus, Google Scholar, DOAJ)."
  },
  {
    id: 'enigma_2',
    station: 'microscope',
    title: "2. Les Micro-Artefacts du Portrait Deepfake",
    category: "Forensic Visuel & Midjourney",
    stationName: "Station Spectrale & Microscope",
    difficulty: "Confirmé",
    xp: 75,
    clue: "Examinez la photo compromettante du Doyen à la loupe spectrale.",
    context: `Une photo virale prétendant montrer le Doyen en train de signer un accord secret avec des démarcheurs commerciaux est diffusée sur les réseaux étudiants du campus.`,
    evidenceType: "image_forensic",
    anomalies: [
      { name: "Main gauche sur la table", detail: "Fusion de 6 phalanges avec ongles manquants et peau plastifiée." },
      { name: "Pupilles et Reflets cornéens", detail: "L'œil gauche a un reflet carré blanc tandis que l'œil droit a un reflet triangulaire bleu (lumières incohérentes)." },
      { name: "Boutons de la veste", detail: "Les boutonnières sont asymétriques et se dissolvent dans le tissu de la cravate." }
    ],
    question: "Quel faisceau d'indices biométriques confirme que l'image est un deepfake généré par IA ?",
    options: [
      { id: 'a', text: "La photo est en noir et blanc, or le campus Rivageois n'a que des appareils numériques couleur.", isCorrect: false },
      { id: 'b', text: "Incohérence physique des reflets oculaires (sources de lumière opposées dans chaque pupille) et fusion anormale des phalanges.", isCorrect: true },
      { id: 'c', text: "Le Doyen sourit trop poliment, ce qui est contraire à son habitude lors des conseils de direction.", isCorrect: false }
    ],
    feedbackSuccess: "Excellent diagnostic médico-légal numérique ! Les modèles de diffusion (Midjourney, DALL-E) peinent à maintenir la cohérence de l'optique cornéenne et l'anatomie exacte des extrémités.",
    takeaway: "Règle d'or : Zoomez systématiquement sur les pupilles, les dents, les oreilles et les mains pour démasquer les incohérences de géométrie optique."
  },
  {
    id: 'enigma_3',
    station: 'audio_console',
    title: "3. Le Clonage Vocal & Vocodeur RVC",
    category: "Audio Deepfake & Biométrie",
    stationName: "Console Audio & Spectrogramme",
    difficulty: "Avancé",
    xp: 85,
    clue: "Analysez le spectre fréquentiel du message vocal annonçant l'annulation des cours.",
    context: `Un fichier vocal de 12 secondes circule sur les groupes d'étudiants WhatsApp : la voix de la directrice y annonce que la session d'examens est annulée suite à un bug informatique.`,
    evidenceType: "audio_spectrum",
    spectrumDetails: {
      cutoffFrequency: "11 025 Hz (Coupure abrupte du vocodeur HiFi-GAN / RVC)",
      breathingArtifacts: "0 inspiration détectée en 12 secondes de parole soutenue",
      prosodyPitch: "Modulation de fréquence mécanique sans micro-inflexions physiologiques"
    },
    question: "Quel artefact acoustique trahit formellement une voix clonée par modèle RVC/TTS ?",
    options: [
      { id: 'a', text: "Coupure brutale des hautes fréquences à ~11 kHz, absence totale de respirations physiologiques et timbre métallique régulier.", isCorrect: true },
      { id: 'b', text: "Le volume de la voix est trop fort pour un smartphone moderne.", isCorrect: false },
      { id: 'c', text: "La voix utilise un accent wallon alors que la directrice parle sans aucun accent régional.", isCorrect: false }
    ],
    feedbackSuccess: "Spectrographe validé ! Les clones vocaux rapides basés sur RVC compriment le signal et omettent les bruits physiologiques de respiration humaine.",
    takeaway: "Règle d'or : Toute consigne institutionnelle critique reçue par message vocal doit être corroborée par un canal écrit officiel et vérifiée sur le portail Moodle."
  },
  {
    id: 'enigma_4',
    station: 'corkboard',
    title: "4. L'Anachronisme Historique d'une Citation Virale",
    category: "Critique Historique des Sources",
    stationName: "Tableau d'Indices & Liens",
    difficulty: "Initié",
    xp: 60,
    clue: "Lisez attentivement la citation attribuée à un savant illustre sur le tableau d'enquête.",
    context: `Une affiche partagée sur les réseaux académiques proclame :
« "L'intelligence artificielle sera le poison mortel de la méthode scientifique si l'Université oublie d'enseigner le libre arbitre." — Albert Einstein, Princeton, 1948. »`,
    evidenceType: "historical_timeline",
    dates: {
      citationClaim: "Albert Einstein, 1948",
      einsteinDeath: "18 avril 1955",
      aiTermBirth: "Été 1956 (Conférence de Dartmouth par John McCarthy & Marvin Minsky)"
    },
    question: "Pourquoi cette citation est-elle historiquement et matériellement impossible ?",
    options: [
      { id: 'a', text: "Einstein n'écrivait qu'en allemand et refusait de publier en anglais aux États-Unis.", isCorrect: false },
      { id: 'b', text: "L'expression 'Intelligence Artificielle' n'a été forgée qu'en 1956 à Dartmouth, soit un an après la disparition d'Einstein.", isCorrect: true },
      { id: 'c', text: "Einstein était mathématicien et ne s'est jamais intéressé aux technologies éducatives.", isCorrect: false }
    ],
    feedbackSuccess: "Analyse historique parfaite ! L'anachronisme conceptuel est une arme absolue de fact-checking : un terme ne peut précéder sa création historique.",
    takeaway: "Règle d'or : Vérifiez toujours la date de première occurrence d'un concept clé avant d'attribuer une formule choc à une figure historique."
  },
  {
    id: 'enigma_5',
    station: 'stat_holo',
    title: "5. Le Graphique Tronqué des 98% d'Échec",
    category: "Manipulation de Données & Dataviz",
    stationName: "Table Statistique Holographique",
    difficulty: "Confirmé",
    xp: 70,
    clue: "Inspectez les axes de la visualisation statistique 3D projetée sur la table.",
    context: `Un rapport d'un pseudo-observatoire en ligne présente un graphique dramatique montrant une chute vertigineuse de la réussite universitaire imputée aux étudiants utilisant l'IA.`,
    evidenceType: "chart_inspector",
    chartData: {
      yAxisMin: "94.0%",
      yAxisMax: "95.5%",
      realDrop: "-0.4% (variation statistique normale d'une année sur l'autre)",
      sampleSize: "N = 14 étudiants sondés sur un forum privé"
    },
    question: "Quelle double manipulation graphique crée une impression trompeuse de catastrophe académique ?",
    options: [
      { id: 'a', text: "Les barres sont coloriées en rouge au lieu d'être en vert ou en bleu apaisant.", isCorrect: false },
      { id: 'b', text: "Axe Y tronqué commençant à 94% (zoom artificiel démesuré) et échantillon minuscule non représentatif (N=14).", isCorrect: true },
      { id: 'c', text: "Le graphique est tracé en 3D au lieu d'être un diagramme circulaire en camembert.", isCorrect: false }
    ],
    feedbackSuccess: "Biais statistique déjoué ! Tronquer l'axe des ordonnées pour dramatiser une variation insignifiante est le procédé favori des marchands de panique.",
    takeaway: "Règle d'or : Regardez toujours le zéro de l'axe vertical, l'intervalle de confiance et la taille réelle de l'échantillon (N) avant de croire un graphique."
  },
  {
    id: 'enigma_6',
    station: 'server_rack',
    title: "6. L'Attaque des Bots & l'Astroturfing Réseau",
    category: "Détection de Fermes de Bots",
    stationName: "Serveur Rack & Analyseur Réseau",
    difficulty: "Avancé",
    xp: 80,
    clue: "Analysez le graphe de propagation des messages sur le serveur du laboratoire.",
    context: `En l'espace de 4 minutes, 450 comptes Twitter/X ont publié le message :
« Scandale à la Haute École : le serveur Moodle a vendu toutes nos données à la Chine ! Bloquez les campus ! »`,
    evidenceType: "network_logs",
    botMetrics: {
      deltaPublishTime: "120 millisecondes d'intervalle entre chaque tweet (cadence inhumaine)",
      accountCreationDates: "Comptes tous créés le même jour avec noms type @user_8492049",
      profilePictures: "Générées par StyleGAN (yeux systématiquement centrés aux mêmes coordonnées X=128, Y=128)"
    },
    question: "Quels indicateurs numériques prouvent qu'il s'agit d'une campagne coordonnée d'astroturfing automatisé ?",
    options: [
      { id: 'a', text: "Publication à cadence surhumaine (120ms), comptes clonés créés en masse le même jour et visages générés aux yeux centrés.", isCorrect: true },
      { id: 'b', text: "Les messages ne contiennent pas d'émojis licorne ou d'images de chats.", isCorrect: false },
      { id: 'c', text: "Les tweets sont écrits en langue française sans aucune faute d'accord.", isCorrect: false }
    ],
    feedbackSuccess: "Attaque de désinformation neutralisée ! L'astroturfing tente de faire passer une opération robotisée pour un mouvement de foule populaire spontané.",
    takeaway: "Règle d'or : Lorsque des centaines de comptes publient le même message au mot près en quelques secondes, il s'agit d'un essaim de bots scripté."
  },
  {
    id: 'enigma_7',
    station: 'microscope',
    title: "7. Le Face-Swap en Visioconférence Teams",
    category: "Détection de Deepfake Vidéo Live",
    stationName: "Station Spectrale & Microscope",
    difficulty: "Avancé",
    xp: 85,
    clue: "Regardez l'enregistrement de l'examen oral en ligne du candidat suspect.",
    context: `Pendant un examen oral en distanciel, un enseignant a des doutes sur l'authenticité du visage du candidat qui s'exprime devant sa webcam.`,
    evidenceType: "video_artifacts",
    artifacts: [
      { trigger: "Mouvement brusque", effect: "Décrochage du masque de swap au niveau de la mâchoire laissant voir une barbe réelle en dessous." },
      { trigger: "Blinking rate", effect: "Seulement 2 battements de paupières en 4 minutes (fréquence normale : 15 à 20 par minute)." },
      { trigger: "Éclairage ambiant", effect: "Ombre portée vers la gauche sur le visage alors que la fenêtre de la pièce éclaire depuis la droite." }
    ],
    question: "Comment prouver formellement le recours à un filtre de Deepfake Face-Swap en direct ?",
    options: [
      { id: 'a', text: "Le candidat porte un t-shirt gris classique sans logo universitaire brodé.", isCorrect: false },
      { id: 'b', text: "Glitchs de suivi sur les contours du visage lors des rotations, clignement d'yeux anillement rare et contradiction d'ombres portées.", isCorrect: true },
      { id: 'c', text: "La connexion internet du candidat a un débit descendant supérieur à 100 Mbps.", isCorrect: false }
    ],
    feedbackSuccess: "Fraude déjouée en direct ! Les algorithmes de swap vidéo peinent lors des occlusions rapides (passer la main devant le visage) et des rotations de tête.",
    takeaway: "Règle d'or : En cas de doute sur une visio, demandez à l'interlocuteur de passer sa main devant son visage ou de tourner la tête de profil à 90°."
  },
  {
    id: 'enigma_8',
    station: 'terminal',
    title: "8. Le Biais de Confirmation & Le Piège du Prompt Biaisé",
    category: "Biais Algorithmiques & Prompting",
    stationName: "Terminal de Requêtes IA",
    difficulty: "Confirmé",
    xp: 75,
    clue: "Analysez la requête envoyée par l'étudiant dans l'invite de commande du terminal.",
    context: `Un étudiant pour son cours de communication souhaite prouver sa thèse. Il soumet le prompt suivant à une IA :
« Démontre-moi avec des faits incontestables que les jeunes d'aujourd'hui sont devenus intellectuellement paresseux à cause des technologies numériques. »
L'IA acquiesce et lui fournit une liste accablante sans aucune nuance.`,
    evidenceType: "prompt_engineering",
    problem: "Le prompt force le modèle à adopter une posture unilatérale et à masquer les études montrant le développement de nouvelles compétences cognitives.",
    question: "Comment transformer cette requête pour obtenir une synthèse objective et scientifique non biaisée ?",
    options: [
      { id: 'a', text: "Remplacer par : « Analyse les impacts cognitifs du numérique sur les étudiants en présentant les thèses opposées, les bénéfices et les limites documentées par des méta-analyses récentes. »", isCorrect: true },
      { id: 'b', text: "Ajouter : « S'il te plaît, sois très gentil et donne-moi la note de 20/20 pour mon travail. »", isCorrect: false },
      { id: 'c', text: "Demander à l'IA d'insérer 5 émojis tristes pour émouvoir le professeur à la lecture.", isCorrect: false }
    ],
    feedbackSuccess: "Maîtrise épistémique validée ! Un prompt dirigé (« Démontre que X a tort ») transforme l'IA en machine à confirmer nos propres préjugés.",
    takeaway: "Règle d'or : Exigez toujours de l'IA une analyse contradictoire (pour/contre, thèses divergentes) et des méta-analyses plutôt que des exemples isolés."
  },
  {
    id: 'enigma_9',
    station: 'vault',
    title: "9. Le Filigrane Fantôme & Le Pillage de Copyright",
    category: "Propriété Intellectuelle & Données",
    stationName: "Coffre d'Archives Blindées",
    difficulty: "Confirmé",
    xp: 70,
    clue: "Inspectez le coin inférieur droit de l'illustration médicale générée par IA.",
    context: `Une infographie pédagogique prétendument 'créée par IA libre de droits' pour un syllabus présente un schéma anatomique complexe.`,
    evidenceType: "watermark_inspector",
    watermarkDetail: {
      location: "Coin inférieur droit",
      pattern: "Déformation nébuleuse d'un logo semi-transparent blanc rappelant le filigrane de Shutterstock/Getty Images",
      cause: "Le modèle a été entraîné sur des millions d'images protégées contenant des filigranes qu'il a tenté de reproduire de manière confuse."
    },
    question: "Que prouve la présence de ce résidu de filigrane flouté sur une image générée ?",
    options: [
      { id: 'a', text: "Que l'ordinateur de l'étudiant a besoin d'une mise à jour de son pilote de carte graphique.", isCorrect: false },
      { id: 'b', text: "Que le modèle génératif a pillé des œuvres sous droits d'auteur sans autorisation lors de sa phase d'entraînement.", isCorrect: true },
      { id: 'c', text: "Que l'image a été validée par le ministère de l'Éducation nationale.", isCorrect: false }
    ],
    feedbackSuccess: "Sensibilisation éthique parfaite ! Le 'watermark halluciné' est la preuve irréfutable du pillage de créateurs humains par les géants de la tech.",
    takeaway: "Règle d'or : Les images générées ne sont pas nées du néant : elles synthétisent le travail d'artistes et de photographes réels dont les droits méritent respect."
  },
  {
    id: 'enigma_10',
    station: 'corkboard',
    title: "10. Le Protocole Ultime de Triangulation Factuelle",
    category: "Méthodologie du Grand Jury",
    stationName: "Tableau d'Indices & Liens",
    difficulty: "Grand Maître",
    xp: 100,
    clue: "Consolidez l'ensemble des 10 preuves pour sceller le rapport d'investigation.",
    context: `Vous devez transmettre au doyen et au jury votre protocole définitif pour valider n'importe quelle information trouvée sur le web ou synthétisée par une IA.`,
    evidenceType: "master_methodology",
    pillars: [
      "1. Remonter à la Source Primaire Originelle (DOI certifié, publication légale, institution officielle)",
      "2. Recherche Inversée d'Images & Analyse Forensique des Métadonnées EXIF",
      "3. Règle des 3 Sources Indépendantes : Aucun fait n'est certifié sans double corroboration contradictoire"
    ],
    question: "Quelle est la règle d'or absolue pour certifier une information avant de la valider dans ses études universitaires ?",
    options: [
      { id: 'a', text: "Faire confiance au premier résultat sponsorisé sur Google si le site est bien conçu graphiquement.", isCorrect: false },
      { id: 'b', text: "Triangulation stricte : Source primaire vérifiée, recherche inversée d'images/métadonnées et corroboration par au moins 2 sources indépendantes.", isCorrect: true },
      { id: 'c', text: "Demander à ChatGPT si c'est vrai, et s'il répond oui, considérer le problème comme définitivement résolu.", isCorrect: false }
    ],
    feedbackSuccess: "FÉLICITATIONS ! Vous décrochez le titre suprême de Détective Fact-Checker d'Élite du SAR Haute École Charlemagne !",
    takeaway: "Votre esprit critique est votre superpouvoir intellectuel. L'IA est un formidable amplificateur de calcul, mais l'humain reste le seul garant de la vérité et du sens."
  }
];

export default function GameFactChecking3D({ onComplete, onBack }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Gamification & Progression
  const [solvedEnigmas, setSolvedEnigmas] = useState([]);
  const [activeEnigmaId, setActiveEnigmaId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [investigationLogOpen, setInvestigationLogOpen] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('OVERVIEW');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredStation, setHoveredStation] = useState(null);
  const [isMuted, setIsMuted] = useState(() => sounds.isMuted());
  const [isPixarMode, setIsPixarMode] = useState(true);

  // Objets interactifs 3D
  const interactiveObjectsRef = useRef([]);
  const detectiveMeshRef = useRef(null);
  const hologramMeshRef = useRef(null);
  const particlesRef = useRef(null);

  // Caméra Lerp
  const targetCamPos = useRef(new THREE.Vector3(0, 6.5, 10.5));
  const targetCamLook = useRef(new THREE.Vector3(0, 1.5, 0));

  const CAMERA_VIEWS = {
    OVERVIEW: { pos: [0, 6.5, 10.5], look: [0, 1.5, 0], name: "Vue Globale du Labo" },
    CORKBOARD: { pos: [-0.5, 2.8, 1.2], look: [0, 2.8, -4.8], name: "Tableau d'Indices" },
    MICROSCOPE: { pos: [3.2, 2.4, 2.2], look: [4.2, 1.8, 0], name: "Station Deepfake" },
    TERMINAL: { pos: [-3.2, 2.4, 2.2], look: [-4.2, 1.8, 0], name: "Terminal IA" },
    AUDIO: { pos: [2.5, 2.2, 4.2], look: [3.4, 1.4, 3.2], name: "Console Audio" },
    VAULT: { pos: [-3.5, 2.2, 4.5], look: [-4.5, 1.8, 4.2], name: "Coffre d'Archives" }
  };

  const handleSwitchCamera = (viewKey) => {
    sounds.playPop();
    setCameraPreset(viewKey);
    const view = CAMERA_VIEWS[viewKey] || CAMERA_VIEWS.OVERVIEW;
    targetCamPos.current.set(...view.pos);
    targetCamLook.current.set(...view.look);
  };

  // Bascule Plein Écran
  const toggleFullscreen = () => {
    sounds.playPop();
    const elem = mountRef.current?.parentElement;
    if (!document.fullscreenElement) {
      elem?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Clic sur une station 3D -> ouvre l'énigme correspondante
  const handleOpenEnigma = (enigmaId) => {
    sounds.playPop();
    setActiveEnigmaId(enigmaId);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    // Ajuste la caméra vers la station de l'énigme
    const enigma = FACT_CHECK_ENIGMAS.find(e => e.id === enigmaId);
    if (enigma) {
      if (enigma.station === 'corkboard') handleSwitchCamera('CORKBOARD');
      else if (enigma.station === 'microscope') handleSwitchCamera('MICROSCOPE');
      else if (enigma.station === 'terminal') handleSwitchCamera('TERMINAL');
      else if (enigma.station === 'audio_console') handleSwitchCamera('AUDIO');
      else if (enigma.station === 'vault') handleSwitchCamera('VAULT');
    }
  };

  const handleValidateAnswer = () => {
    if (!selectedOption) return;
    const currentEnigma = FACT_CHECK_ENIGMAS.find(e => e.id === activeEnigmaId);
    if (!currentEnigma) return;

    setIsAnswerSubmitted(true);
    const chosen = currentEnigma.options.find(o => o.id === selectedOption);

    if (chosen?.isCorrect) {
      sounds.playSuccess();
      if (!solvedEnigmas.includes(activeEnigmaId)) {
        const nextSolved = [...solvedEnigmas, activeEnigmaId];
        setSolvedEnigmas(nextSolved);

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });

        // Si toutes les 10 énigmes sont résolues !
        if (nextSolved.length === FACT_CHECK_ENIGMAS.length) {
          sounds.playFanfare();
          if (onComplete) onComplete();
        }
      }
    } else {
      sounds.playBuzzer();
    }
  };

  // ============================================================================
  // CRÉATION DE LA SCÈNE THREE.JS 3D (LOW POLY ULTRA DÉTAILLÉ STYLE PIXAR)
  // ============================================================================

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Initialisation Scène & Moteur de Rendu
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.035);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 80);
    camera.position.set(0, 6.5, 10.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Éclairages Studio & Cyber (Key, Cyan Rim, Warm Desk Bounce, Spots Dédiés)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    // Lumière Principale Dorée Douce (Key)
    const keyLight = new THREE.SpotLight(0xfff7ed, 3.2);
    keyLight.position.set(2, 10, 6);
    keyLight.angle = Math.PI / 4.2;
    keyLight.penumbra = 0.7;
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Kicker Cyan Cyber Studio (Gauche)
    const rimCyan = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimCyan.position.set(-8, 6, -2);
    scene.add(rimCyan);

    // Kicker Magenta / Violet Chaud (Droite)
    const rimMagenta = new THREE.DirectionalLight(0xd946ef, 1.8);
    rimMagenta.position.set(8, 6, -2);
    scene.add(rimMagenta);

    // Rebond Lumineux Chaud au Sol
    const floorBounce = new THREE.PointLight(0xfde68a, 1.4, 18);
    floorBounce.position.set(0, 0.8, 1);
    scene.add(floorBounce);

    // Spot Théâtral sur le Tableau d'Indices
    const boardSpot = new THREE.SpotLight(0xfef08a, 2.5);
    boardSpot.position.set(0, 5.5, -2);
    boardSpot.target.position.set(0, 2.8, -4.8);
    boardSpot.angle = Math.PI / 4;
    boardSpot.penumbra = 0.5;
    scene.add(boardSpot);
    scene.add(boardSpot.target);

    // 3. Matériaux et Textures Procédurales
    const floorTex = createFloorTileTexture();
    const corkTex = createCorkTexture();
    const screenTex = createScreenGridTexture();

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.28,
      metalness: 0.18
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.85
    });

    const techDeskMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.35
    });

    const corkMat = new THREE.MeshStandardMaterial({
      map: corkTex,
      roughness: 0.92
    });

    const woodFrameMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.45
    });

    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      roughness: 0.15,
      metalness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const glowAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });

    // 4. Structure de la Pièce (Sol & Murs)
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Mur du Fond (derrière le tableau d'enquête)
    const backWallGeo = new THREE.PlaneGeometry(16, 9);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 4.5, -5.5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Mur Gauche
    const leftWallGeo = new THREE.PlaneGeometry(16, 9);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6.5, 4.5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Mur Droit (avec baie vitrée futuriste)
    const rightWallGeo = new THREE.PlaneGeometry(16, 9);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(6.5, 4.5, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // =========================================================================
    // 5. MODÉLISATION DES 7 STATIONS INTERACTIVES POINT & CLICK
    // =========================================================================
    interactiveObjectsRef.current = [];

    // --- STATION 1 : LE GRAND TABLEAU D'ENQUÊTE (CORKBOARD) ---
    const boardGroup = new THREE.Group();
    boardGroup.position.set(0, 2.9, -5.2);
    boardGroup.name = "station_corkboard";

    // Cadre en bois
    const frameGeo = new THREE.BoxGeometry(6.4, 3.4, 0.12);
    const frameMesh = new THREE.Mesh(frameGeo, woodFrameMat);
    frameMesh.castShadow = true;
    boardGroup.add(frameMesh);

    // Panneau liège
    const corkPanelGeo = new THREE.PlaneGeometry(6.1, 3.1);
    const corkPanelMesh = new THREE.Mesh(corkPanelGeo, corkMat);
    corkPanelMesh.position.z = 0.07;
    boardGroup.add(corkPanelMesh);

    // Photos polaroïds et mémos punaisés
    const memoMat1 = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });
    const memoMat2 = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.8 });
    const memoMat3 = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, roughness: 0.8 });
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2 });

    const memoPositions = [
      { x: -2.1, y: 0.7, rot: 0.08, mat: memoMat1 },
      { x: -0.8, y: 0.8, rot: -0.05, mat: memoMat2 },
      { x: 0.6, y: 0.9, rot: 0.04, mat: memoMat3 },
      { x: 1.9, y: 0.6, rot: -0.1, mat: memoMat1 },
      { x: -1.7, y: -0.6, rot: -0.06, mat: memoMat2 },
      { x: 0.0, y: -0.5, rot: 0.02, mat: memoMat1 },
      { x: 1.6, y: -0.7, rot: 0.07, mat: memoMat3 }
    ];

    memoPositions.forEach((m) => {
      const pGeo = new THREE.PlaneGeometry(0.75, 0.9);
      const pMesh = new THREE.Mesh(pGeo, m.mat);
      pMesh.position.set(m.x, m.y, 0.08);
      pMesh.rotation.z = m.rot;
      boardGroup.add(pMesh);

      // Punaise rouge
      const pinGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(m.x, m.y + 0.38, 0.1);
      boardGroup.add(pinMesh);
    });

    // Fil de laine rouge reliant les preuves (Line)
    const threadPoints = [
      new THREE.Vector3(-2.1, 0.7, 0.09),
      new THREE.Vector3(-0.8, 0.8, 0.09),
      new THREE.Vector3(0.0, -0.5, 0.09),
      new THREE.Vector3(1.6, -0.7, 0.09),
      new THREE.Vector3(1.9, 0.6, 0.09)
    ];
    const threadGeo = new THREE.BufferGeometry().setFromPoints(threadPoints);
    const threadMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 });
    const threadLine = new THREE.Line(threadGeo, threadMat);
    boardGroup.add(threadLine);

    // Titre néon au-dessus du tableau
    const boardSignGeo = new THREE.BoxGeometry(3.6, 0.45, 0.08);
    const boardSignMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const boardSignMesh = new THREE.Mesh(boardSignGeo, boardSignMat);
    boardSignMesh.position.set(0, 1.95, 0.05);
    boardGroup.add(boardSignMesh);

    scene.add(boardGroup);
    interactiveObjectsRef.current.push({
      mesh: frameMesh,
      group: boardGroup,
      type: 'corkboard',
      name: "Tableau d'Indices & Rumeurs",
      associatedEnigmas: ['enigma_4', 'enigma_10']
    });

    // --- STATION 2 : LE TERMINAL DE REQUÊTES IA & SCRAPING (GAUCHE) ---
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(-4.5, 0, -0.5);
    terminalGroup.name = "station_terminal";

    // Grand bureau technique
    const deskGeo = new THREE.BoxGeometry(2.4, 0.14, 1.4);
    const deskMesh = new THREE.Mesh(deskGeo, techDeskMat);
    deskMesh.position.y = 1.35;
    deskMesh.castShadow = true;
    terminalGroup.add(deskMesh);

    // Pieds du bureau
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.35);
    const leg1 = new THREE.Mesh(legGeo, metalMat); leg1.position.set(-1.0, 0.67, -0.55); terminalGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, metalMat); leg2.position.set(1.0, 0.67, -0.55); terminalGroup.add(leg2);
    const leg3 = new THREE.Mesh(legGeo, metalMat); leg3.position.set(-1.0, 0.67, 0.55); terminalGroup.add(leg3);
    const leg4 = new THREE.Mesh(legGeo, metalMat); leg4.position.set(1.0, 0.67, 0.55); terminalGroup.add(leg4);

    // Écran CRT cyber / Moniteur vert
    const monBase = new THREE.BoxGeometry(0.4, 0.05, 0.3);
    const monBaseMesh = new THREE.Mesh(monBase, metalMat);
    monBaseMesh.position.set(0, 1.45, 0);
    terminalGroup.add(monBaseMesh);

    const monScreenGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
    const monScreenMesh = new THREE.Mesh(monScreenGeo, screenMat);
    monScreenMesh.position.set(0, 1.95, 0);
    monScreenMesh.castShadow = true;
    terminalGroup.add(monScreenMesh);

    // Clavier mécanique
    const kbGeo = new THREE.BoxGeometry(0.8, 0.03, 0.35);
    const kbMesh = new THREE.Mesh(kbGeo, metalMat);
    kbMesh.position.set(0, 1.44, 0.4);
    terminalGroup.add(kbMesh);

    // Tasse de café fumante
    const cupGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.16);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    cupMesh.position.set(0.7, 1.5, 0.3);
    terminalGroup.add(cupMesh);

    scene.add(terminalGroup);
    interactiveObjectsRef.current.push({
      mesh: monScreenMesh,
      group: terminalGroup,
      type: 'terminal',
      name: "Terminal d'Analyse IA & DOI",
      associatedEnigmas: ['enigma_1', 'enigma_8']
    });

    // --- STATION 3 : LA STATION FORENSIQUE & MICROSCOPE DEEPFAKE (DROITE) ---
    const microscopeGroup = new THREE.Group();
    microscopeGroup.position.set(4.5, 0, -0.5);
    microscopeGroup.name = "station_microscope";

    // Bureau symétrique
    const deskRight = deskMesh.clone();
    deskRight.position.y = 1.35;
    microscopeGroup.add(deskRight);

    const legR1 = new THREE.Mesh(legGeo, metalMat); legR1.position.set(-1.0, 0.67, -0.55); microscopeGroup.add(legR1);
    const legR2 = new THREE.Mesh(legGeo, metalMat); legR2.position.set(1.0, 0.67, -0.55); microscopeGroup.add(legR2);
    const legR3 = new THREE.Mesh(legGeo, metalMat); legR3.position.set(-1.0, 0.67, 0.55); microscopeGroup.add(legR3);
    const legR4 = new THREE.Mesh(legGeo, metalMat); legR4.position.set(1.0, 0.67, 0.55); microscopeGroup.add(legR4);

    // Microscope Optique & Laser
    const scopeBaseGeo = new THREE.BoxGeometry(0.5, 0.1, 0.6);
    const scopeBase = new THREE.Mesh(scopeBaseGeo, metalMat);
    scopeBase.position.set(0, 1.48, 0.1);
    microscopeGroup.add(scopeBase);

    const scopeTubeGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.55);
    const scopeTube = new THREE.Mesh(scopeTubeGeo, metalMat);
    scopeTube.rotation.z = -0.3;
    scopeTube.position.set(-0.08, 1.85, 0.1);
    microscopeGroup.add(scopeTube);

    // Double Écran Incurvé
    const curvedScreenGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.9, 16, 1, true, -Math.PI / 4, Math.PI / 2);
    const curvedScreenMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.15,
      metalness: 0.5,
      side: THREE.DoubleSide
    });
    const curvedScreen = new THREE.Mesh(curvedScreenGeo, curvedScreenMat);
    curvedScreen.position.set(0, 2.0, -0.4);
    curvedScreen.rotation.y = Math.PI;
    microscopeGroup.add(curvedScreen);

    // Laser d'analyse vert
    const laserLight = new THREE.PointLight(0x10b981, 1.5, 2.5);
    laserLight.position.set(0, 1.6, 0.1);
    microscopeGroup.add(laserLight);

    scene.add(microscopeGroup);
    interactiveObjectsRef.current.push({
      mesh: scopeTube,
      group: microscopeGroup,
      type: 'microscope',
      name: "Station Spectrale & Microscope Deepfake",
      associatedEnigmas: ['enigma_2', 'enigma_7']
    });

    // --- STATION 4 : LA CONSOLE AUDIO & SPECTROGRAMME (AVANT DROITE) ---
    const audioGroup = new THREE.Group();
    audioGroup.position.set(3.5, 0, 3.2);
    audioGroup.name = "station_audio";

    const audioDesk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 1.1), techDeskMat);
    audioDesk.position.y = 0.65;
    audioDesk.castShadow = true;
    audioGroup.add(audioDesk);

    // Rack de consoles audio avec boutons
    const consoleGeo = new THREE.BoxGeometry(1.4, 0.35, 0.7);
    const consoleMesh = new THREE.Mesh(consoleGeo, new THREE.MeshStandardMaterial({ color: 0x111827 }));
    consoleMesh.position.set(0, 1.45, 0);
    audioGroup.add(consoleMesh);

    // Vu-mètres LED
    for (let i = 0; i < 6; i++) {
      const ledGeo = new THREE.BoxGeometry(0.12, 0.05, 0.02);
      const ledColor = i > 4 ? 0xef4444 : i > 2 ? 0xf59e0b : 0x10b981;
      const led = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: ledColor }));
      led.position.set(-0.4 + i * 0.16, 1.55, 0.36);
      audioGroup.add(led);
    }

    // Casque audio posé
    const headBandGeo = new THREE.TorusGeometry(0.18, 0.03, 8, 16, Math.PI);
    const headBand = new THREE.Mesh(headBandGeo, metalMat);
    headBand.rotation.x = Math.PI / 2;
    headBand.position.set(0.4, 1.4, 0.2);
    audioGroup.add(headBand);

    scene.add(audioGroup);
    interactiveObjectsRef.current.push({
      mesh: consoleMesh,
      group: audioGroup,
      type: 'audio_console',
      name: "Console Audio & Vocodeur RVC",
      associatedEnigmas: ['enigma_3']
    });

    // --- STATION 5 : LE SERVEUR RACK & BOT FARM SCANNER (FOND GAUCHE) ---
    const rackGroup = new THREE.Group();
    rackGroup.position.set(-5.5, 0, -4.2);
    rackGroup.name = "station_server";

    const rackGeo = new THREE.BoxGeometry(1.2, 3.8, 1.1);
    const rackMesh = new THREE.Mesh(rackGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 }));
    rackMesh.position.y = 1.9;
    rackMesh.castShadow = true;
    rackGroup.add(rackMesh);

    // Diodes clignotantes de calcul
    for (let h = 0.5; h < 3.5; h += 0.3) {
      for (let w = -0.35; w <= 0.35; w += 0.25) {
        const diodeColor = Math.random() > 0.4 ? 0x38bdf8 : 0x10b981;
        const diode = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: diodeColor }));
        diode.position.set(w, h, 0.56);
        rackGroup.add(diode);
      }
    }

    scene.add(rackGroup);
    interactiveObjectsRef.current.push({
      mesh: rackMesh,
      group: rackGroup,
      type: 'server_rack',
      name: "Serveur Rack & Fermes de Bots",
      associatedEnigmas: ['enigma_6']
    });

    // --- STATION 6 : LA TABLE STATISTIQUE HOLOGRAPHIQUE (CENTRE) ---
    const holoTableGroup = new THREE.Group();
    holoTableGroup.position.set(0, 0, 0.8);
    holoTableGroup.name = "station_stat";

    // Table ronde lumineuse
    const tableGeo = new THREE.CylinderGeometry(1.2, 1.0, 0.8, 24);
    const tableMesh = new THREE.Mesh(tableGeo, techDeskMat);
    tableMesh.position.y = 0.4;
    tableMesh.castShadow = true;
    holoTableGroup.add(tableMesh);

    // Anneau émetteur holographique
    const holoRing = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.8, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    holoRing.rotation.x = -Math.PI / 2;
    holoRing.position.y = 0.81;
    holoTableGroup.add(holoRing);

    // Projection holographique 3D animée (Barres de graphique)
    const holoBarsGroup = new THREE.Group();
    holoBarsGroup.position.set(0, 1.1, 0);
    for (let b = 0; b < 5; b++) {
      const barH = 0.4 + Math.sin(b * 1.5) * 0.3;
      const barGeo = new THREE.BoxGeometry(0.14, barH, 0.14);
      const barMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, wireframe: true });
      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(-0.4 + b * 0.2, barH / 2, 0);
      holoBarsGroup.add(barMesh);
    }
    holoTableGroup.add(holoBarsGroup);
    hologramMeshRef.current = holoBarsGroup;

    scene.add(holoTableGroup);
    interactiveObjectsRef.current.push({
      mesh: tableMesh,
      group: holoTableGroup,
      type: 'stat_holo',
      name: "Table Statistique & Dataviz",
      associatedEnigmas: ['enigma_5']
    });

    // --- STATION 7 : LE COFFRE D'ARCHIVES BLINDÉES (AVANT GAUCHE) ---
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(-4.0, 0, 3.5);
    vaultGroup.name = "station_vault";

    const vaultBoxGeo = new THREE.BoxGeometry(1.4, 2.2, 1.0);
    const vaultMesh = new THREE.Mesh(vaultBoxGeo, metalMat);
    vaultMesh.position.y = 1.1;
    vaultMesh.castShadow = true;
    vaultGroup.add(vaultMesh);

    // Poignée circulaire dorée
    const handleGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 16);
    const handleMesh = new THREE.Mesh(handleGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
    handleMesh.position.set(0.3, 1.1, 0.52);
    vaultGroup.add(handleMesh);

    scene.add(vaultGroup);
    interactiveObjectsRef.current.push({
      mesh: vaultMesh,
      group: vaultGroup,
      type: 'vault',
      name: "Coffre d'Archives & Copyright",
      associatedEnigmas: ['enigma_9']
    });

    // --- PERSONNAGE LOW POLY : INSPECTEUR DÉTECTIVE DU SAR ---
    const detective = new THREE.Group();
    detective.position.set(1.5, 0, -1.8);
    detective.rotation.y = -Math.PI / 4;

    // Corps / Buste
    const bodyGeo = new THREE.BoxGeometry(0.65, 0.9, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.35;
    body.castShadow = true;
    detective.add(body);

    // Cravate jaune moutarde
    const tieGeo = new THREE.BoxGeometry(0.12, 0.5, 0.05);
    const tieMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 1.4, 0.22);
    detective.add(tie);

    // Tête
    const headGeo = new THREE.BoxGeometry(0.44, 0.48, 0.42);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.05;
    head.castShadow = true;
    detective.add(head);

    // Lunettes rondes d'intellectuel
    const glassesGeo = new THREE.TorusGeometry(0.09, 0.015, 6, 12);
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const glassL = new THREE.Mesh(glassesGeo, glassesMat);
    glassL.position.set(-0.11, 2.08, 0.23);
    detective.add(glassL);
    const glassR = new THREE.Mesh(glassesGeo, glassesMat);
    glassR.position.set(0.11, 2.08, 0.23);
    detective.add(glassR);

    // Carnet de notes dans la main
    const notebookGeo = new THREE.BoxGeometry(0.35, 0.45, 0.06);
    const notebook = new THREE.Mesh(notebookGeo, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    notebook.position.set(0.45, 1.25, 0.2);
    notebook.rotation.z = -0.2;
    detective.add(notebook);

    // Jambes
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.9, 0.28), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    legL.position.set(-0.18, 0.45, 0);
    detective.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.9, 0.28), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    legR.position.set(0.18, 0.45, 0);
    detective.add(legR);

    scene.add(detective);
    detectiveMeshRef.current = detective;

    // Particules atmosphériques lumineuses en suspension
    const pCount = 140;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 14;
      pPos[i + 1] = Math.random() * 6 + 0.5;
      pPos[i + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);
    particlesRef.current = pSystem;

    // =========================================================================
    // 6. RAYCASTING POUR LE POINT & CLICK À LA SOURIS
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = interactiveObjectsRef.current.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const hit = interactiveObjectsRef.current.find(item => item.mesh === intersects[0].object);
        if (hit) setHoveredStation(hit);
      } else {
        container.style.cursor = 'default';
        setHoveredStation(null);
      }
    };

    const handlePointerDown = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = interactiveObjectsRef.current.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        const hit = interactiveObjectsRef.current.find(item => item.mesh === intersects[0].object);
        if (hit && hit.associatedEnigmas?.length > 0) {
          // Trouver la première énigme non résolue de cette station ou la première
          const enigmaToOpen = hit.associatedEnigmas.find(eId => !solvedEnigmas.includes(eId)) || hit.associatedEnigmas[0];
          handleOpenEnigma(enigmaToOpen);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handlePointerDown);

    // =========================================================================
    // 7. BOUCLE D'ANIMATION À 60 FPS (LERP CAMÉRA, PARTICULES, HOLOGRAMMES)
    // =========================================================================
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Lerp caméra fluide
      camera.position.lerp(targetCamPos.current, 0.045);
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      const desiredLook = targetCamLook.current.clone().sub(camera.position).normalize();
      currentLook.lerp(desiredLook, 0.045);
      camera.lookAt(camera.position.clone().add(currentLook));

      // Animation subtile du détective (respiration)
      if (detectiveMeshRef.current) {
        detectiveMeshRef.current.position.y = Math.sin(elapsed * 2.2) * 0.02;
      }

      // Rotation de l'hologramme
      if (hologramMeshRef.current) {
        hologramMeshRef.current.rotation.y = elapsed * 0.8;
      }

      // Ondulation des particules
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handlePointerDown);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const currentEnigma = FACT_CHECK_ENIGMAS.find(e => e.id === activeEnigmaId);
  const completionPercentage = Math.round((solvedEnigmas.length / FACT_CHECK_ENIGMAS.length) * 100);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 text-white font-['Lexend'] border-2 border-cyan-500/40 shadow-2xl flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : 'h-[780px]'
    }`}>
      
      {/* ==================================================================== */}
      {/* TOP HUD BAR (TITRE, PROGRESSION, VUES CAMÉRA, PLEIN ÉCRAN)          */}
      {/* ==================================================================== */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Titre & Statut avec Logo Réel HECh */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 p-1 rounded-xl bg-white border border-slate-700 shadow-sm flex items-center justify-center">
            <img
              src="/images/hech_logo_officiel.png"
              alt="Haute École Charlemagne"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Outfit'] text-base sm:text-lg font-black tracking-tight text-white">
                Fact-Checking Lab 3D · Point & Click
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
                SAR · HECh Liège
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Explorez le cyber-laboratoire, cliquez sur les stations et résolvez les 10 énigmes d'esprit critique.
            </p>
          </div>
        </div>

        {/* Caméra Shortcuts & Raccourcis de Stations */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-500 px-2 uppercase">Vues :</span>
          {Object.entries(CAMERA_VIEWS).map(([key, view]) => (
            <button
              key={key}
              onClick={() => handleSwitchCamera(key)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                cameraPreset === key
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>{view.name}</span>
            </button>
          ))}
        </div>

        {/* Actions Droite : Score, Journal, Plein Écran, Quitter */}
        <div className="flex items-center gap-2.5">
          {/* Progression des 10 Énigmes */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col text-right leading-none">
              <span className="text-[9px] font-bold text-slate-400">Énigmes</span>
              <span className="font-['Outfit'] text-xs font-black text-cyan-400">
                {solvedEnigmas.length}/10
              </span>
            </div>
          </div>

          {/* Bouton Journal d'Enquête */}
          <button
            onClick={() => {
              sounds.playPop();
              setInvestigationLogOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dossier ({solvedEnigmas.length})</span>
          </button>

          {/* Toggle Plein Écran */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le plein écran" : "Passer en plein écran"}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Bouton Retour si fourni */}
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop();
                onBack();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-800 text-slate-400 transition"
              title="Quitter la pièce"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3D CANVAS MOUNT (LE LABORATOIRE POINT & CLICK INTERACTIF)           */}
      {/* ==================================================================== */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative cursor-default"
      />

      {/* Bulle flottante au survol d'une station 3D */}
      {hoveredStation && !activeEnigmaId && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-400 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-cyan-300">
            <Search className="w-4 h-4 animate-pulse" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Station Interactive</span>
              <strong className="font-['Outfit'] text-sm text-white">{hoveredStation.name}</strong>
            </div>
            <span className="text-[11px] font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/30">
              Cliquez pour inspecter 🔍
            </span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CARROUSEL / SELECTEUR RAPIDE DES 10 ÉNIGMES EN BAS                   */}
      {/* ==================================================================== */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">
              Dossiers :
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {FACT_CHECK_ENIGMAS.map((enigma, idx) => {
              const isSolved = solvedEnigmas.includes(enigma.id);
              const isActive = activeEnigmaId === enigma.id;

              return (
                <button
                  key={enigma.id}
                  onClick={() => handleOpenEnigma(enigma.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : isSolved
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {isSolved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                  )}
                  <span>Dossier {idx + 1}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              setInvestigationLogOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold shrink-0 border border-slate-800 flex items-center gap-1"
          >
            <span>Bilan Global</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FENÊTRE MODALE D'INVESTIGATION : ÉNIGME EN COURS                     */}
      {/* ==================================================================== */}
      {currentEnigma && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto">
            
            {/* Header de l'Énigme */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                    {currentEnigma.category}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-mono">
                    +{currentEnigma.xp} XP
                  </span>
                </div>
                <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-white">
                  {currentEnigma.title}
                </h3>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveEnigmaId(null);
                  handleSwitchCamera('OVERVIEW');
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Corps du Dossier & Pièces à Conviction */}
            <div className="my-5 space-y-4">
              
              {/* Contexte de l'enquête */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-1">📋 Pièce à conviction :</span>
                {currentEnigma.context}
              </div>

              {/* Inspecteur de Preuve Spécifique selon l'énigme */}
              {currentEnigma.evidenceType === 'document' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 font-mono text-xs space-y-1.5 text-cyan-200">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Résultat de la requête Crossref / DOAJ :</div>
                  <div>DOI Analysé : <strong className="text-white">{currentEnigma.documentSnippet.doi}</strong></div>
                  <div>Statut du Serveur : <strong className="text-rose-400">{currentEnigma.documentSnippet.crossrefStatus}</strong></div>
                  <div>Indexation Scopus : <strong className="text-rose-400">{currentEnigma.documentSnippet.scopusIndex}</strong></div>
                </div>
              )}

              {currentEnigma.evidenceType === 'image_forensic' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 text-xs space-y-2">
                  <span className="font-bold text-cyan-300 block">🔬 Analyse Spectrale des Micro-Artefacts :</span>
                  {currentEnigma.anomalies.map((ano, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-cyan-400 font-bold">#{aIdx + 1}</span>
                      <div>
                        <strong className="text-white block">{ano.name}</strong>
                        <span className="text-slate-400 text-[11px]">{ano.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentEnigma.evidenceType === 'audio_spectrum' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-xs space-y-2">
                  <span className="font-bold text-indigo-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span>Spectrogramme Audio HiFi-GAN RVC :</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">Coupure Haute Fréquence :</span>
                      <strong className="text-amber-400">{currentEnigma.spectrumDetails.cutoffFrequency}</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">Respirations physiologiques :</span>
                      <strong className="text-rose-400">{currentEnigma.spectrumDetails.breathingArtifacts}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Question de Fact-Checking */}
              <div className="pt-2">
                <h4 className="font-['Outfit'] font-bold text-sm sm:text-base text-yellow-300 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-yellow-400" />
                  <span>{currentEnigma.question}</span>
                </h4>

                {/* Choix d'arguments critiques */}
                <div className="space-y-2.5">
                  {currentEnigma.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const showFeedback = isAnswerSubmitted;

                    let btnStyle = "bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-500 hover:bg-slate-800";
                    if (isSelected && !showFeedback) {
                      btnStyle = "bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30";
                    } else if (showFeedback) {
                      if (opt.isCorrect) {
                        btnStyle = "bg-emerald-950 border-emerald-400 text-emerald-200 font-bold";
                      } else if (isSelected && !opt.isCorrect) {
                        btnStyle = "bg-rose-950 border-rose-500 text-rose-200 line-through";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswerSubmitted && opt.isCorrect}
                        onClick={() => {
                          sounds.playPop();
                          setSelectedOption(opt.id);
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-xl bg-black/40 flex items-center justify-center font-bold text-xs uppercase shrink-0 mt-0.5">
                          {opt.id}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                        {showFeedback && opt.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {showFeedback && isSelected && !opt.isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Pédagogique hamburger après validation */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <strong className="text-xs sm:text-sm text-cyan-200">
                      {currentEnigma.feedbackSuccess}
                    </strong>
                  </div>
                  <div className="text-xs text-slate-300 border-t border-cyan-900/60 pt-2 font-medium">
                    💡 <strong className="text-yellow-300">Mémo du Détective :</strong> {currentEnigma.takeaway}
                  </div>
                </div>
              )}

            </div>

            {/* Pied d'Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {solvedEnigmas.includes(currentEnigma.id) ? "✓ Indice déjà versé au dossier" : "Non résolu"}
              </span>

              <div className="flex items-center gap-3">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleValidateAnswer}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg cursor-pointer"
                  >
                    Valider l'hypothèse
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setActiveEnigmaId(null);
                      handleSwitchCamera('OVERVIEW');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <span>Continuer l'enquête</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DOSSIER & JOURNAL D'INVESTIGATION COMPLET (BILAN DES 10 ÉNIGMES)     */}
      {/* ==================================================================== */}
      {investigationLogOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-slate-950 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[88vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-['Outfit'] text-2xl font-black text-white flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <span>Grand Journal d'Investigation Fact-Checking</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthèse des 10 règles critiques indispensables pour vos études universitaires et mémoires.
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  setInvestigationLogOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Grille des 10 Dossiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FACT_CHECK_ENIGMAS.map((enigma, eIdx) => {
                const isSolved = solvedEnigmas.includes(enigma.id);

                return (
                  <div
                    key={enigma.id}
                    onClick={() => {
                      setInvestigationLogOpen(false);
                      handleOpenEnigma(enigma.id);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSolved 
                        ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-950/60' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-mono font-bold text-slate-400">Dossier #{eIdx + 1}</span>
                        {isSolved ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Résolu
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> À résoudre
                          </span>
                        )}
                      </div>
                      <h5 className="font-['Outfit'] font-bold text-sm text-white leading-snug">
                        {enigma.title}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {enigma.clue}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                      <span>{enigma.stationName}</span>
                      <span>Ouvrir →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bilan de Maîtrise */}
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                  Statut du Badge Académique
                </span>
                <strong className="font-['Outfit'] text-base text-white">
                  {solvedEnigmas.length === 10
                    ? "🏆 Détective Fact-Checker d'Élite (Certification SAR Validée)"
                    : `Enquête en cours (${solvedEnigmas.length}/10 validés)`}
                </strong>
              </div>

              {solvedEnigmas.length === 10 && onComplete && (
                <button
                  onClick={() => {
                    sounds.playFanfare();
                    onComplete();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg"
                >
                  Valider la Clé Alpha
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
