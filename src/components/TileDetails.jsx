import React, { useState } from 'react';
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
import { GLOSSARY_ITEMS, QUIZ_DATABASE } from '../data/metaboxData';

export default function TileDetails({ 
  tile, 
  onMarkComplete, 
  isCompleted, 
  onLaunchQuiz 
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

  // Active embedded quiz id
  const [activeQuizId, setActiveQuizId] = useState(null);

  if (!tile) return null;

  const toggleChecklistStep = (step) => {
    setCheckedSteps(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Tile Header Banner */}
      <div className={`p-6 md:p-8 rounded-2xl bg-gradient-to-br ${tile.color} border shadow-xl relative overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white border border-slate-700">
                Tuile {tile.number} sur 7
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900/40 text-slate-200">
                {tile.badge}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {tile.title}
            </h2>
            <p className="text-sm md:text-base text-slate-200 mt-2 max-w-3xl leading-relaxed">
              {tile.shortDesc}
            </p>
          </div>

          <button
            onClick={() => onMarkComplete(tile.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition shadow-lg ${
              isCompleted
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
            {isCompleted ? 'Tuile Complétée' : 'Marquer comme lu'}
          </button>
        </div>
      </div>

      {/* TUILE 1 : MÉTABOX NEWS */}
      {tile.id === 'tile-news' && (
        <div className="space-y-6">
          {tile.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-6">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, iIdx) => (
                  <div 
                    key={iIdx}
                    className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-sky-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                          {item.period}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">Fiche Méthodo SAR</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{item.theme}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.summary}</p>

                      {item.tips && (
                        <div className="space-y-1.5 pt-3 border-t border-slate-700/50">
                          <span className="text-[11px] font-semibold text-sky-400 block mb-1">
                            Conseils concrets :
                          </span>
                          {item.tips.map((tip, tIdx) => (
                            <div key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-sky-400 text-sm leading-none">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-sky-400" /> MétaBox News.pdf
                      </span>
                      <span className="text-emerald-400 text-[11px]">Archivé Moodle</span>
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
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            {tile.modules.map((mod, idx) => (
              <button
                key={mod.id}
                onClick={() => {
                  setSelectedModuleIdx(idx);
                  setActiveQuizId(null);
                }}
                className={`flex-1 min-w-[180px] px-4 py-3 rounded-xl text-xs md:text-sm font-semibold transition text-left ${
                  selectedModuleIdx === idx
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold">{mod.title.split(':')[0]}</div>
                <div className="text-[11px] opacity-80 truncate">{mod.title.split(':')[1] || ''}</div>
              </button>
            ))}
          </div>

          {/* Active Module Content */}
          {(() => {
            const currentMod = tile.modules[selectedModuleIdx];
            return (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Séquence Pédagogique Moodle
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-2">
                    {currentMod.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    {currentMod.description}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {currentMod.content}
                </div>

                {/* Exercises in this module */}
                {currentMod.hasExercises && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <Play className="w-4 h-4 text-indigo-400" />
                        Exercices Interactifs de la Séquence
                      </h4>
                      <span className="text-xs text-slate-400">Autocorrectifs avec explications</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-indigo-400">Exercice Clé Moodle</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">10 questions</span>
                        </div>
                        <h5 className="font-bold text-white text-sm mb-1">
                          Exercice 2 : Identification des verbes de consigne
                        </h5>
                        <p className="text-xs text-slate-400 mb-4">
                          Biffer, Définir, Citer, Cocher, Souligner, Relier, Classer, Énumérer, Compléter, Comparer.
                        </p>
                        <button
                          onClick={() => setActiveQuizId('exo-verbes-1')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                        >
                          <Play className="w-3.5 h-3.5" /> Lancer l'entraînement interactif
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-purple-400">Exercice d'Analyse</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">Méthodologique</span>
                          </div>
                          <h5 className="font-bold text-white text-sm mb-1">
                            Exercice 3 : Compléter avec le verbe d'action adéquat
                          </h5>
                          <p className="text-xs text-slate-400">
                            15 contextes réels (Zakhartchouk, Canopé) pour choisir le verbe exact entre Citer, Décrire, Rédiger, Justifier.
                          </p>
                        </div>
                        <div className="mt-4 text-[11px] text-slate-500 italic">
                          Disponible dans le volet Lab IA pour génération dynamique.
                        </div>
                      </div>
                    </div>

                    {/* Render active quiz inline */}
                    {activeQuizId && QUIZ_DATABASE[activeQuizId] && (
                      <div className="mt-6 pt-6 border-t border-slate-800">
                        <QuizPlayer quiz={QUIZ_DATABASE[activeQuizId]} />
                      </div>
                    )}
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Lexique Terminologique du Supérieur (FWB)</h3>
                <p className="text-xs text-slate-400 mt-1">
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
                  placeholder="Rechercher un terme (ex: ECTS, UE, Prérequis)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Tous', 'Cursus & Crédits', 'Structure des Cours', 'Évaluation & Jury', 'Gestion Administrative', 'Soutien & Accompagnement'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Glossary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-emerald-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-2">{item.term}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Module 1 : Neuro-sciences & Sciences Cognitives
            </span>
            <h3 className="text-xl font-bold text-white mt-2 mb-2">
              Comment mémoriser durablement ? La Courbe d'Ebbinghaus
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-3xl">
              L'oubli n'est pas une fatalité : c'est le tri naturel effectué par notre cerveau. 
              Pour transférer une notion dans la mémoire à long terme, la seule clé efficace est la réactivation active et espacée.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
                <div className="text-2xl font-black text-rose-400 mb-1">-40 %</div>
                <div className="text-xs font-bold text-white">Après 20 minutes</div>
                <p className="text-[11px] text-slate-400 mt-1">Évaporation rapide des détails non notés ou non réinvestis.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
                <div className="text-2xl font-black text-amber-400 mb-1">30 à 40 %</div>
                <div className="text-xs font-bold text-white">Après 24 heures (J+1)</div>
                <p className="text-[11px] text-slate-400 mt-1">Seul un tiers subsiste si aucune relecture active n'a lieu le soir même.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
                <div className="text-2xl font-black text-purple-400 mb-1">~10 %</div>
                <div className="text-xs font-bold text-white">Après 6 mois</div>
                <p className="text-[11px] text-slate-400 mt-1">Trace mnésique quasi inexistante sans rappels espacés réguliers.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-center">
                <div className="text-2xl font-black text-emerald-400 mb-1">+90 %</div>
                <div className="text-xs font-bold text-white">Avec Spaced Retrieval</div>
                <p className="text-[11px] text-emerald-300/80 mt-1">Ancrage définitif grâce aux rappels à J+1, J+3, J+7, J+21.</p>
              </div>
            </div>

            {/* Launch Ebbinghaus Quiz */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveQuizId(activeQuizId === 'exo-meth-ebbinghaus' ? null : 'exo-meth-ebbinghaus')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition"
              >
                <Play className="w-3.5 h-3.5" /> 
                {activeQuizId === 'exo-meth-ebbinghaus' ? 'Fermer le quiz' : 'Tester mes connaissances sur la mémorisation (Quiz Moodle)'}
              </button>

              {activeQuizId === 'exo-meth-ebbinghaus' && (
                <div className="mt-6">
                  <QuizPlayer quiz={QUIZ_DATABASE['exo-meth-ebbinghaus']} />
                </div>
              )}
            </div>
          </div>

          {/* Interactive Eisenhower Matrix */}
          <EisenhowerBoard />
        </div>
      )}

      {/* TUILE 5 : ÉTUDIANT.E */}
      {tile.id === 'tile-student' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Le Métier d'Étudiant dans le Supérieur
            </span>
            <h3 className="text-xl font-bold text-white mt-2 mb-2">
              Droits, Devoirs, Statuts PEPS et Gestion Administrative
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-3xl">
              Entrer en Haute École implique de devenir le gestionnaire de son propre cursus académique. 
              Voici les règles incontournables pour sécuriser votre année.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
                  📋 Le RGEE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Le Règlement Général des Études et des Examens fixe les règles de délibération, les modalités d'absence et les délais stricts de recours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
                  🌟 Statuts PEPS
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Profils Spécifiques : Aménagements d'horaires et d'examens pour sportifs de haut niveau, artistes, entrepreneurs et étudiants à besoins spécifiques.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
                  🤝 Le SAR HECh
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Votre allié permanent : soutien méthodologique, aide à la planification, ateliers d'expression et entretiens individuels confidentiels.
                </p>
              </div>
            </div>

            {/* Quiz Métier Étudiant */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveQuizId(activeQuizId === 'exo-student-quiz' ? null : 'exo-student-quiz')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition"
              >
                <Play className="w-3.5 h-3.5" /> 
                {activeQuizId === 'exo-student-quiz' ? 'Fermer le quiz' : 'Passer le Quiz Métier d’Étudiant (Moodle HECh)'}
              </button>

              {activeQuizId === 'exo-student-quiz' && (
                <div className="mt-6">
                  <QuizPlayer quiz={QUIZ_DATABASE['exo-student-quiz']} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TUILE 6 : COMPÉTENCES NUMÉRIQUES */}
      {tile.id === 'tile-digital' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Guides Pratiques & Tutos HECh
            </span>
            <h3 className="text-xl font-bold text-white mt-2 mb-2">
              Les 6 Piliers de l'Autonomie Numérique
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Cliquez sur chaque guide pour déployer les bonnes pratiques informatiques institutionnelles.
            </p>

            <div className="space-y-3">
              {tile.guides.map((g) => {
                const isOpen = openGuideId === g.id;
                return (
                  <div 
                    key={g.id}
                    className="rounded-xl border border-slate-700/70 overflow-hidden bg-slate-800/40 transition"
                  >
                    <button
                      onClick={() => setOpenGuideId(isOpen ? null : g.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-800/80 transition"
                    >
                      <span className="font-bold text-sm text-white">{g.title}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-1 bg-slate-900/50 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
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
          {/* 5-step checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Méthode d'Auto-Correction
            </span>
            <h3 className="text-xl font-bold text-white mt-2 mb-2">
              Check-list Ortho'Express en 5 Passes
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-3xl">
              Ne relisez jamais un travail d'une seule traite en espérant tout voir. 
              La méthode en 5 passes découpe l'attention du cerveau pour traquer 100% des fautes récurrentes.
            </p>

            <div className="space-y-3">
              {tile.checklist.map((c, idx) => {
                const isChecked = checkedSteps[c.step];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklistStep(c.step)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-rose-500/40'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={!!isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-rose-400">{c.step} :</span>
                        <span className="text-sm font-bold text-white">{c.target}</span>
                      </div>
                      <p className="text-xs text-slate-300">{c.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Conjugaison Quiz */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => setActiveQuizId(activeQuizId === 'exo-ortho-1' ? null : 'exo-ortho-1')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
              >
                <Play className="w-3.5 h-3.5" /> 
                {activeQuizId === 'exo-ortho-1' ? 'Fermer l’exercice' : 'Lancer l’Exercice 1 de Conjugaison Piège (Moodle HECh)'}
              </button>

              {activeQuizId === 'exo-ortho-1' && (
                <div className="mt-6">
                  <QuizPlayer quiz={QUIZ_DATABASE['exo-ortho-1']} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
