import React from 'react';
import { Sparkles, Trophy, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { METABOX_INFO } from '../data/metaboxData';

export default function Header({ 
  activeTileId, 
  onSelectTile, 
  completedTiles, 
  completedQuizzes,
  totalQuizzes = 4
}) {
  const completionPercentage = Math.round(((completedTiles.length + completedQuizzes.length) / (8 + totalQuizzes)) * 100);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div 
          onClick={() => onSelectTile('tile-news')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-base bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                PR
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {METABOX_INFO.title}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SAR · HECh
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Dispositif d'Aide à la Réussite · Moodle 685
            </p>
          </div>
        </div>

        {/* Global Progress & Quick AI Lab Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">Progression Métabox</div>
              <div className="text-xs font-bold text-slate-200">
                {completedTiles.length}/8 tuiles · {completedQuizzes.length}/{totalQuizzes} quiz
              </div>
            </div>
            <div className="w-14 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, completionPercentage)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-400">
              {completionPercentage}%
            </span>
          </div>

          {/* Quick jump to Lab IA */}
          <button
            onClick={() => onSelectTile('tile-ia')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
              activeTileId === 'tile-ia'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/25 ring-2 ring-cyan-400/50'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Volet</span> Lab IA ✨
          </button>
        </div>
      </div>
    </header>
  );
}
