import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Search, 
  MessageSquareCheck, 
  Gamepad2, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight,
  Send,
  RefreshCw,
  PlusCircle,
  Award,
  ShieldAlert,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SpeedChallengeGame from './SpeedChallengeGame';
import EscapeGameAurore from './EscapeGameAurore';
import { sounds } from '../utils/soundEffects';

const PRESET_CONSIGNES = [
  {
    title: "Consigne Comparaison (Module Langagier)",
    text: "Expliquez en quoi une gaufre de Liège est plus calorique qu’une crêpe traditionnelle, puis comparez leurs ingrédients essentiels en vous appuyant sur les données nutritionnelles fournies."
  },
  {
    title: "Consigne Examen Dénaturation (Module 5)",
    text: "Expliquez quelles sont les causes et les conséquences de la dénaturation des protéines lors de la cuisson d'un aliment, en illustrant votre raisonnement par deux exemples concrets."
  },
  {
    title: "Consigne Block Train vs Single Wagon (Moodle 685)",
    text: "Expliquez en anglais la différence fondamentale entre block train et single wagon, puis justifiez l'impact logistique sur le transport ferroviaire de fret."
  }
];

export default function AiLabView() {
  const [activeTab, setActiveTab] = useState('escape'); // escape | analyzer | simulator | games
  const [isEscapeGameOpen, setIsEscapeGameOpen] = useState(false);

  // State for Consigne Analyzer
  const [inputConsigne, setInputConsigne] = useState(PRESET_CONSIGNES[0].text);
  const [analyzedResult, setAnalyzedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State for Evaluator / Simulator
  const [simQuestion, setSimQuestion] = useState(
    "Expliquez en quoi la réactivation espacée est plus efficace que le bachotage intensif la veille d'un examen."
  );
  const [studentAnswer, setStudentAnswer] = useState("");
  const [evaluationFeedback, setEvaluationFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleTabChange = (t) => {
    sounds.playPop();
    setActiveTab(t);
  };

  // Analyze consigne function
  const handleAnalyzeConsigne = () => {
    if (!inputConsigne.trim()) return;
    sounds.playPop();
    setIsAnalyzing(true);
    setAnalyzedResult(null);

    setTimeout(() => {
      sounds.playSuccess();
      const lower = inputConsigne.toLowerCase();
      const detectedVerbs = [];
      const verbRules = [
        { v: 'expliquer', type: 'Conceptuel & Explicatif', level: 'Niveau Élevé (Taxonomie 4)', need: 'Exiger une relation de cause à effet et une démonstration' },
        { v: 'comparer', type: 'Mise en regard bilatérale', level: 'Niveau Élevé (Taxonomie 4)', need: 'Dégager obligatoirement les points communs ET les divergences' },
        { v: 'justifier', type: 'Argumentation & Preuve', level: 'Niveau Approfondi (Taxonomie 5)', need: 'Apporter des faits tangibles, chiffres ou références pour valider l’affirmation' },
        { v: 'illustrer', type: 'Application concrète', level: 'Niveau Intermédiaire (Taxonomie 3)', need: 'Fournir au moins un cas réel ou un exemple chiffré pertinent' },
        { v: 'lister', type: 'Précis & Factuel', level: 'Niveau Basique (Taxonomie 1)', need: 'Énumérer sous forme de puces sans digression' },
        { v: 'définir', type: 'Exactitude sémantique', level: 'Niveau Basique (Taxonomie 1)', need: 'Donner les caractéristiques essentielles du concept' },
        { v: 'citer', type: 'Restitution directe', level: 'Niveau Basique (Taxonomie 1)', need: 'Nommer sans paraphraser' }
      ];

      verbRules.forEach(rule => {
        if (lower.includes(rule.v)) {
          detectedVerbs.push(rule);
        }
      });

      if (detectedVerbs.length === 0) {
        detectedVerbs.push({
          v: 'Verbe spécifique',
          type: 'Analyse d’énoncé',
          level: 'Niveau Contextuel',
          need: 'Bien respecter la consigne directe du professeur'
        });
      }

      setAnalyzedResult({
        verbs: detectedVerbs,
        hasDoubleConsigne: detectedVerbs.length > 1,
        constraints: [
          lower.includes('en anglais') ? 'Rédiger impérativement en langue anglaise' : null,
          lower.includes('deux exemples') || lower.includes('2 exemples') ? 'Fournir exactement 2 exemples distincts (barème pénalisant si 1 seul)' : null,
          lower.includes('justifiez') ? 'Obligation de preuve et d’argumentation logique' : null
        ].filter(Boolean),
        templateOutline: [
          "1. Phrase d'amorce reprenant fidèlement les termes de la consigne",
          "2. Développement logique ordonné (utiliser des connecteurs logiques : d'abord, en revanche, par conséquent)",
          "3. Illustration par un exemple concret directement lié à la problématique",
          "4. Brève conclusion répondant synthétiquement à la question"
        ],
        commonTraps: [
          "Oublier la 2ème sous-tâche (ex: comparer sans avoir préalablement expliqué)",
          "Se contenter d'une affirmation sans illustrer d'un fait tangible",
          "Rédiger une phrase fleuve confuse sans ponctuation"
        ]
      });
      setIsAnalyzing(false);
    }, 600);
  };

  // Evaluate student answer
  const handleEvaluateAnswer = () => {
    if (!studentAnswer.trim()) return;
    sounds.playPop();
    setIsEvaluating(true);
    setEvaluationFeedback(null);

    setTimeout(() => {
      sounds.playSuccess();
      const words = studentAnswer.trim().split(/\s+/).length;
      const lower = studentAnswer.toLowerCase();

      // Simple heuristic metrics
      const hasConnectors = ['parce que', 'en effet', 'par conséquent', 'd’une part', 'en revanche', 'ainsi', 'donc', 'car'].some(c => lower.includes(c));
      const hasKeywords = ['ebbinghaus', 'oubli', 'mémoire', 'synapse', 'réactivation', 'espacé', 'long terme', 'consolidation', 'répétition'].some(k => lower.includes(k));
      const hasComparison = lower.includes('alors que') || lower.includes('contrairement') || lower.includes('plus que') || lower.includes('différence');

      let grade = 10;
      if (words > 25) grade += 3;
      if (hasConnectors) grade += 3;
      if (hasKeywords) grade += 3;
      if (hasComparison) grade += 1;
      if (grade > 20) grade = 20;

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });

      setEvaluationFeedback({
        score: grade,
        wordCount: words,
        strengths: [
          words >= 25 ? "Longueur de réponse adéquate permettant un développement argumenté" : "Réponse concise",
          hasConnectors ? "Bonne utilisation des connecteurs logiques pour structurer la pensée" : "Effort de formulation",
          hasKeywords ? "Mobilisation de notions théoriques clés en sciences cognitives" : "Idée générale perçue"
        ],
        improvements: [
          !hasConnectors ? "Introduisez des connecteurs (ex : 'en effet', 'par conséquent') pour rendre la démonstration plus fluide." : null,
          !hasKeywords ? "Enrichissez votre vocabulaire avec les termes précis du cours (courbe de l'oubli, répétition espacée, consolidation mnésique)." : null,
          words < 25 ? "Développez davantage votre propos : un correcteur académique attend une explication détaillée plutôt qu'une simple affirmation." : null
        ].filter(Boolean),
        idealModel: "La réactivation espacée est scientifiquement supérieure au bachotage car elle interrompt la courbe naturelle de l'oubli d'Ebbinghaus. Alors que le bachotage ne sollicite qu'éphémèrement la mémoire de travail sans ancrage durable, les rappels espacés obligent le cerveau à reconstruire activement le tracé synaptique, garantissant ainsi le transfert pérenne vers la mémoire à long terme."
      });
      setIsEvaluating(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner Clair & Coloré */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-8 md:p-10 shadow-lg text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-cyan-200 border border-white/30 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Volet Innovant Petite Réussite
            </div>
            <h2 className="font-['Outfit'] text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Lab IA & Entraînement Intelligent Métabox ✨
            </h2>
            <p className="text-sm md:text-base text-indigo-100 mt-2 leading-relaxed">
              Outils d'intelligence artificielle pédagogique pour la Haute École Charlemagne : 
              décodage sémantique de consignes, simulation de feedback immédiat et serious games.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-md text-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-md border border-white/60">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Moteurs IA</div>
              <div className="font-['Outfit'] text-sm font-bold text-slate-900">Local First (Ollama)</div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 100% Souverain & Gratuit
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs inside IA Lab */}
        <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-white/20">
          <button
            onClick={() => handleTabChange('escape')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-wide transition shadow-lg ${
              activeTab === 'escape'
                ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                : 'bg-rose-500/30 text-rose-100 hover:bg-rose-500/50 border border-rose-400/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-200" /> 🔐 Escape Game : Panique au Jury !
          </button>

          <button
            onClick={() => handleTabChange('analyzer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'analyzer'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Search className="w-4 h-4" /> 1. Analyseur de Consignes IA
          </button>

          <button
            onClick={() => handleTabChange('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'simulator'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <MessageSquareCheck className="w-4 h-4" /> 2. Simulateur de Feedback & Notation
          </button>

          <button
            onClick={() => handleTabChange('games')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'games'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Gamepad2 className="w-4 h-4" /> 3. Serious Games (Défi Express ⚡️)
          </button>

          <button
            onClick={() => handleTabChange('creator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'creator'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> 4. Atelier Enseignant (Co-Création)
          </button>
        </div>
      </div>

      {/* TAB 0: ESCAPE GAME PANIQUE AU JURY (FEATURED) */}
      {activeTab === 'escape' && (
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldAlert className="w-96 h-96 text-rose-500" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Nouveau Serious Game Immersif 3D
            </div>

            <h3 className="text-3xl sm:text-4xl font-['Outfit'] font-black text-white leading-tight">
              Panique au Jury : L'Algorithme Fantôme
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              À 45 minutes des délibérations, l'algorithme expérimental <strong>A.U.R.O.R.E.</strong> a gelé les 60 crédits ECTS du Bloc 1, convaincu que la triche et les hallucinations de l'IA ont dévalué les diplômes. Infiltrez le cyber-campus en 3D Pixar, déjouez les pièges du plagiat, réduisez l'empreinte carbone du datacenter et affrontez la machine au grand tribunal !
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-xl block mb-1">🔬</span>
                <strong className="text-xs font-bold text-cyan-300 block">Fact-Checking</strong>
                <span className="text-[10px] text-slate-400">Traque des faux DOI</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-xl block mb-1">⚖️</span>
                <strong className="text-xs font-bold text-purple-300 block">Tribunal Jury</strong>
                <span className="text-[10px] text-slate-400">Plagiat vs Copilote</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-xl block mb-1">⚡</span>
                <strong className="text-xs font-bold text-emerald-300 block">Éco-Datacenter</strong>
                <span className="text-[10px] text-slate-400">SLM & Climat RGPD</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-xl block mb-1">🃏</span>
                <strong className="text-xs font-bold text-pink-300 block">Prompt Wars</strong>
                <span className="text-[10px] text-slate-400">Contre les biais</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsEscapeGameOpen(true);
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:scale-[1.02] text-white font-['Outfit'] font-black text-sm uppercase tracking-wider shadow-xl shadow-rose-500/30 transition flex items-center gap-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Lancer l'Escape Game en Plein Écran</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN ESCAPE GAME MODAL */}
      {isEscapeGameOpen && (
        <EscapeGameAurore onClose={() => setIsEscapeGameOpen(false)} />
      )}

      {/* TAB 1: ANALYSEUR DE CONSIGNES */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-['Outfit'] text-xl font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                Déposez une consigne d'examen
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
                Collez une consigne réelle d'enseignant ou testez un exemple issu du Moodle HECh.
              </p>

              {/* Presets */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Exemples prédéfinis du cours :
                </span>
                <div className="flex flex-col gap-2">
                  {PRESET_CONSIGNES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playPop();
                        setInputConsigne(preset.text);
                      }}
                      className="text-left text-xs sm:text-sm p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 transition"
                    >
                      👉 <strong>{preset.title}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={inputConsigne}
                onChange={(e) => setInputConsigne(e.target.value)}
                placeholder="Tapez ou collez une consigne d'évaluation ici..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white leading-relaxed font-sans"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyzeConsigne}
                  disabled={isAnalyzing || !inputConsigne.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-sm disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Analyse IA en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Décoder la consigne avec l'IA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {analyzedResult ? (
              <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h4 className="font-['Outfit'] font-black text-slate-900 flex items-center gap-2 text-base sm:text-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Diagnostic Métacognitif de la Consigne
                  </h4>
                  {analyzedResult.hasDoubleConsigne && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                      ⚠️ Double consigne !
                    </span>
                  )}
                </div>

                {/* Detected Verbs */}
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Verbes d'action identifiés :
                  </h5>
                  <div className="space-y-2.5">
                    {analyzedResult.verbs.map((v, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-indigo-700 capitalize text-sm">{v.v}</span>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                              {v.type}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 mt-1">{v.need}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">{v.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                {analyzedResult.constraints.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Contraintes spécifiques repérées :
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                      {analyzedResult.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Structure */}
                <div>
                  <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    Gabarit de Réponse Idéal (Attendu par l'évaluateur) :
                  </h5>
                  <div className="space-y-2">
                    {analyzedResult.templateOutline.map((step, i) => (
                      <div key={i} className="text-xs sm:text-sm p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Traps */}
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <h5 className="text-xs font-bold text-rose-800 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Pièges fréquents sanctionnés aux examens :
                  </h5>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-rose-900 space-y-1">
                    {analyzedResult.commonTraps.map((trap, i) => (
                      <li key={i}>{trap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <BrainCircuit className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-700">L'analyse sémantique s'affichera ici.</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Cliquez sur « Décoder la consigne avec l'IA » pour obtenir le rapport détaillé.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATEUR DE FEEDBACK */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-['Outfit'] text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquareCheck className="w-5 h-5 text-indigo-600" />
                Simulateur de Rédaction & Évaluation
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
                Entraînez-vous à rédiger votre réponse : l'IA évalue la cohérence, le niveau de langue et la rigueur académique.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 mb-4">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                  Question de l'exercice :
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900">{simQuestion}</p>
              </div>

              <textarea
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Rédigez votre réponse comme si vous étiez à l'examen..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500 font-medium">
                  {studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0} mots rédigés
                </span>
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !studentAnswer.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-sm disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Évaluation formative...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Évaluer avec l'IA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {evaluationFeedback ? (
              <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feedback Formatif Immédiat</span>
                    <h4 className="font-['Outfit'] font-black text-slate-900 text-lg">Rapport de Compétence Écrite</h4>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                    <Award className="w-6 h-6 text-amber-600" />
                    <span className="font-['Outfit'] font-black text-xl text-amber-900">
                      {evaluationFeedback.score} <span className="text-xs text-slate-400 font-normal">/ 20</span>
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Points forts constatés :
                  </h5>
                  <div className="space-y-2">
                    {evaluationFeedback.strengths.map((str, i) => (
                      <div key={i} className="text-xs sm:text-sm p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                        ✅ {str}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                {evaluationFeedback.improvements.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> Pistes d'amélioration pour atteindre le 18/20 :
                    </h5>
                    <div className="space-y-2">
                      {evaluationFeedback.improvements.map((imp, i) => (
                        <div key={i} className="text-xs sm:text-sm p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                          💡 {imp}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Answer */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <h5 className="text-xs font-bold text-indigo-700 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> Réponse modèle type (Corrigé académique) :
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    « {evaluationFeedback.idealModel} »
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquareCheck className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-700">L'évaluation formative et le feedback s'afficheront ici.</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Rédigez votre réponse et cliquez sur « Évaluer avec l'IA ».
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SERIOUS GAMES */}
      {activeTab === 'games' && (
        <div className="space-y-8">
          {/* Active Mini Game */}
          <SpeedChallengeGame />

          <div className="pt-6 border-t border-slate-200">
            <h4 className="font-['Outfit'] text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-600" /> Autres Serious Games en Préparation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-purple-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
                      <BrainCircuit className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                      Aventure Textuelle
                    </span>
                  </div>
                  <h4 className="font-['Outfit'] text-lg font-bold text-slate-900 mb-2">Jeu 2 : Mission Réussite</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Vous incarnez un étudiant de BAC 1 à la HECh face aux tentations de la procrastination, au blocus et aux examens. Chaque décision méthodologique influence votre taux de réussite.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Choix multiples & XP</span>
                  <button 
                    onClick={() => {
                      sounds.playPop();
                      alert("L'aventure interactive Mission Réussite sera branchée avec le modèle IA local !");
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition"
                  >
                    Prévisualiser
                  </button>
                </div>
              </div>

              <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-rose-50 text-rose-700 rounded-2xl">
                      <Zap className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                      Duel Rapide
                    </span>
                  </div>
                  <h4 className="font-['Outfit'] text-lg font-bold text-slate-900 mb-2">Jeu 3 : Duel Ortho'Express</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Traquez les 5 fautes cachées dans un rapport d'étudiant en moins de 90 secondes avant de valider votre note.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Relecture sélective</span>
                  <button 
                    onClick={() => {
                      sounds.playPop();
                      alert("Le Duel Ortho est prêt à être étendu avec vos banques de textes personnalisées !");
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition"
                  >
                    Prévisualiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATELIER CO-CREATION */}
      {activeTab === 'creator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
              Espace Concepteur Pédagogique
            </span>
            <h3 className="font-['Outfit'] text-2xl font-black text-slate-900 mt-2">
              Co-création d'Exercices et de Jeux avec l'Équipe AgentCorp
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Cette interface est prête à intégrer vos futures spécifications pédagogiques. 
              Vous pourrez ajouter de nouvelles consignes d'examens, paramétrer des barèmes d'évaluation et configurer les règles des mini-jeux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="font-['Outfit'] font-bold text-slate-900 text-base mb-1.5">🔗 Synchronisation avec Moodle HECh</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Toutes les modifications ou nouveaux exercices ajoutés pourront être exportés au format Moodle XML ou GIFT pour être réinjectés directement dans le cours officiel 685.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100">
              <h4 className="font-['Outfit'] font-bold text-slate-900 text-base mb-1.5">🤖 Intégration Modèles Locaux (Ollama)</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Conforme aux règles de mobilisation des modèles : utilisation prioritaire de Qwen Coder / Gemma local pour générer les feedbacks et variantes d'exercices à coût zéro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
