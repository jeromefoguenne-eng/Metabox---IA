import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

# Modèles neuronaux Azure de pointe pour un rendu ultra-humain et spontané
VOICE_PROSECUTOR = "fr-FR-RemyMultilingualNeural"  # Éloquence théâtrale, respirations audibles, incisif
VOICE_DEFENDANT = "fr-FR-EloiseNeural"              # Étudiant sincère, émotion authentique, pauses naturelles
VOICE_JUDGE = "fr-BE-GerardNeural"                  # Magistrat belge d'autorité, voix grave, posée et solennelle

SPONTANEOUS_TRACKS = [
    # 0. Ouverture solennelle
    ("proces_judge_intro_blackout", VOICE_JUDGE, "-3%", "-1Hz",
     "La Cour d'Assises Numérique est réunie... Affaire du Ministère Public, contre le prévenu Maxime... poursuivi pour cyber-sabotage et trouble grave à l'ordre public, suite à la paralysie totale du campus durant vingt-quatre heures. Monsieur le Procureur du Roi... vous avez la parole pour votre réquisitoire."),

    # Silence imposé par le juge avec frappe du marteau
    ("proces_judge_silence", VOICE_JUDGE, "-3%", "-1Hz",
     "Silence dans la salle ! Un mot de plus, et je fais immédiatement évacuer le public par les huissiers ! Maître... poursuivez vos débats dans le calme."),

    # Réprimande du juge lors d'une mauvaise plaidoirie
    ("proces_judge_reprimande", VOICE_JUDGE, "-3%", "-1Hz",
     "Maître ! Voyons ! Cet argument est totalement irrecevable devant cette juridiction ! Il dessert la cause de votre client. La Cour écarte catégoriquement ce moyen !"),

    # Approbation du juge lors d'une plaidoirie percutante
    ("proces_judge_approbation", VOICE_JUDGE, "-3%", "-1Hz",
     "Moyen retenu par le Tribunal. La proportionnalité et la sauvegarde du bien commun sont dûment versées aux débats."),

    # --- ASSAUT 1 : ÉNERGIE & SABOTAGE ---
    ("proces_procureur_assaut_1", VOICE_PROSECUTOR, "-1%", "+0Hz",
     "Monsieur le Juge ! ... Regardez ce prévenu ! En pleine semaine de cours, il a froidement coupé les disjoncteurs et tous les serveurs du campus ! Il a provoqué une pagaille sans nom, un trouble intolérable à l'ordre public ! Je ne demande pas une banale sanction d'école... non ! Le Ministère Public réclame un mandat de dépôt et son incarcération ferme immédiate pour trouble grave à l'ordre public !"),

    ("proces_maxime_defense_1", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Monsieur le Juge... s'il vous plaît. Ce n'était pas un acte gratuit. Regardez les compteurs officiels ! En seulement vingt-quatre heures sans requêtes futiles, le campus a économisé quarante-cinq mille litres d'eau potable et des dizaines de mégawatts ! Était-ce un crime... ou un sursaut écologique indispensable ?"),

    # --- ASSAUT 2 : DONNÉES & RGPD ---
    ("proces_procureur_assaut_2", VOICE_PROSECUTOR, "-1%", "+0Hz",
     "Mensonge ! Pure diversion ! Cet individu a fracturé les pare-feux institutionnels, en toute illégalité ! Il a bafoué la sécurité informatique de l'État ! La détention ferme est la seule sanction à la hauteur d'un tel danger !"),

    ("proces_maxime_defense_2", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Mais j'ai protégé nos camarades ! J'ai découvert que les mémoires d'étudiants, leurs notes et même leurs dossiers médicaux étaient siphonnés en continu par des bots privés, sans aucun accord, vers la Californie ! Mon geste a stoppé cette fuite illégale !"),

    # --- ASSAUT 3 : COGNITION & POUVOIR DE L'IA ---
    ("proces_procureur_assaut_3", VOICE_PROSECUTOR, "-1%", "+0Hz",
     "Sans nos assistants numériques, les étudiants étaient perdus, incapables d'avancer ! Il a brisé la continuité du service public et semé l'anarchie dans les couloirs ! La prison ferme s'impose pour cet agitateur !"),

    ("proces_maxime_defense_3", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Perdus ? Non... enfin réveillés ! Les étudiants ne savaient même plus rédiger une simple idée sans prompter une machine ! Pendant ces vingt-quatre heures, ils se sont enfin reparlé, ils ont réouvert des livres et retrouvé leur propre esprit critique !"),

    # --- ASSAUT 4 : EMPLOIS & MODERNISATION ---
    ("proces_procureur_assaut_4", VOICE_PROSECUTOR, "-1%", "+0Hz",
     "L'établissement modernisait ses services pour l'avenir ! Ce sabotage a brisé nos plans d'efficience budgétaire ! L'autorité républicaine exige qu'il soit placé sous les verrous !"),

    ("proces_maxime_defense_4", VOICE_DEFENDANT, "+0%", "+0Hz",
     "L'efficience budgétaire ? Le mémo secret prévoyait de licencier vingt-cinq secrétaires et tuteurs pour les remplacer par des avatars logiciels ! Une Haute École est une communauté humaine, vivante... pas une usine robotisée sans âme !"),

    # --- ASSAUT 5 : SOUVERAINETÉ & MULTINATIONALES ---
    ("proces_procureur_assaut_5", VOICE_PROSECUTOR, "-1%", "+0Hz",
     "Nous utilisons les meilleures technologies au monde, conçues par les géants américains et asiatiques ! Saboter ces accords d'avenir est une rébellion passible de détention !"),

    ("proces_maxime_defense_5", VOICE_DEFENDANT, "+0%", "+0Hz",
     "Mais c'est notre souveraineté démocratique qui est vendue ! Nous livrons notre culture, nos cerveaux et notre liberté de penser à des oligopoles privés qui ne cherchent que le monopole et le profit !"),

    # --- ASSAUT 6 : BULLES DE FILTRE & PROPAGANDE ---
    ("proces_procureur_assaut_6", VOICE_PROSECUTOR, "-1%", "+0Hz",
     "Ce garçon est un séditieux qui répand la méfiance et la division ! Pour rétablir l'ordre public bafoué et dissuader toute récidive, le Ministère Public exige son incarcération ferme sans sursis !"),

    ("proces_maxime_defense_6", VOICE_DEFENDANT, "+0%", "+0Hz",
     "La vérité, c'est que l'algorithme censurait les contre-discours scientifiques et enfermait chaque promotion dans des bulles toxiques ! Mon geste était un signal d'alarme vital pour sauver le débat démocratique !"),

    # --- VERDICTS FINAUX ---
    ("proces_judge_verdict_innocent", VOICE_JUDGE, "-3%", "-1Hz",
     "Attendu que l'acte du prévenu n'a causé aucune dégradation irréversible... Attendu qu'il a révélé des périls écologiques majeurs, un pillage illicite de données et une menace réelle sur l'esprit critique humain... La Cour reconnaît l'État de Nécessité et le statut de Lanceur d'Alerte. Maxime est déclaré PLEINEMENT INNOCENT ET ACQUITTÉ ! Que justice soit faite !"),

    ("proces_judge_verdict_guilty", VOICE_JUDGE, "-3%", "-1Hz",
     "Attendu que la défense n'a pas su établir la proportionnalité de l'acte face au trouble grave causé au campus, la Cour déclare le prévenu coupable de cyber-sabotage et ordonne un mandat de dépôt pour trouble caractérisé à l'ordre public. L'audience est levée.")
]

sem = asyncio.Semaphore(3)

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
    print(f"Synthèse vocale humaine spontanée de {len(SPONTANEOUS_TRACKS)} répliques...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in SPONTANEOUS_TRACKS]
    await asyncio.gather(*tasks)
    print("Toutes les voix spontanées ont été générées avec succès !")

if __name__ == "__main__":
    asyncio.run(main())
