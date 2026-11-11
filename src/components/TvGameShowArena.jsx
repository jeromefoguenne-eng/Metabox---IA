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
import CharacterAvatar from './CharacterAvatar';
import GrandConcours3ManchesArena from './GrandConcours3ManchesArena';
import { 
  generateMillionnaireSessionQuestions,
  VERBES_BANK_TIER_1,
  VERBES_BANK_TIER_2,
  VERBES_BANK_TIER_3 
} from '../data/verbesConsignesBank';
import { generateRoueSessionQuestions } from '../data/roueAccordsBank';
import AuroreGameBriefingModal from './AuroreGameBriefingModal';

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

function TvGameShowArenaContent({ 
  quiz, 
  showType = 'millionnaire',
  themeColor = '#4f46e5',
  onFinishGame,
  onClose
}) {
  const meta = SHOW_META[showType] || SHOW_META.millionnaire;

  // TV Intro / Générique State
  const [isShowingIntro, setIsShowingIntro] = useState(true);
  const [isPixarMode, setIsPixarMode] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [reaction, setReaction] = useState('speaking');
  const [scoreEcts, setScoreEcts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false); // État d'élimination directe (perte de partie)
  const [hostDialogue, setHostDialogue] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  // Compteur 5s après victoire avant relance de question sous tension
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState(null);
  const autoAdvanceTimerRef = useRef(null);
  const autoAdvanceIntervalRef = useRef(null);

  // Génération dynamique d'une banque renouvelée de questions pour Qui veut gagner des crédits & La Roue des Accords
  const [sessionQuestions, setSessionQuestions] = useState(() => {
    if (showType === 'millionnaire') {
      return generateMillionnaireSessionQuestions();
    }
    if (showType === 'roue') {
      return generateRoueSessionQuestions();
    }
    return quiz?.questions || [];
  });

  // 3 LIVES SYSTEM (Particularly for La Roue des Accords)
  const [lives, setLives] = useState(3);

  // Jokers state (for Millionnaire)
  const [joker50Used, setJoker50Used] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [jokerAudienceUsed, setJokerAudienceUsed] = useState(false);
  const [audiencePoll, setAudiencePoll] = useState(null);
  const [jokerSarUsed, setJokerSarUsed] = useState(false);
  const [sarTip, setSarTip] = useState(null);
  const [jokerSwitchUsed, setJokerSwitchUsed] = useState(false);

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
    { id: 'lucas', name: 'Lucas', campus: 'Rivageois (Liège)', score: 0, avatar: '🎓', state: 'idle' },
    { id: 'manon', name: 'Manon', campus: 'Huy (Gestion)', score: 0, avatar: '📚', state: 'idle' },
    { id: 'alexandre', name: 'Alexandre', campus: 'Verviers (Informatique)', score: 0, avatar: '⚡', state: 'idle' },
    { id: 'sarah', name: 'Sarah', campus: 'Outremeuse (Santé)', score: 0, avatar: '🔬', state: 'idle' }
  ]);
  const [buzzWinner, setBuzzWinner] = useState(null);

  // Timer for Questions pour un Champion / Concours
  const [timeLeft, setTimeLeft] = useState(15);
  const [hasBuzzed, setHasBuzzed] = useState(showType !== 'champion');

  const currentQ = sessionQuestions[currentIdx] || sessionQuestions[0] || {};
  const totalQuestions = sessionQuestions.length;
  const isMultipleChoice = currentQ?.options && currentQ.options.length > 0;

  // Target full sentence or target word for Roue des Accords
  const targetSentence = (currentQ?.fullSentence || currentQ?.context || currentQ?.correctAnswers?.[0] || "").toUpperCase();
  const targetWord = (currentQ?.verbForm || currentQ?.correctAnswers?.[0] || "").toUpperCase();

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

  // Stop suspense & clear timers when component unmounts
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (autoAdvanceIntervalRef.current) clearInterval(autoAdvanceIntervalRef.current);
      sounds.stopSuspense();
      sounds.stopAllVoice();
    };
  }, []);

  // Oppressive suspense buildup as seconds pass while player hesitates in Millionnaire
  const [reflectionSeconds, setReflectionSeconds] = useState(0);

  useEffect(() => {
    if (showType !== 'millionnaire' || isShowingIntro || isAnswerLocked || gameOver) {
      setReflectionSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setReflectionSeconds(prev => {
        const next = prev + 1;
        // Escalate suspense volume progressively up to 25 seconds
        const fraction = Math.min(1.0, next / 25.0);
        sounds.escalateSuspensePressure(fraction);

        // Psychological pressure dialogue by Henri after 12s of hesitation in Tier 2/3
        if (next === 12 && currentQ.tier === 2) {
          sounds.playVoice("pressure_hesitate_tier2");
          setHostDialogue("🎙️ Henri : « Prenez votre temps... Mais rappelez-vous qu'à ce niveau de la pyramide, chaque seconde d'hésitation fait monter la pression ! »");
        } else if (next === 10 && currentQ.tier === 3) {
          sounds.playVoice("pressure_hesitate_tier3");
          setHostDialogue("🎙️ Henri : « Le studio est plongé dans le noir... Sentez-vous la tension ? Réfléchissez bien avant de verrouiller votre choix définitif ! »");
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showType, isShowingIntro, isAnswerLocked, gameOver, currentIdx, currentQ]);

  // Question announce by TV Host with realistic neural voice
  useEffect(() => {
    if (isShowingIntro || !currentQ || gameOver) return;

    setSelectedOption(null);
    setIsAnswerLocked(false);
    setHiddenOptions([]);
    setAudiencePoll(null);
    setSarTip(null);
    setReaction('speaking');
    setTimeLeft(showType === 'champion' ? 12 : showType === 'concours' ? 18 : 15);
    setHasBuzzed(showType !== 'champion');

    // Reset Roue states
    const initSet = new Set(currentQ?.initialRevealed?.map(l => l.toUpperCase()) || []);
    setRevealedLetters(initSet);
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
      
      const isTier1 = currentIdx < 3;
      const isTier2 = currentIdx >= 3 && currentIdx < 7;
      const isTier3 = currentIdx >= 7;

      if (currentIdx === 0) {
        dialogueText = `🎙️ Henri : « Question 1 pour ${reward} crédits ECTS... Échauffement en douceur : que signifie « ${currentQ.verb || ''} » ? »`;
      } else if (isTier1) {
        dialogueText = `🎙️ Henri : « Le calme revient en plateau... Ambiance feutrée et tendue. Question ${currentIdx + 1} pour ${reward} crédits ECTS : que signifie « ${currentQ.verb || ''} » ? »`;
      } else if (isTier2) {
        dialogueText = `🎙️ Henri : « Silence en studio... Vous êtes dans le Palier 2, l'atmosphère devient oppressante ! Question ${currentIdx + 1} pour ${reward} crédits : que signifie « ${currentQ.verb || ''} » ? »`;
      } else {
        dialogueText = `🎙️ Henri : « Tension maximale... Obscurité totale sur le plateau ! Question ${currentIdx + 1} au sommet de la pyramide pour ${reward} crédits ECTS ! Que signifie « ${currentQ.verb || ''} » ? Est-ce votre dernier mot ? »`;
      }

      // Start or escalate oppressive suspense music based on tier
      const tierLevel = currentQ.tier || (isTier3 ? 3 : isTier2 ? 2 : 1);
      sounds.startSuspense(tierLevel);

      if (currentQ.isSafetyTier) {
        setTimeout(() => sounds.playVoice("tier_safety"), 4500);
      } else if (currentQ.tier === 3 && currentIdx === 7) {
        setTimeout(() => sounds.playVoice("tier_final"), 4500);
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

    // Balanced AI opponent buzzer: give player 7 seconds of peace to read first
    // Only buzz after timeLeft <= 11 (after 7 seconds of question display)
    if (showType === 'concours' && !buzzWinner && !isAnswerLocked && timeLeft <= 11) {
      // Pick at most one opponent who considers buzzing, with lower probability
      const opponentIndex = (11 - timeLeft) % opponents.length;
      const candidateOpp = opponents[opponentIndex];

      if (candidateOpp && candidateOpp.state === 'thinking') {
        // Controlled 25% chance per second so player has plenty of opportunities to answer first
        if (Math.random() < 0.25) {
          handleOpponentBuzz(candidateOpp);
        }
      }
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
    setHostDialogue(`🚨 BUZZER ! ${opp.name} (${opp.campus}) tente sa chance !`);
    sounds.playVoice("opponent_buzz");

    setTimeout(() => {
      // 50% chance of making an error, so the player often recovers the question hand!
      const isOppCorrect = Math.random() < 0.50;
      if (isOppCorrect) {
        sounds.playSuccess();
        setHostDialogue(`✅ ${opp.name} a vu juste et marque +10 ECTS !`);
        setOpponents(prev => prev.map(o => o.id === opp.id ? { ...o, score: o.score + 10, state: 'won' } : o));
        setIsAnswerLocked(true);
      } else {
        sounds.playGroan();
        setHostDialogue(`❌ Erreur de ${opp.name} ! La main vous revient, saisissez l'occasion pour marquer !`);
        setOpponents(prev => prev.map(o => o.id === opp.id ? { ...o, score: Math.max(0, o.score - 5), state: 'wrong' } : o));
        setBuzzWinner(null);
      }
    }, 1600);
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

    // Sélection aléatoire équiprobable d'un secteur de la roue
    const wedgeCount = WHEEL_WEDGES.length; // 12 secteurs (30° chacun)
    const targetWedgeIdx = Math.floor(Math.random() * wedgeCount);
    const wedgeAngle = 360 / wedgeCount; // 30°

    // Position angulaire initiale du centre du secteur par rapport au haut (12h) dans le sens horaire :
    // Secteur 0 = [0°, 30°] (centre 15°)
    // Secteur 6 = [180°, 210°] (centre 195°, soit 1000 ECTS)
    const targetCenterAngle = (targetWedgeIdx + 0.5) * wedgeAngle;

    // Pour amener ce secteur exactement sous la flèche située à 12h (0°),
    // la rotation finale R (sens horaire) doit vérifier : (targetCenterAngle + R) % 360 === 0
    // Soit R % 360 === (360 - targetCenterAngle) % 360
    const desiredMod = (360 - (targetCenterAngle % 360)) % 360;
    const currentMod = ((wheelRotation % 360) + 360) % 360;

    let delta = desiredMod - currentMod;
    if (delta <= 0) {
      delta += 360;
    }

    // Ajout d'au moins 6 tours complets pour une rotation cinématographique spectaculaire
    const extraSpins = (6 + Math.floor(Math.random() * 3)) * 360;
    const finalRotation = wheelRotation + extraSpins + delta;

    setWheelRotation(finalRotation);

    // Audio clicks while spinning
    const intervalTicks = setInterval(() => {
      sounds.playPop();
    }, 140);

    setTimeout(() => {
      clearInterval(intervalTicks);
      setIsSpinningWheel(false);
      const landed = WHEEL_WEDGES[targetWedgeIdx];
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

  const normalizeChar = (ch) => {
    return ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  };

  const handlePickLetter = (letter) => {
    if (!canPickLetter || isAnswerLocked) return;

    const normLetter = normalizeChar(letter);
    if (revealedLetters.has(normLetter) || revealedLetters.has(letter)) return;

    sounds.playPop();
    const nextLetters = new Set(revealedLetters);
    nextLetters.add(letter);
    nextLetters.add(normLetter);
    setRevealedLetters(nextLetters);
    setCanPickLetter(false);

    // Count occurrences across the entire target sentence
    let occurrences = 0;
    for (const ch of targetSentence) {
      if (normalizeChar(ch) === normLetter) {
        occurrences++;
      }
    }

    if (occurrences > 0) {
      sounds.playSuccess();
      const points = (roundPointsValue || 250) * occurrences;
      setScoreEcts(prev => prev + Math.floor(points / 20));
      setHostDialogue(`🎉 OUI ! Il y a ${occurrences} fois la lettre « ${letter} » sur le mur de mots !`);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });

      // Check if all letters in sentence are revealed
      const allFound = [...targetSentence].every(char => {
        if (!/[A-ZÀ-ÖØ-öø-ÿ]/.test(char)) return true; // spaces, punctuation are auto-revealed
        return nextLetters.has(char) || nextLetters.has(normalizeChar(char));
      });

      if (allFound) {
        handleWordSolvedSuccess();
      }
    } else {
      sounds.playBuzzer();
      sounds.playGroan();
      sounds.playVoice("roue_life_lost");
      setHostDialogue(`❌ Pas de « ${letter} » dans cette phrase mystère ! Vous perdez une vie !`);
      handleLoseLife();
    }
  };

  const handleSolveSubmit = (e) => {
    e?.preventDefault();
    if (isAnswerLocked || !solveInput.trim()) return;

    sounds.playPop();
    const cleaned = solveInput.trim().toUpperCase();
    const normCleaned = normalizeChar(cleaned);

    // Can be solved either with the conjugated verb form alone OR the entire sentence
    const isCorrect = currentQ.correctAnswers.some(ans => {
      const normAns = normalizeChar(ans.toUpperCase());
      return normAns === normCleaned || ans.toUpperCase() === cleaned;
    }) || normalizeChar(targetSentence) === normCleaned || targetSentence === cleaned;

    if (isCorrect) {
      // Reveal all letters
      const allChars = new Set(revealedLetters);
      for (const ch of targetSentence) {
        allChars.add(ch);
        allChars.add(normalizeChar(ch));
      }
      setRevealedLetters(allChars);
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
    setHostDialogue(`🎉 MANCHE ${currentIdx + 1} REMPORTÉE ! La phrase mystère et la forme « ${currentQ.verbForm || currentQ.correctAnswers[0]} » sont 100% validées !`);
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

  // 4e Joker : Switch de Question (Qui veut gagner des crédits)
  const handleUseSwitch = () => {
    if (jokerSwitchUsed || isAnswerLocked || showType !== 'millionnaire') return;
    sounds.playPop();
    setJokerSwitchUsed(true);

    // Sélection d'une nouvelle question du même tier
    const tier = currentQ.tier || (currentIdx < 3 ? 1 : currentIdx < 7 ? 2 : 3);
    const bank = tier === 1 ? VERBES_BANK_TIER_1 : tier === 2 ? VERBES_BANK_TIER_2 : VERBES_BANK_TIER_3;
    const candidates = bank.filter(q => q.verb !== currentQ.verb);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || bank[0];

    // Shuffler les 4 options pour la nouvelle question
    const originalOptions = chosen.options.map((opt, i) => ({
      text: opt,
      isCorrect: i === chosen.correctIndex
    }));
    const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);

    const replacementQ = {
      ...chosen,
      id: `millionnaire_switch_${Date.now()}`,
      rewardEcts: currentQ.rewardEcts,
      options: shuffledOptions.map(o => o.text),
      correctIndex: newCorrectIndex,
      isSafetyTier: currentQ.isSafetyTier
    };

    setSessionQuestions(prev => {
      const copy = [...prev];
      copy[currentIdx] = replacementQ;
      return copy;
    });

    setHiddenOptions([]);
    setSelectedOption(null);
    setAudiencePoll(null);
    setSarTip(null);
    sounds.playSuccess();
    setHostDialogue(`🔄 « JOKER SWITCH ACTIVÉ ! L'ordinateur écarte « ${currentQ.verb} » et soumet une nouvelle épreuve : « ${chosen.verb} » ! »`);
    sounds.speakHost(`Joker switch activé. Nouvelle question pour ${currentQ.rewardEcts} crédits : que signifie le verbe ${chosen.verb} ?`);
  };

  // Partir avec ses gains (Walk away comme dans le vrai jeu télévisé)
  const handleWalkAway = () => {
    if (isAnswerLocked || gameOver || currentIdx === 0 || showType !== 'millionnaire') return;
    sounds.playPop();
    sounds.stopSuspense();
    setIsAnswerLocked(true);
    setReaction('victory');
    sounds.playApplause();
    sounds.playSuccess();
    const bankedEcts = currentIdx * 6; // gains de la dernière question réussie
    setScoreEcts(bankedEcts);
    setGameOver(true);
    setHostDialogue(`🎙️ Henri : « Sage et remarquable décision ! Vous préférez empocher vos ${bankedEcts} crédits ECTS plutôt que de risquer la chute ! Félicitations pour ce parcours ! »`);
    sounds.speakHost(`Excellente stratégie ! Vous quittez le jeu avec ${bankedEcts} crédits ECTS sécurisés.`);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    if (onFinishGame) onFinishGame(bankedEcts);
  };

  // Handle Option Select in TV Game (Multiple choice)
  const handleSelectOption = (idx) => {
    if (isAnswerLocked || (buzzWinner && buzzWinner !== 'player')) return;
    sounds.playPop();
    setSelectedOption(idx);
    setIsAnswerLocked(true);

    const isCorrect = idx === currentQ.correctIndex;

    if (showType === 'millionnaire') {
      const isHighTier = (currentQ.tier || 1) >= 2;
      setHostDialogue(`🎙️ Henri : « C'est votre dernier mot pour ${currentQ.rewardEcts || 6} crédits ECTS ? ... Suspense ... »`);
      // Brief heartbeat silence before explosion or victory
      setTimeout(() => sounds.stopSuspense(), 1200);
    } else {
      setHostDialogue("🎙️ Henri : « C'est votre choix définitif ? Regardons le verdict ! »");
    }

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

        // Dans "qui veut gagner des crédits" (millionnaire) :
        // Le présentateur célèbre pendant exactement 5 secondes, puis la célébration s'arrête
        // et la question suivante est soumise dans une ambiance tendue et oppressante
        if (showType === 'millionnaire' && currentIdx + 1 < totalQuestions) {
          setAutoAdvanceSeconds(5);
          let remaining = 5;

          if (autoAdvanceIntervalRef.current) clearInterval(autoAdvanceIntervalRef.current);
          autoAdvanceIntervalRef.current = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
              clearInterval(autoAdvanceIntervalRef.current);
              autoAdvanceIntervalRef.current = null;
              setAutoAdvanceSeconds(null);
            } else {
              setAutoAdvanceSeconds(remaining);
            }
          }, 1000);

          if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = setTimeout(() => {
            autoAdvanceTimerRef.current = null;
            if (autoAdvanceIntervalRef.current) {
              clearInterval(autoAdvanceIntervalRef.current);
              autoAdvanceIntervalRef.current = null;
            }
            setAutoAdvanceSeconds(null);
            // Fin de la célébration : passage direct à la question suivante
            handleNextQuestion();
          }, 5000);
        }
      } else {
        setReaction('wrong');
        sounds.playBuzzer();
        sounds.playGroan();

        const randomWrong = `feedback_wrong_${(currentIdx % 2) + 1}`;
        sounds.playVoice(randomWrong);

        if (showType === 'millionnaire') {
          setIsGameLost(true);
          sounds.stopSuspense();

          // Paliers de sécurité garantis :
          // Échec à Q1..Q4 (currentIdx 0..3) -> 0 ECTS
          // Échec à Q5..Q7 (currentIdx 4..6) -> Palier 1 validé : 24 ECTS garantis !
          // Échec à Q8..Q10 (currentIdx 7..9) -> Palier 2 validé : 42 ECTS garantis !
          const safetyBankedEcts = currentIdx >= 7 ? 42 : currentIdx >= 4 ? 24 : 0;
          setScoreEcts(safetyBankedEcts);

          if (safetyBankedEcts > 0) {
            setHostDialogue(`❌ ÉLIMINATION ! Mauvaise réponse... C'était : « ${currentQ.options[currentQ.correctIndex]} ». Mais grâce à votre palier de sécurité garanti, vous repartez avec ${safetyBankedEcts} crédits ECTS !`);
            sounds.speakHost(`Erreur fatale sur le verbe ${currentQ.verb || ''}. Mais vous ne repartez pas les mains vides : vous conservez vos ${safetyBankedEcts} crédits garantis !`);
          } else {
            setHostDialogue(`❌ ÉLIMINATION DIRECTE avant le premier palier ! Mauvaise réponse... C'était : « ${currentQ.options[currentQ.correctIndex]} ». Vous repartez avec 0 crédit ECTS.`);
            sounds.speakHost(`Erreur fatale avant le premier palier sur le verbe ${currentQ.verb || ''} ! Vous repartez sans crédit.`);
          }
          
          setTimeout(() => {
            setGameOver(true);
          }, 2400);
        } else {
          setHostDialogue(`❌ Aïe, c'est une erreur... La bonne réponse était : « ${currentQ.options[currentQ.correctIndex]} »`);
        }
      }
    }, showType === 'millionnaire' ? 1800 : 1200);
  };

  const handleNextQuestion = () => {
    // Annulation immédiate des compteurs automatiques en cas de clic anticipé
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
    }
    setAutoAdvanceSeconds(null);

    sounds.playPop();
    if (currentIdx + 1 < totalQuestions) {
      // Arrêt immédiat de la célébration : retour à la posture de concentration sous tension
      setReaction('speaking');
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
    if (showType === 'millionnaire') {
      setSessionQuestions(generateMillionnaireSessionQuestions());
    } else if (showType === 'roue') {
      setSessionQuestions(generateRoueSessionQuestions());
    }
    setIsShowingIntro(false); // Relance immédiate de la partie sans re-bloquer sur le briefing modal
    setCurrentIdx(0);
    setScoreEcts(0);
    setLives(3);
    setGameOver(false);
    setIsGameLost(false);
    setHasSavedScore(false);
    setJoker50Used(false);
    setJokerAudienceUsed(false);
    setJokerSarUsed(false);
    setJokerSwitchUsed(false);
    setHiddenOptions([]);
    setAudiencePoll(null);
    setSarTip(null);
    setIsAnswerLocked(false);
    setSelectedOption(null);
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
    { num: 7, verb: "Distinguer", ects: 42, tier: 2, label: "⭐ PALIER SÉCURITÉ GARANTI 2", isSafety: true },
    { num: 6, verb: "Énumérer", ects: 36, tier: 2, label: "Intermédiaire" },
    { num: 5, verb: "Citer", ects: 30, tier: 2, label: "Intermédiaire" },
    { num: 4, verb: "Relier", ects: 24, tier: 2, label: "⭐ PALIER SÉCURITÉ GARANTI 1", isSafety: true },
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
          {/* Bouton Briefing Officiel d'Aurore */}
          <button
            onClick={() => {
              sounds.playPop();
              setIsShowingIntro(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-200 transition cursor-pointer shadow-md"
            title="Briefing d'Aurore : Scénario, Enjeu & Règles"
          >
            <span>ℹ️</span>
            <span className="hidden sm:inline">Briefing Aurore</span>
          </button>

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
        
        {/* Upper Half: 3D TV Studio Scene (100% Raccord & Temps Réel) */}
        <div className="h-[46vh] min-h-[260px] w-full relative bg-slate-950 overflow-hidden">
          <GameShow3D 
            reaction={reaction} 
            theme={showType}
            themeColor={themeColor}
          />

          {/* BRIEFING OFFICIEL D'AURORE AU DÉBUT DU JEU TV (Scénario de l'Escape Game, Enjeu & Règles) */}
          <AuroreGameBriefingModal
            gameId={showType}
            isOpen={isShowingIntro}
            onClose={() => setIsShowingIntro(false)}
          />

          {/* Host Prompter Banner avec Avatar Raccord */}
          {!isShowingIntro && (
            <div className="absolute bottom-3 left-4 right-4 max-w-4xl mx-auto z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3">
                <CharacterAvatar characterId="aurore" size={36} />
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
                {isGameLost ? (
                  <div className="max-w-xl mx-auto space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 to-red-700 p-0.5 shadow-2xl shadow-rose-600/40 mb-3 flex items-center justify-center animate-bounce">
                      <XCircle className="w-10 h-10 text-white" />
                    </div>
                    
                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/30">
                      ÉLIMINATION DIRECTE · PALIER ACADÉMIQUE
                    </span>

                    <h3 className="text-3xl font-outfit font-black text-white">
                      {scoreEcts > 0 ? "🛡️ PALIER DE SÉCURITÉ GARANTI SÉCURISÉ !" : "💀 PARTIE TERMINÉE !"}
                    </h3>

                    <p className="text-slate-300 font-lexend text-sm max-w-lg mx-auto leading-relaxed">
                      {scoreEcts > 0 
                        ? `L'ascension s'arrête à l'épreuve #${currentIdx + 1} face au verbe « ${currentQ?.verb || 'de consigne'} ». Mais grâce à votre solidité sur les épreuves précédentes, vous conservez votre palier garanti de ${scoreEcts} crédits ECTS !`
                        : `Vous avez échoué à l'épreuve #${currentIdx + 1} face au verbe « ${currentQ?.verb || 'de consigne'} » avant d'atteindre le premier palier de sécurité (24 ECTS). Vous repartez avec 0 crédit.`
                      }
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 text-left text-xs text-slate-300 space-y-1.5 shadow-lg">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Rappel de la bonne réponse académique :</div>
                      <div className="text-emerald-400 font-bold text-sm">✓ {currentQ?.options?.[currentQ?.correctIndex]}</div>
                      <div className="text-slate-400 text-xs italic mt-1">{currentQ?.explanation}</div>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={handleRestart}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:brightness-110 text-white font-outfit font-black text-sm uppercase tracking-wider shadow-2xl shadow-rose-600/40 transition transform hover:scale-105 cursor-pointer flex items-center gap-2.5 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>Recommencer la Partie (Nouvelles Questions)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
              </>
            )}
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
                          <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-outfit font-black text-[10px] uppercase shadow-xs flex items-center gap-1 animate-pulse">
                            🌟 Palier Garanti ({currentQ.rewardEcts} ECTS)
                          </span>
                        )}
                      </div>

                      {/* Jokers & Option Partir avec ses gains */}
                      <div className="flex flex-wrap items-center gap-2">
                        {currentIdx >= 1 && !isAnswerLocked && (
                          <button
                            onClick={handleWalkAway}
                            className="px-3 py-1.5 rounded-xl text-xs font-black bg-rose-950/70 hover:bg-rose-800 border border-rose-500/60 text-rose-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-md animate-in fade-in"
                            title="Quitter le jeu avec vos crédits validés sans risquer d'élimination"
                          >
                            🛑 Partir ({currentIdx * 6} ECTS)
                          </button>
                        )}
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
                        <button
                          onClick={handleUseSwitch}
                          disabled={jokerSwitchUsed || isAnswerLocked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                            jokerSwitchUsed 
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed line-through' 
                              : 'bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 cursor-pointer shadow-xs'
                          }`}
                          title="Échange la question en cours contre une autre du même palier d'exigence académique"
                        >
                          🔄 Switch
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
                    
                    {/* Le Mur de Mots (Word Wall Flip Tiles) - Format Phrase Complète */}
                    <div className="bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl text-center mb-4 relative overflow-hidden">
                      
                      {/* Top Header info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-purple-500/20">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[11px] font-bold border border-pink-500/30">
                            MANCHE {currentIdx + 1} / 10
                          </span>
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                            {currentQ.difficulty || "Énigme"}
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-400/30 text-purple-200 text-xs font-black tracking-wider">
                          🏷️ INDICE : <span className="text-amber-300 font-bold">{currentQ.category || "ACCORD DU VERBE"}</span>
                        </div>
                      </div>

                      {/* Full Sentence arranged in words */}
                      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 my-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
                        {targetSentence.split(" ").map((word, wIdx) => (
                          <div key={wIdx} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                            {[...word].map((char, cIdx) => {
                              const normChar = normalizeChar(char);
                              const isLetter = /[A-ZÀ-ÖØ-öø-ÿ]/.test(char);
                              const isRevealed = !isLetter || revealedLetters.has(char) || revealedLetters.has(normChar) || isAnswerLocked;
                              
                              // Check if this letter is part of the focal verb to highlight it subtly
                              const isTargetVerbPart = currentQ.verbForm && currentQ.verbForm.includes(normChar);

                              return (
                                <div 
                                  key={cIdx}
                                  className="relative [perspective:600px] w-7 h-9 sm:w-8 sm:h-11 md:w-9 md:h-12 shrink-0 select-none"
                                >
                                  <div 
                                    className={`w-full h-full rounded-lg sm:rounded-xl border-2 flex items-center justify-center font-mono text-sm sm:text-base md:text-xl font-black transition-all duration-500 shadow-md [transform-style:preserve-3d] ${
                                      !isLetter
                                        ? 'bg-transparent text-amber-300 border-transparent text-lg font-black'
                                        : isRevealed
                                        ? isTargetVerbPart
                                          ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 text-slate-950 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105 [transform:rotateY(0deg)] ring-2 ring-amber-300/40'
                                          : 'bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-950 border-white shadow-md [transform:rotateY(0deg)]'
                                        : 'bg-gradient-to-br from-indigo-950 to-slate-900 text-transparent border-indigo-500/40 shadow-inner hover:border-indigo-400/70 [transform:rotateY(180deg)]'
                                    }`}
                                  >
                                    <span className="drop-shadow-xs">{isRevealed ? char : ''}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>

                      {/* Clue Prompt */}
                      <p className="text-xs sm:text-sm text-slate-300 font-lexend mt-2">
                        {currentQ.prompt || currentQ.context}
                      </p>
                    </div>

                    {/* SPLIT VIEW: VISIBLE ROTATING WHEEL on left, ACTIONS on right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-900/70 p-4 rounded-3xl border border-purple-500/30">
                      
                      {/* LEFT: THE VISIBLE PHYSICAL ROTATING WHEEL */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                          
                          {/* Pointer Arrow at 12 o'clock with spring physical ticker animation */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-30 pointer-events-none">
                            <div 
                              className={`w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-amber-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.9)] origin-top transition-transform ${
                                isSpinningWheel ? 'animate-[bounce_0.14s_infinite]' : ''
                              }`} 
                            />
                            {/* Chrome Pin Pivot */}
                            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-slate-300 via-white to-slate-400 -mt-7 mx-auto shadow-md border border-slate-600" />
                          </div>

                          {/* HIGH-DEFINITION ROTATING BROADCAST WHEEL */}
                          <div 
                            className="w-full h-full rounded-full shadow-[0_0_45px_rgba(236,72,153,0.45)] border-4 border-amber-500/80 p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 ring-4 ring-slate-900"
                            style={{
                              transform: `rotate(${wheelRotation}deg)`,
                              transition: isSpinningWheel ? 'transform 3.8s cubic-bezier(0.12, 0.95, 0.22, 1.0)' : 'none'
                            }}
                          >
                            <svg viewBox="0 0 240 240" className="w-full h-full rounded-full overflow-hidden">
                              <defs>
                                <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                                  <stop offset="0%" stopColor="#fef08a" />
                                  <stop offset="60%" stopColor="#d97706" />
                                  <stop offset="100%" stopColor="#78350f" />
                                </radialGradient>
                                <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
                                  <stop offset="85%" stopColor="transparent" />
                                  <stop offset="95%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#78350f" />
                                </radialGradient>
                              </defs>

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
                                    <path d={pathData} fill={wedge.fill} stroke="#0f172a" strokeWidth="1.8" />
                                    <text
                                      x={tx}
                                      y={ty}
                                      fill={wedge.textColor}
                                      fontSize={wedge.isSpecial ? "8.5" : "9.5"}
                                      fontWeight="900"
                                      textAnchor="middle"
                                      dominantBaseline="central"
                                      transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                                      style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
                                    >
                                      {wedge.isSpecial ? (wedge.type === 'bankrupt' ? 'BANQUE' : 'HOLD') : wedge.value}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* 24 Chrome & Gold Peripheral Pegs/Pins */}
                              {Array.from({ length: 24 }).map((_, pIdx) => {
                                const pAngle = (pIdx * (360 / 24) - 90) * (Math.PI / 180);
                                const px = 120 + 114 * Math.cos(pAngle);
                                const py = 120 + 114 * Math.sin(pAngle);
                                return (
                                  <g key={pIdx}>
                                    <circle cx={px} cy={py} r="2.8" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
                                    <circle cx={px - 0.7} cy={py - 0.7} r="1.0" fill="#ffffff" />
                                  </g>
                                );
                              })}

                              {/* Heavy Metallic Rim Ring */}
                              <circle cx="120" cy="120" r="116" fill="none" stroke="url(#rimGrad)" strokeWidth="8" />

                              {/* Center 3D Gold Medallion with HECh Crest */}
                              <circle cx="120" cy="120" r="32" fill="#090d1a" stroke="url(#hubGrad)" strokeWidth="4" />
                              <circle cx="120" cy="120" r="26" fill="url(#hubGrad)" />
                              <circle cx="120" cy="120" r="23" fill="#0f172a" />
                              <text x="120" y="125" fill="#fcd34d" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="0.05em">
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
                            className="flex-1 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white font-outfit font-black text-xs uppercase transition border border-purple-500/50 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
                          >
                            ⚡ Proposer une solution (Verbe ou Phrase entière)
                          </button>
                        </div>

                        {isSolveOpen && !isAnswerLocked && (
                          <form onSubmit={handleSolveSubmit} className="flex gap-2 animate-in fade-in">
                            <input
                              type="text"
                              value={solveInput}
                              onChange={(e) => setSolveInput(e.target.value)}
                              placeholder="Tapez le verbe conjugué ou la phrase entière..."
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
                          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 ease-out active:scale-[0.98] font-lexend flex items-center justify-between gap-3 shadow-md hover:shadow-lg relative group cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${btnStyle} ${
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

                {/* Next Question Button ou Bouton Élimination en cas de défaite */}
                {isAnswerLocked && (
                  <div className="mt-5 flex justify-end animate-in fade-in duration-300">
                    {showType === 'millionnaire' && isGameLost ? (
                      <button
                        onClick={handleRestart}
                        className="px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:brightness-110 text-white font-outfit font-black text-sm tracking-wide shadow-xl shadow-rose-600/40 transition flex items-center gap-2 cursor-pointer animate-pulse"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Partie Perdue · Recommencer l'Ascension</span>
                      </button>
                    ) : (
                      (!isGameLost || showType !== 'millionnaire') && (
                        <button
                          onClick={handleNextQuestion}
                          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-outfit font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition flex items-center gap-2.5 cursor-pointer group"
                        >
                          {showType === 'millionnaire' && autoAdvanceSeconds !== null ? (
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
                              <span>Question suivante sous tension dans {autoAdvanceSeconds}s</span>
                              <span className="text-xs font-normal opacity-75 hidden sm:inline">(ou passer direct ➔)</span>
                            </span>
                          ) : (
                            <span>{currentIdx + 1 < totalQuestions ? "Épreuve Suivante" : "Voir le Palmarès Final"}</span>
                          )}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      )
                    )}
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

export default function TvGameShowArena(props) {
  if (props.showType === 'concours') {
    return <GrandConcours3ManchesArena onClose={props.onClose} onFinishGame={props.onFinishGame} />;
  }
  return <TvGameShowArenaContent {...props} />;
}
