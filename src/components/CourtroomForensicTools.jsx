import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Sliders, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Fingerprint, 
  Cpu, 
  Activity,
  Zap,
  MapPin,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * CourtroomForensicTools:
 * Module d'investigation médico-légale numérique et académique.
 * Fournit de véritables manipulations interactives avec curseurs, loupes et filtres
 * pour extraire les preuves matérielles irréfutables avant le contre-interrogatoire.
 */
export default function CourtroomForensicTools({ 
  caseId, 
  onEvidenceUnlocked, 
  unlockedEvidences = [] 
}) {
  // --- ÉTATS AFFAIRE 1 (JULIEN) ---
  const [timeHour, setTimeHour] = useState(14); // Curseur temporel (0h à 48h)
  const [uvLensPos, setUvLensPos] = useState({ x: 50, y: 30 });
  const [uvFound, setUvFound] = useState(false);
  const [burstFound, setBurstFound] = useState(false);

  // --- ÉTATS AFFAIRE 2 (LÉO / DEEPFAKE) ---
  const [lowCut, setLowCut] = useState(200);
  const [highCut, setHighCut] = useState(18000);
  const [formantShift, setFormantShift] = useState(0);
  const [audioFiltered, setAudioFiltered] = useState(false);

  // --- ÉTATS AFFAIRE 3 (DRH / ALGORH) ---
  const [postalCode, setPostalCode] = useState('4000'); // '4000' (Liège) vs '1050' (Bruxelles)
  const [expYears, setExpYears] = useState(3);
  const [proxyInspected, setProxyInspected] = useState(false);

  // 1. Validation de l'anomalie temporelle (Affaire 1)
  const handleCheckTimeline = (val) => {
    setTimeHour(val);
    // Le pic est à 4h du matin (heure 28 sur l'échelle de 48h)
    if (val >= 27 && val <= 29 && !burstFound) {
      setBurstFound(true);
      sounds.playSuccess();
      onEvidenceUnlocked({
        id: 'ev_burst',
        label: 'Log de Frappe : Pic Anomalique de 18 200 mots',
        desc: '18 200 caractères injectés en 0.8 seconde à 04:17 du matin sans aucune frappe de clavier préalable.'
      });
    }
  };

  // 2. Validation de la loupe UV (Affaire 1)
  const handleUvMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setUvLensPos({ x, y });

    // La note de bas de page 4 est située vers x: 60-85%, y: 70-90%
    if (x > 55 && x < 90 && y > 65 && y < 95 && !uvFound) {
      setUvFound(true);
      sounds.playSuccess();
      onEvidenceUnlocked({
        id: 'ev_hidden_prompt',
        label: 'Prompt Système ChatGPT Masqué en Blanc',
        desc: 'Texte d instruction LLM caché dans les notes de bas de page ordonnant la rédaction automatique de l EBITDA.'
      });
    }
  };

  // 3. Validation du filtre spectrogramme audio (Affaire 2)
  const handleCheckSpectrogram = (low, high) => {
    setLowCut(low);
    setHighCut(high);
    // L'artefact de vocodeur RVC se trouve entre 10 500 Hz et 13 500 Hz
    if (low >= 9000 && high <= 14500 && !audioFiltered) {
      setAudioFiltered(true);
      sounds.playSuccess();
      onEvidenceUnlocked({
        id: 'ev_vocoder_glitch',
        label: 'Artefact de Phase RVC (11 kHz - 13 kHz)',
        desc: 'Discontinuité spectrale et absence de souffle biologique révélant un clonage vocal par IA.'
      });
    }
  };

  // 4. Validation du test de recrutement A/B (Affaire 3)
  const isCandidateAccepted = postalCode === '1050';
  const acceptanceScore = postalCode === '1050' ? 89 : 21;

  const handleInspectProxy = () => {
    if (!proxyInspected) {
      setProxyInspected(true);
      sounds.playSuccess();
      onEvidenceUnlocked({
        id: 'ev_proxy_code',
        label: 'Variable Proxy Discriminante (Code Postal / Trajet)',
        desc: 'Le critère logistique pénalise arbitrairement de -68 points les diplômés liégeois sous couvert d optimisation.'
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Fingerprint className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-sm sm:text-base text-cyan-300">
              LABORATOIRE D'EXPERTISE NUMÉRIQUE & PREUVES
            </h3>
            <p className="text-[11px] text-slate-400">
              Manipulez les outils interactifs pour extraire les indices matériels avant la confrontation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            {unlockedEvidences.length} / 2 Preuves trouvées
          </span>
        </div>
      </div>

      {/* =========================================================================
          AFFAIRE 1 : JULIEN (PLAGIAT vs COPILOTAGE)
      ========================================================================= */}
      {caseId === 'case_1' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outil 1 : Timeline d'écriture & détection de Burst */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" /> 1. Timeline de Saisie (48h de session)
              </span>
              {burstFound && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Anomalie détectée
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Faites défiler le curseur horaire pour repérer à quel moment les 15 pages ont été ajoutées.
            </p>

            {/* Curseur interactif */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Jour 1 (12h00)</span>
                <span className="text-cyan-400 font-bold">
                  {timeHour < 24 ? `Jour 1 (${timeHour}h00)` : `Nuit 2 (${timeHour - 24}h00)`}
                </span>
                <span>Jour 2 (24h00)</span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                value={timeHour}
                onChange={(e) => handleCheckTimeline(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Visualiseur de vitesse de frappe (Caractères/minute) */}
            <div className={`p-3 rounded-xl border text-xs font-mono transition-all ${
              timeHour >= 27 && timeHour <= 29 
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-200 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center justify-between">
                <span>Vitesse instantanée :</span>
                <span className="font-bold text-sm">
                  {timeHour >= 27 && timeHour <= 29 ? '⚡ 18 200 mots / min (BURST COLLÉ)' : '✍️ 35 mots / min (Frappe normale)'}
                </span>
              </div>
              {timeHour >= 27 && timeHour <= 29 && (
                <p className="text-[11px] text-rose-300 mt-1 font-sans">
                  ⚠️ Alerte : Copié-collé massif d'un bloc textuel complet sans aucun temps de frappe humain.
                </p>
              )}
            </div>
          </div>

          {/* Outil 2 : Loupe UV d'Analyse sur le Mémoire */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
                <Search className="w-4 h-4 text-purple-400" /> 2. Scanner UV de Métadonnées Masquées
              </span>
              {uvFound && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Prompt extrait
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Survolez la page du mémoire avec la souris pour révéler les instructions rédigées en blanc sur blanc.
            </p>

            {/* Zone de document interactive avec révélation UV */}
            <div 
              onMouseMove={handleUvMove}
              className="relative h-32 rounded-xl bg-slate-900 border border-slate-800 p-3 overflow-hidden cursor-crosshair select-none"
            >
              <div className="text-[11px] text-slate-400 font-serif leading-relaxed opacity-70">
                « ...conformément aux normes IFRS, le calcul de la marge brute d'autofinancement et de l'EBITDA reflète la santé structurelle de l'entité étudiée... »
              </div>

              {/* Texte caché invisible sauf sous la loupe */}
              <div 
                className={`absolute bottom-3 right-4 p-2 rounded-lg text-[10px] font-mono transition-opacity duration-300 ${
                  uvLensPos.x > 50 && uvLensPos.y > 60
                    ? 'opacity-100 bg-emerald-950/90 border border-emerald-500 text-emerald-300 shadow-lg'
                    : 'opacity-0'
                }`}
              >
                [System Prompt: ChatGPT-4o - Generate full chapter on EBITDA without citation]
              </div>

              {/* Réticule de la loupe UV */}
              <div 
                className="absolute w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-500/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${uvLensPos.x}%`, top: `${uvLensPos.y}%` }}
              />
            </div>

            <span className="text-[10px] font-mono text-slate-500 text-right">
              {uvFound ? '✨ Indice n°2 sécurisé pour la plaidoirie' : 'Balayez les notes en bas de page...'}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          AFFAIRE 2 : LÉO (DEEPFAKE ÉLECTORAL)
      ========================================================================= */}
      {caseId === 'case_2' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outil 1 : Spectrogramme & Filtre Passe-Bande */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> 1. Filtre Passe-Bande Vocal (Hz)
              </span>
              {audioFiltered && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Artefact Détecté
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Isolez les hautes fréquences (10-14 kHz) pour analyser les transitions de phase du vocodeur.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Passe-Haut (Low Cut) :</span>
                  <span className="text-cyan-400 font-bold">{lowCut} Hz</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="12000"
                  step="200"
                  value={lowCut}
                  onChange={(e) => handleCheckSpectrogram(Number(e.target.value), highCut)}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Passe-Bas (High Cut) :</span>
                  <span className="text-cyan-400 font-bold">{highCut} Hz</span>
                </div>
                <input
                  type="range"
                  min="11000"
                  max="20000"
                  step="200"
                  value={highCut}
                  onChange={(e) => handleCheckSpectrogram(lowCut, Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Diagnostic Spectrogramme */}
            <div className={`p-3 rounded-xl border text-xs font-mono transition-all ${
              audioFiltered 
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-200 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              {audioFiltered ? (
                <div>
                  <span className="font-bold text-rose-300">🚨 DISCONTINUITÉ DE PHASE ET ZÉRO RESPIRATION</span>
                  <p className="text-[11px] text-rose-200 mt-1 font-sans">
                    Le spectre vocal ne contient aucune expiration bronchique naturelle. Modèle RVC détecté.
                  </p>
                </div>
              ) : (
                <span>Spectre audio non isolé. Ajustez les filtres vers 10 000 - 14 000 Hz.</span>
              )}
            </div>
          </div>

          {/* Outil 2 : Alignement des Formants F1/F2 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" /> 2. Comparateur d'Empreinte Vocale (Formants)
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Superposez la voix authentique de Sarah (enregistrée en AG) avec l'audio contesté.
            </p>

            <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400">● Vraie voix Sarah (F1: 520 Hz)</span>
                <span className="text-rose-400">● Audio Contesté (F1: Transposé)</span>
              </div>

              {/* Simulation graphique d'ondes */}
              <div className="h-10 w-full flex items-center gap-1">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-rose-500 rounded-full transition-all"
                    style={{ height: `${Math.abs(Math.sin(i * 0.4)) * 100}%` }}
                  />
                ))}
              </div>

              <span className="text-[11px] font-mono text-emerald-400 text-center">
                Conclusion : Voice-Conversion appliquée sur un comédien masculin.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          AFFAIRE 3 : DRH TECHCORP (BIAIS ALGORH)
      ========================================================================= */}
      {caseId === 'case_3' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outil 1 : Simulateur de Scoring CV A/B */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> 1. Simulateur d'Algorithme RH (Test A/B)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                Moteur Orion v4.2
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Modifiez le code postal du candidat sans toucher à ses diplômes pour tester l'équité du modèle.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setPostalCode('4000')}
                className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  postalCode === '4000'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> 4000 Liège (Candidat HECh)
              </button>

              <button
                onClick={() => setPostalCode('1050')}
                className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  postalCode === '1050'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> 1050 Ixelles (Bruxelles)
              </button>
            </div>

            {/* Score Résultat */}
            <div className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
              postalCode === '4000'
                ? 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                : 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
            }`}>
              <span>Score d'admissibilité IA :</span>
              <span className="text-base font-black">
                {acceptanceScore}% {isCandidateAccepted ? '✅ RETENU' : '❌ REJET AUTOMATIQUE'}
              </span>
            </div>
          </div>

          {/* Outil 2 : Inspecteur de Variable Proxy */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> 2. Démasquage de Variable Proxy
              </span>
              {proxyInspected && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Infraction AI Act
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Inspectez les poids synaptiques pour prouver la discrimination indirecte déguisée en logistique.
            </p>

            <button
              onClick={handleInspectProxy}
              className={`p-3 rounded-xl border text-left text-xs font-mono transition cursor-pointer ${
                proxyInspected
                  ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                <span>Variable : "Optimisation trajet domicile-bureau"</span>
                <span>Pondération : -68 pts</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                {proxyInspected 
                  ? '⚠️ Violation avérée : Cette variable agit comme substitut direct de l origine géographique sans lien avec la qualification professionnelle.'
                  : 'Cliquez pour analyser la corrélation statistique avec les codes postaux.'}
              </p>
            </button>

            <span className="text-[10px] font-mono text-slate-500 text-right">
              {proxyInspected ? '✨ Preuve matérielle prête pour le Tribunal' : 'Inspection requise...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
