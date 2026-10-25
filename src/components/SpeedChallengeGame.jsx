import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, Trophy, Timer, CheckCircle, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

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
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
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
      const points = 100 + (newCombo * 10);
      setScore(prev => prev + points);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setFeedback('correct');
    } else {
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
    <div className="bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Mini-Jeu Actif
            </span>
            <span className="text-xs text-slate-400 font-mono">Sprint 45s</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white mt-1">
            Défi Consignes Express ⚡️
          </h3>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            {/* Combo Streak */}
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
              <span className="text-xs text-slate-400">Combo :</span>
              <span className={`font-black text-sm ${combo >= 3 ? 'text-amber-400 animate-pulse' : 'text-slate-200'}`}>
                x{combo} 🔥
              </span>
            </div>

            {/* Timer */}
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-base ${
              timeLeft <= 10 ? 'bg-rose-950/40 border-rose-500 text-rose-400 animate-bounce' : 'bg-slate-800 border-slate-700 text-cyan-300'
            }`}>
              <Timer className="w-4 h-4" />
              {timeLeft}s
            </div>

            {/* Score */}
            <div className="px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-black text-base">
              {score} pts
            </div>
          </div>
        )}
      </div>

      {/* GAME STATES */}

      {/* 1. IDLE STATE */}
      {gameState === 'idle' && (
        <div className="text-center py-10 space-y-6 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <div className="max-w-md mx-auto">
            <h4 className="text-xl font-bold text-white mb-2">Testez vos réflexes d'examen !</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Vous avez <strong>45 secondes</strong> pour associer chaque verbe d'action à son attente réelle. 
              Enchaînez les bonnes réponses pour déclencher les multiplicateurs de combo !
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-base shadow-lg shadow-cyan-500/30 transition transform hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" /> Lancer la partie (45s)
          </button>
        </div>
      )}

      {/* 2. PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="space-y-6 relative z-10 max-w-xl mx-auto py-4">
          <div className="text-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Verbe d'action cible :
            </span>
            <div className={`text-3xl md:text-4xl font-black text-white mt-2 p-4 rounded-2xl bg-slate-800/80 border transition-all ${
              feedback === 'correct' 
                ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 scale-105' 
                : feedback === 'wrong' 
                  ? 'border-rose-500 bg-rose-950/30 text-rose-300 scale-95' 
                  : 'border-slate-700'
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
                className="w-full text-left p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-400/60 text-slate-100 text-sm md:text-base font-semibold transition flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <span>{opt.text}</span>
                <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-400 transition">
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 p-3 text-amber-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Partie Terminée !</h4>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400 mt-2">
              {score} Points
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Combo maximum atteint : <strong className="text-amber-400">x{maxCombo}</strong>
            </p>
          </div>

          <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            {score >= 800 ? (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4" /> Rang : Maître des Consignes (S-Rank)
              </span>
            ) : score >= 400 ? (
              <span className="text-cyan-400 font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4" /> Rang : Tacticien Académique (A-Rank)
              </span>
            ) : (
              <span className="text-slate-400 font-medium">
                Rang : Apprenti des Verbes (B-Rank) - Continuez l'entraînement !
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-600/30"
            >
              <RotateCcw className="w-4 h-4" /> Rejouer une partie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
