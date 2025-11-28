import { WindowManager } from './windowManager.js';
import { MusicPlayer } from './musicPlayer.js';
import { BinaryRain } from './binaryRain.js';
import { Chip8Manager } from './chip8Manager.js';
import { profileApp } from './apps/profile.js';
import { projectsApp } from './apps/projects.js';
import { skillsApp } from './apps/skills.js';
import { musicApp } from './apps/music.js';
import { githubApp } from './apps/github.js';
import { chip8App } from './apps/chip8.js';

class CyberpunkDesktop {
    constructor() {
        this.windowManager = new WindowManager();
        this.musicPlayer = new MusicPlayer();
        this.binaryRain = new BinaryRain();
        this.backgroundEnabled = true;
        this.chip8Manager = null;
        this.init();
    }

    init() {
        window.desktop = this;

        // Make music player globally available for app buttons
        window.musicPlayer = this.musicPlayer;

        // Initialize desktop icons
        this.initDesktopIcons();
        
        // Open prfile window on load
        this.openProfileWindow();
        
        // Initialize clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        this.initBackgroundToggle();
        
        // Add some cyberpunk effects
        this.addCyberpunkEffects();
    }

    initDesktopIcons() {
        const icons = document.querySelectorAll('.icon');
        icons.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const appName = icon.dataset.app;
                this.openApp(appName);
            });
        });
    }

    openApp(appName) {
        const apps = {
            profile: profileApp,
            projects: projectsApp,
            skills: skillsApp,
            music: musicApp,
            github: githubApp,
            chip8: chip8App
        };

        if (apps[appName]) {
            // Let the WindowManager handle positioning with cascading
            this.windowManager.createWindow(apps[appName]);

            if (appName === 'chip8') {
                this.initChip8(windowElement);
            }
        }
    }

    async initChip8(windowElement) {
        // Wait for the window to be fully rendered
        setTimeout(async () => {
            this.chip8Manager = new Chip8Manager();
            await this.chip8Manager.init();
        }, 100);
    }

    openProfileWindow() {
        // Center the profile window on initial load by passing specific coordinates
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const x = (viewportWidth - profileApp.width) / 2;
        const y = (viewportHeight - profileApp.height) / 3; // Slightly higher than center
        
        this.windowManager.createWindow(profileApp, x, y);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('time').textContent = timeString;
    }

    initBackgroundToggle() {
        const bgToggle = document.getElementById('bgToggle');
        const binaryRain = document.getElementById('binaryRain');
        
        // Create static wallpaper element
        this.staticWallpaper = document.createElement('div');
        this.staticWallpaper.className = 'static-wallpaper';
        this.staticWallpaper.style.display = 'none';
        document.body.appendChild(this.staticWallpaper);
        
        // Load saved preference from localStorage
        const savedBgState = localStorage.getItem('cyberpunkBgEnabled');
        if (savedBgState !== null) {
            this.backgroundEnabled = savedBgState === 'true';
            this.updateBackgroundState();
        }
        
        bgToggle.addEventListener('click', () => {
            this.backgroundEnabled = !this.backgroundEnabled;
            this.updateBackgroundState();
            // Save preference
            localStorage.setItem('cyberpunkBgEnabled', this.backgroundEnabled.toString());
        });
        
        // Update tooltip based on current state
        this.updateToggleTooltip();
    }

    updateBackgroundState() {
        const bgToggle = document.getElementById('bgToggle');
        const binaryRain = document.getElementById('binaryRain');
        
        if (this.backgroundEnabled) {
            // Enable binary rain
            binaryRain.classList.remove('disabled');
            this.staticWallpaper.style.display = 'none';
            bgToggle.classList.remove('disabled');
            
            // Restart binary rain animation if it was stopped
            if (this.binaryRain && !this.binaryRain.animationId) {
                this.binaryRain.animate();
            }
        } else {
            // Disable binary rain
            binaryRain.classList.add('disabled');
            this.staticWallpaper.style.display = 'block';
            bgToggle.classList.add('disabled');
            
            // Stop binary rain animation to save resources
            if (this.binaryRain && this.binaryRain.animationId) {
                this.binaryRain.destroy();
            }
        }
        
        this.updateToggleTooltip();
    }

    updateToggleTooltip() {
        const bgToggle = document.getElementById('bgToggle');
        const state = this.backgroundEnabled ? 'ON' : 'OFF';
        bgToggle.title = `Background Effect: ${state} (Click to toggle)`;
    }


    addCyberpunkEffects() {
        // Add occasional glitch effect
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.glitchEffect();
            }
        }, 5000);
    }

    glitchEffect() {
        const desktop = document.getElementById('desktop');
        desktop.style.transform = 'translateX(2px)';
        desktop.style.filter = 'hue-rotate(90deg)';
        
        setTimeout(() => {
            desktop.style.transform = 'translateX(0)';
            desktop.style.filter = 'hue-rotate(0)';
        }, 100);
    }
}

// Initialize the desktop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkDesktop();
});