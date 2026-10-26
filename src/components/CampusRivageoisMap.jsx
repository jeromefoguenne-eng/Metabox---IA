import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Scale, 
  Flame, 
  Zap, 
  CheckCircle2, 
  MapPin, 
  Radio, 
  Users, 
  Eye, 
  Compass,
  CornerDownRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * CampusRivageoisMap:
 * Plan architectural interactif 2.5D du Campus Les Rivageois (Liège)
 * Fidèle à la configuration réelle :
 * - Bâtiment Historique (Rue des Rivageois 6)
 * - Cour du "Vieux Hêtre" (Espace central de rencontre)
 * - Faille Vitrée & Liaison Galerie
 * - Nouvelle Aile R+6 (Angle Quai de Rome / Bord de Meuse)
 * - Salle des Délibérations & Sous-Sols Datacenter
 */
export default function CampusRivageoisMap({
  keysUnlocked = {},
  currentStage = 'hub',
  onSelectWing = () => {}
}) {
  const [hoveredWing, setHoveredWing] = useState(null);

  const WINGS_CONFIG = [
    {
      id: 'room_north',
      wingKey: 'north',
      code: 'AILE NORD · R+4',
      name: 'Labo de Fact-Checking & Deepfakes',
      location: 'Nouvelle Aile (Quai de Rome)',
      landmark: 'Vue sur la Meuse & Salles Multimédias',
      keyName: 'Clé Alpha (Esprit Critique)',
      icon: Search,
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      pos: { x: 480, y: 130, w: 220, h: 110 },
      isUnlocked: !!keysUnlocked.north,
      clue: "Analyse des hallucinations de citations et faux DOI dans les mémoires."
    },
    {
      id: 'room_west',
      wingKey: 'west',
      code: 'AILE OUEST · R+1',
      name: 'Tribunal Académique du Jury',
      location: 'Grand Auditoire Historique',
      landmark: 'Façade Rue des Rivageois',
      keyName: 'Clé Beta (Intégrité & Éthique)',
      icon: Scale,
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      pos: { x: 80, y: 220, w: 220, h: 120 },
      isUnlocked: !!keysUnlocked.west,
      clue: "Affaire Julien : Arbitrage entre copilotage méthodologique et fraude par délégation."
    },
    {
      id: 'room_south',
      wingKey: 'south',
      code: 'AILE SUD · SS-1',
      name: 'Sous-Sol : Datacenter & Climat',
      location: 'Sous-Sol Technique & Baie Serveurs',
      landmark: 'Accès Faille Vitrée / Rue de Fragnée',
      keyName: 'Clé Gamma (Sobriété & RGPD)',
      icon: Flame,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      pos: { x: 380, y: 390, w: 230, h: 110 },
      isUnlocked: !!keysUnlocked.south,
      clue: "Régulation thermique des serveurs, basculement SLM locaux et conformité RGPD."
    },
    {
      id: 'room_east',
      wingKey: 'east',
      code: 'AILE EST · RDC',
      name: "L'Arène des Réseaux : Prompt Wars",
      location: 'Cour du Vieux Hêtre & Cafétéria',
      landmark: 'Liaison Paysagère & Esplanade',
      keyName: 'Clé Delta (Maîtrise Algorithmique)',
      icon: Zap,
      color: 'from-pink-500 to-rose-600',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      pos: { x: 140, y: 440, w: 210, h: 110 },
      isUnlocked: !!keysUnlocked.east,
      clue: "Duel tactique de cartes de contraintes pour briser les bulles de filtres."
    }
  ];

  const allKeysFound = Object.values(keysUnlocked).filter(Boolean).length === 4;

  return (
    <div className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden text-white font-['Lexend']">
      
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
            </span>
            <div>
              <h3 className="font-['Outfit'] text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                PLAN D'ORIENTATION : CAMPUS LES RIVAGEOIS (LIÈGE)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Site Rue des Rivageois 6 · Faille Vitrée · Cour du Vieux Hêtre · Quai de Rome
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Progression : </span>
            <strong className="text-amber-400 font-bold">{Object.values(keysUnlocked).filter(Boolean).length} / 4 Clés</strong>
          </div>
        </div>
      </div>

      {/* SVG Interactive Blueprint Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] my-4 rounded-2xl bg-[#070d18] border border-cyan-900/40 shadow-inner overflow-hidden">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />

        {/* SVG Drawing of the Campus Topology */}
        <svg viewBox="0 0 800 580" className="w-full h-full">
          <defs>
            {/* Cyber Glow Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Architectural Hatching */}
            <pattern id="hatch-building" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#1e293b" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* 1. Surrounding Streets & River Meuse */}
          {/* River Meuse along Quai de Rome (Top-Right) */}
          <path d="M 680 0 L 800 0 L 800 240 L 730 200 Z" fill="#082f49" opacity="0.6" />
          <text x="740" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" transform="rotate(45, 740, 70)">
            ~ LA MEUSE (BORD DE MEUSE) ~
          </text>
          <text x="630" y="25" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">
            QUAI DE ROME
          </text>

          {/* Rue des Rivageois (Left Border) */}
          <line x1="45" y1="20" x2="45" y2="560" stroke="#1e293b" strokeWidth="18" strokeDasharray="6 4" />
          <text x="35" y="320" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="monospace" transform="rotate(-90, 35, 320)">
            RUE DES RIVAGEOIS (ENTRÉE N°6)
          </text>

          {/* Rue de Fragnée (Bottom Border) */}
          <line x1="20" y1="560" x2="780" y2="560" stroke="#1e293b" strokeWidth="14" />
          <text x="380" y="575" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            RUE DE FRAGNÉE (LIAISON ATHÉNÉE & GARE GUILLEMINS)
          </text>

          {/* 2. Central Courtyard: "Cour du Vieux Hêtre" */}
          <ellipse cx="280" cy="340" rx="110" ry="65" fill="#064e3b" opacity="0.45" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Symbol of the Venerable Beech Tree */}
          <circle cx="280" cy="340" r="22" fill="#047857" opacity="0.7" />
          <text x="280" y="344" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="middle">
            🌳
          </text>
          <text x="280" y="375" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            COUR DU VIEUX HÊTRE
          </text>

          {/* 3. The Glass Joint: "Faille Vitrée" Connector */}
          <rect x="360" y="240" width="80" height="90" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="400" y="285" fill="#bae6fd" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-45, 400, 285)">
            FAILLE VITRÉE
          </text>

          {/* 4. Connection Lines between Hub and Wings */}
          <path d="M 400 240 L 480 180" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          <path d="M 360 270 L 300 270" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          <path d="M 400 330 L 460 390" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          <path d="M 370 330 L 260 440" stroke="#fb7185" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />

          {/* 5. Central Grand Amphithéâtre / Salle des Délibérations (BOSS HUB) */}
          <g 
            onClick={() => {
              if (allKeysFound) {
                sounds.playPop();
                onSelectWing('boss');
              } else {
                sounds.playBuzzer();
              }
            }}
            className={`cursor-pointer transition duration-300 ${allKeysFound ? 'animate-pulse' : 'opacity-85'}`}
          >
            <rect 
              x="330" 
              y="120" 
              width="130" 
              height="100" 
              rx="16" 
              fill={allKeysFound ? "#f59e0b" : "#0f172a"} 
              opacity={allKeysFound ? "0.9" : "0.95"} 
              stroke={allKeysFound ? "#fbbf24" : "#475569"} 
              strokeWidth={allKeysFound ? "3" : "1.5"}
              filter={allKeysFound ? "url(#glow-gold)" : undefined}
            />
            <text x="395" y="155" fill={allKeysFound ? "#0f172a" : "#f1f5f9"} fontSize="16" textAnchor="middle">
              🏛️
            </text>
            <text x="395" y="178" fill={allKeysFound ? "#0f172a" : "#94a3b8"} fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
              AMPHI DU JURY
            </text>
            <text x="395" y="196" fill={allKeysFound ? "#0f172a" : (allKeysFound ? "#10b981" : "#ef4444")} fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {allKeysFound ? "DÉVERROUILLÉ !" : "VERROUILLÉ (4 CLÉS)"}
            </text>
          </g>

          {/* 6. The 4 Interactive Campus Wings Nodes */}
          {WINGS_CONFIG.map((wing) => {
            const isHovered = hoveredWing === wing.id;
            const isKeyFound = wing.isUnlocked;

            return (
              <g 
                key={wing.id}
                onClick={() => {
                  sounds.playPop();
                  onSelectWing(wing.id);
                }}
                onMouseEnter={() => setHoveredWing(wing.id)}
                onMouseLeave={() => setHoveredWing(null)}
                className="cursor-pointer group"
              >
                {/* Building Footprint Box */}
                <rect 
                  x={wing.pos.x} 
                  y={wing.pos.y} 
                  width={wing.pos.w} 
                  height={wing.pos.h} 
                  rx="18"
                  fill={isKeyFound ? "#064e3b" : isHovered ? "#1e293b" : "#0f172a"}
                  stroke={isKeyFound ? "#10b981" : isHovered ? "#38bdf8" : "#334155"}
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  opacity="0.95"
                  className="transition-all duration-200"
                  filter={isHovered ? "url(#glow-cyan)" : undefined}
                />

                {/* Status Indicator Icon */}
                <circle 
                  cx={wing.pos.x + 28} 
                  cy={wing.pos.y + 28} 
                  r="14" 
                  fill={isKeyFound ? "#10b981" : "#1e293b"} 
                  stroke={isKeyFound ? "#6ee7b7" : "#475569"} 
                  strokeWidth="1.5" 
                />
                <text x={wing.pos.x + 28} y={wing.pos.y + 32} fill="#ffffff" fontSize="11" textAnchor="middle">
                  {isKeyFound ? "✓" : "⚡"}
                </text>

                {/* Wing Code & Level */}
                <text x={wing.pos.x + 50} y={wing.pos.y + 26} fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {wing.code}
                </text>

                {/* Wing Name */}
                <text x={wing.pos.x + 14} y={wing.pos.y + 60} fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  {wing.name.length > 26 ? wing.name.substring(0, 24) + "..." : wing.name}
                </text>

                {/* Campus Location info */}
                <text x={wing.pos.x + 14} y={wing.pos.y + 78} fill="#38bdf8" fontSize="9" fontFamily="monospace">
                  📍 {wing.location}
                </text>

                {/* Action button inside SVG */}
                <rect 
                  x={wing.pos.x + 14} 
                  y={wing.pos.y + 86} 
                  width={wing.pos.w - 28} 
                  height="16" 
                  rx="6" 
                  fill={isKeyFound ? "#047857" : "#2563eb"} 
                  opacity="0.85" 
                />
                <text 
                  x={wing.pos.x + (wing.pos.w / 2)} 
                  y={wing.pos.y + 98} 
                  fill="#ffffff" 
                  fontSize="8" 
                  fontWeight="bold" 
                  fontFamily="monospace" 
                  textAnchor="middle"
                >
                  {isKeyFound ? "RÉGION SÉCURISÉE" : "INFILTRER L'AILE →"}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Active Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <strong className="text-white block font-bold">
                {hoveredWing ? WINGS_CONFIG.find(w => w.id === hoveredWing)?.name : "Explorez le campus Les Rivageois"}
              </strong>
              <span className="text-[11px] text-slate-400">
                {hoveredWing ? WINGS_CONFIG.find(w => w.id === hoveredWing)?.clue : "Cliquez sur une aile du campus pour démarrer son mini-jeu interactif dédié."}
              </span>
            </div>
          </div>

          {allKeysFound ? (
            <button
              onClick={() => onSelectWing('boss')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase animate-bounce cursor-pointer shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Rejoindre la Délibération Finale !
            </button>
          ) : (
            <span className="text-[11px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30">
              Objectif : 4 Clés d'Intégrité
            </span>
          )}
        </div>

      </div>

      {/* Campus Rivageois Historical Note */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-center justify-between">
        <span>
          🏫 <strong>Repère Campus HECh</strong> : L'organisation du site articule le bâtiment historique (entrée n°6) avec la nouvelle aile contemporaine en R+6 bordant la Meuse et la cour arborée du Vieux Hêtre.
        </span>
        <span className="font-mono text-cyan-400 font-bold ml-2">Liège · Rivageois</span>
      </div>

    </div>
  );
}
