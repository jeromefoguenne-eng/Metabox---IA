import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

VOICE_HOST = "fr-FR-HenriNeural"      # Charismatic, warm TV Host
VOICE_SAR = "fr-BE-CharlineNeural"     # Friendly Belgian pedagogical advisor (SAR HECh)

VOICE_SCRIPTS = [
    # Intros
    ("intro_millionnaire", VOICE_HOST, "Bienvenue dans Qui veut gagner des crédits ! Prenez place au pupitre, le public est en feu ! C'est parti pour l'ascension vers votre réussite académique !"),
    ("intro_champion", VOICE_HOST, "Bienvenue dans Questions pour un Major ! Quatre questions au chrono, sciences cognitives et méthodologie ! Main sur le buzzer, concentration maximale !"),
    ("intro_roue", VOICE_HOST, "Bienvenue sur le plateau de La Roue des Accords ! Orthographe et conjugaison du supérieur : faites tourner les lettres !"),
    ("intro_concours", VOICE_HOST, "Bienvenue au Grand Concours du Campus ! Test ultime sur le métier d'étudiant et les règles académiques ! Départ immédiat !"),

    # Jokers
    ("joker_5050", VOICE_HOST, "L'ordinateur élimine immédiatement deux mauvaises propositions. Il ne vous reste plus que deux choix possibles ! À vous de jouer !"),
    ("joker_public", VOICE_HOST, "À tout notre public en studio, à vos boîtiers électroniques ! Votez maintenant pour la proposition qui vous semble exacte !"),
    ("joker_sar", VOICE_HOST, "Nous établissons la liaison satellite avec le Service d'Accompagnement à la Réussite... Hélène, vous êtes en direct sur notre plateau !"),
    ("sar_tip_default", VOICE_SAR, "Bonjour à tous sur le plateau ! Un conseil essentiel : analysez toujours attentivement la racine du verbe pour bien distinguer la tâche demandée du contexte général."),
    ("sar_tip_ebbinghaus", VOICE_SAR, "N'oubliez pas que pour ancrer une matière durablement, la répétition espacée et le rappel actif battent toujours la relecture passive !"),

    # Quiz Verbes (Qui veut gagner des crédits)
    ("q_verb_1", VOICE_HOST, "Pour vos premiers crédits ECTS... que signifie le verbe : Identifier ?"),
    ("q_verb_2", VOICE_HOST, "Deuxième question... que signifie le verbe : Définir ?"),
    ("q_verb_3", VOICE_HOST, "Attention, verbe précis... que signifie le verbe : Citer ?"),
    ("q_verb_4", VOICE_HOST, "Question suivante... que signifie l'action de : Cocher ?"),
    ("q_verb_5", VOICE_HOST, "Classique des examens... que signifie le verbe : Souligner ?"),
    ("q_verb_6", VOICE_HOST, "Question de repérage... que signifie le verbe : Relier ?"),
    ("q_verb_7", VOICE_HOST, "Montée en exigence... que signifie le verbe : Classer ?"),
    ("q_verb_8", VOICE_HOST, "Question numéro 8... que signifie l'action d' : Énumérer ?"),
    ("q_verb_9", VOICE_HOST, "Avant-dernière marche... que signifie le verbe : Compléter ?"),
    ("q_verb_10", VOICE_HOST, "Dernière question pour le grand chelem des crédits... que signifie le verbe : Comparer ?"),

    # Quiz Ebbinghaus (Questions pour un Major)
    ("q_meth_1", VOICE_HOST, "Top chrono ! Question une : Après mémorisation sans réactivation, quel est le pourcentage d'informations encore retenues après seulement 20 minutes ?"),
    ("q_meth_2", VOICE_HOST, "Top ! Question deux : Après 24 heures sans réactivation, combien d'informations subsistent encore dans la mémoire humaine ?"),
    ("q_meth_3", VOICE_HOST, "Top ! Question trois : Après 6 mois sans aucune révision, quel est le pourcentage moyen de souvenirs conservés ?"),
    ("q_meth_4", VOICE_HOST, "Top ! Dernière question : Quelle stratégie scientifiquement validée permet de contrer efficacement la courbe de l'oubli ?"),

    # Quiz Orthographe (La Roue des Accords)
    ("q_ortho_1", VOICE_HOST, "La roue tourne ! Conjuguez le verbe nettoyer à l'indicatif présent, à la troisième personne du pluriel !"),
    ("q_ortho_2", VOICE_HOST, "Attention au piège de l'accent ! Conjuguez le verbe déceler au subjonctif présent, à la troisième personne du pluriel !"),
    ("q_ortho_3", VOICE_HOST, "Faites tourner ! Conjuguez le verbe aboyer au futur simple, à la troisième personne du singulier !"),
    ("q_ortho_4", VOICE_HOST, "Question suivante ! Conjuguez le verbe voir au futur simple, à la deuxième personne du singulier !"),
    ("q_ortho_5", VOICE_HOST, "Double i ou simple i ? Conjuguez le verbe plier à l'indicatif imparfait, à la deuxième personne du pluriel !"),
    ("q_ortho_6", VOICE_HOST, "Subjonctif en jeu ! Conjuguez le verbe mourir au subjonctif présent, à la troisième personne du pluriel !"),
    ("q_ortho_7", VOICE_HOST, "Dernière rotation ! Conjuguez le verbe courir au conditionnel présent, à la deuxième personne du pluriel !"),

    # Quiz Métier Étudiant (Le Grand Concours)
    ("q_stud_1", VOICE_HOST, "Chrono lancé ! Que se passe-t-il si un étudiant est absent injustifié à une évaluation d'une activité d'apprentissage ?"),
    ("q_stud_2", VOICE_HOST, "Question académique essentielle : À quelle condition exacte les crédits ECTS d'une unité d'enseignement sont-ils définitivement acquis ?"),
    ("q_stud_3", VOICE_HOST, "Dernière question du concours : Vers quel service un étudiant doit-il se tourner en priorité en cas de difficulté méthodologique ?"),

    # Feedbacks
    ("feedback_correct_1", VOICE_HOST, "C'est une excellente réponse ! Le public applaudit, vos crédits s'accumulent !"),
    ("feedback_correct_2", VOICE_HOST, "Parfaitement répondu ! Vous maîtrisez les attendus académiques !"),
    ("feedback_correct_3", VOICE_HOST, "Absolument exact ! Vous avancez tout droit vers la réussite !"),
    ("feedback_wrong_1", VOICE_HOST, "Aïe, non... ce n'était pas la bonne réponse. Ne lâchez rien, on analyse et on repart !"),
    ("feedback_wrong_2", VOICE_HOST, "Coup dur ! C'est une erreur, mais l'échec est une étape d'apprentissage !"),
    ("feedback_timeout", VOICE_HOST, "Gong ! Le temps est écoulé ! La rapidité fait aussi partie de l'épreuve !"),
    
    # Victoires
    ("victory_millionnaire", VOICE_HOST, "Standing ovation du public ! Vous décrochez tous vos crédits ECTS ! Votre premier bloc académique est un succès retentissant !"),
    ("victory_champion", VOICE_HOST, "Triomphe absolu ! Vous êtes couronné grand vainqueur de Questions pour un Major ! La méthode de travail n'a plus aucun secret pour vous !"),
    ("victory_roue", VOICE_HOST, "Chapeau bas ! Vous remportez la Roue des Accords avec une maîtrise orthographique sans faille !"),
    ("victory_concours", VOICE_HOST, "Formidable parcours ! Vous validez le Grand Concours du Campus avec les félicitations du jury !")
]

async def generate_all():
    print(f"Generating {len(VOICE_SCRIPTS)} realistic neural voice clips...")
    for filename, voice, text in VOICE_SCRIPTS:
        filepath = os.path.join(VOICES_DIR, f"{filename}.mp3")
        if os.path.exists(filepath):
            print(f"  [OK - already exists] {filename}.mp3")
            continue
        try:
            print(f"  Synthesizing {filename}.mp3 ({voice})...")
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(filepath)
            print(f"    -> Done: {filepath}")
        except Exception as e:
            print(f"    -> Error on {filename}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_all())
