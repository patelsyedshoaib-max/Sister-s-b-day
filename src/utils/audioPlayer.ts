/**
 * Audio Engine dedicated to the Sister's Birthday Celebration Song & Voiceover.
 * Replaces the old generic synth melody with the heartfelt Hindi sister's poem
 * set over an emotional acoustic piano & strings arrangement.
 */

export interface SongLyricLine {
  id: number;
  hindi: string;
  text: string;
  pauseAfterMs: number;
}

export const SISTER_BIRTHDAY_SONG_LYRICS: SongLyricLine[] = [
  {
    id: 1,
    hindi: 'यूँ तो बहुत लड़ती है तू मुझसे, पर बहुत प्यारी है मुझे...',
    text: 'Yun toh bahut ladti hai tu mujhse, par bahut pyaari hai mujhe...',
    pauseAfterMs: 800,
  },
  {
    id: 2,
    hindi: 'और मेरी इस प्यारी सी बहन को Happy Birthday! ❤️',
    text: 'Aur meri is pyaari si behan ko Happy Birthday! ❤️',
    pauseAfterMs: 900,
  },
  {
    id: 3,
    hindi: 'Dear बहना, बस इतना है कहना, कि हमेशा मुस्कुराती रहना...',
    text: 'Dear behna, bas itna hai kehna, ki hamesha muskurati rehna...',
    pauseAfterMs: 800,
  },
  {
    id: 4,
    hindi: 'तेरे चेहरे की मुस्कान कभी फीकी ना पड़े, जो कुछ भी तू चाहे, तुझे हर वो चीज़ मिले।',
    text: 'Tere chehre ki muskaan kabhi feeki na pade, jo kuch bhi tu chaahe, tujhe har woh cheez mile.',
    pauseAfterMs: 900,
  },
  {
    id: 5,
    hindi: 'बेशक हमारे बीच अनबन भी हो जाती है, बेशक तू छोटी-छोटी बातों पर मुझसे लड़ भी जाती है...',
    text: 'Beshak hamare beech anban bhi ho jaati hai, beshak tu chhoti-chhoti baaton par mujhse lad bhi jaati hai...',
    pauseAfterMs: 800,
  },
  {
    id: 6,
    hindi: 'पर जब तू मुझसे दूर होती है ना, मुझे तेरी बहुत याद आती है...',
    text: 'Par jab tu mujhse door hoti hai na, mujhe teri bahut yaad aati hai...',
    pauseAfterMs: 900,
  },
  {
    id: 7,
    hindi: 'जो बचपन के दिन हमने साथ बिताए, और जो फ़िक्र तुमने मेरी की... वैसी तो कौन ही करेगा!',
    text: 'Jo bachpan ke din humne saath bitaaye, aur jo fikr tumne meri ki, waisi toh kaun hi karega...',
    pauseAfterMs: 900,
  },
  {
    id: 8,
    hindi: 'तेरा डांटना, समझाna, सब कुछ बहुत प्यारा है... And I am thankful कि इतनी प्यारी बहन भगवान ने मुझे दी।',
    text: 'Tera daantna, samjhana, sab kuch bahut pyaara hai. And I am thankful ki itni pyaari behan bhagwan ne mujhe di.',
    pauseAfterMs: 1000,
  },
  {
    id: 9,
    hindi: 'और आज तुम्हारा Birthday है, so I wish कि आने वाला साल तुम्हारे लिए बहुत बेहतरीन हो!',
    text: 'Aur aaj tumhara birthday hai, so I wish ki aane waala saal tumhare liye bahut behtareen ho!',
    pauseAfterMs: 800,
  },
  {
    id: 10,
    hindi: 'तुम्हें ढेरों खुशियाँ मिले और तुम्हारी मंज़िल भी... ✨',
    text: 'Tumhe dheron khushiyan mile aur tumhari manzil bhi...',
    pauseAfterMs: 700,
  },
  {
    id: 11,
    hindi: 'Love you so much प्यारी बहन! Wish you a very very Happy Birthday! 🎂💖',
    text: 'Love you so much pyaari behan! Wish you a very very happy birthday! 🎂💖',
    pauseAfterMs: 1400,
  },
];

export interface AudioEngineState {
  isPlaying: boolean;
  isMuted: boolean;
  currentLineIndex: number;
  activeLineText: string;
}

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.55;
  private masterGain: GainNode | null = null;
  private musicIntervalId: number | null = null;
  private currentLineIndex = -1;
  private speechTimeout: number | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private stateChangeListeners: Set<(state: AudioEngineState) => void> = new Set();
  private playStateListeners: Set<(playing: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.playStateListeners.add(cb);
    return () => this.playStateListeners.delete(cb);
  }

  public subscribeState(cb: (state: AudioEngineState) => void) {
    this.stateChangeListeners.add(cb);
    cb(this.getState());
    return () => this.stateChangeListeners.delete(cb);
  }

  public getState(): AudioEngineState {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      currentLineIndex: this.currentLineIndex,
      activeLineText:
        this.currentLineIndex >= 0 && this.currentLineIndex < SISTER_BIRTHDAY_SONG_LYRICS.length
          ? SISTER_BIRTHDAY_SONG_LYRICS[this.currentLineIndex].text
          : '',
    };
  }

  private notify() {
    const state = this.getState();
    this.playStateListeners.forEach((cb) => cb(this.isPlaying));
    this.stateChangeListeners.forEach((cb) => cb(state));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (window.speechSynthesis) {
      if (this.isMuted) {
        window.speechSynthesis.pause();
      } else if (this.isPlaying) {
        window.speechSynthesis.resume();
      }
    }
    this.notify();
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Warm acoustic piano tone generator with rich harmonics and natural decay.
   */
  private playPianoNote(freq: number, startTime: number, duration: number, gainMul = 0.22) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Fundamental & overtone blending
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.001, startTime);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3.003, startTime);

    // Warm low-pass acoustic filtering
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(320, startTime + duration);

    const baseGain = gainMul * (this.isMuted ? 0 : 1);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(baseGain, startTime + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(baseGain * 0.45, startTime + 0.35);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
    osc3.stop(startTime + duration + 0.05);
  }

  /**
   * Soft ambient string pad tone.
   */
  private playPadChord(frequencies: number[], startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    frequencies.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, startTime);

      const targetGain = 0.04 * (this.isMuted ? 0 : 1);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(targetGain, startTime + 0.5);
      gain.gain.setValueAtTime(targetGain, startTime + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  /**
   * Plays the emotional acoustic piano soundtrack (Cmaj7 -> Am9 -> Fmaj7 -> Gadd9).
   */
  private scheduleBackgroundAcousticCycle() {
    if (!this.ctx || !this.isPlaying) return;

    const chords = [
      // Cmaj7 (C, E, G, B)
      { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88], pad: [130.81, 261.63, 329.63] },
      // Am9 (A, C, E, B)
      { bass: 110.00, notes: [220.00, 261.63, 329.63, 493.88], pad: [110.00, 220.00, 261.63] },
      // Fmaj7 (F, A, C, E)
      { bass: 87.31, notes: [174.61, 220.00, 261.63, 329.63], pad: [174.61, 220.00, 261.63] },
      // Gsus4 -> G (G, C/B, D)
      { bass: 98.00, notes: [196.00, 261.63, 293.66, 392.00], pad: [98.00, 196.00, 293.66] },
    ];

    let t = this.ctx.currentTime + 0.05;
    const chordDuration = 3.6;

    chords.forEach((chord) => {
      // Warm pad
      this.playPadChord(chord.pad, t, chordDuration);
      // Deep bass
      this.playPianoNote(chord.bass, t, 2.5, 0.28);

      // Delicate broken piano arpeggio
      chord.notes.forEach((note, idx) => {
        this.playPianoNote(note, t + idx * 0.45, 1.8, 0.18);
        this.playPianoNote(note * 1.5, t + 1.8 + idx * 0.35, 1.4, 0.12);
      });

      t += chordDuration;
    });

    const totalCycleMs = (t - this.ctx.currentTime) * 1000;
    this.musicIntervalId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleBackgroundAcousticCycle();
      }
    }, Math.max(1000, totalCycleMs - 200));
  }

  /**
   * Plays the Sister's Birthday voiceover poem line-by-line with speech synthesis,
   * keeping track of currentLineIndex for real-time karaoke lyrics.
   */
  private startPoemVoiceover(startIndex = 0) {
    if (!this.isPlaying) return;
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      // Fallback: cycle lyrics visually on timer
      this.currentLineIndex = startIndex;
      this.notify();
      if (startIndex < SISTER_BIRTHDAY_SONG_LYRICS.length - 1) {
        this.speechTimeout = setTimeout(() => {
          if (this.isPlaying) this.startPoemVoiceover(startIndex + 1);
        }, 4500) as unknown as number;
      } else {
        this.speechTimeout = setTimeout(() => {
          if (this.isPlaying) this.startPoemVoiceover(0);
        }, 5000) as unknown as number;
      }
      return;
    }

    if (startIndex >= SISTER_BIRTHDAY_SONG_LYRICS.length) {
      // Finished all lines! Loop after a gentle celebration pause
      this.currentLineIndex = -1;
      this.notify();
      this.speechTimeout = window.setTimeout(() => {
        if (this.isPlaying) {
          this.startPoemVoiceover(0);
        }
      }, 4000);
      return;
    }

    this.currentLineIndex = startIndex;
    this.notify();

    const line = SISTER_BIRTHDAY_SONG_LYRICS[startIndex];
    // Clean text for natural Hindi/Hinglish speech
    const speechText = line.text
      .replace(/[❤️💖✨🎂🎉⏳]/g, '')
      .replace(/\.\.\./g, ', ')
      .trim();

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(speechText);
    this.currentUtterance = utterance;

    // Pick best available voice (Hindi, Urdu, Indian English, or gentle English)
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('hi') ||
        v.lang.toLowerCase().includes('ur') ||
        v.lang.toLowerCase().includes('en-in')
    );
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.rate = 0.88; // Gentle, emotional, poetic pacing
    utterance.pitch = 1.02;
    utterance.volume = this.isMuted ? 0 : 1.0;

    let hasAdvanced = false;
    const advanceNext = () => {
      if (hasAdvanced || !this.isPlaying) return;
      hasAdvanced = true;
      this.speechTimeout = window.setTimeout(() => {
        if (this.isPlaying) {
          this.startPoemVoiceover(startIndex + 1);
        }
      }, line.pauseAfterMs);
    };

    utterance.onend = advanceNext;
    utterance.onerror = advanceNext;

    // Safety timeout in case speech engine hangs
    const estimatedSecs = Math.max(3.5, (speechText.length / 10) * 1.2);
    this.speechTimeout = window.setTimeout(() => {
      if (!hasAdvanced && this.isPlaying) {
        advanceNext();
      }
    }, estimatedSecs * 1000 + line.pauseAfterMs);

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      advanceNext();
    }
  }

  /**
   * Starts the Sister's Birthday Celebration Song & Hindi Poetry.
   * Completely replaces the old repetitive synth melody.
   */
  public startCelebrationSong() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentLineIndex = 0;
    this.notify();

    // Start acoustic piano music
    this.scheduleBackgroundAcousticCycle();

    // Start sister's poem narration after a sweet opening acoustic measure
    this.speechTimeout = window.setTimeout(() => {
      if (this.isPlaying) {
        this.startPoemVoiceover(0);
      }
    }, 1200);
  }

  /**
   * Stops both background acoustic music and poem speech.
   */
  public stopCelebrationSong() {
    this.isPlaying = false;
    this.currentLineIndex = -1;

    if (this.musicIntervalId) {
      window.clearTimeout(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.speechTimeout) {
      window.clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.notify();
  }

  public toggleCelebrationSong() {
    if (this.isPlaying) {
      this.stopCelebrationSong();
    } else {
      this.startCelebrationSong();
    }
  }

  public jumpToLine(index: number) {
    if (index >= 0 && index < SISTER_BIRTHDAY_SONG_LYRICS.length) {
      if (!this.isPlaying) {
        this.startCelebrationSong();
      }
      if (this.speechTimeout) {
        window.clearTimeout(this.speechTimeout);
      }
      this.startPoemVoiceover(index);
    }
  }

  // Sound Effect: Sparkles / Magic Harpeggio for wishes and surprise
  public playSparkleEffect() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
    chords.forEach((freq, idx) => {
      const time = this.ctx!.currentTime + idx * 0.06;
      this.playPianoNote(freq, time, 0.6, 0.4);
    });
  }

  // Sound Effect: Candle puff / breath out
  public playCandleBlowSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();
  }

  // Sound Effect: Balloon Pop
  public playBalloonPop() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

    noise.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
    oscGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }
}

export const audioEngine = new BirthdayAudioEngine();
