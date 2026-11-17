import { getAssetPath } from "../utils/assetPath";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Trophy, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameShow3D - Plateau TV Broadcast Pixar Animé en Temps Réel HECh
 * 
 * - Esthétique Pixar 100% fidèle à l'aperçu officiel :
 *   • Parquet en chevrons verni en chêne doré avec reflets de studio
 *   • Pupitre central galbé en bois noble avec blason officiel heCh et gorge néon cyan pulsante
 *   • Double arche néon dorée encadrant l'écran incurvé géant
 *   • Gradins latéraux avec public Pixar assis et spectateurs
 * - Moteur d'Animation Multi-Couches 60 FPS (Zéro Image Fixe !) :
 *   • Henri l'animateur : respiration organique continue, hochements de tête doux,
 *     gestes de parole dynamiques ('speaking'), applaudissements joyeux ('correct'),
 *     brandissement de la grande coupe dorée HECh ('victory').
 *   • Écran LED Incurvé Vivant (Canvas 60 FPS) : bulles et sphères 3D Pixar flottantes,
 *     étoiles scintillantes dorées, vagues néon et titre dynamique.
 *   • Calque Three.js temps réel : projecteurs de studio orientables balayant le plateau,
 *     poussière volumétrique dorée en suspension et gerbes de confettis.
 */
export default function GameShow3D({
  reaction = 'idle', // 'idle' | 'speaking' | 'correct' | 'wrong' | 'victory'
  theme = 'millionnaire',
  themeColor = '#38bdf8'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const screenCanvasRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isSpeakingLive, setIsSpeakingLive] = useState(false);
  const reactionPrevRef = useRef(reaction);

  // Détection des sons vocaux actifs pour animer Henri
  useEffect(() => {
    const checkVoice = () => {
      try {
        if (sounds && typeof sounds.isVoicePlaying === 'function') {
          setIsSpeakingLive(sounds.isVoicePlaying() || reaction === 'speaking');
        } else {
          setIsSpeakingLive(reaction === 'speaking');
        }
      } catch (e) {
        setIsSpeakingLive(reaction === 'speaking');
      }
    };
    const interval = setInterval(checkVoice, 120);
    return () => clearInterval(interval);
  }, [reaction]);

  // Célébrations interactives (confettis, sons)
  useEffect(() => {
    if (reactionPrevRef.current !== reaction) {
      if (reaction === 'correct') {
        confetti({
          particleCount: 75,
          spread: 85,
          origin: { y: 0.52 },
          colors: ['#38bdf8', '#fbbf24', '#f59e0b', '#10b981', '#ec4899', '#fde047']
        });
        try {
          if (sounds && sounds.correct) sounds.correct();
        } catch (e) {}

      } else if (reaction === 'victory') {
        confetti({
          particleCount: 140,
          spread: 110,
          origin: { y: 0.48 },
          colors: ['#fbbf24', '#f59e0b', '#fde047', '#38bdf8', '#a855f7', '#10b981']
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

  // 1. Écran Géant LED Incurvé Pixar (Animation 60 FPS Canvas en Temps Réel)
  useEffect(() => {
    const canvas = screenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    // Particules et sphères 3D flottantes de style Pixar
    const bubbles = Array.from({ length: 16 }, (_, i) => ({
      x: (i / 16) * 440 + Math.random() * 20,
      y: Math.random() * 260,
      radius: 10 + Math.random() * 18,
      speedY: 0.35 + Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      hue: (i * 24 + 180) % 360,
      alpha: 0.45 + Math.random() * 0.35
    }));

    const renderScreen = () => {
      animId = requestAnimationFrame(renderScreen);
      t += 0.025;

      // Fond dégradé dynamique Pixar bleu roi / indigo / cyan
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (reaction === 'correct' || reaction === 'victory') {
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.5, '#047857');
        grad.addColorStop(1, '#0f766e');
      } else if (reaction === 'wrong') {
        grad.addColorStop(0, '#4c0519');
        grad.addColorStop(0.5, '#881337');
        grad.addColorStop(1, '#4c0519');
      } else {
        grad.addColorStop(0, '#102a6b');
        grad.addColorStop(0.5, '#1e40af');
        grad.addColorStop(1, '#0284c7');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Trame de points LED incurvés
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      const dotSpacing = 14;
      for (let x = 7; x < canvas.width; x += dotSpacing) {
        for (let y = 7; y < canvas.height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Dessin des bulles et sphères 3D Pixar flottantes
      bubbles.forEach(b => {
        b.y -= b.speedY;
        b.x += Math.sin(t + b.y * 0.02) * 0.3;
        if (b.y < -b.radius * 2) {
          b.y = canvas.height + b.radius * 2;
          b.x = Math.random() * canvas.width;
        }

        const bGrad = ctx.createRadialGradient(
          b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
          b.x, b.y, b.radius
        );
        bGrad.addColorStop(0, `hsla(${b.hue}, 95%, 85%, ${b.alpha})`);
        bGrad.addColorStop(0.7, `hsla(${b.hue}, 90%, 55%, ${b.alpha * 0.8})`);
        bGrad.addColorStop(1, `hsla(${b.hue}, 90%, 40%, 0)`);

        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Étoiles scintillantes dorées
      for (let i = 0; i < 7; i++) {
        const starX = 40 + ((i * 65) % (canvas.width - 80)) + Math.sin(t * 1.5 + i) * 12;
        const starY = 30 + ((i * 40) % (canvas.height - 60)) + Math.cos(t * 1.5 + i) * 8;
        const starSize = 4 + Math.sin(t * 3 + i * 2) * 2.5;

        ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.beginPath();
        ctx.arc(starX, starY, Math.max(1, starSize), 0, Math.PI * 2);
        ctx.fill();
      }

      // Macaron central "CAMPUS CHALLENGE · HECh" avec reflets néon
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 - 20);
      
      // Halo lumineux circulaire
      const haloGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 90);
      haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
      haloGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.20)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();

      // Texte titre
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 20px "Outfit", system-ui, sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText(
        reaction === 'victory' ? '🏆 VICTOIRE HECh !' :
        reaction === 'correct' ? '✨ EXCELLENT !' :
        'CAMPUS CHALLENGE', 0, -10
      );

      ctx.font = '700 11px system-ui, sans-serif';
      ctx.fillStyle = '#e0f2fe';
      ctx.shadowBlur = 5;
      ctx.fillText('HECh · HAUTE ÉCOLE CHARLEMAGNE', 0, 12);

      ctx.restore();
    };

    renderScreen();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [reaction]);

  // 2. Calque Three.js Temps Réel (Projecteurs studio mobiles & Poussière dorée)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particules de poussière dorée atmosphérique Pixar
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const speedArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 0] = (Math.random() - 0.5) * 12;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 7;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 5;

      speedArray[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      speedArray[i * 3 + 1] = Math.random() * 0.005 + 0.002;
      speedArray[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(254, 240, 138, 1)');
    pGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.6)');
    pGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.13,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Faisceaux Volumétriques de Projecteurs Studio (Gauche & Droite)
    const beamGeo = new THREE.ConeGeometry(1.5, 7.5, 24, 1, true);

    const beamMatL = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beamL = new THREE.Mesh(beamGeo, beamMatL);
    beamL.position.set(-3.2, 3.2, 0.5);
    beamL.rotation.z = Math.PI / 4.8;
    scene.add(beamL);

    const beamMatR = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beamR = new THREE.Mesh(beamGeo, beamMatR);
    beamR.position.set(3.2, 3.2, 0.5);
    beamR.rotation.z = -Math.PI / 4.8;
    scene.add(beamR);

    let animId;
    let clock = new THREE.Clock();

    const animateThree = () => {
      animId = requestAnimationFrame(animateThree);
      const t = clock.getElapsedTime();

      // Balayage dynamique des projecteurs
      beamL.rotation.z = Math.PI / 4.8 + Math.sin(t * 0.9) * 0.08;
      beamL.rotation.x = -0.12 + Math.cos(t * 0.7) * 0.04;

      beamR.rotation.z = -Math.PI / 4.8 - Math.cos(t * 0.9) * 0.08;
      beamR.rotation.x = -0.12 + Math.sin(t * 0.7) * 0.04;

      // Réaction lumineuse vive
      if (reaction === 'correct' || reaction === 'victory') {
        beamMatL.color.setHex(0x10b981);
        beamMatR.color.setHex(0xfbbf24);
        beamMatL.opacity = 0.24 + Math.sin(t * 8) * 0.08;
        beamMatR.opacity = 0.24 + Math.cos(t * 8) * 0.08;
      } else if (reaction === 'wrong') {
        beamMatL.color.setHex(0xf43f5e);
        beamMatR.color.setHex(0xe11d48);
        beamMatL.opacity = 0.26 + Math.sin(t * 12) * 0.08;
        beamMatR.opacity = 0.26 + Math.cos(t * 12) * 0.08;
      } else {
        beamMatL.color.setHex(0x38bdf8);
        beamMatR.color.setHex(0xfbbf24);
        beamMatL.opacity = 0.12 + Math.sin(t * 0.6) * 0.03;
        beamMatR.opacity = 0.12 + Math.cos(t * 0.6) * 0.03;
      }

      // Ascension des particules de poussière dorée
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += speedArray[i * 3 + 1];
        pos[i * 3 + 0] += Math.sin(t + i) * 0.001;
        if (pos[i * 3 + 1] > 4.2) {
          pos[i * 3 + 1] = -4.2;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 12;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Parallaxe douce
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseOffset.x * 0.6, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseOffset.y * 0.4, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animateThree();

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

  // Sélection de la pose haute fidélité d'Henri selon la réaction
  const activeHenriCutout = (reaction === 'victory') 
    ? getAssetPath('/images/pixar_studio/henri_victory_cutout.png')
    : (reaction === 'correct')
    ? getAssetPath('/images/pixar_studio/henri_celebration_cutout.png')
    : getAssetPath('/images/pixar_studio/henri_idle_cutout.png');

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full relative select-none overflow-hidden bg-slate-950 flex items-center justify-center"
      style={{ minHeight: '320px' }}
    >
      {/* =========================================================================
          1. DÉCOR FIXE DE BASE : L'AMPHITHÉÂTRE & ARCHES EN BOIS NOBLE & LE PUPITRE HECh
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 10}px, ${mouseOffset.y * 6}px, 0) scale(1.015)`,
          transformOrigin: 'center center'
        }}
      >
        <img
          src={getAssetPath('/images/pixar_studio/studio_arena_clean_background.webp')}
          alt="Plateau TV Pixar HECh - Base"
          className="w-full h-full object-cover object-center filter saturate-[1.06] contrast-[1.03]"
          loading="eager"
        />
      </div>

      {/* =========================================================================
          2. ÉCRAN GÉANT LED INCURVÉ DYNAMIQUE (Animation 60 FPS en arrière-plan)
          ========================================================================= */}
      <div 
        className="absolute pointer-events-none overflow-hidden shadow-2xl z-[5]"
        style={{
          width: '30.2%',
          height: '41.0%',
          top: '20.8%',
          left: '34.9%',
          borderRadius: '8px',
          transform: `translate3d(${mouseOffset.x * 5}px, ${mouseOffset.y * 3}px, 0)`,
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.7) 96%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.7) 96%, transparent 100%)'
        }}
      >
        <canvas
          ref={screenCanvasRef}
          width={440}
          height={260}
          className="w-full h-full object-cover filter contrast-[1.12] saturate-[1.25]"
        />
      </div>

      {/* =========================================================================
          3. HENRI L'ANIMATEUR PIXAR AU CENTRE (TOTALEMENT ANIMÉ À 60 FPS)
          ========================================================================= */}
      <div 
        className="absolute pointer-events-none z-[12] flex items-end justify-center"
        style={{
          width: '44%',
          height: '52%',
          top: '15.5%',
          left: '28%',
          transformOrigin: 'bottom center',
          transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 8}px, 0)`
        }}
      >
        {/* Buste & Tête avec respiration vivante et gestuelle */}
        <div 
          className="w-full h-full relative"
          style={{
            animation: (reaction === 'victory') 
              ? 'henri-victory-celebrate 0.85s ease-in-out infinite alternate'
              : (reaction === 'correct')
              ? 'henri-applause-clap 0.45s ease-in-out infinite alternate'
              : isSpeakingLive
              ? 'henri-speech-gesture 0.65s ease-in-out infinite alternate'
              : 'henri-breathe-idle 2.8s ease-in-out infinite alternate',
            transformOrigin: 'bottom center'
          }}
        >
          <img
            key={activeHenriCutout}
            src={activeHenriCutout}
            alt="Henri - Animateur TV Pixar HECh"
            className="w-full h-full object-contain object-bottom filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)] transition-opacity duration-200"
          />

          {/* Effet d'étincelles dorées festives sur la victoire */}
          {reaction === 'victory' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-amber-300 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. CALQUE THREE.JS TEMPS RÉEL (PROJECTEURS STUDIO VOLUMÉTRIQUES & POUSSIÈRE)
          ========================================================================= */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-[20]"
      />

      {/* =========================================================================
          5. BADGES STUDIO BROADCAST & INDICATEURS
          ========================================================================= */}
      {/* Badge En Direct */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-xl pointer-events-none">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-[11px] font-outfit font-black tracking-wider text-amber-300 uppercase">
          En Direct · Plateau Pixar HECh
        </span>
        {isSpeakingLive && (
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse ml-1" />
        )}
      </div>

      {/* Badge Réaction Bonne Réponse / Victoire */}
      {(reaction === 'correct' || reaction === 'victory') && (
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2 bg-emerald-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-xs font-black text-emerald-200 uppercase tracking-wide">
            {reaction === 'victory' ? '🏆 VICTOIRE ACADÉMIQUE HECh !' : '✨ EXCELLENTE RÉPONSE !'}
          </span>
        </div>
      )}

      {/* Badge Réaction Erreur */}
      {reaction === 'wrong' && (
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2 bg-rose-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-rose-500/50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-xs font-black text-rose-200 uppercase tracking-wide">
            ⚠️ ERREUR ACADÉMIQUE
          </span>
        </div>
      )}

      {/* Styles CSS d'animations vivantes */}
      <style>{`
        @keyframes henri-breathe-idle {
          0% {
            transform: translateY(0px) scale(1.0, 1.0);
          }
          100% {
            transform: translateY(-4px) scale(1.006, 1.012);
          }
        }
        @keyframes henri-speech-gesture {
          0% {
            transform: translateY(-2px) rotate(-0.6deg) scale(1.008);
          }
          100% {
            transform: translateY(-6px) rotate(0.8deg) scale(1.02);
          }
        }
        @keyframes henri-applause-clap {
          0% {
            transform: translateY(-3px) scale(1.015) rotate(-0.8deg);
          }
          100% {
            transform: translateY(-8px) scale(1.04) rotate(1.0deg);
          }
        }
        @keyframes henri-victory-celebrate {
          0% {
            transform: translateY(-4px) scale(1.02) rotate(-0.8deg);
          }
          100% {
            transform: translateY(-12px) scale(1.055) rotate(0.8deg);
          }
        }
      `}</style>
    </div>
  );
}
