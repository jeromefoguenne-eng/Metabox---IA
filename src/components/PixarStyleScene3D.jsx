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

    // --- 4. Éclairage Portrait Chaleureux 3-Points (Flatteur, Vivant & Bienveillant) ---
    // Hemisphere Light : Ciel champagne doux + rebond violet lavande (ombrage velouté naturel)
    const hemiLight = new THREE.HemisphereLight(0xfff5ea, 0x1e1528, 1.4);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.65);
    scene.add(ambientLight);

    // Key Light : Lumière dorée douce principale (angles flatteurs pour le visage)
    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    keyLight.position.set(1.4, 2.4, 2.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.radius = 3.5; // Ombres très douces
    scene.add(keyLight);

    // Fill Light : Ciel poudré lavande pour déboucher les ombres sans contraste dur
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 1.3);
    fillLight.position.set(-1.6, 1.6, 1.5);
    scene.add(fillLight);

    // Rim / Hair Light : Or chaud éclatant pour sublimer la chevelure blonde
    const rimLight = new THREE.DirectionalLight(0xfde047, 2.6);
    rimLight.position.set(-0.6, 2.6, -1.8);
    scene.add(rimLight);

    // Kicker bas : Douce lueur cyan technologique venant de l'anneau
    const kickerLight = new THREE.PointLight(0x38bdf8, 1.0, 5);
    kickerLight.position.set(1.2, 0.8, -0.4);
    scene.add(kickerLight);

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
    // 6. MATÉRIAUX D'AURORE (PEAU DOUCE & LUMINEUSE, POMMETTES ROSÉES, BLAZER ÉLÉGANT)
    // =========================================================================
    // Peau veloutée douce et chaleureuse (Zéro facettes angulaires dures, rendu naturel Pixar)
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffe6db,
      roughness: 0.38,
      metalness: 0.02
    });

    // Pommettes rosées bienveillantes (Blush naturel doux)
    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.80,
      transparent: true,
      opacity: 0.40
    });

    // Lèvres souriantes naturelles corail-rose satinées
    const lipsMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      roughness: 0.28,
      metalness: 0.05
    });

    // Blazer universitaire cintré bleu nuit profond moderne
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Bleu nuit profond contemporain
      roughness: 0.52,
      metalness: 0.08
    });

    // Liserés dorés raffinés
    const blazerTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Or ambré
      metalness: 0.90,
      roughness: 0.16
    });

    // Chemisier blanc cassé soyeux
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.40
    });

    // Chevelure blonde soyeuse aux reflets miel et or
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.44,
      metalness: 0.08
    });

    const hairHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.38,
      metalness: 0.05
    });

    // Monture lunettes dorée fine
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1.0,
      transparent: true,
      roughness: 0.04,
      ior: 1.5
    });

    // =========================================================================
    // 7. PERSONNAGE PRINCIPAL AURORE 3D (CHARMANTE, BIENVEILLANTE & ANIMÉE 60 FPS)
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

    // --- BUSTE & BLAZER TAILLEUR AJUSTÉ FÉMININ ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.72, 0);
    characterRoot.add(torsoGroup);

    // Torse cintré élégant avec proportions naturelles
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.58, 32), blazerMat);
    torso.scale.set(1.08, 1.0, 0.74);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Revers et liserés dorés fins qui épousent le décolleté
    const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.02), blazerTrimMat);
    lapelLeft.position.set(-0.075, 0.12, 0.20);
    lapelLeft.rotation.z = -0.18;
    torsoGroup.add(lapelLeft);

    const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.02), blazerTrimMat);
    lapelRight.position.set(0.075, 0.12, 0.20);
    lapelRight.rotation.z = 0.18;
    torsoGroup.add(lapelRight);

    // Chemisier blanc avec encolure douce
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.28, 0.015), shirtMat);
    shirt.position.set(0, 0.12, 0.19);
    torsoGroup.add(shirt);

    const vCollar = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.14, 3), shirtMat);
    vCollar.position.set(0, 0.26, 0.195);
    vCollar.rotation.x = Math.PI;
    torsoGroup.add(vCollar);

    // Épaules douces intégrées naturellement
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 24), blazerMat);
    shoulderL.position.set(-0.24, 0.22, 0);
    shoulderL.scale.set(1.0, 0.8, 0.85);
    torsoGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 24), blazerMat);
    shoulderR.position.set(0.24, 0.22, 0);
    shoulderR.scale.set(1.0, 0.8, 0.85);
    torsoGroup.add(shoulderR);

    // Badge officiel HECh sur le revers gauche
    const badge = new THREE.Group();
    badge.position.set(-0.12, 0.14, 0.21);
    badge.rotation.y = -0.15;
    const badgeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.008, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
    );
    badgeBase.rotation.x = Math.PI / 2;
    badge.add(badgeBase);

    const badgeArt = new THREE.Mesh(
      new THREE.PlaneGeometry(0.068, 0.068),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    badgeArt.position.z = 0.006;
    badge.add(badgeArt);
    torsoGroup.add(badge);

    // Bras gracieux et naturels tenant la tablette
    const armsGroup = new THREE.Group();
    torsoGroup.add(armsGroup);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.040, 0.32, 16), blazerMat);
    armL.position.set(-0.24, -0.06, 0.08);
    armL.rotation.set(0.42, 0, 0.24);
    armsGroup.add(armL);

    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), skinMat);
    handL.position.set(-0.16, -0.18, 0.22);
    armsGroup.add(handL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.040, 0.32, 16), blazerMat);
    armR.position.set(0.24, -0.06, 0.08);
    armR.rotation.set(0.42, 0, -0.24);
    armsGroup.add(armR);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), skinMat);
    handR.position.set(0.16, -0.18, 0.22);
    armsGroup.add(handR);

    // Tablette tactile interactive tenue à mi-buste
    const padGroup = new THREE.Group();
    padGroup.position.set(0, -0.18, 0.25);
    padGroup.rotation.x = -0.42;

    const padBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.18, 0.010),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 })
    );
    padGroup.add(padBody);

    const padScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.16),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    padScreen.position.z = 0.006;
    padGroup.add(padScreen);
    torsoGroup.add(padGroup);

    // --- COU ÉLÉGANT & HARMONIEUX ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.08, 0);
    characterRoot.add(neckGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.076, 0.18, 24), skinMat);
    neck.position.y = 0.02;
    neck.castShadow = true;
    neckGroup.add(neck);

    // --- TÊTE D'AURORE (DOUCE, RADIEUSE, SOURIANTE & SYMPATHIQUE) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.28, 0);
    characterRoot.add(headGroup);

    // Crâne & Visage unifié (Ovale féminin gracieux aux courbes douces)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.20, 48, 48), skinMat);
    head.scale.set(0.95, 1.06, 0.98);
    head.castShadow = true;
    headGroup.add(head);

    // Menton délicat et souriant
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.046, 24, 24), skinMat);
    chin.position.set(0, -0.18, 0.09);
    chin.scale.set(0.9, 0.6, 0.7);
    headGroup.add(chin);

    // Pommettes rosées chaleureuses (Blush naturel qui donne immédiatement un air sympathique)
    const cheekBlushL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), blushMat);
    cheekBlushL.position.set(-0.095, -0.038, 0.168);
    cheekBlushL.scale.set(1.2, 0.7, 0.5);
    headGroup.add(cheekBlushL);

    const cheekBlushR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), blushMat);
    cheekBlushR.position.set(0.095, -0.038, 0.168);
    cheekBlushR.scale.set(1.2, 0.7, 0.5);
    headGroup.add(cheekBlushR);

    // Nez fin, doux et discret (Zéro cône abrupt)
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.013, 0.075, 16), skinMat);
    noseBridge.position.set(0, 0.015, 0.198);
    noseBridge.rotation.x = 0.18;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), skinMat);
    noseTip.position.set(0, -0.024, 0.206);
    headGroup.add(noseTip);

    // Lèvres douces dessinant un vrai sourire chaleureux
    const lipsGroup = new THREE.Group();
    lipsGroup.position.set(0, -0.105, 0.185);
    headGroup.add(lipsGroup);

    // Arc supérieur souriant avec commissures relevées
    const lipUpper = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.007, 16, 32, Math.PI * 0.72), lipsMat);
    lipUpper.rotation.x = Math.PI * 0.88;
    lipUpper.rotation.z = Math.PI * 0.14;
    lipsGroup.add(lipUpper);

    // Lèvre inférieure pulpeuse et satinée
    const lipLower = new THREE.Mesh(new THREE.SphereGeometry(0.019, 16, 16), lipsMat);
    lipLower.position.set(0, -0.012, 0.004);
    lipLower.scale.set(1.3, 0.55, 0.6);
    lipsGroup.add(lipLower);

    // --- YEUX EXPRESSIFS, LUMINEUX & REGARD INTELLIGENT ET BIENVEILLANT ---
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.10 });
    const irisOuterMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2 });
    const irisInnerMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const glintPrimaryMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const glintSecondaryMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEye = (xPos) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0.035, 0.168);

      // Globe oculaire doux
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.034, 32, 32), scleraMat);
      eyeGroup.add(eyeball);

      // Iris bleu saphir profond
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.020, 32), irisOuterMat);
      iris.position.set(0, 0, 0.0335);
      eyeGroup.add(iris);

      // Reflet cyan radieux au centre de l'iris
      const irisCore = new THREE.Mesh(new THREE.CircleGeometry(0.013, 24), irisInnerMat);
      irisCore.position.set(0, 0, 0.0338);
      eyeGroup.add(irisCore);

      // Pupille douce
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.0085, 24), pupilMat);
      pupil.position.set(0, 0, 0.0341);
      eyeGroup.add(pupil);

      // Double étincelle de vie Pixar (Catchlights)
      const glint1 = new THREE.Mesh(new THREE.CircleGeometry(0.0042, 16), glintPrimaryMat);
      glint1.position.set(0.0055, 0.0055, 0.0344);
      eyeGroup.add(glint1);

      const glint2 = new THREE.Mesh(new THREE.CircleGeometry(0.0022, 12), glintSecondaryMat);
      glint2.position.set(-0.0055, -0.0055, 0.0344);
      eyeGroup.add(glint2);

      // Courbe douce de cil supérieur féminin
      const lashCurve = new THREE.Mesh(
        new THREE.TorusGeometry(0.030, 0.0025, 8, 24, Math.PI * 0.75),
        new THREE.MeshBasicMaterial({ color: 0x1f2937 })
      );
      lashCurve.position.set(0, 0.008, 0.026);
      lashCurve.rotation.x = -Math.PI / 6;
      eyeGroup.add(lashCurve);

      // Paupière pour clignement doux
      const lidGeo = new THREE.SphereGeometry(0.036, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const lid = new THREE.Mesh(lidGeo, skinMat);
      lid.rotation.x = -Math.PI / 2.2;
      eyeGroup.add(lid);

      return { group: eyeGroup, lid };
    };

    const eyeL = createEye(-0.068);
    const eyeR = createEye(0.068);
    headGroup.add(eyeL.group);
    headGroup.add(eyeR.group);

    // Sourcils châtains dorés arqués avec bienveillance
    const browMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6 });
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.060, 0.008, 0.010), browMat);
    browL.position.set(-0.068, 0.082, 0.185);
    browL.rotation.z = 0.08;
    headGroup.add(browL);

    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.060, 0.008, 0.010), browMat);
    browR.position.set(0.068, 0.082, 0.185);
    browR.rotation.z = -0.08;
    headGroup.add(browR);

    // --- LUNETTES FINES DORÉES CONTEMPORAINES (PANTOS CHIC) ---
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.034, 0.208);
    headGroup.add(glassesGroup);

    // Pont de nez fin en or
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.038, 12), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.004, 0);
    glassesGroup.add(bridge);

    // Cerclages délicats ronds
    [-0.068, 0.068].forEach((xPos) => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.0028, 16, 36), frameMat);
      rim.position.set(xPos, 0, 0);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.030, 24), lensMat);
      lens.position.set(xPos, 0, 0.001);
      glassesGroup.add(lens);
    });

    // Branches latérales fines qui vont vers les tempes
    [-0.098, 0.098].forEach((xPos, idx) => {
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.0035, 0.0035, 0.17), frameMat);
      temple.position.set(xPos, 0.006, -0.075);
      temple.rotation.y = idx === 0 ? 0.06 : -0.06;
      glassesGroup.add(temple);
    });

    // --- CHEVELURE BLONDE SOYEUSE, FLUIDE ET VOLUMINEUSE ---
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Calotte principale arrondie
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 36, 36, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairCrown.position.set(0, 0.05, -0.02);
    hairCrown.scale.set(0.97, 1.05, 1.06);
    hairGroup.add(hairCrown);

    // Frange douce balayée sur le front (courbe élégante et naturelle)
    const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.11, 28, 28), hairHighlightMat);
    bangs.position.set(-0.04, 0.15, 0.13);
    bangs.scale.set(1.3, 0.42, 0.65);
    bangs.rotation.set(-0.20, 0.18, 0.32);
    hairGroup.add(bangs);

    // Mèches latérales douces qui encadrent délicatement le visage (épousent les joues)
    const lockL = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.016, 0.42, 20), hairHighlightMat);
    lockL.position.set(-0.15, -0.08, 0.05);
    lockL.rotation.set(0.12, 0.15, 0.06);
    hairGroup.add(lockL);

    const lockR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.016, 0.42, 20), hairHighlightMat);
    lockR.position.set(0.15, -0.08, 0.05);
    lockR.rotation.set(0.12, -0.15, -0.06);
    hairGroup.add(lockR);

    // Volume arrière soyeux
    const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), hairMat);
    hairBack.position.set(0, 0.02, -0.14);
    hairBack.scale.set(1.1, 1.2, 0.9);
    hairGroup.add(hairBack);

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
