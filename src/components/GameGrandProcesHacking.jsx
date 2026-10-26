import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Gavel, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
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
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Courtroom3DCanvas from './Courtroom3DCanvas';
import CourtroomHackingTools from './CourtroomHackingTools';
import { sounds } from '../utils/soundEffects';

/**
 * GameGrandProcesHacking:
 * Le Grand Procès de l'Éthique IA : « L'Affaire du Blackout de 24h ».
 * Le joueur incarne l'Avocat de la Défense (Me Alex) et défend l'étudiant Maxime,
 * qui a fait crasher tous les systèmes IA du campus pendant 24h pour alerter la communauté.
 * 
 * Affronte les 6 assauts du Procureur du Roi avec les 6 arguments d'esprit critique :
 * 1. Écologie (refroidissement & mégawatts)
 * 2. Données & RGPD (exfiltration vers serveurs tiers)
 * 3. Prise de pouvoir de l'IA & atrophie cognitive
 * 4. Remplacement des emplois (professeurs & secrétaires)
 * 5. Monopole des multinationales US et chinoises
 * 6. Propagande & bulles d'information
 */
export default function GameGrandProcesHacking({ onComplete }) {
  const [currentAssaultIdx, setCurrentAssaultIdx] = useState(0);
  const [stage, setStage] = useState('intro'); // 'intro' | 'attack' | 'investigation' | 'pleading' | 'reaction' | 'verdict'
  const [cameraView, setCameraView] = useState('TV_WIDE');

  // États 3D
  const [witnessState, setWitnessState] = useState('idle'); // 'idle' | 'speaking' | 'stressed' | 'confident'
  const [prosecutorState, setProsecutorState] = useState('idle'); // 'idle' | 'speaking' | 'attacking'
  const [defenseState, setDefenseState] = useState('idle'); // 'idle' | 'pleading'
  const [judgeState, setJudgeState] = useState('idle'); // 'idle' | 'speaking' | 'gavel'

  // Jauges judiciaires
  const [judgeConviction, setJudgeConviction] = useState(25); // 0 à 100%
  const [criticalScore, setCriticalScore] = useState(50);
  const [prosecutorPanic, setProsecutorPanic] = useState(10);
  const [currentEvidenceReady, setCurrentEvidenceReady] = useState(null);
  const [selectedArgument, setSelectedArgument] = useState(null);
  const [assaultResolved, setAssaultResolved] = useState([false, false, false, false, false, false]);

  const ASSAULTS = [
    {
      id: 'assault_1',
      title: 'Assaut 1/6 : Sabotage Énergétique & Désorganisation',
      prosecutorVoice: 'proces_procureur_assaut_1',
      maximeVoice: 'proces_maxime_defense_1',
      charge: 'Le Procureur accuse Maxime d avoir paralysé l infrastructure par pur vandalisme d adolescent.',
      prosecutorQuote: "« Monsieur le Juge ! Ce prévenu a coupé brutalement les serveurs du campus en pleine semaine de cours ! Il a causé une désorganisation totale par pur vandalisme ! Je réclame l'exclusion définitive immédiate ! »",
      maximeDefenseQuote: "« Ce n'était pas du vandalisme. Regardez les compteurs : en seulement 24 heures sans IA, le campus a économisé 45 000 litres d'eau de refroidissement et des mégawatts d'électricité gaspillés pour des requêtes futiles ! »",
      requiredType: 'eco',
      arguments: [
        {
          id: 'arg_eco',
          type: 'eco',
          title: '🌿 Argument Écologique & Climat',
          text: "Prouver l'état de nécessité environnementale : le cluster LLM du campus vaporisait 48 500 L d'eau potable et 14 200 kWh par semaine pour des tâches dérisoires.",
          isCorrect: true,
          gain: 15,
          feedback: "Plaidoirie imparable ! Le Juge reconnaît que l'urgence climatique justifie un signal d'alarme proportionné."
        },
        {
          id: 'arg_fatigue',
          type: 'weak',
          title: '😴 Argument du Droit au Repos',
          text: "Plaider que mon client et ses camarades étaient fatigués du blocus et avaient besoin de dormir une journée.",
          isCorrect: false,
          gain: -5,
          feedback: "Rejeté par la Cour ! La fatigue individuelle n'est pas un motif de blackout général."
        }
      ]
    },
    {
      id: 'assault_2',
      title: 'Assaut 2/6 : Violation de Réseau & Piratage Illégal',
      prosecutorVoice: 'proces_procureur_assaut_2',
      maximeVoice: 'proces_maxime_defense_2',
      charge: 'Le Procureur soutient que Maxime a fracturé la sécurité de l école au mépris du droit informatique.',
      prosecutorQuote: "« Mensonge ! Cet individu a violé les réseaux internes de l'école ! En s'introduisant dans les pare-feux, il a mis en péril la sécurité informatique de notre institution ! »",
      maximeDefenseQuote: "« J'ai au contraire protégé nos camarades ! J'ai découvert que les travaux, les thèses et même les données de santé des étudiants étaient aspirés en continu vers des serveurs tiers en Californie sans consentement ! »",
      requiredType: 'data',
      arguments: [
        {
          id: 'arg_data',
          type: 'data',
          title: '🛡️ Argument de Protection des Données & RGPD',
          text: "Démontrer que l'arrêt d'urgence a stoppé une exfiltration massive et illégale des mémoires étudiants vers des serveurs tiers en Californie sans consentement RGPD.",
          isCorrect: true,
          gain: 15,
          feedback: "Impact maximal ! Le Juge note la violation de l'Article 44 du RGPD par l'infrastructure du campus."
        },
        {
          id: 'arg_bug',
          type: 'weak',
          title: '🐛 Argument de la Faille Matérielle',
          text: "Soutenir que les pare-feux de l'école étaient mal configurés et que c'est la faute de l'administrateur système.",
          isCorrect: false,
          gain: -5,
          feedback: "Inopérant ! Une serrure fragile n'autorise pas l'effraction."
        }
      ]
    },
    {
      id: 'assault_3',
      title: 'Assaut 3/6 : Privation d Outils Pédagogiques & Chaos',
      prosecutorVoice: 'proces_procureur_assaut_3',
      maximeVoice: 'proces_maxime_defense_3',
      charge: 'Le Procureur prétend que les étudiants étaient perdus et incapables de travailler sans les assistants IA.',
      prosecutorQuote: "« Sans nos assistants virtuels, les étudiants étaient totalement désemparés ! Il a brisé la continuité pédagogique et privé notre jeunesse du progrès moderne ! »",
      maximeDefenseQuote: "« Désemparés ? Ou enfin libérés ? Les étudiants ne savaient même plus écrire trois phrases sans prompter une machine ! Pendant ces 24 heures, ils se sont enfin reparlé, ils ont réouvert des livres et réactivé leur propre esprit critique ! »",
      requiredType: 'cognitive',
      arguments: [
        {
          id: 'arg_cognitive',
          type: 'cognitive',
          title: '🧠 Argument de la Prise de Pouvoir & Atrophie Cognitive',
          text: "Prouver que l'IA devenait une aliénation cognitive totale privant les jeunes de leur capacité à penser par eux-mêmes ; le blackout a réactivé l'intelligence humaine et les débats.",
          isCorrect: true,
          gain: 15,
          feedback: "Magistral ! La Cour rappelle que le rôle d'une Haute École est de former des esprits libres, non des opérateurs de prompts."
        },
        {
          id: 'arg_retard',
          type: 'weak',
          title: '⏳ Argument du Report de Calendrier',
          text: "Dire que les professeurs n'avaient qu'à décaler les dates d'examens d'une journée.",
          isCorrect: false,
          gain: -5,
          feedback: "Objection retenue ! L'avocat ne peut s'arroger les prérogatives du conseil pédagogique."
        }
      ]
    },
    {
      id: 'assault_4',
      title: 'Assaut 4/6 : Frein à la Modernisation & Efficience RH',
      prosecutorVoice: 'proces_procureur_assaut_4',
      maximeVoice: 'proces_maxime_defense_4',
      charge: 'Le Procureur défend le projet Campus 2030 d automatisation rentable des services scolaires.',
      prosecutorQuote: "« L'établissement déployait un projet pilote d'efficience budgétaire d'avenir ! Ce sabotage a freiné la modernisation de notre institution ! »",
      maximeDefenseQuote: "« L'efficience budgétaire ? Parlons-en ! Le plan secret prévoyait de supprimer 25 postes de secrétaires et d'assistants pour les remplacer par des clones numériques ! Une université n'est pas une usine automatisée sans empathie ! »",
      requiredType: 'jobs',
      arguments: [
        {
          id: 'arg_jobs',
          type: 'jobs',
          title: '👥 Argument du Remplacement des Métiers Humains (Profs & Secrétaires)',
          text: "Révéler le plan secret de suppression de 25 postes de secrétaires, bibliothécaires et tuteurs ; l'automatisation sacrificielle détruit la dimension humaine indispensable à la transmission du savoir.",
          isCorrect: true,
          gain: 15,
          feedback: "Coup de théâtre ! Le public applaudit, le Juge ordonne le versement du mémo secret au dossier d'instruction."
        },
        {
          id: 'arg_prix',
          type: 'weak',
          title: '💸 Argument du Coût des Licences',
          text: "Affirmer que le logiciel était trop cher pour le budget de l'école.",
          isCorrect: false,
          gain: -5,
          feedback: "Hors sujet ! La gestion financière ne constitue pas un moyen de défense pénale."
        }
      ]
    },
    {
      id: 'assault_5',
      title: 'Assaut 5/6 : Refus du Progrès & Dépendance Technologique',
      prosecutorVoice: 'proces_procureur_assaut_5',
      maximeVoice: 'proces_maxime_defense_5',
      charge: 'Le Procureur invoque la puissance incontestable des géants technologiques mondiaux.',
      prosecutorQuote: "« Nous utilisons les meilleurs outils du marché mondial, conçus par les géants californiens et asiatiques. Pourquoi refuser cette puissance technologique ? »",
      maximeDefenseQuote: "« Parce que cela détruit notre souveraineté européenne ! Nous abandonnons nos cerveaux, notre culture et notre indépendance intellectuelle aux mains de multinationales privées qui ne cherchent que le monopole et le profit ! »",
      requiredType: 'sovereignty',
      arguments: [
        {
          id: 'arg_sovereignty',
          type: 'sovereignty',
          title: '🌍 Argument de Souveraineté & Impérialisme Numérique (US/Chine)',
          text: "Dénoncer la vassalisation intellectuelle européenne et l'abandon de notre autonomie stratégique à des conglomérats privés hors d'atteinte de la loi démocratique.",
          isCorrect: true,
          gain: 15,
          feedback: "Adhésion solennelle du Tribunal ! La souveraineté académique et culturelle est un bien commun inaliénable."
        },
        {
          id: 'arg_code',
          type: 'weak',
          title: '💻 Argument de la Préférence Open-Source Pure',
          text: "Plaider que Maxime voulait juste que l'école installe Linux et code son propre modèle en PHP.",
          isCorrect: false,
          gain: -5,
          feedback: "Argument trop technique et réducteur face aux enjeux géopolitiques."
        }
      ]
    },
    {
      id: 'assault_6',
      title: 'Assaut 6/6 : Trouble à l Ordre Public & Calomnie',
      prosecutorVoice: 'proces_procureur_assaut_6',
      maximeVoice: 'proces_maxime_defense_6',
      charge: 'Le Procureur tente un dernier coup de force en traitant Maxime d agitateur complotiste.',
      prosecutorQuote: "« Ce garçon est un agitateur qui distille le doute et la paranoïa sur le campus ! C'est un délit contre la vérité institutionnelle ! »",
      maximeDefenseQuote: "« La vérité ? L'algorithme enfermait chaque promotion dans des bulles d'information biaisées et censurait les contre-discours scientifiques ! Mon geste était un signal d'alarme pour sauver la démocratie universitaire ! »",
      requiredType: 'propaganda',
      arguments: [
        {
          id: 'arg_propaganda',
          type: 'propaganda',
          title: '📢 Argument de la Propagande & Bulles d Information Algorithmiques',
          text: "Prouver que l'IA campus formatait l'opinion des étudiants en censurant les données contradictoires et en créant des chambres d'écho destructrices du débat démocratique.",
          isCorrect: true,
          gain: 15,
          feedback: "Victoire de la Défense ! Le Procureur est réduit au silence, la vérité algorithmique est démontée."
        },
        {
          id: 'arg_humeur',
          type: 'weak',
          title: '🗣️ Argument de la Liberté d Expression Brute',
          text: "Dire que chacun a le droit de dire ce qu'il veut sans censure sur les réseaux.",
          isCorrect: false,
          gain: -5,
          feedback: "Insuffisant ! La liberté d'expression ne protège pas les actes de sabotage non motivés par l'intérêt général."
        }
      ]
    }
  ];

  const currentAssault = ASSAULTS[currentAssaultIdx];

  // Gestion du démarrage d'audience
  const handleStartTrial = () => {
    setStage('attack');
    setCameraView('PROSECUTION');
    setProsecutorState('attacking');
    sounds.stopAllVoice();
    sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0);
  };

  // Passage à la phase d'investigation
  const handleOpenForensics = () => {
    setStage('investigation');
    setCameraView('TV_WIDE');
    setProsecutorState('idle');
    sounds.stopAllVoice();
    sounds.playTensionHeartbeat();
  };

  // Réception de la preuve issue des outils médico-légaux
  const handleEvidenceReady = (ev) => {
    setCurrentEvidenceReady(ev);
  };

  // Lancement de la plaidoirie
  const handleStartPleading = () => {
    setStage('pleading');
    setCameraView('DEFENSE');
    setDefenseState('pleading');
    sounds.stopAllVoice();
    sounds.playObjectionImpact();
  };

  // Choix d'un argument par le joueur
  const handleSelectArgument = (arg) => {
    setSelectedArgument(arg);
    sounds.stopAllVoice();

    if (arg.isCorrect) {
      sounds.playSuccess();
      setJudgeConviction(prev => Math.min(100, prev + arg.gain));
      setCriticalScore(prev => Math.min(100, prev + 10));
      setProsecutorPanic(prev => Math.min(100, prev + 15));
      setAssaultResolved(prev => {
        const next = [...prev];
        next[currentAssaultIdx] = true;
        return next;
      });

      // Maxime prend la parole en 3D
      setStage('reaction');
      setCameraView('WITNESS');
      setWitnessState('confident');
      sounds.playAudioFile(`/audio/voices/${currentAssault.maximeVoice}.mp3`, 1.0);
    } else {
      sounds.playWrong();
      setJudgeConviction(prev => Math.max(10, prev + arg.gain));
      setCriticalScore(prev => Math.max(10, prev - 5));
    }
  };

  // Passer à l'assaut suivant ou au verdict final
  const handleNextAssault = () => {
    sounds.stopAllVoice();
    setSelectedArgument(null);
    setCurrentEvidenceReady(null);

    if (currentAssaultIdx < ASSAULTS.length - 1) {
      setCurrentAssaultIdx(prev => prev + 1);
      setStage('attack');
      setCameraView('PROSECUTION');
      setProsecutorState('attacking');
      setWitnessState('idle');
      setDefenseState('idle');
      sounds.playAudioFile(`/audio/voices/${ASSAULTS[currentAssaultIdx + 1].prosecutorVoice}.mp3`, 1.0);
    } else {
      // Déclenchement de la cinématique finale du Juge
      setStage('verdict');
      setCameraView('JUDGE');
      setJudgeState('gavel');
      setProsecutorState('idle');
      setWitnessState('confident');

      setTimeout(() => {
        sounds.playGavelStrike();
        const isInnocent = judgeConviction >= 65;
        const verdictVoice = isInnocent ? 'proces_judge_verdict_innocent' : 'proces_judge_verdict_guilty';
        sounds.playAudioFile(`/audio/voices/${verdictVoice}.mp3`, 1.0);

        if (isInnocent) {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }
      }, 1500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 font-['Lexend'] animate-in fade-in select-none">
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
              Vous incarnez : <span className="text-cyan-300 font-bold">Me Alex (Avocat de la Défense)</span> · Prévenu : <span className="text-emerald-300 font-semibold">Maxime (Lanceur d'alerte)</span>
            </p>
          </div>
        </div>

        {/* Jauges en Direct */}
        <div className="flex items-center gap-3">
          {/* Jauge de Conviction du Juge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <Gavel className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
                <span>Conviction du Juge</span>
                <span className={judgeConviction >= 65 ? 'text-emerald-400' : 'text-amber-400'}>{judgeConviction}%</span>
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

          {/* Score Esprit Critique */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold text-purple-300">{criticalScore} Esprit Critique</span>
          </div>

          {/* Affolement du Procureur */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
            <span className="text-xs font-mono font-bold text-rose-300">Procureur : {prosecutorPanic}% stress</span>
          </div>
        </div>
      </div>

      {/* Zone Centrale : Scène 3D (Three.js) + Pupitre de Plaidoirie et Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[460px]">
        {/* Scène 3D Three.js (7 colonnes sur Desktop) */}
        <div className="lg:col-span-7 h-[330px] sm:h-[400px] lg:h-full relative rounded-3xl overflow-hidden">
          <Courtroom3DCanvas
            currentCaseIdx={0}
            witnessState={witnessState}
            prosecutorState={prosecutorState}
            defenseState={defenseState}
            judgeState={judgeState}
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
          </div>
        </div>

        {/* Pupitre d'Intervention Judiciaire (5 colonnes) */}
        <div className="lg:col-span-5 flex flex-col gap-3 h-full overflow-y-auto pr-1">
          {/* =========================================================================
              ÉTAPE 0 : INTRODUCTION DE L'AUDIENCE
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
                  <p>Réclame l'exclusion immédiate et la prison ferme pour sabotage et cyber-terrorisme.</p>
                  <div className="text-cyan-400 font-bold pt-1">Votre Mission (Avocat de la Défense) :</div>
                  <p>Prouver l'état de nécessité et le statut de <strong>Lanceur d'Alerte</strong> en mobilisant les 6 arguments éthiques et critiques sur l'IA.</p>
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
                    onClick={() => sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Réécouter"
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
                Inspecter les Preuves Techniques Forensiques →
              </button>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 2 : INVESTIGATION FORENSIQUE & RECHERCHE DE PREUVES
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
                  <Gavel className="w-4 h-4" /> Porter la Réplique au Procureur !
                </button>
              )}
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 3 : PLAIDOIRIE DE LA DÉFENSE (CHOIX DES ARGUMENTS CRITIQUES)
          ========================================================================= */}
          {stage === 'pleading' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    Plaidoirie de la Défense (Me Alex)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Preuve prête : {currentEvidenceReady?.title}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Choisissez l'argument d'esprit critique percutant pour démolir l'accusation du Procureur du Roi :
                </p>

                <div className="space-y-2.5">
                  {currentAssault.arguments.map(arg => (
                    <div
                      key={arg.id}
                      onClick={() => handleSelectArgument(arg)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                        selectedArgument?.id === arg.id
                          ? arg.isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs mb-1">
                        <span>{arg.title}</span>
                        {selectedArgument?.id === arg.id && (
                          arg.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <p className="text-[11px] opacity-80 font-sans leading-relaxed">
                        {arg.text}
                      </p>
                      {selectedArgument?.id === arg.id && (
                        <p className="mt-2 text-[11px] font-mono font-bold text-amber-300 border-t border-slate-700/50 pt-1.5">
                          {arg.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 4 : RÉACTION DE MAXIME À LA BARRE & DÉSTABILISATION DU PROCUREUR
          ========================================================================= */}
          {stage === 'reaction' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Témoignage de Maxime (Lanceur d'Alerte)
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
                    <Sparkles className="w-3.5 h-3.5" /> Le Juge acquiesce et annote son grand livre !
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Le Procureur du Roi perd contenance. La légitimité du geste de Maxime est établie pour cet assaut.
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
                  <>⚖️ Demander la Clôture des Débats & le Jugement !</>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 5 : CINÉMATIQUE FINALE DU JUGE & ARRÊT SOLENNEL
          ========================================================================= */}
          {stage === 'verdict' && (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 flex flex-col justify-between h-full gap-4 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Gavel className="w-4 h-4" /> Arrêt Solennel de la Cour d'Assises Numérique
                  </span>
                </div>

                <div className="text-center py-2">
                  {judgeConviction >= 65 ? (
                    <div className="space-y-2">
                      <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="font-['Outfit'] font-black text-xl text-emerald-300">
                        MAXIME EST PLEINEMENT ACQUITTÉ !
                      </h3>
                      <p className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                        Reconnaissance de l'État de Nécessité & Statut de Lanceur d'Alerte
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-flex p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <h3 className="font-['Outfit'] font-black text-xl text-rose-300">
                        CONDAMNATION PRONONCÉE
                      </h3>
                      <p className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                        Arguments insuffisants pour caractériser l'état de nécessité
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-serif italic">
                  {judgeConviction >= 65 ? (
                    "« Attendu que l'arrêt temporaire de 24h a permis d'épargner les ressources écologiques, d'interrompre l'aspiration clandestine de données RGPD, d'empêcher la liquidation silencieuse d'emplois humains et de réveiller la pensée critique des étudiants face aux monopoles étrangers : La Cour ordonne l'acquittement immédiat de Maxime ! »"
                  ) : (
                    "« Attendu que la défense n'a pas su établir la proportionnalité entre le dommage causé aux cours et les motifs invoqués, la Cour retient l'infraction de cyber-entrave. »"
                  )}
                </div>
              </div>

              {judgeConviction >= 65 ? (
                <button
                  onClick={() => {
                    sounds.stopAllVoice();
                    sounds.playVictory();
                    if (onComplete) onComplete();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/30 animate-bounce"
                >
                  ✨ Récupérer la Clé Beta (Intégrité & Éthique) →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentAssaultIdx(0);
                    setJudgeConviction(30);
                    setStage('attack');
                    setCameraView('PROSECUTION');
                    sounds.stopAllVoice();
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Reprendre la Défense du Procès
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
