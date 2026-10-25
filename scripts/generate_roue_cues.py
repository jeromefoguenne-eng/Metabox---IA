import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
VOICE_HOST = "fr-FR-RemyMultilingualNeural"

SCRIPTS = [
    ("q_ortho_8", VOICE_HOST, "+3%", "+0Hz", "Huitième manche ! Conjuguez le verbe acquérir au subjonctif présent, à la troisième personne du singulier !"),
    ("q_ortho_9", VOICE_HOST, "+3%", "+0Hz", "Avant-dernière rotation de la roue ! Conjuguez le verbe envoyer au futur simple, à la première personne du pluriel !"),
    ("q_ortho_10", VOICE_HOST, "+3%", "+0Hz", "Dixième et ultime manche décisive ! Conjuguez le verbe résoudre au participe passé, au masculin pluriel !"),
    ("roue_bankrupt", VOICE_HOST, "+2%", "-1Hz", "Banqueroute ! Coup de tonnerre sur le plateau ! Vous perdez vos points de manche et une précieuse vie !"),
    ("roue_life_lost", VOICE_HOST, "+2%", "-1Hz", "Aïe ! Erreur sur l'accord... Vous perdez une vie ! Attention, la réserve s'épuise !"),
    ("roue_victory_10", VOICE_HOST, "+4%", "+1Hz", "Triomphe légendaire ! Vous avez survécu aux dix manches de La Roue des Accords ! Votre nom entre au panthéon des majors de la Haute École Charlemagne !")
]

async def gen():
    for f, v, r, p, text in SCRIPTS:
        c = edge_tts.Communicate(text, v, rate=r, pitch=p)
        await c.save(os.path.join(VOICES_DIR, f"{f}.mp3"))
        print(f"Generated {f}.mp3")

if __name__ == "__main__":
    asyncio.run(gen())
