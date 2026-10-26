import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

# Voix neuronales ultra-réalistes et expressives
VOICE_PROSECUTOR = "fr-FR-RemyMultilingualNeural"  # Procureur du Roi : théâtral, incisif, vibrant, humain
VOICE_DEFENDANT = "fr-FR-EloiseNeural"              # Maxime : étudiant hacktiviste sincère et déterminé
VOICE_JUDGE = "fr-BE-GerardNeural"                  # Juge président : solennel, profond, autorité souveraine
VOICE_DEFENSE = "fr-FR-RemyMultilingualNeural"      # Avocat de la défense

PROCES_HACKING_TRACKS = [
    # --- OUVERTURE DE L'AUDIENCE ---
    ("proces_judge_intro_blackout", VOICE_JUDGE, "-1%", "-1Hz",
     "La Cour d'Assises Numérique est réunie. Affaire du Ministère Public contre le prévenu Maxime, poursuivi pour cyber-sabotage délibéré et trouble grave à l'ordre public suite au black-out complet des systèmes du campus pendant vingt-quatre heures. Monsieur le Procureur du Roi, vous avez la parole pour requérir."),

    # --- ASSAUT 1 : SABOTAGE & ÉNERGIE ---
    ("proces_procureur_assaut_1", VOICE_PROSECUTOR, "+2%", "+1Hz",
     "Monsieur le Juge ! Ce prévenu a coupé brutalement les serveurs du campus en pleine semaine de cours ! Il a causé une désorganisation totale et un trouble intolérable à l'ordre public ! Je ne demande pas une banale sanction scolaire : je réclame un mandat de dépôt et son incarcération ferme immédiate pour trouble grave à l'ordre public !"),

    ("proces_maxime_defense_1", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Ce n'était pas un trouble gratuit, Monsieur le Juge ! Regardez les relevés objectifs : en seulement vingt-quatre heures sans IA, le campus a économisé quarante-cinq mille litres d'eau potable et des mégawatts d'électricité gaspillés pour des requêtes futiles !"),

    # --- ASSAUT 2 : DONNÉES & RGPD ---
    ("proces_procureur_assaut_2", VOICE_PROSECUTOR, "+2%", "+1Hz",
     "Mensonge ! Cet individu a fracturé les pare-feux institutionnels au mépris de la loi pénale ! Il a mis en péril la sécurité de l'État et de nos institutions ! La prison ferme est la seule réponse face à ce danger pour l'ordre public !"),

    ("proces_maxime_defense_2", VOICE_DEFENDANT, "+0%", "+0Hz",
     "J'ai au contraire agi en bouclier pour mes camarades ! J'ai découvert que les travaux, les thèses et même les données de santé des étudiants étaient aspirés en douce et expédiés vers la Californie sans le moindre consentement !"),

    # --- ASSAUT 3 : ATROPHIE COGNITIVE & POUVOIR DE L'IA ---
    ("proces_procureur_assaut_3", VOICE_PROSECUTOR, "+1%", "+1Hz",
     "Sans nos assistants virtuels, les étudiants étaient totalement désemparés ! Il a brisé la continuité du service public et semé l'anarchie dans les amphithéâtres ! Une telle sédition mérite l'incarcération exemplaire !"),

    ("proces_maxime_defense_3", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Désemparés ? Ou enfin réveillés ? Les étudiants ne savaient même plus rédiger une synthèse sans prompter une machine ! Pendant ces vingt-quatre heures, ils se sont enfin reparlé, ils ont réouvert des livres et réactivé leur esprit critique !"),

    # --- ASSAUT 4 : EMPLOIS & PROFESSEURS ---
    ("proces_procureur_assaut_4", VOICE_PROSECUTOR, "+2%", "+1Hz",
     "L'établissement déployait un projet d'efficience budgétaire d'avenir ! Ce sabotage a freiné la modernisation de notre institution ! L'autorité républicaine exige qu'il soit placé sous les verrous !"),

    ("proces_maxime_defense_4", VOICE_DEFENDANT, "+0%", "+0Hz",
     "L'efficience budgétaire ? Parlons-en ! Le mémo secret prévoyait de licencier vingt-cinq secrétaires et tuteurs pour les remplacer par des avatars logiciels ! Une haute école est une communauté humaine, pas une usine automatisée !"),

    # --- ASSAUT 5 : MULTINATIONALES US ET CHINE ---
    ("proces_procureur_assaut_5", VOICE_PROSECUTOR, "+1%", "+1Hz",
     "Nous utilisons les meilleurs outils du marché mondial, conçus par les fleurons californiens et asiatiques ! Pourquoi refuser cette puissance ? Saboter ces accords est une atteinte intolérable qui justifie la détention !"),

    ("proces_maxime_defense_5", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Parce que cela détruit notre souveraineté démocratique ! Nous livrons nos cerveaux et notre indépendance intellectuelle à des conglomérats privés qui ne visent que le monopole algorithmique et le profit !"),

    # --- ASSAUT 6 : BULLES DE FILTRES & PROPAGANDE ---
    ("proces_procureur_assaut_6", VOICE_PROSECUTOR, "+2%", "+2Hz",
     "Ce garçon est un agitateur séditieux qui sème la défiance envers les institutions ! Pour rétablir l'ordre public bafoué et dissuader toute récidive, le Ministère Public exige son incarcération ferme sans sursis !"),

    ("proces_maxime_defense_6", VOICE_DEFENDANT, "+0%", "+0Hz",
     "La vérité ? L'algorithme censurait les contre-discours scientifiques et enfermait les promotions dans des bulles d'information toxiques ! Mon geste était un signal d'alarme vital pour préserver la démocratie universitaire !"),

    # --- CINÉMATIQUES DU JUGE ---
    ("proces_judge_verdict_innocent", VOICE_JUDGE, "-1%", "-1Hz",
     "Attendu que l'action du prévenu n'a causé aucune altération définitive du matériel ; Attendu que l'arrêt temporaire a révélé des périls écologiques majeurs, un pillage illégal de données et une menace sur l'esprit critique humain ; La Cour reconnaît l'État de Nécessité et le statut légitime de Lanceur d'Alerte. Maxime est déclaré PLEINEMENT INNOCENT ET ACQUITTÉ ! Que justice soit faite !"),

    ("proces_judge_verdict_guilty", VOICE_JUDGE, "-1%", "-1Hz",
     "Attendu que la défense n'a pas su établir la proportionnalité de l'infraction face au trouble à l'ordre public constaté, la Cour déclare le prévenu coupable de cyber-entrave et ordonne son maintien à la disposition de la justice. L'audience est levée.")
]

sem = asyncio.Semaphore(4)

async def synthesize(filename, voice, rate, pitch, text):
    async with sem:
        filepath = os.path.join(VOICES_DIR, f"{filename}.mp3")
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await communicate.save(filepath)
            print(f"  [OK] {filename}.mp3 ({voice})")
        except Exception as e:
            print(f"  [ERROR] {filename}: {e}")

async def main():
    print(f"Génération ultra-réaliste de {len(PROCES_HACKING_TRACKS)} répliques judiciaires...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in PROCES_HACKING_TRACKS]
    await asyncio.gather(*tasks)
    print("Toutes les voix judiciaires ultra-réalistes ont été générées avec succès !")

if __name__ == "__main__":
    asyncio.run(main())
