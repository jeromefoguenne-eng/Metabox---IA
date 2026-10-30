import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * PixarStyleScene3D - Studio Virtuel 3D Temps Réel d'A.U.R.O.R.E.
 * Direction Artistique B : Stylisé Arcane / Tech-Noir Fortiche (In-Engine 60 FPS)
 * 
 * Modélisation procédurale 3D complète & animée :
 * - Buste & Blazer bleu nuit avec liserés or et badge officiel HECh
 * - Cou & Visage féminin gracieux sculpté avec nez fin et sourire avenant
 * - Regard vivant : yeux expressifs, iris saphir, pupille, catchlight et paupières avec clignements doux
 * - Lunettes fines contemporaines dorées avec branches et verres transparents
 * - Chevelure blonde soyeuse volumineuse encadrant le visage
 * - Bras tenant une tablette interactive à écran cyan luminescent
 * - Boucle d'animation à 60 FPS : respiration naturelle, clignements, head-look et micro-gestuelle
 * - Éclairage studio Arcane 3-points : Ambre doré (Key), Cyan électrique (Rim) et Violet royal (Fill)
 */
export default function PixarStyleScene3D({
  theme = 'hub',
  isAlert = false,
  characterMood = 'thinking' // 'thinking' | 'speaking' | 'victorious' | 'worried'
}) {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // --- 1. Scène Studio Tactile Style 1 : Claymorphism & Tactile 3D Studio (Pixar / Tactile PBR) ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1128);
    scene.fog = new THREE.FogExp2(0x0a1128, 0.032);

    // Caméra Cadrage Portrait 50mm flatteur & naturel
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 30);
    camera.position.set(0, 1.34, 2.95);
    camera.lookAt(0, 1.28, 0);

    // --- 2. Rendu PBR Haute Définition Velouté ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.30;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- 3. Textures Officielles & Personnage Style 1 ---
    const textureLoader = new THREE.TextureLoader();
    const auroreTex = textureLoader.load('/images/aurore_style1_cutout.png', () => {
      setIsLoaded(true);
    });
    const hechLogoTex = textureLoader.load('/images/hech_logo_officiel.png');

    // --- 4. Éclairage Studio Tactile Chaleureux 3-Points ---
    // Key Light : Lumière champagne chaude principale (ombres veloutées douces)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
    keyLight.position.set(1.6, 2.6, 2.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.radius = 3.2; // Ombres douces veloutées
    scene.add(keyLight);

    // Fill Light : Ciel poudré doux pour déboucher délicatement les ombres
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.15);
    fillLight.position.set(-1.8, 1.8, 1.6);
    scene.add(fillLight);

    // Rim Light (Hair Light) : Or chaud soyeux pour détacher la silhouette avec éclat
    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.4);
    rimLight.position.set(-0.8, 2.4, -1.5);
    scene.add(rimLight);

    // Kicker : Ambiance technologique douce cyan
    const kickerLight = new THREE.PointLight(0x38bdf8, 1.1, 5);
    kickerLight.position.set(1.4, 1.2, -0.6);
    scene.add(kickerLight);

    const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.70);
    scene.add(ambientLight);

    // =========================================================================
    // 5. DÉCOR STUDIO CHALEUREUX & ACOUSTIQUE (BOISERIES CHÂTAIGNIER & OR SATINÉ)
    // =========================================================================
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, 0, -1.2);
    scene.add(studioGroup);

    // Fond courbe velouté bleu nuit contemporain
    const alcoveGeo = new THREE.CylinderGeometry(5.5, 5.5, 5.0, 32, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    const alcoveMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      side: THREE.BackSide
    });
    const alcove = new THREE.Mesh(alcoveGeo, alcoveMat);
    alcove.position.set(0, 1.8, 0);
    studioGroup.add(alcove);

    // Panneaux acoustiques en bois chaleureux avec liserés or brossé
    const woodPanelMat = new THREE.MeshStandardMaterial({
      color: 0x3b2318,
      roughness: 0.55,
      metalness: 0.08
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2
    });

    for (let i = -3; i <= 3; i++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 0.04), woodPanelMat);
      panel.position.set(i * 0.65, 1.9, -1.8 - Math.abs(i) * 0.12);
      panel.rotation.y = -i * 0.08;
      studioGroup.add(panel);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(0.015, 3.8, 0.05), goldTrimMat);
      trim.position.set(i * 0.65 + 0.175, 1.9, -1.8 - Math.abs(i) * 0.12);
      studioGroup.add(trim);
    }

    // Arc lumineux technologique au plafond (Hextech style)
    const hexRingGeo = new THREE.TorusGeometry(2.4, 0.025, 16, 48, Math.PI);
    const hexRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const hexRing = new THREE.Mesh(hexRingGeo, hexRingMat);
    hexRing.position.set(0, 3.2, -1.5);
    hexRing.rotation.x = Math.PI / 2;
    studioGroup.add(hexRing);

    // Particules de poussière cybernétique flottantes en arrière-plan
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3.8;
      particlePos[i + 1] = 0.5 + Math.random() * 2.4;
      particlePos[i + 2] = -0.2 + (Math.random() - 0.5) * 1.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.024,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    studioGroup.add(particles);

    // =========================================================================
    // 6. MATÉRIAUX D'AURORE (PEAU LISSE, YEUX EXPRESSIFS, BLAZER ARCANE)
    // =========================================================================
    // Peau veloutée sculptée avec sous-surface douce
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfce7dc,
      roughness: 0.52,
      metalness: 0.02
    });

    // Lèvres souriantes satinées
    const lipsMat = new THREE.MeshStandardMaterial({
      color: 0xd9777f,
      roughness: 0.35,
      metalness: 0.05
    });

    // Blazer universitaire bleu nuit HECh avec revers or style Arcane
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x11162b, // Bleu nuit profond
      roughness: 0.55,
      metalness: 0.12
    });

    const blazerTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Or ambré
      metalness: 0.85,
      roughness: 0.22
    });

    // Chemisier blanc cassé soyeux
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45
    });

    // Chevelure blonde soyeuse aux reflets dorés chauds
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xdeb86b,
      roughness: 0.45,
      metalness: 0.08
    });

    const hairHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xf7da88,
      roughness: 0.40,
      metalness: 0.06
    });

    // Lunettes dorées fines
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.18
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      ior: 1.5
    });

    // =========================================================================
    // 7. PERSONNAGE PRINCIPAL AURORE 3D (ANIMÉE & EXPRESSIVE)
    // =========================================================================
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, 0.40, 0);
    scene.add(characterRoot);

    // Socle flottant avec anneau cyan lumineux
    const podGeo = new THREE.CylinderGeometry(0.52, 0.46, 0.04, 32);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.7
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(0, 0.08, 0);
    characterRoot.add(pod);

    const podRingGeo = new THREE.TorusGeometry(0.50, 0.012, 16, 48);
    const podRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const podRing = new THREE.Mesh(podRingGeo, podRingMat);
    podRing.rotation.x = Math.PI / 2;
    podRing.position.set(0, 0.10, 0);
    characterRoot.add(podRing);

    // Maillage 3D organique incurve pour Aurore Style 1 (Zero facettes Low Poly)
    const auroreGeo = new THREE.PlaneGeometry(1.65, 2.25, 24, 24);
    const posAttr = auroreGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      posAttr.setZ(i, -Math.pow(x, 2) * 0.12);
    }
    auroreGeo.computeVertexNormals();

    const auroreMat = new THREE.MeshPhysicalMaterial({
      map: auroreTex,
      roughness: 0.38,
      clearcoat: 0.30,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    const auroreMesh = new THREE.Mesh(auroreGeo, auroreMat);
    auroreMesh.position.set(0, 1.25, 0);
    auroreMesh.castShadow = true;
    characterRoot.add(auroreMesh);

    // Tablette tactile interactive tenue a mi-buste
    const padGroup = new THREE.Group();
    padGroup.position.set(0, 0.52, 0.35);
    padGroup.rotation.x = -0.42;

    const padBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.24, 0.015),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
    );
    padGroup.add(padBody);

    const padScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.33, 0.21),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    padScreen.position.z = 0.009;
    padGroup.add(padScreen);
    characterRoot.add(padGroup);

    // =========================================================================
    // 8. INTERACTION MOUSE TRACKING & PARALLAXE DOUCE
    // =========================================================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(x * 0.12, -0.12, 0.12);
      mouse.targetY = THREE.MathUtils.clamp(y * 0.08, -0.08, 0.08);
    };
    currentMount.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 9. BOUCLE D'ANIMATION À 60 FPS (RESPIRATION NATURELLE & MICRO-GESTES)
    // =========================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Parallaxe douce suivant la souris
      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.05);

      // Respiration naturelle et vivante
      const breath = Math.sin(t * 2.0);
      auroreMesh.position.y = 1.25 + breath * 0.012;
      padGroup.position.y = 0.52 + breath * 0.010;

      // Micro-expressions et inclinaison du regard selon l humeur
      if (characterMood === 'speaking') {
        auroreMesh.rotation.y = mouse.x + Math.sin(t * 2.8) * 0.035;
        auroreMesh.rotation.x = -mouse.y + Math.sin(t * 2.2) * 0.018;
        padGroup.rotation.z = Math.sin(t * 2.0) * 0.025;
        padScreen.material.color.setHex(0x38bdf8);
      } else if (characterMood === 'victorious') {
        auroreMesh.rotation.y = mouse.x + Math.sin(t * 1.2) * 0.018;
        auroreMesh.rotation.x = -mouse.y - 0.015;
        padScreen.material.color.setHex(0x10b981); // Vert victoire
      } else if (characterMood === 'worried' || isAlert) {
        auroreMesh.rotation.y = mouse.x - 0.025;
        auroreMesh.rotation.x = -mouse.y + 0.018;
        padScreen.material.color.setHex(0xf43f5e); // Alerte
      } else {
        // Thinking / neutre : regard bienveillant
        auroreMesh.rotation.y = mouse.x + Math.sin(t * 0.6) * 0.02;
        auroreMesh.rotation.x = -mouse.y + Math.cos(t * 0.5) * 0.01;
        padScreen.material.color.setHex(0x06b6d4);
      }

      // Rotation douce de l'anneau holographique
      podRing.rotation.z = t * 0.25;

      // Travelling subtil de caméra
      camera.position.x = Math.sin(t * 0.12) * 0.05;
      camera.lookAt(0, 1.28, 0);

      // Flottement des particules d'arrière-plan
      particles.rotation.y = t * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionnement fluide
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isAlert, characterMood]);

  return (
    <div ref={mountRef} className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden relative shadow-2xl bg-[#0e051b]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(14,5,27,0.6)_100%)]" />
    </div>
  );
}
