import os
import wave
import numpy as np
import subprocess

SFX_DIR = os.path.join("public", "audio", "sfx")
os.makedirs(SFX_DIR, exist_ok=True)
SAMPLE_RATE = 44100

def save_wav_and_convert_mp3(name, samples):
    wav_path = os.path.join(SFX_DIR, f"{name}.wav")
    mp3_path = os.path.join(SFX_DIR, f"{name}.mp3")
    
    max_val = np.max(np.abs(samples))
    if max_val > 0:
        samples = samples / max_val * 0.95
        
    int_samples = (samples * 32767).astype(np.int16)
    
    with wave.open(wav_path, "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(int_samples.tobytes())
        
    subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-b:a", "192k", mp3_path], 
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(wav_path):
        os.remove(wav_path)
    print(f"Generated {name}.mp3 successfully")

# 1. Générique Qui veut gagner des crédits (Mystérieux, solennel, cordes et gong dramatique)
def generate_theme_millionnaire():
    duration = 4.5
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    output = np.zeros(len(t))
    
    # Deep bass drone (D2 -> D1)
    bass = (np.sin(2 * np.pi * 73.42 * t) + 0.5 * np.sin(2 * np.pi * 146.83 * t)) * np.exp(-t * 0.4)
    # Tense strings arpeggio (D minor: D4, F4, A4, D5)
    notes = [293.66, 349.23, 440.0, 587.33]
    arp = np.zeros(len(t))
    for i, f in enumerate(notes):
        note_t = t - (i * 0.25)
        mask = note_t >= 0
        env = np.zeros(len(t))
        env[mask] = np.exp(-note_t[mask] * 1.5)
        arp += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)) * env * 0.3
        
    # Dramatic brass hit at 1.2s
    hit_t = t - 1.2
    hit_mask = hit_t >= 0
    hit_env = np.zeros(len(t))
    hit_env[hit_mask] = np.exp(-hit_t[hit_mask] * 2.0)
    brass = (np.sin(2 * np.pi * 146.83 * t) + 0.8 * np.sin(2 * np.pi * 220.0 * t) + 0.6 * np.sin(2 * np.pi * 293.66 * t)) * hit_env * 0.5
    
    # Shimmering chime sweep
    shimmer = np.sin(2 * np.pi * (1000 + 400 * np.sin(2 * np.pi * 4 * t)) * t) * np.exp(-((t - 2.5)**2) / 1.0) * 0.2
    
    output = (bass * 0.5 + arp * 0.6 + brass * 0.7 + shimmer) * np.minimum(t / 0.1, 1.0)
    save_wav_and_convert_mp3("theme_millionnaire", output)

# 2. Générique Questions pour un Major (Rythmé, fanfare synthétique cuivrée, énergique)
def generate_theme_champion():
    duration = 4.0
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    output = np.zeros(len(t))
    
    # Upbeat kick and snare pulse
    beats = [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2]
    drums = np.zeros(len(t))
    for b in beats:
        dt = t - b
        mask = (dt >= 0) & (dt < 0.2)
        drums[mask] += np.sin(2 * np.pi * 80 * dt[mask]) * np.exp(-dt[mask] * 25) * 0.8
        
    # Trumpet fanfare motif (G major: G4, B4, D5, G5)
    fanfare_notes = [(0.0, 392.0), (0.2, 392.0), (0.4, 493.88), (0.8, 587.33), (1.4, 783.99)]
    synth = np.zeros(len(t))
    for start, freq in fanfare_notes:
        dt = t - start
        mask = dt >= 0
        env = np.zeros(len(t))
        env[mask] = np.exp(-dt[mask] * 3.5)
        synth += (np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * freq * 2 * t) + 0.3 * np.sin(2 * np.pi * freq * 3 * t)) * env * 0.4
        
    output = (drums * 0.4 + synth * 0.7) * np.minimum(t / 0.05, 1.0)
    save_wav_and_convert_mp3("theme_champion", output)

# 3. Générique La Roue des Accords (Joyeux, swing cuivré, son de roue de casino)
def generate_theme_roue():
    duration = 4.2
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    output = np.zeros(len(t))
    
    # Spinning wheel clicking sound
    clicks = np.zeros(len(t))
    click_times = np.cumsum(np.linspace(0.04, 0.15, 35))
    for ct in click_times:
        if ct < duration:
            idx = int(ct * SAMPLE_RATE)
            if idx < len(t) - 150:
                clicks[idx:idx+150] += np.random.normal(0, 1, 150) * np.exp(-np.linspace(0, 15, 150)) * 0.4
                
    # Brass chord hit at 1.8s
    dt = t - 1.8
    mask = dt >= 0
    env = np.zeros(len(t))
    env[mask] = np.exp(-dt[mask] * 2.2)
    # Bb major chord
    brass = (np.sin(2 * np.pi * 466.16 * t) + np.sin(2 * np.pi * 587.33 * t) + np.sin(2 * np.pi * 698.46 * t)) * env * 0.4
    
    # Glockenspiel bell arpeggio
    bells = np.zeros(len(t))
    bell_freqs = [880.0, 1046.5, 1174.66, 1396.91]
    for i, bf in enumerate(bell_freqs):
        bdt = t - (0.4 + i * 0.2)
        bmask = bdt >= 0
        benv = np.zeros(len(t))
        benv[bmask] = np.exp(-bdt[bmask] * 4.0)
        bells += np.sin(2 * np.pi * bf * t) * benv * 0.3
        
    output = (clicks * 0.5 + brass * 0.6 + bells * 0.5) * np.minimum(t / 0.05, 1.0)
    save_wav_and_convert_mp3("theme_roue", output)

# 4. Générique Le Grand Concours (Épique prime-time, basse percutante, ovation du public)
def generate_theme_concours():
    duration = 4.2
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    output = np.zeros(len(t))
    
    # Heavy synth bassline
    bass = np.sin(2 * np.pi * 65.41 * t) * (1 + 0.4 * np.sin(2 * np.pi * 4 * t)) * np.exp(-t * 0.3)
    
    # Modern stadium anthem chords
    chord_times = [0.0, 0.6, 1.2, 1.8]
    chord_freqs = [
        [261.63, 329.63, 392.0],  # C
        [220.0, 261.63, 329.63],  # Am
        [174.61, 220.0, 261.63],  # F
        [196.0, 246.94, 293.66]   # G
    ]
    chords = np.zeros(len(t))
    for st, freqs in zip(chord_times, chord_freqs):
        dt = t - st
        mask = dt >= 0
        env = np.zeros(len(t))
        env[mask] = np.exp(-dt[mask] * 2.8)
        for f in freqs:
            chords += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)) * env * 0.2
            
    # Crowd cheering background
    cheer = np.random.normal(0, 0.2, len(t)) * (np.sin(np.pi * (t / duration)) ** 2)
    
    output = (bass * 0.4 + chords * 0.6 + cheer * 0.3) * np.minimum(t / 0.05, 1.0)
    save_wav_and_convert_mp3("theme_concours", output)

if __name__ == "__main__":
    generate_theme_millionnaire()
    generate_theme_champion()
    generate_theme_roue()
    generate_theme_concours()
    print("All TV show theme jingles generated successfully!")
