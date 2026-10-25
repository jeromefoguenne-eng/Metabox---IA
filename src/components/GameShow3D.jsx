import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GameShow3D({ 
  reaction = 'idle', // 'idle' | 'speaking' | 'correct' | 'wrong' | 'victory'
  theme = 'millionnaire', // 'millionnaire' | 'champion' | 'roue' | 'concours'
  themeColor = '#4f46e5'
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Character & object refs for animation
  const hostGroupRef = useRef(null);
  const hostHeadRef = useRef(null);
  const hostArmsRef = useRef([]);
  const audienceListRef = useRef([]);
  const spotLightsRef = useRef([]);
  const reactionStateRef = useRef(reaction);

  // Keep state ref updated
  useEffect(() => {
    reactionStateRef.current = reaction;
  }, [reaction]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 280;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'millionnaire' ? 0x090d1a : 0x0f172a);
    scene.fog = new THREE.FogExp2(scene.background, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Moving Spotlights (TV Show Spots)
    const spot1 = new THREE.SpotLight(0x38bdf8, 5, 20, Math.PI / 6, 0.4, 1);
    spot1.position.set(-4, 6, 3);
    spot1.castShadow = true;
    scene.add(spot1);

    const spot2 = new THREE.SpotLight(0xf59e0b, 5, 20, Math.PI / 6, 0.4, 1);
    spot2.position.set(4, 6, 3);
    spot2.castShadow = true;
    scene.add(spot2);

    spotLightsRef.current = [spot1, spot2];

    // Center Stage Glow
    const centerLight = new THREE.PointLight(themeColor, 3, 10);
    centerLight.position.set(0, 2.5, 0);
    scene.add(centerLight);

    // 3. Stage Floor (Circular reflective platform)
    const stageGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.3, 32);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.6
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.15;
    stage.receiveShadow = true;
    scene.add(stage);

    // Stage Neon Ring
    const ringGeo = new THREE.TorusGeometry(4.25, 0.06, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeColor) });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // 4. Low Poly TV Host Character
    const hostGroup = new THREE.Group();
    hostGroup.position.set(-1.2, 0, 0.5);
    hostGroupRef.current = hostGroup;
    scene.add(hostGroup);

    // Suit Body (Trapezoid / Box)
    const bodyGeo = new THREE.BoxGeometry(0.65, 0.9, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, flatShading: true, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.05;
    body.castShadow = true;
    hostGroup.add(body);

    // Shirt & Tie
    const shirtGeo = new THREE.BoxGeometry(0.25, 0.4, 0.05);
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
    const shirt = new THREE.Mesh(shirtGeo, shirtMat);
    shirt.position.set(0, 1.25, 0.2);
    hostGroup.add(shirt);

    const tieGeo = new THREE.BoxGeometry(0.08, 0.35, 0.06);
    const tieMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 1.22, 0.23);
    hostGroup.add(tie);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, flatShading: true });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-0.18, 0.3, 0);
    hostGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(0.18, 0.3, 0);
    hostGroup.add(legR);

    // Head (Low Poly box)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.75, 0);
    hostHeadRef.current = headGroup;
    hostGroup.add(headGroup);

    const headGeo = new THREE.BoxGeometry(0.42, 0.45, 0.4);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, flatShading: true, roughness: 0.6 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headGroup.add(headMesh);

    // Hair (Low Poly volume)
    const hairGeo = new THREE.BoxGeometry(0.46, 0.22, 0.44);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.22, -0.02);
    headGroup.add(hair);

    // Glasses / Eyebrows
    const glassesGeo = new THREE.BoxGeometry(0.36, 0.08, 0.05);
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const glasses = new THREE.Mesh(glassesGeo, glassesMat);
    glasses.position.set(0, 0.05, 0.22);
    headGroup.add(glasses);

    // Smile
    const smileGeo = new THREE.BoxGeometry(0.16, 0.04, 0.04);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.position.set(0, -0.12, 0.21);
    headGroup.add(smile);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.15, 0.55, 0.15);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, flatShading: true });

    // Left Arm (Microphone arm)
    const armL = new THREE.Group();
    armL.position.set(-0.42, 1.35, 0);
    const armLMesh = new THREE.Mesh(armGeo, armMat);
    armLMesh.position.y = -0.22;
    armL.add(armLMesh);

    // Microphone
    const micGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.25, 8);
    const micMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
    const mic = new THREE.Mesh(micGeo, micMat);
    mic.rotation.x = Math.PI / 4;
    mic.position.set(0, -0.45, 0.2);
    armL.add(mic);

    hostGroup.add(armL);

    // Right Arm (Gesture arm)
    const armR = new THREE.Group();
    armR.position.set(0.42, 1.35, 0);
    const armRMesh = new THREE.Mesh(armGeo, armMat);
    armRMesh.position.y = -0.22;
    armR.add(armRMesh);
    hostGroup.add(armR);

    hostArmsRef.current = [armL, armR];

    // 5. Host TV Podium
    const podiumGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.95, 16);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.set(0, 0.48, 0.5);
    podium.castShadow = true;
    scene.add(podium);

    // Podium Screen
    const screenGeo = new THREE.BoxGeometry(0.65, 0.35, 0.05);
    const screenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeColor) });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.65, 0.85);
    screen.rotation.x = -Math.PI / 8;
    scene.add(screen);

    // 6. Low Poly Audience (Tiered amphitheater behind stage)
    const audienceList = [];
    const spectatorColors = [0x3b82f6, 0x10b981, 0xf59e0b, 0xec4899, 0x8b5cf6, 0x06b6d4];

    for (let row = 0; row < 3; row++) {
      const radius = 5.2 + (row * 0.9);
      const rowY = 0.6 + (row * 0.7);
      const count = 9 + (row * 2);

      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * 0.7 + (i / (count - 1)) * Math.PI * 1.4;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius * 0.55 - 1.2;

        const spectator = new THREE.Group();
        spectator.position.set(x, rowY, z);
        spectator.lookAt(0, 1.2, 0);

        // Body
        const cColor = spectatorColors[(row * 3 + i) % spectatorColors.length];
        const sBodyGeo = new THREE.BoxGeometry(0.35, 0.45, 0.25);
        const sBodyMat = new THREE.MeshStandardMaterial({ color: cColor, flatShading: true });
        const sBody = new THREE.Mesh(sBodyGeo, sBodyMat);
        spectator.add(sBody);

        // Head
        const sHeadGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        const sHeadMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, flatShading: true });
        const sHead = new THREE.Mesh(sHeadGeo, sHeadMat);
        sHead.position.y = 0.35;
        spectator.add(sHead);

        scene.add(spectator);
        audienceList.push({
          group: spectator,
          baseY: rowY,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    audienceListRef.current = audienceList;

    // 7. Render Loop & Animation
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentReact = reactionStateRef.current;

      // Rotate Stage Spotlights
      spot1.position.x = Math.sin(elapsedTime * 0.8) * 4.5;
      spot1.position.z = Math.cos(elapsedTime * 0.8) * 3;
      spot1.target = podium;

      spot2.position.x = -Math.sin(elapsedTime * 0.9 + 1) * 4.5;
      spot2.position.z = Math.cos(elapsedTime * 0.9 + 1) * 3;
      spot2.target = hostGroup;

      // Host Animation
      if (hostGroup) {
        if (currentReact === 'correct' || currentReact === 'victory') {
          // Jumping and celebrating!
          hostGroup.position.y = Math.abs(Math.sin(elapsedTime * 8)) * 0.35;
          if (hostHeadRef.current) hostHeadRef.current.rotation.y = Math.sin(elapsedTime * 6) * 0.3;
          if (armL) armL.rotation.z = Math.PI * 0.85 + Math.sin(elapsedTime * 10) * 0.2;
          if (armR) armR.rotation.z = -Math.PI * 0.85 - Math.sin(elapsedTime * 10) * 0.2;
          spot1.color.setHex(0xfbbf24); // Gold flash
          spot2.color.setHex(0x38bdf8);
        } else if (currentReact === 'wrong') {
          // Disappointment / head down
          hostGroup.position.y = 0;
          if (hostHeadRef.current) {
            hostHeadRef.current.rotation.x = 0.35;
            hostHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.2;
          }
          if (armL) armL.rotation.z = 0.2;
          if (armR) armR.rotation.z = -0.2;
          spot1.color.setHex(0xef4444); // Red moody
          spot2.color.setHex(0xb91c1c);
        } else if (currentReact === 'speaking') {
          // Presenter talking & gesturing
          hostGroup.position.y = 0;
          if (hostHeadRef.current) {
            hostHeadRef.current.rotation.x = Math.sin(elapsedTime * 6) * 0.1;
            hostHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.15;
          }
          if (armL) armL.rotation.x = Math.sin(elapsedTime * 4) * 0.3 + 0.4;
          if (armR) armR.rotation.z = -Math.sin(elapsedTime * 5) * 0.4 - 0.3;
          spot1.color.setHex(0x38bdf8);
          spot2.color.setHex(0xf59e0b);
        } else {
          // Idle breathing
          hostGroup.position.y = Math.sin(elapsedTime * 2) * 0.03;
          if (hostHeadRef.current) {
            hostHeadRef.current.rotation.x = 0;
            hostHeadRef.current.rotation.y = Math.sin(elapsedTime * 1.5) * 0.08;
          }
          if (armL) armL.rotation.z = 0.1 + Math.sin(elapsedTime * 2) * 0.05;
          if (armR) armR.rotation.z = -0.1 - Math.sin(elapsedTime * 2) * 0.05;
          spot1.color.setHex(0x38bdf8);
          spot2.color.setHex(0xf59e0b);
        }
      }

      // Audience Animation
      audienceList.forEach(s => {
        if (currentReact === 'correct' || currentReact === 'victory') {
          // Audience jumping & cheering
          s.group.position.y = s.baseY + Math.abs(Math.sin(elapsedTime * 8 + s.phase)) * 0.25;
          s.group.rotation.x = Math.sin(elapsedTime * 10 + s.phase) * 0.1;
        } else if (currentReact === 'wrong') {
          // Audience slumping
          s.group.position.y = s.baseY - 0.1;
          s.group.rotation.x = 0.2;
        } else {
          // Idle gentle movement
          s.group.position.y = s.baseY + Math.sin(elapsedTime * 2 + s.phase) * 0.03;
          s.group.rotation.x = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
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
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose materials & geometries
      stageGeo.dispose();
      stageMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      headGeo.dispose();
      headMat.dispose();
    };
  }, [theme, themeColor]);

  return (
    <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-xl border-2 border-slate-800 bg-slate-950">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* TV Show HUD Overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[11px] font-mono font-black text-white tracking-widest uppercase">
            DIRECT · PLATEAU TV 3D
          </span>
        </div>

        <div className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 backdrop-blur-md border border-indigo-400/30">
          Public en direct (100% Low Poly)
        </div>
      </div>
    </div>
  );
}
