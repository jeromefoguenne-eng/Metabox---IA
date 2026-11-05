import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Sliders, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  PieChart, 
  ShieldCheck, 
  Target,
  Hourglass,
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import EisenhowerBoard from './EisenhowerBoard';
import { sounds } from '../utils/soundEffects';

export default function MethodoOutilsSuite() {
  const [activeTab, setActiveTab] = useState('eisenhower'); // 'eisenhower' | 'pomodoro' | 'parkinson' | 'pareto'

  // =========================================================================
  // ÉTAT POMODORO
  // =========================================================================
  const POMODORO_WORK_SEC = 25 * 60;
  const POMODORO_BREAK_SEC = 5 * 60;
  const [pomoMode, setPomoMode] = useState('work'); // 'work' | 'break'
  const [pomoTimeLeft, setPomoTimeLeft] = useState(POMODORO_WORK_SEC);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoCycles, setPomoCycles] = useState(0);

  useEffect(() => {
    let timer = null;
    if (pomoRunning) {
      timer = setInterval(() => {
        setPomoTimeLeft(prev => {
          if (prev <= 1) {
            sounds.playApplause();
            if (pomoMode === 'work') {
              sounds.speakHost("Session Pomodoro terminée ! Prenez 5 minutes de pause méritée.");
              setPomoMode('break');
              setPomoCycles(c => c + 1);
              return POMODORO_BREAK_SEC;
            } else {
              sounds.speakHost("La pause est terminée. Repartez pour 25 minutes de focus intense !");
              setPomoMode('work');
              return POMODORO_WORK_SEC;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [pomoRunning, pomoMode]);

  const togglePomo = () => {
    sounds.playPop();
    setPomoRunning(!pomoRunning);
  };

  const resetPomo = () => {
    sounds.playPop();
    setPomoRunning(false);
    setPomoTimeLeft(pomoMode === 'work' ? POMODORO_WORK_SEC : POMODORO_BREAK_SEC);
  };

  const formatPomoTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // ÉTAT SIMULATEUR LOI DE PARKINSON
  // =========================================================================
  const [taskName, setTaskName] = useState('Rédiger le rapport de synthèse SAR');
  const [standardDays, setStandardDays] = useState(14); // 2 semaines
  const [focusedDays, setFocusedDays] = useState(4); // 4 jours ciblés
  const [distractionLevel, setDistractionLevel] = useState('medium'); // 'low' | 'medium' | 'high'

  // =========================================================================
  // ÉTAT PRINCIPE DE PARETO (80/20)
  // =========================================================================
  const [paretoConceptInput, setParetoConceptInput] = useState('');
  const [paretoConcepts, setParetoConcepts] = useState([
    { id: 1, name: "Schéma d'intégration & concepts clés (20%)", isCore: true, impact: "80% des points à l'examen" },
    { id: 2, name: "Définitions des verbes d'action (20%)", isCore: true, impact: "Compréhension de toutes les questions" },
    { id: 3, name: "Couleur des surligneurs et mise en page (80%)", isCore: false, impact: "0% des points (piège de futilité)" },
    { id: 4, name: "Relecture passive répétée de notes secondaires (80%)", isCore: false, impact: "Faible rétention (illusion de maîtrise)" }
  ]);

  const togglePareto = (id) => {
    sounds.playPop();
    setParetoConcepts(prev => prev.map(c => c.id === id ? { ...c, isCore: !c.isCore } : c));
  };

  return (
    <div className="space-y-6">
      {/* Barre de navigation des 4 Outils de Gestion */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                LA MÉTHODOLOGIE · PLANIFIER SON TRAVAIL & PRIORISER
              </span>
              <h3 className="font-['Outfit'] text-lg font-black text-white">
                Les 4 Outils Pratiques de Gestion du Temps (SAR HECh)
              </h3>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Cliquez pour basculer entre les outils
          </span>
        </div>

        {/* Boutons d'onglets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          <button
            onClick={() => { sounds.playPop(); setActiveTab('eisenhower'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'eisenhower'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span>1. Matrice d'Eisenhower</span>
          </button>

          <button
            onClick={() => { sounds.playPop(); setActiveTab('pomodoro'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'pomodoro'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-black shadow-lg shadow-rose-500/30'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>2. Méthode Pomodoro</span>
          </button>

          <button
            onClick={() => { sounds.playPop(); setActiveTab('parkinson'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'parkinson'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-lg shadow-indigo-500/30'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Hourglass className="w-4 h-4 shrink-0" />
            <span>3. Loi de Parkinson & Futilité</span>
          </button>

          <button
            onClick={() => { sounds.playPop(); setActiveTab('pareto'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'pareto'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4 shrink-0" />
            <span>4. Loi de Pareto (80/20)</span>
          </button>
        </div>
      </div>

      {/* CONTENU SELON L'ONGLET SÉLECTIONNÉ */}

      {/* 1. MATRICE D'EISENHOWER */}
      {activeTab === 'eisenhower' && (
        <div className="animate-in fade-in duration-200">
          <EisenhowerBoard />
        </div>
      )}

      {/* 2. MÉTHODE POMODORO INTERACTIVE */}
      {activeTab === 'pomodoro' && (
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Colonne Gauche : Minuteur Circulaire & Contrôles */}
            <div className="flex flex-col items-center text-center space-y-5 max-w-sm w-full">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${
                pomoMode === 'work'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {pomoMode === 'work' ? '🔥 SESSION DE TRAVAIL PROFOND (FOCUS)' : '☕ PAUSE SYNAPTIQUE (DÉTENTE)'}
              </span>

              {/* Cadran Numérique Immersif */}
              <div className="relative w-64 h-64 rounded-full bg-slate-950 border-4 border-slate-800 flex flex-col items-center justify-center shadow-2xl shadow-rose-950/50">
                <span className="text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                  {formatPomoTime(pomoTimeLeft)}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-2">
                  {pomoMode === 'work' ? '25 minutes sans interruption' : '5 minutes de repos actif'}
                </span>

                {/* Badge cycles complétés */}
                <div className="absolute -bottom-3 px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-md">
                  <span>🍅 Cycles réussis :</span>
                  <span className="font-black text-white">{pomoCycles}</span>
                </div>
              </div>

              {/* Boutons d'Action */}
              <div className="flex items-center gap-3 w-full pt-3">
                <button
                  onClick={togglePomo}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    pomoRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  }`}
                >
                  {pomoRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{pomoRunning ? 'Mettre en Pause' : 'Démarrer le Pomodoro'}</span>
                </button>
                <button
                  onClick={resetPomo}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Réinitialiser le chrono"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Colonne Droite : Règles & Bénéfices Neuro-Scientifiques */}
            <div className="flex-1 space-y-4 text-left">
              <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-rose-400" />
                Pourquoi la Technique Pomodoro fonctionne pour l'étudiant ?
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Le cerveau humain ne peut maintenir une attention maximale soutenue au-delà de 25 à 30 minutes. 
                Vouloir réviser 4 heures d'affilée sans pause engendre une saturation cognitive où l'on relit la même page 5 fois sans rien enregistrer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-rose-400 uppercase font-mono">1. Zéro Distraction</span>
                  <p className="text-xs text-slate-300">
                    Pendant les 25 minutes : smartphone hors de vue, notifications coupées, un seul objectif précis.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono">2. Vraie Pause de 5 min</span>
                  <p className="text-xs text-slate-300">
                    Levez-vous, buvez de l'eau, marchez. Interdiction de scroller sur les réseaux (laisse respirer la dopamine).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono">3. La Grande Pause (4 cycles)</span>
                  <p className="text-xs text-slate-300">
                    Après 4 sessions complétées (soit 2h d'étude pure), accordez-vous 20 à 30 minutes de détente totale.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase font-mono">4. Victoire psychologique</span>
                  <p className="text-xs text-slate-300">
                    Découper un cours colossal en tranches de 25 minutes désamorce la procrastination en levant l'angoisse de la montagne.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOI DE PARKINSON ET LOI DE LA FUTILITÉ */}
      {activeTab === 'parkinson' && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                LOI DE PARKINSON & LOI DE LA FUTILITÉ DE PARKINSON
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white mt-2">
                « Le travail s'étale de façon à occuper tout le temps disponible pour son achèvement. »
              </h4>
              <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Si un professeur vous donne 3 semaines pour rendre une synthèse de 4 pages, vous y passerez 3 semaines d'angoisse et vous rédigerez l'essentiel la dernière nuit. 
                Si vous vous fixez une micro-échéance stricte de 3 jours, la synthèse sera de même qualité, sans le stress prolongé !
              </p>
            </div>
          </div>

          {/* Simulateur interactif de cadrage de projet */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase font-mono">
              Simulateur d'Échéance Artificielle & Gain de Temps :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Intitulé du travail ou de la révision :</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-indigo-400"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 block mb-1">Délai officiel prof :</label>
                  <div className="bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-sm text-rose-300 font-bold">
                    {standardDays} jours (Étalement maximal)
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 block mb-1">Votre Deadline Anticipée :</label>
                  <div className="bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-emerald-300 font-bold">
                    {focusedDays} jours (Focus strict)
                  </div>
                </div>
              </div>
            </div>

            {/* Bilan visuel de gain */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h5 className="text-sm font-black text-white">Temps mental libéré : {standardDays - focusedDays} jours d'avance</h5>
                  <p className="text-xs text-slate-300">Vous éliminez 70% de la charge mentale et sécurisez votre calendrier contre les imprévus.</p>
                </div>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shrink-0">
                +300% d'efficacité
              </span>
            </div>
          </div>

          {/* Focus sur le piège : La Loi de la Futilité (Bike-shedding) */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Attention au piège de la Futilité (« The Law of Triviality »)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              La loi de futilité de Parkinson explique que les étudiants passent <strong>90% de leur temps sur des détails triviaux</strong> (choisir la police d'écriture, organiser ses 12 surligneurs pastel, refaire trois fois la page de garde) plutôt que d'affronter le travail intellectuel exigeant (comprendre le concept, s'auto-évaluer sur une question difficile).
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">❌ Futilité : 1h30 pour surligner son cours sans le comprendre</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✅ Efficacité : 45 min pour fermer ses notes et écrire la structure de mémoire</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRINCIPE DE PARETO (80/20) */}
      {activeTab === 'pareto' && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                LOI DE PARETO (PRINCIPE DU 80 / 20)
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white mt-2">
                20 % des concepts fondamentaux produisent 80 % de votre réussite aux examens
              </h4>
              <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Dans n'importe quelle unité d'enseignement (UE), toutes les pages du syllabus n'ont pas le même poids. 
                Apprendre à isoler les 20% de notions piliers (les théorèmes majeurs, les verbes d'action, les schémas d'intégration) vous garantit de valider la majorité des crédits avant même de peaufiner les détails.
              </p>
            </div>
          </div>

          {/* Grille comparative 20% vs 80% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonne 20% Essentiel */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase text-emerald-400">Le 20% Majeur (À maîtriser en priorité)</span>
                <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">80% des Points</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Les verbes d'action des consignes</strong> : Savoir immédiatement ce que l'évaluateur exige (justifier vs décrire).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Les schémas directeurs & formules clés</strong> : Les matrices conceptuelles qui relient toutes les sous-notions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Les annales et questions récurrentes</strong> : Les questions types que les professeurs posent chaque année.</span>
                </li>
              </ul>
            </div>

            {/* Colonne 80% Secondaire */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase text-slate-400">Le 80% Périphérique (Ne pas y passer tout son temps)</span>
                <span className="text-xs bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">20% des Points</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Les anecdotes historiques et exemples marginaux cités à l'oral par le prof.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>L'apprentissage par cœur de dates non demandées sans comprendre le fil conducteur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>La mise en page esthétique excessive avant d'avoir vérifié l'exactitude du fond.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
