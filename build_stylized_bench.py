import bpy
import bmesh
import math
import os

# Clear scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# ---------------------------------------------------------
# PALETTE DE COULEURS STYLISÉE (MATÉRIAUX PBR MONUMENT VALLEY / NINTENDO)
# ---------------------------------------------------------
def create_material(name, base_color, roughness=0.35, metallic=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = base_color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
    return mat

mat_mahogany_dark = create_material("Mahogany_Dark", (0.16, 0.07, 0.04, 1.0), roughness=0.25)
mat_mahogany_main = create_material("Mahogany_Main", (0.28, 0.12, 0.07, 1.0), roughness=0.28)
mat_mahogany_light = create_material("Mahogany_Light", (0.38, 0.17, 0.10, 1.0), roughness=0.30)
mat_gold = create_material("Brushed_Gold", (0.85, 0.65, 0.18, 1.0), roughness=0.20, metallic=0.92)
mat_brass = create_material("Court_Brass", (0.75, 0.55, 0.20, 1.0), roughness=0.25, metallic=0.88)
mat_parchment = create_material("Parchment", (0.92, 0.88, 0.78, 1.0), roughness=0.80)
mat_felt_green = create_material("Desk_Felt", (0.08, 0.22, 0.12, 1.0), roughness=0.85)

# Helper: Add Bevel and Weighted Normal modifiers
def apply_stylized_modifiers(obj, bevel_width=0.015, segments=2):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    
    # Shade Smooth
    for p in obj.data.polygons:
        p.use_smooth = True
        
    # Bevel Modifier
    bev = obj.modifiers.new(name="Stylized_Bevel", type='BEVEL')
    bev.width = bevel_width
    bev.segments = segments
    bev.limit_method = 'ANGLE'
    bev.angle_limit = math.radians(35)
    bev.harden_normals = True
    
    # Weighted Normal
    wn = obj.modifiers.new(name="WeightedNormal", type='WEIGHTED_NORMAL')
    wn.keep_sharp = True

# ---------------------------------------------------------
# 1. SOCLE & MEUBLE DU JUGE
# ---------------------------------------------------------
# Socle principal
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.65))
bench_body = bpy.context.active_object
bench_body.name = "Judge_Bench_Body"
bench_body.scale = (4.8, 1.8, 1.3)
bpy.ops.object.transform_apply(scale=True)
bench_body.data.materials.append(mat_mahogany_main)
apply_stylized_modifiers(bench_body, bevel_width=0.03, segments=2)

# Socle inférieur débordant (Plinthe)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.10))
plinth = bpy.context.active_object
plinth.name = "Judge_Bench_Plinth"
plinth.scale = (5.1, 2.0, 0.20)
bpy.ops.object.transform_apply(scale=True)
plinth.data.materials.append(mat_mahogany_dark)
apply_stylized_modifiers(plinth, bevel_width=0.025, segments=2)

# Plateau supérieur débordant (Corniche du juge)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.36))
desktop = bpy.context.active_object
desktop.name = "Judge_Bench_Desktop"
desktop.scale = (5.2, 2.1, 0.12)
bpy.ops.object.transform_apply(scale=True)
desktop.data.materials.append(mat_mahogany_dark)
apply_stylized_modifiers(desktop, bevel_width=0.02, segments=2)

# Sous-main central en feutrine verte impériale
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.05, 1.425))
felt = bpy.context.active_object
felt.name = "Judge_Bench_Felt"
felt.scale = (2.2, 1.2, 0.015)
bpy.ops.object.transform_apply(scale=True)
felt.data.materials.append(mat_felt_green)
apply_stylized_modifiers(felt, bevel_width=0.008, segments=1)

# Panneaux sculptés en relief sur la façade (Style tribunal solennel)
for idx, x_offset in enumerate([-1.6, 0.0, 1.6]):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_offset, -0.92, 0.68))
    panel = bpy.context.active_object
    panel.name = f"Judge_Panel_Relief_{idx}"
    panel.scale = (1.2, 0.04, 0.85)
    bpy.ops.object.transform_apply(scale=True)
    panel.data.materials.append(mat_mahogany_light)
    apply_stylized_modifiers(panel, bevel_width=0.015, segments=2)
    
    # Bordure dorée d'encadrement
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_offset, -0.93, 0.68))
    gold_trim = bpy.context.active_object
    gold_trim.name = f"Judge_Panel_GoldTrim_{idx}"
    gold_trim.scale = (1.26, 0.02, 0.91)
    bpy.ops.object.transform_apply(scale=True)
    gold_trim.data.materials.append(mat_gold)
    apply_stylized_modifiers(gold_trim, bevel_width=0.008, segments=1)

# ---------------------------------------------------------
# 2. SOCLE DE FRAPPE DU MARTEAU (SOUND BLOCK)
# ---------------------------------------------------------
bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.06, vertices=24, location=(0.75, 0.15, 1.45))
sound_block = bpy.context.active_object
sound_block.name = "Gavel_Sound_Block"
sound_block.data.materials.append(mat_mahogany_dark)
apply_stylized_modifiers(sound_block, bevel_width=0.01, segments=2)

# Cerclage en laiton du sound block
bpy.ops.mesh.primitive_cylinder_add(radius=0.23, depth=0.025, vertices=24, location=(0.75, 0.15, 1.45))
block_brass = bpy.context.active_object
block_brass.name = "Gavel_Sound_Block_Brass"
block_brass.data.materials.append(mat_brass)
apply_stylized_modifiers(block_brass, bevel_width=0.005, segments=1)

# ---------------------------------------------------------
# 3. MARTEAU DE JUSTICE ÉLÉGANT (GAVEL)
# ---------------------------------------------------------
gavel_group = []

# Manche tourné
bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.48, vertices=16, location=(0.75, 0.15, 1.50))
gavel_handle = bpy.context.active_object
gavel_handle.name = "Gavel_Handle"
gavel_handle.rotation_euler = (0, math.radians(90), math.radians(25))
gavel_handle.data.materials.append(mat_mahogany_main)
apply_stylized_modifiers(gavel_handle, bevel_width=0.004, segments=1)
gavel_group.append(gavel_handle)

# Tête cylindrique de frappe
bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.22, vertices=20, location=(0.95, 0.24, 1.50))
gavel_head = bpy.context.active_object
gavel_head.name = "Gavel_Head"
gavel_head.rotation_euler = (math.radians(25), 0, 0)
gavel_head.data.materials.append(mat_mahogany_dark)
apply_stylized_modifiers(gavel_head, bevel_width=0.012, segments=2)
gavel_group.append(gavel_head)

# Anneau central en or sur la tête du marteau
bpy.ops.mesh.primitive_cylinder_add(radius=0.068, depth=0.04, vertices=20, location=(0.95, 0.24, 1.50))
gavel_ring = bpy.context.active_object
gavel_ring.name = "Gavel_Ring"
gavel_ring.rotation_euler = (math.radians(25), 0, 0)
gavel_ring.data.materials.append(mat_gold)
apply_stylized_modifiers(gavel_ring, bevel_width=0.004, segments=1)
gavel_group.append(gavel_ring)

# ---------------------------------------------------------
# 4. ACCESSOIRES DE TABLE DU JUGE (DOSSIERS & LAMPE DE MAGISTRAT)
# ---------------------------------------------------------
# Dossier juridique (Code de procédure HECh)
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.75, 0.12, 1.44))
dossier = bpy.context.active_object
dossier.name = "Judge_Dossier"
dossier.scale = (0.38, 0.52, 0.04)
dossier.rotation_euler = (0, 0, math.radians(-14))
bpy.ops.object.transform_apply(scale=True)
dossier.data.materials.append(mat_parchment)
apply_stylized_modifiers(dossier, bevel_width=0.005, segments=1)

# Lampe de banquier / juge en laiton avec abat-jour opaline vert
bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.02, vertices=16, location=(-1.45, 0.35, 1.44))
lamp_base = bpy.context.active_object
lamp_base.name = "Lamp_Base"
lamp_base.data.materials.append(mat_brass)
apply_stylized_modifiers(lamp_base, bevel_width=0.005, segments=1)

bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.38, vertices=12, location=(-1.45, 0.35, 1.63))
lamp_pole = bpy.context.active_object
lamp_pole.name = "Lamp_Pole"
lamp_pole.data.materials.append(mat_brass)

bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.30, vertices=16, location=(-1.45, 0.35, 1.82))
lamp_shade = bpy.context.active_object
lamp_shade.name = "Lamp_Shade"
lamp_shade.rotation_euler = (0, math.radians(90), 0)
mat_lamp_glass = create_material("Lamp_Glass_Green", (0.05, 0.45, 0.18, 1.0), roughness=0.15)
lamp_shade.data.materials.append(mat_lamp_glass)
apply_stylized_modifiers(lamp_shade, bevel_width=0.008, segments=2)

# ---------------------------------------------------------
# 5. EXPORT GLB TEMPS RÉEL OPTIMISÉ POUR THREE.JS
# ---------------------------------------------------------
output_dir = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\models"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "courtroom_bench_stylized.glb")

# Sélectionner tous les objets
bpy.ops.object.select_all(action='SELECT')

# Exporter
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False
)

print(f"EXPORT_SUCCESS: {output_path} ({os.path.getsize(output_path)} bytes)")
