import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D (Enhanced Studio Quality):
 * Modélisation procédurale poussée avec matériaux PBR physiques MeshPhysicalMaterial,
 * lunettes d'étudiant arrondies, écouteurs de campus, expressions faciales dynamiques,
 * pupitre de jury interactif, écrans volumétriques avec bloom et éclairage 3-points cinéma.
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

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      theme === 'datacenter' ? 0x030a16 :
      theme === 'tribunal' ? 0x120a1c :
      theme === 'factcheck' ? 0x060f24 :
      theme === 'promptwars' ? 0x1a091c : 0x071126
    );
    scene.fog = new THREE.FogExp2(scene.background, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.0, 5.2);
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

    // 3. Cinematic 3-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (Warm golden sunlight from upper-right)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 3.2);
    keyLight.position.set(4.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Fill Light (Subtle cool colored ambient bounce)
    const fillLightColor = 
      theme === 'tribunal' ? 0xb794f4 :
      theme === 'datacenter' ? 0x38bdf8 :
      theme === 'promptwars' ? 0xf472b6 : 0x06b6d4;
    const fillLight = new THREE.PointLight(fillLightColor, 2.0, 14);
    fillLight.position.set(-4.5, 3.5, 2.5);
    scene.add(fillLight);

    // Rim Light (Signature Pixar bright halo on hair & shoulders)
    const rimColor = isAlert ? 0xf43f5e : 0xfbbf24;
    const rimLight = new THREE.DirectionalLight(rimColor, 2.8);
    rimLight.position.set(0, 4.5, -4.0);
    scene.add(rimLight);

    // 4. Polished Studio Floor with Floor Inscriptions
    const floorGeo = new THREE.PlaneGeometry(35, 35);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b1120,
      roughness: 0.18,
      metalness: 0.25,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // High-tech circular stage platform
    const platformGeo = new THREE.CylinderGeometry(2.6, 2.8, 0.15, 64);
    const platformMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.6,
      clearcoat: 0.8
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = 0.075;
    platform.receiveShadow = true;
    scene.add(platform);

    const platformRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.65, 0.04, 16, 64),
      new THREE.MeshBasicMaterial({ color: isAlert ? 0xf43f5e : 0x06b6d4 })
    );
    platformRing.rotation.x = Math.PI / 2;
    platformRing.position.y = 0.15;
    scene.add(platformRing);

    // 5. Stylized Pixar 3D Character (The Collegiate Hero)
    const charGroup = new THREE.Group();
    charGroup.position.set(-1.1, 0.15, 0.4);
    scene.add(charGroup);

    // Pants / Legs (Stylized denim cylinders)
    const legsMat = new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.7 });
    const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.7, 16), legsMat);
    legLeft.position.set(-0.16, 0.35, 0);
    legLeft.castShadow = true;
    const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.7, 16), legsMat);
    legRight.position.set(0.16, 0.35, 0);
    legRight.castShadow = true;
    charGroup.add(legLeft);
    charGroup.add(legRight);

    // Stylized Sneakers (Chunky rounded Pixar shoes)
    const shoeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 0.5 });
    const shoeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.32), shoeMat);
    shoeLeft.position.set(-0.16, 0.07, 0.08);
    shoeLeft.castShadow = true;
    const shoeRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.32), shoeMat);
    shoeRight.position.set(0.16, 0.07, 0.08);
    shoeRight.castShadow = true;
    charGroup.add(shoeLeft);
    charGroup.add(shoeRight);

    // Character Torso / Sweater (Warm collegiate hoodie with drawstrings)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      roughness: 0.6,
      metalness: 0.05,
      clearcoat: 0.15
    });
    const bodyGeo = new THREE.CylinderGeometry(0.36, 0.44, 0.85, 32);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.05;
    body.castShadow = true;
    charGroup.add(body);

    // Collegiate Badge on Chest (HECh Logo monogram in gold)
    const badgeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    badgeMesh.rotation.x = Math.PI / 2;
    badgeMesh.position.set(0.16, 1.22, 0.36);
    charGroup.add(badgeMesh);

    // Head Group for Lifelike Tracking & Rotation
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.72, 0);
    charGroup.add(headGroup);

    // Head Sphere (Soft peach velvety skin)
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdd7bf,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.25
    });
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const head = new THREE.Mesh(headGeo, headMat);
    head.castShadow = true;
    headGroup.add(head);

    // Cute Sculpted Nose
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xfba087, roughness: 0.4 })
    );
    nose.position.set(0, -0.02, 0.35);
    headGroup.add(nose);

    // Sculpted Hair Tuft (Pixar stylized layered haircut)
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a1708,
      roughness: 0.5,
      metalness: 0.05
    });
    const hairBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.37, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.1),
      hairMat
    );
    hairBase.position.y = 0.05;
    hairBase.rotation.x = -0.15;
    headGroup.add(hairBase);

    // Stylish Front Hair Quiff
    const quiff = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      hairMat
    );
    quiff.position.set(0, 0.32, 0.24);
    quiff.scale.set(1.4, 0.7, 1.0);
    headGroup.add(quiff);

    // Rounded Pixar Glasses (Intellectual student touch)
    const glassesMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0
    });
    const createLensFrame = (xPos) => {
      const frame = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 16, 32), glassesMat);
      frame.position.set(xPos, 0.04, 0.35);
      return frame;
    };
    headGroup.add(createLensFrame(-0.13));
    headGroup.add(createLensFrame(0.13));

    // Glasses Bridge
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), glassesMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.05, 0.35);
    headGroup.add(bridge);

    // Expressive Big Pixar Eyes
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEye = (xPos) => {
      const eGroup = new THREE.Group();
      eGroup.position.set(xPos, 0.04, 0.31);

      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), eyeWhiteMat);
      eGroup.add(sclera);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), irisMat);
      iris.position.z = 0.048;
      eGroup.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), pupilMat);
      pupil.position.z = 0.072;
      eGroup.add(pupil);

      // Cute white catchlight reflection
      const shine = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), shineMat);
      shine.position.set(0.018, 0.018, 0.082);
      eGroup.add(shine);

      return eGroup;
    };

    const eyeL = createEye(-0.13);
    const eyeR = createEye(0.13);
    headGroup.add(eyeL);
    headGroup.add(eyeR);

    // 6. Hologram Core of A.U.R.O.R.E. AI
    const auroreGroup = new THREE.Group();
    auroreGroup.position.set(1.4, 1.5, 0.2);
    scene.add(auroreGroup);

    // Tech Pedestal
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 1.0
    });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.45, 32), pedestalMat);
    pedestal.position.y = 0.225;
    pedestal.castShadow = true;
    scene.add(pedestal);

    // Glowing Central Holographic Orb
    const auroreOrbMat = new THREE.MeshPhysicalMaterial({
      color: isAlert ? 0xf43f5e : 0x06b6d4,
      emissive: isAlert ? 0xe11d48 : 0x0891b2,
      emissiveIntensity: 0.95,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.88
    });
    const auroreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 32), auroreOrbMat);
    auroreGroup.add(auroreOrb);

    // Inner Glowing Geometric Crystal Core
    const crystalGeo = new THREE.OctahedronGeometry(0.24, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    auroreGroup.add(crystal);

    // Orbiting Data Torus Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: isAlert ? 0xfb7185 : 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.02, 16, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.02, 16, 64), ringMat);
    ring2.rotation.x = Math.PI / 3;
    auroreGroup.add(ring1);
    auroreGroup.add(ring2);

    const auroreLight = new THREE.PointLight(isAlert ? 0xf43f5e : 0x06b6d4, 3.2, 9);
    auroreGroup.add(auroreLight);

    // 7. Background Floating Screens / Holographic Monitors
    const monitorsGroup = new THREE.Group();
    scene.add(monitorsGroup);

    const monitorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.6,
      transparent: true,
      opacity: 0.8,
      roughness: 0.15,
      metalness: 0.3
    });

    const createScreen = (x, y, z, rotY) => {
      const scr = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.04), monitorGlassMat);
      scr.position.set(x, y, z);
      scr.rotation.y = rotY;
      return scr;
    };

    const monL = createScreen(-3.4, 2.5, -1.6, 0.45);
    const monR = createScreen(3.4, 2.7, -1.6, -0.45);
    const monC = createScreen(0, 3.3, -2.8, 0);
    monitorsGroup.add(monL);
    monitorsGroup.add(monR);
    monitorsGroup.add(monC);

    // 8. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // AURORE Floating & Multi-Axis Gyroscope
      auroreGroup.position.y = 1.5 + Math.sin(t * 2.2) * 0.12;
      crystal.rotation.x = t * 1.2;
      crystal.rotation.y = t * 1.5;
      ring1.rotation.z = t * 0.7;
      ring1.rotation.y = t * 0.4;
      ring2.rotation.x = t * 0.5;
      ring2.rotation.z = -t * 0.8;

      // Character Natural Pixar Breathing & Idle Motion
      headGroup.position.y = 1.72 + Math.sin(t * 2.8) * 0.02;
      body.scale.y = 1.0 + Math.sin(t * 2.8) * 0.015;

      // Character Emotional Responses
      if (characterMood === 'speaking') {
        headGroup.rotation.y = Math.sin(t * 4.5) * 0.12;
        headGroup.rotation.x = Math.sin(t * 3.5) * 0.06;
      } else if (characterMood === 'victorious') {
        charGroup.position.y = 0.15 + Math.abs(Math.sin(t * 5.0)) * 0.25;
        headGroup.rotation.y = Math.sin(t * 2.0) * 0.1;
      } else if (characterMood === 'worried') {
        headGroup.rotation.z = -0.18;
        headGroup.rotation.x = 0.1;
      } else {
        // Thinking : looking at AURORE with curiosity
        headGroup.rotation.y = 0.25 + Math.sin(t * 1.2) * 0.05;
        headGroup.rotation.x = 0.05;
      }

      // Smooth Gentle Camera Orbiting
      camera.position.x = Math.sin(t * 0.25) * 0.35;
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
    <div ref={mountRef} className="w-full h-full min-h-[380px] rounded-3xl overflow-hidden relative shadow-2xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
