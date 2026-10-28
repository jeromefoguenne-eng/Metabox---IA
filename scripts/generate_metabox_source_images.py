"""
Batch Generation of 3D Pixar Source Keyframes for Métabox IA
Generates 10 cinematic source images (832x480 - 16:9) using Flux / Pollinations AI.
"""

import os
import sys
import time
import urllib.parse
import urllib.request
from PIL import Image

try:
    if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos\sources"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SCENES = [
    {
        "id": "tribunal_intro",
        "title": "Tribunal - Ouverture de séance",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, majestic grand courtroom hall, "
            "wise dignified elderly judge in black judicial robe sitting at elevated polished oak bench, "
            "male student defendant seated at defense table, gallery benches filled with attentive audience, "
            "warm cinematic volumetric sunbeams through arched windows, rich wood textures, crisp 3D CGI."
        )
    },
    {
        "id": "tribunal_silence",
        "title": "Tribunal - Le Juge réclame le Silence",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, medium close-up of wise dignified judge in black robe "
            "sitting at ornate oak desk, raising wooden gavel in hand ready to strike sound block, "
            "authoritative stern yet fair expression, majestic courtroom background with soft golden lighting, "
            "ultra high detailed 3D Pixar character."
        )
    },
    {
        "id": "tribunal_foule",
        "title": "Tribunal - Réactions du Public",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, courtroom audience benches filled with diverse animated people, "
            "young university students and citizens expressing engaged emotions, expressive facial animations, "
            "oak wall paneling, warm court ambient lighting, rich cinematic Pixar movie crowd scene."
        )
    },
    {
        "id": "tribunal_verdict_maxime",
        "title": "Tribunal - Maxime Soulagé & Verdict",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, handsome 20-year-old college student Maxime "
            "in neat casual blazer standing at courtroom defense table, relieved happy warm smile, hopeful expressive eyes, "
            "warm golden rim lighting, courtroom background with soft cinematic depth of field."
        )
    },
    {
        "id": "tv_show_plateau",
        "title": "Émission TV - Plateau du Grand Jeu",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, charismatic smiling TV game show host "
            "in elegant navy blue tailored suit holding vintage microphone, welcoming open arms gesture "
            "on spectacular illuminated game show studio stage, futuristic glowing neon podiums, "
            "dynamic studio spotlights, cheering audience in background, Pixar studio quality."
        )
    },
    {
        "id": "tv_show_suspense",
        "title": "Émission TV - Palier Suspense",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, dramatic intense TV game show studio moment, "
            "medium close-up of charismatic game show host looking focused with suspenseful expression, "
            "dimmed moody blue and golden spotlighting, glowing question screen behind him, high cinematic tension."
        )
    },
    {
        "id": "tv_show_victoire",
        "title": "Émission TV - Triomphe & Confettis",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, grand victory celebration on TV game show stage, "
            "joyful animated host raising both arms celebrating, colorful confetti falling, "
            "dazzling golden stage lights, triumphant cheerful expression, celebratory Pixar movie scene."
        )
    },
    {
        "id": "factcheck_lab_intro",
        "title": "Fact-Checking - Le Cyber-Lab",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, brilliant female cyber investigator in modern sleek tech laboratory, "
            "glowing floating transparent holographic data screens analyzing digital photos and neural network graphs, "
            "warm welcoming smile, clean futuristic interior, cinematic cyan and amber lighting."
        )
    },
    {
        "id": "factcheck_scan",
        "title": "Fact-Checking - Analyse de Deepfake",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, close-up in high tech digital forensics lab, "
            "holographic blue scanning laser inspecting deepfake facial wireframe on transparent screen, "
            "advanced cyber investigation, intricate glowing holograms, Pixar CGI animation."
        )
    },
    {
        "id": "aurore_presentatrice",
        "title": "AURORE - Présentatrice Escape Game",
        "prompt": (
            "Masterpiece 3D animated film in Disney Pixar style, beautiful 30-year-old smart blonde woman Aurore "
            "wearing delicate stylish glasses and navy blue blazer with official silver pin, "
            "holding glowing interactive digital tablet, friendly engaging confident smile, "
            "modern university tech hub background, soft portrait lighting."
        )
    }
]


def download_image(scene, index):
    filename = f"{scene['id']}.jpg"
    target_path = os.path.join(OUTPUT_DIR, filename)
    print(f"[{index+1}/{len(SCENES)}] Génération de : {scene['title']} ({filename})...")
    
    encoded_prompt = urllib.parse.quote(scene['prompt'])
    seed = 1000 + index * 47
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=832&height=480&model=flux&nologo=true&seed={seed}"
    
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=35) as resp:
                data = resp.read()
                with open(target_path, "wb") as f:
                    f.write(data)
            
            # Verify and ensure 832x480
            with Image.open(target_path) as img:
                if img.size != (832, 480):
                    img = img.resize((832, 480), Image.Resampling.LANCZOS)
                    img.save(target_path, "JPEG", quality=95)
            
            size_kb = os.path.getsize(target_path) / 1024
            print(f"    ✅ Image générée avec succès : {size_kb:.1f} Ko (832x480)")
            return True
        except Exception as e:
            print(f"    ⚠️ Tentative {attempt+1}/3 échouée ({e}). Nouvelle tentative...")
            time.sleep(2)
            
    print(f"    ❌ Échec génération pour {filename}")
    return False


def main():
    print("=" * 70)
    print("🎨 Génération des 10 Images Clés Pixar 3D (Métabox IA)")
    print(f"📂 Destination : {OUTPUT_DIR}")
    print("=" * 70)
    
    success = 0
    for idx, sc in enumerate(SCENES):
        if download_image(sc, idx):
            success += 1
        time.sleep(1)
        
    print("=" * 70)
    print(f"🎉 Terminé : {success}/{len(SCENES)} images générées avec succès !")
    print("=" * 70)


if __name__ == "__main__":
    main()
