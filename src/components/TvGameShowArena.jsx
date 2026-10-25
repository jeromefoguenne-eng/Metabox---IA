import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  Users, 
  PhoneCall, 
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
  Heart,
  Compass,
  Star,
  Award,
  AlertTriangle,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GameShow3D from './GameShow3D';
import { sounds } from '../utils/soundEffects';

const SHOW_META = {
  millionnaire: {
    title: "Qui veut gagner des Crédits ?",
    subtitle: "Ascension vers les 60 Crédits ECTS · Verbes de Consigne",
    badge: "GRAND JEU DU PALIER ACADÉMIQUE HECh",
    primaryGradient: "from-sky-500 via-indigo-600 to-amber-500",
    themeBg: "bg-slate-900/90 border-sky-500/40",
    glowColor: "text-amber-400"
  },
  champion: {
    title: "Questions pour un Major",
    subtitle: "Sciences Cognitives, Neuro-Éducation & Courbe d'Oubli",
    badge: "CHRONO 12 SECONDES · BUZZER EN DIRECT",
    primaryGradient: "from-amber-500 via-orange-600 to-cyan-500",
    themeBg: "bg-stone-900/90 border-amber-500/40",
    glowColor: "text-amber-300"
  },
  roue: {
    title: "La Roue des Accords",
    subtitle: "Mur de Mots & 10 Manches pour 3 Vies",
    badge: "ROUE DE LA FORTUNE · ORTHO'EXPRESS HECh",
    primaryGradient: "from-fuchsia-500 via-purple-600 to-pink-500",
    themeBg: "bg-purple-950/90 border-pink-500/40",
    glowColor: "text-pink-400"
  },
  concours: {
    title: "Le Grand Concours de la HECh",
    subtitle: "Tournoi Inter-Campus : Rivageois, Huy, Verviers & Outremeuse",
    badge: "DÉFI CHRONO MULTI-CANDIDATS HECh",
    primaryGradient: "from-cyan-400 via-blue-600 to-violet-600",
    themeBg: "bg-cyan-950/90 border-cyan-500/40",
    glowColor: "text-cyan-300"
  }
};

// 12 WEDGES FOR LA ROUE DES ACCORDS (with 3 Banqueroutes)
const WHEEL_WEDGES = [
  { id: 0, label: "100 ECTS", value: 100, fill: "#10b981", textColor: "#ffffff", isSpecial: false },
  { id: 1, label: "250 ECTS", value: 250, fill: "#3b82f6", textColor: "#ffffff", isSpecial: false },
  { id: 2, label: "💥 BANQUEROUTE", value: 0, fill: "#b91c1c", textColor: "#fef08a", isSpecial: true, type: "bankrupt" },
  { id: 3, label: "500 ECTS", value: 500, fill: "#f59e0b", textColor: "#ffffff", isSpecial: false },
  { id: 4, label: "⭐ HOLD-UP", value: 750, fill: "#8b5cf6", textColor: "#ffffff", isSpecial: true, type: "holdup" },
  { id: 5, label: "💥 BANQUEROUTE", value: 0, fill: "#991b1b", textColor: "#fef08a", isSpecial: true, type: "bankrupt" },
  { id: 6, label: "1000 ECTS", value: 1000, fill: "#eab308", textColor: "#0f172a", isSpecial: false },
  { id: 7, label: "150 ECTS", value: 150, fill: "#06b6d4", textColor: "#ffffff", isSpecial: false },
  { id: 8, label: "300 ECTS", value: 300, fill: "#6366f1", textColor: "#ffffff", isSpecial: false },
  { id: 9, label: "400 ECTS", value: 400, fill: "#f97316", textColor: "#ffffff", isSpecial: false },
  { id: 10, label: "750 ECTS", value: 750, fill: "#ec4899", textColor: "#ffffff", isSpecial: false },
  { id: 11, label: "💥 BANQUEROUTE", value: 0, fill: "#dc2626", textColor: "#fef08a", isSpecial: true, type: "bankrupt" }
];

export default function TvGameShowArena({ 
  quiz, 
  showType = 'millionnaire', // 'millionnaire' | 'champion' | 'roue' | 'concours'
  themeColor = '#4f46e5',
  onFinishGame,
  onClose
}) {
  const meta = SHOW_META[showType] || SHOW_META.millionnaire;

  // TV Intro / Générique State
  const [isShowingIntro, setIsShowingIntro] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [reaction, setReaction] = useState('speaking');
  const [scoreEcts, setScoreEcts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hostDialogue, setHostDialogue] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  // 3 LIVES SYSTEM (Particularly for La Roue des Accords)
  const [lives, setLives] = useState(3);

  // Jokers state (for Millionnaire)
  const [joker50Used, setJoker50Used] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [jokerAudienceUsed, setJokerAudienceUsed] = useState(false);
  const [audiencePoll, setAudiencePoll] = useState(null);
  const [jokerSarUsed, setJokerSarUsed] = useState(false);
  const [sarTip, setSarTip] = useState(null);

  // --- SPECIFIC: LA ROUE DES ACCORDS (Word Wall & Wheel) ---
  const [revealedLetters, setRevealedLetters] = useState(new Set());
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
  const [currentWedge, setCurrentWedge] = useState(null);
  const [canPickLetter, setCanPickLetter] = useState(false);
  const [solveInput, setSolveInput] = useState("");
  const [isSolveOpen, setIsSolveOpen] = useState(false);
  const [roundPointsValue, setRoundPointsValue] = useState(null);

  // LEADERBOARD (Persisted in localStorage)
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem('hech_roue_highscores');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, pseudo: "Camille (Master Com)", score: 4850, date: "24/10/2026", rounds: "10/10", livesLeft: 3 },
      { id: 2, pseudo: "Maxime (SAR HECh)", score: 3900, date: "23/10/2026", rounds: "10/10", livesLeft: 2 },
      { id: 3, pseudo: "Éléonore (Rivageois)", score: 3100, date: "22/10/2026", rounds: "9/10", livesLeft: 1 },
      { id: 4, pseudo: "Théo (Campus Huy)", score: 2450, date: "21/10/2026", rounds: "8/10", livesLeft: 1 }
    ];
  });
  const [playerPseudo, setPlayerPseudo] = useState("");
  const [hasSavedScore, setHasSavedScore] = useState(false);

  // --- SPECIFIC: LE GRAND CONCOURS DE LA HECH (Fictional Opponents & Speed) ---
  const [opponents, setOpponents] = useState([
    { id: 'lucas', name: 'Lucas', campus: 'Rivageois (Liège)', score: 30, avatar: '🎓', state: 'idle' },
    { id: 'manon', name: 'Manon', campus: 'Huy (Gestion)', score: 35, avatar: '📚', state: 'idle' },
    { id: 'alexandre', name: 'Alexandre', campus: 'Verviers (Informatique)', score: 25, avatar: '⚡', state: 'idle' },
    { id: 'sarah', name: 'Sarah', campus: 'Outremeuse (Santé)', score: 30, avatar: '🔬', state: 'idle' }
  ]);
  const [buzzWinner, setBuzzWinner] = useState(null);

  // Timer for Questions pour un Champion / Concours
  const [timeLeft, setTimeLeft] = useState(15);
  const [hasBuzzed, setHasBuzzed] = useState(showType !== 'champion');

  const currentQ = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;
  const isMultipleChoice = currentQ?.options && currentQ.options.length > 0;

  // Target word for Roue des Accords
  const targetWord = (currentQ?.correctAnswers?.[0] || "").toUpperCase();

  // 1. Play Opening Theme on mount
  useEffect(() => {
    if (isShowingIntro) {
      setReaction('speaking');
      setHostDialogue(`🎬 Générique TV : « ${meta.title} » en direct du studio HECh !`);
      sounds.playTheme(showType);
      
      const timerVoice = setTimeout(() => {
        sounds.playVoice(`intro_${showType}`);
      }, 700);

      const timerAutoStart = setTimeout(() => {
        setIsShowingIntro(false);
      }, 4300);

      return () => {
        clearTimeout(timerVoice);
        clearTimeout(timerAutoStart);
      };
    }
  }, [isShowingIntro, showType]);

  const handleStartFromIntro = () => {
    sounds.playPop();
    setIsShowingIntro(false);
  };

  // Toggle browser fullscreen
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

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Question announce by TV Host with realistic neural voice
  useEffect(() => {
    if (isShowingIntro || !currentQ || gameOver) return;

    setSelectedOption(null);
    setIsAnswerLocked(false);
    setHiddenOptions([]);
    setAudiencePoll(null);
    setSarTip(null);
    setReaction('speaking');
    setTimeLeft(showType === 'champion' ? 12 : 15);
    setHasBuzzed(showType !== 'champion');

    // Reset Roue states
    setRevealedLetters(new Set());
    setCanPickLetter(false);
    setCurrentWedge(null);
    setRoundPointsValue(null);
    setIsSolveOpen(false);
    setSolveInput("");

    // Reset Opponent states
    setBuzzWinner(null);
    setOpponents(prev => prev.map(o => ({ ...o, state: 'thinking' })));

    let voiceKey = "";
    let dialogueText = "";

    if (showType === 'millionnaire') {
      const reward = (currentIdx + 1) * 6;
      voiceKey = `q_verb_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Question ${currentIdx + 1} (${currentQ.difficulty || 'Palier'}) pour ${reward} crédits ECTS... Que signifie le verbe « ${currentQ.verb || ''} » ? »`;

      if (currentQ.isSafetyTier) {
        setTimeout(() => sounds.playVoice("tier_safety"), 3500);
      } else if (currentQ.tier === 3 && currentIdx === 7) {
        setTimeout(() => sounds.playVoice("tier_final"), 3500);
      }

    } else if (showType === 'champion') {
      voiceKey = `q_meth_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Top chrono ! Question ${currentIdx + 1} de sciences cognitives : buzzez dès que vous êtes prêt ! »`;
    } else if (showType === 'roue') {
      voiceKey = `q_ortho_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Manche ${currentIdx + 1} sur 10 ! Faites tourner la roue pour déterminer vos points de manche ! »`;
    } else {
      voiceKey = `q_stud_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Question ${currentIdx + 1} du Grand Concours de la HECh ! Attention aux adversaires, buzzez le premier ! »`;
    }

    setHostDialogue(dialogueText);
    sounds.playVoice(voiceKey);

  }, [currentIdx, showType, gameOver, isShowingIntro]);

  // Countdown & Opponents simulation for Grand Concours
  useEffect(() => {
    if (isShowingIntro || gameOver || isAnswerLocked || showType === 'millionnaire' || showType === 'roue') return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    if (showType === 'concours' && !buzzWinner && !isAnswerLocked) {
      opponents.forEach((opp, i) => {
        const triggerSecond = 10 - i * 2;
        if (timeLeft === triggerSecond && opp.state === 'thinking' && Math.random() > 0.4) {
          handleOpponentBuzz(opp);
        }
      });
    }

    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, isAnswerLocked, gameOver, showType, isShowingIntro, buzzWinner]);

  const handleOpponentBuzz = (opp) => {
    sounds.playBuzzer();
    setBuzzWinner(opp.id);
    setOpponents(prev => prev.map(o => o.id === opp.id ? { ...o, state: 'buzzed' } : o));
    setHostDialogue(`🚨 BUZZER ! ${opp.name} (${opp.campus}) a buzzé en premier !`);
    sounds.playVoice("opponent_buzz");

    setTimeout(() => {
      const isOppCorrect = Math.random() > 0.35;
      if (isOppCorrect) {
        sounds.playSuccess();
        setHostDialogue(`✅ ${opp.name} donne la bonne réponse et empoche +10 ECTS !`);
        setOpponents(prev => prev.map(o => o.id === opp.id ? { ...o, score: o.score + 10, state: 'won' } : o));
        setIsAnswerLocked(true);
      } else {
        sounds.playGroan();
        setHostDialogue(`❌ Mauvaise réponse de ${opp.name} ! La main revient à vous, choisissez votre réponse !`);
        setOpponents(prev => prev.map(o => o.id === opp.id ? { ...o, score: Math.max(0, o.score - 5), state: 'wrong' } : o));
        setBuzzWinner(null);
      }
    }, 1800);
  };

  const handleTimeOut = () => {
    setIsAnswerLocked(true);
    setReaction('wrong');
    sounds.playBuzzer();
    sounds.playGong();
    sounds.playVoice("feedback_timeout");
    setHostDialogue("⏰ GONG ! Le temps est écoulé ! Coup dur pour les candidats !");
  };

  // --- LA ROUE DES ACCORDS: REAL ROTATING WHEEL WITH BANQUEROUTE & LIVES ---
  const handleSpinWheel = () => {
    if (isSpinningWheel || canPickLetter || isAnswerLocked) return;

    sounds.playPop();
    setIsSpinningWheel(true);
    setCurrentWedge(null);
    setHostDialogue("🎡 La roue tourne à pleine vitesse... Où va-t-elle s'arrêter ?!");

    // Realistic wheel physics simulation
    const wedgeCount = WHEEL_WEDGES.length;
    const randomWedgeIdx = Math.floor(Math.random() * wedgeCount);
    const extraRounds = 6 + Math.floor(Math.random() * 3);
    const wedgeAngle = 360 / wedgeCount;
    // Pointer is at TOP (90 deg in standard SVG, or 270)
    const targetDeg = wheelRotation + extraRounds * 360 + randomWedgeIdx * wedgeAngle + (wedgeAngle / 2);

    setWheelRotation(targetDeg);

    // Audio clicks while spinning
    const intervalTicks = setInterval(() => {
      sounds.playPop();
    }, 140);

    setTimeout(() => {
      clearInterval(intervalTicks);
      setIsSpinningWheel(false);
      const landed = WHEEL_WEDGES[randomWedgeIdx];
      setCurrentWedge(landed);

      if (landed.type === 'bankrupt') {
        sounds.playBuzzer();
        sounds.playGroan();
        sounds.playVoice("roue_bankrupt");
        setHostDialogue("💥 BANQUEROUTE ! Coup de tonnerre ! Vous perdez les points du tour ET une vie !");
        
        handleLoseLife();

      } else {
        sounds.playSuccess();
        setRoundPointsValue(landed.value);
        setCanPickLetter(true);
        setHostDialogue(`🎯 MANCHE JOUÉE POUR : ${landed.label} ! Proposez une lettre ou résolvez !`);
      }
    }, 3800);
  };

  const handleLoseLife = () => {
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setTimeout(() => {
          setGameOver(true);
          setReaction('wrong');
          sounds.playGroan();
          sounds.playVoice("roue_life_lost");
          setHostDialogue("💀 ÉLIMINATION ! Vous avez perdu vos 3 vies ! La session prend fin.");
        }, 1200);
      }
      return Math.max(0, nextLives);
    });
  };

  const handlePickLetter = (letter) => {
    if (!canPickLetter || revealedLetters.has(letter) || isAnswerLocked) return;

    sounds.playPop();
    const nextLetters = new Set(revealedLetters);
    nextLetters.add(letter);
    setRevealedLetters(nextLetters);
    setCanPickLetter(false);

    const occurrences = (targetWord.match(new RegExp(letter, "g")) || []).length;

    if (occurrences > 0) {
      sounds.playSuccess();
      const points = (roundPointsValue || 250) * occurrences;
      setScoreEcts(prev => prev + Math.floor(points / 20));
      setHostDialogue(`🎉 OUI ! Il y a ${occurrences} fois la lettre « ${letter} » sur le mur de mots !`);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });

      const allFound = [...targetWord].every(char => !/[A-ZÀ-ÖØ-öø-ÿ]/.test(char) || nextLetters.has(char));
      if (allFound) {
        handleWordSolvedSuccess();
      }
    } else {
      sounds.playBuzzer();
      sounds.playGroan();
      sounds.playVoice("roue_life_lost");
      setHostDialogue(`❌ Pas de « ${letter} » dans cette conjugaison ! Vous perdez une vie !`);
      handleLoseLife();
    }
  };

  const handleSolveSubmit = (e) => {
    e?.preventDefault();
    if (isAnswerLocked || !solveInput.trim()) return;

    sounds.playPop();
    const cleaned = solveInput.trim().toUpperCase();
    const isCorrect = currentQ.correctAnswers.some(ans => ans.toUpperCase() === cleaned);

    if (isCorrect) {
      handleWordSolvedSuccess();
    } else {
      sounds.playBuzzer();
      sounds.playGroan();
      sounds.playVoice("roue_life_lost");
      setHostDialogue(`❌ Fausse réponse ! Ce n'était pas « ${solveInput} ». Vous perdez une vie !`);
      setIsSolveOpen(false);
      handleLoseLife();
    }
  };

  const handleWordSolvedSuccess = () => {
    setIsAnswerLocked(true);
    setReaction('correct');
    sounds.playApplause();
    sounds.playSuccess();
    sounds.playVoice("feedback_correct_1");
    setHostDialogue(`🎉 MANCHE ${currentIdx + 1} REMPORTÉE ! La forme « ${currentQ.correctAnswers[0]} » est 100% validée !`);
    setScoreEcts(prev => prev + (roundPointsValue || 250));
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  // Jokers handlers
  const handleUse5050 = () => {
    if (joker50Used || isAnswerLocked || !isMultipleChoice) return;
    sounds.playPop();
    setJoker50Used(true);

    const wrongIndexes = currentQ.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQ.correctIndex);
    
    const toHide = wrongIndexes.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    setHostDialogue("⚡ « L'ordinateur élimine immédiatement deux mauvaises propositions ! Plus que 2 choix ! »");
    sounds.playVoice("joker_5050");
  };

  const handleUseAudience = () => {
    if (jokerAudienceUsed || isAnswerLocked || !isMultipleChoice) return;
    sounds.playPop();
    setJokerAudienceUsed(true);

    const poll = currentQ.options.map((_, idx) => {
      if (idx === currentQ.correctIndex) {
        return Math.floor(Math.random() * 20) + 68;
      }
      return Math.floor(Math.random() * 12) + 4;
    });

    setAudiencePoll(poll);
    setHostDialogue("👥 « Le public en studio vote sur ses boîtiers électroniques ! Regardez les résultats ! »");
    sounds.playVoice("joker_public");
  };

  const handleUseSar = () => {
    if (jokerSarUsed || isAnswerLocked) return;
    sounds.playPop();
    setJokerSarUsed(true);

    const tip = currentQ.explanation || "Analysez attentivement la racine du verbe et isolez la consigne de son contexte !";
    setSarTip(tip);
    setHostDialogue("📞 « Liaison établie avec le SAR de la HECh ! Écoutons le conseil pédagogique en direct ! »");
    
    sounds.playVoice("joker_sar", () => {
      const tipVoice = showType === 'champion' ? "sar_tip_ebbinghaus" : "sar_tip_default";
      sounds.playVoice(tipVoice);
    });
  };

  // Handle Option Select in TV Game (Multiple choice)
  const handleSelectOption = (idx) => {
    if (isAnswerLocked || (buzzWinner && buzzWinner !== 'player')) return;
    sounds.playPop();
    setSelectedOption(idx);
    setIsAnswerLocked(true);

    const isCorrect = idx === currentQ.correctIndex;
    setHostDialogue("🎙️ Henri : « C'est votre choix définitif ? Regardons le verdict ! »");

    setTimeout(() => {
      if (isCorrect) {
        setReaction('correct');
        sounds.playApplause();
        sounds.playSuccess();
        
        const randomCorrect = `feedback_correct_${(currentIdx % 3) + 1}`;
        sounds.playVoice(randomCorrect);
        
        const earned = showType === 'concours' ? 12 : (currentQ.rewardEcts || 6);
        setScoreEcts(prev => prev + earned);
        setHostDialogue("🎉 OUI ! Excellente réponse validée par les arbitres de la HECh !");

        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } else {
        setReaction('wrong');
        sounds.playBuzzer();
        sounds.playGroan();

        const randomWrong = `feedback_wrong_${(currentIdx % 2) + 1}`;
        sounds.playVoice(randomWrong);
        setHostDialogue(`❌ Aïe, c'est une erreur... La bonne réponse était : « ${currentQ.options[currentQ.correctIndex]} »`);
      }
    }, 1200);
  };

  const handleNextQuestion = () => {
    sounds.playPop();
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameOver(true);
      setReaction('victory');
      sounds.playApplause();
      sounds.playFanfare();

      const victoryVoice = showType === 'roue' ? "roue_victory_10" : `victory_${showType}`;
      sounds.playVoice(victoryVoice);

      confetti({ particleCount: 160, spread: 110, origin: { y: 0.5 } });

      if (onFinishGame) {
        onFinishGame(scoreEcts);
      }
    }
  };

  const handleRestart = () => {
    sounds.playPop();
    setIsShowingIntro(true);
    setCurrentIdx(0);
    setScoreEcts(0);
    setLives(3);
    setGameOver(false);
    setHasSavedScore(false);
    setJoker50Used(false);
    setJokerAudienceUsed(false);
    setJokerSarUsed(false);
  };

  // Save to Leaderboard
  const handleSaveToLeaderboard = (e) => {
    e?.preventDefault();
    if (!playerPseudo.trim() || hasSavedScore) return;

    sounds.playPop();
    const newEntry = {
      id: Date.now(),
      pseudo: playerPseudo.trim(),
      score: scoreEcts,
      date: new Date().toLocaleDateString('fr-BE'),
      rounds: `${currentIdx + 1}/10`,
      livesLeft: lives
    };

    const updated = [newEntry, ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 6);
    setLeaderboard(updated);
    try {
      localStorage.setItem('hech_roue_highscores', JSON.stringify(updated));
    } catch {}
    setHasSavedScore(true);
    sounds.playSuccess();
  };

  // Full 10-tier Pyramide for Qui veut gagner des crédits
  const PYRAMID_TIERS = [
    { num: 10, verb: "Comparer", ects: 60, tier: 3, label: "Haute Exigence (Sommet)" },
    { num: 9, verb: "Compléter", ects: 54, tier: 3, label: "Haute Exigence" },
    { num: 8, verb: "Définir", ects: 48, tier: 3, label: "Haute Exigence" },
    { num: 7, verb: "Classer", ects: 42, tier: 2, label: "Intermédiaire" },
    { num: 6, verb: "Énumérer", ects: 36, tier: 2, label: "Intermédiaire" },
    { num: 5, verb: "Citer", ects: 30, tier: 2, label: "Intermédiaire" },
    { num: 4, verb: "Relier", ects: 24, tier: 2, label: "⭐ PALIER SÉCURITÉ GARANTI", isSafety: true },
    { num: 3, verb: "Biffer", ects: 18, tier: 1, label: "Facile" },
    { num: 2, verb: "Cocher", ects: 12, tier: 1, label: "Facile" },
    { num: 1, verb: "Souligner", ects: 6, tier: 1, label: "Facile" }
  ];

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-slate-950 flex flex-col overflow-hidden text-white select-none animate-in fade-in duration-300">
      
      {/* 1. Broadcast TV Header Bar with OFFICIAL HECH LOGO */}
      <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          
          {/* HECh Official Shield & Monogram */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center font-outfit font-black text-white text-base shadow-md shadow-rose-600/30 border border-rose-400/40">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-outfit font-black text-xs tracking-wider text-white uppercase leading-none">
                HECh
              </span>
              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest leading-none mt-0.5">
                SAR RÉUSSITE
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Show Title */}
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-outfit font-black text-xs sm:text-sm tracking-wide text-white uppercase truncate max-w-[200px] md:max-w-none">
              {meta.title}
            </span>
          </div>
        </div>

        {/* Center: Lives, ECTS & Progress */}
        <div className="flex items-center gap-4">
          {/* 3 LIVES INDICATOR */}
          {showType === 'roue' && (
            <div className="flex items-center gap-1.5 bg-rose-950/60 px-3 py-1.5 rounded-full border border-rose-500/40 shadow-inner">
              <span className="text-[10px] font-bold text-rose-300 uppercase mr-1 hidden sm:inline">Vies :</span>
              {[1, 2, 3].map(heartIdx => (
                <Heart 
                  key={heartIdx} 
                  className={`w-4 h-4 transition-all duration-300 ${
                    heartIdx <= lives 
                      ? 'text-rose-500 fill-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
                      : 'text-slate-600 opacity-40'
                  }`} 
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700/80 shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>{scoreEcts}</span>
              <span className="text-[11px] text-amber-300/80 font-bold uppercase">ECTS</span>
            </div>
            <span className="text-slate-600 font-bold">|</span>
            <span className="text-xs font-bold text-slate-300">
              Manche {currentIdx + 1} / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Right: Audio Toggle, Fullscreen & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            title={isMuted ? "Activer le son" : "Couper le son"}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center justify-center cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={toggleNativeFullscreen}
            title="Plein écran navigateur"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center justify-center cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={() => {
                sounds.stopAllVoice();
                sounds.playPop();
                onClose();
              }}
              title="Quitter le studio TV (Échap)"
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition border border-rose-500/40 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden md:inline">Quitter le studio</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Studio Viewport */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Upper Half: 3D TV Studio Scene */}
        <div className="h-[46vh] min-h-[260px] w-full relative bg-slate-950">
          <GameShow3D 
            reaction={reaction} 
            theme={showType}
            themeColor={themeColor}
          />

          {/* DYNAMIC OPENING GENERIQUE TV OVERLAY */}
          {isShowingIntro && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-black uppercase tracking-widest mb-3">
                <span className="animate-pulse">🔴</span> {meta.badge}
              </div>

              <h1 className="text-3xl sm:text-5xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-white tracking-wide uppercase drop-shadow-2xl mb-2">
                {meta.title}
              </h1>

              <p className="text-sm sm:text-base font-lexend text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
                {meta.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleStartFromIntro}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:scale-105 transition-all text-white font-outfit font-black text-sm tracking-wider uppercase shadow-xl shadow-indigo-600/40 flex items-center gap-2.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Entrer sur le Plateau (C'est parti !)</span>
                </button>
                <button
                  onClick={handleStartFromIntro}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Passer le générique →
                </button>
              </div>
            </div>
          )}

          {/* Host Prompter Banner */}
          {!isShowingIntro && (
            <div className="absolute bottom-3 left-4 right-4 max-w-4xl mx-auto z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <p className="text-sm font-lexend text-white font-medium leading-relaxed drop-shadow-sm">
                  {hostDialogue}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lower Half: Interactive Broadcast Controls & HUD */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-t border-slate-800 p-4 sm:p-5 overflow-y-auto flex flex-col justify-between">
          <div className="max-w-5xl mx-auto w-full">

            {/* Game Over Screen WITH HALL OF FAME LEADERBOARD */}
            {gameOver ? (
              <div className="text-center py-4 animate-in zoom-in-95 duration-400">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-2xl shadow-amber-500/30 mb-3 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-slate-950" />
                </div>
                
                <h3 className="text-2xl font-outfit font-black text-white mb-1">
                  {lives > 0 ? "🏆 VICTOIRE DES 10 MANCHES !" : "💀 PARTIE TERMINÉE !"}
                </h3>
                <p className="text-slate-300 font-lexend text-sm max-w-lg mx-auto mb-4">
                  {lives > 0 
                    ? `Félicitations ! Vous terminez avec ${scoreEcts} Crédits ECTS et ${lives} vie(s) restante(s) !` 
                    : `Vous avez défendu vos chances jusqu'à la manche ${currentIdx + 1}/10 avec ${scoreEcts} ECTS !`}
                </p>

                {/* Save Pseudo Form */}
                {!hasSavedScore && (
                  <form onSubmit={handleSaveToLeaderboard} className="max-w-md mx-auto mb-6 flex gap-2">
                    <input
                      type="text"
                      value={playerPseudo}
                      onChange={(e) => setPlayerPseudo(e.target.value)}
                      placeholder="Votre Prénom / Pseudo (ex. Alex - HECh)..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={!playerPseudo.trim()}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-outfit font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enregistrer
                    </button>
                  </form>
                )}

                {/* PANNEAU DE SCORING (HALL OF FAME DES MEILLEURES PARTIES) */}
                <div className="max-w-xl mx-auto bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 shadow-2xl mb-6 text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-outfit font-black text-white uppercase tracking-wider">
                        Palmarès des Meilleures Parties HECh
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">TOP SCORES</span>
                  </div>

                  <div className="space-y-2">
                    {leaderboard.map((entry, rank) => (
                      <div 
                        key={entry.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-lexend ${
                          rank === 0 
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                            : 'bg-slate-800/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-black text-[10px] ${
                            rank === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {rank + 1}
                          </span>
                          <span className="font-bold">{entry.pseudo}</span>
                          <span className="text-[10px] text-slate-500">({entry.rounds})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-amber-400">{entry.score} ECTS</span>
                          <span className="text-[10px] text-rose-400">{'❤️'.repeat(entry.livesLeft || 1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Rejouer l'émission (3 Vies)
                  </button>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-outfit font-bold text-xs uppercase transition border border-slate-700 cursor-pointer"
                    >
                      Retour aux modules
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* 1. QUI VEUT GAGNER DES CRÉDITS : Pyramide de difficulté graduée & Jokers */}
                {showType === 'millionnaire' && (
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60 mb-3">
                      <div className="flex items-center gap-2 ml-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          currentQ.tier === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          currentQ.tier === 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          Niveau {currentQ.tier} : {currentQ.difficulty}
                        </span>
                        {currentQ.isSafetyTier && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-outfit font-black text-[10px] uppercase shadow-xs">
                            🌟 Palier de Sécurité 24 ECTS
                          </span>
                        )}
                      </div>

                      {/* Jokers */}
                      <div className="flex gap-2">
                        <button
                          onClick={handleUse5050}
                          disabled={joker50Used || isAnswerLocked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                            joker50Used 
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed line-through' 
                              : 'bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 cursor-pointer shadow-xs'
                          }`}
                        >
                          ⚖️ 50 / 50
                        </button>
                        <button
                          onClick={handleUseAudience}
                          disabled={jokerAudienceUsed || isAnswerLocked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                            jokerAudienceUsed 
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed line-through' 
                              : 'bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 cursor-pointer shadow-xs'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          Vote Public
                        </button>
                        <button
                          onClick={handleUseSar}
                          disabled={jokerSarUsed || isAnswerLocked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                            jokerSarUsed 
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed line-through' 
                              : 'bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 cursor-pointer shadow-xs'
                          }`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Appel SAR
                        </button>
                      </div>
                    </div>

                    {/* Progress Ladder bar */}
                    <div className="flex gap-1 overflow-x-auto pb-1">
                      {PYRAMID_TIERS.slice().reverse().map((tier, idx) => {
                        const isCurrent = idx === currentIdx;
                        const isPast = idx < currentIdx;
                        return (
                          <div 
                            key={tier.num}
                            className={`flex-1 min-w-[70px] py-1 px-1.5 rounded-lg text-center font-mono text-[10px] font-bold border transition ${
                              isCurrent 
                                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105 font-black' 
                                : isPast 
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40' 
                                : tier.isSafety
                                ? 'bg-amber-950/40 text-amber-300 border-amber-500/60 font-black'
                                : 'bg-slate-900/60 text-slate-500 border-slate-800'
                            }`}
                          >
                            <span>{tier.ects} ECTS</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. LE GRAND CONCOURS DE LA HECH : Fictional Opponents & Speed Race */}
                {showType === 'concours' && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 mb-3">
                      <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/60 flex items-center gap-2">
                        <span className="text-xl">🌟</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-white truncate">Vous (SAR)</strong>
                            <span className="text-[11px] font-mono font-black text-amber-400">{scoreEcts}</span>
                          </div>
                          <span className="text-[9px] text-indigo-300 uppercase block font-bold">Candidat Actif</span>
                        </div>
                      </div>

                      {opponents.map(opp => (
                        <div 
                          key={opp.id} 
                          className={`p-2 rounded-xl border flex items-center gap-2 transition ${
                            opp.state === 'buzzed'
                              ? 'bg-rose-600/40 border-rose-500 animate-pulse'
                              : opp.state === 'won'
                              ? 'bg-emerald-600/30 border-emerald-500'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                          }`}
                        >
                          <span className="text-xl">{opp.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200 truncate">{opp.name}</span>
                              <span className="text-[11px] font-mono font-black text-slate-300">{opp.score}</span>
                            </div>
                            <span className="text-[8px] text-slate-400 truncate block">
                              {opp.state === 'buzzed' ? '🚨 A BUZZÉ !' : opp.campus.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span>⏱️ Chrono : <strong className="text-rose-400 font-mono font-black">{timeLeft}s</strong></span>
                      <span className="text-amber-400 font-bold">Répondez avant les autres campus pour marquer les points !</span>
                    </div>
                  </div>
                )}

                {/* 3. LA ROUE DES ACCORDS : VISIBLE ROTATING WHEEL + MUR DE MOTS + 3 LIVES */}
                {showType === 'roue' && (
                  <div className="mb-4">
                    
                    {/* Le Mur de Mots (Word Wall Flip Tiles) */}
                    <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-4 shadow-xl text-center mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                          MUR DE MOTS · MANCHE {currentIdx + 1} / 10
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          Objectif : Sauver vos 3 vies jusqu'au bout !
                        </span>
                      </div>

                      {/* Enigma Word Tiles */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-2">
                        {[...targetWord].map((char, cIdx) => {
                          const isRevealed = revealedLetters.has(char) || !/[A-ZÀ-ÖØ-öø-ÿ]/.test(char) || isAnswerLocked;
                          return (
                            <div 
                              key={cIdx}
                              className={`w-9 h-12 sm:w-11 sm:h-14 rounded-xl border-2 flex items-center justify-center font-mono text-xl sm:text-2xl font-black transition-all duration-300 shadow-md ${
                                isRevealed
                                  ? 'bg-gradient-to-b from-amber-200 to-amber-400 text-slate-950 border-amber-100 scale-105'
                                  : 'bg-indigo-950/80 text-transparent border-indigo-400/40'
                              }`}
                            >
                              {isRevealed ? char : ''}
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-xs text-slate-300 font-lexend mt-2">
                        {currentQ.context}
                      </p>
                    </div>

                    {/* SPLIT VIEW: VISIBLE ROTATING WHEEL on left, ACTIONS on right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-900/70 p-4 rounded-3xl border border-purple-500/30">
                      
                      {/* LEFT: THE VISIBLE PHYSICAL ROTATING WHEEL */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                          
                          {/* Pointer Arrow at 12 o'clock */}
                          <div className="absolute top-0 z-20 transform -translate-y-2">
                            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)] animate-pulse" />
                          </div>

                          {/* SVG ROTATING WHEEL */}
                          <div 
                            className="w-full h-full rounded-full shadow-[0_0_35px_rgba(236,72,153,0.35)] border-4 border-slate-800"
                            style={{
                              transform: `rotate(${wheelRotation}deg)`,
                              transition: isSpinningWheel ? 'transform 3.8s cubic-bezier(0.12, 0.95, 0.22, 1.0)' : 'none'
                            }}
                          >
                            <svg viewBox="0 0 240 240" className="w-full h-full">
                              {WHEEL_WEDGES.map((wedge, wIdx) => {
                                const angle = 360 / WHEEL_WEDGES.length;
                                const startAngle = (wIdx * angle - 90) * (Math.PI / 180);
                                const endAngle = ((wIdx + 1) * angle - 90) * (Math.PI / 180);
                                
                                const x1 = 120 + 116 * Math.cos(startAngle);
                                const y1 = 120 + 116 * Math.sin(startAngle);
                                const x2 = 120 + 116 * Math.cos(endAngle);
                                const y2 = 120 + 116 * Math.sin(endAngle);

                                const pathData = `M 120 120 L ${x1} ${y1} A 116 116 0 0 1 ${x2} ${y2} Z`;

                                // Text angle & position
                                const midAngle = (wIdx * angle + angle / 2 - 90);
                                const radMid = midAngle * (Math.PI / 180);
                                const tx = 120 + 72 * Math.cos(radMid);
                                const ty = 120 + 72 * Math.sin(radMid);

                                return (
                                  <g key={wedge.id}>
                                    <path d={pathData} fill={wedge.fill} stroke="#0f172a" strokeWidth="1.5" />
                                    <text
                                      x={tx}
                                      y={ty}
                                      fill={wedge.textColor}
                                      fontSize={wedge.isSpecial ? "8" : "9"}
                                      fontWeight="900"
                                      textAnchor="middle"
                                      dominantBaseline="central"
                                      transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                                    >
                                      {wedge.isSpecial ? (wedge.type === 'bankrupt' ? 'BANQUE' : 'HOLD') : wedge.value}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Center Hub with HECh Monogram */}
                              <circle cx="120" cy="120" r="28" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
                              <text x="120" y="125" fill="#f59e0b" fontSize="13" fontWeight="900" textAnchor="middle">
                                HECh
                              </text>
                            </svg>
                          </div>
                        </div>

                        {/* Status readout below the wheel */}
                        <div className="mt-3 text-center">
                          {roundPointsValue ? (
                            <div className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-outfit font-black text-xs uppercase shadow-md animate-bounce">
                              🎯 Manche Jouée pour : {roundPointsValue} ECTS !
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-bold">
                              Tournez la roue pour fixer les points de la manche
                            </span>
                          )}
                        </div>
                      </div>

                      {/* RIGHT: SPIN BUTTON, ALPHABET KEYBOARD & SOLVE */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleSpinWheel}
                          disabled={isSpinningWheel || canPickLetter || isAnswerLocked}
                          className={`w-full py-3.5 rounded-2xl font-outfit font-black text-sm uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                            isSpinningWheel 
                              ? 'bg-slate-700 text-slate-400 animate-pulse'
                              : 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:scale-[1.02] text-white shadow-pink-600/30'
                          }`}
                        >
                          <Compass className={`w-5 h-5 ${isSpinningWheel ? 'animate-spin' : ''}`} />
                          <span>{isSpinningWheel ? "La roue tourne..." : "🎡 Faire Tourner la Roue !"}</span>
                        </button>

                        {/* Alphabet Keyboard (Enabled after wheel lands on points) */}
                        <div className="p-3 bg-slate-950/80 border border-purple-500/30 rounded-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-pink-300 uppercase">
                              {canPickLetter ? "👉 Choisissez une lettre :" : "Tournez la roue pour débloquer le clavier"}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 justify-center">
                            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
                              <button
                                key={l}
                                onClick={() => handlePickLetter(l)}
                                disabled={!canPickLetter || revealedLetters.has(l) || isAnswerLocked}
                                className={`w-6 h-7 sm:w-7 sm:h-8 rounded-lg font-mono text-[11px] font-black transition cursor-pointer ${
                                  revealedLetters.has(l)
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-30'
                                    : canPickLetter
                                    ? 'bg-indigo-600 hover:bg-pink-600 text-white shadow-xs'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-40'
                                }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Solve Drawer */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsSolveOpen(!isSolveOpen)}
                            disabled={isAnswerLocked}
                            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-outfit font-black text-xs uppercase transition border border-slate-700 cursor-pointer text-center"
                          >
                            ⚡ Résoudre l'accord direct
                          </button>
                        </div>

                        {isSolveOpen && !isAnswerLocked && (
                          <form onSubmit={handleSolveSubmit} className="flex gap-2 animate-in fade-in">
                            <input
                              type="text"
                              value={solveInput}
                              onChange={(e) => setSolveInput(e.target.value)}
                              placeholder="Tapez le mot résolu..."
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-pink-500/50 text-white font-mono text-xs focus:outline-hidden"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs uppercase cursor-pointer"
                            >
                              Valider
                            </button>
                          </form>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* SAR Advice Box if triggered */}
                {sarTip && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-3 animate-in fade-in">
                    <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-white mb-0.5">Conseiller SAR en ligne :</strong>
                      {sarTip}
                    </div>
                  </div>
                )}

                {/* Question Prompt Card */}
                {showType !== 'roue' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl mb-4 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[11px] border border-indigo-500/30">
                        ÉPREUVE #{currentIdx + 1}
                      </span>
                      {currentQ.verb && (
                        <span className="text-xs font-bold text-slate-400">
                          Verbe d'action à identifier
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-outfit font-extrabold text-white leading-snug">
                      {currentQ.verb ? `Que signifie précisément le verbe « ${currentQ.verb} » ?` : (currentQ.question || currentQ.prompt)}
                    </h4>

                    {currentQ.context && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                        {currentQ.context}
                      </p>
                    )}
                  </div>
                )}

                {/* Multiple Choice Options */}
                {isMultipleChoice && showType !== 'roue' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((option, idx) => {
                      if (hiddenOptions.includes(idx)) {
                        return (
                          <div key={idx} className="h-14 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 opacity-40 flex items-center justify-center text-xs text-slate-600 font-mono">
                            Proposition éliminée par le 50/50
                          </div>
                        );
                      }

                      const letter = String.fromCharCode(65 + idx);
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctIndex;

                      let btnStyle = "bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700/80 hover:border-indigo-500/60";
                      
                      if (isAnswerLocked) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-600/90 text-white border-emerald-400 shadow-lg shadow-emerald-600/30";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-600/90 text-white border-rose-400 shadow-lg shadow-rose-600/30";
                        } else {
                          btnStyle = "bg-slate-900/60 text-slate-600 border-slate-800 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerLocked || (buzzWinner && buzzWinner !== 'player')}
                          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 font-lexend flex items-center justify-between gap-3 shadow-md relative group cursor-pointer ${btnStyle} ${
                            buzzWinner && buzzWinner !== 'player' ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-black text-amber-400 flex items-center justify-center shrink-0">
                              {letter}
                            </span>
                            <span className="text-sm font-semibold leading-snug">
                              {option}
                            </span>
                          </div>

                          {audiencePoll && (
                            <span className="text-xs font-mono font-black text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50 shrink-0">
                              {audiencePoll[idx]}%
                            </span>
                          )}

                          {isAnswerLocked && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                          )}
                          {isAnswerLocked && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-white shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Next Question Button */}
                {isAnswerLocked && (
                  <div className="mt-5 flex justify-end animate-in fade-in duration-300">
                    <button
                      onClick={handleNextQuestion}
                      className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-outfit font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>{currentIdx + 1 < totalQuestions ? "Épreuve Suivante" : "Voir le Palmarès Final"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
