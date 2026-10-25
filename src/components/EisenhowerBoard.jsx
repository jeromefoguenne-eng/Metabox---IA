import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const INITIAL_TASKS = [
  { id: 't1', text: 'Rapport de TP à rendre demain matin 8h', quadrant: 'q1' },
  { id: 't2', text: 'Réactivation continue des fiches (mémorisation espacée)', quadrant: 'q2' },
  { id: 't3', text: 'Répondre aux messages du groupe WhatsApp de promo', quadrant: 'q3' },
  { id: 't4', text: 'Scroller sur Instagram pendant le temps d’étude', quadrant: 'q4' },
  { id: 't5', text: 'Planifier les sessions du blocus de janvier', quadrant: 'q2' },
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

  const quadrants = [
    {
      id: 'q1',
      title: 'Q1 : Urgent & Important',
      subtitle: 'Crises & Échéances Immédiates',
      action: 'À FAIRE IMMÉDIATEMENT',
      color: 'border-rose-300 bg-rose-50/60 text-rose-950',
      badge: 'bg-rose-200 text-rose-900',
      itemBg: 'bg-white border-rose-200'
    },
    {
      id: 'q2',
      title: 'Q2 : Non Urgent mais Important',
      subtitle: 'La Clé de la Réussite Académique',
      action: 'À PLANIFIER DANS LA SEMAINE',
      color: 'border-emerald-300 bg-emerald-50/60 text-emerald-950',
      badge: 'bg-emerald-200 text-emerald-900',
      itemBg: 'bg-white border-emerald-200'
    },
    {
      id: 'q3',
      title: 'Q3 : Urgent mais Non Important',
      subtitle: 'Interruptions & Sollicitations',
      action: 'À DÉLÉGUER OU REGROUPER',
      color: 'border-amber-300 bg-amber-50/60 text-amber-950',
      badge: 'bg-amber-200 text-amber-900',
      itemBg: 'bg-white border-amber-200'
    },
    {
      id: 'q4',
      title: 'Q4 : Ni Urgent ni Important',
      subtitle: 'Distractions Chronophages',
      action: 'À ÉLIMINER / RESTREINDRE',
      color: 'border-slate-300 bg-slate-100/70 text-slate-800',
      badge: 'bg-slate-200 text-slate-800',
      itemBg: 'bg-white border-slate-200'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Atelier Interactif Méthodologique
          </span>
          <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Matrice d'Eisenhower : Prioriser ses Semaines 🎯
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Classez vos tâches d'études selon leur degré d'urgence et d'importance pour désamorcer la procrastination.
          </p>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleAddTask} className="flex flex-wrap gap-2.5 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Ajouter une tâche d'étude personnelle..."
          className="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
        />
        <select
          value={targetQuad}
          onChange={(e) => setTargetQuad(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-700 focus:outline-none shadow-xs font-medium"
        >
          <option value="q1">Q1 : Urgent & Important</option>
          <option value="q2">Q2 : Important (Révisions/Fiches)</option>
          <option value="q3">Q3 : Urgent non important</option>
          <option value="q4">Q4 : Ni urgent ni important</option>
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

      {/* Grid of 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map(q => {
          const quadTasks = tasks.filter(t => t.quadrant === q.id);
          return (
            <div key={q.id} className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${q.color}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-['Outfit'] font-bold text-base text-slate-900">{q.title}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${q.badge}`}>
                    {q.action}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4">{q.subtitle}</p>

                <div className="space-y-2.5 min-h-[140px]">
                  {quadTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-8">
                      Aucune tâche dans ce quadrant
                    </div>
                  ) : (
                    quadTasks.map(t => (
                      <div
                        key={t.id}
                        className={`p-3 rounded-xl border text-xs sm:text-sm text-slate-800 flex items-start justify-between gap-2 shadow-xs ${q.itemBg}`}
                      >
                        <span className="flex-1 font-medium">{t.text}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Move selectors */}
                          <select
                            value={t.quadrant}
                            onChange={(e) => handleMove(t.id, e.target.value)}
                            className="bg-slate-50 text-[11px] text-slate-700 border border-slate-300 rounded-lg px-2 py-1 font-semibold"
                          >
                            <option value="q1">Q1</option>
                            <option value="q2">Q2</option>
                            <option value="q3">Q3</option>
                            <option value="q4">Q4</option>
                          </select>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 font-medium">
                {q.id === 'q2' && '⭐️ Astuce SAR : Les étudiants qui réussissent investissent 70% de leur temps en Q2.'}
                {q.id === 'q1' && '⚠️ Attention : Vivre uniquement en Q1 engendre du stress et de l’épuisement.'}
                {q.id === 'q3' && '🔔 Astuce : Désactivez vos notifications pendant vos sessions de travail concentré.'}
                {q.id === 'q4' && '🛑 Détox : Réservez les réseaux sociaux à vos pauses réelles de détente.'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
