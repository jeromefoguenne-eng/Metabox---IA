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
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
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
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const unlockBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges(prev => [...prev, badgeId]);
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

  const activeTile = TILES.find(t => t.id === activeTileId);

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Application Header */}
      <Header
        activeTileId={activeTileId}
        onSelectTile={(id) => {
          setActiveTileId(id);
          setMobileMenuOpen(false);
        }}
        completedTiles={completedTiles}
        completedQuizzes={completedQuizzes}
        userXp={userXp}
        userLevel={userLevel}
        onOpenTrophies={() => setIsTrophiesOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Vue :</span>
            <span className="text-xs font-bold text-indigo-400 truncate max-w-[180px]">
              {activeTileId === 'dashboard' ? 'Dashboard des Tuiles' : activeTile?.title || 'Lab IA'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar / Quick Navigation Menu */}
        <aside className={`lg:w-72 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24 space-y-4">
            
            {/* Dashboard Quick Switch Button */}
            <button
              onClick={() => {
                setActiveTileId('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border transition-all flex items-center gap-3 font-bold text-xs ${
                activeTileId === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div>Vue d'ensemble Bento</div>
                <div className="text-[10px] text-slate-400 font-normal">Toutes les 8 tuiles</div>
              </div>
            </button>

            <div className="flex items-center justify-between px-1 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quêtes & Modules
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {completedTiles.length}/8 finies
              </span>
            </div>

            {/* List of 8 Tiles in Sidebar */}
            <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {TILES.map((tile) => {
                const IconComponent = ICONS[tile.icon] || BookOpenCheck;
                const isActive = activeTileId === tile.id;
                const isCompleted = completedTiles.includes(tile.id);

                return (
                  <button
                    key={tile.id}
                    onClick={() => {
                      setActiveTileId(tile.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 group ${
                      isActive
                        ? tile.isNew
                          ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border-cyan-400/80 shadow-md ring-1 ring-cyan-400'
                          : 'bg-indigo-600/25 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500'
                        : 'bg-slate-900/50 border-slate-800/70 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isActive
                          ? tile.isNew ? 'bg-cyan-500/20 text-cyan-300' : 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {tile.title}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          Tuile {tile.number} · +{tile.xp} XP
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ChevronRight className={`w-3 h-3 transition ${
                          isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'
                        }`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Gamification Level Mini-Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/30 text-xs text-slate-300 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Statut Étudiant</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                  Niv. {userLevel}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {getLevelTitle(userLevel)}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((userXp % 250) / 2.5))}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 text-right font-mono">
                {userXp} / {userLevel * 250} XP
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTileId === 'dashboard' ? (
            <BentoGrid
              onSelectTile={(tileId) => setActiveTileId(tileId)}
              completedTiles={completedTiles}
              userXp={userXp}
              userLevel={userLevel}
              levelTitle={getLevelTitle(userLevel)}
              unlockedBadges={unlockedBadges}
            />
          ) : activeTileId === 'tile-ia' ? (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTileId('dashboard')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition shadow-sm"
              >
                ← Retour au Dashboard des Tuiles
              </button>
              <AiLabView />
            </div>
          ) : (
            <TileDetails
              tile={activeTile}
              isCompleted={completedTiles.includes(activeTileId)}
              onMarkComplete={handleToggleTileCompletion}
              onLaunchQuiz={handleQuizComplete}
              onBackToDashboard={() => setActiveTileId('dashboard')}
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

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-400">Petite Réussite - Métabox IA (Édition Gamifiée 2.0)</span> · SAR Haute École Charlemagne
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jeromefoguenne-eng/Metabox---IA"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 flex items-center gap-1.5 transition"
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
