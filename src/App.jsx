import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  BookOpenCheck, 
  HelpCircle, 
  BrainCircuit, 
  GraduationCap, 
  Laptop, 
  SpellCheck, 
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Code2,
  LayoutGrid,
  Trophy,
  Flame,
  Zap,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import TileDetails from './components/TileDetails';
import AiLabView from './components/AiLabView';
import TrophiesModal from './components/TrophiesModal';
import IntroVideoGenerique from './components/IntroVideoGenerique';
import { TILES, METABOX_INFO, BADGES_LIST } from './data/metaboxData';
import { sounds } from './utils/soundEffects';

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

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTileId, setActiveTileId] = useState('dashboard'); // 'dashboard' | tile.id
  const [isTrophiesOpen, setIsTrophiesOpen] = useState(false);

  // Gamification state in localStorage
  const [completedTiles, setCompletedTiles] = useState(() => {
    try {
      const saved = localStorage.getItem('metabox_completed_tiles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem('metabox_completed_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userXp, setUserXp] = useState(() => {
    try {
      const saved = localStorage.getItem('metabox_user_xp');
      return saved ? parseInt(saved, 10) : 150;
    } catch {
      return 150;
    }
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('metabox_unlocked_badges');
      return saved ? JSON.parse(saved) : ['badge-first-step'];
    } catch {
      return ['badge-first-step'];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('metabox_completed_tiles', JSON.stringify(completedTiles));
  }, [completedTiles]);

  useEffect(() => {
    localStorage.setItem('metabox_completed_quizzes', JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  useEffect(() => {
    localStorage.setItem('metabox_user_xp', userXp.toString());
  }, [userXp]);

  useEffect(() => {
    localStorage.setItem('metabox_unlocked_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  // Compute user level
  const userLevel = Math.max(1, Math.floor(userXp / 250) + 1);
  const getLevelTitle = (lvl) => {
    if (lvl === 1) return "Bizuth Méthodologique";
    if (lvl === 2) return "Explorateur des Consignes";
    if (lvl === 3) return "Tacticien du Blocus";
    if (lvl === 4) return "Maître de la Réussite";
    return "Major de Promotion IA 🏆";
  };

  const addXp = (amount) => {
    setUserXp(prev => prev + amount);
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const unlockBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges(prev => [...prev, badgeId]);
      sounds.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleToggleTileCompletion = (tileId) => {
    setCompletedTiles(prev => {
      const isAlready = prev.includes(tileId);
      if (!isAlready) {
        addXp(100);
        if (tileId === 'tile-ortho') unlockBadge('badge-ortho');
        return [...prev, tileId];
      }
      return prev.filter(id => id !== tileId);
    });
  };

  const handleQuizComplete = (quizId) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes(prev => [...prev, quizId]);
      addXp(150);
      if (quizId === 'exo-verbes-1') unlockBadge('badge-sniper');
      if (quizId === 'exo-meth-ebbinghaus') unlockBadge('badge-ebbinghaus');
    }
  };

  const handleSelectTileWithSound = (id) => {
    sounds.playPop();
    setActiveTileId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTile = TILES.find(t => t.id === activeTileId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Lexend'] selection:bg-indigo-500/20 selection:text-indigo-800">
      {/* Générique Vidéo Plein Écran à l'ouverture */}
      {showIntro && (
        <IntroVideoGenerique onFinish={() => setShowIntro(false)} />
      )}

      {/* Top Application Header */}
      <Header
        activeTileId={activeTileId}
        onSelectTile={handleSelectTileWithSound}
        completedTiles={completedTiles}
        completedQuizzes={completedQuizzes}
        userXp={userXp}
        userLevel={userLevel}
        onOpenTrophies={() => setIsTrophiesOpen(true)}
        onPlayIntro={() => setShowIntro(true)}
      />

      {/* Barre de navigation horizontale compacte (présente uniquement lorsqu'on explore une tuile) */}
      {activeTileId !== 'dashboard' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-20 z-40 shadow-xs"
        >
          <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
            {/* Bouton Retour Accueil */}
            <motion.button
              whileHover={{ scale: 1.04, x: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectTileWithSound('dashboard')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs sm:text-sm font-bold text-indigo-700 transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Dashboard des Quêtes</span>
            </motion.button>

            {/* Sélecteur de Tuiles Rapide Horizontal */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {TILES.map((tile) => {
                const isActive = activeTileId === tile.id;
                const isCompleted = completedTiles.includes(tile.id);
                return (
                  <motion.button
                    key={tile.id}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSelectTileWithSound(tile.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>T{tile.number}</span>
                    {isCompleted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Badge Titre Actif */}
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
              <span className="text-slate-400">En cours :</span>
              <span className="text-indigo-600 truncate max-w-[200px]">{activeTile?.title || 'Lab IA'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Container Pleine Largeur (Sans colonnes latérales sur l'accueil) */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <main className="w-full flex-1">
          <AnimatePresence mode="wait">
            {activeTileId === 'dashboard' ? (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <BentoGrid
                  onSelectTile={(tileId) => handleSelectTileWithSound(tileId)}
                  completedTiles={completedTiles}
                  userXp={userXp}
                  userLevel={userLevel}
                  levelTitle={getLevelTitle(userLevel)}
                  unlockedBadges={unlockedBadges}
                />
              </motion.div>
            ) : activeTileId === 'tile-ia' ? (
              <motion.div
                key="ia-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-6"
              >
                <AiLabView />
              </motion.div>
            ) : (
              <motion.div
                key={`tile-${activeTileId}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <TileDetails
                  tile={activeTile}
                  isCompleted={completedTiles.includes(activeTileId)}
                  onMarkComplete={handleToggleTileCompletion}
                  onLaunchQuiz={handleQuizComplete}
                  onBackToDashboard={() => handleSelectTileWithSound('dashboard')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Trophies Modal */}
      <TrophiesModal
        isOpen={isTrophiesOpen}
        onClose={() => setIsTrophiesOpen(false)}
        unlockedBadges={unlockedBadges}
      />

      {/* Footer Clair & Épuré avec Logo Officiel HECh */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs sm:text-sm text-slate-500">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 p-0.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
              <img
                src="/images/hech_logo_officiel.png"
                alt="Haute École Charlemagne"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-['Outfit'] font-bold text-slate-800">Petite Réussite - Métabox IA (Édition Épurée & Vivante 2.2)</span> · SAR Haute École Charlemagne
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jeromefoguenne-eng/Metabox---IA"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 flex items-center gap-1.5 transition font-medium"
            >
              <Code2 className="w-4 h-4" /> GitHub Repository
            </a>
            <span>·</span>
            <span>Local First & Zero-Cost</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
