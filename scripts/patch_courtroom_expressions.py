import re

file_path = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\Courtroom3DCanvas.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Mise à jour de CAMERA_PRESETS pour des plans beaucoup plus expressifs et rapprochés
camera_presets_old = r"export const CAMERA_PRESETS = \{[\s\S]*?\n\};\n"
camera_presets_new = """export const CAMERA_PRESETS = {
  TV_WIDE: {
    pos: [0, 3.8, 7.2],
    look: [0, 1.8, -1.8],
    fov: 44,
    label: "Plan d'Ensemble Tribunal"
  },
  JUDGE: {
    pos: [0, 3.2, -2.4],
    look: [0, 2.9, -5.2],
    fov: 30,
    label: "Plan Rapproché Juge"
  },
  WITNESS: {
    pos: [0.55, 1.85, -0.6],
    look: [0, 1.68, 0.72],
    fov: 32,
    label: "Plan Face Maxime"
  },
  DEFENSE: {
    pos: [2.8, 2.15, 1.1],
    look: [4.4, 1.78, -0.2],
    fov: 30,
    label: "Banc de la Défense"
  },
  PROSECUTION: {
    pos: [-2.8, 2.15, 1.1],
    look: [-4.4, 1.78, -0.2],
    fov: 30,
    label: "Banc de l'Accusation"
  },
  AUDIENCE: {
    pos: [0, 2.4, -1.5],
    look: [0, 1.6, 6.2],
    fov: 48,
    label: "Tribune du Public"
  }
};
"""
code = re.sub(camera_presets_old, camera_presets_new, code, count=1)

# 2. Ajout des helpers createExpressiveEye et createExpressiveMouth juste avant le composant
helpers_marker = "export default function Courtroom3DCanvas({"
helpers_code = """// --- HELPERS PIXAR 3D : YEUX EXPRESSIFS & BOUCHES ARTICULÉES ---
function createExpressiveEye(side, posX, posY, posZ, irisColorHex, radius = 0.058) {
  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(posX, posY, posZ);

  // Sclère blanche satinée
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08 });
  const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), eyeWhiteMat);
  eyeBall.scale.set(1.0, 0.95, 0.85);
  eyeGroup.add(eyeBall);

  // Iris colorée vive
  const irisMat = new THREE.MeshStandardMaterial({ color: irisColorHex, roughness: 0.12 });
  const iris = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.64, 16, 16), irisMat);
  iris.position.set(0, 0, radius * 0.58);
  iris.scale.set(1, 1, 0.35);
  eyeGroup.add(iris);

  // Pupille noire profonde
  const pupMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.35, 14, 14), pupMat);
  pupil.position.set(0, 0, radius * 0.76);
  pupil.scale.set(1, 1, 0.25);
  eyeGroup.add(pupil);

  // Double éclat Pixar (Catchlights)
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const glint1 = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.15, 8, 8), glintMat);
  glint1.position.set(radius * 0.22, radius * 0.22, radius * 0.82);
  eyeGroup.add(glint1);

  const glint2 = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.08, 8, 8), glintMat);
  glint2.position.set(-radius * 0.14, -radius * 0.14, radius * 0.82);
  eyeGroup.add(glint2);

  return { eyeGroup, iris, pupil };
}

function createExpressiveMouth(lipColorHex, width = 0.22, height = 0.045) {
  const mouthGroup = new THREE.Group();

  // Cavité buccale sombre
  const cavityMat = new THREE.MeshBasicMaterial({ color: 0x180308 });
  const cavity = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, height * 1.8, 0.04), cavityMat);
  cavity.position.set(0, 0, 0.01);
  cavity.scale.set(1, 0.15, 1);
  mouthGroup.add(cavity);

  // Dents blanches supérieures
  const teethMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.1 });
  const teeth = new THREE.Mesh(new THREE.BoxGeometry(width * 0.68, 0.018, 0.03), teethMat);
  teeth.position.set(0, 0.012, 0.02);
  mouthGroup.add(teeth);

  // Lèvre supérieure
  const lipMat = new THREE.MeshStandardMaterial({ color: lipColorHex, roughness: 0.3 });
  const lipUpper = new THREE.Mesh(new THREE.BoxGeometry(width, 0.022, 0.05), lipMat);
  lipUpper.position.set(0, 0.018, 0.03);
  mouthGroup.add(lipUpper);

  // Lèvre inférieure mobile
  const lipLower = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, 0.024, 0.05), lipMat);
  lipLower.position.set(0, -0.018, 0.03);
  mouthGroup.add(lipLower);

  return { mouthGroup, cavity, teeth, lipUpper, lipLower };
}

export default function Courtroom3DCanvas({"""
code = code.replace(helpers_marker, helpers_code, 1)

# 3. Remplacement visage Juge
old_judge_face = r"// Yeux expressifs avec double catchlight Pixar[\s\S]*?judgeHeadRef\.current = judgeHeadGroup;"
new_judge_face = """// Yeux expressifs avec double catchlight Pixar
    const judgeEyes = [];
    for (let side of [-1, 1]) {
      const eyeData = createExpressiveEye(side, side * 0.11, 0.045, 0.24, 0x1d4ed8, 0.060);
      judgeHeadGroup.add(eyeData.eyeGroup);
      judgeEyes.push(eyeData);
    }
    judgeEyesRef.current = judgeEyes;

    // Nez de magistrat digne
    const judgeNose = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.14, 16), skinToneJudge);
    judgeNose.position.set(0, -0.02, 0.28);
    judgeNose.rotation.x = 0.2;
    judgeHeadGroup.add(judgeNose);

    // Bouche articulée expressive (Lèvres, dents, cavité)
    const judgeMouthData = createExpressiveMouth(0x64748b, 0.24, 0.048);
    judgeMouthData.mouthGroup.position.set(0, -0.16, 0.26);
    judgeHeadGroup.add(judgeMouthData.mouthGroup);
    judgeMouthRef.current = judgeMouthData;

    // Sourcils mobiles
    const browGeo = new THREE.BoxGeometry(0.16, 0.045, 0.05);
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
    judgeHeadRef.current = judgeHeadGroup;"""
code = re.sub(old_judge_face, new_judge_face, code, count=1)

# 4. Remplacement visage Témoin (Maxime)
old_wit_face = r"// Yeux de Maxime \(Témoin\)[\s\S]*?witnessHeadRef\.current = witHeadGroup;"
new_wit_face = """// Yeux de Maxime (Témoin)
    const witEyes = [];
    for (let side of [-1, 1]) {
      const eyeData = createExpressiveEye(side, side * 0.10, 0.035, 0.24, 0x92400e, 0.056);
      witHeadGroup.add(eyeData.eyeGroup);
      witEyes.push(eyeData);
    }
    witnessEyesRef.current = witEyes;

    const witNose = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.032, 0.12, 16), skinToneWitness);
    witNose.position.set(0, -0.02, 0.27);
    witNose.rotation.x = 0.22;
    witHeadGroup.add(witNose);

    const witMouthData = createExpressiveMouth(0xbe123c, 0.22, 0.044);
    witMouthData.mouthGroup.position.set(0, -0.12, 0.25);
    witHeadGroup.add(witMouthData.mouthGroup);
    witnessMouthRef.current = witMouthData;

    // Sourcils
    const witBrowGeo = new THREE.BoxGeometry(0.14, 0.038, 0.05);
    const witBrowMat = new THREE.MeshStandardMaterial({ color: 0x3e2316, roughness: 0.8 });
    const witBrowL = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowL.position.set(-0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowL);
    witnessLeftBrowRef.current = witBrowL;

    const witBrowR = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowR.position.set(0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowR);
    witnessRightBrowRef.current = witBrowR;

    witnessGroup.add(witHeadGroup);
    witnessHeadRef.current = witHeadGroup;"""
code = re.sub(old_wit_face, new_wit_face, code, count=1)

# Rendre le témoin orienté de 3/4 vers la caméra pour qu'on voie son visage et ses expressions
code = code.replace("witnessGroup.rotation.y = Math.PI; // Face au Juge", "witnessGroup.rotation.y = Math.PI * 0.86; // 3/4 face visible au tribunal")

# 5. Remplacement visage Défense (Me Alex)
old_def_face = r"// Yeux expressifs de la défense[\s\S]*?defHeadRef\.current = defHeadGroup;"
new_def_face = """// Yeux expressifs de la défense
    const defEyes = [];
    for (let side of [-1, 1]) {
      const eyeData = createExpressiveEye(side, side * 0.10, 0.045, 0.23, 0x0284c7, 0.056);
      defHeadGroup.add(eyeData.eyeGroup);
      defEyes.push(eyeData);
    }
    defEyesRef.current = defEyes;

    // Bouche expressive de l'avocat de la défense
    const defMouthData = createExpressiveMouth(0x475569, 0.22, 0.044);
    defMouthData.mouthGroup.position.set(0, -0.12, 0.24);
    defHeadGroup.add(defMouthData.mouthGroup);
    defMouthRef.current = defMouthData;

    // Sourcils plaidants déterminés
    const defBrowGeo = new THREE.BoxGeometry(0.13, 0.035, 0.04);
    const defBrowMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const defBrowL = new THREE.Mesh(defBrowGeo, defBrowMat);
    defBrowL.position.set(-0.10, 0.12, 0.23);
    defBrowL.rotation.z = 0.14;
    defHeadGroup.add(defBrowL);
    defLeftBrowRef.current = defBrowL;

    const defBrowR = new THREE.Mesh(defBrowGeo, defBrowMat);
    defBrowR.position.set(0.10, 0.12, 0.23);
    defBrowR.rotation.z = -0.14;
    defHeadGroup.add(defBrowR);
    defRightBrowRef.current = defBrowR;

    defGroup.add(defHeadGroup);
    defHeadRef.current = defHeadGroup;"""
code = re.sub(old_def_face, new_def_face, code, count=1)

# Orientation du banc de la défense
code = code.replace("defGroup.rotation.y = -Math.PI / 6;", "defGroup.rotation.y = -Math.PI / 4.5;")

# 6. Remplacement visage Procureur
old_pros_face = r"const prosEyes = \[\];[\s\S]*?prosGroup\.add\(prosHeadGroup\);"
new_pros_face = """const prosEyes = [];
    for (let side of [-1, 1]) {
      const eyeData = createExpressiveEye(side, side * 0.10, 0.05, 0.22, 0xb45309, 0.058);
      prosHeadGroup.add(eyeData.eyeGroup);
      prosEyes.push(eyeData);
    }
    prosEyesRef.current = prosEyes;

    // Bouche accusatrice du Procureur
    const prosMouthData = createExpressiveMouth(0x9f1239, 0.24, 0.046);
    prosMouthData.mouthGroup.position.set(0, -0.13, 0.24);
    prosHeadGroup.add(prosMouthData.mouthGroup);
    prosMouthRef.current = prosMouthData;

    // Sourcils agressifs et froncés
    const prosBrowGeo = new THREE.BoxGeometry(0.14, 0.038, 0.04);
    const prosBrowMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const prosBrowL = new THREE.Mesh(prosBrowGeo, prosBrowMat);
    prosBrowL.position.set(-0.10, 0.13, 0.23);
    prosBrowL.rotation.z = -0.36;
    prosHeadGroup.add(prosBrowL);
    prosLeftBrowRef.current = prosBrowL;

    const prosBrowR = new THREE.Mesh(prosBrowGeo, prosBrowMat);
    prosBrowR.position.set(0.10, 0.13, 0.23);
    prosBrowR.rotation.z = 0.36;
    prosHeadGroup.add(prosBrowR);
    prosRightBrowRef.current = prosBrowR;

    prosGroup.add(prosHeadGroup);"""
code = re.sub(old_pros_face, new_pros_face, code, count=1)

# Orientation du banc du procureur
code = code.replace("prosGroup.rotation.y = Math.PI / 6;", "prosGroup.rotation.y = Math.PI / 4.5;")

# 7. Animation des Yeux & Lèvres dans la boucle animate()
old_anim_block = r"// Clignement d'yeux naturel[\s\S]*?// Animation du Juge et Frappe du Marteau"
new_anim_block = """// Clignement d'yeux naturel & Saccades du regard pour TOUS les protagonistes
      blinkTimer += delta;
      const isBlinking = blinkTimer > 3.2 && blinkTimer < 3.38;
      const blinkScale = isBlinking ? 0.08 : 1.0;
      if (blinkTimer > 3.6) blinkTimer = 0;

      // Micro-saccades vivantes du regard
      const gazeX = Math.sin(elapsedTime * 0.9) * 0.007 + Math.sin(elapsedTime * 2.3) * 0.003;
      const gazeY = Math.cos(elapsedTime * 0.7) * 0.003;

      const updateCharacterEyes = (eyesList) => {
        if (!eyesList) return;
        eyesList.forEach(e => {
          if (e && e.eyeGroup) {
            e.eyeGroup.scale.y = blinkScale;
            if (e.iris && e.pupil) {
              e.iris.position.x = gazeX;
              e.iris.position.y = gazeY;
              e.pupil.position.x = gazeX * 1.1;
              e.pupil.position.y = gazeY * 1.1;
            }
          }
        });
      };

      updateCharacterEyes(judgeEyesRef.current);
      updateCharacterEyes(witnessEyesRef.current);
      updateCharacterEyes(defEyesRef.current);
      updateCharacterEyes(prosEyesRef.current);

      // Interpolation fluide de la caméra cinématique
      camera.position.lerp(targetCamPos.current, 0.045);
      currentCamLook.current.lerp(targetCamLook.current, 0.045);
      camera.lookAt(currentCamLook.current);

      // --- ANIMATION TÉMOIN (MAXIME) ---
      const curWitnessState = witnessStateRef.current;
      const witM = witnessMouthRef.current;
      if (witnessHeadRef.current) {
        if (curWitnessState === 'speaking') {
          const witSpeech = Math.max(0, Math.sin(elapsedTime * 15)) * (0.6 + 0.4 * Math.sin(elapsedTime * 22));
          witnessHeadRef.current.rotation.x = Math.sin(elapsedTime * 4) * 0.06;
          witnessHeadRef.current.rotation.y = Math.sin(elapsedTime * 2) * 0.08;
          if (witM) {
            witM.cavity.scale.y = 0.3 + witSpeech * 2.2;
            witM.lipLower.position.y = -0.018 - witSpeech * 0.04;
          }
        } else if (curWitnessState === 'stressed') {
          witnessHeadRef.current.rotation.x = 0.12;
          witnessHeadRef.current.rotation.y = Math.sin(elapsedTime * 10) * 0.10;
          if (witnessLeftBrowRef.current && witnessRightBrowRef.current) {
            witnessLeftBrowRef.current.rotation.z = 0.35;
            witnessRightBrowRef.current.rotation.z = -0.35;
          }
          if (witM) {
            witM.cavity.scale.y = 0.25;
            witM.mouthGroup.scale.set(0.95, 1.15, 1);
          }
        } else {
          witnessHeadRef.current.rotation.x = Math.sin(elapsedTime * 1.5) * 0.03;
          witnessHeadRef.current.rotation.y = 0;
          if (witM) {
            witM.cavity.scale.y = 0.15 + Math.sin(elapsedTime * 2.0) * 0.03;
            witM.lipLower.position.y = -0.018;
            witM.mouthGroup.scale.set(1, 1, 1);
          }
        }
      }

      // --- ANIMATION PROCUREUR (ACCUSATION) ---
      const curProsState = prosecutorStateRef.current;
      const prosM = prosMouthRef.current;
      if (prosArmRef.current) {
        if (curProsState === 'speaking' || curProsState === 'attacking') {
          const prosSpeech = Math.max(0, Math.sin(elapsedTime * 16)) * (0.7 + 0.3 * Math.sin(elapsedTime * 25));
          prosArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 4) * 0.25;
          prosArmRef.current.rotation.z = Math.sin(elapsedTime * 3) * 0.15;
          if (prosHeadRef.current) {
            prosHeadRef.current.rotation.y = Math.sin(elapsedTime * 4) * 0.14;
            prosHeadRef.current.rotation.x = -0.06 + Math.sin(elapsedTime * 8) * 0.05;
          }
          if (prosM) {
            prosM.cavity.scale.y = 0.4 + prosSpeech * 2.6;
            prosM.lipLower.position.y = -0.018 - prosSpeech * 0.048;
          }
          if (prosLeftBrowRef.current && prosRightBrowRef.current) {
            prosLeftBrowRef.current.rotation.z = -0.44;
            prosRightBrowRef.current.rotation.z = 0.44;
          }
        } else {
          prosArmRef.current.rotation.x = 0;
          prosArmRef.current.rotation.z = 0;
          if (prosM) {
            prosM.cavity.scale.y = 0.15;
            prosM.lipLower.position.y = -0.018;
          }
          if (prosLeftBrowRef.current && prosRightBrowRef.current) {
            prosLeftBrowRef.current.rotation.z = -0.32;
            prosRightBrowRef.current.rotation.z = 0.32;
          }
        }
      }

      // --- ANIMATION DÉFENSE (ME ALEX) ---
      const curDefState = defenseStateRef.current;
      const defM = defMouthRef.current;
      if (defArmRef.current) {
        if (curDefState === 'pleading' || curDefState === 'speaking') {
          const defSpeech = Math.max(0, Math.sin(elapsedTime * 14)) * (0.65 + 0.35 * Math.cos(elapsedTime * 8));
          defArmRef.current.rotation.x = -Math.PI / 3.2 + Math.sin(elapsedTime * 3.5) * 0.22;
          defArmRef.current.rotation.z = -Math.sin(elapsedTime * 2.5) * 0.18;
          if (defHeadRef.current) {
            defHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.12;
            defHeadRef.current.rotation.x = 0.05 + Math.sin(elapsedTime * 5) * 0.05;
          }
          if (defM) {
            defM.cavity.scale.y = 0.35 + defSpeech * 2.4;
            defM.lipLower.position.y = -0.018 - defSpeech * 0.042;
          }
          if (defLeftBrowRef.current && defRightBrowRef.current) {
            defLeftBrowRef.current.position.y = 0.15;
            defLeftBrowRef.current.rotation.z = 0.20;
            defRightBrowRef.current.position.y = 0.15;
            defRightBrowRef.current.rotation.z = -0.20;
          }
        } else {
          defArmRef.current.rotation.x = 0;
          defArmRef.current.rotation.z = 0;
          if (defM) {
            defM.cavity.scale.y = 0.15;
            defM.lipLower.position.y = -0.018;
          }
          if (defLeftBrowRef.current && defRightBrowRef.current) {
            defLeftBrowRef.current.position.y = 0.12;
            defLeftBrowRef.current.rotation.z = 0.14;
            defRightBrowRef.current.position.y = 0.12;
            defRightBrowRef.current.rotation.z = -0.14;
          }
        }
      }

      // --- RÉACTION FACIALE PRÉCISE DU JUGE & LIP-SYNC ---
      const currentJudgeReaction = judgeReactionRef.current;
      const currentJudgeState = judgeStateRef.current;
      const jM = judgeMouthRef.current;

      if (judgeHeadRef.current && jM) {
        if (currentJudgeState === 'gavel' || isGavelStriking) {
          judgeHeadRef.current.rotation.x = -0.12;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 18) * 0.14;
          judgeHeadRef.current.rotation.z = Math.sin(elapsedTime * 14) * 0.05;
          jM.cavity.scale.y = 2.8;
          jM.lipLower.position.y = -0.065;
          jM.lipUpper.position.y = 0.025;
          jM.mouthGroup.scale.set(1.4, 1.4, 1);

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.08;
            judgeLeftBrowRef.current.rotation.z = -0.45;
            judgeRightBrowRef.current.position.y = 0.08;
            judgeRightBrowRef.current.rotation.z = 0.45;
          }
        } else if (currentJudgeState === 'speaking') {
          // Parole animée du juge
          const judgeSpeech = Math.max(0, Math.sin(elapsedTime * 14)) * (0.6 + 0.4 * Math.cos(elapsedTime * 6));
          judgeHeadRef.current.rotation.x = 0.04 + Math.sin(elapsedTime * 3.5) * 0.04;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 2) * 0.06;
          jM.cavity.scale.y = 0.4 + judgeSpeech * 2.2;
          jM.lipLower.position.y = -0.018 - judgeSpeech * 0.042;
          jM.lipUpper.position.y = 0.018 + judgeSpeech * 0.012;
          jM.mouthGroup.scale.set(1.1, 1.1, 1);
        } else if (currentJudgeReaction === 'smile') {
          judgeHeadRef.current.rotation.x = 0.12 + Math.sin(elapsedTime * 6) * 0.08;
          judgeHeadRef.current.rotation.y = 0;
          jM.cavity.scale.y = 0.2;
          jM.lipLower.position.y = -0.015;
          jM.mouthGroup.scale.set(1.4, 1.2, 1);

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.17;
            judgeLeftBrowRef.current.rotation.z = 0.18;
            judgeRightBrowRef.current.position.y = 0.17;
            judgeRightBrowRef.current.rotation.z = -0.18;
          }
        } else if (currentJudgeReaction === 'frown') {
          judgeHeadRef.current.rotation.x = -0.08;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 10) * 0.18;
          jM.cavity.scale.y = 0.8;
          jM.lipLower.position.y = -0.035;
          jM.mouthGroup.scale.set(1.1, 1.3, 1);

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.10;
            judgeLeftBrowRef.current.rotation.z = -0.38;
            judgeRightBrowRef.current.position.y = 0.10;
            judgeRightBrowRef.current.rotation.z = 0.38;
          }
        } else {
          judgeHeadRef.current.rotation.set(0, 0, 0);
          jM.cavity.scale.y = 0.15 + Math.sin(elapsedTime * 2.0) * 0.03;
          jM.lipLower.position.y = -0.018;
          jM.lipUpper.position.y = 0.018;
          jM.mouthGroup.scale.set(1, 1, 1);
          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            judgeLeftBrowRef.current.position.y = 0.14;
            judgeLeftBrowRef.current.rotation.z = 0;
            judgeRightBrowRef.current.position.y = 0.14;
            judgeRightBrowRef.current.rotation.z = 0;
          }
        }
      }

      // Animation du Juge et Frappe du Marteau"""
code = re.sub(old_anim_block, new_anim_block, code, count=1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Courtroom3DCanvas.jsx patched successfully with expressive eyes and mouths!")
