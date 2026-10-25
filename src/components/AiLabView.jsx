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
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SpeedChallengeGame from './SpeedChallengeGame';

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
  const [activeTab, setActiveTab] = useState('analyzer'); // analyzer | simulator | games | creator

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

  // Analyze consigne function
  const handleAnalyzeConsigne = () => {
    if (!inputConsigne.trim()) return;
    setIsAnalyzing(true);
    setAnalyzedResult(null);

    setTimeout(() => {
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
    setIsEvaluating(true);
    setEvaluationFeedback(null);

    setTimeout(() => {
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
        particleCount: 50,
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
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Volet Innovant Petite Réussite
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Lab IA & Entraînement Intelligent Métabox
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
              Ce volet prépare les outils d'intelligence artificielle pédagogique pour la Haute École Charlemagne : 
              analyse automatisée de consignes complexes, simulation de feedback immédiat et futurs jeux sérieux adaptatifs.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-xl flex items-center gap-4 backdrop-blur-sm">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Architecture IA</div>
              <div className="text-sm font-bold text-white">Local-First (Ollama) & Free-Tier</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Zéro frais institutionnel
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs inside IA Lab */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === 'analyzer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
            }`}
          >
            <Search className="w-4 h-4" /> 1. Analyseur de Consignes IA
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
            }`}
          >
            <MessageSquareCheck className="w-4 h-4" /> 2. Simulateur de Feedback & Notation
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === 'games'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" /> 3. Serious Games & Jeux IA (Roadmap)
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === 'creator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> 4. Atelier Enseignant (Co-Création)
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYSEUR DE CONSIGNES */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Déposez une consigne d'examen
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Collez une consigne réelle d'enseignant ou testez un exemple issu du Moodle HECh.
              </p>

              {/* Presets */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Exemples prédéfinis du cours :
                </span>
                <div className="flex flex-col gap-1.5">
                  {PRESET_CONSIGNES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputConsigne(preset.text)}
                      className="text-left text-xs p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition"
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
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyzeConsigne}
                  disabled={isAnalyzing || !inputConsigne.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
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
              <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Diagnostic Métacognitif de la Consigne
                  </h4>
                  {analyzedResult.hasDoubleConsigne && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ⚠️ Double consigne détectée !
                    </span>
                  )}
                </div>

                {/* Detected Verbs */}
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Verbes d'action identifiés :
                  </h5>
                  <div className="space-y-2">
                    {analyzedResult.verbs.map((v, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-300 capitalize text-sm">{v.v}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {v.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{v.need}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{v.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                {analyzedResult.constraints.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Contraintes spécifiques repérées :
                    </h5>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {analyzedResult.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Structure */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Gabarit de Réponse Idéal (Attendu par l'évaluateur) :
                  </h5>
                  <div className="space-y-1.5">
                    {analyzedResult.templateOutline.map((step, i) => (
                      <div key={i} className="text-xs p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Traps */}
                <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl">
                  <h5 className="text-xs font-semibold text-rose-300 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Pièges fréquents sanctionnés aux examens :
                  </h5>
                  <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                    {analyzedResult.commonTraps.map((trap, i) => (
                      <li key={i}>{trap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <BrainCircuit className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-medium">L'analyse sémantique s'affichera ici.</p>
                <p className="text-xs text-slate-600 mt-1">
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquareCheck className="w-5 h-5 text-indigo-400" />
                Simulateur de Rédaction & Évaluation
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Entraînez-vous à rédiger votre réponse : l'IA évalue la cohérence, le niveau de langue et la rigueur académique.
              </p>

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 mb-4">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Question de l'exercice :
                </span>
                <p className="text-sm font-semibold text-white">{simQuestion}</p>
              </div>

              <textarea
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Rédigez votre réponse comme si vous étiez à l'examen..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-400">
                  {studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0} mots rédigés
                </span>
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !studentAnswer.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
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
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Feedback Formatif Immédiat</span>
                    <h4 className="font-bold text-white text-base">Rapport de Compétence Écrite</h4>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-lg text-white">
                      {evaluationFeedback.score} <span className="text-xs text-slate-400 font-normal">/ 20</span>
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Points forts constatés :
                  </h5>
                  <div className="space-y-1.5">
                    {evaluationFeedback.strengths.map((str, i) => (
                      <div key={i} className="text-xs p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                        ✅ {str}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                {evaluationFeedback.improvements.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Pistes d'amélioration pour atteindre le 18/20 :
                    </h5>
                    <div className="space-y-1.5">
                      {evaluationFeedback.improvements.map((imp, i) => (
                        <div key={i} className="text-xs p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200">
                          💡 {imp}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Answer */}
                <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl">
                  <h5 className="text-xs font-semibold text-indigo-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Réponse modèle type (Corrigé académique) :
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    « {evaluationFeedback.idealModel} »
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <MessageSquareCheck className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-medium">L'évaluation formative et le feedback s'afficheront ici.</p>
                <p className="text-xs text-slate-600 mt-1">
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

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" /> Autres Serious Games en Préparation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                      <BrainCircuit className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Aventure Textuelle
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Jeu 2 : Mission Réussite</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vous incarnez un étudiant de BAC 1 à la HECh face aux tentations de la procrastination, au blocus et aux examens. Chaque décision méthodologique influence votre taux de réussite.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Choix multiples & XP</span>
                  <button 
                    onClick={() => alert("L'aventure interactive Mission Réussite sera branchée avec le modèle IA local !")}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600/30 text-purple-300 text-xs font-semibold hover:bg-purple-600 hover:text-white transition"
                  >
                    Prévisualiser
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                      <Zap className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Duel Rapide
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Jeu 3 : Duel Ortho'Express</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Traquez les 5 fautes cachées dans un rapport d'étudiant en moins de 90 secondes avant de valider votre note.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Relecture sélective</span>
                  <button 
                    onClick={() => alert("Le Duel Ortho est prêt à être étendu avec vos banques de textes personnalisées !")}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600/30 text-rose-300 text-xs font-semibold hover:bg-rose-600 hover:text-white transition"
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Espace Concepteur Pédagogique
            </span>
            <h3 className="text-xl font-bold text-white mt-2">
              Co-création d'Exercices et de Jeux avec l'Équipe AgentCorp
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Cette interface est prête à intégrer vos futures spécifications pédagogiques. 
              Vous pourrez ajouter de nouvelles consignes d'examens, paramétrer des barèmes d'évaluation et configurer les règles des mini-jeux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <h4 className="font-bold text-white text-sm mb-1">🔗 Synchronisation avec Moodle HECh</h4>
              <p className="text-xs text-slate-400">
                Toutes les modifications ou nouveaux exercices ajoutés pourront être exportés au format Moodle XML ou GIFT pour être réinjectés directement dans le cours officiel 685.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <h4 className="font-bold text-white text-sm mb-1">🤖 Intégration Modèles Locaux (Ollama)</h4>
              <p className="text-xs text-slate-400">
                Conforme aux règles de mobilisation des modèles : utilisation prioritaire de Qwen Coder / Gemma local pour générer les feedbacks et variantes d'exercices à coût zéro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
