import { getAssetPath } from "../utils/assetPath";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  FileText,
  Key,
  Flame,
  Award
} from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import { sounds } from '../utils/soundEffects';
import { AURORE_GAME_BRIEFINGS } from '../data/auroreBriefingsData';

/**
 * AuroreGameBriefingModal:
 * Modal de briefing officiel d'A.U.R.O.R.E. affiché au début de chaque jeu :
 * 1. Lien direct avec le scénario de l'escape game (« Panique au Jury : L'Algorithme Fantôme »)
 * 2. Explication de pourquoi on doit réaliser cette partie (enjeu académique & déverrouillage de clés/crédits)
 * 3. Règles détaillées du jeu, déroulement et conditions de victoire
 * + Synthèse vocale interactive d'Aurore avec ondes audio animées
 */
export default function AuroreGameBriefingModal({
  gameId = 'factcheck',
  isOpen = true,
  onStartGame,
  onClose
}) {
  const briefing = AURORE_GAME_BRIEFINGS[gameId] || AURORE_GAME_BRIEFINGS.factcheck;
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sounds.isMuted());

  useEffect(() => {
    if (!isOpen) {
      if (isPlayingVoice) {
        sounds.stopAllVoice();
        setIsPlayingVoice(false);
      }
      return;
    }

    // Auto-lecture vocale de bienvenue d'Aurore si non muet
    if (!isMuted && briefing.auroreSpokenText) {
      const timer = setTimeout(() => {
        setIsPlayingVoice(true);
        sounds.speakHost(briefing.auroreSpokenText, 'aurore');
      }, 400);

      return () => {
        clearTimeout(timer);
        sounds.stopAllVoice();
      };
    }
  }, [isOpen, gameId]);

  if (!isOpen) return null;

  const toggleVoice = () => {
    if (isPlayingVoice) {
      sounds.stopAllVoice();
      setIsPlayingVoice(false);
    } else {
      sounds.stopAllVoice();
      setIsPlayingVoice(true);
      sounds.speakHost(briefing.auroreSpokenText, 'aurore');
    }
  };

  const handleStart = () => {
    sounds.stopAllVoice();
    setIsPlayingVoice(false);
    sounds.playSuccess();
    if (onStartGame) onStartGame();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden font-['Lexend'] text-white">
        
        {/* Bandeau Supérieur Cyber HECh */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 p-1 rounded-xl bg-white border border-slate-700 shadow-sm flex items-center justify-center shrink-0">
              <img
                src={getAssetPath("/images/hech_logo_officiel.png")}
                alt="Haute École Charlemagne"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  BRIEFING OFFICIEL D'A.U.R.O.R.E.
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {briefing.wing}
                </span>
              </div>
              <h2 className="font-['Outfit'] font-black text-base sm:text-lg text-white">
                {briefing.title}
              </h2>
            </div>
          </div>

          {/* Contrôle Vocal & Badge Clé */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoice}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer ${
                isPlayingVoice 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title={isPlayingVoice ? "Couper la voix d'Aurore" : "Écouter le briefing vocal d'Aurore"}
            >
              {isPlayingVoice ? (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span className="hidden sm:inline">Voix active</span>
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 bg-cyan-400 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 bg-cyan-400 h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-cyan-400 h-1.5 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Écouter Aurore</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Corps Principal du Briefing */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Bloc Avatar Aurore & Bulle Directe */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 shadow-inner">
            <div className="relative shrink-0">
              <CharacterAvatar characterId="aurore" size={68} className="ring-2 ring-cyan-400/50 shadow-lg" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" title="A.U.R.O.R.E. connectée" />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-['Outfit'] font-black text-sm text-cyan-300">
                  A.U.R.O.R.E. (Intelligence Centrale HECh)
                </span>
                <span className="text-[10px] font-mono text-slate-400">v2.4 Live Feed</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                « {briefing.auroreSpokenText} »
              </p>
              {briefing.keyReward && (
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-[11px] font-mono text-amber-300 font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enjeu du Défi : {briefing.keyReward}</span>
                </div>
              )}
            </div>
          </div>

          {/* Les 3 Piliers du Briefing demandés par l'utilisateur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Lien avec le Scénario de l'Escape Game */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-sky-500/30 flex flex-col justify-between space-y-3 shadow-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sky-400">
                  <Radio className="w-4 h-4" />
                  <h3 className="font-['Outfit'] font-black text-xs uppercase tracking-wider">
                    1. Scénario de l'Escape Game
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {briefing.scenarioLink}
                </p>
              </div>
              <div className="text-[10px] font-mono text-sky-400/80 pt-2 border-t border-slate-800">
                Protocole Panique au Jury
              </div>
            </div>

            {/* 2. Pourquoi Réaliser cette Partie (L'Enjeu) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-500/30 flex flex-col justify-between space-y-3 shadow-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400">
                  <Key className="w-4 h-4" />
                  <h3 className="font-['Outfit'] font-black text-xs uppercase tracking-wider">
                    2. Pourquoi Cette Épreuve ?
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {briefing.whyPlay}
                </p>
              </div>
              <div className="text-[10px] font-mono text-purple-400/80 pt-2 border-t border-slate-800">
                Condition de Déblocage du Jury
              </div>
            </div>

            {/* 3. Les Règles du Jeu */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 flex flex-col justify-between space-y-3 shadow-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <FileText className="w-4 h-4" />
                  <h3 className="font-['Outfit'] font-black text-xs uppercase tracking-wider">
                    3. Règles & Mécaniques
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-none">
                  {briefing.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-[10px] font-mono text-emerald-400/80 pt-2 border-t border-slate-800">
                Objectif : Victoire Immédiate
              </div>
            </div>

          </div>

        </div>

        {/* Pied de Page d'Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-slate-400 text-center sm:text-left">
            💡 <span className="text-slate-300">Astuce :</span> Vous pourrez rouvrir ce briefing à tout moment en cliquant sur le bouton <strong>« ℹ️ Briefing Aurore »</strong>.
          </div>

          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-['Outfit'] font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Compris Aurore, je lance la partie !</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
