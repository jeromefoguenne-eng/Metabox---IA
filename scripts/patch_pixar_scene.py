import re

path = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\PixarStyleScene3D.jsx"

with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Éclairage
code = re.sub(
    r"const hemiLight = new THREE\.HemisphereLight\(0xfff6ee, 0x1f1630, 1\.6\);",
    "const hemiLight = new THREE.HemisphereLight(0xfff6ee, 0x1f1630, 0.65);",
    code
)
code = re.sub(
    r"const ambientLight = new THREE\.AmbientLight\(0xffedd5, 0\.7\);",
    "const ambientLight = new THREE.AmbientLight(0xffedd5, 0.25);",
    code
)
code = re.sub(
    r"const keyLight = new THREE\.DirectionalLight\(0xfff1de, 3\.0\);",
    "const keyLight = new THREE.DirectionalLight(0xfff1de, 1.4);",
    code
)
code = re.sub(
    r"const fillLight = new THREE\.DirectionalLight\(0xb4c6fc, 1\.5\);",
    "const fillLight = new THREE.DirectionalLight(0xb4c6fc, 0.65);",
    code
)
code = re.sub(
    r"const rimLight = new THREE\.DirectionalLight\(0xfde047, 3\.4\);",
    "const rimLight = new THREE.DirectionalLight(0xfde047, 1.6);",
    code
)
code = re.sub(
    r"const kickerLight = new THREE\.PointLight\(0x38bdf8, 1\.2, 5\);",
    "const kickerLight = new THREE.PointLight(0x38bdf8, 0.8, 5);",
    code
)

# 2. Préservation des matériaux
old_mat_pattern = r"if \(child\.material\) \{\s*child\.material\.roughness = 0\.40;\s*child\.material\.metalness = 0\.02;"
new_mat = """if (child.material) {
              const mName = child.material.name || '';
              if (mName.includes('Gold') || mName.includes('Trim')) {
                child.material.roughness = 0.15;
                child.material.metalness = 0.95;
              } else if (mName.includes('Navy') || mName.includes('Suit')) {
                child.material.roughness = 0.48;
                child.material.metalness = 0.05;
              } else if (mName.includes('Silk') || mName.includes('Blouse')) {
                child.material.roughness = 0.28;
                child.material.metalness = 0.02;
              } else {
                child.material.roughness = 0.40;
                child.material.metalness = 0.02;
              }"""
code = re.sub(old_mat_pattern, new_mat, code)

# 3. Lip-sync dynamique
old_sync_pattern = r"// --- ANIMATION DE PAROLE EN DIRECT \(LIP-SYNC MOTION & SHAPE KEYS BLENDER\) ---[\s\S]*?inf\[browIdx\] = THREE\.MathUtils\.lerp\(inf\[browIdx\], targetBrow, 0\.2\);\s*\}\s*\}\s*\);"

new_sync = """// --- ANIMATION DE PAROLE EN DIRECT (LIP-SYNC RHYTHMIQUE SUR LE BON RYTHME) ---
        const voiceLevel = sounds.getVoiceLevel ? sounds.getVoiceLevel() : (sounds.isVoicePlaying() ? 0.6 : 0);
        const isVoiceSpeaking = voiceLevel > 0.01;
        const isVoiceActive = sounds.isVoicePlaying() || characterMood === 'speaking';

        // Pilotage dynamique de toutes les Shape Keys (Visemes de parole synchronisés)
        const isBlinking = (Math.sin(t * 1.6) > 0.985);

        let targetMouth = 0.0;
        let targetMouthO = 0.0;
        let targetSmile = (characterMood !== 'worried' && !isAlert) ? 0.65 : 0.15;
        let targetBrow = (characterMood === 'thinking' || isAlert) ? 0.60 : 0.0;

        if (isVoiceActive) {
          if (isVoiceSpeaking) {
            // Mouvement de la bouche synchronisé au rythme syllabique réel
            targetMouth = voiceLevel * 0.90;
            targetMouthO = Math.max(0, Math.sin(t * 11.5) * voiceLevel * 0.55);
            targetSmile = 0.25 + Math.max(0, Math.cos(t * 7.5)) * 0.30;
            targetBrow = 0.20 + 0.30 * Math.max(0, Math.sin(t * 3.8));
          } else {
            // Silence entre deux mots ou phrases : fermeture nette de la bouche
            targetMouth = 0.0;
            targetMouthO = 0.0;
            targetSmile = 0.30;
          }
        }

        morphMeshesRef.current.forEach(mesh => {
          if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            const dict = mesh.morphTargetDictionary;
            const inf = mesh.morphTargetInfluences;

            const mouthIdx = dict['mouth_open'] ?? dict['mouthOpen'];
            const mouthOIdx = dict['mouth_o'] ?? dict['mouthO'];
            const smileIdx = dict['mouth_smile'] ?? dict['smile'];
            const blinkIdx = dict['blink'];
            const browIdx = dict['brow_raise'];

            if (mouthIdx !== undefined) {
              inf[mouthIdx] = THREE.MathUtils.lerp(inf[mouthIdx], Math.max(0, targetMouth), 0.45);
            }
            if (mouthOIdx !== undefined) {
              inf[mouthOIdx] = THREE.MathUtils.lerp(inf[mouthOIdx], Math.max(0, targetMouthO), 0.40);
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

code = re.sub(old_sync_pattern, new_sync, code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("PixarStyleScene3D.jsx patched successfully!")
