import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Gavel, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  UserCheck,
  Flame,
  FileCheck,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Courtroom3DCanvas from './Courtroom3DCanvas';
import CourtroomForensicTools from './CourtroomForensicTools';
import { sounds } from '../utils/soundEffects';

/**
 * GameTribunal3D:
 * Véritable jeu vidéo en 3D temps réel : « Procès 2030 : L'IA à la Barre ».
 * 
 * Intègre :
 * - Scène 3D Three.js avec Juge, Témoin à la barre, Avocats, Marteau animé et caméra TV
 * - Manipulations médico-légales réelles (Time-scrubber, Loupe UV, Spectrogramme, Test A/B)
 * - Déposition orale avec voix neurales humaines
 * - Mécanique spectaculaire « OBJECTION ! » avec stress réactif du témoin
 * - Délibération et verdict sanctionné par le marteau de justice
 * - 3 Affaires complètes (Julien, Léo, AlgoRH TechCorp)
 */
export default function GameTribunal3D({ onComplete }) {
  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const [trialStage, setTrialStage] = useState('statement'); // 'statement' | 'forensics' | 'objection' | 'verdict' | 'closed'
  const [cameraView, setCameraView] = useState('TV_WIDE');
  
  // États 3D
  const [witnessState, setWitnessState] = useState('speaking'); // 'idle' | 'speaking' | 'stressed' | 'broken'
  const [judgeState, setJudgeState] = useState('idle'); // 'idle' | 'speaking' | 'gavel'
  
  // Preuves débloquées via les outils d'enquête numérique
  const [unlockedEvidences, setUnlockedEvidences] = useState([]);
  const [objectionTriggered, setObjectionTriggered] = useState(false);
  const [selectedVerdict, setSelectedVerdict] = useState(null);
  const [casesSolved, setCasesSolved] = useState([false, false, false]);

  const CASES = [
    {
      id: 'case_1',
      number: 'Affaire 1/3',
      title: 'Plagiat vs Copilotage Académique',
      defendant: 'Julien (Étudiant Bac 2 Gestion)',
      witnessName: 'Julien (Prévenu)',
      witnessRole: 'Étudiant en détresse de blocus',
      charge: 'Délégation cognitive intégrale & Substitution par IA générative sans appropriation.',
      statementVoice: 'tribunal_julien_statement',
      objectionVoice: 'tribunal_julien_objection_reaction',
      verdictVoice: 'tribunal_judge_verdict_1',
      statementText: "« Monsieur le Juge, je le jure sur l'honneur, je n'ai rien fait de mal ! J'ai simplement utilisé un assistant d'écriture pour corriger quelques fautes de style et lisser mes phrases. Toutes les analyses financières sont les miennes ! »",
      requiredEvidences: ['ev_burst', 'ev_hidden_prompt'],
      objectionDialog: "Julien prétend avoir rédigé son mémoire pendant 3 semaines. Confrontons-le aux traces numériques irréfutables !",
      witnessConfession: "« Attendez... Mais comment avez-vous eu accès à l'historique de frappe ? Je... d'accord ! C'est vrai, j'ai collé le chapitre d'un coup à quatre heures du matin parce que je n'y arrivais plus ! »",
      verdictChoices: [
        {
          id: 'v_laxiste',
          label: 'Acquittement Total',
          desc: 'Considérer que l IA est un outil de son temps et valider le mémoire sans réserve.',
          isCorrect: false,
          feedback: 'Refusé par la Cour ! Valider un mémoire non compris détruit la valeur du diplôme et les Acquis d Apprentissage.'
        },
        {
          id: 'v_juste',
          label: 'Sanction Pédagogique & Réévaluation',
          desc: 'Annulation du travail (0/20) pour délégation cognitive, avec obligation de réévaluation orale en autonomie et module d intégrité.',
          isCorrect: true,
          feedback: 'Verdict Parfait ! Le Tribunal distingue le copilotage transparent de la substitution frauduleuse.'
        }
      ]
    },
    {
      id: 'case_2',
      number: 'Affaire 2/3',
      title: 'Deepfake Vocal & Calomnie Électorale',
      defendant: 'Léo (Responsable com de liste adverse)',
      witnessName: 'Léo (Suspect à la barre)',
      witnessRole: 'Technicien de campagne',
      charge: 'Falsification vocale et manipulation déloyale du scrutin étudiant du campus.',
      statementVoice: 'tribunal_leo_statement',
      objectionVoice: 'tribunal_leo_objection_reaction',
      verdictVoice: 'tribunal_judge_verdict_2',
      statementText: "« Cette plainte est ridicule. Ce fichier audio a été envoyé sur un canal public par un lanceur d'alerte. On y entend clairement la candidate proposer des faveurs en échange de votes. Sa voix est parfaitement reconnaissable ! »",
      requiredEvidences: ['ev_vocoder_glitch'],
      objectionDialog: "Léo prétend qu'il s'agit d'un enregistrement pris sur le vif. Montrons-lui la signature synthétique du vocodeur !",
      witnessConfession: "« Le spectrogramme ? Quel filtre passe-bande ? Non mais écoutez, je ne suis pas un ingénieur du son, on m'a juste demandé de... Bon sang, oui, on a cloné sa voix avec un modèle de synthèse pour gagner l'élection ! »",
      verdictChoices: [
        {
          id: 'v_severe',
          label: 'Radiation Électorale & Saisine Disciplinaire',
          desc: 'Radiation de la liste adverse, rétablissement solennel de la candidate Sarah et transmission au conseil de discipline pour cyber-harcèlement.',
          isCorrect: true,
          feedback: 'Décision exemplaire ! La manipulation par deepfake vocal relève de l atteinte délibérée à l intégrité démocratique.'
        },
        {
          id: 'v_canular',
          label: 'Simple Rappel à l Ordre',
          desc: 'Qualifier l acte de blague potache sans sanction administrative.',
          isCorrect: false,
          feedback: 'Objection ! Un deepfake diffamatoire en période électorale n est pas un canular, mais une cyber-infraction.'
        }
      ]
    },
    {
      id: 'case_3',
      number: 'Affaire 3/3',
      title: 'Algorithme RH TechCorp (Biais & AI Act)',
      defendant: 'TechCorp International (M. Vandamme, DRH)',
      witnessName: 'M. Vandamme (Directeur RH)',
      witnessRole: 'Représentant de l employeur',
      charge: 'Discrimination territoriale systémique et non-conformité à l EU AI Act (Système RH à haut risque).',
      statementVoice: 'tribunal_drh_statement',
      objectionVoice: 'tribunal_drh_objection_reaction',
      verdictVoice: 'tribunal_judge_verdict_3',
      statementText: "« Notre algorithme Orion Recrutement est le fleuron de l'objectivité. Il traite des milliers de CV sans aucune considération d'origine ou de genre. Les candidats écartés manquaient simplement des métriques d'optimisation requises. »",
      requiredEvidences: ['ev_proxy_code'],
      objectionDialog: "Le DRH jure que le système est neutre. Prouvons la discrimination indirecte par variable proxy !",
      witnessConfession: "« Une variable proxy sur les codes postaux ? Mais... ce n'était qu'un facteur logistique d'empreinte carbone pour privilégier les candidats habitant près de nos bureaux ! Nous ne pensions pas que cela violerait l'article dix de l'AI Act... »",
      verdictChoices: [
        {
          id: 'v_ia_act',
          label: 'Injonction de Suspension & Audit d Équité Obligatoire',
          desc: 'Suspension de l algorithme Orion sous l EU AI Act, réexamen manuel de toutes les candidatures liégeoises et amende pour absence de contrôle humain.',
          isCorrect: true,
          feedback: 'Victoire du Droit ! L EU AI Act classe le recrutement parmi les domaines à haut risque nécessitant zéro biais territorial.'
        },
        {
          id: 'v_laisser_faire',
          label: 'Autorisation avec Recommandations',
          desc: 'Laisser l entreprise utiliser son outil librement car le code source est propriétaire.',
          isCorrect: false,
          feedback: 'Violation flagrante ! La souveraineté de l AI Act interdit l opacité sur les décisions impactant l accès à l emploi.'
        }
      ]
    }
  ];

  const currentCase = CASES[currentCaseIdx];

  // Lancement de la voix au changement d'étape
  useEffect(() => {
    if (trialStage === 'statement') {
      setWitnessState('speaking');
      setCameraView('WITNESS');
      sounds.playAudioFile(`/audio/voices/${currentCase.statementVoice}.mp3`, 1.0);
    }
  }, [currentCaseIdx, trialStage]);

  // Déblocage d'indice depuis les outils d'expertise numérique
  const handleEvidenceUnlocked = (ev) => {
    if (!unlockedEvidences.some(e => e.id === ev.id)) {
      setUnlockedEvidences(prev => [...prev, ev]);
    }
  };

  // Passage à la phase d'objection
  const handleStartCrossExam = () => {
    setTrialStage('objection');
    setCameraView('WITNESS');
    setWitnessState('speaking');
    sounds.playTensionHeartbeat();
  };

  // Déclenchement de l'OBJECTION !
  const handleTriggerObjection = () => {
    sounds.playObjectionImpact();
    setObjectionTriggered(true);
    setWitnessState('stressed');
    setCameraView('JUDGE');

    setTimeout(() => {
      setCameraView('WITNESS');
      setWitnessState('broken');
      sounds.playAudioFile(`/audio/voices/${currentCase.objectionVoice}.mp3`, 1.0);
    }, 1200);
  };

  // Rendu du Verdict & Frappe du Marteau
  const handleConfirmVerdict = (choice) => {
    setSelectedVerdict(choice);
    if (choice.isCorrect) {
      setJudgeState('gavel');
      setCameraView('JUDGE');
      setTimeout(() => {
        sounds.playAudioFile(`/audio/voices/${currentCase.verdictVoice}.mp3`, 1.0);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setCasesSolved(prev => {
          const next = [...prev];
          next[currentCaseIdx] = true;
          return next;
        });
        setTrialStage('closed');
      }, 1400);
    } else {
      sounds.playWrong();
    }
  };

  // Passer à l'affaire suivante ou clôturer le jeu 3D
  const handleNextCase = () => {
    if (currentCaseIdx < CASES.length - 1) {
      setCurrentCaseIdx(prev => prev + 1);
      setTrialStage('statement');
      setUnlockedEvidences([]);
      setObjectionTriggered(false);
      setSelectedVerdict(null);
      setJudgeState('idle');
      setWitnessState('speaking');
      setCameraView('TV_WIDE');
    } else {
      // Les 3 affaires sont terminées avec succès !
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      sounds.playVictory();
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 font-['Lexend'] animate-in fade-in">
      {/* Barre de Statut du Tribunal */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                {currentCase.number}
              </span>
              <h2 className="font-['Outfit'] font-black text-sm sm:text-base text-white">
                {currentCase.title}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400">
              Prévenu : <span className="text-cyan-300 font-semibold">{currentCase.defendant}</span>
            </p>
          </div>
        </div>

        {/* Étapes du Procès */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded-xl transition ${
            trialStage === 'statement' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-500'
          }`}>
            1. Déposition
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded-xl transition ${
            trialStage === 'forensics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-500'
          }`}>
            2. Enquête Numérique
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded-xl transition ${
            trialStage === 'objection' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-500'
          }`}>
            3. Objection !
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded-xl transition ${
            trialStage === 'verdict' || trialStage === 'closed' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-500'
          }`}>
            4. Verdict ⚖️
          </span>
        </div>
      </div>

      {/* Zone Centrale : Rendu 3D Three.js + Panneau d'Action Interactif */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[460px]">
        {/* Scène 3D Three.js (7 colonnes sur desktop) */}
        <div className="lg:col-span-7 h-[340px] sm:h-[420px] lg:h-full relative rounded-3xl overflow-hidden">
          <Courtroom3DCanvas
            currentCaseIdx={currentCaseIdx}
            witnessState={witnessState}
            judgeState={judgeState}
            cameraView={cameraView}
            onCameraChange={(view) => setCameraView(view)}
            onGavelComplete={() => setJudgeState('idle')}
          />

          {/* Flash rouge dramatique d'Objection */}
          {objectionTriggered && trialStage === 'objection' && (
            <div className="absolute inset-0 pointer-events-none border-4 border-rose-500 animate-pulse bg-rose-500/10 z-30" />
          )}
        </div>

        {/* Panneau de Pilotage Judiciaire & Expertise Numérique (5 colonnes) */}
        <div className="lg:col-span-5 flex flex-col gap-3 h-full overflow-y-auto pr-1">
          {/* =============================================================
              ÉTAPE 1 : DÉPOSITION DU TÉMOIN
          ============================================================= */}
          {trialStage === 'statement' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Déposition à la Barre
                  </span>
                  <button
                    onClick={() => sounds.playAudioFile(`/audio/voices/${currentCase.statementVoice}.mp3`, 1.0)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Réécouter la voix"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs sm:text-sm font-serif italic leading-relaxed">
                  {currentCase.statementText}
                </div>

                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-1">Chef d'accusation de l'Auditeur :</span>
                  {currentCase.charge}
                </div>
              </div>

              <button
                onClick={() => {
                  setTrialStage('forensics');
                  setCameraView('TV_WIDE');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Ouvrir le Laboratoire d'Expertise Numérique →
              </button>
            </div>
          )}

          {/* =============================================================
              ÉTAPE 2 : RECHERCHE DE PREUVES NUMÉRIQUES
          ============================================================= */}
          {trialStage === 'forensics' && (
            <div className="flex flex-col gap-3 h-full animate-in fade-in">
              <CourtroomForensicTools
                caseId={currentCase.id}
                onEvidenceUnlocked={handleEvidenceUnlocked}
                unlockedEvidences={unlockedEvidences}
              />

              {unlockedEvidences.length > 0 && (
                <button
                  onClick={handleStartCrossExam}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-rose-500/30 animate-bounce"
                >
                  <Flame className="w-4 h-4" /> Passer au Contre-Interrogatoire !
                </button>
              )}
            </div>
          )}

          {/* =============================================================
              ÉTAPE 3 : CONTRE-INTERROGATOIRE & OBJECTION !
          ============================================================= */}
          {trialStage === 'objection' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                    Contre-Interrogatoire en Direct
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Niveau de stress témoin : {objectionTriggered ? '100% ⚠️' : '25%'}
                  </span>
                </div>

                {!objectionTriggered ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentCase.objectionDialog}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] font-mono text-cyan-300 font-bold block mb-1">
                        Preuves matérielles à présenter :
                      </span>
                      {unlockedEvidences.map(ev => (
                        <div key={ev.id} className="text-xs text-slate-300 py-1 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>{ev.label}</strong> : {ev.desc}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleTriggerObjection}
                      className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm font-['Outfit'] tracking-widest uppercase transition transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-rose-600/40 cursor-pointer flex items-center justify-center gap-2"
                    >
                      💥 OBJECTION !
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/80 text-rose-200 text-xs sm:text-sm font-serif italic leading-relaxed">
                      {currentCase.witnessConfession}
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Le témoin a craqué ! La vérité est établie pour la cour.</span>
                    </div>

                    <button
                      onClick={() => {
                        setTrialStage('verdict');
                        setCameraView('JUDGE');
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Gavel className="w-4 h-4" /> Passer au Verdict du Juge →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================
              ÉTAPE 4 : DÉLIBÉRATION & VERDICT DU JUGE
          ============================================================= */}
          {(trialStage === 'verdict' || trialStage === 'closed') && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between h-full gap-3 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Gavel className="w-4 h-4" /> Délibération Magistrale
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Règlement RGEE & AI Act
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  En tant que tribunal collégial, choisissez la décision juridique et pédagogique équitable :
                </p>

                <div className="space-y-2.5">
                  {currentCase.verdictChoices.map(choice => (
                    <div
                      key={choice.id}
                      onClick={() => trialStage === 'verdict' && handleConfirmVerdict(choice)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                        selectedVerdict?.id === choice.id
                          ? choice.isCorrect 
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs mb-1">
                        <span>{choice.label}</span>
                        {selectedVerdict?.id === choice.id && (
                          choice.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <p className="text-[11px] opacity-80 font-sans leading-relaxed">
                        {choice.desc}
                      </p>
                      {selectedVerdict?.id === choice.id && (
                        <p className="mt-2 text-[11px] font-mono font-bold text-amber-300 border-t border-slate-700/50 pt-1.5">
                          {choice.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {trialStage === 'closed' && (
                <button
                  onClick={handleNextCase}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {currentCaseIdx < CASES.length - 1 ? (
                    <>Affaire Suivante <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>✨ Clôturer le Tribunal & Récupérer la Clé Beta</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
