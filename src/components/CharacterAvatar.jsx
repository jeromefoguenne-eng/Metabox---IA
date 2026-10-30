import React from 'react';
import { CANONICAL_CHARACTERS } from '../utils/charactersData';

/**
 * Composant Avatar Canonique Unifié de Métabox IA
 * Garantit la cohérence visuelle stricte entre les scènes 3D et les interfaces 2D.
 */
export default function CharacterAvatar({ 
  characterId = 'maxime', 
  size = 48,
  showBadge = false,
  className = ''
}) {
  const char = CANONICAL_CHARACTERS[characterId] || CANONICAL_CHARACTERS.maxime;

  return (
    <div className={`relative inline-flex items-center gap-3 shrink-0 ${className}`}>
      {/* Avatar Container avec halo de couleur */}
      <div 
        className="relative rounded-2xl overflow-hidden p-0.5 shadow-md flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        <div 
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: char.svgAvatar(size) }}
        />
      </div>

      {/* Badge textuel optionnel */}
      {showBadge && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-black font-['Outfit'] text-white flex items-center gap-1.5">
            {char.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
            {char.role}
          </span>
        </div>
      )}
    </div>
  );
}
