import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  X, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award,
  BookOpen,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-1',
    category: "Analyse de Consigne",
    question: "Dans un examen, la consigne indique : « Relevez et justifiez les deux facteurs d'échec ». De quel type d'exigence s'agit-il ?",
    options: [
      "Une consigne simple : lister les deux facteurs suffit",
      "Une double consigne obligatoire : extraire les éléments PUIS prouver/argumenter le lien causal",
      "Une consigne libre : on peut choisir entre relever ou justifier",
      "Une simple question de cours sans analyse de texte"
    ],
    correctIndex: 1,
    explanation: "Attention aux doubles consignes masquées par la conjonction 'et' : 'Relever' (tâche 1) + 'Justifier' (tâche 2). Oublier l'une des deux entraîne la perte de 50% des points."
  },
  {
    id: 'diag-2',
    category: "Vocabulaire d'Évaluation",
    question: "Quelle est la différence fondamentale entre les verbes « Décrire » et « Expliquer » ?",
    options: [
      "Il n'y a aucune différence, ce sont de parfaits synonymes",
      "« Décrire » consiste à restituer les faits observables ('le comment'), tandis que « Expliquer » analyse les causes profondes et les mécanismes ('le pourquoi')",
      "« Décrire » nécessite de donner son avis personnel, alors que « Expliquer » reste neutre",
      "« Expliquer » est toujours plus court que « Décrire »"
    ],
    correctIndex: 1,
    explanation: "Décrire = constater et détailler l'état des choses. Expliquer = exposer les causes, les relations logiques et les mécanismes sous-jacents."
  },
  {
    id: 'diag-3',
    category: "Processus de Réponse",
    question: "Quelle est la règle d'or pour amorcer une réponse écrite à une question ouverte (QRO) ?",
    options: [
      "Commencer directement par 'Parce que' ou 'Oui/Non'",
      "Reprendre les termes exacts de la question dans la phrase d'amorce pour cadrer le propos",
      "Écrire une introduction générale de 10 lignes sur l'histoire de la matière",
      "Recopier l'intégralité du paragraphe du texte source"
    ],
    correctIndex: 1,
    explanation: "Reprendre l'amorce de la question prouve que vous répondez précisément au sujet posé et aide l'évaluateur à retrouver immédiatement votre fil conducteur."
  },
  {
    id: 'diag-4',
    category: "Orthographe & Rigueur",
    question: "Identifiez la phrase correctement orthographiée selon les normes académiques :",
    options: [
      "Les compétences qu'elle a acquise durant son blocus lui ont permit de réussir.",
      "Les compétences qu'elle a acquises durant son blocus lui ont permis de réussir.",
      "Les compétences qu'elle a acquis durant son blocus lui ont permit de réussir.",
      "Les compétences qu'elle a acquises durant son blocus lui ont transmit la réussite."
    ],
    correctIndex: 1,
    explanation: "'les compétences... acquises' : accord du participe passé avec l'auxiliaire avoir et le COD antéposé ('qu'' mis pour les compétences, fém. pluriel). 'permis' : participe passé invariable sans COD avant."
  },
  {
    id: 'diag-5',
    category: "Stratégie d'Évaluation (QCM)",
    question: "Face à un QCM avec pénalité (points négatifs en cas d'erreur), quelle est la stratégie optimale si vous hésitez entre 2 réponses ?",
    options: [
      "Répondre au hasard systématiquement",
      "Ne jamais répondre, quoi qu'il arrive",
      "Éliminer d'abord les options manifestement fausses, puis calculer l'espérance mathématique : si vous avez éliminé 2 options sur 4, parier devient statistiquement rentable",
      "Toujours choisir la réponse C"
    ],
    correctIndex: 2,
    explanation: "Dans un QCM à 4 choix (-0.33 pt par erreur / +1 pt par bonne réponse), si vous éliminez 2 mauvaises options avec certitude, l'espérance de gain devient positive (+0.33 pt en moyenne)."
  }
];

export default function DiagnosticLangageModal({ isOpen, onClose, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelectedOpt(idx);
    setShowFeedback(true);
    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) sounds.playSuccess();
    else sounds.playBuzzer();
    setAnswers(prev => [...prev, { qId: currentQ.id, isCorrect }]);
  };

  const handleNext = () => {
    sounds.playPop();
    setSelectedOpt(null);
    setShowFeedback(false);
    if (currentIdx + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      sounds.playApplause();
    }
  };

  const score = answers.filter(a => a.isCorrect).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-orange-500/40 rounded-3xl shadow-2xl overflow-hidden font-['Lexend'] text-white">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-orange-400 tracking-wider">
                SAR HECh · ÉVALUATION DIAGNOSTIQUE INITIALE
              </span>
              <h3 className="text-base font-black text-white">
                Bilan de Positionnement (Langage & Méthodologie)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-orange-300 font-bold">
                  {currentQ.category}
                </span>
                <span>Question {currentIdx + 1} / {DIAGNOSTIC_QUESTIONS.length}</span>
              </div>

              <h4 className="text-lg font-black text-white leading-snug">
                {currentQ.question}
              </h4>

              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200";
                  if (showFeedback) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
                    } else if (idx === selectedOpt) {
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-200";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      disabled={showFeedback}
                      onClick={() => handleSelect(idx)}
                      className={`w-full p-3.5 rounded-2xl text-left border text-xs sm:text-sm transition flex items-center gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in zoom-in-95 duration-150">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    💡 <strong className="text-white">Explication SAR :</strong> {currentQ.explanation}
                  </p>
                  <button
                    onClick={handleNext}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{currentIdx + 1 < DIAGNOSTIC_QUESTIONS.length ? 'Question Suivante' : 'Voir mon Bilan Diagnostique'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center text-orange-300 shadow-xl shadow-orange-500/20">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-black uppercase text-orange-400 tracking-wider">
                  RÉSULTAT DU POSITIONNEMENT
                </span>
                <h4 className="text-2xl font-black text-white mt-1">
                  Votre Score : {score} / {DIAGNOSTIC_QUESTIONS.length}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
                  {score >= 4 
                    ? "Excellente maîtrise des codes académiques ! Vous possédez les repères fondamentaux pour aborder les examens avec sérénité."
                    : "Des bases acquises, mais plusieurs automatismes clés (décodage des doubles consignes, rigueur des verbes d'action) méritent d'être consolidés."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-2">
                <span className="font-bold text-white block">Recommandations du SAR :</span>
                <p>• Explorez la <strong>Partie Langagière (Tuile 2)</strong> pour approfondir les 15 verbes d'action cognitifs.</p>
                <p>• Utilisez les <strong>Outils de Gestion (Tuile 4)</strong> pour cadencer vos révisions avec Pomodoro et Pareto.</p>
              </div>

              <button
                onClick={() => {
                  if (onFinish) onFinish(score);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl transition cursor-pointer"
              >
                Valider mon Bilan & Continuer les Quêtes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
