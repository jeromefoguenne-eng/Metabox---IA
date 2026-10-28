import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D (Realistic Collegiate Character Edition):
 * Modélisation 3D humaine réaliste et soignée d'un jeune étudiant / chercheur du campus HECh :
 * - Morphologie faciale anatomique : traits fins, proportions naturelles (tête / buste / épaules).
 * - Yeux humains expressifs avec cornée, iris texturé noisette/saphir, anneau limbique et reflet naturel.
 * - Nez profilé réaliste, lèvres sculptées avec commissures naturelles.
 * - Chevelure moderne texturée (coupe contemporaine soignée).
 * - Veste de campus / blazer universitaire ajusté bleu marine avec col et chemise.
 * - Badge officiel de la Haute École Charlemagne (PNG transparent) sur la poitrine.
 * - Posture humaine naturelle, détendue et élégante avec respiration subtile et clignements doux.
 * - Compagnon IA A.U.R.O.R.E. en arrière-plan holographique.
 */
export default function PixarStyleScene3D({
  theme = 'hub', // 'hub' | 'factcheck' | 'tribunal' | 'datacenter' | 'promptwars' | 'boss'
  isAlert = false,
  characterMood = 'thinking' // 'thinking' | 'speaking' | 'victorious' | 'worried'
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scène & Environnement Cyber-Campus
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      theme === 'datacenter' ? 0x030814 :
      theme === 'tribunal' ? 0x0c0714 :
      theme === 'factcheck' ? 0x040a18 :
      theme === 'promptwars' ? 0x120514 : 0x060c18
    );
    scene.fog = new THREE.FogExp2(scene.background, 0.035);

    // Caméra Portrait Buste Réaliste (Perspective 35mm douce)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 1.48, 3.8);
    camera.lookAt(0, 1.42, 0);

    // 2. Moteur de Rendu PBR Haute Précision
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 3. Texture Loader pour Logo Officiel HECh (PNG transparent)
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');
    hechLogoTex.generateMipmaps = true;

    // 4. Éclairage Studio Portrait Cinématographique
    // Key Light : Lumière principale douce à 45°
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.6);
    keyLight.position.set(2.8, 4.2, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.radius = 2.0;
    scene.add(keyLight);

    // Fill Light douce pour déboucher les ombres du visage
    const fillLight = new THREE.PointLight(0x93c5fd, 1.4, 8);
    fillLight.position.set(-3.0, 2.5, 2.0);
    scene.add(fillLight);

    // Hair Light / Rim Light dorée qui sculpte les contours de la tête
    const rimLight = new THREE.DirectionalLight(isAlert ? 0xf43f5e : 0xfde047, 2.2);
    rimLight.position.set(-1.2, 3.8, -2.8);
    scene.add(rimLight);

    // Kicker subtil bleuté à droite
    const kickerLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    kickerLight.position.set(3.5, 2.2, -1.5);
    scene.add(kickerLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // 5. Matériaux PBR Réalistes (Peau, Veste, Cheveux)
    // Peau Réaliste Humaine (Ton chair naturel européen/méditerranéen doux)
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5cfb8,
      roughness: 0.58,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.6
    });

    const lipsMat = new THREE.MeshPhysicalMaterial({
      color: 0xd98880,
      roughness: 0.42,
      clearcoat: 0.18
    });

    // Veste de Campus / Blazer Bleu Nuit Élégant
    const jacketMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b, // Bleu nuit sobre
      roughness: 0.72,
      metalness: 0.05
    });

    // Chemise / Pull fin blanc cassé
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6
    });

    // Chevelure Châtain Foncée Naturelle
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: 0x2b1d14,
      roughness: 0.48,
      metalness: 0.08,
      clearcoat: 0.22,
      clearcoatRoughness: 0.3
    });

    // =========================================================================
    // 6. PERSONNAGE PRINCIPAL RÉALISTE (CADRAGE PORTRAIT ÉLÉGANT)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(-0.35, 0.25, 0);
    scene.add(characterRoot);

    // --- BUSTE & ÉPAULES RÉALISTES ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.85, 0);
    characterRoot.add(torsoGroup);

    // Torse principal (Veste cintrée)
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.78, 32);
    const torso = new THREE.Mesh(torsoGeo, jacketMat);
    torso.scale.set(1.15, 1.0, 0.75);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Revers de veste & Col en V
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.05), jacketMat);
    lapelL.position.set(-0.11, 0.16, 0.28);
    lapelL.rotation.z = -0.22;
    torsoGroup.add(lapelL);

    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.05), jacketMat);
    lapelR.position.set(0.11, 0.16, 0.28);
    lapelR.rotation.z = 0.22;
    torsoGroup.add(lapelR);

    // Chemise blanche sous la veste
    const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.04), shirtMat);
    innerShirt.position.set(0, 0.18, 0.26);
    torsoGroup.add(innerShirt);

    // Col de chemise
    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.03), shirtMat);
    collarL.position.set(-0.07, 0.40, 0.26);
    collarL.rotation.z = -0.35;
    torsoGroup.add(collarL);

    const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.03), shirtMat);
    collarR.position.set(0.07, 0.40, 0.26);
    collarR.rotation.z = 0.35;
    torsoGroup.add(collarR);

    // Épaules douces arrondies
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), jacketMat);
    shoulderL.position.set(-0.38, 0.32, 0);
    shoulderL.scale.set(1.0, 0.8, 0.9);
    torsoGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), jacketMat);
    shoulderR.position.set(0.38, 0.32, 0);
    shoulderR.scale.set(1.0, 0.8, 0.9);
    torsoGroup.add(shoulderR);

    // BADGE OFFICIEL HECh SUR LA POITRINE (AVEC LOGO OFFICIEL PNG)
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(-0.19, 0.18, 0.29);
    badgeGroup.rotation.y = -0.15;

    const badgePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.015, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.3 })
    );
    badgePin.rotation.x = Math.PI / 2;
    badgeGroup.add(badgePin);

    const badgeLogoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.13, 0.13),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    badgeLogoMesh.position.z = 0.01;
    badgeGroup.add(badgeLogoMesh);
    torsoGroup.add(badgeGroup);

    // --- COU ANATOMIQUE RÉALISTE ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.28, 0);
    characterRoot.add(neckGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.22, 24), skinMat);
    neck.position.y = 0.04;
    neck.castShadow = true;
    neckGroup.add(neck);

    // --- TÊTE HUMAINE RÉALISTE HARMONIEUSE ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.48, 0);
    characterRoot.add(headGroup);

    // Crâne & Joues (Forme d'œuf naturel 3D)
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), skinMat);
    skull.scale.set(0.92, 1.05, 1.0);
    skull.castShadow = true;
    headGroup.add(skull);

    // Mâchoire et menton ciselé élégant
    const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.08, 0.18, 16), skinMat);
    jaw.position.set(0, -0.16, 0.08);
    jaw.rotation.x = -0.22;
    headGroup.add(jaw);

    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), skinMat);
    chin.position.set(0, -0.24, 0.14);
    headGroup.add(chin);

    // Pommettes douces
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), skinMat);
    cheekL.position.set(-0.13, -0.04, 0.17);
    cheekL.scale.set(1.0, 0.8, 0.6);
    headGroup.add(cheekL);

    const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), skinMat);
    cheekR.position.set(0.13, -0.04, 0.17);
    cheekR.scale.set(1.0, 0.8, 0.6);
    headGroup.add(cheekR);

    // Oreilles humaines réalistes
    const createEar = (xPos, isLeft) => {
      const eGroup = new THREE.Group();
      eGroup.position.set(xPos, 0.01, -0.02);
      eGroup.rotation.y = isLeft ? -0.2 : 0.2;

      const earHelix = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.016, 12, 16, Math.PI * 1.3),
        skinMat
      );
      earHelix.rotation.z = isLeft ? -0.3 : 0.3;
      eGroup.add(earHelix);

      const earLobe = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), skinMat);
      earLobe.position.set(0, -0.045, 0);
      eGroup.add(earLobe);

      return eGroup;
    };
    headGroup.add(createEar(-0.24, true));
    headGroup.add(createEar(0.24, false));

    // --- NEZ RÉALISTE & PROFILÉ ---
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.13, 12), skinMat);
    noseBridge.position.set(0, 0.01, 0.25);
    noseBridge.rotation.x = -0.25;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), skinMat);
    noseTip.position.set(0, -0.04, 0.275);
    headGroup.add(noseTip);

    // --- BOUCHE & LÈVRES RÉALISTES ---
    const lipUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.09, 12), lipsMat);
    lipUpper.rotation.z = Math.PI / 2;
    lipUpper.position.set(0, -0.125, 0.235);
    headGroup.add(lipUpper);

    const lipLower = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.08, 12), lipsMat);
    lipLower.rotation.z = Math.PI / 2;
    lipLower.position.set(0, -0.155, 0.23);
    headGroup.add(lipLower);

    // --- YEUX HUMAINS RÉALISTES EN AMANDE AVEC CLIGNEMENT ---
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.1 });
    const irisMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a5f, // Bleu-Gris océan profond
      roughness: 0.2,
      clearcoat: 1.0
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const cornealShineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyelidSkinMat = skinMat;

    const createRealisticEye = (xPos) => {
      const eyeAssembly = new THREE.Group();
      eyeAssembly.position.set(xPos, 0.035, 0.215);

      // Globe oculaire
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.045, 24, 24), scleraMat);
      eyeAssembly.add(eyeball);

      // Iris fin réaliste
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.024, 24), irisMat);
      iris.position.set(0, 0, 0.044);
      eyeAssembly.add(iris);

      // Pupille
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.012, 24), pupilMat);
      pupil.position.set(0, 0, 0.045);
      eyeAssembly.add(pupil);

      // Reflet cornéen net et discret
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.005, 12), cornealShineMat);
      glint.position.set(0.008, 0.008, 0.046);
      eyeAssembly.add(glint);

      // Paupière supérieure mobile
      const upperLidGeo = new THREE.SphereGeometry(0.048, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const upperLid = new THREE.Mesh(upperLidGeo, eyelidSkinMat);
      upperLid.rotation.x = -Math.PI / 2.2;
      eyeAssembly.add(upperLid);

      return { group: eyeAssembly, lid: upperLid, eyeball };
    };

    const eyeL = createRealisticEye(-0.085);
    const eyeR = createRealisticEye(0.085);
    headGroup.add(eyeL.group);
    headGroup.add(eyeR.group);

    // Sourcils naturels fins
    const browMat = new THREE.MeshStandardMaterial({ color: 0x22130c, roughness: 0.6 });
    const createEyebrow = (xPos, isLeft) => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.016, 0.02), browMat);
      brow.position.set(xPos, 0.095, 0.23);
      brow.rotation.z = isLeft ? 0.08 : -0.08;
      return brow;
    };
    const browLeft = createEyebrow(-0.085, true);
    const browRight = createEyebrow(0.085, false);
    headGroup.add(browLeft);
    headGroup.add(browRight);

    // --- CHEVELURE MODERNE DÉGRADÉE RÉALISTE ---
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Masse principale de cheveux
    const hairTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairTop.position.set(0, 0.07, -0.02);
    hairTop.scale.set(0.96, 1.05, 1.04);
    hairGroup.add(hairTop);

    // Mèches sculptées naturelles au-dessus du front
    const strand1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 0.16, 8), hairMat);
    strand1.position.set(-0.04, 0.24, 0.18);
    strand1.rotation.z = 0.35;
    strand1.rotation.x = -0.4;
    hairGroup.add(strand1);

    const strand2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.01, 0.14, 8), hairMat);
    strand2.position.set(0.05, 0.23, 0.18);
    strand2.rotation.z = -0.25;
    strand2.rotation.x = -0.35;
    hairGroup.add(strand2);

    // Côtés dégradés naturels
    const sideHairL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.18), hairMat);
    sideHairL.position.set(-0.23, 0.08, -0.02);
    hairGroup.add(sideHairL);

    const sideHairR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.18), hairMat);
    sideHairR.position.set(0.23, 0.08, -0.02);
    hairGroup.add(sideHairR);

    // --- BRAS & POSTURE NATURELLE DÉTENDUE ---
    // Bras Gauche : Avant-bras replié tenant une fine tablette de délibération
    const armLGroup = new THREE.Group();
    armLGroup.position.set(-0.38, 1.15, 0);
    characterRoot.add(armLGroup);

    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.38, 16), jacketMat);
    upperArmL.position.set(-0.05, -0.16, 0.04);
    upperArmL.rotation.z = 0.25;
    armLGroup.add(upperArmL);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 16), jacketMat);
    forearmL.position.set(-0.06, -0.36, 0.18);
    forearmL.rotation.x = -1.15;
    forearmL.rotation.y = 0.15;
    armLGroup.add(forearmL);

    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.09), skinMat);
    handL.position.set(-0.06, -0.42, 0.38);
    armLGroup.add(handL);

    // Fine tablette contemporaine en aluminium brossé
    const tabletMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.22, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
    );
    tabletMesh.position.set(-0.02, -0.40, 0.42);
    tabletMesh.rotation.x = 0.55;
    tabletMesh.rotation.y = 0.2;
    armLGroup.add(tabletMesh);

    // Écran de la tablette affichant le logo HECh
    const tabletScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.20, 0.20),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    tabletScreen.position.set(-0.02, -0.40, 0.428);
    tabletScreen.rotation.x = 0.55;
    tabletScreen.rotation.y = 0.2;
    armLGroup.add(tabletScreen);

    // Bras Droit : Posture détendue au repos avec micro-gestuelle
    const armRGroup = new THREE.Group();
    armRGroup.position.set(0.38, 1.15, 0);
    characterRoot.add(armRGroup);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.38, 16), jacketMat);
    upperArmR.position.set(0.05, -0.16, 0.02);
    upperArmR.rotation.z = -0.22;
    armRGroup.add(upperArmR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 16), jacketMat);
    forearmR.position.set(0.08, -0.38, 0.12);
    forearmR.rotation.x = -0.55;
    armRGroup.add(forearmR);

    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.08), skinMat);
    handR.position.set(0.10, -0.48, 0.22);
    armRGroup.add(handR);

    // =========================================================================
    // 7. COMPAGNON IA A.U.R.O.R.E. EN ARRIÈRE-PLAN HOLOGRAPHIQUE
    // =========================================================================
    const auroreGroup = new THREE.Group();
    auroreGroup.position.set(1.15, 1.45, -0.4);
    scene.add(auroreGroup);

    // Orbe centrale lumineuse subtile
    const auroreCoreMat = new THREE.MeshPhysicalMaterial({
      color: isAlert ? 0xf43f5e : 0x06b6d4,
      emissive: isAlert ? 0xe11d48 : 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7,
      transparent: true,
      opacity: 0.82
    });
    const auroreCore = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), auroreCoreMat);
    auroreGroup.add(auroreCore);

    // Anneau de données orbital fin
    const ringMat = new THREE.MeshBasicMaterial({
      color: isAlert ? 0xfb7185 : 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.012, 16, 64), ringMat);
    auroreGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.012, 16, 64), ringMat);
    ring2.rotation.x = Math.PI / 2.8;
    auroreGroup.add(ring2);

    const auroreLight = new THREE.PointLight(isAlert ? 0xf43f5e : 0x06b6d4, 2.2, 6);
    auroreGroup.add(auroreLight);

    // =========================================================================
    // 8. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION DOUCE, CLIGNEMENTS RÉALISTES)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // AURORE : Rotation gyroscopique fluide
      auroreGroup.position.y = 1.45 + Math.sin(t * 1.8) * 0.06;
      ring1.rotation.y = t * 0.6;
      ring1.rotation.x = t * 0.4;
      ring2.rotation.z = -t * 0.5;

      // Respiration Humaine Subtile & Naturelle
      const breath = Math.sin(t * 2.2);
      torsoGroup.scale.y = 1.0 + breath * 0.008;
      headGroup.position.y = 1.48 + breath * 0.006;
      armLGroup.position.y = 1.15 + breath * 0.004;
      armRGroup.position.y = 1.15 + breath * 0.004;

      // Clignement d'yeux naturel et doux
      const blinkCycle = (t * 0.85) % 4.0;
      const isBlinking = blinkCycle < 0.12;
      const targetLidAngle = isBlinking ? 0.0 : -Math.PI / 2.2;
      eyeL.lid.rotation.x = THREE.MathUtils.lerp(eyeL.lid.rotation.x, targetLidAngle, 0.4);
      eyeR.lid.rotation.x = THREE.MathUtils.lerp(eyeR.lid.rotation.x, targetLidAngle, 0.4);

      // Micro-rotations de tête naturelles (saccades d'attention)
      if (characterMood === 'speaking') {
        headGroup.rotation.y = 0.08 + Math.sin(t * 3.5) * 0.05;
        headGroup.rotation.x = Math.sin(t * 2.8) * 0.03;
        armRGroup.rotation.z = -0.22 + Math.sin(t * 2.5) * 0.05;
      } else if (characterMood === 'victorious') {
        headGroup.rotation.y = 0.05 + Math.sin(t * 1.5) * 0.03;
        headGroup.rotation.x = -0.04;
        browLeft.position.y = 0.105;
        browRight.position.y = 0.105;
      } else if (characterMood === 'worried') {
        headGroup.rotation.y = -0.05;
        headGroup.rotation.z = -0.04;
        browLeft.rotation.z = -0.08;
        browRight.rotation.z = 0.08;
      } else {
        // Thinking : Regard attentif, micro-mouvements
        headGroup.rotation.y = 0.10 + Math.sin(t * 0.8) * 0.03;
        headGroup.rotation.x = 0.02 + Math.cos(t * 0.6) * 0.02;
        armRGroup.rotation.z = -0.22 + Math.sin(t * 1.0) * 0.02;
      }

      // Travelling subtil et doux de caméra
      camera.position.x = Math.sin(t * 0.18) * 0.12;
      camera.lookAt(0, 1.42, 0);

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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
