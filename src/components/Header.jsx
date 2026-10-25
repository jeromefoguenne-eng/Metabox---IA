import React from 'react';
import { Sparkles, Trophy, LayoutGrid, Flame, CheckCircle, Zap } from 'lucide-react';
import { METABOX_INFO } from '../data/metaboxData';

export default function Header({ 
  activeTileId, 
  onSelectTile, 
  completedTiles, 
  completedQuizzes,
  userXp = 0,
  userLevel = 1,
  totalQuizzes = 4,
  onOpenTrophies
}) {
  const completionPercentage = Math.round(((completedTiles.length + completedQuizzes.length) / (8 + totalQuizzes)) * 100);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div 
          onClick={() => onSelectTile('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-black text-sm bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                PR
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base text-white tracking-tight group-hover:text-indigo-300 transition">
                {METABOX_INFO.title}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SAR · HECh
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Dispositif d'Aide à la Réussite · Moodle 685
            </p>
          </div>
        </div>

        {/* Center / Navigation Quick Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTile('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTileId === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTile('tile-ia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTileId === 'tile-ia'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/25 ring-1 ring-cyan-400'
                : 'bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Lab IA ✨</span>
          </button>
        </div>

        {/* Global Progress, Level & XP Indicator */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-sm">
            <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Niv. {userLevel}</span>
              <span className="text-xs font-black text-amber-400 font-mono">{userXp} XP</span>
            </div>
          </div>

          {/* Trophies Button */}
          {onOpenTrophies && (
            <button
              onClick={onOpenTrophies}
              title="Consulter vos trophées débloqués"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 transition"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

          {/* Global Completion */}
          <div className="hidden lg:flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">Progression</div>
              <div className="text-xs font-bold text-slate-200">
                {completedTiles.length}/8 tuiles
              </div>
            </div>
            <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, completionPercentage)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-400">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
