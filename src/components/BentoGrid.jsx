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
  ChevronRight
} from 'lucide-react';
import { TILES } from '../data/metaboxData';
import { sounds } from '../utils/soundEffects';

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
  const currentLevelProgress = Math.min(100, Math.round((userXp % 250) / 2.5));

  const handleTileClick = (id) => {
    sounds.playPop();
    onSelectTile(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HERO BANNER CLAIR & COLORÉ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-600 p-8 md:p-10 shadow-xl text-white">
        {/* Decorative ambient bubbles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-yellow-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-yellow-200 border border-white/30 text-xs font-bold mb-4 shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Saison Académique 2025-2026 · SAR HECh
            </div>
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Boîte à Outils de Réussite & Lab IA 🚀
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 mt-3 leading-relaxed font-normal">
              Entraînez-vous sur les 7 modules de méthodologie universitaire, décryptez les consignes d'examens et testez vos réflexes avec l'intelligence artificielle.
            </p>
          </div>

          {/* Player Level & XP Card */}
          <div className="w-full lg:w-auto bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl flex flex-wrap items-center gap-6 shadow-2xl border border-white/60">
            {/* Level Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 p-1 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[12px] flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Niveau</span>
                  <span className="font-['Outfit'] text-2xl font-black text-indigo-700">{userLevel}</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Titre Actuel</div>
                <div className="font-['Outfit'] text-base font-bold text-slate-900">{levelTitle}</div>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <div className="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentLevelProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700">{userXp} XP</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-amber-500 text-base font-black">
                  <Flame className="w-5 h-5 fill-current text-amber-500 animate-bounce" />
                  {streakDays}j
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Série active</div>
              </div>

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-emerald-600 text-base font-black">
                  <Trophy className="w-5 h-5" />
                  {unlockedBadges.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Trophées</div>
              </div>

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-indigo-600 text-base font-black">
                  <CheckCircle2 className="w-5 h-5" />
                  {completedTiles.length}/8
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Modules validés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            Modules d'Apprentissage & Quêtes Pédagogiques
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Cliquez sur un module pour explorer ses leçons, vous auto-évaluer et débloquer vos badges.
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto font-mono">
          8 Quêtes Interactives Disponibles
        </div>
      </div>

      {/* BENTO GRID DES 8 TUILES VISUELLES & CLAIRES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TILES.map((tile, idx) => {
          const IconComponent = ICONS[tile.icon] || BookOpenCheck;
          const isDone = completedTiles.includes(tile.id);

          return (
            <motion.div
              key={tile.id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTileClick(tile.id)}
              className={`cursor-pointer group rounded-3xl overflow-hidden bg-white border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-xl ${
                tile.isNew
                  ? 'border-indigo-400 ring-2 ring-indigo-400/30 hover:border-indigo-600'
                  : isDone
                    ? 'border-emerald-300 hover:border-emerald-500'
                    : 'border-slate-200 hover:border-indigo-400'
              }`}
            >
              {/* Image Header with Full Legibility */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200">
                    Tuile {tile.number}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 shadow-sm flex items-center gap-1 font-mono">
                    <Zap className="w-3 h-3 fill-current" /> +{tile.xp} XP
                  </span>
                </div>

                {/* Bottom of Image Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className={`p-2.5 rounded-xl backdrop-blur-md shadow-md ${
                    tile.isNew
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-900'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95 text-slate-700 shadow-sm">
                      {tile.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body - FULL TEXT VISIBLE, NO TRUNCATION */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Outfit'] text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                    {tile.title}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-600 mt-1 mb-2">
                    {tile.questTitle}
                  </div>
                  {/* Full description without line-clamp */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tile.shortDesc}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition flex items-center gap-1">
                    {tile.isNew ? 'Explorer le Lab IA' : 'Accéder au module'}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-indigo-600 transition shadow-xs">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
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
