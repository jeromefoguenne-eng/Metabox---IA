import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  Users, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Play,
  Timer,
  Award,
  AlertTriangle,
  Scale,
  Flame,
  Radio,
  Send,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GameShow3D from './GameShow3D';
import { sounds } from '../utils/soundEffects';
import { 
  JUSTE_PRIX_QUESTIONS, 
  QUATRE_A_LA_SUITE_THEMES, 
  FACE_A_FACE_QUESTIONS 
} from '../data/grandConcoursData';

export default function GrandConcours3ManchesArena({
  onClose,
  onFinishGame
}) {
  // Navigation entre les 3 Manches : 'intro' | 'manche1_justeprix' | 'manche2_quatreasuite' | 'manche3_faceaface' | 'victoire' | 'defaite'
  const [currentRound, setCurrentRound] = useState('intro');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const [reaction, setReaction] = useState('speaking'); // 'idle' | 'speaking' | 'correct' | 'wrong' | 'victory'
  const [hostDialogue, setHostDialogue] = useState("🎙️ Henri : « Bienvenue sur le plateau du GRAND CONCOURS DE LA HECh ! Trois manches éliminatoires pour décrocher le titre suprême ! »");

  // Adversaires virtuels
  const [opponents, setOpponents] = useState([
    { id: 'lucas', name: 'Lucas', campus: 'Rivageois (Liège)', score: 0, avatar: '🎓', isEliminated: false },
    { id: 'manon', name: 'Manon', campus: 'Huy (Gestion)', score: 0, avatar: '📚', isEliminated: false },
    { id: 'alexandre', name: 'Alexandre', campus: 'Verviers (Informatique)', score: 0, avatar: '⚡', isEliminated: false },
    { id: 'sarah', name: 'Sarah', campus: 'Outremeuse (Santé)', score: 0, avatar: '🔬', isEliminated: false }
  ]);

  // =========================================================================
  // ÉTATS DE LA MANCHE 1 : LE JUSTE PRIX ACADÉMIQUE
  // =========================================================================
  const [m1QuestionIdx, setM1QuestionIdx] = useState(() => Math.floor(Math.random() * JUSTE_PRIX_QUESTIONS.length));
  const [m1UserEstimate, setM1UserEstimate] = useState(30);
  const [m1IsEvaluated, setM1IsEvaluated] = useState(false);
  const [m1Results, setM1Results] = useState(null);

  const currentJpQ = JUSTE_PRIX_QUESTIONS[m1QuestionIdx];

  // =========================================================================
  // ÉTATS DE LA MANCHE 2 : LE 4 À LA SUITE (STYLE QUESTIONS POUR UN CHAMPION)
  // =========================================================================
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [m2Streak, setM2Streak] = useState(0); // 0 à 4
  const [m2MaxStreak, setM2MaxStreak] = useState(0);
  const [m2QuestionIdx, setM2QuestionIdx] = useState(0);
  const [m2TimeLeft, setM2TimeLeft] = useState(45);
  const [m2IsPlaying, setM2IsPlaying] = useState(false);
  const [m2AnswerFeedback, setM2AnswerFeedback] = useState(null); // 'correct' | 'wrong'

  const currentTheme = QUATRE_A_LA_SUITE_THEMES.find(t => t.id === selectedThemeId);

  // Minuteur du 4 à la suite
  useEffect(() => {
    if (currentRound !== 'manche2_quatreasuite' || !m2IsPlaying || m2TimeLeft <= 0) return;

    const timer = setInterval(() => {
      setM2TimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleM2TimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound, m2IsPlaying, m2TimeLeft]);

  // =========================================================================
  // ÉTATS DE LA MANCHE 3 : LE FACE-À-FACE (DUEL AUX 4 CASES DESCENDANTES)
  // =========================================================================
  const [m3QuestionIdx, setM3QuestionIdx] = useState(0);
  const [m3ActiveClueLevel, setM3ActiveClueLevel] = useState(4); // 4 -> 3 -> 2 -> 1 points
  const [m3UserScore, setM3UserScore] = useState(0);
  const [m3OpponentScore, setM3OpponentScore] = useState(0);
  const [m3FinalistOpponent] = useState({ name: 'Alexandre', campus: 'Verviers', avatar: '⚡' });
  const [m3IsBuzzed, setM3IsBuzzed] = useState(false);
  const [m3BuzzerWinner, setM3BuzzerWinner] = useState(null); // 'user' | 'opponent'
  const [m3ShowOptions, setM3ShowOptions] = useState(false);
  const [m3RoundAnswered, setM3RoundAnswered] = useState(false);

  const currentFafQ = FACE_A_FACE_QUESTIONS[m3QuestionIdx % FACE_A_FACE_QUESTIONS.length];

  // Défilement automatique des indices du Face-à-Face (4 -> 3 -> 2 -> 1 points)
  useEffect(() => {
    if (currentRound !== 'manche3_faceaface' || m3IsBuzzed || m3RoundAnswered) return;

    const clueTimer = setInterval(() => {
      setM3ActiveClueLevel(prev => {
        if (prev > 1) {
          sounds.playPop();
          return prev - 1;
        }
        // Si personne n'a buzzé à 1 point, l'adversaire buzze parfois
        if (Math.random() < 0.6) {
          handleOpponentBuzz(1);
        }
        return 1;
      });
    }, 4500);

    return () => clearInterval(clueTimer);
  }, [currentRound, m3IsBuzzed, m3RoundAnswered, m3ActiveClueLevel]);

  // Initialisation sonore au montage
  useEffect(() => {
    sounds.playTheme('concours');
    const timer = setTimeout(() => {
      sounds.speakHost("Bienvenue au Grand Concours de la Haute École Charlemagne ! Trois manches pour la victoire !");
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Plein écran
  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // =========================================================================
  // LOGIQUE MANCHE 1 : VALIDATION DU JUSTE PRIX
  // =========================================================================
  const handleValidateJustePrix = () => {
    sounds.playPop();
    const target = currentJpQ.targetValue;
    const userDiff = Math.abs(m1UserEstimate - target);

    // Estimations des adversaires avec variance réaliste
    const oppEstimates = opponents.map(opp => {
      const variance = (Math.random() - 0.5) * (target * 0.5);
      const val = Math.max(1, Math.round(target + variance));
      return {
        ...opp,
        estimate: val,
        diff: Math.abs(val - target)
      };
    });

    const allParticipants = [
      { id: 'user', name: 'Vous (Candidat)', campus: 'HECh', avatar: '🌟', estimate: m1UserEstimate, diff: userDiff, isUser: true },
      ...oppEstimates
    ];

    allParticipants.sort((a, b) => a.diff - b.diff);

    // Les 3 meilleurs se qualifient (+ le joueur s'il est dans le top 3)
    const isUserQualified = allParticipants.findIndex(p => p.isUser) <= 2;

    setM1Results({
      target,
      allParticipants,
      isUserQualified
    });
    setM1IsEvaluated(true);

    if (isUserQualified) {
      setReaction('correct');
      sounds.playApplause();
      sounds.speakHost(`Bravo ! La valeur exacte était de ${target} ${currentJpQ.unit}. Vous êtes qualifié pour le Quatre à la suite !`);
      setHostDialogue(`🎙️ Henri : « Félicitations ! Votre estimation est brillante ! Vous faites partie des qualifiés pour le 4 À LA SUITE ! »`);
    } else {
      setReaction('wrong');
      sounds.playWrong();
      sounds.speakHost(`Aïe ! La valeur exacte était de ${target} ${currentJpQ.unit}. Vos adversaires ont été plus précis.`);
      setHostDialogue(`🎙️ Henri : « Malheureusement, vos concurrents ont été plus proches de la valeur exacte de ${target}. Retentez votre chance ! »`);
    }
  };

  // Passer à la Manche 2
  const handleStartManche2 = () => {
    sounds.playPop();
    sounds.playTheme('champion');
    setCurrentRound('manche2_quatreasuite');
    setReaction('speaking');
    setM2Streak(0);
    setM2MaxStreak(0);
    setM2TimeLeft(45);
    setM2IsPlaying(false);
    setSelectedThemeId(null);
    setHostDialogue("🎙️ Henri : « MANCHE 2 : LE 4 À LA SUITE ! Choisissez votre rubrique parmi nos 10 thèmes académiques. 4 bonnes réponses consécutives en 45 secondes ! »");
  };

  // =========================================================================
  // LOGIQUE MANCHE 2 : LE 4 À LA SUITE
  // =========================================================================
  const handleSelectTheme = (themeId) => {
    sounds.playPop();
    setSelectedThemeId(themeId);
    setReaction('speaking');
    setM2Streak(0);
    setM2MaxStreak(0);
    setM2QuestionIdx(0);
    setM2TimeLeft(45);
    setM2IsPlaying(true);
    setHostDialogue("🎙️ Henri : « C'est parti pour le 4 à la suite ! Top chrono 45 secondes ! »");
    sounds.speakHost("C'est parti ! Quatre à la suite !");
  };

  const handleM2Answer = (optionIdx) => {
    if (!currentTheme || !m2IsPlaying) return;

    const q = currentTheme.questions[m2QuestionIdx % currentTheme.questions.length];
    const isCorrect = optionIdx === q.correct;

    if (isCorrect) {
      sounds.playSuccess();
      const newStreak = m2Streak + 1;
      setM2Streak(newStreak);
      setM2MaxStreak(prev => Math.max(prev, newStreak));
      setM2AnswerFeedback('correct');

      if (newStreak === 4) {
        // VICTOIRE MANCHE 2 ! QUALIFICATION DIRECTE POUR LA FINALE
        setReaction('victory');
        setM2IsPlaying(false);
        sounds.playApplause();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        setHostDialogue("🎙️ Henri : « ET C'EST LE 4 À LA SUITE ! EXCEPTIONNEL ! VOUS DÉCROCHEZ VOTRE BILLET POUR LE FACE-À-FACE FINAL ! »");
        sounds.speakHost("Et c'est le quatre à la suite ! Magnifique ! Direction la grande finale !");
      } else {
        setReaction('correct');
        setHostDialogue(`🎙️ Henri : « ${newStreak} sur 4 ! Continuez ! »`);
      }
    } else {
      setReaction('wrong');
      sounds.playWrong();
      setM2Streak(0); // Retour à 0 impératif !
      setM2AnswerFeedback('wrong');
      setHostDialogue("🎙️ Henri : « Mauvaise réponse ! Le compteur retombe à zéro ! Rien n'est perdu, enchaînez ! »");
      sounds.speakHost("Non ! Compteur à zéro ! On repart !");
    }

    setTimeout(() => {
      setM2AnswerFeedback(null);
      setM2QuestionIdx(prev => prev + 1);
    }, 700);
  };

  const handleM2TimeOut = () => {
    setReaction('wrong');
    setM2IsPlaying(false);
    sounds.playWrong();
    if (m2Streak < 4) {
      setHostDialogue(`🎙️ Henri : « Le temps est écoulé ! Vous aviez atteint une série de ${m2MaxStreak} sur 4. Il faut retenter le 4 à la suite pour accéder à la Finale ! »`);
      sounds.speakHost("Temps écoulé ! Il fallait réaliser quatre réponses consécutives.");
    }
  };

  // Passer à la Manche 3
  const handleStartManche3 = () => {
    sounds.playPop();
    sounds.playTheme('millionnaire');
    setCurrentRound('manche3_faceaface');
    setReaction('speaking');
    setM3UserScore(0);
    setM3OpponentScore(0);
    setM3QuestionIdx(0);
    setM3ActiveClueLevel(4);
    setM3IsBuzzed(false);
    setM3ShowOptions(false);
    setM3RoundAnswered(false);
    setHostDialogue("🎙️ Henri : « ULTIME MANCHE : LE FACE-À-FACE ! Premier à 12 points ! Les indices descendent de 4 à 1 point. Buzzez au bon moment ! »");
    sounds.speakHost("Le Face-à-Face final ! Premier à douze points pour remporter le trophée !");
  };

  // =========================================================================
  // LOGIQUE MANCHE 3 : LE FACE-À-FACE
  // =========================================================================
  const handleUserBuzz = () => {
    if (m3IsBuzzed || m3RoundAnswered) return;
    sounds.playBuzzer();
    setReaction('speaking');
    setM3IsBuzzed(true);
    setM3BuzzerWinner('user');
    setM3ShowOptions(true);
    setHostDialogue(`🎙️ Henri : « Vous avez buzzé pour ${m3ActiveClueLevel} points ! Quelle est votre réponse ? »`);
  };

  const handleOpponentBuzz = (pts) => {
    if (m3IsBuzzed || m3RoundAnswered) return;
    sounds.playBuzzer();
    setReaction('speaking');
    setM3IsBuzzed(true);
    setM3BuzzerWinner('opponent');
    setHostDialogue(`🎙️ Henri : « ${m3FinalistOpponent.name} buzze pour ${pts} points ! »`);

    setTimeout(() => {
      // 80% de chances de bonne réponse pour l'adversaire
      const isOppCorrect = Math.random() < 0.8;
      if (isOppCorrect) {
        sounds.playSuccess();
        const newScore = m3OpponentScore + pts;
        setM3OpponentScore(newScore);
        setReaction('idle');
        setHostDialogue(`🎙️ Henri : « Bonne réponse d'Alexandre ! Il empoche ${pts} points ! »`);
        checkFafVictory(m3UserScore, newScore);
      } else {
        sounds.playWrong();
        setReaction('wrong');
        setHostDialogue(`🎙️ Henri : « Alexandre se trompe ! La main revient au joueur ! »`);
        setM3BuzzerWinner('user');
        setM3ShowOptions(true);
      }
    }, 1800);
  };

  const handleUserFafAnswer = (optionIdx) => {
    if (!m3ShowOptions || m3RoundAnswered) return;
    setM3RoundAnswered(true);

    const isCorrect = optionIdx === currentFafQ.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      setReaction('correct');
      const pointsWon = m3ActiveClueLevel;
      const newScore = m3UserScore + pointsWon;
      setM3UserScore(newScore);
      setHostDialogue(`🎙️ Henri : « OUI ! EXCELLENTE RÉPONSE ! Vous marquez ${pointsWon} points ! »`);
      sounds.speakHost(`Excellente réponse ! ${pointsWon} points pour vous !`);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      checkFafVictory(newScore, m3OpponentScore);
    } else {
      sounds.playWrong();
      setReaction('wrong');
      setHostDialogue(`🎙️ Henri : « Non, ce n'était pas la réponse attendue ! C'était : « ${currentFafQ.targetTerm} » ! »`);
      sounds.speakHost("Non, mauvaise réponse !");
      setTimeout(() => advanceToNextFafQuestion(), 2400);
    }
  };

  const checkFafVictory = (userPts, oppPts) => {
    if (userPts >= 12) {
      setTimeout(() => {
        setCurrentRound('victoire');
        setReaction('victory');
        sounds.playApplause();
        sounds.playFanfare();
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
        setHostDialogue("🎙️ Henri : « FÉLICITATIONS ! VOUS ÊTES LE GRAND CHAMPION DE LA HAUTE ÉCOLE CHARLEMAGNE ! »");
        sounds.speakHost("Victoire historique ! Vous remportez le grand concours de la HECh !");
      }, 1500);
    } else if (oppPts >= 12) {
      setTimeout(() => {
        setCurrentRound('defaite');
        setReaction('wrong');
        sounds.playWrong();
        setHostDialogue(`🎙️ Henri : « ${m3FinalistOpponent.name} remporte le face-à-face à 12 points ! Quel match intense ! »`);
      }, 1500);
    } else {
      setTimeout(() => advanceToNextFafQuestion(), 2200);
    }
  };

  const advanceToNextFafQuestion = () => {
    setReaction('speaking');
    setM3QuestionIdx(prev => prev + 1);
    setM3ActiveClueLevel(4);
    setM3IsBuzzed(false);
    setM3ShowOptions(false);
    setM3RoundAnswered(false);
    setHostDialogue("🎙️ Henri : « Question suivante du Face-à-Face ! Écoutez attentivement le premier indice à 4 points ! »");
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`w-full max-w-6xl h-[95vh] max-h-[920px] bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 relative ${isFullscreen ? 'h-full max-h-none rounded-none' : ''}`}>
        
        {/* HEADER TV SHOW */}
        <div className="px-5 py-3 bg-gradient-to-r from-cyan-900/60 via-slate-900 to-indigo-900/60 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/images/hech_logo_officiel.png" 
              alt="Logo HECh" 
              className="h-8 w-auto object-contain hidden xs:block drop-shadow-md" 
            />
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Trophy className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  PLATEAU TV 3D · 3 MANCHES
                </span>
                <span className="text-xs text-slate-400 font-medium hidden md:inline">Questions pour un Champion · HECh</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Le Grand Concours de la HECh
              </h2>
            </div>
          </div>

          {/* Stepper des 3 Manches */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-2xl border border-slate-800">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-xl transition ${currentRound === 'manche1_justeprix' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}>
              1. Le Juste Prix
            </span>
            <span className="text-slate-600">→</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-xl transition ${currentRound === 'manche2_quatreasuite' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}>
              2. Quatre à la Suite
            </span>
            <span className="text-slate-600">→</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-xl transition ${currentRound === 'manche3_faceaface' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'}`}>
              3. Le Face-à-Face
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const muted = sounds.toggleMute();
                setIsMuted(muted);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
              title={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={toggleNativeFullscreen}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
              title="Plein écran"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white transition"
              title="Quitter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UPPER SECTION: SCÈNE 3D DU PLATEAU TV TEMPS RÉEL (POUR TOUTES LES MANCHES) */}
        {/* ========================================================================= */}
        <div className="h-[36vh] sm:h-[42vh] min-h-[220px] max-h-[350px] w-full relative bg-slate-950 overflow-hidden border-b border-cyan-500/30 shrink-0">
          <GameShow3D 
            reaction={reaction} 
            theme="concours" 
            themeColor="#06b6d4" 
          />

          {/* Badge Studio Direct & Télémétrie */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold text-white tracking-wider uppercase">
                DIRECT PLATEAU HECh · 60 FPS
              </span>
            </div>
          </div>

          {/* Indicateur de Manche en Direct */}
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/50 text-[10px] sm:text-xs font-black text-cyan-300 uppercase tracking-widest shadow-lg">
              {currentRound === 'intro' && '📺 GÉNÉRIQUE D\'OUVERTURE'}
              {currentRound === 'manche1_justeprix' && '⚖️ MANCHE 1 : LE JUSTE PRIX'}
              {currentRound === 'manche2_quatreasuite' && '🔥 MANCHE 2 : 4 À LA SUITE'}
              {currentRound === 'manche3_faceaface' && '⚡ MANCHE 3 : LE FACE-À-FACE'}
              {currentRound === 'victoire' && '🏆 SACRE DU MAJOR HECh'}
              {currentRound === 'defaite' && '💀 FIN DU MATCH'}
            </span>
          </div>

          {/* DIALOGUE BANNER FLOTTANT DU PRÉSENTATEUR HENRI */}
          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 max-w-3xl mx-auto pointer-events-auto">
              <p className="text-xs sm:text-sm font-bold text-cyan-200 tracking-wide line-clamp-2">
                {hostDialogue}
              </p>
            </div>
          </div>
        </div>

        {/* CORPS PRINCIPAL DE JEU SELON LA MANCHE */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col items-center justify-start bg-gradient-to-b from-slate-950/90 to-slate-900/95">

          {/* ================================================================= */}
          {/* ÉCRAN D'ACCUEIL / INTRO TV */}
          {/* ================================================================= */}
          {currentRound === 'intro' && (
            <div className="max-w-2xl text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-bounce">
                <Trophy className="w-12 h-12 text-white" />
              </div>

              <div>
                <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  TOURNOI OFFICIEL INTER-CAMPUS
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
                  Le Grand Concours de la HECh
                </h1>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  Affrontez les meilleurs étudiants des campus de Rivageois, Huy, Verviers et Outremeuse 
                  dans une compétition en 3 manches emblématiques calquée sur les règles de Questions pour un Champion.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/30">
                  <span className="text-xs font-black text-cyan-400">MANCHE 1</span>
                  <h4 className="font-black text-white text-sm mt-0.5">Le Juste Prix</h4>
                  <p className="text-xs text-slate-400 mt-1">Estimation chiffrée. Les candidats les plus proches se qualifient.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/30">
                  <span className="text-xs font-black text-amber-400">MANCHE 2</span>
                  <h4 className="font-black text-white text-sm mt-0.5">4 à la Suite</h4>
                  <p className="text-xs text-slate-400 mt-1">Choisissez votre rubrique. Enchaînez 4 bonnes réponses consécutives.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/30">
                  <span className="text-xs font-black text-emerald-400">MANCHE 3</span>
                  <h4 className="font-black text-white text-sm mt-0.5">Le Face-à-Face</h4>
                  <p className="text-xs text-slate-400 mt-1">Indices descendants 4, 3, 2, 1 points. Premier à 12 points gagne !</p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  setCurrentRound('manche1_justeprix');
                  setHostDialogue("🎙️ Henri : « MANCHE 1 : LE JUSTE PRIX ! Estimez la valeur exacte de la consigne académique ! »");
                  sounds.speakHost("Première manche : Le Juste Prix académique ! À vos estimations !");
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/30 cursor-pointer transition transform hover:scale-105"
              >
                🎬 Entrer sur le Plateau & Lancer la Manche 1
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* MANCHE 1 : LE JUSTE PRIX ACADÉMIQUE */}
          {/* ================================================================= */}
          {currentRound === 'manche1_justeprix' && (
            <div className="w-full max-w-3xl space-y-6">
              <div className="flex items-center justify-between bg-cyan-950/40 p-3 rounded-2xl border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>MANCHE 1 : ESTIMATION CHIFFRÉE & RAPIDITÉ</span>
                </div>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-bold">
                  Top 3 Qualifiés
                </span>
              </div>

              {/* Carte Question Juste Prix */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/40 text-center space-y-4 shadow-xl">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  Question d'Estimation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  « {currentJpQ.question} »
                </h3>

                {!m1IsEvaluated ? (
                  <div className="space-y-6 pt-4 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-3">
                      <input
                        type="number"
                        value={m1UserEstimate}
                        onChange={(e) => setM1UserEstimate(Number(e.target.value))}
                        min={currentJpQ.minRange}
                        max={currentJpQ.maxRange}
                        className="w-36 text-center text-3xl font-black bg-slate-900 border-2 border-cyan-500 rounded-2xl p-2 text-cyan-300 focus:outline-hidden"
                      />
                      <span className="text-base font-bold text-slate-300">
                        {currentJpQ.unit}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={currentJpQ.minRange}
                      max={currentJpQ.maxRange}
                      value={m1UserEstimate}
                      onChange={(e) => setM1UserEstimate(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />

                    <button
                      onClick={handleValidateJustePrix}
                      className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/30 transition transform hover:scale-102 cursor-pointer"
                    >
                      ⚖️ Verrouiller mon Estimation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 pt-2 animate-in zoom-in-95 duration-300">
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40">
                      <span className="text-xs text-slate-400 uppercase font-black">Valeur exacte officielle</span>
                      <div className="text-3xl font-black text-cyan-300 mt-1">
                        {m1Results.target} {currentJpQ.unit}
                      </div>
                      <p className="text-xs text-slate-300 mt-2">
                        {currentJpQ.explanation}
                      </p>
                    </div>

                    {/* Tableau des estimations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                      {m1Results.allParticipants.map((p, idx) => (
                        <div 
                          key={p.id}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            p.isUser 
                              ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold' 
                              : 'bg-slate-900/60 border-slate-800 text-slate-300'
                          } ${idx <= 2 ? 'ring-1 ring-emerald-400/50' : 'opacity-60'}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{p.avatar}</span>
                            <div>
                              <div className="text-xs font-black flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {idx <= 2 && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-sm">Qualifié</span>}
                              </div>
                              <span className="text-[10px] text-slate-400">{p.campus}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-cyan-300">{p.estimate} {currentJpQ.unit}</span>
                            <div className="text-[10px] text-slate-400">Écart : {p.diff}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {m1Results.isUserQualified ? (
                      <button
                        onClick={handleStartManche2}
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/30 transition transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Passer à la Manche 2 : Le Quatre à la Suite</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sounds.playPop();
                          setM1IsEvaluated(false);
                          setM1QuestionIdx((m1QuestionIdx + 1) % JUSTE_PRIX_QUESTIONS.length);
                        }}
                        className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                      >
                        🔄 Retenter une autre question d'estimation
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MANCHE 2 : LE « 4 À LA SUITE » (QUESTIONS POUR UN CHAMPION) */}
          {/* ================================================================= */}
          {currentRound === 'manche2_quatreasuite' && (
            <div className="w-full max-w-4xl space-y-6">
              
              {/* Entête avec Compteur de série & Chrono */}
              <div className="flex items-center justify-between bg-amber-950/40 p-4 rounded-3xl border border-amber-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      MANCHE 2 : LE 4 À LA SUITE
                    </span>
                    <h3 className="text-base font-black text-white">
                      {currentTheme ? currentTheme.title : "Choisissez votre Rubrique"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Indicateur 4 à la suite (4 cercles de score) */}
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800">
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                          m2Streak >= step 
                            ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-400/40 font-black' 
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  {/* Chrono 45s */}
                  <div className={`px-4 py-2 rounded-2xl border font-black text-lg flex items-center gap-2 ${
                    m2TimeLeft <= 10 ? 'bg-rose-600/30 text-rose-300 border-rose-500 animate-pulse' : 'bg-slate-900 text-amber-300 border-amber-500/40'
                  }`}>
                    <Timer className="w-5 h-5" />
                    <span>{m2TimeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* 1. Écran de sélection des 10 thèmes */}
              {!selectedThemeId && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sélectionnez une rubrique parmi les 10 domaines académiques de la HECh :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {QUATRE_A_LA_SUITE_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`p-4 rounded-2xl text-left bg-gradient-to-br ${theme.color} hover:brightness-110 border border-white/20 shadow-lg cursor-pointer transition transform hover:-translate-y-1`}
                      >
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/30 text-white/90">
                          {theme.badge}
                        </span>
                        <h4 className="text-sm font-black text-white mt-1.5">{theme.title}</h4>
                        <p className="text-xs text-white/80 mt-1 line-clamp-2">{theme.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Écran de Jeu actif du 4 à la suite */}
              {selectedThemeId && m2IsPlaying && currentTheme && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  {/* Carte Question */}
                  <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
                    {m2AnswerFeedback === 'correct' && (
                      <div className="absolute inset-0 bg-emerald-600/20 border-2 border-emerald-400 pointer-events-none animate-in fade-in duration-150 flex items-center justify-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                      </div>
                    )}
                    {m2AnswerFeedback === 'wrong' && (
                      <div className="absolute inset-0 bg-rose-600/20 border-2 border-rose-400 pointer-events-none animate-in fade-in duration-150 flex items-center justify-center">
                        <XCircle className="w-16 h-16 text-rose-400 animate-bounce" />
                      </div>
                    )}

                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Question #{m2QuestionIdx + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      « {currentTheme.questions[m2QuestionIdx % currentTheme.questions.length].q} »
                    </h3>

                    {/* Grille des 4 options de réponse */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                      {currentTheme.questions[m2QuestionIdx % currentTheme.questions.length].options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleM2Answer(optIdx)}
                          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-400/80 text-slate-100 text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-3 shadow-md group"
                        >
                          <span className="w-7 h-7 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 font-black text-xs flex items-center justify-center transition shrink-0">
                            {['A', 'B', 'C', 'D'][optIdx]}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Résultat si 4 à la suite réussi */}
              {selectedThemeId && !m2IsPlaying && m2Streak === 4 && (
                <div className="p-6 rounded-3xl bg-emerald-950/60 border border-emerald-400 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Trophy className="w-8 h-8 text-emerald-300" />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-300">
                    4 À LA SUITE VALIDÉ !
                  </h3>
                  <p className="text-sm text-slate-200 max-w-lg mx-auto">
                    Performance magistrale ! Vous avez réussi à enchaîner 4 bonnes réponses d'affilée dans le temps imparti. Vous êtes qualifié pour le FACE-À-FACE FINAL !
                  </p>
                  <button
                    onClick={handleStartManche3}
                    className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 transition transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Lancer la Finale : Le Face-à-Face</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* 4. Résultat si temps écoulé sans 4 à la suite */}
              {selectedThemeId && !m2IsPlaying && m2Streak < 4 && (
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-rose-500/40 text-center space-y-4">
                  <h3 className="text-xl font-black text-rose-300">
                    TEMPS ÉCOULÉ ! (Série max : {m2MaxStreak} / 4)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Pour accéder à la finale du Grand Concours, vous devez impérativement aligner 4 bonnes réponses d'affilée. Choisissez un autre thème ou réessayez !
                  </p>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedThemeId(null);
                      setM2Streak(0);
                      setM2TimeLeft(45);
                    }}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition"
                  >
                    🔄 Choisir une autre Rubrique
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* MANCHE 3 : LE FACE-À-FACE FINAL (DUEL DES 4 CASES DESCENDANTES) */}
          {/* ================================================================= */}
          {currentRound === 'manche3_faceaface' && (
            <div className="w-full max-w-4xl space-y-6">
              
              {/* Tableau d'affichage des scores du Face-à-Face */}
              <div className="grid grid-cols-2 gap-4">
                {/* Score Joueur */}
                <div className="p-4 rounded-3xl bg-indigo-950/60 border-2 border-indigo-500/60 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌟</span>
                    <div>
                      <span className="text-xs font-black uppercase text-indigo-300">Finaliste 1</span>
                      <h4 className="font-black text-white text-base">Vous (Candidat)</h4>
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-indigo-300 bg-indigo-900/60 px-4 py-1.5 rounded-2xl border border-indigo-400/40">
                    {m3UserScore} <span className="text-xs font-normal text-slate-400">/ 12</span>
                  </div>
                </div>

                {/* Score Adversaire Finaliste */}
                <div className="p-4 rounded-3xl bg-slate-900/80 border-2 border-slate-700 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{m3FinalistOpponent.avatar}</span>
                    <div>
                      <span className="text-xs font-black uppercase text-slate-400">Finaliste 2</span>
                      <h4 className="font-black text-white text-base">{m3FinalistOpponent.name} ({m3FinalistOpponent.campus})</h4>
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-300 bg-slate-800 px-4 py-1.5 rounded-2xl border border-slate-700">
                    {m3OpponentScore} <span className="text-xs font-normal text-slate-500">/ 12</span>
                  </div>
                </div>
              </div>

              {/* LES 4 CASES DESCENDANTES DU FACE-À-FACE (4, 3, 2, 1 POINTS) */}
              <div className="grid grid-cols-4 gap-2">
                {[4, 3, 2, 1].map(pts => {
                  const isActive = m3ActiveClueLevel === pts && !m3IsBuzzed;
                  const isPassed = m3ActiveClueLevel < pts;
                  return (
                    <div
                      key={pts}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105 shadow-xl shadow-amber-500/40 font-black'
                          : isPassed
                          ? 'bg-slate-900/40 border-slate-800 text-slate-600'
                          : 'bg-slate-900/80 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black uppercase tracking-wider">Case</span>
                      <div className="text-xl sm:text-2xl font-black">{pts} PTS</div>
                    </div>
                  );
                })}
              </div>

              {/* Zone Indice Actuel */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/40 space-y-4 shadow-2xl text-center">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  Indice Actuel · {currentFafQ.category}
                </span>

                <div className="min-h-[70px] flex items-center justify-center">
                  <p className="text-base sm:text-xl font-bold text-white max-w-2xl leading-relaxed">
                    « {currentFafQ.clues.find(c => c.points === m3ActiveClueLevel)?.text} »
                  </p>
                </div>

                {/* BUZZER GÉANT (si personne n'a buzzé) */}
                {!m3IsBuzzed && (
                  <div className="pt-2">
                    <button
                      onClick={handleUserBuzz}
                      className="px-10 py-4 rounded-3xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 text-white font-black text-xl shadow-2xl shadow-rose-600/50 cursor-pointer transition transform hover:scale-105 active:scale-95 border-2 border-rose-300 flex items-center justify-center gap-3 mx-auto"
                    >
                      <Zap className="w-6 h-6 animate-pulse" />
                      <span>BUZZER POUR {m3ActiveClueLevel} POINTS !</span>
                    </button>
                  </div>
                )}

                {/* SÉLECTION DE LA RÉPONSE APRÈS BUZZ DU JOUEUR */}
                {m3IsBuzzed && m3ShowOptions && !m3RoundAnswered && (
                  <div className="space-y-3 pt-3 animate-in zoom-in-95 duration-200">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      Sélectionnez la bonne réponse avant que le temps ne s'épuise :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                      {currentFafQ.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleUserFafAnswer(oIdx)}
                          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-600/40 border border-slate-700 hover:border-indigo-400 text-white text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-3"
                        >
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ÉCRAN DE VICTOIRE SUPRÊME */}
          {/* ================================================================= */}
          {currentRound === 'victoire' && (
            <div className="max-w-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-bounce">
                <Trophy className="w-12 h-12 text-slate-950" />
              </div>

              <div>
                <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  SACRE DU CHAMPION HECh
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
                  VICTOIRE AU GRAND CONCOURS !
                </h2>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  Vous avez franchi victorieusement les 3 manches du tournoi : Le Juste Prix, le 4 à la suite et le Face-à-Face final à 12 points ! Votre maîtrise des sciences cognitives, de la méthodologie et du décret Paysage fait honneur à la Haute École Charlemagne.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-black text-sm">
                🏆 Trophée Officiel du Major de la HECh débloqué dans votre profil !
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setCurrentRound('intro');
                  }}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                >
                  🔄 Rejouer une Partie
                </button>
                <button
                  onClick={() => {
                    if (onFinishGame) onFinishGame(100);
                    onClose();
                  }}
                  className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 transition"
                >
                  Valider & Retourner au Dashboard
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ÉCRAN DE DÉFAITE */}
          {/* ================================================================= */}
          {currentRound === 'defaite' && (
            <div className="max-w-md text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-600/20 border border-rose-500 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-rose-400" />
              </div>
              <h2 className="text-2xl font-black text-white">Match Perdu en Finale</h2>
              <p className="text-xs text-slate-300">
                Votre adversaire a atteint les 12 points en premier. Mais votre parcours jusqu'au Face-à-Face est déjà remarquable !
              </p>
              <button
                onClick={handleStartManche3}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition"
              >
                🔄 Rejouer la Finale
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
