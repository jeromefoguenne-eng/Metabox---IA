import asyncio
import edge_tts
import os

VOICE = "fr-FR-HenriNeural"
OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\audio\voices"

CLIPS = {
    # Présentation solennelle de l'émission par Henri
    "intro_presentation_show": (
        "Bienvenue sur le plateau de Qui Veut Gagner des Crédits ! "
        "Ce soir, vous grimpez la pyramide des verbes de consigne académique. "
        "Dix paliers, soixante crédits ECTS en jeu, avec deux paliers de sécurité garantis à dix-huit et quarante-deux crédits. "
        "En cas d'hésitation, vos trois précieux jokers sont à votre disposition : "
        "le cinquante-cinquante, le vote du public en direct, et l'appel au Service d'Aide à la Réussite. "
        "Concentrez-vous... Que l'émission commence !"
    ),

    # 3 Jokers WWTBAM spécifiques
    "joker_5050": "L'ordinateur élimine immédiatement deux mauvaises propositions. Il ne vous reste plus que deux choix possibles !",
    "joker_public": "Public en studio, silence s'il vous plaît. À vos boîtiers électroniques, votez maintenant !",
    "joker_sar": "Liaison téléphonique établie avec le Service d'Aide à la Réussite ! Écoutons le professeur référent en direct.",
    
    # Scrutin et Pression
    "pressure_host_scrutiny": "Regardez-moi bien... Vous jouez gros sur cette consigne. Est-ce vraiment votre choix définitif ?"
}

async def generate():
    for name, text in CLIPS.items():
        out_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
        communicate = edge_tts.Communicate(text, VOICE, rate="-3%", pitch="-1Hz")
        await communicate.save(out_path)
        print(f"✅ Voix générée : {name}.mp3")

if __name__ == "__main__":
    asyncio.run(generate())
    print("\n🎉 Voix WWTBAM complémentaires générées avec succès !")
