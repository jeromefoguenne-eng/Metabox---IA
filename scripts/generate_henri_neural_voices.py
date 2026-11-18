import asyncio
import edge_tts
import os

VOICE = "fr-FR-HenriNeural"
OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\audio\voices"

CLIPS = {
    # Intro
    "intro_millionnaire": "Bienvenue dans Qui Veut Gagner des Crédits. Dix paliers, soixante crédits ECTS en jeu. L'atmosphère est lourde, le public retient son souffle. Seul face à votre destin académique.",
    
    # Pression psychologique WWTBAM
    "pressure_hesitate_tier2": "Silence en studio... Vous jouez gros. C'est le moment de se concentrer. Prenez votre temps, chaque mot compte.",
    "pressure_hesitate_tier3": "L'atmosphère devient oppressante... Le studio est plongé dans le noir. Réfléchissez bien. Est-ce votre dernier mot ?",
    "pressure_crucial": "Attention... Vous êtes sur un palier décisif. Une erreur et c'est l'élimination directe.",
    "pressure_final": "Ultime épreuve... Soixante crédits ECTS. Tout le campus a les yeux rivés sur vous.",
    
    # Réactions
    "feedback_correct_millionaire": "C'est validé ! Excellente déduction, le palier est franchi !",
    "feedback_wrong_millionaire": "Non... C'est une erreur fatale. Le public est sous le choc, vous êtes éliminé.",
    "victory_millionnaire": "Incroyable ! Vous décrochez les soixante crédits ECTS ! Le sacre suprême !",
    
    # Questions 1 à 10
    "q_verb_1": "Question 1 pour 6 crédits ECTS. Échauffement en douceur : que signifie ce premier verbe ?",
    "q_verb_2": "Question 2 pour 12 crédits. Concentrez-vous bien sur la nuance méthodologique.",
    "q_verb_3": "Question 3 pour 18 crédits ECTS... Attention, c'est le premier palier de sécurité garanti !",
    "q_verb_4": "Question 4. Le calme se fait en plateau, nous entrons dans le deuxième palier.",
    "q_verb_5": "Question 5 pour 30 crédits. Vous jouez gros, analysez chaque proposition avec rigueur.",
    "q_verb_6": "Question 6 pour 36 crédits. La pression monte d'un cran en studio.",
    "q_verb_7": "Question 7 pour 42 crédits ECTS... Deuxième palier de sécurité ! L'erreur ne pardonne pas.",
    "q_verb_8": "Question 8 pour 48 crédits. Ambiance feutrée, le silence est total parmi le public.",
    "q_verb_9": "Question 9 pour 54 crédits ECTS... Plus qu'une étape avant le sommet de la pyramide.",
    "q_verb_10": "Question 10. Ultime question pour 60 crédits ECTS ! Est-ce votre dernier mot ?"
}

async def generate_all():
    for name, text in CLIPS.items():
        out_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
        communicate = edge_tts.Communicate(text, VOICE, rate="-4%", pitch="-2Hz")
        await communicate.save(out_path)
        print(f"✅ Voix générée : {name}.mp3 -> {text[:45]}...")

if __name__ == "__main__":
    asyncio.run(generate_all())
    print("\n🎉 Toutes les voix neurales d'Henri ont été générées avec succès !")
