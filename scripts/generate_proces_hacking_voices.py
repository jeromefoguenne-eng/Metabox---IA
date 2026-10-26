import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

VOICE_PROSECUTOR = "fr-FR-HenriNeural"      # Procureur du Roi : sévère, tranchant, théâtral
VOICE_DEFENDANT = "fr-FR-EloiseNeural"     # Maxime : étudiant hacktiviste calme et déterminé
VOICE_JUDGE = "fr-BE-GerardNeural"         # Juge de la Cour : solennel et autoritaire
VOICE_DEFENSE = "fr-FR-RemyMultilingualNeural" # Avocat de la défense

PROCES_HACKING_TRACKS = [
    # --- OUVERTURE DE L'AUDIENCE ---
    ("proces_judge_intro_blackout", VOICE_JUDGE, "-2%", "-1Hz",
     "La Cour d'Assises Numérique est réunie. Affaire du Ministère Public contre l'étudiant Maxime, accusé de cyber-sabotage et d'avoir paralysé l'ensemble des systèmes d'intelligence artificielle du campus durant vingt-quatre heures. Procureur du Roi, vous avez la parole pour votre réquisitoire."),

    # --- ASSAUT 1 : SABOTAGE & ÉNERGIE ---
    ("proces_procureur_assaut_1", VOICE_PROSECUTOR, "+2%", "+2Hz",
     "Monsieur le Juge ! Ce prévenu a coupé brutalement les serveurs du campus en pleine semaine de cours ! Il a causé une désorganisation totale par pur vandalisme d'adolescent rebelle ! Je réclame l'exclusion définitive immédiate !"),

    ("proces_maxime_defense_1", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Ce n'était pas du vandalisme. Regardez les compteurs : en seulement vingt-quatre heures sans IA, le campus a économisé quarante-cinq mille litres d'eau de refroidissement et des mégawatts d'électricité gaspillés pour des requêtes futiles."),

    # --- ASSAUT 2 : DONNÉES & RGPD ---
    ("proces_procureur_assaut_2", VOICE_PROSECUTOR, "+2%", "+1Hz",
     "Mensonge ! Cet individu a violé les réseaux internes de l'école ! En s'introduisant dans les pare-feux, il a mis en péril la sécurité informatique de notre institution !"),

    ("proces_maxime_defense_2", VOICE_DEFENDANT, "+0%", "+0Hz",
     "J'ai au contraire protégé nos camarades ! J'ai découvert que les travaux, les thèses et même les courriels privés des étudiants étaient aspirés en continu et envoyés en clair vers des serveurs privés étrangers sans aucun consentement !"),

    # --- ASSAUT 3 : ATROPHIE COGNITIVE & POUVOIR DE L'IA ---
    ("proces_procureur_assaut_3", VOICE_PROSECUTOR, "+1%", "+2Hz",
     "Sans nos assistants virtuels, les étudiants étaient totalement désemparés ! Il a brisé la continuité pédagogique et privé notre jeunesse du progrès moderne !"),

    ("proces_maxime_defense_3", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Désemparés ? Ou enfin libérés ? Les étudiants ne savaient même plus écrire trois phrases sans prompter une machine ! Pendant ces vingt-quatre heures, ils se sont enfin reparlé, ils ont réouvert des livres et réactivé leur propre esprit critique !"),

    # --- ASSAUT 4 : EMPLOIS & PROFESSEURS ---
    ("proces_procureur_assaut_4", VOICE_PROSECUTOR, "+2%", "+1Hz",
     "L'établissement déployait un projet pilote d'efficience budgétaire d'avenir ! Ce sabotage a freiné la modernisation de notre institution !"),

    ("proces_maxime_defense_4", VOICE_DEFENDANT, "+0%", "+0Hz",
     "L'efficience budgétaire ? Parlons-en ! Le plan secret prévoyait de supprimer vingt-cinq postes de secrétaires et d'assistants pour les remplacer par des clones numériques ! Une université n'est pas une usine automatisée sans empathie !"),

    # --- ASSAUT 5 : MULTINATIONALES US ET CHINE ---
    ("proces_procureur_assaut_5", VOICE_PROSECUTOR, "+1%", "+2Hz",
     "Nous utilisons les meilleurs outils du marché mondial, conçus par les géants californiens et asiatiques. Pourquoi refuser cette puissance technologique ?"),

    ("proces_maxime_defense_5", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Parce que cela détruit notre souveraineté européenne ! Nous abandonnons nos cerveaux, notre culture et notre indépendance intellectuelle aux mains de multinationales privées qui ne cherchent que le monopole et le profit !"),

    # --- ASSAUT 6 : BULLES DE FILTRES & PROPAGANDE ---
    ("proces_procureur_assaut_6", VOICE_PROSECUTOR, "+2%", "+3Hz",
     "Ce garçon est un agitateur qui distille le doute et la paranoïa sur le campus ! C'est un délit contre la vérité institutionnelle !"),

    ("proces_maxime_defense_6", VOICE_DEFENDANT, "+0%", "+0Hz",
     "La vérité ? L'algorithme enfermait chaque promotion dans des bulles d'information biaisées et censurait les contre-discours scientifiques ! Mon geste était un signal d'alarme pour sauver la démocratie universitaire !"),

    # --- CINÉMATIQUES DU JUGE ---
    ("proces_judge_verdict_innocent", VOICE_JUDGE, "-2%", "-1Hz",
     "Attendu que l'action du prévenu n'a causé aucune altération définitive des machines ; Attendu que l'arrêt temporaire a révélé des périls écologiques majeurs, un pillage de données et une menace existentielle sur l'esprit critique humain ; La Cour reconnaît l'État de Nécessité et le statut de Lanceur d'Alerte. Maxime est déclaré PLEINEMENT INNOCENT ET ACQUITTÉ ! Que justice soit faite !"),

    ("proces_judge_verdict_guilty", VOICE_JUDGE, "-2%", "-1Hz",
     "Attendu que la défense n'a pas su établir la proportionnalité de l'infraction face aux dégâts organisationnels causés, la Cour déclare le prévenu coupable de cyber-entrave délibérée. L'audience est levée.")
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
    print(f"Génération de {len(PROCES_HACKING_TRACKS)} pistes vocales pour le Grand Procès du Blackout IA...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in PROCES_HACKING_TRACKS]
    await asyncio.gather(*tasks)
    print("Synthèse vocale terminée avec succès !")

if __name__ == "__main__":
    asyncio.run(main())
