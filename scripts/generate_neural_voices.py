import asyncio
import os
import edge_tts

VOICES_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\audio\voices"
os.makedirs(VOICES_DIR, exist_ok=True)

# Voice actors:
# Judge: fr-FR-HenriNeural (Authoritative, mature, deep judicial resonance)
# Aurore: fr-FR-VivienneMultilingualNeural (Crystal clear, warm, expressive, high-definition)

SPEECHES = [
    # --- LE JUGE (Grand Procès Blackout 24h) ---
    {
        "filename": "proces_judge_intro_blackout.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+2%",
        "pitch": "-3Hz",
        "text": "La Cour d'Assises Numérique de la Haute École Charlemagne est ouverte ! Nous jugeons l'affaire du blackout des 24 heures. Monsieur le Procureur du Roi, exposez sans délai votre réquisitoire contre l'étudiant Maxime !"
    },
    {
        "filename": "proces_judge_call_defense.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+2%",
        "pitch": "-2Hz",
        "text": "L'accusation a parlé. Maître Alex, c'est à la défense. Présentez vos contre-preuves numériques à la barre de la Cour !"
    },
    {
        "filename": "proces_judge_approbation.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+3%",
        "pitch": "-2Hz",
        "text": "Très pertinent, Maître ! Le journal de logs et l'horodatage cryptographique prouvent la bonne foi du prévenu. La Cour retient cet élément décisif au dossier !"
    },
    {
        "filename": "proces_judge_reprimande.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+4%",
        "pitch": "-1Hz",
        "text": "Argument irrecevable ! La Cour attend des preuves techniques indiscutables, pas de simples conjectures. Ce motif est écarté !"
    },
    {
        "filename": "proces_judge_verdict_intro.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+0%",
        "pitch": "-4Hz",
        "text": "Silence dans la salle ! Après examen scrupuleux des pièces à conviction numériques et délibération de la Cour, nous rendons notre arrêt !"
    },
    {
        "filename": "proces_judge_silence.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+6%",
        "pitch": "+0Hz",
        "text": "Silence ! Silence dans la salle, ou je fais immédiatement évacuer les tribunes par la force publique !"
    },

    # --- LE JUGE (3 Affaires & Enquête Numérique) ---
    {
        "filename": "tribunal_judge_case1_intro.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+2%",
        "pitch": "-3Hz",
        "text": "Première affaire inscrite au rôle : Julien, étudiant en Bac 2 Gestion. Prévention de substitution cognitive et plagiat par intelligence artificielle. Que le prévenu dépose à la barre !"
    },
    {
        "filename": "tribunal_judge_case2_intro.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+2%",
        "pitch": "-3Hz",
        "text": "Deuxième affaire : Léo, étudiant en Communication. Prévention de falsification de sources journalistiques et génération de faux experts par deepfake. La parole est au prévenu."
    },
    {
        "filename": "tribunal_judge_case3_intro.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+2%",
        "pitch": "-3Hz",
        "text": "Troisième affaire : Audit de l'algorithme Orion de recrutement des stagiaires. Prévention de discrimination algorithmique systémique sous l'IA Act européen. Que la direction des ressources humaines réponde à la Cour !"
    },
    {
        "filename": "tribunal_judge_objection_call.mp3",
        "voice": "fr-FR-HenriNeural",
        "rate": "+3%",
        "pitch": "-2Hz",
        "text": "Objection retenue ! Maître Alex, exposez sans attendre la contradiction technique mise au jour dans les métadonnées !"
    },

    # --- AURORE (Escape Game & Briefings - Voix Féminine Haute Fidélité) ---
    {
        "filename": "aurore_intro_hd.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "+2%",
        "pitch": "+2Hz",
        "text": "Alerte générale sur le campus des Rivageois ! Je suis Aurore, l'intelligence de régulation académique de la Haute École Charlemagne. À 45 minutes des délibérations, le jury est bloqué. Vos 60 crédits ECTS sont gelés. Infiltrez les quatre ailes du campus et prouvez votre rigueur humaine avant que l'algorithme fantôme ne verrouille définitivement le système !"
    },
    {
        "filename": "aurore_factcheck_challenge.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "+3%",
        "pitch": "+2Hz",
        "text": "Aile Nord, Quai de Rome. Bienvenue dans le cyber-laboratoire de Fact-Checking. Débusquez les fausses sources, démasquez les deepfakes et restaurez la vérité documentaire pour décrocher la Clé Alpha !"
    },
    {
        "filename": "aurore_datacenter_challenge.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "+3%",
        "pitch": "+2Hz",
        "text": "Aile Sud, sous-sol technique et faille vitrée. Les serveurs surchauffent à cause des requêtes inutiles. Faites les bons arbitrages méthodologiques et éthiques pour sauver vos ECTS et obtenir la Clé Gamma !"
    },
    {
        "filename": "aurore_promptwars_challenge.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "+3%",
        "pitch": "+2Hz",
        "text": "Aile Est, cour du Vieux Hêtre. Le Bot Désinformateur tente de saturer votre esprit critique par des hallucinations plausibles. Utilisez vos cartes tactiques pour briser ses arguments et remporter la Clé Delta !"
    },
    {
        "filename": "aurore_boss_philosophie.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "+1%",
        "pitch": "+1Hz",
        "text": "Félicitations, vous détenez les quatre clés. Rendez-vous dans le grand amphithéâtre pour le face-à-face décisif. Démontrez que la valeur de l'humain dépasse l'automatisation technique !"
    },
    {
        "filename": "aurore_victory.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "+3%",
        "pitch": "+3Hz",
        "text": "Délibérations restaurées ! Tous vos crédits ECTS sont validés avec mention. Vous avez prouvé avec éclat la supériorité de l'esprit critique, de l'éthique et de l'intelligence humaine !"
    }
]

async def generate_speech(item):
    filepath = os.path.join(VOICES_DIR, item["filename"])
    print(f"Génération de {item['filename']} avec {item['voice']}...")
    communicate = edge_tts.Communicate(
        text=item["text"],
        voice=item["voice"],
        rate=item.get("rate", "+0%"),
        pitch=item.get("pitch", "+0Hz")
    )
    await communicate.save(filepath)
    size = os.path.getsize(filepath)
    print(f" -> OK: {item['filename']} ({size} octets)")

async def main():
    print(f"=== GÉNÉRATION DES VOIX NEURALES HUMAINES (EDGE-TTS) ===")
    for item in SPEECHES:
        try:
            await generate_speech(item)
        except Exception as e:
            print(f"Erreur sur {item['filename']}: {e}")
    print("=== TOUTES LES VOIX ONT ÉTÉ GÉNÉRÉES AVEC SUCCÈS ===")

if __name__ == "__main__":
    asyncio.run(main())
