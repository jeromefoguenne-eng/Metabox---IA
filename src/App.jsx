import React, { useState, useEffect } from 'react';
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
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import TileDetails from './components/TileDetails';
import AiLabView from './components/AiLabView';
import TrophiesModal from './components/TrophiesModal';
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const activeTile = TILES.find(t => t.id === activeTileId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Lexend'] selection:bg-indigo-500/20 selection:text-indigo-800">
      {/* Top Application Header */}
      <Header
        activeTileId={activeTileId}
        onSelectTile={handleSelectTileWithSound}
        completedTiles={completedTiles}
        completedQuizzes={completedQuizzes}
        userXp={userXp}
        userLevel={userLevel}
        onOpenTrophies={() => setIsTrophiesOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Section :</span>
            <span className="text-xs font-bold text-indigo-600 truncate max-w-[180px]">
              {activeTileId === 'dashboard' ? 'Dashboard Quêtes' : activeTile?.title || 'Lab IA'}
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-xl bg-slate-100 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar / Quick Navigation Menu */}
        <aside className={`lg:w-80 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24 space-y-4">
            
            {/* Dashboard Switch Button */}
            <button
              onClick={() => handleSelectTileWithSound('dashboard')}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 font-bold text-sm shadow-xs ${
                activeTileId === 'dashboard'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700 hover:bg-indigo-50/50'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTileId === 'dashboard' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-['Outfit'] font-bold text-base leading-tight">Dashboard Quêtes</div>
                <div className={`text-xs font-normal ${activeTileId === 'dashboard' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Vue d'ensemble des 8 tuiles
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between px-1 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Modules & Quêtes
              </span>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {completedTiles.length}/8 validés
              </span>
            </div>

            {/* List of 8 Tiles in Sidebar */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {TILES.map((tile) => {
                const IconComponent = ICONS[tile.icon] || BookOpenCheck;
                const isActive = activeTileId === tile.id;
                const isCompleted = completedTiles.includes(tile.id);

                // Thèmes de couleurs spécifiques pour la sidebar
                const SIDEBAR_COLOR_MAP = {
                  1: { icon: "bg-sky-100 text-sky-700", active: "bg-sky-50/90 border-sky-500 text-sky-950 ring-1 ring-sky-500", hover: "hover:border-sky-300" },
                  2: { icon: "bg-indigo-100 text-indigo-700", active: "bg-indigo-50/90 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500", hover: "hover:border-indigo-300" },
                  3: { icon: "bg-emerald-100 text-emerald-700", active: "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500", hover: "hover:border-emerald-300" },
                  4: { icon: "bg-amber-100 text-amber-800", active: "bg-amber-50/90 border-amber-500 text-amber-950 ring-1 ring-amber-500", hover: "hover:border-amber-300" },
                  5: { icon: "bg-violet-100 text-violet-700", active: "bg-violet-50/90 border-violet-500 text-violet-950 ring-1 ring-violet-500", hover: "hover:border-violet-300" },
                  6: { icon: "bg-cyan-100 text-cyan-700", active: "bg-cyan-50/90 border-cyan-500 text-cyan-950 ring-1 ring-cyan-500", hover: "hover:border-cyan-300" },
                  7: { icon: "bg-rose-100 text-rose-700", active: "bg-rose-50/90 border-rose-500 text-rose-950 ring-1 ring-rose-500", hover: "hover:border-rose-300" },
                  8: { icon: "bg-fuchsia-100 text-fuchsia-700", active: "bg-gradient-to-r from-fuchsia-50 to-indigo-50 border-fuchsia-400 text-slate-900 ring-2 ring-fuchsia-400/40", hover: "hover:border-fuchsia-300" }
                };

                const colorStyle = SIDEBAR_COLOR_MAP[tile.number] || SIDEBAR_COLOR_MAP[1];

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleSelectTileWithSound(tile.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                      isActive
                        ? colorStyle.active
                        : `bg-white border-slate-200 hover:bg-slate-50/80 ${colorStyle.hover} text-slate-700`
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 transition ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : colorStyle.icon
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="font-['Outfit'] text-sm font-bold text-slate-900 truncate">
                          {tile.title}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          Tuile {tile.number} · +{tile.xp} XP
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronRight className={`w-4 h-4 transition ${
                          isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-400'
                        }`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Level Mini Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-['Outfit'] font-bold text-slate-900 text-sm">Niveau Étudiant</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                  Niveau {userLevel}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {getLevelTitle(userLevel)}
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((userXp % 250) / 2.5))}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 text-right font-mono font-medium">
                {userXp} / {userLevel * 250} XP
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTileId === 'dashboard' ? (
            <BentoGrid
              onSelectTile={(tileId) => handleSelectTileWithSound(tileId)}
              completedTiles={completedTiles}
              userXp={userXp}
              userLevel={userLevel}
              levelTitle={getLevelTitle(userLevel)}
              unlockedBadges={unlockedBadges}
            />
          ) : activeTileId === 'tile-ia' ? (
            <div className="space-y-4">
              <button
                onClick={() => handleSelectTileWithSound('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition shadow-xs"
              >
                ← Retour au Dashboard des Quêtes
              </button>
              <AiLabView />
            </div>
          ) : (
            <TileDetails
              tile={activeTile}
              isCompleted={completedTiles.includes(activeTileId)}
              onMarkComplete={handleToggleTileCompletion}
              onLaunchQuiz={handleQuizComplete}
              onBackToDashboard={() => handleSelectTileWithSound('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Trophies Modal */}
      <TrophiesModal
        isOpen={isTrophiesOpen}
        onClose={() => setIsTrophiesOpen(false)}
        unlockedBadges={unlockedBadges}
      />

      {/* Footer Clair & Épuré */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-['Outfit'] font-bold text-slate-800">Petite Réussite - Métabox IA (Édition Lumineuse 2.1)</span> · SAR Haute École Charlemagne
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
