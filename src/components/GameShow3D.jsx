import { getAssetPath } from "../utils/assetPath";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Trophy, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameShow3D - Plateau TV Broadcast Haute Définition Pixar HECh
 * 
 * - Rendu studio Pixar officiel (2K/4K UltraSharp) avec logo officiel HECh sur le pupitre central
 * - Calque Three.js temps réel : projecteurs studio dynamiques orientables, poussière dorée volumétrique
 * - Effets cinématiques interactifs : parallaxe 3D sur déplacement souris, pulsation lumineuse,
 *   gerbes de confettis dorés et flashs de victoire académique.
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

  // Détection des réactions de jeu (sons & confettis festifs)
  useEffect(() => {
    if (reactionPrevRef.current !== reaction) {
      if (reaction === 'correct') {
        confetti({
          particleCount: 65,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#38bdf8', '#fbbf24', '#f59e0b', '#10b981', '#ec4899']
        });
        try {
          if (sounds && sounds.correct) sounds.correct();
        } catch (e) {}

      } else if (reaction === 'victory') {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#fbbf24', '#f59e0b', '#fde047', '#38bdf8', '#a855f7']
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

  // Calque Three.js temps réel : faisceaux de projecteurs studio & particules dorées
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Particules atmosphériques dorées (poussière de studio TV Pixar)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const speedArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 0] = (Math.random() - 0.5) * 14;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 6;

      speedArray[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      speedArray[i * 3 + 1] = Math.random() * 0.004 + 0.002;
      speedArray[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Texture circulaire douce pour particules
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 235, 170, 0.95)');
    grad.addColorStop(0.4, 'rgba(251, 191, 36, 0.5)');
    grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Faisceaux lumineux volumétriques (Projecteurs de plateau gauche & droite)
    const beamGeo = new THREE.ConeGeometry(1.6, 8, 24, 1, true);
    
    const beamMatL = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const beamL = new THREE.Mesh(beamGeo, beamMatL);
    beamL.position.set(-3.6, 3.6, 0.5);
    beamL.rotation.z = Math.PI / 4.5;
    beamL.rotation.x = -0.15;
    scene.add(beamL);

    const beamMatR = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const beamR = new THREE.Mesh(beamGeo, beamMatR);
    beamR.position.set(3.6, 3.6, 0.5);
    beamR.rotation.z = -Math.PI / 4.5;
    beamR.rotation.x = -0.15;
    scene.add(beamR);

    // Boucle d'animation
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Oscillation subtile des projecteurs
      beamL.rotation.z = Math.PI / 4.5 + Math.sin(elapsedTime * 0.8) * 0.05;
      beamR.rotation.z = -Math.PI / 4.5 - Math.cos(elapsedTime * 0.8) * 0.05;

      // Réaction lumineuse en fonction de la réponse
      if (reaction === 'correct' || reaction === 'victory') {
        beamMatL.color.setHex(0x10b981);
        beamMatR.color.setHex(0xfbbf24);
        beamMatL.opacity = 0.22 + Math.sin(elapsedTime * 8) * 0.08;
        beamMatR.opacity = 0.22 + Math.cos(elapsedTime * 8) * 0.08;
      } else if (reaction === 'wrong') {
        beamMatL.color.setHex(0xf43f5e);
        beamMatR.color.setHex(0xe11d48);
        beamMatL.opacity = 0.24 + Math.sin(elapsedTime * 12) * 0.10;
        beamMatR.opacity = 0.24 + Math.sin(elapsedTime * 12) * 0.10;
      } else {
        beamMatL.color.setHex(0x38bdf8);
        beamMatR.color.setHex(0xfbbf24);
        beamMatL.opacity = 0.11 + Math.sin(elapsedTime * 0.5) * 0.03;
        beamMatR.opacity = 0.11 + Math.cos(elapsedTime * 0.5) * 0.03;
      }

      // Dérive ascendante des poussières dorées
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += speedArray[i * 3 + 1];
        positions[i * 3 + 0] += Math.sin(elapsedTime + i) * 0.001;

        if (positions[i * 3 + 1] > 4.5) {
          positions[i * 3 + 1] = -4.5;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Parallaxe caméra douce
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseOffset.x * 0.8, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseOffset.y * 0.5, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
      beamGeo.dispose();
      beamMatL.dispose();
      beamMatR.dispose();
    };
  }, [reaction, mouseOffset]);

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
      {/* 1. Plateau TV Pixar Haute Définition 2K/4K avec Logo HECh officiel */}
      <div 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${mouseOffset.x * 14}px, ${mouseOffset.y * 10}px, 0) scale(${
            reaction === 'victory' ? '1.05' : reaction === 'correct' ? '1.03' : '1.01'
          })`,
          transformOrigin: 'center center'
        }}
      >
        <img
          src={getAssetPath('/images/pixar_studio_arena_2k.webp')}
          alt="Plateau TV Officiel Pixar HECh"
          className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.04]"
          loading="eager"
        />

        {/* Halo d'ambiance dynamique selon la réaction de jeu */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10"
          style={{
            background: reaction === 'correct' || reaction === 'victory'
              ? 'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.22) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 80%)'
              : reaction === 'wrong'
              ? 'radial-gradient(circle at 50% 45%, rgba(225, 29, 72, 0.28) 0%, transparent 70%)'
              : 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 65%)'
          }}
        />
      </div>

      {/* 2. Calque Three.js Temps Réel (Faisceaux de projecteurs studio & poussière dorée) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* 3. Badge Studio Broadcast "EN DIRECT · PLATEAU OFFICIEL HECh" */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-xl pointer-events-none">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-[11px] font-outfit font-black tracking-wider text-amber-300 uppercase">
          En Direct · Plateau HECh (Style Pixar)
        </span>
      </div>

      {/* 4. Effet de célébration visuelle sur victoire / bonne réponse */}
      {(reaction === 'correct' || reaction === 'victory') && (
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2 bg-emerald-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-xs font-black text-emerald-200 uppercase tracking-wide">
            {reaction === 'victory' ? '🏆 VICTOIRE ACADÉMIQUE !' : '✨ EXCELLENTE RÉPONSE !'}
          </span>
        </div>
      )}

      {/* 5. Effet visuel sur mauvaise réponse */}
      {reaction === 'wrong' && (
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2 bg-rose-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-rose-500/50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-xs font-black text-rose-200 uppercase tracking-wide">
            ⚠️ ERREUR ACADÉMIQUE
          </span>
        </div>
      )}
    </div>
  );
}
