import os
import math
import wave
import struct
import numpy as np
import subprocess

SFX_DIR = os.path.join("public", "audio", "sfx")
os.makedirs(SFX_DIR, exist_ok=True)
SAMPLE_RATE = 44100

def save_wav_and_convert_mp3(name, samples):
    wav_path = os.path.join(SFX_DIR, f"{name}.wav")
    mp3_path = os.path.join(SFX_DIR, f"{name}.mp3")
    
    # Normalize
    max_val = np.max(np.abs(samples))
    if max_val > 0:
        samples = samples / max_val * 0.95
        
    int_samples = (samples * 32767).astype(np.int16)
    
    with wave.open(wav_path, "w") as w:
        w.setnchannels(1 if int_samples.ndim == 1 else 2)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(int_samples.tobytes())
        
    # Convert to MP3 via ffmpeg
    subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-b:a", "128k", mp3_path], 
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(wav_path):
        os.remove(wav_path)
    print(f"Generated {name}.mp3")

# 1. Applause & Cheering (Layered dynamic noise + rhythmic hand claps + vocal cheering resonance)
def generate_applause():
    duration = 4.0
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    
    # Pink noise base with envelop
    envelope = np.minimum(t / 0.5, 1.0) * np.exp(-t / 3.0)
    noise = np.random.normal(0, 0.4, len(t))
    
    # Hand claps pulses (thousands of random sharp transients)
    claps = np.zeros(len(t))
    num_claps = int(duration * 250)
    indices = np.random.randint(0, len(t) - 400, num_claps)
    clap_impulse = np.exp(-np.linspace(0, 20, 300)) * np.random.normal(0, 1, 300)
    for idx in indices:
        claps[idx:idx+300] += clap_impulse * (0.8 + np.random.rand() * 0.4)
        
    # Cheering harmonic overtone (crowd "Woooo!")
    cheer_freq = 420 + 40 * np.sin(2 * np.pi * 1.5 * t)
    cheer = np.sin(2 * np.pi * cheer_freq * t) * 0.15 * np.exp(-((t - 1.2)**2) / 1.5)
    
    output = (noise * 0.5 + claps * 0.6 + cheer) * envelope
    save_wav_and_convert_mp3("applause_cheers", output)

# 2. Dramatic Buzzer
def generate_buzzer():
    duration = 0.5
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    envelope = np.exp(-t * 3.5)
    # Sawtooth/square low buzz
    freq = 135
    sig = np.sin(2 * np.pi * freq * t) + 0.6 * np.sin(2 * np.pi * freq * 2 * t) + 0.4 * np.sin(2 * np.pi * freq * 3 * t)
    sig = np.sign(sig) * 0.6 * envelope
    save_wav_and_convert_mp3("buzzer", sig)

# 3. Suspense Tension Drone (subtle pulsating heartbeat / drone)
def generate_suspense():
    duration = 8.0
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    # 55Hz base drone (A1) + pulsating sub
    pulse = (1 + 0.5 * np.sin(2 * np.pi * 1.2 * t))
    drone = np.sin(2 * np.pi * 55 * t) * 0.4 + np.sin(2 * np.pi * 110 * t) * 0.2
    # Subtle ticking
    tick = np.zeros(len(t))
    for tick_t in np.arange(0, duration, 0.5):
        idx = int(tick_t * SAMPLE_RATE)
        if idx < len(t) - 200:
            tick[idx:idx+200] += np.exp(-np.linspace(0, 10, 200)) * np.sin(np.linspace(0, 20, 200)) * 0.25
    output = (drone * pulse + tick) * 0.6
    save_wav_and_convert_mp3("suspense_drone", output)

# 4. Correct Jingle (Chime / Arpeggio C Major 7)
def generate_correct():
    duration = 1.8
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    output = np.zeros(len(t))
    notes = [523.25, 659.25, 783.99, 1046.50, 1318.51] # C5, E5, G5, C6, E6
    start_times = [0.0, 0.08, 0.16, 0.24, 0.35]
    for freq, start in zip(notes, start_times):
        note_t = t - start
        mask = note_t >= 0
        envelope = np.zeros(len(t))
        envelope[mask] = np.exp(-note_t[mask] * 4.0)
        # Bell-like chime with harmonics
        chime = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2.02 * t)
        output += chime * envelope * 0.3
    save_wav_and_convert_mp3("correct_jingle", output)

# 5. Gong Timeout
def generate_gong():
    duration = 2.5
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    envelope = np.exp(-t * 1.8)
    base = np.sin(2 * np.pi * 180 * t) + 0.7 * np.sin(2 * np.pi * 277 * t) + 0.5 * np.sin(2 * np.pi * 355 * t)
    output = base * envelope * 0.8
    save_wav_and_convert_mp3("gong_timeout", output)

# 6. Groan / Aww Sigh
def generate_groan():
    duration = 1.6
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    envelope = np.sin(np.pi * (t / duration)) ** 1.5
    # Descending formant vocal murmur
    pitch = 160 - 50 * (t / duration)
    vocal = np.sin(2 * np.pi * pitch * t) + 0.5 * np.sin(2 * np.pi * pitch * 2 * t)
    noise = np.random.normal(0, 0.15, len(t))
    output = (vocal + noise) * envelope * 0.6
    save_wav_and_convert_mp3("groan_disappointment", output)

if __name__ == "__main__":
    generate_applause()
    generate_buzzer()
    generate_suspense()
    generate_correct()
    generate_gong()
    generate_groan()
    print("All studio sound effects generated successfully.")
