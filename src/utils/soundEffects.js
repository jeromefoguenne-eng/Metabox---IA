// Synthétiseur audio Web Audio API natif & Voix TV Host Speech Synthesis
// 100% autonome, zéro dépendance externe, compatible tous navigateurs

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
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
    if (!this.muted) {
      this.playPop();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Pop mignon pour les clics
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

  // Succès / Harmonie joyeuse
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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

  // Erreur / Boop doux
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Combo pour mini-jeu
  playCombo(combo = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    const baseFreq = 400 + Math.min(10, combo) * 60;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Buzzer TV Show
  playBuzzer() {
    if (this.muted) return;
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

  // Applaudissements du public de studio TV (bruit blanc filtré dynamique)
  playApplause() {
    if (this.muted) return;
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

  // Huées / Soupirs du public en cas d'erreur ("Oooooh...")
  playGroan() {
    if (this.muted) return;
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

  // Fanfare de victoire / Trophée
  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.50, d: 0.4 }  // C6
    ];

    let t = this.ctx.currentTime;
    chords.forEach(({ f, d }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + d);
      t += d * 0.75;
    });
  }

  // Voix du Présentateur TV (SpeechSynthesis)
  speakHost(text) {
    if (this.muted) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.08;
    utterance.pitch = 1.05;

    // Pick French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr') && !v.name.includes('Compact'));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const sounds = new SoundManager();
