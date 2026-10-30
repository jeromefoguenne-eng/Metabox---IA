import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, Trophy, Timer, CheckCircle, XCircle, Award, Sparkles, Flame, ShieldAlert, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

const GAME_QUESTIONS = [
  { verb: "Biffer", correct: "Barrer un élément d'un trait", traps: ["Gommer avec une gomme", "Tracer un trait dessous"] },
  { verb: "Définir", correct: "Expliquer le sens exact et univoque d'un concept", traps: ["Donner son avis personnel", "Résumer en deux mots vagues"] },
  { verb: "Citer", correct: "Nommer ou énoncer précisément sans développer", traps: ["Expliquer en détail les causes", "Donner une opinion subjective"] },
  { verb: "Comparer", correct: "Dégager à la fois ressemblances ET divergences fondamentales", traps: ["Donner seulement le point fort", "Critiquer négativement un seul terme"] },
  { verb: "Justifier", correct: "Apporter des preuves, arguments logiques et faits probants", traps: ["Répéter la même phrase en boucle", "Exprimer une émotion ou un ressenti"] },
  { verb: "Illustrer", correct: "Fournir un exemple contextualisé ou un cas concret", traps: ["Faire un dessin artistique", "Tracer un tableau sans texte"] },
  { verb: "Synthétiser", correct: "Restituer l'essentiel de façon structurée et concise", traps: ["Recopier tout le texte d'origine", "Donner uniquement des détails secondaires"] },
  { verb: "Classer", correct: "Ranger des éléments selon des critères logiques explicites", traps: ["Mettre au hasard par intuition", "Trier par ordre de préférence esthétique"] },
  { verb: "Souligner", correct: "Tracer un trait directement sous le mot ou groupe de mots", traps: ["Entourer d'une ellipse", "Mettre en gras et surligner"] },
  { verb: "Cocher", correct: "Marquer d'une croix ou d'un trait distinctif une case", traps: ["Colorier entièrement la page", "Barrer la consigne"] },
  { verb: "Analyser", correct: "Décomposer un ensemble en ses parties constituantes pour en saisir la structure", traps: ["Donner une impression d'ensemble sans détail", "Traduire dans une autre langue"] },
  { verb: "Démontrer", correct: "Établir la vérité d'une proposition par un raisonnement déductif rigoureux", traps: ["Répéter l'hypothèse de départ", "Exprimer une conviction intime"] },
  { verb: "Expliciter", correct: "Rendre clair et précis ce qui était implicite ou sous-entendu", traps: ["Masquer les détails gênants", "Résumer en supprimant les explications"] },
  { verb: "Distinguer", correct: "Identifier les caractéristiques singulières qui séparent deux notions proches", traps: ["Considérer les deux notions comme identiques", "Choisir au hasard"] },
  { verb: "Évaluer", correct: "Porter un jugement critique argumenté sur la valeur ou l'efficacité de quelque chose", traps: ["Mettre une note sans aucun critère", "Copier l'avis du voisin"] },
  { verb: "Énumérer", correct: "Énoncer successivement et séparément tous les éléments d'une liste", traps: ["Raconter une longue anecdote romancée", "Ne donner qu'un seul exemple"] },
  { verb: "Interpréter", correct: "Donner un sens argumenté à des données, un graphique ou un comportement", traps: ["Recopier les chiffres bruts sans explication", "Inventer des données imaginaires"] },
  { verb: "Valider", correct: "Confirmer la conformité ou l'exactitude selon des critères préétablis", traps: ["Contester systématiquement sans argument", "Ignorer les critères d'évaluation"] }
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
  const [streakTier, setStreakTier] = useState(1);

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
    setStreakTier(1);
    prepareQuestion(0);
  };

  // Keyboard controls [1, 2, 3]
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (feedback !== null) return;
      if (e.key === '1' && shuffledOptions[0]) handleAnswer(shuffledOptions[0].isCorrect);
      if (e.key === '2' && shuffledOptions[1]) handleAnswer(shuffledOptions[1].isCorrect);
      if (e.key === '3' && shuffledOptions[2]) handleAnswer(shuffledOptions[2].isCorrect);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, shuffledOptions, feedback]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      sounds.playFanfare();
      confetti({ particleCount: 130, spread: 90, origin: { y: 0.6 } });
      if (onFinishGame) onFinishGame(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, score]);

  const handleAnswer = (isCorrect) => {
    if (feedback !== null) return;

    if (isCorrect) {
      const newCombo = combo + 1;
      sounds.playCombo(newCombo);
      const mult = newCombo >= 6 ? 2.0 : newCombo >= 3 ? 1.5 : 1.0;
      const points = Math.round(100 * mult);
      setScore(prev => prev + points);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setStreakTier(newCombo >= 6 ? 3 : newCombo >= 3 ? 2 : 1);
      setFeedback('correct');
    } else {
      sounds.playError();
      setCombo(0);
      setStreakTier(1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      prepareQuestion(nextIdx);
    }, 280);
  };

  const currentQ = GAME_QUESTIONS[currentIdx % GAME_QUESTIONS.length];

  return (
    <div className="rounded-3xl bg-gradient-to-b from-slate-950 via-indigo-950/80 to-slate-950 border-2 border-cyan-500/40 p-6 md:p-8 shadow-2xl relative overflow-hidden text-white select-none">
      
      {/* Background Cyber Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_60%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 fill-current animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ARCADE SPRINT · 45 SECONDES
              </span>
              <span className="text-[10px] font-mono text-slate-400">Verbes d'Action HECh</span>
            </div>
            <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-white tracking-wide mt-0.5">
              Défi Consignes Express ⚡️
            </h3>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3">
            {/* Combo Streak Indicator */}
            <div className={`px-3.5 py-1.5 rounded-2xl border flex items-center gap-2 transition-all ${
              streakTier === 3 
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg shadow-rose-500/30 animate-pulse' 
                : streakTier === 2 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
            }`}>
              <Flame className={`w-4 h-4 ${combo >= 3 ? 'text-amber-400 animate-bounce fill-current' : 'text-slate-500'}`} />
              <div className="text-left font-mono leading-none">
                <span className="text-[9px] uppercase block text-slate-400">Combo</span>
                <span className="font-black text-sm text-white">x{combo}</span>
              </div>
            </div>

            {/* Timer Display */}
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-mono font-black text-base shadow-lg ${
              timeLeft <= 10 
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/50' 
                : 'bg-slate-900/90 border-cyan-500/40 text-cyan-300'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>

            {/* Score Display */}
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-200 font-mono font-black text-base shadow-lg">
              {score} PTS
            </div>
          </div>
        )}
      </div>

      {/* 1. IDLE STATE */}
      {gameState === 'idle' && (
        <div className="text-center py-10 space-y-6 relative z-10 max-w-xl mx-auto">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-fuchsia-600 p-1 shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Zap className="w-12 h-12 text-cyan-400 fill-current animate-bounce" />
            </div>
          </div>

          <div>
            <h4 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-white">
              Prêt pour le Sprint des Consignes ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Associez instantanément chaque verbe d'évaluation académique à son attente réelle. 
              Utilisez la souris ou les touches <span className="font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">[1]</span>, <span className="font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">[2]</span>, <span className="font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">[3]</span> pour enchaîner les combos !
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-['Outfit'] font-black text-base shadow-xl shadow-cyan-500/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Lancer la Partie (45 secondes)</span>
          </button>
        </div>
      )}

      {/* 2. PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="space-y-6 relative z-10 max-w-xl mx-auto py-2">
          
          {/* Target Verb Big Display Card */}
          <div className="text-center relative">
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 inline-block">
              Verbe de consigne à identifier :
            </span>

            <div className={`font-['Outfit'] text-4xl sm:text-6xl font-black mt-3 p-6 rounded-3xl border-2 transition-all shadow-2xl relative overflow-hidden ${
              feedback === 'correct' 
                ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 scale-105 shadow-emerald-500/30' 
                : feedback === 'wrong' 
                  ? 'border-rose-500 bg-rose-950/80 text-rose-200 scale-95 shadow-rose-500/30' 
                  : 'border-cyan-500/50 bg-slate-900/90 text-white shadow-cyan-500/20'
            }`}>
              {/* Pulse scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none animate-pulse" />
              {currentQ.verb}
            </div>
          </div>

          {/* 3 Interactive Response Options with 3D Depth */}
          <div className="space-y-3 pt-2">
            {shuffledOptions.map((opt, idx) => (
              <button
                key={idx}
                disabled={feedback !== null}
                onClick={() => handleAnswer(opt.isCorrect)}
                className="w-full text-left p-4 sm:p-5 rounded-2xl bg-slate-900/90 hover:bg-indigo-900/40 active:scale-[0.98] border-2 border-slate-800 hover:border-cyan-400/80 text-white text-sm sm:text-base font-semibold transition-all flex items-center justify-between gap-3 shadow-md hover:shadow-cyan-500/20 cursor-pointer group"
              >
                <span className="leading-snug">{opt.text}</span>
                <span className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 border border-slate-700 group-hover:border-cyan-400 flex items-center justify-center text-xs font-mono font-bold text-cyan-300 transition shrink-0">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Hint bar */}
          <p className="text-center text-[11px] font-mono text-slate-400">
            Astuce : Utilisez les touches du clavier <strong className="text-cyan-300 font-bold">[1]</strong>, <strong className="text-cyan-300 font-bold">[2]</strong>, <strong className="text-cyan-300 font-bold">[3]</strong> pour jouer plus vite !
          </p>
        </div>
      )}

      {/* 3. FINISHED STATE */}
      {gameState === 'finished' && (
        <div className="text-center py-8 space-y-6 relative z-10 max-w-md mx-auto animate-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Sprint Terminé · Bilan de Réflexes
            </span>
            <div className="font-['Outfit'] text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300 mt-1">
              {score} Points
            </div>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Meilleur combo aligné : <strong className="text-amber-400 font-bold">x{maxCombo}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            {score >= 800 ? (
              <span className="text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> RANG S : Maître Suprême des Consignes 🏆
              </span>
            ) : score >= 400 ? (
              <span className="text-cyan-300 font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" /> RANG A : Tacticien Académique Éclairé ⭐️
              </span>
            ) : (
              <span className="text-amber-300 font-medium">
                RANG B : Apprenti des Verbes — Continuez l'entraînement !
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition transform hover:scale-105 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rejouer un Sprint Express</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
