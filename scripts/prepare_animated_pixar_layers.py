import os
import sys
import cv2
import numpy as np
from PIL import Image
import rembg

def main():
    base_dir = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA"
    sources_dir = os.path.join(base_dir, "public", "videos", "sources")
    output_dir = os.path.join(base_dir, "public", "images", "pixar_studio")
    os.makedirs(output_dir, exist_ok=True)

    intro_path = os.path.join(sources_dir, "keyframe_1_intro.jpg")
    cel_path = os.path.join(sources_dir, "keyframe_2_celebration.jpg")
    vic_path = os.path.join(sources_dir, "keyframe_3_victory.jpg")

    session = rembg.new_session()

    # 1. Extraction Henri Idle (Buste et tête au-dessus du pupitre)
    print("Extracting Henri Idle...")
    img_intro = Image.open(intro_path)
    # Cropping ROI around Henri (centre de l'image)
    # Dimensions: 1376 x 768
    # Henri est centré autour de x=688, de y=140 à y=560
    # Gardons une marge confortable pour la tête et les bras
    w, h = img_intro.size
    henri_box = (int(w * 0.28), int(h * 0.15), int(w * 0.72), int(h * 0.65))
    henri_crop = img_intro.crop(henri_box)
    
    henri_idle_transparent = rembg.remove(henri_crop, session=session)
    henri_idle_transparent.save(os.path.join(output_dir, "henri_idle_cutout.png"))
    print("Saved henri_idle_cutout.png")

    # 2. Extraction Henri Celebration
    print("Extracting Henri Celebration...")
    img_cel = Image.open(cel_path)
    henri_cel_crop = img_cel.crop(henri_box)
    henri_cel_transparent = rembg.remove(henri_cel_crop, session=session)
    henri_cel_transparent.save(os.path.join(output_dir, "henri_celebration_cutout.png"))
    print("Saved henri_celebration_cutout.png")

    # 3. Extraction Henri Victory
    print("Extracting Henri Victory...")
    img_vic = Image.open(vic_path)
    # Pour la victoire, le trophée monte plus haut
    vic_box = (int(w * 0.24), int(h * 0.05), int(w * 0.76), int(h * 0.65))
    henri_vic_crop = img_vic.crop(vic_box)
    henri_vic_transparent = rembg.remove(henri_vic_crop, session=session)
    henri_vic_transparent.save(os.path.join(output_dir, "henri_victory_cutout.png"))
    print("Saved henri_victory_cutout.png")

    # 4. Extraction du Pupitre HECh Officiel au premier plan
    print("Extracting Podium HECh...")
    # Le pupitre est en bas au centre : x de 0.32 à 0.68, y de 0.45 à 1.0
    podium_box = (int(w * 0.32), int(h * 0.46), int(w * 0.68), h)
    podium_crop = img_intro.crop(podium_box)
    podium_np = np.array(podium_crop)
    # Masque du pupitre (forme galbée)
    pod_h, pod_w, _ = podium_np.shape
    pod_mask = np.zeros((pod_h, pod_w), dtype=np.uint8)
    # Courbe du pupitre
    pts = np.array([
        [int(pod_w * 0.05), int(pod_h * 0.08)],
        [int(pod_w * 0.95), int(pod_h * 0.08)],
        [int(pod_w * 0.88), pod_h],
        [int(pod_w * 0.12), pod_h]
    ], np.int32)
    cv2.fillConvexPoly(pod_mask, pts, 255)
    pod_mask = cv2.GaussianBlur(pod_mask, (15, 15), 5)
    
    podium_rgba = np.dstack([podium_np, pod_mask])
    Image.fromarray(podium_rgba).save(os.path.join(output_dir, "podium_hech_front.png"))
    print("Saved podium_hech_front.png")

    # 5. Découpage du Décor de Fond (Amphithéâtre + Arche + Écran central)
    print("Creating Studio Background...")
    # L'image intro sert de décor de base
    img_intro_cv = cv2.imread(intro_path)
    # Masquage doux de la zone d'Henri sur le fond pour pouvoir superposer l'écran dynamique
    # et réinsérer Henri animé par-dessus
    cv2.imwrite(os.path.join(output_dir, "studio_arena_base.webp"), img_intro_cv, [cv2.IMWRITE_WEBP_QUALITY, 95])
    print("All layers extracted successfully!")

if __name__ == "__main__":
    main()
