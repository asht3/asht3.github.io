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
import { assetsApp } from './apps/assets.js';
import { mastermindApp } from './apps/mastermind.js';
import { MastermindManager } from './mastermindManager.js';

class CyberpunkDesktop {
    constructor() {
        this.windowManager = new WindowManager();
        this.musicPlayer = new MusicPlayer();
        this.binaryRain = new BinaryRain();
        this.backgroundEnabled = true;
        this.chip8Manager = null;
        this.isMobile = this.detectMobile();
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    init() {
        // Make desktop globally accessible for project links
        window.desktop = this;
        
        // Make music player globally available for app buttons
        window.musicPlayer = this.musicPlayer;

        // Initialize desktop icons with appropriate click event
        this.initDesktopIcons();
        
        // Open profile window on load (only on desktop)
        if (!this.isMobile) {
            this.openProfileWindow();
        }
        
        // Initialize clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Initialize background toggle
        this.initBackgroundToggle();
        
        // Initialize network status
        this.initNetworkStatus();
        
        // Add some cyberpunk effects
        this.addCyberpunkEffects();
        
        // Initialize mobile-specific features
        if (this.isMobile) {
            this.initMobileFeatures();
        }
    }

    initDesktopIcons() {
        const icons = document.querySelectorAll('.icon');
        const clickEvent = this.isMobile ? 'click' : 'dblclick';
        
        icons.forEach(icon => {
            icon.addEventListener(clickEvent, (e) => {
                // Prevent double-tap zoom on mobile
                if (this.isMobile) {
                    e.preventDefault();
                }
                
                const appName = icon.dataset.app;
                this.openApp(appName);
            });
            
            // Add touch feedback for mobile
            if (this.isMobile) {
                icon.style.cursor = 'pointer';
                
                icon.addEventListener('touchstart', () => {
                    icon.style.transform = 'scale(0.95)';
                });
                
                icon.addEventListener('touchend', () => {
                    icon.style.transform = 'scale(1)';
                });
            }
        });
    }

    initMobileFeatures() {
        console.log('Mobile mode activated');
        
        // Disable binary rain on mobile by default for performance
        if (this.backgroundEnabled) {
            this.backgroundEnabled = false;
            this.updateBackgroundState();
        }
        
        // Add swipe detection for taskbar
        this.initTaskbarSwipe();
        
        // Fix button event listeners for mobile - call this immediately
        this.fixMobileButtonEvents();
        
        // Add global click handler for mobile
        this.addGlobalMobileHandler();
    }

    fixMobileButtonEvents() {
        // Remove any existing event listeners first
        document.removeEventListener('click', this.globalMobileHandler);
        
        // Add new global event handler
        this.addGlobalMobileHandler();
        
        // Fix for dynamically created windows
        this.setupWindowObserver();
    }

    addGlobalMobileHandler() {
        this.globalMobileHandler = (e) => {
            this.handleMobileClick(e);
        };
        document.addEventListener('click', this.globalMobileHandler, true);
        document.addEventListener('touchend', this.globalMobileHandler, true);
    }

    handleMobileClick(e) {
        const target = e.target;
        
        // Handle music player buttons
        if (target.closest('.music-controls')) {
            const button = target.closest('button');
            if (button) {
                e.preventDefault();
                e.stopPropagation();
                
                const text = button.textContent;
                if (text.includes('SYNTHWAVE')) {
                    window.musicPlayer.playSynth();
                } else if (text.includes('CYBERPUNK')) {
                    window.musicPlayer.playCyber();
                } else if (text.includes('STOP')) {
                    window.musicPlayer.stop();
                }
                return false;
            }
        }
        
        // Handle project links
        if (target.closest('.project-links')) {
            const link = target.closest('.project-link');
            if (link) {
                e.preventDefault();
                e.stopPropagation();
                
                if (link.onclick) {
                    link.onclick();
                } else if (link.textContent.includes('LAUNCH EMULATOR')) {
                    this.openApp('chip8');
                } else if (link.textContent.includes('GitHub')) {
                    window.open('https://github.com/yourusername/chip8-emulator', '_blank');
                }
                return false;
            }
        }
        
        // Handle mobile control buttons
        if (target.closest('.mobile-window-controls')) {
            const button = target.closest('.mobile-control-button');
            if (button) {
                e.preventDefault();
                e.stopPropagation();
                
                const action = button.dataset.action;
                const windowElement = button.closest('.window');
                if (windowElement) {
                    const windowId = windowElement.id;
                    switch (action) {
                        case 'minimize':
                            this.windowManager.minimizeWindow(windowId);
                            break;
                        case 'maximize':
                            this.windowManager.toggleMaximize(windowId);
                            break;
                        case 'close':
                            this.windowManager.closeWindow(windowId);
                            break;
                    }
                }
                return false;
            }
        }
        
        // Handle CHIP-8 controls
        if (target.closest('.chip8-controls')) {
            const button = target.closest('button');
            const select = target.closest('select');
            
            if (button) {
                e.preventDefault();
                e.stopPropagation();
                
                const id = button.id;
                if (id === 'chip8-load') {
                    this.chip8Manager?.loadRomDialog();
                } else if (id === 'chip8-pause') {
                    this.chip8Manager?.togglePause();
                } else if (id === 'chip8-reset') {
                    this.chip8Manager?.reset();
                }
                return false;
            }
            
            if (select && select.id === 'chip8-rom-select') {
                // Let the native select work, but ensure it's usable
                return true;
            }
        }
    }

    setupWindowObserver() {
        // Watch for new windows being created and fix their buttons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList?.contains('window')) {
                        // New window added, fix its buttons after a short delay
                        setTimeout(() => {
                            this.fixWindowButtons(node);
                        }, 100);
                    }
                });
            });
        });
        
        observer.observe(document.getElementById('windows-container'), {
            childList: true,
            subtree: false
        });
    }

    fixWindowButtons(windowElement) {
        if (!windowElement) return;
        
        // Fix all buttons in the window
        const buttons = windowElement.querySelectorAll('button');
        buttons.forEach(button => {
            // Remove any existing listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
            
            // Add touch feedback
            button.style.cursor = 'pointer';
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
                button.style.opacity = '0.8';
            });
            
            button.addEventListener('touchend', () => {
                button.style.transform = 'scale(1)';
                button.style.opacity = '1';
            });
        });
        
        // Fix select elements
        const selects = windowElement.querySelectorAll('select');
        selects.forEach(select => {
            select.style.cursor = 'pointer';
            select.style.minHeight = '44px';
        });
    }

    fixMobileButtonEvents() {
        // Use event delegation for better mobile performance
        document.addEventListener('click', (e) => {
            // Handle music player buttons
            if (e.target.matches('.music-controls button, .music-controls button *')) {
                const button = e.target.closest('button');
                if (button) {
                    const text = button.textContent;
                    if (text.includes('SYNTHWAVE')) {
                        window.musicPlayer.playSynth();
                    } else if (text.includes('CYBERPUNK')) {
                        window.musicPlayer.playCyber();
                    } else if (text.includes('STOP')) {
                        window.musicPlayer.stop();
                    }
                }
            }
            
            // Handle project links
            if (e.target.matches('.project-link, .project-link *')) {
                const link = e.target.closest('.project-link');
                if (link && link.onclick) {
                    link.onclick();
                }
            }
        }, true); // Use capture phase for better reliability
    }

    initTaskbarSwipe() {
        const taskbarApps = document.getElementById('taskbar-apps');
        if (!taskbarApps) return;

        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;

        taskbarApps.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - taskbarApps.offsetLeft;
            scrollLeft = taskbarApps.scrollLeft;
            isScrolling = true;
        }, { passive: true });

        taskbarApps.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            const x = e.touches[0].pageX - taskbarApps.offsetLeft;
            const walk = (x - startX) * 1.5; // Reduced scroll factor
            taskbarApps.scrollLeft = scrollLeft - walk;
        }, { passive: true });

        taskbarApps.addEventListener('touchend', () => {
            isScrolling = false;
        }, { passive: true });
    }


    initAppSwipeToClose() {
        // This will be handled in windowManager for individual windows
    }

    openApp(appName) {
        const apps = {
            profile: profileApp,
            projects: projectsApp,
            skills: skillsApp,
            music: musicApp,
            github: githubApp,
            chip8: chip8App,
            assets: assetsApp,
            mastermind: mastermindApp
        };

        if (apps[appName]) {
            const windowElement = this.windowManager.createWindow(apps[appName]);
            
            // On mobile, maximize the window automatically
            if (this.isMobile) {
                this.windowManager.maximizeWindow(
                    windowElement.id.replace('window-', '')
                );
            }
            
            // Initialize CHIP-8 when the app opens
            if (appName === 'chip8') {
                this.initChip8(windowElement);
            }
            
            // Initialize music visualizer when music app opens
            if (appName === 'music') {
                this.initMusicVisualizer(windowElement);
            }

            if (appName === 'mastermind') {
                this.initMastermind(windowElement);
            }
        }
    }

    initMastermind(windowElement) {
        setTimeout(async () => {
            this.mastermindManager = new MastermindManager();
            await this.mastermindManager.init();
        }, 100);
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