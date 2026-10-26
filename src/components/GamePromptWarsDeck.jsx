import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Cpu, 
  ShieldCheck,
  Award,
  Layers,
  Swords,
  Radio,
  Eye,
  Activity
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GamePromptWarsDeck:
 * Jeu de cartes stratégique / Deck-Building au tour par tour (style Balatro / Hearthstone pédagogique).
 * L'étudiant affronte un bot désinformateur en combinant des cartes Outils et Cartes Vérifications.
 * Graphismes Haute Fidélité : Cristaux de Mana 3D, Cartes holographiques, Boss Cybernétique réactif.
 */
export default function GamePromptWarsDeck({ onComplete }) {
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(120);
  const [mana, setMana] = useState(3);
  const [turn, setTurn] = useState(1);
  const [battleLog, setBattleLog] = useState([
    "Tour 1 : Le Bot Propagandiste s'initialise et prépare une hallucination de sources !"
  ]);
  const [isVictory, setIsVictory] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  // Deck of Available Student Cards
  const [deck] = useState([
    { 
      id: 'c1', 
      name: "Rétro-Ingénierie de Prompt", 
      cost: 1, 
      type: 'attack', 
      power: 30, 
      icon: Cpu,
      gradient: 'from-amber-500/20 via-pink-500/20 to-rose-600/30',
      border: 'border-pink-500/50 hover:border-pink-300',
      desc: "Déconstruit la chaîne de pensée (CoT) du modèle pour exposer ses prémisses fausses." 
    },
    { 
      id: 'c2', 
      name: "Fact-Checking Croisé", 
      cost: 1, 
      type: 'attack', 
      power: 25, 
      icon: Eye,
      gradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-600/30',
      border: 'border-cyan-500/50 hover:border-cyan-300',
      desc: "Compare la réponse avec 3 sources académiques indépendantes vérifiées." 
    },
    { 
      id: 'c3', 
      name: "Prompt de Contrainte Stricte", 
      cost: 2, 
      type: 'defense', 
      power: 40, 
      icon: ShieldCheck,
      gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-600/30',
      border: 'border-emerald-500/50 hover:border-emerald-300',
      desc: "Bloque net la génération d'hallucinations en imposant un format JSON strict sans extrapolation." 
    },
    { 
      id: 'c4', 
      name: "Source Primaire Peer-Reviewed", 
      cost: 2, 
      type: 'attack', 
      power: 50, 
      icon: Swords,
      gradient: 'from-purple-500/20 via-rose-500/20 to-amber-600/30',
      border: 'border-purple-500/50 hover:border-purple-300',
      desc: "Annihile immédiatement les citations fictives forgées sans identifiant DOI authentique." 
    },
    { 
      id: 'c5', 
      name: "Contradiction Socratique", 
      cost: 1, 
      type: 'defense', 
      power: 30, 
      icon: Sparkles,
      gradient: 'from-fuchsia-500/20 via-pink-500/20 to-rose-600/30',
      border: 'border-fuchsia-500/50 hover:border-fuchsia-300',
      desc: "Neutralise l'effet de bulle de filtres en forçant le modèle à produire un contre-argument étayé." 
    }
  ]);

  // Boss Enemy Attacks per Turn
  const BOSS_ATTACKS = [
    { name: "Hallucination Plausible", dmg: 18, desc: "Invente une statistique crédible pour tromper la vigilance." },
    { name: "Deepfake Vocal Électoral", dmg: 25, desc: "Sème la panique en imitant une voix d'autorité." },
    { name: "Biais de Confirmation Ciblé", dmg: 20, desc: "Renforce les préjugés pour bloquer la réflexion critique." },
    { name: "Fausse Source Académique", dmg: 30, desc: "Forge un faux article dans une fausse revue scientifique." }
  ];

  const handlePlayCard = (card) => {
    if (mana < card.cost || isVictory) {
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
        setTimeout(onComplete, 2200);
      }
    }
  };

  const handleEndTurn = () => {
    if (isVictory) return;
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

    // Reset Mana & Next Turn
    setMana(3);
    setTurn(prev => prev + 1);

    if (newPlayerHp <= 0) {
      sounds.playBuzzer();
      sounds.playGroan();
      alert("Votre esprit critique a faibli face à la masse d'arguments fallacieux ! Réessayez le combat.");
      setPlayerHp(100);
      setBossHp(120);
      setMana(3);
      setTurn(1);
    }
  };

  return (
    <div className="w-full h-full min-h-[540px] rounded-3xl bg-[#0e0717] border-2 border-pink-500/40 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in select-none">
      
      {/* Header Deck Arena Bar */}
      <div className="h-14 bg-slate-950/90 backdrop-blur-md border-b border-pink-900/60 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest block">
              COMBAT TACTIQUE DE PROMPTS · DUEL N°4
            </span>
            <strong className="font-['Outfit'] font-black text-sm text-pink-100">
              Prompt Wars : Le Duel de l'Esprit Critique
            </strong>
          </div>
        </div>

        {/* Mana Crystals (3 Orbs) */}
        <div className="flex items-center gap-4">
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
        
        {/* Left Column: Boss Adversary (Animated 3D-Like Avatar) & Battle Log */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Boss Character Card */}
          <div className="p-4 rounded-3xl bg-slate-950/90 border border-rose-500/40 shadow-xl relative overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              {/* Cybernetic Boss Avatar */}
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

          {/* Player Cards Deck Hand (Holographic Card Aesthetics) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-pink-300 uppercase font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Cartes Tactiques en Main :
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Consomme des cristaux de Mana</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deck.map((card) => {
                const canAfford = mana >= card.cost;
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    disabled={!canAfford || isVictory}
                    onClick={() => handlePlayCard(card)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                      canAfford && !isVictory
                        ? `bg-gradient-to-br ${card.gradient} ${card.border} hover:scale-[1.02] shadow-lg hover:shadow-pink-500/20`
                        : 'bg-slate-950/40 border-slate-800/80 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5">
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

          {/* End Turn Button / Victory Banner */}
          {!isVictory ? (
            <button
              onClick={handleEndTurn}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 hover:scale-[1.01] text-white font-['Outfit'] font-black text-xs uppercase tracking-wider transition shadow-lg shadow-pink-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              Terminer le Tour & Subir la Réplique du Bot →
            </button>
          ) : (
            <div className="p-4 rounded-3xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 text-xs font-bold font-mono text-center shadow-xl animate-in zoom-in-95 flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-emerald-300 animate-bounce" />
              <span>BOT NEUTRALISÉ ! CLÉ DELTA (MAÎTRISE ALGORITHMIQUE) VALIDÉE !</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
