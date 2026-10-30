import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D - Version Épurée, Réaliste & Élégante d'AURORE (HECh Edition)
 * - Tête simplifiée, douce et harmonieuse : ovale féminin unifié, traits fins et naturels.
 * - Chevelure blonde volumineuse et soignée : mèches fluides encadrant le visage avec élégance.
 * - Yeux expressifs et vivants : iris saphir/noisette doux, reflet cornéen vif et clignements doux.
 * - Lunettes fines contemporaines : monture dorée délicate, parfaitement proportionnée.
 * - Blazer universitaire bleu marine HECh officiel avec chemisier blanc et badge de l'école.
 * - DÉCOR ÉPURÉ & MODERNE :
 *   * Amphithéâtre contemporain avec panneaux acoustiques en bois chaleureux et éclairage LED doux.
 *   * Pas d'obstacles massifs au premier plan : cadrage portrait professionnel fluide et dégagé.
 *   * Éclairage studio 3-points chaleureux (key light champagne, fill bleutée douce, rim light dorée).
 * - Animation temps réel à 60 FPS avec respiration subtile et micro-mouvements réactifs.
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

    // --- 1. Scène & Environnement Studio Universitaire ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a101d); // Bleu nuit d'auditoire contemporain
    scene.fog = new THREE.FogExp2(0x0a101d, 0.035);

    // Caméra Cadrage Portrait 50mm (sans distorsion grand-angle)
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 40);
    camera.position.set(0, 1.40, 2.9);
    camera.lookAt(0, 1.34, 0);

    // --- 2. Rendu PBR Haute Qualité ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- 3. Texture Loader Logo HECh ---
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');
    hechLogoTex.generateMipmaps = true;

    // --- 4. Éclairage Studio Professionnel 3-Points ---
    // Key Light : Lumière principale douce à 45°
    const keyLight = new THREE.DirectionalLight(0xfff3e4, 2.5);
    keyLight.position.set(1.8, 3.2, 2.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    // Fill Light douce pour adoucir les ombres
    const fillLight = new THREE.PointLight(0xa5c4f2, 1.4, 8);
    fillLight.position.set(-2.0, 2.2, 1.8);
    scene.add(fillLight);

    // Rim Light dorée (Hair Light) qui détache gracieusement la chevelure
    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    rimLight.position.set(-1.2, 3.0, -1.8);
    scene.add(rimLight);

    // Kicker bleuté doux latéral
    const kickerLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    kickerLight.position.set(2.2, 1.8, -1.0);
    scene.add(kickerLight);

    // Ambiance douce d'auditoire
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.75);
    scene.add(ambientLight);

    // =========================================================================
    // 5. DÉCOR ÉPURÉ & RÉALISTE : AUDITOIRE / STUDIO ACADÉMIQUE MODERNE
    // =========================================================================
    const hallGroup = new THREE.Group();
    hallGroup.position.set(0, 0, -1.8);
    scene.add(hallGroup);

    // Matériau Bois Chêne Scandinave Chaleureux
    const oakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x85583b,
      roughness: 0.5,
      metalness: 0.04
    });

    // Mur de fond contemporain en alcôve douce
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x131d31,
      roughness: 0.75,
      metalness: 0.05
    });
    const backWall = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 7, 32, 1, true, -Math.PI * 0.4, Math.PI * 0.8), backWallMat);
    backWall.position.set(0, 2.8, -1.5);
    hallGroup.add(backWall);

    // Panneaux acoustiques verticaux en bois chaleureux espacés (sans effet de barreaux)
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x5a3d28,
      roughness: 0.45,
      metalness: 0.02
    });
    for (let x = -4.2; x <= 4.2; x += 0.85) {
      if (Math.abs(x) < 1.4) continue; // Dégage le centre derrière la tête d'Aurore
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.24, 4.2, 0.06), slatMat);
      slat.position.set(x, 2.4, -1.4);
      hallGroup.add(slat);

      // Éclairage LED vertical doux encastré derrière chaque panneau
      const stripLight = new THREE.PointLight(0x38bdf8, 0.4, 3);
      stripLight.position.set(x, 2.4, -1.35);
      hallGroup.add(stripLight);
    }

    // Écran mural contemporain (Verre teinté & halo diffus)
    const glassBoardMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });
    const mainScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 0.05), glassBoardMat);
    mainScreen.position.set(0, 2.5, -1.3);
    hallGroup.add(mainScreen);

    // Cadre doré fin de l'écran
    const screenFrameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.03, 0.06), screenFrameMat);
    frameTop.position.set(0, 3.51, -1.3);
    hallGroup.add(frameTop);

    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.03, 0.06), screenFrameMat);
    frameBottom.position.set(0, 1.49, -1.3);
    hallGroup.add(frameBottom);

    // Monogramme HECh lumineux élégant au fond
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 2.5, -1.26);
    const logoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 0.45),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true, opacity: 0.45 })
    );
    emblemGroup.add(logoMesh);
    hallGroup.add(emblemGroup);

    // Halo d'ambiance bleuté sous l'écran
    const screenGlow = new THREE.PointLight(0x06b6d4, 1.2, 5);
    screenGlow.position.set(0, 2.5, -1.1);
    hallGroup.add(screenGlow);

    // =========================================================================
    // 6. MATÉRIAUX D'AURORE (PEAU LISSE, YEUX EXPRESSIFS, CHEVEUX DORÉS)
    // =========================================================================
    // Peau veloutée de style Pixar / Corporate
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde2d4, // Teint clair éclatant et soyeux
      roughness: 0.58,
      metalness: 0.0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.4
    });

    // Lèvres souriantes douces
    const lipsMat = new THREE.MeshPhysicalMaterial({
      color: 0xe07a7a, // Rose corail chaleureux
      roughness: 0.35,
      clearcoat: 0.4
    });

    // Blazer bleu marine HECh
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.72,
      metalness: 0.05
    });

    // Chemisier blanc
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5
    });

    // Chevelure blonde soyeuse
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2ad63, // Miel doré chaleureux
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3
    });

    const hairHighlightMat = new THREE.MeshPhysicalMaterial({
      color: 0xf6d588, // Reflets dorés lumineux
      roughness: 0.38,
      metalness: 0.04,
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
      opacity: 0.18,
      transparent: true,
      roughness: 0.04,
      ior: 1.5
    });

    // =========================================================================
    // 7. PERSONNAGE PRINCIPAL AURORE (HARMONIEUSE, SOIGNÉE & SOURIANTE)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.42, 0);
    scene.add(characterRoot);

    // --- BUSTE & BLAZER CORPORATE ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.72, 0);
    characterRoot.add(torsoGroup);

    // Torse cintré élégant
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.65, 32), blazerMat);
    torso.scale.set(1.15, 1.0, 0.72);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Encolure et revers fins du blazer
    const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.03), blazerMat);
    lapelLeft.position.set(-0.09, 0.14, 0.23);
    lapelLeft.rotation.z = -0.22;
    torsoGroup.add(lapelLeft);

    const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.03), blazerMat);
    lapelRight.position.set(0.09, 0.14, 0.23);
    lapelRight.rotation.z = 0.22;
    torsoGroup.add(lapelRight);

    // Chemisier blanc élégant
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.34, 0.02), shirtMat);
    shirt.position.set(0, 0.14, 0.215);
    torsoGroup.add(shirt);

    // Col en V soyeux
    const vCollar = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 3), shirtMat);
    vCollar.position.set(0, 0.30, 0.22);
    vCollar.rotation.x = Math.PI;
    torsoGroup.add(vCollar);

    // Épaules souples naturelles (sans grosses sphères disjointes)
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
    neckGroup.position.set(0, 1.10, 0);
    characterRoot.add(neckGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.095, 0.22, 24), skinMat);
    neck.position.y = 0.02;
    neck.castShadow = true;
    neckGroup.add(neck);

    // --- TÊTE D'AURORE (SIMPLIFIÉE, DOUCE & NATURELLE) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.30, 0);
    characterRoot.add(headGroup);

    // Crâne & Visage unifié (Ovale féminin gracieux Pixar)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 48, 48), skinMat);
    head.scale.set(0.92, 1.08, 0.95);
    head.castShadow = true;
    headGroup.add(head);

    // Menton doux et délicat
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 24), skinMat);
    chin.position.set(0, -0.21, 0.10);
    chin.scale.set(0.9, 0.6, 0.7);
    headGroup.add(chin);

    // Nez discret, fin et proportionné (fini le gros cylindre saillant)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.085, 16), skinMat);
    nose.position.set(0, -0.015, 0.23);
    nose.rotation.x = 0.15;
    headGroup.add(nose);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), skinMat);
    noseTip.position.set(0, -0.045, 0.235);
    headGroup.add(noseTip);

    // Lèvres souriantes naturelles et chaleureuses (sourire avenant)
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
    const irisMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8, // Bleu saphir élégant
      roughness: 0.2,
      clearcoat: 0.8
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

    // Sourcils fins et élégants
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

    // Mèches latérales soyeuses et fluides encadrant le visage (volumes adoucis sans arêtes cylindriques)
    const lockL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 24), hairHighlightMat);
    lockL.scale.set(0.65, 2.0, 0.75);
    lockL.position.set(-0.16, -0.06, 0.05);
    lockL.rotation.set(0.12, 0.15, 0.15);
    hairGroup.add(lockL);

    const lockR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 24), hairHighlightMat);
    lockR.scale.set(0.65, 2.0, 0.75);
    lockR.position.set(0.16, -0.06, 0.05);
    lockR.rotation.set(0.12, -0.15, -0.15);
    hairGroup.add(lockR);

    // Chignon / Volume arrière soigné
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
    // 8. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION NATURELLE & MICRO-GESTES)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Respiration naturelle et douce
      const breath = Math.sin(t * 2.0);
      torsoGroup.scale.y = 1.0 + breath * 0.006;
      headGroup.position.y = 1.30 + breath * 0.004;

      // Clignement doux naturel
      const blinkCycle = (t * 0.8) % 4.5;
      const isBlinking = blinkCycle < 0.12;
      const targetLidAngle = isBlinking ? 0.0 : -Math.PI / 2.2;
      eyeL.lid.rotation.x = THREE.MathUtils.lerp(eyeL.lid.rotation.x, targetLidAngle, 0.45);
      eyeR.lid.rotation.x = THREE.MathUtils.lerp(eyeR.lid.rotation.x, targetLidAngle, 0.45);

      // Micro-expressions selon l'humeur
      if (characterMood === 'speaking') {
        headGroup.rotation.y = Math.sin(t * 2.8) * 0.05;
        headGroup.rotation.x = Math.sin(t * 2.2) * 0.025;
        padGroup.rotation.z = Math.sin(t * 2.0) * 0.03;
      } else if (characterMood === 'victorious') {
        headGroup.rotation.y = Math.sin(t * 1.2) * 0.02;
        headGroup.rotation.x = -0.02;
        browL.position.y = 0.092;
        browR.position.y = 0.092;
      } else if (characterMood === 'worried') {
        headGroup.rotation.y = -0.03;
        browL.rotation.z = -0.06;
        browR.rotation.z = 0.06;
      } else {
        // Thinking / neutre
        headGroup.rotation.y = Math.sin(t * 0.6) * 0.025;
        headGroup.rotation.x = Math.cos(t * 0.5) * 0.015;
      }

      // Travelling subtil de caméra
      camera.position.x = Math.sin(t * 0.12) * 0.05;
      camera.lookAt(0, 1.34, 0);

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
