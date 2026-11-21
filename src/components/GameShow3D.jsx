import { getAssetPath } from "../utils/assetPath";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Trophy, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameShow3D - Moteur Vidéo Broadcast Wan 2.1 (Animation Pixar Vivante)
 * 
 * - De VRAIES animations de personnages en mouvement continu (Wan 2.1 I2V) :
 *   • Idle / Question en cours : Henri parle, sourit, gesticule avec ses mains face au pupitre HECh,
 *     la foule applaudit dans les gradins.
 *   • Bonne réponse (Célébration) : Henri applaudit vivement avec enthousiasme, l'écran étincelle,
 *     la foule fête la réussite.
 *   • Mauvaise réponse (Erreur) : Henri compatissant avec hochement empathique.
 *   • Grande Victoire 60 ECTS : Henri brandit le trophée doré HECh sous les gerbes d'étincelles !
 * - Calque Three.js temps réel par-dessus : projecteurs volumétriques orientables et poussière dorée.
 * - Gerbes de confettis dorés et effets sonores synchronisés.
 */
export default function GameShow3D({
  reaction = 'idle', // 'idle' | 'speaking' | 'focus' | 'correct' | 'wrong' | 'victory' | 'suspense' | 'pressure' | 'joker_5050' | 'joker_public' | 'joker_sar'
  theme = 'millionnaire',
  themeColor = '#38bdf8',
  currentQuestionIdx = 0
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const reactionPrevRef = useRef(reaction);

  // Détermination de la source vidéo selon les 21 Plans du Storyboard validé (100% cohérent)
  const getVideoSrc = () => {
    if (reaction === 'victory') return getAssetPath('/videos/wwtbam/plan21_victoire.mp4');
    if (reaction === 'correct') return getAssetPath('/videos/wwtbam/plan19_bonne_reponse.mp4');
    if (reaction === 'wrong' || reaction === 'defeat') return getAssetPath('/videos/wwtbam/plan20_defaite.mp4');
    if (reaction === 'joker_5050') return getAssetPath('/videos/wwtbam/plan16_joker_5050.mp4');
    if (reaction === 'joker_public' || reaction === 'joker') return getAssetPath('/videos/wwtbam/plan17_joker_public.mp4');
    if (reaction === 'joker_sar') return getAssetPath('/videos/wwtbam/plan18_joker_sar.mp4');
    if (reaction === 'suspense') return getAssetPath('/videos/wwtbam/plan14_pression3.mp4');
    if (reaction === 'pressure') {
      if (currentQuestionIdx >= 7) return getAssetPath('/videos/wwtbam/plan13_pression2.mp4');
      return getAssetPath('/videos/wwtbam/plan12_pression1.mp4');
    }

    // Présentation de l'émission (Plan 01)
    if (reaction === 'intro_presentation') {
      return getAssetPath('/videos/wwtbam/plan01_presentation.mp4');
    }

    // Les 10 plans distincts de questions génériques (Plans 02 à 11)
    if (reaction === 'speaking') {
      const qPlans = [
        '/videos/wwtbam/plan02_q1.mp4',
        '/videos/wwtbam/plan03_q2.mp4',
        '/videos/wwtbam/plan04_q3.mp4',
        '/videos/wwtbam/plan05_q4.mp4',
        '/videos/wwtbam/plan06_q5.mp4',
        '/videos/wwtbam/plan07_q6.mp4',
        '/videos/wwtbam/plan08_q7.mp4',
        '/videos/wwtbam/plan09_q8.mp4',
        '/videos/wwtbam/plan10_q9.mp4',
        '/videos/wwtbam/plan11_q10.mp4',
      ];
      const idx = Math.max(0, Math.min(qPlans.length - 1, currentQuestionIdx));
      return getAssetPath(qPlans[idx]);
    }

    // Plan 15 — Écoute silencieuse attentive (bouche strictement fermée, 20s)
    return getAssetPath('/videos/wwtbam/plan15_ecoute.mp4');
  };

  const [currentVideo, setCurrentVideo] = useState(getVideoSrc());
  const [prevVideo, setPrevVideo] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const silenceFramesRef = useRef(0);
  const noVoiceFramesRef = useRef(0);

  // Transition fluide sans flash noir (Crossfade 300ms entre deux plans de même esthétique)
  const switchVideoSmoothly = (nextSrc) => {
    setCurrentVideo((curr) => {
      if (curr === nextSrc) return curr;
      setPrevVideo(curr);
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevVideo(null);
      }, 320);
      return nextSrc;
    });
  };

  useEffect(() => {
    const nextSrc = getVideoSrc();
    silenceFramesRef.current = 0;
    noVoiceFramesRef.current = 0;
    switchVideoSmoothly(nextSrc);
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {});
    }
  }, [reaction, currentQuestionIdx]);

  // Synchronisation Audio -> Vidéo en temps réel (60 FPS via Web Audio AnalyserNode)
  useEffect(() => {
    let rafId;
    const isVocalState = ['speaking', 'intro_presentation', 'pressure', 'joker_5050', 'joker_public', 'joker_sar'].includes(reaction);
    const focusPath = getAssetPath('/videos/wwtbam/plan15_ecoute.mp4');

    const syncLoop = () => {
      const vid = videoRef.current;
      if (vid) {
        const playingVoice = sounds.isVoicePlaying();
        if (isVocalState) {
          if (!playingVoice) {
            noVoiceFramesRef.current += 1;
            // Si la voix est arrêtée depuis > 300ms (~18 frames), basculer sur l'écoute silencieuse bouche fermée
            if (noVoiceFramesRef.current > 18 && currentVideo !== focusPath) {
              switchVideoSmoothly(focusPath);
            }
          } else {
            noVoiceFramesRef.current = 0;
            const amp = sounds.getRealVoiceAmplitude();
            if (amp < 0.04) {
              silenceFramesRef.current += 1;
              // Pause respiratoire naturelle entre deux phrases : ralentir doucement le mouvement des lèvres
              if (silenceFramesRef.current > 12) {
                vid.playbackRate = 0.25;
              }
            } else {
              silenceFramesRef.current = 0;
              vid.playbackRate = 1.0;
            }
          }
        } else {
          // États silencieux ou célébrations/défaites : vitesse nominale 1.0
          if (vid.playbackRate !== 1.0) vid.playbackRate = 1.0;
        }
      }
      rafId = requestAnimationFrame(syncLoop);
    };

    rafId = requestAnimationFrame(syncLoop);
    return () => cancelAnimationFrame(rafId);
  }, [reaction, currentVideo]);

  // Célébrations interactives (confettis, sons)
  useEffect(() => {
    if (reactionPrevRef.current !== reaction) {
      if (reaction === 'correct') {
        confetti({
          particleCount: 85,
          spread: 90,
          origin: { y: 0.52 },
          colors: ['#38bdf8', '#fbbf24', '#f59e0b', '#10b981', '#ec4899', '#fde047']
        });
        try {
          if (sounds && sounds.correct) sounds.correct();
        } catch (e) {}

      } else if (reaction === 'victory') {
        confetti({
          particleCount: 160,
          spread: 120,
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

  // Calque Three.js Temps Réel (Projecteurs studio mobiles & Poussière dorée)
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
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const speedArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 0] = (Math.random() - 0.5) * 12;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 7;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 5;

      speedArray[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      speedArray[i * 3 + 1] = Math.random() * 0.004 + 0.002;
      speedArray[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(254, 240, 138, 1)');
    pGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.5)');
    pGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Faisceaux Volumétriques de Projecteurs Studio (Gauche & Droite)
    const beamGeo = new THREE.ConeGeometry(1.4, 7.5, 20, 1, true);

    const beamMatL = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.10,
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
      opacity: 0.10,
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
        beamMatL.opacity = 0.22 + Math.sin(t * 8) * 0.08;
        beamMatR.opacity = 0.22 + Math.cos(t * 8) * 0.08;
      } else if (reaction === 'wrong') {
        beamMatL.color.setHex(0xf43f5e);
        beamMatR.color.setHex(0xe11d48);
        beamMatL.opacity = 0.24 + Math.sin(t * 12) * 0.08;
        beamMatR.opacity = 0.24 + Math.cos(t * 12) * 0.08;
      } else {
        beamMatL.color.setHex(0x38bdf8);
        beamMatR.color.setHex(0xfbbf24);
        beamMatL.opacity = 0.10 + Math.sin(t * 0.6) * 0.03;
        beamMatR.opacity = 0.10 + Math.cos(t * 0.6) * 0.03;
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
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseOffset.x * 0.5, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseOffset.y * 0.3, 0.05);
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

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full relative select-none overflow-hidden bg-slate-950 flex items-center justify-center"
      style={{ minHeight: '320px' }}
    >
      {/* Fond de décor de studio étendu (exactement l'esthétique maître validée) */}
      <img
        src={getAssetPath('/images/storyboard/master_wwtbam_hech_base.jpg')}
        alt="Studio WWTBAM HECh"
        className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-[0.45] opacity-85 pointer-events-none"
      />

      {/* =========================================================================
          1. MOTEUR VIDÉO BROADCAST WAN 2.1 (21 PLANS STORYBOARD + CROSSFADE + SYNC VOCALE)
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 4}px, 0)`,
          transformOrigin: 'center center'
        }}
      >
        {/* Vidéo sortante en fondu enchaîné (zéro flash noir lors du changement de plan) */}
        {prevVideo && isTransitioning && (
          <video
            src={prevVideo}
            autoPlay
            muted
            playsInline
            className="absolute h-full w-auto max-w-full object-contain filter saturate-[1.06] contrast-[1.04] opacity-100 transition-opacity duration-300"
          />
        )}

        <video
          ref={videoRef}
          key={currentVideo}
          src={currentVideo}
          poster={getAssetPath('/images/storyboard/master_wwtbam_hech_base.jpg')}
          autoPlay
          loop
          muted
          playsInline
          className={`relative z-10 h-full w-auto max-w-full object-contain filter saturate-[1.06] contrast-[1.04] drop-shadow-[0_15px_40px_rgba(0,0,0,0.85)] transition-opacity duration-300 ${isTransitioning ? 'opacity-95' : 'opacity-100'}`}
          onError={(e) => {
            console.warn("[GameShow3D] Plan en cours de rendu, fallback propre vers plan01 :", e);
            const fallback = getAssetPath('/videos/wwtbam/plan01_presentation.mp4');
            if (currentVideo !== fallback) {
              switchVideoSmoothly(fallback);
            }
          }}
        />

        {/* Vignette studio uniforme (luminosité et colorimétrie strictement constantes sur tous les plans) */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.04) 0%, transparent 65%)'
          }}
        />
      </div>

      {/* =========================================================================
          2. CALQUE THREE.JS TEMPS RÉEL (PROJECTEURS STUDIO VOLUMÉTRIQUES & POUSSIÈRE)
          ========================================================================= */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-[20]"
      />

      {/* =========================================================================
          3. BADGES STUDIO BROADCAST & INDICATEURS
          ========================================================================= */}
      {/* Badge En Direct */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-xl pointer-events-none">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-[11px] font-outfit font-black tracking-wider text-amber-300 uppercase">
          En Direct · Plateau Pixar HECh (Wan 2.1)
        </span>
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
    </div>
  );
}
