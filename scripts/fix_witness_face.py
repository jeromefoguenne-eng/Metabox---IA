path = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\Courtroom3DCanvas.jsx"

with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

target_old = """    // Yeux marron ambré de Maxime avec double étincelle
    const witEyes = [];
    for (let side of [-1, 1]) {
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), eyeWhite);
      eyeBall.position.set(side * 0.10, 0.03, 0.225);
      witHeadGroup.add(eyeBall);

      const eyeIris = new THREE.Mesh(new THREE.SphereGeometry(0.030, 16, 16), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.2 }));
      eyeIris.position.set(side * 0.10, 0.03, 0.252);
      witHeadGroup.add(eyeIris);

      const eyePup = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), eyePupil);
      eyePup.position.set(side * 0.10, 0.03, 0.268);
      witHeadGroup.add(eyePup);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), eyeGlintMat);
      glint.position.set(side * 0.10 + 0.008, 0.040, 0.276);
      witHeadGroup.add(glint);

      witEyes.push(eyeBall);
    }
    witnessEyesRef.current = witEyes;

    const witNose = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.032, 0.12, 16), skinToneWitness);
    witNose.position.set(0, -0.02, 0.27);
    witNose.rotation.x = 0.22;
    witHeadGroup.add(witNose);

    const witMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x991b1b })
    );
    witMouth.position.set(0, -0.12, 0.25);
    witHeadGroup.add(witMouth);
    witnessMouthRef.current = witMouth;

    // Sourcils
    const witBrowGeo = new THREE.BoxGeometry(0.14, 0.035, 0.05);
    const witBrowMat = new THREE.MeshStandardMaterial({ color: 0x3e2316, roughness: 0.8 });
    const witBrowL = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowL.position.set(-0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowL);
    witnessLeftBrowRef.current = witBrowL;

    const witBrowR = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowR.position.set(0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowR);
    witnessRightBrowRef.current = witBrowR;"""

target_new = """    // Yeux marron ambré expressifs de Maxime
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

    // Bouche articulée et expressive pour Maxime
    const witMouthData = createExpressiveMouth(0xbe123c, 0.22, 0.044);
    witMouthData.mouthGroup.position.set(0, -0.12, 0.25);
    witHeadGroup.add(witMouthData.mouthGroup);
    witnessMouthRef.current = witMouthData;

    // Sourcils expressifs
    const witBrowGeo = new THREE.BoxGeometry(0.14, 0.038, 0.05);
    const witBrowMat = new THREE.MeshStandardMaterial({ color: 0x3e2316, roughness: 0.8 });
    const witBrowL = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowL.position.set(-0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowL);
    witnessLeftBrowRef.current = witBrowL;

    const witBrowR = new THREE.Mesh(witBrowGeo, witBrowMat);
    witBrowR.position.set(0.11, 0.13, 0.24);
    witHeadGroup.add(witBrowR);
    witnessRightBrowRef.current = witBrowR;"""

if target_old in code:
    code = code.replace(target_old, target_new)
    print("Exact match replaced!")
else:
    # Normalize line breaks and replace
    code_norm = code.replace("\r\n", "\n")
    target_old_norm = target_old.replace("\r\n", "\n")
    target_new_norm = target_new.replace("\r\n", "\n")
    if target_old_norm in code_norm:
        code = code_norm.replace(target_old_norm, target_new_norm)
        print("Normalized match replaced!")
    else:
        print("Error: target_old not found!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
