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
  Cpu,
  Layers,
  Compass,
  Box,
  Share2
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

// Palettes 100% COLORÉES intégrales pour chacune des 8 tuiles
const FULL_COLOR_THEMES = {
  1: {
    // Tuile 1 : Métabox News (Bleu Ciel / Azur Profond)
    gradient: "from-sky-600 via-sky-700 to-blue-800",
    border: "border-sky-400/50 hover:border-sky-300",
    glow: "shadow-sky-600/30 hover:shadow-sky-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-sky-800 hover:bg-sky-50 shadow-md",
    accentDot: "bg-sky-300",
    connectorColor: "#0284c7"
  },
  2: {
    // Tuile 2 : Partie Langagière (Indigo / Bleu Royal)
    gradient: "from-indigo-600 via-indigo-700 to-purple-800",
    border: "border-indigo-400/50 hover:border-indigo-300",
    glow: "shadow-indigo-600/30 hover:shadow-indigo-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-indigo-900 hover:bg-indigo-50 shadow-md",
    accentDot: "bg-indigo-300",
    connectorColor: "#4f46e5"
  },
  3: {
    // Tuile 3 : Glossaire du Supérieur (Émeraude / Vert Menthe)
    gradient: "from-emerald-600 via-teal-700 to-emerald-900",
    border: "border-emerald-400/50 hover:border-emerald-300",
    glow: "shadow-emerald-600/30 hover:shadow-emerald-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-emerald-900 hover:bg-emerald-50 shadow-md",
    accentDot: "bg-emerald-300",
    connectorColor: "#059669"
  },
  4: {
    // Tuile 4 : Méthodologie Active (Ambre / Or Chaud)
    gradient: "from-amber-600 via-amber-700 to-orange-800",
    border: "border-amber-400/50 hover:border-amber-300",
    glow: "shadow-amber-600/30 hover:shadow-amber-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-amber-950 hover:bg-amber-50 shadow-md",
    accentDot: "bg-amber-300",
    connectorColor: "#d97706"
  },
  5: {
    // Tuile 5 : Le Métier d'Étudiant.e & Procès (Violet / Améthyste)
    gradient: "from-violet-600 via-purple-700 to-violet-950",
    border: "border-violet-400/50 hover:border-violet-300",
    glow: "shadow-violet-600/30 hover:shadow-violet-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-violet-950 hover:bg-violet-50 shadow-md",
    accentDot: "bg-violet-300",
    connectorColor: "#7c3aed"
  },
  6: {
    // Tuile 6 : Compétences Numériques (Cyan / Bleu Électrique)
    gradient: "from-cyan-600 via-teal-700 to-blue-900",
    border: "border-cyan-400/50 hover:border-cyan-300",
    glow: "shadow-cyan-600/30 hover:shadow-cyan-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-cyan-950 hover:bg-cyan-50 shadow-md",
    accentDot: "bg-cyan-300",
    connectorColor: "#0891b2"
  },
  7: {
    // Tuile 7 : Ortho'Express (Rose / Rubis Lumineux)
    gradient: "from-rose-600 via-rose-700 to-red-800",
    border: "border-rose-400/50 hover:border-rose-300",
    glow: "shadow-rose-600/30 hover:shadow-rose-500/50",
    badgeBg: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    iconBg: "bg-white/25 text-white shadow-inner",
    btnBg: "bg-white text-rose-950 hover:bg-rose-50 shadow-md",
    accentDot: "bg-rose-300",
    connectorColor: "#e11d48"
  },
  8: {
    // Tuile 8 : Grand Escape Game & Lab IA (Cosmique Fuchsia / Néon Cyber)
    gradient: "from-fuchsia-600 via-purple-700 to-indigo-950",
    border: "border-fuchsia-400/70 hover:border-fuchsia-300 ring-2 ring-fuchsia-400/40",
    glow: "shadow-fuchsia-600/40 hover:shadow-fuchsia-500/60",
    badgeBg: "bg-white/25 text-white border-white/40 backdrop-blur-md",
    iconBg: "bg-gradient-to-tr from-fuchsia-400 to-cyan-300 text-slate-900 shadow-lg",
    btnBg: "bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 hover:brightness-110 shadow-lg font-black",
    accentDot: "bg-fuchsia-300",
    connectorColor: "#c026d3"
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

  // Séparation des tuiles : Tuiles 1 à 4 à gauche, Tuiles 5 à 8 à droite
  const leftTiles = TILES.slice(0, 4);
  const rightTiles = TILES.slice(4, 8);

  // Variantes d'animation pour la carte mentale
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const centerNodeVariants = {
    hidden: { scale: 0.7, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  const leftTileVariants = {
    hidden: { opacity: 0, x: -40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 22 }
    }
  };

  const rightTileVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 22 }
    }
  };

  // Rendu unifié d'une tuile 100% colorée
  const renderTileCard = (tile, index, isLeft) => {
    const IconComponent = ICONS[tile.icon] || BookOpenCheck;
    const isDone = completedTiles.includes(tile.id);
    const theme = FULL_COLOR_THEMES[tile.number] || FULL_COLOR_THEMES[1];

    return (
      <motion.div
        key={tile.id}
        variants={isLeft ? leftTileVariants : rightTileVariants}
        whileHover={{ scale: 1.025, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleTileClick(tile.id)}
        className={`cursor-pointer group relative rounded-3xl p-6 bg-gradient-to-br ${theme.gradient} border-2 ${theme.border} text-white shadow-xl ${theme.glow} transition-all duration-300 overflow-hidden flex flex-col justify-between`}
      >
        {/* Lueur d'ambiance d'arrière-plan */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

        {/* Ligne Supérieure : Badges & Statut */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-['Outfit'] font-black text-xs px-3 py-1 rounded-full bg-white text-slate-900 shadow-md">
              Tuile {tile.number}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}>
              {tile.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
            <span>+{tile.xp} XP</span>
          </div>
        </div>

        {/* Corps de la Tuile */}
        <div className="relative z-10 space-y-2 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${theme.iconBg} backdrop-blur-md shadow-md group-hover:scale-110 transition-transform`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-['Outfit'] text-lg sm:text-xl font-black leading-tight drop-shadow-sm group-hover:text-yellow-200 transition">
                {tile.title}
              </h3>
              <span className="text-[11px] font-semibold text-white/80 block mt-0.5">
                {tile.questTitle}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal pt-1 line-clamp-3">
            {tile.shortDesc}
          </p>
        </div>

        {/* Pied de Carte : Progression & Bouton d'Action */}
        <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isDone ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md border border-emerald-300/40">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quête Validée
              </span>
            ) : (
              <span className="text-[11px] font-medium text-white/75 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${theme.accentDot} animate-pulse`} />
                À découvrir
              </span>
            )}
          </div>

          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs ${theme.btnBg} transition-all duration-300 group-hover:translate-x-1`}>
            <span>{tile.isNew ? 'Accéder au Lab' : 'Explorer'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 animate-in fade-in duration-500"
    >
      {/* ============================================================== */}
      {/* CARTE MENTALE ANIMÉE : CŒUR CENTRAL + BRANCHES + TUILES PLEINES */}
      {/* ============================================================== */}

      <div className="relative">
        
        {/* Titre & Sous-titre de la Page d'Accueil */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
            <Share2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Architecture Pédagogique Interactive · Carte Mentale</span>
          </div>
          <h1 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Navigation Mentale des 8 Quêtes
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Explorez l'écosystème <span className="font-bold text-indigo-700">Métabox IA</span> depuis le cœur central. Chaque tuile est un module complet d'entraînement pour votre réussite académique.
          </p>
        </div>

        {/* DISPOSITION CARTE MENTALE SUR GRAND ÉCRAN (3 COLONNES AVEC CŒUR CENTRAL) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Lignes de Connexion Neuronales SVG d'Arrière-Plan (Mind Map Synapses) */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-50">
            <defs>
              <linearGradient id="synapse-left" x1="1" y1="0.5" x2="0" y2="0.5">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="synapse-right" x1="0" y1="0.5" x2="1" y2="0.5">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d946ef" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Branches Gauches vers Tuiles 1, 2, 3, 4 */}
            <path d="M 50 50 C 42 40, 35 15, 33 12" stroke="url(#synapse-left)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            <path d="M 50 50 C 42 46, 35 38, 33 38" stroke="url(#synapse-left)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            <path d="M 50 50 C 42 54, 35 62, 33 62" stroke="url(#synapse-left)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            <path d="M 50 50 C 42 60, 35 85, 33 88" stroke="url(#synapse-left)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            {/* Branches Droites vers Tuiles 5, 6, 7, 8 */}
            <path d="M 50 50 C 58 40, 65 15, 67 12" stroke="url(#synapse-right)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            <path d="M 50 50 C 58 46, 65 38, 67 38" stroke="url(#synapse-right)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            <path d="M 50 50 C 58 54, 65 62, 67 62" stroke="url(#synapse-right)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
            <path d="M 50 50 C 58 60, 65 85, 67 88" stroke="url(#synapse-right)" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1.5" />
          </svg>

          {/* ==================== COLONNE GAUCHE (TUILES 1 À 4) ==================== */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                Axe Méthodologie & Repères
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Tuiles 1 à 4
              </span>
            </div>
            
            {leftTiles.map((tile, idx) => renderTileCard(tile, idx, true))}
          </div>

          {/* ==================== CŒUR CENTRAL (LOGO MÉTABOX 3D) ==================== */}
          <motion.div 
            variants={centerNodeVariants}
            className="lg:col-span-4 flex flex-col items-center justify-center p-4 relative z-20 my-6 lg:my-0"
          >
            {/* Anneaux orbitaux et halos lumineux d'arrière-plan */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-fuchsia-500/15 blur-3xl pointer-events-none" />
            <div className="absolute w-80 h-80 rounded-full border border-indigo-200/60 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '30s' }} />
            <div className="absolute w-96 h-96 rounded-full border border-purple-200/40 pointer-events-none" />

            {/* LE CUBE / LOGO MÉTABOX CENTRAL */}
            <div className="relative group cursor-pointer" onClick={() => sounds.playFanfare()}>
              {/* Effet Glow Pulsant */}
              <div className="absolute -inset-3 bg-gradient-to-r from-sky-500 via-indigo-600 to-fuchsia-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-700 animate-pulse" />
              
              {/* Boîtier Métabox Principal */}
              <div className="relative w-56 sm:w-68 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-6 border-2 border-indigo-400/60 shadow-2xl text-center text-white flex flex-col items-center">
                
                {/* Logo Officiel HECh au sommet du Cœur Métabox */}
                <div className="bg-white/95 w-14 h-14 rounded-2xl border border-white/60 shadow-lg mb-2.5 flex items-center justify-center p-1.5 hover:scale-105 transition-transform backdrop-blur-md">
                  <img
                    src="/images/hech_logo_officiel.png"
                    alt="Logo officiel Haute École Charlemagne"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Badge supérieur HECh & SAR */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-300/30 text-[10px] font-mono font-bold text-indigo-300 mb-3 uppercase tracking-wider">
                  <Box className="w-3 h-3 text-cyan-300 animate-bounce" />
                  Plateforme Pédagogique SAR
                </div>

                {/* LOGO MÉTABOX 3D ISOMÉTRIQUE */}
                <div className="w-24 h-24 my-2 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-80 blur-xs" />
                  <div className="relative w-22 h-22 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-cyan-400/80 p-3 shadow-inner flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-1">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <Cpu className="w-7 h-7 text-indigo-400" />
                      <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                    </div>
                    <span className="font-['Outfit'] text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 mt-1">
                      MÉTABOX
                    </span>
                  </div>
                </div>

                {/* Nom & Titre */}
                <h2 className="font-['Outfit'] text-2xl font-black tracking-tight text-white mt-1">
                  MÉTABOX <span className="text-cyan-400">IA</span>
                </h2>
                <p className="text-[11px] text-indigo-200/80 mt-1 font-medium leading-tight">
                  Noyau Central de la Réussite
                </p>

                {/* Stats & Niveau du Joueur */}
                <div className="mt-4 pt-3 border-t border-indigo-800/60 w-full space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Niveau Étudiant :</span>
                    <span className="font-bold text-amber-300">Niv. {userLevel}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-indigo-900">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentLevelProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300">
                    <span>{userXp} XP</span>
                    <span>{completedTiles.length}/8 validés</span>
                  </div>
                </div>

                {/* Indicateur d'Action */}
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Série de {streakDays} jours</span>
                </div>
              </div>
            </div>

            {/* Description d'aide sous le logo */}
            <div className="text-center mt-4">
              <span className="text-[11px] font-medium text-slate-400 bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                💡 Cliquez sur n'importe quelle tuile pour démarrer
              </span>
            </div>
          </motion.div>

          {/* ==================== COLONNE DROITE (TUILES 5 À 8) ==================== */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                Axe Numérique, IA & Éthique
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Tuiles 5 à 8
              </span>
            </div>

            {rightTiles.map((tile, idx) => renderTileCard(tile, idx, false))}
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* BANNIÈRE RÉCAPITULATIVE DE PROGRESSION EN BAS                  */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-['Outfit'] font-black text-lg text-slate-900">
              Progression Pédagogique Globale
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Complétez les 8 quêtes interactives pour décrocher le titre de <strong className="text-indigo-600">Major de Promotion IA</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block">Trophées débloqués</span>
            <span className="font-['Outfit'] text-xl font-black text-indigo-700">
              {unlockedBadges.length} / 5
            </span>
          </div>

          <div className="h-10 w-px bg-slate-200 mx-2" />

          <button
            onClick={() => {
              sounds.playPop();
              onSelectTile('tile-ia');
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-fuchsia-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Tester l'Escape Game & Lab IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </motion.div>
  );
}
