import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D (Aurore · Auditoire Universitaire HECh Edition):
 * Modélisation 3D humaine réaliste et élégante d'AURORE, guide et conférencière du campus :
 * - Morphologie faciale féminine harmonieuse : traits fins, proportions douces et naturelles.
 * - Chevelure blonde dorée texturée avec mèches soignées descendant sur les épaules.
 * - Lunettes fines contemporaines (monture dorée chic, verres antireflet).
 * - Yeux expressifs avec cornée, iris saphir/noisette doux, anneau limbique et reflet vivant.
 * - Blazer universitaire bleu marine ajusté avec chemisier blanc et badge officiel HECh.
 * - DÉCOR 3D COMPLET D'AMPHITHÉÂTRE UNIVERSITAIRE EN ARRIÈRE-PLAN :
 *   * Gradins étagés en bois clair et pupitres incurvés d'auditoire.
 *   * Mur acoustique en tasseaux de bois contemporains et tableau de projection.
 *   * Éclairage chaud de conférence (spots zénithaux, fill douce et rim light dorée).
 * - Animation fluide 60 FPS avec respiration subtile, clignements doux et micro-mouvements.
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

    // 1. Scène & Environnement d'Auditoire Universitaire
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1726); // Bleu nuit d'auditoire chaleureux
    scene.fog = new THREE.FogExp2(0x0e1726, 0.025);

    // Caméra Cadrage Buste / Conférence (32mm cinéma doux)
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 50);
    camera.position.set(0, 1.45, 3.6);
    camera.lookAt(0, 1.38, 0);

    // 2. Moteur de Rendu PBR Haute Précision
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 3. Texture Loader pour Logo Officiel HECh (PNG transparent)
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');
    hechLogoTex.generateMipmaps = true;

    // 4. Éclairage Studio d'Auditoire & Conférence
    // Key Light : Projecteur chaud de scène à 45°
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.4);
    keyLight.position.set(2.2, 4.0, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.radius = 2.0;
    scene.add(keyLight);

    // Fill Light douce pour déboucher harmonieusement les ombres
    const fillLight = new THREE.PointLight(0xa5b4fc, 1.3, 10);
    fillLight.position.set(-2.5, 2.4, 2.0);
    scene.add(fillLight);

    // Rim Light dorée / Hair Light (détache la chevelure blonde du fond)
    const rimLight = new THREE.DirectionalLight(0xfde68a, 2.0);
    rimLight.position.set(-1.0, 3.6, -2.5);
    scene.add(rimLight);

    // Kicker subtil bleuté pour le côté droit
    const kickerLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    kickerLight.position.set(2.8, 2.0, -1.2);
    scene.add(kickerLight);

    // Lumière d'ambiance d'amphi (teinte douce de salle académique)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.65);
    scene.add(ambientLight);

    // =========================================================================
    // 5. DÉCOR 3D D'AMPHITHÉÂTRE / AUDITOIRE UNIVERSITAIRE (ARRIÈRE-PLAN)
    // =========================================================================
    const lectureHallGroup = new THREE.Group();
    lectureHallGroup.position.set(0, 0, -2.2);
    scene.add(lectureHallGroup);

    // Matériaux du décor
    const oakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x8a5a36, // Chêne clair chaleureux
      roughness: 0.55,
      metalness: 0.05
    });

    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d, // Bois sombre acoustique
      roughness: 0.6,
      metalness: 0.02
    });

    const acousticWallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Panneaux muraux bleu ardoise
      roughness: 0.75,
      metalness: 0.1
    });

    const steelFrameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.7
    });

    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a
    });

    // Grand Mur de fond d'auditoire
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), acousticWallMat);
    backWall.position.set(0, 3.2, -3.2);
    lectureHallGroup.add(backWall);

    // Lattes de bois acoustiques verticales contemporaines
    for (let x = -7.5; x <= 7.5; x += 0.45) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 7.5, 0.04), darkWoodMat);
      slat.position.set(x, 3.2, -3.16);
      lectureHallGroup.add(slat);
    }

    // Écran central de projection / Tableau d'auditoire
    const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.0, 0.08), oakWoodMat);
    boardFrame.position.set(0, 3.2, -3.1);
    lectureHallGroup.add(boardFrame);

    const boardScreen = new THREE.Mesh(new THREE.PlaneGeometry(5.1, 2.7), screenMat);
    boardScreen.position.set(0, 3.2, -3.05);
    lectureHallGroup.add(boardScreen);

    // Halo d'éclairage rétro-projeté sous le tableau
    const boardGlow = new THREE.PointLight(0x38bdf8, 1.2, 5);
    boardGlow.position.set(0, 3.2, -2.8);
    lectureHallGroup.add(boardGlow);

    // Gradins étagés semi-circulaires (3 rangées d'amphi)
    const rows = [
      { radius: 4.8, y: 0.6, depth: -1.2 },
      { radius: 6.2, y: 1.2, depth: -2.0 },
      { radius: 7.6, y: 1.8, depth: -2.8 }
    ];

    rows.forEach((row) => {
      // Pupitre incurvé
      const deskGeo = new THREE.CylinderGeometry(row.radius, row.radius, 0.14, 48, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
      const desk = new THREE.Mesh(deskGeo, oakWoodMat);
      desk.position.set(0, row.y, row.depth);
      lectureHallGroup.add(desk);

      // Pieds tubulaires du pupitre
      for (let angle = -Math.PI * 0.3; angle <= Math.PI * 0.3; angle += 0.3) {
        const px = Math.sin(angle) * row.radius;
        const pz = Math.cos(angle) * row.radius + row.depth - row.radius;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, row.y + 0.5, 12), steelFrameMat);
        leg.position.set(px, (row.y + 0.5) / 2, pz);
        lectureHallGroup.add(leg);

        // Sièges d'amphithéâtre
        const seatGroup = new THREE.Group();
        seatGroup.position.set(px * 0.92, row.y - 0.25, pz - 0.45);
        
        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.06), oakWoodMat);
        seatBack.rotation.y = angle;
        seatGroup.add(seatBack);

        const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.34), darkWoodMat);
        seatCushion.position.set(0, -0.16, 0.12);
        seatCushion.rotation.y = angle;
        seatGroup.add(seatCushion);

        lectureHallGroup.add(seatGroup);
      }
    });

    // =========================================================================
    // 6. MATÉRIAUX PBR D'AURORE (PEAU NATURELLE, CHEVEUX BLONDS, BLAZER HECh)
    // =========================================================================
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xfce7db, // Teint clair éclatant naturel
      roughness: 0.52,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.5
    });

    const lipsMat = new THREE.MeshPhysicalMaterial({
      color: 0xdf8480, // Rose pêche naturel soigné
      roughness: 0.38,
      clearcoat: 0.35
    });

    // Blazer universitaire bleu marine élégant
    const blazerMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.68,
      metalness: 0.04
    });

    // Chemisier blanc cassé fluide
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.55
    });

    // Chevelure Blonde Dorée Naturelle & Lumineuse
    const blondeHairMat = new THREE.MeshPhysicalMaterial({
      color: 0xd6a15c, // Blond miel doré
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35
    });

    const blondeHighlightMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4d38c, // Mèches blondes éclatantes
      roughness: 0.38,
      metalness: 0.05,
      clearcoat: 0.4
    });

    // Monture de lunettes dorée fine
    const glassesFrameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Or fin
      metalness: 0.9,
      roughness: 0.2
    });

    const glassesLensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 0.25,
      transparent: true,
      roughness: 0.05,
      ior: 1.5
    });

    // =========================================================================
    // 7. PERSONNAGE PRINCIPAL AURORE (CENTRÉE, ÉLÉGANTE, GRACIEUSE)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.28, 0); // Parfaitement centrée
    scene.add(characterRoot);

    // --- BUSTE & TAILLEUR ÉLÉGANT ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.85, 0);
    characterRoot.add(torsoGroup);

    // Torse féminin cintré
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.74, 32), blazerMat);
    torso.scale.set(1.12, 1.0, 0.72);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Revers de veste fins & col de blazer moderne
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.04), blazerMat);
    lapelL.position.set(-0.10, 0.16, 0.27);
    lapelL.rotation.z = -0.24;
    torsoGroup.add(lapelL);

    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.04), blazerMat);
    lapelR.position.set(0.10, 0.16, 0.27);
    lapelR.rotation.z = 0.24;
    torsoGroup.add(lapelR);

    // Chemisier blanc élégant sous la veste
    const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.03), shirtMat);
    innerShirt.position.set(0, 0.16, 0.25);
    torsoGroup.add(innerShirt);

    // Col chemisier féminin ouvert
    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.05, 0.025), shirtMat);
    collarL.position.set(-0.06, 0.38, 0.255);
    collarL.rotation.z = -0.32;
    torsoGroup.add(collarL);

    const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.05, 0.025), shirtMat);
    collarR.position.set(0.06, 0.38, 0.255);
    collarR.rotation.z = 0.32;
    torsoGroup.add(collarR);

    // Épaules souples et harmonieuses
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), blazerMat);
    shoulderL.position.set(-0.34, 0.30, 0);
    shoulderL.scale.set(1.0, 0.8, 0.85);
    torsoGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), blazerMat);
    shoulderR.position.set(0.34, 0.30, 0);
    shoulderR.scale.set(1.0, 0.8, 0.85);
    torsoGroup.add(shoulderR);

    // Badge officiel HECh unique, soigné et discret sur la poitrine gauche
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(-0.16, 0.18, 0.28);
    badgeGroup.rotation.y = -0.12;

    const badgePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.01, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.2 })
    );
    badgePin.rotation.x = Math.PI / 2;
    badgeGroup.add(badgePin);

    const badgeLogoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.11, 0.11),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    badgeLogoMesh.position.z = 0.008;
    badgeGroup.add(badgeLogoMesh);
    torsoGroup.add(badgeGroup);

    // --- COU GRACIEUX ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.28, 0);
    characterRoot.add(neckGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.115, 0.22, 24), skinMat);
    neck.position.y = 0.04;
    neck.castShadow = true;
    neckGroup.add(neck);

    // --- TÊTE ANATOMIQUE HARMONIEUSE ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.48, 0);
    characterRoot.add(headGroup);

    // Crâne & Joues (Ovale féminin harmonieux)
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.23, 32, 32), skinMat);
    skull.scale.set(0.92, 1.04, 0.98);
    skull.castShadow = true;
    headGroup.add(skull);

    // Mâchoire et menton fin
    const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.065, 0.16, 16), skinMat);
    jaw.position.set(0, -0.15, 0.07);
    jaw.rotation.x = -0.20;
    headGroup.add(jaw);

    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), skinMat);
    chin.position.set(0, -0.22, 0.12);
    headGroup.add(chin);

    // Pommettes douces
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), skinMat);
    cheekL.position.set(-0.11, -0.03, 0.16);
    cheekL.scale.set(1.0, 0.8, 0.6);
    headGroup.add(cheekL);

    const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), skinMat);
    cheekR.position.set(0.11, -0.03, 0.16);
    cheekR.scale.set(1.0, 0.8, 0.6);
    headGroup.add(cheekR);

    // Nez fin et légèrement retroussé
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, 0.11, 12), skinMat);
    noseBridge.position.set(0, 0.01, 0.23);
    noseBridge.rotation.x = -0.22;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 16), skinMat);
    noseTip.position.set(0, -0.035, 0.25);
    headGroup.add(noseTip);

    // Lèvres souriantes et chaleureuses
    const lipUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.08, 12), lipsMat);
    lipUpper.rotation.z = Math.PI / 2;
    lipUpper.position.set(0, -0.11, 0.215);
    headGroup.add(lipUpper);

    const lipLower = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.011, 0.07, 12), lipsMat);
    lipLower.rotation.z = Math.PI / 2;
    lipLower.position.set(0, -0.135, 0.21);
    headGroup.add(lipLower);

    // --- YEUX EXPRESSIFS AUX REFLETS VIVANTS ---
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.1 });
    const irisMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb, // Bleu saphir lumineux
      roughness: 0.25,
      clearcoat: 0.9
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const cornealShineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createAuroreEye = (xPos) => {
      const eyeAssembly = new THREE.Group();
      eyeAssembly.position.set(xPos, 0.035, 0.195);

      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 24, 24), scleraMat);
      eyeAssembly.add(eyeball);

      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.022, 24), irisMat);
      iris.position.set(0, 0, 0.039);
      eyeAssembly.add(iris);

      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.011, 24), pupilMat);
      pupil.position.set(0, 0, 0.040);
      eyeAssembly.add(pupil);

      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.005, 12), cornealShineMat);
      glint.position.set(0.007, 0.007, 0.041);
      eyeAssembly.add(glint);

      const upperLidGeo = new THREE.SphereGeometry(0.043, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const upperLid = new THREE.Mesh(upperLidGeo, skinMat);
      upperLid.rotation.x = -Math.PI / 2.2;
      eyeAssembly.add(upperLid);

      return { group: eyeAssembly, lid: upperLid };
    };

    const eyeL = createAuroreEye(-0.078);
    const eyeR = createAuroreEye(0.078);
    headGroup.add(eyeL.group);
    headGroup.add(eyeR.group);

    // Sourcils blonds foncés fins
    const browMat = new THREE.MeshStandardMaterial({ color: 0x8d6635, roughness: 0.6 });
    const createEyebrow = (xPos, isLeft) => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.013, 0.018), browMat);
      brow.position.set(xPos, 0.09, 0.208);
      brow.rotation.z = isLeft ? 0.07 : -0.07;
      return brow;
    };
    const browLeft = createEyebrow(-0.078, true);
    const browRight = createEyebrow(0.078, false);
    headGroup.add(browLeft);
    headGroup.add(browRight);

    // --- LUNETTES FINES CONTEMPORAINES D'AURORE ---
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.035, 0.24);
    headGroup.add(glassesGroup);

    // Pont de nez
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05, 10), glassesFrameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.005, 0);
    glassesGroup.add(bridge);

    // Cerclages dorés fins
    [-0.078, 0.078].forEach((xPos) => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.005, 12, 32), glassesFrameMat);
      rim.position.set(xPos, 0, 0);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.036, 32), glassesLensMat);
      lens.position.set(xPos, 0, 0.001);
      glassesGroup.add(lens);
    });

    // Branches de lunettes
    [-0.12, 0.12].forEach((xPos, i) => {
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.006, 0.22), glassesFrameMat);
      temple.position.set(xPos, 0.01, -0.10);
      temple.rotation.y = i === 0 ? 0.08 : -0.08;
      glassesGroup.add(temple);
    });

    // --- CHEVELURE BLONDE SOIGNÉE & NATURELLE ---
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Calotte principale
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 28, 28, 0, Math.PI * 2, 0, Math.PI / 1.7),
      blondeHairMat
    );
    hairCrown.position.set(0, 0.06, -0.02);
    hairCrown.scale.set(0.97, 1.06, 1.05);
    hairGroup.add(hairCrown);

    // Mèches blondes volumineuses ondulées descendant sur les épaules
    const createLock = (x, y, z, rx, ry, rz, scale, isHighlight) => {
      const lock = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045 * scale, 0.02 * scale, 0.42 * scale, 12),
        isHighlight ? blondeHighlightMat : blondeHairMat
      );
      lock.position.set(x, y, z);
      lock.rotation.set(rx, ry, rz);
      return lock;
    };

    // Mèches avant qui encadrent le visage
    hairGroup.add(createLock(-0.16, -0.08, 0.10, 0.2, 0.3, 0.2, 0.9, true));
    hairGroup.add(createLock(0.16, -0.08, 0.10, 0.2, -0.3, -0.2, 0.9, true));

    // Mèches latérales descendantes
    hairGroup.add(createLock(-0.22, -0.15, 0.02, 0.1, 0.2, 0.15, 1.0, false));
    hairGroup.add(createLock(0.22, -0.15, 0.02, 0.1, -0.2, -0.15, 1.0, false));

    // Mèche frontale balayée avec élégance
    const bangs = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.015, 0.24, 12), blondeHighlightMat);
    bangs.position.set(-0.04, 0.20, 0.18);
    bangs.rotation.set(-0.4, 0.2, 0.7);
    hairGroup.add(bangs);

    // --- BRAS & POSTURE NATURELLE D'AURORE ---
    // Bras Gauche : Posé élégamment avec micro-mouvements de conférencière
    const armLGroup = new THREE.Group();
    armLGroup.position.set(-0.34, 1.15, 0);
    characterRoot.add(armLGroup);

    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.36, 16), blazerMat);
    upperArmL.position.set(-0.04, -0.15, 0.03);
    upperArmL.rotation.z = 0.20;
    armLGroup.add(upperArmL);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.32, 16), blazerMat);
    forearmL.position.set(-0.05, -0.34, 0.14);
    forearmL.rotation.x = -0.85;
    forearmL.rotation.y = 0.25;
    armLGroup.add(forearmL);

    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.08), skinMat);
    handL.position.set(-0.05, -0.42, 0.28);
    armLGroup.add(handL);

    // Bras Droit : Main ouverte chaleureuse d'accueil
    const armRGroup = new THREE.Group();
    armRGroup.position.set(0.34, 1.15, 0);
    characterRoot.add(armRGroup);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.36, 16), blazerMat);
    upperArmR.position.set(0.04, -0.15, 0.02);
    upperArmR.rotation.z = -0.20;
    armRGroup.add(upperArmR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.32, 16), blazerMat);
    forearmR.position.set(0.06, -0.34, 0.12);
    forearmR.rotation.x = -0.65;
    forearmR.rotation.y = -0.20;
    armRGroup.add(forearmR);

    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.08), skinMat);
    handR.position.set(0.07, -0.42, 0.24);
    armRGroup.add(handR);

    // =========================================================================
    // 8. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION, EXPRESSIONS & CLIGNEMENTS)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Respiration Humaine Subtile & Harmonieuse
      const breath = Math.sin(t * 2.2);
      torsoGroup.scale.y = 1.0 + breath * 0.007;
      headGroup.position.y = 1.48 + breath * 0.005;
      armLGroup.position.y = 1.15 + breath * 0.003;
      armRGroup.position.y = 1.15 + breath * 0.003;

      // Clignement d'yeux naturel et doux
      const blinkCycle = (t * 0.85) % 4.2;
      const isBlinking = blinkCycle < 0.12;
      const targetLidAngle = isBlinking ? 0.0 : -Math.PI / 2.2;
      eyeL.lid.rotation.x = THREE.MathUtils.lerp(eyeL.lid.rotation.x, targetLidAngle, 0.4);
      eyeR.lid.rotation.x = THREE.MathUtils.lerp(eyeR.lid.rotation.x, targetLidAngle, 0.4);

      // Micro-gestuelle selon l'état d'esprit
      if (characterMood === 'speaking') {
        headGroup.rotation.y = Math.sin(t * 3.2) * 0.06;
        headGroup.rotation.x = Math.sin(t * 2.5) * 0.03;
        armRGroup.rotation.z = -0.20 + Math.sin(t * 2.2) * 0.06;
        armLGroup.rotation.z = 0.20 + Math.sin(t * 1.8) * 0.04;
      } else if (characterMood === 'victorious') {
        headGroup.rotation.y = Math.sin(t * 1.2) * 0.03;
        headGroup.rotation.x = -0.03;
        browLeft.position.y = 0.098;
        browRight.position.y = 0.098;
      } else if (characterMood === 'worried') {
        headGroup.rotation.y = -0.04;
        browLeft.rotation.z = -0.08;
        browRight.rotation.z = 0.08;
      } else {
        // Thinking : Regard attentif, micro-mouvements
        headGroup.rotation.y = Math.sin(t * 0.7) * 0.03;
        headGroup.rotation.x = Math.cos(t * 0.5) * 0.02;
      }

      // Travelling subtil et doux de caméra
      camera.position.x = Math.sin(t * 0.15) * 0.08;
      camera.lookAt(0, 1.38, 0);

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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}