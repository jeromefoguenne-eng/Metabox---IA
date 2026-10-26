import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, ZoomIn, Eye, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * Courtroom3DCanvas:
 * Moteur 3D temps réel Three.js pour le Tribunal Académique 2030 (« L'IA à la Barre »).
 * Esthétique Low-Poly stylisée TV Show / Ace Attorney :
 * - Juge animé avec marteau de justice physique (frappe, onde de choc, étincelles)
 * - Témoins animés à la barre (Julien, Léo, DRH Vandamme) avec expressions de stress réactives
 * - Avocats de la défense et du ministère public
 * - Pupitres d'acajou, boiseries néoclassiques, micro, balance dorée
 * - Écran holographique 3D flottant avec rotation et particules
 * - Caméras cinématiques multiples (Plongée TV, Focus Juge, Témoin, Défense)
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

  // References pour animations
  const judgeArmRef = useRef(null);
  const judgeHeadRef = useRef(null);
  const judgeMouthRef = useRef(null);
  const judgeEmoRingRef = useRef(null);
  const witnessRef = useRef(null);
  const witnessHeadRef = useRef(null);
  const witnessLeftArmRef = useRef(null);
  const witnessRightArmRef = useRef(null);
  const prosArmRef = useRef(null);
  const prosHeadRef = useRef(null);
  const defArmRef = useRef(null);
  const defHeadRef = useRef(null);
  const holoScreenRef = useRef(null);
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

  // Configurations de caméra prédéfinies style régie TV
  const CAMERA_PRESETS = {
    TV_WIDE: { pos: [0, 5.8, 11.5], look: [0, 2.2, 0] },
    JUDGE: { pos: [0, 3.8, 4.5], look: [0, 4.2, -4.5] },
    WITNESS: { pos: [0, 2.4, 3.8], look: [0, 2.1, 0] },
    DEFENSE: { pos: [3.8, 2.9, 3.2], look: [-1.2, 2.2, -1.0] },
    PROSECUTION: { pos: [-3.8, 2.9, 3.2], look: [1.2, 2.2, -1.0] }
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
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 11);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Éclairage Studio & Volumétrique TV Haute Fidélité
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.95);
    scene.add(ambientLight);

    // Projecteur Principal (Soleil zénithal chaud)
    const keySpot = new THREE.SpotLight(0xfff5e6, 3.2);
    keySpot.position.set(2, 10, 6);
    keySpot.angle = Math.PI / 4.2;
    keySpot.penumbra = 0.55;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    // Éclairage de bordure (Cyan Rim Light TV)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-7, 5, -3);
    scene.add(rimLight);

    // Éclairage chaud d'ambiance sur l'estrade du Juge
    const judgeSpot = new THREE.SpotLight(0xfef08a, 2.0);
    judgeSpot.position.set(0, 8, -3);
    judgeSpot.target.position.set(0, 3, -5);
    scene.add(judgeSpot);
    scene.add(judgeSpot.target);

    // Éclairage violet/indigo solennel sur le fond
    const backFill = new THREE.PointLight(0x818cf8, 1.4, 20);
    backFill.position.set(0, 6, -8);
    scene.add(backFill);

    // Particules de poussière atmosphérique / Rayons volumétriques
    const dustCount = 140;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
      dustPositions[i + 1] = Math.random() * 8 + 0.5;
      dustPositions[i + 2] = (Math.random() - 0.5) * 14 - 1;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 3. Matériaux Partagés Haute Fidélité
    const woodMahogany = new THREE.MeshStandardMaterial({ color: 0x3b140e, roughness: 0.35, metalness: 0.15 });
    const woodLight = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4, metalness: 0.08 });
    const floorParquet = new THREE.MeshStandardMaterial({ color: 0x18100e, roughness: 0.22, metalness: 0.32 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.92 });
    const clothBlack = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.85, metalness: 0.05 });
    const clothWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const clothRed = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.35, metalness: 0.1 });
    const clothNavy = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6, metalness: 0.1 });
    const skinTone = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.55 });
    const metalDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.85 });

    // 4. Architecture de la Salle d'Audience (Tribunal HECh 2030)
    // Sol Parquet
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floor = new THREE.Mesh(floorGeo, floorParquet);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Mur de fond avec boiseries et colonnes néoclassiques
    const backWallGeo = new THREE.BoxGeometry(20, 10, 0.4);
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 5, -9);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Écusson / Sceau officiel HECh au mur
    const sealGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 24);
    const seal = new THREE.Mesh(sealGeo, goldMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, 7.2, -8.7);
    scene.add(seal);

    // Colonnes néoclassiques décoratives
    for (let x of [-7, -3.5, 3.5, 7]) {
      const colGeo = new THREE.CylinderGeometry(0.35, 0.4, 9, 12);
      const colMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(x, 4.5, -8.6);
      scene.add(col);
    }

    // 5. Estrade Surélevée & Pupitre du Juge
    const daisGeo = new THREE.BoxGeometry(7, 0.9, 3.2);
    const dais = new THREE.Mesh(daisGeo, woodMahogany);
    dais.position.set(0, 0.45, -4.8);
    dais.receiveShadow = true;
    scene.add(dais);

    // Pupitre Magistrat
    const benchGeo = new THREE.BoxGeometry(5.2, 1.6, 1.4);
    const bench = new THREE.Mesh(benchGeo, woodMahogany);
    bench.position.set(0, 1.7, -4.5);
    bench.castShadow = true;
    bench.receiveShadow = true;
    scene.add(bench);

    // Bloc sonore en bois pour frappe du marteau
    const soundBlockGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.12, 16);
    const soundBlock = new THREE.Mesh(soundBlockGeo, woodLight);
    soundBlock.position.set(0.65, 2.56, -4.1);
    soundBlock.receiveShadow = true;
    scene.add(soundBlock);

    // Anneau d'onde de choc pour l'impact du marteau (masqué par défaut)
    const shockGeo = new THREE.RingGeometry(0.1, 0.25, 24);
    const shockMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const shockwave = new THREE.Mesh(shockGeo, shockMat);
    shockwave.rotation.x = -Math.PI / 2;
    shockwave.position.set(0.65, 2.63, -4.1);
    scene.add(shockwave);
    shockwaveRef.current = shockwave;

    // Balance de la justice miniature dorée sur le pupitre du juge
    const scaleBaseGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.6, 12);
    const scaleBase = new THREE.Mesh(scaleBaseGeo, goldMat);
    scaleBase.position.set(-1.4, 2.8, -4.2);
    scene.add(scaleBase);
    const scaleBeamGeo = new THREE.BoxGeometry(0.6, 0.03, 0.03);
    const scaleBeam = new THREE.Mesh(scaleBeamGeo, goldMat);
    scaleBeam.position.set(-1.4, 3.1, -4.2);
    scene.add(scaleBeam);

    // 6. Personnage 3D : LE JUGE (Animé Haute Définition)
    const judgeGroup = new THREE.Group();
    judgeGroup.position.set(0, 0.9, -5.2);

    // Corps & Toge
    const judgeBodyGeo = new THREE.CylinderGeometry(0.55, 0.7, 1.7, 12);
    const judgeBody = new THREE.Mesh(judgeBodyGeo, clothBlack);
    judgeBody.position.y = 1.6;
    judgeGroup.add(judgeBody);

    // Col Hermine blanc
    const collarGeo = new THREE.BoxGeometry(0.5, 0.25, 0.4);
    const collar = new THREE.Mesh(collarGeo, clothWhite);
    collar.position.set(0, 2.3, 0.2);
    judgeGroup.add(collar);

    // Rabat de Magistrat (Jabot plissé blanc)
    const jabotGeo = new THREE.BoxGeometry(0.28, 0.5, 0.06);
    const jabot = new THREE.Mesh(jabotGeo, clothWhite);
    jabot.position.set(0, 1.9, 0.42);
    jabot.rotation.x = 0.1;
    judgeGroup.add(jabot);

    // Tête du Juge
    const judgeHeadGroup = new THREE.Group();
    judgeHeadGroup.position.set(0, 2.8, 0);
    const headGeo = new THREE.BoxGeometry(0.5, 0.55, 0.5);
    const head = new THREE.Mesh(headGeo, skinTone);
    judgeHeadGroup.add(head);

    // Yeux expressifs du Juge
    const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 0.08, 0.26);
    judgeHeadGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, 0.08, 0.26);
    judgeHeadGroup.add(eyeR);

    // Cheveux blancs / perruque magistrate
    const hairGeo = new THREE.BoxGeometry(0.56, 0.35, 0.54);
    const hair = new THREE.Mesh(hairGeo, clothWhite);
    hair.position.set(0, 0.2, -0.02);
    judgeHeadGroup.add(hair);

    // Lunettes dorées
    const glassesGeo = new THREE.BoxGeometry(0.42, 0.1, 0.1);
    const glasses = new THREE.Mesh(glassesGeo, goldMat);
    glasses.position.set(0, 0.05, 0.27);
    judgeHeadGroup.add(glasses);

    // Bouche expressive du Juge (Sourire vs Moue)
    const mouthGeo = new THREE.BoxGeometry(0.22, 0.04, 0.08);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.15, 0.26);
    judgeHeadGroup.add(mouth);
    judgeMouthRef.current = mouth;

    // Anneau d'émotion réactif au-dessus de la perruque
    const emoRingGeo = new THREE.RingGeometry(0.18, 0.24, 16);
    const emoRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const emoRing = new THREE.Mesh(emoRingGeo, emoRingMat);
    emoRing.position.set(0, 0.65, 0.1);
    judgeHeadGroup.add(emoRing);
    judgeEmoRingRef.current = emoRing;

    judgeGroup.add(judgeHeadGroup);
    judgeHeadRef.current = judgeHeadGroup;

    // Bras Droit avec Marteau de Justice (Gavel)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.6, 2.2, 0); // Épaule

    const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.2);
    const arm = new THREE.Mesh(armGeo, clothBlack);
    arm.position.set(0, -0.3, 0);
    rightArmGroup.add(arm);

    // Marteau de Justice en 3D
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8);
    const handle = new THREE.Mesh(handleGeo, woodLight);
    handle.position.set(0, -0.55, 0.2);
    handle.rotation.x = Math.PI / 4;
    rightArmGroup.add(handle);

    const malletHeadGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12);
    const malletHead = new THREE.Mesh(malletHeadGeo, woodMahogany);
    malletHead.position.set(0, -0.72, 0.36);
    malletHead.rotation.z = Math.PI / 2;
    rightArmGroup.add(malletHead);

    judgeGroup.add(rightArmGroup);
    judgeArmRef.current = rightArmGroup;

    scene.add(judgeGroup);

    // 7. Barre des Témoins (Au Centre)
    const standGeo = new THREE.BoxGeometry(2.2, 1.4, 1.2);
    const stand = new THREE.Mesh(standGeo, woodLight);
    stand.position.set(0, 0.7, 0);
    stand.castShadow = true;
    stand.receiveShadow = true;
    scene.add(stand);

    // Micro col de cygne sur la barre
    const micStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const micStem = new THREE.Mesh(micStemGeo, metalDark);
    micStem.position.set(0, 1.6, 0.3);
    micStem.rotation.x = 0.3;
    scene.add(micStem);

    // 8. Personnage 3D : LE TÉMOIN À LA BARRE (Animé)
    const witnessGroup = new THREE.Group();
    witnessGroup.position.set(0, 0, -0.65);

    // Corps du témoin
    const witBodyMat = new THREE.MeshStandardMaterial({
      color: currentCaseIdx === 0 ? 0x0284c7 : (currentCaseIdx === 1 ? 0x1e293b : 0x1d4ed8),
      roughness: 0.6
    });
    const witBodyGeo = new THREE.BoxGeometry(0.65, 1.1, 0.45);
    const witBody = new THREE.Mesh(witBodyGeo, witBodyMat);
    witBody.position.y = 1.35;
    witBody.castShadow = true;
    witnessGroup.add(witBody);

    // Tête du témoin
    const witHeadGroup = new THREE.Group();
    witHeadGroup.position.set(0, 2.2, 0);
    const witHead = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.44), skinTone);
    witHeadGroup.add(witHead);

    // Cheveux du témoin
    const witHairMat = new THREE.MeshStandardMaterial({
      color: currentCaseIdx === 0 ? 0x451a14 : (currentCaseIdx === 1 ? 0x0f172a : 0x64748b),
      roughness: 0.8
    });
    const witHair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.48), witHairMat);
    witHair.position.set(0, 0.22, 0);
    witHeadGroup.add(witHair);

    witnessGroup.add(witHeadGroup);
    witnessHeadRef.current = witHeadGroup;

    // Bras gauche et droit du témoin (animables)
    const witLeftArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.2), witBodyMat);
    witLeftArm.position.set(-0.45, 1.3, 0.1);
    witnessGroup.add(witLeftArm);
    witnessLeftArmRef.current = witLeftArm;

    const witRightArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.2), witBodyMat);
    witRightArm.position.set(0.45, 1.3, 0.1);
    witnessGroup.add(witRightArm);
    witnessRightArmRef.current = witRightArm;

    scene.add(witnessGroup);
    witnessRef.current = witnessGroup;

    // 9. Banc de la Défense (À Droite)
    const defBench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.2), woodMahogany);
    defBench.position.set(4.5, 0.55, 0.5);
    defBench.rotation.y = -Math.PI / 6;
    scene.add(defBench);

    // Tablette / Dossier numérique de la Défense sur le pupitre
    const defTabletGeo = new THREE.BoxGeometry(0.5, 0.03, 0.35);
    const defTabletMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const defTablet = new THREE.Mesh(defTabletGeo, defTabletMat);
    defTablet.position.set(4.4, 1.15, 0.5);
    defTablet.rotation.y = -Math.PI / 6;
    scene.add(defTablet);

    // Avocat de la Défense (Joueur)
    const defGroup = new THREE.Group();
    defGroup.position.set(4.3, 0, -0.2);
    defGroup.rotation.y = -Math.PI / 6;

    const defLawyer = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.4), clothNavy);
    defLawyer.position.y = 1.35;
    defGroup.add(defLawyer);

    // Cravate bleue défense
    const defTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.05), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    defTie.position.set(0, 1.5, 0.22);
    defGroup.add(defTie);

    const defHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.4), skinTone);
    defHead.position.y = 2.15;
    defGroup.add(defHead);
    defHeadRef.current = defHead;

    const defArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), clothNavy);
    defArm.position.set(-0.35, 1.4, 0.1);
    defGroup.add(defArm);
    defArmRef.current = defArm;

    scene.add(defGroup);

    // 10. Banc de l'Accusation / Procureur du Roi (À Gauche)
    const prosBench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.2), woodMahogany);
    prosBench.position.set(-4.5, 0.55, 0.5);
    prosBench.rotation.y = Math.PI / 6;
    scene.add(prosBench);

    // Dossier d'accusation rouge scellé du Ministère Public
    const prosDossierGeo = new THREE.BoxGeometry(0.55, 0.08, 0.4);
    const prosDossier = new THREE.Mesh(prosDossierGeo, clothRed);
    prosDossier.position.set(-4.4, 1.15, 0.5);
    prosDossier.rotation.y = Math.PI / 6;
    scene.add(prosDossier);

    const prosGroup = new THREE.Group();
    prosGroup.position.set(-4.3, 0, -0.2);
    prosGroup.rotation.y = Math.PI / 6;

    const prosLawyer = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.4), clothBlack);
    prosLawyer.position.y = 1.35;
    prosGroup.add(prosLawyer);

    // Cravate rouge bordeaux accusatrice du Procureur
    const prosTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.05), clothRed);
    prosTie.position.set(0, 1.5, 0.22);
    prosGroup.add(prosTie);

    const prosHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.4), skinTone);
    prosHead.position.y = 2.15;
    prosGroup.add(prosHead);
    prosHeadRef.current = prosHead;

    // Bras articulé avec doigt accusateur pointé
    const prosArmGroup = new THREE.Group();
    prosArmGroup.position.set(0.35, 1.7, 0.1);

    const prosArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), clothBlack);
    prosArm.position.set(0, -0.3, 0);
    prosArmGroup.add(prosArm);

    // Doigt accusateur tendu
    const fingerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6);
    const finger = new THREE.Mesh(fingerGeo, skinTone);
    finger.position.set(0, -0.65, 0.15);
    finger.rotation.x = Math.PI / 3;
    prosArmGroup.add(finger);

    prosGroup.add(prosArmGroup);
    prosArmRef.current = prosArmGroup;

    scene.add(prosGroup);

    // 11. Écran Holographique 3D Flottant (Pour projeter les preuves et les données)
    const holoGroup = new THREE.Group();
    holoGroup.position.set(0, 3.8, 0.2);

    const holoScreenGeo = new THREE.PlaneGeometry(2.8, 1.6);
    const holoScreenMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    const holoScreen = new THREE.Mesh(holoScreenGeo, holoScreenMat);
    holoGroup.add(holoScreen);

    // Ligne de balayage laser holographique (Scanner)
    const scanLaserGeo = new THREE.PlaneGeometry(2.7, 0.04);
    const scanLaserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const scanLaser = new THREE.Mesh(scanLaserGeo, scanLaserMat);
    scanLaser.position.z = 0.02;
    holoGroup.add(scanLaser);

    // Cadre cyber lumineux
    const holoFrameGeo = new THREE.RingGeometry(1.4, 1.45, 4);
    const holoFrameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const holoFrame = new THREE.Mesh(holoFrameGeo, holoFrameMat);
    holoFrame.scale.set(1.4, 0.8, 1);
    holoGroup.add(holoFrame);

    // Cube de données 3D rotatif au centre de l'hologramme
    const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const cubeMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true });
    const dataCube = new THREE.Mesh(cubeGeo, cubeMat);
    dataCube.position.set(0, 0, 0.1);
    holoGroup.add(dataCube);

    scene.add(holoGroup);
    holoScreenRef.current = { group: holoGroup, cube: dataCube, laser: scanLaser };

    // 12. Gouttes de sueur 3D (pour état stressé/objection)
    const sweatGeo = new THREE.SphereGeometry(0.04, 6, 6);
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

    // 14. Boucle d'Animation Principale à 60 FPS
    let clock = new THREE.Clock();
    let gavelTimer = 0;
    let isGavelStriking = false;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Caméra Lerp vers la position cible
      camera.position.lerp(targetCamPos.current, 0.06);
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const currentLookTarget = camera.position.clone().add(currentLookAt.multiplyScalar(5));
      currentLookTarget.lerp(targetCamLook.current, 0.06);
      camera.lookAt(currentLookTarget);

      // Animation Hologramme (rotation douce + pulsation + scan laser)
      if (holoScreenRef.current) {
        holoScreenRef.current.group.rotation.y = Math.sin(elapsedTime * 0.8) * 0.12;
        holoScreenRef.current.group.position.y = 3.8 + Math.sin(elapsedTime * 1.5) * 0.08;
        holoScreenRef.current.cube.rotation.x += 0.02;
        holoScreenRef.current.cube.rotation.y += 0.03;
        if (holoScreenRef.current.laser) {
          holoScreenRef.current.laser.position.y = Math.sin(elapsedTime * 3) * 0.7;
        }
      }

      // Animation du Témoin selon son état émotionnel
      const currentWitnessState = witnessStateRef.current;
      if (witnessHeadRef.current && witnessLeftArmRef.current && witnessRightArmRef.current) {
        if (currentWitnessState === 'stressed' || currentWitnessState === 'broken') {
          // Tremblements et sueur
          witnessHeadRef.current.rotation.z = Math.sin(elapsedTime * 25) * 0.06;
          witnessHeadRef.current.rotation.x = 0.2 + Math.sin(elapsedTime * 18) * 0.04;
          witnessLeftArmRef.current.position.y = 1.35 + Math.sin(elapsedTime * 20) * 0.04;
          witnessRightArmRef.current.position.y = 1.35 + Math.cos(elapsedTime * 20) * 0.04;

          // Faire jaillir les gouttes de sueur
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
          // Gesticulation d'explication ou assurance
          witnessHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.15;
          witnessHeadRef.current.rotation.x = Math.sin(elapsedTime * 4) * 0.08;
          witnessRightArmRef.current.rotation.x = -0.4 + Math.sin(elapsedTime * 4) * 0.2;
          sweatParticlesRef.current.forEach(drop => (drop.visible = false));
        } else {
          // Respiration calme
          witnessHeadRef.current.rotation.set(0, 0, 0);
          witnessLeftArmRef.current.rotation.set(0, 0, 0);
          witnessRightArmRef.current.rotation.set(0, 0, 0);
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

      // Réaction Faciale du Juge (Sourire approbateur vs Moue sceptique)
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
          if (judgeEmoRingRef.current) {
            judgeEmoRingRef.current.material.color.setHex(0x10b981);
            judgeEmoRingRef.current.material.opacity = 0.85;
            judgeEmoRingRef.current.rotation.z += 0.03;
          }
        } else if (currentJudgeReaction === 'frown') {
          // Moue sceptique + secouement de tête
          judgeHeadRef.current.rotation.x = -0.05;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 7) * 0.16; // Secoue la tête "Non"
          judgeHeadRef.current.rotation.z = -0.06;
          judgeMouthRef.current.position.y = -0.17;
          judgeMouthRef.current.scale.set(0.9, 1.2, 1);
          judgeMouthRef.current.material.color.setHex(0xf43f5e); // Rose / rouge moue
          if (judgeEmoRingRef.current) {
            judgeEmoRingRef.current.material.color.setHex(0xf43f5e);
            judgeEmoRingRef.current.material.opacity = 0.85;
            judgeEmoRingRef.current.rotation.z -= 0.03;
          }
        } else {
          // Neutre
          judgeHeadRef.current.rotation.set(0, 0, 0);
          judgeMouthRef.current.position.y = -0.15;
          judgeMouthRef.current.scale.set(1, 1, 1);
          judgeMouthRef.current.material.color.setHex(0x475569);
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
              shockwaveRef.current.material.opacity = 0.9;
              shockwaveRef.current.scale.set(1, 1, 1);
              sounds.playGavelStrike();
            }
          } else {
            // Onde de choc se dilate et disparaît
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
          judgeArmRef.current.rotation.x = Math.sin(elapsedTime * 1.2) * 0.04;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionnement automatique
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentCaseIdx, witnessState, judgeState]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Canvas 3D */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Barre de régie TV - Contrôle des caméras */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 shadow-lg">
        <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-1 flex items-center gap-1">
          <Camera className="w-3.5 h-3.5 animate-pulse text-rose-500" /> DIRECT TV
        </span>
        <button
          onClick={() => onCameraChange('TV_WIDE')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
            cameraView === 'TV_WIDE' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Vue Large
        </button>
        <button
          onClick={() => onCameraChange('JUDGE')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
            cameraView === 'JUDGE' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Juge ⚖️
        </button>
        <button
          onClick={() => onCameraChange('WITNESS')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
            cameraView === 'WITNESS' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Témoin 👤
        </button>
        <button
          onClick={() => onCameraChange('DEFENSE')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
            cameraView === 'DEFENSE' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Défense 🛡️
        </button>
        <button
          onClick={() => onCameraChange('PROSECUTION')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
            cameraView === 'PROSECUTION' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Procureur ⚔️
        </button>
      </div>

      {/* Badge Flottant d'Émotion du Juge (Sourire vs Moue) */}
      {judgeReaction === 'smile' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-emerald-600/95 text-white backdrop-blur-md border border-emerald-400 font-mono font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/40 animate-bounce">
          <span>😊 Sourire approbateur du Juge : « Argument pertinent et éclairé ! »</span>
        </div>
      )}
      {judgeReaction === 'frown' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-rose-600/95 text-white backdrop-blur-md border border-rose-400 font-mono font-bold text-xs flex items-center gap-2 shadow-xl shadow-rose-600/40 animate-pulse">
          <span>🤨 Moue sceptique du Juge : « Argument trop faible ou spécieux ! »</span>
        </div>
      )}

      {/* Guide d'interaction 3D */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-sm border border-slate-800 text-[11px] text-slate-400 font-mono">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>Glisser pour orbiter à 360° · Caméra fluide</span>
      </div>
    </div>
  );
}
