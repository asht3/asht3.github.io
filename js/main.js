import { WindowManager } from './windowManager.js';
import { MusicPlayer } from './musicPlayer.js';
import { summaryApp } from './apps/summary.js';
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
        
        // Open summary window on load
        this.openSummaryWindow();
        
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
            summary: summaryApp,
            projects: projectsApp,
            skills: skillsApp,
            music: musicApp,
            github: githubApp
        };

        if (apps[appName]) {
            // Position windows slightly offset from each other
            const x = 100 + (Object.keys(apps).indexOf(appName) * 30);
            const y = 100 + (Object.keys(apps).indexOf(appName) * 30);
            this.windowManager.createWindow(apps[appName], x, y);
        }
    }

    openSummaryWindow() {
        this.windowManager.createWindow(summaryApp, 150, 150);
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