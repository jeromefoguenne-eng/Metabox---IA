import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D - Studio Pédagogique Réaliste & Épuré d'AURORE (Haute École Charlemagne)
 * 
 * Conception graphique haute fidélité :
 * - DÉCOR RÉALISTE & MODERNE : Studio universitaire contemporain avec panneaux acoustiques en bois chaleureux,
 *   éclairage architectural indirect doux (bandeau LED chaud, halo cyan subtil), zéro barre de prison, zéro pupitre agressif.
 * - PERSONNAGE AURORE NATUREL & RÉALISTE : Intégration en haute définition du portrait canonique Pixar
 *   sur support holographique volumétrique 3D avec profondeur optique, reflets PBR physiques,
 *   ombres douces, respiration naturelle et suivi dynamique du regard de la caméra.
 * - ÉCLAIRAGE STUDIO 3-POINTS : Key Light chaude flatteuse, Fill Light bleutée douce, Rim Light dorée
 *   qui détache élégamment le personnage du décor avec un rendu digne d'un long-métrage d'animation.
 */
export default function PixarStyleScene3D({
  theme = 'hub',
  isAlert = false,
  characterMood = 'thinking' // 'thinking' | 'speaking' | 'victorious' | 'worried'
}) {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // --- 1. Scène Studio Pédagogique Réaliste ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.035);

    // Caméra Cadrage Portrait 50mm flatteur & naturel
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 30);
    camera.position.set(0, 1.30, 2.85);
    camera.lookAt(0, 1.25, 0);

    // --- 2. Rendu PBR Haute Définition ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- 3. Textures Officielles ---
    const textureLoader = new THREE.TextureLoader();
    const aurorePortraitTex = textureLoader.load('/images/aurore_pixar_hd.jpg', () => {
      setIsLoaded(true);
    });
    aurorePortraitTex.generateMipmaps = true;
    aurorePortraitTex.minFilter = THREE.LinearMipmapLinearFilter;
    aurorePortraitTex.magFilter = THREE.LinearFilter;

    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');

    // --- 4. Éclairage Studio Professionnel 3-Points ---
    // Key Light : Lumière principale douce chaude (3200K) à 40°
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(1.6, 2.6, 2.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);

    // Fill Light douce bleutée pour déboucher délicatement les ombres
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.1);
    fillLight.position.set(-1.8, 1.8, 1.6);
    scene.add(fillLight);

    // Rim Light (Hair Light) dorée pour faire ressortir la silhouette
    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    rimLight.position.set(-0.8, 2.4, -1.5);
    scene.add(rimLight);

    // Ambiance technologique douce
    const kickerLight = new THREE.PointLight(0x06b6d4, 1.2, 5);
    kickerLight.position.set(1.4, 1.2, -0.6);
    scene.add(kickerLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // =========================================================================
    // 5. DÉCOR STUDIO ÉPURÉ, MODERNE & CHALEUREUX (AUCUN BARREAU, DESIGN SOBRE)
    // =========================================================================
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, 0, -1.2);
    scene.add(studioGroup);

    // Fond courbe velouté bleu nuit contemporain
    const alcoveGeo = new THREE.CylinderGeometry(5.5, 5.5, 5.0, 32, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    const alcoveMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.05,
      side: THREE.BackSide
    });
    const alcove = new THREE.Mesh(alcoveGeo, alcoveMat);
    alcove.position.set(0, 1.8, -0.5);
    studioGroup.add(alcove);

    // Panneau acoustique central élégant en bois clair scandinave
    const woodPanelGeo = new THREE.BoxGeometry(2.8, 2.0, 0.04);
    const woodPanelMat = new THREE.MeshStandardMaterial({
      color: 0x241e17,
      roughness: 0.75,
      metalness: 0.1
    });
    const woodPanel = new THREE.Mesh(woodPanelGeo, woodPanelMat);
    woodPanel.position.set(0, 1.7, -0.4);
    studioGroup.add(woodPanel);

    // Liseré LED horizontal supérieur chaud
    const ledStripGeo = new THREE.BoxGeometry(2.82, 0.02, 0.05);
    const ledStripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ledStripTop = new THREE.Mesh(ledStripGeo, ledStripMat);
    ledStripTop.position.set(0, 2.71, -0.38);
    studioGroup.add(ledStripTop);

    // Liseré LED horizontal inférieur
    const ledStripBottom = new THREE.Mesh(ledStripGeo, ledStripMat);
    ledStripBottom.position.set(0, 0.69, -0.38);
    studioGroup.add(ledStripBottom);

    // Monogramme HECh officiel en filigrane lumineux doux au centre du fond
    const hechLogoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.40),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true, opacity: 0.45 })
    );
    hechLogoMesh.position.set(0, 2.2, -0.37);
    studioGroup.add(hechLogoMesh);

    // Particules de poussière cybernétique flottantes en arrière-plan
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3.5;
      particlePos[i + 1] = 0.5 + Math.random() * 2.2;
      particlePos[i + 2] = -0.2 + (Math.random() - 0.5) * 1.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.022,
      transparent: true,
      opacity: 0.35
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    studioGroup.add(particles);

    // =========================================================================
    // 6. PERSONNAGE D'AURORE : PRÉSENTATION RÉALISTE & SIMPLIFIÉE
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.5, 0);
    scene.add(characterRoot);

    // Console flottante en verre contemporain sous le personnage (discrète, pas de gros pupitre)
    const glassPodGeo = new THREE.CylinderGeometry(0.55, 0.48, 0.04, 32);
    const glassPodMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.4,
      transmission: 0.5,
      transparent: true,
      opacity: 0.6,
      clearcoat: 0.9
    });
    const glassPod = new THREE.Mesh(glassPodGeo, glassPodMat);
    glassPod.position.set(0, 0.12, 0);
    characterRoot.add(glassPod);

    // Anneau de lumière cyan doux autour du socle
    const podRingGeo = new THREE.TorusGeometry(0.53, 0.012, 16, 48);
    const podRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const podRing = new THREE.Mesh(podRingGeo, podRingMat);
    podRing.rotation.x = Math.PI / 2;
    podRing.position.set(0, 0.14, 0);
    characterRoot.add(podRing);

    // --- CADRE PORTRAIT VOLUMÉTRIQUE HAUTE DÉFINITION (AURORE NATURELLE PIXAR) ---
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0.88, 0);
    characterRoot.add(avatarGroup);

    // Plan de portrait haute définition incurvé pour un effet volumétrique réaliste
    const portraitGeo = new THREE.PlaneGeometry(1.05, 1.40, 24, 24);
    // Incurver légèrement le plan en arc doux
    const posAttr = portraitGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      posAttr.setZ(i, -Math.pow(x, 2) * 0.15);
    }
    portraitGeo.computeVertexNormals();

    const portraitMat = new THREE.MeshPhysicalMaterial({
      map: aurorePortraitTex,
      roughness: 0.4,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      reflectivity: 0.3
    });
    const portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
    portraitMesh.castShadow = true;
    avatarGroup.add(portraitMesh);

    // Cadre flottant ultra-fin en aluminium brossé sombre & or
    const frameBorderMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2
    });
    const frameEdgeTop = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.016, 0.02), frameBorderMat);
    frameEdgeTop.position.set(0, 0.705, 0);
    avatarGroup.add(frameEdgeTop);

    const frameEdgeBottom = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.016, 0.02), frameBorderMat);
    frameEdgeBottom.position.set(0, -0.705, 0);
    avatarGroup.add(frameEdgeBottom);

    // Badge d'authentification holographique HECh en haut à gauche
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(-0.42, 0.62, 0.02);
    const badgeCircle = new THREE.Mesh(
      new THREE.CircleGeometry(0.055, 24),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 })
    );
    badgeGroup.add(badgeCircle);
    const badgeLogo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.04),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    badgeLogo.position.z = 0.005;
    badgeGroup.add(badgeLogo);
    avatarGroup.add(badgeGroup);

    // =========================================================================
    // 7. INTERACTION MOUSE TRACKING & PARALLAXE DOUCE
    // =========================================================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(x * 0.15, -0.15, 0.15);
      mouse.targetY = THREE.MathUtils.clamp(y * 0.08, -0.08, 0.08);
    };
    currentMount.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 8. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION DOUCE, FLUIDE ET NATURELLE)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Parallaxe douce suivant la souris
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.05);

      // Respiration subtile et organique
      const breath = Math.sin(t * 1.6);
      avatarGroup.position.y = 0.88 + breath * 0.006;
      avatarGroup.rotation.y = mouse.x + Math.sin(t * 0.8) * 0.015;
      avatarGroup.rotation.x = -mouse.y + Math.cos(t * 0.6) * 0.008;

      // Micro-gestes selon l'état d'Aurore
      if (characterMood === 'speaking') {
        avatarGroup.scale.set(1.0 + Math.sin(t * 5.0) * 0.005, 1.0 + Math.sin(t * 5.0) * 0.005, 1.0);
        kickerLight.intensity = 1.4 + Math.sin(t * 6.0) * 0.3;
      } else if (characterMood === 'victorious') {
        avatarGroup.position.y = 0.90 + Math.sin(t * 2.0) * 0.01;
        kickerLight.color.setHex(0x10b981); // Émeraude de victoire
      } else if (isAlert || characterMood === 'worried') {
        kickerLight.color.setHex(0xf43f5e); // Rose / Rouge d'alerte
      } else {
        kickerLight.color.setHex(0x06b6d4); // Cyan standard HECh
      }

      // Rotation douce de l'anneau holographique
      podRing.rotation.z = t * 0.25;

      // Dérive subtile de la caméra studio
      camera.position.x = Math.sin(t * 0.15) * 0.04;
      camera.lookAt(0, 1.25, 0);

      // Flottement des particules d'arrière-plan
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionnement réactif
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
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isAlert, characterMood]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Overlay status subtil */}
      <div className="absolute bottom-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-cyan-300/80 font-bold tracking-wider">
          STUDIO PÉDAGOGIQUE • FLUX OPTIQUE 3D SOUVERAIN
        </span>
      </div>
    </div>
  );
}
