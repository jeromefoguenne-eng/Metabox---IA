import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, Trophy, Timer, CheckCircle, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

const GAME_QUESTIONS = [
  { verb: "Biffer", correct: "Barrer un élément d'un trait", traps: ["Gommer avec une gomme", "Tracer un trait dessous"] },
  { verb: "Définir", correct: "Expliquer le sens exact d'un concept", traps: ["Donner son avis personnel", "Résumer en deux mots"] },
  { verb: "Citer", correct: "Nommer ou énoncer sans développer", traps: ["Expliquer en détail les causes", "Donner une opinion"] },
  { verb: "Comparer", correct: "Dégager ressemblances ET différences", traps: ["Donner seulement le point fort", "Critiquer négativement"] },
  { verb: "Justifier", correct: "Apporter des preuves et arguments logiques", traps: ["Répéter la même phrase", "Exprimer une émotion"] },
  { verb: "Illustrer", correct: "Donner un exemple ou cas concret", traps: ["Faire un dessin artistique", "Tracer un tableau"] },
  { verb: "Synthétiser", correct: "Résumer l'essentiel de manière concise", traps: ["Recopier tout le texte", "Donner des détails accessoires"] },
  { verb: "Classer", correct: "Ranger selon des catégories logiques", traps: ["Mettre au hasard", "Trier par ordre de beauté"] },
  { verb: "Souligner", correct: "Tracer un trait directement sous le mot", traps: ["Entourer d'un rond", "Mettre en gras"] },
  { verb: "Cocher", correct: "Marquer d'une croix ou d'un trait une case", traps: ["Colorier toute la page", "Effacer le texte"] }
];

export default function SpeedChallengeGame({ onFinishGame }) {
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // Shuffle options for the current question
  const prepareQuestion = (idx) => {
    const q = GAME_QUESTIONS[idx % GAME_QUESTIONS.length];
    const opts = [
      { text: q.correct, isCorrect: true },
      { text: q.traps[0], isCorrect: false },
      { text: q.traps[1], isCorrect: false }
    ].sort(() => Math.random() - 0.5);
    setShuffledOptions(opts);
  };

  const startGame = () => {
    sounds.playPop();
    setGameState('playing');
    setTimeLeft(45);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentIdx(0);
    setFeedback(null);
    prepareQuestion(0);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      sounds.playFanfare();
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      if (onFinishGame) onFinishGame(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, score]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      const newCombo = combo + 1;
      sounds.playCombo(newCombo);
      const points = 100 + (newCombo * 10);
      setScore(prev => prev + points);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setFeedback('correct');
    } else {
      sounds.playError();
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      prepareQuestion(nextIdx);
    }, 250);
  };

  const currentQ = GAME_QUESTIONS[currentIdx % GAME_QUESTIONS.length];

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
      {/* Background soft color blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 fill-current text-indigo-600" /> Mini-Jeu Vivant
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">Sprint 45s</span>
          </div>
          <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black text-slate-900 mt-1">
            Défi Consignes Express ⚡️
          </h3>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3">
            {/* Combo Streak */}
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
              <span className="text-xs text-amber-800 font-medium">Combo :</span>
              <span className={`font-black text-sm ${combo >= 3 ? 'text-amber-600 animate-bounce' : 'text-amber-900'}`}>
                x{combo} 🔥
              </span>
            </div>

            {/* Timer */}
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-black text-base shadow-xs ${
              timeLeft <= 10 ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <Timer className="w-4 h-4" />
              {timeLeft}s
            </div>

            {/* Score */}
            <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-base">
              {score} pts
            </div>
          </div>
        )}
      </div>

      {/* 1. IDLE STATE */}
      {gameState === 'idle' && (
        <div className="text-center py-10 space-y-6 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white fill-current animate-float" />
          </div>

          <div className="max-w-md mx-auto">
            <h4 className="font-['Outfit'] text-2xl font-black text-slate-900 mb-2">Testez vos réflexes d'examen !</h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Vous avez <strong>45 secondes</strong> pour associer chaque verbe d'action à son attente réelle. 
              Enchaînez les bonnes réponses pour déclencher les multiplicateurs de combo !
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-['Outfit'] font-black text-base shadow-lg shadow-indigo-600/25 transition transform hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" /> Lancer la partie (45s)
          </button>
        </div>
      )}

      {/* 2. PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="space-y-6 relative z-10 max-w-xl mx-auto py-2">
          <div className="text-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Verbe d'action cible :
            </span>
            <div className={`font-['Outfit'] text-3xl md:text-5xl font-black mt-2 p-5 rounded-2xl border-2 transition-all shadow-sm ${
              feedback === 'correct' 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 scale-105' 
                : feedback === 'wrong' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700 scale-95' 
                  : 'border-indigo-200 bg-indigo-50/40 text-indigo-900'
            }`}>
              {currentQ.verb}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {shuffledOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.isCorrect)}
                className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white hover:bg-indigo-50/70 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 text-sm sm:text-base font-semibold transition flex items-center justify-between gap-3 shadow-xs hover:shadow-md group active:scale-[0.99]"
              >
                <span className="leading-relaxed">{opt.text}</span>
                <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-100 group-hover:border-indigo-300 transition">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. FINISHED STATE */}
      {gameState === 'finished' && (
        <div className="text-center py-8 space-y-6 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border border-amber-300 p-3 text-amber-600 flex items-center justify-center shadow-md">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h4 className="font-['Outfit'] text-3xl font-black text-slate-900">Sprint Terminé !</h4>
            <div className="font-['Outfit'] text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 mt-2">
              {score} Points
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Combo maximum atteint : <strong className="text-amber-600 font-bold">x{maxCombo}</strong>
            </p>
          </div>

          <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            {score >= 800 ? (
              <span className="text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> Rang : Maître des Consignes (S-Rank) 🏆
              </span>
            ) : score >= 400 ? (
              <span className="text-indigo-700 font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" /> Rang : Tacticien Académique (A-Rank) ⭐️
              </span>
            ) : (
              <span className="text-slate-600 font-medium">
                Rang : Apprenti des Verbes (B-Rank) - Continuez l'entraînement !
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-['Outfit'] font-bold text-sm transition shadow-md shadow-indigo-600/30"
            >
              <RotateCcw className="w-4 h-4" /> Rejouer une partie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
