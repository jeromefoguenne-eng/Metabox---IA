// Gestionnaire sonore de studio TV & Voix Neurales Haute Fidélité
// Combine des fichiers audio réels (voix neurales Edge-TTS et bruitages studio)
// avec un moteur de secours Web Audio API / SpeechSynthesis.

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.currentVoiceAudio = null;
    this.suspenseAudio = null;
    this.audioCache = new Map();
    this.activeVoicesSet = new Set();
    this.voiceTimeouts = new Set();

    try {
      const saved = localStorage.getItem('metabox_sound_muted');
      if (saved !== null) {
        this.muted = JSON.parse(saved);
      }
    } catch {
      this.muted = false;
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Programmation d'un délai avec annulation automatique si une voix démarre
  scheduleTimeout(fn, delayMs) {
    const id = setTimeout(() => {
      this.voiceTimeouts.delete(id);
      fn();
    }, delayMs);
    this.voiceTimeouts.add(id);
    return id;
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('metabox_sound_muted', JSON.stringify(this.muted));
    } catch {}

    if (this.muted) {
      this.stopAllVoice();
      this.stopSuspense();
    } else {
      this.playPop();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // --- Joueur Audio MP3 avec mise en cache & Anti-Superposition Stricte ---
  playAudioFile(path, volume = 1.0, loop = false) {
    if (this.muted) return null;

    // Détection stricte de toute piste vocale
    const isVoiceTrack = path.includes('/voices/') || 
                         path.includes('voice') || 
                         path.includes('tribunal_') || 
                         path.includes('aurore_') || 
                         path.includes('proces_') || 
                         path.includes('doyen_') || 
                         path.includes('julien_') || 
                         path.includes('helene_');

    if (isVoiceTrack) {
      this.stopAllVoice();
    }

    try {
      let audio = this.audioCache.get(path);
      if (!audio) {
        audio = new Audio(path);
        this.audioCache.set(path, audio);
      } else {
        audio.currentTime = 0;
      }

      if (isVoiceTrack) {
        this.currentVoiceAudio = audio;
        this.activeVoicesSet.add(audio);
        audio.onended = () => {
          this.activeVoicesSet.delete(audio);
          if (this.currentVoiceAudio === audio) {
            this.currentVoiceAudio = null;
          }
        };
      }

      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = loop;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback or autoplay policy catch
        });
      }
      return audio;
    } catch (err) {
      console.warn("Could not play audio file", path, err);
      return null;
    }
  }

  // Jouer une voix neurale humaine pré-enregistrée
  playVoice(voiceKey, onEndedCallback) {
    if (this.muted) return;

    this.stopAllVoice();

    const voicePath = `/audio/voices/${voiceKey}.mp3`;
    try {
      const audio = new Audio(voicePath);
      this.currentVoiceAudio = audio;
      this.activeVoicesSet.add(audio);
      audio.volume = 0.95;

      audio.onended = () => {
        this.activeVoicesSet.delete(audio);
        if (this.currentVoiceAudio === audio) {
          this.currentVoiceAudio = null;
        }
        if (onEndedCallback) onEndedCallback();
      };

      audio.onerror = () => {
        this.activeVoicesSet.delete(audio);
        console.warn(`Voice file missing: ${voicePath}, falling back.`);
        this.currentVoiceAudio = null;
      };

      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          this.activeVoicesSet.delete(audio);
          this.currentVoiceAudio = null;
        });
      }
    } catch {
      this.currentVoiceAudio = null;
    }
  }

  stopAllVoice() {
    // 1. Annuler tous les timeouts enregistrés
    if (this.voiceTimeouts) {
      this.voiceTimeouts.forEach(id => clearTimeout(id));
      this.voiceTimeouts.clear();
    }

    // 2. Stopper tous les audios actifs et effacer leurs callbacks pour éviter les chaînages fantômes
    if (this.activeVoicesSet) {
      this.activeVoicesSet.forEach(audio => {
        try {
          audio.onended = null;
          audio.onerror = null;
          audio.pause();
          audio.currentTime = 0;
        } catch {}
      });
      this.activeVoicesSet.clear();
    }

    // 3. Stopper la voix active courante
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.onended = null;
        this.currentVoiceAudio.onerror = null;
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch {}
      this.currentVoiceAudio = null;
    }

    // 4. Stopper tous les audios de voix mis en cache dans le Map
    if (this.audioCache) {
      this.audioCache.forEach((audio, key) => {
        const isVoice = key.includes('/voices/') || 
                        key.includes('voice') || 
                        key.includes('tribunal_') || 
                        key.includes('aurore_') || 
                        key.includes('proces_') || 
                        key.includes('doyen_') || 
                        key.includes('julien_') || 
                        key.includes('helene_');
        if (isVoice) {
          try {
            audio.onended = null;
            audio.onerror = null;
            audio.pause();
            audio.currentTime = 0;
          } catch {}
        }
      });
    }

    // 5. Annuler toute synthèse vocale Web Speech en cours
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  // Générique musical d'ouverture de l'émission TV
  playTheme(themeType = 'millionnaire', onEndedCallback) {
    if (this.muted) {
      if (onEndedCallback) setTimeout(onEndedCallback, 1500);
      return null;
    }

    const themePath = `/audio/sfx/theme_${themeType}.mp3`;
    try {
      const audio = new Audio(themePath);
      audio.volume = 0.9;
      audio.onended = () => {
        if (onEndedCallback) onEndedCallback();
      };
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          if (onEndedCallback) onEndedCallback();
        });
      }
      return audio;
    } catch {
      if (onEndedCallback) onEndedCallback();
      return null;
    }
  }

  // --- Bruitages de Studio Télévisé ---
  playApplause() {
    if (this.muted) return;
    const audio = this.playAudioFile('/audio/sfx/applause_cheers.mp3', 0.85);
    if (!audio) {
      this.playSynthApplause();
    }
  }

  playBuzzer() {
    if (this.muted) return;
    const audio = this.playAudioFile('/audio/sfx/buzzer.mp3', 0.9);
    if (!audio) {
      this.playSynthBuzzer();
    }
  }

  playSuccess() {
    if (this.muted) return;
    const audio = this.playAudioFile('/audio/sfx/correct_jingle.mp3', 0.85);
    if (!audio) {
      this.playSynthSuccess();
    }
  }

  playGroan() {
    if (this.muted) return;
    const audio = this.playAudioFile('/audio/sfx/groan_disappointment.mp3', 0.85);
    if (!audio) {
      this.playSynthGroan();
    }
  }

  playGong() {
    if (this.muted) return;
    this.playAudioFile('/audio/sfx/gong_timeout.mp3', 0.9);
  }

  // --- Musique de Suspense Oppressante Dynamique (Paliers 1, 2, 3) ---
  startSuspense(tier = 1) {
    if (this.muted) return;

    // Pick track based on pyramid tier
    const trackName = tier === 3 
      ? 'tension_tier3' 
      : tier === 2 
      ? 'tension_tier2' 
      : 'tension_tier1';
    
    const audioPath = `/audio/sfx/${trackName}.mp3`;

    // If already playing the exact track, just adjust volume
    if (this.suspenseAudio && this.currentSuspenseTier === tier) {
      return;
    }

    // Stop current track with smooth transition
    this.stopSuspense();

    try {
      const audio = new Audio(audioPath);
      audio.loop = true;
      // Volume starts modest and can increase with tier
      const baseVol = tier === 3 ? 0.65 : tier === 2 ? 0.52 : 0.40;
      audio.volume = baseVol;
      this.suspenseAudio = audio;
      this.currentSuspenseTier = tier;
      this.baseSuspenseVolume = baseVol;

      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          this.suspenseAudio = null;
        });
      }
    } catch {
      this.suspenseAudio = null;
    }
  }

  // Faire monter l'oppression et le volume au fil des secondes de réflexion
  escalateSuspensePressure(intensityFraction = 0.5) {
    if (this.muted || !this.suspenseAudio) return;
    try {
      const targetVol = Math.min(0.92, (this.baseSuspenseVolume || 0.45) + (intensityFraction * 0.35));
      this.suspenseAudio.volume = targetVol;
    } catch {}
  }

  stopSuspense() {
    if (this.suspenseAudio) {
      try {
        this.suspenseAudio.pause();
        this.suspenseAudio.currentTime = 0;
      } catch {}
      this.suspenseAudio = null;
      this.currentSuspenseTier = null;
    }
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playError() {
    if (this.muted) return;
    this.playGroan();
  }

  playCombo(combo = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const baseFreq = 400;
    const semitones = Math.min(combo * 2, 24);
    const freq = baseFreq * Math.pow(2, semitones / 12);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playFanfare() {
    this.playSuccess();
    setTimeout(() => {
      this.playApplause();
    }, 400);
  }

  // --- Fallbacks Web Audio en cas d'absence de fichier ---
  playSynthApplause() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 1.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 2.2);
  }

  playSynthBuzzer() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(160, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playSynthSuccess() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const start = this.ctx.currentTime + (idx * 0.07);
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  playSynthGroan() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 1.2);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 1.3);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.3);
  }

  // --- Sons Réalistes de Tribunal 3D ---
  playGavelStrike() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    // 1. Coup d'impact sourd (bois lourd)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.35);

    // 2. Claquement sec du marteau sur le socle
    const clickOsc = this.ctx.createOscillator();
    const clickFilter = this.ctx.createBiquadFilter();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(800, now);
    clickFilter.Q.setValueAtTime(3, now);
    clickOsc.frequency.setValueAtTime(950, now);
    clickOsc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
    clickGain.gain.setValueAtTime(0.9, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.1);

    // 3. Réverbération de la salle d'audience
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
  }

  playObjectionImpact() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    // Accord cuivres dramatique (D-minor brass hit)
    const freqs = [293.66, 349.23, 440.00, 587.33];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08);
      gain.gain.setValueAtTime(0.3 / freqs.length, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    });

    // Swoosh d'impact
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(1400, now);
    sweep.frequency.exponentialRampToValueAtTime(180, now + 0.3);
    sweepGain.gain.setValueAtTime(0.4, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    sweep.connect(sweepGain);
    sweepGain.connect(this.ctx.destination);
    sweep.start(now);
    sweep.stop(now + 0.3);
  }

  playTensionHeartbeat() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    [0, 0.22].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, now + offset);
      osc.frequency.exponentialRampToValueAtTime(40, now + offset + 0.15);
      gain.gain.setValueAtTime(0.35, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.17);
    });
  }

  // Bruitage d'ambiance et rumeur du public dans le tribunal (brouhaha, chuchotements)
  playCourtroomMurmur(duration = 2.5) {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    try {
      // Bruit rose filtré simulant des murmures et froissements de papiers dans la salle
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        const pink = b0 + b1 + b2 + white * 0.5362;
        // Modulation d'amplitude sinusoïdale simulant des voix qui chuchotent par vagues
        const mod = 0.5 + 0.5 * Math.sin(i / 3200) * Math.cos(i / 5400);
        data[i] = pink * 0.08 * mod;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filtre passe-bande vocal formant (300Hz - 1800Hz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(450, now);
      bandpass.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {}
  }

  // Coup de marteau solennel du Juge exigeant le silence
  playJudgeSilence() {
    this.playGavelStrike();
    this.scheduleTimeout(() => {
      this.playAudioFile('/audio/voices/proces_judge_silence.mp3', 1.0);
    }, 450);
  }

  // Voix synthèse de secours si jamais un texte dynamique non pré-enregistré est passé
  speakHost(text) {
    if (this.muted) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Priorité aux voix naturelles Google ou Microsoft
    const naturalVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Henri')));
    const frVoice = naturalVoice || voices.find(v => v.lang.startsWith('fr'));
    if (frVoice) {
      utterance.voice = frVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}

export const sounds = new SoundManager();
