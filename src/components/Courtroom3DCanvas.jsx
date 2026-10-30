import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, ZoomIn, Eye, Sparkles, Film, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import CharacterAvatar from './CharacterAvatar';
import { CANONICAL_CHARACTERS } from '../utils/charactersData';

// Générateur procédural de texture Parquet en chêne verni
function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2b160b';
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
      const rV = Math.floor(45 + shade * 25);
      const gV = Math.floor(22 + shade * 15);
      const bV = Math.floor(12 + shade * 10);
      ctx.fillStyle = `rgb(${rV}, ${gV}, ${bV})`;
      ctx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2);

      // Fibres fines de chêne
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
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

// Générateur procédural de texture Marbre pour colonnes corinthiennes
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f1ece1';
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineWidth = 2.2;
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(175, 150, 120, 0.4)' : 'rgba(130, 120, 110, 0.3)';
    ctx.beginPath();
    let x = (i * 65) % 512;
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

// Générateur procédural de texture Acajou pour pupitres et boiseries
function createMahoganyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#42160e';
  ctx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 3) {
    const alpha = (Math.sin(x * 0.18) * 0.5 + 0.5) * 0.22;
    ctx.fillStyle = `rgba(18, 5, 2, ${alpha})`;
    ctx.fillRect(x, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * Courtroom3DCanvas:
 * Moteur 3D temps réel Three.js pour le Grand Tribunal Académique (« L'IA à la Barre »).
 * Graphismes Haute Définition avec textures procédurales PBR :
 * - Sol en parquet de chêne lustré et verni, boiseries en acajou noble, colonnes en marbre veiné.
 * - Personnages expressifs : clignement naturel des yeux, synchronisation labiale des protagonistes lorsqu'ils parlent.
 * - Plans caméras serrés et immersifs type régie TV d'assises.
 * - Zéro artefact distrayant (aucun cube tournant au-dessus de la tête).
 */
export default function Courtroom3DCanvas({
  currentCaseIdx = 0,
  witnessState = 'idle',     // 'idle' | 'speaking' | 'stressed' | 'broken' | 'confident'
  prosecutorState = 'idle',  // 'idle' | 'speaking' | 'attacking'
  defenseState = 'idle',     // 'idle' | 'pleading'
  judgeState = 'idle',       // 'idle' | 'speaking' | 'gavel'
  judgeReaction = 'neutral', // 'neutral' | 'smile' | 'frown'
  audienceState = 'idle',    // 'idle' | 'cheer' | 'boo' | 'shout_maxime' | 'uproar'
  audienceShoutText = '',
  onGavelComplete,
  cameraView = 'TV_WIDE',    // 'TV_WIDE' | 'JUDGE' | 'WITNESS' | 'DEFENSE' | 'PROSECUTION' | 'AUDIENCE'
  onCameraChange
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);

  // References pour animations faciales, clignements et expressions
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
  const prosMouthRef = useRef(null);
  const prosEyesRef = useRef([]);

  const defArmRef = useRef(null);
  const defHeadRef = useRef(null);
  const shockwaveRef = useRef(null);
  const sweatParticlesRef = useRef([]);
  const audienceMembersRef = useRef([]);

  // Refs dynamiques pour l'animation à 60 FPS sans recréation du canvas
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

  // État de la caméra cible pour interpolation fluide (Lerp)
  const targetCamPos = useRef(new THREE.Vector3(0, 5.5, 11));
  const targetCamLook = useRef(new THREE.Vector3(0, 2.2, 0));
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const orbitAngles = useRef({ theta: 0, phi: 0.35 });

  // Configurations de caméra prédéfinies style régie TV (plans serrés et expressifs)
  const CAMERA_PRESETS = {
    TV_WIDE: { pos: [0, 5.2, 10.5], look: [0, 2.2, 0] },
    JUDGE: { pos: [0, 3.4, -2.4], look: [0, 3.8, -5.2] },
    WITNESS: { pos: [0, 2.2, 1.8], look: [0, 2.0, -0.65] },
    DEFENSE: { pos: [2.6, 2.4, 1.4], look: [4.4, 2.2, -0.2] },
    PROSECUTION: { pos: [-2.6, 2.4, 1.4], look: [-4.4, 2.2, -0.2] },
    AUDIENCE: { pos: [0, 2.5, 3.2], look: [0, 1.9, 7.8] } // Plan Caméra sur le Banc du Public
  };

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
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.032);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 11);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35; // Rendu chaud et vibrant style Pixar
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Éclairage Studio Cinéma Style Pixar (3-Points + Rebond Chaud au Sol)
    const ambientLight = new THREE.AmbientLight(0xfff1e6, 1.15);
    scene.add(ambientLight);

    // Key Light : Lumière dorée douce principale
    const keySpot = new THREE.SpotLight(0xfff7ed, 3.8);
    keySpot.position.set(3, 11, 7);
    keySpot.angle = Math.PI / 4.0;
    keySpot.penumbra = 0.75;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    keySpot.shadow.bias = -0.0001;
    keySpot.shadow.radius = 2.8; // Ombres douces veloutées Pixar
    scene.add(keySpot);

    // Kicker / Rim Light Gauche : Cyan studio vibrant pour détacher les silhouettes
    const rimCyan = new THREE.DirectionalLight(0x38bdf8, 2.4);
    rimCyan.position.set(-8, 7, -2);
    scene.add(rimCyan);

    // Kicker / Rim Light Droit : Rose ambré chaleureux
    const rimWarm = new THREE.DirectionalLight(0xf472b6, 1.4);
    rimWarm.position.set(8, 7, -2);
    scene.add(rimWarm);

    // Bounce Light Chaud au Sol : Rebond lumineux simulant la radiosité Pixar
    const floorBounce = new THREE.PointLight(0xfde68a, 1.6, 20);
    floorBounce.position.set(0, 0.8, 0);
    scene.add(floorBounce);

    // Spot or théâtral centré sur le Juge
    const judgeSpot = new THREE.SpotLight(0xfef08a, 2.8);
    judgeSpot.position.set(0, 9.5, -2.5);
    judgeSpot.target.position.set(0, 3.2, -4.8);
    judgeSpot.angle = Math.PI / 4.5;
    judgeSpot.penumbra = 0.6;
    scene.add(judgeSpot);
    scene.add(judgeSpot.target);

    // Halo d'atmosphère violacé en fond de scène
    const backFill = new THREE.PointLight(0xa78bfa, 1.8, 24);
    backFill.position.set(0, 6.5, -8.5);
    scene.add(backFill);

    // Particules de poussière atmosphérique en suspension
    const dustCount = 180;
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
      size: 0.055,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 3. Matériaux Partagés Haute Définition & Rendu PBR Style Pixar
    const parquetTex = createParquetTexture();
    const marbleTex = createMarbleTexture();
    const mahoganyTex = createMahoganyTexture();

    const woodMahogany = new THREE.MeshStandardMaterial({ 
      map: mahoganyTex, 
      roughness: 0.22, 
      metalness: 0.14 
    });
    const marblePillar = new THREE.MeshStandardMaterial({ 
      map: marbleTex, 
      roughness: 0.16, 
      metalness: 0.20 
    });
    const woodLight = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.30, metalness: 0.08 });
    const woodDarkOak = new THREE.MeshStandardMaterial({ 
      map: mahoganyTex, 
      color: 0x24120c, 
      roughness: 0.38, 
      metalness: 0.12 
    });
    const floorParquet = new THREE.MeshStandardMaterial({ 
      map: parquetTex, 
      roughness: 0.15, 
      metalness: 0.28 
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 });
    const clothBlack = new THREE.MeshStandardMaterial({ color: 0x0a0f1d, roughness: 0.82, metalness: 0.04 });
    const clothWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    const clothRed = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.24, metalness: 0.18 });
    const clothNavy = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.48, metalness: 0.12 });
    
    // Peaux soyeuses style Pixar (Subsurface scattering simulé)
    const skinToneJudge = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.48 });
    const skinToneWitness = new THREE.MeshStandardMaterial({ color: 0xfde2d0, roughness: 0.42 });
    const skinTonePros = new THREE.MeshStandardMaterial({ color: 0xfce7d2, roughness: 0.40 });
    const skinToneDef = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.45 });
    const skinTone = skinToneWitness;

    // Éléments oculaires Pixar (Blanc d'œil doux, Reflets cornéens scintillants, Joues rosées)
    const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15 });
    const eyePupil = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Étincelle de vie Pixar
    const cheekBlushMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8, transparent: true, opacity: 0.28 });
    const glassLensMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35 });

    const eyeIrisJudge = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.25 });
    const eyeIrisWitness = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.25 });
    const metalDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.20, metalness: 0.88 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.18, metalness: 0.94 });
    const velvetRed = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.68, metalness: 0.08 });
    const ermineSpotMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.85 });

    // 4. Architecture de la Salle d'Audience
    // Sol Parquet à chevrons verni
    const floorGeo = new THREE.PlaneGeometry(26, 26);
    const floor = new THREE.Mesh(floorGeo, floorParquet);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Mur de fond avec boiseries et fenêtres gothiques
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22, 11, 0.4), woodDarkOak);
    backWall.position.set(0, 5.5, -9);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Boiseries en relief (Wainscoting & Moldings)
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 0.5), woodMahogany);
    baseboard.position.set(0, 0.25, -8.8);
    scene.add(baseboard);

    const chairRail = new THREE.Mesh(new THREE.BoxGeometry(22, 0.2, 0.5), woodMahogany);
    chairRail.position.set(0, 3.2, -8.8);
    scene.add(chairRail);

    const goldFrieze = new THREE.Mesh(new THREE.BoxGeometry(22, 0.15, 0.45), goldMat);
    goldFrieze.position.set(0, 9.8, -8.8);
    scene.add(goldFrieze);

    // 3 Grands Vitraux Gothiques en Arches avec Rétro-Éclairage
    const windowPositions = [-5.2, 0, 5.2];
    const windowColors = [0x0284c7, 0xf59e0b, 0xef4444];
    windowPositions.forEach((x, idx) => {
      // Cadre de fenêtre en arche
      const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.5, 0.2), woodMahogany);
      winFrame.position.set(x, 6.6, -8.8);
      scene.add(winFrame);

      // Panneau de vitrail coloré et lumineux
      const glassMat = new THREE.MeshBasicMaterial({
        color: windowColors[idx],
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.0), glassMat);
      glassPane.position.set(x, 6.6, -8.68);
      scene.add(glassPane);

      // Tracery / Meneaux en croix du vitrail
      const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.0, 0.05), metalDark);
      mullionV.position.set(x, 6.6, -8.65);
      scene.add(mullionV);

      const mullionH1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.05), metalDark);
      mullionH1.position.set(x, 5.6, -8.65);
      scene.add(mullionH1);

      const mullionH2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.05), metalDark);
      mullionH2.position.set(x, 7.6, -8.65);
      scene.add(mullionH2);

      // Faisceau volumétrique de soleil coloré style Pixar
      const beamMat = new THREE.MeshBasicMaterial({
        color: windowColors[idx],
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 2.4, 10.5, 24), beamMat);
      beam.position.set(x * 0.85, 4.2, -4.2);
      beam.rotation.x = Math.PI / 4.8;
      scene.add(beam);
    });

    // Texture du logo officiel HECh (PNG transparent haute fidélité)
    const textureLoader = new THREE.TextureLoader();
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');

    // Grand Écusson de la Justice HECh au-dessus du Juge
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, 9.2, -8.6);
    const sealBack = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.08, 32), goldMat);
    sealBack.rotation.x = Math.PI / 2;
    sealGroup.add(sealBack);

    // Blason officiel HECh carré au cœur du sceau de justice
    const sealLogoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 1.3),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    sealLogoMesh.position.z = 0.05;
    sealGroup.add(sealLogoMesh);

    // Relief balance de la justice sous le blason
    const sealPillar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.06), metalDark);
    sealPillar.position.y = -0.3;
    sealGroup.add(sealPillar);
    scene.add(sealGroup);

    // 4 Colonnes Corinthiennes en Marbre Blanc Veiné
    for (let x of [-7.5, -2.8, 2.8, 7.5]) {
      const colGroup = new THREE.Group();
      colGroup.position.set(x, 4.8, -8.5);

      // Socle carré en marbre
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.0), marblePillar);
      plinth.position.y = -4.5;
      colGroup.add(plinth);

      // Fût cannelé en marbre veiné
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.40, 8.8, 24), marblePillar);
      colGroup.add(shaft);

      // Chapiteau sculpté avec anneaux dorés
      const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.38, 0.4, 24), marblePillar);
      cap1.position.y = 4.4;
      colGroup.add(cap1);
      const capGold = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 8, 24), goldMat);
      capGold.position.y = 4.3;
      capGold.rotation.x = Math.PI / 2;
      colGroup.add(capGold);

      scene.add(colGroup);
    }

    // Balustrade du Public à l'arrière avec cordes de velours
    const galleryRailing = new THREE.Mesh(new THREE.BoxGeometry(20, 0.9, 0.15), woodMahogany);
    galleryRailing.position.set(0, 0.45, 6.2);
    scene.add(galleryRailing);

    // Potelets en laiton et corde de velours rouge
    for (let x of [-6, -3, 3, 6]) {
      const stanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.1, 12), brassMat);
      stanchion.position.set(x, 0.55, 6.1);
      scene.add(stanchion);
      const stanchionTop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), brassMat);
      stanchionTop.position.set(x, 1.12, 6.1);
      scene.add(stanchionTop);
    }
    const velvetRope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 12, 8), velvetRed);
    velvetRope.position.set(0, 0.95, 6.1);
    velvetRope.rotation.z = Math.PI / 2;
    scene.add(velvetRope);

    // =========================================================================
    // 4b. GRADINS & PUBLIC D'AUDIENCE DU TRIBUNAL (12 Spectateurs Expressifs)
    // =========================================================================
    // Gradin Rangée 1 (Élévation 0.35m)
    const tier1Platform = new THREE.Mesh(new THREE.BoxGeometry(17, 0.40, 1.4), woodDarkOak);
    tier1Platform.position.set(0, 0.20, 7.1);
    tier1Platform.receiveShadow = true;
    scene.add(tier1Platform);

    const bench1 = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.45, 0.48), woodMahogany);
    bench1.position.set(0, 0.62, 7.1);
    scene.add(bench1);

    const backrest1 = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.55, 0.08), woodMahogany);
    backrest1.position.set(0, 1.05, 7.32);
    scene.add(backrest1);

    // Gradin Rangée 2 (Élévation 0.85m)
    const tier2Platform = new THREE.Mesh(new THREE.BoxGeometry(17, 0.85, 1.6), woodDarkOak);
    tier2Platform.position.set(0, 0.425, 8.5);
    tier2Platform.receiveShadow = true;
    scene.add(tier2Platform);

    const bench2 = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.45, 0.48), woodMahogany);
    bench2.position.set(0, 1.08, 8.5);
    scene.add(bench2);

    const backrest2 = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.55, 0.08), woodMahogany);
    backrest2.position.set(0, 1.52, 8.72);
    scene.add(backrest2);

    // Palette variée pour le public (vêtements et coiffures)
    const crowdClothMats = [
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.6 }), // Vert émeraude
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 }), // Rouge bordeaux
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }), // Moutarde
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 }), // Bleu
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.6 }), // Violet
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })  // Cyan
    ];
    const crowdHairMats = [
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }), // Noir
      new THREE.MeshStandardMaterial({ color: 0x451a14, roughness: 0.8 }), // Châtain
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 }), // Roux
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })  // Blond
    ];

    const audienceMembers = [];
    const spectatorPositions = [
      // Rangée 1 (devant)
      { x: -5.2, z: 7.0, baseY: 0.85 },
      { x: -3.1, z: 7.0, baseY: 0.85 },
      { x: -1.0, z: 7.0, baseY: 0.85 },
      { x: 1.0, z: 7.0, baseY: 0.85 },
      { x: 3.1, z: 7.0, baseY: 0.85 },
      { x: 5.2, z: 7.0, baseY: 0.85 },
      // Rangée 2 (arrière surélevée)
      { x: -4.5, z: 8.4, baseY: 1.30 },
      { x: -2.3, z: 8.4, baseY: 1.30 },
      { x: -0.2, z: 8.4, baseY: 1.30 },
      { x: 1.9, z: 8.4, baseY: 1.30 },
      { x: 3.8, z: 8.4, baseY: 1.30 },
      { x: 5.6, z: 8.4, baseY: 1.30 },
    ];

    spectatorPositions.forEach((pos, idx) => {
      const specGroup = new THREE.Group();
      specGroup.position.set(pos.x, pos.baseY, pos.z);

      const clothMat = crowdClothMats[idx % crowdClothMats.length];
      const hairMat = crowdHairMats[idx % crowdHairMats.length];
      const skinMat = idx % 3 === 0 ? skinToneWitness : idx % 3 === 1 ? skinToneJudge : skinTonePros;

      // Torso assis sculpté
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.20, 0.65, 16), clothMat);
      torso.position.y = 0.32;
      specGroup.add(torso);

      // Épaules
      const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 12), clothMat);
      shoulderL.position.set(-0.25, 0.58, 0);
      specGroup.add(shoulderL);
      const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 12), clothMat);
      shoulderR.position.set(0.25, 0.58, 0);
      specGroup.add(shoulderR);

      // Tête sculptée
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.82, 0);
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 18), skinMat);
      cranium.scale.set(0.98, 1.15, 1.02);
      headGroup.add(cranium);

      // Cheveux
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 18), hairMat);
      hair.scale.set(1.02, 0.85, 1.06);
      hair.position.set(0, 0.08, -0.02);
      headGroup.add(hair);

      // Yeux et étincelles cornéennes style Pixar pour chaque spectateur
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), eyeWhite);
      eyeL.position.set(-0.06, 0.03, 0.15);
      headGroup.add(eyeL);
      const glintSpecL = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), eyeGlintMat);
      glintSpecL.position.set(-0.054, 0.038, 0.172);
      headGroup.add(glintSpecL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), eyeWhite);
      eyeR.position.set(0.06, 0.03, 0.15);
      headGroup.add(eyeR);
      const glintSpecR = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), eyeGlintMat);
      glintSpecR.position.set(0.066, 0.038, 0.172);
      headGroup.add(glintSpecR);

      // Bouche expressive sculptée
      const mouthSpec = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), new THREE.MeshBasicMaterial({ color: 0x881337 }));
      mouthSpec.position.set(0, -0.05, 0.15);
      headGroup.add(mouthSpec);

      specGroup.add(headGroup);

      // Bras gauche articulé (Pivot à l'épaule)
      const leftArmGroup = new THREE.Group();
      leftArmGroup.position.set(-0.25, 0.58, 0);
      const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.42, 12), clothMat);
      lArm.position.set(0, -0.20, 0.08);
      lArm.rotation.x = 0.35;
      leftArmGroup.add(lArm);
      const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), skinMat);
      lHand.position.set(0, -0.40, 0.16);
      leftArmGroup.add(lHand);
      specGroup.add(leftArmGroup);

      // Bras droit articulé (Pivot à l'épaule)
      const rightArmGroup = new THREE.Group();
      rightArmGroup.position.set(0.25, 0.58, 0);
      const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.42, 12), clothMat);
      rArm.position.set(0, -0.20, 0.08);
      rArm.rotation.x = 0.35;
      rightArmGroup.add(rArm);
      const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), skinMat);
      rHand.position.set(0, -0.40, 0.16);
      rightArmGroup.add(rHand);
      specGroup.add(rightArmGroup);

      scene.add(specGroup);
      audienceMembers.push({
        group: specGroup,
        head: headGroup,
        leftArm: leftArmGroup,
        rightArm: rightArmGroup,
        baseY: pos.baseY,
        phase: (idx * 1.3) % 10
      });
    });
    audienceMembersRef.current = audienceMembers;

    // 5. Estrade Surélevée & Pupitre Magistral du Juge
    const dais = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.9, 3.4), woodDarkOak);
    dais.position.set(0, 0.45, -4.8);
    dais.receiveShadow = true;
    scene.add(dais);

    // Pupitre Principal avec panneaux d'armoiries en bas-relief
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 1.7, -4.5);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.6, 1.4), woodMahogany);
    bench.castShadow = true;
    bench.receiveShadow = true;
    benchGroup.add(bench);

    // Panneaux sculptés sur la façade du pupitre
    for (let bx of [-1.8, -0.6, 0.6, 1.8]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.08), woodDarkOak);
      panel.position.set(bx, 0, 0.72);
      benchGroup.add(panel);
    }

    // Plaque officielle dorée HECh sur la façade centrale du pupitre du Juge
    const hechPlaqueBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.04), goldMat);
    hechPlaqueBase.position.set(0, 0, 0.77);
    benchGroup.add(hechPlaqueBase);

    const hechPlaqueMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.76, 0.76),
      new THREE.MeshBasicMaterial({ map: hechLogoTex, transparent: true })
    );
    hechPlaqueMesh.position.set(0, 0, 0.795);
    benchGroup.add(hechPlaqueMesh);

    scene.add(benchGroup);

    // Livres juridiques anciens reliés cuir rouge/or sur le pupitre du juge
    const bookGeo = new THREE.BoxGeometry(0.45, 0.12, 0.32);
    const bookMat1 = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.6 });
    const book1 = new THREE.Mesh(bookGeo, bookMat1);
    book1.position.set(-1.8, 2.56, -4.2);
    scene.add(book1);
    const bookMat2 = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const book2 = new THREE.Mesh(bookGeo, bookMat2);
    book2.position.set(-1.8, 2.68, -4.2);
    book2.rotation.y = 0.1;
    scene.add(book2);

    // Bloc sonore en bois et bague de laiton pour frappe du marteau
    const soundBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.14, 16), woodLight);
    soundBlock.position.set(0.65, 2.57, -4.1);
    soundBlock.receiveShadow = true;
    scene.add(soundBlock);

    const soundRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 24), brassMat);
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

    // Balance de la justice dorée complète sur le pupitre
    const scaleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.65, 16), goldMat);
    scaleBase.position.set(-1.2, 2.85, -4.2);
    scene.add(scaleBase);
    const scaleBeam = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.04), goldMat);
    scaleBeam.position.set(-1.2, 3.2, -4.2);
    scene.add(scaleBeam);
    // Plateaux suspendus
    const pan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.04, 12), goldMat);
    pan1.position.set(-1.5, 2.95, -4.2);
    scene.add(pan1);
    const pan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.04, 12), goldMat);
    pan2.position.set(-0.9, 2.95, -4.2);
    scene.add(pan2);

    // Micro col de cygne avec bague LED rouge active
    const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.45, 8), metalDark);
    micStem.position.set(0, 2.7, -3.9);
    micStem.rotation.x = 0.4;
    scene.add(micStem);
    const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), metalDark);
    micHead.position.set(0, 2.9, -3.8);
    scene.add(micHead);
    const micLed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.015, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    micLed.position.set(0, 2.87, -3.8);
    scene.add(micLed);

    // =========================================================================
    // 6. PERSONNAGE 3D SCULPTÉ HAUTE DÉFINITION : LE JUGE (Président du Tribunal)
    // =========================================================================
    const judgeGroup = new THREE.Group();
    judgeGroup.position.set(0, 0.9, -5.2);

    // Corps & Toge Magistrale fluide à 32 facettes (Pleats & Drapery)
    const judgeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.85, 1.7, 32), clothBlack);
    judgeBody.position.y = 1.6;
    judgeBody.castShadow = true;
    judgeGroup.add(judgeBody);

    // Étole centrale solennelle en velours cramoisi
    const judgeStole = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.45, 0.08), clothRed);
    judgeStole.position.set(0, 1.55, 0.50);
    judgeGroup.add(judgeStole);

    // Boutons dorés d'apparat sur l'étole
    for (let b = 0; b < 4; b++) {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16), goldMat);
      btn.position.set(0, 1.95 - b * 0.22, 0.55);
      btn.rotation.x = Math.PI / 2;
      judgeGroup.add(btn);
    }

    // Col d'Hermine blanc sculpté et arrondi (Torus pelucheux)
    const ermineCollar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 20, 32), clothWhite);
    ermineCollar.position.set(0, 2.32, 0.12);
    ermineCollar.rotation.x = Math.PI / 2.3;
    judgeGroup.add(ermineCollar);

    // Mouchetures d'hermine noires cousues dans la fourrure
    for (let s = 0; s < 7; s++) {
      const angle = (s / 6) * Math.PI - Math.PI / 2;
      const spot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), ermineSpotMat);
      spot.position.set(Math.cos(angle) * 0.38, 2.32, 0.12 + Math.sin(angle) * 0.38 * 0.3);
      judgeGroup.add(spot);
    }

    // Rabat de Magistrat (Jabot plissé blanc en 3 volants étagés)
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

    // Collier d'or magistral et Médaille officielle de la Haute École
    const chainOfOffice = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.022, 12, 32), goldMat);
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

    // ==========================================
    // TÊTE DU JUGE HAUTE POLYGONE & SCULPTÉE
    // ==========================================
    const judgeHeadGroup = new THREE.Group();
    judgeHeadGroup.position.set(0, 2.85, 0);

    // Crâne arrondi et expressif
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 24), skinToneJudge);
    cranium.scale.set(1.0, 1.15, 1.05);
    judgeHeadGroup.add(cranium);

    // Mâchoire et bajoues solennelles de magistrat
    const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.26, 32), skinToneJudge);
    jaw.position.set(0, -0.12, 0.04);
    judgeHeadGroup.add(jaw);

    // Menton affirmé sculpté
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), skinToneJudge);
    chin.position.set(0, -0.22, 0.22);
    judgeHeadGroup.add(chin);

    // Cou naturel
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 24), skinToneJudge);
    neck.position.set(0, -0.28, 0);
    judgeHeadGroup.add(neck);

    // Nez magistral sculpté (arête effilée + bulbe + narines)
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.042, 0.16, 16), skinToneJudge);
    noseBridge.position.set(0, 0.03, 0.28);
    noseBridge.rotation.x = 0.22;
    judgeHeadGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 16), skinToneJudge);
    noseTip.position.set(0, -0.04, 0.32);
    judgeHeadGroup.add(noseTip);

    const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), skinToneJudge);
    nostrilL.position.set(-0.032, -0.05, 0.30);
    judgeHeadGroup.add(nostrilL);
    const nostrilR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), skinToneJudge);
    nostrilR.position.set(0.032, -0.05, 0.30);
    judgeHeadGroup.add(nostrilR);

    // Yeux expressifs haute fidélité (Blanc + Iris noisette/bleu + Pupille + Étincelle de vie Pixar)
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.046, 20, 20), eyeWhite);
    eyeL.position.set(-0.12, 0.07, 0.24);
    judgeHeadGroup.add(eyeL);
    const irisL = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.012, 20), eyeIrisJudge);
    irisL.position.set(-0.12, 0.07, 0.28);
    irisL.rotation.x = Math.PI / 2;
    judgeHeadGroup.add(irisL);
    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
    pupilL.position.set(-0.12, 0.07, 0.288);
    judgeHeadGroup.add(pupilL);
    const glintL = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
    glintL.position.set(-0.112, 0.082, 0.295);
    judgeHeadGroup.add(glintL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.046, 20, 20), eyeWhite);
    eyeR.position.set(0.12, 0.07, 0.24);
    judgeHeadGroup.add(eyeR);
    const irisR = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.012, 20), eyeIrisJudge);
    irisR.position.set(0.12, 0.07, 0.28);
    irisR.rotation.x = Math.PI / 2;
    judgeHeadGroup.add(irisR);
    const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
    pupilR.position.set(0.12, 0.07, 0.288);
    judgeHeadGroup.add(pupilR);
    const glintR = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
    glintR.position.set(0.128, 0.082, 0.295);
    judgeHeadGroup.add(glintR);
    judgeEyesRef.current = [eyeL, irisL, pupilL, glintL, eyeR, irisR, pupilR, glintR];

    // Pommettes chaleureuses style Pixar (Blush doux)
    const judgeBlushL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), cheekBlushMat);
    judgeBlushL.position.set(-0.16, -0.04, 0.23);
    judgeHeadGroup.add(judgeBlushL);
    const judgeBlushR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), cheekBlushMat);
    judgeBlushR.position.set(0.16, -0.04, 0.23);
    judgeHeadGroup.add(judgeBlushR);

    // Lunettes demi-lunes dorées fines (Torus haute résolution + Verres translucides + Pont courbé)
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.06, 0.28);
    const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.007, 16, 28), goldMat);
    rimL.position.x = -0.12;
    glassesGroup.add(rimL);
    const lensL = new THREE.Mesh(new THREE.CircleGeometry(0.060, 20), glassLensMat);
    lensL.position.x = -0.12;
    glassesGroup.add(lensL);

    const rimR = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.007, 16, 28), goldMat);
    rimR.position.x = 0.12;
    glassesGroup.add(rimR);
    const lensR = new THREE.Mesh(new THREE.CircleGeometry(0.060, 20), glassLensMat);
    lensR.position.x = 0.12;
    glassesGroup.add(lensR);
    const gBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.08, 12), goldMat);
    gBridge.rotation.z = Math.PI / 2;
    glassesGroup.add(gBridge);
    const templeL = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.24, 8), goldMat);
    templeL.position.set(-0.19, 0, -0.11);
    templeL.rotation.x = Math.PI / 2;
    glassesGroup.add(templeL);
    const templeR = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.24, 8), goldMat);
    templeR.position.set(0.19, 0, -0.11);
    templeR.rotation.x = Math.PI / 2;
    glassesGroup.add(templeR);
    judgeHeadGroup.add(glassesGroup);

    // Sourcils sculptés articulés (réagissent en direct au sourire / froncement)
    const browGeo = new THREE.BoxGeometry(0.16, 0.038, 0.06);
    const browMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const browL = new THREE.Mesh(browGeo, browMat);
    browL.position.set(-0.12, 0.15, 0.27);
    judgeHeadGroup.add(browL);
    judgeLeftBrowRef.current = browL;

    const browR = new THREE.Mesh(browGeo, browMat);
    browR.position.set(0.12, 0.15, 0.27);
    judgeHeadGroup.add(browR);
    judgeRightBrowRef.current = browR;

    // Bouche expressive articulée (Sourire approbateur vert vs Moue réprobatrice rouge)
    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.044, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x475569 })
    );
    mouth.position.set(0, -0.15, 0.28);
    judgeHeadGroup.add(mouth);
    judgeMouthRef.current = mouth;

    // =========================================================================
    // GRANDE PERRUQUE BAROQUE ÉTAGÉE À 10 ROULEAUX DE BOUCLES (HAUTE POLYGONE)
    // =========================================================================
    const wigGroup = new THREE.Group();
    wigGroup.position.set(0, 0.16, -0.03);

    // Calotte crânienne de la perruque
    const wigDome = new THREE.Mesh(new THREE.SphereGeometry(0.33, 32, 24), clothWhite);
    wigDome.scale.set(1.06, 0.88, 1.12);
    wigGroup.add(wigDome);

    // Rouleaux de boucles volumineux sur le front
    for (let f = 0; f < 3; f++) {
      const fCurl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.18, 16), clothWhite);
      fCurl.position.set(-0.16 + f * 0.16, 0.18, 0.26);
      fCurl.rotation.z = Math.PI / 2;
      wigGroup.add(fCurl);
    }

    // 10 Rouleaux de boucles tombants (5 de chaque côté, étagés élégamment)
    for (let r = 0; r < 5; r++) {
      const curlL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.050, 0.36, 16), clothWhite);
      curlL.position.set(-0.33 - (r % 2) * 0.04, 0.08 - r * 0.14, 0.06 - (r > 2 ? 0.06 : 0));
      curlL.rotation.z = 0.08;
      wigGroup.add(curlL);
      const capL = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), clothWhite);
      capL.position.set(curlL.position.x, curlL.position.y - 0.18, curlL.position.z);
      wigGroup.add(capL);

      const curlR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.050, 0.36, 16), clothWhite);
      curlR.position.set(0.33 + (r % 2) * 0.04, 0.08 - r * 0.14, 0.06 - (r > 2 ? 0.06 : 0));
      curlR.rotation.z = -0.08;
      wigGroup.add(curlR);
      const capR = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), clothWhite);
      capR.position.set(curlR.position.x, curlR.position.y - 0.18, curlR.position.z);
      wigGroup.add(capR);
    }

    // Boucles à l'arrière du cou
    for (let b = 0; b < 4; b++) {
      const bCurl = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.045, 0.38, 14), clothWhite);
      bCurl.position.set(-0.21 + b * 0.14, -0.12, -0.28);
      wigGroup.add(bCurl);
    }

    judgeHeadGroup.add(wigGroup);

    // Anneau d'émotion lumineux réactif (Approbation verte vs Avertissement rouge)
    const emoRing = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.30, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    emoRing.position.set(0, 0.72, 0.1);
    judgeHeadGroup.add(emoRing);
    judgeEmoRingRef.current = emoRing;

    judgeGroup.add(judgeHeadGroup);
    judgeHeadRef.current = judgeHeadGroup;

    // Bras Droit Articulé avec Marteau de Justice (Gavel)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.65, 2.2, 0);

    // Épaule arrondie
    const judgeShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), clothBlack);
    rightArmGroup.add(judgeShoulder);

    // Manche de toge fluide
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.65, 20), clothBlack);
    arm.position.set(0, -0.3, 0);
    rightArmGroup.add(arm);

    // Poignet en dentelle blanche
    const wristLace = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.08, 18), clothWhite);
    wristLace.position.set(0, -0.58, 0.04);
    rightArmGroup.add(wristLace);

    // Main sculptée tenant le marteau
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), skinToneJudge);
    hand.position.set(0, -0.65, 0.1);
    rightArmGroup.add(hand);

    // Marteau de Justice sculpté avec virole dorée et manche en bois précieux
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.58, 16), woodLight);
    handle.position.set(0, -0.6, 0.24);
    handle.rotation.x = Math.PI / 4;
    rightArmGroup.add(handle);

    const malletHead = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.34, 24), woodMahogany);
    malletHead.position.set(0, -0.78, 0.42);
    malletHead.rotation.z = Math.PI / 2;
    rightArmGroup.add(malletHead);

    const malletGoldRing = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.015, 12, 28), goldMat);
    malletGoldRing.position.set(0, -0.78, 0.42);
    rightArmGroup.add(malletGoldRing);

    judgeGroup.add(rightArmGroup);
    judgeArmRef.current = rightArmGroup;

    scene.add(judgeGroup);

    // =========================================================================
    // 7. BARRE DES TÉMOINS (AU CENTRE) EN BOIS D'ACAJOU & CUIVRE POLI
    // =========================================================================
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 1.2), woodMahogany);
    stand.position.set(0, 0.7, 0);
    stand.castShadow = true;
    stand.receiveShadow = true;
    scene.add(stand);

    // Baguette moulurée en façade de la barre
    const standMolding = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.08, 1.24), goldMat);
    standMolding.position.set(0, 1.35, 0);
    scene.add(standMolding);

    // Rampe en laiton poli où s'agrippe le témoin avec montants et embouts sphériques
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

    // Potelets verticaux de maintien en laiton
    for (let px of [-0.75, 0, 0.75]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12), brassMat);
      post.position.set(px, 1.35, 0.55);
      scene.add(post);
    }

    // Micro col de cygne du témoin
    const witnessMic = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 12), metalDark);
    witnessMic.position.set(0, 1.6, 0.35);
    witnessMic.rotation.x = 0.35;
    scene.add(witnessMic);
    const witnessMicLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    witnessMicLed.position.set(0, 1.78, 0.28);
    scene.add(witnessMicLed);

    // =========================================================================
    // 8. PERSONNAGE 3D SCULPTÉ HAUTE DÉFINITION : MAXIME À LA BARRE
    // =========================================================================
    const witnessGroup = new THREE.Group();
    witnessGroup.position.set(0, 0, -0.65);

    // Sweat à capuche étudiant (bleu canard / marine) sculpté et galbé
    const witBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.62 });
    const witBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.31, 1.15, 32), witBodyMat);
    witBody.position.y = 1.35;
    witBody.castShadow = true;
    witnessGroup.add(witBody);

    // Épaules arrondies et naturelles
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), witBodyMat);
    shoulderL.position.set(-0.35, 1.82, 0);
    witnessGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), witBodyMat);
    shoulderR.position.set(0.35, 1.82, 0);
    witnessGroup.add(shoulderR);

    // Anneau de capuche replié dans le dos
    const hoodRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.075, 20, 32), witBodyMat);
    hoodRing.position.set(0, 1.82, -0.06);
    hoodRing.rotation.x = Math.PI / 2.5;
    witnessGroup.add(hoodRing);

    // Poche kangourou avant
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.08), witBodyMat);
    pocket.position.set(0, 1.15, 0.30);
    witnessGroup.add(pocket);

    // Cordons de capuche modélisés avec embouts métalliques
    const stringL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.32, 12), clothWhite);
    stringL.position.set(-0.1, 1.62, 0.32);
    witnessGroup.add(stringL);
    const agletL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 10), metalDark);
    agletL.position.set(-0.1, 1.45, 0.32);
    witnessGroup.add(agletL);

    const stringR = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.32, 12), clothWhite);
    stringR.position.set(0.1, 1.62, 0.32);
    witnessGroup.add(stringR);
    const agletR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 10), metalDark);
    agletR.position.set(0.1, 1.45, 0.32);
    witnessGroup.add(agletR);

    // ==========================================
    // TÊTE DE MAXIME SCULPTÉE HAUTE POLYGONE
    // ==========================================
    const witHeadGroup = new THREE.Group();
    witHeadGroup.position.set(0, 2.22, 0);

    // Crâne jeune arrondi
    const witCranium = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 24), skinToneWitness);
    witCranium.scale.set(1.0, 1.14, 1.02);
    witHeadGroup.add(witCranium);

    // Mâchoire affinée et joues
    const witJaw = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.15, 0.23, 32), skinToneWitness);
    witJaw.position.set(0, -0.10, 0.03);
    witHeadGroup.add(witJaw);

    // Menton jeune
    const witChin = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), skinToneWitness);
    witChin.position.set(0, -0.20, 0.19);
    witHeadGroup.add(witChin);

    // Cou
    const witNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 24), skinToneWitness);
    witNeck.position.set(0, -0.26, 0);
    witHeadGroup.add(witNeck);

    // Nez jeune sculpté
    const witNose = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.14, 16), skinToneWitness);
    witNose.position.set(0, -0.02, 0.26);
    witNose.rotation.x = Math.PI / 2.3;
    witHeadGroup.add(witNose);

    // Yeux de Maxime (Blanc + Iris marron chaud + Pupille + Étincelle de vie Pixar)
    const witEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.044, 20, 20), eyeWhite);
    witEyeL.position.set(-0.11, 0.06, 0.22);
    witHeadGroup.add(witEyeL);
    const witIrisL = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.01, 18), eyeIrisWitness);
    witIrisL.position.set(-0.11, 0.06, 0.26);
    witIrisL.rotation.x = Math.PI / 2;
    witHeadGroup.add(witIrisL);
    const witPupilL = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
    witPupilL.position.set(-0.11, 0.06, 0.268);
    witHeadGroup.add(witPupilL);
    const witGlintL = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
    witGlintL.position.set(-0.104, 0.072, 0.278);
    witHeadGroup.add(witGlintL);

    const witEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.044, 20, 20), eyeWhite);
    witEyeR.position.set(0.11, 0.06, 0.22);
    witHeadGroup.add(witEyeR);
    const witIrisR = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.01, 18), eyeIrisWitness);
    witIrisR.position.set(0.11, 0.06, 0.26);
    witIrisR.rotation.x = Math.PI / 2;
    witHeadGroup.add(witIrisR);
    const witPupilR = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
    witPupilR.position.set(0.11, 0.06, 0.268);
    witHeadGroup.add(witPupilR);
    const witGlintR = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
    witGlintR.position.set(0.116, 0.072, 0.278);
    witHeadGroup.add(witGlintR);
    witnessEyesRef.current = [witEyeL, witIrisL, witPupilL, witGlintL, witEyeR, witIrisR, witPupilR, witGlintR];

    // Pommettes rosées chaleureuses style Pixar sur Maxime
    const witBlushL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), cheekBlushMat);
    witBlushL.position.set(-0.14, -0.04, 0.22);
    witHeadGroup.add(witBlushL);
    const witBlushR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), cheekBlushMat);
    witBlushR.position.set(0.14, -0.04, 0.22);
    witHeadGroup.add(witBlushR);

    // Bouche articulée de Maxime
    const witMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x991b1b })
    );
    witMouth.position.set(0, -0.12, 0.25);
    witHeadGroup.add(witMouth);
    witnessMouthRef.current = witMouth;

    // Sourcils de Maxime (s'inclinent d'inquiétude lors d'une mauvaise défense)
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
    witnessRightBrowRef.current = witBrowR;

    // Chevelure brune sculptée moderne (Calotte + 6 mèches dégradées et volumineuses)
    const witHairMat = new THREE.MeshStandardMaterial({ color: 0x3e2316, roughness: 0.72 });
    const witHairDome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), witHairMat);
    witHairDome.scale.set(1.04, 0.88, 1.08);
    witHairDome.position.set(0, 0.14, -0.02);
    witHeadGroup.add(witHairDome);

    // Mèches texturées sculptées
    for (let m = 0; m < 5; m++) {
      const lock = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 12), witHairMat);
      lock.position.set(-0.14 + m * 0.07, 0.22 - Math.abs(m - 2) * 0.03, 0.22);
      lock.rotation.x = Math.PI / 3;
      lock.rotation.z = (m - 2) * 0.15;
      witHeadGroup.add(lock);
    }

    witnessGroup.add(witHeadGroup);
    witnessHeadRef.current = witHeadGroup;

    // Bras avec mains sculptées agrippées fermement à la rampe en laiton
    const witLeftArm = new THREE.Group();
    witLeftArm.position.set(-0.35, 1.82, 0);
    const lBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 18), witBodyMat);
    lBicep.position.set(-0.08, -0.34, 0.22);
    lBicep.rotation.x = -Math.PI / 4;
    witLeftArm.add(lBicep);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), skinToneWitness);
    lHand.position.set(-0.08, -0.62, 0.48);
    witLeftArm.add(lHand);
    witnessGroup.add(witLeftArm);
    witnessLeftArmRef.current = witLeftArm;

    const witRightArm = new THREE.Group();
    witRightArm.position.set(0.35, 1.82, 0);
    const rBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 18), witBodyMat);
    rBicep.position.set(0.08, -0.34, 0.22);
    rBicep.rotation.x = -Math.PI / 4;
    witRightArm.add(rBicep);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), skinToneWitness);
    rHand.position.set(0.08, -0.62, 0.48);
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

    // Tablette numérique et dossier relié
    const defTablet = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.03, 0.36), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    defTablet.position.set(4.5, 1.15, 0.5);
    defTablet.rotation.y = -Math.PI / 6;
    scene.add(defTablet);

    // Mallette d'avocat en cuir avec serrures laiton
    const briefcase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.15), woodLight);
    briefcase.position.set(5.2, 0.3, 0.8);
    briefcase.rotation.y = -Math.PI / 6;
    scene.add(briefcase);

    // Avocat de la Défense (Me Alex) sculpté
    const defGroup = new THREE.Group();
    defGroup.position.set(4.4, 0, -0.2);
    defGroup.rotation.y = -Math.PI / 6;

    const defLawyer = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.30, 1.25, 28), clothNavy);
    defLawyer.position.y = 1.38;
    defGroup.add(defLawyer);

    // Col de chemise blanc et cravate bleue
    const defCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.12, 16), clothWhite);
    defCollar.position.set(0, 1.95, 0.06);
    defGroup.add(defCollar);

    const defTie = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.46, 0.04), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
    defTie.position.set(0, 1.68, 0.24);
    defGroup.add(defTie);

    // Broche dorée HECh au revers
    const defPin = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), goldMat);
    defPin.position.set(-0.16, 1.82, 0.22);
    defGroup.add(defPin);

    // Tête de Me Alex
    const defHeadGroup = new THREE.Group();
    defHeadGroup.position.set(0, 2.24, 0);

    const defCranium = new THREE.Mesh(new THREE.SphereGeometry(0.23, 28, 22), skinToneDef);
    defCranium.scale.set(0.98, 1.15, 1.02);
    defHeadGroup.add(defCranium);

    const defHair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 22), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }));
    defHair.scale.set(1.02, 0.86, 1.06);
    defHair.position.set(0, 0.12, -0.02);
    defHeadGroup.add(defHair);

    defGroup.add(defHeadGroup);
    defHeadRef.current = defHeadGroup;

    // Bras articulé pour la plaidoirie
    const defArmGroup = new THREE.Group();
    defArmGroup.position.set(-0.35, 1.75, 0.1);
    const defArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 16), clothNavy);
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

    // Dossiers d'accusation scellés avec ruban rouge
    const prosDossier = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.4), clothRed);
    prosDossier.position.set(-4.5, 1.18, 0.5);
    prosDossier.rotation.y = Math.PI / 6;
    scene.add(prosDossier);

    const prosGroup = new THREE.Group();
    prosGroup.position.set(-4.4, 0, -0.2);
    prosGroup.rotation.y = Math.PI / 6;

    // Toge noire d'accusateur public
    const prosLawyer = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.31, 1.25, 28), clothBlack);
    prosLawyer.position.y = 1.38;
    prosGroup.add(prosLawyer);

    const prosStole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.05), clothRed);
    prosStole.position.set(0, 1.55, 0.24);
    prosGroup.add(prosStole);

    // Tête du Procureur (traits sévères et cheveux gominés)
    const prosHeadGroup = new THREE.Group();
    prosHeadGroup.position.set(0, 2.22, 0);

    const prosCranium = new THREE.Mesh(new THREE.SphereGeometry(0.23, 28, 22), skinTonePros);
    prosCranium.scale.set(0.96, 1.16, 1.02);
    prosHeadGroup.add(prosCranium);

    const prosJaw = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.14, 0.22, 28), skinTonePros);
    prosJaw.position.set(0, -0.10, 0.03);
    prosHeadGroup.add(prosJaw);

    const prosHair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 22), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.22 }));
    prosHair.scale.set(1.02, 0.88, 1.08);
    prosHair.position.set(0, 0.12, -0.02);
    prosHeadGroup.add(prosHair);

    // Yeux plissés et perçants du Procureur avec étincelle Pixar
    const prosEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 16), eyePupil);
    prosEyeL.scale.set(1.2, 0.5, 1.0);
    prosEyeL.position.set(-0.10, 0.05, 0.22);
    prosHeadGroup.add(prosEyeL);
    const prosGlintL = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), eyeGlintMat);
    prosGlintL.position.set(-0.092, 0.062, 0.235);
    prosHeadGroup.add(prosGlintL);

    const prosEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 16), eyePupil);
    prosEyeR.scale.set(1.2, 0.5, 1.0);
    prosEyeR.position.set(0.10, 0.05, 0.22);
    prosHeadGroup.add(prosEyeR);
    const prosGlintR = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), eyeGlintMat);
    prosGlintR.position.set(0.108, 0.062, 0.235);
    prosHeadGroup.add(prosGlintR);
    prosEyesRef.current = [prosEyeL, prosGlintL, prosEyeR, prosGlintR];

    // Bouche articulée du Procureur
    const prosMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.038, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x7f1d1d })
    );
    prosMouth.position.set(0, -0.12, 0.24);
    prosHeadGroup.add(prosMouth);
    prosMouthRef.current = prosMouth;

    prosGroup.add(prosHeadGroup);
    prosHeadRef.current = prosHeadGroup;

    // Bras articulé au doigt accusateur tendu
    const prosArmGroup = new THREE.Group();
    prosArmGroup.position.set(0.35, 1.75, 0.1);

    const prosArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.68, 16), clothBlack);
    prosArmMesh.position.set(0, -0.3, 0);
    prosArmGroup.add(prosArmMesh);

    // Main et doigt accusateur pointé sur Maxime
    const prosHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), skinTonePros);
    prosHand.position.set(0, -0.64, 0.10);
    prosArmGroup.add(prosHand);

    const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 12), skinTonePros);
    finger.position.set(0, -0.72, 0.22);
    finger.rotation.x = Math.PI / 3;
    prosArmGroup.add(finger);

    prosGroup.add(prosArmGroup);
    prosArmRef.current = prosArmGroup;

    scene.add(prosGroup);

    // 11. (Le cube rotatif gênant et l'écran holographique au-dessus de la tête ont été supprimés)

    // 12. Gouttes de sueur 3D (pour état stressé/objection)
    const sweatGeo = new THREE.SphereGeometry(0.045, 6, 6);
    const sweatMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let i = 0; i < 4; i++) {
      const drop = new THREE.Mesh(sweatGeo, sweatMat);
      drop.visible = false;
      scene.add(drop);
      sweatParticlesRef.current.push(drop);
    }

    // 13. Écouteurs de souris pour rotation orbitale fluide
    const handleMouseDown = (e) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      previousMouse.current = { x: e.clientX, y: e.clientY };

      orbitAngles.current.theta -= deltaX * 0.005;
      orbitAngles.current.phi = Math.max(0.1, Math.min(1.2, orbitAngles.current.phi + deltaY * 0.005));

      const dist = 9.5;
      targetCamPos.current.x = Math.sin(orbitAngles.current.theta) * dist;
      targetCamPos.current.z = Math.cos(orbitAngles.current.theta) * dist;
      targetCamPos.current.y = Math.sin(orbitAngles.current.phi) * dist;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // =========================================================================
    // 14. BOUCLE D'ANIMATION PRINCIPALE À 60 FPS
    // =========================================================================
    let clock = new THREE.Clock();
    let gavelTimer = 0;
    let isGavelStriking = false;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Caméra Lerp vers la position cible
      camera.position.lerp(targetCamPos.current, 0.06);
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const currentLookTarget = camera.position.clone().add(currentLookAt.multiplyScalar(5));
      currentLookTarget.lerp(targetCamLook.current, 0.06);
      camera.lookAt(currentLookTarget);

      // Clignement réaliste des yeux pour tous les protagonistes
      const blinkPhase = elapsedTime % 3.6;
      const isBlinking = blinkPhase < 0.14;
      const eyeScaleY = isBlinking ? 0.08 : 1.0;

      judgeEyesRef.current.forEach(mesh => {
        if (mesh) mesh.scale.y = eyeScaleY;
      });
      witnessEyesRef.current.forEach(mesh => {
        if (mesh) mesh.scale.y = eyeScaleY;
      });
      prosEyesRef.current.forEach(mesh => {
        if (mesh) mesh.scale.y = eyeScaleY;
      });

      // Synchronisation labiale (mouvements de bouche)
      if (judgeStateRef.current === 'speaking' && judgeMouthRef.current) {
        judgeMouthRef.current.scale.y = Math.abs(Math.sin(elapsedTime * 14)) * 1.2 + 0.5;
      }
      if ((prosecutorStateRef.current === 'speaking' || prosecutorStateRef.current === 'attacking') && prosMouthRef.current) {
        prosMouthRef.current.scale.y = Math.abs(Math.sin(elapsedTime * 16)) * 1.3 + 0.4;
      }
      if (witnessStateRef.current === 'speaking' && witnessMouthRef.current) {
        witnessMouthRef.current.scale.y = Math.abs(Math.sin(elapsedTime * 13)) * 1.1 + 0.4;
      }

      // Animation des particules de poussière en suspension
      dustParticles.rotation.y = elapsedTime * 0.015;

      // Animation du Témoin selon son état émotionnel
      const currentWitnessState = witnessStateRef.current;
      if (witnessHeadRef.current && witnessLeftArmRef.current && witnessRightArmRef.current) {
        if (currentWitnessState === 'stressed' || currentWitnessState === 'broken') {
          // Tremblements d'inquiétude lors d'une mauvaise défense
          witnessHeadRef.current.rotation.z = Math.sin(elapsedTime * 25) * 0.06;
          witnessHeadRef.current.rotation.x = 0.2 + Math.sin(elapsedTime * 18) * 0.04;
          witnessLeftArmRef.current.position.y = 1.35 + Math.sin(elapsedTime * 20) * 0.04;
          witnessRightArmRef.current.position.y = 1.35 + Math.cos(elapsedTime * 20) * 0.04;

          // Sourcils inclinés d'anxiété
          if (witnessLeftBrowRef.current && witnessRightBrowRef.current) {
            witnessLeftBrowRef.current.rotation.z = -0.3;
            witnessRightBrowRef.current.rotation.z = 0.3;
          }

          // Gouttes de sueur
          sweatParticlesRef.current.forEach((drop, idx) => {
            drop.visible = true;
            const t = (elapsedTime * 2 + idx * 0.4) % 1;
            drop.position.set(
              witnessGroup.position.x + (idx % 2 === 0 ? 0.35 : -0.35) + (idx > 1 ? 0.1 : -0.1),
              2.4 - t * 0.5,
              witnessGroup.position.z + 0.3
            );
          });
        } else if (currentWitnessState === 'speaking' || currentWitnessState === 'confident') {
          // Gesticulation d'explication ou soulagement
          witnessHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.15;
          witnessHeadRef.current.rotation.x = Math.sin(elapsedTime * 4) * 0.08;
          witnessRightArmRef.current.rotation.x = -0.4 + Math.sin(elapsedTime * 4) * 0.2;
          if (witnessLeftBrowRef.current && witnessRightBrowRef.current) {
            witnessLeftBrowRef.current.rotation.z = 0;
            witnessRightBrowRef.current.rotation.z = 0;
          }
          sweatParticlesRef.current.forEach(drop => (drop.visible = false));
        } else {
          // Respiration calme
          witnessHeadRef.current.rotation.set(0, 0, 0);
          witnessLeftArmRef.current.rotation.set(0, 0, 0);
          witnessRightArmRef.current.rotation.set(0, 0, 0);
          if (witnessLeftBrowRef.current && witnessRightBrowRef.current) {
            witnessLeftBrowRef.current.rotation.z = 0;
            witnessRightBrowRef.current.rotation.z = 0;
          }
          sweatParticlesRef.current.forEach(drop => (drop.visible = false));
        }
      }

      // Animation du Procureur du Roi
      const currentProsState = prosecutorStateRef.current;
      if (prosArmRef.current && prosHeadRef.current) {
        if (currentProsState === 'attacking' || currentProsState === 'speaking') {
          // Pointage agressif vers le prévenu / défense
          prosArmRef.current.rotation.x = -1.2 + Math.sin(elapsedTime * 5) * 0.25;
          prosArmRef.current.rotation.z = -0.3;
          prosHeadRef.current.rotation.y = Math.PI / 4 + Math.sin(elapsedTime * 4) * 0.12;
        } else {
          prosArmRef.current.rotation.set(0, 0, 0);
          prosHeadRef.current.rotation.set(0, 0, 0);
        }
      }

      // Animation de l'Avocat de la Défense (Joueur)
      const currentDefState = defenseStateRef.current;
      if (defArmRef.current && defHeadRef.current) {
        if (currentDefState === 'pleading') {
          // Geste solennel vers le juge
          defArmRef.current.rotation.x = -1.4 + Math.sin(elapsedTime * 3.5) * 0.18;
          defArmRef.current.rotation.z = 0.3;
          defHeadRef.current.rotation.y = -Math.PI / 4 + Math.sin(elapsedTime * 3) * 0.08;
        } else {
          defArmRef.current.rotation.set(0, 0, 0);
          defHeadRef.current.rotation.set(0, 0, 0);
        }
      }

      // Réaction Faciale Précise du Juge (Sourire approbateur vs Moue sévère)
      const currentJudgeReaction = judgeReactionRef.current;
      if (judgeHeadRef.current && judgeMouthRef.current) {
        if (currentJudgeReaction === 'smile') {
          // Sourire approbateur + hochement bienveillant
          judgeHeadRef.current.rotation.x = 0.12 + Math.sin(elapsedTime * 6) * 0.08;
          judgeHeadRef.current.rotation.y = 0;
          judgeHeadRef.current.rotation.z = 0;
          judgeMouthRef.current.position.y = -0.13 + Math.sin(elapsedTime * 4) * 0.01;
          judgeMouthRef.current.scale.set(1.4, 1.5, 1);
          judgeMouthRef.current.material.color.setHex(0x10b981); // Vert approbation

          // Sourcils levés en courbe bienveillante
          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.17;
            judgeLeftBrowRef.current.rotation.z = 0.15;
            judgeRightBrowRef.current.position.y = 0.17;
            judgeRightBrowRef.current.rotation.z = -0.15;
          }

          if (judgeEmoRingRef.current) {
            judgeEmoRingRef.current.material.color.setHex(0x10b981);
            judgeEmoRingRef.current.material.opacity = 0.9;
            judgeEmoRingRef.current.rotation.z += 0.03;
          }
        } else if (currentJudgeReaction === 'frown') {
          // Moue sévère + secouement de tête désapprobateur ("NON !")
          judgeHeadRef.current.rotation.x = -0.06;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 7) * 0.18; // Secoue la tête
          judgeHeadRef.current.rotation.z = -0.06;
          judgeMouthRef.current.position.y = -0.18;
          judgeMouthRef.current.scale.set(0.9, 1.2, 1);
          judgeMouthRef.current.material.color.setHex(0xf43f5e); // Rouge désapprobation

          // Sourcils froncés agressifs inclinés vers le centre
          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.12;
            judgeLeftBrowRef.current.rotation.z = -0.25;
            judgeRightBrowRef.current.position.y = 0.12;
            judgeRightBrowRef.current.rotation.z = 0.25;
          }

          if (judgeEmoRingRef.current) {
            judgeEmoRingRef.current.material.color.setHex(0xf43f5e);
            judgeEmoRingRef.current.material.opacity = 0.9;
            judgeEmoRingRef.current.rotation.z -= 0.03;
          }
        } else {
          // Neutre
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
          if (judgeEmoRingRef.current) {
            judgeEmoRingRef.current.material.opacity = 0;
          }
        }
      }

      // Animation du Juge et Frappe du Marteau
      if (judgeArmRef.current) {
        if (judgeState === 'gavel' && !isGavelStriking) {
          isGavelStriking = true;
          gavelTimer = 0;
        }

        if (isGavelStriking) {
          gavelTimer += 0.06;
          if (gavelTimer < 0.6) {
            // Le juge lève le marteau
            judgeArmRef.current.rotation.x = -Math.PI / 2.2 * (gavelTimer / 0.6);
          } else if (gavelTimer < 0.8) {
            // Frappe rapide vers le bas (Impact)
            judgeArmRef.current.rotation.x = 0.4;
            if (shockwaveRef.current && shockwaveRef.current.material.opacity === 0) {
              shockwaveRef.current.material.opacity = 0.95;
              shockwaveRef.current.scale.set(1, 1, 1);
              sounds.playGavelStrike();
            }
          } else {
            // Onde de choc se dilate et s'estompe
            if (shockwaveRef.current) {
              shockwaveRef.current.scale.addScalar(0.08);
              shockwaveRef.current.material.opacity = Math.max(0, shockwaveRef.current.material.opacity - 0.05);
            }
            if (gavelTimer > 1.4) {
              isGavelStriking = false;
              judgeArmRef.current.rotation.x = 0;
              if (onGavelComplete) onGavelComplete();
            }
          }
        } else {
          if (judgeState === 'speaking') {
            judgeArmRef.current.rotation.x = -0.2 + Math.sin(elapsedTime * 3) * 0.08;
          } else {
            judgeArmRef.current.rotation.x = 0;
          }
        }
      }

      // =========================================================================
      // Animation Dynamique du Public (Applaudissements, Huées, Cris "Libérez Maxime")
      // =========================================================================
      const currentAudienceState = audienceStateRef.current;
      audienceMembersRef.current.forEach((spec) => {
        const p = spec.phase;
        if (currentAudienceState === 'cheer') {
          // Applaudissements nourris & ovation debout
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY + 0.18, 0.12);
          spec.head.rotation.x = Math.sin(elapsedTime * 9 + p) * 0.14;
          spec.head.rotation.y = Math.sin(elapsedTime * 4 + p) * 0.10;
          // Bras levés qui applaudissent vigoureusement
          spec.leftArm.rotation.x = -2.1 + Math.sin(elapsedTime * 14 + p) * 0.3;
          spec.rightArm.rotation.x = -2.1 + Math.sin(elapsedTime * 14 + p) * 0.3;
          spec.leftArm.rotation.z = 0.4 + Math.sin(elapsedTime * 14) * 0.25;
          spec.rightArm.rotation.z = -0.4 - Math.sin(elapsedTime * 14) * 0.25;
        } else if (currentAudienceState === 'boo') {
          // Huées, réprobation et secouement de tête désapprobateur
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY, 0.1);
          spec.head.rotation.y = Math.sin(elapsedTime * 14 + p) * 0.35; // "NON !"
          spec.head.rotation.x = 0.15;
          // Bras baissés agités de dépit
          spec.leftArm.rotation.x = -1.1 + Math.sin(elapsedTime * 8 + p) * 0.25;
          spec.rightArm.rotation.x = -1.1 + Math.sin(elapsedTime * 8 + p) * 0.25;
          spec.leftArm.rotation.z = -0.2;
          spec.rightArm.rotation.z = 0.2;
        } else if (currentAudienceState === 'shout_maxime' || currentAudienceState === 'uproar') {
          // Debout scandant : "Libérez Maxime !"
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY + 0.28, 0.15);
          spec.head.rotation.x = -0.22; // Regard levé vers l'estrade du Juge
          spec.head.rotation.y = Math.sin(elapsedTime * 5 + p) * 0.15;
          // Poing droit levé avec ferveur
          spec.rightArm.rotation.x = -2.5 + Math.sin(elapsedTime * 10 + p) * 0.45;
          spec.leftArm.rotation.x = -1.4 + Math.sin(elapsedTime * 7 + p) * 0.2;
          spec.rightArm.rotation.z = -0.2;
          spec.leftArm.rotation.z = 0.2;
        } else {
          // État assis calme avec respiration naturelle
          spec.group.position.y = THREE.MathUtils.lerp(spec.group.position.y, spec.baseY, 0.08);
          spec.head.rotation.x = Math.sin(elapsedTime * 2 + p) * 0.04;
          spec.head.rotation.y = Math.sin(elapsedTime * 1.5 + p) * 0.12;
          spec.leftArm.rotation.x = 0.35 + Math.sin(elapsedTime * 2 + p) * 0.05;
          spec.rightArm.rotation.x = 0.35 + Math.cos(elapsedTime * 2 + p) * 0.05;
          spec.leftArm.rotation.z = 0;
          spec.rightArm.rotation.z = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 15. Gestion du Redimensionnement
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Nettoyage au démontage
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mousedown', handleMouseDown);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Mode Réalisateur Cinéma 3D In-Engine (100% raccord avec les personnages)
  const [isCinematicMode, setIsCinematicMode] = useState(true);

  // Détermination de l'orateur canonique selon la caméra active
  const getCurrentSpeaker = () => {
    if (cameraView === 'JUDGE') return CANONICAL_CHARACTERS.juge;
    if (cameraView === 'WITNESS') return CANONICAL_CHARACTERS.maxime;
    if (cameraView === 'PROSECUTION') return CANONICAL_CHARACTERS.procureur;
    return null;
  };

  const activeSpeaker = getCurrentSpeaker();

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 select-none">
      {/* Canvas Three.js Temps Réel Unifié (Toujours Actif & Raccord) */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Mode Réalisateur Cinématique : Bandes Letterbox Cinéma 2.39:1 & Vignetage */}
      {isCinematicMode && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
          {/* Bande Noire Supérieure Cinéma */}
          <div className="h-8 sm:h-12 w-full bg-slate-950/90 border-b border-amber-500/20 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">
                REC • HECh Tribunal d'Honneur (Direct 60 FPS)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Optique Cinéma 35mm • Ratio 2.39:1
            </span>
          </div>

          {/* Bande Noire Inférieure Cinéma avec Badge Orateur Raccord */}
          <div className="h-10 sm:h-14 w-full bg-slate-950/90 border-t border-amber-500/20 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-between px-6">
            {activeSpeaker ? (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CharacterAvatar characterId={activeSpeaker.id} size={32} />
                <div className="flex flex-col">
                  <span className="text-xs font-black font-['Outfit'] text-white">
                    {activeSpeaker.name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-medium font-mono">
                    {activeSpeaker.title}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audience Plénière • Chambre d'Arbitrage Pédagogique</span>
              </div>
            )}

            <div className="text-[10px] font-mono text-slate-500 hidden sm:block">
              Univers Graphique Unifié • Haute École Charlemagne
            </div>
          </div>
        </div>
      )}

      {/* Régie TV & Contrôleur de Caméras Cinématiques */}
      <div className="absolute top-10 sm:top-14 left-3 z-20 flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-xl">
        {[
          { key: 'TV_WIDE', label: 'Vue Globale', icon: Camera },
          { key: 'JUDGE', label: 'Le Juge', icon: ZoomIn },
          { key: 'WITNESS', label: 'Maxime', icon: Eye },
          { key: 'DEFENSE', label: 'Défense', icon: Sparkles },
          { key: 'PROSECUTION', label: 'Procureur', icon: Camera },
          { key: 'AUDIENCE', label: 'Public', icon: Sparkles }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => onCameraChange && onCameraChange(btn.key)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              cameraView === btn.key
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <btn.icon className="w-3 h-3" />
            <span>{btn.label}</span>
          </button>
        ))}

        {/* Bouton bascule Mode Réalisateur Cinéma */}
        <button
          onClick={() => setIsCinematicMode(!isCinematicMode)}
          className={`px-3 py-1 rounded-xl text-[10px] font-mono font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg border ${
            isCinematicMode
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white border-amber-400/60 ring-2 ring-amber-400/30'
              : 'bg-slate-900/90 text-amber-400 border-amber-500/30 hover:bg-slate-800'
          }`}
          title="Activer/Désactiver le cadrage cinématographique avec suivi de l'orateur"
        >
          <Film className="w-3.5 h-3.5 text-amber-300" />
          <span>{isCinematicMode ? '🎬 Cadrage Cinéma ACTIF' : '🎬 Mode Plein Format'}</span>
        </button>
      </div>

      {/* HUD Émotionnel & Statut Judiciaire en direct */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        {judgeReaction === 'smile' && (
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono animate-bounce flex items-center gap-1.5 shadow-lg">
            <span>⚖️ Sourire du Juge (+15%)</span>
          </div>
        )}
        {judgeReaction === 'frown' && (
          <div className="px-3 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold font-mono animate-bounce flex items-center gap-1.5 shadow-lg">
            <span>⚠️ Moue Réprobatrice (-5%)</span>
          </div>
        )}
      </div>

      {/* Bulle / Cri du Public dynamique */}
      {audienceShoutText && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 animate-in zoom-in-95 pointer-events-none max-w-[90%]">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-amber-200 shadow-2xl backdrop-blur-md">
            <span className="text-base animate-pulse">📢</span>
            <span className="text-xs sm:text-sm font-black font-['Outfit'] tracking-wide">
              {audienceShoutText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
