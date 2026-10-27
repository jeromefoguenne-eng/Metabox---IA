import React, { useState } from 'react';
import { Sparkles, Trophy, LayoutGrid, Volume2, VolumeX, Zap, Film } from 'lucide-react';
import { METABOX_INFO } from '../data/metaboxData';
import { sounds } from '../utils/soundEffects';

export default function Header({ 
  activeTileId, 
  onSelectTile, 
  completedTiles = [], 
  completedQuizzes = [],
  userXp = 0,
  userLevel = 1,
  totalQuizzes = 4,
  onOpenTrophies,
  onPlayIntro
}) {
  const [isMuted, setIsMuted] = useState(() => sounds.isMuted());
  const completionPercentage = Math.round(((completedTiles.length + completedQuizzes.length) / (8 + totalQuizzes)) * 100);

  const handleToggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const handleTileClick = (id) => {
    sounds.playPop();
    onSelectTile(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div 
          onClick={() => handleTileClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="font-['Outfit'] font-black text-base bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PR
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Outfit'] font-black text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition">
                {METABOX_INFO.title}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                SAR · HECh
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Dispositif d'Aide à la Réussite · Moodle 685
            </p>
          </div>
        </div>

        {/* Center Navigation Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTileClick('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTileId === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard Quêtes</span>
          </button>

          <button
            onClick={() => handleTileClick('tile-ia')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTileId === 'tile-ia'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm ring-2 ring-cyan-400'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lab IA ✨</span>
          </button>

          {onPlayIntro && (
            <button
              onClick={onPlayIntro}
              title="Revoir le générique vidéo officiel"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Film className="w-3.5 h-3.5 text-indigo-600" />
              <span>Générique</span>
            </button>
          )}
        </div>

        {/* Right side Gamification & Sounds */}
        <div className="flex items-center gap-3">
          {/* Sound Mute / Unmute Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Activer les sons interactifs" : "Couper les sons"}
            className={`p-2.5 rounded-xl border transition ${
              isMuted 
                ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* XP & Level Badge */}
          <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-200/90 px-3.5 py-1.5 rounded-xl shadow-xs">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">Niv. {userLevel}</span>
              <span className="text-xs font-black text-amber-900 font-mono mt-0.5">{userXp} XP</span>
            </div>
          </div>

          {/* Trophies Button */}
          {onOpenTrophies && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenTrophies();
              }}
              title="Consulter vos trophées débloqués"
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition shadow-xs"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

          {/* Global Completion Progress */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-medium">Progression</div>
              <div className="text-xs font-bold text-slate-800">
                {completedTiles.length}/8 quêtes
              </div>
            </div>
            <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, completionPercentage)}%` }}
              />
            </div>
            <span className="text-xs font-black text-indigo-600">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
