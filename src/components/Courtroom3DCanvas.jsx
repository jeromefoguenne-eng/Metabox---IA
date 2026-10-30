import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, ZoomIn, Eye, Sparkles, Film, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import CharacterAvatar from './CharacterAvatar';
import { CANONICAL_CHARACTERS } from '../utils/charactersData';

/**
 * Courtroom3DCanvas - Rendu 3D Temps Réel Style 1 : Claymorphism & Tactile 3D Studio
 * 
 * Élimine à 100% le rendu "Low Poly / Mannequins en cylindres" :
 * - Salle d'audience monumentale panoramique avec vitraux, lustres et boiseries noyer en profondeur 3D
 * - Maxime, Juge Vandamme et Procureur modélisés en haute fidélité sculptée tactile (Style 1 Pixar)
 * - Vraies ombres portées douces sur le parquet verni
 * - Éclairage studio 3-points chaleureux (Champagne Key, Or Rim, Rebond au sol)
 * - Animations 3D temps réel 60 FPS : Respiration continue, hochements de tête oraux, stress avec sueur, frappe de marteau physique
 * - Régie de caméras TV cinématiques lerpées fluides
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
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);

  // Mode Réalisateur Cinéma 3D
  const [isCinematicMode, setIsCinematicMode] = useState(true);

  // Refs d'état pour la boucle d'animation
  const witnessStateRef = useRef(witnessState);
  const prosecutorStateRef = useRef(prosecutorState);
  const judgeStateRef = useRef(judgeState);
  const cameraViewRef = useRef(cameraView);
  const onGavelCompleteRef = useRef(onGavelComplete);

  useEffect(() => { witnessStateRef.current = witnessState; }, [witnessState]);
  useEffect(() => { prosecutorStateRef.current = prosecutorState; }, [prosecutorState]);
  useEffect(() => { judgeStateRef.current = judgeState; }, [judgeState]);
  useEffect(() => { cameraViewRef.current = cameraView; }, [cameraView]);
  useEffect(() => { onGavelCompleteRef.current = onGavelComplete; }, [onGavelComplete]);

  // Positions cibles des caméras TV
  const targetCamPos = useRef(new THREE.Vector3(0, 3.8, 8.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.0, -0.8));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.0, -0.8));

  // Mise à jour de la caméra selon la régie active
  useEffect(() => {
    switch (cameraView) {
      case 'JUDGE':
        // Plan majestueux sur le Juge Vandamme au pupitre haut
        targetCamPos.current.set(0, 3.6, -1.0);
        targetLookAt.current.set(0, 3.6, -4.6);
        break;
      case 'WITNESS':
        // Plan serré expressif sur Maxime à la barre
        targetCamPos.current.set(0, 1.45, 2.9);
        targetLookAt.current.set(0, 1.25, 0.45);
        break;
      case 'DEFENSE':
        // Plan par-dessus l'épaule de Me Alex (Vous) vers le Juge et Maxime
        targetCamPos.current.set(2.8, 2.2, 3.8);
        targetLookAt.current.set(-0.4, 2.4, -2.0);
        break;
      case 'PROSECUTION':
        // Plan dramatique sur le Procureur du Roi
        targetCamPos.current.set(-2.2, 1.9, 1.8);
        targetLookAt.current.set(-3.2, 1.5, -1.2);
        break;
      case 'AUDIENCE':
        // Vue sur les gradins du public
        targetCamPos.current.set(0, 2.2, -1.5);
        targetLookAt.current.set(0, 1.8, 6.5);
        break;
      case 'TV_WIDE':
      default:
        // Vue globale d'audience équilibrée
        targetCamPos.current.set(0, 3.6, 8.2);
        targetLookAt.current.set(0, 2.0, -0.6);
        break;
    }
  }, [cameraView]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- 1. Scène & Environnement Tactile Style 1 ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1128);
    scene.fog = new THREE.FogExp2(0x0a1128, 0.028);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.6, 8.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.30;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // --- 2. Éclairage Studio Chaleureux 3-Points ---
    const ambientLight = new THREE.AmbientLight(0xfff1e6, 1.35);
    scene.add(ambientLight);

    // Key Light champagne douce à large rayon d'ombre
    const keySpot = new THREE.SpotLight(0xfff7ed, 3.8);
    keySpot.position.set(3, 11, 7);
    keySpot.angle = Math.PI / 4.0;
    keySpot.penumbra = 0.85;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    keySpot.shadow.radius = 3.5;
    scene.add(keySpot);

    // Rim Lights veloutées
    const rimLightLeft = new THREE.DirectionalLight(0x93c5fd, 2.2);
    rimLightLeft.position.set(-8, 7, -2);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xfef08a, 2.0);
    rimLightRight.position.set(8, 7, -2);
    scene.add(rimLightRight);

    // Rebond au sol chaud
    const floorBounce = new THREE.PointLight(0xfde68a, 1.8, 20);
    floorBounce.position.set(0, 0.8, 0);
    scene.add(floorBounce);

    // Spot or centré sur le Juge
    const judgeSpot = new THREE.SpotLight(0xfbbf24, 3.2);
    judgeSpot.position.set(0, 9.5, -2.5);
    judgeSpot.target.position.set(0, 3.6, -4.6);
    judgeSpot.angle = Math.PI / 4.5;
    judgeSpot.penumbra = 0.65;
    scene.add(judgeSpot);
    scene.add(judgeSpot.target);

    // Poussières dorées flottantes
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 16;
      dustPos[i + 1] = Math.random() * 7 + 0.5;
      dustPos[i + 2] = (Math.random() - 0.5) * 14;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // --- 3. Textures Haute Définition Style 1 ---
    const textureLoader = new THREE.TextureLoader();

    // Fond architectural panoramique
    const courtroomPanoTex = textureLoader.load('/images/courtroom_style1_panoramic.jpg');
    courtroomPanoTex.generateMipmaps = true;

    // Personnages sculptés Style 1
    const maximeTex = textureLoader.load('/images/maxime_style1_cutout.png');
    const jugeTex = textureLoader.load('/images/juge_style1_cutout.png');
    const procureurTex = textureLoader.load('/images/procureur_style1_cutout.png');

    // --- 4. Sol & Décors 3D Spatiaux ---
    // Parquet verni au sol
    const floorGeo = new THREE.PlaneGeometry(24, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x22130c,
      roughness: 0.25,
      metalness: 0.12
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Décor architectural panoramique incurvé en arrière-plan
    const panoBackdropGeo = new THREE.CylinderGeometry(15, 15, 11, 48, 1, true, -Math.PI * 0.42, Math.PI * 0.84);
    const panoBackdropMat = new THREE.MeshBasicMaterial({
      map: courtroomPanoTex,
      side: THREE.BackSide
    });
    const panoBackdrop = new THREE.Mesh(panoBackdropGeo, panoBackdropMat);
    panoBackdrop.position.set(0, 5.0, -3.5);
    scene.add(panoBackdrop);

    // Boiseries en noyer noble pour le mobilier
    const woodMahogany = new THREE.MeshStandardMaterial({
      color: 0x3d1c12,
      roughness: 0.32,
      metalness: 0.08
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.20,
      metalness: 0.92
    });
    const velvetRed = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.72
    });

    // --- 5. PUPITRE MAGISTRAL DU JUGE (ESTRADE HAUTE EN 3D) ---
    const judgeDaisGroup = new THREE.Group();
    judgeDaisGroup.position.set(0, 0, -4.6);
    scene.add(judgeDaisGroup);

    // Estrade en bois noble
    const daisStep = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.45, 3.2), woodMahogany);
    daisStep.position.y = 0.225;
    daisStep.receiveShadow = true;
    judgeDaisGroup.add(daisStep);

    // Grand bureau du Juge
    const judgeDesk = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.4, 1.2), woodMahogany);
    judgeDesk.position.set(0, 1.15, 0);
    judgeDesk.castShadow = true;
    judgeDesk.receiveShadow = true;
    judgeDaisGroup.add(judgeDesk);

    // Nappe en velours rouge carmin
    const judgeVelvet = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.04, 1.05), velvetRed);
    judgeVelvet.position.set(0, 1.87, 0);
    judgeDaisGroup.add(judgeVelvet);

    // Billot de frappe en bois noble tourné
    const anvilMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.08, 24), woodMahogany);
    anvilMesh.position.set(0.65, 1.93, 0.15);
    judgeDaisGroup.add(anvilMesh);

    // Marteau de Justice 3D sculpté & animé
    const gavelGroup = new THREE.Group();
    gavelGroup.position.set(0.65, 1.98, 0.15);

    const gavelHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.42, 16), brassMat);
    gavelHandle.rotation.z = Math.PI / 2;
    gavelHandle.position.x = -0.16;
    gavelGroup.add(gavelHandle);

    const gavelHead = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.18, 20), woodMahogany);
    gavelHead.rotation.x = Math.PI / 2;
    gavelHead.position.x = 0.05;
    gavelGroup.add(gavelHead);
    judgeDaisGroup.add(gavelGroup);

    // --- 6. LE JUGE VANDAMME (PERSONNAGE SCULPTÉ HAUTE FIDÉLITÉ STYLE 1) ---
    const judgeCharGroup = new THREE.Group();
    judgeCharGroup.position.set(0, 3.2, -4.6);
    scene.add(judgeCharGroup);

    // Maillage 3D incurvé pour un volume organique sans coutures
    const judgePlaneGeo = new THREE.PlaneGeometry(1.65, 2.2, 16, 16);
    const judgePosAttr = judgePlaneGeo.attributes.position;
    for (let i = 0; i < judgePosAttr.count; i++) {
      const x = judgePosAttr.getX(i);
      judgePosAttr.setZ(i, -Math.pow(x, 2) * 0.12);
    }
    judgePlaneGeo.computeVertexNormals();

    const judgeCharMat = new THREE.MeshPhysicalMaterial({
      map: jugeTex,
      roughness: 0.38,
      clearcoat: 0.25,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    const judgeCharMesh = new THREE.Mesh(judgePlaneGeo, judgeCharMat);
    judgeCharMesh.position.y = 0.95;
    judgeCharMesh.castShadow = true;
    judgeCharGroup.add(judgeCharMesh);

    // --- 7. BARRE DES TÉMOINS (MAXIME - FACE AU JUGE) ---
    const witnessDockGroup = new THREE.Group();
    witnessDockGroup.position.set(0, 0, 0.72);
    scene.add(witnessDockGroup);

    // Rampe en bois d'acajou avec balustrade
    const dockFront = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.05, 0.08), woodMahogany);
    dockFront.position.set(0, 0.525, 0.25); // Devant Maxime côté régie/défense (+z)
    dockFront.castShadow = true;
    witnessDockGroup.add(dockFront);

    const dockRail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 20), brassMat);
    dockRail.rotation.z = Math.PI / 2;
    dockRail.position.set(0, 1.06, 0.25);
    witnessDockGroup.add(dockRail);

    // Micro col de cygne officiel avec LED d'état
    const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.04, 16), brassMat);
    micBase.position.set(0.35, 1.08, 0.25);
    witnessDockGroup.add(micBase);

    const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 12), brassMat);
    micStem.position.set(0.35, 1.25, 0.25);
    micStem.rotation.z = 0.25;
    witnessDockGroup.add(micStem);

    const micTip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    micTip.position.set(0.30, 1.42, 0.25);
    witnessDockGroup.add(micTip);

    // --- 8. MAXIME À LA BARRE (PERSONNAGE SCULPTÉ HAUTE FIDÉLITÉ STYLE 1) ---
    const witnessCharGroup = new THREE.Group();
    witnessCharGroup.position.set(0, 0, 0.72);
    scene.add(witnessCharGroup);

    const witnessPlaneGeo = new THREE.PlaneGeometry(1.4, 1.85, 16, 16);
    const witPosAttr = witnessPlaneGeo.attributes.position;
    for (let i = 0; i < witPosAttr.count; i++) {
      const x = witPosAttr.getX(i);
      witPosAttr.setZ(i, -Math.pow(x, 2) * 0.14);
    }
    witnessPlaneGeo.computeVertexNormals();

    const witnessCharMat = new THREE.MeshPhysicalMaterial({
      map: maximeTex,
      roughness: 0.35,
      clearcoat: 0.30,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    const witnessCharMesh = new THREE.Mesh(witnessPlaneGeo, witnessCharMat);
    witnessCharMesh.position.set(0, 1.02, 0);
    witnessCharMesh.rotation.y = 0; // Regarde droit vers la caméra / défense
    witnessCharMesh.castShadow = true;
    witnessCharGroup.add(witnessCharMesh);

    // Particules de sueur de Maxime en cas de stress
    const sweatDrops = [];
    for (let s = 0; s < 4; s++) {
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.8 })
      );
      drop.visible = false;
      witnessCharGroup.add(drop);
      sweatDrops.push(drop);
    }

    // --- 9. LE PROCUREUR DU ROI (À GAUCHE DU TRIBUNAL) ---
    const prosGroup = new THREE.Group();
    prosGroup.position.set(-3.5, 0, -1.2);
    scene.add(prosGroup);

    // Bureau de l'Accusation
    const prosDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.2), woodMahogany);
    prosDesk.position.y = 0.55;
    prosDesk.castShadow = true;
    prosGroup.add(prosDesk);

    const prosPlaneGeo = new THREE.PlaneGeometry(1.35, 1.85, 16, 16);
    const prosCharMat = new THREE.MeshPhysicalMaterial({
      map: procureurTex,
      roughness: 0.40,
      clearcoat: 0.20,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    const prosCharMesh = new THREE.Mesh(prosPlaneGeo, prosCharMat);
    prosCharMesh.position.set(0, 1.35, 0);
    prosCharMesh.rotation.y = 0.45; // Orienté vers Maxime et la Cour
    prosCharMesh.castShadow = true;
    prosGroup.add(prosCharMesh);

    // --- 10. BANC DE LA DÉFENSE (ME ALEX / LE JOUEUR - À DROITE) ---
    const defGroup = new THREE.Group();
    defGroup.position.set(3.5, 0, -1.2);
    scene.add(defGroup);

    const defDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.2), woodMahogany);
    defDesk.position.y = 0.55;
    defDesk.castShadow = true;
    defGroup.add(defDesk);

    const defBrief = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.04, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    defBrief.position.set(0, 1.12, 0);
    defGroup.add(defBrief);

    // --- 11. SUIVI DE SOURIS & PARALLAXE DOUCE ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(x * 0.45, -0.45, 0.45);
      mouse.targetY = THREE.MathUtils.clamp(y * 0.25, -0.25, 0.25);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 12. BOUCLE D'ANIMATION À 60 FPS (ANIMATION 3D CONTINUE) ---
    const clock = new THREE.Clock();
    let isGavelStriking = false;
    let gavelStartTime = 0;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Parallaxe douce de caméra
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.05);

      // Lerp de la caméra vers la position régie TV
      const camTargetWithParallax = targetCamPos.current.clone();
      camTargetWithParallax.x += mouse.x;
      camTargetWithParallax.y += mouse.y;
      camera.position.lerp(camTargetWithParallax, 0.06);

      currentLookAt.current.lerp(targetLookAt.current, 0.06);
      camera.lookAt(currentLookAt.current);

      // --- ANIMATION 3D DE MAXIME (RESPIRATION, PAROLE, STRESS) ---
      const curWitnessState = witnessStateRef.current;
      const breath = Math.sin(t * 2.2);

      witnessCharGroup.position.y = breath * 0.012;
      witnessCharMesh.scale.y = 1.0 + breath * 0.008;

      if (curWitnessState === 'speaking') {
        // Gesticulation orale et hochements d'explication
        witnessCharMesh.rotation.z = Math.sin(t * 4.0) * 0.03;
        witnessCharGroup.position.x = Math.sin(t * 3.0) * 0.02;
        micTip.material.color.setHex(0x38bdf8); // Cyan vif parlant
        sweatDrops.forEach(d => (d.visible = false));
      } else if (curWitnessState === 'stressed' || curWitnessState === 'broken') {
        // Tremblement de stress et sueur qui coule
        witnessCharMesh.rotation.z = (Math.random() - 0.5) * 0.035;
        micTip.material.color.setHex(0xf43f5e); // Rouge stress
        sweatDrops.forEach((d, idx) => {
          d.visible = true;
          const dropT = (t * 2.5 + idx * 0.4) % 1.0;
          d.position.set(
            (idx % 2 === 0 ? 0.28 : -0.28) + (idx > 1 ? 0.08 : -0.08),
            1.55 - dropT * 0.6,
            -0.08
          );
        });
      } else if (curWitnessState === 'confident') {
        // Soulagement face au Juge
        witnessCharMesh.rotation.z = Math.sin(t * 1.2) * 0.015;
        micTip.material.color.setHex(0x10b981); // Vert confiance
        sweatDrops.forEach(d => (d.visible = false));
      } else {
        // Posture d'écoute calme
        witnessCharMesh.rotation.z = 0;
        micTip.material.color.setHex(0x06b6d4);
        sweatDrops.forEach(d => (d.visible = false));
      }

      // --- ANIMATION 3D DU JUGE VANDAMME & DU MARTEAU ---
      const curJudgeState = judgeStateRef.current;
      const judgeBreath = Math.sin(t * 1.8);
      judgeCharMesh.scale.y = 1.0 + judgeBreath * 0.006;

      if (curJudgeState === 'speaking') {
        judgeCharMesh.rotation.z = Math.sin(t * 2.8) * 0.02;
      } else {
        judgeCharMesh.rotation.z = 0;
      }

      // Animation physique du coup de marteau
      if (curJudgeState === 'gavel' && !isGavelStriking) {
        isGavelStriking = true;
        gavelStartTime = t;
      }

      if (isGavelStriking) {
        const elapsed = t - gavelStartTime;
        if (elapsed < 0.25) {
          // Levée du marteau en arrière
          gavelGroup.rotation.x = -Math.PI / 3 * (elapsed / 0.25);
          gavelGroup.position.y = 1.98 + (elapsed / 0.25) * 0.35;
        } else if (elapsed < 0.40) {
          // Frappe rapide vers le bas sur le billot
          const strikeP = (elapsed - 0.25) / 0.15;
          gavelGroup.rotation.x = -Math.PI / 3 * (1 - strikeP) + 0.15 * strikeP;
          gavelGroup.position.y = 2.33 - strikeP * 0.35;
        } else {
          // Impact et retour
          gavelGroup.rotation.x = 0;
          gavelGroup.position.y = 1.98;
          isGavelStriking = false;
          if (onGavelCompleteRef.current) onGavelCompleteRef.current();
        }
      }

      // --- ANIMATION DU PROCUREUR ---
      const curProsState = prosecutorStateRef.current;
      if (curProsState === 'attacking') {
        prosCharMesh.position.x = Math.sin(t * 5.0) * 0.04;
        prosCharMesh.rotation.z = -0.06;
      } else {
        prosCharMesh.position.x = 0;
        prosCharMesh.rotation.z = 0;
      }

      // Particules dorées en lente suspension
      dustParticles.rotation.y = t * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

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
      {/* Canvas Three.js Temps Réel Unifié (Toujours Actif & 100% Raccord) */}
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
              Style 1 : Claymorphism & Tactile 3D Studio
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
                <span>Audience Plénière • Chambre d'Arbitrage Pédagogique HECh</span>
              </div>
            )}

            <div className="text-[10px] font-mono text-slate-500 hidden sm:block">
              Rendu Sculpté Haute Définition • Zéro Low Poly
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
          <span>{isCinematicMode ? '🎬 Cadrage Cinéma' : '🎬 Plein Format'}</span>
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
