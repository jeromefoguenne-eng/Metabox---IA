import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  Users, 
  PhoneCall, 
  Percent, 
  Volume2, 
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
  onFinishGame 
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [reaction, setReaction] = useState('speaking');
  const [scoreEcts, setScoreEcts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hostDialogue, setHostDialogue] = useState("");

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
  const [hasBuzzed, setHasBuzzed] = useState(false);

  const currentQ = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;
  const isMultipleChoice = currentQ?.options && currentQ.options.length > 0;

  // Question announce by TV Host
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

    let speechText = "";
    if (showType === 'millionnaire') {
      const reward = (currentIdx + 1) * 6;
      speechText = `Pour ${reward} crédits ECTS... que signifie le verbe : ${currentQ.verb || 'suivant'} ?`;
      setHostDialogue(`🎙️ Jean-Pierre Foucault : « Pour ${reward} crédits ECTS... que signifie le verbe « ${currentQ.verb} » ? »`);
    } else if (showType === 'champion') {
      speechText = `Top ! Question de sciences cognitives : ${currentQ.question}`;
      setHostDialogue(`🎙️ Samuel Étienne : « Top ! Question numéro ${currentIdx + 1} : buzzez dès que vous avez la réponse ! »`);
    } else if (showType === 'roue') {
      speechText = `Faites tourner la roue ! ${currentQ.prompt}`;
      setHostDialogue(`🎙️ Olivier Minne : « Tournez la roue des accords ! Formez la conjugaison exacte ! »`);
    } else {
      speechText = `Question du grand concours : ${currentQ.question}`;
      setHostDialogue(`🎙️ Carole Rousseau : « Attention à tous les candidats, chrono lancé ! »`);
    }

    sounds.speakHost(speechText);
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
    sounds.playGroan();
    sounds.speakHost("Temps écoulé ! C'est le coup de gong fatidique !");
    setHostDialogue("⏰ GONG ! Le chrono est arrivé à zéro !");
  };

  // Jokers handler
  const handleUse5050 = () => {
    if (joker50Used || isAnswerLocked || !isMultipleChoice) return;
    sounds.playPop();
    setJoker50Used(true);

    const wrongIndexes = currentQ.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQ.correctIndex);
    
    // Pick 2 random wrong options to hide
    const toHide = wrongIndexes.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    sounds.speakHost("Le 50 50 a éliminé deux mauvaises réponses !");
  };

  const handleUseAudience = () => {
    if (jokerAudienceUsed || isAnswerLocked || !isMultipleChoice) return;
    sounds.playPop();
    setJokerAudienceUsed(true);

    const poll = currentQ.options.map((_, idx) => {
      if (idx === currentQ.correctIndex) {
        return Math.floor(Math.random() * 20) + 65; // 65% to 85% for correct
      }
      return Math.floor(Math.random() * 15) + 5;
    });

    setAudiencePoll(poll);
    sounds.speakHost("Le public en studio a voté ! Regardez l'écran !");
  };

  const handleUseSar = () => {
    if (jokerSarUsed || isAnswerLocked) return;
    sounds.playPop();
    setJokerSarUsed(true);

    const tip = currentQ.explanation || "Analysez attentivement la racine du mot et distinguez la tâche de son contexte !";
    setSarTip(tip);
    sounds.speakHost("Votre conseiller du SAR est au bout du fil !");
  };

  // Handle Option Select in TV Game
  const handleSelectOption = (idx) => {
    if (isAnswerLocked) return;
    sounds.playPop();
    setSelectedOption(idx);
    setIsAnswerLocked(true);

    const isCorrect = idx === currentQ.correctIndex;

    // Suspense moment
    sounds.speakHost("C'est votre dernier mot ?");
    setHostDialogue("🎙️ « C'est votre dernier mot ? Vérifions ensemble ! »");

    setTimeout(() => {
      if (isCorrect) {
        setReaction('correct');
        sounds.playApplause();
        sounds.playSuccess();
        sounds.speakHost("Et c'est... une EXCELLENTE réponse ! Le public est debout !");
        setHostDialogue("🎉 OUI ! C'est une excellente réponse validée !");
        setScoreEcts(prev => prev + 6);

        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 }
        });
      } else {
        setReaction('wrong');
        sounds.playGroan();
        sounds.playError();
        sounds.speakHost("Aïe aïe aïe... coup dur pour notre candidat, ce n'était pas la bonne réponse !");
        setHostDialogue("❌ Aïe aïe aïe, mauvaise réponse !");
      }
    }, 1200);
  };

  // Handle Text Input validation (Roue des accords)
  const handleValidateText = () => {
    if (isAnswerLocked || !textInput.trim()) return;
    sounds.playPop();
    setIsAnswerLocked(true);

    const given = textInput.trim().toLowerCase();
    const isCorrect = currentQ.correctAnswers?.some(a => a.toLowerCase() === given);

    setTimeout(() => {
      if (isCorrect) {
        setReaction('correct');
        sounds.playApplause();
        sounds.playSuccess();
        sounds.speakHost("Bien joué ! Vous avez débloqué les lettres d'or !");
        setHostDialogue("🎉 Bravo ! Forme verbale parfaitement accordée !");
        setScoreEcts(prev => prev + 10);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } else {
        setReaction('wrong');
        sounds.playGroan();
        sounds.playError();
        sounds.speakHost("Erreur sur l'accord ! Attention à la terminaison !");
        setHostDialogue(`❌ Raté ! La bonne forme était : ${currentQ.correctAnswers?.join(' ou ')}`);
      }
    }, 800);
  };

  // Next question
  const handleNext = () => {
    sounds.playPop();
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameOver(true);
      setReaction('victory');
      sounds.playFanfare();
      sounds.playApplause();
      sounds.speakHost("Incroyable parcours ! Standing ovation du public pour notre champion !");
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      if (onFinishGame) onFinishGame(scoreEcts);
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
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      
      {/* 1. Header with Game Show Brand */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              🎬 {showType === 'millionnaire' ? 'Qui veut gagner des Crédits ?' : showType === 'champion' ? 'Questions pour un Major' : 'Le Grand Concours'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Question {currentIdx + 1} sur {totalQuestions}</span>
          </div>
          <h3 className="font-['Outfit'] text-2xl font-black text-slate-900 mt-1">
            {quiz.title}
          </h3>
        </div>

        {/* ECTS Bank / Score */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 shadow-xs">
            <Trophy className="w-5 h-5 text-amber-600" />
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase block leading-none">Gains ECTS</span>
              <span className="font-['Outfit'] font-black text-lg text-amber-950 font-mono">
                {scoreEcts} <span className="text-xs font-normal text-slate-500">/ 60 ECTS</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE LIVE 3D LOW POLY TV STUDIO */}
      <div className="relative">
        <GameShow3D 
          reaction={reaction} 
          theme={showType} 
          themeColor={themeColor} 
        />

        {/* Host Speech Bubble Overlay */}
        <div className="mt-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="leading-relaxed">{hostDialogue}</span>
          </div>
          <button
            onClick={() => sounds.speakHost(hostDialogue.replace(/🎙️.*?«/, '').replace(/»/, ''))}
            title="Réécouter la voix du présentateur"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition shrink-0"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. JOKERS BAR (Si Millionnaire) */}
      {showType === 'millionnaire' && !gameOver && (
        <div className="flex flex-wrap items-center justify-center gap-3 py-2 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider mr-2">
            Vos Jokers TV :
          </span>

          <button
            onClick={handleUse5050}
            disabled={joker50Used || isAnswerLocked}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              joker50Used 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through' 
                : 'bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200'
            }`}
          >
            <Percent className="w-4 h-4" /> Le 50 / 50
          </button>

          <button
            onClick={handleUseAudience}
            disabled={jokerAudienceUsed || isAnswerLocked}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              jokerAudienceUsed 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through' 
                : 'bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200'
            }`}
          >
            <Users className="w-4 h-4" /> Vote du Public
          </button>

          <button
            onClick={handleUseSar}
            disabled={jokerSarUsed || isAnswerLocked}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              jokerSarUsed 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through' 
                : 'bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" /> Appel au SAR
          </button>
        </div>
      )}

      {/* Audience Poll Result (Histogramme) */}
      {audiencePoll && (
        <div className="p-4 rounded-2xl bg-indigo-900 text-white space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>📊 Sondage du Public en direct dans les gradins :</span>
            <span>100% des votants</span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {audiencePoll.map((pct, i) => (
              <div key={i} className="text-center">
                <div className="h-16 bg-indigo-950 rounded-xl flex items-end p-1 overflow-hidden">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-400 to-indigo-400 rounded-lg transition-all duration-700" 
                    style={{ height: `${pct}%` }} 
                  />
                </div>
                <div className="font-mono text-xs font-bold text-cyan-300 mt-1">{pct}%</div>
                <div className="text-[10px] text-indigo-300 font-bold">Choix {String.fromCharCode(65 + i)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAR Phone Hint */}
      {sarTip && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3 animate-in fade-in duration-300">
          <PhoneCall className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-950 mb-0.5">📞 Conseiller SAR HECh :</span>
            « {sarTip} »
          </div>
        </div>
      )}

      {/* 4. QUESTION & PROMPT CARD */}
      {!gameOver && (
        <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-mono uppercase">
              Question {currentIdx + 1}
            </span>
            {(showType === 'champion' || showType === 'concours') && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <Timer className="w-3.5 h-3.5" /> Chrono : {timeLeft}s
              </div>
            )}
          </div>

          {currentQ.verb ? (
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Verbe à identifier :
              </span>
              <div className="font-['Outfit'] text-3xl sm:text-4xl font-black text-indigo-700">
                {currentQ.verb}
              </div>
            </div>
          ) : (
            <div className="font-['Outfit'] text-lg sm:text-xl font-bold text-slate-900 text-center py-2">
              {currentQ.prompt || currentQ.question}
            </div>
          )}

          {currentQ.context && (
            <div className="text-xs sm:text-sm font-serif italic text-amber-900 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-center">
              « {currentQ.context} »
            </div>
          )}

          {/* Multiple Choice Options (TV Style Push Buttons) */}
          {isMultipleChoice ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                if (hiddenOptions.includes(optIdx)) {
                  return (
                    <div key={optIdx} className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-100/50 opacity-40 text-center text-xs text-slate-400 font-mono">
                      [ Option éliminée par le 50/50 ]
                    </div>
                  );
                }

                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let btnStyle = 'bg-white border-2 border-slate-200 hover:border-indigo-400 text-slate-800 hover:bg-indigo-50/40 shadow-xs';
                if (isAnswerLocked) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-black shadow-md';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-indigo-50 border-2 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-400';
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswerLocked}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`text-left p-4 sm:p-5 rounded-2xl transition-all flex items-center justify-between gap-3 text-sm sm:text-base font-semibold group ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerLocked && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerLocked && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Text input for Roue des accords */
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={isAnswerLocked}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateText()}
                  placeholder="Tapez la forme verbale exacte..."
                  className="flex-1 p-4 rounded-2xl border-2 border-slate-300 text-base font-bold text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                />
                <button
                  disabled={isAnswerLocked || !textInput.trim()}
                  onClick={handleValidateText}
                  className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-['Outfit'] font-bold text-sm transition shadow-sm disabled:opacity-50"
                >
                  Valider
                </button>
              </div>
            </div>
          )}

          {/* Explanation if locked */}
          {isAnswerLocked && currentQ.explanation && (
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs sm:text-sm text-indigo-950 flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-indigo-800">Le Saviez-vous ? </strong>
                {currentQ.explanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. GAME OVER SUMMARY */}
      {gameOver && (
        <div className="text-center py-8 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 p-3 text-amber-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h4 className="font-['Outfit'] text-3xl font-black text-slate-900">
              Standing Ovation du Public ! 👏
            </h4>
            <div className="font-['Outfit'] text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 mt-2">
              {scoreEcts} Crédits ECTS Gagnés !
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Votre performance a été enregistrée dans votre carnet de réussite Métabox !
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-['Outfit'] font-bold text-sm transition shadow-md shadow-indigo-600/30"
            >
              <RotateCcw className="w-4 h-4" /> Rejouer une émission TV
            </button>
          </div>
        </div>
      )}

      {/* 6. ACTION FOOTER */}
      {!gameOver && isAnswerLocked && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-['Outfit'] font-black text-sm transition shadow-md shadow-indigo-600/25"
          >
            {currentIdx + 1 < totalQuestions ? 'Question Suivante' : 'Voir le Palmarès TV'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
