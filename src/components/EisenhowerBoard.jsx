import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Target, 
  ArrowRight, 
  Flame,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const INITIAL_TASKS = [
  { id: 't1', text: 'Rapport de TP à rendre demain matin 8h', quadrant: 'q1' },
  { id: 't2', text: 'Réactivation continue des fiches (mémorisation espacée)', quadrant: 'q2' },
  { id: 't3', text: 'Répondre aux messages du groupe WhatsApp de promo', quadrant: 'q3' },
  { id: 't4', text: 'Scroller sur TikTok/Instagram pendant le bloc d’étude', quadrant: 'q4' },
  { id: 't5', text: 'Planifier les sessions du blocus de janvier (semaine par semaine)', quadrant: 'q2' },
  { id: 't6', text: 'Justifier une absence imprévue au secrétariat avec certificat', quadrant: 'q1' }
];

export default function EisenhowerBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTaskText, setNewTaskText] = useState('');
  const [targetQuad, setTargetQuad] = useState('q2');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    sounds.playSuccess();
    setTasks(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        text: newTaskText.trim(),
        quadrant: targetQuad
      }
    ]);
    setNewTaskText('');
  };

  const handleDelete = (id) => {
    sounds.playPop();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleMove = (id, newQuad) => {
    sounds.playPop();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant: newQuad } : t));
  };

  // Calcul du taux de réussite académique (Ratio Q2)
  const totalTasks = tasks.length;
  const q2Count = tasks.filter(t => t.quadrant === 'q2').length;
  const q2Percentage = totalTasks > 0 ? Math.round((q2Count / totalTasks) * 100) : 0;

  const quadrants = [
    {
      id: 'q1',
      title: 'Q1 : Urgent & Important',
      subtitle: 'Crises & Échéances Immédiates',
      action: 'À TRAITER SANS ATTENDRE',
      accent: 'rose',
      border: 'border-rose-500/50',
      bg: 'bg-rose-950/20',
      badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
      itemBg: 'bg-slate-900/90 border-rose-500/30 text-rose-100',
      tip: '⚠️ Vivre uniquement en Q1 engendre stress chronique et fatigue mentale.'
    },
    {
      id: 'q2',
      title: 'Q2 : Non Urgent mais Important',
      subtitle: 'La Clé de la Réussite Académique',
      action: 'À PLANIFIER EN PRIORITÉ',
      accent: 'emerald',
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-950/20',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      itemBg: 'bg-slate-900/90 border-emerald-500/30 text-emerald-100',
      tip: '⭐️ Les étudiants qui réussissent investissent plus de 60% de leur énergie en Q2.'
    },
    {
      id: 'q3',
      title: 'Q3 : Urgent mais Non Important',
      subtitle: 'Interruptions & Sollicitations Externes',
      action: 'À DÉLÉGUER OU REGROUPER',
      accent: 'amber',
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/20',
      badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      itemBg: 'bg-slate-900/90 border-amber-500/30 text-amber-100',
      tip: '🔔 Coupez vos notifications mobiles pendant vos séances de travail profond.'
    },
    {
      id: 'q4',
      title: 'Q4 : Ni Urgent ni Important',
      subtitle: 'Distractions & Fuites Temporelles',
      action: 'À ÉLIMINER OU RESTREINDRE',
      accent: 'slate',
      border: 'border-slate-700/60',
      bg: 'bg-slate-900/30',
      badge: 'bg-slate-800 text-slate-300 border border-slate-700',
      itemBg: 'bg-slate-950/80 border-slate-800 text-slate-300',
      tip: '🛑 Détox : Isolez les réseaux sociaux à vos pauses de détente réelles.'
    }
  ];

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl text-white font-['Lexend']">
      
      {/* Header avec Jauge d'Efficience Académique */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              Atelier Méthodologique HECh
            </span>
          </div>
          <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            Matrice d'Eisenhower : Prioriser ses Semaines <Target className="w-5 h-5 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Classez vos tâches d'études selon leur degré d'urgence et d'importance pour désamorcer la procrastination.
          </p>
        </div>

        {/* Jauge d'Investissement Q2 */}
        <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-emerald-500/40 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
            {q2Percentage}%
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-300">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>EFFICIENCE ACADÉMIQUE</span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              {q2Percentage >= 50 ? 'Zone d’anticipation du major 🎯' : 'Attention : trop de surcharge réactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleAddTask} className="flex flex-wrap gap-2.5 mb-6 bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Ajouter une tâche d'étude personnelle..."
          className="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <select
          value={targetQuad}
          onChange={(e) => setTargetQuad(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
        >
          <option value="q1">Q1 : Urgent & Important</option>
          <option value="q2">Q2 : Important (Révisions/Fiches)</option>
          <option value="q3">Q3 : Urgent non important</option>
          <option value="q4">Q4 : Ni urgent ni important</option>
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-['Outfit'] font-black uppercase tracking-wider transition shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

      {/* Grid of 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrants.map(q => {
          const quadTasks = tasks.filter(t => t.quadrant === q.id);
          return (
            <div key={q.id} className={`p-4 sm:p-5 rounded-2xl border ${q.border} ${q.bg} flex flex-col justify-between backdrop-blur-sm shadow-xl`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-['Outfit'] font-black text-sm sm:text-base text-white">{q.title}</h4>
                  <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${q.badge}`}>
                    {q.action}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{q.subtitle}</p>

                <div className="space-y-2 min-h-[140px]">
                  {quadTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-600 italic py-8 font-mono">
                      Aucune tâche dans ce quadrant
                    </div>
                  ) : (
                    quadTasks.map(t => (
                      <div
                        key={t.id}
                        className={`p-3 rounded-xl border text-xs text-slate-200 flex items-start justify-between gap-2 shadow-sm transition hover:border-slate-500 ${q.itemBg}`}
                      >
                        <span className="flex-1 font-medium leading-relaxed">{t.text}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Quick Move Select */}
                          <select
                            value={t.quadrant}
                            onChange={(e) => handleMove(t.id, e.target.value)}
                            className="bg-slate-950 text-[10px] font-mono text-cyan-300 border border-slate-700 rounded-lg px-2 py-1 cursor-pointer font-bold"
                            title="Déplacer vers un autre quadrant"
                          >
                            <option value="q1">Q1</option>
                            <option value="q2">Q2</option>
                            <option value="q3">Q3</option>
                            <option value="q4">Q4</option>
                          </select>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                            title="Supprimer la tâche"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                {q.tip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
