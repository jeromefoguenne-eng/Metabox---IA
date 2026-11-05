import { getAssetPath } from "../utils/assetPath";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  Zap, 
  Flame 
} from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand & Title avec Logo Réel HECh */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleTileClick('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer select-none group"
        >
          <div className="relative h-13 w-13 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center p-1.5 transition-all group-hover:shadow-indigo-500/20 group-hover:border-indigo-300">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-sky-400 rounded-2xl blur-xs opacity-0 group-hover:opacity-40 transition duration-500" />
            <img
              src={getAssetPath("/images/hech_logo_officiel.png")}
              alt="Haute École Charlemagne"
              className="relative w-full h-full object-contain transform group-hover:rotate-1 transition-transform"
            />
          </div>
          <div>
            <h1 className="font-['Outfit'] font-black text-lg sm:text-xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition">
              {METABOX_INFO.title}
            </h1>
            <p className="text-xs text-slate-500 hidden md:block mt-0.5 font-medium">
              Dispositif d'Aide à la Réussite
            </p>
          </div>
        </motion.div>

        {/* Right side Gamification & Sounds */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Sound Mute / Unmute Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleToggleSound}
            title={isMuted ? "Activer les sons interactifs" : "Couper les sons"}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              isMuted 
                ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 shadow-xs'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>

          {/* XP & Level Badge avec Effet Vivant */}
          <motion.div 
            whileHover={{ scale: 1.04, y: -1 }}
            className="flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/90 px-3.5 py-2 rounded-xl shadow-xs cursor-default"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-current animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <span>Niv. {userLevel}</span>
                <Flame className="w-2.5 h-2.5 text-orange-500 fill-current inline" />
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-950 font-mono mt-0.5">{userXp} XP</span>
            </div>
          </motion.div>

          {/* Trophies Button avec Animation Wiggle */}
          {onOpenTrophies && (
            <motion.button
              whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sounds.playPop();
                onOpenTrophies();
              }}
              title="Consulter vos trophées débloqués"
              className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/80 text-amber-700 transition-all shadow-xs"
            >
              <Trophy className="w-4 h-4" />
            </motion.button>
          )}

          {/* Global Completion Progress avec Animation Douce */}
          <div className="hidden xl:flex items-center gap-3 bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-xl shadow-2xs">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progression</div>
              <div className="text-xs font-bold text-slate-800">
                {completedTiles.length}/8 quêtes
              </div>
            </div>
            <div className="w-20 bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, completionPercentage)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 h-full rounded-full shadow-xs"
              />
            </div>
            <span className="text-xs font-black text-indigo-700 font-mono">
              {completionPercentage}%
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
