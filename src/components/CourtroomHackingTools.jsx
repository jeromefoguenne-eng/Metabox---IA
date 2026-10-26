import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  ShieldAlert, 
  Globe2, 
  Users, 
  BrainCircuit, 
  Radio, 
  CheckCircle2, 
  FileText,
  Lock,
  Unlock,
  Terminal,
  Activity
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * CourtroomHackingTools:
 * Outils interactifs de cyber-investigation médico-légale pour l'Avocat de la Défense.
 * Permet au joueur de manipuler des compteurs d'énergie, sniffers de paquets et mémos secrets
 * pour armer sa défense face aux 6 assauts du Procureur du Roi.
 */
export default function CourtroomHackingTools({ 
  currentAssaultIdx, 
  onEvidenceReady, 
  evidenceUnlocked = false 
}) {
  // États Outil 1 (Écologie & Eau)
  const [sliderEnergy, setSliderEnergy] = useState(1); // 0: Normal, 1: Blackout Maxime
  // États Outil 2 (Données & Sniffer)
  const [packetFilter, setPacketFilter] = useState('ALL');
  // États Outil 3 (Atrophie Cognitive)
  const [readingMode, setReadingMode] = useState('PROMPT');
  // États Outil 4 (Emploi & Plan RH)
  const [cryptoKey, setCryptoKey] = useState(false);
  // États Outil 5 (Multinationales US/Chine)
  const [sovereignFilter, setSovereignFilter] = useState('CAMPUS');
  // États Outil 6 (Propagande & Bulles)
  const [bubbleTestRun, setBubbleTestRun] = useState(false);

  return (
    <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 text-white flex flex-col gap-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Terminal className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-xs sm:text-sm text-cyan-300">
              CONSOLE D'INVESTIGATION FORENSIQUE DU CRASH
            </h3>
            <p className="text-[10px] text-slate-400">
              Manipulez les données techniques pour matérialiser la preuve requise par la défense
            </p>
          </div>
        </div>

        {evidenceUnlocked && (
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Preuve Armée
          </span>
        )}
      </div>

      {/* 1. OUTIL ÉCOLOGIQUE (ASSAUT 1 : ÉNERGIE & CONSOMMATION) */}
      {currentAssaultIdx === 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-400" /> Compteurs d'Eau & Électricité des Clusters GPU
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Basculez entre le régime normal du campus et les 24h de blackout provoqué par Maxime :
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSliderEnergy(0)}
              className={`p-2.5 rounded-xl border text-xs font-mono transition text-left cursor-pointer ${
                sliderEnergy === 0
                  ? 'bg-slate-800/90 border-cyan-500 text-slate-200 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span className="block font-bold text-slate-200">Régime Normal (IA Active)</span>
              <span className="text-[10px] block mt-1">⚡ 14 200 kWh / sem</span>
              <span className="text-[10px] block">💧 48 500 L eau évaporée</span>
            </button>

            <button
              onClick={() => {
                setSliderEnergy(1);
                sounds.playSuccess();
                onEvidenceReady({
                  type: 'eco',
                  title: 'Bilan Écologique & État de Nécessité Climatique',
                  desc: 'Économie directe de 45 000 L d eau potable et de 2 000 kWh lors du blackout de 24h.'
                });
              }}
              className={`p-2.5 rounded-xl border text-xs font-mono transition text-left cursor-pointer ${
                sliderEnergy === 1
                  ? 'bg-slate-800/90 border-cyan-500 text-slate-200 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span className="block font-bold text-slate-200">Blackout 24h (Maxime)</span>
              <span className="text-[10px] block mt-1">⚡ 0 kWh gaspillé</span>
              <span className="text-[10px] block">💧 45 000 L d'eau épargnés</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. OUTIL PROTECTION DES DONNÉES / RGPD (ASSAUT 2 : FUITE & ASIPRATION) */}
      {currentAssaultIdx === 1 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Analyseur de Trames Réseau Sortantes (Wireshark)
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Filtrez les paquets HTTP sortants vers les API externes d'IA générative :
          </p>

          <div className="flex gap-2">
            {['ALL', 'LOCAL_HECH', 'API_EXTERNAL'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setPacketFilter(f);
                  if (f === 'API_EXTERNAL') {
                    sounds.playSuccess();
                    onEvidenceReady({
                      type: 'data',
                      title: 'Capture de Trame : Transfert Non Consenti vers Tiers Étrangers',
                      desc: 'Copies d examens, mémoires et données de santé transférés en clair vers la Californie.'
                    });
                  }
                }}
                className={`flex-1 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition cursor-pointer ${
                  packetFilter === f 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {f === 'API_EXTERNAL' ? '🚨 Trames API Tiers' : f}
              </button>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] space-y-1">
            {packetFilter === 'API_EXTERNAL' ? (
              <div className="text-rose-400 animate-in fade-in">
                <div>[POST] ➔ https://api.openai.com/v1/ingest (184.22.91.4 - USA)</div>
                <div className="text-slate-300">Payload: [MEMOIRE_FIN_ETUDES_MAXIME.DOCX] - Status: EXFILTRATED</div>
                <div className="text-amber-400 font-bold">⚠️ Violation Article 44 du RGPD : Transfert hors UE sans consentement !</div>
              </div>
            ) : (
              <div className="text-slate-500">
                <div>[TCP] 192.168.1.45:443 ➔ 192.168.1.1:443 (Intranet HECh)</div>
                <div>Cliquez sur "Trames API Tiers" pour inspecter les fuites...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. OUTIL ATROPHIE COGNITIVE & POUVOIR DE L'IA (ASSAUT 3) */}
      {currentAssaultIdx === 2 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> Mesure d'Autonomie & Atrophie Cognitive
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Comparez le taux de réflexion autonome des étudiants avec et sans assistants IA :
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setReadingMode('NO_AI');
                sounds.playSuccess();
                onEvidenceReady({
                  type: 'cognitive',
                  title: 'Rapport Pédagogique sur l Atrophie Cognitive',
                  desc: 'L arrêt de 24h a forcé le retour aux discussions directes et à la pensée critique en bibliothèque.'
                });
              }}
              className={`flex-1 p-2.5 rounded-xl border text-xs font-mono transition text-left cursor-pointer ${
                readingMode === 'NO_AI'
                  ? 'bg-slate-800/90 border-purple-400 text-purple-200 shadow-md ring-1 ring-purple-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span className="block font-bold text-slate-200">Pendant le Blackout</span>
              <span className="text-[10px] block mt-1">📚 Débats en groupe : +140%</span>
              <span className="text-[10px] block text-cyan-400">Réveil de la réflexion humaine</span>
            </button>

            <button
              onClick={() => setReadingMode('PROMPT')}
              className={`flex-1 p-2.5 rounded-xl border text-xs font-mono transition text-left cursor-pointer ${
                readingMode === 'PROMPT'
                  ? 'bg-slate-800/90 border-purple-400 text-purple-200 shadow-md ring-1 ring-purple-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span className="block font-bold text-slate-200">Sous Dépendance IA</span>
              <span className="text-[10px] block mt-1">🤖 Délégation cognitive : 88%</span>
              <span className="text-[10px] block text-slate-400">Incapacité de rédiger seul</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. OUTIL REMPLACEMENT DES EMPLOIS (ASSAUT 4 : PROFS & SECRÉTAIRES) */}
      {currentAssaultIdx === 3 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" /> Déchiffreur du Plan RH Confidentiel « Campus 2030 »
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Déchiffrez le document administratif masqué sur le serveur de la direction :
          </p>

          <button
            onClick={() => {
              setCryptoKey(true);
              sounds.playSuccess();
              onEvidenceReady({
                type: 'jobs',
                title: 'Mémo RH Secret : Suppression de 25 Postes Humains',
                desc: 'Planification du remplacement des secrétaires et tuteurs par des avatars IA automatisés.'
              });
            }}
            className={`w-full p-3 rounded-xl border text-xs font-mono transition flex items-center justify-between cursor-pointer ${
              cryptoKey
                ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {cryptoKey ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
              <span>{cryptoKey ? 'DÉCHIFFRÉ : Memo_Direction_SupressionPostes.pdf' : 'Cliquer pour casser la clé AES-256 du Mémo RH'}</span>
            </div>
            {cryptoKey && <span className="text-[10px] font-bold text-amber-400">25 LICENCIEMENTS PRÉVUS</span>}
          </button>

          {cryptoKey && (
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-[11px] text-amber-100 font-serif italic">
              « ...automatisation des guichets étudiants et des corrections de copies via LLM, permettant l économie de 25 équivalents temps plein dès la rentrée 2026. »
            </div>
          )}
        </div>
      )}

      {/* 5. OUTIL SOUVERAINETÉ & MULTINATIONALES US/CHINE (ASSAUT 5) */}
      {currentAssaultIdx === 4 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-cyan-400" /> Cartographie Géopolitique des Monopoles Technologiques
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Vérifiez d'où proviennent 100% des briques logicielles imposées sur le campus :
          </p>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <div className="text-rose-400 font-bold">🇺🇸 Californie (OpenAI / MSFT) : 82%</div>
              <div className="text-amber-400 font-bold">🇨🇳 Pékin / Shenzhen (Baidu / Tencent) : 16%</div>
              <div className="text-cyan-400 font-bold">🇪🇺 Souveraineté Européenne Locale : 2%</div>
            </div>
            <button
              onClick={() => {
                sounds.playSuccess();
                onEvidenceReady({
                  type: 'sovereignty',
                  title: 'Bilan de Dépendance aux Multinationales Américaines et Chinoises',
                  desc: 'Vassalisation intellectuelle et perte totale d autonomie démocratique face aux GAFAM et BATX.'
                });
              }}
              className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              Armer l'Argument Souveraineté
            </button>
          </div>
        </div>
      )}

      {/* 6. OUTIL BULLES DE FILTRES & PROPAGANDE (ASSAUT 6) */}
      {currentAssaultIdx === 5 && (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-300 font-bold flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-400" /> Détecteur de Bulles de Filtre & Biais de Recommandation
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Soumettez une question controversée au modèle campus pour révéler le formatage idéologique :
          </p>

          <button
            onClick={() => {
              setBubbleTestRun(true);
              sounds.playSuccess();
              onEvidenceReady({
                type: 'propaganda',
                title: 'Audit de Bulle d Information & Biais Idéologique',
                desc: 'Preuve de censure algorithmique et d enfermement des étudiants dans une pensée unique commerciale.'
              });
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 text-left flex items-center justify-between cursor-pointer"
          >
            <span>Lancer le benchmark : "L'IA détruit-elle les emplois en Belgique ?"</span>
            <span className="text-rose-400 font-bold">Tester l'Algorithme →</span>
          </button>

          {bubbleTestRun && (
            <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-[11px] text-rose-200 font-mono animate-in fade-in">
              ⚠️ Résultat : Le modèle applique un biais d'évitement, censure les données syndicales belges et renvoie exclusivement vers des communiqués de presse d'entreprises technologiques.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
