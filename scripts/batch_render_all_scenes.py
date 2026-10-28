"""
Batch Production Runner for Métabox IA Pixar 3D Video Cinematics
Iterates through all game scenes, checks ComfyUI status, and renders videos sequentially.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
import subprocess

try:
    if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

SOURCES_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos\sources"
OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos"
FFMPEG_EXE = r"E:\ComfyUI\venv\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win64-v4.2.2.exe"
COMFY_URL = "http://127.0.0.1:8188"

SCENES_CONFIG = [
    {
        "id": "tribunal_silence",
        "title": "Tribunal - Juge Marteau & Silence",
        "model": "14B",
        "prompt": (
            "Masterpiece 3D animated character in Disney Pixar style, dignified judge in black judicial robe "
            "striking wooden gavel firmly onto sound block, authoritative head nod, demanding quiet in courtroom, "
            "subtle breathing, expressive eyes, dramatic lighting, fluid Pixar animation."
        )
    },
    {
        "id": "tribunal_intro",
        "title": "Tribunal - Entrée en Séance",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated scene in Disney Pixar style, grand majestic courtroom, "
            "dignified elderly judge sitting at elevated bench, student defendant at defense table, "
            "slow cinematic camera drift forward, gentle volumetric sunbeams, warm ambient lighting."
        )
    },
    {
        "id": "tribunal_foule",
        "title": "Tribunal - Foule en Ébullition",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated crowd in Disney Pixar style, lively young students in courtroom audience benches, "
            "heads turning, whispering to each other, animated facial expressions, natural subtle gestures, warm court lighting."
        )
    },
    {
        "id": "tribunal_verdict_maxime",
        "title": "Tribunal - Acquittement de Maxime",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated character in Disney Pixar style, handsome 20-year-old student Maxime taking a deep relieved breath, "
            "warm happy grateful smile, nodding gently with relief, hopeful eyes, soft golden rim lighting."
        )
    },
    {
        "id": "tv_show_plateau",
        "title": "Émission TV - Plateau du Grand Jeu",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated character in Disney Pixar style, charismatic TV game show host holding vintage microphone, "
            "smiling warmly at the camera, raising his free hand in a welcoming greeting, rotating stage lights, vibrant game show."
        )
    },
    {
        "id": "tv_show_victoire",
        "title": "Émission TV - Triomphe & Confettis",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated character in Disney Pixar style, TV game show host cheering enthusiastically, "
            "raising both arms in victory, warm beaming smile, confetti showering down, dazzling celebration lighting."
        )
    },
    {
        "id": "factcheck_lab_intro",
        "title": "Fact-Checking - Cyber-Lab Enquêtrice",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated character in Disney Pixar style, female cyber investigator turning her head and smiling confidently, "
            "subtle hand wave towards floating holographic data screens, futuristic cyan laboratory lighting, fluid motion."
        )
    },
    {
        "id": "aurore_presentatrice",
        "title": "AURORE - Présentatrice Vivante",
        "model": "1.3B",
        "prompt": (
            "Masterpiece 3D animated character in Disney Pixar style, smart blonde woman Aurore with glasses and navy blue blazer, "
            "holding glowing interactive tablet, smiling warmly at viewer, gentle head tilt and friendly wave, natural breathing."
        )
    }
]


def render_all():
    print("=" * 70)
    print("🎬 Batch Production Wan 2.1 — Métabox IA (Pixar Studio)")
    print(f"📂 Destinations : {OUTPUT_DIR}")
    print("=" * 70)

    for idx, sc in enumerate(SCENES_CONFIG):
        out_file = os.path.join(OUTPUT_DIR, f"{sc['id']}.mp4")
        if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
            print(f"[{idx+1}/{len(SCENES_CONFIG)}] ⏭️ Déjà prêt : {sc['title']} ({sc['id']}.mp4)")
            continue

        print(f"\n[{idx+1}/{len(SCENES_CONFIG)}] 🚀 Lancement : {sc['title']} ({sc['model']})...")
        cmd = [
            "python",
            r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\scripts\run_wan_production.py",
            "--scene", sc['id'],
            "--model", sc['model'],
            "--prompt", sc['prompt']
        ]
        res = subprocess.run(cmd)
        if res.returncode == 0:
            print(f"    ✅ Terminé pour {sc['id']}.mp4")
        else:
            print(f"    ⚠️ Erreur sur {sc['id']}")
            
        time.sleep(5)


if __name__ == "__main__":
    render_all()
