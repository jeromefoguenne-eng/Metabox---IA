import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D - Version Studio Épurée & Réaliste d'AURORE (Haute École Charlemagne)
 * 
 * Améliorations clés :
 * - TÊTE SIMPLIFIÉE & NATURELLE : visage féminin unifié aux traits fins et doux, sans formes géométriques saillantes ni effet robotique.
 * - REGARD EXPRESSIF PIXAR : yeux bleus pétillants avec catchlight vivant et clignement périodique doux.
 * - LUNETTES CONTEMPORAINES : monture dorée fine, élégante et proportionnée.
 * - CHEVELURE SOIGNÉE : mèches blondes douces et fluides encadrant délicatement le visage.
 * - TENUE ACADÉMIQUE : blazer bleu marine HECh officiel avec chemisier blanc et badge de l'école.
 * - DÉCOR ÉPURÉ & MODERNE : studio contemporain à l'éclairage 3-points chaleureux, fond courbé doux, écran de verre teinté avec monogramme HECh et particules d'ambiance.
 * - ZÉRO BARREAU / ZÉRO OBSTACLE : vue totalement dégagée sur le personnage, sans pupitre massif ni lattes agressives.
 */
export default function PixarStyleScene3D({
  theme = 'hub',
  isAlert = false,
  characterMood = 'thinking' // 'thinking' | 'speaking' | 'victorious' | 'worried'
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // --- 1. Scène Studio Épurée ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e1a);
    scene.fog = new THREE.FogExp2(0x090e1a, 0.04);

    // Caméra Cadrage Portrait 50mm flatteur
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 30);
    camera.position.set(0, 1.35, 2.75);
    camera.lookAt(0, 1.30, 0);

    // --- 2. Moteur de Rendu PBR ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- 3. Texture Loader Logo HECh ---
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');

    // --- 4. Éclairage Studio Professionnel 3-Points ---
    // Key Light : Lumière chaude douce à 45°
    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.6);
    keyLight.position.set(1.5, 2.8, 2.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    // Fill Light douce bleutée pour déboucher les ombres avec nuance
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-1.8, 2.0, 1.6);
    scene.add(fillLight);

    // Rim Light (Hair Light) dorée pour détacher la chevelure et les épaules du fond
    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.4);
    rimLight.position.set(-0.8, 2.6, -1.8);
    scene.add(rimLight);

    // Kicker cyan technologique subtil
    const kickerLight = new THREE.PointLight(0x38bdf8, 1.0, 6);
    kickerLight.position.set(1.8, 1.6, -0.8);
    scene.add(kickerLight);

    // Ambiance douce globale
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // =========================================================================
    // 5. DÉCOR STUDIO ÉPURÉ & MODERNE (AUCUN BARREAU, FOND SOBRE & ÉLÉGANT)
    // =========================================================================
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, 0, -1.5);
    scene.add(studioGroup);

    // Fond studio alcôve courbe en bleu nuit velouté
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1
    });
    const backWall = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 6, 6, 32, 1, true, -Math.PI * 0.4, Math.PI * 0.8),
      backWallMat
    );
    backWall.position.set(0, 2.2, -0.8);
    studioGroup.add(backWall);

    // Écran flottant en verre translucide contemporain
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.2,
      transmission: 0.4,
      transparent: true,
      opacity: 0.65,
      clearcoat: 0.8
    });
    const glassScreen = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 0.04), glassMat);
    glassScreen.position.set(0, 2.2, -0.6);
    studioGroup.add(glassScreen);

    // Liseré fin doré autour de l'écran
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.85
    });
    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.02, 0.05), goldMat);
    borderTop.position.set(0, 3.11, -0.6);
    studioGroup.add(borderTop);

    const borderBottom = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.02, 0.05), goldMat);
    borderBottom.position.set(0, 1.29, -0.6);
    studioGroup.add(borderBottom);

    // Monogramme HECh élégant en filigrane lumineux
    const logoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 0.45),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true, opacity: 0.55 })
    );
    logoMesh.position.set(0, 2.2, -0.57);
    studioGroup.add(logoMesh);

    // Halo d'ambiance bleuté sous l'écran
    const screenHalo = new THREE.PointLight(0x06b6d4, 1.1, 4.5);
    screenHalo.position.set(0, 2.2, -0.4);
    studioGroup.add(screenHalo);

    // Particules de poussière cybernétique flottantes en arrière-plan
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 4;
      particlePos[i + 1] = 0.5 + Math.random() * 2.5;
      particlePos[i + 2] = -0.3 + (Math.random() - 0.5) * 1.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.025,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    studioGroup.add(particles);

    // =========================================================================
    // 6. MATÉRIAUX NATURELS D'AURORE (PEAU LISSE, YEUX EXPRESSIFS, CHEVEUX DORÉS)
    // =========================================================================
    // Peau claire veloutée naturelle
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xfceee6,
      roughness: 0.52,
      metalness: 0.0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.45
    });

    // Lèvres douces rose corail
    const lipsMat = new THREE.MeshPhysicalMaterial({
      color: 0xdf6e6e,
      roughness: 0.35,
      clearcoat: 0.45
    });

    // Blazer bleu marine HECh
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.05
    });

    // Chemisier blanc
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45
    });

    // Chevelure blonde soyeuse
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: 0xe5b869,
      roughness: 0.42,
      metalness: 0.04,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3
    });

    const hairHighlightMat = new THREE.MeshPhysicalMaterial({
      color: 0xf6d78a,
      roughness: 0.38,
      metalness: 0.03,
      clearcoat: 0.4
    });

    // Lunettes dorées fines
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.18
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.15,
      transparent: true,
      roughness: 0.04,
      ior: 1.5
    });

    // =========================================================================
    // 7. PERSONNAGE AURORE (VISAGE HARMONIEUX, CADRAGE FLUIDE & ÉLÉGANT)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.48, 0);
    scene.add(characterRoot);

    // --- BUSTE & BLAZER ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.70, 0);
    characterRoot.add(torsoGroup);

    // Torse cintré
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.27, 0.62, 32), blazerMat);
    torso.scale.set(1.15, 1.0, 0.72);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Revers gauche et droit du blazer
    const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.025), blazerMat);
    lapelLeft.position.set(-0.08, 0.12, 0.22);
    lapelLeft.rotation.z = -0.20;
    torsoGroup.add(lapelLeft);

    const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.025), blazerMat);
    lapelRight.position.set(0.08, 0.12, 0.22);
    lapelRight.rotation.z = 0.20;
    torsoGroup.add(lapelRight);

    // Chemisier blanc
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.32, 0.02), shirtMat);
    shirt.position.set(0, 0.12, 0.21);
    torsoGroup.add(shirt);

    // Col en V discret
    const vCollar = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 3), shirtMat);
    vCollar.position.set(0, 0.28, 0.215);
    vCollar.rotation.x = Math.PI;
    torsoGroup.add(vCollar);

    // Épaules souples
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), blazerMat);
    shoulderL.position.set(-0.28, 0.24, 0);
    shoulderL.scale.set(1.0, 0.75, 0.85);
    torsoGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), blazerMat);
    shoulderR.position.set(0.28, 0.24, 0);
    shoulderR.scale.set(1.0, 0.75, 0.85);
    torsoGroup.add(shoulderR);

    // Badge officiel HECh sur la veste
    const badge = new THREE.Group();
    badge.position.set(-0.13, 0.15, 0.23);
    badge.rotation.y = -0.15;
    const badgeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.006, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
    );
    badgeBase.rotation.x = Math.PI / 2;
    badge.add(badgeBase);

    const badgeArt = new THREE.Mesh(
      new THREE.PlaneGeometry(0.065, 0.065),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    badgeArt.position.z = 0.005;
    badge.add(badgeArt);
    torsoGroup.add(badge);

    // --- COU NATUREL ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.05, 0);
    characterRoot.add(neckGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.20, 24), skinMat);
    neck.position.y = 0.02;
    neck.castShadow = true;
    neckGroup.add(neck);

    // --- TÊTE D'AURORE (SIMPLIFIÉE, DOUCE & GRACIEUSE) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.26, 0);
    characterRoot.add(headGroup);

    // Ovale unifié du visage féminin Pixar (crâne + joues unifiées lisses)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.205, 48, 48), skinMat);
    head.scale.set(0.92, 1.08, 0.95);
    head.castShadow = true;
    headGroup.add(head);

    // Menton doux et délicat (sans rupture)
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 24), skinMat);
    chin.position.set(0, -0.19, 0.09);
    chin.scale.set(0.9, 0.6, 0.7);
    headGroup.add(chin);

    // Petit nez mignon et discret
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.07, 16), skinMat);
    nose.position.set(0, -0.015, 0.215);
    nose.rotation.x = 0.15;
    headGroup.add(nose);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), skinMat);
    noseTip.position.set(0, -0.04, 0.22);
    headGroup.add(noseTip);

    // Lèvres souriantes naturelles
    const lipsGroup = new THREE.Group();
    lipsGroup.position.set(0, -0.11, 0.195);
    headGroup.add(lipsGroup);

    const lipUpper = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.008, 12, 24, Math.PI * 0.7), lipsMat);
    lipUpper.rotation.x = Math.PI / 2;
    lipUpper.rotation.z = Math.PI * 0.15;
    lipsGroup.add(lipUpper);

    const lipLower = new THREE.Mesh(new THREE.SphereGeometry(0.020, 16, 16), lipsMat);
    lipLower.position.set(0, -0.014, 0.005);
    lipLower.scale.set(1.3, 0.5, 0.6);
    lipsGroup.add(lipLower);

    // --- YEUX EXPRESSIFS & REGARD VIVANT ---
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.15 });
    const irisMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8, // Bleu saphir doux
      roughness: 0.2,
      clearcoat: 0.8
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x080808 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEye = (xPos) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0.032, 0.175);

      // Globe oculaire
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.034, 24, 24), scleraMat);
      eyeGroup.add(eyeball);

      // Iris doux
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.018, 24), irisMat);
      iris.position.set(0, 0, 0.0335);
      eyeGroup.add(iris);

      // Pupille
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.009, 24), pupilMat);
      pupil.position.set(0, 0, 0.034);
      eyeGroup.add(pupil);

      // Reflet vivant
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.004, 12), glintMat);
      glint.position.set(0.005, 0.005, 0.0345);
      eyeGroup.add(glint);

      // Paupière supérieure pour clignement
      const lidGeo = new THREE.SphereGeometry(0.036, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const lid = new THREE.Mesh(lidGeo, skinMat);
      lid.rotation.x = -Math.PI / 2.2;
      eyeGroup.add(lid);

      return { group: eyeGroup, lid };
    };

    const eyeL = createEye(-0.068);
    const eyeR = createEye(0.068);
    headGroup.add(eyeL.group);
    headGroup.add(eyeR.group);

    // Sourcils fins
    const browMat = new THREE.MeshStandardMaterial({ color: 0x85582f, roughness: 0.6 });
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.008, 0.01), browMat);
    browL.position.set(-0.068, 0.08, 0.19);
    browL.rotation.z = 0.06;
    headGroup.add(browL);

    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.008, 0.01), browMat);
    browR.position.set(0.068, 0.08, 0.19);
    browR.rotation.z = -0.06;
    headGroup.add(browR);

    // --- LUNETTES CONTEMPORAINES FINES ---
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.032, 0.215);
    headGroup.add(glassesGroup);

    // Pont de nez fin
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.04, 12), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.003, 0);
    glassesGroup.add(bridge);

    // Cerclages délicats
    [-0.068, 0.068].forEach((xPos) => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.003, 12, 32), frameMat);
      rim.position.set(xPos, 0, 0);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.029, 24), lensMat);
      lens.position.set(xPos, 0, 0.001);
      glassesGroup.add(lens);
    });

    // Branches latérales
    [-0.102, 0.102].forEach((xPos, idx) => {
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.0035, 0.0035, 0.18), frameMat);
      temple.position.set(xPos, 0.006, -0.08);
      temple.rotation.y = idx === 0 ? 0.05 : -0.05;
      glassesGroup.add(temple);
    });

    // --- CHEVELURE BLONDE ÉLÉGANTE (ORGANIC & SMOOTH) ---
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Calotte principale soignée
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairCrown.position.set(0, 0.05, -0.02);
    hairCrown.scale.set(0.97, 1.05, 1.06);
    hairGroup.add(hairCrown);

    // Frange douce fluide balayée
    const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), hairHighlightMat);
    bangs.position.set(-0.04, 0.15, 0.13);
    bangs.scale.set(1.3, 0.45, 0.65);
    bangs.rotation.set(-0.25, 0.2, 0.35);
    hairGroup.add(bangs);

    // Mèches latérales qui descendent gracieusement le long des joues
    const lockL = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 24), hairHighlightMat);
    lockL.scale.set(0.65, 1.9, 0.75);
    lockL.position.set(-0.15, -0.05, 0.05);
    lockL.rotation.set(0.1, 0.12, 0.12);
    hairGroup.add(lockL);

    const lockR = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 24), hairHighlightMat);
    lockR.scale.set(0.65, 1.9, 0.75);
    lockR.position.set(0.15, -0.05, 0.05);
    lockR.rotation.set(0.1, -0.12, -0.12);
    hairGroup.add(lockR);

    // Chignon / Volume arrière
    const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), hairMat);
    hairBack.position.set(0, 0.02, -0.14);
    hairBack.scale.set(1.1, 1.15, 0.9);
    hairGroup.add(hairBack);

    // --- TABLETTE TACTILE ÉLÉGANTE ---
    const padGroup = new THREE.Group();
    padGroup.position.set(0, -0.15, 0.24);
    padGroup.rotation.x = -0.45;

    const padBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.15, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
    );
    padGroup.add(padBody);

    const padScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.20, 0.13),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    padScreen.position.z = 0.006;
    padGroup.add(padScreen);
    torsoGroup.add(padGroup);

    // =========================================================================
    // 8. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION DOUCE & REGARD VIVANT)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Respiration subtile et naturelle
      const breath = Math.sin(t * 1.8);
      torsoGroup.scale.y = 1.0 + breath * 0.005;
      headGroup.position.y = 1.26 + breath * 0.003;

      // Clignement doux naturel toutes les ~4.5s
      const blinkCycle = (t * 0.8) % 4.5;
      const isBlinking = blinkCycle < 0.12;
      const targetLidAngle = isBlinking ? 0.0 : -Math.PI / 2.2;
      eyeL.lid.rotation.x = THREE.MathUtils.lerp(eyeL.lid.rotation.x, targetLidAngle, 0.45);
      eyeR.lid.rotation.x = THREE.MathUtils.lerp(eyeR.lid.rotation.x, targetLidAngle, 0.45);

      // Micro-gestuelle selon l'état
      if (characterMood === 'speaking') {
        headGroup.rotation.y = Math.sin(t * 2.8) * 0.04;
        headGroup.rotation.x = Math.sin(t * 2.2) * 0.02;
      } else if (characterMood === 'victorious') {
        headGroup.rotation.y = Math.sin(t * 1.2) * 0.02;
        browL.position.y = 0.088;
        browR.position.y = 0.088;
      } else {
        headGroup.rotation.y = Math.sin(t * 0.6) * 0.02;
        headGroup.rotation.x = Math.cos(t * 0.5) * 0.012;
      }

      // Dérive très subtile de la caméra de studio
      camera.position.x = Math.sin(t * 0.1) * 0.03;
      camera.lookAt(0, 1.28, 0);

      // Micro-mouvement des particules de fond
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const nw = currentMount.clientWidth;
      const nh = currentMount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isAlert, characterMood]);

  return (
    <div ref={mountRef} className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden relative shadow-2xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
