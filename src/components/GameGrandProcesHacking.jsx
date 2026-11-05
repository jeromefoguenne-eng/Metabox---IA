import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Gavel, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Sparkles, 
  Volume2, 
  ArrowRight, 
  UserCheck, 
  Flame, 
  Globe2, 
  Users, 
  BrainCircuit, 
  Droplets, 
  Radio, 
  RotateCcw, 
  Award,
  ChevronRight,
  ShieldAlert,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Courtroom3DCanvas from './Courtroom3DCanvas';
import CourtroomHackingTools from './CourtroomHackingTools';
import { sounds } from '../utils/soundEffects';
import AuroreGameBriefingModal from './AuroreGameBriefingModal';

/**
 * GameGrandProcesHacking:
 * Le Grand Procès de l'Éthique IA : « L'Affaire du Blackout de 24h ».
 * 
 * Le joueur incarne l'Avocat de la Défense (Me Alex) et défend Maxime.
 * - Système de Choix Multiple (QCM 4 choix par assaut)
 * - Réactions visibles en direct sur le Juge 3D (Sourire vs Moue sceptique)
 * - Cinématique solennelle du Juge énumérant les motifs retenus avant le verdict
 * - Proclamation d'Innocence (Lanceur d'alerte) ou de Culpabilité
 * - Anti-superposition audio stricte
 */
export default function GameGrandProcesHacking({ onComplete }) {
  const [currentAssaultIdx, setCurrentAssaultIdx] = useState(0);
  const [stage, setStage] = useState('intro'); // 'intro' | 'attack' | 'investigation' | 'pleading' | 'reaction' | 'verdict_cinematic'
  const [cameraView, setCameraView] = useState('TV_WIDE');
  const [showBriefing, setShowBriefing] = useState(false);

  // États 3D
  const [witnessState, setWitnessState] = useState('idle'); // 'idle' | 'speaking' | 'stressed' | 'confident'
  const [prosecutorState, setProsecutorState] = useState('idle'); // 'idle' | 'speaking' | 'attacking'
  const [defenseState, setDefenseState] = useState('idle'); // 'idle' | 'pleading'
  const [judgeState, setJudgeState] = useState('idle'); // 'idle' | 'speaking' | 'gavel'
  const [judgeReaction, setJudgeReaction] = useState('neutral'); // 'neutral' | 'smile' | 'frown'
  const [audienceState, setAudienceState] = useState('idle'); // 'idle' | 'cheer' | 'boo' | 'shout_maxime' | 'uproar'
  const [audienceShoutText, setAudienceShoutText] = useState('');

  // Jauges judiciaires
  const [judgeConviction, setJudgeConviction] = useState(20); // 0 à 100%
  const [criticalScore, setCriticalScore] = useState(50);
  const [prosecutorPanic, setProsecutorPanic] = useState(10);
  const [currentEvidenceReady, setCurrentEvidenceReady] = useState(null);
  const [selectedArgument, setSelectedArgument] = useState(null);
  const [isPleadingConfirmed, setIsPleadingConfirmed] = useState(false);

  // Tableau des 6 piliers validés ou non (pour la cinématique finale)
  const [elementsProven, setElementsProven] = useState({
    eco: false,
    data: false,
    cognition: false,
    jobs: false,
    sovereignty: false,
    propaganda: false
  });

  // Étape interne de la cinématique finale du Juge (0 à 7)
  const [cinematicStep, setCinematicStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isKeyClaimed, setIsKeyClaimed] = useState(false);

  // Nettoyage audio strict au démontage du composant
  useEffect(() => {
    return () => {
      sounds.stopAllVoice();
    };
  }, []);

  // Cris spontanés aléatoires du public "Libérez Maxime !" plus forts et chargés d'émotion
  useEffect(() => {
    const interval = setInterval(() => {
      if (stage === 'pleading' || stage === 'investigation' || stage === 'attack') {
        const shoutTexts = [
          'Public : « LIBÉREZ MAXIME ! C\'est un héros, pas un coupable ! »',
          'Public : « JUSTICE POUR MAXIME ! Il s\'est sacrifié pour sauver nos données ! »',
          'Public : « NON AU PROCÈS TRUQUÉ ! Maxime est innocent, libérez-le ! »',
          'Public : « LA MACHINE NE NOUS GOUVERNE PAS ! LIBERTÉ POUR MAXIME ! »',
          'Public : « LE CAMPUS EXIGE LA VÉRITÉ ! Relâchez Maxime sur-le-champ ! »',
          'Public : « MAXIME A EU LE COURAGE DE DIRE NON ! VOUS JUGEZ LE MAUVAIS ACCUSÉ ! »'
        ];
        const randomText = shoutTexts[Math.floor(Math.random() * shoutTexts.length)];
        setAudienceState('shout_maxime');
        setAudienceShoutText(randomText);
        sounds.playPublicLiberez();

        setTimeout(() => {
          setAudienceState('idle');
          setAudienceShoutText('');
        }, 4200);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [stage]);

  // Déclenchement spectaculaire : Le public crie et se soulève avec émotion, PUIS le Juge exaspéré tape furieusement du marteau et menace d'évacuer la salle
  const triggerAudienceUproarAndJudgeSilence = () => {
    sounds.stopAllVoice();
    setAudienceState('shout_maxime');
    setAudienceShoutText('Public : « SCANDALE ! PARODIE DE JUSTICE ! LIBÉREZ MAXIME IMMÉDIATEMENT ! »');
    setCameraView('AUDIENCE');

    sounds.playPublicUproarAndJudgeSilence(
      () => {
        setAudienceState('shout_maxime');
      },
      () => {
        setCameraView('JUDGE');
        setJudgeState('gavel');
        setJudgeReaction('frown');
        setAudienceState('idle');
        setAudienceShoutText('LE JUGE (EXASPÉRÉ) : « SILENCE DANS CETTE SALLE ! ASSEZ ! La Cour n\'est pas un cirque ! Au prochain cri, je fais évacuer la tribune sur-le-champ ! »');
      },
      () => {
        setJudgeState('idle');
        setJudgeReaction('neutral');
        setAudienceShoutText('');
      }
    );
  };

  const ASSAULTS = [
    {
      id: 'assault_1',
      title: 'Assaut 1/6 : Sabotage Énergétique & Coût du Réseau',
      prosecutorVoice: 'proces_procureur_assaut_1',
      maximeVoice: 'proces_maxime_defense_1',
      charge: "Le Procureur accuse Maxime d'avoir paralysé l'infrastructure par vandalisme et réclame son incarcération pour trouble grave à l'ordre public.",
      prosecutorQuote: "« Monsieur le Juge ! Ce prévenu a coupé brutalement les serveurs du campus en pleine semaine de cours ! Il a causé une désorganisation totale et un trouble intolérable à l'ordre public ! Je réclame un mandat de dépôt et son incarcération ferme immédiate pour trouble à l'ordre public ! »",
      maximeDefenseQuote: "« Ce n'était pas du vandalisme. Regardez les compteurs : en seulement 24 heures sans IA, le campus a économisé 45 000 litres d'eau de refroidissement et des mégawatts d'électricité gaspillés pour des requêtes futiles ! »",
      requiredType: 'eco',
      arguments: [
        {
          id: 'arg_eco_opt2',
          type: 'sophism',
          title: "Économie budgétaire directe sur la facture d'électricité",
          text: "Plaider que Maxime a fait économiser 4 000 € sur la facture d'électricité de l'école et mérite donc une prime financière.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Moue sceptique du Juge : « Le tribunal ne marchande pas les infractions pénales en primes financières. »"
        },
        {
          id: 'arg_eco_opt3',
          type: 'weak',
          title: "Soulagement de la fatigue estudiantine en période de blocus",
          text: "Prétendre que les étudiants voulaient juste un jour de congé pour récupérer de leurs nuits blanches de blocus.",
          isCorrect: false,
          gain: -8,
          reaction: 'frown',
          feedback: "Moue réprobatrice du Juge : « Le confort personnel ne constitue aucunement une cause d'exonération de responsabilité. »"
        },
        {
          id: 'arg_eco_opt1',
          type: 'eco',
          title: "État de nécessité environnementale et préservation des ressources vitales",
          text: "Invoquer l'état de nécessité environnementale : le cluster LLM consommait 48 500 L d'eau potable et 14 200 kWh par semaine pour des tâches dérisoires ; le blackout a stoppé ce gaspillage écologique irréversible.",
          isCorrect: true,
          gain: 15,
          reaction: 'smile',
          feedback: "Le Juge sourit et hoche la tête : « La proportionnalité environnementale est un moyen de droit recevable devant notre juridiction. »"
        },
        {
          id: 'arg_eco_opt4',
          type: 'procedural',
          title: "Défaut de qualification matérielle de cyber-sabotage au Code pénal",
          text: "Arguer que couper un disjoncteur n'est pas un cyber-sabotage au sens strict de l'article 550bis du Code pénal.",
          isCorrect: false,
          gain: -4,
          reaction: 'frown',
          feedback: "Le Juge secoue la tête : « L'entrave logicielle est juridiquement établie. Défendez le fond et l'intérêt public ! »"
        }
      ]
    },
    {
      id: 'assault_2',
      title: 'Assaut 2/6 : Violation de Réseau & Piratage Illégal',
      prosecutorVoice: 'proces_procureur_assaut_2',
      maximeVoice: 'proces_maxime_defense_2',
      charge: "Le Procureur soutient que Maxime a fracturé la sécurité de l'école au mépris du droit informatique.",
      prosecutorQuote: "« Mensonge ! Cet individu a violé les réseaux internes de l'école ! En s'introduisant dans les pare-feux, il a mis en péril la sécurité informatique de notre institution ! »",
      maximeDefenseQuote: "« J'ai au contraire protégé nos camarades ! J'ai découvert que les travaux, les thèses et même les données de santé des étudiants étaient aspirés en continu vers des serveurs tiers en Californie sans consentement ! »",
      requiredType: 'data',
      arguments: [
        {
          id: 'arg_data_opt2',
          type: 'weak',
          title: "Négligence manifeste dans la configuration des pare-feux de l'école",
          text: "Soutenir que les pare-feux de l'école étaient si mal configurés que n'importe qui aurait pu entrer sans forcer.",
          isCorrect: false,
          gain: -6,
          reaction: 'frown',
          feedback: "Moue sévère du Juge : « La négligence de la victime n'annule jamais la culpabilité de l'intrus. »"
        },
        {
          id: 'arg_data_opt3',
          type: 'sophism',
          title: "Débordement involontaire dans le cadre d'un TP d'informatique",
          text: "Affirmer que Maxime faisait seulement un exercice de TP d'informatique non encadré qui a débordé.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Moue dubitative du Juge : « Ne mentez pas à cette Cour. Nous savons que l'acte était prémédité. »"
        },
        {
          id: 'arg_data_opt4',
          type: 'irrelevant',
          title: "Absence de valeur commerciale des fichiers estudiantins collectés",
          text: "Plaider que les fichiers aspirés n'étaient que des brouillons et n'avaient aucune valeur commerciale.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Le Juge désapprouve de la tête : « Tout document estudiantin relève de la vie privée garantie par la loi. »"
        },
        {
          id: 'arg_data_opt1',
          type: 'data',
          title: "Interruption d'urgence d'une fuite massive de données personnelles (RGPD)",
          text: "Démontrer que l'arrêt d'urgence a stoppé une exfiltration massive et illégale des mémoires étudiants et données de santé vers des serveurs tiers en Californie, en violation de l'Article 44 du RGPD.",
          isCorrect: true,
          gain: 15,
          reaction: 'smile',
          feedback: "Le Juge sourit avec bienveillance : « Le signalement d'une fuite de données personnelles sensible relève du devoir de lanceur d'alerte. »"
        }
      ]
    },
    {
      id: 'assault_3',
      title: 'Assaut 3/6 : Privation d Outils Pédagogiques & Chaos',
      prosecutorVoice: 'proces_procureur_assaut_3',
      maximeVoice: 'proces_maxime_defense_3',
      charge: "Le Procureur prétend que les étudiants étaient perdus et incapables de travailler sans les assistants IA.",
      prosecutorQuote: "« Sans nos assistants virtuels, les étudiants étaient totalement désemparés ! Il a brisé la continuité pédagogique et privé notre jeunesse du progrès moderne ! »",
      maximeDefenseQuote: "« Désemparés ? Ou enfin libérés ? Les étudiants ne savaient même plus écrire trois phrases sans prompter une machine ! Pendant ces 24 heures, ils se sont enfin reparlé, ils ont réouvert des livres et réactivé leur propre esprit critique ! »",
      requiredType: 'cognitive',
      arguments: [
        {
          id: 'arg_cog_opt2',
          type: 'anti_tech',
          title: "Rejet total de l'informatique et retour définitif aux écrits manuscrits",
          text: "Plaider qu'il faut interdire tout ordinateur et revenir au papier et à la plume d'oie pour les cinquante prochaines années.",
          isCorrect: false,
          gain: -7,
          reaction: 'frown',
          feedback: "Moue agacée du Juge : « Le luddisme aveugle n'est pas une réponse juridique sérieuse au XXIe siècle. »"
        },
        {
          id: 'arg_cog_opt1',
          type: 'cognitive',
          title: "Alerte sur la soumission intellectuelle et l'atrophie de l'esprit critique",
          text: "Démontrer que l'IA campus provoquait une soumission intellectuelle totale où les étudiants ne savaient plus rédiger sans béquille ; le blackout a réactivé la lecture critique et les débats réels.",
          isCorrect: true,
          gain: 15,
          reaction: 'smile',
          feedback: "Le Juge s'anime d'un franc sourire : « Remarquable ! Une Haute École forme des consciences libres, pas des perroquets algorithmiques. »"
        },
        {
          id: 'arg_cog_opt3',
          type: 'weak',
          title: "Facilité organisationnelle pour reporter les dates limites de devoirs",
          text: "Dire que les professeurs n'avaient qu'à décaler les devoirs et que ce retard était sans importance.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Le Juge fronce les sourcils : « L'ordre académique mérite le respect de tous les justiciables. »"
        },
        {
          id: 'arg_cog_opt4',
          type: 'sophism',
          title: "Démonstration d'amour-propre face à la toute-puissance de la machine",
          text: "Soutenir que Maxime voulait simplement prouver qu'un humain est plus fort qu'un algorithme dans un duel de force.",
          isCorrect: false,
          gain: -6,
          reaction: 'frown',
          feedback: "Moue sceptique : « La justice ne juge pas un jeu vidéo d'ego mais des responsabilités civiques. »"
        }
      ]
    },
    {
      id: 'assault_4',
      title: 'Assaut 4/6 : Frein à la Modernisation & Efficience RH',
      prosecutorVoice: 'proces_procureur_assaut_4',
      maximeVoice: 'proces_maxime_defense_4',
      charge: "Le Procureur défend le projet Campus 2030 d'automatisation rentable des services scolaires.",
      prosecutorQuote: "« L'établissement déployait un projet pilote d'efficience budgétaire d'avenir ! Ce sabotage a freiné la modernisation de notre institution ! »",
      maximeDefenseQuote: "« L'efficience budgétaire ? Parlons-en ! Le plan secret prévoyait de supprimer 25 postes de secrétaires et d'assistants pour les remplacer par des clones numériques ! Une université n'est pas une usine automatisée sans empathie ! »",
      requiredType: 'jobs',
      arguments: [
        {
          id: 'arg_jobs_opt1',
          type: 'jobs',
          title: "Dénonciation du plan de suppression d'emplois et de déshumanisation",
          text: "Révéler la preuve matérielle du mémo RH confidentiel prévoyant la suppression de 25 postes de secrétaires, bibliothécaires et tuteurs ; l'IA ne doit pas servir de prétexte à la déshumanisation institutionnelle.",
          isCorrect: true,
          gain: 15,
          reaction: 'smile',
          feedback: "Le Juge sourit gravement en acquiesçant : « La préservation du corps social et de la présence humaine est au cœur du pacte éducatif. »"
        },
        {
          id: 'arg_jobs_opt2',
          type: 'weak',
          title: "Critique de la grille de rémunération du conseil d'administration",
          text: "Attaquer personnellement les membres du conseil d'administration en disant qu'ils gagnent trop d'argent.",
          isCorrect: false,
          gain: -8,
          reaction: 'frown',
          feedback: "Moue réprobatrice immédiate : « Maître, cessez immédiatement les attaques ad hominem inadmissibles ! »"
        },
        {
          id: 'arg_jobs_opt3',
          type: 'procedural',
          title: "Irrégularité de forme dans le procès-verbal de concertation syndicale",
          text: "Plaider une simple irrégularité dans le procès-verbal de la réunion du comité de concertation syndicale.",
          isCorrect: false,
          gain: -4,
          reaction: 'frown',
          feedback: "Le Juge secoue la tête : « Ce moyen de pure forme administrative n'efface pas la matérialité de l'acte de Maxime. »"
        },
        {
          id: 'arg_jobs_opt4',
          type: 'sophism',
          title: "Refus idéologique de toute dématérialisation administrative",
          text: "Soutenir qu'aucun formulaire ne devrait jamais être dématérialisé dans une école belge.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Moue sceptique : « L'outil informatique en soi n'est pas le coupable, c'est la substitution humaine aveugle qui l'est. »"
        }
      ]
    },
    {
      id: 'assault_5',
      title: 'Assaut 5/6 : Refus du Progrès Mondial & IA Internationale',
      prosecutorVoice: 'proces_procureur_assaut_5',
      maximeVoice: 'proces_maxime_defense_5',
      charge: "Le Procureur invoque la puissance incontestable des géants technologiques mondiaux.",
      prosecutorQuote: "« Nous utilisons les meilleurs outils du marché mondial, conçus par les géants californiens et asiatiques. Pourquoi refuser cette puissance technologique ? »",
      maximeDefenseQuote: "« Parce que cela détruit notre souveraineté européenne ! Nous abandonnons nos cerveaux, notre culture et notre indépendance intellectuelle aux mains de multinationales privées qui ne cherchent que le monopole et le profit ! »",
      requiredType: 'sovereignty',
      arguments: [
        {
          id: 'arg_sov_opt2',
          type: 'weak',
          title: "Préférence géographique stricte pour les logiciels codés localement",
          text: "Plaider qu'il ne faut utiliser que des logiciels fabriqués à Liège ou à Bruxelles même s'ils ne fonctionnent pas.",
          isCorrect: false,
          gain: -6,
          reaction: 'frown',
          feedback: "Moue déçue du Juge : « Le repli identitaire étroit n'a rien à voir avec une souveraineté éthique universelle. »"
        },
        {
          id: 'arg_sov_opt3',
          type: 'sophism',
          title: "Autarcie numérique totale et coupure du réseau mondial",
          text: "Réclamer que l'école coupe toute connexion Internet mondiale et vive en autarcie numérique complète.",
          isCorrect: false,
          gain: -7,
          reaction: 'frown',
          feedback: "Le Juge fait une moue dubitative : « Soyons réalistes, l'université est connectée au monde. »"
        },
        {
          id: 'arg_sov_opt1',
          type: 'sovereignty',
          title: "Défense de la souveraineté intellectuelle contre les monopoles privés",
          text: "Dénoncer la vassalisation intellectuelle européenne et le transfert d'autorité démocratique à des oligopoles privés américains et chinois qui dictent les règles du savoir et captent nos richesses.",
          isCorrect: true,
          gain: 15,
          reaction: 'smile',
          feedback: "Le Juge hoche la tête avec un sourire d'assentiment : « La souveraineté démocratique et l'indépendance de pensée sont des principes cardinaux. »"
        },
        {
          id: 'arg_sov_opt4',
          type: 'irrelevant',
          title: "Fluctuation des taux de change euro/dollar sur les abonnements",
          text: "Avancer que payer des abonnements en dollars américains coûte trop cher à cause du taux de change euro/dollar.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Moue sceptique : « Nous débattons de liberté intellectuelle, pas de taux de change bancaire. »"
        }
      ]
    },
    {
      id: 'assault_6',
      title: 'Assaut 6/6 : Trouble à l Ordre Public & Calomnie',
      prosecutorVoice: 'proces_procureur_assaut_6',
      maximeVoice: 'proces_maxime_defense_6',
      charge: "Le Procureur tente un dernier coup de force en traitant Maxime d'agitateur complotiste.",
      prosecutorQuote: "« Ce garçon est un agitateur qui distille le doute et la paranoïa sur le campus ! C'est un délit contre la vérité institutionnelle ! »",
      maximeDefenseQuote: "« La vérité ? L'algorithme enfermait chaque promotion dans des bulles d'information biaisées et censurait les contre-discours scientifiques ! Mon geste était un signal d'alarme pour sauver la démocratie universitaire ! »",
      requiredType: 'propaganda',
      arguments: [
        {
          id: 'arg_prop_opt2',
          type: 'weak',
          title: "Revendication d'un droit absolu à l'invective sur les réseaux",
          text: "Affirmer que sur les réseaux sociaux d'étudiants, tout le monde a le droit de diffamer sans aucune limite morale.",
          isCorrect: false,
          gain: -8,
          reaction: 'frown',
          feedback: "Moue indignée du Juge : « Non Maître ! La liberté d'expression s'arrête là où commence la calomnie et la nuisance gratuite. »"
        },
        {
          id: 'arg_prop_opt1',
          type: 'propaganda',
          title: "Démonstration du filtrage idéologique et des bulles de filtres cognitives",
          text: "Prouver par le benchmark technique que l'IA campus applique un filtrage idéologique opaque, enfermant les apprenants dans des bulles de filtres qui étouffent la controverse scientifique et le débat démocratique.",
          isCorrect: true,
          gain: 15,
          reaction: 'smile',
          feedback: "Sourire radieux du Juge : « Plaidoirie lumineuse ! Le pluralisme et le doute méthodique sont le sel de l'enseignement supérieur. »"
        },
        {
          id: 'arg_prop_opt3',
          type: 'sophism',
          title: "Qualification de canular étudiant inoffensif et festif",
          text: "Prétendre que ce crash était juste une blague de bizutage pour faire rire la nouvelle promotion d'étudiants.",
          isCorrect: false,
          gain: -6,
          reaction: 'frown',
          feedback: "Le Juge secoue la tête : « Ne trahissez pas la sincérité de votre propre client. Maxime n'est pas un farceur mais un lanceur d'alerte. »"
        },
        {
          id: 'arg_prop_opt4',
          type: 'irrelevant',
          title: "Espoir d'une future mise à jour logicielle corrective par le fournisseur",
          text: "Dire que l'IA a des hallucinations et qu'il suffit d'attendre la mise à jour 5.0 pour que tout s'arrange.",
          isCorrect: false,
          gain: -5,
          reaction: 'frown',
          feedback: "Moue sceptique : « Attendre passivement une mise à jour d'entreprise privée ne garantit en rien la déontologie. »"
        }
      ]
    }
  ];

  const currentAssault = ASSAULTS[currentAssaultIdx];

  // Lancement du Procès
  const handleStartTrial = () => {
    sounds.stopAllVoice();
    sounds.playCourtroomMurmur(3.5);
    setStage('attack');
    setCameraView('PROSECUTION');
    setProsecutorState('attacking');
    setJudgeReaction('neutral');
    setSelectedArgument(null);
    setIsPleadingConfirmed(false);

    // Le Procureur prononce l'intégralité de son réquisitoire sans AUCUNE interruption
    sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0, false, () => {
      setProsecutorState('idle');

      // Dans l'assaut 1 : C'est SEULEMENT après la fin complète de sa phrase (réclamation d'incarcération ferme)
      // que le public s'insurge dans la salle et que le Juge frappe son marteau pour exiger le silence !
      if (currentAssaultIdx === 0) {
        setAudienceState('shout_maxime');
        setAudienceShoutText('Public : « Scandale ! Parodie de justice ! Libérez Maxime ! »');
        setCameraView('AUDIENCE');
        sounds.playVoice('proces_public_chahut_poly', () => {
          setCameraView('JUDGE');
          setJudgeState('gavel');
          setAudienceState('idle');
          setAudienceShoutText('Juge : « Silence ! Ou je fais évacuer la salle ! »');
          sounds.playJudgeSilence();
          setTimeout(() => {
            setAudienceShoutText('');
            setCameraView('TV_WIDE');
            setJudgeState('idle');
          }, 4500);
        });
      } else {
        setCameraView('TV_WIDE');
      }
    });
  };

  // Phase d'enquête et d'expertise numérique
  const handleOpenForensics = () => {
    sounds.stopAllVoice();
    setStage('investigation');
    setCameraView('TV_WIDE');
    setProsecutorState('idle');
    setJudgeReaction('neutral');
    setSelectedArgument(null);
    setIsPleadingConfirmed(false);
    sounds.playTensionHeartbeat();
  };

  // Preuve technique débloquée
  const handleEvidenceReady = (ev) => {
    setCurrentEvidenceReady(ev);
  };

  // Lancement du QCM de plaidoirie
  const handleStartPleading = () => {
    sounds.stopAllVoice();
    setStage('pleading');
    setCameraView('DEFENSE');
    setDefenseState('pleading');
    setJudgeReaction('neutral');
    setSelectedArgument(null);
    setIsPleadingConfirmed(false);
    sounds.playObjectionImpact();
  };

  // Choix d'un argument dans le QCM : SELECTION STRICTEMENT NEUTRE SANS DÉVOILER ROUGE OU VERT
  const handleSelectArgument = (arg) => {
    if (isPleadingConfirmed) return; // Verrouillé après confirmation
    sounds.playPop();
    setSelectedArgument(arg);
    setDefenseState('pleading');
    // Le juge et la cour restent neutres : aucun spoil visuel ou sonore
    setJudgeReaction('neutral');
  };

  // Confirmation solennelle de la plaidoirie devant la Cour : MOMENT DE L'ÉVALUATION ET DE LA RÉVÉLATION
  const handleConfirmPleading = () => {
    if (!selectedArgument || isPleadingConfirmed) return;
    setIsPleadingConfirmed(true);
    sounds.stopAllVoice();

    if (selectedArgument.isCorrect) {
      // 1. Révélation Favorable : Sourire approbateur du Juge + Hochement de tête 3D
      setJudgeReaction('smile');
      setCameraView('JUDGE');
      setWitnessState('confident');
      setProsecutorState('idle');
      sounds.playSuccess();
      sounds.playAudioFile('/audio/voices/proces_judge_approbation.mp3', 1.0);

      // Le public applaudit et acclame la défense !
      setAudienceState('cheer');
      setAudienceShoutText('Public : « 👏 Bravo ! C\'est la vérité ! »');
      sounds.playPublicCheer();
      setTimeout(() => {
        setAudienceState('idle');
        setAudienceShoutText('');
      }, 4500);

      setJudgeConviction(prev => Math.min(100, prev + selectedArgument.gain));
      setCriticalScore(prev => Math.min(100, prev + 10));
      setProsecutorPanic(prev => Math.min(100, prev + 15));

      setElementsProven(prev => ({
        ...prev,
        [currentAssault.requiredType]: true
      }));

      // Réaction de Maxime après approbation (Timer sécurisé React indépendant du gestionnaire vocal)
      setTimeout(() => {
        setStage('reaction');
        setCameraView('WITNESS');
        setWitnessState('confident');
        sounds.playAudioFile(`/audio/voices/${currentAssault.maximeVoice}.mp3`, 1.0);
      }, 2000);
    } else {
      // 2. Révélation Défavorable : Moue réprobatrice du Juge + Coup de marteau + Rejet
      setJudgeReaction('frown');
      setJudgeState('gavel');
      setCameraView('JUDGE');
      setWitnessState('stressed');
      setProsecutorState('attacking');
      sounds.playWrong();
      sounds.playGavelStrike();
      sounds.playAudioFile('/audio/voices/proces_judge_reprimande.mp3', 1.0);

      // Le public hue la mauvaise défense !
      setAudienceState('boo');
      setAudienceShoutText('Public : « 👎 Bouuuuh ! C\'est lamentable ! »');
      sounds.playPublicBoo();
      setTimeout(() => {
        setAudienceState('idle');
        setAudienceShoutText('');
      }, 4500);

      setJudgeConviction(prev => Math.max(5, prev + selectedArgument.gain));
      setCriticalScore(prev => Math.max(5, prev - 8));
      setProsecutorPanic(prev => Math.max(0, prev - 12));

      // Le motif est définitivement ÉCARTÉ du grand livre
      setElementsProven(prev => ({
        ...prev,
        [currentAssault.requiredType]: false
      }));

      // Basculer vers l'écran de réprimande judiciaire (Timer sécurisé React indépendant du gestionnaire vocal)
      setTimeout(() => {
        setStage('reaction_fail');
        setCameraView('JUDGE');
        setJudgeState('speaking');
        // Sécurité : apaiser le Juge après son intervention pour ne pas bloquer la scène
        setTimeout(() => {
          setJudgeState('idle');
          setCameraView('TV_WIDE');
        }, 3200);
      }, 2200);
    }
  };

  // Passer à l'assaut suivant ou démarrer la grande cinématique du Juge
  const handleNextAssault = () => {
    sounds.stopAllVoice();
    setSelectedArgument(null);
    setIsPleadingConfirmed(false);
    setCurrentEvidenceReady(null);
    setJudgeReaction('neutral');

    if (currentAssaultIdx < ASSAULTS.length - 1) {
      setCurrentAssaultIdx(prev => prev + 1);
      setStage('attack');
      setCameraView('PROSECUTION');
      setProsecutorState('attacking');
      setWitnessState('idle');
      setDefenseState('idle');
      sounds.playCourtroomMurmur(2.8);
      sounds.playAudioFile(`/audio/voices/${ASSAULTS[currentAssaultIdx + 1].prosecutorVoice}.mp3`, 1.0, false, () => {
        setProsecutorState('idle');
        setCameraView('TV_WIDE');
      });
    } else {
      // Lancement de la CINÉMATIQUE FINALE DU JUGE
      setStage('verdict_cinematic');
      setCameraView('JUDGE');
      setJudgeState('speaking');
      setCinematicStep(0);
      sounds.playGavelStrike();
      sounds.playAudioFile('/audio/voices/proces_judge_cinematic_intro.mp3', 1.0);
    }
  };

  // Avancement séquentiel des éléments dans la cinématique finale du Juge
  const handleAdvanceCinematic = () => {
    sounds.stopAllVoice();
    const nextStep = cinematicStep + 1;
    setCinematicStep(nextStep);

    const stepVoiceMap = {
      1: 'proces_judge_cinematic_eco_ok',
      2: 'proces_judge_cinematic_data_ok',
      3: 'proces_judge_cinematic_cognition_ok',
      4: 'proces_judge_cinematic_jobs_ok',
      5: 'proces_judge_cinematic_sovereignty_ok',
      6: 'proces_judge_cinematic_propaganda_ok'
    };

    if (nextStep >= 1 && nextStep <= 6) {
      sounds.playAudioFile(`/audio/voices/${stepVoiceMap[nextStep]}.mp3`, 1.0);
    } else if (nextStep === 7) {
      // Proclamation finale solennelle avec marteau de justice
      setJudgeState('gavel');
      sounds.playGavelStrike();
      const provenCount = Object.values(elementsProven).filter(Boolean).length;
      const isInnocent = provenCount >= 4 || judgeConviction >= 65;

      const finalVoice = isInnocent ? 'proces_judge_cinematic_innocent' : 'proces_judge_cinematic_guilty';
      setTimeout(() => {
        sounds.playAudioFile(`/audio/voices/${finalVoice}.mp3`, 1.0);
        if (isInnocent) {
          confetti({ particleCount: 160, spread: 110, origin: { y: 0.6 } });
        }
      }, 900);
    }
  };

  const provenCount = Object.values(elementsProven).filter(Boolean).length;
  const isFinalInnocent = provenCount >= 4 || judgeConviction >= 65;

  return (
    <div className={isFullscreen 
      ? "fixed inset-0 z-50 bg-[#060913] p-4 sm:p-6 flex flex-col gap-3 font-['Lexend'] animate-in fade-in select-none overflow-hidden" 
      : "w-full h-full flex flex-col gap-3 font-['Lexend'] animate-in fade-in select-none"
    }>
      {/* Top Bar : Statut du Grand Procès de l'Éthique IA */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white shadow-lg shadow-rose-500/20">
            <Scale className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AFFAIRE DU BLACKOUT 24H · COUR D'ASSISES NUMÉRIQUE
              </span>
              <h2 className="font-['Outfit'] font-black text-sm sm:text-base text-white">
                Maxime c. Ministère Public (Procureur du Roi)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400">
              Vous incarnez : <span className="text-cyan-300 font-bold">Me Alex (Avocat de la Défense)</span> · Prévenu : <span className="text-emerald-300 font-semibold">Maxime</span>
            </p>
          </div>
        </div>

        {/* Jauges en Direct & Bouton Plein Écran */}
        <div className="flex items-center gap-3">
          {/* Bouton Briefing Officiel d'Aurore (Scénario & Règles) */}
          <button
            onClick={() => {
              sounds.playPop();
              setShowBriefing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-200 transition cursor-pointer shadow-md"
            title="Briefing d'Aurore : Scénario du Tribunal, Enjeu & Règles"
          >
            <span>ℹ️</span>
            <span className="hidden sm:inline">Briefing Aurore</span>
          </button>

          {/* Bouton Chahut du Public & Menace d'évacuation par le Juge */}
          <button
            onClick={triggerAudienceUproarAndJudgeSilence}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 transition cursor-pointer shadow-md"
            title="Le public se soulève en criant 'Libérez Maxime !' et le Juge tape du marteau pour menacer d'évacuer la salle"
          >
            <span>📢</span>
            <span className="hidden sm:inline">Chahut du Public</span>
          </button>

          {/* Bouton Plein Écran */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-mono font-bold text-indigo-300 transition cursor-pointer shadow-md"
            title={isFullscreen ? "Quitter le Plein Écran" : "Passer en Plein Écran"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" /> Quitter Plein Écran
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> Plein Écran
              </>
            )}
          </button>

          {/* Conviction du Juge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <Gavel className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
                <span>Conviction du Juge</span>
                <span className={judgeConviction >= 65 ? 'text-emerald-400 font-black' : 'text-amber-400'}>{judgeConviction}%</span>
              </div>
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    judgeConviction >= 65 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-rose-500'
                  }`}
                  style={{ width: `${judgeConviction}%` }}
                />
              </div>
            </div>
          </div>

          {/* Éléments prouvés */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">{provenCount} / 6 Motifs prouvés</span>
          </div>

          {/* Stress du Procureur */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
            <span className="text-xs font-mono font-bold text-rose-300">Procureur : {prosecutorPanic}% panique</span>
          </div>
        </div>
      </div>

      {/* Zone Centrale : Scène 3D (Three.js) + Pupitre Judiciaire QCM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[500px] lg:min-h-[560px]">
        {/* Scène 3D Three.js avec expressions et caméras dynamiques (Largeur renforcée plein écran) */}
        <div className="lg:col-span-7 xl:col-span-8 h-[360px] sm:h-[420px] lg:h-full relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <Courtroom3DCanvas
            currentCaseIdx={0}
            witnessState={witnessState}
            prosecutorState={prosecutorState}
            defenseState={defenseState}
            judgeState={judgeState}
            judgeReaction={judgeReaction}
            audienceState={audienceState}
            audienceShoutText={audienceShoutText}
            cameraView={cameraView}
            onCameraChange={(view) => setCameraView(view)}
            onGavelComplete={() => setJudgeState('idle')}
          />

          {/* Badge caméra TV */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[11px] font-mono text-cyan-300">
            {cameraView === 'PROSECUTION' && '🎥 Plan Serré : Réquisitoire du Procureur'}
            {cameraView === 'DEFENSE' && '🎥 Plan Épaule : Plaidoirie de la Défense (Vous)'}
            {cameraView === 'WITNESS' && '🎥 Plan Barre : Témoignage de Maxime'}
            {cameraView === 'JUDGE' && '⚖️ Plan Solennel : Présidence du Tribunal'}
            {cameraView === 'TV_WIDE' && '📡 Vue Globale de l Audience'}
            {cameraView === 'AUDIENCE' && '👥 Plan Serré : Banc & Réactions du Public'}
          </div>
        </div>

        {/* Pupitre d'Intervention Judiciaire QCM (4 colonnes sur grand écran) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 h-full overflow-y-auto pr-1">
          {/* =========================================================================
              ÉTAPE 0 : INTRODUCTION
          ========================================================================= */}
          {stage === 'intro' && (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between h-full gap-4 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Scale className="w-4 h-4" /> Ouverture de l'Audience
                  </span>
                </div>

                <h3 className="font-['Outfit'] font-black text-lg text-white">
                  Le Procès du Crash des 24h
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Hier matin, l'étudiant <strong>Maxime</strong> a injecté un script d'arrêt d'urgence paralysant 100% des IA du campus durant 24 heures consécutives.
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="text-rose-400 font-bold">L'Accusation (Procureur du Roi) :</div>
                  <p>Réclame un mandat de dépôt et son incarcération immédiate pour trouble grave à l'ordre public et cyber-sabotage.</p>
                  <div className="text-cyan-400 font-bold pt-1">Votre Mission (Avocat de la Défense) :</div>
                  <p>Invoquer les bons arguments parmi les QCM pour convaincre le juge (observez ses sourires et ses moues en direct !).</p>
                </div>
              </div>

              <button
                onClick={handleStartTrial}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs font-mono uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                Ouvrir les Débats Judiciaires →
              </button>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 1 : ASSAUT DU PROCUREUR DU ROI
          ========================================================================= */}
          {stage === 'attack' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-rose-900/40 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" /> {currentAssault.title}
                  </span>
                  <button
                    onClick={() => {
                      sounds.stopAllVoice();
                      setCameraView('PROSECUTION');
                      setProsecutorState('attacking');
                      sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0, false, () => {
                        setProsecutorState('idle');
                        setCameraView('TV_WIDE');
                      });
                    }}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Réécouter le réquisitoire complet"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-100 text-xs sm:text-sm font-serif italic leading-relaxed shadow-inner">
                  {currentAssault.prosecutorQuote}
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-300 block mb-1">Stratégie de l'Accusation :</span>
                  {currentAssault.charge}
                </div>
              </div>

              <button
                onClick={handleOpenForensics}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Inspecter les Preuves d'Expertise Numérique →
              </button>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 2 : INVESTIGATION TECHNIQUE & NUMÉRIQUE
          ========================================================================= */}
          {stage === 'investigation' && (
            <div className="flex flex-col gap-3 h-full animate-in fade-in">
              <CourtroomHackingTools
                currentAssaultIdx={currentAssaultIdx}
                onEvidenceReady={handleEvidenceReady}
                evidenceUnlocked={Boolean(currentEvidenceReady)}
              />

              {currentEvidenceReady && (
                <button
                  onClick={handleStartPleading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/25 animate-bounce"
                >
                  <Gavel className="w-4 h-4" /> Ouvrir le QCM de Plaidoirie !
                </button>
              )}
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 3 : SYSTÈME DE CHOIX MULTIPLE (QCM À 4 OPTIONS)
          ========================================================================= */}
          {stage === 'pleading' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    Plaidoirie de la Défense (4 Options)
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">
                    Preuve : {currentEvidenceReady?.title}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Sélectionnez votre ligne de défense puis soumettez-la solennellement au Tribunal :
                </p>

                <div className="space-y-2.5">
                  {currentAssault.arguments.map((arg, idx) => {
                    const isSelected = selectedArgument?.id === arg.id;
                    const letterBadges = ['A', 'B', 'C', 'D'];

                    // Styles strictement neutres avant confirmation (zéro indice rouge/vert)
                    let cardStyle = 'bg-slate-950/90 hover:bg-slate-800/80 border-slate-800 text-slate-300';
                    let badgeStyle = 'bg-slate-800 text-slate-300';

                    if (isSelected && !isPleadingConfirmed) {
                      cardStyle = 'bg-indigo-950/70 border-indigo-500 text-indigo-100 ring-2 ring-indigo-500/40 shadow-xl';
                      badgeStyle = 'bg-indigo-600 text-white font-bold';
                    } else if (isSelected && isPleadingConfirmed) {
                      if (arg.isCorrect) {
                        cardStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50 shadow-xl';
                        badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
                      } else {
                        cardStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500/50 shadow-xl';
                        badgeStyle = 'bg-rose-500 text-white font-black';
                      }
                    }

                    return (
                      <div
                        key={arg.id}
                        onClick={() => handleSelectArgument(arg)}
                        className={`p-3.5 rounded-2xl border transition-all text-left relative ${
                          isPleadingConfirmed ? 'cursor-default' : 'cursor-pointer'
                        } ${cardStyle}`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] ${badgeStyle}`}>
                              {letterBadges[idx]}
                            </span>
                            <span className="text-slate-100 font-semibold">{arg.title}</span>
                          </div>

                          {/* Statut neutre avant confirmation / Révélé après délibération */}
                          {isSelected && !isPleadingConfirmed && (
                            <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/40">
                              Ligne Sélectionnée
                            </span>
                          )}
                          {isSelected && isPleadingConfirmed && (
                            arg.isCorrect ? (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Favorable au Juge (+15%)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/50">
                                <AlertTriangle className="w-3.5 h-3.5" /> Moue Réprobatrice (-5%)
                              </span>
                            )
                          )}
                        </div>

                        <p className="text-[12px] opacity-85 font-sans leading-relaxed pl-7">
                          {arg.text}
                        </p>

                        {/* Révélation du verdict et feedback UNIQUEMENT après confirmation */}
                        {isSelected && isPleadingConfirmed && (
                          <p className={`mt-2 ml-7 text-[11px] font-mono font-bold border-t border-slate-700/50 pt-1.5 ${
                            arg.isCorrect ? 'text-emerald-300' : 'text-rose-300'
                          }`}>
                            {arg.feedback}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bouton d'Action : Complètement neutre avant confirmation */}
              {selectedArgument && !isPleadingConfirmed && (
                <div className="pt-2 border-t border-slate-800 animate-in fade-in">
                  <button
                    onClick={handleConfirmPleading}
                    className="w-full py-3.5 rounded-2xl font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-lg bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-600/30"
                  >
                    <Scale className="w-4 h-4" /> Plaider cette ligne de défense devant la Cour →
                  </button>
                </div>
              )}

              {/* Message de délibération pendant l'évaluation */}
              {isPleadingConfirmed && (
                <div className="pt-2 border-t border-slate-800 animate-in fade-in">
                  <div className={`w-full py-3 rounded-2xl font-mono text-xs font-bold uppercase text-center flex items-center justify-center gap-2 border ${
                    selectedArgument.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                  }`}>
                    {selectedArgument.isCorrect
                      ? '⚖️ Délibération : Argument Validé par le Tribunal...'
                      : '⚖️ Délibération : Objection Retenue par la Cour...'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 4 : TÉMOIGNAGE DE MAXIME APRÈS APPROBATION DU JUGE
          ========================================================================= */}
          {stage === 'reaction' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Maxime à la Barre (Lanceur d'Alerte)
                  </span>
                  <button
                    onClick={() => sounds.playAudioFile(`/audio/voices/${currentAssault.maximeVoice}.mp3`, 1.0)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 text-xs sm:text-sm font-serif italic leading-relaxed">
                  {currentAssault.maximeDefenseQuote}
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Sourire du Juge : Motif retenu au grand livre !
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Le Procureur du Roi est déstabilisé. L'accusation recule sur ce point.
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextAssault}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {currentAssaultIdx < ASSAULTS.length - 1 ? (
                  <>Passer à l'Assaut Suivant ({currentAssaultIdx + 2}/6) <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>⚖️ Lancer la Cinématique du Jugement !</>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 4 BIS : RÉPRIMANDE JUDICIAIRE LORS D'UN MAUVAIS CHOIX DE DÉFENSE
          ========================================================================= */}
          {stage === 'reaction_fail' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-rose-500/40 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" /> Rejet du Moyen par le Tribunal
                  </span>
                  <button
                    onClick={() => sounds.playAudioFile('/audio/voices/proces_judge_reprimande.mp3', 1.0)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-100 text-xs sm:text-sm font-serif italic leading-relaxed">
                  « Maître, cet argument est irrecevable et dessert la cause de votre client ! La Cour écarte catégoriquement ce moyen. »
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Moue Réprobatrice du Juge : Motif non retenu au grand livre (-5%)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Le Procureur du Roi jubile : <em>« L'accusation marque un point ! L'incarcération pour trouble à l'ordre public se rapproche ! »</em>
                  </p>
                  <p className="text-[10px] text-amber-300 font-mono">
                    ⚠️ Maxime serre les poings à la barre, inquiet pour l'issue de son procès.
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextAssault}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
              >
                {currentAssaultIdx < ASSAULTS.length - 1 ? (
                  <>Encaisser le Rejet & Passer à l'Assaut Suivant ({currentAssaultIdx + 2}/6) <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>⚖️ Aller au Verdict Final du Tribunal !</>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 5 : CINÉMATIQUE SÉQUENTIELLE DU VERDICT DU JUGE
          ========================================================================= */}
          {stage === 'verdict_cinematic' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/40 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Gavel className="w-4 h-4" /> Cinématique du Délibéré du Juge
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Étape {cinematicStep + 1} / 8
                  </span>
                </div>

                {/* ÉTAPE 0 : INTRODUCTION DU JUGE */}
                {cinematicStep === 0 && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed space-y-2">
                    <div className="font-['Outfit'] font-bold text-amber-300 text-base not-italic">
                      « Silence dans la salle ! La Cour a délibéré. »
                    </div>
                    <p>
                      « Voici la lecture intégrale des motifs ayant guidé l'arrêt du Tribunal sur les six questions fondamentales posées par ce procès... »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 1 : ÉCOLOGIE */}
                {cinematicStep === 1 && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif italic leading-relaxed space-y-2 ${
                    elementsProven.eco ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                  }`}>
                    <div className="font-['Outfit'] font-bold text-xs not-italic font-mono uppercase tracking-wider flex items-center gap-2">
                      {elementsProven.eco ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      1. Motif Écologique & Climat : {elementsProven.eco ? 'RETENU' : 'ÉCARTÉ'}
                    </div>
                    <p>
                      « Attendu que gaspiller 48 500 L d'eau potable pour des prompts futiles caractérise une dérive écologique majeure, le Tribunal retient le bien-fondé de l'alerte environnementale. »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 2 : DONNÉES RGPD */}
                {cinematicStep === 2 && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif italic leading-relaxed space-y-2 ${
                    elementsProven.data ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                  }`}>
                    <div className="font-['Outfit'] font-bold text-xs not-italic font-mono uppercase tracking-wider flex items-center gap-2">
                      {elementsProven.data ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      2. Motif Protection des Données : {elementsProven.data ? 'RETENU' : 'ÉCARTÉ'}
                    </div>
                    <p>
                      « Attendu que l'aspiration clandestine de travaux étudiants vers des serveurs californiens violait l'Article 44 du RGPD, la défense a prouvé l'utilité du blocage conservatoire. »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 3 : COGNITION */}
                {cinematicStep === 3 && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif italic leading-relaxed space-y-2 ${
                    elementsProven.cognition ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                  }`}>
                    <div className="font-['Outfit'] font-bold text-xs not-italic font-mono uppercase tracking-wider flex items-center gap-2">
                      {elementsProven.cognition ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      3. Motif Autonomie Cognitive : {elementsProven.cognition ? 'RETENU' : 'ÉCARTÉ'}
                    </div>
                    <p>
                      « Attendu que le rôle d'une Haute École est de cultiver l'esprit critique libre et non de favoriser l'atrophie intellectuelle humaine par délégation aveugle à la machine. »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 4 : EMPLOI */}
                {cinematicStep === 4 && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif italic leading-relaxed space-y-2 ${
                    elementsProven.jobs ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                  }`}>
                    <div className="font-['Outfit'] font-bold text-xs not-italic font-mono uppercase tracking-wider flex items-center gap-2">
                      {elementsProven.jobs ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      4. Motif Emploi Humain (Profs & Secrétaires) : {elementsProven.jobs ? 'RETENU' : 'ÉCARTÉ'}
                    </div>
                    <p>
                      « Attendu que la liquidation clandestine de 25 postes humains au profit de chatbots déshumanise l'institution et justifie la révélation d'intérêt public. »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 5 : SOUVERAINETÉ */}
                {cinematicStep === 5 && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif italic leading-relaxed space-y-2 ${
                    elementsProven.sovereignty ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                  }`}>
                    <div className="font-['Outfit'] font-bold text-xs not-italic font-mono uppercase tracking-wider flex items-center gap-2">
                      {elementsProven.sovereignty ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      5. Motif Souveraineté face aux Multinationales : {elementsProven.sovereignty ? 'RETENU' : 'ÉCARTÉ'}
                    </div>
                    <p>
                      « Attendu que la dépendance cognitive envers des oligopoles privés américains ou chinois aliène notre démocratie et notre indépendance de pensée. »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 6 : PROPAGANDE */}
                {cinematicStep === 6 && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif italic leading-relaxed space-y-2 ${
                    elementsProven.propaganda ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100' : 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                  }`}>
                    <div className="font-['Outfit'] font-bold text-xs not-italic font-mono uppercase tracking-wider flex items-center gap-2">
                      {elementsProven.propaganda ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      6. Motif Propagande & Bulles de Filtre : {elementsProven.propaganda ? 'RETENU' : 'ÉCARTÉ'}
                    </div>
                    <p>
                      « Attendu que le formatage algorithmique d'opinion et la censure des controverses scientifiques menaçaient le débat démocratique au sein du campus. »
                    </p>
                  </div>
                )}

                {/* ÉTAPE 7 : PROCLAMATION FINALE DU VERDICT */}
                {cinematicStep === 7 && (
                  <div className="text-center py-2 space-y-3">
                    <div className={`inline-flex p-3 rounded-2xl border ${
                      isFinalInnocent ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}>
                      {isFinalInnocent ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                    </div>

                    <h3 className={`font-['Outfit'] font-black text-xl ${
                      isFinalInnocent ? 'text-emerald-300' : 'text-rose-300'
                    }`}>
                      {isFinalInnocent ? 'MAXIME EST PLEINEMENT INNOCENT ET ACQUITTÉ !' : 'CULPABILITÉ RETENUE (MOTIFS INSUFFISANTS)'}
                    </h3>

                    <p className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                      {provenCount} sur 6 piliers d'esprit critique validés par la Cour
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-serif italic text-left">
                      {isFinalInnocent ? (
                        "« En conséquence, au vu de l'ensemble de ces motifs déterminants et de l'état de nécessité caractérisé, la Cour déclare Maxime pleinement innocent et lui confère le statut de lanceur d'alerte d'intérêt public. Que justice soit faite ! »"
                      ) : (
                        "« En conséquence, la défense n'ayant pas su établir la proportionnalité de l'acte face au trouble grave causé au campus, la Cour déclare le prévenu coupable de cyber-sabotage et ordonne un mandat de dépôt pour trouble caractérisé à l'ordre public ! »"
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton de progression dans la cinématique */}
              {cinematicStep < 7 ? (
                <button
                  onClick={handleAdvanceCinematic}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {cinematicStep === 0 ? "Écouter l'énoncé des motifs →" : `Passer au motif suivant (${cinematicStep + 1}/6) →`}
                </button>
              ) : isFinalInnocent ? (
                isKeyClaimed ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-center space-y-1.5 animate-in zoom-in-95">
                    <div className="text-emerald-400 font-bold text-xs font-mono flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Clé Beta Déverrouillée !
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Validation enregistrée. Retour vers le plan d'orientation du campus...
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsKeyClaimed(true);
                      sounds.stopAllVoice();
                      sounds.playVictory();
                      if (onComplete) onComplete();
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30 animate-bounce"
                  >
                    ✨ Récupérer la Clé Beta (Intégrité & Éthique) →
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    sounds.stopAllVoice();
                    setCurrentAssaultIdx(0);
                    setJudgeConviction(25);
                    setStage('attack');
                    setCameraView('PROSECUTION');
                    setCinematicStep(0);
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Reprendre le Procès avec de Meilleurs Arguments
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Briefing Officiel d'Aurore (Scénario de l'Escape Game, Enjeu & Règles) */}
      <AuroreGameBriefingModal
        gameId="tribunal"
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
      />
    </div>
  );
}
