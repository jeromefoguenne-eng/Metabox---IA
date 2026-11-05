import { getAssetPath } from "../utils/assetPath";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { sounds } from '../utils/soundEffects';

/**
 * PixarStyleScene3D - Studio Virtuel 3D Temps Réel d'A.U.R.O.R.E.
 * Option B : Modèle 3D Sculpté Haute Définition (.GLB 60 000 polygones)
 * 
 * - Véritable modèle 3D volumétrique issu de la direction artistique Pixar
 * - Chevelure sculptée fluide, blazer tailleur ajusté, tablette luminescente
 * - Animation 60 FPS in-engine : respiration naturelle, suivi du regard (head tracking),
 *   gestuelle active en direct lors de la parole vocale (Lip-Sync motion),
 * - Éclairage studio 3-points doux ACES Filmic avec rebond chaud et rim-light
 */
export default function PixarStyleScene3D({
  theme = 'hub',
  isAlert = false,
  characterMood = 'thinking' // 'thinking' | 'speaking' | 'victorious' | 'worried'
}) {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const characterModelRef = useRef(null);
  const morphMeshesRef = useRef([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // --- 1. Scène Studio Pixar Chaleureuse & Enveloppante ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0b1a);
    scene.fog = new THREE.FogExp2(0x0d0b1a, 0.030);

    // Caméra Cadrage Buste Studio 50mm flatteur & naturel
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 40);
    camera.position.set(0, 1.15, 2.85);
    camera.lookAt(0, 1.05, 0);

    // --- 2. Rendu PBR Haute Fidélité ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- 3. Éclairage Studio Pixar 3-Points ---
    const hemiLight = new THREE.HemisphereLight(0xfff6ee, 0x1f1630, 0.65);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.25);
    scene.add(ambientLight);

    // Key Light : Lumière dorée douce principale
    const keyLight = new THREE.DirectionalLight(0xfff1de, 1.4);
    keyLight.position.set(1.5, 2.8, 2.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.radius = 3.5;
    scene.add(keyLight);

    // Fill Light : Ciel poudré lavande
    const fillLight = new THREE.DirectionalLight(0xb4c6fc, 0.65);
    fillLight.position.set(-1.8, 1.8, 1.6);
    scene.add(fillLight);

    // Rim / Hair Light : Or chaud éclatant pour sublimer les cheveux blonds
    const rimLight = new THREE.DirectionalLight(0xfde047, 1.6);
    rimLight.position.set(-0.7, 2.8, -1.9);
    scene.add(rimLight);

    // Kicker bas : Lueur cyan technologique
    const kickerLight = new THREE.PointLight(0x38bdf8, 0.8, 5);
    kickerLight.position.set(1.2, 0.8, -0.4);
    scene.add(kickerLight);

    // =========================================================================
    // 4. DÉCOR STUDIO VIRTUEL ARÈNE (BOISERIES SOMBRES & NEONS CUIVRÉS)
    // =========================================================================
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, 0, -1.2);
    scene.add(studioGroup);

    const alcoveGeo = new THREE.CylinderGeometry(5.5, 5.5, 5.0, 32, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    const alcoveMat = new THREE.MeshStandardMaterial({
      color: 0x140a24,
      roughness: 0.85,
      side: THREE.BackSide
    });
    const alcove = new THREE.Mesh(alcoveGeo, alcoveMat);
    alcove.position.set(0, 1.8, 0);
    studioGroup.add(alcove);

    const woodPanelMat = new THREE.MeshStandardMaterial({
      color: 0x22131b,
      roughness: 0.65,
      metalness: 0.15
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2
    });

    for (let i = -3; i <= 3; i++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 0.04), woodPanelMat);
      panel.position.set(i * 0.65, 1.9, -1.8 - Math.abs(i) * 0.12);
      panel.rotation.y = -i * 0.08;
      studioGroup.add(panel);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(0.015, 3.8, 0.05), goldTrimMat);
      trim.position.set(i * 0.65 + 0.175, 1.9, -1.8 - Math.abs(i) * 0.12);
      studioGroup.add(trim);
    }

    const hexRingGeo = new THREE.TorusGeometry(2.4, 0.025, 16, 48, Math.PI);
    const hexRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const hexRing = new THREE.Mesh(hexRingGeo, hexRingMat);
    hexRing.position.set(0, 3.2, -1.5);
    hexRing.rotation.x = Math.PI / 2;
    studioGroup.add(hexRing);

    // Particules de poussière cybernétique flottantes
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3.8;
      particlePos[i + 1] = 0.5 + Math.random() * 2.4;
      particlePos[i + 2] = -0.2 + (Math.random() - 0.5) * 1.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.024,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    studioGroup.add(particles);

    // =========================================================================
    // 5. SOCLE HOLOGRAPHIQUE & CHARGEMENT DU MODÈLE 3D PIXAR (.GLB)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.20, 0);
    scene.add(characterRoot);

    // Socle flottant avec anneau cyan lumineux
    const podGeo = new THREE.CylinderGeometry(0.56, 0.48, 0.05, 32);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.7
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(0, 0.05, 0);
    characterRoot.add(pod);

    const podRingGeo = new THREE.TorusGeometry(0.54, 0.014, 16, 48);
    const podRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const podRing = new THREE.Mesh(podRingGeo, podRingMat);
    podRing.rotation.x = Math.PI / 2;
    podRing.position.set(0, 0.07, 0);
    characterRoot.add(podRing);

    // Conteneur du modèle 3D avec pivot centré
    const modelContainer = new THREE.Group();
    characterRoot.add(modelContainer);

    let baseScale = 1.0;
    let basePosY = 0.07;
    let baseRotY = Math.PI; // Face caméra dans Three.js

    morphMeshesRef.current = [];

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      getAssetPath('/models/aurore_lowpoly_stylized.glb'),
      (gltf) => {
        const model = gltf.scene;

        // Calcul exact des proportions et centrage
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Mise à l'échelle harmonieuse pour cadrage buste flatteur
        const targetHeight = 1.38;
        baseScale = targetHeight / (size.y || 1);
        model.scale.set(baseScale, baseScale, baseScale);

        // Repose sur le pod et centrage
        model.position.x = -center.x * baseScale;
        model.position.y = 0.08 - box.min.y * baseScale;
        model.position.z = -center.z * baseScale;

        // Orientation vers la caméra
        modelContainer.rotation.y = baseRotY;

        // Optimisation PBR et netteté maximale des textures HD (Anisotropie 16x)
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.morphTargetDictionary && child.morphTargetInfluences) {
              morphMeshesRef.current.push(child);
              console.log("[Aurore Low-Poly 3D] Shape Keys détectées sur", child.name, Object.keys(child.morphTargetDictionary));
            }
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
            if (child.material) {
              const mName = child.material.name || '';
              if (mName.includes('Gold') || mName.includes('Trim')) {
                child.material.roughness = 0.15;
                child.material.metalness = 0.95;
              } else if (mName.includes('Navy') || mName.includes('Suit')) {
                child.material.roughness = 0.48;
                child.material.metalness = 0.05;
              } else if (mName.includes('Silk') || mName.includes('Blouse')) {
                child.material.roughness = 0.28;
                child.material.metalness = 0.02;
              } else {
                child.material.roughness = 0.40;
                child.material.metalness = 0.02;
              }
              if (child.material.map) {
                child.material.map.anisotropy = 16;
                child.material.map.generateMipmaps = true;
                child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
                child.material.map.magFilter = THREE.LinearFilter;
                child.material.map.needsUpdate = true;
              }
              child.material.needsUpdate = true;
            }
          }
        });

        modelContainer.add(model);
        characterModelRef.current = modelContainer;
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Erreur lors du chargement de aurore_blender_pixar.glb', err);
      }
    );

    // =========================================================================
    // 6. INTERACTION MOUSE TRACKING & PARALLAXE DOUCE
    // =========================================================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(x * 0.14, -0.14, 0.14);
      mouse.targetY = THREE.MathUtils.clamp(y * 0.08, -0.08, 0.08);
    };
    currentMount.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 7. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION, PAROLE EN DIRECT, MICRO-MOUVEMENTS)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Parallaxe douce suivant la souris
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.05);

      if (characterModelRef.current) {
        const model = characterModelRef.current;

        // Respiration naturelle et douce
        const breath = Math.sin(t * 2.0);
        model.position.y = breath * 0.008;

        // Head tracking / suivi du curseur
        model.rotation.y = baseRotY + mouse.x * 0.40;
        model.rotation.x = -mouse.y * 0.20;

        // --- ANIMATION DE PAROLE EN DIRECT (LIP-SYNC MOTION & SHAPE KEYS BLENDER) ---
        const isVoiceActive = sounds.isVoicePlaying() || characterMood === 'speaking';

        // Pilotage dynamique de toutes les Shape Keys (Visemes de parole & émotions réalistes)
        const isBlinking = (Math.sin(t * 1.6) > 0.985);
        const targetMouth = isVoiceActive 
          ? (Math.sin(t * 15) * 0.45 + Math.sin(t * 24) * 0.30 + 0.35)
          : 0.0;
        const targetSmile = (!isVoiceActive && characterMood !== 'worried' && !isAlert) ? 0.75 : 0.15;
        const targetBrow = (characterMood === 'thinking' || isAlert) ? 0.60 : 0.0;

        morphMeshesRef.current.forEach(mesh => {
          if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            const dict = mesh.morphTargetDictionary;
            const inf = mesh.morphTargetInfluences;

            const mouthIdx = dict['mouth_open'] ?? dict['mouthOpen'];
            const smileIdx = dict['mouth_smile'] ?? dict['smile'];
            const blinkIdx = dict['blink'];
            const browIdx = dict['brow_raise'];

            if (mouthIdx !== undefined) {
              inf[mouthIdx] = THREE.MathUtils.lerp(inf[mouthIdx], Math.max(0, targetMouth), 0.4);
            }
            if (smileIdx !== undefined) {
              inf[smileIdx] = THREE.MathUtils.lerp(inf[smileIdx], targetSmile, 0.2);
            }
            if (blinkIdx !== undefined) {
              inf[blinkIdx] = isBlinking ? 1.0 : 0.0;
            }
            if (browIdx !== undefined) {
              inf[browIdx] = THREE.MathUtils.lerp(inf[browIdx], targetBrow, 0.2);
            }
          }
        });

        if (isVoiceActive) {
          // Micro-gestuelle vive quand Aurore parle (hochements, inclinaisons expressives)
          const speechHeadBob = Math.sin(t * 14) * 0.012 + Math.sin(t * 22) * 0.008;
          model.position.y += speechHeadBob;
          model.rotation.y += Math.sin(t * 3.5) * 0.035;
          model.rotation.z = Math.sin(t * 2.8) * 0.018;

          podRingMat.color.setHex(0x38bdf8);
        } else {
          model.rotation.z = THREE.MathUtils.lerp(model.rotation.z, 0, 0.1);

          if (characterMood === 'victorious') {
            model.rotation.y = baseRotY + mouse.x * 0.3 + Math.sin(t * 1.2) * 0.02;
            model.rotation.x = -mouse.y * 0.15 - 0.02;
            podRingMat.color.setHex(0x10b981);
          } else if (characterMood === 'worried' || isAlert) {
            model.rotation.y = baseRotY + mouse.x * 0.3 - 0.02;
            model.rotation.x = -mouse.y * 0.15 + 0.03;
            podRingMat.color.setHex(0xf43f5e);
          } else {
            podRingMat.color.setHex(0x06b6d4);
          }
        }
      }

      // Rotation de l'anneau du pod
      podRing.rotation.z = t * 0.25;

      // Travelling subtil de caméra
      camera.position.x = Math.sin(t * 0.12) * 0.04;
      camera.lookAt(0, 1.15, 0);

      // Particules flottantes
      particles.rotation.y = t * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionnement fluide
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isAlert, characterMood]);

  return (
    <div ref={mountRef} className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden relative shadow-2xl bg-[#0d0b1a]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(13,11,26,0.6)_100%)]" />
    </div>
  );
}