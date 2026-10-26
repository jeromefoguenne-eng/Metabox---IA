import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D:
 * Rendu 3D temps réel procédural d'excellence avec éclairage 3-points,
 * matériaux physiques PBR lisses, teintes chaudes vibrantes et personnages/décors stylisés Pixar.
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

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      theme === 'datacenter' ? 0x050d1a :
      theme === 'tribunal' ? 0x140e1f :
      theme === 'factcheck' ? 0x0b1326 :
      theme === 'promptwars' ? 0x1a0f1d : 0x0a1128
    );
    scene.fog = new THREE.FogExp2(scene.background, 0.04);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);
    camera.lookAt(0, 1.2, 0);

    // 2. Renderer with Pixar PBR Lighting & ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 3. Lighting Rig (3-Point Pixar Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key Light (Warm main spotlight)
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Soft cool cyan/purple bounce)
    const fillColor = theme === 'tribunal' ? 0xc084fc : 0x38bdf8;
    const fillLight = new THREE.PointLight(fillColor, 1.6, 12);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    // Rim Light (Vibrant edge light for classic Pixar character silhouette)
    const rimLight = new THREE.DirectionalLight(isAlert ? 0xf43f5e : 0xfbbf24, 2.4);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 4. Studio Environment Floor (Polished reflective stylized tile)
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid lines on floor for high-tech campus cyber feel
    const grid = new THREE.GridHelper(24, 24, 0x3b82f6, 0x1e293b);
    grid.position.y = 0.01;
    scene.add(grid);

    // 5. Stylized Pixar 3D Character (The Student Investigator)
    const charGroup = new THREE.Group();
    charGroup.position.set(-1.2, 0, 0.5);
    scene.add(charGroup);

    // Character Body (Rounded stylized sweater)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb, // Vibrant blue collegiate hoodie
      roughness: 0.55,
      metalness: 0.05,
      clearcoat: 0.2
    });
    const bodyGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.9, 32);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    charGroup.add(body);

    // Character Head (Pixar smooth friendly sphere)
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbd0b7, // Warm peach skin tone
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.3
    });
    const headGeo = new THREE.SphereGeometry(0.36, 32, 32);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.62;
    head.castShadow = true;
    charGroup.add(head);

    // Hair (Styled dark brown sculpted tuft)
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: 0x3e2723,
      roughness: 0.6,
      metalness: 0.05
    });
    const hairGeo = new THREE.SphereGeometry(0.38, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.66;
    hair.rotation.x = -0.15;
    charGroup.add(hair);

    // Stylized Big Pixar Eyes
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const pupilDotMat = new THREE.MeshBasicMaterial({ color: 0x030712 });

    const createEye = (xPos) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 1.66, 0.32);

      const white = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeWhiteMat);
      eyeGroup.add(white);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), eyePupilMat);
      iris.position.z = 0.05;
      eyeGroup.add(iris);

      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), pupilDotMat);
      dot.position.z = 0.075;
      eyeGroup.add(dot);

      return eyeGroup;
    };

    const eyeLeft = createEye(-0.11);
    const eyeRight = createEye(0.11);
    charGroup.add(eyeLeft);
    charGroup.add(eyeRight);

    // 6. The Central Hologram Pillar / A.U.R.O.R.E. AI Core
    const auroreCoreGroup = new THREE.Group();
    auroreCoreGroup.position.set(1.4, 1.5, 0);
    scene.add(auroreCoreGroup);

    // Core Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.6, 0.75, 0.5, 32);
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 0.9
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.25;
    pedestal.castShadow = true;
    scene.add(pedestal);

    // Glowing Hologram Sphere
    const auroreCoreMat = new THREE.MeshPhysicalMaterial({
      color: isAlert ? 0xf43f5e : 0x06b6d4,
      emissive: isAlert ? 0xef4444 : 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true
    });
    const auroreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), auroreCoreMat);
    auroreCoreGroup.add(auroreSphere);

    // Orbiting Data Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: isAlert ? 0xfb7185 : 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.02, 16, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.02, 16, 64), ringMat);
    ring2.rotation.x = Math.PI / 3;
    auroreCoreGroup.add(ring1);
    auroreCoreGroup.add(ring2);

    // Light cast by the AI core
    const coreLight = new THREE.PointLight(isAlert ? 0xef4444 : 0x06b6d4, 2.5, 8);
    auroreCoreGroup.add(coreLight);

    // 7. Background Floating Screens / Data Panels
    const screenGroup = new THREE.Group();
    scene.add(screenGroup);

    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.5,
      clearcoat: 0.9,
      transmission: 0.3,
      transparent: true,
      opacity: 0.85
    });

    const createScreen = (x, y, z, rotY) => {
      const scr = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.05), screenMat);
      scr.position.set(x, y, z);
      scr.rotation.y = rotY;
      return scr;
    };

    const s1 = createScreen(-3.2, 2.4, -1.8, 0.45);
    const s2 = createScreen(3.2, 2.6, -1.8, -0.45);
    const s3 = createScreen(0, 3.2, -3.2, 0);
    screenGroup.add(s1);
    screenGroup.add(s2);
    screenGroup.add(s3);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // AURORE Floating & Rotating
      auroreCoreGroup.position.y = 1.45 + Math.sin(elapsedTime * 2.2) * 0.12;
      ring1.rotation.z = elapsedTime * 0.8;
      ring1.rotation.y = elapsedTime * 0.5;
      ring2.rotation.x = elapsedTime * 0.6;
      ring2.rotation.z = -elapsedTime * 0.9;

      // Character Breathing & Idling
      head.position.y = 1.62 + Math.sin(elapsedTime * 3.0) * 0.02;
      body.scale.y = 1.0 + Math.sin(elapsedTime * 3.0) * 0.015;

      if (characterMood === 'speaking') {
        head.rotation.y = Math.sin(elapsedTime * 5.0) * 0.08;
        head.rotation.x = Math.sin(elapsedTime * 4.0) * 0.05;
      } else if (characterMood === 'victorious') {
        charGroup.position.y = Math.abs(Math.sin(elapsedTime * 4.0)) * 0.2;
      } else if (characterMood === 'worried') {
        head.rotation.z = -0.15;
      }

      // Subtle Camera Orbiting
      camera.position.x = Math.sin(elapsedTime * 0.3) * 0.4;
      camera.lookAt(0, 1.3, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isAlert, characterMood]);

  return (
    <div ref={mountRef} className="w-full h-full min-h-[340px] rounded-3xl overflow-hidden relative shadow-2xl">
      {/* Cinematic subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
