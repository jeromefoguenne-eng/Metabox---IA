import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, ZoomIn, Eye, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

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
  onGavelComplete,
  cameraView = 'TV_WIDE',    // 'TV_WIDE' | 'JUDGE' | 'WITNESS' | 'DEFENSE' | 'PROSECUTION'
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

  // Refs dynamiques pour l'animation à 60 FPS sans recréation du canvas
  const witnessStateRef = useRef(witnessState);
  const prosecutorStateRef = useRef(prosecutorState);
  const defenseStateRef = useRef(defenseState);
  const judgeStateRef = useRef(judgeState);
  const judgeReactionRef = useRef(judgeReaction);

  useEffect(() => { witnessStateRef.current = witnessState; }, [witnessState]);
  useEffect(() => { prosecutorStateRef.current = prosecutorState; }, [prosecutorState]);
  useEffect(() => { defenseStateRef.current = defenseState; }, [defenseState]);
  useEffect(() => { judgeStateRef.current = judgeState; }, [judgeState]);
  useEffect(() => { judgeReactionRef.current = judgeReaction; }, [judgeReaction]);

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
    PROSECUTION: { pos: [-2.6, 2.4, 1.4], look: [-4.4, 2.2, -0.2] }
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
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Éclairage Studio & Volumétrique
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.95);
    scene.add(ambientLight);

    // Projecteur Principal (Soleil zénithal chaud)
    const keySpot = new THREE.SpotLight(0xfff5e6, 3.4);
    keySpot.position.set(2, 10, 6);
    keySpot.angle = Math.PI / 4.2;
    keySpot.penumbra = 0.55;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    // Rim Light (Cyan TV)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-7, 6, -3);
    scene.add(rimLight);

    // Spot chaud doré sur l'estrade du Juge
    const judgeSpot = new THREE.SpotLight(0xfef08a, 2.4);
    judgeSpot.position.set(0, 9, -2.5);
    judgeSpot.target.position.set(0, 3.2, -4.8);
    judgeSpot.angle = Math.PI / 5;
    judgeSpot.penumbra = 0.5;
    scene.add(judgeSpot);
    scene.add(judgeSpot.target);

    // Teinte violette solennelle en fond de cour
    const backFill = new THREE.PointLight(0x818cf8, 1.6, 22);
    backFill.position.set(0, 6, -8.5);
    scene.add(backFill);

    // Particules de poussière atmosphérique en suspension
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
      size: 0.055,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 3. Matériaux Partagés Haute Définition
    const parquetTex = createParquetTexture();
    const marbleTex = createMarbleTexture();
    const mahoganyTex = createMahoganyTexture();

    const woodMahogany = new THREE.MeshStandardMaterial({ 
      map: mahoganyTex, 
      roughness: 0.32, 
      metalness: 0.12 
    });
    const marblePillar = new THREE.MeshStandardMaterial({ 
      map: marbleTex, 
      roughness: 0.22, 
      metalness: 0.18 
    });
    const woodLight = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.38, metalness: 0.08 });
    const woodDarkOak = new THREE.MeshStandardMaterial({ 
      map: mahoganyTex, 
      color: 0x24120c, 
      roughness: 0.45, 
      metalness: 0.1 
    });
    const floorParquet = new THREE.MeshStandardMaterial({ 
      map: parquetTex, 
      roughness: 0.2, 
      metalness: 0.28 
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.18, metalness: 0.95 });
    const clothBlack = new THREE.MeshStandardMaterial({ color: 0x080c14, roughness: 0.85, metalness: 0.05 });
    const clothWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const clothRed = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3, metalness: 0.1 });
    const clothNavy = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.55, metalness: 0.12 });
    const skinTone = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.45 });
    const eyeWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyePupil = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeIris = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const metalDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.22, metalness: 0.85 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.88 });
    const velvetRed = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.75, metalness: 0.05 });

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
    });

    // Grand Écusson de la Justice HECh au-dessus du Juge
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, 9.2, -8.6);
    const sealBack = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.08, 32), goldMat);
    sealBack.rotation.x = Math.PI / 2;
    sealGroup.add(sealBack);

    // Relief balance de la justice sur l'écusson
    const sealPillar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.06), metalDark);
    sealGroup.add(sealPillar);
    const sealBeam = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.06), metalDark);
    sealBeam.position.y = 0.45;
    sealGroup.add(sealBeam);
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
    // 6. PERSONNAGE 3D SCULPTÉ : LE JUGE (Animé Haute Définition)
    // =========================================================================
    const judgeGroup = new THREE.Group();
    judgeGroup.position.set(0, 0.9, -5.2);

    // Corps & Toge
    const judgeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.75, 1.7, 16), clothBlack);
    judgeBody.position.y = 1.6;
    judgeGroup.add(judgeBody);

    // Parements de velours et boutons dorés de la toge
    const judgeStole = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 0.06), clothRed);
    judgeStole.position.set(0, 1.55, 0.48);
    judgeGroup.add(judgeStole);

    // Col d'Hermine blanc avec bordure mouchetée
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.45), clothWhite);
    collar.position.set(0, 2.3, 0.2);
    judgeGroup.add(collar);

    // Rabat de Magistrat (Jabot plissé blanc à plusieurs niveaux)
    const jabot1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.08), clothWhite);
    jabot1.position.set(0, 1.95, 0.46);
    judgeGroup.add(jabot1);
    const jabot2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.06), clothWhite);
    jabot2.position.set(0, 1.85, 0.5);
    judgeGroup.add(jabot2);

    // Chaîne d'or et médaille de la Haute École
    const judgeMedal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), goldMat);
    judgeMedal.position.set(0, 1.7, 0.54);
    judgeMedal.rotation.x = Math.PI / 2;
    judgeGroup.add(judgeMedal);

    // Tête du Juge sculptée
    const judgeHeadGroup = new THREE.Group();
    judgeHeadGroup.position.set(0, 2.85, 0);

    // Crâne & mâchoire
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.46), skinTone);
    judgeHeadGroup.add(head);

    // Nez sculpté
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.12), skinTone);
    nose.position.set(0, -0.02, 0.28);
    judgeHeadGroup.add(nose);

    // Yeux réalistes (Blanc + Iris foncé + Pupille)
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), eyeWhite);
    eyeL.position.set(-0.13, 0.07, 0.22);
    judgeHeadGroup.add(eyeL);
    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyePupil);
    pupilL.position.set(-0.13, 0.07, 0.255);
    judgeHeadGroup.add(pupilL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), eyeWhite);
    eyeR.position.set(0.13, 0.07, 0.22);
    judgeHeadGroup.add(eyeR);
    const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyePupil);
    pupilR.position.set(0.13, 0.07, 0.255);
    judgeHeadGroup.add(pupilR);
    judgeEyesRef.current = [eyeL, pupilL, eyeR, pupilR];

    // Sourcils sculptés articulés (réagissent au sourire / froncement)
    const browGeo = new THREE.BoxGeometry(0.16, 0.045, 0.08);
    const browMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    const browL = new THREE.Mesh(browGeo, browMat);
    browL.position.set(-0.13, 0.14, 0.24);
    judgeHeadGroup.add(browL);
    judgeLeftBrowRef.current = browL;

    const browR = new THREE.Mesh(browGeo, browMat);
    browR.position.set(0.13, 0.14, 0.24);
    judgeHeadGroup.add(browR);
    judgeRightBrowRef.current = browR;

    // Lunettes demi-lunes dorées
    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.1), goldMat);
    glasses.position.set(0, 0.05, 0.27);
    judgeHeadGroup.add(glasses);

    // Bouche expressive articulée (Sourire vs Moue)
    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.045, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x475569 })
    );
    mouth.position.set(0, -0.16, 0.25);
    judgeHeadGroup.add(mouth);
    judgeMouthRef.current = mouth;

    // Perruque magistrale complète à rouleaux étagés
    const wigTop = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.32, 0.54), clothWhite);
    wigTop.position.set(0, 0.22, -0.02);
    judgeHeadGroup.add(wigTop);

    // 3 Rouleaux de boucles tombant sur chaque tempe
    for (let r = 0; r < 3; r++) {
      const curlL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12), clothWhite);
      curlL.position.set(-0.32, 0.1 - r * 0.16, 0.05);
      curlL.rotation.z = 0.1;
      judgeHeadGroup.add(curlL);

      const curlR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12), clothWhite);
      curlR.position.set(0.32, 0.1 - r * 0.16, 0.05);
      curlR.rotation.z = -0.1;
      judgeHeadGroup.add(curlR);
    }

    // Anneau d'émotion lumineux réactif (Approbation verte vs Avertissement rouge)
    const emoRing = new THREE.Mesh(
      new THREE.RingGeometry(0.20, 0.28, 24),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    emoRing.position.set(0, 0.72, 0.1);
    judgeHeadGroup.add(emoRing);
    judgeEmoRingRef.current = emoRing;

    judgeGroup.add(judgeHeadGroup);
    judgeHeadRef.current = judgeHeadGroup;

    // Bras Droit avec Marteau de Justice (Gavel)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.65, 2.2, 0);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.2), clothBlack);
    arm.position.set(0, -0.3, 0);
    rightArmGroup.add(arm);

    // Main tenant le marteau
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), skinTone);
    hand.position.set(0, -0.62, 0.1);
    rightArmGroup.add(hand);

    // Marteau de Justice sculpté avec bague dorée
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.58, 12), woodLight);
    handle.position.set(0, -0.6, 0.24);
    handle.rotation.x = Math.PI / 4;
    rightArmGroup.add(handle);

    const malletHead = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.34, 16), woodMahogany);
    malletHead.position.set(0, -0.78, 0.42);
    malletHead.rotation.z = Math.PI / 2;
    rightArmGroup.add(malletHead);

    const malletGoldRing = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.015, 8, 24), goldMat);
    malletGoldRing.position.set(0, -0.78, 0.42);
    rightArmGroup.add(malletGoldRing);

    judgeGroup.add(rightArmGroup);
    judgeArmRef.current = rightArmGroup;

    scene.add(judgeGroup);

    // =========================================================================
    // 7. BARRE DES TÉMOINS (AU CENTRE)
    // =========================================================================
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.2), woodLight);
    stand.position.set(0, 0.7, 0);
    stand.castShadow = true;
    stand.receiveShadow = true;
    scene.add(stand);

    // Rampe en laiton où s'agrippe le témoin
    const standRail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 12), brassMat);
    standRail.position.set(0, 1.42, 0.55);
    standRail.rotation.z = Math.PI / 2;
    scene.add(standRail);

    // Micro col de cygne du témoin
    const witnessMic = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), metalDark);
    witnessMic.position.set(0, 1.6, 0.35);
    witnessMic.rotation.x = 0.35;
    scene.add(witnessMic);
    const witnessMicLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    witnessMicLed.position.set(0, 1.78, 0.28);
    scene.add(witnessMicLed);

    // =========================================================================
    // 8. PERSONNAGE 3D : MAXIME À LA BARRE (Animé)
    // =========================================================================
    const witnessGroup = new THREE.Group();
    witnessGroup.position.set(0, 0, -0.65);

    // Sweat à capuche étudiant (bleu canard / marine)
    const witBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.65 });
    const witBody = new THREE.Mesh(new THREE.BoxGeometry(0.66, 1.15, 0.46), witBodyMat);
    witBody.position.y = 1.35;
    witBody.castShadow = true;
    witnessGroup.add(witBody);

    // Cordons de capuche modélisés
    const stringL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.02), clothWhite);
    stringL.position.set(-0.1, 1.65, 0.25);
    witnessGroup.add(stringL);
    const stringR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.02), clothWhite);
    stringR.position.set(0.1, 1.65, 0.25);
    witnessGroup.add(stringR);

    // Tête de Maxime
    const witHeadGroup = new THREE.Group();
    witHeadGroup.position.set(0, 2.22, 0);
    const witHead = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.48, 0.42), skinTone);
    witHeadGroup.add(witHead);

    // Yeux de Maxime
    const witEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeWhite);
    witEyeL.position.set(-0.11, 0.06, 0.21);
    witHeadGroup.add(witEyeL);
    const witPupilL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyePupil);
    witPupilL.position.set(-0.11, 0.06, 0.245);
    witHeadGroup.add(witPupilL);

    const witEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeWhite);
    witEyeR.position.set(0.11, 0.06, 0.21);
    witHeadGroup.add(witEyeR);
    const witPupilR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyePupil);
    witPupilR.position.set(0.11, 0.06, 0.245);
    witHeadGroup.add(witPupilR);
    witnessEyesRef.current = [witEyeL, witPupilL, witEyeR, witPupilR];

    // Bouche articulée de Maxime
    const witMouth = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.06), new THREE.MeshBasicMaterial({ color: 0x991b1b }));
    witMouth.position.set(0, -0.12, 0.22);
    witHeadGroup.add(witMouth);
    witnessMouthRef.current = witMouth;

    // Sourcils de Maxime (s'inclinent d'inquiétude lors d'une mauvaise défense)
    const witBrowGeo = new THREE.BoxGeometry(0.14, 0.035, 0.06);
    const witBrowMat = new THREE.MeshBasicMaterial({ color: 0x451a14 });
    const witBrowL = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowL.position.set(-0.11, 0.12, 0.22);
    witHeadGroup.add(witBrowL);
    witnessLeftBrowRef.current = witBrowL;

    const witBrowR = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowR.position.set(0.11, 0.12, 0.22);
    witHeadGroup.add(witBrowR);
    witnessRightBrowRef.current = witBrowR;

    // Chevelure brune texturée
    const witHairMat = new THREE.MeshStandardMaterial({ color: 0x451a14, roughness: 0.85 });
    const witHair = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.46), witHairMat);
    witHair.position.set(0, 0.22, -0.02);
    witHeadGroup.add(witHair);
    // Mèche tombante
    const tuft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.1), witHairMat);
    tuft.position.set(-0.08, 0.18, 0.24);
    witHeadGroup.add(tuft);

    witnessGroup.add(witHeadGroup);
    witnessHeadRef.current = witHeadGroup;

    // Bras avec mains agrippées à la rampe
    const witLeftArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.2), witBodyMat);
    witLeftArm.position.set(-0.45, 1.3, 0.1);
    witnessGroup.add(witLeftArm);
    witnessLeftArmRef.current = witLeftArm;

    const witRightArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.2), witBodyMat);
    witRightArm.position.set(0.45, 1.3, 0.1);
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

    // Avocat de la Défense (Me Alex)
    const defGroup = new THREE.Group();
    defGroup.position.set(4.4, 0, -0.2);
    defGroup.rotation.y = -Math.PI / 6;

    const defLawyer = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.25, 0.42), clothNavy);
    defLawyer.position.y = 1.38;
    defGroup.add(defLawyer);

    const defTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.05), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    defTie.position.set(0, 1.52, 0.23);
    defGroup.add(defTie);

    // Broche dorée HECh au revers
    const defPin = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), goldMat);
    defPin.position.set(-0.18, 1.75, 0.22);
    defGroup.add(defPin);

    const defHead = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.4), skinTone);
    defHead.position.y = 2.18;
    defGroup.add(defHead);
    defHeadRef.current = defHead;

    const defArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.68, 0.18), clothNavy);
    defArm.position.set(-0.35, 1.45, 0.1);
    defGroup.add(defArm);
    defArmRef.current = defArm;

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

    // Toge noire avec parements pourpres
    const prosLawyer = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.25, 0.42), clothBlack);
    prosLawyer.position.y = 1.38;
    prosGroup.add(prosLawyer);

    const prosTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 0.05), clothRed);
    prosTie.position.set(0, 1.52, 0.23);
    prosGroup.add(prosTie);

    // Tête du Procureur (traits sévères et cheveux gominés)
    const prosHeadGroup = new THREE.Group();
    prosHeadGroup.position.set(0, 2.18, 0);

    const prosHead = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.4), skinTone);
    prosHeadGroup.add(prosHead);

    const prosHair = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.44), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2 }));
    prosHair.position.set(0, 0.2, -0.02);
    prosHeadGroup.add(prosHair);

    // Yeux plissés et sourcils arqués sévères
    const prosEyeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.05), eyePupil);
    prosEyeL.position.set(-0.11, 0.05, 0.21);
    prosHeadGroup.add(prosEyeL);
    const prosEyeR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.05), eyePupil);
    prosEyeR.position.set(0.11, 0.05, 0.21);
    prosHeadGroup.add(prosEyeR);
    prosEyesRef.current = [prosEyeL, prosEyeR];

    // Bouche articulée du Procureur
    const prosMouth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.06), new THREE.MeshBasicMaterial({ color: 0x7f1d1d }));
    prosMouth.position.set(0, -0.12, 0.21);
    prosHeadGroup.add(prosMouth);
    prosMouthRef.current = prosMouth;

    prosGroup.add(prosHeadGroup);
    prosHeadRef.current = prosHeadGroup;

    // Bras articulé au doigt accusateur tendu
    const prosArmGroup = new THREE.Group();
    prosArmGroup.position.set(0.35, 1.75, 0.1);

    const prosArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.68, 0.18), clothBlack);
    prosArmMesh.position.set(0, -0.3, 0);
    prosArmGroup.add(prosArmMesh);

    // Main et doigt accusateur
    const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 6), skinTone);
    finger.position.set(0, -0.68, 0.18);
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

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 select-none">
      {/* Canvas Three.js */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Régie TV & Contrôleur de Caméras Cinématiques */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-xl">
        {[
          { key: 'TV_WIDE', label: 'Vue Globale', icon: Camera },
          { key: 'JUDGE', label: 'Le Juge', icon: ZoomIn },
          { key: 'WITNESS', label: 'Maxime', icon: Eye },
          { key: 'DEFENSE', label: 'Défense', icon: Sparkles },
          { key: 'PROSECUTION', label: 'Procureur', icon: Camera }
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
    </div>
  );
}
