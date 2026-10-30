/**
 * Système Canonique des Personnages de Métabox IA (Haute École Charlemagne)
 * Assure la cohérence narrative et visuelle stricte à travers tous les jeux et modules :
 * - Le Tribunal (L'Affaire Maxime)
 * - L'Escape Game AURORE
 * - Les Émissions TV (Qui veut gagner des Crédits ? / Questions pour un Major)
 * - Le Lab de Fact-Checking & Détection de Deepfakes
 */

export const CANONICAL_CHARACTERS = {
  maxime: {
    id: 'maxime',
    name: 'Maxime',
    fullName: 'Maxime Lambert',
    title: 'Étudiant en Bloc 1 (Bachelier FWB)',
    role: 'Accusé & Apprenant au Cœur de l\'Affaire',
    age: '20 ans',
    campus: 'Campus Rivageois (Liège)',
    traits: 'Brun aux yeux expressifs, veste casual chic bordeaux/bleue, curieux mais débordé par la facilité des requêtes IA sans esprit critique.',
    colors: {
      primary: '#f59e0b', // Amber
      badge: 'border-amber-400/60 bg-amber-500/10 text-amber-300',
      gradient: 'from-amber-500 to-rose-600',
      ring: 'ring-amber-400'
    },
    svgAvatar: (size = 48) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#f59e0b" stroke-width="3"/>
        <!-- Buste Veste Bordeaux -->
        <path d="M22 92 C26 70, 36 65, 50 65 C64 65, 74 70, 78 92 Z" fill="#881337"/>
        <path d="M42 65 L50 82 L58 65 Z" fill="#f8fafc"/>
        <path d="M48 72 L50 92 L52 72 Z" fill="#0284c7"/>
        <!-- Cou & Visage -->
        <rect x="44" y="52" width="12" height="15" fill="#fcd34d" rx="4"/>
        <ellipse cx="50" cy="42" rx="20" ry="24" fill="#fed7aa"/>
        <!-- Pommettes rosées -->
        <circle cx="38" cy="46" r="4" fill="#fb7185" opacity="0.4"/>
        <circle cx="62" cy="46" r="4" fill="#fb7185" opacity="0.4"/>
        <!-- Yeux expressifs -->
        <ellipse cx="42" cy="40" rx="3.5" ry="4.5" fill="#451a03"/>
        <ellipse cx="58" cy="40" rx="3.5" ry="4.5" fill="#451a03"/>
        <circle cx="43.5" cy="38.5" r="1.2" fill="#ffffff"/>
        <circle cx="59.5" cy="38.5" r="1.2" fill="#ffffff"/>
        <!-- Sourcils -->
        <path d="M37 34 Q42 32 46 34" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
        <path d="M54 34 Q58 32 63 34" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
        <!-- Nez & Sourire franc -->
        <path d="M49 42 Q50 46 48 47" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M44 51 Q50 56 56 51" stroke="#991b1b" stroke-width="2" stroke-linecap="round"/>
        <!-- Chevelure Brune Stylisée -->
        <path d="M28 36 C28 20, 42 16, 52 16 C66 16, 72 22, 72 36 C72 30, 68 24, 52 24 C38 24, 30 30, 28 36 Z" fill="#381c0d"/>
        <path d="M32 25 Q45 15 65 22 Q52 18 36 26" fill="#522915"/>
      </svg>
    `
  },

  aurore: {
    id: 'aurore',
    name: 'A.U.R.O.R.E.',
    fullName: 'A.U.R.O.R.E. (Tutrice IA & Pédagogue)',
    title: 'Intelligence Pédagogique & Guide de l\'Apprenant',
    role: 'Hôte de l\'Escape Game & Directrice des Épreuves',
    age: '30 ans (incarnation symbolique)',
    campus: 'Haute École Charlemagne',
    traits: 'Femme blonde charismatique portant d\'élégantes lunettes de vue rectangulaires, blazer bleu marine HECh officiel avec broche dorée, tablette tactile interactive en main.',
    colors: {
      primary: '#06b6d4', // Cyan
      badge: 'border-cyan-400/60 bg-cyan-500/10 text-cyan-300',
      gradient: 'from-cyan-500 to-indigo-600',
      ring: 'ring-cyan-400'
    },
    svgAvatar: (size = 48) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#06b6d4" stroke-width="3"/>
        <!-- Buste Blazer Bleu Marine HECh -->
        <path d="M20 92 C24 68, 35 64, 50 64 C65 64, 76 68, 80 92 Z" fill="#1e293b"/>
        <path d="M44 64 L50 80 L56 64 Z" fill="#f8fafc"/>
        <!-- Broche Officielle HECh en or -->
        <circle cx="34" cy="74" r="3.5" fill="#eab308" stroke="#fef08a" stroke-width="1"/>
        <!-- Cou & Visage -->
        <rect x="45" y="52" width="10" height="15" fill="#fde68a" rx="4"/>
        <ellipse cx="50" cy="41" rx="19" ry="23" fill="#fef08a" opacity="0.95"/>
        <!-- Chevelure Blonde Lumineuse avec Raie -->
        <path d="M26 38 C25 18, 42 14, 52 14 C70 14, 75 22, 75 42 C72 32, 65 24, 50 24 C36 24, 28 32, 26 38 Z" fill="#facc15"/>
        <path d="M26 38 C28 52, 33 58, 35 62 C33 54, 30 46, 30 38 Z" fill="#eab308"/>
        <path d="M74 38 C72 52, 67 58, 65 62 C67 54, 70 46, 70 38 Z" fill="#eab308"/>
        <!-- Lunettes Élégantes Stylisées -->
        <rect x="33" y="36" width="14" height="10" rx="2" fill="none" stroke="#0ea5e9" stroke-width="2"/>
        <rect x="53" y="36" width="14" height="10" rx="2" fill="none" stroke="#0ea5e9" stroke-width="2"/>
        <line x1="47" y1="41" x2="53" y2="41" stroke="#0ea5e9" stroke-width="2"/>
        <!-- Yeux vifs bleu-vert -->
        <ellipse cx="40" cy="41" rx="2.5" ry="3" fill="#0284c7"/>
        <ellipse cx="60" cy="41" rx="2.5" ry="3" fill="#0284c7"/>
        <circle cx="41" cy="40" r="1" fill="#ffffff"/>
        <circle cx="61" cy="40" r="1" fill="#ffffff"/>
        <!-- Sourire bienveillant -->
        <path d="M45 52 Q50 56 55 52" stroke="#be123c" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },

  juge: {
    id: 'juge',
    name: 'Président Vandamme',
    fullName: 'Magistrat Doyen H. Vandamme',
    title: 'Président du Tribunal Académique d\'Honneur',
    role: 'Juge Suprême de la Déontologie & du Droit Numérique',
    age: '62 ans',
    campus: 'Tribunal d\'Honneur • Salle d\'Audience Magistrale',
    traits: 'Doyen respecté, cheveux blancs gominés, lunettes d\'or rondes, toge magistrale noire bordée d\'un col d\'hermine blanc moucheté et jabot blanc plissé. Fait autorité avec son marteau de chêne.',
    colors: {
      primary: '#ef4444', // Red / Crimson
      badge: 'border-rose-400/60 bg-rose-500/10 text-rose-300',
      gradient: 'from-slate-800 via-rose-950 to-slate-900',
      ring: 'ring-rose-500'
    },
    svgAvatar: (size = 48) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#18181b" stroke="#e11d48" stroke-width="3"/>
        <!-- Toge Noire Magistrale -->
        <path d="M18 94 C22 66, 32 60, 50 60 C68 60, 78 66, 82 94 Z" fill="#09090b"/>
        <!-- Col d'Hermine Blanc Moucheté -->
        <ellipse cx="50" cy="66" rx="24" ry="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="34" cy="66" r="1.5" fill="#09090b"/>
        <circle cx="42" cy="68" r="1.5" fill="#09090b"/>
        <circle cx="50" cy="69" r="1.5" fill="#09090b"/>
        <circle cx="58" cy="68" r="1.5" fill="#09090b"/>
        <circle cx="66" cy="66" r="1.5" fill="#09090b"/>
        <!-- Rabat / Jabot plissé blanc -->
        <path d="M45 68 L50 86 L55 68 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <!-- Collier d'Office et Médaille d'Or HECh -->
        <path d="M38 72 Q50 82 62 72" stroke="#eab308" stroke-width="2" fill="none"/>
        <circle cx="50" cy="84" r="4" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
        <!-- Tête Vénérable -->
        <ellipse cx="50" cy="41" rx="19" ry="22" fill="#fed7aa"/>
        <!-- Moustache Blanche Taillée -->
        <path d="M42 50 Q50 48 58 50 Q50 54 42 50 Z" fill="#f1f5f9"/>
        <!-- Cheveux Blancs Dignes sur les Côtés -->
        <path d="M28 32 C26 22, 34 16, 50 16 C66 16, 74 22, 72 32 C74 44, 72 50, 68 52 C70 42, 68 28, 50 28 C32 28, 30 42, 32 52 C28 50, 26 44, 28 32 Z" fill="#f1f5f9"/>
        <!-- Lunettes rondes en or -->
        <circle cx="41" cy="39" r="6" stroke="#eab308" stroke-width="2" fill="none"/>
        <circle cx="59" cy="39" r="6" stroke="#eab308" stroke-width="2" fill="none"/>
        <line x1="47" y1="39" x2="53" y2="39" stroke="#eab308" stroke-width="2"/>
        <!-- Regard Sévère mais Juste -->
        <ellipse cx="41" cy="39" rx="2" ry="2.5" fill="#1e293b"/>
        <ellipse cx="59" cy="39" rx="2" ry="2.5" fill="#1e293b"/>
        <!-- Sourcils broussailleux blancs -->
        <path d="M36 32 Q41 30 46 32" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
        <path d="M54 32 Q59 30 64 32" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `
  },

  procureur: {
    id: 'procureur',
    name: 'Me Vasseur',
    fullName: 'Procureur V. Vasseur',
    title: 'Accusateur Public • Commission d\'Intégrité Académique',
    role: 'Porte-Parole de l\'Accusation & Traque des Plagiats',
    age: '45 ans',
    campus: 'Auditorat Central',
    traits: 'Avocat rigide aux cheveux noirs lissés, toge sombre avec écharpe pourpre, doigt accusateur souvent tendu vers la barre pour dénoncer les dérives du prompt assisté.',
    colors: {
      primary: '#9333ea', // Purple
      badge: 'border-purple-400/60 bg-purple-500/10 text-purple-300',
      gradient: 'from-slate-900 to-purple-950',
      ring: 'ring-purple-500'
    },
    svgAvatar: (size = 48) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#09090b" stroke="#9333ea" stroke-width="3"/>
        <!-- Toge Noire avec Étole Pourpre -->
        <path d="M20 92 C24 66, 34 62, 50 62 C66 62, 76 66, 80 92 Z" fill="#18181b"/>
        <path d="M42 62 L50 92 L58 62 Z" fill="#581c87"/>
        <path d="M46 62 L50 78 L54 62 Z" fill="#ffffff"/>
        <!-- Tête Angulaire -->
        <ellipse cx="50" cy="40" rx="18" ry="22" fill="#fed7aa"/>
        <!-- Cheveux Noirs Plaques en Arrière -->
        <path d="M30 30 C30 18, 42 15, 50 15 C58 15, 70 18, 70 30 C70 24, 62 20, 50 20 C38 20, 30 24, 30 30 Z" fill="#0f172a"/>
        <!-- Sourcils Inquisiteurs -->
        <path d="M38 34 L46 37" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M62 34 L54 37" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Yeux perçants -->
        <ellipse cx="42" cy="40" rx="3" ry="2" fill="#0f172a"/>
        <ellipse cx="58" cy="40" rx="3" ry="2" fill="#0f172a"/>
        <!-- Lèvres serrées -->
        <line x1="45" y1="52" x2="55" y2="52" stroke="#881337" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  }
};
