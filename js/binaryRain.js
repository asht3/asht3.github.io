export class BinaryRain {
    constructor() {
        this.canvas = document.getElementById('binaryRain');
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Create drops
        this.createDrops();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createDrops(); // Recreate drops on resize
    }

    createDrops() {
        this.drops = [];
        const columns = Math.floor(this.canvas.width / 20); // Spacing between columns
        const dropCount = columns * 2; // More drops for density

        for (let i = 0; i < dropCount; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: 2 + Math.random() * 5,
                length: 5 + Math.floor(Math.random() * 20),
                characters: this.generateBinaryString(10 + Math.floor(Math.random() * 20)),
                opacity: 0.1 + Math.random() * 0.4
            });
        }
    }

    generateBinaryString(length) {
        let binary = '';
        for (let i = 0; i < length; i++) {
            binary += Math.random() > 0.5 ? '1' : '0';
        }
        return binary;
    }

    animate() {
        this.ctx.fillStyle = 'rgba(5, 5, 16, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drops.forEach((drop, index) => {
            // Draw the binary string
            this.ctx.fillStyle = `rgba(0, 243, 255, ${drop.opacity})`;
            this.ctx.font = '14px "Courier New", monospace';
            
            // Draw each character with slight vertical offset
            for (let i = 0; i < drop.characters.length; i++) {
                const char = drop.characters[i];
                const y = drop.y + (i * 14); // Character spacing
                
                // Fade out characters towards the end
                const charOpacity = 1 - (i / drop.characters.length);
                this.ctx.fillStyle = `rgba(0, 243, 255, ${drop.opacity * charOpacity})`;
                
                this.ctx.fillText(char, drop.x, y);
            }

            // Move drop down
            drop.y += drop.speed;

            // Reset drop when it goes off screen
            if (drop.y > this.canvas.height + (drop.characters.length * 14)) {
                this.drops[index] = {
                    x: Math.random() * this.canvas.width,
                    y: -50,
                    speed: 2 + Math.random() * 5,
                    length: 5 + Math.floor(Math.random() * 15),
                    characters: this.generateBinaryString(10 + Math.floor(Math.random() * 15)),
                    opacity: 0.1 + Math.random() * 0.2
                };
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}