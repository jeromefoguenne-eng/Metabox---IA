with open('src/components/Courtroom3DCanvas.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("ctx.fillStyle = '#f5efe6';", "ctx.fillStyle = '#9c846f';")

old_mat = """    const marblePillar = new THREE.MeshPhysicalMaterial({ 
      map: marbleTex, 
      roughness: 0.14, 
      metalness: 0.04,
      clearcoat: 0.70,
      clearcoatRoughness: 0.10
    });"""

new_mat = """    const marblePillar = new THREE.MeshPhysicalMaterial({ 
      map: marbleTex, 
      color: 0x8a725e,
      roughness: 0.68, 
      metalness: 0.02,
      clearcoat: 0.00,
      clearcoatRoughness: 0.50
    });"""

if old_mat in c:
    c = c.replace(old_mat, new_mat)
    with open('src/components/Courtroom3DCanvas.jsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print('UPDATED marble pillar material successfully')
else:
    print('old_mat not found')
