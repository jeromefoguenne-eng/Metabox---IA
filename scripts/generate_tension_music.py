import numpy as np
import scipy.io.wavfile as wavfile
import subprocess
import os

SAMPLE_RATE = 44100
DURATION = 32.0  # 32 seconds seamless loopable tension track

def generate_tension_track(tier, bpm, bass_freq, drone_freq, pulse_rate, cutoff, output_name):
    t = np.linspace(0, DURATION, int(SAMPLE_RATE * DURATION), endpoint=False)
    
    # 1. Dark Sub-Bass Drone (rumbling fundamental + subtle slow beating)
    sub = np.sin(2 * np.pi * bass_freq * t) * 0.45
    sub += np.sin(2 * np.pi * (bass_freq * 1.5) * t) * 0.25
    sub += np.sin(2 * np.pi * (bass_freq * 2.01) * t) * 0.15
    
    # LFO filter sweep (slow dark breathing)
    lfo = (np.sin(2 * np.pi * 0.12 * t) + 1.0) * 0.5
    sub = sub * (0.65 + 0.35 * lfo)
    
    # 2. Sinister metallic / string drone pad
    pad = np.sin(2 * np.pi * drone_freq * t) * 0.20
    pad += np.sin(2 * np.pi * (drone_freq * 1.01) * t) * 0.15 # Chorusing detune
    pad += np.sin(2 * np.pi * (drone_freq * 1.498) * t) * 0.15 # Dissonant tritone / fifth
    
    # 3. Oppressive Heartbeat / Clock Pulse (Millionaire signature)
    # Beats occur at pulse_rate (in Hz = bpm / 60)
    pulse = np.zeros_like(t)
    beat_interval = 60.0 / bpm
    total_beats = int(DURATION / beat_interval)
    
    for i in range(total_beats):
        beat_t = i * beat_interval
        # Pulse 1: "Lub"
        idx_start = int(beat_t * SAMPLE_RATE)
        # short 80ms decaying low thump
        pulse_len = int(0.12 * SAMPLE_RATE)
        if idx_start + pulse_len < len(t):
            local_t = np.linspace(0, 0.12, pulse_len, endpoint=False)
            decay = np.exp(-local_t * (18 if tier < 3 else 14))
            thump = (np.sin(2 * np.pi * (bass_freq * 1.8) * local_t) + 
                     0.5 * np.sin(2 * np.pi * (bass_freq * 3.6) * local_t)) * decay
            pulse[idx_start:idx_start + pulse_len] += thump * (0.6 + 0.15 * tier)
            
        # Pulse 2: "Dub" (slightly delayed for realistic heartbeat syncopation)
        if tier >= 2:
            beat_t2 = beat_t + 0.22
            idx_start2 = int(beat_t2 * SAMPLE_RATE)
            pulse_len2 = int(0.09 * SAMPLE_RATE)
            if idx_start2 + pulse_len2 < len(t):
                local_t2 = np.linspace(0, 0.09, pulse_len2, endpoint=False)
                decay2 = np.exp(-local_t2 * 22)
                thump2 = np.sin(2 * np.pi * (bass_freq * 2.2) * local_t2) * decay2
                pulse[idx_start2:idx_start2 + pulse_len2] += thump2 * (0.4 + 0.1 * tier)

    # 4. High Suspense Clock Ticking (Crisp metallic hi-hat tick)
    tick = np.zeros_like(t)
    # Ticks every half-beat or beat
    tick_div = 2 if tier >= 2 else 1
    total_ticks = int(DURATION / (beat_interval / tick_div))
    for k in range(total_ticks):
        tick_t = k * (beat_interval / tick_div)
        idx_t = int(tick_t * SAMPLE_RATE)
        tick_len = int(0.025 * SAMPLE_RATE)
        if idx_t + tick_len < len(t):
            local_tick = np.linspace(0, 0.025, tick_len, endpoint=False)
            noise = np.random.uniform(-1, 1, tick_len)
            tick_env = np.exp(-local_tick * 160)
            # Bandpass-like ping
            ping = (np.sin(2 * np.pi * 3200 * local_tick) * 0.4 + noise * 0.6) * tick_env
            tick[idx_t:idx_t + tick_len] += ping * (0.15 + 0.1 * tier)

    # 5. High Eerie Shepard-like Tension glissando (for Tier 3 / Grand Finale)
    gliss = np.zeros_like(t)
    if tier == 3:
        # Rising sinister sine cluster that creeps up
        freq_sweep = np.linspace(440, 520, len(t))
        gliss = np.sin(2 * np.pi * freq_sweep * t) * 0.12 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * t))
        freq_sweep2 = np.linspace(880, 1040, len(t))
        gliss += np.sin(2 * np.pi * freq_sweep2 * t) * 0.06

    # Mix down
    mix = sub + pad + pulse + tick + gliss
    
    # Smooth loop crossfade on endpoints (first and last 0.2s)
    fade_len = int(0.25 * SAMPLE_RATE)
    mix[:fade_len] *= np.linspace(0, 1, fade_len)
    mix[-fade_len:] *= np.linspace(1, 0, fade_len)
    
    # Normalize with headroom
    max_val = np.max(np.abs(mix))
    if max_val > 0:
        mix = mix / max_val * 0.88
        
    wav_path = f"public/audio/sfx/{output_name}.wav"
    mp3_path = f"public/audio/sfx/{output_name}.mp3"
    
    wavfile.write(wav_path, SAMPLE_RATE, (mix * 32767).astype(np.int16))
    print(f"Generated WAV {wav_path}")
    
    # Convert to high-quality MP3 via ffmpeg
    subprocess.run([
        "ffmpeg", "-y", "-i", wav_path,
        "-codec:a", "libmp3lame", "-qscale:a", "2",
        mp3_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    if os.path.exists(wav_path):
        os.remove(wav_path)
    print(f"Exported MP3 {mp3_path}")

def main():
    os.makedirs("public/audio/sfx", exist_ok=True)
    # Tier 1: Questions 1 to 3 (6, 12, 18 ECTS) - Low dark pulse, 58 BPM, 48Hz Sub
    print("Synthesizing Tier 1 Suspense...")
    generate_tension_track(tier=1, bpm=58, bass_freq=48.0, drone_freq=130.8, pulse_rate=0.96, cutoff=400, output_name="tension_tier1")
    
    # Tier 2: Questions 4 to 7 (24 to 42 ECTS) - Accelerated double-thump heartbeat, 66 BPM, 55Hz Sub + clock ticks
    print("Synthesizing Tier 2 Suspense...")
    generate_tension_track(tier=2, bpm=66, bass_freq=55.0, drone_freq=164.8, pulse_rate=1.1, cutoff=800, output_name="tension_tier2")
    
    # Tier 3: Questions 8 to 10 (48, 54, 60 ECTS) - Heart-racing 76 BPM, dissonant tritone glissando, intense heavy sub
    print("Synthesizing Tier 3 High Tension...")
    generate_tension_track(tier=3, bpm=76, bass_freq=62.0, drone_freq=196.0, pulse_rate=1.26, cutoff=1400, output_name="tension_tier3")

if __name__ == "__main__":
    main()
