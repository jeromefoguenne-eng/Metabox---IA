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
  Code2
} from 'lucide-react';
import Header from './components/Header';
import TileDetails from './components/TileDetails';
import AiLabView from './components/AiLabView';
import { TILES, METABOX_INFO } from './data/metaboxData';

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
  const [activeTileId, setActiveTileId] = useState('tile-lang'); // Start on Tile 2 or News
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('metabox_completed_tiles', JSON.stringify(completedTiles));
  }, [completedTiles]);

  useEffect(() => {
    localStorage.setItem('metabox_completed_quizzes', JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  const handleToggleTileCompletion = (tileId) => {
    setCompletedTiles(prev => 
      prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]
    );
  };

  const handleQuizComplete = (quizId) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes(prev => [...prev, quizId]);
    }
  };

  const activeTile = TILES.find(t => t.id === activeTileId);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Application Header */}
      <Header
        activeTileId={activeTileId}
        onSelectTile={(id) => {
          setActiveTileId(id);
          setMobileMenuOpen(false);
        }}
        completedTiles={completedTiles}
        completedQuizzes={completedQuizzes}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Tuile sélectionnée :</span>
            <span className="text-xs font-bold text-indigo-400 truncate max-w-[180px]">
              {activeTile?.title || 'Lab IA'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar / Tiles Grid Navigator */}
        <aside className={`lg:w-80 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Hub des Tuiles Métabox
              </span>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Moodle 685
              </span>
            </div>

            {/* List of 8 Tiles */}
            <div className="space-y-2">
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
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                      isActive
                        ? tile.isNew
                          ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border-cyan-400/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                          : 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? tile.isNew ? 'bg-cyan-500/20 text-cyan-300' : 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {tile.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {tile.badge}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 transition ${
                          isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'
                        }`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Institutional info card */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-2 mt-6">
              <div className="font-semibold text-slate-300 flex items-center justify-between">
                <span>Haute École Charlemagne</span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">HECh</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Dispositif transversal géré par le Service d'Accompagnement à la Réussite (SAR) avec l'appui du projet ARES Petite Réussite.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <a
                  href="https://moodle.hech.be/course/view.php?id=685"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Moodle officiel <ExternalLink className="w-3 h-3" />
                </a>
                <span className="font-mono text-slate-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTileId === 'tile-ia' ? (
            <AiLabView />
          ) : (
            <TileDetails
              tile={activeTile}
              isCompleted={completedTiles.includes(activeTileId)}
              onMarkComplete={handleToggleTileCompletion}
              onLaunchQuiz={handleQuizComplete}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-400">Petite Réussite - Métabox IA</span> · Dispositif d'Aide à la Réussite HECh & AgentCorp
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
            <span>Local First & Free-Tier</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
