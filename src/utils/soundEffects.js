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

  // --- Joueur Audio MP3 avec mise en cache ---
  playAudioFile(path, volume = 1.0, loop = false) {
    if (this.muted) return null;

    try {
      let audio = this.audioCache.get(path);
      if (!audio) {
        audio = new Audio(path);
        this.audioCache.set(path, audio);
      } else {
        audio.currentTime = 0;
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
      audio.volume = 0.95;

      audio.onended = () => {
        if (this.currentVoiceAudio === audio) {
          this.currentVoiceAudio = null;
        }
        if (onEndedCallback) onEndedCallback();
      };

      audio.onerror = () => {
        // Fallback to speech synthesis if file missing
        console.warn(`Voice file missing: ${voicePath}, falling back.`);
        this.currentVoiceAudio = null;
      };

      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          this.currentVoiceAudio = null;
        });
      }
    } catch {
      this.currentVoiceAudio = null;
    }
  }

  stopAllVoice() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch {}
      this.currentVoiceAudio = null;
    }
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

  startSuspense() {
    if (this.muted || this.suspenseAudio) return;
    this.suspenseAudio = this.playAudioFile('/audio/sfx/suspense_drone.mp3', 0.4, true);
  }

  stopSuspense() {
    if (this.suspenseAudio) {
      try {
        this.suspenseAudio.pause();
        this.suspenseAudio.currentTime = 0;
      } catch {}
      this.suspenseAudio = null;
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
