import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Cpu,
  Layers,
  Compass,
  Box,
  Share2,
  Filter,
  Check,
  PlayCircle
} from 'lucide-react';
import { TILES } from '../data/metaboxData';
import { sounds } from '../utils/soundEffects';
import HexagonalCurriculumMap from './HexagonalCurriculumMap';

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

// Palettes COLORÉES profondes & vibrantes pour chacune des 8 tuiles
const FULL_COLOR_THEMES = {
  1: {
    // Tuile 1 : Métabox News (Bleu Ciel / Azur Profond)
    gradient: "from-sky-600 via-sky-700 to-blue-800",
    border: "border-sky-400/40 hover:border-sky-300",
    glow: "hover:shadow-sky-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-sky-900 hover:bg-sky-50 shadow-md",
    accentDot: "bg-sky-300",
    category: "methodo"
  },
  2: {
    // Tuile 2 : Partie Langagière (Indigo / Bleu Royal)
    gradient: "from-indigo-600 via-indigo-700 to-purple-800",
    border: "border-indigo-400/40 hover:border-indigo-300",
    glow: "hover:shadow-indigo-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-indigo-950 hover:bg-indigo-50 shadow-md",
    accentDot: "bg-indigo-300",
    category: "methodo"
  },
  3: {
    // Tuile 3 : Glossaire du Supérieur (Émeraude / Menthe)
    gradient: "from-emerald-600 via-teal-700 to-emerald-900",
    border: "border-emerald-400/40 hover:border-emerald-300",
    glow: "hover:shadow-emerald-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-emerald-950 hover:bg-emerald-50 shadow-md",
    accentDot: "bg-emerald-300",
    category: "methodo"
  },
  4: {
    // Tuile 4 : Méthodologie Active (Ambre / Or Chaud)
    gradient: "from-amber-600 via-amber-700 to-orange-800",
    border: "border-amber-400/40 hover:border-amber-300",
    glow: "hover:shadow-amber-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-amber-950 hover:bg-amber-50 shadow-md",
    accentDot: "bg-amber-300",
    category: "methodo"
  },
  5: {
    // Tuile 5 : Le Métier d'Étudiant.e & Procès (Violet / Améthyste)
    gradient: "from-violet-600 via-purple-700 to-violet-950",
    border: "border-violet-400/40 hover:border-violet-300",
    glow: "hover:shadow-violet-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-violet-950 hover:bg-violet-50 shadow-md",
    accentDot: "bg-violet-300",
    category: "digital"
  },
  6: {
    // Tuile 6 : Compétences Numériques (Cyan / Bleu Électrique)
    gradient: "from-cyan-600 via-teal-700 to-blue-900",
    border: "border-cyan-400/40 hover:border-cyan-300",
    glow: "hover:shadow-cyan-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-cyan-950 hover:bg-cyan-50 shadow-md",
    accentDot: "bg-cyan-300",
    category: "digital"
  },
  7: {
    // Tuile 7 : Ortho'Express (Rose / Rubis Lumineux)
    gradient: "from-rose-600 via-rose-700 to-red-800",
    border: "border-rose-400/40 hover:border-rose-300",
    glow: "hover:shadow-rose-500/40 hover:shadow-2xl",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/20 text-white shadow-inner",
    btnBg: "bg-white text-rose-950 hover:bg-rose-50 shadow-md",
    accentDot: "bg-rose-300",
    category: "digital"
  },
  8: {
    // Tuile 8 : Grand Escape Game & Lab IA (Cosmique Fuchsia / Néon Cyber)
    gradient: "from-fuchsia-600 via-purple-700 to-indigo-950",
    border: "border-fuchsia-400/60 hover:border-fuchsia-300 ring-2 ring-fuchsia-400/30",
    glow: "hover:shadow-fuchsia-500/50 hover:shadow-2xl",
    badgeBg: "bg-white/25 text-white border-white/40 backdrop-blur-md",
    iconBg: "bg-gradient-to-tr from-fuchsia-400 to-cyan-300 text-slate-900 shadow-lg",
    btnBg: "bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 hover:brightness-110 shadow-lg font-black",
    accentDot: "bg-fuchsia-300",
    category: "digital"
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
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCurriculumMap, setShowCurriculumMap] = useState(false); // 'all' | 'methodo' | 'digital' | 'completed'
  const currentLevelProgress = Math.min(100, Math.round((userXp % 250) / 2.5));

  const handleTileClick = (id) => {
    sounds.playPop();
    onSelectTile(id);
  };

  const handleFilterClick = (filterId) => {
    sounds.playPop();
    setActiveFilter(filterId);
  };

  // Filtrage des tuiles
  const filteredTiles = TILES.filter(tile => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return completedTiles.includes(tile.id);
    const theme = FULL_COLOR_THEMES[tile.number];
    return theme?.category === activeFilter;
  });

  // Variantes d'animation Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 240, 
        damping: 20 
      }
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      {/* ============================================================== */}
      {/* HERO BANNER ÉPURÉ & VIVANT : MARQUE, NIVEAU & FILTRES RAPIDES */}
      {/* ============================================================== */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-xl overflow-hidden"
      >
        {/* Halos de lumière ambiants en arrière-plan */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Titre & Description de la plateforme */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Portail d'Aide à la Réussite · Haute École Charlemagne</span>
            </div>

            <h1 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Écosystème des <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-fuchsia-300">8 Quêtes Métabox</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Accédez directement à vos 8 modules interactifs pour maîtriser la méthodologie, la rigueur académique et l'esprit critique face à l'IA.
            </p>
          </div>

          {/* Gamification Card Compacte & Dynamique */}
          <div className="w-full lg:w-auto shrink-0 bg-white/10 backdrop-blur-xl border border-white/15 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row lg:flex-col gap-4 shadow-lg min-w-[280px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Niveau {userLevel}
                  </div>
                  <div className="font-['Outfit'] text-sm sm:text-base font-black text-white leading-tight">
                    {levelTitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 font-mono text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-current animate-bounce" />
                <span>{streakDays}j série</span>
              </div>
            </div>

            {/* Barre de progression XP */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">Progression Niveau</span>
                <span className="text-amber-300 font-bold">{userXp} / {userLevel * 250} XP</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentLevelProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 h-full rounded-full shadow-xs"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Barre de Filtres Rapides Interactive */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              Filtrer :
            </span>

            {[
              { id: 'all', label: 'Toutes les Quêtes', count: 8 },
              { id: 'methodo', label: 'Axe Méthodologie', count: 4 },
              { id: 'digital', label: 'Axe Numérique & IA', count: 4 },
              { id: 'completed', label: 'Quêtes Validées', count: completedTiles.length }

            ].map(f => (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleFilterClick(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeFilter === f.id
                    ? 'bg-white text-indigo-950 shadow-md font-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  activeFilter === f.id ? 'bg-indigo-950/20 text-indigo-950 font-bold' : 'bg-black/25 text-white/60'
                }`}>
                  {f.count}
                </span>
              </motion.button>
            ))}

            {/* Bouton d'accès à la Cartographie Conceptuelle SAR */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sounds.playPop();
                setShowCurriculumMap(!showCurriculumMap);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showCurriculumMap
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{showCurriculumMap ? 'Masquer la Cartographie SAR' : '🗺️ Cartographie SAR (Langage & Méthodo)'}</span>
            </motion.button>
          </div>

          <div className="text-xs text-indigo-300/80 font-medium hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{completedTiles.length} sur 8 quêtes complétées</span>
          </div>
        </div>
      </motion.div>

      {/* ============================================================== */}
            {/* ============================================================== */}
      {/* VUE CARTOGRAPHIE CONCEPTUELLE SAR (INFOGRAPHIE HEXAGONALE) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showCurriculumMap && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <HexagonalCurriculumMap onNavigateToTile={handleTileClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRILLE BENTO GRAND FORMAT SANS COLONNES LATÉRALES (PLEINE LARGEUR) */}
      {/* ============================================================== */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeFilter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTiles.map((tile, idx) => {
            const IconComponent = ICONS[tile.icon] || BookOpenCheck;
            const isDone = completedTiles.includes(tile.id);
            const theme = FULL_COLOR_THEMES[tile.number] || FULL_COLOR_THEMES[1];
            const isFeatured = tile.id === 'tile-ia'; // Tuile 8 en vedette

            return (
              <motion.div
                key={tile.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 350, damping: 22 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTileClick(tile.id)}
                className={`cursor-pointer group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${theme.gradient} border-2 ${theme.border} text-white shadow-xl ${theme.glow} transition-all duration-300 overflow-hidden flex flex-col justify-between shimmer-mask ${
                  isFeatured ? 'sm:col-span-2 xl:col-span-2' : ''
                }`}
              >
                {/* Lueur d'ambiance d'arrière-plan réactive */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-xl pointer-events-none" />

                <div>
                  {/* Ligne Supérieure : Badges & XP */}
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-['Outfit'] font-black text-xs px-3 py-1 rounded-full bg-white text-slate-900 shadow-md">
                        Tuile {tile.number}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}>
                        {tile.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-xs">
                      <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                      <span>+{tile.xp} XP</span>
                    </div>
                  </div>

                  {/* Corps de la Tuile avec Icône Flottante & Typographie */}
                  <div className="relative z-10 space-y-3 mb-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3.5 rounded-2xl ${theme.iconBg} backdrop-blur-md shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black leading-tight drop-shadow-sm group-hover:text-yellow-200 transition-colors">
                          {tile.title}
                        </h3>
                        <span className="text-xs font-semibold text-white/80 block mt-1">
                          {tile.questTitle}
                        </span>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm text-white/90 leading-relaxed font-normal pt-1 ${
                      isFeatured ? 'line-clamp-4' : 'line-clamp-3'
                    }`}>
                      {tile.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Pied de Carte : Statut & Bouton Interactif */}
                <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md border border-emerald-300/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Quête Validée
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${theme.accentDot} animate-pulse`} />
                        À explorer
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs ${theme.btnBg} transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-lg`}>
                    <span>{tile.isNew ? 'Lancer le Lab IA' : 'Accéder au module'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Guide Pédagogique Bas de Page Épuré */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4 text-xs text-slate-500 flex items-center justify-center gap-2 font-medium"
      >
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span>Chaque quête complétée vous rapporte des points d'expérience et débloque des trophées officiels HECh.</span>
      </motion.div>

    </div>
  );
}
