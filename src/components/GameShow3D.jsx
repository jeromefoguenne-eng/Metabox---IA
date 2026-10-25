import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.028);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.6, 6.8);
    camera.lookAt(0, 1.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Advanced Studio Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
    scene.add(ambientLight);

    // Key Light (Warm Host Spotlight with Soft Shadow)
    const keyLight = new THREE.SpotLight(0xfff5ea, 5.5, 25, Math.PI / 5, 0.35, 1.2);
    keyLight.position.set(2.5, 6.5, 4.5);
    keyLight.target.position.set(0, 1.2, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 2.5;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Fill Light (Soft Cool Studio Backfill)
    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.8);
    fillLight.position.set(-4, 4, 3);
    scene.add(fillLight);

    // Rim / Backlight (Detaches host silhouette with vibrant edge glow)
    const rimLight = new THREE.DirectionalLight(new THREE.Color(themeColor), 3.2);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Dynamic Moving Head Studio Beams (with volumetric cones)
    const beamCount = 4;
    const beamSpots = [];
    const beamCones = [];

    const beamColors = [
      new THREE.Color(0x38bdf8), 
      new THREE.Color(0xf59e0b), 
      new THREE.Color(themeColor), 
      new THREE.Color(0xa855f7)
    ];

    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 0.8 - Math.PI * 0.4;
      const x = Math.sin(angle) * 5.5;
      const z = -Math.cos(angle) * 3.5 - 1.0;

      const spot = new THREE.SpotLight(beamColors[i], 4, 18, Math.PI / 8, 0.4, 1);
      spot.position.set(x, 6.0, z);
      spot.castShadow = false;
      scene.add(spot);
      beamSpots.push(spot);

      // Volumetric light cone mesh
      const coneGeo = new THREE.ConeGeometry(1.2, 7.5, 24, 1, true);
      coneGeo.translate(0, -3.75, 0);
      coneGeo.rotateX(-Math.PI / 2);

      const coneMat = new THREE.MeshBasicMaterial({
        color: beamColors[i],
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(spot.position);
      scene.add(cone);
      beamCones.push(cone);
    }

    // --- 3. Studio Architecture & Set Décor ---
    // Curved Cyclorama Backdrop
    const cycGeo = new THREE.CylinderGeometry(9.5, 9.5, 7.5, 36, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const cycMat = new THREE.MeshStandardMaterial({
      color: 0x090e1c,
      roughness: 0.6,
      metalness: 0.3,
      side: THREE.BackSide
    });
    const cyc = new THREE.Mesh(cycGeo, cycMat);
    cyc.position.set(0, 3.2, 0);
    scene.add(cyc);

    // Curved LED Horizon Neon Strips on Backdrop
    for (let h = 1.0; h <= 4.5; h += 1.2) {
      const arcGeo = new THREE.TorusGeometry(9.4, 0.04, 12, 48, Math.PI * 1.2);
      const arcMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(themeColor),
        transparent: true,
        opacity: 0.6
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = -Math.PI * 0.6;
      arc.position.set(0, h, 0);
      scene.add(arc);
    }

    // Giant Curved LED Broadcast Screen in Center Background
    const screenGeo = new THREE.CylinderGeometry(7.5, 7.5, 2.6, 28, 1, true, -Math.PI * 0.28, Math.PI * 0.56);
    
    // Create animated canvas texture for TV studio screen graphics
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const screenCtx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      side: THREE.BackSide
    });
    const giantScreen = new THREE.Mesh(screenGeo, screenMat);
    giantScreen.position.set(0, 3.0, 0);
    scene.add(giantScreen);

    // Multi-tier Concentric Stage
    // Outer Stage Platform
    const stageOuterGeo = new THREE.CylinderGeometry(4.6, 4.8, 0.4, 48);
    const stageOuterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const stageOuter = new THREE.Mesh(stageOuterGeo, stageOuterMat);
    stageOuter.position.y = -0.2;
    stageOuter.receiveShadow = true;
    scene.add(stageOuter);

    // Inner Elevated Stage Floor (Glossy Lacquered TV Platform)
    const stageInnerGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.15, 48);
    const stageInnerMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      roughness: 0.08,
      metalness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const stageInner = new THREE.Mesh(stageInnerGeo, stageInnerMat);
    stageInner.position.y = 0.05;
    stageInner.receiveShadow = true;
    scene.add(stageInner);

    // Emissive Glowing Rings on Stage Floor
    const ring1Geo = new THREE.RingGeometry(3.52, 3.6, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeColor), side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.13;
    scene.add(ring1);

    const ring2Geo = new THREE.RingGeometry(1.6, 1.66, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.13;
    scene.add(ring2);

    // Overhead Curved Truss with Spot Fixtures
    const trussCurve = new THREE.TorusGeometry(5.2, 0.08, 12, 32, Math.PI * 0.9);
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 });
    const truss = new THREE.Mesh(trussCurve, trussMat);
    truss.rotation.x = Math.PI / 2;
    truss.rotation.z = -Math.PI * 0.45;
    truss.position.set(0, 5.8, 0);
    scene.add(truss);

    // --- 4. Futuristic Host Podium Desk ---
    const podiumGroup = new THREE.Group();
    podiumGroup.position.set(-0.85, 0.13, 0.8);

    // Curved Metallic Base
    const podBaseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.95, 24);
    const podBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });
    const podBase = new THREE.Mesh(podBaseGeo, podBaseMat);
    podBase.position.y = 0.475;
    podBase.castShadow = true;
    podiumGroup.add(podBase);

    // Glowing Frosted Acrylic Front Screen with Emblem
    const podFrontGeo = new THREE.CylinderGeometry(0.52, 0.62, 0.75, 24, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
    const podFrontMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(themeColor),
      emissive: new THREE.Color(themeColor),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1
    });
    const podFront = new THREE.Mesh(podFrontGeo, podFrontMat);
    podFront.position.y = 0.48;
    podiumGroup.add(podFront);

    // Sleek Desktop Counter with angled slope
    const podTopGeo = new THREE.BoxGeometry(0.9, 0.08, 0.65);
    const podTopMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.15
    });
    const podTop = new THREE.Mesh(podTopGeo, podTopMat);
    podTop.position.set(0, 0.96, 0);
    podTop.rotation.x = 0.15;
    podTop.castShadow = true;
    podiumGroup.add(podTop);

    // Touch Tablet on Desk
    const tabletGeo = new THREE.BoxGeometry(0.42, 0.02, 0.28);
    const tabletMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(0, 1.01, -0.02);
    tablet.rotation.x = 0.15;
    podiumGroup.add(tablet);

    // Gooseneck Mic on Podium
    const micPoleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.32, 8);
    const micPoleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
    const micPole = new THREE.Mesh(micPoleGeo, micPoleMat);
    micPole.position.set(0.25, 1.1, -0.05);
    micPole.rotation.z = -0.25;
    podiumGroup.add(micPole);

    // Mic Head with glowing red On-Air ring
    const micHeadGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const micHeadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    const micHead = new THREE.Mesh(micHeadGeo, micHeadMat);
    micHead.position.set(0.3, 1.25, -0.05);
    podiumGroup.add(micHead);

    const onAirRingGeo = new THREE.TorusGeometry(0.038, 0.008, 8, 16);
    const onAirRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const onAirRing = new THREE.Mesh(onAirRingGeo, onAirRingMat);
    onAirRing.position.set(0.3, 1.25, -0.05);
    podiumGroup.add(onAirRing);

    scene.add(podiumGroup);

    // --- 5. High-Quality Stylized 3D TV Host Character ---
    const hostGroup = new THREE.Group();
    hostGroup.position.set(-0.85, 0.13, 0.15); // Standing behind podium

    // Skin Material (Warm, natural subsurface stylized skin)
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd0b0,
      roughness: 0.55,
      metalness: 0.05
    });

    // Hair Material (Stylish brunette/chestnut with specular highlights)
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3b2414,
      roughness: 0.4,
      metalness: 0.1
    });

    // Suit Blazer Material (Tailored Navy MeshPhysicalMaterial with clearcoat)
    const suitMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.15,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2
    });

    // White Shirt
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    // Silk Tie
    const tieMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.25,
      metalness: 0.3,
      clearcoat: 0.5
    });

    // Legs / Pants
    const legGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.9, 16);
    const legLeft = new THREE.Mesh(legGeo, suitMat);
    legLeft.position.set(-0.16, 0.45, 0);
    legLeft.castShadow = true;
    hostGroup.add(legLeft);

    const legRight = new THREE.Mesh(legGeo, suitMat);
    legRight.position.set(0.16, 0.45, 0);
    legRight.castShadow = true;
    hostGroup.add(legRight);

    // Shiny Dress Shoes
    const shoeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.25);
    const shoeMat = new THREE.MeshPhysicalMaterial({ color: 0x09090b, roughness: 0.1, clearcoat: 0.8 });
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-0.16, 0.05, 0.04);
    hostGroup.add(shoeL);
    const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
    shoeR.position.set(0.16, 0.05, 0.04);
    hostGroup.add(shoeR);

    // Torso Group (for breathing and posture animations)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.9;
    hostGroup.add(torsoGroup);

    // Torso / Suit Jacket
    const bodyGeo = new THREE.CylinderGeometry(0.27, 0.23, 0.65, 18);
    const body = new THREE.Mesh(bodyGeo, suitMat);
    body.position.y = 0.325;
    body.castShadow = true;
    torsoGroup.add(body);

    // White Collared Shirt V-cut insert
    const vCutGeo = new THREE.BufferGeometry();
    const vCutVertices = new Float32Array([
      -0.08, 0.62, 0.24,
       0.08, 0.62, 0.24,
       0.0,  0.30, 0.24
    ]);
    vCutGeo.setAttribute('position', new THREE.BufferAttribute(vCutVertices, 3));
    vCutGeo.computeVertexNormals();
    const vCut = new THREE.Mesh(vCutGeo, shirtMat);
    torsoGroup.add(vCut);

    // Silk Tie Hanging
    const tieGeo = new THREE.BoxGeometry(0.06, 0.32, 0.02);
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 0.44, 0.25);
    torsoGroup.add(tie);

    // Pocket Square in Suit Breast Pocket
    const pocketSquareGeo = new THREE.BoxGeometry(0.06, 0.02, 0.015);
    const pocketSquareMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pocketSquare = new THREE.Mesh(pocketSquareGeo, pocketSquareMat);
    pocketSquare.position.set(-0.15, 0.52, 0.23);
    pocketSquare.rotation.z = 0.1;
    torsoGroup.add(pocketSquare);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.14, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.69;
    torsoGroup.add(neck);

    // Head Group (for nodding, looking, talking gestures)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.88, 0);
    torsoGroup.add(headGroup);

    // Stylized Head Mesh
    const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
    headGeo.scale(1.0, 1.15, 1.05);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Stylized Volumetric Hair
    const hairGroup = new THREE.Group();
    const hairTopGeo = new THREE.SphereGeometry(0.24, 20, 20);
    hairTopGeo.scale(1.02, 0.85, 1.05);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.12, -0.02);
    hairGroup.add(hairTop);

    // Stylish Hair Quiff / Bangs in front
    const quiffGeo = new THREE.ConeGeometry(0.12, 0.22, 12);
    const quiff = new THREE.Mesh(quiffGeo, hairMat);
    quiff.rotation.x = -Math.PI / 3;
    quiff.rotation.z = 0.2;
    quiff.position.set(0.05, 0.22, 0.16);
    hairGroup.add(quiff);
    headGroup.add(hairGroup);

    // Expressive Eyes (Sclera + Iris + Specular Catchlight dot)
    const eyeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [-0.08, 0.08].forEach(xOffset => {
      const eyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eyeL.position.set(xOffset, 0.04, 0.19);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), irisMat);
      iris.position.set(0, 0, 0.03);
      eyeL.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), pupilMat);
      pupil.position.set(0, 0, 0.02);
      iris.add(pupil);

      const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), catchlightMat);
      catchlight.position.set(0.008, 0.008, 0.012);
      pupil.add(catchlight);

      headGroup.add(eyeL);
    });

    // Sleek Metallic Eyeglasses Frame
    const glassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, roughness: 0.0, clearcoat: 1.0 });

    [-0.08, 0.08].forEach(x => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.007, 8, 20), frameMat);
      rim.position.set(x, 0.04, 0.22);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), lensMat);
      lens.position.set(x, 0.04, 0.22);
      glassesGroup.add(lens);
    });
    // Bridge between lenses
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.05, 0.22);
    glassesGroup.add(bridge);
    headGroup.add(glassesGroup);

    // Warm Smile Mouth
    const smileGeo = new THREE.TorusGeometry(0.045, 0.009, 8, 16, Math.PI);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.09, 0.21);
    headGroup.add(smile);

    // Articulated Arms (Left & Right)
    // Left Arm (Gesturing or resting on podium)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.31, 0.58, 0.02);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 14), suitMat);
    armL.position.y = -0.25;
    armL.castShadow = true;
    leftArmGroup.add(armL);

    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), skinMat);
    handL.position.y = -0.55;
    leftArmGroup.add(handL);
    torsoGroup.add(leftArmGroup);

    // Right Arm (Holding wireless stage mic)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.31, 0.58, 0.02);
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 14), suitMat);
    armR.position.y = -0.25;
    armR.castShadow = true;
    rightArmGroup.add(armR);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), skinMat);
    handR.position.y = -0.55;
    rightArmGroup.add(handR);

    // Wireless Handheld Stage Mic in Hand
    const handMic = new THREE.Group();
    handMic.position.set(0, -0.55, 0.05);
    const hMicBody = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.22, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }));
    handMic.add(hMicBody);
    const hMicHead = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95, roughness: 0.2 }));
    hMicHead.position.y = 0.11;
    handMic.add(hMicHead);
    const hMicRing = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.005, 8, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    hMicRing.position.y = 0.08;
    handMic.add(hMicRing);

    rightArmGroup.add(handMic);
    torsoGroup.add(rightArmGroup);

    scene.add(hostGroup);

    // --- 6. Detailed High-Quality Animated Audience (Amphithéâtre) ---
    const audienceMembers = [];
    const audiencePalette = [
      0x38bdf8, 0x10b981, 0xf43f5e, 0xa855f7, 0xf59e0b, 0x06b6d4, 0xec4899, 0xffffff
    ];
    const hairPalette = [0x1c1917, 0x78350f, 0xd97706, 0x451a03, 0x0f172a];

    // 3 Curved tiers of stadium seating
    const rows = [
      { radius: 6.2, count: 8, height: 0.7, startAngle: -0.65, endAngle: 0.65 },
      { radius: 7.2, count: 10, height: 1.3, startAngle: -0.85, endAngle: 0.85 },
      { radius: 8.2, count: 12, height: 1.9, startAngle: -0.95, endAngle: 0.95 }
    ];

    rows.forEach((row, rowIdx) => {
      // Curved Bench for this row
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

        // NPC Torso with colored shirt
        const npcTorso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.16, 0.45, 12),
          new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 })
        );
        npcTorso.position.y = 0.225;
        npcGroup.add(npcTorso);

        // NPC Head
        const npcHead = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 14, 14),
          new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.6 })
        );
        npcHead.position.y = 0.58;
        npcGroup.add(npcHead);

        // NPC Hair
        const npcH = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 12, 12),
          new THREE.MeshStandardMaterial({ color: npcHair, roughness: 0.4 })
        );
        npcH.position.set(0, 0.65, -0.02);
        npcGroup.add(npcH);

        // NPC Animated Arms for Clapping
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

    // --- 7. Floating Studio Sparkle & Light Dust Particles ---
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3]     = (Math.random() - 0.5) * 8.0;
      particlePositions[p * 3 + 1] = Math.random() * 5.0 + 0.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 6.0;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.055,
      transparent: true,
      opacity: 0.65,
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

      // 1. Animated TV Giant Screen Graphics (Dynamic Visualizer bars + Text)
      screenCtx.fillStyle = '#0a0f24';
      screenCtx.fillRect(0, 0, 512, 256);

      // Gradient grid glow
      const grad = screenCtx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, themeColor);
      grad.addColorStop(1, '#0284c7');
      screenCtx.fillStyle = grad;
      screenCtx.fillRect(0, 0, 512, 12);
      screenCtx.fillRect(0, 244, 512, 12);

      // Studio audio visualizer wave bars
      const numBars = 24;
      for (let b = 0; b < numBars; b++) {
        const barH = 30 + Math.sin(elapsed * 4 + b * 0.4) * 25 + Math.cos(elapsed * 2 + b * 0.8) * 15;
        screenCtx.fillStyle = (b % 2 === 0) ? '#38bdf8' : themeColor;
        screenCtx.fillRect(40 + b * 18, 140 - barH / 2, 12, barH);
      }

      // Live Broadcast Title
      screenCtx.font = 'bold 24px sans-serif';
      screenCtx.fillStyle = '#ffffff';
      screenCtx.fillText('METABOX 3D STUDIO · SAR HECh', 70, 70);

      screenCtx.font = 'bold 15px sans-serif';
      screenCtx.fillStyle = '#94a3b8';
      screenCtx.fillText('PLATEAU INTERACTIF D\'ENTRAÎNEMENT ACADÉMIQUE', 70, 95);

      screenTexture.needsUpdate = true;

      // 2. Camera Cinematic Subtle Drift
      camera.position.x = Math.sin(elapsed * 0.3) * 0.4;
      camera.position.y = 2.6 + Math.cos(elapsed * 0.4) * 0.1;
      camera.lookAt(0, 1.35, 0);

      // 3. Moving Head Spotlights Sweeping
      beamSpots.forEach((spot, idx) => {
        const sweepSpeed = 0.8 + idx * 0.2;
        const targetX = Math.sin(elapsed * sweepSpeed + idx) * 3.0;
        const targetZ = Math.cos(elapsed * sweepSpeed * 0.7 + idx) * 2.0;
        spot.target.position.set(targetX, 0.5, targetZ);
        spot.target.updateMatrixWorld();

        // Update cone orientation to point to spot target
        const cone = beamCones[idx];
        if (cone) {
          cone.lookAt(targetX, 0.5, targetZ);
        }
      });

      // 4. Host Animation Rig
      // Breathing & Idle sway
      torsoGroup.position.y = 0.9 + Math.sin(elapsed * 2.2) * 0.015;
      torsoGroup.scale.set(
        1.0 + Math.sin(elapsed * 2.2) * 0.01,
        1.0 + Math.sin(elapsed * 2.2) * 0.015,
        1.0 + Math.sin(elapsed * 2.2) * 0.01
      );

      if (currentReaction === 'speaking') {
        // Nodding head and raising mic to talk
        headGroup.rotation.x = Math.sin(elapsed * 6) * 0.08;
        headGroup.rotation.y = Math.sin(elapsed * 3) * 0.12;

        rightArmGroup.rotation.x = -0.7 + Math.sin(elapsed * 5) * 0.15; // Holding mic up to mouth
        rightArmGroup.rotation.z = -0.3 + Math.cos(elapsed * 3) * 0.08;

        leftArmGroup.rotation.x = -0.4 + Math.sin(elapsed * 4) * 0.2; // Expressive hand gestures
        leftArmGroup.rotation.y = Math.cos(elapsed * 2) * 0.2;

      } else if (currentReaction === 'correct' || currentReaction === 'victory') {
        // Joyous jump and celebratory arm pump
        const jump = Math.abs(Math.sin(elapsed * 8)) * 0.18;
        hostGroup.position.y = 0.13 + jump;

        headGroup.rotation.x = -0.2; // Looking up joyously
        headGroup.rotation.y = Math.sin(elapsed * 6) * 0.1;

        // Both arms raised high in victory!
        leftArmGroup.rotation.x = -2.4 + Math.sin(elapsed * 8) * 0.2;
        leftArmGroup.rotation.z = -0.6;

        rightArmGroup.rotation.x = -2.4 + Math.cos(elapsed * 8) * 0.2;
        rightArmGroup.rotation.z = 0.6;

      } else if (currentReaction === 'wrong') {
        // Disappointed slump and facepalm
        hostGroup.position.y = 0.13;
        headGroup.rotation.x = 0.35 + Math.sin(elapsed * 4) * 0.05; // Head slumped down
        headGroup.rotation.y = Math.sin(elapsed * 5) * 0.25; // Shaking head "no"

        rightArmGroup.rotation.x = -1.8; // Hand to forehead (facepalm)
        rightArmGroup.rotation.z = 0.2;

        leftArmGroup.rotation.x = -0.1;
        leftArmGroup.rotation.z = 0.1;

      } else {
        // Relaxed Idle
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
          // Standing up, jumping and clapping rhythmically
          const jump = Math.abs(Math.sin(elapsed * 10 + npc.phase)) * 0.14;
          npc.group.position.y = npc.baseY + jump;

          // Clapping hands together
          const clapMotion = Math.sin(elapsed * 14 + npc.phase);
          npc.armL.rotation.y = clapMotion * 0.45;
          npc.armR.rotation.y = -clapMotion * 0.45;
          npc.armL.rotation.x = -1.1;
          npc.armR.rotation.x = -1.1;

        } else if (currentReaction === 'wrong') {
          // Slumping forward with hands on head
          npc.group.position.y = npc.baseY;
          npc.group.rotation.x = 0.2;
          npc.armL.rotation.x = -1.8;
          npc.armR.rotation.x = -1.8;
          npc.armL.rotation.y = 0.4;
          npc.armR.rotation.y = -0.4;

        } else {
          // Idle sway
          npc.group.position.y = npc.baseY + Math.sin(elapsed * 2 + npc.phase) * 0.02;
          npc.group.rotation.x = 0;
          npc.armL.rotation.x = -0.3 + Math.sin(elapsed * 2 + npc.phase) * 0.05;
          npc.armR.rotation.x = -0.3 + Math.sin(elapsed * 2 + npc.phase) * 0.05;
          npc.armL.rotation.y = 0;
          npc.armR.rotation.y = 0;
        }
      });

      // 6. Floating Sparkle Particles
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

    // Resize handler
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
