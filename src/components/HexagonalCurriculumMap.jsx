import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  BrainCircuit, 
  Compass, 
  Sliders,
  ExternalLink
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function HexagonalCurriculumMap({ onNavigateToTile }) {
  const [selectedHex, setSelectedHex] = useState('langage'); // 'langage' | 'methodologie' | etc.

  const HEX_DATA = {
    // PÔLE LANGAGE (ORANGE)
    langage: {
      id: 'langage',
      category: 'langage',
      title: "LE LANGAGE & PROCESSUS DE RÉPONSE",
      pole: "PÔLE 1 : LINGUISTIQUE & COGNITIF",
      badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      description: "Le socle linguistique indispensable pour déchiffrer les consignes des enseignants et formuler des réponses académiques irréprochables.",
      subItems: [
        "Grammaire & Syntaxe : Construction des propositions logiques",
        "Orthographe : Maîtrise des accords et suppression des fautes éliminatoires",
        "Vocabulaire : Précision lexicale et rigueur conceptuelle",
        "Ponctuation : Rythme de la pensée et clarté de lecture"
      ],
      targetTile: 'tile-lang',
      actionText: "Ouvrir la Partie Langagière (Tuile 2)"
    },
    consignes: {
      id: 'consignes',
      category: 'langage',
      title: "Analyser les Consignes & Vocabulaire d'Évaluation",
      pole: "PÔLE 1 : COMPRÉHENSION DES ÉNONCÉS",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      description: "Déchiffrer le texte, repérer les consignes explicites et implicites, identifier les mots interrogatifs et neutraliser les pièges.",
      subItems: [
        "Repérage des verbes d'action cognitifs (lister, classer, justifier)",
        "Distinction entre sens commun et sens académique strict",
        "Souligner l'explicite pour ne rien oublier du barème",
        "Anticiper les doubles consignes masquées"
      ],
      targetTile: 'tile-lang',
      actionText: "Pratiquer le décodage des consignes"
    },
    processus: {
      id: 'processus',
      category: 'langage',
      title: "Processus de Réponse & Mots Justes",
      pole: "PÔLE 1 : STRUCTURATION ÉCRITE",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-500/30",
      description: "Les 4 temps pour formuler une réponse alignée sur le gabarit attendu par le correcteur universitaire.",
      subItems: [
        "Reprendre les termes de la question en phrase d'amorce",
        "Sélectionner les connecteurs logiques de démonstration",
        "Apporter la preuve empirique ou l'illustration concrète",
        "Adapter sa réponse selon le format (QCM, QRO, Vrai/Faux)"
      ],
      targetTile: 'tile-lang',
      actionText: "Consulter les gabarits de rédaction"
    },
    diagnostic: {
      id: 'diagnostic',
      category: 'langage',
      title: "Évaluation Diagnostique Initiale",
      pole: "PÔLE 1 & 2 : POSITIONNEMENT",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      description: "Bilan initial pour évaluer son niveau d'entrée sur les consignes, la langue et les méthodes d'étude.",
      subItems: [
        "Repérer ses points forts et ses zones de fragilité",
        "Orienter ses révisions vers les modules prioritaires",
        "Se familiariser avec les exigences du supérieur"
      ],
      targetTile: 'tile-lang',
      actionText: "Passer le diagnostic initial"
    },

    // PÔLE MÉTHODOLOGIE (BLEU)
    methodologie: {
      id: 'methodologie',
      category: 'methodo',
      title: "LA MÉTHODOLOGIE & STRATÉGIES D'APPRENTISSAGE",
      pole: "PÔLE 2 : STRATÉGIE & EFFICACITÉ",
      badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
      description: "L'art d'apprendre efficacement fondé sur les neurosciences cognitives, l'organisation temporelle et la priorisation.",
      subItems: [
        "Trier les informations essentielles vs accessoires",
        "Mémoriser durablement : interruption de la courbe d'oubli",
        "Planifier son travail et prioriser les urgences",
        "Mobiliser les outils de gestion de productivité"
      ],
      targetTile: 'tile-methodo',
      actionText: "Ouvrir la Méthodologie Active (Tuile 4)"
    },
    outils_gestion: {
      id: 'outils_gestion',
      category: 'methodo',
      title: "Outils de Gestion du Temps (4 Piliers)",
      pole: "PÔLE 2 : OUTILS OPÉRATIONNELS",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "Les 4 méthodes éprouvées pour vaincre la procrastination et maîtriser son calendrier de blocus.",
      subItems: [
        "Matrice d'Eisenhower : Distinguer Urgent et Important",
        "Technique Pomodoro : Sessions de 25 min de focus intense",
        "Loi de Parkinson : Définir des micro-deadlines strictes",
        "Loi de Pareto (80/20) : Isoler les 20% de notions maîtresses"
      ],
      targetTile: 'tile-methodo',
      actionText: "Utiliser la suite des 4 outils de gestion"
    },
    types_eval: {
      id: 'types_eval',
      category: 'methodo',
      title: "Types de Questions & Réponses (QCM, SGI, Vrai/Faux, QRO)",
      pole: "PÔLE 2 : STRATÉGIE D'EXAMEN",
      badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      description: "Comprendre la grammaire des épreuves du supérieur et adapter sa stratégie de résolution à chaque format.",
      subItems: [
        "QCM : Élimination logique et gestion des points négatifs",
        "SGI : Résolution de cas pratique et intégration pluridisciplinaire",
        "Vrai / Faux : Détection des modalisateurs et justification du faux",
        "QRO : Réponse ouverte structurée et verbes d'action cognitifs"
      ],
      targetTile: 'tile-methodo',
      actionText: "Consulter le guide des formats d'évaluation"
    }
  };

  const current = HEX_DATA[selectedHex] || HEX_DATA.langage;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
      {/* Header Cartographie */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-sky-500 text-slate-950 shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
              RÉFÉRENTIEL PÉDAGOGIQUE OFFICIEL · SAR HECh
            </span>
            <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-white">
              Cartographie Conceptuelle : Le Langage & La Méthodologie
            </h3>
          </div>
        </div>
        <span className="text-xs text-slate-400 hidden lg:inline">
          Cliquez sur un pôle ci-dessous pour explorer ses ramifications
        </span>
      </div>

      {/* REPRÉSENTATION VISUELLE EN BLOCS HEXAGONAUX / CARTES CONNECTÉES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PÔLE GAUCHE : LE LANGAGE (ORANGE / CORAIL) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-950/40 via-slate-950 to-slate-900 border-2 border-orange-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              PÔLE 1 · LE LANGAGE
            </span>
            <span className="text-xs text-orange-300 font-mono">Processus de Réponse</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => { sounds.playPop(); setSelectedHex('langage'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                selectedHex === 'langage'
                  ? 'bg-orange-500 text-slate-950 font-black border-orange-300 shadow-lg shadow-orange-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-orange-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Les Fondations</span>
              <span className="text-sm font-bold block mt-0.5">Grammaire, Vocabulaire, Orthographe & Ponctuation</span>
            </button>

            <button
              onClick={() => { sounds.playPop(); setSelectedHex('consignes'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                selectedHex === 'consignes'
                  ? 'bg-orange-500 text-slate-950 font-black border-orange-300 shadow-lg shadow-orange-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-orange-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Compréhension</span>
              <span className="text-sm font-bold block mt-0.5">Analyser les Consignes & Vocabulaire d'Évaluation</span>
            </button>

            <button
              onClick={() => { sounds.playPop(); setSelectedHex('processus'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                selectedHex === 'processus'
                  ? 'bg-orange-500 text-slate-950 font-black border-orange-300 shadow-lg shadow-orange-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-orange-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Rédaction</span>
              <span className="text-sm font-bold block mt-0.5">Les Mots Justes & Adapter sa Réponse</span>
            </button>

            <button
              onClick={() => { sounds.playPop(); setSelectedHex('diagnostic'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                selectedHex === 'diagnostic'
                  ? 'bg-orange-500 text-slate-950 font-black border-orange-300 shadow-lg shadow-orange-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-orange-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Positionnement</span>
              <span className="text-sm font-bold block mt-0.5">Évaluation Diagnostique Initiale</span>
            </button>
          </div>
        </div>

        {/* PÔLE DROIT : LA MÉTHODOLOGIE (BLEU / SLATE) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-900 border-2 border-blue-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PÔLE 2 · LA MÉTHODOLOGIE
            </span>
            <span className="text-xs text-blue-300 font-mono">Stratégies d'Apprentissage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => { sounds.playPop(); setSelectedHex('methodologie'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                selectedHex === 'methodologie'
                  ? 'bg-blue-500 text-slate-950 font-black border-blue-300 shadow-lg shadow-blue-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-blue-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Apprendre</span>
              <span className="text-sm font-bold block mt-0.5">Trier l'Essentiel & Mémoriser Efficacement</span>
            </button>

            <button
              onClick={() => { sounds.playPop(); setSelectedHex('outils_gestion'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                selectedHex === 'outils_gestion'
                  ? 'bg-blue-500 text-slate-950 font-black border-blue-300 shadow-lg shadow-blue-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-blue-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Planifier</span>
              <span className="text-sm font-bold block mt-0.5">4 Outils : Eisenhower, Pomodoro, Parkinson, Pareto</span>
            </button>

            <button
              onClick={() => { sounds.playPop(); setSelectedHex('types_eval'); }}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer border col-span-1 sm:col-span-2 ${
                selectedHex === 'types_eval'
                  ? 'bg-blue-500 text-slate-950 font-black border-blue-300 shadow-lg shadow-blue-500/30 scale-102'
                  : 'bg-slate-950/70 border-slate-800 hover:border-blue-500/50 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono uppercase block opacity-80">Formats d'Évaluation</span>
              <span className="text-sm font-bold block mt-0.5">Types de Questions & Réponses : QCM, SGI, Vrai/Faux, QRO & Verbes d'Action</span>
            </button>
          </div>
        </div>

      </div>

      {/* PANNEAU D'EXPLICATION DÉTAILLÉ DU NŒUD SÉLECTIONNÉ */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${current.badgeColor}`}>
              {current.pole}
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white mt-1">
              {current.title}
            </h4>
          </div>

          {onNavigateToTile && (
            <button
              onClick={() => {
                sounds.playPop();
                onNavigateToTile(current.targetTile);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {current.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {current.subItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-200 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
