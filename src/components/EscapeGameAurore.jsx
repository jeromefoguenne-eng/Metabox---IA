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
import CharacterAvatar from './CharacterAvatar';
import GameFactChecking3D from './GameFactChecking3D';
import GameInvestigationOS from './GameInvestigationOS';
import GameGrandProcesHacking from './GameGrandProcesHacking';
import GameTribunal3D from './GameTribunal3D';
import GameSurvivantNovel from './GameSurvivantNovel';
import GamePromptWarsDeck from './GamePromptWarsDeck';
import { sounds } from '../utils/soundEffects';

export default function EscapeGameAurore({ onClose }) {
  // Game State
  const [currentStage, setCurrentStage] = useState('intro'); // 'intro' | 'hub' | 'room_north' | 'room_west' | 'room_south' | 'room_east' | 'boss' | 'ending'
  const [isPixarVideoMode, setIsPixarVideoMode] = useState(true);
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
  const [tribunalMode, setTribunalMode] = useState('blackout'); // 'blackout' (Grand Procès 24h - Maxime) par défaut selon la demande de l'utilisateur
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
    // Ne jouer l'alerte du doyen que lors de l'intro initiale
    sounds.playVoice('doyen_alert_intro', () => {
      sounds.scheduleTimeout(() => {
        sounds.playVoice('aurore_intro_hd');
      }, 600);
    });

    return () => {
      sounds.stopAllVoice();
    };
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

  const [transitionVideo, setTransitionVideo] = useState(null);

  const handleBackToHub = () => {
    sounds.stopAllVoice();
    sounds.playPop();
    setCurrentStage('hub');
  };

  const handleEnterRoom = (roomKey) => {
    sounds.stopAllVoice();
    sounds.playPop();

    const videoMapping = {
      'room_north': '/video/transitions/trans_investigation_os.mp4',
      'room_west': '/video/transitions/trans_tribunal_2030.mp4',
      'room_south': '/video/transitions/trans_survivant_novel.mp4',
      'room_east': '/video/transitions/trans_prompt_wars.mp4'
    };

    const targetVid = videoMapping[roomKey];
    if (targetVid) {
      setTransitionVideo(targetVid);
      setTimeout(() => {
        setTransitionVideo(null);
        setCurrentStage(roomKey);
      }, 2900);
    } else {
      setCurrentStage(roomKey);
    }

    // Gestion stricte des voix sans chevauchement
    const voiceMapping = {
      'room_north': 'aurore_factcheck_challenge',
      // Pour le tribunal, la voix est gérée en interne par la scène 3D
      'room_south': 'aurore_datacenter_challenge',
      'room_east': 'aurore_promptwars_challenge',
      'boss': 'aurore_boss_philosophie'
    };
    const voiceKey = voiceMapping[roomKey];
    if (voiceKey) {
      setTimeout(() => {
        sounds.stopAllVoice();
        sounds.playVoice(voiceKey);
      }, targetVid ? 2950 : 200);
    }
  };

  const handleUnlockKey = (wingKey, keyName) => {
    sounds.playSuccess();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    setKeysUnlocked(prev => ({ ...prev, [wingKey]: true }));
    setEthicalScore(prev => Math.min(100, prev + 15));
    setDialogueLog(prev => [
      { speaker: 'SYSTÈME', text: `✨ ${keyName} déverrouillée avec succès ! Intégrité restaurée.` },
      ...prev
    ]);
    // Retour automatique et garanti au plan d'orientation du campus
    setTimeout(() => {
      handleBackToHub();
    }, 1200);
  };

  const totalKeysObtained = Object.values(keysUnlocked).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-['Lexend'] overflow-hidden animate-in fade-in">
      {/* Top Cyber Command Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 p-1 rounded-xl bg-white border border-slate-700 shadow-sm flex items-center justify-center">
            <img
              src="/images/hech_logo_officiel.png"
              alt="Haute École Charlemagne"
              className="w-full h-full object-contain"
            />
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
        
        {/* LEFT COLUMN: 3D Visual Studio & Holographic Core (Aurore) */}
        {currentStage !== 'room_west' && (
          <div className="lg:col-span-5 border-r border-slate-800/80 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex-1 w-full relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
              {/* Personnage 3D Temps Réel Animé Style Arcane (Three.js 60 FPS) */}
              <PixarStyleScene3D 
                theme={
                  currentStage === 'room_north' ? 'factcheck' :
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

              {/* A.U.R.O.R.E. Overlay Badge Canonique Arcane */}
              <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cyan-400/50 flex items-center gap-2 shadow-lg shadow-purple-950/50">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-cyan-200">
                  A.U.R.O.R.E. (Animée 3D Temps Réel 60 FPS)
                </span>
              </div>

              {/* Visualiseur d'ondes audio holographique en bas */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-cyan-200">SIGNAL VOCAL DIRECT CONNECTÉ</span>
                </div>
                <div className="flex items-end gap-1 h-5 px-2 py-1 rounded-lg bg-slate-950/80 border border-purple-500/40">
                  {[14, 22, 10, 26, 18, 24, 12, 20].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-cyan-400 to-amber-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDuration: `${0.35 + (i % 4) * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Dialogue Log Console avec Avatar Raccord */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-32 overflow-y-auto">
              <div className="text-[10px] text-cyan-400 uppercase font-black tracking-wider flex items-center gap-1.5 mb-1">
                <Terminal className="w-3.5 h-3.5" /> Journal de Transmission Directe
              </div>
              {dialogueLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 leading-snug">
                  {log.speaker === 'A.U.R.O.R.E.' ? (
                    <CharacterAvatar characterId="aurore" size={20} className="shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      SYS
                    </div>
                  )}
                  <div>
                    <strong className={log.speaker === 'A.U.R.O.R.E.' ? 'text-cyan-300' : 'text-amber-400'}>
                      [{log.speaker}]
                    </strong>{' '}
                    <span>{log.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Interactive Exploration & Mini-Games (Prend 100% de la largeur quand room_west) */}
        <div className={`${currentStage === 'room_west' ? 'lg:col-span-12 p-2 sm:p-4' : 'lg:col-span-7 p-4 sm:p-6'} bg-slate-900/50 overflow-y-auto flex flex-col justify-between`}>
          
          {/* STAGE: INTRO */}
          {currentStage === 'intro' && (
            <div className="max-w-2xl mx-auto my-auto space-y-6 text-center animate-in fade-in">
              <div className="flex items-center justify-center gap-3">
                <div className="w-14 h-14 p-1.5 rounded-2xl bg-white border border-slate-700 shadow-xl flex items-center justify-center">
                  <img
                    src="/images/hech_logo_officiel.png"
                    alt="Haute École Charlemagne"
                    className="w-full h-full object-contain"
                  />
                </div>
                <CharacterAvatar characterId="aurore" size={56} />
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-rose-500/30 shadow-xl">
                  <ShieldAlert className="w-7 h-7 text-rose-400 animate-bounce" />
                </div>
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
                  <span className="text-sm font-bold block">1. Rédaction Fantôme</span>
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
                  <span className="text-sm font-bold block">2. Procès Blackout 24h</span>
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
                  <span className="text-sm font-bold block">3. Guide du Survivant</span>
                  <span className="text-[10px] font-mono">{keysUnlocked.south ? "Clé Gamma ✓" : "Sous-Sols & Faille"}</span>
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

          {/* ROOM 1: CYBER-DÉTECTIVE FACT-CHECKING 3D POINT & CLICK (AILE NORD) */}
          {currentStage === 'room_north' && (
            <div className="space-y-3 animate-in fade-in h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  AILE NORD (QUAI DE ROME) · LABORATOIRE D'INVESTIGATION NUMÉRIQUE DE FACT-CHECKING 3D
                </span>
                <button 
                  onClick={handleBackToHub}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Carte du Campus
                </button>
              </div>

              <div className="flex-1 min-h-[640px]">
                <GameFactChecking3D
                  onComplete={() => {
                    handleUnlockKey('north', 'Clé Alpha (Esprit Critique & Vérité)');
                  }}
                  onBack={handleBackToHub}
                />
              </div>
            </div>
          )}

          {/* ROOM 2: TRIBUNAL ACADÉMIQUE 2030 (AILE OUEST) */}
          {currentStage === 'room_west' && (
            <div className="space-y-3 animate-in fade-in h-full flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                    AILE OUEST (RUE DES RIVAGEOIS) · TRIBUNAL 3D
                  </span>
                  
                  {/* Sélecteur de mode de procès pour retrouver la structure exacte */}
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setTribunalMode('blackout');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        tribunalMode === 'blackout'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Le Grand Procès du Blackout 24h : Défense de Maxime c. Procureur du Roi"
                    >
                      ⚡ Grand Procès Blackout 24h (Maxime)
                    </button>
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setTribunalMode('cases');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        tribunalMode === 'cases'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Procès 2030 : 3 Affaires complètes (Julien, Léo, AlgoRH) avec Outils d'Enquête Numérique & Objection"
                    >
                      ⚖️ 3 Affaires & Enquête Numérique (Julien / Léo / AlgoRH)
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleBackToHub}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Carte du Campus
                </button>
              </div>

              <div className="flex-1">
                {tribunalMode === 'cases' ? (
                  <GameTribunal3D 
                    onComplete={() => {
                      handleUnlockKey('west', 'Clé Beta (Intégrité Académique)');
                    }}
                  />
                ) : (
                  <GameGrandProcesHacking 
                    onComplete={() => {
                      handleUnlockKey('west', 'Clé Beta (Intégrité & Éthique Académique)');
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ROOM 3: VISUAL NOVEL LE GUIDE DU SURVIVANT (AILE SUD) */}
          {currentStage === 'room_south' && (
            <div className="space-y-3 animate-in fade-in h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  AILE SUD (SOUS-SOLS & FAILLE VITRÉE) · LE GUIDE DU SURVIVANT CONNECTÉ
                </span>
                <button 
                  onClick={handleBackToHub}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Carte du Campus
                </button>
              </div>

              <div className="flex-1">
                <GameSurvivantNovel
                  onComplete={() => {
                    handleUnlockKey('south', 'Clé Gamma (Sobriété & Méthode)');
                  }}
                />
              </div>
            </div>
          )}

          {/* ROOM 4: PROMPT WARS TACTICAL DECK (AILE EST) */}
          {currentStage === 'room_east' && (
            <div className="space-y-3 animate-in fade-in h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-pink-400 font-bold uppercase">
                  AILE EST (COUR DU VIEUX HÊTRE) · PROMPT WARS : DUEL D'ESPRIT CRITIQUE
                </span>
                <button 
                  onClick={handleBackToHub}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Carte du Campus
                </button>
              </div>

              <div className="flex-1">
                <GamePromptWarsDeck
                  onComplete={() => {
                    handleUnlockKey('east', 'Clé Delta (Maîtrise Algorithmique)');
                  }}
                />
              </div>
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
