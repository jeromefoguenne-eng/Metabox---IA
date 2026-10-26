import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

VOICE_JUDGE = "fr-BE-GerardNeural"  # Juge président solennel

CINEMATIC_TRACKS = [
    ("proces_judge_cinematic_intro", VOICE_JUDGE, "-1%", "-1Hz",
     "Silence dans la salle ! La Cour a délibéré. Voici la lecture intégrale des motifs ayant guidé l'arrêt du Tribunal."),

    ("proces_judge_cinematic_eco_ok", VOICE_JUDGE, "-1%", "-1Hz",
     "Premier motif, sur l'écologie. Le Tribunal retient l'aberration de gaspiller quarante-cinq mille litres d'eau potable pour des requêtes futiles. L'alerte climatique est reconnue fondée."),

    ("proces_judge_cinematic_data_ok", VOICE_JUDGE, "-1%", "-1Hz",
     "Deuxième motif, sur les données personnelles. L'aspiration clandestine des mémoires d'étudiants vers des serveurs privés étrangers viole l'article quarante-quatre du RGPD. La défense a apporté la preuve matérielle de cette exfiltration."),

    ("proces_judge_cinematic_cognition_ok", VOICE_JUDGE, "-1%", "-1Hz",
     "Troisième motif, sur l'autonomie cognitive. La Cour rappelle que le rôle fondamental d'une Haute École est de former des esprits critiques libres et non des consommateurs passifs aliénés par un algorithme."),

    ("proces_judge_cinematic_jobs_ok", VOICE_JUDGE, "-1%", "-1Hz",
     "Quatrième motif, sur l'emploi. Le mémo secret de suppression de vingt-cinq postes de secrétaires et tuteurs démontre une dérive technocratique inacceptable au détriment de l'humain."),

    ("proces_judge_cinematic_sovereignty_ok", VOICE_JUDGE, "-1%", "-1Hz",
     "Cinquième motif, sur la souveraineté. L'indépendance intellectuelle et démocratique de l'Europe ne saurait être abandonnée à des conglomérats privés américains ou chinois."),

    ("proces_judge_cinematic_propaganda_ok", VOICE_JUDGE, "-1%", "-1Hz",
     "Sixième motif, sur la propagande. La démonstration des bulles de filtre et de la censure idéologique prouve que les algorithmes imposés menaçaient le pluralisme des idées."),

    ("proces_judge_cinematic_innocent", VOICE_JUDGE, "-2%", "-1Hz",
     "En conséquence, au vu de ces six piliers déterminants, la Cour juge que l'acte commis relève de l'état de nécessité face à un danger imminent pour le bien commun. Maxime est déclaré PLEINEMENT INNOCENT et reconnu LANCEUR D'ALERTE d'intérêt public ! Que justice soit faite !"),

    ("proces_judge_cinematic_guilty", VOICE_JUDGE, "-2%", "-1Hz",
     "En conséquence, le nombre d'éléments d'intérêt général retenus étant insuffisant pour justifier une coupure totale des systèmes, la Cour retient la culpabilité de cyber-entrave. L'audience est levée.")
]

sem = asyncio.Semaphore(4)

async def synthesize(filename, voice, rate, pitch, text):
    async with sem:
        filepath = os.path.join(VOICES_DIR, f"{filename}.mp3")
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await communicate.save(filepath)
            print(f"  [OK] {filename}.mp3")
        except Exception as e:
            print(f"  [ERROR] {filename}: {e}")

async def main():
    print(f"Génération de {len(CINEMATIC_TRACKS)} pistes vocales pour la Cinématique du Juge...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in CINEMATIC_TRACKS]
    await asyncio.gather(*tasks)
    print("Synthèse des voix du Juge terminée !")

if __name__ == "__main__":
    asyncio.run(main())
