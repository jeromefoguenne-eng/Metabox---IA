"""
Crée l'Image Maître Officielle (master_wwtbam_hech_base.jpg) à partir de
pixar_millionaire_dark_studio.jpg (esthétique exacte validée par l'utilisateur)
en intégrant le VRAI logo officiel de la HECh sur le panneau central vitré du pupitre.
"""
import os
import cv2
import numpy as np
from PIL import Image, ImageDraw

PROJECT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA"
ARTIFACT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\brain\65bbf4ad-fe19-4bd2-8780-ee6d91efae74"
BASE_IMG = os.path.join(PROJECT_DIR, "public", "images", "pixar_millionaire_dark_studio.jpg")
LOGO_IMG = os.path.join(PROJECT_DIR, "public", "images", "hech_logo_officiel.png")

def main():
    img = cv2.imread(BASE_IMG)
    h, w = img.shape[:2]

    # Panneau central vitré du pupitre (coordonnées exactes sur pixar_millionaire_dark_studio.jpg)
    # Centre X = 0.500, largeur panneau central = [0.432 .. 0.568], hauteur = [0.660 .. 0.825]
    x1, x2 = int(w * 0.436), int(w * 0.564)
    y1, y2 = int(h * 0.678), int(h * 0.806)
    pw, ph = x2 - x1, y2 - y1

    # Créer une plaque translucide lumineuse blanche/bleutée parfaitement fondue dans le verre dépoli
    plaque = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plaque)
    draw.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=14, fill=(238, 244, 252, 232), outline=(185, 210, 240, 210), width=2)

    # Charger et redimensionner le vrai logo officiel HECh
    logo = Image.open(LOGO_IMG).convert("RGBA")
    pad_x, pad_y = int(pw * 0.08), int(ph * 0.08)
    scale = min((pw - 2 * pad_x) / logo.width, (ph - 2 * pad_y) / logo.height)
    lw, lh = int(logo.width * scale), int(logo.height * scale)
    logo_r = logo.resize((lw, lh), Image.Resampling.LANCZOS)
    plaque.alpha_composite(logo_r, ((pw - lw) // 2, (ph - lh) // 2))

    # Fusionner avec léger assombrissement studio (0.86) pour respecter la luminosité sombre WWTBAM
    plaque_np = np.array(plaque)
    plaque_bgra = cv2.cvtColor(plaque_np, cv2.COLOR_RGBA2BGRA)
    alpha = plaque_bgra[:, :, 3:4].astype(np.float32) / 255.0
    fg = plaque_bgra[:, :, :3].astype(np.float32) * 0.86

    roi = img[y1:y2, x1:x2].astype(np.float32)
    blended = (fg * alpha + roi * (1.0 - alpha)).astype(np.uint8)
    img[y1:y2, x1:x2] = blended

    out_art = os.path.join(ARTIFACT_DIR, "master_wwtbam_hech_base.jpg")
    out_pub = os.path.join(PROJECT_DIR, "public", "images", "master_wwtbam_hech_base.jpg")
    out_comfy = r"E:\ComfyUI\input\master_wwtbam_hech_base.jpg"
    for p in [out_art, out_pub, out_comfy]:
        cv2.imwrite(p, img, [int(cv2.IMWRITE_JPEG_QUALITY), 97])
    print(f"✅ Image Maître créée ({w}x{h}) : {out_art}")

if __name__ == "__main__":
    main()
