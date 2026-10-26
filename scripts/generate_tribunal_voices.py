import asyncio
import os
import edge_tts

VOICES_DIR = os.path.join("public", "audio", "voices")
os.makedirs(VOICES_DIR, exist_ok=True)

# Voix françaises et belges adaptées
VOICE_JUDGE = "fr-BE-GerardNeural"          # Juge solennel & autorité bienveillante
VOICE_JULIEN = "fr-FR-EloiseNeural"         # Julien (étudiant anxieux)
VOICE_LEO = "fr-FR-HenriNeural"             # Léo (étudiant arrogant puis déstabilisé)
VOICE_DRH = "fr-FR-RemyMultilingualNeural"   # DRH TechCorp (cadre supérieur d'entreprise)
VOICE_PROSECUTOR = "fr-BE-CharlineNeural"   # Procureur / Déléguée intégrité
VOICE_ANNOUNCER = "fr-FR-VivienneMultilingualNeural" # Annonceur TV / AURORE

TRIBUNAL_TRACKS = [
    # --- ANNONCE DU JUGE ---
    ("tribunal_judge_intro", VOICE_JUDGE, "-2%", "-1Hz",
     "La séance de la Chambre d'Éthique et d'Intégrité Académique 2030 est ouverte. Huissier, faites entrer le premier prévenu à la barre des témoins."),
    
    # --- AFFAIRE 1 : JULIEN (PLAGIAT vs COPILOTAGE) ---
    ("tribunal_julien_statement", VOICE_JULIEN, "+1%", "+0Hz",
     "Monsieur le Juge, je le jure sur l'honneur, je n'ai rien fait de mal ! J'ai simplement utilisé un assistant d'écriture pour corriger quelques fautes de style et lisser mes phrases. Toutes les analyses financières sont les miennes !"),
    
    ("tribunal_julien_objection_reaction", VOICE_JULIEN, "+2%", "+2Hz",
     "Attendez... Mais comment avez-vous eu accès à l'historique de frappe ? Je... d'accord ! C'est vrai, j'ai collé le chapitre d'un coup à quatre heures du matin parce que je n'y arrivais plus !"),
     
    ("tribunal_judge_verdict_1", VOICE_JUDGE, "-2%", "-1Hz",
     "Le Tribunal a délibéré. En l'absence de maîtrise conceptuelle et face à une substitution intégrale par intelligence générative, l'infraction de délégation cognitive est constituée. Le travail est annulé, avec obligation de réévaluation en autonomie. Que justice soit faite !"),

    # --- AFFAIRE 2 : LÉO (DEEPFAKE ÉLECTORAL) ---
    ("tribunal_leo_statement", VOICE_LEO, "+0%", "-1Hz",
     "Cette plainte est ridicule. Ce fichier audio a été envoyé sur un canal public par un lanceur d'alerte. On y entend clairement la candidate proposer des faveurs en échange de votes. Sa voix est parfaitement reconnaissable !"),

    ("tribunal_leo_objection_reaction", VOICE_LEO, "+2%", "+3Hz",
     "Le spectrogramme ? Quel filtre passe-bande ? Non mais écoutez, je ne suis pas un ingénieur du son, on m'a juste demandé de... Bon sang, oui, on a cloné sa voix avec un modèle de synthèse pour gagner l'élection !"),

    ("tribunal_judge_verdict_2", VOICE_JUDGE, "-2%", "-1Hz",
     "Attendu que la falsification vocale par deepfake porte atteinte à la démocratie étudiante et constitue une manœuvre déloyale grave, le Tribunal prononce la radiation de la liste incriminée et la réhabilitation immédiate de la candidate. Que justice soit faite !"),

    # --- AFFAIRE 3 : DRH TECHCORP (BIAIS ALGORH) ---
    ("tribunal_drh_statement", VOICE_DRH, "-1%", "-2Hz",
     "Notre algorithme Orion Recrutement est le fleuron de l'objectivité. Il traite des milliers de CV sans aucune considération d'origine ou de genre. Les candidats écartés manquaient simplement des métriques d'optimisation requises."),

    ("tribunal_drh_objection_reaction", VOICE_DRH, "+2%", "+1Hz",
     "Une variable proxy sur les codes postaux ? Mais... ce n'était qu'un facteur logistique d'empreinte carbone pour privilégier les candidats habitant près de nos bureaux ! Nous ne pensions pas que cela violerait l'article dix de l'AI Act..."),

    ("tribunal_judge_verdict_3", VOICE_JUDGE, "-2%", "-1Hz",
     "Le Tribunal juge que le système Orion constitue une discrimination algorithmique indirecte violant les exigences fondamentales de l'AI Act européen pour les systèmes à haut risque. Injonction immédiate de suspension et réexamen équitable de chaque dossier. L'audience est levée !")
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
    print(f"Génération de {len(TRIBUNAL_TRACKS)} voix réalistes pour le Tribunal 3D...")
    tasks = [synthesize(f, v, r, p, t) for f, v, r, p, t in TRIBUNAL_TRACKS]
    await asyncio.gather(*tasks)
    print("Synthèse vocale terminée avec succès !")

if __name__ == "__main__":
    asyncio.run(main())
