import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Camera, ZoomIn, Eye, Sparkles, Film, ShieldCheck } from 'lucide-react';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { sounds } from '../utils/soundEffects';
import CharacterAvatar from './CharacterAvatar';
import { CANONICAL_CHARACTERS } from '../utils/charactersData';

// =========================================================================
// GÉNÉRATEURS PROCÉDURAUX DE TEXTURES PBR (Diffuse & Relief / Bump)
// =========================================================================

// Texture Diffuse Parquet en chêne français verni
function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2d170c';
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 32;
  const plankW = 128;
  const rows = 512 / plankH;
  for (let r = 0; r < rows; r++) {
    const y = r * plankH;
    const offset = (r % 2) * (plankW / 2);
    for (let x = -plankW; x < 512 + plankW; x += plankW) {
      const px = x + offset;
      const shade = (Math.sin(r * 11.7 + px * 0.04) * 0.5 + 0.5);
      const rV = Math.floor(52 + shade * 28);
      const gV = Math.floor(26 + shade * 18);
      const bV = Math.floor(14 + shade * 12);
      ctx.fillStyle = `rgb(${rV}, ${gV}, ${bV})`;
      ctx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2);

      // Fibres fines de chêne
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      for (let v = 0; v < 3; v++) {
        ctx.fillRect(px + 3, y + 5 + v * 9, plankW - 6, 1.2);
      }
    }
    // Rainure d'assemblage sombre
    ctx.fillStyle = '#100603';
    ctx.fillRect(0, y, 512, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
}

// Carte de Relief (Bump Map) pour joints et veinage du Parquet
function createParquetBumpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 32;
  const plankW = 128;
  const rows = 512 / plankH;
  for (let r = 0; r < rows; r++) {
    const y = r * plankH;
    const offset = (r % 2) * (plankW / 2);
    for (let x = -plankW; x < 512 + plankW; x += plankW) {
      const px = x + offset;
      // Joint sombre en creux
      ctx.fillStyle = '#202020';
      ctx.strokeRect(px, y, plankW, plankH);

      // Veines en micro-relief
      ctx.fillStyle = '#606060';
      for (let v = 0; v < 3; v++) {
        ctx.fillRect(px + 4, y + 6 + v * 9, plankW - 8, 1);
      }
    }
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, y, 512, 1.8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
}

// Texture Marbre pour colonnes corinthiennes et balustrades
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f5efe6';
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineWidth = 2.2;
  for (let i = 0; i < 9; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(185, 160, 130, 0.45)' : 'rgba(140, 130, 120, 0.35)';
    ctx.beginPath();
    let x = (i * 60) % 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (Math.sin(y * 0.03 + i) * 35);
      y += 24;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3);
  return texture;
}

// Texture Acajou pour pupitres, lambris et boiseries
function createMahoganyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#45170f';
  ctx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 3) {
    const alpha = (Math.sin(x * 0.18) * 0.5 + 0.5) * 0.25;
    ctx.fillStyle = `rgba(20, 6, 2, ${alpha})`;
    ctx.fillRect(x, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Relief subtil Acajou
function createMahoganyBumpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 4) {
    const v = Math.floor(115 + (Math.sin(x * 0.22) * 0.5 + 0.5) * 35);
    ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
    ctx.fillRect(x, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Presets de Caméra Cinématographique
export const CAMERA_PRESETS = {
  TV_WIDE: {
    pos: [0, 4.4, 8.2],
    look: [0, 1.8, -1.8],
    fov: 46,
    label: "Plan d'Ensemble Tribunal"
  },
  JUDGE: {
    pos: [0, 3.4, -1.6],
    look: [0, 3.2, -5.2],
    fov: 34,
    label: "Plan Serré Juge"
  },
  WITNESS: {
    pos: [0, 2.0, 3.4],
    look: [0, 1.7, 0.7],
    fov: 34,
    label: "Plan Face Maxime"
  },
  DEFENSE: {
    pos: [2.5, 2.3, 2.8],
    look: [4.4, 1.8, -0.2],
    fov: 36,
    label: "Banc de la Défense"
  },
  PROSECUTION: {
    pos: [-2.5, 2.3, 2.8],
    look: [-4.4, 1.8, -0.2],
    fov: 36,
    label: "Banc de l'Accusation"
  },
  AUDIENCE: {
    pos: [0, 2.4, -1.5],
    look: [0, 1.6, 6.2],
    fov: 48,
    label: "Tribune du Public"
  }
};

export default function Courtroom3DCanvas({
  witnessState = 'idle',
  prosecutorState = 'idle',
  defenseState = 'idle',
  judgeState = 'idle',
  judgeReaction = 'neutral',
  audienceState = 'idle',
  audienceShoutText = '',
  onGavelComplete,
  cameraView = 'TV_WIDE',
  onCameraChange
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);

  // Références d'animation
  const judgeArmRef = useRef(null);
  const judgeHeadRef = useRef(null);
  const judgeMouthRef = useRef(null);
  const judgeEyesRef = useRef([]);
  const judgeLeftBrowRef = useRef(null);
  const judgeRightBrowRef = useRef(null);
  const judgeEmoRingRef = useRef(null);
  
  const witnessRef = useRef(null);
  const witnessHeadRef = useRef(null);
  const witnessMouthRef = useRef(null);
  const witnessEyesRef = useRef([]);
  const witnessLeftArmRef = useRef(null);
  const witnessRightArmRef = useRef(null);
  const witnessLeftBrowRef = useRef(null);
  const witnessRightBrowRef = useRef(null);
  
  const prosArmRef = useRef(null);
  const prosHeadRef = useRef(null);
  const defArmRef = useRef(null);
  const defHeadRef = useRef(null);

  const shockwaveRef = useRef(null);
  const audienceMembersRef = useRef([]);

  const targetCamPos = useRef(new THREE.Vector3(...CAMERA_PRESETS.TV_WIDE.pos));
  const targetCamLook = useRef(new THREE.Vector3(...CAMERA_PRESETS.TV_WIDE.look));
  const currentCamLook = useRef(new THREE.Vector3(...CAMERA_PRESETS.TV_WIDE.look));

  const witnessStateRef = useRef(witnessState);
  const prosecutorStateRef = useRef(prosecutorState);
  const defenseStateRef = useRef(defenseState);
  const judgeStateRef = useRef(judgeState);
  const judgeReactionRef = useRef(judgeReaction);
  const audienceStateRef = useRef(audienceState);

  useEffect(() => { witnessStateRef.current = witnessState; }, [witnessState]);
  useEffect(() => { prosecutorStateRef.current = prosecutorState; }, [prosecutorState]);
  useEffect(() => { defenseStateRef.current = defenseState; }, [defenseState]);
  useEffect(() => { judgeStateRef.current = judgeState; }, [judgeState]);
  useEffect(() => { judgeReactionRef.current = judgeReaction; }, [judgeReaction]);
  useEffect(() => { audienceStateRef.current = audienceState; }, [audienceState]);

  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraView] || CAMERA_PRESETS.TV_WIDE;
    targetCamPos.current.set(...preset.pos);
    targetCamLook.current.set(...preset.look);
  }, [cameraView]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Initialisation Scène, Moteur de Rendu & Caméra
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x140c11);
    scene.fog = new THREE.FogExp2(0x140c11, 0.022);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 4.4, 8.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Pipeline PBR Studio : Environnement Lumineux Réel (RoomEnvironment + PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // Post-Processing Cinéma : EffectComposer + UnrealBloomPass
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.05, // Bloom très feutré et délicat
      0.18, // Rayon réduit
      0.98  // Seuil élevé : seules les flammes et ampoules réelles scintillent
    );
    composer.addPass(bloomPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    // 2. Éclairage Feutré & Réaliste de Tribunal (Ambiance Chaleureuse & Tamisée)
    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x1a0f0d, 0.40);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x78350f, 0.16);
    scene.add(ambientLight);

    // Key Light douce et tamisée (Lustre central)
    const keySpot = new THREE.SpotLight(0xffedd5, 0.95);
    keySpot.position.set(2.5, 9.5, 5.0);
    keySpot.angle = Math.PI / 4.6;
    keySpot.penumbra = 0.95;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    keySpot.shadow.bias = -0.0001;
    keySpot.shadow.radius = 4.0;
    scene.add(keySpot);

    // Découpe feutrée douce (Ardoise & Ambre doux)
    const rimSlate = new THREE.DirectionalLight(0x64748b, 0.22);
    rimSlate.position.set(-8, 7, -2);
    scene.add(rimSlate);

    const rimWarm = new THREE.DirectionalLight(0xd97706, 0.35);
    rimWarm.position.set(8, 7, -2);
    scene.add(rimWarm);

    // Éclairage tamisé doux sur le Juge
    const judgeSpot = new THREE.SpotLight(0xfde68a, 0.45);
    judgeSpot.position.set(0, 9.5, -2.5);
    judgeSpot.target.position.set(0, 3.2, -5.2);
    judgeSpot.angle = Math.PI / 4.5;
    judgeSpot.penumbra = 0.85;
    scene.add(judgeSpot);
    scene.add(judgeSpot.target);

    // Particules dorées en suspension
    const dustCount = 160;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 18;
      dustPositions[i + 1] = Math.random() * 8 + 0.5;
      dustPositions[i + 2] = (Math.random() - 0.5) * 16 - 1;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.05,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 3. Matériaux PBR Studio Haute Définition
    const parquetTex = createParquetTexture();
    const parquetBumpTex = createParquetBumpTexture();
    const marbleTex = createMarbleTexture();
    const mahoganyTex = createMahoganyTexture();
    const mahoganyBumpTex = createMahoganyBumpTexture();

    const woodMahogany = new THREE.MeshPhysicalMaterial({ 
      map: mahoganyTex, 
      bumpMap: mahoganyBumpTex,
      bumpScale: 0.02,
      roughness: 0.22, 
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.20
    });

    const marblePillar = new THREE.MeshPhysicalMaterial({ 
      map: marbleTex, 
      roughness: 0.14, 
      metalness: 0.04,
      clearcoat: 0.70,
      clearcoatRoughness: 0.10
    });

    const woodDarkOak = new THREE.MeshPhysicalMaterial({ 
      map: mahoganyTex, 
      color: 0x2b150f, 
      roughness: 0.35, 
      metalness: 0.05 
    });

    const floorParquet = new THREE.MeshPhysicalMaterial({ 
      map: parquetTex, 
      bumpMap: parquetBumpTex,
      bumpScale: 0.020,
      roughness: 0.58, // Chêne ciré mat satiné, sans reflet blanc aveuglant
      metalness: 0.02,
      clearcoat: 0.08,
      clearcoatRoughness: 0.45
    });

    const goldMat = new THREE.MeshStandardMaterial({ 
      color: 0xf59e0b, 
      roughness: 0.12, 
      metalness: 0.95 
    });

    const brassMat = new THREE.MeshStandardMaterial({ 
      color: 0xd97706, 
      roughness: 0.14, 
      metalness: 0.92 
    });

    // Tissus Nobles avec Effet Sheen (Velours, Soie, Drap de laine judiciaire)
    const clothBlack = new THREE.MeshPhysicalMaterial({ 
      color: 0x0f172a, 
      roughness: 0.45, 
      metalness: 0.02,
      sheen: 0.85,
      sheenColor: new THREE.Color(0x334155),
      flatShading: false 
    });

    const clothWhite = new THREE.MeshPhysicalMaterial({ 
      color: 0xf8fafc, 
      roughness: 0.35, 
      sheen: 0.50,
      sheenColor: new THREE.Color(0xffffff),
      flatShading: false 
    });

    const clothRed = new THREE.MeshPhysicalMaterial({ 
      color: 0x991b1b, 
      roughness: 0.32, 
      sheen: 0.95,
      sheenColor: new THREE.Color(0xf43f5e),
      flatShading: false 
    });

    const clothNavy = new THREE.MeshPhysicalMaterial({ 
      color: 0x1e293b, 
      roughness: 0.40, 
      sheen: 0.80,
      sheenColor: new THREE.Color(0x38bdf8),
      flatShading: false 
    });

    // Peaux Lisses Veloutées Style Pixar (Subsurface Glow & Clearcoat léger)
    const skinToneJudge = new THREE.MeshPhysicalMaterial({ 
      color: 0xdfb496, 
      roughness: 0.65, 
      clearcoat: 0.00,
      clearcoatRoughness: 0.25,
      flatShading: false 
    });

    const skinToneWitness = new THREE.MeshPhysicalMaterial({ 
      color: 0xe0bca2, 
      roughness: 0.65, 
      clearcoat: 0.00,
      clearcoatRoughness: 0.20,
      flatShading: false 
    });

    const skinTonePros = new THREE.MeshPhysicalMaterial({ 
      color: 0xfce7d2, 
      roughness: 0.28, 
      clearcoat: 0.12,
      clearcoatRoughness: 0.20,
      flatShading: false 
    });

    const skinToneDef = new THREE.MeshPhysicalMaterial({ 
      color: 0xfed7aa, 
      roughness: 0.30, 
      clearcoat: 0.10,
      clearcoatRoughness: 0.20,
      flatShading: false 
    });

    const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15 });
    const eyePupil = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cheekBlushMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8, transparent: true, opacity: 0.28 });
    const metalDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.20, metalness: 0.88 });
    const ermineSpotMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.85 });

    // =========================================================================
    // 4. ARCHITECTURE COMPLÈTE & ENCEINTE FERMÉE DU TRIBUNAL
    // =========================================================================

    // Sol Parquet à chevrons verni
    const floorGeo = new THREE.PlaneGeometry(26, 26);
    const floor = new THREE.Mesh(floorGeo, floorParquet);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Mur de fond (Boîtes d'acajou et vitraux)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22, 11, 0.4), woodDarkOak);
    backWall.position.set(0, 5.5, -9.2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Murs latéraux (Salle d'audience close majestueuse)
    const wallSideGeo = new THREE.BoxGeometry(0.4, 11, 22);
    const leftWall = new THREE.Mesh(wallSideGeo, woodDarkOak);
    leftWall.position.set(-11, 5.5, 0.5);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallSideGeo, woodDarkOak);
    rightWall.position.set(11, 5.5, 0.5);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Mur arrière tribune du public avec double porte en acajou
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(22, 11, 0.4), woodDarkOak);
    frontWall.position.set(0, 5.5, 10.5);
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    const courtDoors = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.8, 0.5), woodMahogany);
    courtDoors.position.set(0, 2.9, 10.3);
    scene.add(courtDoors);

    // Poignées de portes en laiton
    for (let dx of [-0.3, 0.3]) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), brassMat);
      handle.position.set(dx, 2.8, 10.0);
      scene.add(handle);
    }

    // Plafond à caissons majestueux
    const ceilingGeo = new THREE.BoxGeometry(22, 0.4, 22);
    const ceiling = new THREE.Mesh(ceilingGeo, woodDarkOak);
    ceiling.position.set(0, 10.8, 0.5);
    scene.add(ceiling);

    // Poutres croisées des caissons de plafond
    for (let bx of [-6, 0, 6]) {
      const beamX = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 22), woodMahogany);
      beamX.position.set(bx, 10.5, 0.5);
      scene.add(beamX);
    }
    for (let bz of [-5, 0, 5]) {
      const beamZ = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 0.5), woodMahogany);
      beamZ.position.set(0, 10.5, bz);
      scene.add(beamZ);
    }

    // 3 Grands Lustres d'Audience en Cuivre et Verre chaud
    const chandelierPositions = [-4.5, 0, 4.5];
    chandelierPositions.forEach((cx) => {
      const chanGroup = new THREE.Group();
      chanGroup.position.set(cx, 8.8, 0.5);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8), brassMat);
      chain.position.y = 0.9;
      chanGroup.add(chain);

      const chanRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.06, 12, 32), brassMat);
      chanRing.rotation.x = Math.PI / 2;
      chanGroup.add(chanRing);

      // Ampoules / Bougies chaudes sur le pourtour
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfffbeb })
        );
        bulb.position.set(Math.cos(ang) * 0.85, 0.12, Math.sin(ang) * 0.85);
        chanGroup.add(bulb);
      }

      const chanLight = new THREE.PointLight(0xfef3c7, 0.75, 10);
      chanLight.position.set(0, 0, 0);
      chanGroup.add(chanLight);

      scene.add(chanGroup);
    });

    // Boiseries en relief (Wainscoting & Moldings)
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 0.5), woodMahogany);
    baseboard.position.set(0, 0.25, -9.0);
    scene.add(baseboard);

    const chairRail = new THREE.Mesh(new THREE.BoxGeometry(22, 0.2, 0.5), woodMahogany);
    chairRail.position.set(0, 3.2, -9.0);
    scene.add(chairRail);

    const goldFrieze = new THREE.Mesh(new THREE.BoxGeometry(22, 0.15, 0.45), goldMat);
    goldFrieze.position.set(0, 9.8, -9.0);
    scene.add(goldFrieze);

    // 3 Grands Vitraux Gothiques avec Rétro-éclairage
    const windowPositions = [-5.2, 0, 5.2];
    const windowColors = [0x0284c7, 0xf59e0b, 0xef4444];
    windowPositions.forEach((x, idx) => {
      const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.5, 0.2), woodMahogany);
      winFrame.position.set(x, 6.6, -9.0);
      scene.add(winFrame);

      const glassMat = new THREE.MeshBasicMaterial({
        color: windowColors[idx],
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide
      });
      const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.0), glassMat);
      glassPane.position.set(x, 6.6, -8.88);
      scene.add(glassPane);

      const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.0, 0.05), metalDark);
      mullionV.position.set(x, 6.6, -8.85);
      scene.add(mullionV);

      const mullionH1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.05), metalDark);
      mullionH1.position.set(x, 5.6, -8.85);
      scene.add(mullionH1);

      const mullionH2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.05), metalDark);
      mullionH2.position.set(x, 7.6, -8.85);
      scene.add(mullionH2);

      // Vitrail feutré sans faisceau additif aveuglant
    });

    // Texture du logo officiel HECh
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');

    // Grand Écusson de la Justice HECh au-dessus du Juge
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, 7.4, -8.95);

    const sealShield = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.12, 32), goldMat);
    sealShield.rotation.x = Math.PI / 2;
    sealGroup.add(sealShield);

    const sealInner = new THREE.Mesh(
      new THREE.CylinderGeometry(1.08, 1.08, 0.14, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35 })
    );
    sealInner.rotation.x = Math.PI / 2;
    sealGroup.add(sealInner);

    const sealLogoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.7),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    sealLogoMesh.position.set(0, 0, 0.08);
    sealGroup.add(sealLogoMesh);

    scene.add(sealGroup);

    // 4 Colonnes Corinthiennes en Marbre
    const colX = [-8.5, -4.5, 4.5, 8.5];
    colX.forEach((x) => {
      const colBase = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.7, 1.3), marblePillar);
      colBase.position.set(x, 0.35, -8.4);
      scene.add(colBase);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 9.2, 32), marblePillar);
      shaft.position.set(x, 5.1, -8.4);
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      scene.add(shaft);

      const colCapital = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.7, 1.3), marblePillar);
      colCapital.position.set(x, 9.9, -8.4);
      scene.add(colCapital);

      const capitalTrim = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.12, 1.34), goldMat);
      capitalTrim.position.set(x, 9.6, -8.4);
      scene.add(capitalTrim);
    });

    // Balustrade en bois séparant le Tribunal du Public
    const barRail = new THREE.Mesh(new THREE.BoxGeometry(20, 0.18, 0.25), woodMahogany);
    barRail.position.set(0, 1.25, 3.8);
    scene.add(barRail);

    const barBase = new THREE.Mesh(new THREE.BoxGeometry(20, 0.20, 0.30), woodMahogany);
    barBase.position.set(0, 0.10, 3.8);
    scene.add(barBase);

    // Balustres tournés
    for (let x = -9.2; x <= 9.2; x += 0.8) {
      if (Math.abs(x) < 1.2) continue; // Passage central ouvert
      const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.05, 16), woodMahogany);
      baluster.position.set(x, 0.65, 3.8);
      scene.add(baluster);
    }

    // =========================================================================
    // 5. ESTRADE & PUPITRE DU JUGE (AU FOND, SURÉLEVÉ)
    // =========================================================================
    const dais = new THREE.Mesh(new THREE.BoxGeometry(10, 0.9, 4.5), woodDarkOak);
    dais.position.set(0, 0.45, -5.8);
    dais.receiveShadow = true;
    scene.add(dais);

    // --- Asset Low-Poly Stylisé Studio (Blender 5.3) : Pupitre Biseauté & Accessoires ---
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/courtroom_bench_stylized.glb',
      (gltf) => {
        const stylizedBench = gltf.scene;
        stylizedBench.position.set(0, 0.90, -4.5);
        stylizedBench.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.3;
            }
          }
        });
        scene.add(stylizedBench);
        // Remplacer les volumes bruts par le modèle biseauté
        benchDesk.visible = false;
        benchTopTrim.visible = false;
        if (typeof soundBlock !== 'undefined') soundBlock.visible = false;
        if (typeof soundRing !== 'undefined') soundRing.visible = false;
        if (typeof book1 !== 'undefined') book1.visible = false;
        if (typeof book2 !== 'undefined') book2.visible = false;
      },
      undefined,
      (err) => {
        console.warn('Fallback au pupitre procédural:', err);
      }
    );

    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 1.8, -4.5);

    const benchDesk = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.5, 1.6), woodMahogany);
    benchDesk.castShadow = true;
    benchDesk.receiveShadow = true;
    benchGroup.add(benchDesk);

    const benchTopTrim = new THREE.Mesh(new THREE.BoxGeometry(5.3, 0.12, 1.7), goldMat);
    benchTopTrim.position.set(0, 0.76, 0);
    benchGroup.add(benchTopTrim);

    const nechPlaqueMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.65),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    nechPlaqueMesh.position.set(0, 0, 0.805);
    benchGroup.add(nechPlaqueMesh);

    scene.add(benchGroup);

    // Livres juridiques anciens
    const bookGeo = new THREE.BoxGeometry(0.45, 0.12, 0.32);
    const book1 = new THREE.Mesh(bookGeo, new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.6 }));
    book1.position.set(-1.8, 2.56, -4.2);
    scene.add(book1);
    const book2 = new THREE.Mesh(bookGeo, new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 }));
    book2.position.set(-1.8, 2.68, -4.2);
    book2.rotation.y = 0.1;
    scene.add(book2);

    // Bloc sonore en bois et bague de laiton pour frappe du marteau
    const soundBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.14, 24), woodMahogany);
    soundBlock.position.set(0.65, 2.57, -4.1);
    soundBlock.receiveShadow = true;
    scene.add(soundBlock);

    const soundRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 12, 32), brassMat);
    soundRing.position.set(0.65, 2.64, -4.1);
    soundRing.rotation.x = Math.PI / 2;
    scene.add(soundRing);

    // Anneau d'onde de choc pour l'impact du marteau
    const shockwave = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.35, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    shockwave.rotation.x = -Math.PI / 2;
    shockwave.position.set(0.65, 2.66, -4.1);
    scene.add(shockwave);
    shockwaveRef.current = shockwave;

    // Balance de la justice dorée complète
    const scaleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.65, 24), goldMat);
    scaleBase.position.set(-1.2, 2.85, -4.2);
    scene.add(scaleBase);
    const scaleBeam = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.04), goldMat);
    scaleBeam.position.set(-1.2, 3.2, -4.2);
    scene.add(scaleBeam);
    const pan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.04, 16), goldMat);
    pan1.position.set(-1.5, 2.95, -4.2);
    scene.add(pan1);
    const pan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.04, 16), goldMat);
    pan2.position.set(-0.9, 2.95, -4.2);
    scene.add(pan2);

    // Micro col de cygne avec LED rouge
    const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.45, 12), metalDark);
    micStem.position.set(0, 2.7, -3.9);
    micStem.rotation.x = 0.4;
    scene.add(micStem);
    const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), metalDark);
    micHead.position.set(0, 2.9, -3.8);
    scene.add(micHead);
    const micLed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    micLed.position.set(0, 2.87, -3.8);
    scene.add(micLed);

    // =========================================================================
    // 6. PERSONNAGE 3D SCULPTÉ : LE JUGE (Präsident de la Cour)
    // =========================================================================
    const judgeGroup = new THREE.Group();
    judgeGroup.position.set(0, 0.9, -5.2);

    // Corps & Toge Magistrale fluide (PBR MeshPhysicalMaterial)
    const judgeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.85, 1.7, 32), clothBlack);
    judgeBody.position.y = 1.6;
    judgeBody.castShadow = true;
    judgeGroup.add(judgeBody);

    // Étole centrale solennelle en velours cramoisi
    const judgeStole = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.45, 0.08), clothRed);
    judgeStole.position.set(0, 1.55, 0.50);
    judgeGroup.add(judgeStole);

    // Boutons dorés d'apparat
    for (let b = 0; b < 4; b++) {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16), goldMat);
      btn.position.set(0, 1.95 - b * 0.22, 0.55);
      btn.rotation.x = Math.PI / 2;
      judgeGroup.add(btn);
    }

    // Col d'Hermine blanc sculpté et pelucheux
    const ermineCollar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 24, 32), clothWhite);
    ermineCollar.position.set(0, 2.32, 0.12);
    ermineCollar.rotation.x = Math.PI / 2.3;
    judgeGroup.add(ermineCollar);

    for (let s = 0; s < 7; s++) {
      const angle = (s / 6) * Math.PI - Math.PI / 2;
      const spot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), ermineSpotMat);
      spot.position.set(Math.cos(angle) * 0.38, 2.32, 0.12 + Math.sin(angle) * 0.38 * 0.3);
      judgeGroup.add(spot);
    }

    // Rabat de Magistrat plissé en 3 volants
    const jabotGroup = new THREE.Group();
    jabotGroup.position.set(0, 1.95, 0.48);
    const jabot1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.24, 24, 1, false, -1.2, 2.4), clothWhite);
    jabot1.rotation.y = Math.PI;
    jabotGroup.add(jabot1);
    const jabot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.22, 24, 1, false, -1.2, 2.4), clothWhite);
    jabot2.position.set(0, -0.12, 0.04);
    jabot2.rotation.y = Math.PI;
    jabotGroup.add(jabot2);
    const jabot3 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, 0.18, 24, 1, false, -1.2, 2.4), clothWhite);
    jabot3.position.set(0, -0.24, 0.07);
    jabot3.rotation.y = Math.PI;
    jabotGroup.add(jabot3);
    judgeGroup.add(jabotGroup);

    // Collier d'or et Médaille officielle HECh
    const chainOfOffice = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.022, 16, 32), goldMat);
    chainOfOffice.position.set(0, 2.15, 0.18);
    chainOfOffice.rotation.x = Math.PI / 2.3;
    judgeGroup.add(chainOfOffice);

    const judgeMedal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.025, 24), goldMat);
    judgeMedal.position.set(0, 1.62, 0.58);
    judgeMedal.rotation.x = Math.PI / 2;
    judgeGroup.add(judgeMedal);
    const medalRelief = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 8, 20), brassMat);
    medalRelief.position.set(0, 1.62, 0.595);
    judgeGroup.add(medalRelief);

    // Tête du Juge sculptée et lissée
    const judgeHeadGroup = new THREE.Group();
    judgeHeadGroup.position.set(0, 2.85, 0);

    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 28), skinToneJudge);
    cranium.scale.set(1.0, 1.15, 1.05);
    judgeHeadGroup.add(cranium);

    const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.26, 32), skinToneJudge);
    jaw.position.set(0, -0.12, 0.04);
    judgeHeadGroup.add(jaw);

    // Perruque classique de magistrat blanche sculptée avec rouleaux latéraux
    const wigMat = new THREE.MeshStandardMaterial({ color: 0xa8adb5, roughness: 0.95 });
    const wigDome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 24), wigMat);
    wigDome.scale.set(1.08, 0.95, 1.12);
    wigDome.position.set(0, 0.15, -0.04);
    judgeHeadGroup.add(wigDome);

    // Rouleaux de perruque latéraux
    for (let side of [-1, 1]) {
      for (let r = 0; r < 3; r++) {
        const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.32, 16), wigMat);
        roll.position.set(side * 0.28, 0.05 - r * 0.10, -0.02);
        roll.rotation.z = side * 0.1;
        judgeHeadGroup.add(roll);
      }
    }

    // Yeux expressifs avec double catchlight Pixar
    const judgeEyes = [];
    for (let side of [-1, 1]) {
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), eyeWhite);
      eyeBall.position.set(side * 0.105, 0.04, 0.235);
      judgeHeadGroup.add(eyeBall);

      const eyeIris = new THREE.Mesh(new THREE.SphereGeometry(0.030, 16, 16), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.2 }));
      eyeIris.position.set(side * 0.105, 0.04, 0.262);
      judgeHeadGroup.add(eyeIris);

      const eyePup = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
      eyePup.position.set(side * 0.105, 0.04, 0.278);
      judgeHeadGroup.add(eyePup);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.105 + 0.009, 0.049, 0.286);
      judgeHeadGroup.add(glint);

      judgeEyes.push(eyeBall);
    }
    judgeEyesRef.current = judgeEyes;

    // Nez de magistrat digne
    const judgeNose = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.14, 16), skinToneJudge);
    judgeNose.position.set(0, -0.02, 0.28);
    judgeNose.rotation.x = 0.2;
    judgeHeadGroup.add(judgeNose);

    // Bouche articulée pour les répliques et l'exaspération
    const judgeMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x475569 })
    );
    judgeMouth.position.set(0, -0.16, 0.26);
    judgeHeadGroup.add(judgeMouth);
    judgeMouthRef.current = judgeMouth;

    // Sourcils mobiles
    const browGeo = new THREE.BoxGeometry(0.14, 0.04, 0.05);
    const browMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    const browL = new THREE.Mesh(browGeo, browMat);
    browL.position.set(-0.11, 0.14, 0.25);
    judgeHeadGroup.add(browL);
    judgeLeftBrowRef.current = browL;

    const browR = new THREE.Mesh(browGeo, browMat);
    browR.position.set(0.11, 0.14, 0.25);
    judgeHeadGroup.add(browR);
    judgeRightBrowRef.current = browR;

    judgeGroup.add(judgeHeadGroup);
    judgeHeadRef.current = judgeHeadGroup;

    // Bras droit articulé avec le Marteau de Justice
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.48, 1.9, 0.2);

    const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.48, 16), clothBlack);
    rUpperArm.position.set(0.12, -0.18, 0);
    rUpperArm.rotation.z = -0.3;
    rightArmGroup.add(rUpperArm);

    const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.42, 16), clothBlack);
    rForearm.position.set(0.24, -0.42, 0.12);
    rForearm.rotation.x = -Math.PI / 4;
    rightArmGroup.add(rForearm);

    const judgeRHand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), skinToneJudge);
    judgeRHand.position.set(0.24, -0.56, 0.28);
    rightArmGroup.add(judgeRHand);

    // Marteau de Justice en palissandre et laiton poli
    const malletHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.52, 16), woodMahogany);
    malletHandle.position.set(0.24, -0.52, 0.38);
    malletHandle.rotation.x = Math.PI / 2.8;
    rightArmGroup.add(malletHandle);

    const malletHead = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.24, 20), woodMahogany);
    malletHead.position.set(0.24, -0.38, 0.58);
    malletHead.rotation.z = Math.PI / 2;
    rightArmGroup.add(malletHead);

    const malletGoldRing = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.04, 20), goldMat);
    malletGoldRing.position.set(0.24, -0.38, 0.58);
    malletGoldRing.rotation.z = Math.PI / 2;
    rightArmGroup.add(malletGoldRing);

    judgeGroup.add(rightArmGroup);
    judgeArmRef.current = rightArmGroup;

    scene.add(judgeGroup);

    // =========================================================================
    // 7. BARRE DES TÉMOINS (AU CENTRE)
    // =========================================================================
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 1.2), woodMahogany);
    stand.position.set(0, 0.7, 0);
    stand.castShadow = true;
    stand.receiveShadow = true;
    scene.add(stand);

    const standMolding = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.08, 1.24), goldMat);
    standMolding.position.set(0, 1.35, 0);
    scene.add(standMolding);

    const standRail = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 2.3, 16), brassMat);
    standRail.position.set(0, 1.44, 0.55);
    standRail.rotation.z = Math.PI / 2;
    scene.add(standRail);

    const railBallL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), brassMat);
    railBallL.position.set(-1.15, 1.44, 0.55);
    scene.add(railBallL);
    const railBallR = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), brassMat);
    railBallR.position.set(1.15, 1.44, 0.55);
    scene.add(railBallR);

    for (let px of [-0.75, 0, 0.75]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12), brassMat);
      post.position.set(px, 1.35, 0.55);
      scene.add(post);
    }

    const witnessMic = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 12), metalDark);
    witnessMic.position.set(0, 1.50, 0.38);
    witnessMic.rotation.x = -0.32;
    scene.add(witnessMic);
    const witnessMicLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    witnessMicLed.position.set(0, 1.68, 0.45);
    scene.add(witnessMicLed);

    // =========================================================================
    // 8. PERSONNAGE 3D SCULPTÉ : MAXIME À LA BARRE
    // =========================================================================
    const witnessGroup = new THREE.Group();
    witnessGroup.position.set(0, 0, 0.72);
    witnessGroup.rotation.y = Math.PI; // Face au Juge

    // Sweat à capuche étudiant bleu canard doux
    const witBodyMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x0284c7, 
      roughness: 0.45, 
      sheen: 0.70,
      sheenColor: new THREE.Color(0x38bdf8),
      flatShading: false 
    });
    const witBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.31, 1.15, 32), witBodyMat);
    witBody.position.y = 1.35;
    witBody.castShadow = true;
    witnessGroup.add(witBody);

    // Épaules douces
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), witBodyMat);
    shoulderL.position.set(-0.35, 1.82, 0);
    witnessGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), witBodyMat);
    shoulderR.position.set(0.35, 1.82, 0);
    witnessGroup.add(shoulderR);

    // Capuche autour du cou
    const hoodCollar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.08, 16, 24), witBodyMat);
    hoodCollar.position.set(0, 1.94, -0.04);
    hoodCollar.rotation.x = Math.PI / 2.2;
    witnessGroup.add(hoodCollar);

    // Tête de Maxime
    const witHeadGroup = new THREE.Group();
    witHeadGroup.position.set(0, 2.25, 0);

    const witCranium = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 28), skinToneWitness);
    witCranium.scale.set(0.98, 1.14, 1.02);
    witHeadGroup.add(witCranium);

    // Joues douces rosées
    for (let side of [-1, 1]) {
      const blush = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), cheekBlushMat);
      blush.position.set(side * 0.16, -0.04, 0.20);
      witHeadGroup.add(blush);
    }

    // Yeux marron ambré de Maxime avec double étincelle
    const witEyes = [];
    for (let side of [-1, 1]) {
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), eyeWhite);
      eyeBall.position.set(side * 0.10, 0.03, 0.225);
      witHeadGroup.add(eyeBall);

      const eyeIris = new THREE.Mesh(new THREE.SphereGeometry(0.030, 16, 16), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.2 }));
      eyeIris.position.set(side * 0.10, 0.03, 0.252);
      witHeadGroup.add(eyeIris);

      const eyePup = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
      eyePup.position.set(side * 0.10, 0.03, 0.268);
      witHeadGroup.add(eyePup);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.10 + 0.008, 0.040, 0.276);
      witHeadGroup.add(glint);

      witEyes.push(eyeBall);
    }
    witnessEyesRef.current = witEyes;

    const witNose = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.032, 0.12, 16), skinToneWitness);
    witNose.position.set(0, -0.02, 0.27);
    witNose.rotation.x = 0.22;
    witHeadGroup.add(witNose);

    const witMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x991b1b })
    );
    witMouth.position.set(0, -0.12, 0.25);
    witHeadGroup.add(witMouth);
    witnessMouthRef.current = witMouth;

    // Sourcils
    const witBrowGeo = new THREE.BoxGeometry(0.14, 0.035, 0.05);
    const witBrowMat = new THREE.MeshStandardMaterial({ color: 0x3e2316, roughness: 0.8 });
    const witBrowL = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowL.position.set(-0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowL);
    witnessLeftBrowRef.current = witBrowL;

    const witBrowR = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowR.position.set(0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowR);
    witnessRightBrowRef.current = witBrowR;

    // Chevelure brune sculptée moderne et volumineuse
    const witHairMat = new THREE.MeshStandardMaterial({ color: 0x3e2316, roughness: 0.65 });
    const witHairDome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), witHairMat);
    witHairDome.scale.set(1.04, 0.88, 1.08);
    witHairDome.position.set(0, 0.14, -0.02);
    witHeadGroup.add(witHairDome);

    for (let m = 0; m < 5; m++) {
      const lock = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 16), witHairMat);
      lock.position.set(-0.14 + m * 0.07, 0.22 - Math.abs(m - 2) * 0.03, 0.22);
      lock.rotation.x = Math.PI / 3;
      lock.rotation.z = (m - 2) * 0.15;
      witHeadGroup.add(lock);
    }

    witnessGroup.add(witHeadGroup);
    witnessHeadRef.current = witHeadGroup;

    // Bras avec mains posées sur la rampe en laiton
    const witLeftArm = new THREE.Group();
    witLeftArm.position.set(-0.35, 1.82, 0);
    const lBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.50, 18), witBodyMat);
    lBicep.position.set(-0.06, -0.22, 0.09);
    lBicep.rotation.x = -Math.PI / 5;
    witLeftArm.add(lBicep);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), skinToneWitness);
    lHand.position.set(-0.06, -0.40, 0.17);
    witLeftArm.add(lHand);
    witnessGroup.add(witLeftArm);
    witnessLeftArmRef.current = witLeftArm;

    const witRightArm = new THREE.Group();
    witRightArm.position.set(0.35, 1.82, 0);
    const rBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.50, 18), witBodyMat);
    rBicep.position.set(0.06, -0.22, 0.09);
    rBicep.rotation.x = -Math.PI / 5;
    witRightArm.add(rBicep);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), skinToneWitness);
    rHand.position.set(0.06, -0.40, 0.17);
    witRightArm.add(rHand);
    witnessGroup.add(witRightArm);
    witnessRightArmRef.current = witRightArm;

    scene.add(witnessGroup);
    witnessRef.current = witnessGroup;

    // =========================================================================
    // 9. BANC DE LA DÉFENSE (ME ALEX / JOUEUR - À DROITE)
    // =========================================================================
    const defBench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 1.3), woodMahogany);
    defBench.position.set(4.6, 0.55, 0.5);
    defBench.rotation.y = -Math.PI / 6;
    scene.add(defBench);

    const defTablet = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.03, 0.36), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    defTablet.position.set(4.5, 1.15, 0.5);
    defTablet.rotation.y = -Math.PI / 6;
    scene.add(defTablet);

    const defGroup = new THREE.Group();
    defGroup.position.set(4.4, 0, -0.2);
    defGroup.rotation.y = -Math.PI / 6;

    const defLawyer = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.30, 1.25, 32), clothNavy);
    defLawyer.position.y = 1.38;
    defGroup.add(defLawyer);

    const defCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.12, 20), clothWhite);
    defCollar.position.set(0, 1.95, 0.06);
    defGroup.add(defCollar);

    const defTie = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.46, 0.04), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
    defTie.position.set(0, 1.68, 0.24);
    defGroup.add(defTie);

    const defHeadGroup = new THREE.Group();
    defHeadGroup.position.set(0, 2.24, 0);

    const defCranium = new THREE.Mesh(new THREE.SphereGeometry(0.23, 30, 24), skinToneDef);
    defCranium.scale.set(0.98, 1.15, 1.02);
    defHeadGroup.add(defCranium);

    const defHair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 30, 24), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }));
    defHair.scale.set(1.02, 0.86, 1.06);
    defHair.position.set(0, 0.12, -0.02);
    defHeadGroup.add(defHair);

    defGroup.add(defHeadGroup);
    defHeadRef.current = defHeadGroup;

    const defArmGroup = new THREE.Group();
    defArmGroup.position.set(-0.35, 1.75, 0.1);
    const defArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 18), clothNavy);
    defArmMesh.position.set(0, -0.3, 0);
    defArmGroup.add(defArmMesh);
    defGroup.add(defArmGroup);
    defArmRef.current = defArmGroup;

    scene.add(defGroup);

    // =========================================================================
    // 10. BANC DE L'ACCUSATION (PROCUREUR DU ROI - À GAUCHE)
    // =========================================================================
    const prosBench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 1.3), woodMahogany);
    prosBench.position.set(-4.6, 0.55, 0.5);
    prosBench.rotation.y = Math.PI / 6;
    scene.add(prosBench);

    const prosDossier = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.4), clothRed);
    prosDossier.position.set(-4.5, 1.18, 0.5);
    prosDossier.rotation.y = Math.PI / 6;
    scene.add(prosDossier);

    const prosGroup = new THREE.Group();
    prosGroup.position.set(-4.4, 0, -0.2);
    prosGroup.rotation.y = Math.PI / 6;

    const prosLawyer = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.31, 1.25, 32), clothBlack);
    prosLawyer.position.y = 1.38;
    prosGroup.add(prosLawyer);

    const prosStole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.05), clothRed);
    prosStole.position.set(0, 1.55, 0.24);
    prosGroup.add(prosStole);

    const prosHeadGroup = new THREE.Group();
    prosHeadGroup.position.set(0, 2.22, 0);

    const prosCranium = new THREE.Mesh(new THREE.SphereGeometry(0.23, 30, 24), skinTonePros);
    prosCranium.scale.set(0.96, 1.16, 1.02);
    prosHeadGroup.add(prosCranium);

    const prosJaw = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.22, 30), skinTonePros);
    prosJaw.position.set(0, -0.10, 0.03);
    prosHeadGroup.add(prosJaw);

    const prosHair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 30, 24), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.25 }));
    prosHair.scale.set(1.02, 0.88, 1.08);
    prosHair.position.set(0, 0.12, -0.02);
    prosHeadGroup.add(prosHair);

    for (let side of [-1, 1]) {
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 16), eyePupil);
      eyeBall.scale.set(1.2, 0.5, 1.0);
      eyeBall.position.set(side * 0.10, 0.05, 0.22);
      prosHeadGroup.add(eyeBall);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.10 + 0.008, 0.062, 0.235);
      prosHeadGroup.add(glint);
    }

    prosGroup.add(prosHeadGroup);
    prosHeadRef.current = prosHeadGroup;

    const prosArmGroup = new THREE.Group();
    prosArmGroup.position.set(0.35, 1.75, 0.1);
    const prosArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 18), clothBlack);
    prosArmMesh.position.set(0, -0.3, 0);
    prosArmGroup.add(prosArmMesh);
    prosGroup.add(prosArmGroup);
    prosArmRef.current = prosArmGroup;

    scene.add(prosGroup);

    // =========================================================================
    // 11. TRIBUNE DU PUBLIC (FOULE DE 12 SPECTATEURS RÉACTIFS)
    // =========================================================================
    const benchGeo = new THREE.BoxGeometry(16, 0.6, 1.1);
    const b1 = new THREE.Mesh(benchGeo, woodDarkOak);
    b1.position.set(0, 0.3, 5.4);
    scene.add(b1);

    const b2 = new THREE.Mesh(benchGeo, woodDarkOak);
    b2.position.set(0, 0.8, 7.2);
    scene.add(b2);

    const b3 = new THREE.Mesh(benchGeo, woodDarkOak);
    b3.position.set(0, 1.3, 9.0);
    scene.add(b3);

    const audiencePalette = [
      new THREE.MeshPhysicalMaterial({ color: 0x0284c7, roughness: 0.45, sheen: 0.7, flatShading: false }),
      new THREE.MeshPhysicalMaterial({ color: 0x7c3aed, roughness: 0.45, sheen: 0.7, flatShading: false }),
      new THREE.MeshPhysicalMaterial({ color: 0x059669, roughness: 0.45, sheen: 0.7, flatShading: false }),
      new THREE.MeshPhysicalMaterial({ color: 0xd97706, roughness: 0.45, sheen: 0.7, flatShading: false }),
      new THREE.MeshPhysicalMaterial({ color: 0xe11d48, roughness: 0.45, sheen: 0.7, flatShading: false }),
      new THREE.MeshPhysicalMaterial({ color: 0x475569, roughness: 0.45, sheen: 0.7, flatShading: false })
    ];

    const hairPalette = [
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 })
    ];

    const audienceSpecs = [
      { x: -5.2, z: 5.4, y: 0.6 },
      { x: -2.8, z: 5.4, y: 0.6 },
      { x: 2.8, z: 5.4, y: 0.6 },
      { x: 5.2, z: 5.4, y: 0.6 },
      { x: -6.0, z: 7.2, y: 1.1 },
      { x: -2.2, z: 7.2, y: 1.1 },
      { x: 2.2, z: 7.2, y: 1.1 },
      { x: 6.0, z: 7.2, y: 1.1 },
      { x: -4.8, z: 9.0, y: 1.6 },
      { x: -1.6, z: 9.0, y: 1.6 },
      { x: 1.6, z: 9.0, y: 1.6 },
      { x: 4.8, z: 9.0, y: 1.6 }
    ];

    audienceSpecs.forEach((spec, idx) => {
      const audGroup = new THREE.Group();
      audGroup.position.set(spec.x, spec.y, spec.z);

      const audMat = audiencePalette[idx % audiencePalette.length];
      const audBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.24, 0.85, 24), audMat);
      audBody.position.y = 0.45;
      audGroup.add(audBody);

      const audHeadGroup = new THREE.Group();
      audHeadGroup.position.y = 1.05;

      const audHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 20), skinToneWitness);
      audHeadGroup.add(audHead);

      const audHair = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 20), hairPalette[idx % hairPalette.length]);
      audHair.scale.set(1.02, 0.85, 1.06);
      audHair.position.set(0, 0.08, -0.02);
      audHeadGroup.add(audHair);

      audGroup.add(audHeadGroup);

      const leftArm = new THREE.Group();
      leftArm.position.set(-0.28, 0.75, 0);
      const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.48, 12), audMat);
      lArmMesh.position.set(0, -0.22, 0);
      leftArm.add(lArmMesh);
      audGroup.add(leftArm);

      const rightArm = new THREE.Group();
      rightArm.position.set(0.28, 0.75, 0);
      const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.48, 12), audMat);
      rArmMesh.position.set(0, -0.22, 0);
      rightArm.add(rArmMesh);
      audGroup.add(rightArm);

      scene.add(audGroup);

      audienceMembersRef.current.push({
        group: audGroup,
        head: audHeadGroup,
        leftArm,
        rightArm,
        baseY: spec.y,
        phase: idx * 0.7
      });
    });

    // =========================================================================
    // 12. BOUCLE DE RENDU 60 FPS & ANIMATION DYNAMIQUE
    // =========================================================================
    let clock = new THREE.Clock();
    let isGavelStriking = false;
    let gavelTimer = 0;
    let blinkTimer = 0;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Particules flottantes
      const positions = dustGeo.attributes.position.array;
      for (let i = 1; i < dustCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.002;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Clignement d'yeux naturel
      blinkTimer += delta;
      if (blinkTimer > 3.8) {
        const blinkScale = Math.max(0.1, Math.sin(elapsedTime * 20));
        judgeEyesRef.current.forEach(e => e.scale.y = blinkScale);
        witnessEyesRef.current.forEach(e => e.scale.y = blinkScale);
        if (blinkTimer > 4.1) {
          judgeEyesRef.current.forEach(e => e.scale.y = 1);
          witnessEyesRef.current.forEach(e => e.scale.y = 1);
          blinkTimer = 0;
        }
      }

      // Interpolation fluide de la caméra cinématique
      camera.position.lerp(targetCamPos.current, 0.045);
      currentCamLook.current.lerp(targetCamLook.current, 0.045);
      camera.lookAt(currentCamLook.current);

      // Animation de Maxime (Témoin)
      const curWitnessState = witnessStateRef.current;
      if (witnessHeadRef.current) {
        if (curWitnessState === 'speaking') {
          witnessHeadRef.current.rotation.x = Math.sin(elapsedTime * 4) * 0.06;
          witnessHeadRef.current.rotation.y = Math.sin(elapsedTime * 2) * 0.08;
          if (witnessMouthRef.current) {
            witnessMouthRef.current.scale.y = 1.0 + Math.sin(elapsedTime * 14) * 0.8;
          }
        } else if (curWitnessState === 'stressed') {
          witnessHeadRef.current.rotation.x = 0.12;
          witnessHeadRef.current.rotation.y = Math.sin(elapsedTime * 8) * 0.12;
          if (witnessLeftBrowRef.current && witnessRightBrowRef.current) {
            witnessLeftBrowRef.current.rotation.z = 0.28;
            witnessRightBrowRef.current.rotation.z = -0.28;
          }
        } else {
          witnessHeadRef.current.rotation.x = Math.sin(elapsedTime * 1.5) * 0.03;
          witnessHeadRef.current.rotation.y = 0;
          if (witnessMouthRef.current) witnessMouthRef.current.scale.y = 1.0;
        }
      }

      // Animation du Procureur
      const curProsState = prosecutorStateRef.current;
      if (prosArmRef.current) {
        if (curProsState === 'speaking' || curProsState === 'attacking') {
          prosArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 4) * 0.25;
          prosArmRef.current.rotation.z = Math.sin(elapsedTime * 3) * 0.15;
          if (prosHeadRef.current) {
            prosHeadRef.current.rotation.y = Math.sin(elapsedTime * 4) * 0.12;
          }
        } else {
          prosArmRef.current.rotation.x = 0;
          prosArmRef.current.rotation.z = 0;
        }
      }

      // Animation de la Défense (Me Alex)
      const curDefState = defenseStateRef.current;
      if (defArmRef.current) {
        if (curDefState === 'pleading') {
          defArmRef.current.rotation.x = -Math.PI / 3.2 + Math.sin(elapsedTime * 3.5) * 0.22;
          defArmRef.current.rotation.z = -Math.sin(elapsedTime * 2.5) * 0.18;
          if (defHeadRef.current) {
            defHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.10;
          }
        } else {
          defArmRef.current.rotation.x = 0;
          defArmRef.current.rotation.z = 0;
        }
      }

      // Réaction Faciale Précise du Juge (Sourire vs Moue vs Exaspération Gavel)
      const currentJudgeReaction = judgeReactionRef.current;
      const currentJudgeState = judgeStateRef.current;

      if (judgeHeadRef.current && judgeMouthRef.current) {
        if (currentJudgeState === 'gavel' || isGavelStriking) {
          // EXASPÉRATION DU JUGE : Sourcils froncés très bas, bouche grande ouverte rouge colère, secouement agacé
          judgeHeadRef.current.rotation.x = -0.12;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 18) * 0.14;
          judgeHeadRef.current.rotation.z = Math.sin(elapsedTime * 14) * 0.05;
          judgeMouthRef.current.position.y = -0.20;
          judgeMouthRef.current.scale.set(1.7, 2.3, 1);
          judgeMouthRef.current.material.color.setHex(0xdc2626);

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.08;
            judgeLeftBrowRef.current.rotation.z = -0.45;
            judgeRightBrowRef.current.position.y = 0.08;
            judgeRightBrowRef.current.rotation.z = 0.45;
          }
        } else if (currentJudgeReaction === 'smile') {
          judgeHeadRef.current.rotation.x = 0.12 + Math.sin(elapsedTime * 6) * 0.08;
          judgeHeadRef.current.rotation.y = 0;
          judgeHeadRef.current.rotation.z = 0;
          judgeMouthRef.current.position.y = -0.13 + Math.sin(elapsedTime * 4) * 0.01;
          judgeMouthRef.current.scale.set(1.4, 1.5, 1);
          judgeMouthRef.current.material.color.setHex(0x10b981);

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.17;
            judgeLeftBrowRef.current.rotation.z = 0.15;
            judgeRightBrowRef.current.position.y = 0.17;
            judgeRightBrowRef.current.rotation.z = -0.15;
          }
        } else if (currentJudgeReaction === 'frown') {
          judgeHeadRef.current.rotation.x = -0.08;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 10) * 0.22;
          judgeHeadRef.current.rotation.z = -0.06;
          judgeMouthRef.current.position.y = -0.18;
          judgeMouthRef.current.scale.set(1.1, 1.4, 1);
          judgeMouthRef.current.material.color.setHex(0xef4444);

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.10;
            judgeLeftBrowRef.current.rotation.z = -0.35;
            judgeRightBrowRef.current.position.y = 0.10;
            judgeRightBrowRef.current.rotation.z = 0.35;
          }
        } else {
          judgeHeadRef.current.rotation.set(0, 0, 0);
          judgeMouthRef.current.position.y = -0.16;
          judgeMouthRef.current.scale.set(1, 1, 1);
          judgeMouthRef.current.material.color.setHex(0x475569);
          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.14;
            judgeLeftBrowRef.current.rotation.z = 0;
            judgeRightBrowRef.current.position.y = 0.14;
            judgeRightBrowRef.current.rotation.z = 0;
          }
        }
      }

      // Animation du Juge et Frappe du Marteau (Triple frappe sèche et autoritaire "PAN ! PAN ! PAN !")
      if (judgeArmRef.current) {
        if (currentJudgeState === 'gavel' && !isGavelStriking) {
          isGavelStriking = true;
          gavelTimer = 0;
        }

        if (isGavelStriking) {
          gavelTimer += 0.045;
          const strikeCycle = Math.floor(gavelTimer / 0.45);
          const cycleProgress = (gavelTimer % 0.45) / 0.45;

          if (strikeCycle < 3) {
            if (cycleProgress < 0.48) {
              judgeArmRef.current.rotation.x = -Math.PI / 2.0 * (cycleProgress / 0.48);
            } else {
              judgeArmRef.current.rotation.x = 0.45;
              if (cycleProgress < 0.62 && shockwaveRef.current) {
                if (shockwaveRef.current.material.opacity < 0.25) {
                  shockwaveRef.current.material.opacity = 0.95;
                  shockwaveRef.current.scale.set(1 + strikeCycle * 0.35, 1 + strikeCycle * 0.35, 1 + strikeCycle * 0.35);
                  sounds.playGavelStrike();
                }
              }
            }
          }

          if (shockwaveRef.current) {
            shockwaveRef.current.scale.addScalar(0.06);
            shockwaveRef.current.material.opacity = Math.max(0, shockwaveRef.current.material.opacity - 0.04);
          }

          if (gavelTimer > 1.6) {
            isGavelStriking = false;
            judgeArmRef.current.rotation.x = 0;
            if (onGavelComplete) onGavelComplete();
          }
        } else {
          if (currentJudgeState === 'speaking') {
            judgeArmRef.current.rotation.x = -0.2 + Math.sin(elapsedTime * 3) * 0.08;
          } else {
            judgeArmRef.current.rotation.x = 0;
          }
        }
      }

      // Animation Dynamique du Public
      const curAudienceState = audienceStateRef.current;
      audienceMembersRef.current.forEach((spec) => {
        const p = spec.phase;
        if (curAudienceState === 'cheer') {
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY + 0.18, 0.12);
          spec.head.rotation.x = Math.sin(elapsedTime * 9 + p) * 0.14;
          spec.head.rotation.y = Math.sin(elapsedTime * 4 + p) * 0.10;
          spec.leftArm.rotation.x = -2.1 + Math.sin(elapsedTime * 14 + p) * 0.3;
          spec.rightArm.rotation.x = -2.1 + Math.sin(elapsedTime * 14 + p) * 0.3;
          spec.leftArm.rotation.z = 0.4 + Math.sin(elapsedTime * 14) * 0.25;
          spec.rightArm.rotation.z = -0.4 - Math.sin(elapsedTime * 14) * 0.25;
        } else if (curAudienceState === 'boo') {
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY, 0.1);
          spec.head.rotation.y = Math.sin(elapsedTime * 14 + p) * 0.35;
          spec.head.rotation.x = 0.15;
          spec.leftArm.rotation.x = -1.1 + Math.sin(elapsedTime * 8 + p) * 0.25;
          spec.rightArm.rotation.x = -1.1 + Math.sin(elapsedTime * 8 + p) * 0.25;
          spec.leftArm.rotation.z = -0.2;
          spec.rightArm.rotation.z = 0.2;
        } else if (curAudienceState === 'shout_maxime' || curAudienceState === 'uproar') {
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY + 0.36 + Math.sin(elapsedTime * 12 + p) * 0.05, 0.18);
          spec.head.rotation.x = -0.28;
          spec.head.rotation.y = Math.sin(elapsedTime * 8 + p) * 0.22;
          spec.rightArm.rotation.x = -2.7 + Math.sin(elapsedTime * 14 + p) * 0.5;
          spec.leftArm.rotation.x = -2.5 + Math.cos(elapsedTime * 14 + p) * 0.5;
          spec.rightArm.rotation.z = -0.3 + Math.sin(elapsedTime * 10) * 0.12;
          spec.leftArm.rotation.z = 0.3 - Math.sin(elapsedTime * 10) * 0.12;
        } else {
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY, 0.08);
          spec.head.rotation.x = Math.sin(elapsedTime * 2 + p) * 0.04;
          spec.head.rotation.y = Math.sin(elapsedTime * 1.5 + p) * 0.12;
          spec.leftArm.rotation.x = 0.35 + Math.sin(elapsedTime * 2 + p) * 0.05;
          spec.rightArm.rotation.x = 0.35 + Math.cos(elapsedTime * 2 + p) * 0.05;
          spec.leftArm.rotation.z = 0;
          spec.rightArm.rotation.z = 0;
        }
      });

      // Rendu via EffectComposer (Post-processing PBR Studio)
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // 13. Redimensionnement
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composerRef.current) composerRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 14. Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pmremGenerator.dispose();
      roomEnv.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Canvas WebGL Three.js PBR Studio */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Barre d'Outils Supérieure : Régie Caméra TV */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-lg text-xs font-mono text-cyan-300 font-bold">
            <Film className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>RÉGIE TV TRIBUNAL 3D</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 backdrop-blur-md">
            {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => {
                  sounds.playPop();
                  if (onCameraChange) onCameraChange(key);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                  cameraView === key
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={preset.label}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Studio PBR */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>RENDU PBR & BLOOM STUDIO · 60 FPS</span>
          </div>
        </div>
      </div>

      {/* Bulle / Cri du Public dynamique ou Injonction du Juge */}
      {audienceShoutText && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 animate-in zoom-in-95 pointer-events-none max-w-[94%] w-max">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-950/95 via-slate-950/95 to-amber-950/95 border-2 border-amber-400 text-amber-200 shadow-2xl backdrop-blur-md animate-pulse">
            <span className="text-2xl animate-bounce">📢</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-red-400 font-black uppercase">
                {audienceShoutText.includes('JUGE') || audienceShoutText.includes('Juge') ? "⚠️ RAPPEL À L'ORDRE DU JUGE" : "🔥 CLAMEUR DU PUBLIC DANS LA SALLE"}
              </span>
              <span className="text-sm sm:text-base font-black font-['Outfit'] tracking-wide text-amber-300 drop-shadow-md">
                {audienceShoutText}
              </span>
            </div>
            <span className="text-2xl animate-bounce delay-75">⚖️</span>
          </div>
        </div>
      )}
    </div>
  );
}
