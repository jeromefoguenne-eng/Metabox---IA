import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Trophy, 
  Flame, 
  Zap, 
  BookOpenCheck,
  Newspaper,
  HelpCircle,
  BrainCircuit,
  GraduationCap,
  Laptop,
  SpellCheck,
  Play
} from 'lucide-react';
import { TILES } from '../data/metaboxData';

const ICONS = {
  Newspaper,
  BookOpenCheck,
  HelpCircle,
  BrainCircuit,
  GraduationCap,
  Laptop,
  SpellCheck,
  Sparkles
};

export default function BentoGrid({ 
  onSelectTile, 
  completedTiles = [], 
  userXp = 0, 
  userLevel = 1, 
  levelTitle = "Apprenti Méthodologique",
  streakDays = 3,
  unlockedBadges = []
}) {
  const nextLevelXp = userLevel * 250;
  const currentLevelProgress = Math.min(100, Math.round((userXp % 250) / 2.5));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* GAMIFIED HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Saison Académique 2025-2026 · SAR HECh
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Bienvenue dans votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">Métabox IA</span> 🎓
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
              Explorez les 7 modules méthodologiques du Moodle HECh et débloquez le volet d'entraînement outillé par intelligence artificielle.
            </p>
          </div>

          {/* Player Level & Stats Card */}
          <div className="w-full lg:w-auto bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl flex flex-wrap items-center gap-6 shadow-xl backdrop-blur-md">
            {/* Level Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Niveau</span>
                  <span className="text-xl font-black text-white">{userLevel}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Rang Actuel</div>
                <div className="text-sm font-bold text-white truncate max-w-[170px]">{levelTitle}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentLevelProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">{userXp} XP</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-5">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-black">
                  <Flame className="w-4 h-4 fill-current text-amber-400 animate-pulse" />
                  {streakDays}j
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Série d'étude</div>
              </div>

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-black">
                  <Trophy className="w-4 h-4" />
                  {unlockedBadges.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Trophées</div>
              </div>

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-cyan-400 text-sm font-black">
                  <CheckCircle2 className="w-4 h-4" />
                  {completedTiles.length}/8
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Quêtes finies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            Les 8 Tuiles d'Apprentissage & Quêtes
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sélectionnez une tuile pour vous entraîner, réussir vos quiz et gagner des points d'expérience.
          </p>
        </div>
      </div>

      {/* BENTO GRID OF 8 TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TILES.map((tile, idx) => {
          const IconComponent = ICONS[tile.icon] || BookOpenCheck;
          const isDone = completedTiles.includes(tile.id);

          return (
            <motion.div
              key={tile.id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTile(tile.id)}
              className={`cursor-pointer group rounded-3xl overflow-hidden border transition-all flex flex-col justify-between shadow-xl ${
                tile.isNew
                  ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-cyan-400/50 hover:border-cyan-300 ring-1 ring-cyan-500/20 shadow-cyan-500/10'
                  : isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Image Header with Badge Overlay */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60 shadow">
                    Tuile {tile.number}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md text-indigo-300 border border-indigo-400/30 shadow flex items-center gap-1 font-mono">
                    <Zap className="w-3 h-3 text-amber-400 fill-current" /> +{tile.xp} XP
                  </span>
                </div>

                {/* Bottom of image : Icon & Status */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className={`p-2.5 rounded-xl backdrop-blur-md shadow-md ${
                    tile.isNew
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                      : 'bg-slate-900/80 text-white border border-slate-700/60'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 backdrop-blur-md border border-emerald-400/40">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complété
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 backdrop-blur-md border border-slate-700/60">
                      {tile.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {tile.shortDesc}
                  </p>
                </div>

                {/* Footer action */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-400 group-hover:text-indigo-300 transition flex items-center gap-1.5">
                    {tile.isNew ? 'Explorer le Lab IA' : 'Accéder au module'}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 transition">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
