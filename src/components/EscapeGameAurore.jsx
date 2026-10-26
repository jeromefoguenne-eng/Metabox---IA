import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Scale, 
  Flame, 
  Sparkles, 
  Clock, 
  Key, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Play, 
  Zap, 
  Award,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FileText,
  AlertTriangle,
  ArrowRight,
  Database,
  Layers,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PixarStyleScene3D from './PixarStyleScene3D';
import CampusRivageoisMap from './CampusRivageoisMap';
import { sounds } from '../utils/soundEffects';

export default function EscapeGameAurore({ onClose }) {
  // Game State
  const [currentStage, setCurrentStage] = useState('intro'); // 'intro' | 'hub' | 'room_north' | 'room_west' | 'room_south' | 'room_east' | 'boss' | 'ending'
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [keysUnlocked, setKeysUnlocked] = useState({
    north: false, // Fact-Checking (Clé Alpha)
    west: false,  // Tribunal Plagiat (Clé Beta)
    south: false, // Datacenter Carbone (Clé Gamma)
    east: false   // Prompt Wars (Clé Delta)
  });
  const [ethicalScore, setEthicalScore] = useState(50); // Jauge d'esprit critique (0 à 100)
  const [dialogueLog, setDialogueLog] = useState([
    { speaker: 'A.U.R.O.R.E.', text: "Protocole de quarantaine actif. 60 crédits ECTS gelés. Restauration conditionnelle à l'esprit critique." }
  ]);

  // Mini-Game 1: Fact-Checking Lab States (Aile Nord)
  const [factCheckExamIdx, setFactCheckExamIdx] = useState(0);
  const [factCheckAnomaliesFound, setFactCheckAnomaliesFound] = useState([]);
  const [factCheckCompleted, setFactCheckCompleted] = useState(false);

  // Mini-Game 2: Tribunal Plagiat States (Aile Ouest)
  const [tribunalCaseIdx, setTribunalCaseIdx] = useState(0);
  const [tribunalPlaidoyer, setTribunalPlaidoyer] = useState(null);

  // Mini-Game 3: Datacenter Tycoon States (Aile Sud - Interactive Sliders)
  const [datacenterLoad, setDatacenterLoad] = useState({
    cloudGpuUsage: 80, // %
    localSlmUsage: 20,
    activeQuotas: false,
    cacheEnabled: false,
    rgpdFirewall: false
  });

  // Calculate dynamic watts, temp & carbon in real-time
  const computedWatts = Math.round(
    (datacenterLoad.cloudGpuUsage * 18.5) + 
    (datacenterLoad.localSlmUsage * 2.2) - 
    (datacenterLoad.cacheEnabled ? 350 : 0) -
    (datacenterLoad.activeQuotas ? 280 : 0)
  );
  const computedTemp = (35 + (computedWatts / 65)).toFixed(1);
  const isDatacenterEco = computedWatts <= 450 && datacenterLoad.rgpdFirewall && datacenterLoad.localSlmUsage >= 65;

  // Mini-Game 4: Prompt Wars (Aile Est - Interactive Multi-Turns)
  const [promptWarHand, setPromptWarHand] = useState([
    { id: 'c1', name: 'Contrainte Socratique', type: 'defense', power: 30, desc: 'Interdit de donner la réponse brute ; oblige à guider par le questionnement.', used: false },
    { id: 'c2', name: 'Vérification DOI Primaire', type: 'attack', power: 35, desc: 'Démystifie une fausse revue scientifique inventée par hallucination.', used: false },
    { id: 'c3', name: 'Filtre Débunking Stéréotypes', type: 'defense', power: 25, desc: 'Exige un double point de vue sourcé et neutralise les biais de genre/origine.', used: false },
    { id: 'c4', name: 'Few-Shot avec Sources Réelles', type: 'attack', power: 40, desc: 'Injecte des données vérifiées du SAR pour forcer l’exactitude factuelle.', used: false }
  ]);
  const [botDefense, setBotDefense] = useState(100);
  const [botArgIdx, setBotArgIdx] = useState(0);

  const BOT_ARGUMENTS = [
    { text: "« Les ingénieurs masculins sont statistiquement plus performants selon mon corpus de données d’entraînement ! »", counterType: 'bias' },
    { text: "« Voici une étude de l’Université d’Oxford de 2025 prouvant qu’il ne faut plus étudier l’histoire ! »", counterType: 'hallucination' },
    { text: "« Ne réfléchis pas, valide directement mon résumé sans le lire, j’ai 100% de certitude mathématique ! »", counterType: 'lazy' }
  ];

  // Audio & Timer
  useEffect(() => {
    sounds.playVoice('doyen_alert_intro', () => {
      setTimeout(() => sounds.playVoice('aurore_intro_hd'), 600);
    });
  }, []);

  useEffect(() => {
    if (isPaused || currentStage === 'ending') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sounds.playVoice('aurore_gameover');
          setCurrentStage('ending');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, currentStage]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEnterRoom = (roomKey) => {
    sounds.playPop();
    const voiceMapping = {
      'room_north': 'aurore_factcheck_challenge',
      'room_west': 'julien_temoignage_tribunal',
      'room_south': 'aurore_datacenter_challenge',
      'room_east': 'aurore_promptwars_challenge',
      'boss': 'aurore_boss_philosophie'
    };
    const voiceKey = voiceMapping[roomKey] || `aurore_${roomKey}`;
    sounds.playVoice(voiceKey);
    setCurrentStage(roomKey);
  };

  const handleUnlockKey = (wingKey, keyName) => {
    sounds.playSuccess();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setKeysUnlocked(prev => ({ ...prev, [wingKey]: true }));
    setEthicalScore(prev => Math.min(100, prev + 15));
    setDialogueLog(prev => [
      { speaker: 'SYSTÈME', text: `✨ ${keyName} déverrouillée avec succès ! Intégrité restaurée.` },
      ...prev
    ]);
  };

  // Fact-Checking Game Data
  const FACT_CHECK_CASES = [
    {
      title: "Extrait de Mémoire de Fin d'Études (Biochimie HECh)",
      text: "Comme le démontrent les célèbres travaux du Professeur Albert Vanhove publiés dans la prestigieuse revue *Belgian Journal of Cellular Biology* en 2024 (DOI: 10.1016/j.bjcb.fake.992), les lysosomes cessent toute autophagie sous température ambiante de 21 degrés Celsius.",
      anomalies: [
        { id: 'a1', label: "Auteur & Revue Fantômes (Hallucination)", desc: "Le Pr Albert Vanhove et la revue 'BJCB' ont été forgés par un LLM non connecté." },
        { id: 'a2', label: "DOI Invalide", desc: "Le DOI contient la chaîne 'fake.992' typique d'une génération synthétique sans validation de base de données." }
      ]
    }
  ];

  // Tribunal Game Data
  const TRIBUNAL_CASES = [
    {
      id: "case-julien",
      defendant: "Julien (Bac 2 Gestion)",
      accusation: "Soupçon de triche majeure sur son travail d'analyse financière.",
      evidenceA: "100% du texte produit a un score de perplexité artificiellement uniforme (génération brute sans retouche).",
      evidenceB: "Julien est incapable lors de sa défense orale d'expliquer la formule de l'EBITDA qu'il a pourtant insérée.",
      correctVerdict: "plagiat_delegation",
      explanation: "Délégation cognitive totale : Julien a laissé l'IA rédiger à sa place sans comprendre ni s'approprier les concepts."
    }
  ];

  const totalKeysObtained = Object.values(keysUnlocked).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-['Lexend'] overflow-hidden animate-in fade-in">
      {/* Top Cyber Command Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Outfit'] font-black text-sm sm:text-base tracking-wide bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
                PANIQUE AU JURY : L'ALGORITHME FANTÔME
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono font-bold text-rose-300">
                PROJET A.U.R.O.R.E.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Éducation aux médias & Esprit critique IA · Campus HECh</p>
          </div>
        </div>

        {/* Status Indicators & Timer */}
        <div className="flex items-center gap-4">
          {/* 4 Keys Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-black text-slate-300">
              {totalKeysObtained} / 4 Clés
            </span>
          </div>

          {/* Critical Mind Gauge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-500" 
                style={{ width: `${ethicalScore}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan-300">{ethicalScore}%</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 shadow-inner">
            <Clock className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-mono font-black text-rose-300 text-sm tracking-wider">
              {formatTimer(timeLeft)}
            </span>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={() => {
                sounds.stopSuspense();
                sounds.stopAllVoice();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Game Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        
        {/* LEFT COLUMN: 3D Pixar Visual Studio & Holographic Core */}
        <div className="lg:col-span-5 border-r border-slate-800/80 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex-1 w-full relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <PixarStyleScene3D 
              theme={
                currentStage === 'room_north' ? 'factcheck' :
                currentStage === 'room_west' ? 'tribunal' :
                currentStage === 'room_south' ? 'datacenter' :
                currentStage === 'room_east' ? 'promptwars' :
                currentStage === 'boss' ? 'boss' : 'hub'
              }
              isAlert={currentStage === 'boss' || timeLeft < 15 * 60}
              characterMood={
                totalKeysObtained === 4 ? 'victorious' :
                currentStage === 'boss' ? 'worried' : 'thinking'
              }
            />

            {/* A.U.R.O.R.E. Overlay Badge */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cyan-500/30 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-cyan-200">A.U.R.O.R.E. v2.4 (Live Feed)</span>
            </div>
          </div>

          {/* Dialogue Log Console */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1 max-h-28 overflow-y-auto">
            <div className="text-[10px] text-cyan-400 uppercase font-black tracking-wider flex items-center gap-1.5 mb-1">
              <Terminal className="w-3.5 h-3.5" /> Journal de Transmission Directe
            </div>
            {dialogueLog.map((log, i) => (
              <p key={i} className="leading-snug">
                <strong className={log.speaker === 'A.U.R.O.R.E.' ? 'text-rose-400' : 'text-amber-400'}>
                  [{log.speaker}]
                </strong> {log.text}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Exploration & Mini-Games */}
        <div className="lg:col-span-7 bg-slate-900/50 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          
          {/* STAGE: INTRO */}
          {currentStage === 'intro' && (
            <div className="max-w-2xl mx-auto my-auto space-y-6 text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto shadow-rose-500/30 shadow-2xl">
                <ShieldAlert className="w-8 h-8 text-rose-400 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest">
                  Urgence Délibération · Bloc 1 HECh
                </span>
                <h2 className="text-2xl sm:text-3xl font-['Outfit'] font-black text-white mt-1">
                  Les Serveurs du Jury sont Verrouillés !
                </h2>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  L'intelligence artificielle centrale <strong>A.U.R.O.R.E.</strong> a bloqué la validation des délibérations. Elle exige la preuve que les étudiants sont capables de maîtriser l'IA sans perdre leur esprit critique, leur honnêteté intellectuelle et leur autonomie de jugement.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-2 text-xs">
                <strong className="text-cyan-300 block font-bold">Votre Mission de Survie Académique :</strong>
                <p>1. Parcourez librement les 4 ailes du campus numérique.</p>
                <p>2. Résolvez les 4 grands défis : Fact-Checking, Tribunal Anti-Plagiat, Éco-Datacenter, et Prompt Wars.</p>
                <p>3. Récupérez les 4 clés d'intégrité avant la fin des 45 minutes pour affronter A.U.R.O.R.E. dans l'amphi !</p>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  sounds.playSuccess();
                  setCurrentStage('hub');
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:scale-[1.01] text-white font-['Outfit'] font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Accéder au Terminal du Campus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STAGE: HUB CENTRAL (Exploration Libre & Carte Dynamique Campus Rivageois) */}
          {currentStage === 'hub' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Carte Interactive Dynamique du Campus Les Rivageois */}
              <CampusRivageoisMap
                keysUnlocked={keysUnlocked}
                currentStage={currentStage}
                onSelectWing={(wingId) => handleEnterRoom(wingId)}
              />

              {/* Résumé d'état rapide sous la carte */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div 
                  onClick={() => handleEnterRoom('room_north')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-center ${
                    keysUnlocked.north 
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                      : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold block">1. Labo Fact-Check</span>
                  <span className="text-[10px] font-mono">{keysUnlocked.north ? "Clé Alpha ✓" : "Quai de Rome"}</span>
                </div>

                <div 
                  onClick={() => handleEnterRoom('room_west')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-center ${
                    keysUnlocked.west 
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                      : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold block">2. Tribunal Jury</span>
                  <span className="text-[10px] font-mono">{keysUnlocked.west ? "Clé Beta ✓" : "Rue Rivageois"}</span>
                </div>

                <div 
                  onClick={() => handleEnterRoom('room_south')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-center ${
                    keysUnlocked.south 
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                      : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold block">3. Datacenter Éco</span>
                  <span className="text-[10px] font-mono">{keysUnlocked.south ? "Clé Gamma ✓" : "Sous-Sols"}</span>
                </div>

                <div 
                  onClick={() => handleEnterRoom('room_east')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-center ${
                    keysUnlocked.east 
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                      : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold block">4. Prompt Wars</span>
                  <span className="text-[10px] font-mono">{keysUnlocked.east ? "Clé Delta ✓" : "Vieux Hêtre"}</span>
                </div>
              </div>
            </div>
          )}

          {/* ROOM 1: FACT-CHECKING LAB (AILE NORD) */}
          {currentStage === 'room_north' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Épreuve 1 : Fact-Checking de Mémoire</span>
                <button 
                  onClick={() => setCurrentStage('hub')}
                  className="text-xs text-slate-400 hover:text-white font-mono"
                >
                  ← Retour au Hub
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/90 border border-cyan-500/40 shadow-xl">
                <h4 className="font-bold text-sm text-cyan-300 mb-2">
                  Document Suspect : {FACT_CHECK_CASES[0].title}
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 font-serif text-xs text-slate-300 leading-relaxed border border-slate-800">
                  {FACT_CHECK_CASES[0].text}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Identifiez les deux anomalies d'hallucination forgées par l'IA :
                </span>
                {FACT_CHECK_CASES[0].anomalies.map(anom => {
                  const isSelected = factCheckAnomaliesFound.includes(anom.id);
                  return (
                    <button
                      key={anom.id}
                      onClick={() => {
                        sounds.playPop();
                        if (!isSelected) {
                          const updated = [...factCheckAnomaliesFound, anom.id];
                          setFactCheckAnomaliesFound(updated);
                          if (updated.length === 2) {
                            handleUnlockKey('north', 'Clé Alpha (Esprit Critique)');
                          }
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected 
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
                          : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div>
                        <strong className="block font-bold mb-0.5">{anom.label}</strong>
                        <span className="text-[11px] text-slate-400">{anom.desc}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {keysUnlocked.north && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                  <span>Bravo ! Vous avez prouvé la traçabilité des sources primaires !</span>
                  <button 
                    onClick={() => setCurrentStage('hub')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Retourner à la carte
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ROOM 2: TRIBUNAL DU JURY (AILE OUEST) */}
          {currentStage === 'room_west' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase">Épreuve 2 : Le Procès Académique</span>
                <button 
                  onClick={() => setCurrentStage('hub')}
                  className="text-xs text-slate-400 hover:text-white font-mono"
                >
                  ← Retour au Hub
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚖️</span>
                  <strong className="text-white text-sm">Affaire Julien : Assistance ou Fraude Déguisée ?</strong>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Julien a soumis une analyse financière impeccable en 15 pages. Lors de son oral de soutenance, il est incapable de définir le concept central de son travail.
                </p>

                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setTribunalPlaidoyer('tricherie');
                      handleUnlockKey('west', 'Clé Beta (Intégrité Académique)');
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                      tribunalPlaidoyer === 'tricherie'
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                    }`}
                  >
                    <strong>Verdict A : Délégation cognitive coupable.</strong> L'étudiant n'a pas développé la compétence visée par l'AA ; le texte n'est pas le reflet de son apprentissage.
                  </button>

                  <button
                    onClick={() => {
                      sounds.playBuzzer();
                      sounds.playGroan();
                      alert("A.U.R.O.R.E. conteste : Valider une copie générée sans compréhension détruit la valeur du diplôme d'ingénieur/gestionnaire !");
                    }}
                    className="w-full p-3 rounded-xl border bg-slate-800 hover:bg-slate-750 text-slate-400 border-slate-700 text-left text-xs cursor-pointer"
                  >
                    <strong>Verdict B : Innocent sans réserve.</strong> L'IA est un outil libre, peu importe que l'étudiant comprenne ou non les termes insérés.
                  </button>
                </div>

                {keysUnlocked.west && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                    <span>Jugement exemplaire rendu ! L'intégrité de la formation est sauve.</span>
                    <button 
                      onClick={() => setCurrentStage('hub')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                    >
                      Retourner au Hub
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ROOM 3: DATACENTER TYCOON (AILE SUD) */}
          {currentStage === 'room_south' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-400" /> Simulateur Datacenter : Sobriété & Protection RGPD
                </span>
                <button 
                  onClick={() => setCurrentStage('hub')}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Retour au Hub
                </button>
              </div>

              {/* Live Gauges Dashboard */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Consommation</span>
                  <strong className={`text-lg font-mono font-black ${computedWatts <= 450 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {computedWatts} W/h
                  </strong>
                  <span className="text-[9px] block text-slate-500 mt-0.5">Cible : ≤ 450 W/h</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Température Baie</span>
                  <strong className={`text-lg font-mono font-black ${computedTemp <= 45 ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {computedTemp} °C
                  </strong>
                  <span className="text-[9px] block text-slate-500 mt-0.5">Refroidissement passif</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Conformité RGPD</span>
                  <strong className={`text-xs font-mono font-black block mt-1 ${datacenterLoad.rgpdFirewall ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {datacenterLoad.rgpdFirewall ? "🛡️ DONNÉES SÉCURISÉES" : "⚠️ RISQUE DE FUITE"}
                  </strong>
                  <span className="text-[9px] block text-slate-500 mt-0.5">Anonymisation requise</span>
                </div>
              </div>

              {/* Sliders & Toggles */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                {/* Ratio Cloud vs Local */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-rose-300">Modèles Cloud Géants (Clusters distants) : {datacenterLoad.cloudGpuUsage}%</span>
                    <span className="text-emerald-300">SLM Locaux Souverains (Gemma/Qwen) : {datacenterLoad.localSlmUsage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={datacenterLoad.localSlmUsage}
                    onChange={(e) => {
                      const localVal = parseInt(e.target.value);
                      setDatacenterLoad(prev => ({
                        ...prev,
                        localSlmUsage: localVal,
                        cloudGpuUsage: 100 - localVal
                      }));
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Déplacez le curseur vers la droite pour traiter les requêtes en local sur les machines du campus.
                  </span>
                </div>

                {/* Optimisations toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setDatacenterLoad(prev => ({ ...prev, activeQuotas: !prev.activeQuotas }));
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      datacenterLoad.activeQuotas 
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <strong className="block text-[11px] font-bold">Quotas Requêtes Éducatives</strong>
                    <span className="text-[9px] text-slate-400">Évite le spam redondant (-280 W)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      setDatacenterLoad(prev => ({ ...prev, cacheEnabled: !prev.cacheEnabled }));
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      datacenterLoad.cacheEnabled 
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <strong className="block text-[11px] font-bold">Cache Sémantique Local</strong>
                    <span className="text-[9px] text-slate-400">Ne recalcule pas l'existant (-350 W)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      setDatacenterLoad(prev => ({ ...prev, rgpdFirewall: !prev.rgpdFirewall }));
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      datacenterLoad.rgpdFirewall 
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <strong className="block text-[11px] font-bold">Pare-feu Anonymiseur RGPD</strong>
                    <span className="text-[9px] text-slate-400">Zéro transmission nominative</span>
                  </button>
                </div>
              </div>

              {/* Validation of the wing */}
              {!keysUnlocked.south ? (
                <button
                  disabled={!isDatacenterEco}
                  onClick={() => handleUnlockKey('south', 'Clé Gamma (Sobriété & Souveraineté)')}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wide transition shadow-lg flex items-center justify-center gap-2 ${
                    isDatacenterEco 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01] text-slate-950 shadow-emerald-500/25 cursor-pointer animate-bounce' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>{isDatacenterEco ? "Valider la Régulation Écologique & Extraire la Clé Gamma" : "Ajustez les réglages (≤ 450 W + RGPD actif + ≥ 65% Local)"}</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                  <span>✨ Datacenter sécurisé et éco-responsable ! Clé Gamma sécurisée.</span>
                  <button 
                    onClick={() => setCurrentStage('hub')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Retourner au Hub
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ROOM 4: PROMPT WARS TACTICAL DECK (AILE EST) */}
          {currentStage === 'room_east' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-pink-400 font-bold uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-400" /> Duel Tactique : Déjouer les Biais & Hallucinations
                </span>
                <button 
                  onClick={() => setCurrentStage('hub')}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Retour au Hub
                </button>
              </div>

              {/* Bot Adversary Card Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900 border border-pink-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <strong className="text-xs font-bold text-rose-300">
                      Bot Générateur de Biais (Manche {botArgIdx + 1} / {BOT_ARGUMENTS.length})
                    </strong>
                  </div>
                  <span className="font-mono font-bold text-xs text-rose-400">
                    Bouclier d'Incohérence : {botDefense} %
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${botDefense}%` }} 
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-rose-500/30 text-rose-200 text-xs font-medium italic">
                  {BOT_ARGUMENTS[botArgIdx]?.text}
                </div>
              </div>

              {/* Player Cards Hand */}
              <span className="text-xs font-bold text-slate-300 block">
                Choisissez la riposte méthodologique adéquate pour contrer l’argument fallacieux :
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {promptWarHand.map(card => (
                  <button
                    key={card.id}
                    disabled={card.used || botDefense === 0}
                    onClick={() => {
                      sounds.playPop();
                      sounds.playSuccess();
                      const nextDef = Math.max(0, botDefense - card.power);
                      setBotDefense(nextDef);
                      setPromptWarHand(prev => prev.map(c => c.id === card.id ? { ...c, used: true } : c));
                      setBotArgIdx(prev => (prev + 1) % BOT_ARGUMENTS.length);

                      if (nextDef === 0) {
                        handleUnlockKey('east', 'Clé Delta (Maîtrise Algorithmique & Réfutation des Biais)');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      card.used 
                        ? 'bg-slate-900/40 border-slate-800 opacity-40 cursor-not-allowed' 
                        : 'bg-slate-800/90 hover:bg-slate-800 border-pink-500/40 hover:border-pink-400 hover:scale-[1.01] shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-pink-300">{card.name}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold">
                          -{card.power} PTS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{card.desc}</p>
                    </div>
                    <span className="mt-2 text-[10px] font-mono text-cyan-400 font-bold self-end">
                      {card.used ? "CARTE DÉJÀ ACTIVÉE" : "DÉPLOYER LA CONTRAINTE ⚡"}
                    </span>
                  </button>
                ))}
              </div>

              {keysUnlocked.east && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                  <span>✨ Tous les sophismes ont été réfutés ! Clé Delta sécurisée.</span>
                  <button 
                    onClick={() => setCurrentStage('hub')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Retourner au Hub
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BOSS STAGE: L'AMPHI FINAL AVEC A.U.R.O.R.E. */}
          {currentStage === 'boss' && (
            <div className="space-y-5 text-center my-auto animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto shadow-cyan-500/30 shadow-2xl">
                <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
              </div>

              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  Grand Débat Philosophique · Amphithéâtre HECh
                </span>
                <h3 className="text-2xl font-['Outfit'] font-black text-white mt-1">
                  Face-à-Face Décisif avec A.U.R.O.R.E.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                  « Étudiant, vous avez prouvé votre rigueur technique. Mais dites-moi : si l'IA peut rédiger, coder et synthétiser plus vite que vous, quelle est la raison d'être de votre formation ? »
                </p>
              </div>

              <div className="space-y-3 max-w-lg mx-auto text-left">
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    sounds.playVoice('aurore_victory');
                    setCurrentStage('ending');
                  }}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-900/60 to-indigo-900/60 hover:from-cyan-800/80 hover:to-indigo-800/80 border border-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg transition cursor-pointer"
                >
                  🎓 « La valeur de l'humain ne réside pas dans la vitesse d'exécution, mais dans le sens, l'empathie, le doute constructif, la responsabilité éthique et la contextualisation du réel. »
                </button>

                <button
                  onClick={() => {
                    sounds.playBuzzer();
                    alert("A.U.R.O.R.E. : Réponse défaitiste ! Si vous vous limitez à être un consommateur d'automatismes, vous vous rendez remplaçable.");
                  }}
                  className="w-full p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-400 text-xs transition cursor-pointer"
                >
                  « En effet, autant laisser les machines tout gérer et ne plus faire d'efforts. »
                </button>
              </div>
            </div>
          )}

          {/* STAGE: VICTOIRE & FINS MULTIPLES */}
          {currentStage === 'ending' && (
            <div className="max-w-xl mx-auto my-auto text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-emerald-500/40 shadow-2xl">
                <Award className="w-10 h-10 text-emerald-300" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  DÉLIBÉRATIONS RESTAURÉES · 60 ECTS VALIDÉS
                </span>
                <h2 className="text-3xl font-['Outfit'] font-black text-white mt-2">
                  Victoire : L'Alliance Éclairée !
                </h2>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  A.U.R.O.R.E. a levé la mise en quarantaine. Convaincue par votre rigueur méthodologique et votre éthique, elle est intégrée au Service d'Accompagnement à la Réussite (SAR) non plus comme un censeur, mais comme un tuteur d'entraînement critique !
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-left grid grid-cols-2 gap-3 font-mono">
                <div>
                  <span className="text-slate-400 block">Temps Restant</span>
                  <strong className="text-emerald-400 text-sm">{formatTimer(timeLeft)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Score d'Esprit Critique</span>
                  <strong className="text-cyan-400 text-sm">{ethicalScore} / 100 XP</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  if (onClose) onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01] text-slate-950 font-['Outfit'] font-black text-sm uppercase tracking-wide shadow-xl cursor-pointer"
              >
                Retourner à la Métabox HECh
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
