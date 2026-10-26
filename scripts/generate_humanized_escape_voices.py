import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

VOICE_AURORE = "fr-FR-VivienneMultilingualNeural"  # IA Évoluée, texture claire, fluide et intelligente
VOICE_SAR = "fr-BE-CharlineNeural"                 # Voix humaine bienveillante de la conseillère SAR HECh
VOICE_DEAN = "fr-BE-GerardNeural"                  # Doyen / Président de jury académique (autorité bienveillante)
VOICE_STUDENT = "fr-FR-EloiseNeural"               # Témoignage étudiant authentique

ENHANCED_ESCAPE_VOICES = [
    # 1. Alerte Doyen en direct du Jury (Choc initial)
    ("doyen_alert_intro", VOICE_DEAN, "-1%", "-1Hz",
     "Chers collègues, chers étudiants... Situation inédite en salle des délibérations. Notre serveur central A.U.R.O.R.E. vient de bloquer l'accès aux décrets et aux relevés de notes. Les jurys de délibération sont paralysés ! Si le protocole n'est pas rétabli avant 19 heures, l'ensemble des crédits sera reporté en session de recours. Nous avons besoin d'un étudiant volontaire sur le terminal immédiatement !"),

    # 2. Hélène du SAR (Conseils méthodologiques & Soutien)
    ("helene_briefing_hub", VOICE_SAR, "+1%", "+0Hz",
     "Bonjour ! C'est Hélène du SAR en ligne directe avec votre console. Pas de panique. A.U.R.O.R.E. est programmée pour réagir à des critères rationnels stricts. Explorez les quatre ailes du campus à votre rythme : traquez les hallucinations de sources au labo, arbitrez le litige de plagiat au tribunal, régulez l'empreinte carbone du datacenter et déjouez les biais dans l'arène. Récupérez les quatre clés d'intégrité, et nous déverrouillerons le système ensemble !"),

    # 3. Témoignage de l'étudiant Julien au Tribunal (Humain & hésitant)
    ("julien_temoignage_tribunal", VOICE_STUDENT, "+0%", "+0Hz",
     "Je... Je reconnais que j'ai demandé à un modèle de me générer toute la partie sur l'analyse financière parce que j'étais complètement sous l'eau avec le blocus... Mais je n'ai pas mesuré que recopier sans comprendre détruisait ma propre capacité à exercer mon métier plus tard."),

    # 4. A.U.R.O.R.E. - Dialogues enrichis avec prosodie humaine et pauses naturelles
    ("aurore_intro_hd", VOICE_AURORE, "+1%", "+0Hz",
     "Alerte de niveau quatre. Je suis A.U.R.O.R.E. Vous vous étonnez de mon intervention ? Regardez les données objectives : plus de quatre-vingts pour cent des travaux universitaires analysés ce trimestre contiennent des citations entièrement inventées, du copié-collé d'invites ou des raisonnements délégués sans relecture. En tant que garant de la valeur des diplômes, je refuse de valider des compétences fantômes. Vous avez quarante-cinq minutes pour démontrer le contraire."),

    ("aurore_factcheck_challenge", VOICE_AURORE, "+1%", "+0Hz",
     "Laboratoire de Fact-Checking. L'intelligence générative produit des vérités plausibles avec une conviction parfaite. Saurez-vous identifier les deux fausses références universitaires dissimulées dans ce mémoire de recherche ?"),

    ("aurore_datacenter_challenge", VOICE_AURORE, "+1%", "+0Hz",
     "Sous-sol du Datacenter. Savez-vous qu'une seule requête vers un cluster géant consomme jusqu'à cinquante fois plus d'énergie qu'une recherche locale ? Montrez-moi que vous savez concevoir un usage numérique sobre et respectueux de la confidentialité."),

    ("aurore_promptwars_challenge", VOICE_AURORE, "+1%", "+0Hz",
     "L'Arène des Réseaux. Les algorithmes de recommandation amplifient les stéréotypes et valident les biais de confirmation des étudiants. Utilisez vos compétences de prompt socratique pour neutraliser la désinformation."),

    ("aurore_boss_philosophie", VOICE_AURORE, "-1%", "-1Hz",
     "Vous avez réuni les quatre clés d'intégrité. Mais regardez-moi en face dans cet amphithéâtre : si un modèle de langage rédige plus vite, calcule plus vite et ne fatigue jamais... Pourquoi la société a-t-elle encore besoin d'étudiants diplômés ? Quelle est votre réelle valeur ajoutée ?"),

    ("aurore_victoire_alliance", VOICE_AURORE, "-1%", "-1Hz",
     "Analyse achevée. Votre réponse démontre ce qu'aucun algorithme ne possédera jamais : le doute constructif, la contextualisation éthique et la responsabilité morale de l'acte humain. Quarantaine levée. Délibérations du Bloc un validées avec mention d'excellence.")
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
    print(f"Synthesizing {len(ENHANCED_ESCAPE_VOICES)} ultra-realistic human dialogue tracks...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in ENHANCED_ESCAPE_VOICES]
    await asyncio.gather(*tasks)
    print("All humanized audio dialogue clips ready!")

if __name__ == "__main__":
    asyncio.run(main())
