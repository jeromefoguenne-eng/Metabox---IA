import asyncio
import os
import subprocess
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
TEMP_DIR = os.path.join("public", "audio", "temp_crowd")
os.makedirs(VOICES_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# 1. Génération des pistes individuelles avec edge_tts
VOICE_M1 = "fr-FR-HenriNeural"
VOICE_F1 = "fr-FR-EloiseNeural"
VOICE_F2 = "fr-BE-CharlineNeural"
VOICE_M2 = "fr-FR-RemyMultilingualNeural"
VOICE_F3 = "fr-FR-VivienneMultilingualNeural"

INDIVIDUAL_CLIPS = [
    # Chorus 1: Libérez Maxime (Innocent)
    ("c1_m1", VOICE_M1, "+12%", "+1Hz", "Libérez Maxime ! Il est innocent !"),
    ("c1_f1", VOICE_F1, "+15%", "+2Hz", "Libérez Maxime ! Il est innocent !"),
    ("c1_f2", VOICE_F2, "+18%", "+3Hz", "Libérez Maxime !"),
    ("c1_m2", VOICE_M2, "+14%", "-1Hz", "Il est innocent ! Libérez-le !"),

    # Chorus 2: Libérez Maxime (Lanceur d'alerte)
    ("c2_m1", VOICE_M1, "+14%", "+2Hz", "Libérez Maxime ! C'est un lanceur d'alerte !"),
    ("c2_f1", VOICE_F1, "+16%", "+2Hz", "Libérez Maxime ! Lanceur d'alerte !"),
    ("c2_f2", VOICE_F2, "+15%", "+3Hz", "C'est un lanceur d'alerte !"),
    ("c2_m2", VOICE_M2, "+12%", "+0Hz", "Libérez Maxime ! Il a sauvé nos données !"),

    # Chorus 3: Liberté pour Maxime
    ("c3_m1", VOICE_M1, "+15%", "+1Hz", "Liberté pour Maxime !"),
    ("c3_f1", VOICE_F1, "+18%", "+2Hz", "Libérez-le immédiatement !"),
    ("c3_f2", VOICE_F2, "+16%", "+3Hz", "Liberté pour Maxime !"),
    ("c3_m2", VOICE_M2, "+14%", "-1Hz", "Libérez Maxime ! Non à la prison !"),

    # Chahut de révolte avant menace du Juge (Uproar)
    ("uproar_1", VOICE_M1, "+22%", "+3Hz", "Scandale ! C'est une parodie de justice !"),
    ("uproar_2", VOICE_F1, "+24%", "+4Hz", "Libérez-le ! Vous ne nous ferez pas taire !"),
    ("uproar_3", VOICE_F2, "+20%", "+2Hz", "Non au tout-IA ! Libérez Maxime !"),
    ("uproar_4", VOICE_M2, "+25%", "+1Hz", "C'est une honte ! Arrêtez cette mascarade !"),

    # Approbations polyphoniques (Bravo !)
    ("cheer_1", VOICE_F1, "+14%", "+2Hz", "Bravo ! Exactement !"),
    ("cheer_2", VOICE_M1, "+12%", "+1Hz", "Très bien plaidé Maître ! C'est la vérité !"),
    ("cheer_3", VOICE_F2, "+16%", "+3Hz", "Bravo ! Voilà les faits !"),
    ("cheer_4", VOICE_M2, "+10%", "-1Hz", "Exactement !"),

    # Huées polyphoniques (Bouuuuh !)
    ("boo_1", VOICE_M1, "+10%", "-2Hz", "Bouuuuh ! C'est lamentable !"),
    ("boo_2", VOICE_F1, "+12%", "+0Hz", "Bouh ! N'importe quoi !"),
    ("boo_3", VOICE_M2, "+8%", "-3Hz", "Bouuuuh ! Honte à cette défense !"),
    ("boo_4", VOICE_F2, "+14%", "+1Hz", "C'est ridicule ! Bouh !")
]

async def generate_clips():
    sem = asyncio.Semaphore(5)
    async def synth(name, voice, rate, pitch, text):
        async with sem:
            path = os.path.join(TEMP_DIR, f"{name}.mp3")
            comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await comm.save(path)
            print(f"  [RAW] {name}.mp3")

    tasks = [synth(n, v, r, p, t) for n, v, r, p, t in INDIVIDUAL_CLIPS]
    await asyncio.gather(*tasks)

def mix_clips(inputs, delays_ms, volumes, output_name):
    """Mixe plusieurs voix avec décalages temporels (delays) et volumes pour créer un chœur intelligible."""
    out_path = os.path.join(VOICES_DIR, f"{output_name}.mp3")
    
    # Construction de la commande ffmpeg complexe
    cmd = ["ffmpeg", "-y"]
    for inp in inputs:
        cmd.extend(["-i", os.path.join(TEMP_DIR, f"{inp}.mp3")])

    # Filtre de délai et d'amix
    filter_parts = []
    for i, delay in enumerate(delays_ms):
        vol = volumes[i]
        filter_parts.append(f"[{i}:a]adelay={delay}|{delay},volume={vol}[a{i}]")
    
    amix_inputs = "".join([f"[a{i}]" for i in range(len(inputs))])
    filter_parts.append(f"{amix_inputs}amix=inputs={len(inputs)}:duration=longest:dropout_transition=2,volume=1.35[outa]")
    
    filter_complex = ";".join(filter_parts)
    cmd.extend(["-filter_complex", filter_complex, "-map", "[outa]", "-c:a", "libmp3lame", "-b:a", "192k", out_path])
    
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode == 0:
        print(f"  [MIX SUCCESS] {output_name}.mp3 généré !")
    else:
        print(f"  [MIX ERROR] {output_name}: {res.stderr.decode('utf-8', errors='ignore')[:200]}")

async def main():
    print("Étape 1: Synthèse des pistes vocales individuelles...")
    await generate_clips()

    print("\nÉtape 2: Mixage polyphonique stéréo FFmpeg (Foule intelligible & puissante)...")
    
    # 1. Libérez Maxime 1 (Chœur 4 voix décalées de 40ms à 160ms)
    mix_clips(
        ["c1_m1", "c1_f1", "c1_f2", "c1_m2"],
        [0, 60, 140, 220],
        [1.0, 0.95, 0.85, 0.9],
        "proces_public_liberez_poly_1"
    )

    # 2. Libérez Maxime 2 (Lanceur d'alerte)
    mix_clips(
        ["c2_m1", "c2_f1", "c2_f2", "c2_m2"],
        [0, 70, 160, 260],
        [1.0, 0.95, 0.85, 0.9],
        "proces_public_liberez_poly_2"
    )

    # 3. Libérez Maxime 3 (Liberté pour Maxime)
    mix_clips(
        ["c3_m1", "c3_f1", "c3_f2", "c3_m2"],
        [0, 80, 150, 240],
        [1.0, 0.95, 0.85, 0.9],
        "proces_public_liberez_poly_3"
    )

    # 4. Grand Chahut / Révolte du public avant la menace du juge
    mix_clips(
        ["uproar_1", "uproar_2", "uproar_3", "uproar_4"],
        [0, 90, 200, 320],
        [1.1, 1.05, 0.95, 1.0],
        "proces_public_chahut_poly"
    )

    # 5. Applaudissements & Acclamations en chœur
    mix_clips(
        ["cheer_1", "cheer_2", "cheer_3", "cheer_4"],
        [0, 100, 220, 350],
        [1.0, 0.95, 0.9, 0.85],
        "proces_public_cheer_poly"
    )

    # 6. Huées de la foule en chœur
    mix_clips(
        ["boo_1", "boo_2", "boo_3", "boo_4"],
        [0, 80, 180, 280],
        [1.1, 1.0, 0.95, 0.9],
        "proces_public_boo_poly"
    )

    print("\nSynthèse polyphonique du public terminée avec brio !")

if __name__ == "__main__":
    asyncio.run(main())
