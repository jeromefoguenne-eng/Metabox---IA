import React, { useState } from 'react';
import { Plus, Check, Clock, AlertTriangle, Sparkles, Trash2 } from 'lucide-react';

const INITIAL_TASKS = [
  { id: 't1', text: 'Rapport de TP à rendre demain matin 8h', quadrant: 'q1', defaultQuadrant: 'q1' },
  { id: 't2', text: 'Réactivation continue des fiches (mémorisation espacée)', quadrant: 'q2', defaultQuadrant: 'q2' },
  { id: 't3', text: 'Répondre aux messages du groupe WhatsApp de promo', quadrant: 'q3', defaultQuadrant: 'q3' },
  { id: 't4', text: 'Scroller sur Instagram pendant le temps d’étude', quadrant: 'q4', defaultQuadrant: 'q4' },
  { id: 't5', text: 'Planifier les sessions du blocus de janvier', quadrant: 'q2', defaultQuadrant: 'q2' },
  { id: 't6', text: 'Justifier une absence imprévue au secrétariat avec certificat', quadrant: 'q1', defaultQuadrant: 'q1' }
];

export default function EisenhowerBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTaskText, setNewTaskText] = useState('');
  const [targetQuad, setTargetQuad] = useState('q2');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
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
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleMove = (id, newQuad) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant: newQuad } : t));
  };

  const quadrants = [
    {
      id: 'q1',
      title: 'Q1 : Urgent & Important',
      subtitle: 'Crises & Échéances Immédiates',
      action: 'À FAIRE IMMÉDIATEMENT',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      badge: 'bg-rose-500/20 text-rose-300'
    },
    {
      id: 'q2',
      title: 'Q2 : Non Urgent mais Important',
      subtitle: 'La Clé de la Réussite Académique',
      action: 'À PLANIFIER DANS LA SEMAINE',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'q3',
      title: 'Q3 : Urgent mais Non Important',
      subtitle: 'Interruptions & Sollicitations',
      action: 'À DÉLÉGUER OU REGROUPER',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'q4',
      title: 'Q4 : Ni Urgent ni Important',
      subtitle: 'Distractions Chronophages',
      action: 'À ÉLIMINER / RESTREINDRE',
      color: 'border-slate-600/40 bg-slate-900/40 text-slate-400',
      badge: 'bg-slate-700/40 text-slate-400'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Atelier Interactif Méthodologique
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Matrice d'Eisenhower : Prioriser ses Semaines</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Classez vos tâches d'études selon leur degré d'urgence et d'importance pour désamorcer la procrastination.
          </p>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleAddTask} className="flex flex-wrap gap-2 mb-6 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Ajouter une tâche d'étude personnelle..."
          className="flex-1 min-w-[240px] px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={targetQuad}
          onChange={(e) => setTargetQuad(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
        >
          <option value="q1">Q1 : Urgent & Important</option>
          <option value="q2">Q2 : Important (Révisions/Fiches)</option>
          <option value="q3">Q3 : Urgent non important</option>
          <option value="q4">Q4 : Ni urgent ni important</option>
        </select>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

      {/* Grid of 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map(q => {
          const quadTasks = tasks.filter(t => t.quadrant === q.id);
          return (
            <div key={q.id} className={`p-4 rounded-xl border flex flex-col justify-between ${q.color}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-white">{q.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${q.badge}`}>
                    {q.action}
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-3">{q.subtitle}</p>

                <div className="space-y-2 min-h-[140px]">
                  {quadTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 italic py-6">
                      Aucune tâche dans ce quadrant
                    </div>
                  ) : (
                    quadTasks.map(t => (
                      <div
                        key={t.id}
                        className="bg-slate-900/90 border border-slate-700/70 p-2.5 rounded-lg text-xs text-slate-200 flex items-start justify-between gap-2 shadow-sm"
                      >
                        <span className="flex-1">{t.text}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Move selectors */}
                          <select
                            value={t.quadrant}
                            onChange={(e) => handleMove(t.id, e.target.value)}
                            className="bg-slate-800 text-[10px] text-slate-300 border border-slate-700 rounded px-1 py-0.5"
                          >
                            <option value="q1">Q1</option>
                            <option value="q2">Q2</option>
                            <option value="q3">Q3</option>
                            <option value="q4">Q4</option>
                          </select>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] opacity-70">
                {q.id === 'q2' && '⭐️ Astuce SAR : Les étudiants en réussite passent 70% de leur temps libre en Q2.'}
                {q.id === 'q1' && '⚠️ Attention : Vivre uniquement en Q1 crée épuisement et stress chronique.'}
                {q.id === 'q3' && '🔔 Astuce : Coupez les notifications pendant vos blocs d’étude de 45 min.'}
                {q.id === 'q4' && '🛑 Détox : Gardez le scroll passif pour les pauses réelles, pas pendant l’étude.'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
