import re

path = r'C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\Courtroom3DCanvas.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add refs at top
old_refs = """  const prosArmRef = useRef(null);
  const prosHeadRef = useRef(null);
  const defArmRef = useRef(null);
  const defHeadRef = useRef(null);"""

new_refs = """  const prosArmRef = useRef(null);
  const prosHeadRef = useRef(null);
  const prosMouthRef = useRef(null);
  const prosEyesRef = useRef([]);
  const prosLeftBrowRef = useRef(null);
  const prosRightBrowRef = useRef(null);

  const defArmRef = useRef(null);
  const defHeadRef = useRef(null);
  const defMouthRef = useRef(null);
  const defEyesRef = useRef([]);
  const defLeftBrowRef = useRef(null);
  const defRightBrowRef = useRef(null);"""

content = content.replace(old_refs.replace('\n', '\r\n'), new_refs.replace('\n', '\r\n'))
content = content.replace(old_refs, new_refs)

# 2. Add Defense Face (eyes, mouth, brows)
old_def_face = """    const defHair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 30, 24), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }));
    defHair.scale.set(1.02, 0.86, 1.06);
    defHair.position.set(0, 0.12, -0.02);
    defHeadGroup.add(defHair);

    defGroup.add(defHeadGroup);
    defHeadRef.current = defHeadGroup;"""

new_def_face = """    const defHair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 30, 24), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }));
    defHair.scale.set(1.02, 0.86, 1.06);
    defHair.position.set(0, 0.12, -0.02);
    defHeadGroup.add(defHair);

    // Yeux expressifs de la défense
    const defEyes = [];
    for (let side of [-1, 1]) {
      const eyeWhiteMesh = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 16), eyeWhite);
      eyeWhiteMesh.position.set(side * 0.095, 0.04, 0.22);
      defHeadGroup.add(eyeWhiteMesh);

      const eyePup = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), eyePupil);
      eyePup.position.set(side * 0.095, 0.04, 0.245);
      defHeadGroup.add(eyePup);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.095 + 0.007, 0.048, 0.252);
      defHeadGroup.add(glint);

      defEyes.push(eyeWhiteMesh);
    }
    defEyesRef.current = defEyes;

    // Bouche expressive de l'avocat de la défense
    const defMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.04, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x334155 })
    );
    defMouth.position.set(0, -0.12, 0.23);
    defHeadGroup.add(defMouth);
    defMouthRef.current = defMouth;

    // Sourcils plaidants déterminés
    const defBrowGeo = new THREE.BoxGeometry(0.11, 0.03, 0.04);
    const defBrowMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const defBrowL = new THREE.Mesh(defBrowGeo, defBrowMat);
    defBrowL.position.set(-0.10, 0.11, 0.22);
    defBrowL.rotation.z = 0.12;
    defHeadGroup.add(defBrowL);
    defLeftBrowRef.current = defBrowL;

    const defBrowR = new THREE.Mesh(defBrowGeo, defBrowMat);
    defBrowR.position.set(0.10, 0.11, 0.22);
    defBrowR.rotation.z = -0.12;
    defHeadGroup.add(defBrowR);
    defRightBrowRef.current = defBrowR;

    defGroup.add(defHeadGroup);
    defHeadRef.current = defHeadGroup;"""

content = content.replace(old_def_face.replace('\n', '\r\n'), new_def_face.replace('\n', '\r\n'))
content = content.replace(old_def_face, new_def_face)

# 3. Add Prosecutor Face (mouth, brows, eye refs)
old_pros_face = """    for (let side of [-1, 1]) {
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 16), eyePupil);
      eyeBall.scale.set(1.2, 0.5, 1.0);
      eyeBall.position.set(side * 0.10, 0.05, 0.22);
      prosHeadGroup.add(eyeBall);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.10 + 0.008, 0.062, 0.235);
      prosHeadGroup.add(glint);
    }

    prosGroup.add(prosHeadGroup);
    prosHeadRef.current = prosHeadGroup;"""

new_pros_face = """    const prosEyes = [];
    for (let side of [-1, 1]) {
      const eyeWhiteMesh = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), eyeWhite);
      eyeWhiteMesh.position.set(side * 0.10, 0.05, 0.21);
      prosHeadGroup.add(eyeWhiteMesh);

      const eyePup = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 12), eyePupil);
      eyePup.position.set(side * 0.10, 0.05, 0.238);
      prosHeadGroup.add(eyePup);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.10 + 0.008, 0.062, 0.245);
      prosHeadGroup.add(glint);

      prosEyes.push(eyeWhiteMesh);
    }
    prosEyesRef.current = prosEyes;

    // Bouche accusatrice du Procureur
    const prosMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.045, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x881337 })
    );
    prosMouth.position.set(0, -0.13, 0.23);
    prosHeadGroup.add(prosMouth);
    prosMouthRef.current = prosMouth;

    // Sourcils agressifs et froncés
    const prosBrowGeo = new THREE.BoxGeometry(0.12, 0.035, 0.04);
    const prosBrowMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const prosBrowL = new THREE.Mesh(prosBrowGeo, prosBrowMat);
    prosBrowL.position.set(-0.10, 0.13, 0.22);
    prosBrowL.rotation.z = -0.32;
    prosHeadGroup.add(prosBrowL);
    prosLeftBrowRef.current = prosBrowL;

    const prosBrowR = new THREE.Mesh(prosBrowGeo, prosBrowMat);
    prosBrowR.position.set(0.10, 0.13, 0.22);
    prosBrowR.rotation.z = 0.32;
    prosHeadGroup.add(prosBrowR);
    prosRightBrowRef.current = prosBrowR;

    prosGroup.add(prosHeadGroup);
    prosHeadRef.current = prosHeadGroup;"""

content = content.replace(old_pros_face.replace('\n', '\r\n'), new_pros_face.replace('\n', '\r\n'))
content = content.replace(old_pros_face, new_pros_face)

# 4. Update animation loop for Judge, Witness, Prosecutor, Defense expressions!
old_anim_block = """      // 12. Gestuelle et Posture du Juge (Président de la Cour d'Assises)
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
          // APPROBATION DU JUGE : Sourcils levés bienveillants, bouche souriante cyan, hochement approbateur
          judgeHeadRef.current.rotation.x = 0.08 + Math.sin(elapsedTime * 4) * 0.06;
          judgeHeadRef.current.rotation.y = 0;
          judgeHeadRef.current.rotation.z = 0;
          judgeMouthRef.current.position.y = -0.14;
          judgeMouthRef.current.scale.set(1.3, 0.7, 1);
          judgeMouthRef.current.material.color.setHex(0x059669);

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
      }"""

new_anim_block = """      // 12. Gestuelle et Posture du Juge (Président de la Cour d'Assises)
      const currentJudgeReaction = judgeReactionRef.current;
      const currentJudgeState = judgeStateRef.current;

      // Clignement d'yeux global réaliste pour tous les personnages (~toutes les 3.8s)
      const isCourtBlinking = (Math.sin(elapsedTime * 1.65) > 0.982);
      if (judgeEyesRef.current) {
        judgeEyesRef.current.forEach(eye => { eye.scale.y = isCourtBlinking ? 0.12 : 1.0; });
      }
      if (witnessEyesRef.current) {
        witnessEyesRef.current.forEach(eye => { eye.scale.y = isCourtBlinking ? 0.12 : 1.0; });
      }
      if (prosEyesRef.current) {
        prosEyesRef.current.forEach(eye => { eye.scale.y = isCourtBlinking ? 0.12 : 1.0; });
      }
      if (defEyesRef.current) {
        defEyesRef.current.forEach(eye => { eye.scale.y = isCourtBlinking ? 0.12 : 1.0; });
      }

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
        } else if (currentJudgeState === 'speaking') {
          // PAROLE DU JUGE : Visemes articulés, hochements solennels et sourcils expressifs de magistrat
          const speechViseme = Math.sin(elapsedTime * 15) * 0.5 + Math.sin(elapsedTime * 23) * 0.3 + 0.5;
          judgeMouthRef.current.position.y = -0.16 - speechViseme * 0.03;
          judgeMouthRef.current.scale.set(1.2 + speechViseme * 0.3, 1.0 + speechViseme * 2.2, 1);
          judgeMouthRef.current.material.color.setHex(0x1e293b);

          judgeHeadRef.current.rotation.x = -0.04 + Math.sin(elapsedTime * 6) * 0.05;
          judgeHeadRef.current.rotation.y = Math.sin(elapsedTime * 2.5) * 0.08;
          judgeHeadRef.current.rotation.z = Math.sin(elapsedTime * 2) * 0.03;

          if (judgeLeftBrowRef.current && judgeRightBrowRef.current) {
            const browLift = Math.sin(elapsedTime * 4) * 0.03;
            judgeLeftBrowRef.current.position.y = 0.16 + browLift;
            judgeRightBrowRef.current.position.y = 0.16 + browLift;
            judgeLeftBrowRef.current.rotation.z = -0.18 + browLift * 2;
            judgeRightBrowRef.current.rotation.z = 0.18 - browLift * 2;
          }
        } else if (currentJudgeReaction === 'smile') {
          // APPROBATION DU JUGE : Sourcils levés bienveillants, bouche souriante cyan, hochement approbateur
          judgeHeadRef.current.rotation.x = 0.08 + Math.sin(elapsedTime * 4) * 0.06;
          judgeHeadRef.current.rotation.y = 0;
          judgeHeadRef.current.rotation.z = 0;
          judgeMouthRef.current.position.y = -0.14;
          judgeMouthRef.current.scale.set(1.3, 0.7, 1);
          judgeMouthRef.current.material.color.setHex(0x059669);

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
      }"""

content = content.replace(old_anim_block.replace('\n', '\r\n'), new_anim_block.replace('\n', '\r\n'))
content = content.replace(old_anim_block, new_anim_block)

# 5. Animate Prosecutor and Defense mouth/brows/head
old_pros_anim = """      if (curProsecutorState === 'attacking' || curProsecutorState === 'speaking') {
        if (prosArmRef.current) {
          prosArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 4) * 0.25;
          prosArmRef.current.rotation.z = Math.sin(elapsedTime * 3) * 0.15;
        }
        if (prosHeadRef.current) {
          prosHeadRef.current.rotation.y = Math.sin(elapsedTime * 4) * 0.12;
        }
      } else {
        if (prosArmRef.current) prosArmRef.current.rotation.set(0, 0, 0);
        if (prosHeadRef.current) prosHeadRef.current.rotation.set(0, 0, 0);
      }"""

new_pros_anim = """      if (curProsecutorState === 'attacking' || curProsecutorState === 'speaking') {
        const prosSpeech = Math.sin(elapsedTime * 16) * 0.5 + Math.sin(elapsedTime * 26) * 0.3 + 0.5;
        if (prosArmRef.current) {
          prosArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 4) * 0.25;
          prosArmRef.current.rotation.z = Math.sin(elapsedTime * 3) * 0.15;
        }
        if (prosHeadRef.current) {
          prosHeadRef.current.rotation.x = -0.06 + Math.sin(elapsedTime * 5) * 0.04;
          prosHeadRef.current.rotation.y = Math.sin(elapsedTime * 4) * 0.14;
        }
        if (prosMouthRef.current) {
          prosMouthRef.current.scale.set(1.2, 1.0 + prosSpeech * 2.2, 1);
          prosMouthRef.current.material.color.setHex(0xbe123c);
        }
        if (prosLeftBrowRef.current && prosRightBrowRef.current) {
          prosLeftBrowRef.current.rotation.z = -0.42 + Math.sin(elapsedTime * 3) * 0.08;
          prosRightBrowRef.current.rotation.z = 0.42 - Math.sin(elapsedTime * 3) * 0.08;
        }
      } else {
        if (prosArmRef.current) prosArmRef.current.rotation.set(0, 0, 0);
        if (prosHeadRef.current) prosHeadRef.current.rotation.set(0, 0, 0);
        if (prosMouthRef.current) {
          prosMouthRef.current.scale.set(1, 1, 1);
          prosMouthRef.current.material.color.setHex(0x881337);
        }
        if (prosLeftBrowRef.current && prosRightBrowRef.current) {
          prosLeftBrowRef.current.rotation.z = -0.32;
          prosRightBrowRef.current.rotation.z = 0.32;
        }
      }"""

content = content.replace(old_pros_anim.replace('\n', '\r\n'), new_pros_anim.replace('\n', '\r\n'))
content = content.replace(old_pros_anim, new_pros_anim)

# 6. Animate Defense mouth/brows/head
old_def_anim = """      if (curDefenseState === 'pleading') {
        if (defArmRef.current) {
          defArmRef.current.rotation.x = -Math.PI / 3.2 + Math.sin(elapsedTime * 3.5) * 0.22;
          defArmRef.current.rotation.z = -Math.sin(elapsedTime * 2.5) * 0.18;
        }
        if (defHeadRef.current) {
          defHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.10;
        }
      } else {
        if (defArmRef.current) defArmRef.current.rotation.set(0, 0, 0);
        if (defHeadRef.current) defHeadRef.current.rotation.set(0, 0, 0);
      }"""

new_def_anim = """      if (curDefenseState === 'pleading' || curDefenseState === 'speaking') {
        const defSpeech = Math.sin(elapsedTime * 14) * 0.5 + Math.sin(elapsedTime * 22) * 0.3 + 0.5;
        if (defArmRef.current) {
          defArmRef.current.rotation.x = -Math.PI / 3.2 + Math.sin(elapsedTime * 3.5) * 0.22;
          defArmRef.current.rotation.z = -Math.sin(elapsedTime * 2.5) * 0.18;
        }
        if (defHeadRef.current) {
          defHeadRef.current.rotation.x = 0.04 + Math.sin(elapsedTime * 4) * 0.05;
          defHeadRef.current.rotation.y = Math.sin(elapsedTime * 3) * 0.12;
        }
        if (defMouthRef.current) {
          defMouthRef.current.scale.set(1.15, 1.0 + defSpeech * 2.0, 1);
          defMouthRef.current.material.color.setHex(0x0284c7);
        }
        if (defLeftBrowRef.current && defRightBrowRef.current) {
          defLeftBrowRef.current.position.y = 0.12 + Math.sin(elapsedTime * 3) * 0.02;
          defRightBrowRef.current.position.y = 0.12 + Math.sin(elapsedTime * 3) * 0.02;
        }
      } else {
        if (defArmRef.current) defArmRef.current.rotation.set(0, 0, 0);
        if (defHeadRef.current) defHeadRef.current.rotation.set(0, 0, 0);
        if (defMouthRef.current) {
          defMouthRef.current.scale.set(1, 1, 1);
          defMouthRef.current.material.color.setHex(0x334155);
        }
        if (defLeftBrowRef.current && defRightBrowRef.current) {
          defLeftBrowRef.current.position.y = 0.11;
          defRightBrowRef.current.position.y = 0.11;
        }
      }"""

content = content.replace(old_def_anim.replace('\n', '\r\n'), new_def_anim.replace('\n', '\r\n'))
content = content.replace(old_def_anim, new_def_anim)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Courtroom3DCanvas facial expressions updated for all protagonists!")
