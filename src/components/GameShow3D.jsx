import { getAssetPath } from "../utils/assetPath";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Sparkles, Radio, Trophy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameShow3D - Studio TV Pixar Haute Fidélité SOTA (Option 1)
 * 
 * - Décor 100% raccord avec l'aperçu Pixar "Campus Challenge / Quiz Champ" :
 *   • Parquet en chevrons (herringbone) en chêne blond miel verni
 *   • Pupitre central galbé en bois noble avec le VRAI LOGO HECh officiel et gorge néon cyan
 *   • Deux pupitres candidats latéraux ("Quiz Champ!") avec candidats assis
 *   • Tribunes latérales en gradins avec public Pixar et cadreurs TV
 *   • Écran géant panoramique encadré d'une double arche néon dorée
 * - Calque 3D Three.js temps réel avec particules dorées flottantes et faisceaux volumétriques
 * - Parallaxe 3D fluide au curseur souris
 * - Réactions dynamiques (confettis, flashs lumineux, alertes) selon les réponses du joueur
 */
export default function GameShow3D({
  reaction = 'idle', // 'idle' | 'speaking' | 'correct' | 'wrong' | 'victory'
  theme = 'millionnaire',
  themeColor = '#38bdf8'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const reactionPrevRef = useRef(reaction);

  // Déclenchement des effets spectaculaires lors des victoires et bonnes réponses
  useEffect(() => {
    if (reactionPrevRef.current !== reaction) {
      if (reaction === 'correct' || reaction === 'victory') {
        confetti({
          particleCount: reaction === 'victory' ? 80 : 35,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#38bdf8', '#fbbf24', '#f59e0b', '#ec4899', '#a855f7']
        });
        try {
          if (sounds && sounds.correct) sounds.correct();
        } catch (e) {}
      } else if (reaction === 'wrong') {
        try {
          if (sounds && sounds.wrong) sounds.wrong();
        } catch (e) {}
      }
      reactionPrevRef.current = reaction;
    }
  }, [reaction]);

  // Calque d'effets 3D temps réel (Three.js : particules de poussière dorée & faisceaux studio)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particules de poussière dorée flottantes style cinéma Pixar
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      speeds[i] = 0.003 + Math.random() * 0.006;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Faisceaux de lumière volumétrique chaude orientés vers la scène
    const lightBeamGroup = new THREE.Group();
    const beamGeo = new THREE.ConeGeometry(0.85, 4.5, 16, 1, true);
    
    // Projecteur gauche
    const beamMatL = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const beamL = new THREE.Mesh(beamGeo, beamMatL);
    beamL.position.set(-2.8, 2.2, 0);
    beamL.rotation.z = -0.55;
    beamL.rotation.x = 0.2;
    lightBeamGroup.add(beamL);

    // Projecteur droit
    const beamMatR = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.035,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const beamR = new THREE.Mesh(beamGeo, beamMatR);
    beamR.position.set(2.8, 2.2, 0);
    beamR.rotation.z = 0.55;
    beamR.rotation.x = 0.2;
    lightBeamGroup.add(beamR);

    scene.add(lightBeamGroup);

    // Animation loop 60 FPS
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Flottement doux des particules dorées
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += speeds[i] * 0.45;
        pos[i * 3] += Math.sin(elapsed * 0.8 + i) * 0.002;
        if (pos[i * 3 + 1] > 2.5) {
          pos[i * 3 + 1] = -2.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Balancement subtil des projecteurs studio
      beamL.rotation.z = -0.55 + Math.sin(elapsed * 0.9) * 0.04;
      beamR.rotation.z = 0.55 + Math.cos(elapsed * 0.8) * 0.04;

      // Réaction d'intensité selon l'état du jeu
      if (reaction === 'correct' || reaction === 'victory') {
        particleMat.opacity = 0.85;
        beamMatL.opacity = 0.08 + Math.sin(elapsed * 8) * 0.03;
        beamMatR.opacity = 0.08 + Math.cos(elapsed * 8) * 0.03;
      } else if (reaction === 'wrong') {
        particleMat.opacity = 0.3;
        beamMatL.opacity = 0.02;
        beamMatR.opacity = 0.02;
      } else {
        particleMat.opacity = 0.55;
        beamMatL.opacity = 0.04;
        beamMatR.opacity = 0.035;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw && nh) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      beamGeo.dispose();
      beamMatL.dispose();
      beamMatR.dispose();
    };
  }, [reaction]);

  // Gestion du suivi de la souris pour la parallaxe immersive
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full relative select-none overflow-hidden bg-slate-950 flex items-center justify-center"
      style={{ minHeight: '300px' }}
    >
      {/* 1. Backdrop Studio Pixar Ultra-HD SOTA (Pixel-Perfect avec VRAI LOGO HECh) */}
      <div 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${mouseOffset.x * 14}px, ${mouseOffset.y * 10}px, 0) scale(1.04)`,
          transformOrigin: 'center center'
        }}
      >
        <img 
          src={getAssetPath('/images/pixar_studio_arena_2k.webp')}
          alt="Studio TV Pixar HECh - Campus Challenge"
          className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.03]"
        />

        {/* Halo d'ambiance dynamique selon le thème et la réaction */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: reaction === 'correct' || reaction === 'victory'
              ? 'radial-gradient(circle at 50% 40%, rgba(251, 191, 36, 0.20) 0%, rgba(234, 88, 12, 0.08) 50%, transparent 80%)'
              : reaction === 'wrong'
              ? 'radial-gradient(circle at 50% 40%, rgba(225, 29, 72, 0.22) 0%, transparent 70%)'
              : 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 65%)'
          }}
        />
      </div>

      {/* 2. Calque 3D Three.js Interactif (Poussière dorée & Spots) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. Badge Studio Broadcast "EN DIRECT · CAMPUS CHARLEMAGNE" */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 shadow-lg pointer-events-none">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-[11px] font-outfit font-black tracking-wider text-amber-300 uppercase">
          En Direct · Plateau HECh 4K
        </span>
      </div>

      {/* 4. Effet de célébration visuelle sur victoire / bonne réponse */}
      {(reaction === 'correct' || reaction === 'victory') && (
        <div className="absolute top-3 right-4 z-20 flex items-center gap-2 bg-emerald-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
            {reaction === 'victory' ? 'VICTOIRE ACADÉMIQUE !' : 'EXCELLENTE RÉPONSE !'}
          </span>
        </div>
      )}

      {/* 5. Effet visuel sur mauvaise réponse */}
      {reaction === 'wrong' && (
        <div className="absolute top-3 right-4 z-20 flex items-center gap-2 bg-rose-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/40 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-xs font-bold text-rose-200 uppercase tracking-wide">
            ERREUR ACADÉMIQUE
          </span>
        </div>
      )}
    </div>
  );
}
