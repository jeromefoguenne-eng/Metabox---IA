"""
Génère les 20 voix ultra-humaines 100 % génériques (indépendantes de la banque de questions)
du Storyboard 21 Plans (fr-FR-RemyMultilingualNeural + Mastering Broadcast FFmpeg -14 LUFS),
et exporte les durées exactes dans scripts/storyboard_voice_durations.json pour caler
la fermeture des lèvres au dixième de seconde près dans Wan 2.1 !
"""
import os
import json
import asyncio
import subprocess
import tempfile
import shutil
import truststore

truststore.inject_into_ssl()
import edge_tts

PROJECT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA"
VOICE_DIR = os.path.join(PROJECT_DIR, "public", "audio", "voices")
DURATIONS_JSON = os.path.join(PROJECT_DIR, "scripts", "storyboard_voice_durations.json")
os.makedirs(VOICE_DIR, exist_ok=True)

HOST_VOICE = "fr-FR-RemyMultilingualNeural"

# Textes exacts validés dans le Storyboard (100% génériques : Henri ne lit jamais l'énoncé de la question)
STORYBOARD_VOICES = {
    "plan01_presentation": (
        "Bonsoir à toutes et à tous, et bienvenue dans Qui Veut Gagner des Crédits ! "
        "Dix paliers à gravir, soixante crédits ECTS à la clé, deux paliers de sécurité garantis et trois jokers pour vous aider. "
        "Installez-vous bien... que le jeu commence !",
        ["intro_presentation_show", "intro_millionnaire"],
        "+0%"
    ),
    "plan02_q1": (
        "Allez, on démarre en douceur ! Voici la toute première question pour six crédits ECTS.",
        ["q_verb_1"],
        "+0%"
    ),
    "plan03_q2": (
        "C'est très bien parti ! Passons tout de suite à la question suivante.",
        ["q_verb_2"],
        "+0%"
    ),
    "plan04_q3": (
        "Attention, voici la troisième question... Si vous réussissez, vous sécurisez votre premier palier garanti !",
        ["q_verb_3"],
        "-2%"
    ),
    "plan05_q4": (
        "Bravo, on monte d'un cran ! Voici la question suivante, prenez le temps de bien la lire.",
        ["q_verb_4"],
        "+0%"
    ),
    "plan06_q5": (
        "Vous êtes déjà à mi-parcours ! Voici la cinquième question.",
        ["q_verb_5"],
        "+0%"
    ),
    "plan07_q6": (
        "La tension commence à monter sur le plateau... Voici la question suivante.",
        ["q_verb_6"],
        "-2%"
    ),
    "plan08_q7": (
        "Moment clé ! Voici la septième question, deuxième palier de sécurité en jeu... Concentrez-vous bien.",
        ["q_verb_7"],
        "-3%"
    ),
    "plan09_q8": (
        "Le silence est impressionnant dans la salle... Voici la question suivante.",
        ["q_verb_8"],
        "-4%"
    ),
    "plan10_q9": (
        "Avant-dernière marche avant le sommet... Voici la neuvième question.",
        ["q_verb_9"],
        "-4%"
    ),
    "plan11_q10": (
        "Nous y voilà... Voici la dixième et ultime question pour les soixante crédits ECTS !",
        ["q_verb_10"],
        "-4%"
    ),
    "plan12_pression1": (
        "Attention... Question très importante. Prenez votre temps, une seule erreur et tout s'arrête.",
        ["pressure_crucial"],
        "-4%"
    ),
    "plan13_pression2": (
        "Le silence est total sur le plateau... Vous jouez gros sur cette question.",
        ["pressure_hesitate_tier2", "pressure_hesitate_tier3"],
        "-4%"
    ),
    "plan14_pression3": (
        "Regardez-moi bien... Vous êtes sûr de votre choix ? Est-ce votre dernier mot ?",
        ["pressure_host_scrutiny", "pressure_final"],
        "-5%"
    ),
    "plan16_joker_5050": (
        "Très bien, on demande à l'ordinateur d'éliminer deux mauvaises réponses... Il ne vous reste plus que deux choix !",
        ["joker_5050"],
        "+0%"
    ),
    "plan17_joker_public": (
        "Cher public, on a besoin de vous ! Préparez vos boîtiers électroniques... Votez maintenant !",
        ["joker_public"],
        "+2%"
    ),
    "plan18_joker_sar": (
        "On établit la liaison en direct avec le Service d'Aide à la Réussite de la HECh... Écoutons le conseil du professeur.",
        ["joker_sar"],
        "+0%"
    ),
    "plan19_bonne_reponse": (
        "Et oui ! Excellente réponse ! Écoutez le public qui vous applaudit !",
        ["feedback_correct_millionaire"],
        "+2%"
    ),
    "plan20_defaite": (
        "Oh non... quel dommage, ce n'était pas la bonne réponse. L'aventure s'arrête ici, merci pour votre beau parcours !",
        ["feedback_wrong_millionaire"],
        "-3%"
    ),
    "plan21_victoire": (
        "Incroyable ! Bravo, mille fois bravo ! Vous décrochez les soixante crédits ECTS, c'est une victoire totale !",
        ["victory_millionnaire"],
        "+2%"
    )
}

def master_voice_ffmpeg(raw_mp3, final_mp3):
    af = (
        "highpass=f=80,"
        "equalizer=f=180:width_type=o:width=1.2:g=2.5,"
        "equalizer=f=3200:width_type=o:width=1.5:g=1.8,"
        "acompressor=threshold=-18dB:ratio=2.4:attack=15:release=180,"
        "aecho=0.8:0.88:24:0.09,"
        "loudnorm=I=-14:TP=-1.5:LRA=11"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", raw_mp3, "-af", af, "-b:a", "192k", final_mp3],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
    )

def get_duration(mp3_path):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", mp3_path],
        encoding="utf-8"
    )
    return round(float(out.strip()), 2)

async def main():
    print("🎙️ Génération des 20 voix génériques humaines (Remy HD + Broadcast EQ)...", flush=True)
    durations = {}
    with tempfile.TemporaryDirectory() as tmp:
        for plan_key, (text, aliases, rate) in STORYBOARD_VOICES.items():
            raw_p = os.path.join(tmp, f"{plan_key}_raw.mp3")
            out_p = os.path.join(VOICE_DIR, f"{plan_key}.mp3")
            await edge_tts.Communicate(text, HOST_VOICE, rate=rate).save(raw_p)
            master_voice_ffmpeg(raw_p, out_p)
            dur = get_duration(out_p)
            durations[plan_key] = dur
            for alias in aliases:
                shutil.copy2(out_p, os.path.join(VOICE_DIR, f"{alias}.mp3"))
            print(f"   ✅ {plan_key}.mp3 ({dur:.2f}s) -> aliases: {', '.join(aliases)}", flush=True)

    with open(DURATIONS_JSON, "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2)
    print(f"\n🎉 20 voix génériques générées et durées exportées dans {DURATIONS_JSON} !", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
