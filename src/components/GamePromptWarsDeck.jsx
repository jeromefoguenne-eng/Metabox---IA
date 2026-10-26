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
  Award
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GamePromptWarsDeck:
 * Jeu de cartes stratégique / Deck-Building au tour par tour (style Balatro / Hearthstone pédagogique).
 * L'étudiant affronte un bot désinformateur en combinant des cartes Outils et Cartes Vérifications.
 */
export default function GamePromptWarsDeck({ onComplete }) {
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(120);
  const [mana, setMana] = useState(3);
  const [turn, setTurn] = useState(1);
  const [selectedCards, setSelectedCards] = useState([]);
  const [battleLog, setBattleLog] = useState([
    "Tour 1 : Le Bot Propagandiste génère une bulle de filtres et prépare un biais de confirmation !"
  ]);
  const [isVictory, setIsVictory] = useState(false);

  // Deck of Available Student Cards
  const [deck, setDeck] = useState([
    { id: 'c1', name: "Rétro-Ingénierie de Prompt", cost: 1, type: 'attack', power: 30, desc: "Déconstruit la chaîne de pensée du modèle pour exposer ses prémisses fausses." },
    { id: 'c2', name: "Fact-Checking Croisé", cost: 1, type: 'attack', power: 25, desc: "Compare la réponse avec 3 sources académiques indépendantes." },
    { id: 'c3', name: "Prompt de Contrainte Stricte", cost: 2, type: 'defense', power: 40, desc: "Bloque net la génération d'hallucinations en exigeant des citations strictes." },
    { id: 'c4', name: "Source Primaire Peer-Reviewed", cost: 2, type: 'attack', power: 50, desc: "Détruit immédiatement les citations fictives forgées sans DOI." },
    { id: 'c5', name: "Contradiction Socratique", cost: 1, type: 'defense', power: 30, desc: "Neutralise l'effet de bulle de filtres en forçant le contre-argument." }
  ]);

  // Boss Enemy Attacks per Turn
  const BOSS_ATTACKS = [
    { name: "Hallucination Plausible", dmg: 18, desc: "Invente une statistique crédible pour tromper la vigilance." },
    { name: "Deepfake Vocal Électoral", dmg: 25, desc: "Sème la panique en imitant une voix d'autorité." },
    { name: "Biais de Confirmation Ciblé", dmg: 20, desc: "Renforce les préjugés de l'utilisateur pour bloquer la réflexion." },
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
    
    // Apply Card Impact
    let newBossHp = bossHp;
    if (card.type === 'attack') {
      newBossHp = Math.max(0, bossHp - card.power);
      setBossHp(newBossHp);
      setBattleLog(prev => [`⚔️ Vous jouez « ${card.name} » (-${card.power} PV au Bot)`, ...prev]);
    } else {
      setPlayerHp(prev => Math.min(100, prev + (card.power / 2)));
      setBattleLog(prev => [`🛡️ Vous activez « ${card.name} » (Bouclier méthodologique renforcé)`, ...prev]);
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

    setBattleLog(prev => [
      `🤖 Le Bot réplique avec « ${attack.name} » (-${attack.dmg} PV)`,
      `--- Fin du Tour ${turn} ---`,
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
    <div className="w-full h-full min-h-[520px] rounded-2xl bg-[#1c081e] border-2 border-pink-500/50 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in">
      
      {/* Header Deck Arena Bar */}
      <div className="h-12 bg-slate-950 border-b border-pink-900/60 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-pink-400" />
          <strong className="font-['Outfit'] font-black text-xs sm:text-sm text-pink-200 uppercase tracking-wide">
            PROMPT WARS : DUEL DE L'ESPRIT CRITIQUE (ARENA)
          </strong>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-amber-300 font-bold">Tour {turn}</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-pink-950 border border-pink-500/50 text-cyan-300 font-bold">
            Mana : {mana} / 3 ⚡
          </span>
        </div>
      </div>

      {/* Battle Field Area */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
        
        {/* Left Column: Boss Adversary & Battle Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/40 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rose-300">BOT PROPAGANDISTE BIAISÉ</span>
              <span className="font-mono text-rose-400 font-bold">{bossHp} / 120 PV</span>
            </div>
            
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300"
                style={{ width: `${(bossHp / 120) * 100}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-300 italic">
              Prochaine attaque prévue : « {BOSS_ATTACKS[(turn - 1) % BOSS_ATTACKS.length].name} » ({BOSS_ATTACKS[(turn - 1) % BOSS_ATTACKS.length].desc})
            </p>
          </div>

          {/* Battle History Log Console */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-44 overflow-y-auto">
            <span className="text-[9px] uppercase font-bold text-pink-400 block mb-1">Journal de Combat :</span>
            {battleLog.map((log, i) => (
              <p key={i} className="leading-snug">{log}</p>
            ))}
          </div>
        </div>

        {/* Right Column: Player State & Hand of Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Player Health Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-cyan-300">VOUS (ESPRIT CRITIQUE ÉTUDIANT)</span>
              <span className="text-cyan-400">{playerHp} / 100 PV</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>

          {/* Player Cards Deck Hand */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-pink-300 uppercase font-mono">Votre Main Méthodologique :</span>
              <span className="text-[11px] text-slate-400">Coût en Mana requis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {deck.map((card) => {
                const canAfford = mana >= card.cost;
                return (
                  <button
                    key={card.id}
                    disabled={!canAfford || isVictory}
                    onClick={() => handlePlayCard(card)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      canAfford && !isVictory
                        ? 'bg-slate-900/90 hover:bg-slate-850 border-pink-500/40 hover:border-pink-400 hover:scale-[1.02] shadow-md'
                        : 'bg-slate-950/40 border-slate-800 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs font-bold text-pink-200">{card.name}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                          {card.cost} ⚡
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug">{card.desc}</p>
                    </div>

                    <span className="mt-2 text-[10px] font-mono font-bold text-amber-400 self-end">
                      {card.type === 'attack' ? `Impact : -${card.power} PV` : `Protection : +${card.power} Bouclier`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* End Turn Button / Victory Banner */}
          {!isVictory ? (
            <button
              onClick={handleEndTurn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:scale-[1.01] text-white font-bold text-xs uppercase transition shadow-lg cursor-pointer"
            >
              Terminer le Tour & Subir la Réplique du Bot
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold font-mono text-center animate-in zoom-in-95">
              🎉 BOT NEUTRALISÉ ! CLÉ DELTA (MAÎTRISE ALGORITHMIQUE) VALIDÉE !
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
