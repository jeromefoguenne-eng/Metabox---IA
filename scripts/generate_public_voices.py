import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

# Voix variées du public (étudiants, professeurs, citoyens)
VOICE_MALE_1 = "fr-FR-HenriNeural"
VOICE_FEMALE_1 = "fr-FR-EloiseNeural"
VOICE_FEMALE_2 = "fr-BE-CharlineNeural"
VOICE_MALE_2 = "fr-FR-RemyMultilingualNeural"

PUBLIC_TRACKS = [
    # 1. Cris aléatoires "Libérez Maxime"
    ("proces_public_liberez_1", VOICE_FEMALE_1, "+15%", "+2Hz",
     "Libérez Maxime ! C'est un lanceur d'alerte, pas un criminel !"),
    
    ("proces_public_liberez_2", VOICE_MALE_1, "+12%", "-1Hz",
     "Libérez Maxime ! Il a sauvé nos données !"),
     
    ("proces_public_liberez_3", VOICE_FEMALE_2, "+18%", "+3Hz",
     "Libérez Maxime ! C'est une honte de le juger !"),
     
    ("proces_public_liberez_4", VOICE_MALE_2, "+20%", "+1Hz",
     "Maxime est innocent ! Liberté pour Maxime !"),

    # 2. Clameur de révolte avant menace d'évacuation par le Juge
    ("proces_public_chahut_evacuation", VOICE_MALE_1, "+25%", "+3Hz",
     "Scandale ! C'est une parodie de justice ! Libérez-le immédiatement !"),

    ("proces_public_brouhaha", VOICE_FEMALE_1, "+20%", "+2Hz",
     "Non au tout-IA ! Vous ne nous ferez pas taire ! Libérez Maxime !"),

    # 3. Réaction d'approbation enthousiaste (Bravo / Applaudissements)
    ("proces_public_cheer_1", VOICE_FEMALE_2, "+12%", "+2Hz",
     "Bravo ! Exactement ! C'est bien dit Maître !"),

    ("proces_public_cheer_2", VOICE_MALE_2, "+10%", "+1Hz",
     "Très bien plaidé ! Voilà la vérité !"),

    # 4. Réaction de huée et désapprobation (Bouuuh)
    ("proces_public_boo_1", VOICE_MALE_1, "+8%", "-2Hz",
     "Bouuuuh ! C'est lamentable ! Vous défendez n'importe quoi !"),

    ("proces_public_boo_2", VOICE_FEMALE_1, "+12%", "+0Hz",
     "Bouh ! Quelle mauvaise défense ! C'est ridicule !")
]

sem = asyncio.Semaphore(4)

async def synthesize(filename, voice, rate, pitch, text):
    async with sem:
        filepath = os.path.join(VOICES_DIR, f"{filename}.mp3")
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await communicate.save(filepath)
            print(f"  [OK] {filename}.mp3 généré ({len(text)} car)")
        except Exception as e:
            print(f"  [ERROR] {filename}: {e}")

async def main():
    print(f"Génération de {len(PUBLIC_TRACKS)} pistes vocales pour le Public du Tribunal...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in PUBLIC_TRACKS]
    await asyncio.gather(*tasks)
    print("Synthèse audio du Public terminée avec succès !")

if __name__ == "__main__":
    asyncio.run(main())
