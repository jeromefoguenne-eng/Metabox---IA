import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Flame, 
  BrainCircuit, 
  Search, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  AlertTriangle,
  Cpu,
  ShieldAlert,
  HelpCircle,
  Skull
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import AuroreGameBriefingModal from './AuroreGameBriefingModal';

export default function GamePromptWarsDeck({ onComplete }) {
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(120);
  const [mana, setMana] = useState(3);
  const [turn, setTurn] = useState(1);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);
  const [battleLog, setBattleLog] = useState([
    "Système initialisé. Le Bot Désinformateur déploie ses biais cognitifs.",
    "Utilisez vos cartes de prompt pour réfuter ses arguments et protéger votre esprit critique."
  ]);
  const [lastAction, setLastAction] = useState(null);
  const [showBriefing, setShowBriefing] = useState(false);

  // Deck de Cartes de Prompts Stratégiques
  const deck = [
    {
      id: 'cross_ref',
      name: 'Croisement de Sources',
      cost: 1,
      type: 'attack',
      power: 28,
      desc: 'Formule un prompt demandant 3 sources primaires divergentes pour percer le biais.',
      icon: Search,
      gradient: 'from-blue-600/30 to-indigo-600/30',
      border: 'border-blue-500/50',
      textAccent: 'text-blue-300'
    },
    {
      id: 'critique_prompt',
      name: 'Contradiction Socratique',
      cost: 2,
      type: 'attack',
      power: 45,
      desc: 'Incite le modèle à réfuter sa propre proposition pour révéler les failles logiques.',
      icon: BrainCircuit,
      gradient: 'from-purple-600/30 to-pink-600/30',
      border: 'border-purple-500/50',
      textAccent: 'text-purple-300'
    },
    {
      id: 'firewall',
      name: 'Prompt Pare-Feu Factuel',
      cost: 1,
      type: 'defense',
      power: 35,
      desc: 'Fixe une contrainte stricte de véracité : "Réponds uniquement avec des faits certifiés FWB".',
      icon: ShieldCheck,
      gradient: 'from-emerald-600/30 to-teal-600/30',
      border: 'border-emerald-500/50',
      textAccent: 'text-emerald-300'
    },
    {
      id: 'meta_critique',
      name: 'Raisonnement Étape par Étape',
      cost: 2,
      type: 'attack',
      power: 55,
      desc: 'Impose une chaîne de pensée détaillée (CoT) pour démanteler l\'hallucination complexe.',
      icon: Sparkles,
      gradient: 'from-amber-600/30 to-rose-600/30',
      border: 'border-amber-500/50',
      textAccent: 'text-amber-300'
    }
  ];

  // Attaques du Bot IA Adversaire
  const BOSS_ATTACKS = [
    { name: "Hallucination Plausible", dmg: 18, desc: "Invente une statistique crédible pour tromper la vigilance." },
    { name: "Deepfake Vocal Électoral", dmg: 24, desc: "Sème la panique en imitant une voix d'autorité." },
    { name: "Biais de Confirmation Ciblé", dmg: 20, desc: "Renforce les préjugés pour bloquer la réflexion critique." },
    { name: "Fausse Source Académique", dmg: 28, desc: "Forge un faux article dans une fausse revue scientifique." }
  ];

  const resetGame = () => {
    sounds.playPop();
    setPlayerHp(100);
    setBossHp(120);
    setMana(3);
    setTurn(1);
    setIsDefeat(false);
    setIsVictory(false);
    setLastAction(null);
    setBattleLog([
      "Duel réinitialisé.",
      "Préparez vos prompts critiques contre le Bot désinformateur."
    ]);
  };

  const handlePlayCard = (card) => {
    if (mana < card.cost || isVictory || isDefeat) {
      sounds.playBuzzer();
      return;
    }

    sounds.playPop();
    sounds.playSuccess();
    setMana(prev => prev - card.cost);
    setLastAction({ type: card.type, power: card.power, name: card.name });
    
    // Apply Card Impact
    let newBossHp = bossHp;
    if (card.type === 'attack') {
      newBossHp = Math.max(0, bossHp - card.power);
      setBossHp(newBossHp);
      setBattleLog(prev => [`⚔️ Vous jouez « ${card.name} » (-${card.power} PV au Bot)`, ...prev]);
    } else {
      setPlayerHp(prev => Math.min(100, prev + (card.power / 2)));
      setBattleLog(prev => [`🛡️ Vous activez « ${card.name} » (+${card.power / 2} PV Bouclier)`, ...prev]);
    }

    // Check Victory
    if (newBossHp <= 0) {
      setIsVictory(true);
      sounds.playSuccess();
      if (onComplete) {
        setTimeout(onComplete, 2600);
      }
    }
  };

  const handleEndTurn = () => {
    if (isVictory || isDefeat) return;
    sounds.playPop();

    // Boss Turn Attack
    const attack = BOSS_ATTACKS[(turn - 1) % BOSS_ATTACKS.length];
    const newPlayerHp = Math.max(0, playerHp - attack.dmg);
    
    setPlayerHp(newPlayerHp);
    setLastAction({ type: 'boss_attack', power: attack.dmg, name: attack.name });

    setBattleLog(prev => [
      `🤖 Le Bot réplique avec « ${attack.name} » (-${attack.dmg} PV)`,
      `─── Fin du Tour ${turn} ───`,
      ...prev
    ]);

    if (newPlayerHp <= 0) {
      sounds.playBuzzer();
      sounds.playGroan();
      setIsDefeat(true);
      return;
    }

    // Reset Mana & Next Turn
    setMana(3);
    setTurn(prev => prev + 1);
  };

  // Keyboard Shortcuts: 1, 2, 3, 4 to play cards, Space/Enter to end turn
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isVictory || isDefeat || showBriefing) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (deck[idx]) {
          handlePlayCard(deck[idx]);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleEndTurn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mana, isVictory, isDefeat, showBriefing, bossHp, playerHp, turn]);

  return (
    <div className="w-full h-full min-h-[560px] rounded-3xl bg-[#0b0714] border-2 border-pink-500/40 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in select-none relative">
      
      {/* Header Deck Arena Bar */}
      <div className="h-14 bg-slate-950/90 backdrop-blur-md border-b border-pink-900/60 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest block">
              COMBAT TACTIQUE DE PROMPTS · SALLE EST
            </span>
            <strong className="font-['Outfit'] font-black text-sm text-pink-100">
              Prompt Wars : Le Duel de l'Esprit Critique
            </strong>
          </div>
        </div>

        {/* Mana Crystals (3 Orbs) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sounds.playPop();
              setShowBriefing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-200 transition cursor-pointer shadow-md"
            title="Briefing d'Aurore : Scénario, Enjeu & Règles"
          >
            <span>ℹ️</span>
            <span className="hidden sm:inline">Briefing Aurore</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-300 hidden sm:inline">Tour {turn}</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-cyan-500/40">
            <span className="text-[11px] font-mono font-bold text-cyan-300">MANA :</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((orb) => (
                <div
                  key={orb}
                  className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    orb <= mana
                      ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-md shadow-cyan-400/50 scale-110'
                      : 'bg-slate-800 border border-slate-700 opacity-40 scale-90'
                  }`}
                >
                  {orb <= mana && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Field Area */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
        
        {/* Left Column: Boss Adversary & Battle Log */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Boss Character Card */}
          <div className="p-4 rounded-3xl bg-slate-950/90 border border-rose-500/40 shadow-xl relative overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-900 via-slate-900 to-black border-2 border-rose-500/60 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <Cpu className="w-7 h-7 text-rose-400 animate-pulse" />
                <div className="absolute inset-0 rounded-2xl border border-rose-400/40 animate-ping opacity-25" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-['Outfit'] font-black text-rose-300 uppercase tracking-wide">
                    BOT DÉSINFORMATEUR LLM
                  </span>
                  <span className="font-mono text-rose-400 font-bold">{bossHp} / 120 PV</span>
                </div>
                
                {/* Boss Health Bar */}
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 mt-1.5">
                  <div 
                    className="bg-gradient-to-r from-rose-600 via-amber-500 to-rose-400 h-full transition-all duration-500"
                    style={{ width: `${(bossHp / 120) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Boss Attack Intention Box */}
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/60 text-[11px] text-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 animate-bounce" />
              <span>
                <strong>Attaque imminente :</strong> « {BOSS_ATTACKS[(turn - 1) % BOSS_ATTACKS.length].name} » ({BOSS_ATTACKS[(turn - 1) % BOSS_ATTACKS.length].desc})
              </span>
            </div>
          </div>

          {/* Battle History Log Console */}
          <div className="flex-1 p-3.5 rounded-3xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 flex flex-col justify-between min-h-[140px] max-h-52 overflow-hidden">
            <span className="text-[9px] uppercase font-bold text-pink-400 block mb-1">Journal de Combat Holographique :</span>
            <div className="space-y-1 overflow-y-auto pr-1 flex-1">
              {battleLog.map((log, i) => (
                <p key={i} className="leading-snug text-slate-300 border-l-2 border-pink-500/30 pl-2">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Player State & Hand of Holographic Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          
          {/* Player Health Bar & Critical Shield */}
          <div className="p-3.5 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-300">VOUS (ESPRIT CRITIQUE ÉTUDIANT)</span>
              </div>
              <span className="text-cyan-400">{playerHp} / 100 PV</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>

          {/* Player Cards Deck Hand */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-pink-300 uppercase font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Cartes Tactiques (Raccourcis clavier [1] - [4]) :
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Consomme des cristaux de Mana</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deck.map((card, idx) => {
                const canAfford = mana >= card.cost;
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    disabled={!canAfford || isVictory || isDefeat}
                    onClick={() => handlePlayCard(card)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                      canAfford && !isVictory && !isDefeat
                        ? `bg-gradient-to-br ${card.gradient} ${card.border} hover:scale-[1.02] shadow-lg hover:shadow-pink-500/20 hover:border-pink-400`
                        : 'bg-slate-950/40 border-slate-800/80 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                            {idx + 1}
                          </span>
                          <IconComponent className="w-4 h-4 text-pink-300 group-hover:rotate-12 transition-transform" />
                          <strong className="text-xs font-['Outfit'] font-bold text-white group-hover:text-pink-200">
                            {card.name}
                          </strong>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 font-mono text-[10px] font-bold">
                          {card.cost} ⚡
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug font-sans">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono font-bold">
                      <span className="text-slate-400 uppercase text-[9px]">{card.type}</span>
                      <span className={card.type === 'attack' ? 'text-rose-400' : 'text-emerald-400'}>
                        {card.type === 'attack' ? `⚔️ -${card.power} PV` : `🛡️ +${card.power / 2} PV`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* End Turn Button / Victory Action */}
          {!isVictory && !isDefeat ? (
            <button
              onClick={handleEndTurn}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 hover:scale-[1.01] text-white font-['Outfit'] font-black text-xs uppercase tracking-wider transition shadow-lg shadow-pink-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              Terminer le Tour & Subir la Réplique du Bot (Espace / Entrée) →
            </button>
          ) : isVictory ? (
            <div className="p-4 rounded-3xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 text-xs font-bold font-mono text-center shadow-xl animate-in zoom-in-95 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-300 animate-bounce" />
                <span>BOT NEUTRALISÉ ! CLÉ DELTA (MAÎTRISE ALGORITHMIQUE) VALIDÉE !</span>
              </div>
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-['Outfit'] text-xs uppercase tracking-wide cursor-pointer transition shadow-lg shadow-emerald-500/30"
                >
                  Continuer l'Escape Game →
                </button>
              )}
            </div>
          ) : null}

        </div>

      </div>

      {/* Modal In-Game de Défaite Élégant (Sans alert() bloquant) */}
      {isDefeat && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border-2 border-rose-500/70 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border-2 border-rose-500/50 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/30">
              <Skull className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-['Outfit'] font-black text-rose-200">
                Votre Esprit Critique a Faibli
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Le Bot Désinformateur a submergé votre vigilance avec ses arguments fallacieux. Ajustez vos contraintes de prompt et contre-attaquez !
              </p>
            </div>
            <button
              onClick={resetGame}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-['Outfit'] font-black text-sm uppercase tracking-wider transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Relancer le Duel de Cartes
            </button>
          </div>
        </div>
      )}

      {/* Briefing Officiel d'Aurore (Scénario de l'Escape Game, Enjeu & Règles) */}
      <AuroreGameBriefingModal
        gameId="promptwars"
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
      />
    </div>
  );
}
