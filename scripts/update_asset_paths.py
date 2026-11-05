import os
import re

files_with_logo = [
    'src/components/AiLabView.jsx',
    'src/components/AuroreGameBriefingModal.jsx',
    'src/components/EscapeGameAurore.jsx',
    'src/components/GameFactChecking3D.jsx',
    'src/components/GrandConcours3ManchesArena.jsx',
    'src/components/Header.jsx',
    'src/components/IntroVideoGenerique.jsx',
    'src/components/TileDetails.jsx',
]

for fp in files_with_logo:
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'getAssetPath' not in c:
        c = 'import { getAssetPath } from "../utils/assetPath";\n' + c
    c = c.replace('src="/images/hech_logo_officiel.png"', 'src={getAssetPath("/images/hech_logo_officiel.png")}')
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print('Updated logo paths!')

# Update 3D model in PixarStyleScene3D.jsx
with open('src/components/PixarStyleScene3D.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'getAssetPath' not in c:
    c = 'import { getAssetPath } from "../utils/assetPath";\n' + c
c = c.replace("'/models/aurore_lowpoly_stylized.glb'", "getAssetPath('/models/aurore_lowpoly_stylized.glb')")
with open('src/components/PixarStyleScene3D.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# Update Courtroom3DCanvas.jsx
with open('src/components/Courtroom3DCanvas.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
if 'getAssetPath' not in c:
    c = 'import { getAssetPath } from "../utils/assetPath";\n' + c
c = c.replace("textureLoader.load('/images/hech_logo_officiel.png')", "textureLoader.load(getAssetPath('/images/hech_logo_officiel.png'))")
c = c.replace("'/models/courtroom_bench_stylized.glb'", "getAssetPath('/models/courtroom_bench_stylized.glb')")
with open('src/components/Courtroom3DCanvas.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated 3D Canvas paths!')
