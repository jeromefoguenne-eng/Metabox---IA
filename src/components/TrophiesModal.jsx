import React from 'react';
import { X, Trophy, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { BADGES_LIST } from '../data/metaboxData';
import { sounds } from '../utils/soundEffects';

export default function TrophiesModal({ isOpen, onClose, unlockedBadges = [] }) {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Soft yellow glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-['Outfit'] text-2xl font-black text-slate-900">Galerie des Trophées 🏆</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {unlockedBadges.length} sur {BADGES_LIST.length} débloqué(s)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {BADGES_LIST.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-['Outfit'] font-bold text-sm text-slate-900">{b.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
