// ============================================================
// AUDIO MANAGER - Sonidos Procedurales y Música de Mazmorra
// Utiliza Web Audio API pura (sin necesidad de archivos externos)
// ============================================================

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicPlaying = false;
    this.musicTimer = null;
    this.currentNoteIndex = 0;
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
    if (this.muted && this.musicPlaying) {
      this.stopMusic();
      this.musicPlaying = true; // recordar estado
    } else if (!this.muted && this.musicPlaying) {
      this.startMusic();
    }
    return this.muted;
  }

  play(soundName) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    switch (soundName) {
      case 'jump': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(380, t + 0.15);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      }

      case 'coin': {
        // Sonido de arena del tiempo / gema recogida
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.setValueAtTime(880, t + 0.08); // A5
        osc.frequency.setValueAtTime(1174.66, t + 0.16); // D6

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
        break;
      }

      case 'hurt': {
        // Sonido de trampa o impacto
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
        break;
      }

      case 'crumble': {
        // Plataforma quebradiza
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.setValueAtTime(75, t + 0.05);
        osc.frequency.setValueAtTime(60, t + 0.1);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
        break;
      }

      case 'level_complete': {
        // Fanfarria de paso de nivel
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = t + idx * 0.12;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.26);
        });
        break;
      }

      case 'victory': {
        // Fanfarria de victoria triunfal
        const victoryNotes = [
          { f: 523.25, d: 0.15 },
          { f: 659.25, d: 0.15 },
          { f: 783.99, d: 0.15 },
          { f: 1046.50, d: 0.5 }
        ];
        let delay = 0;
        victoryNotes.forEach(n => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = t + delay;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.f, start);

          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + n.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + n.d);
          delay += n.d * 0.8;
        });
        break;
      }

      case 'gameover': {
        // Tono lúgubre de derrota
        const notes = [329.63, 311.13, 293.66, 246.94];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = t + idx * 0.22;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.36);
        });
        break;
      }
    }
  }

  startMusic() {
    this.musicPlaying = true;
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.musicTimer) clearInterval(this.musicTimer);

    // Melodía misteriosa árabe / mazmorra en escala menor armónica (Re menor / Frigia)
    const melody = [
      293.66, 0, 329.63, 349.23, 440.00, 392.00, 370.00, 293.66,
      220.00, 0, 293.66, 329.63, 349.23, 293.66, 261.63, 220.00
    ];

    let step = 0;
    this.musicTimer = setInterval(() => {
      if (this.muted || !this.musicPlaying || !this.ctx) return;

      const freq = melody[step % melody.length];
      if (freq > 0) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      }

      // Drone bajo ambiental sutil cada 4 pasos
      if (step % 8 === 0) {
        const t = this.ctx.currentTime;
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sine';
        drone.frequency.setValueAtTime(73.42, t); // D2

        droneGain.gain.setValueAtTime(0.08, t);
        droneGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        drone.connect(droneGain);
        droneGain.connect(this.ctx.destination);
        drone.start(t);
        drone.stop(t + 1.2);
      }

      step++;
    }, 280);
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

// Instancia global del sistema de sonido
window.soundManager = new SoundManager();
