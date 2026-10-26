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

// Codes couleur spécifiques et riches pour chacune des 8 tuiles
const TILE_THEMES = {
  1: {
    // Tuile 1 : Métabox News (Bleu Ciel / Azur)
    cardBg: "bg-gradient-to-b from-sky-50/70 via-white to-white",
    cardBorder: "border-sky-200 hover:border-sky-500 hover:shadow-sky-500/20",
    topBar: "from-sky-400 via-sky-500 to-blue-600",
    numberBadge: "bg-sky-600 text-white shadow-sm shadow-sky-600/30",
    xpBadge: "bg-sky-100 text-sky-800 border-sky-300",
    iconBox: "bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30",
    questText: "text-sky-700",
    hoverTitle: "group-hover:text-sky-600",
    footerText: "text-sky-700 group-hover:text-sky-800",
    footerBtn: "bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white shadow-sky-500/20",
    tagPill: "bg-sky-50 text-sky-700 border border-sky-200"
  },
  2: {
    // Tuile 2 : Partie Langagière (Indigo / Bleu Royal)
    cardBg: "bg-gradient-to-b from-indigo-50/70 via-white to-white",
    cardBorder: "border-indigo-200 hover:border-indigo-500 hover:shadow-indigo-500/20",
    topBar: "from-indigo-500 via-indigo-600 to-purple-600",
    numberBadge: "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30",
    xpBadge: "bg-indigo-100 text-indigo-800 border-indigo-300",
    iconBox: "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30",
    questText: "text-indigo-700",
    hoverTitle: "group-hover:text-indigo-600",
    footerText: "text-indigo-700 group-hover:text-indigo-800",
    footerBtn: "bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white shadow-indigo-500/20",
    tagPill: "bg-indigo-50 text-indigo-700 border border-indigo-200"
  },
  3: {
    // Tuile 3 : Glossaire du Supérieur (Émeraude / Vert Menthe)
    cardBg: "bg-gradient-to-b from-emerald-50/70 via-white to-white",
    cardBorder: "border-emerald-200 hover:border-emerald-500 hover:shadow-emerald-500/20",
    topBar: "from-emerald-400 via-emerald-500 to-teal-600",
    numberBadge: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30",
    xpBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    iconBox: "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30",
    questText: "text-emerald-700",
    hoverTitle: "group-hover:text-emerald-600",
    footerText: "text-emerald-700 group-hover:text-emerald-800",
    footerBtn: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white shadow-emerald-500/20",
    tagPill: "bg-emerald-50 text-emerald-700 border border-emerald-200"
  },
  4: {
    // Tuile 4 : Méthodologie Active (Ambre / Jaune Or)
    cardBg: "bg-gradient-to-b from-amber-50/70 via-white to-white",
    cardBorder: "border-amber-200 hover:border-amber-500 hover:shadow-amber-500/20",
    topBar: "from-amber-400 via-amber-500 to-orange-600",
    numberBadge: "bg-amber-600 text-white shadow-sm shadow-amber-600/30",
    xpBadge: "bg-amber-100 text-amber-900 border-amber-300",
    iconBox: "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30",
    questText: "text-amber-800",
    hoverTitle: "group-hover:text-amber-600",
    footerText: "text-amber-800 group-hover:text-amber-900",
    footerBtn: "bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white shadow-amber-500/20",
    tagPill: "bg-amber-50 text-amber-800 border border-amber-200"
  },
  5: {
    // Tuile 5 : Le Métier d'Étudiant.e (Violet / Mauve)
    cardBg: "bg-gradient-to-b from-violet-50/70 via-white to-white",
    cardBorder: "border-violet-200 hover:border-violet-500 hover:shadow-violet-500/20",
    topBar: "from-violet-400 via-violet-500 to-fuchsia-600",
    numberBadge: "bg-violet-600 text-white shadow-sm shadow-violet-600/30",
    xpBadge: "bg-violet-100 text-violet-800 border-violet-300",
    iconBox: "bg-gradient-to-tr from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-500/30",
    questText: "text-violet-700",
    hoverTitle: "group-hover:text-violet-600",
    footerText: "text-violet-700 group-hover:text-violet-800",
    footerBtn: "bg-violet-100 text-violet-700 group-hover:bg-violet-600 group-hover:text-white shadow-violet-500/20",
    tagPill: "bg-violet-50 text-violet-700 border border-violet-200"
  },
  6: {
    // Tuile 6 : Compétences Numériques (Cyan / Bleu Électrique)
    cardBg: "bg-gradient-to-b from-cyan-50/70 via-white to-white",
    cardBorder: "border-cyan-200 hover:border-cyan-500 hover:shadow-cyan-500/20",
    topBar: "from-cyan-400 via-cyan-500 to-blue-600",
    numberBadge: "bg-cyan-600 text-white shadow-sm shadow-cyan-600/30",
    xpBadge: "bg-cyan-100 text-cyan-800 border-cyan-300",
    iconBox: "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30",
    questText: "text-cyan-700",
    hoverTitle: "group-hover:text-cyan-600",
    footerText: "text-cyan-700 group-hover:text-cyan-800",
    footerBtn: "bg-cyan-100 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white shadow-cyan-500/20",
    tagPill: "bg-cyan-50 text-cyan-700 border border-cyan-200"
  },
  7: {
    // Tuile 7 : Ortho'Express (Rose / Rubis)
    cardBg: "bg-gradient-to-b from-rose-50/70 via-white to-white",
    cardBorder: "border-rose-200 hover:border-rose-500 hover:shadow-rose-500/20",
    topBar: "from-rose-400 via-rose-500 to-pink-600",
    numberBadge: "bg-rose-600 text-white shadow-sm shadow-rose-600/30",
    xpBadge: "bg-rose-100 text-rose-800 border-rose-300",
    iconBox: "bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30",
    questText: "text-rose-700",
    hoverTitle: "group-hover:text-rose-600",
    footerText: "text-rose-700 group-hover:text-rose-800",
    footerBtn: "bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white shadow-rose-500/20",
    tagPill: "bg-rose-50 text-rose-700 border border-rose-200"
  },
  8: {
    // Tuile 8 : Lab IA & Entraînement (Fuchsia / Cyber Gradient)
    cardBg: "bg-gradient-to-b from-fuchsia-50/90 via-purple-50/40 to-white",
    cardBorder: "border-fuchsia-300 ring-2 ring-fuchsia-400/30 hover:border-fuchsia-600 hover:shadow-fuchsia-500/25",
    topBar: "from-fuchsia-500 via-purple-500 to-cyan-400 animate-pulse",
    numberBadge: "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-sm shadow-fuchsia-600/30",
    xpBadge: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 font-bold",
    iconBox: "bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-fuchsia-500/40",
    questText: "text-fuchsia-700 font-bold",
    hoverTitle: "group-hover:text-fuchsia-600",
    footerText: "text-fuchsia-700 group-hover:text-fuchsia-800 font-bold",
    footerBtn: "bg-fuchsia-100 text-fuchsia-700 group-hover:bg-gradient-to-r group-hover:from-fuchsia-600 group-hover:to-indigo-600 group-hover:text-white shadow-fuchsia-500/25",
    tagPill: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 font-bold"
  }
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
          const theme = TILE_THEMES[tile.number] || TILE_THEMES[1];

          return (
            <motion.div
              key={tile.id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTileClick(tile.id)}
              className={`cursor-pointer group rounded-3xl overflow-hidden ${theme.cardBg} border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-xl ${
                isDone 
                  ? 'border-emerald-400 ring-2 ring-emerald-400/20' 
                  : theme.cardBorder
              }`}
            >
              {/* Ligne d'accent lumineuse supérieure aux couleurs de la tuile */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${theme.topBar}`} />

              {/* Image Header with Full Legibility */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${theme.numberBadge}`}>
                    Tuile {tile.number}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1 font-mono ${theme.xpBadge}`}>
                    <Zap className="w-3 h-3 fill-current" /> +{tile.xp} XP
                  </span>
                </div>

                {/* Bottom of Image Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className={`p-2.5 rounded-xl backdrop-blur-md shadow-md ${theme.iconBox}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                    </span>
                  ) : (
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${theme.tagPill}`}>
                      {tile.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body - Contenu textuel complet & identité colorée */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`font-['Outfit'] text-lg font-bold text-slate-900 ${theme.hoverTitle} transition leading-snug`}>
                    {tile.title}
                  </h3>
                  <div className={`text-xs font-bold ${theme.questText} mt-1 mb-2.5`}>
                    {tile.questTitle}
                  </div>
                  {/* Description complète sans troncature */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tile.shortDesc}
                  </p>
                </div>

                {/* Footer Action aux couleurs du module */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className={`text-xs font-bold ${theme.footerText} transition flex items-center gap-1`}>
                    {tile.isNew ? 'Explorer le Lab IA' : 'Accéder au module'}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${theme.footerBtn} flex items-center justify-center transition shadow-xs`}>
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
