import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 4 Distinct Visual Show Themes Configuration
const SHOW_THEMES = {
  millionnaire: {
    title: "QUI VEUT GAGNER DES CRÉDITS ?",
    subtitle: "PUPITRE ACADÉMIQUE · PALIER 60 ECTS",
    bgHex: 0x040817,
    ambientHex: 0x1e3a8a,
    floorColor: 0x09142e,
    primaryColor: '#38bdf8',
    goldColor: '#f59e0b',
    rimHex: 0x38bdf8,
    spotColors: [0x38bdf8, 0xf59e0b, 0x1d4ed8, 0xfbbf24],
    screenType: 'pyramid',
    emblem: 'ECTS 60'
  },
  champion: {
    title: "QUESTIONS POUR UN MAJOR",
    subtitle: "NEUROSCIENCES & MÉMOIRE ACTIVE",
    bgHex: 0x0d0904,
    ambientHex: 0x451a03,
    floorColor: 0x1c1307,
    primaryColor: '#f59e0b',
    goldColor: '#06b6d4',
    rimHex: 0xf59e0b,
    spotColors: [0xf59e0b, 0x06b6d4, 0xf97316, 0x38bdf8],
    screenType: 'timer_grid',
    emblem: 'MAJOR 1'
  },
  roue: {
    title: "LA ROUE DES ACCORDS",
    subtitle: "ORTHO'EXPRESS & CONJUGAISON PIÈGE",
    bgHex: 0x11041b,
    ambientHex: 0x3b0764,
    floorColor: 0x240733,
    primaryColor: '#ec4899',
    goldColor: '#a855f7',
    rimHex: 0xec4899,
    spotColors: [0xec4899, 0xa855f7, 0x10b981, 0xf43f5e],
    screenType: 'roulette',
    emblem: 'ROUE'
  },
  concours: {
    title: "LE GRAND CONCOURS DE LA HECH",
    subtitle: "RÈGLEMENTS, DROITS & VIE ÉTUDIANTE",
    bgHex: 0x030c14,
    ambientHex: 0x083344,
    floorColor: 0x082032,
    primaryColor: '#06b6d4',
    goldColor: '#8b5cf6',
    rimHex: 0x06b6d4,
    spotColors: [0x06b6d4, 0x8b5cf6, 0x3b82f6, 0x22d3ee],
    screenType: 'arena',
    emblem: 'CAMPUS'
  }
};

export default function GameShow3D({ 
  reaction = 'idle', // 'idle' | 'speaking' | 'correct' | 'wrong' | 'victory'
  theme = 'millionnaire', // 'millionnaire' | 'champion' | 'roue' | 'concours'
  themeColor = '#4f46e5'
}) {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const reactionStateRef = useRef(reaction);

  useEffect(() => {
    reactionStateRef.current = reaction;
  }, [reaction]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;

    const themeCfg = SHOW_THEMES[theme] || SHOW_THEMES.millionnaire;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(themeCfg.bgHex);
    scene.fog = new THREE.FogExp2(themeCfg.bgHex, 0.025);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.7, 7.2);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Advanced Lighting Setup per Show ---
    const ambientLight = new THREE.AmbientLight(themeCfg.ambientHex, 0.7);
    scene.add(ambientLight);

    // Key Light (Host Spotlight with soft shadow)
    const keyLight = new THREE.SpotLight(0xfff6ea, 6.0, 25, Math.PI / 5, 0.35, 1.2);
    keyLight.position.set(2.2, 6.8, 4.6);
    keyLight.target.position.set(0, 1.3, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 2.5;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Fill Light (Soft cool studio debouch)
    const fillLight = new THREE.DirectionalLight(themeCfg.spotColors[0], 1.8);
    fillLight.position.set(-4.5, 4.5, 3.5);
    scene.add(fillLight);

    // Rim / Backlight for host detachment
    const rimLight = new THREE.DirectionalLight(themeCfg.rimHex, 3.5);
    rimLight.position.set(0, 5.5, -4.5);
    scene.add(rimLight);

    // 4 Motorized Beam Spotlights with Volumetric Cones
    const beamSpots = [];
    const beamCones = [];

    themeCfg.spotColors.forEach((colorHex, i) => {
      const angle = (i / themeCfg.spotColors.length) * Math.PI * 0.8 - Math.PI * 0.4;
      const x = Math.sin(angle) * 5.8;
      const z = -Math.cos(angle) * 3.6 - 1.2;

      const spot = new THREE.SpotLight(colorHex, 4.5, 20, Math.PI / 7, 0.4, 1);
      spot.position.set(x, 6.2, z);
      scene.add(spot);
      beamSpots.push(spot);

      const coneGeo = new THREE.ConeGeometry(1.3, 8.0, 24, 1, true);
      coneGeo.translate(0, -4.0, 0);
      coneGeo.rotateX(-Math.PI / 2);

      const coneMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(spot.position);
      scene.add(cone);
      beamCones.push(cone);
    });

    // --- 3. Studio Architecture & Set Décor ---
    // Curved Backdrop Cyclorama
    const cycGeo = new THREE.CylinderGeometry(10.0, 10.0, 8.0, 40, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const cycMat = new THREE.MeshStandardMaterial({
      color: themeCfg.floorColor,
      roughness: 0.5,
      metalness: 0.25,
      side: THREE.BackSide
    });
    const cyc = new THREE.Mesh(cycGeo, cycMat);
    cyc.position.set(0, 3.4, 0);
    scene.add(cyc);

    // Neon Horizon Arches on Backdrop
    for (let h = 1.2; h <= 4.8; h += 1.2) {
      const arcGeo = new THREE.TorusGeometry(9.9, 0.045, 12, 48, Math.PI * 1.2);
      const arcMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(themeCfg.primaryColor),
        transparent: true,
        opacity: 0.55
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = -Math.PI * 0.6;
      arc.position.set(0, h, 0);
      scene.add(arc);
    }

    // --- Giant Curved LED Broadcast Screen with the SHOW'S NAME in the set ---
    const screenGeo = new THREE.CylinderGeometry(8.0, 8.0, 2.9, 32, 1, true, -Math.PI * 0.3, Math.PI * 0.6);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 512;
    const screenCtx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      side: THREE.BackSide
    });
    const giantScreen = new THREE.Mesh(screenGeo, screenMat);
    giantScreen.position.set(0, 3.2, 0);
    scene.add(giantScreen);

    // Multi-tier Concentric Stage Platform
    const stageOuterGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.45, 48);
    const stageOuterMat = new THREE.MeshPhysicalMaterial({
      color: themeCfg.floorColor,
      roughness: 0.15,
      metalness: 0.75,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1
    });
    const stageOuter = new THREE.Mesh(stageOuterGeo, stageOuterMat);
    stageOuter.position.y = -0.225;
    stageOuter.receiveShadow = true;
    scene.add(stageOuter);

    // Inner Glossy Platform with Radial Specular Reflection
    const stageInnerGeo = new THREE.CylinderGeometry(3.75, 3.75, 0.15, 48);
    const stageInnerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c1322,
      roughness: 0.08,
      metalness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const stageInner = new THREE.Mesh(stageInnerGeo, stageInnerMat);
    stageInner.position.y = 0.075;
    stageInner.receiveShadow = true;
    scene.add(stageInner);

    // Emissive Glowing Rings on Stage
    const ring1Geo = new THREE.RingGeometry(3.68, 3.75, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.primaryColor), side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.155;
    scene.add(ring1);

    const ring2Geo = new THREE.RingGeometry(1.7, 1.76, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.goldColor), side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.155;
    scene.add(ring2);

    // Overhead Curved Lighting Truss with Metal Lattice Struts
    const trussCurve = new THREE.TorusGeometry(5.4, 0.09, 12, 36, Math.PI * 0.9);
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.25 });
    const truss = new THREE.Mesh(trussCurve, trussMat);
    truss.rotation.x = Math.PI / 2;
    truss.rotation.z = -Math.PI * 0.45;
    truss.position.set(0, 6.0, 0);
    scene.add(truss);

    // --- 4. Host Podium Desk with Custom Illuminated Show Emblem ---
    const podiumGroup = new THREE.Group();
    podiumGroup.position.set(-0.85, 0.15, 0.85);

    const podBaseGeo = new THREE.CylinderGeometry(0.52, 0.62, 0.95, 28);
    const podBaseMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.2
    });
    const podBase = new THREE.Mesh(podBaseGeo, podBaseMat);
    podBase.position.y = 0.475;
    podBase.castShadow = true;
    podiumGroup.add(podBase);

    // Illuminated Acrylic Front Shield with OFFICIAL HECH LOGO
    const podFrontGeo = new THREE.CylinderGeometry(0.54, 0.64, 0.75, 28, 1, true, -Math.PI * 0.38, Math.PI * 0.76);
    
    const hechPodCanvas = document.createElement('canvas');
    hechPodCanvas.width = 512;
    hechPodCanvas.height = 256;
    const pCtx = hechPodCanvas.getContext('2d');

    pCtx.fillStyle = '#090d1a';
    pCtx.fillRect(0, 0, 512, 256);

    // Glowing border
    pCtx.strokeStyle = themeCfg.primaryColor;
    pCtx.lineWidth = 6;
    pCtx.strokeRect(6, 6, 500, 244);

    // HECh Red Shield
    pCtx.fillStyle = '#e11d48';
    pCtx.beginPath();
    pCtx.roundRect(40, 52, 105, 105, [24]);
    pCtx.fill();

    // Gold Accent
    pCtx.fillStyle = '#f59e0b';
    pCtx.beginPath();
    pCtx.arc(120, 132, 18, 0, Math.PI * 2);
    pCtx.fill();

    // H inside shield
    pCtx.fillStyle = '#ffffff';
    pCtx.font = '900 68px sans-serif';
    pCtx.fillText('H', 70, 134);

    // "HECh" bold text
    pCtx.fillStyle = '#ffffff';
    pCtx.font = '900 62px sans-serif';
    pCtx.fillText('HECh', 170, 112);

    pCtx.fillStyle = '#fb7185';
    pCtx.font = 'bold 18px sans-serif';
    pCtx.fillText('HAUTE ÉCOLE CHARLEMAGNE', 172, 145);

    pCtx.fillStyle = themeCfg.primaryColor;
    pCtx.font = 'bold 15px sans-serif';
    pCtx.fillText('SAR · Service Réussite', 172, 172);

    const hechPodTexture = new THREE.CanvasTexture(hechPodCanvas);

    const podFrontMat = new THREE.MeshPhysicalMaterial({
      map: hechPodTexture,
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveMap: hechPodTexture,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.95,
      roughness: 0.1
    });
    const podFront = new THREE.Mesh(podFrontGeo, podFrontMat);
    podFront.position.y = 0.48;
    podiumGroup.add(podFront);

    // Top Desktop with Tablet & Gooseneck Mic
    const podTopGeo = new THREE.BoxGeometry(0.95, 0.08, 0.7);
    const podTopMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.15 });
    const podTop = new THREE.Mesh(podTopGeo, podTopMat);
    podTop.position.set(0, 0.97, 0);
    podTop.rotation.x = 0.15;
    podTop.castShadow = true;
    podiumGroup.add(podTop);

    // Tablet
    const tabletGeo = new THREE.BoxGeometry(0.44, 0.02, 0.3);
    const tabletMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.primaryColor) });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(0, 1.02, -0.02);
    tablet.rotation.x = 0.15;
    podiumGroup.add(tablet);

    // Mic
    const micPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 })
    );
    micPole.position.set(0.25, 1.12, -0.05);
    micPole.rotation.z = -0.25;
    podiumGroup.add(micPole);

    const micHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95 })
    );
    micHead.position.set(0.31, 1.28, -0.05);
    podiumGroup.add(micHead);

    const onAirRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.008, 8, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    onAirRing.position.set(0.31, 1.28, -0.05);
    podiumGroup.add(onAirRing);

    scene.add(podiumGroup);

    // --- 5. High-Definition 3D TV Host Character ---
    const hostGroup = new THREE.Group();
    hostGroup.position.set(-0.85, 0.15, 0.18);

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd0b0,
      roughness: 0.55,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3b2414,
      roughness: 0.4,
      metalness: 0.1
    });

    const suitMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      roughness: 0.35,
      metalness: 0.2,
      clearcoat: 0.4,
      clearcoatRoughness: 0.15
    });

    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const tieMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(themeCfg.primaryColor),
      roughness: 0.2,
      metalness: 0.35,
      clearcoat: 0.6
    });

    // Legs & Dress Shoes
    const legGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.9, 16);
    const legL = new THREE.Mesh(legGeo, suitMat);
    legL.position.set(-0.16, 0.45, 0);
    hostGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, suitMat);
    legR.position.set(0.16, 0.45, 0);
    hostGroup.add(legR);

    const shoeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.26);
    const shoeMat = new THREE.MeshPhysicalMaterial({ color: 0x030712, roughness: 0.1, clearcoat: 0.9 });
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-0.16, 0.05, 0.05);
    hostGroup.add(shoeL);
    const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
    shoeR.position.set(0.16, 0.05, 0.05);
    hostGroup.add(shoeR);

    // Torso Group
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.9;
    hostGroup.add(torsoGroup);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.23, 0.66, 20), suitMat);
    body.position.y = 0.33;
    body.castShadow = true;
    torsoGroup.add(body);

    // Shirt & Silk Tie
    const vCutGeo = new THREE.BufferGeometry();
    vCutGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -0.08, 0.64, 0.25,
       0.08, 0.64, 0.25,
       0.0,  0.30, 0.25
    ]), 3));
    vCutGeo.computeVertexNormals();
    torsoGroup.add(new THREE.Mesh(vCutGeo, shirtMat));

    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.34, 0.02), tieMat);
    tie.position.set(0, 0.44, 0.26);
    torsoGroup.add(tie);

    const pocketSquare = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.015), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pocketSquare.position.set(-0.16, 0.53, 0.24);
    pocketSquare.rotation.z = 0.1;
    torsoGroup.add(pocketSquare);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.14, 16), skinMat);
    neck.position.y = 0.70;
    torsoGroup.add(neck);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.90, 0);
    torsoGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
    headGeo.scale(1.0, 1.15, 1.05);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Hair
    const hairTopGeo = new THREE.SphereGeometry(0.24, 20, 20);
    hairTopGeo.scale(1.02, 0.85, 1.05);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.12, -0.02);
    headGroup.add(hairTop);

    const quiffGeo = new THREE.ConeGeometry(0.12, 0.22, 12);
    const quiff = new THREE.Mesh(quiffGeo, hairMat);
    quiff.rotation.x = -Math.PI / 3;
    quiff.rotation.z = 0.2;
    quiff.position.set(0.05, 0.22, 0.16);
    headGroup.add(quiff);

    // Expressive Eyes with Catchlights
    const eyeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [-0.08, 0.08].forEach(xOffset => {
      const eye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eye.position.set(xOffset, 0.04, 0.19);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), irisMat);
      iris.position.set(0, 0, 0.03);
      eye.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), pupilMat);
      pupil.position.set(0, 0, 0.02);
      iris.add(pupil);

      const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), catchlightMat);
      catchlight.position.set(0.008, 0.008, 0.012);
      pupil.add(catchlight);

      headGroup.add(eye);
    });

    // Metallic Eyeglasses
    const glassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, clearcoat: 1.0 });

    [-0.08, 0.08].forEach(x => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.007, 8, 20), frameMat);
      rim.position.set(x, 0.04, 0.22);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), lensMat);
      lens.position.set(x, 0.04, 0.22);
      glassesGroup.add(lens);
    });

    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.05, 0.22);
    glassesGroup.add(bridge);
    headGroup.add(glassesGroup);

    // Warm Smile
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.009, 8, 16, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x9f1239 })
    );
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.09, 0.21);
    headGroup.add(smile);

    // Articulated Arms
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.32, 0.58, 0.02);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 14), suitMat);
    armL.position.y = -0.25;
    leftArmGroup.add(armL);
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), skinMat);
    handL.position.y = -0.55;
    leftArmGroup.add(handL);
    torsoGroup.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.32, 0.58, 0.02);
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 14), suitMat);
    armR.position.y = -0.25;
    rightArmGroup.add(armR);
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), skinMat);
    handR.position.y = -0.55;
    rightArmGroup.add(handR);

    // Wireless Mic in Hand
    const handMic = new THREE.Group();
    handMic.position.set(0, -0.55, 0.05);
    handMic.add(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.22, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })));
    const hMicHead = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95, roughness: 0.2 }));
    hMicHead.position.y = 0.11;
    handMic.add(hMicHead);
    const hMicRing = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.005, 8, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.primaryColor) }));
    hMicRing.position.y = 0.08;
    handMic.add(hMicRing);
    rightArmGroup.add(handMic);
    torsoGroup.add(rightArmGroup);

    scene.add(hostGroup);

    // --- 6. 30 Animated Audience NPCs in Tiered Amphitheater ---
    const audienceMembers = [];
    const audiencePalette = [
      0x38bdf8, 0x10b981, 0xf43f5e, 0xa855f7, 0xf59e0b, 0x06b6d4, 0xec4899, 0xffffff
    ];
    const hairPalette = [0x1c1917, 0x78350f, 0xd97706, 0x451a03, 0x0f172a];

    const rows = [
      { radius: 6.2, count: 8, height: 0.7, startAngle: -0.65, endAngle: 0.65 },
      { radius: 7.2, count: 10, height: 1.3, startAngle: -0.85, endAngle: 0.85 },
      { radius: 8.2, count: 12, height: 1.9, startAngle: -0.95, endAngle: 0.95 }
    ];

    rows.forEach((row, rowIdx) => {
      const benchGeo = new THREE.CylinderGeometry(row.radius + 0.35, row.radius + 0.35, 0.2, 32, 1, true, row.startAngle - 0.1, (row.endAngle - row.startAngle) + 0.2);
      const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(0, row.height - 0.1, -1.0);
      scene.add(bench);

      for (let i = 0; i < row.count; i++) {
        const t = i / (row.count - 1);
        const angle = row.startAngle + t * (row.endAngle - row.startAngle);
        const x = Math.sin(angle) * row.radius;
        const z = -Math.cos(angle) * row.radius * 0.75 - 1.0;

        const npcGroup = new THREE.Group();
        npcGroup.position.set(x, row.height, z);
        npcGroup.lookAt(0, 1.2, 0);

        const shirtColor = audiencePalette[(rowIdx * 7 + i) % audiencePalette.length];
        const npcHair = hairPalette[(i * 3) % hairPalette.length];

        const npcTorso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.16, 0.45, 12),
          new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 })
        );
        npcTorso.position.y = 0.225;
        npcGroup.add(npcTorso);

        const npcHead = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 14, 14),
          new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.6 })
        );
        npcHead.position.y = 0.58;
        npcGroup.add(npcHead);

        const npcH = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 12, 12),
          new THREE.MeshStandardMaterial({ color: npcHair, roughness: 0.4 })
        );
        npcH.position.set(0, 0.65, -0.02);
        npcGroup.add(npcH);

        const npcArmL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.04, 0.35, 8),
          new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 })
        );
        npcArmL.position.set(-0.22, 0.35, 0.08);
        npcArmL.rotation.x = -0.3;
        npcGroup.add(npcArmL);

        const npcArmR = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.04, 0.35, 8),
          new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 })
        );
        npcArmR.position.set(0.22, 0.35, 0.08);
        npcArmR.rotation.x = -0.3;
        npcGroup.add(npcArmR);

        scene.add(npcGroup);

        audienceMembers.push({
          group: npcGroup,
          armL: npcArmL,
          armR: npcArmR,
          baseY: row.height,
          phase: Math.random() * Math.PI * 2
        });
      }
    });

    // --- 7. Floating Studio Sparkles ---
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3]     = (Math.random() - 0.5) * 8.5;
      particlePositions[p * 3 + 1] = Math.random() * 5.2 + 0.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 6.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(themeCfg.primaryColor),
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 8. Animation Loop ---
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const currentReaction = reactionStateRef.current;

      // 1. Render Custom Animated Graphics on the GIANT LED WALL with SHOW'S NAME
      screenCtx.fillStyle = '#060a18';
      screenCtx.fillRect(0, 0, 1024, 512);

      // Top & Bottom Glowing Border
      const grad = screenCtx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, themeCfg.primaryColor);
      grad.addColorStop(0.5, themeCfg.goldColor);
      grad.addColorStop(1, themeCfg.primaryColor);
      screenCtx.fillStyle = grad;
      screenCtx.fillRect(0, 0, 1024, 18);
      screenCtx.fillRect(0, 494, 1024, 18);

      // Distinct Graphics by Show Type
      if (themeCfg.screenType === 'pyramid') {
        // Qui veut gagner des crédits - ECTS Pyramid & Wave
        for (let p = 0; p < 10; p++) {
          const stepW = 80 + p * 35;
          const isAct = p === 9;
          screenCtx.fillStyle = isAct ? '#f59e0b' : 'rgba(56, 189, 248, 0.25)';
          screenCtx.fillRect(512 - stepW / 2, 450 - p * 24, stepW, 16);
        }
      } else if (themeCfg.screenType === 'timer_grid') {
        // Questions pour un Major - Countdown & 4-round blocks
        const rounds = ["9 POINTS", "4 À LA SUITE", "FACE À FACE"];
        rounds.forEach((r, idx) => {
          screenCtx.fillStyle = (idx === 1) ? '#f59e0b' : 'rgba(6, 182, 212, 0.3)';
          screenCtx.fillRect(180 + idx * 230, 360, 200, 50);
          screenCtx.fillStyle = '#ffffff';
          screenCtx.font = 'bold 18px sans-serif';
          screenCtx.fillText(r, 220 + idx * 230, 392);
        });
      } else if (themeCfg.screenType === 'roulette') {
        // La Roue des Accords - Segmented Wheel Motif
        const wheelCenter = 512;
        screenCtx.save();
        screenCtx.translate(wheelCenter, 390);
        screenCtx.rotate(elapsed * 0.8);
        for (let s = 0; s < 12; s++) {
          screenCtx.beginPath();
          screenCtx.moveTo(0, 0);
          screenCtx.arc(0, 0, 90, (s * Math.PI) / 6, ((s + 1) * Math.PI) / 6);
          screenCtx.fillStyle = s % 2 === 0 ? '#ec4899' : '#a855f7';
          screenCtx.fill();
        }
        screenCtx.restore();
      } else {
        // Le Grand Concours - Cyber radar grid
        for (let b = 0; b < 28; b++) {
          const barH = 40 + Math.sin(elapsed * 4 + b * 0.3) * 35;
          screenCtx.fillStyle = b % 2 === 0 ? '#06b6d4' : '#8b5cf6';
          screenCtx.fillRect(120 + b * 28, 380 - barH / 2, 18, barH);
        }
      }

      // HECh Official Badge on giant LED broadcast screen
      screenCtx.fillStyle = '#e11d48';
      screenCtx.beginPath();
      screenCtx.roundRect(40, 35, 60, 60, [14]);
      screenCtx.fill();
      screenCtx.fillStyle = '#f59e0b';
      screenCtx.beginPath();
      screenCtx.arc(88, 80, 10, 0, Math.PI * 2);
      screenCtx.fill();
      screenCtx.fillStyle = '#ffffff';
      screenCtx.font = '900 38px sans-serif';
      screenCtx.fillText('H', 56, 80);

      screenCtx.fillStyle = '#ffffff';
      screenCtx.font = '900 24px sans-serif';
      screenCtx.fillText('HECh', 112, 64);
      screenCtx.fillStyle = '#fb7185';
      screenCtx.font = 'bold 12px sans-serif';
      screenCtx.fillText('HAUTE ÉCOLE CHARLEMAGNE', 112, 82);

      // SHOW NAME WRITTEN LARGE IN GLOWING TYPOGRAPHY
      screenCtx.font = '900 48px sans-serif';
      screenCtx.fillStyle = '#ffffff';
      screenCtx.textAlign = 'center';
      screenCtx.shadowColor = themeCfg.primaryColor;
      screenCtx.shadowBlur = 20;
      screenCtx.fillText(themeCfg.title, 512, 130);
      screenCtx.shadowBlur = 0;

      // Subtitle
      screenCtx.font = '700 22px sans-serif';
      screenCtx.fillStyle = themeCfg.primaryColor;
      screenCtx.fillText(themeCfg.subtitle, 512, 175);

      screenCtx.textAlign = 'start';
      screenTexture.needsUpdate = true;

      // 2. Camera Cinematic Subtle Drift
      camera.position.x = Math.sin(elapsed * 0.28) * 0.45;
      camera.position.y = 2.7 + Math.cos(elapsed * 0.35) * 0.12;
      camera.lookAt(0, 1.4, 0);

      // 3. Moving Spotlights Sweeping
      beamSpots.forEach((spot, idx) => {
        const sweepSpeed = 0.75 + idx * 0.25;
        const targetX = Math.sin(elapsed * sweepSpeed + idx) * 3.2;
        const targetZ = Math.cos(elapsed * sweepSpeed * 0.7 + idx) * 2.2;
        spot.target.position.set(targetX, 0.5, targetZ);
        spot.target.updateMatrixWorld();

        const cone = beamCones[idx];
        if (cone) {
          cone.lookAt(targetX, 0.5, targetZ);
        }
      });

      // 4. Host Animation Rig
      torsoGroup.position.y = 0.9 + Math.sin(elapsed * 2.2) * 0.015;

      if (currentReaction === 'speaking') {
        headGroup.rotation.x = Math.sin(elapsed * 6) * 0.08;
        headGroup.rotation.y = Math.sin(elapsed * 3) * 0.12;

        rightArmGroup.rotation.x = -0.7 + Math.sin(elapsed * 5) * 0.15;
        rightArmGroup.rotation.z = -0.3 + Math.cos(elapsed * 3) * 0.08;

        leftArmGroup.rotation.x = -0.4 + Math.sin(elapsed * 4) * 0.2;
        leftArmGroup.rotation.y = Math.cos(elapsed * 2) * 0.2;

      } else if (currentReaction === 'correct' || currentReaction === 'victory') {
        const jump = Math.abs(Math.sin(elapsed * 8)) * 0.18;
        hostGroup.position.y = 0.15 + jump;

        headGroup.rotation.x = -0.2;
        headGroup.rotation.y = Math.sin(elapsed * 6) * 0.1;

        leftArmGroup.rotation.x = -2.4 + Math.sin(elapsed * 8) * 0.2;
        leftArmGroup.rotation.z = -0.6;

        rightArmGroup.rotation.x = -2.4 + Math.cos(elapsed * 8) * 0.2;
        rightArmGroup.rotation.z = 0.6;

      } else if (currentReaction === 'wrong') {
        hostGroup.position.y = 0.15;
        headGroup.rotation.x = 0.35 + Math.sin(elapsed * 4) * 0.05;
        headGroup.rotation.y = Math.sin(elapsed * 5) * 0.25;

        rightArmGroup.rotation.x = -1.8;
        rightArmGroup.rotation.z = 0.2;

        leftArmGroup.rotation.x = -0.1;
        leftArmGroup.rotation.z = 0.1;

      } else {
        headGroup.rotation.x = Math.sin(elapsed * 1.5) * 0.04;
        headGroup.rotation.y = Math.sin(elapsed * 1.0) * 0.06;

        rightArmGroup.rotation.x = -0.4 + Math.sin(elapsed * 2) * 0.05;
        rightArmGroup.rotation.z = -0.15;

        leftArmGroup.rotation.x = -0.15 + Math.sin(elapsed * 1.8) * 0.04;
        leftArmGroup.rotation.z = 0.1;
      }

      // 5. Studio Audience NPCs Animation
      audienceMembers.forEach((npc) => {
        if (currentReaction === 'correct' || currentReaction === 'victory') {
          const jump = Math.abs(Math.sin(elapsed * 10 + npc.phase)) * 0.14;
          npc.group.position.y = npc.baseY + jump;

          const clapMotion = Math.sin(elapsed * 14 + npc.phase);
          npc.armL.rotation.y = clapMotion * 0.45;
          npc.armR.rotation.y = -clapMotion * 0.45;
          npc.armL.rotation.x = -1.1;
          npc.armR.rotation.x = -1.1;

        } else if (currentReaction === 'wrong') {
          npc.group.position.y = npc.baseY;
          npc.group.rotation.x = 0.2;
          npc.armL.rotation.x = -1.8;
          npc.armR.rotation.x = -1.8;

        } else {
          npc.group.position.y = npc.baseY + Math.sin(elapsed * 2 + npc.phase) * 0.02;
          npc.group.rotation.x = 0;
          npc.armL.rotation.x = -0.3 + Math.sin(elapsed * 2 + npc.phase) * 0.05;
          npc.armR.rotation.x = -0.3 + Math.sin(elapsed * 2 + npc.phase) * 0.05;
        }
      });

      // 6. Floating Sparkles
      const pArr = particlePositions;
      for (let p = 0; p < particleCount; p++) {
        pArr[p * 3 + 1] -= 0.006;
        if (pArr[p * 3 + 1] < 0.2) {
          pArr[p * 3 + 1] = 5.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW && newH) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, themeColor]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full relative select-none overflow-hidden bg-slate-950" 
      style={{ minHeight: '320px' }}
    />
  );
}
