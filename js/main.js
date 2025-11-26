import { WindowManager } from './windowManager.js';
import { MusicPlayer } from './musicPlayer.js';
import { profileApp } from './apps/profile.js';
import { projectsApp } from './apps/projects.js';
import { skillsApp } from './apps/skills.js';
import { musicApp } from './apps/music.js';
import { githubApp } from './apps/github.js';

class CyberpunkDesktop {
    constructor() {
        this.windowManager = new WindowManager();
        this.musicPlayer = new MusicPlayer();
        this.init();
    }

    init() {
        // Make music player globally available for app buttons
        window.musicPlayer = this.musicPlayer;

        // Initialize desktop icons
        this.initDesktopIcons();
        
        // Open prfile window on load
        this.openProfileWindow();
        
        // Initialize clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
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
            github: githubApp
        };

        if (apps[appName]) {
            // Let the WindowManager handle positioning with cascading
            this.windowManager.createWindow(apps[appName]);
        }
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