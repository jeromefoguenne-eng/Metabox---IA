import React, { useState } from 'react';
import { 
  CheckSquare, 
  HelpCircle, 
  FileText, 
  Layers, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Zap,
  Info
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function EvaluationTypesGuide() {
  const [selectedType, setSelectedType] = useState('qcm');

  const TYPES = {
    qcm: {
      id: 'qcm',
      title: "1. Le QCM (Questionnaire à Choix Multiples)",
      badge: "Format Rapide & Standardisé",
      color: "from-blue-500 to-indigo-600",
      border: "border-blue-500/40",
      description: "Une question ou une amorce suivie de 3 à 5 propositions dont une seule (ou plusieurs) est exacte.",
      rules: [
        "Repérez si l'épreuve applique un barème négatif (points de pénalité pour mauvaise réponse) ou du standard 0/1.",
        "Procédez toujours par élimination logique des réponses absurdes ou contradictoires en premier.",
        "Méfiez-vous des mots extrêmes : 'toujours', 'jamais', 'exclusivement', 'en aucun cas' (souvent faux).",
        "Privilégiez les formulations nuancées : 'généralement', 'peut être', 'sous certaines conditions'."
      ],
      piege: "La réponse 'séduisante' : une option qui contient des termes scientifiques exacts mais qui ne répond pas directement à la question posée.",
      conseil: "Si le QCM est sans point négatif, ne laissez JAMAIS une case vide. Si points négatifs, abstenez-vous si le doute persiste entre 3 options."
    },
    sgi: {
      id: 'sgi',
      title: "2. La SGI (Situation-Guide d'Intégration)",
      badge: "Cas Pratique Réel & Complexe",
      color: "from-purple-500 to-violet-600",
      border: "border-purple-500/40",
      description: "Mise en situation authentique (dossier patient, cas d'entreprise, audit comptable) exigeant de combiner plusieurs matières pour résoudre un problème.",
      rules: [
        "Lisez d'abord les questions finales AVANT de vous perdre dans le pavé documentaire.",
        "Surlignez uniquement les données discriminantes (chiffres, symptômes, dates, contraintes légales).",
        "Ne récitez pas tout votre cours : appliquez uniquement la règle qui s'adapte au cas précis.",
        "Justifiez chaque choix par la preuve extraite de l'énoncé ('D'après le bilan page 2...')."
      ],
      piege: "L'effet 'catalogue' : déverser toutes ses connaissances théoriques sans faire le lien direct avec les données du cas.",
      conseil: "Structurez votre analyse : 1. Constat du cas / 2. Règle académique applicable / 3. Préconisation concrète pour la situation."
    },
    vraifaux: {
      id: 'vraifaux',
      title: "3. Le Vrai / Faux (avec Justification)",
      badge: "Rigueur Binaire & Argumentation",
      color: "from-amber-500 to-orange-600",
      border: "border-amber-500/40",
      description: "Une affirmation dont la véracité doit être jugée. À la HECh, une réponse 'Faux' exige presque toujours la correction de l'élément erroné.",
      rules: [
        "Si UN SEUL mot ou détail de la phrase est faux, l'intégralité de l'affirmation est FAUSSE.",
        "Lorsque vous cochez 'Faux', réécrivez la phrase exacte ou indiquez précisément pourquoi elle est erronée.",
        "Repérez les pièges d'inversion causale : le prof inverse souvent la cause et la conséquence dans l'énoncé."
      ],
      piege: "Mettre 'Faux' sans justifier : vous perdez la totalité des points de la question dans les grilles HECh.",
      conseil: "Pour transformer un faux en vrai lors de votre justification, remplacez le terme erroné par le concept exact en le soulignant."
    },
    qro: {
      id: 'qro',
      title: "4. La QRO (Question à Réponse Ouverte)",
      badge: "Rédaction & Esprit Critique",
      color: "from-emerald-500 to-teal-600",
      border: "border-emerald-500/40",
      description: "Question exigeant une formulation autonome (de quelques lignes à une page complète).",
      rules: [
        "Décodez immédiatement le verbe d'action : 'Définir' ≠ 'Illustrer' ≠ 'Discuter' ≠ 'Justifier'.",
        "Amorcez votre réponse en reprenant les mots exacts de la question pour guider l'œil du correcteur.",
        "Appliquez la règle d'or : 1 paragraphe = 1 idée principale + 1 connecteur logique + 1 exemple/preuve.",
        "Soignez impérativement l'orthographe et la ponctuation (seuil éliminatoire possible)."
      ],
      piege: "Le syndrome de la page blanche ou la digression : tourner autour du pot sans jamais donner la réponse directe.",
      conseil: "Faites un brouillon télégraphique de 2 minutes : listez les 3 mots-clés obligatoires avant de rédiger vos phrases."
    }
  };

  const current = TYPES[selectedType];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
            LA MÉTHODOLOGIE · TYPES DE QUESTIONS ET RÉPONSES
          </span>
          <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-white mt-1">
            Les 4 Grands Formats d'Évaluation dans le Supérieur
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            QCM, SGI, Vrai/Faux, QRO : chaque format possède son propre code de décodage et ses pièges spécifiques.
          </p>
        </div>
      </div>

      {/* Sélecteur des 4 types */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {Object.values(TYPES).map(t => (
          <button
            key={t.id}
            onClick={() => {
              sounds.playPop();
              setSelectedType(t.id);
            }}
            className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
              selectedType === t.id
                ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-950/40'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase block">
              {t.badge}
            </span>
            <span className="text-sm font-black text-white block mt-1">
              {t.title.split('(')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Fiche détaillée du format choisi */}
      <div className={`p-6 rounded-3xl bg-slate-950 border ${current.border} space-y-5 animate-in zoom-in-95 duration-200`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-lg sm:text-xl font-black text-white">
            {current.title}
          </h4>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
            {current.badge}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {current.description}
        </p>

        {/* Règles clés pour réussir ce format */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black uppercase text-cyan-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Méthodologie Stratégique pour ce Format :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {current.rules.map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Piège & Conseil Expert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <span className="text-xs font-black uppercase text-rose-400 flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-4 h-4" />
              Le Piège Classique :
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{current.piege}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
            <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4" />
              L'Astuce du Correcteur SAR :
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{current.conseil}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
