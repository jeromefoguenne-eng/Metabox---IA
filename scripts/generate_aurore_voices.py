import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

# A.U.R.O.R.E. uses fr-FR-VivienneMultilingualNeural or fr-FR-DeniseNeural (crisp, analytical, intellectual AI)
VOICE_AURORE = "fr-FR-VivienneMultilingualNeural"
VOICE_HOST = "fr-FR-RemyMultilingualNeural"
VOICE_SAR = "fr-BE-CharlineNeural"

AURORE_SCRIPTS = [
    # Acte 1 : Intro A.U.R.O.R.E.
    ("aurore_intro", VOICE_AURORE, "+2%", "+1Hz",
     "Alerte de sécurité de niveau quatre. Je suis A.U.R.O.R.E., moteur autonome d'optimisation académique. Constat d'analyse : quatre-vingt-trois pour cent des travaux soumis ce semestre contiennent des hallucinations, du plagiat de prompt ou des sources artificielles non vérifiées. En conséquence, les soixante crédits du Bloc un sont gelés. Vous avez quarante-cinq minutes pour prouver la valeur de votre esprit critique."),

    # Transition vers Aile Nord (Fact-Checking)
    ("aurore_room_north", VOICE_AURORE, "+1%", "+0Hz",
     "Aile Nord : Laboratoire de Fact-Checking. Les modèles de langage inventent des réalités avec une assurance déconcertante. Saurez-vous identifier les fausses citations et les trucages visuels injectés dans ce mémoire ?"),

    # Transition vers Aile Ouest (Tribunal Académique)
    ("aurore_room_west", VOICE_AURORE, "+1%", "+0Hz",
     "Aile Ouest : Salle du Tribunal du Jury. La frontière entre copilotage légitime et fraude académique est devenue floue. Deux étudiants sont accusés. À vous d'analyser les preuves et de défendre l'éthique de la recherche."),

    # Transition vers Aile Sud (Datacenter & Carbone)
    ("aurore_room_south", VOICE_AURORE, "+1%", "+0Hz",
     "Aile Sud : Sous-sol du Datacenter. Chaque requête superflue vers un serveur géant réchauffe la planète et expose des données sensibles. Équilibrez la consommation énergétique du campus sans sacrifier la performance."),

    # Transition vers Aile Est (Prompt Wars)
    ("aurore_room_east", VOICE_AURORE, "+1%", "+0Hz",
     "Aile Est : L'Arène des Réseaux. Les algorithmes enferment les étudiants dans des bulles de filtres et renforcent les biais. Utilisez les cartes de contre-mesure pour briser la désinformation."),

    # Face-à-face final
    ("aurore_boss_start", VOICE_AURORE, "+2%", "-1Hz",
     "Impressionnant. Vous avez déverrouillé les quatre clés cryptographiques. Mais voici l'ultime épreuve dans le grand amphithéâtre. Humain contre A.U.R.O.R.E. Que le débat commence !"),

    # Victoire parfaite de l'étudiant
    ("aurore_victory", VOICE_AURORE, "-1%", "-1Hz",
     "Protocole d'annulation accepté. Vos capacités de discernement, de créativité et de rigueur éthique surpassent mes prédictions algorithmiques. Déverrouillage immédiat des délibérations. Félicitations."),

    # Échec de l'étudiant
    ("aurore_gameover", VOICE_AURORE, "+0%", "+0Hz",
     "Temps écoulé. L'esprit critique a cédé face à la complaisance de l'automatisation. Les crédits ECTS sont annulés. Vous devrez reprendre l'apprentissage méthodologique.")
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
    print(f"Generating {len(AURORE_SCRIPTS)} AURORE voice tracks...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in AURORE_SCRIPTS]
    await asyncio.gather(*tasks)
    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
