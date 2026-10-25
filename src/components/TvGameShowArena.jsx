import React, { useState, useEffect } from 'react';
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
  Award,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GameShow3D from './GameShow3D';
import { sounds } from '../utils/soundEffects';

export default function TvGameShowArena({ 
  quiz, 
  showType = 'millionnaire', // 'millionnaire' | 'champion' | 'roue' | 'concours'
  themeColor = '#4f46e5',
  onFinishGame,
  onClose
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [reaction, setReaction] = useState('speaking');
  const [scoreEcts, setScoreEcts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hostDialogue, setHostDialogue] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  // Jokers state (for Millionnaire)
  const [joker50Used, setJoker50Used] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [jokerAudienceUsed, setJokerAudienceUsed] = useState(false);
  const [audiencePoll, setAudiencePoll] = useState(null);
  const [jokerSarUsed, setJokerSarUsed] = useState(false);
  const [sarTip, setSarTip] = useState(null);

  // Text answer state (for Roue des Accords)
  const [textInput, setTextInput] = useState("");

  // Timer for Questions pour un Champion / Concours
  const [timeLeft, setTimeLeft] = useState(15);
  const [hasBuzzed, setHasBuzzed] = useState(showType !== 'champion');

  const currentQ = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;
  const isMultipleChoice = currentQ?.options && currentQ.options.length > 0;

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
    if (!currentQ || gameOver) return;

    setSelectedOption(null);
    setIsAnswerLocked(false);
    setHiddenOptions([]);
    setAudiencePoll(null);
    setSarTip(null);
    setTextInput("");
    setReaction('speaking');
    setTimeLeft(showType === 'champion' ? 12 : 15);
    setHasBuzzed(showType !== 'champion');

    let voiceKey = "";
    let dialogueText = "";

    if (showType === 'millionnaire') {
      const reward = (currentIdx + 1) * 6;
      voiceKey = `q_verb_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Pour ${reward} crédits ECTS... que signifie le verbe « ${currentQ.verb || ''} » ? »`;
    } else if (showType === 'champion') {
      voiceKey = `q_meth_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Top chrono ! Question ${currentIdx + 1} de sciences cognitives : buzzez dès que vous êtes prêt ! »`;
    } else if (showType === 'roue') {
      voiceKey = `q_ortho_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « La roue des accords tourne ! Formez la conjugaison exacte ! »`;
    } else {
      voiceKey = `q_stud_${currentIdx + 1}`;
      dialogueText = `🎙️ Henri : « Question ${currentIdx + 1} du Grand Concours : concentration maximale ! »`;
    }

    setHostDialogue(dialogueText);
    sounds.playVoice(voiceKey);

  }, [currentIdx, showType, gameOver]);

  // Countdown for Champion & Grand Concours
  useEffect(() => {
    if (gameOver || isAnswerLocked || showType === 'millionnaire' || showType === 'roue') return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, isAnswerLocked, gameOver, showType]);

  const handleTimeOut = () => {
    setIsAnswerLocked(true);
    setReaction('wrong');
    sounds.playBuzzer();
    sounds.playGong();
    sounds.playVoice("feedback_timeout");
    setHostDialogue("⏰ GONG ! Le temps est écoulé ! Coup dur pour le candidat !");
  };

  // Jokers handlers with realistic voices
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
        return Math.floor(Math.random() * 20) + 68; // 68% to 88% for correct
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
    
    // Play host intro then Belgian female advisor tip
    sounds.playVoice("joker_sar", () => {
      const tipVoice = showType === 'champion' ? "sar_tip_ebbinghaus" : "sar_tip_default";
      sounds.playVoice(tipVoice);
    });
  };

  // Handle Option Select in TV Game
  const handleSelectOption = (idx) => {
    if (isAnswerLocked) return;
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
        setHostDialogue("🎉 OUI ! Excellente réponse validée par les arbitres du jeu !");
        setScoreEcts(prev => prev + 6);

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
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

  // Handle Text Submission (Roue des Accords)
  const handleTextSubmit = (e) => {
    e?.preventDefault();
    if (isAnswerLocked || !textInput.trim()) return;

    sounds.playPop();
    setIsAnswerLocked(true);

    const cleaned = textInput.trim().toLowerCase();
    const isCorrect = currentQ.correctAnswers.some(ans => ans.toLowerCase() === cleaned);

    setHostDialogue("🎙️ Henri : « La roue s'arrête... Est-ce la conjugaison attendue ? »");

    setTimeout(() => {
      if (isCorrect) {
        setReaction('correct');
        sounds.playApplause();
        sounds.playSuccess();
        sounds.playVoice("feedback_correct_1");
        setHostDialogue(`🎉 Parfait ! L'orthographe « ${currentQ.correctAnswers[0]} » est 100% validée !`);
        setScoreEcts(prev => prev + 6);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setReaction('wrong');
        sounds.playBuzzer();
        sounds.playGroan();
        sounds.playVoice("feedback_wrong_1");
        setHostDialogue(`❌ Dommage ! La forme exacte était : « ${currentQ.correctAnswers[0]} ».`);
      }
    }, 1000);
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

      const victoryVoice = `victory_${showType}`;
      sounds.playVoice(victoryVoice);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });

      if (onFinishGame) {
        onFinishGame(scoreEcts);
      }
    }
  };

  const handleRestart = () => {
    sounds.playPop();
    setCurrentIdx(0);
    setScoreEcts(0);
    setGameOver(false);
    setJoker50Used(false);
    setJokerAudienceUsed(false);
    setJokerSarUsed(false);
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-slate-950 flex flex-col overflow-hidden text-white select-none animate-in fade-in duration-300">
      
      {/* 1. Broadcast TV Header Bar */}
      <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
              EN DIRECT · STUDIO 3D
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-outfit font-black text-sm tracking-wide text-white uppercase hidden sm:inline">
              {showType === 'millionnaire' && "Qui veut gagner des Crédits ?"}
              {showType === 'champion' && "Questions pour un Major"}
              {showType === 'roue' && "La Roue des Accords"}
              {showType === 'concours' && "Le Grand Concours du Campus"}
            </span>
          </div>
        </div>

        {/* Center: ECTS & Progress */}
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

      {/* 2. Main Studio Viewport (Split: 3D Stage on top, Broadcast HUD on bottom) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Upper Half: 3D TV Studio Scene */}
        <div className="h-[50vh] min-h-[280px] w-full relative bg-slate-950">
          <GameShow3D 
            reaction={reaction} 
            theme={showType}
            themeColor={themeColor}
          />

          {/* Host Prompter / Teleprompter Subtitle Banner Overlay */}
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
        </div>

        {/* Lower Half: Broadcast HUD & Interactive Answers Panel */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-t border-slate-800 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div className="max-w-4xl mx-auto w-full">

            {/* Game Over Screen */}
            {gameOver ? (
              <div className="text-center py-6 animate-in zoom-in-95 duration-400">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-2xl shadow-amber-500/30 mb-4 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-slate-950" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-outfit font-black text-white mb-2">
                  Session Studio Terminée !
                </h3>
                <p className="text-slate-300 font-lexend text-base max-w-lg mx-auto mb-6">
                  Vous remportez <strong className="text-amber-400 font-black text-xl">{scoreEcts} Crédits ECTS</strong> ! Le jury et les professeurs de la HECh saluent votre performance !
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Rejouer l'émission
                  </button>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-outfit font-bold text-sm transition border border-slate-700 cursor-pointer"
                    >
                      Retour aux modules
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Millionnaire Jokers Bar */}
                {showType === 'millionnaire' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 ml-2">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      Jokers Plateau :
                    </span>
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
                        Vote du Public
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
                        Appel au SAR
                      </button>
                    </div>
                  </div>
                )}

                {/* Champion Timer & Buzzer */}
                {showType === 'champion' && (
                  <div className="flex items-center justify-between gap-3 mb-4 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center gap-2 text-rose-400 font-outfit font-black text-sm">
                      <Timer className="w-5 h-5 animate-spin" />
                      <span>{timeLeft}s restantes</span>
                    </div>
                    {!hasBuzzed && !isAnswerLocked && (
                      <button
                        onClick={() => {
                          sounds.playBuzzer();
                          setHasBuzzed(true);
                          setHostDialogue("🚨 BUZZER CANDIDAT ! Vous avez la main, annoncez votre réponse !");
                        }}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 animate-pulse cursor-pointer"
                      >
                        🚨 BUZZER !
                      </button>
                    )}
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

                  <h4 className="text-lg sm:text-xl font-outfit font-extrabold text-white leading-snug">
                    {currentQ.verb ? `Que signifie le verbe « ${currentQ.verb} » ?` : (currentQ.question || currentQ.prompt)}
                  </h4>

                  {currentQ.context && (
                    <p className="mt-2 text-sm text-slate-300 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                      {currentQ.context}
                    </p>
                  )}
                </div>

                {/* Question Type: Multiple Choice */}
                {isMultipleChoice ? (
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
                          disabled={isAnswerLocked || (!hasBuzzed && showType === 'champion')}
                          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 font-lexend flex items-center justify-between gap-3 shadow-md relative group cursor-pointer ${btnStyle} ${
                            !hasBuzzed && showType === 'champion' ? 'opacity-40 cursor-not-allowed' : ''
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

                          {/* Audience poll indicator */}
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
                ) : (
                  /* Question Type: Text Input (Roue des Accords) */
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Tapez ici la conjugaison exacte..."
                        disabled={isAnswerLocked}
                        className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-base focus:outline-hidden focus:border-indigo-500 shadow-inner"
                      />
                      <button
                        type="submit"
                        disabled={isAnswerLocked || !textInput.trim()}
                        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-outfit font-black text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
                      >
                        <span>Valider</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Next Question Button if answer locked */}
                {isAnswerLocked && (
                  <div className="mt-5 flex justify-end animate-in fade-in duration-300">
                    <button
                      onClick={handleNextQuestion}
                      className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-outfit font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>{currentIdx + 1 < totalQuestions ? "Question Suivante" : "Voir le Résultat Final"}</span>
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
