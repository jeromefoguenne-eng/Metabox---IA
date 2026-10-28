import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D (Ultra-Detailed Studio Quality 2.5):
 * Personnage présentateur de l'Escape Game modélisé avec le même niveau d'orfèvrerie
 * que le Tribunal 3D :
 * - Tête sculptée Pixar avec oreilles, mâchoire, sourcils articulés, blush pommettes,
 *   yeux expressifs avec clignement naturel et double reflet cornéen.
 * - Lunettes rondes intellectuelles avec verres transparents antireflets.
 * - Chevelure sculptée multi-mèches volumétriques en acajou profond.
 * - Vrai cou, sweat à capuche universitaire HECh avec cordons et plis d'épaules.
 * - Broche & Badge officiel de la Haute École Charlemagne sur la poitrine.
 * - Deux vrais bras articulés : l'un tenant une cyber-tablette tactile lumineuse,
 *   l'autre gesticulant vers l'oracle A.U.R.O.R.E.
 * - Mains sculptées avec paume et doigts articulés.
 * - Baskets montantes bicolores avec semelles crantées.
 * - Matériaux PBR physiques MeshPhysicalMaterial avec Clearcoat, Sheen et éclairage 3-points cinéma.
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

    // 1. Scene & Ambiance
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      theme === 'datacenter' ? 0x020817 :
      theme === 'tribunal' ? 0x0f0717 :
      theme === 'factcheck' ? 0x040d21 :
      theme === 'promptwars' ? 0x160718 : 0x050d1a
    );
    scene.fog = new THREE.FogExp2(scene.background, 0.032);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.95, 4.9);
    camera.lookAt(0, 1.25, 0);

    // 2. High-Fidelity Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 3. Texture Loader pour Logo Officiel HECh
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.jpg');
    hechLogoTex.generateMipmaps = true;
    hechLogoTex.minFilter = THREE.LinearMipmapLinearFilter;

    // 4. Éclairage Studio 3-Points Style Pixar (Chaud, Rim Cyan/Magenta & Radiosité)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.05);
    scene.add(ambientLight);

    // Key Light Dorée Douce (Lumière de face supérieure droite)
    const keyLight = new THREE.DirectionalLight(0xfff0dd, 3.4);
    keyLight.position.set(4.0, 7.0, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 2.5;
    scene.add(keyLight);

    // Fill Light Colorée selon le thème
    const fillLightColor = 
      theme === 'tribunal' ? 0xc084fc :
      theme === 'datacenter' ? 0x38bdf8 :
      theme === 'promptwars' ? 0xf472b6 : 0x22d3ee;
    const fillLight = new THREE.PointLight(fillLightColor, 2.2, 14);
    fillLight.position.set(-4.0, 3.2, 2.8);
    scene.add(fillLight);

    // Rim Light Signature Pixar (Halo lumineux détachant la chevelure et les épaules)
    const rimColor = isAlert ? 0xf43f5e : 0x38bdf8;
    const rimLight = new THREE.DirectionalLight(rimColor, 2.8);
    rimLight.position.set(0, 4.5, -3.8);
    scene.add(rimLight);

    // Rebond Lumineux Chaud au Sol (Radiosité)
    const floorBounce = new THREE.PointLight(0xfde68a, 1.2, 10);
    floorBounce.position.set(0, 0.4, 0.5);
    scene.add(floorBounce);

    // 5. Scène & Podium High-Tech avec Logo HECh
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x080e1a,
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Estrade circulaire
    const platformGeo = new THREE.CylinderGeometry(2.5, 2.7, 0.16, 64);
    const platformMat = new THREE.MeshPhysicalMaterial({
      color: 0x131d31,
      roughness: 0.3,
      metalness: 0.7,
      clearcoat: 0.7
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = 0.08;
    platform.receiveShadow = true;
    scene.add(platform);

    // Anneau de néon autour de la scène
    const platformRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.035, 16, 64),
      new THREE.MeshBasicMaterial({ color: isAlert ? 0xf43f5e : 0x38bdf8 })
    );
    platformRing.rotation.x = Math.PI / 2;
    platformRing.position.y = 0.16;
    scene.add(platformRing);

    // =========================================================================
    // 6. PERSONNAGE PRINCIPAL PIXAR ULTRA-DÉTAILLÉ (PRÉSENTATEUR DU JURY)
    // =========================================================================
    const charGroup = new THREE.Group();
    charGroup.position.set(-1.0, 0.16, 0.35);
    scene.add(charGroup);

    // Matériau Peau Pixar Veloutée avec Subsurface simulé
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xfed7aa,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.15,
      clearcoatRoughness: 0.4
    });

    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.35
    });

    // --- JAMBES & PANTALON ---
    const pantsMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.65,
      metalness: 0.1
    });

    // Jambe Gauche
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.72, 24), pantsMat);
    legL.position.set(-0.16, 0.36, 0);
    legL.castShadow = true;
    charGroup.add(legL);

    // Jambe Droite
    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.72, 24), pantsMat);
    legR.position.set(0.16, 0.36, 0);
    legR.castShadow = true;
    charGroup.add(legR);

    // --- SNEAKERS CHUNKY PIXAR SCULPTÉES ---
    const shoeWhiteMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, clearcoat: 0.4 });
    const shoeAccentMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });

    const createShoe = (xPos) => {
      const sGroup = new THREE.Group();
      sGroup.position.set(xPos, 0, 0);

      // Semelle blanche épaisse
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.08, 0.36), shoeWhiteMat);
      sole.position.set(0, 0.04, 0.08);
      sole.castShadow = true;
      sGroup.add(sole);

      // Empeigne colorée
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.12, 0.28), shoeAccentMat);
      upper.position.set(0, 0.12, 0.05);
      upper.castShadow = true;
      sGroup.add(upper);

      // Bout avant arrondi blanc
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), shoeWhiteMat);
      toe.scale.set(1.0, 0.6, 1.1);
      toe.position.set(0, 0.08, 0.22);
      sGroup.add(toe);

      return sGroup;
    };

    charGroup.add(createShoe(-0.16));
    charGroup.add(createShoe(0.16));

    // --- TORSE : SWEAT-HOODIE UNIVERSITAIRE HECh AVEC LOGO RÉEL ---
    const hoodieMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8, // Bleu Royal Universitaire
      roughness: 0.55,
      metalness: 0.08,
      clearcoat: 0.12
    });

    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 1.08;
    charGroup.add(bodyGroup);

    // Torse sculpté
    const torsoGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.82, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieMat);
    torsoMesh.castShadow = true;
    bodyGroup.add(torsoMesh);

    // Poche Kangourou ventrale
    const pocketGeo = new THREE.BoxGeometry(0.42, 0.24, 0.14);
    const pocketMesh = new THREE.Mesh(pocketGeo, hoodieMat);
    pocketMesh.position.set(0, -0.15, 0.28);
    pocketMesh.rotation.x = -0.15;
    pocketMesh.castShadow = true;
    bodyGroup.add(pocketMesh);

    // Col de sweat épais
    const collarGeo = new THREE.TorusGeometry(0.25, 0.065, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeo, hoodieMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 0.42, 0);
    bodyGroup.add(collarMesh);

    // Cordons de capuche blancs
    const cordMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const cordL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8), cordMat);
    cordL.position.set(-0.08, 0.28, 0.32);
    cordL.rotation.z = -0.08;
    bodyGroup.add(cordL);

    const cordR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8), cordMat);
    cordR.position.set(0.08, 0.28, 0.32);
    cordR.rotation.z = 0.08;
    bodyGroup.add(cordR);

    // ÉCUSSON LOGO RÉEL HECh SUR LA POITRINE
    const badgePlateGeo = new THREE.BoxGeometry(0.22, 0.12, 0.015);
    const badgePlateMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1
    });
    const badgePlate = new THREE.Mesh(badgePlateGeo, badgePlateMat);
    badgePlate.position.set(0.16, 0.18, 0.36);
    badgePlate.rotation.y = 0.15;
    bodyGroup.add(badgePlate);

    const logoPlaneGeo = new THREE.PlaneGeometry(0.20, 0.10);
    const logoPlaneMat = new THREE.MeshBasicMaterial({
      map: hechLogoTex,
      transparent: true
    });
    const logoPlane = new THREE.Mesh(logoPlaneGeo, logoPlaneMat);
    logoPlane.position.set(0.16, 0.18, 0.37);
    logoPlane.rotation.y = 0.15;
    bodyGroup.add(logoPlane);

    // Lanyard / Cordon Tour de Cou du SAR
    const lanyardMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const lanyard = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.018, 12, 32), lanyardMat);
    lanyard.rotation.x = Math.PI / 2.3;
    lanyard.position.set(0, 0.36, 0.08);
    bodyGroup.add(lanyard);

    // --- COU ANATOMIQUE ---
    const neckGeo = new THREE.CylinderGeometry(0.15, 0.17, 0.24, 24);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 1.54;
    neck.castShadow = true;
    charGroup.add(neck);

    // --- TÊTE SCULPTÉE PIXAR ARTICULÉE ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.82, 0);
    charGroup.add(headGroup);

    // Crâne & Joues
    const headGeo = new THREE.SphereGeometry(0.36, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Menton défini
    const chinGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.22, 0.22);
    headGroup.add(chin);

    // Pommettes & Joues Blush douces
    const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), blushMat);
    blushL.position.set(-0.20, -0.06, 0.28);
    blushL.scale.set(1.2, 0.6, 0.3);
    headGroup.add(blushL);

    const blushR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), blushMat);
    blushR.position.set(0.20, -0.06, 0.28);
    blushR.scale.set(1.2, 0.6, 0.3);
    headGroup.add(blushR);

    // Oreilles sculptées
    const earMat = skinMat;
    const earGeo = new THREE.TorusGeometry(0.075, 0.03, 12, 16, Math.PI * 1.4);
    const earL = new THREE.Mesh(earGeo, earMat);
    earL.position.set(-0.35, 0.02, 0);
    earL.rotation.y = -Math.PI / 2;
    earL.rotation.z = -0.2;
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, earMat);
    earR.position.set(0.35, 0.02, 0);
    earR.rotation.y = Math.PI / 2;
    earR.rotation.z = 0.2;
    headGroup.add(earR);

    // Nez bouton mignon
    const noseGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xfcb499, roughness: 0.4 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -0.03, 0.36);
    headGroup.add(nose);

    // Sourire / Bouche expressive
    const mouthGeo = new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.15, 0.33);
    mouth.rotation.x = Math.PI;
    headGroup.add(mouth);

    // --- CHEVELURE PIXAR MULTI-VOLUMES DÉTAILLÉE ---
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: 0x27150a, // Chêne Sombre Chaleureux
      roughness: 0.42,
      metalness: 0.1,
      clearcoat: 0.3
    });

    // Calotte principale
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8),
      hairMat
    );
    hairCap.position.y = 0.06;
    hairCap.rotation.x = -0.2;
    headGroup.add(hairCap);

    // Mèche frontale quiff volumineuse
    const quiff1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), hairMat);
    quiff1.scale.set(1.5, 0.8, 1.2);
    quiff1.position.set(-0.04, 0.32, 0.26);
    quiff1.rotation.z = 0.15;
    headGroup.add(quiff1);

    const quiff2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), hairMat);
    quiff2.scale.set(1.2, 0.7, 1.0);
    quiff2.position.set(0.16, 0.30, 0.22);
    quiff2.rotation.z = -0.2;
    headGroup.add(quiff2);

    // --- SOURCILS ARTICULÉS ---
    const browMat = new THREE.MeshStandardMaterial({ color: 0x1f1006, roughness: 0.6 });
    const browGeo = new THREE.BoxGeometry(0.14, 0.035, 0.04);

    const browL = new THREE.Mesh(browGeo, browMat);
    browL.position.set(-0.14, 0.18, 0.34);
    browL.rotation.z = 0.1;
    headGroup.add(browL);

    const browR = new THREE.Mesh(browGeo, browMat);
    browR.position.set(0.14, 0.18, 0.34);
    browR.rotation.z = -0.1;
    headGroup.add(browR);

    // --- YEUX GRANDS PIXAR AVEC REFLETS & PAUPIÈRES CLIGNANTES ---
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEyeAssembly = (xPos) => {
      const eGroup = new THREE.Group();
      eGroup.position.set(xPos, 0.04, 0.30);

      // Sclère blanche
      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.082, 24, 24), eyeWhiteMat);
      eGroup.add(sclera);

      // Iris bleu saphir
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.048, 20, 20), irisMat);
      iris.position.z = 0.054;
      eGroup.add(iris);

      // Pupille noire
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), pupilMat);
      pupil.position.z = 0.076;
      eGroup.add(pupil);

      // Double Catchlight Pixar (Reflet cornéen principal + secondaire)
      const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), catchlightMat);
      shine1.position.set(0.018, 0.018, 0.086);
      eGroup.add(shine1);

      const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), catchlightMat);
      shine2.position.set(-0.016, -0.014, 0.086);
      eGroup.add(shine2);

      // Paupière supérieure mobile pour le clignement
      const eyelidGeo = new THREE.SphereGeometry(0.085, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const eyelid = new THREE.Mesh(eyelidGeo, skinMat);
      eyelid.rotation.x = -Math.PI / 2;
      eyelid.position.z = 0.01;
      eGroup.add(eyelid);

      return { group: eGroup, eyelid };
    };

    const eyeLeft = createEyeAssembly(-0.13);
    const eyeRight = createEyeAssembly(0.13);
    headGroup.add(eyeLeft.group);
    headGroup.add(eyeRight.group);

    // --- LUNETTES RONDES ANTIREFLETS INTELLECTUELLES ---
    const glassesFrameMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0
    });

    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transmission: 0.92,
      opacity: 0.25,
      transparent: true,
      roughness: 0.05,
      clearcoat: 1.0
    });

    const createGlassesSide = (xPos) => {
      const gSide = new THREE.Group();
      gSide.position.set(xPos, 0.04, 0.36);

      const frame = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.014, 16, 32), glassesFrameMat);
      gSide.add(frame);

      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.008, 24), lensGlassMat);
      lens.rotation.x = Math.PI / 2;
      gSide.add(lens);

      return gSide;
    };

    headGroup.add(createGlassesSide(-0.13));
    headGroup.add(createGlassesSide(0.13));

    // Pont de lunettes
    const bridgeGeo = new THREE.CylinderGeometry(0.010, 0.010, 0.12, 8);
    const bridge = new THREE.Mesh(bridgeGeo, glassesFrameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.05, 0.36);
    headGroup.add(bridge);

    // --- BRAS GAUCHE : TIENT LA CYBER-TABLETTE DU SAR ---
    const armLGroup = new THREE.Group();
    armLGroup.position.set(-0.40, 1.35, 0.05);
    charGroup.add(armLGroup);

    // Bras supérieur
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16), hoodieMat);
    upperArmL.position.set(-0.06, -0.16, 0.04);
    upperArmL.rotation.z = 0.35;
    upperArmL.rotation.x = -0.25;
    armLGroup.add(upperArmL);

    // Avant-bras fléchi vers l'avant
    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.36, 16), hoodieMat);
    forearmL.position.set(-0.08, -0.36, 0.22);
    forearmL.rotation.x = -1.1;
    forearmL.rotation.y = 0.2;
    armLGroup.add(forearmL);

    // Main gauche
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), skinMat);
    handL.position.set(-0.08, -0.42, 0.44);
    armLGroup.add(handL);

    // Cyber-Tablette Tactile aux couleurs de la HECh
    const tabletGroup = new THREE.Group();
    tabletGroup.position.set(-0.04, -0.40, 0.48);
    tabletGroup.rotation.x = 0.55;
    tabletGroup.rotation.y = 0.25;

    const tabletCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.26, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
    );
    tabletGroup.add(tabletCase);

    // Écran de la tablette avec lueur cyan
    const tabletScreenMat = new THREE.MeshBasicMaterial({
      map: hechLogoTex
    });
    const tabletScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), tabletScreenMat);
    tabletScreen.position.z = 0.012;
    tabletGroup.add(tabletScreen);

    armLGroup.add(tabletGroup);

    // --- BRAS DROIT : GESTICULATION EXPRESSIVE VERS LE JOUEUR & AURORE ---
    const armRGroup = new THREE.Group();
    armRGroup.position.set(0.40, 1.35, 0.05);
    charGroup.add(armRGroup);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16), hoodieMat);
    upperArmR.position.set(0.06, -0.16, 0.04);
    upperArmR.rotation.z = -0.35;
    upperArmR.rotation.x = 0.1;
    armRGroup.add(upperArmR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.36, 16), hoodieMat);
    forearmR.position.set(0.12, -0.38, 0.18);
    forearmR.rotation.x = -0.85;
    forearmR.rotation.z = -0.25;
    armRGroup.add(forearmR);

    // Main droite ouverte
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), skinMat);
    handR.position.set(0.16, -0.46, 0.38);
    armRGroup.add(handR);

    // Doigts articulés stylisés
    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.010, 0.05, 8), skinMat);
      finger.position.set(0.14 + (f - 1.5) * 0.022, -0.46, 0.44);
      finger.rotation.x = Math.PI / 2.5;
      armRGroup.add(finger);
    }

    // =========================================================================
    // 7. ORACLE A.U.R.O.R.E. HOLOGRAPHIQUE FLOTTANT (SPECTRE IA)
    // =========================================================================
    const auroreGroup = new THREE.Group();
    auroreGroup.position.set(1.4, 1.55, 0.2);
    scene.add(auroreGroup);

    // Socle / Pupitre cyber
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1120,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0
    });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.76, 0.48, 32), pedestalMat);
    pedestal.position.y = 0.24;
    pedestal.castShadow = true;
    scene.add(pedestal);

    // Logo HECh sur le flanc de l'estrade d'A.U.R.O.R.E.
    const pedestalLogo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.20),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    pedestalLogo.position.set(0, 0.24, 0.65);
    scene.add(pedestalLogo);

    // Orbe Holographique Translucide
    const auroreOrbMat = new THREE.MeshPhysicalMaterial({
      color: isAlert ? 0xf43f5e : 0x06b6d4,
      emissive: isAlert ? 0xe11d48 : 0x0891b2,
      emissiveIntensity: 0.95,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.72,
      transparent: true,
      opacity: 0.88
    });
    const auroreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.50, 32, 32), auroreOrbMat);
    auroreGroup.add(auroreOrb);

    // Cristal Géométrique Intérieur
    const crystalGeo = new THREE.OctahedronGeometry(0.26, 0);
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    auroreGroup.add(crystal);

    // Anneaux Gyroscopiques de Données
    const ringMat = new THREE.MeshBasicMaterial({
      color: isAlert ? 0xfb7185 : 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.022, 16, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.022, 16, 64), ringMat);
    ring2.rotation.x = Math.PI / 3;
    auroreGroup.add(ring1);
    auroreGroup.add(ring2);

    const auroreLight = new THREE.PointLight(isAlert ? 0xf43f5e : 0x06b6d4, 3.4, 9);
    auroreGroup.add(auroreLight);

    // =========================================================================
    // 8. ÉCRANS DE CONTRÔLE FLOTTANTS D'ARRIÈRE-PLAN
    // =========================================================================
    const monitorsGroup = new THREE.Group();
    scene.add(monitorsGroup);

    const monitorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.65,
      transparent: true,
      opacity: 0.78,
      roughness: 0.12,
      metalness: 0.4
    });

    const createScreen = (x, y, z, rotY) => {
      const scr = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.04), monitorGlassMat);
      scr.position.set(x, y, z);
      scr.rotation.y = rotY;
      return scr;
    };

    monitorsGroup.add(createScreen(-3.4, 2.5, -1.6, 0.45));
    monitorsGroup.add(createScreen(3.4, 2.7, -1.6, -0.45));
    monitorsGroup.add(createScreen(0, 3.3, -2.8, 0));

    // =========================================================================
    // 9. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION, CLIGNEMENTS, GESTES VIVANTS)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // AURORE : Lévitation et Rotation Gyroscopique
      auroreGroup.position.y = 1.55 + Math.sin(t * 2.2) * 0.12;
      crystal.rotation.x = t * 1.2;
      crystal.rotation.y = t * 1.5;
      ring1.rotation.z = t * 0.7;
      ring1.rotation.y = t * 0.4;
      ring2.rotation.x = t * 0.5;
      ring2.rotation.z = -t * 0.8;

      // Respiration Naturelle Pixar du Personnage
      const breath = Math.sin(t * 2.6);
      headGroup.position.y = 1.82 + breath * 0.018;
      bodyGroup.scale.y = 1.0 + breath * 0.015;
      armLGroup.position.y = 1.35 + breath * 0.01;
      armRGroup.position.y = 1.35 + breath * 0.01;

      // Clignement d'yeux naturel toutes les 3.5 secondes
      const blinkCycle = (t * 0.9) % 3.5;
      const isBlinking = blinkCycle < 0.14;
      const eyelidOpen = isBlinking ? 0 : -Math.PI / 2;
      eyeLeft.eyelid.rotation.x = THREE.MathUtils.lerp(eyeLeft.eyelid.rotation.x, eyelidOpen, 0.35);
      eyeRight.eyelid.rotation.x = THREE.MathUtils.lerp(eyeRight.eyelid.rotation.x, eyelidOpen, 0.35);

      // Animation des bras & gestuelle
      armRGroup.rotation.z = Math.sin(t * 2.0) * 0.08;
      armRGroup.rotation.x = Math.sin(t * 1.6) * 0.06;
      tabletGroup.rotation.z = Math.sin(t * 1.2) * 0.04;

      // Émotions dynamiques selon characterMood
      if (characterMood === 'speaking') {
        headGroup.rotation.y = 0.2 + Math.sin(t * 4.2) * 0.12;
        headGroup.rotation.x = Math.sin(t * 3.2) * 0.06;
        browL.position.y = 0.20 + Math.sin(t * 4.0) * 0.02;
        browR.position.y = 0.20 + Math.sin(t * 4.0) * 0.02;
        mouth.scale.set(1.2, 1.4 + Math.sin(t * 8.0) * 0.4, 1.0);
      } else if (characterMood === 'victorious') {
        charGroup.position.y = 0.16 + Math.abs(Math.sin(t * 4.5)) * 0.22;
        headGroup.rotation.y = Math.sin(t * 2.0) * 0.08;
        browL.position.y = 0.22;
        browR.position.y = 0.22;
        mouth.scale.set(1.4, 1.5, 1.0);
      } else if (characterMood === 'worried') {
        headGroup.rotation.z = -0.15;
        headGroup.rotation.x = 0.12;
        browL.rotation.z = -0.15;
        browR.rotation.z = 0.15;
        mouth.scale.set(0.9, 0.6, 1.0);
      } else {
        // Thinking : Regard attentif et curieux tourné vers AURORE
        headGroup.rotation.y = 0.28 + Math.sin(t * 1.4) * 0.04;
        headGroup.rotation.x = 0.04 + Math.cos(t * 1.2) * 0.03;
        browL.position.y = 0.18 + Math.sin(t * 1.5) * 0.015;
        browR.position.y = 0.19;
        mouth.scale.set(1.0, 1.0, 1.0);
      }

      // Travelling subtil et doux de caméra
      camera.position.x = Math.sin(t * 0.22) * 0.32;
      camera.lookAt(0, 1.35, 0);

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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
