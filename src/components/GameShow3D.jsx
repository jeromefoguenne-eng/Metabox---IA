import { getAssetPath } from "../utils/assetPath";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 4 Distinct Visual Show Themes Configuration with PBR and Color Grading
const SHOW_THEMES = {
  millionnaire: {
    title: "QUI VEUT GAGNER DES CRÉDITS ?",
    subtitle: "ÉVALUATION FORMATIVE & MÉTHODES",
    bgHex: 0x0c192e,
    ambientHex: 0x312e81,
    floorColor: 0x3b1d0c,
    primaryColor: '#38bdf8',
    secondaryColor: '#f59e0b',
    goldColor: '#fde047',
    rimHex: 0xfde047,
    spotColors: [0x38bdf8, 0xfbbf24, 0xa78bfa, 0x34d399],
    screenType: 'pyramid',
    emblem: 'ECTS 60'
  },
  champion: {
    title: "QUESTIONS POUR UN MAJOR",
    subtitle: "NEUROSCIENCES & MÉMOIRE ACTIVE",
    bgHex: 0x1c0f06,
    ambientHex: 0x78350f,
    floorColor: 0x451e08,
    primaryColor: '#fbbf24',
    secondaryColor: '#f97316',
    goldColor: '#38bdf8',
    rimHex: 0xfde047,
    spotColors: [0xfbbf24, 0x38bdf8, 0xf97316, 0x60a5fa],
    screenType: 'timer_grid',
    emblem: 'MAJOR 1'
  },
  roue: {
    title: "LA ROUE DES ACCORDS",
    subtitle: "ORTHO'EXPRESS & CONJUGAISON PIÈGE",
    bgHex: 0x1a0a2a,
    ambientHex: 0x581c87,
    floorColor: 0x381224,
    primaryColor: '#f43f5e',
    secondaryColor: '#c084fc',
    goldColor: '#fde047',
    rimHex: 0xf472b6,
    spotColors: [0xf43f5e, 0xc084fc, 0x34d399, 0xfbbf24],
    screenType: 'roulette',
    emblem: 'ROUE'
  },
  concours: {
    title: "LE GRAND CONCOURS DE LA HECH",
    subtitle: "RÈGLEMENTS, DROITS & VIE ÉTUDIANTE",
    bgHex: 0x0f2038,
    ambientHex: 0x1e40af,
    floorColor: 0x2e183b,
    primaryColor: '#38bdf8',
    secondaryColor: '#a855f7',
    goldColor: '#fbbf24',
    rimHex: 0x38bdf8,
    spotColors: [0x38bdf8, 0xfbbf24, 0x818cf8, 0x2dd4bf],
    screenType: 'arena',
    emblem: 'CAMPUS'
  }
};

/**
 * GÉNÉRATEUR PROCÉDURAL DE TEXTURE DE SOL STUDIO PBR (AAA Glossy Tile Stage)
 * Crée des dalles acoustiques noires laquées avec micro-chanfreins et joints or/cyan.
 */
/**
 * GÉNÉRATEUR PROCÉDURAL DE BOISERIES DE THÉÂTRE PIXAR (Vertical Wood Slats with Gold Inlays)
 */
function createStudioWallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Boiseries d'amphithéâtre chaleureuses style Pixar (Chêne Miel & Acajou Lumineux)
  ctx.fillStyle = '#4a2514';
  ctx.fillRect(0, 0, 1024, 512);

  const slatW = 28;
  for (let x = 0; x < 1024; x += slatW) {
    const grad = ctx.createLinearGradient(x, 0, x + slatW, 0);
    grad.addColorStop(0, '#421f10');
    grad.addColorStop(0.3, '#6e381c');
    grad.addColorStop(0.7, '#8f4d28');
    grad.addColorStop(1, '#421f10');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 1.5, 0, slatW - 3, 512);

    // Liseré or brossé réfléchissant sur chaque panneau
    ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.fillRect(x + 3, 0, 2.2, 512);
  }

  // Éclairage studio diffus chaud (Cove lighting ambré)
  const vGrad = ctx.createLinearGradient(0, 0, 0, 512);
  vGrad.addColorStop(0, 'rgba(254, 215, 170, 0.25)');
  vGrad.addColorStop(0.4, 'rgba(255, 237, 213, 0.15)');
  vGrad.addColorStop(1, 'rgba(40, 18, 9, 0.55)');
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(8, 1);
  return texture;
}

function createStudioFloorTexture(themeCfg) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Sol Parquet Chêne Miel Chaleureux Style Studio Pixar
  ctx.fillStyle = '#2c1409';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankW = 256;
  const plankH = 64;
  const rows = 1024 / plankH;

  for (let r = 0; r < rows; r++) {
    const y = r * plankH;
    const offset = (r % 2) * (plankW / 2);
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + offset;
      const shade = Math.sin(r * 8.7 + px * 0.02) * 0.5 + 0.5;
      const rV = Math.floor(74 + shade * 38);
      const gV = Math.floor(38 + shade * 24);
      const bV = Math.floor(18 + shade * 14);

      // Lame de parquet verni avec dégradé doux
      const grad = ctx.createLinearGradient(px, y, px + plankW, y + plankH);
      grad.addColorStop(0, `rgb(${rV + 8}, ${gV + 6}, ${bV + 4})`);
      grad.addColorStop(1, `rgb(${rV - 6}, ${gV - 5}, ${bV - 3})`);
      ctx.fillStyle = grad;
      ctx.fillRect(px + 2, y + 2, plankW - 4, plankH - 4);

      // Veines douces de bois chêne naturel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      for (let v = 0; v < 3; v++) {
        ctx.fillRect(px + 8, y + 10 + v * 16, plankW - 16, 2.2);
      }

      // Rehaussé de reflet spéculaire ambré
      ctx.fillStyle = 'rgba(255, 215, 140, 0.10)';
      ctx.fillRect(px + 3, y + 3, plankW - 6, 3.5);
    }
    // Rainure fine dorée et sombre
    ctx.fillStyle = '#170803';
    ctx.fillRect(0, y, 1024, 2.5);
  }

  // Liserés circulaires dorés et néon incrustés dans le sol façon plateau Pixar
  ctx.strokeStyle = themeCfg.goldColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(512, 512, 410, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = themeCfg.primaryColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(512, 512, 230, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * GÉNÉRATEUR PROCÉDURAL D'OMBRE DE CONTACT (Contact Shadow)
 */
function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

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

    // --- 1. Scene, Camera & High-Resolution PBR Renderer ---
    const scene = new THREE.Scene();
    // Ambiance de théâtre Pixar chaleureuse (bois ambré et lueurs solaires)
    scene.background = new THREE.Color(0x2d170e); // Ambiance chaleureuse Pixar
    scene.fog = new THREE.FogExp2(0x2d170e, 0.012);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 2.7, 7.4);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false, 
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Clarté Retina / 4K
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Mouse interactive head tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(nx * 0.45, -0.45, 0.45);
      mouse.targetY = THREE.MathUtils.clamp(ny * 0.25, -0.25, 0.25);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 2. Advanced Multi-Point Studio Lighting ---
    const ambientLight = new THREE.AmbientLight(themeCfg.ambientHex, 0.65);
    scene.add(ambientLight);

    // Key Light : Host Spotlight with soft shadow
    const keyLight = new THREE.SpotLight(0xfff5ea, 5.5, 26, Math.PI / 4.8, 0.38, 1.1);
    keyLight.position.set(2.4, 6.8, 4.8);
    keyLight.target.position.set(0, 1.3, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 3.0;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Fill Light : Cool Studio Debouch
    const fillLight = new THREE.DirectionalLight(themeCfg.spotColors[0], 1.6);
    fillLight.position.set(-4.8, 4.5, 3.6);
    scene.add(fillLight);

    // Rim / Hair Backlight for crisp character detachment
    const rimLight = new THREE.DirectionalLight(themeCfg.rimHex, 3.8);
    rimLight.position.set(0, 5.8, -4.8);
    scene.add(rimLight);

    // Kicker Underlight (Lueur technologique au pied du pupitre)
    const kickerLight = new THREE.PointLight(new THREE.Color(themeCfg.primaryColor).getHex(), 1.5, 6.0);
    kickerLight.position.set(-0.85, 0.4, 0.85);
    scene.add(kickerLight);

    // 4 Motorized Moving Head Spotlights with Volumetric Cones
    const beamSpots = [];
    const beamCones = [];

    themeCfg.spotColors.forEach((colorHex, i) => {
      const angle = (i / themeCfg.spotColors.length) * Math.PI * 0.85 - Math.PI * 0.425;
      const x = Math.sin(angle) * 6.2;
      const z = -Math.cos(angle) * 3.8 - 1.2;

      const spot = new THREE.SpotLight(colorHex, 5.0, 24, Math.PI / 6.5, 0.45, 1.0);
      spot.position.set(x, 6.5, z);
      scene.add(spot);
      beamSpots.push(spot);

      const coneGeo = new THREE.ConeGeometry(1.4, 9.0, 24, 1, true);
      coneGeo.translate(0, -4.5, 0);
      coneGeo.rotateX(-Math.PI / 2);

      const coneMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(spot.position);
      scene.add(cone);
      beamCones.push(cone);
    });

    // --- 3. Studio Architecture & PBR Set Décor ---
    const floorTexture = createStudioFloorTexture(themeCfg);

    // Curved Backdrop Cyclorama - Boiseries de Théâtre Amphithéâtre Pixar (360° complet sans aucun vide noir)
    const wallTexture = createStudioWallTexture();
    const cycGeo = new THREE.CylinderGeometry(13.5, 13.5, 12.0, 64, 1, true); // Cylindre 360° complet
    const cycMat = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.38,
      metalness: 0.15,
      emissive: new THREE.Color(0x3a1d10),
      emissiveIntensity: 0.35,
      side: THREE.BackSide
    });
    const cyc = new THREE.Mesh(cycGeo, cycMat);
    cyc.position.set(0, 4.8, 0);
    scene.add(cyc);

    // Anneaux lumineux dorés et néon panoramiques complets
    for (let h = 1.6; h <= 5.6; h += 1.3) {
      const arcGeo = new THREE.TorusGeometry(12.8, 0.038, 12, 64);
      const arcMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(h > 3.5 ? themeCfg.goldColor : themeCfg.primaryColor),
        transparent: true,
        opacity: 0.45
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.x = Math.PI / 2;
      arc.position.set(0, h, 0);
      scene.add(arc);
    }

    // --- Giant Curved LED Broadcast Screen (2048x1024 Ultra-Resolution) ---
    const screenGeo = new THREE.CylinderGeometry(6.6, 6.6, 3.2, 64, 1, true, -Math.PI * 0.38, Math.PI * 0.76);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 2048;
    screenCanvas.height = 1024;
    const screenCtx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      side: THREE.BackSide
    });
    const giantScreen = new THREE.Mesh(screenGeo, screenMat);
    giantScreen.position.set(0, 2.9, 0);
    scene.add(giantScreen);

    // Multi-tier Concentric Stage Platform with PBR Tiles
    const stageOuterGeo = new THREE.CylinderGeometry(5.0, 5.2, 0.45, 64);
    const stageOuterMat = new THREE.MeshPhysicalMaterial({
      map: floorTexture,
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08
    });
    const stageOuter = new THREE.Mesh(stageOuterGeo, stageOuterMat);
    stageOuter.position.y = -0.225;
    stageOuter.receiveShadow = true;
    scene.add(stageOuter);

    // Inner Glossy Platform with Radial Specular Reflection
    const stageInnerGeo = new THREE.CylinderGeometry(3.9, 3.9, 0.16, 64);
    const stageInnerMat = new THREE.MeshPhysicalMaterial({
      color: 0x070b16,
      roughness: 0.06,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03
    });
    const stageInner = new THREE.Mesh(stageInnerGeo, stageInnerMat);
    stageInner.position.y = 0.08;
    stageInner.receiveShadow = true;
    scene.add(stageInner);

    // Emissive Glowing Rings on Stage
    const ring1Geo = new THREE.RingGeometry(3.82, 3.9, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.primaryColor), side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.162;
    scene.add(ring1);

    const ring2Geo = new THREE.RingGeometry(1.8, 1.86, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.goldColor), side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.162;
    scene.add(ring2);

    // Overhead Curved Lighting Truss with Metal Lattice Struts
    const trussCurve = new THREE.TorusGeometry(5.6, 0.09, 12, 48, Math.PI * 0.9);
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.92, roughness: 0.18 });
    const truss = new THREE.Mesh(trussCurve, trussMat);
    truss.rotation.x = Math.PI / 2;
    truss.rotation.z = -Math.PI * 0.45;
    truss.position.set(0, 6.2, 0);
    scene.add(truss);

    // --- 4. Host Podium Desk with Custom Illuminated Show Emblem ---
    const contactShadowTexture = createContactShadowTexture();

    // Contact shadow under podium
    const podShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.MeshBasicMaterial({ map: contactShadowTexture, transparent: true, opacity: 0.35, depthWrite: false })
    );
    podShadow.rotation.x = -Math.PI / 2;
    podShadow.position.set(-0.85, 0.163, 0.85);
    scene.add(podShadow);

    const podiumGroup = new THREE.Group();
    podiumGroup.position.set(-0.85, 0.15, 0.85);

    const podBaseGeo = new THREE.CylinderGeometry(0.54, 0.65, 0.96, 32);
    const podBaseMat = new THREE.MeshStandardMaterial({
      color: 0x3d1a0e, // Acajou chaleureux verni
      metalness: 0.25,
      roughness: 0.35
    });
    const podBase = new THREE.Mesh(podBaseGeo, podBaseMat);
    podBase.position.y = 0.48;
    podBase.castShadow = true;
    podiumGroup.add(podBase);

    // Plaque Acrylique Rétroéclairée avec le VRAI LOGO OFFICIEL HECh
    const hechOfficialTex = new THREE.TextureLoader().load(getAssetPath('/images/hech_podium_plaque_officiel.png'));
    hechOfficialTex.colorSpace = THREE.SRGBColorSpace;

    // Plaque incurvée ajustée sur la face avant du pupitre
    const podFrontGeo = new THREE.CylinderGeometry(0.56, 0.67, 0.68, 32, 1, true, -Math.PI * 0.32, Math.PI * 0.64);
    const podFrontMat = new THREE.MeshPhysicalMaterial({
      map: hechOfficialTex,
      emissive: 0xffffff,
      emissiveMap: hechOfficialTex,
      emissiveIntensity: 0.95,
      transparent: true,
      opacity: 0.98,
      roughness: 0.10,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const podFront = new THREE.Mesh(podFrontGeo, podFrontMat);
    podFront.position.y = 0.50;
    podiumGroup.add(podFront);

    // Cadre doré biseauté entourant la plaque officielle
    const podGoldTrimGeo = new THREE.TorusGeometry(0.61, 0.018, 8, 32, Math.PI * 0.66);
    const podGoldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
    const podGoldTrimTop = new THREE.Mesh(podGoldTrimGeo, podGoldTrimMat);
    podGoldTrimTop.rotation.x = Math.PI / 2;
    podGoldTrimTop.rotation.z = -Math.PI * 0.33;
    podGoldTrimTop.position.y = 0.84;
    podiumGroup.add(podGoldTrimTop);

    const podGoldTrimBottom = podGoldTrimTop.clone();
    podGoldTrimBottom.position.y = 0.16;
    podiumGroup.add(podGoldTrimBottom);

    // Top Desktop with Tablet & Gooseneck Mic
    const podTopGeo = new THREE.BoxGeometry(1.0, 0.08, 0.74);
    const podTopMat = new THREE.MeshStandardMaterial({ color: 0x0b1120, metalness: 0.92, roughness: 0.12 });
    const podTop = new THREE.Mesh(podTopGeo, podTopMat);
    podTop.position.set(0, 0.98, 0);
    podTop.rotation.x = 0.15;
    podTop.castShadow = true;
    podiumGroup.add(podTop);

    // Tablet
    const tabletGeo = new THREE.BoxGeometry(0.46, 0.02, 0.32);
    const tabletMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.primaryColor) });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(0, 1.03, -0.02);
    tablet.rotation.x = 0.15;
    podiumGroup.add(tablet);

    // Mic
    const micPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 })
    );
    micPole.position.set(0.25, 1.13, -0.05);
    micPole.rotation.z = -0.25;
    podiumGroup.add(micPole);

    const micHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95, roughness: 0.2 })
    );
    micHead.position.set(0.31, 1.29, -0.05);
    podiumGroup.add(micHead);

    const onAirRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.008, 8, 20),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    onAirRing.position.set(0.31, 1.29, -0.05);
    podiumGroup.add(onAirRing);

    scene.add(podiumGroup);

    // --- 5. High-Definition 3D TV Host Character (Henri) ---
    // Contact shadow under Henri
    const hostShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshBasicMaterial({ map: contactShadowTexture, transparent: true, opacity: 0.35, depthWrite: false })
    );
    hostShadow.rotation.x = -Math.PI / 2;
    hostShadow.position.set(-0.85, 0.163, 0.18);
    scene.add(hostShadow);

    const hostGroup = new THREE.Group();
    hostGroup.position.set(-0.85, 0.15, 0.18);

    // Conteneur dédié pour le modèle 3D sculpté Haute Définition (.GLB)
    const hostModelContainer = new THREE.Group();
    hostGroup.add(hostModelContainer);

    // Groupe pour la version géométrique primitive (masqué dès chargement du .GLB)
    const primitiveHostGroup = new THREE.Group();
    hostGroup.add(primitiveHostGroup);

    // Chargement du modèle 3D Pixar de l'animateur Henri (.GLB)
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      getAssetPath('/models/henri_host_pixar.glb'),
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Mise à l'échelle idéale pour un présentateur TV expressif au pupitre
        const targetHeight = 2.15;
        const scale = targetHeight / (size.y || 1);
        model.scale.set(scale, scale, scale);

        // Rotation pour faire face DIRECTEMENT à la caméra (vers +Z)
        model.rotation.y = -Math.PI * 0.5;

        // Centrage exact et élévation du buste au-dessus du pupitre
        model.position.x = -center.x * scale;
        model.position.y = 0.08 - box.min.y * scale;
        model.position.z = -center.z * scale;

        // Amélioration PBR du maillage & Activation des Vertex Colors Pixar
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.geometry) child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
              vertexColors: true,
              roughness: 0.35,
              metalness: 0.08
            });
          }
        });

        // Éclairage Studio Pixar 3-Points dédié pour Henri (Key, Fill, Rim)
        const henriKeyLight = new THREE.PointLight(0xffedd5, 2.2, 5.0);
        henriKeyLight.position.set(-0.85, 2.2, 2.0);
        scene.add(henriKeyLight);

        const henriRimLight = new THREE.DirectionalLight(0xfef08a, 2.8);
        henriRimLight.position.set(-0.85, 3.6, -1.8);
        scene.add(henriRimLight);

        const henriFillLight = new THREE.PointLight(0x93c5fd, 1.1, 4.0);
        henriFillLight.position.set(-2.2, 1.8, 1.2);
        scene.add(henriFillLight);

        hostModelContainer.add(model);
        // Masquer les primitives géométriques de substitution
        primitiveHostGroup.visible = false;
        console.log("[GameShow3D] Modèle 3D Pixar Henri chargé avec succès !");
      },
      undefined,
      (err) => {
        console.warn("[GameShow3D] Fallback géométrique actif (modèle en cours de chargement) :", err);
      }
    );

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd2b8,
      roughness: 0.48,
      metalness: 0.03
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x2e1d11,
      roughness: 0.38,
      metalness: 0.08
    });

    const suitMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.32,
      metalness: 0.25,
      clearcoat: 0.5,
      clearcoatRoughness: 0.12
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3
    });

    const tieMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(themeCfg.primaryColor).getHex(),
      roughness: 0.2,
      metalness: 0.5,
      clearcoat: 0.8
    });

    // Legs & Shoes
    const legsGroup = new THREE.Group();
    [-0.12, 0.12].forEach(x => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.9, 16), suitMat);
      leg.position.set(x, 0.45, 0);
      leg.castShadow = true;
      legsGroup.add(leg);

      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.24), new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.95, roughness: 0.1 }));
      shoe.position.set(x, 0.04, 0.04);
      shoe.castShadow = true;
      legsGroup.add(shoe);
    });
    primitiveHostGroup.add(legsGroup);

    // Torso & Suit Jacket
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.9;
    primitiveHostGroup.add(torsoGroup);

    const jacketGeo = new THREE.CylinderGeometry(0.28, 0.25, 0.72, 20);
    jacketGeo.scale(1.15, 1.0, 0.85);
    const jacket = new THREE.Mesh(jacketGeo, suitMat);
    jacket.position.y = 0.36;
    jacket.castShadow = true;
    torsoGroup.add(jacket);

    // Shirt & Tie V-neck
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.02), shirtMat);
    shirt.position.set(0, 0.46, 0.24);
    torsoGroup.add(shirt);

    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.34, 0.02), tieMat);
    tie.position.set(0, 0.44, 0.26);
    torsoGroup.add(tie);

    const pocketSquare = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.015), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pocketSquare.position.set(-0.16, 0.53, 0.24);
    pocketSquare.rotation.z = 0.1;
    torsoGroup.add(pocketSquare);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.14, 18), skinMat);
    neck.position.y = 0.70;
    torsoGroup.add(neck);

    // Head Group with articulated eyes & mouth
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.90, 0);
    torsoGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.22, 28, 28);
    headGeo.scale(1.0, 1.15, 1.05);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Hair
    const hairTopGeo = new THREE.SphereGeometry(0.24, 24, 24);
    hairTopGeo.scale(1.02, 0.85, 1.05);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.12, -0.02);
    headGroup.add(hairTop);

    const quiffGeo = new THREE.ConeGeometry(0.12, 0.22, 16);
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

    const eyes = [];
    [-0.08, 0.08].forEach(xOffset => {
      const eye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eye.position.set(xOffset, 0.04, 0.19);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.025, 14, 14), irisMat);
      iris.position.set(0, 0, 0.03);
      eye.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), pupilMat);
      pupil.position.set(0, 0, 0.02);
      iris.add(pupil);

      const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), catchlightMat);
      catchlight.position.set(0.008, 0.008, 0.012);
      pupil.add(catchlight);

      headGroup.add(eye);
      eyes.push(eye);
    });

    // Metallic Eyeglasses
    const glassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.1 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, clearcoat: 1.0 });

    [-0.08, 0.08].forEach(x => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.007, 10, 24), frameMat);
      rim.position.set(x, 0.04, 0.22);
      glassesGroup.add(rim);

      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), lensMat);
      lens.position.set(x, 0.04, 0.22);
      glassesGroup.add(lens);
    });

    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8), frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.05, 0.22);
    glassesGroup.add(bridge);
    headGroup.add(glassesGroup);

    // Warm Animated Smile / Mouth
    const smileGeo = new THREE.TorusGeometry(0.045, 0.009, 8, 20, Math.PI);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.09, 0.21);
    headGroup.add(smile);

    // Articulated Arms
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.32, 0.58, 0.02);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 16), suitMat);
    armL.position.y = -0.25;
    armL.castShadow = true;
    leftArmGroup.add(armL);
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 14), skinMat);
    handL.position.y = -0.55;
    leftArmGroup.add(handL);
    torsoGroup.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.32, 0.58, 0.02);
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.55, 16), suitMat);
    armR.position.y = -0.25;
    armR.castShadow = true;
    rightArmGroup.add(armR);
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 14), skinMat);
    handR.position.y = -0.55;
    rightArmGroup.add(handR);

    // Wireless Mic in Hand
    const handMic = new THREE.Group();
    handMic.position.set(0, -0.55, 0.05);
    handMic.add(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.22, 14), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95 })));
    const hMicHead = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 }));
    hMicHead.position.y = 0.11;
    handMic.add(hMicHead);
    const hMicRing = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.005, 8, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(themeCfg.primaryColor) }));
    hMicRing.position.y = 0.08;
    handMic.add(hMicRing);
    rightArmGroup.add(handMic);
    torsoGroup.add(rightArmGroup);

    scene.add(hostGroup);

    // --- 6. Warm Tiered Balconies & Pixar Theater Gallery ---
    const audienceMembers = [];
    const balconyGroup = new THREE.Group();
    balconyGroup.position.set(0, 0, -1.0);

    const pixarSpectatorStyles = [
      { sweater: 0xbe123c, hair: 0x3f2c20, skin: 0xfbd2b8, hairStyle: 'pompadour', glasses: true },
      { sweater: 0xd97706, hair: 0x1c1917, skin: 0xdf9b77, hairStyle: 'curly', glasses: false },
      { sweater: 0x1d4ed8, hair: 0xb45309, skin: 0xfed7aa, hairStyle: 'parted', glasses: true },
      { sweater: 0x059669, hair: 0x451a03, skin: 0xc68662, hairStyle: 'beanie', glasses: false },
      { sweater: 0x7c3aed, hair: 0x18181b, skin: 0xfce7f3, hairStyle: 'ponytail', glasses: false },
      { sweater: 0xe11d48, hair: 0x78350f, skin: 0xfddcc4, hairStyle: 'curly', glasses: true },
      { sweater: 0x0891b2, hair: 0x27272a, skin: 0xfbcfe8, hairStyle: 'parted', glasses: false },
      { sweater: 0xc2410c, hair: 0x581c87, skin: 0xfbd2b8, hairStyle: 'beanie', glasses: false }
    ];

    const balconyTiers = [
      { radius: 6.8, height: 0.6, color: 0x3a1b10, count: 9 },
      { radius: 7.8, height: 1.2, color: 0x2e140b, count: 11 },
      { radius: 8.8, height: 1.8, color: 0x240f07, count: 13 }
    ];

    balconyTiers.forEach((tier) => {
      // Gradin en boiseries chaudes
      const tierGeo = new THREE.CylinderGeometry(tier.radius + 0.5, tier.radius + 0.5, 0.45, 48, 1, true, -Math.PI * 0.55, Math.PI * 1.1);
      const tierMat = new THREE.MeshStandardMaterial({ color: tier.color, roughness: 0.5, metalness: 0.1 });
      const tierMesh = new THREE.Mesh(tierGeo, tierMat);
      tierMesh.position.y = tier.height;
      balconyGroup.add(tierMesh);

      // Liseré or chaud le long de chaque balcon
      const goldRailGeo = new THREE.TorusGeometry(tier.radius + 0.52, 0.035, 8, 48, Math.PI * 1.05);
      const goldRailMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
      const rail = new THREE.Mesh(goldRailGeo, goldRailMat);
      rail.rotation.x = Math.PI / 2;
      rail.rotation.z = -Math.PI * 0.525;
      rail.position.y = tier.height + 0.24;
      balconyGroup.add(rail);

      // Petites veilleuses d'ambiance de théâtre douces (Warm Theater Sconces)
      for (let s = -4; s <= 4; s++) {
        const sAngle = (s / 4.5) * Math.PI * 0.45;
        const sx = Math.sin(sAngle) * (tier.radius + 0.5);
        const sz = -Math.cos(sAngle) * (tier.radius + 0.5) * 0.6;
        const sconce = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfde047 })
        );
        sconce.position.set(sx, tier.height + 0.26, sz);
        balconyGroup.add(sconce);
      }

      // Modélisation des spectateurs 3D style Pixar sur ce balcon
      for (let i = 0; i < tier.count; i++) {
        const style = pixarSpectatorStyles[(i + Math.floor(tier.height * 3)) % pixarSpectatorStyles.length];
        const spectatorGroup = new THREE.Group();

        // Siège tabouret de théâtre
        const stool = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.18, 0.30, 12),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
        );
        stool.position.y = 0.15;
        spectatorGroup.add(stool);

        // Buste / Sweat universitaire HECh aux couleurs chaleureuses
        const sweaterMat = new THREE.MeshStandardMaterial({ color: style.sweater, roughness: 0.55, metalness: 0.05 });
        const torso = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), sweaterMat);
        torso.scale.set(1.0, 1.25, 0.85);
        torso.position.y = 0.52;
        spectatorGroup.add(torso);

        // Col ou capuche
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 16), sweaterMat);
        collar.rotation.x = Math.PI / 2;
        collar.position.y = 0.72;
        spectatorGroup.add(collar);

        // Tête Pixar expressive
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.86, 0);

        const skinMat = new THREE.MeshStandardMaterial({ color: style.skin, roughness: 0.45, metalness: 0.02 });
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), skinMat);
        head.scale.set(0.95, 1.05, 0.95);
        headGroup.add(head);

        // Cheveux sculptés Pixar ou bonnet
        const hairMat = new THREE.MeshStandardMaterial({ color: style.hair, roughness: 0.38 });
        if (style.hairStyle === 'beanie') {
          const beanie = new THREE.Mesh(
            new THREE.SphereGeometry(0.17, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
            sweaterMat
          );
          beanie.position.y = 0.06;
          headGroup.add(beanie);
          const pompom = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
          pompom.position.y = 0.22;
          headGroup.add(pompom);
        } else if (style.hairStyle === 'curly') {
          for (let c = 0; c < 7; c++) {
            const curl = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), hairMat);
            const a = (c / 7) * Math.PI * 2;
            curl.position.set(Math.cos(a) * 0.11, 0.07 + (c % 2) * 0.03, Math.sin(a) * 0.11);
            headGroup.add(curl);
          }
        } else if (style.hairStyle === 'ponytail') {
          const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
          hairTop.position.y = 0.04;
          headGroup.add(hairTop);
          const tail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.20, 8), hairMat);
          tail.rotation.x = -Math.PI * 0.35;
          tail.position.set(0, 0.02, -0.19);
          headGroup.add(tail);
        } else {
          const hair = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
          hair.position.y = 0.05;
          headGroup.add(hair);
        }

        // Yeux expressifs Pixar
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
        [-0.05, 0.05].forEach((ex) => {
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
          eye.scale.set(1.0, 1.15, 0.6);
          eye.position.set(ex, 0.01, 0.135);
          headGroup.add(eye);
          const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), pupilMat);
          pupil.position.set(ex, 0.01, 0.152);
          headGroup.add(pupil);
        });

        // Lunettes pour certains spectateurs
        if (style.glasses) {
          const frameMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
          [-0.05, 0.05].forEach((gx) => {
            const rim = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.006, 6, 14), frameMat);
            rim.position.set(gx, 0.01, 0.155);
            headGroup.add(rim);
          });
          const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.006, 0.006), frameMat);
          bridge.position.set(0, 0.01, 0.155);
          headGroup.add(bridge);
        }

        spectatorGroup.add(headGroup);

        // Bras gauche & droit articulés pour l'animation
        const armLGroup = new THREE.Group();
        armLGroup.position.set(-0.20, 0.58, 0);
        const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.20, 6, 6), sweaterMat);
        armL.position.set(-0.05, -0.09, 0.08);
        armL.rotation.z = 0.35;
        armL.rotation.x = 0.85;
        armLGroup.add(armL);
        const handL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), skinMat);
        handL.position.set(-0.06, -0.20, 0.16);
        armLGroup.add(handL);
        spectatorGroup.add(armLGroup);

        const armRGroup = new THREE.Group();
        armRGroup.position.set(0.20, 0.58, 0);
        const armR = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.20, 6, 6), sweaterMat);
        armR.position.set(0.05, -0.09, 0.08);
        armR.rotation.z = -0.35;
        armR.rotation.x = 0.85;
        armRGroup.add(armR);
        const handR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), skinMat);
        handR.position.set(0.06, -0.20, 0.16);
        armRGroup.add(handR);
        spectatorGroup.add(armRGroup);

        // Positionnement en arc le long du balcon
        const angle = (i / (tier.count - 1) - 0.5) * Math.PI * 0.90;
        const specRadius = tier.radius - 0.15;
        const px = Math.sin(angle) * specRadius;
        const pz = -Math.cos(angle) * specRadius * 0.62;
        spectatorGroup.position.set(px, tier.height, pz);
        spectatorGroup.lookAt(0, 0.8, 0);
        balconyGroup.add(spectatorGroup);

        audienceMembers.push({
          group: spectatorGroup,
          head: headGroup,
          armL: armLGroup,
          armR: armRGroup,
          baseY: tier.height,
          phase: Math.random() * Math.PI * 2
        });
      }
    });

    // Modèles 3D Invités VIP sur les loges avant (Aurore & Maxime)
    gltfLoader.load(getAssetPath('/models/aurore_pixar_3d.glb'), (gltf) => {
      const auroreVIP = gltf.scene;
      auroreVIP.scale.set(0.85, 0.85, 0.85);
      auroreVIP.position.set(-4.2, 0.62, -2.6);
      auroreVIP.lookAt(0, 0.8, 0);
      balconyGroup.add(auroreVIP);
    }, undefined, () => {});

    gltfLoader.load(getAssetPath('/models/maxime_3d.glb'), (gltf) => {
      const maximeVIP = gltf.scene;
      maximeVIP.scale.set(0.85, 0.85, 0.85);
      maximeVIP.position.set(4.2, 0.62, -2.6);
      maximeVIP.lookAt(0, 0.8, 0);
      balconyGroup.add(maximeVIP);
    }, undefined, () => {});

    scene.add(balconyGroup);

    // --- 7. Floating Studio Sparkles / Golden Motes ---
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3]     = (Math.random() - 0.5) * 9.5;
      particlePositions[p * 3 + 1] = Math.random() * 5.5 + 0.4;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 7.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(themeCfg.goldColor),
      size: 0.028,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 8. Animation Loop with Reaction Dynamics ---
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const currentReaction = reactionStateRef.current;

      // Mouse lerp for smooth parallax
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.06);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.06);

      // Blinking cycle every ~3.5 seconds
      blinkTimer += 0.016;
      if (blinkTimer > 3.6) {
        isBlinking = true;
        if (blinkTimer > 3.75) {
          isBlinking = false;
          blinkTimer = 0;
        }
      }
      eyes.forEach(eye => {
        eye.scale.y = isBlinking ? 0.1 : 1.0;
      });

      // 1. Render Custom Animated Graphics on the GIANT LED WALL (2048x1024)
      screenCtx.fillStyle = '#040711';
      screenCtx.fillRect(0, 0, 2048, 1024);

      // Subtle Scanline Grid for authentic giant broadcast display look
      screenCtx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      for (let y = 0; y < 1024; y += 4) {
        screenCtx.fillRect(0, y, 2048, 2);
      }

      // Top & Bottom Glowing Border
      const grad = screenCtx.createLinearGradient(0, 0, 2048, 0);
      grad.addColorStop(0, themeCfg.primaryColor);
      grad.addColorStop(0.5, themeCfg.goldColor);
      grad.addColorStop(1, themeCfg.primaryColor);
      screenCtx.fillStyle = grad;
      screenCtx.fillRect(0, 0, 2048, 28);
      screenCtx.fillRect(0, 996, 2048, 28);

      // Distinct Graphics by Show Type
      if (themeCfg.screenType === 'pyramid') {
        // Qui veut gagner des crédits - ECTS Pyramid with energy pulse
        for (let p = 0; p < 10; p++) {
          const stepW = 180 + p * 80;
          const isAct = p === 9;
          const isSafe = p === 3 || p === 6;
          screenCtx.fillStyle = isAct 
            ? '#f59e0b' 
            : isSafe 
            ? 'rgba(245, 158, 11, 0.65)' 
            : 'rgba(56, 189, 248, 0.30)';
          screenCtx.fillRect(1024 - stepW / 2, 900 - p * 48, stepW, 32);
        }
      } else if (themeCfg.screenType === 'timer_grid') {
        // Questions pour un Major - Countdown & 3-round blocks
        const rounds = ["9 POINTS GAGNANTS", "4 À LA SUITE", "LE FACE-À-FACE"];
        rounds.forEach((r, idx) => {
          screenCtx.fillStyle = (idx === 1) ? '#f59e0b' : 'rgba(6, 182, 212, 0.35)';
          screenCtx.fillRect(360 + idx * 460, 720, 400, 100);
          screenCtx.fillStyle = '#ffffff';
          screenCtx.font = 'bold 36px sans-serif';
          screenCtx.fillText(r, 400 + idx * 460, 785);
        });
      } else if (themeCfg.screenType === 'roulette') {
        // La Roue des Accords - Segmented Wheel Motif
        const wheelCenter = 1024;
        screenCtx.save();
        screenCtx.translate(wheelCenter, 760);
        screenCtx.rotate(elapsed * 0.9);
        for (let s = 0; s < 12; s++) {
          screenCtx.beginPath();
          screenCtx.moveTo(0, 0);
          screenCtx.arc(0, 0, 180, (s * Math.PI) / 6, ((s + 1) * Math.PI) / 6);
          screenCtx.fillStyle = s % 2 === 0 ? '#ec4899' : '#a855f7';
          screenCtx.fill();
        }
        screenCtx.restore();
      } else {
        // Le Grand Concours - Cyber radar audio equalizer
        for (let b = 0; b < 32; b++) {
          const barH = 80 + Math.sin(elapsed * 5 + b * 0.35) * 70;
          screenCtx.fillStyle = b % 2 === 0 ? '#06b6d4' : '#8b5cf6';
          screenCtx.fillRect(240 + b * 48, 760 - barH / 2, 34, barH);
        }
      }

      // HECh Official Badge on giant LED broadcast screen
      screenCtx.fillStyle = '#e11d48';
      screenCtx.beginPath();
      if (typeof screenCtx.roundRect === 'function') {
        screenCtx.roundRect(80, 70, 120, 120, [28]);
      } else {
        screenCtx.rect(80, 70, 120, 120);
      }
      screenCtx.fill();
      screenCtx.fillStyle = '#f59e0b';
      screenCtx.beginPath();
      screenCtx.arc(176, 160, 20, 0, Math.PI * 2);
      screenCtx.fill();
      screenCtx.fillStyle = '#ffffff';
      screenCtx.font = '900 76px sans-serif';
      screenCtx.fillText('H', 112, 160);

      screenCtx.fillStyle = '#ffffff';
      screenCtx.font = '900 48px sans-serif';
      screenCtx.fillText('HECh', 224, 128);
      screenCtx.fillStyle = '#fb7185';
      screenCtx.font = 'bold 24px sans-serif';
      screenCtx.fillText('HAUTE ÉCOLE CHARLEMAGNE', 224, 164);

      // SHOW NAME WRITTEN LARGE IN GLOWING TYPOGRAPHY
      screenCtx.font = '900 96px sans-serif';
      screenCtx.fillStyle = '#ffffff';
      screenCtx.textAlign = 'center';
      screenCtx.shadowColor = themeCfg.primaryColor;
      screenCtx.shadowBlur = 35;
      screenCtx.fillText(themeCfg.title, 1024, 260);
      screenCtx.shadowBlur = 0;

      // Subtitle
      screenCtx.font = '700 44px sans-serif';
      screenCtx.fillStyle = themeCfg.primaryColor;
      screenCtx.fillText(themeCfg.subtitle, 1024, 350);

      screenCtx.textAlign = 'start';
      screenTexture.needsUpdate = true;

      // Studio Lighting Dynamic Reactions
      const isCelebrating = currentReaction === 'correct' || currentReaction === 'victory';
      const isError = currentReaction === 'wrong';

      if (theme === 'millionnaire') {
        const targetAmbient = isCelebrating ? 0.75 : isError ? 0.35 : 0.18;
        const targetFill = isCelebrating ? 1.90 : isError ? 0.9 : 0.50;
        const targetKey = isCelebrating ? 5.0 : isError ? 2.5 : 6.8;
        ambientLight.intensity += (targetAmbient - ambientLight.intensity) * 0.08;
        fillLight.intensity += (targetFill - fillLight.intensity) * 0.08;
        keyLight.intensity += (targetKey - keyLight.intensity) * 0.08;
      }

      // Camera Cinematic Subtle Drift
      camera.position.x = Math.sin(elapsed * 0.28) * 0.45 + mouse.x * 0.3;
      camera.position.y = 2.7 + Math.cos(elapsed * 0.35) * 0.12 + mouse.y * 0.2;
      camera.lookAt(0, 1.4, 0);

      // Moving Spotlights Sweeping
      beamSpots.forEach((spot, idx) => {
        const sweepSpeed = isCelebrating ? (1.6 + idx * 0.4) : isError ? (2.2 + idx * 0.3) : (0.28 + idx * 0.12);
        const targetX = Math.sin(elapsed * sweepSpeed + idx) * 3.4;
        const targetZ = Math.cos(elapsed * sweepSpeed * 0.7 + idx) * 2.4;
        spot.target.position.set(targetX, 0.5, targetZ);
        spot.target.updateMatrixWorld();

        const cone = beamCones[idx];
        if (cone) {
          cone.lookAt(targetX, 0.5, targetZ);
        }
      });

      // Host Animation Rig with Natural Breathing & Expressiveness
      torsoGroup.position.y = 0.9 + Math.sin(elapsed * 2.4) * 0.016;
      hostModelContainer.position.y = Math.sin(elapsed * 2.4) * 0.016;
      hostModelContainer.rotation.y = THREE.MathUtils.lerp(hostModelContainer.rotation.y, mouse.x * 0.35, 0.08);

      // Host head tracks mouse with natural limitation
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouse.x * 0.5, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mouse.y * 0.3, 0.08);

      if (currentReaction === 'speaking') {
        hostGroup.position.y = 0.15;
        headGroup.rotation.x += Math.sin(elapsed * 4.5) * 0.04;
        headGroup.rotation.y += Math.sin(elapsed * 2.2) * 0.05;

        rightArmGroup.rotation.x = -0.62 + Math.sin(elapsed * 3.2) * 0.09;
        rightArmGroup.rotation.z = -0.2;

        leftArmGroup.rotation.x = -0.52 + Math.sin(elapsed * 2.6) * 0.09;
        leftArmGroup.rotation.y = 0.12;

      } else if (currentReaction === 'correct' || currentReaction === 'victory') {
        const jump = Math.abs(Math.sin(elapsed * 8.5)) * 0.2;
        hostGroup.position.y = 0.15 + jump;

        headGroup.rotation.x = -0.18;
        headGroup.rotation.y += Math.sin(elapsed * 6.0) * 0.1;

        leftArmGroup.rotation.x = -2.4 + Math.sin(elapsed * 8.5) * 0.22;
        leftArmGroup.rotation.z = -0.65;

        rightArmGroup.rotation.x = -2.4 + Math.cos(elapsed * 8.5) * 0.22;
        rightArmGroup.rotation.z = 0.65;

      } else if (currentReaction === 'wrong') {
        hostGroup.position.y = 0.15;
        headGroup.rotation.x = 0.32 + Math.sin(elapsed * 4.0) * 0.05;
        headGroup.rotation.y += Math.sin(elapsed * 5.2) * 0.22;

        rightArmGroup.rotation.x = -1.8;
        rightArmGroup.rotation.z = 0.2;

        leftArmGroup.rotation.x = -0.1;
        leftArmGroup.rotation.z = 0.1;

      } else {
        // Idle
        headGroup.rotation.x += Math.sin(elapsed * 1.5) * 0.03;
        headGroup.rotation.y += Math.sin(elapsed * 1.0) * 0.04;

        rightArmGroup.rotation.x = -0.42 + Math.sin(elapsed * 2.0) * 0.05;
        rightArmGroup.rotation.z = -0.15;

        leftArmGroup.rotation.x = -0.16 + Math.sin(elapsed * 1.8) * 0.04;
        leftArmGroup.rotation.z = 0.1;
      }

      // Studio Audience NPCs Animation
      audienceMembers.forEach((npc) => {
        if (currentReaction === 'correct' || currentReaction === 'victory') {
          const jump = Math.abs(Math.sin(elapsed * 10 + npc.phase)) * 0.15;
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
          if (npc.head) {
            npc.head.rotation.y = Math.sin(elapsed * 1.2 + npc.phase) * 0.10;
            npc.head.rotation.x = Math.sin(elapsed * 0.8 + npc.phase) * 0.05;
          }
        }
      });

      // Floating Sparkles
      const pArr = particlePositions;
      for (let p = 0; p < particleCount; p++) {
        pArr[p * 3 + 1] -= 0.007;
        if (pArr[p * 3 + 1] < 0.2) {
          pArr[p * 3 + 1] = 5.5;
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
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      floorTexture.dispose();
      contactShadowTexture.dispose();
      screenTexture.dispose();
      hechOfficialTex.dispose();
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
