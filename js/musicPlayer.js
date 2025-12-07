export class MusicPlayer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentOscillator = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.animationId = null;
        this.visualizerBars = [];
        // this.init();
    }

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupVisualizer();
    }

    setupVisualizer() {
        // This will be called when the music app window opens
        // The actual visualizer elements will be created when needed
    }

    initVisualizer() {
        const visualizerContainer = document.getElementById('visualizer-bars');
        if (!visualizerContainer) return;

        // Clear existing bars
        visualizerContainer.innerHTML = '';
        this.visualizerBars = [];

        // Create 16 bars for the visualizer
        for (let i = 0; i < 16; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.height = '5px'; // Start minimal
            visualizerContainer.appendChild(bar);
            this.visualizerBars.push(bar);
        }

        // Setup audio analyser
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.updateVisualizerStatus('ACTIVE');
    }

    startVisualizer() {
        if (!this.analyser) return;

        const animate = () => {
            if (!this.isPlaying) {
                this.stopVisualizer();
                return;
            }

            this.analyser.getByteFrequencyData(this.dataArray);
            this.updateBars(this.dataArray);
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopVisualizer() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Reset bars to minimal height
        this.visualizerBars.forEach(bar => {
            if (bar) {
                bar.style.height = '5px';
                bar.style.opacity = '0.3';
            }
        });

        this.updateVisualizerStatus('IDLE');
    }

    updateBars(dataArray) {
        if (!this.visualizerBars.length) return;

        const segmentSize = Math.floor(dataArray.length / this.visualizerBars.length);

        this.visualizerBars.forEach((bar, index) => {
            if (!bar) return;

            const start = index * segmentSize;
            const end = start + segmentSize;
            let sum = 0;

            for (let i = start; i < end && i < dataArray.length; i++) {
                sum += dataArray[i];
            }

            const average = sum / segmentSize;
            const height = 5 + (average / 255) * 100; // 5px to 105px
            const opacity = 0.3 + (average / 255) * 0.7; // 0.3 to 1.0

            bar.style.height = `${height}px`;
            bar.style.opacity = opacity.toString();

            // Add color variation based on frequency
            if (average > 200) {
                bar.style.background = 'var(--neon-pink)';
                bar.style.boxShadow = 'var(--glow-pink)';
            } else if (average > 150) {
                bar.style.background = 'var(--neon-purple)';
                bar.style.boxShadow = 'var(--glow-blue)';
            } else {
                bar.style.background = 'var(--neon-blue)';
                bar.style.boxShadow = 'var(--glow-blue)';
            }
        });
    }

    updateVisualizerStatus(status) {
        const statusElement = document.getElementById('visualizer-status');
        if (statusElement) {
            statusElement.textContent = `STATUS: ${status}`;
        }
    }

    playSynth() {
        if (this.isPlaying) this.stop();
        
        this.init();
        this.isPlaying = true;
        
        document.getElementById('current-track').textContent = 'DRIVING_BASSLINE.ogg';
        document.getElementById('audio-status').textContent = 'ACTIVE';
        document.getElementById('immersion-level').textContent = '94%';
        
        this.initVisualizer();
        
        // Create multiple sound layers
        const bassOsc = this.audioContext.createOscillator();
        const leadOsc = this.audioContext.createOscillator();
        const padOsc1 = this.audioContext.createOscillator();
        const padOsc2 = this.audioContext.createOscillator();
        
        const bassGain = this.audioContext.createGain();
        const leadGain = this.audioContext.createGain();
        const padGain = this.audioContext.createGain();
        
        // Setup analyser (connect main output)
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        // === BASS LINE === (Simple driving sequence)
        bassOsc.type = 'sawtooth';
        const bassNotes = [55, 65.41, 73.42, 65.41]; // A, C, D, C (in Hz)
        let bassIndex = 0;
        
        const playBass = () => {
            if (!this.isPlaying) return;
            
            const freq = bassNotes[bassIndex];
            bassOsc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            // Pluck envelope for bass
            bassGain.gain.cancelScheduledValues(this.audioContext.currentTime);
            bassGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            bassGain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.02);
            bassGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
            
            bassIndex = (bassIndex + 1) % bassNotes.length;
            
            setTimeout(() => playBass(), 250); // Quarter notes at 120 BPM
        };
        
        // === LEAD MELODY === (Simple arpeggio)
        leadOsc.type = 'square';
        const leadNotes = [220, 261.63, 329.63, 392, 329.63, 261.63]; // A, C, E, G, E, C
        let leadIndex = 0;
        
        const playLead = () => {
            if (!this.isPlaying) return;
            
            const freq = leadNotes[leadIndex];
            leadOsc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            // Softer envelope for lead
            leadGain.gain.cancelScheduledValues(this.audioContext.currentTime);
            leadGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            leadGain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05);
            leadGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            
            leadIndex = (leadIndex + 1) % leadNotes.length;
            
            setTimeout(() => playLead(), 500); // Half notes
        };
        
        // === PAD CHORD === (Sustained background)
        padOsc1.type = 'sine';
        padOsc2.type = 'sine';
        
        // A minor chord (A-C-E)
        padOsc1.frequency.setValueAtTime(220, this.audioContext.currentTime); // A
        padOsc2.frequency.setValueAtTime(329.63, this.audioContext.currentTime); // E
        
        padGain.gain.setValueAtTime(0, this.audioContext.currentTime); // Quiet pad
        
        // === FILTERS AND EFFECTS ===
        const bassFilter = this.audioContext.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        const leadFilter = this.audioContext.createBiquadFilter();
        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        // Add delay effect to lead
        const delay = this.audioContext.createDelay();
        delay.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);
        const feedback = this.audioContext.createGain();
        feedback.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        
        // === CONNECTIONS ===
        // Bass chain
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.analyser);
        
        // Lead chain with delay
        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay); // Feedback loop
        feedback.connect(this.analyser);
        leadGain.connect(this.analyser);
        
        // Pad chain
        padOsc1.connect(padGain);
        padOsc2.connect(padGain);
        padGain.connect(this.analyser);
        
        // Final output
        this.analyser.connect(this.audioContext.destination);
        
        // Start oscillators
        bassOsc.start();
        leadOsc.start();
        padOsc1.start();
        padOsc2.start();
        
        // Start sequences
        setTimeout(() => playBass(), 50);
        setTimeout(() => playLead(), 100);
        
        this.currentOscillator = {
            bassOsc, leadOsc, padOsc1, padOsc2,
            bassGain, leadGain, padGain,
            bassFilter, leadFilter, delay, feedback
        };
        this.startVisualizer();
    }

    playCyber() {
        if (this.isPlaying) this.stop();
        
        this.init();
        this.isPlaying = true;
        
        document.getElementById('current-track').textContent = 'CYBER_NOISE.mp3';
        document.getElementById('audio-status').textContent = 'ACTIVE';
        document.getElementById('immersion-level').textContent = '95%';
        
        this.initVisualizer();
        
        // Create industrial cyberpunk sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Setup analyser
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(87.31, this.audioContext.currentTime);
        
        // Add modulation for industrial feel
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.setValueAtTime(8, this.audioContext.currentTime); // Faster LFO
        lfoGain.gain.setValueAtTime(50, this.audioContext.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        // Filter for harsh sound
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        
        // Connect nodes
        oscillator.connect(filter);
        filter.connect(this.analyser);
        this.analyser.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        lfo.start();
        
        this.currentOscillator = { oscillator, lfo, gainNode, filter };
        this.startVisualizer();
    }
    
    stop() {
        if (this.currentOscillator) {
            // Stop all oscillators
            Object.values(this.currentOscillator).forEach(node => {
                if (node && typeof node.stop === 'function') {
                    node.stop();
                }
            });
            this.currentOscillator = null;
        }
        
        this.isPlaying = false;
        
        document.getElementById('current-track').textContent = 'STOPPED';
        document.getElementById('audio-status').textContent = 'STANDBY';
        document.getElementById('immersion-level').textContent = '0%';
        
        this.stopVisualizer();
    }
}