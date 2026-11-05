import { getAssetPath } from "../utils/assetPath";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  BookOpenCheck, 
  HelpCircle, 
  BrainCircuit, 
  GraduationCap, 
  Laptop, 
  SpellCheck,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  Play,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  Layers
} from 'lucide-react';
import QuizPlayer from './QuizPlayer';
import EisenhowerBoard from './EisenhowerBoard';
import TvGameShowArena from './TvGameShowArena';
import GrandConcours3ManchesArena from './GrandConcours3ManchesArena';
import { GLOSSARY_ITEMS, QUIZ_DATABASE } from '../data/metaboxData';
import { sounds } from '../utils/soundEffects';

export default function TileDetails({ 
  tile, 
  onMarkComplete, 
  isCompleted, 
  onLaunchQuiz,
  onBackToDashboard
}) {
  // Tile 2 module selection
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);

  // Glossary search & filter
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Digital guides accordion
  const [openGuideId, setOpenGuideId] = useState('guide-m365');

  // Ortho checklist states
  const [checkedSteps, setCheckedSteps] = useState({});

  // Active embedded quiz id & TV game show mode
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [isTvShowMode, setIsTvShowMode] = useState(true); // TV 3D by default!

  const getShowTypeForQuiz = (quizId) => {
    if (quizId === 'exo-verbes-1') return 'millionnaire';
    if (quizId === 'exo-meth-ebbinghaus') return 'champion';
    if (quizId === 'exo-ortho-1') return 'roue';
    if (quizId === 'exo-student-quiz') return 'concours';
    return 'millionnaire';
  };

  const getTileThemeColor = (tileId) => {
    switch (tileId) {
      case 'tile-news': return '#0284c7';
      case 'tile-lang': return '#4f46e5';
      case 'tile-glossary': return '#059669';
      case 'tile-methodo': return '#d97706';
      case 'tile-student': return '#9333ea';
      case 'tile-digital': return '#0891b2';
      case 'tile-ortho': return '#e11d48';
      default: return '#6366f1';
    }
  };

  const getTilePageBg = (tileId) => {
    switch (tileId) {
      case 'tile-news': return 'bg-sky-50/70 border-sky-200/80';
      case 'tile-lang': return 'bg-indigo-50/70 border-indigo-200/80';
      case 'tile-glossary': return 'bg-emerald-50/70 border-emerald-200/80';
      case 'tile-methodo': return 'bg-amber-50/70 border-amber-200/80';
      case 'tile-student': return 'bg-purple-50/70 border-purple-200/80';
      case 'tile-digital': return 'bg-cyan-50/70 border-cyan-200/80';
      case 'tile-ortho': return 'bg-rose-50/70 border-rose-200/80';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const renderQuizExperience = (quizId) => {
    if (!activeQuizId || activeQuizId !== quizId || !QUIZ_DATABASE[quizId]) return null;

    if (isTvShowMode) {
      const showType = getShowTypeForQuiz(quizId);
      if (showType === 'concours') {
        return (
          <GrandConcours3ManchesArena
            onClose={() => setActiveQuizId(null)}
            onFinishGame={(score) => onLaunchQuiz(quizId)}
          />
        );
      }

      return (
        <TvGameShowArena
          quiz={QUIZ_DATABASE[quizId]}
          showType={showType}
          themeColor={getTileThemeColor(tile.id)}
          onClose={() => setActiveQuizId(null)}
          onFinishGame={(score) => onLaunchQuiz(quizId)}
        />
      );
    }

    return (
      <div className="mt-8 pt-6 border-t-2 border-slate-200 animate-in fade-in duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Format d'expérience :</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setIsTvShowMode(true);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              🎬 Passer en Émission TV 3D (Plein Écran)
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setIsTvShowMode(false);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-900 text-white shadow-xs"
            >
              📝 Mode Examen Moodle
            </button>
          </div>
        </div>

        <QuizPlayer
          quiz={QUIZ_DATABASE[quizId]}
          onComplete={() => onLaunchQuiz(quizId)}
        />
      </div>
    );
  };

  if (!tile) return null;

  const toggleChecklistStep = (step) => {
    sounds.playPop();
    const nextState = !checkedSteps[step];
    if (nextState) sounds.playSuccess();
    setCheckedSteps(prev => ({
      ...prev,
      [step]: nextState
    }));
  };

  const handleBack = () => {
    sounds.playPop();
    if (onBackToDashboard) onBackToDashboard();
  };

  const handleTabChange = (idx) => {
    sounds.playPop();
    setSelectedModuleIdx(idx);
    setActiveQuizId(null);
  };

  const handleAccordion = (id) => {
    sounds.playPop();
    setOpenGuideId(openGuideId === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`space-y-8 p-4 sm:p-6 rounded-3xl border-2 ${getTilePageBg(tile.id)} shadow-xs`}
    >
      {/* Back to Dashboard Navigation & Logo Officiel HECh */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {onBackToDashboard && (
          <motion.button
            whileHover={{ scale: 1.03, x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition shadow-xs"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour au Dashboard des Quêtes
          </motion.button>
        )}
        <div className="h-10 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
          <img
            src={getAssetPath("/images/hech_logo_officiel.png")}
            alt="Haute École Charlemagne"
            className="h-7 w-7 object-contain"
          />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono hidden sm:inline">
            SAR · Module Pédagogique
          </span>
        </div>
      </div>

      {/* Visual Image Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md h-64 md:h-72 bg-slate-900 group">
        <img 
          src={tile.image} 
          alt={tile.title} 
          className="w-full h-full object-cover filter brightness-[0.65] transform group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 shadow">
                Tuile {tile.number} sur 8
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-white shadow">
                {tile.badge}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.playSuccess();
                onMarkComplete(tile.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition backdrop-blur-md shadow-md ${
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-white/90 hover:bg-white text-slate-800'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
              {isCompleted ? 'Quête Validée ✅' : 'Marquer comme lu (+XP)'}
            </motion.button>
          </div>

          <div>
            <h2 className="font-['Outfit'] text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {tile.title}
            </h2>
            <p className="text-sm md:text-base text-slate-100 mt-2 max-w-3xl leading-relaxed drop-shadow font-normal">
              {tile.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* TUILE 1 : MÉTABOX NEWS */}
      {tile.id === 'tile-news' && (
        <div className="space-y-6">
          {tile.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-6">
                <Calendar className="w-5 h-5 text-sky-600" />
                <h3 className="font-['Outfit'] text-xl font-bold text-slate-900">{section.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((item, iIdx) => (
                  <div 
                    key={iIdx}
                    className="p-6 rounded-2xl bg-sky-50/40 border border-sky-100 hover:border-sky-300 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-100 text-sky-800">
                          {item.period}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Fiche SAR HECh</span>
                      </div>
                      <h4 className="font-['Outfit'] text-lg font-bold text-slate-900 mb-2">{item.theme}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{item.summary}</p>

                      {item.tips && (
                        <div className="space-y-2 pt-4 border-t border-sky-100">
                          <span className="text-xs font-bold text-sky-700 block mb-1">
                            Conseils concrets de terrain :
                          </span>
                          {item.tips.map((tip, tIdx) => (
                            <div key={tIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-sky-600 text-base leading-none font-bold">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <FileText className="w-4 h-4 text-sky-600" /> MétaBox News.pdf
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Archivé Moodle</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TUILE 2 : PARTIE LANGAGIÈRE */}
      {tile.id === 'tile-lang' && (
        <div className="space-y-6">
          {/* Module Selector Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
            {tile.modules.map((mod, idx) => (
              <button
                key={mod.id}
                onClick={() => handleTabChange(idx)}
                className={`flex-1 min-w-[180px] px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  selectedModuleIdx === idx
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div>{mod.title.split(':')[0]}</div>
                <div className="text-xs opacity-75 font-normal truncate">{mod.title.split(':')[1] || ''}</div>
              </button>
            ))}
          </div>

          {/* Active Module Content */}
          {(() => {
            const currentMod = tile.modules[selectedModuleIdx];
            return (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Séquence Pédagogique Moodle
                  </span>
                  <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black text-slate-900 mt-2">
                    {currentMod.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {currentMod.description}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-800 whitespace-pre-line leading-relaxed">
                  {currentMod.content}
                </div>

                {/* Exercises in this module */}
                {currentMod.hasExercises && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="font-['Outfit'] font-black text-slate-900 text-lg flex items-center gap-2">
                        <Play className="w-5 h-5 text-indigo-600" />
                        Exercices Interactifs de la Séquence
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">Correction immédiate intégrée</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-indigo-50/50 border-2 border-indigo-200 hover:border-indigo-400 transition flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-indigo-700 uppercase">Exercice Clé Moodle</span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">10 questions</span>
                          </div>
                          <h5 className="font-['Outfit'] font-bold text-slate-900 text-base mb-1.5">
                            Exercice 2 : Identification des verbes de consigne
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                            Biffer, Définir, Citer, Cocher, Souligner, Relier, Classer, Énumérer, Compléter, Comparer.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            sounds.playPop();
                            setIsTvShowMode(true);
                            setActiveQuizId('exo-verbes-1');
                          }}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-outfit font-black tracking-wide transition shadow-lg shadow-indigo-600/25 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" /> 
                          🎬 Lancer le Jeu TV en Plein Écran (10 Questions)
                        </button>
                      </div>

                      <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-purple-700 uppercase">Exercice d'Analyse</span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">Méthodologique</span>
                          </div>
                          <h5 className="font-['Outfit'] font-bold text-slate-900 text-base mb-1.5">
                            Exercice 3 : Compléter avec le verbe adéquat
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            15 contextes réels (Zakhartchouk, Canopé) pour choisir le verbe exact entre Citer, Décrire, Rédiger, Justifier.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-700 font-medium">
                          💡 Astuce : Entraînez-vous aussi sur le mini-jeu « Défi Consignes Express » dans le Lab IA !
                        </div>
                      </div>
                    </div>

                    {/* Render active quiz inline */}
                    {renderQuizExperience('exo-verbes-1')}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TUILE 3 : GLOSSAIRE GÉNÉRAL */}
      {tile.id === 'tile-glossary' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h3 className="font-['Outfit'] text-2xl font-black text-slate-900">Lexique Officiel du Supérieur (FWB)</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Définitions officielles des règles académiques, du décret Paysage et du fonctionnement de la HECh.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Rechercher (ex: ECTS, UE, Prérequis)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Tous', 'Cursus & Crédits', 'Structure des Cours', 'Évaluation & Jury', 'Gestion Administrative', 'Soutien & Accompagnement'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCategory(cat);
                  }}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Glossary Grid - Full text, highly legible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GLOSSARY_ITEMS
                .filter(item => {
                  const matchSearch = item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
                    item.definition.toLowerCase().includes(glossarySearch.toLowerCase());
                  const matchCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
                  return matchSearch && matchCategory;
                })
                .map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 hover:border-emerald-300 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-['Outfit'] font-bold text-slate-900 text-lg mb-2">{item.term}</h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.definition}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TUILE 4 : METHODOLOGIE */}
      {tile.id === 'tile-methodo' && (
        <div className="space-y-8">
          {/* Ebbinghaus Visual Curve */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Module 1 : Neuro-sciences & Sciences Cognitives
            </span>
            <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-2">
              Comment mémoriser durablement ? La Courbe d'Ebbinghaus
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-3xl">
              L'oubli n'est pas une fatalité : c'est le tri naturel effectué par notre cerveau. 
              Pour transférer une notion dans la mémoire à long terme, la seule clé efficace est la réactivation active et espacée.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <div className="font-['Outfit'] text-3xl font-black text-rose-600 mb-1">-40 %</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Après 20 minutes</div>
                <p className="text-xs text-slate-600 mt-1">Évaporation rapide des détails non réinvestis.</p>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <div className="font-['Outfit'] text-3xl font-black text-amber-600 mb-1">30 à 40 %</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Après 24 heures (J+1)</div>
                <p className="text-xs text-slate-600 mt-1">Seul un tiers subsiste sans relecture active le soir.</p>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <div className="font-['Outfit'] text-3xl font-black text-purple-600 mb-1">~10 %</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Après 6 mois</div>
                <p className="text-xs text-slate-600 mt-1">Trace mnésique quasi nulle sans révisions espacées.</p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center">
                <div className="font-['Outfit'] text-3xl font-black text-emerald-600 mb-1">+90 %</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-950">Avec Rappels Espacés</div>
                <p className="text-xs text-emerald-800 mt-1">Ancrage définitif via rappels à J+1, J+3, J+7, J+21.</p>
              </div>
            </div>
          </div>

          {/* Interactive Eisenhower Matrix */}
          <EisenhowerBoard />
        </div>
      )}

      {/* TUILE 5 : ÉTUDIANT.E */}
      {tile.id === 'tile-student' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Le Métier d'Étudiant dans le Supérieur
            </span>
            <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-2">
              Droits, Devoirs, Statuts PEPS et Gestion Administrative
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-3xl">
              Entrer en Haute École implique de devenir le gestionnaire de son propre cursus académique. 
              Voici les règles incontournables pour sécuriser votre année.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100">
                <h4 className="font-['Outfit'] font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  📋 Le RGEE
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Le Règlement Général des Études et des Examens fixe les règles de délibération, les modalités d'absence et les délais stricts de recours.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100">
                <h4 className="font-['Outfit'] font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  🌟 Statuts PEPS
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Profils Spécifiques : Aménagements d'horaires et d'examens pour sportifs de haut niveau, artistes, entrepreneurs et étudiants à besoins spécifiques.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100">
                <h4 className="font-['Outfit'] font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  🤝 Le SAR HECh
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Votre allié permanent : soutien méthodologique, aide à la planification, ateliers d'expression et entretiens individuels confidentiels.
                </p>
              </div>
            </div>

            {/* Quiz Métier Étudiant */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsTvShowMode(true);
                  setActiveQuizId('exo-student-quiz');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-outfit font-black tracking-wide transition shadow-lg shadow-purple-600/25 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> 
                🎬 Lancer le Jeu TV en Plein Écran (Le Grand Concours de la HECh)
              </button>

              {renderQuizExperience('exo-student-quiz')}
            </div>
          </div>
        </div>
      )}

      {/* TUILE 6 : COMPÉTENCES NUMÉRIQUES */}
      {tile.id === 'tile-digital' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
              Guides Pratiques & Tutos HECh
            </span>
            <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-2">
              Les 6 Piliers de l'Autonomie Numérique
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Cliquez sur chaque guide pour déployer les bonnes pratiques informatiques institutionnelles.
            </p>

            <div className="space-y-4">
              {tile.guides.map((g) => {
                const isOpen = openGuideId === g.id;
                return (
                  <div 
                    key={g.id}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs transition"
                  >
                    <button
                      onClick={() => handleAccordion(g.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                    >
                      <span className="font-['Outfit'] font-bold text-sm sm:text-base text-slate-900">{g.title}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-cyan-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50">
                        {g.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TUILE 7 : ORTHO'EXPRESS */}
      {tile.id === 'tile-ortho' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              Méthode d'Auto-Correction
            </span>
            <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-2">
              Check-list Ortho'Express en 5 Passes
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-3xl">
              Ne relisez jamais un travail d'une seule traite en espérant tout voir. 
              La méthode en 5 passes découpe l'attention du cerveau pour traquer 100% des fautes récurrentes.
            </p>

            <div className="space-y-4">
              {tile.checklist.map((c, idx) => {
                const isChecked = checkedSteps[c.step];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklistStep(c.step)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-4 ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={!!isChecked}
                        onChange={() => {}}
                        className="w-5 h-5 rounded text-rose-600 border-slate-300 focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-['Outfit'] text-xs font-bold text-rose-600 uppercase tracking-wider">{c.step} :</span>
                        <span className="font-['Outfit'] text-sm sm:text-base font-bold text-slate-900">{c.target}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600">{c.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Conjugaison Quiz */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsTvShowMode(true);
                  setActiveQuizId('exo-ortho-1');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-outfit font-black tracking-wide transition shadow-lg shadow-rose-600/25 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> 
                🎬 Lancer le Jeu TV en Plein Écran (La Roue des Accords)
              </button>

              {renderQuizExperience('exo-ortho-1')}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
