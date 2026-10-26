import React, { useState } from 'react';
import { 
  Scale, 
  Gavel, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameTribunal2030:
 * Jeu de rôle / Enquête interactive type Ace Attorney (« Procès 2030 : L'IA à la Barre »).
 * 3 grandes affaires :
 * 1. Plagiat vs Copilotage
 * 2. Deepfake & Propagande électorale
 * 3. Recrutement biaisé & Emploi
 */
export default function GameTribunal2030({ onComplete }) {
  const [currentAffaireIdx, setCurrentAffaireIdx] = useState(0);
  const [currentRole, setCurrentRole] = useState('defense'); // 'defense' | 'prosecution' | 'expert'
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [verdictRendered, setVerdictRendered] = useState(false);
  const [caseSolved, setCaseSolved] = useState([false, false, false]);

  const AFFAIRES = [
    {
      id: "aff-1",
      number: "Affaire 1/3",
      title: "Plagiat vs Copilotage Académique",
      defendant: "Étudiant Julien (Bac 2 Gestion)",
      accusation: "Fraude caractérisée par délégation totale à une IA générative sans compréhension personnelle.",
      context: "Julien a rendu une analyse financière impeccable en 15 pages. À l'oral, il est incapable de calculer ni d'expliquer l'indicateur central (EBITDA) qu'il a inséré.",
      evidences: [
        { id: 'ev1', label: "Rapport de Perplexité Linéaire", desc: "Score de perplexité plat à 100%, caractéristique d'un prompt brut sans relecture humaine.", isKey: true },
        { id: 'ev2', label: "Notes de cours manuscrites", desc: "Cahier de TP contenant des schémas rédigés de sa main avant la session.", isKey: false },
        { id: 'ev3', label: "Grille Critériée RGEE HECh", desc: "Le Règlement sanctionne la non-maîtrise des acquis d'apprentissage (AA) visés par l'activité.", isKey: true }
      ],
      pleas: [
        {
          id: 'p1',
          text: "« Plaidoyer : La technologie est un outil de notre siècle, l'étudiant ne doit pas être pénalisé pour sa rapidité. »",
          isCorrect: false,
          feedback: "Objection ! Utiliser un outil sans en comprendre le résultat détruit l'objectif d'apprentissage de l'enseignement supérieur !"
        },
        {
          id: 'p2',
          text: "« Plaidoyer : Condamnation pour délégation cognitive. L'étudiant doit reprendre l'évaluation car la compétence n'est pas acquise. »",
          isCorrect: true,
          feedback: "Exact ! Le jury distingue l'assistance méthodologique légitime (copilote) de la fraude par substitution (délégation cognitive)."
        }
      ]
    },
    {
      id: "aff-2",
      number: "Affaire 2/3",
      title: "Deepfake Vocal & Propagande Électorale",
      defendant: "Collectif Anonyme du Campus",
      accusation: "Diffusion d'une fausse note vocale du Doyen annulant les délibérations de session pour semer la panique.",
      context: "Un fichier audio de 30 secondes a circulé sur les groupes WhatsApp étudiants la veille du jury avec la voix exacte du Doyen.",
      evidences: [
        { id: 'ev4', label: "Spectrogramme des Fréquences Vocales", desc: "Absence totale de bruits de souffle naturels et coupures d'ondes spectrales abruptes propres au clonage vocal.", isKey: true },
        { id: 'ev5', label: "Historique du Serveur Moodle", desc: "Le Doyen était en réunion officielle confirmée à la même heure.", isKey: true }
      ],
      pleas: [
        {
          id: 'p3',
          text: "« Verdict : Attaque informationnelle avérée. Condamnation des auteurs pour falsification numérique et tentative de déstabilisation. »",
          isCorrect: true,
          feedback: "Validé par le Tribunal ! La manipulation par deepfake vocal relève de l'infraction déontologique grave."
        },
        {
          id: 'p4',
          text: "« Verdict : Simple canular d'étudiant sans conséquence, relaxe immédiate. »",
          isCorrect: false,
          feedback: "Objection ! La désinformation institutionnelle menace la sérénité des examens et la valeur des décrets !"
        }
      ]
    },
    {
      id: "aff-3",
      number: "Affaire 3/3",
      title: "Recrutement Biaisé par Algorithme RH",
      defendant: "Cabinet de Recrutement 'Talent-AI Corp'",
      accusation: "Discrimination systémique éliminant automatiquement les candidatures selon leur code postal.",
      context: "L'IA de pré-sélection des stagiaires a rejeté 94% des dossiers provenant de certains quartiers de Liège sans examiner les compétences réelles.",
      evidences: [
        { id: 'ev6', label: "Audit des Données d'Entraînement", desc: "La base historique contenait les préjugés humains des dix dernières années reproduits à l'identique.", isKey: true },
        { id: 'ev7', label: "Règlement Européen AI Act (2024)", desc: "Classe les systèmes d'évaluation RH dans la catégorie 'Haut Risque' soumise à contrôle humain obligatoire.", isKey: true }
      ],
      pleas: [
        {
          id: 'p5',
          text: "« Jugement : Injonction de conformité immédiate sous l'AI Act avec obligation d'audit humain et réexamen des dossiers. »",
          isCorrect: true,
          feedback: "Brillante conclusion ! L'algorithme ne peut jamais se substituer à la justice sociale et à l'examen équitable des mérites."
        },
        {
          id: 'p6',
          text: "« Jugement : L'algorithme étant mathématique, ses choix sont par définition objectifs et indiscutables. »",
          isCorrect: false,
          feedback: "Objection majeure ! Les algorithmes héritent directement des biais des données qu'on leur donne à manger !"
        }
      ]
    }
  ];

  const currentCase = AFFAIRES[currentAffaireIdx];
  const allCasesSolved = caseSolved.every(Boolean);

  const handlePleaSelect = (plea) => {
    if (plea.isCorrect) {
      sounds.playSuccess();
      const updated = [...caseSolved];
      updated[currentAffaireIdx] = true;
      setCaseSolved(updated);
      setVerdictRendered(true);

      if (updated.every(Boolean) && onComplete) {
        setTimeout(onComplete, 2200);
      }
    } else {
      sounds.playBuzzer();
      sounds.playGroan();
      alert(plea.feedback);
    }
  };

  const handleNextCase = () => {
    sounds.playPop();
    setVerdictRendered(false);
    setSelectedEvidence(null);
    setCurrentAffaireIdx(prev => Math.min(AFFAIRES.length - 1, prev + 1));
  };

  return (
    <div className="w-full h-full min-h-[520px] rounded-2xl bg-[#140e24] border-2 border-purple-500/50 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in">
      
      {/* Court Header Bar */}
      <div className="h-12 bg-slate-950 border-b border-purple-900/60 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-400" />
          <h3 className="font-['Outfit'] font-black text-sm text-purple-200 tracking-wide">
            TRIBUNAL DU JURY 2030 : L'IA À LA BARRE
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Dossiers Résolus :</span>
          <strong className="text-amber-400 font-bold">{caseSolved.filter(Boolean).length} / 3 Affaires</strong>
        </div>
      </div>

      {/* Main Courtroom Display */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
        
        {/* Left Column: Dossier d'Instruction & Pièces à Conviction */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                {currentCase.number}
              </span>
              <span className="text-slate-400 font-mono">{currentCase.defendant}</span>
            </div>
            
            <h4 className="font-['Outfit'] font-bold text-base text-white">
              {currentCase.title}
            </h4>
            <p className="text-xs text-purple-200 italic leading-snug">
              Accusation : {currentCase.accusation}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-purple-500/20">
              {currentCase.context}
            </p>
          </div>

          {/* Evidence Cards */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2 uppercase font-mono">
              Pièces à Conviction versées aux débats :
            </span>
            <div className="space-y-2">
              {currentCase.evidences.map((ev) => (
                <div 
                  key={ev.id}
                  onClick={() => { sounds.playPop(); setSelectedEvidence(ev.id); }}
                  className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                    selectedEvidence === ev.id
                      ? 'bg-purple-600/40 border-purple-400 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <strong className="text-purple-300 block mb-0.5">{ev.label}</strong>
                  <span className="text-[11px] text-slate-400">{ev.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Débats Contradictoires & Plaidoiries */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Gavel className="w-4 h-4 text-amber-400" />
              <strong className="text-xs uppercase font-bold text-slate-200">
                Plaidoiries & Délibération du Tribunal
              </strong>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              En tant que magistrat académique, quel verdict juridique et éthique prononcez-vous à la lumière des pièces produites ?
            </p>

            <div className="space-y-3">
              {currentCase.pleas.map((plea) => (
                <button
                  key={plea.id}
                  onClick={() => handlePleaSelect(plea)}
                  className="w-full p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-left text-xs text-slate-200 transition cursor-pointer shadow-md leading-snug hover:scale-[1.01]"
                >
                  {plea.text}
                </button>
              ))}
            </div>
          </div>

          {/* Verdict Status & Next Case */}
          {verdictRendered && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Jugement Validé par la Cour Académique !</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Le précédent jurisprudentiel est consigné dans les archives officielles du campus.
              </p>

              {currentAffaireIdx + 1 < AFFAIRES.length ? (
                <button
                  onClick={handleNextCase}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs uppercase text-slate-950 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Passer à l'Affaire Suivante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-2 rounded bg-emerald-900/60 text-center font-bold font-mono text-emerald-300">
                  🎉 TOUTES LES AFFAIRES RÉSOLUES · CLÉ BETA DÉVERROUILLÉE !
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
