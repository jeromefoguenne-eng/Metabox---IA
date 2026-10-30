import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D - Studio Virtuel 3D Temps Réel d'A.U.R.O.R.E.
 * Direction Artistique B : Stylisé Arcane / Tech-Noir Fortiche (In-Engine 60 FPS)
 * 
 * Modélisation procédurale 3D complète & animée :
 * - Buste & Blazer bleu nuit avec liserés or et badge officiel HECh
 * - Cou & Visage féminin gracieux sculpté avec nez fin et sourire avenant
 * - Regard vivant : yeux expressifs, iris saphir, pupille, catchlight et paupières avec clignements doux
 * - Lunettes fines contemporaines dorées avec branches et verres transparents
 * - Chevelure blonde soyeuse volumineuse encadrant le visage
 * - Bras tenant une tablette interactive à écran cyan luminescent
 * - Boucle d'animation à 60 FPS : respiration naturelle, clignements, head-look et micro-gestuelle
 * - Éclairage studio Arcane 3-points : Ambre doré (Key), Cyan électrique (Rim) et Violet royal (Fill)
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

    // --- 1. Scène Arène Stylisée Arcane / Tech-Noir ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e051b);
    scene.fog = new THREE.FogExp2(0x0e051b, 0.035);

    // Caméra Cadrage Portrait 50mm flatteur & naturel
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 30);
    camera.position.set(0, 1.34, 2.95);
    camera.lookAt(0, 1.28, 0);

    // --- 2. Rendu PBR Haute Définition Contrasté ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- 3. Textures Officielles ---
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png', () => {
      setIsLoaded(true);
    });

    // --- 4. Éclairage Cell-Shaded Studio Style Arcane (Ambre Chaud + Cyan Électrique + Violet) ---
    // Key Light : Ambre doré chaud à fort contraste (Style Fortiche)
    const keyLight = new THREE.DirectionalLight(0xf59e0b, 2.8);
    keyLight.position.set(1.6, 2.6, 2.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);

    // Fill Light : Violet royal pour déboucher les ombres avec nuance chromatique
    const fillLight = new THREE.DirectionalLight(0x7c3aed, 1.4);
    fillLight.position.set(-1.8, 1.8, 1.6);
    scene.add(fillLight);

    // Rim Light (Hair & Edge Light) : Cyan électrique tranchant d'animation de pointe
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.2);
    rimLight.position.set(-0.8, 2.4, -1.5);
    scene.add(rimLight);

    // Kicker : Magenta néon d'interférence cybernétique
    const kickerLight = new THREE.PointLight(0xd946ef, 1.4, 5);
    kickerLight.position.set(1.4, 1.2, -0.6);
    scene.add(kickerLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // =========================================================================
    // 5. DÉCOR ARÈNE NÉO-RÉTRO ARCANE (BOISERIES SOMBRES & NEONS CUIVRÉS/OR)
    // =========================================================================
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, 0, -1.2);
    scene.add(studioGroup);

    // Fond courbe velouté violet sombre
    const alcoveGeo = new THREE.CylinderGeometry(5.5, 5.5, 5.0, 32, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    const alcoveMat = new THREE.MeshStandardMaterial({
      color: 0x140827,
      roughness: 0.85,
      side: THREE.BackSide
    });
    const alcove = new THREE.Mesh(alcoveGeo, alcoveMat);
    alcove.position.set(0, 1.8, 0);
    studioGroup.add(alcove);

    // Panneaux verticaux en noyer sombre avec liserés or brossé
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

    // Arc lumineux technologique au plafond (Hextech style)
    const hexRingGeo = new THREE.TorusGeometry(2.4, 0.025, 16, 48, Math.PI);
    const hexRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const hexRing = new THREE.Mesh(hexRingGeo, hexRingMat);
    hexRing.position.set(0, 3.2, -1.5);
    hexRing.rotation.x = Math.PI / 2;
    studioGroup.add(hexRing);

    // Particules de poussière cybernétique flottantes en arrière-plan
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
    // 6. MATÉRIAUX D'AURORE (PEAU LISSE, YEUX EXPRESSIFS, BLAZER ARCANE)
    // =========================================================================
    // Peau veloutée sculptée avec sous-surface douce
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfce7dc,
      roughness: 0.52,
      metalness: 0.02
    });

    // Lèvres souriantes satinées
    const lipsMat = new THREE.MeshStandardMaterial({
      color: 0xd9777f,
      roughness: 0.35,
      metalness: 0.05
    });

    // Blazer universitaire bleu nuit HECh avec revers or style Arcane
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x11162b, // Bleu nuit profond
      roughness: 0.55,
      metalness: 0.12
    });

    const blazerTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Or ambré
      metalness: 0.85,
      roughness: 0.22
    });

    // Chemisier blanc cassé soyeux
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45
    });

    // Chevelure blonde soyeuse aux reflets dorés chauds
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xdeb86b,
      roughness: 0.45,
      metalness: 0.08
    });

    const hairHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xf7da88,
      roughness: 0.40,
      metalness: 0.06
    });

    // Lunettes dorées fines
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.18
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      ior: 1.5
    });

    // =========================================================================
    // 7. PERSONNAGE PRINCIPAL AURORE 3D (ANIMÉE & EXPRESSIVE)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.40, 0);
    scene.add(characterRoot);

    // Socle flottant avec anneau cyan lumineux
    const podGeo = new THREE.CylinderGeometry(0.52, 0.46, 0.04, 32);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.7
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(0, 0.08, 0);
    characterRoot.add(pod);

    const podRingGeo = new THREE.TorusGeometry(0.50, 0.012, 16, 48);
    const podRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const podRing = new THREE.Mesh(podRingGeo, podRingMat);
    podRing.rotation.x = Math.PI / 2;
    podRing.position.set(0, 0.10, 0);
    characterRoot.add(podRing);

    // --- BUSTE & BLAZER CORPORATE ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.70, 0);
    characterRoot.add(torsoGroup);

    // Torse cintré élégant
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.65, 32), blazerMat);
    torso.scale.set(1.15, 1.0, 0.72);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Revers et liserés dorés du blazer (Style Arcane Haute École)
    const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.36, 0.03), blazerTrimMat);
    lapelLeft.position.set(-0.09, 0.14, 0.23);
    lapelLeft.rotation.z = -0.22;
    torsoGroup.add(lapelLeft);

    const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.36, 0.03), blazerTrimMat);
    lapelRight.position.set(0.09, 0.14, 0.23);
    lapelRight.rotation.z = 0.22;
    torsoGroup.add(lapelRight);

    // Chemisier blanc
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.34, 0.02), shirtMat);
    shirt.position.set(0, 0.14, 0.215);
    torsoGroup.add(shirt);

    // Col en V soyeux
    const vCollar = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 3), shirtMat);
    vCollar.position.set(0, 0.30, 0.22);
    vCollar.rotation.x = Math.PI;
    torsoGroup.add(vCollar);

    // Épaules souples naturelles
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.10, 24, 24), blazerMat);
    shoulderL.position.set(-0.29, 0.26, 0);
    shoulderL.scale.set(1.0, 0.75, 0.85);
    torsoGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.10, 24, 24), blazerMat);
    shoulderR.position.set(0.29, 0.26, 0);
    shoulderR.scale.set(1.0, 0.75, 0.85);
    torsoGroup.add(shoulderR);

    // Badge officiel HECh net et discret sur le revers gauche
    const badge = new THREE.Group();
    badge.position.set(-0.14, 0.16, 0.24);
    badge.rotation.y = -0.15;
    const badgeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.008, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
    );
    badgeBase.rotation.x = Math.PI / 2;
    badge.add(badgeBase);

    const badgeArt = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.08),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    badgeArt.position.z = 0.006;
    badge.add(badgeArt);
    torsoGroup.add(badge);

    // --- COU HARMONIEUX ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.08, 0);
    characterRoot.add(neckGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.095, 0.22, 24), skinMat);
    neck.position.y = 0.02;
    neck.castShadow = true;
    neckGroup.add(neck);

    // --- TÊTE D'AURORE (SIMPLIFIÉE, DOUCE & NATURELLE) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.28, 0);
    characterRoot.add(headGroup);

    // Crâne & Visage unifié (Ovale féminin gracieux)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 48, 48), skinMat);
    head.scale.set(0.92, 1.08, 0.95);
    head.castShadow = true;
    headGroup.add(head);

    // Menton délicat
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 24), skinMat);
    chin.position.set(0, -0.21, 0.10);
    chin.scale.set(0.9, 0.6, 0.7);
    headGroup.add(chin);

    // Nez fin et proportionné
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.085, 16), skinMat);
    nose.position.set(0, -0.015, 0.23);
    nose.rotation.x = 0.15;
    headGroup.add(nose);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), skinMat);
    noseTip.position.set(0, -0.045, 0.235);
    headGroup.add(noseTip);

    // Lèvres souriantes naturelles
    const lipsGroup = new THREE.Group();
    lipsGroup.position.set(0, -0.12, 0.205);
    headGroup.add(lipsGroup);

    const lipUpper = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.009, 12, 24, Math.PI * 0.7), lipsMat);
    lipUpper.rotation.x = Math.PI / 2;
    lipUpper.rotation.z = Math.PI * 0.15;
    lipsGroup.add(lipUpper);

    const lipLower = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 16), lipsMat);
    lipLower.position.set(0, -0.016, 0.005);
    lipLower.scale.set(1.4, 0.5, 0.6);
    lipsGroup.add(lipLower);

    // --- YEUX EXPRESSIFS & REGARD VIVANT ---
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.15 });
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Bleu saphir élégant
      roughness: 0.2
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x080808 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEye = (xPos) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0.035, 0.185);

      // Globe oculaire
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.036, 24, 24), scleraMat);
      eyeGroup.add(eyeball);

      // Iris doux
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.019, 24), irisMat);
      iris.position.set(0, 0, 0.0355);
      eyeGroup.add(iris);

      // Pupille
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.0095, 24), pupilMat);
      pupil.position.set(0, 0, 0.036);
      eyeGroup.add(pupil);

      // Reflet cornéen vivant (Catchlight)
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.004, 12), glintMat);
      glint.position.set(0.006, 0.006, 0.0365);
      eyeGroup.add(glint);

      // Paupière supérieure pour clignement
      const lidGeo = new THREE.SphereGeometry(0.038, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const lid = new THREE.Mesh(lidGeo, skinMat);
      lid.rotation.x = -Math.PI / 2.2;
      eyeGroup.add(lid);

      return { group: eyeGroup, lid };
    };

    const eyeL = createEye(-0.072);
    const eyeR = createEye(0.072);
    headGroup.add(eyeL.group);
    headGroup.add(eyeR.group);

    // Sourcils fins et expressifs
    const browMat = new THREE.MeshStandardMaterial({ color: 0x85582f, roughness: 0.6 });
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.009, 0.012), browMat);
    browL.position.set(-0.072, 0.085, 0.20);
    browL.rotation.z = 0.06;
    headGroup.add(browL);

    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.009, 0.012), browMat);
    browR.position.set(0.072, 0.085, 0.20);
    browR.rotation.z = -0.06;
    headGroup.add(browR);

    // --- LUNETTES FINES DORÉES CONTEMPORAINES ---
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.035, 0.225);
    headGroup.add(glassesGroup);

    // Pont de nez fin
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.045, 12), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.004, 0);
    glassesGroup.add(bridge);

    // Cerclages délicats
    [-0.072, 0.072].forEach((xPos) => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.0035, 12, 32), frameMat);
      rim.position.set(xPos, 0, 0);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.032, 24), lensMat);
      lens.position.set(xPos, 0, 0.001);
      glassesGroup.add(lens);
    });

    // Branches latérales fines
    [-0.108, 0.108].forEach((xPos, idx) => {
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.004, 0.19), frameMat);
      temple.position.set(xPos, 0.008, -0.085);
      temple.rotation.y = idx === 0 ? 0.06 : -0.06;
      glassesGroup.add(temple);
    });

    // --- CHEVELURE BLONDE VOLUMINEUSE & SOYEUSE ---
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Calotte principale arrondie
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairCrown.position.set(0, 0.06, -0.02);
    hairCrown.scale.set(0.97, 1.05, 1.06);
    hairGroup.add(hairCrown);

    // Frange douce balayée sur le front
    const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), hairHighlightMat);
    bangs.position.set(-0.05, 0.17, 0.14);
    bangs.scale.set(1.4, 0.45, 0.7);
    bangs.rotation.set(-0.25, 0.2, 0.4);
    hairGroup.add(bangs);

    // Mèches latérales élégantes qui encadrent le visage
    const lockL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.02, 0.45, 16), hairHighlightMat);
    lockL.position.set(-0.16, -0.08, 0.06);
    lockL.rotation.set(0.15, 0.2, 0.18);
    hairGroup.add(lockL);

    const lockR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.02, 0.45, 16), hairHighlightMat);
    lockR.position.set(0.16, -0.08, 0.06);
    lockR.rotation.set(0.15, -0.2, -0.18);
    hairGroup.add(lockR);

    const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), hairMat);
    hairBack.position.set(0, 0.02, -0.15);
    hairBack.scale.set(1.1, 1.2, 0.9);
    hairGroup.add(hairBack);

    // --- POSTURE NATURELLE D'ACCUEIL ---
    const armsGroup = new THREE.Group();
    torsoGroup.add(armsGroup);

    // Bras gauche
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.38, 16), blazerMat);
    armL.position.set(-0.31, -0.08, 0.04);
    armL.rotation.z = 0.22;
    armsGroup.add(armL);

    // Bras droit
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.38, 16), blazerMat);
    armR.position.set(0.31, -0.08, 0.04);
    armR.rotation.z = -0.22;
    armsGroup.add(armR);

    // Tablette tactile interactive tenue élégamment à mi-buste
    const padGroup = new THREE.Group();
    padGroup.position.set(0, -0.18, 0.26);
    padGroup.rotation.x = -0.45;

    const padBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.16, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
    );
    padGroup.add(padBody);

    const padScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.14),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    padScreen.position.z = 0.007;
    padGroup.add(padScreen);
    torsoGroup.add(padGroup);

    // =========================================================================
    // 8. INTERACTION MOUSE TRACKING & PARALLAXE DOUCE
    // =========================================================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(x * 0.12, -0.12, 0.12);
      mouse.targetY = THREE.MathUtils.clamp(y * 0.08, -0.08, 0.08);
    };
    currentMount.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 9. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION NATURELLE & MICRO-GESTES)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Parallaxe douce suivant la souris
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.05);

      // Respiration naturelle et douce
      const breath = Math.sin(t * 2.0);
      torsoGroup.scale.y = 1.0 + breath * 0.006;
      headGroup.position.y = 1.28 + breath * 0.004;

      // Clignement doux naturel
      const blinkCycle = (t * 0.8) % 4.5;
      const isBlinking = blinkCycle < 0.12;
      const targetLidAngle = isBlinking ? 0.0 : -Math.PI / 2.2;
      eyeL.lid.rotation.x = THREE.MathUtils.lerp(eyeL.lid.rotation.x, targetLidAngle, 0.45);
      eyeR.lid.rotation.x = THREE.MathUtils.lerp(eyeR.lid.rotation.x, targetLidAngle, 0.45);

      // Micro-expressions selon l'humeur
      if (characterMood === 'speaking') {
        headGroup.rotation.y = mouse.x + Math.sin(t * 2.8) * 0.05;
        headGroup.rotation.x = -mouse.y + Math.sin(t * 2.2) * 0.025;
        padGroup.rotation.z = Math.sin(t * 2.0) * 0.03;
        padScreen.material.color.setHex(0x38bdf8);
      } else if (characterMood === 'victorious') {
        headGroup.rotation.y = mouse.x + Math.sin(t * 1.2) * 0.02;
        headGroup.rotation.x = -mouse.y - 0.02;
        browL.position.y = 0.092;
        browR.position.y = 0.092;
        padScreen.material.color.setHex(0x10b981); // Vert victoire
      } else if (characterMood === 'worried' || isAlert) {
        headGroup.rotation.y = mouse.x - 0.03;
        headGroup.rotation.x = -mouse.y + 0.02;
        browL.rotation.z = -0.06;
        browR.rotation.z = 0.06;
        padScreen.material.color.setHex(0xf43f5e); // Alerte
      } else {
        // Thinking / neutre : regard doux
        headGroup.rotation.y = mouse.x + Math.sin(t * 0.6) * 0.025;
        headGroup.rotation.x = -mouse.y + Math.cos(t * 0.5) * 0.015;
        padScreen.material.color.setHex(0x06b6d4);
      }

      // Rotation douce de l'anneau holographique
      podRing.rotation.z = t * 0.25;

      // Travelling subtil de caméra
      camera.position.x = Math.sin(t * 0.12) * 0.05;
      camera.lookAt(0, 1.28, 0);

      // Flottement des particules d'arrière-plan
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
    <div ref={mountRef} className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden relative shadow-2xl bg-[#0e051b]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(14,5,27,0.6)_100%)]" />
    </div>
  );
}
