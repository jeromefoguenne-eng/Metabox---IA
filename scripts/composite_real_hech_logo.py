"""
Composite le VRAI logo officiel de la HECh (hech_logo_officiel.png) en perspective 3D
sur la plaque frontale rétro-éclairée du pupitre de Henri pour les 4 plans HD.
"""
import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

PROJECT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA"
LOGO_PATH = os.path.join(PROJECT_DIR, "public", "images", "hech_logo_officiel.png")
COMFY_INPUT = r"E:\ComfyUI\input"
OUT_IMG_DIR = os.path.join(PROJECT_DIR, "public", "images")

PLANS = [
    {
        "name": "plan1",
        "src": os.path.join(OUT_IMG_DIR, "plan1_accueil_detendu_1795154875420.jpg"),
        # Coins [TL, TR, BR, BL] en fractions de (width, height) pour le pupitre 3/4
        "quad_norm": [(0.285, 0.778), (0.478, 0.806), (0.475, 0.935), (0.288, 0.903)]
    },
    {
        "name": "plan2",
        "src": os.path.join(OUT_IMG_DIR, "plan2_reflexion_analytique_v2_1795154932979.jpg"),
        "quad_norm": [(0.285, 0.778), (0.478, 0.806), (0.475, 0.935), (0.288, 0.903)]
    },
    {
        "name": "plan3",
        "src": os.path.join(OUT_IMG_DIR, "plan3_suspense_ultime_1795154903109.jpg"),
        # Pupitre centré de face
        "quad_norm": [(0.378, 0.836), (0.622, 0.836), (0.622, 0.985), (0.378, 0.985)]
    },
    {
        "name": "plan4",
        "src": os.path.join(OUT_IMG_DIR, "plan4_victoire_60ects_1795154911994.jpg"),
        "quad_norm": [(0.285, 0.778), (0.478, 0.806), (0.475, 0.935), (0.288, 0.903)]
    }
]

def build_backlit_logo_plaque(logo_path, plaque_w=640, plaque_h=340):
    """Construit une plaque lumineuse blanche haut de gamme avec le vrai logo HECh."""
    # Fond ivoire/blanc rétro-éclairé avec léger dégradé studio
    plaque = Image.new("RGBA", (plaque_w, plaque_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plaque)

    # Rectangle arrondi blanc lumineux
    radius = 44
    draw.rounded_rectangle([8, 8, plaque_w - 8, plaque_h - 8], radius=radius, fill=(246, 248, 252, 255), outline=(255, 226, 150, 255), width=6)

    # Charger le vrai logo officiel HECh
    logo = Image.open(logo_path).convert("RGBA")
    # Redimensionner le logo pour tenir harmonieusement avec marges
    pad_x, pad_y = 64, 30
    max_w = plaque_w - 2 * pad_x
    max_h = plaque_h - 2 * pad_y
    scale = min(max_w / logo.width, max_h / logo.height)
    new_w = int(logo.width * scale)
    new_h = int(logo.height * scale)
    logo_resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Centrer le logo sur la plaque
    ox = (plaque_w - new_w) // 2
    oy = (plaque_h - new_h) // 2
    plaque.alpha_composite(logo_resized, (ox, oy))

    # Subtil reflet de lumière studio en haut
    glare = Image.new("RGBA", (plaque_w, plaque_h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glare)
    g_draw.rounded_rectangle([14, 14, plaque_w - 14, plaque_h // 2], radius=32, fill=(255, 255, 255, 22))
    plaque = Image.alpha_composite(plaque, glare)

    return plaque

def composite_plan(plan, plaque_rgba):
    img = cv2.imread(plan["src"])
    if img is None:
        print(f"⚠️ Image introuvable : {plan['src']}")
        return
    h, w = img.shape[:2]

    # Convertir la plaque PIL RGBA -> OpenCV BGRA
    plaque_np = np.array(plaque_rgba)
    plaque_bgra = cv2.cvtColor(plaque_np, cv2.COLOR_RGBA2BGRA)
    ph, pw = plaque_bgra.shape[:2]

    src_pts = np.array([[0, 0], [pw, 0], [pw, ph], [0, ph]], dtype=np.float32)
    dst_pts = np.array([[x * w, y * h] for (x, y) in plan["quad_norm"]], dtype=np.float32)

    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(plaque_bgra, M, (w, h), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))

    # Alpha blending propre
    alpha = warped[:, :, 3:4].astype(np.float32) / 255.0
    # Légère adaptation lumineuse pour fondre dans l'ambiance sombre du studio
    fg = warped[:, :, :3].astype(np.float32) * 0.93
    bg = img.astype(np.float32)

    out = (fg * alpha + bg * (1.0 - alpha)).astype(np.uint8)

    out_name = f"henri_real_logo_{plan['name']}.jpg"
    out_public = os.path.join(OUT_IMG_DIR, out_name)
    out_comfy = os.path.join(COMFY_INPUT, out_name)
    cv2.imwrite(out_public, out, [int(cv2.IMWRITE_JPEG_QUALITY), 97])
    cv2.imwrite(out_comfy, out, [int(cv2.IMWRITE_JPEG_QUALITY), 97])
    print(f"✅ Vrai logo HECh intégré en perspective : {out_public}")

def main():
    plaque = build_backlit_logo_plaque(LOGO_PATH)
    for p in PLANS:
        composite_plan(p, plaque)
    print("🏁 Toutes les keyframes officielles portent désormais le VRAI logo HECh !")

if __name__ == "__main__":
    main()
