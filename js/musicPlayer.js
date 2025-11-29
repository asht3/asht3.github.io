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
        this.init();
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
        
        document.getElementById('current-track').textContent = 'SYNTHWAVE_BEAT.ogg';
        document.getElementById('audio-status').textContent = 'ACTIVE';
        document.getElementById('immersion-level').textContent = '92%';
        
        this.initVisualizer();
        
        // Create synthwave sound with multiple oscillators for richer visualization
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Setup analyser
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        // Main oscillator
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(110, this.audioContext.currentTime);
        
        // Second oscillator for harmonics
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(55, this.audioContext.currentTime);
        
        // Filter for synth sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        // Connect nodes: oscillators → filter → analyser → gain → destination
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(this.analyser);
        this.analyser.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator1.start();
        oscillator2.start();
        
        this.currentOscillator = { oscillator1, oscillator2, gainNode, filter };
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