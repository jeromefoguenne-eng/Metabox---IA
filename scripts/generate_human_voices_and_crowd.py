"""
Générateur de Voix Ultra-Humaines (fr-FR-RemyMultilingualNeural + Mastering Broadcast FFmpeg)
et de Réactions Polyphoniques Réalistes du Public (Applaudissements, Ovation, Déception).
"""
import os
import asyncio
import subprocess
import tempfile
import wave
import numpy as np
import truststore

truststore.inject_into_ssl()
import edge_tts

PROJECT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA"
VOICE_DIR = os.path.join(PROJECT_DIR, "public", "audio", "voices")
SFX_DIR = os.path.join(PROJECT_DIR, "public", "audio", "sfx")
os.makedirs(VOICE_DIR, exist_ok=True)
os.makedirs(SFX_DIR, exist_ok=True)

HOST_VOICE = "fr-FR-RemyMultilingualNeural"

# Textes réécrits pour sonner 100% naturels, humains, chaleureux et vivants en plateau TV
HOST_CLIPS = {
    "intro_presentation_show": (
        "Bonsoir à toutes et à tous, et bienvenue sur le plateau de Qui Veut Gagner des Crédits ! "
        "Ce soir, tout se joue autour de la pyramide des verbes de consigne académique. "
        "Dix paliers à gravir, soixante crédits ECTS à la clé... avec deux paliers de sécurité garantis, à dix-huit et quarante-deux crédits. "
        "Et rassurez-vous, vous n'êtes pas seul : vous disposez de trois précieux jokers... "
        "le cinquante-cinquante, le vote du public ici présent, et l'appel en direct au Service d'Aide à la Réussite. "
        "Respirez un grand coup... Installez-vous bien... Que le jeu commence !"
    ),
    "intro_millionnaire": (
        "Bienvenue sur le plateau de Qui Veut Gagner des Crédits ! "
        "Dix paliers, soixante crédits ECTS en jeu... Le public retient son souffle. Êtes-vous prêt ?"
    ),

    # Pression psychologique & hésitations humaines
    "pressure_hesitate_tier2": (
        "Prenez votre temps... Ne vous précipitez surtout pas. "
        "À ce stade de la pyramide, vous jouez gros... Chaque détail de la consigne compte."
    ),
    "pressure_hesitate_tier3": (
        "Le silence est total sur le plateau... On entendrait une mouche voler. "
        "Écoutez votre intuition, mais réfléchissez bien... Est-ce vraiment votre dernier mot ?"
    ),
    "pressure_crucial": (
        "Attention... Là, c'est un palier décisif. Une seule erreur, et l'aventure s'arrête net."
    ),
    "pressure_final": (
        "Nous y voilà... Ultime question pour les soixante crédits ECTS. Tout le campus a les yeux rivés sur vous."
    ),
    "pressure_host_scrutiny": (
        "Regardez-moi bien... Vous êtes sûr de vous ? Vous verrouillez cette réponse... c'est votre dernier mot ?"
    ),

    # Réactions humaines chaleureuses / empathiques
    "feedback_correct_millionaire": (
        "Et oui ! C'est une excellente réponse ! Magnifique déduction, le public apprécie, vous grimpez d'un palier !"
    ),
    "feedback_wrong_millionaire": (
        "Oh non... Ah quel dommage, ce n'était pas la bonne réponse... Le public est sous le choc avec vous."
    ),
    "victory_millionnaire": (
        "Oh c'est incroyable ! Bravo, mille fois bravo ! Vous décrochez les soixante crédits ECTS ! "
        "Regardez le public debout qui vous ovationne, c'est un triomphe absolu !"
    ),

    # 3 Jokers
    "joker_5050": (
        "Très bien, on demande à l'ordinateur d'enlever deux mauvaises réponses... "
        "Voilà ! Il ne vous reste plus que deux possibilités."
    ),
    "joker_public": (
        "On fait appel à vous, cher public ! Préparez vos boîtiers électroniques... "
        "Aidez notre candidat, votez maintenant !"
    ),
    "joker_sar": (
        "Allez, on passe un coup de fil en direct au Service d'Aide à la Réussite de la HECh ! "
        "Écoutons attentivement le conseil du professeur référent."
    ),

    # Questions 1 à 10 avec progression naturelle de ton
    "q_verb_1": "Allez, on démarre en douceur avec la première question, pour six crédits ECTS. Que signifie exactement ce verbe de consigne ?",
    "q_verb_2": "C'est bien parti ! Deuxième question pour douze crédits. Regardez bien la nuance demandée ici.",
    "q_verb_3": "Attention, question numéro trois pour dix-huit crédits ECTS ! Si vous réussissez celle-ci, vous sécurisez votre premier palier garanti.",
    "q_verb_4": "Bravo, on monte d'un cran ! Question quatre... Le studio se fait plus calme, prenez le temps de bien lire.",
    "q_verb_5": "Question cinq pour trente crédits. On est à mi-parcours ! Analysez chaque proposition avec rigueur.",
    "q_verb_6": "Question six pour trente-six crédits. La tension commence vraiment à se faire sentir sur le plateau...",
    "q_verb_7": "Moment clé ! Question sept pour quarante-deux crédits ECTS... C'est le deuxième palier de sécurité ! Ne vous trompez pas.",
    "q_verb_8": "Question huit pour quarante-huit crédits. Le silence est impressionnant dans la salle... À vous de jouer.",
    "q_verb_9": "Question neuf pour cinquante-quatre crédits ECTS... Vous touchez presque au sommet de la pyramide !",
    "q_verb_10": "Voici la dixième et ultime question, pour le sacre des soixante crédits ECTS... Prenez une grande inspiration. Quelle est votre réponse ?"
}

def master_voice_ffmpeg(raw_mp3, final_mp3):
    """Applique un mastering micro-cravate TV broadcast chaleureux (EQ + Compresseur + Reverb douce + -14 LUFS)."""
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

async def generate_host_voices():
    print("\n🎙️ Génération des voix ultra-humaines (fr-FR-RemyMultilingualNeural + Mastering Broadcast)...")
    with tempfile.TemporaryDirectory() as tmp:
        for name, text in HOST_CLIPS.items():
            raw_path = os.path.join(tmp, f"{name}_raw.mp3")
            final_path = os.path.join(VOICE_DIR, f"{name}.mp3")
            # Légère variation de débit selon l'intensité dramatique
            rate = "-4%" if ("pressure" in name or name in ("q_verb_8", "q_verb_9", "q_verb_10")) else "+0%"
            comm = edge_tts.Communicate(text, HOST_VOICE, rate=rate)
            await comm.save(raw_path)
            master_voice_ffmpeg(raw_path, final_path)
            print(f"   ✅ {name}.mp3 (Remy HD + Broadcast EQ)")

def synth_realistic_stereo_claps(duration=4.5, density=420, sr=44100):
    """Synthétise des applaudissements stéréo réalistes filtrés en bande de paumes (900Hz-3500Hz)."""
    n = int(sr * duration)
    left = np.zeros(n, dtype=np.float32)
    right = np.zeros(n, dtype=np.float32)

    rng = np.random.default_rng(42)
    total_claps = int(duration * density)
    for _ in range(total_claps):
        # Distribution temporelle réaliste (montée rapide 0.35s, plateau chaleureux, décroissance naturelle)
        t_pos = rng.beta(1.6, 2.4) * (duration - 0.15)
        idx = int(t_pos * sr)
        clap_len = int(sr * rng.uniform(0.018, 0.042))
        if idx + clap_len >= n:
            continue
        # Enveloppe percussive de frappe de paume
        env = np.exp(-np.linspace(0, rng.uniform(6.5, 11.0), clap_len))
        # Impulsion filtrée simple (différence pour couper le grondement grave)
        raw = rng.normal(0, 1.0, clap_len)
        # Double-claque naturelle (paume creuse)
        clap = np.convolve(raw, [0.25, 0.5, -0.5, -0.25], mode="same") * env
        amp = rng.uniform(0.35, 1.0)
        pan = rng.uniform(0.05, 0.95)
        left[idx:idx + clap_len] += clap * amp * (1.0 - pan)
        right[idx:idx + clap_len] += clap * amp * pan

    # Enveloppe globale d'entrée/sortie douce
    t = np.linspace(0, duration, n)
    global_env = np.minimum(t / 0.25, 1.0) * np.minimum((duration - t) / 0.9, 1.0)
    stereo = np.stack([left * global_env, right * global_env], axis=1)
    peak = np.max(np.abs(stereo))
    if peak > 0:
        stereo = stereo / peak * 0.85
    return stereo

def save_stereo_wav(path, stereo, sr=44100):
    data = (np.clip(stereo, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(data.tobytes())

async def generate_crowd_reactions():
    print("\n👏 Génération des réactions polyphoniques réalistes du public (Applaudissements, Ovation, Déception)...")
    crowd_voices = [
        "fr-FR-VivienneMultilingualNeural",
        "fr-FR-DeniseNeural",
        "fr-FR-HenriNeural",
        "fr-FR-EloiseNeural",
        "fr-FR-RemyMultilingualNeural",
        "fr-BE-CharlineNeural",
        "fr-BE-GerardNeural",
    ]

    with tempfile.TemporaryDirectory() as tmp:
        # 1. APPLAUDISSEMENTS + CRIS DE JOIE (Bonne réponse)
        clap_wav = os.path.join(tmp, "claps_std.wav")
        save_stereo_wav(clap_wav, synth_realistic_stereo_claps(duration=4.2, density=480))

        cheer_lines = [
            (crowd_voices[0], "Bravo !", "+8%", "+4Hz", 150),
            (crowd_voices[1], "Oui ! Bien joué !", "+10%", "+3Hz", 380),
            (crowd_voices[2], "Bravo !", "+5%", "+2Hz", 260),
            (crowd_voices[5], "Super !", "+12%", "+5Hz", 620),
            (crowd_voices[6], "Magnifique !", "+6%", "+1Hz", 850),
        ]
        cheer_files = []
        for idx, (v, txt, rate, pitch, delay_ms) in enumerate(cheer_lines):
            p = os.path.join(tmp, f"cheer_{idx}.mp3")
            await edge_tts.Communicate(txt, v, rate=rate, pitch=pitch).save(p)
            cheer_files.append((p, delay_ms))

        # Mixage FFmpeg : claps filtrés en bande de salle + voix polyphoniques réverbérées
        inputs = ["-i", clap_wav]
        filter_parts = ["[0:a]bandpass=f=1850:width_type=o:width=2.0,aecho=0.8:0.85:45|75:0.35|0.25,volume=1.15[claps]"]
        mix_labels = ["[claps]"]
        for i, (fp, delay_ms) in enumerate(cheer_files, start=1):
            inputs.extend(["-i", fp])
            filter_parts.append(
                f"[{i}:a]adelay={delay_ms}|{delay_ms},aecho=0.8:0.85:55:0.35,volume=0.52[v{i}]"
            )
            mix_labels.append(f"[v{i}]")

        filter_complex = ";".join(filter_parts) + f";{''.join(mix_labels)}amix=inputs={len(mix_labels)}:duration=first:normalize=0,loudnorm=I=-13:TP=-1.0[out]"
        out_applause = os.path.join(SFX_DIR, "applause_cheers.mp3")
        subprocess.run(
            ["ffmpeg", "-y", *inputs, "-filter_complex", filter_complex, "-map", "[out]", "-b:a", "192k", out_applause],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
        )
        print("   ✅ applause_cheers.mp3 (Applaudissements stéréo + chœur du public 'Bravo !')")

        # 2. GRANDE OVATION DEBOUT (Paliers garantis 18/42 ECTS & Victoire 60 ECTS)
        clap_big_wav = os.path.join(tmp, "claps_big.wav")
        save_stereo_wav(clap_big_wav, synth_realistic_stereo_claps(duration=6.5, density=750))

        ovation_lines = [
            (crowd_voices[0], "Bravo ! Incroyable !", "+10%", "+5Hz", 120),
            (crowd_voices[1], "Ouais ! Génial !", "+12%", "+4Hz", 420),
            (crowd_voices[2], "Bravo ! Magnifique !", "+8%", "+2Hz", 700),
            (crowd_voices[3], "Youpi ! Bravo !", "+10%", "+5Hz", 1100),
            (crowd_voices[5], "Extraordinaire !", "+8%", "+4Hz", 1550),
            (crowd_voices[6], "Chapeau ! Bravo !", "+6%", "+2Hz", 2100),
        ]
        ov_files = []
        for idx, (v, txt, rate, pitch, delay_ms) in enumerate(ovation_lines):
            p = os.path.join(tmp, f"ov_{idx}.mp3")
            await edge_tts.Communicate(txt, v, rate=rate, pitch=pitch).save(p)
            ov_files.append((p, delay_ms))

        inputs = ["-i", clap_big_wav]
        filter_parts = ["[0:a]bandpass=f=1850:width_type=o:width=2.1,aecho=0.8:0.88:50|85:0.4|0.3,volume=1.25[claps]"]
        mix_labels = ["[claps]"]
        for i, (fp, delay_ms) in enumerate(ov_files, start=1):
            inputs.extend(["-i", fp])
            filter_parts.append(
                f"[{i}:a]adelay={delay_ms}|{delay_ms},aecho=0.8:0.88:60:0.4,volume=0.58[v{i}]"
            )
            mix_labels.append(f"[v{i}]")

        filter_complex = ";".join(filter_parts) + f";{''.join(mix_labels)}amix=inputs={len(mix_labels)}:duration=first:normalize=0,loudnorm=I=-12:TP=-1.0[out]"
        out_ovation = os.path.join(SFX_DIR, "crowd_ovation_big.mp3")
        subprocess.run(
            ["ffmpeg", "-y", *inputs, "-filter_complex", filter_complex, "-map", "[out]", "-b:a", "192k", out_ovation],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
        )
        print("   ✅ crowd_ovation_big.mp3 (Grande ovation debout 6.5s)")

        # 3. DÉCEPTION COLLECTIVE DU PUBLIC (Mauvaise réponse / Échec)
        groan_lines = [
            (crowd_voices[0], "Ohhh non !", "-12%", "-4Hz", 50),
            (crowd_voices[1], "Ohhh... quel dommage !", "-15%", "-3Hz", 180),
            (crowd_voices[2], "Aïe aïe aïe...", "-14%", "-5Hz", 110),
            (crowd_voices[5], "Ohhh non...", "-16%", "-4Hz", 290),
            (crowd_voices[6], "Ohhh... dommage...", "-18%", "-6Hz", 360),
            (crowd_voices[3], "Ohhh !", "-15%", "-3Hz", 220),
        ]
        gr_files = []
        for idx, (v, txt, rate, pitch, delay_ms) in enumerate(groan_lines):
            p = os.path.join(tmp, f"groan_{idx}.mp3")
            await edge_tts.Communicate(txt, v, rate=rate, pitch=pitch).save(p)
            gr_files.append((p, delay_ms))

        inputs = []
        filter_parts = []
        mix_labels = []
        for i, (fp, delay_ms) in enumerate(gr_files):
            inputs.extend(["-i", fp])
            filter_parts.append(
                f"[{i}:a]adelay={delay_ms}|{delay_ms},lowpass=f=3600,aecho=0.8:0.88:55|90:0.45|0.3,volume=0.65[g{i}]"
            )
            mix_labels.append(f"[g{i}]")

        filter_complex = ";".join(filter_parts) + f";{''.join(mix_labels)}amix=inputs={len(mix_labels)}:duration=longest:normalize=0,loudnorm=I=-13:TP=-1.0[out]"
        out_groan = os.path.join(SFX_DIR, "groan_disappointment.mp3")
        subprocess.run(
            ["ffmpeg", "-y", *inputs, "-filter_complex", filter_complex, "-map", "[out]", "-b:a", "192k", out_groan],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
        )
        print("   ✅ groan_disappointment.mp3 (Soupir collectif et déception réaliste du public)")

async def main():
    await generate_host_voices()
    await generate_crowd_reactions()
    print("\n🎉 Voix humaines + réactions du public terminées avec succès !")

if __name__ == "__main__":
    asyncio.run(main())
