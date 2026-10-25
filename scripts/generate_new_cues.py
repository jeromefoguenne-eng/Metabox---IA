import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
VOICE_HOST = "fr-FR-RemyMultilingualNeural"

SCRIPTS = [
    ("intro_concours", VOICE_HOST, "+3%", "+1Hz",
     "Bienvenue au Grand Concours de la Haute École Charlemagne ! Vous affrontez en direct les meilleurs étudiants des campus Rivageois, Huy, Verviers et Outremeuse ! Vitesse de buzzer et précision... Que le meilleur gagne !"),
    ("opponent_buzz", VOICE_HOST, "+4%", "+1Hz",
     "Buzzer sur le plateau ! Un candidat adverse prend la main !"),
    ("tier_safety", VOICE_HOST, "+3%", "+1Hz",
     "Félicitations ! Vous franchissez le palier de sécurité des 24 crédits ECTS ! Ils sont définitivement acquis !"),
    ("tier_final", VOICE_HOST, "+2%", "+0Hz",
     "Attention ! Nous entrons dans les questions de haute exigence universitaire ! Le sommet des 60 crédits est à portée de main !")
]

async def gen():
    for f, v, r, p, text in SCRIPTS:
        c = edge_tts.Communicate(text, v, rate=r, pitch=p)
        await c.save(os.path.join(VOICES_DIR, f"{f}.mp3"))
        print(f"Generated {f}.mp3")

if __name__ == "__main__":
    asyncio.run(gen())
