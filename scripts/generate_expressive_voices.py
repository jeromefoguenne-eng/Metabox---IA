import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

VOICE_HOST = "fr-FR-RemyMultilingualNeural"   # Warm, expressive, ultra-fluent TV host
VOICE_SAR = "fr-BE-CharlineNeural"             # Genuine Belgian pedagogue from HECh SAR

VOICE_SCRIPTS = [
    # Intros (Excited, rhythmic, charismatic)
    ("intro_millionnaire", VOICE_HOST, "+3%", "+0Hz",
     "Bienvenue sur le plateau de... Qui veut gagner des crédits ! Prenez place au pupitre, le public est bouillant... Nous jouons dès maintenant pour votre réussite académique !"),
    
    ("intro_champion", VOICE_HOST, "+4%", "+1Hz",
     "Top ! Bienvenue dans Questions pour un Major ! Quatre questions chrono, neurosciences et mémoire active... Main sur le buzzer, concentration maximale !"),
     
    ("intro_roue", VOICE_HOST, "+3%", "+0Hz",
     "Faites vos jeux ! Bienvenue sur le plateau de La Roue des Accords ! Conjugaison et orthographe piège du supérieur... Faites tourner les lettres !"),
     
    ("intro_concours", VOICE_HOST, "+4%", "+1Hz",
     "Bienvenue au Grand Concours du Campus ! Règlement des études, gestion du stress et droits des étudiants... C'est parti pour le grand direct !"),

    # Jokers
    ("joker_5050", VOICE_HOST, "+2%", "+0Hz",
     "L'ordinateur élimine immédiatement deux mauvaises propositions. Il ne vous reste plus que deux choix possibles ! À vous de jouer !"),
     
    ("joker_public", VOICE_HOST, "+3%", "+1Hz",
     "À tout notre public en studio, à vos boîtiers électroniques ! Votez maintenant pour la proposition qui vous semble exacte !"),
     
    ("joker_sar", VOICE_HOST, "+2%", "+0Hz",
     "Nous établissons la liaison avec le Service d'Accompagnement à la Réussite... Hélène, vous êtes en direct sur notre plateau !"),
     
    ("sar_tip_default", VOICE_SAR, "+1%", "+0Hz",
     "Bonjour à tous sur le plateau ! Un conseil essentiel pour vos examens : analysez toujours attentivement la racine du verbe, pour bien distinguer la consigne exacte du contexte de la question."),
     
    ("sar_tip_ebbinghaus", VOICE_SAR, "+1%", "+0Hz",
     "Rappelez-vous qu'en sciences cognitives, la répétition espacée et le rappel actif battent toujours la relecture passive ! Testez-vous régulièrement."),

    # Questions - Qui veut gagner des crédits (Verbes)
    ("q_verb_1", VOICE_HOST, "+2%", "+0Hz", "Pour vos tout premiers crédits ECTS... Que signifie précisément le verbe : Identifier ?"),
    ("q_verb_2", VOICE_HOST, "+2%", "+0Hz", "Deuxième question de l'ascension... Que signifie le verbe : Définir ?"),
    ("q_verb_3", VOICE_HOST, "+2%", "+0Hz", "Attention, verbe d'action précis... Que signifie le verbe : Citer ?"),
    ("q_verb_4", VOICE_HOST, "+2%", "+0Hz", "Quatrième palier... Que signifie concrètement l'action de : Cocher ?"),
    ("q_verb_5", VOICE_HOST, "+2%", "+0Hz", "Un grand classique des consignes écrites... Que signifie le verbe : Souligner ?"),
    ("q_verb_6", VOICE_HOST, "+2%", "+0Hz", "Question de repérage... Que signifie le verbe : Relier ?"),
    ("q_verb_7", VOICE_HOST, "+2%", "+0Hz", "Montée en exigence méthodologique... Que signifie le verbe : Classer ?"),
    ("q_verb_8", VOICE_HOST, "+2%", "+0Hz", "Huitième question... Que signifie précisément l'action d' : Énumérer ?"),
    ("q_verb_9", VOICE_HOST, "+2%", "+0Hz", "Avant-dernière marche vers le sommet... Que signifie le verbe : Compléter ?"),
    ("q_verb_10", VOICE_HOST, "+2%", "+0Hz", "Dernière question pour décrocher le grand chelem des 60 crédits... Que signifie le verbe : Comparer ?"),

    # Questions - Questions pour un Major (Ebbinghaus)
    ("q_meth_1", VOICE_HOST, "+4%", "+1Hz", "Top chrono ! Question une : Après mémorisation sans réactivation, quel pourcentage d'informations est encore retenu après seulement 20 minutes de cours ?"),
    ("q_meth_2", VOICE_HOST, "+4%", "+1Hz", "Top ! Question deux : Après 24 heures sans réactivation, combien d'informations subsistent encore dans la mémoire humaine ?"),
    ("q_meth_3", VOICE_HOST, "+4%", "+1Hz", "Top ! Question trois : Après 6 mois sans aucune révision, quel est le pourcentage moyen de souvenirs conservés ?"),
    ("q_meth_4", VOICE_HOST, "+4%", "+1Hz", "Top ! Dernière question pour la victoire : Quelle stratégie scientifiquement validée permet de contrer efficacement la courbe de l'oubli ?"),

    # Questions - La Roue des Accords (Ortho)
    ("q_ortho_1", VOICE_HOST, "+3%", "+0Hz", "La roue tourne ! Conjuguez le verbe nettoyer à l'indicatif présent, à la troisième personne du pluriel !"),
    ("q_ortho_2", VOICE_HOST, "+3%", "+0Hz", "Attention au piège de l'accent ! Conjuguez le verbe déceler au subjonctif présent, à la troisième personne du pluriel !"),
    ("q_ortho_3", VOICE_HOST, "+3%", "+0Hz", "Faites tourner ! Conjuguez le verbe aboyer au futur simple, à la troisième personne du singulier !"),
    ("q_ortho_4", VOICE_HOST, "+3%", "+0Hz", "Question suivante ! Conjuguez le verbe voir au futur simple, à la deuxième personne du singulier !"),
    ("q_ortho_5", VOICE_HOST, "+3%", "+0Hz", "Double i ou simple i ? Conjuguez le verbe plier à l'indicatif imparfait, à la deuxième personne du pluriel !"),
    ("q_ortho_6", VOICE_HOST, "+3%", "+0Hz", "Subjonctif en jeu ! Conjuguez le verbe mourir au subjonctif présent, à la troisième personne du pluriel !"),
    ("q_ortho_7", VOICE_HOST, "+3%", "+0Hz", "Dernière rotation décisive ! Conjuguez le verbe courir au conditionnel présent, à la deuxième personne du pluriel !"),

    # Questions - Grand Concours (Métier Étudiant)
    ("q_stud_1", VOICE_HOST, "+3%", "+1Hz", "Chrono lancé ! Que se passe-t-il si un étudiant est absent injustifié à une évaluation d'une activité d'apprentissage ?"),
    ("q_stud_2", VOICE_HOST, "+3%", "+1Hz", "Question académique fondamentale : À quelle condition exacte les crédits ECTS d'une unité d'enseignement sont-ils définitivement acquis ?"),
    ("q_stud_3", VOICE_HOST, "+3%", "+1Hz", "Dernière question du concours : Vers quel service un étudiant doit-il se tourner en priorité en cas de difficulté méthodologique ?"),

    # Feedbacks naturels & spontanés
    ("feedback_correct_1", VOICE_HOST, "+3%", "+1Hz", "C'est une excellente réponse ! Le public est debout, vos crédits augmentent !"),
    ("feedback_correct_2", VOICE_HOST, "+3%", "+1Hz", "Parfaitement répondu ! Vous maîtrisez les exigences académiques sur le bout des doigts !"),
    ("feedback_correct_3", VOICE_HOST, "+3%", "+1Hz", "Absolument remarquable ! C'est validé par les arbitres du jeu !"),
    ("feedback_wrong_1", VOICE_HOST, "+1%", "-1Hz", "Aïe, non... Ce n'était pas la bonne réponse. Pas de panique, on analyse l'erreur et on repart !"),
    ("feedback_wrong_2", VOICE_HOST, "+1%", "-1Hz", "Coup dur ! C'est une erreur... Mais comme on dit au SAR, l'erreur est le premier pas de l'apprentissage !"),
    ("feedback_timeout", VOICE_HOST, "+3%", "+1Hz", "Gong fatidique ! Le temps est écoulé ! La gestion du chrono fait aussi partie de l'épreuve !"),
    
    # Victoires triomphales
    ("victory_millionnaire", VOICE_HOST, "+4%", "+1Hz", "Standing ovation du public ! Vous décrochez tous vos crédits ECTS ! Votre premier bloc académique est un succès triomphal !"),
    ("victory_champion", VOICE_HOST, "+4%", "+1Hz", "Triomphe absolu ! Vous êtes sacré grand vainqueur de Questions pour un Major ! La méthode universitaire n'a plus aucun secret pour vous !"),
    ("victory_roue", VOICE_HOST, "+3%", "+1Hz", "Chapeau bas ! Vous remportez la Roue des Accords avec une maîtrise orthographique sans la moindre faute !"),
    ("victory_concours", VOICE_HOST, "+4%", "+1Hz", "Victoire éclatante ! Vous validez le Grand Concours du Campus avec les félicitations unanimes du jury !")
]

sem = asyncio.Semaphore(5)

async def synthesize_item(filename, voice, rate, pitch, text):
    async with sem:
        filepath = os.path.join(VOICES_DIR, f"{filename}.mp3")
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await communicate.save(filepath)
            print(f"  [HD OK] {filename}.mp3")
        except Exception as e:
            print(f"  [ERROR] {filename}: {e}")

async def main():
    print(f"Synthesizing {len(VOICE_SCRIPTS)} items with RemyMultilingual & Charline...")
    tasks = [synthesize_item(f, v, r, p, t) for f, v, r, p, t in VOICE_SCRIPTS]
    await asyncio.gather(*tasks)
    print("All expressive neural voice clips generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
