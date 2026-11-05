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

# Materials
mat_skin = create_mat("Mat_Skin", (0.98, 0.84, 0.78, 1.0), roughness=0.45)
mat_hair = create_mat("Mat_BlondeHair", (0.95, 0.82, 0.38, 1.0), roughness=0.35)
mat_hair_dark = create_mat("Mat_BlondeShadow", (0.75, 0.58, 0.22, 1.0), roughness=0.40)
mat_suit = create_mat("Mat_NavySuit", (0.09, 0.14, 0.24, 1.0), roughness=0.60)
mat_shirt = create_mat("Mat_WhiteShirt", (0.96, 0.97, 0.99, 1.0), roughness=0.45)
mat_gold = create_mat("Mat_GoldTrim", (0.98, 0.82, 0.30, 1.0), roughness=0.20, metalness=0.90)
mat_eyes_white = create_mat("Mat_EyeWhite", (0.98, 0.98, 1.0, 1.0), roughness=0.08)
mat_eyes_iris = create_mat("Mat_EyeIris", (0.08, 0.58, 0.88, 1.0), roughness=0.12)
mat_pupil = create_mat("Mat_EyePupil", (0.02, 0.02, 0.03, 1.0), roughness=0.08)
mat_lips = create_mat("Mat_Lips", (0.94, 0.35, 0.48, 1.0), roughness=0.25)
mat_glasses = create_mat("Mat_GlassesFrame", (0.15, 0.18, 0.25, 1.0), roughness=0.15, metalness=0.92)
mat_tablet = create_mat("Mat_TabletBody", (0.05, 0.08, 0.14, 1.0), roughness=0.20, metalness=0.75)
mat_screen = create_mat("Mat_TabletScreen", (0.02, 0.70, 0.92, 1.0), roughness=0.08, emission=(0.04, 0.80, 0.98, 1.0), emission_strength=2.8)

# --- 1. HEAD & FACE ---
# Head base with smooth shading for beautiful skin
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=0.22, location=(0, 0, 1.18))
head = bpy.context.active_object
head.name = "Aurore_Head"
head.scale = (0.86, 0.96, 1.14)
bpy.ops.object.transform_apply(scale=True)
head.data.materials.append(mat_skin)
for poly in head.data.polygons:
    poly.use_smooth = True

# Add Shape Keys to Head
head.shape_key_add(name="Basis")
sk_mouth_open = head.shape_key_add(name="mouth_open")
sk_smile = head.shape_key_add(name="mouth_smile")
sk_brow_raise = head.shape_key_add(name="brow_raise")

for i, vert in enumerate(head.data.vertices):
    if vert.co.y > 0.12 and -0.16 < vert.co.z < -0.04:
        sk_mouth_open.data[i].co.z -= 0.032
        sk_mouth_open.data[i].co.y += 0.008
    if vert.co.y > 0.14 and -0.12 < vert.co.z < -0.05 and abs(vert.co.x) > 0.04:
        sk_smile.data[i].co.z += 0.016
        sk_smile.data[i].co.x *= 1.12
    if vert.co.y > 0.12 and 0.06 < vert.co.z < 0.14:
        sk_brow_raise.data[i].co.z += 0.022

# Cute feminine nose
bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.018, depth=0.045, location=(0, 0.218, 1.165))
nose = bpy.context.active_object
nose.rotation_euler = (math.radians(-65), 0, 0)
nose.data.materials.append(mat_skin)
for poly in nose.data.polygons: poly.use_smooth = True

# Sculpted Coral Lips (placed on the front of the face, cleanly visible)
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
for i, vert in enumerate(mouth.data.vertices):
    if vert.co.z < 0:
        sk_m_open.data[i].co.z -= 0.032
    else:
        sk_m_open.data[i].co.z += 0.012

# Eyes with Sclera, Iris, Pupil, Glint
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

    # Eyebrow
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.075, 0.20, 1.265))
    brow = bpy.context.active_object
    brow.name = f"Aurore_Brow_{side}"
    brow.scale = (0.055, 0.010, 0.009)
    brow.rotation_euler = (0, sign * math.radians(-12), 0)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    brow.data.materials.append(mat_hair_dark)

# Chic Glasses
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

# --- 2. STYLIZED BLONDE HAIR (MOVED BACK TO NEVER CLIP CHIN) ---
# Main hair volume placed at Y = -0.09 (back of head only)
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=18, radius=0.235, location=(0, -0.09, 1.22))
hair_main = bpy.context.active_object
hair_main.name = "Aurore_Hair_Crown"
hair_main.scale = (0.95, 0.88, 1.05)
bpy.ops.object.transform_apply(scale=True)
hair_main.data.materials.append(mat_hair)

# Side strands framing the cheekbones
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=0.07, depth=0.32, location=(sign * 0.17, 0.02, 1.10))
    strand = bpy.context.active_object
    strand.name = f"Aurore_Hair_Strand_{side}"
    strand.rotation_euler = (math.radians(170), sign * math.radians(12), sign * math.radians(-10))
    strand.scale = (0.9, 0.7, 1.0)
    strand.data.materials.append(mat_hair)

# Bangs over forehead
bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=0.10, depth=0.20, location=(0.04, 0.14, 1.29))
bangs = bpy.context.active_object
bangs.name = "Aurore_Hair_Bangs"
bangs.rotation_euler = (math.radians(115), math.radians(-25), math.radians(15))
bangs.scale = (1.2, 0.6, 1.0)
bangs.data.materials.append(mat_hair)

# --- 3. NECK & CLOTHING ---
bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.070, depth=0.16, location=(0, -0.02, 0.97))
neck = bpy.context.active_object
neck.data.materials.append(mat_skin)
for poly in neck.data.polygons: poly.use_smooth = True

# Collar lowered
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.12, depth=0.16, location=(0, 0.01, 0.87))
collar = bpy.context.active_object
collar.rotation_euler = (math.radians(180), 0, math.radians(45))
collar.data.materials.append(mat_shirt)

# Executive Blazer Jacket
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.24, depth=0.48, location=(0, 0, 0.72))
jacket = bpy.context.active_object
jacket.name = "Aurore_Jacket_Torso"
jacket.scale = (1.18, 0.85, 1.0)
bpy.ops.object.transform_apply(scale=True)
jacket.data.materials.append(mat_suit)

# Lapels with Gold Trim
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 0.10, 0.18, 0.80))
    lapel = bpy.context.active_object
    lapel.name = f"Aurore_Lapel_{side}"
    lapel.scale = (0.08, 0.03, 0.22)
    lapel.rotation_euler = (math.radians(12), sign * math.radians(-18), sign * math.radians(15))
    lapel.data.materials.append(mat_suit)

    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.003, depth=0.20, location=(sign * 0.13, 0.19, 0.80))
    trim = bpy.context.active_object
    trim.rotation_euler = (math.radians(12), sign * math.radians(-18), sign * math.radians(15))
    trim.data.materials.append(mat_gold)

# Arms & Hands
for side, sign in [("L", 1), ("R", -1)]:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.11, location=(sign * 0.26, 0.02, 0.86))
    shoulder = bpy.context.active_object
    shoulder.scale = (1.1, 0.9, 0.9)
    shoulder.data.materials.append(mat_suit)

    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.075, depth=0.32, location=(sign * 0.28, 0.06, 0.72))
    upper_arm = bpy.context.active_object
    upper_arm.rotation_euler = (math.radians(25), sign * math.radians(-18), sign * math.radians(10))
    upper_arm.data.materials.append(mat_suit)

    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.062, depth=0.28, location=(sign * 0.21, 0.20, 0.56))
    forearm = bpy.context.active_object
    forearm.rotation_euler = (math.radians(-45), sign * math.radians(35), 0)
    forearm.data.materials.append(mat_suit)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.052, location=(sign * 0.14, 0.29, 0.50))
    hand = bpy.context.active_object
    hand.scale = (0.75, 1.15, 0.65)
    hand.data.materials.append(mat_skin)

# --- 4. HOLOGRAPHIC TABLET ---
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.28, 0.51))
tablet = bpy.context.active_object
tablet.name = "Aurore_Cyber_Tablet"
tablet.scale = (0.24, 0.016, 0.16)
tablet.rotation_euler = (math.radians(35), 0, 0)
tablet.data.materials.append(mat_tablet)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.282, 0.51))
screen = bpy.context.active_object
screen.name = "Aurore_Tablet_Screen"
screen.scale = (0.22, 0.004, 0.14)
screen.rotation_euler = (math.radians(35), 0, 0)
screen.data.materials.append(mat_screen)

# Select all meshes for export
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

print(f"SUCCESS: Exported {output_path} (size: {os.path.getsize(output_path)} bytes)")
