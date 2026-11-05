import os

path = r'C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\PixarStyleScene3D.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update morph ref
content = content.replace('const morphMeshRef = useRef(null);', 'const morphMeshesRef = useRef([]);')

# 2. Update model path & rot
old_load = """    let baseScale = 1.0;
    let basePosY = 0.07;
    let baseRotY = -Math.PI / 2; // Orientation face caméra

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/aurore_blender_pixar.glb',"""

new_load = """    let baseScale = 1.0;
    let basePosY = 0.07;
    let baseRotY = Math.PI; // Face caméra dans Three.js

    morphMeshesRef.current = [];

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/aurore_lowpoly_stylized.glb',"""

content = content.replace(old_load.replace('\n', '\r\n'), new_load.replace('\n', '\r\n'))
content = content.replace(old_load, new_load)

# 3. Update traverse morph detection
old_traverse = """            if (child.morphTargetDictionary && child.morphTargetInfluences) {
              morphMeshRef.current = child;
              console.log("[Aurore 3D HD] Shape Keys Blender détectées :", Object.keys(child.morphTargetDictionary));
            }"""

new_traverse = """            if (child.morphTargetDictionary && child.morphTargetInfluences) {
              morphMeshesRef.current.push(child);
              console.log("[Aurore Low-Poly 3D] Shape Keys détectées sur", child.name, Object.keys(child.morphTargetDictionary));
            }"""

content = content.replace(old_traverse.replace('\n', '\r\n'), new_traverse.replace('\n', '\r\n'))
content = content.replace(old_traverse, new_traverse)

# 4. Update animation loop shape keys handling
old_anim_morph = """        // Pilotage dynamique des Shape Keys (Morph Targets)
        if (morphMeshRef.current && morphMeshRef.current.morphTargetDictionary && morphMeshRef.current.morphTargetInfluences) {
          const dict = morphMeshRef.current.morphTargetDictionary;
          const influences = morphMeshRef.current.morphTargetInfluences;

          const mouthIdx = dict['mouthOpen'];
          const smileIdx = dict['smile'];

          if (mouthIdx !== undefined) {
            const targetMouth = isVoiceActive 
              ? (Math.sin(t * 16) * 0.45 + Math.sin(t * 26) * 0.25 + 0.35)
              : 0.0;
            influences[mouthIdx] = THREE.MathUtils.lerp(influences[mouthIdx], Math.max(0, targetMouth), 0.35);
          }

          if (smileIdx !== undefined) {
            const targetSmile = (!isVoiceActive && characterMood !== 'worried' && !isAlert) ? 0.80 : 0.25;
            influences[smileIdx] = THREE.MathUtils.lerp(influences[smileIdx], targetSmile, 0.20);
          }
        }"""

new_anim_morph = """        // Pilotage dynamique de toutes les Shape Keys (Visemes de parole & émotions réalistes)
        const isBlinking = (Math.sin(t * 1.6) > 0.985);
        const targetMouth = isVoiceActive 
          ? (Math.sin(t * 15) * 0.45 + Math.sin(t * 24) * 0.30 + 0.35)
          : 0.0;
        const targetSmile = (!isVoiceActive && characterMood !== 'worried' && !isAlert) ? 0.75 : 0.15;
        const targetBrow = (characterMood === 'thinking' || isAlert) ? 0.60 : 0.0;

        morphMeshesRef.current.forEach(mesh => {
          if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            const dict = mesh.morphTargetDictionary;
            const inf = mesh.morphTargetInfluences;

            const mouthIdx = dict['mouth_open'] ?? dict['mouthOpen'];
            const smileIdx = dict['mouth_smile'] ?? dict['smile'];
            const blinkIdx = dict['blink'];
            const browIdx = dict['brow_raise'];

            if (mouthIdx !== undefined) {
              inf[mouthIdx] = THREE.MathUtils.lerp(inf[mouthIdx], Math.max(0, targetMouth), 0.4);
            }
            if (smileIdx !== undefined) {
              inf[smileIdx] = THREE.MathUtils.lerp(inf[smileIdx], targetSmile, 0.2);
            }
            if (blinkIdx !== undefined) {
              inf[blinkIdx] = isBlinking ? 1.0 : 0.0;
            }
            if (browIdx !== undefined) {
              inf[browIdx] = THREE.MathUtils.lerp(inf[browIdx], targetBrow, 0.2);
            }
          }
        });"""

content = content.replace(old_anim_morph.replace('\n', '\r\n'), new_anim_morph.replace('\n', '\r\n'))
content = content.replace(old_anim_morph, new_anim_morph)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS: PixarStyleScene3D updated!')
