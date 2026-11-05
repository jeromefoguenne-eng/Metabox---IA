import bpy
import math
import os

# Reset scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Helper to create PBR material
def create_mat(name, color, roughness=0.5, metalness=0.0, emission=None, emission_strength=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metalness
        if emission:
            if 'Emission Color' in bsdf.inputs:
                bsdf.inputs['Emission Color'].default_value = emission
                bsdf.inputs['Emission Strength'].default_value = emission_strength
            elif 'Emission' in bsdf.inputs:
                bsdf.inputs['Emission'].default_value = emission
    return mat

# --- PALETTE DE MATÉRIAUX ÉLÉGANTS ---
mat_skin = create_mat("Mat_Skin", (0.98, 0.84, 0.78, 1.0), roughness=0.45)
mat_hair = create_mat("Mat_BlondeHair", (0.95, 0.82, 0.38, 1.0), roughness=0.35)
mat_hair_dark = create_mat("Mat_BlondeShadow", (0.75, 0.58, 0.22, 1.0), roughness=0.40)

# Vêtements Tailleur Haute Couture
mat_suit_dark = create_mat("Mat_NavySuitDark", (0.07, 0.11, 0.20, 1.0), roughness=0.55)      # Laine bleu marine profond
mat_suit_lapel = create_mat("Mat_NavyLapel", (0.05, 0.08, 0.16, 1.0), roughness=0.40)       # Revers satiné
mat_blouse = create_mat("Mat_SilkBlouse", (0.97, 0.96, 0.94, 1.0), roughness=0.32)          # Blouse en soie ivoire
mat_pochette = create_mat("Mat_PocketSquare", (0.98, 0.98, 1.0, 1.0), roughness=0.25)       # Pochette blanche
mat_gold = create_mat("Mat_GoldTrim", (0.98, 0.82, 0.28, 1.0), roughness=0.18, metalness=0.92) # Boutons dorés & chaîne

# Yeux & Visage
mat_eyes_white = create_mat("Mat_EyeWhite", (0.98, 0.98, 1.0, 1.0), roughness=0.08)
mat_eyes_iris = create_mat("Mat_EyeIris", (0.08, 0.58, 0.88, 1.0), roughness=0.12)
mat_pupil = create_mat("Mat_EyePupil", (0.02, 0.02, 0.03, 1.0), roughness=0.08)
mat_lips = create_mat("Mat_Lips", (0.94, 0.35, 0.48, 1.0), roughness=0.25)
mat_glasses = create_mat("Mat_GlassesFrame", (0.15, 0.18, 0.25, 1.0), roughness=0.15, metalness=0.92)

# Tablette Cyber
mat_tablet = create_mat("Mat_TabletBody", (0.05, 0.08, 0.14, 1.0), roughness=0.20, metalness=0.75)
mat_screen = create_mat("Mat_TabletScreen", (0.02, 0.70, 0.92, 1.0), roughness=0.08, emission=(0.04, 0.80, 0.98, 1.0), emission_strength=2.8)

# =========================================================================
# 1. TÊTE & TRAITS DU VISAGE AVEC SHAPE KEYS MULTI-VISEMES
# =========================================================================
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=0.22, location=(0, 0, 1.18))
head = bpy.context.active_object
head.name = "Aurore_Head"
head.scale = (0.86, 0.96, 1.14)
bpy.ops.object.transform_apply(scale=True)
head.data.materials.append(mat_skin)
for poly in head.data.polygons:
    poly.use_smooth = True

# Shape Keys sur la tête
head.shape_key_add(name="Basis")
sk_mouth_open = head.shape_key_add(name="mouth_open")
sk_smile = head.shape_key_add(name="mouth_smile")
sk_mouth_o = head.shape_key_add(name="mouth_o")
sk_brow_raise = head.shape_key_add(name="brow_raise")

for i, vert in enumerate(head.data.vertices):
    # mouth_open : abaissement de la mâchoire
    if vert.co.y > 0.10 and -0.18 < vert.co.z < -0.04:
        sk_mouth_open.data[i].co.z -= 0.034
        sk_mouth_open.data[i].co.y += 0.008
    # mouth_smile : étirement des pommettes et commissures
    if vert.co.y > 0.14 and -0.12 < vert.co.z < -0.05 and abs(vert.co.x) > 0.04:
        sk_smile.data[i].co.z += 0.018
        sk_smile.data[i].co.x *= 1.14
    # mouth_o : resserrement vers le centre
    if vert.co.y > 0.12 and -0.14 < vert.co.z < -0.04:
        sk_mouth_o.data[i].co.x *= 0.82
        sk_mouth_o.data[i].co.y += 0.015
    # brow_raise : soulèvement expressif des sourcils
    if vert.co.y > 0.12 and 0.06 < vert.co.z < 0.14:
        sk_brow_raise.data[i].co.z += 0.024

# Nez fin et stylisé
bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.018, depth=0.045, location=(0, 0.218, 1.165))
nose = bpy.context.active_object
nose.rotation_euler = (math.radians(-65), 0, 0)
nose.data.materials.append(mat_skin)
for poly in nose.data.polygons: poly.use_smooth = True

# Lèvres sculptées et expressives
bpy.ops.mesh.primitive_torus_add(major_radius=0.042, minor_radius=0.013, major_segments=24, minor_segments=10, location=(0, 0.205, 1.085))
mouth = bpy.context.active_object
mouth.name = "Aurore_Lips"
mouth.scale = (1.0, 0.42, 0.52)
mouth.rotation_euler = (math.radians(18), 0, 0)
bpy.ops.object.transform_apply(scale=True, rotation=True)
mouth.data.materials.append(mat_lips)
for poly in mouth.data.polygons: poly.use_smooth = True

mouth.shape_key_add(name="Basis")
sk_m_open = mouth.shape_key_add(name="mouth_open")
sk_m_smile = mouth.shape_key_add(name="mouth_smile")
sk_m_o = mouth.shape_key_add(name="mouth_o")

for i, vert in enumerate(mouth.data.vertices):
    # Ouverture réaliste de la bouche (mâchoire inférieure descend, lèvre supérieure monte légèrement)
    if vert.co.z < 0:
        sk_m_open.data[i].co.z -= 0.038
        sk_m_open.data[i].co.y += 0.006
    else:
        sk_m_open.data[i].co.z += 0.012

    # Sourire : commissures montent et s'écartent
    if abs(vert.co.x) > 0.025:
        sk_m_smile.data[i].co.z += 0.016
        sk_m_smile.data[i].co.x *= 1.15

    # Voyelle O : lèvre arrondie et avancée
    sk_m_o.data[i].co.x *= 0.78
    sk_m_o.data[i].co.y += 0.016

# Yeux vivants avec Sclère, Iris cyan, Pupille et Reflets
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=0.042, location=(sign * 0.075, 0.19, 1.21))
    eye_white = bpy.context.active_object
    eye_white.name = f"Aurore_Eye_{side}"
    eye_white.scale = (1.1, 0.72, 0.9)
    bpy.ops.object.transform_apply(scale=True)
    eye_white.data.materials.append(mat_eyes_white)
    for poly in eye_white.data.polygons: poly.use_smooth = True

    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.025, depth=0.01, location=(sign * 0.075, 0.226, 1.21))
    iris = bpy.context.active_object
    iris.rotation_euler = (math.radians(90), 0, 0)
    iris.data.materials.append(mat_eyes_iris)

    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.013, depth=0.012, location=(sign * 0.075, 0.229, 1.21))
    pupil = bpy.context.active_object
    pupil.rotation_euler = (math.radians(90), 0, 0)
    pupil.data.materials.append(mat_pupil)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=8, radius=0.006, location=(sign * 0.075 + 0.008, 0.234, 1.218))
    glint = bpy.context.active_object
    glint.data.materials.append(mat_eyes_white)

    # Sourcils expressifs
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.075, 0.20, 1.265))
    brow = bpy.context.active_object
    brow.name = f"Aurore_Brow_{side}"
    brow.scale = (0.055, 0.010, 0.009)
    brow.rotation_euler = (0, sign * math.radians(-12), 0)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    brow.data.materials.append(mat_hair_dark)

# Lunettes chic d'intellectuelle
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_torus_add(major_radius=0.052, minor_radius=0.0035, major_segments=24, minor_segments=8, location=(sign * 0.075, 0.218, 1.21))
    frame = bpy.context.active_object
    frame.name = f"Aurore_Glasses_{side}"
    frame.rotation_euler = (math.radians(90), 0, 0)
    frame.data.materials.append(mat_glasses)

bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.003, depth=0.05, location=(0, 0.222, 1.215))
bridge = bpy.context.active_object
bridge.rotation_euler = (0, math.radians(90), 0)
bridge.data.materials.append(mat_glasses)

# =========================================================================
# 2. CHEVELURE BLONDE (PARFAITEMENT POSITIONNÉE SANS CLIPPING DU MENTON)
# =========================================================================
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=18, radius=0.235, location=(0, -0.09, 1.22))
hair_main = bpy.context.active_object
hair_main.name = "Aurore_Hair_Crown"
hair_main.scale = (0.95, 0.88, 1.05)
bpy.ops.object.transform_apply(scale=True)
hair_main.data.materials.append(mat_hair)

# Mèches soignées encadrant le visage
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=0.07, depth=0.32, location=(sign * 0.17, 0.02, 1.10))
    strand = bpy.context.active_object
    strand.name = f"Aurore_Hair_Strand_{side}"
    strand.rotation_euler = (math.radians(170), sign * math.radians(12), sign * math.radians(-10))
    strand.scale = (0.9, 0.7, 1.0)
    strand.data.materials.append(mat_hair)

# Frange asymétrique moderne
bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=0.10, depth=0.20, location=(0.04, 0.14, 1.29))
bangs = bpy.context.active_object
bangs.name = "Aurore_Hair_Bangs"
bangs.rotation_euler = (math.radians(115), math.radians(-25), math.radians(15))
bangs.scale = (1.2, 0.6, 1.0)
bangs.data.materials.append(mat_hair)

# =========================================================================
# 3. COU, BLOUSE EN SOIE & PENDENTIF ACADÉMIQUE OR
# =========================================================================
# Cou gracieux
bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.068, depth=0.16, location=(0, -0.02, 0.97))
neck = bpy.context.active_object
neck.name = "Aurore_Neck"
neck.data.materials.append(mat_skin)
for poly in neck.data.polygons: poly.use_smooth = True

# Chaîne et médaillon d'or HECh
bpy.ops.mesh.primitive_torus_add(major_radius=0.072, minor_radius=0.002, major_segments=24, minor_segments=8, location=(0, -0.01, 0.91))
chain = bpy.context.active_object
chain.name = "Aurore_GoldChain"
chain.rotation_euler = (math.radians(25), 0, 0)
chain.data.materials.append(mat_gold)

bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.014, depth=0.004, location=(0, 0.072, 0.865))
pendant = bpy.context.active_object
pendant.name = "Aurore_GoldPendant"
pendant.rotation_euler = (math.radians(25), 0, 0)
pendant.data.materials.append(mat_gold)

# Blouse en soie ivoire décolleté V
bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.16, depth=0.22, location=(0, 0.03, 0.84))
blouse = bpy.context.active_object
blouse.name = "Aurore_SilkBlouse"
blouse.scale = (1.0, 0.72, 1.0)
bpy.ops.object.transform_apply(scale=True)
blouse.data.materials.append(mat_blouse)

# Col en V élégant de la blouse
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.045, 0.11, 0.88))
    b_fold = bpy.context.active_object
    b_fold.name = f"Aurore_Blouse_Fold_{side}"
    b_fold.scale = (0.04, 0.015, 0.12)
    b_fold.rotation_euler = (math.radians(15), sign * math.radians(-22), sign * math.radians(20))
    b_fold.data.materials.append(mat_blouse)

# =========================================================================
# 4. TAILLEUR HAUTE COUTURE (BLAZER CINTRÉ, REVERS CRANTÉS, POCHETTE, BOUTONS)
# =========================================================================
# Buste cintré supérieur (épaules bien dessinées)
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.25, depth=0.24, location=(0, 0, 0.80))
jacket_top = bpy.context.active_object
jacket_top.name = "Aurore_Jacket_Upper"
jacket_top.scale = (1.18, 0.82, 1.0)
bpy.ops.object.transform_apply(scale=True)
jacket_top.data.materials.append(mat_suit_dark)

# Buste cintré inférieur (taille marquée et léger évasement aux hanches)
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.22, depth=0.26, location=(0, -0.01, 0.60))
jacket_bottom = bpy.context.active_object
jacket_bottom.name = "Aurore_Jacket_Waist"
jacket_bottom.scale = (1.12, 0.80, 1.0)
bpy.ops.object.transform_apply(scale=True)
jacket_bottom.data.materials.append(mat_suit_dark)

# Revers de col crantés (Notched Lapels)
for side, sign in [("L", 1), ("R", -1)]:
    # Revers supérieur (col montant du blazer)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.09, 0.14, 0.88))
    lapel_upper = bpy.context.active_object
    lapel_upper.name = f"Aurore_Lapel_Upper_{side}"
    lapel_upper.scale = (0.055, 0.02, 0.10)
    lapel_upper.rotation_euler = (math.radians(18), sign * math.radians(-24), sign * math.radians(22))
    lapel_upper.data.materials.append(mat_suit_lapel)

    # Revers principal plongeant avec bordure satinée
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.105, 0.165, 0.77))
    lapel_main = bpy.context.active_object
    lapel_main.name = f"Aurore_Lapel_Main_{side}"
    lapel_main.scale = (0.075, 0.022, 0.16)
    lapel_main.rotation_euler = (math.radians(12), sign * math.radians(-16), sign * math.radians(14))
    lapel_main.data.materials.append(mat_suit_lapel)

    # Liseré doré précieux longeant le revers
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.003, depth=0.18, location=(sign * 0.135, 0.175, 0.77))
    trim = bpy.context.active_object
    trim.name = f"Aurore_GoldPiping_{side}"
    trim.rotation_euler = (math.radians(12), sign * math.radians(-16), sign * math.radians(14))
    trim.data.materials.append(mat_gold)

# Boutons dorés en double boutonnage sur la veste
button_coords = [
    (-0.045, 0.175, 0.72),
    ( 0.045, 0.175, 0.72),
    (-0.040, 0.165, 0.63),
    ( 0.040, 0.165, 0.63),
]
for idx, (bx, by, bz) in enumerate(button_coords):
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.010, depth=0.006, location=(bx, by, bz))
    btn = bpy.context.active_object
    btn.name = f"Aurore_Button_{idx+1}"
    btn.rotation_euler = (math.radians(90), 0, 0)
    btn.data.materials.append(mat_gold)

# Pochette de costume blanche sur la poitrine gauche (côté droit en vue miroir x > 0)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.14, 0.145, 0.81))
pocket_welt = bpy.context.active_object
pocket_welt.name = "Aurore_Pocket_Welt"
pocket_welt.scale = (0.065, 0.015, 0.012)
pocket_welt.rotation_euler = (math.radians(12), math.radians(10), math.radians(-8))
pocket_welt.data.materials.append(mat_suit_lapel)

bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.022, depth=0.028, location=(-0.14, 0.150, 0.825))
pocket_sq = bpy.context.active_object
pocket_sq.name = "Aurore_Pocket_Square"
pocket_sq.rotation_euler = (math.radians(15), math.radians(10), math.radians(45))
pocket_sq.data.materials.append(mat_pochette)

# Rabats de poches aux hanches
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.16, 0.10, 0.54))
    flap = bpy.context.active_object
    flap.name = f"Aurore_Pocket_Flap_{side}"
    flap.scale = (0.08, 0.02, 0.016)
    flap.rotation_euler = (math.radians(10), sign * math.radians(-14), sign * math.radians(8))
    flap.data.materials.append(mat_suit_dark)

# =========================================================================
# 5. ÉPAULES STRUCTURÉES, BRAS & POIGNETS AVEC BOUTONS DE MANCHETTE
# =========================================================================
for side, sign in [("L", 1), ("R", -1)]:
    # Épaulette sculptée
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.105, location=(sign * 0.27, 0.01, 0.86))
    shoulder = bpy.context.active_object
    shoulder.name = f"Aurore_Shoulder_{side}"
    shoulder.scale = (1.15, 0.95, 0.88)
    bpy.ops.object.transform_apply(scale=True)
    shoulder.data.materials.append(mat_suit_dark)

    # Bras supérieur
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.072, depth=0.32, location=(sign * 0.28, 0.06, 0.72))
    upper_arm = bpy.context.active_object
    upper_arm.name = f"Aurore_UpperArm_{side}"
    upper_arm.rotation_euler = (math.radians(25), sign * math.radians(-18), sign * math.radians(10))
    upper_arm.data.materials.append(mat_suit_dark)

    # Avant-bras tenant la tablette
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.060, depth=0.28, location=(sign * 0.21, 0.20, 0.56))
    forearm = bpy.context.active_object
    forearm.name = f"Aurore_Forearm_{side}"
    forearm.rotation_euler = (math.radians(-45), sign * math.radians(35), 0)
    forearm.data.materials.append(mat_suit_dark)

    # Poignet de manche (manchette avec finition or)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.058, minor_radius=0.006, major_segments=16, minor_segments=8, location=(sign * 0.165, 0.26, 0.515))
    cuff = bpy.context.active_object
    cuff.name = f"Aurore_Cuff_{side}"
    cuff.rotation_euler = (math.radians(-45), sign * math.radians(35), 0)
    cuff.data.materials.append(mat_suit_lapel)

    # Petit bouton de manchette doré
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.005, depth=0.004, location=(sign * 0.175, 0.265, 0.525))
    cuff_btn = bpy.context.active_object
    cuff_btn.name = f"Aurore_CuffBtn_{side}"
    cuff_btn.rotation_euler = (math.radians(-45), sign * math.radians(35), 0)
    cuff_btn.data.materials.append(mat_gold)

    # Main soignée
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.050, location=(sign * 0.14, 0.29, 0.50))
    hand = bpy.context.active_object
    hand.name = f"Aurore_Hand_{side}"
    hand.scale = (0.75, 1.15, 0.65)
    bpy.ops.object.transform_apply(scale=True)
    hand.data.materials.append(mat_skin)

# =========================================================================
# 6. TABLETTE CYBER HOLOGRAPHIQUE
# =========================================================================
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.28, 0.51))
tablet = bpy.context.active_object
tablet.name = "Aurore_Cyber_Tablet"
tablet.scale = (0.24, 0.016, 0.16)
tablet.rotation_euler = (math.radians(35), 0, 0)
bpy.ops.object.transform_apply(scale=True)
tablet.data.materials.append(mat_tablet)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.282, 0.51))
screen = bpy.context.active_object
screen.name = "Aurore_Tablet_Screen"
screen.scale = (0.22, 0.004, 0.14)
screen.rotation_euler = (math.radians(35), 0, 0)
bpy.ops.object.transform_apply(scale=True)
screen.data.materials.append(mat_screen)

# =========================================================================
# 7. EXPORT GLB HAUTE FIDÉLITÉ
# =========================================================================
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        obj.select_set(True)

output_path = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\models\aurore_lowpoly_stylized.glb"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=True,
    export_morph=True,
    export_materials='EXPORT',
    export_apply=False
)
print("[Blender 5.3] Aurore Low-Poly Stylisée Haute Couture exportée avec succès vers :", output_path)
