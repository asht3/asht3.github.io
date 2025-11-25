export class MusicPlayer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentOscillator = null;
    }

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSynth() {
        if (this.isPlaying) this.stop();
        
        this.init();
        this.isPlaying = true;
        document.getElementById('current-track').textContent = 'SYNTHWAVE_BEAT.ogg';
        
        // Create a simple synthwave-like sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(110, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        this.currentOscillator = oscillator;
    }

    playCyber() {
        if (this.isPlaying) this.stop();
        
        this.init();
        this.isPlaying = true;
        document.getElementById('current-track').textContent = 'CYBER_NOISE.mp3';
        
        // Create a more industrial cyberpunk sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(87.31, this.audioContext.currentTime); // F note
        
        // Add some modulation for industrial feel
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.setValueAtTime(5, this.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(50, this.audioContext.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        lfo.start();
        this.currentOscillator = oscillator;
    }

    stop() {
        if (this.currentOscillator) {
            this.currentOscillator.stop();
            this.currentOscillator = null;
        }
        this.isPlaying = false;
        document.getElementById('current-track').textContent = 'STOPPED';
    }
}