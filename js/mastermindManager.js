export class MastermindManager {
    static instance = null;

    constructor() {
        if (MastermindManager.instance) {
            console.log('Returning existing MastermindManager instance');
            return MastermindManager.instance;
        }
        this.module = null;
        this.wasmModule = null;
        this.gamePtr = null;
        this.gameActive = false;
        this.currentGuess = [];
        this.maxAttempts = 10;
        this.currentAttempt = 0;
        this.secretCode = null;
        this.eventListeners = new Map();
        this.init();

        MastermindManager.instance = this;
    }

    async init() {
        this.setupUI();        
        await this.loadWasmModule();
        this.newGame();
    }

    setupUI() {
        // Create color palette (0-7 colors)
        this.createColorPalette();
        this.createCodeSlots();
        this.setupEventListeners();
    }

    createColorPalette() {
        const palette = document.getElementById('color-palette');
        if (!palette) return;
        
        palette.innerHTML = '';
        
        const colors = [
            '#00f3ff', '#ff00ff', '#00ff9d', '#b967ff',
            '#ffff00', '#ff5500', '#00aaff', '#ff0066'
        ];
        
        colors.forEach((color, index) => {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-btn cyber-button color-option';
            colorBtn.dataset.value = index;
            colorBtn.style.background = color;
            colorBtn.title = `Color ${index}`;
            colorBtn.innerHTML = `
                <span class="color-number">${index}</span>
                <div class="color-glow"></div>
                <div class="cyber-button-border"></div>
            `;
            palette.appendChild(colorBtn);
        });
    }

    createCodeSlots() {
        const slots = document.getElementById('code-slots');
        if (!slots) return;
        
        slots.innerHTML = '';
        this.currentGuess = [];
        
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'code-slot cyber-slot';
            slot.dataset.index = i;
            slot.dataset.value = '-1';
            slot.innerHTML = `
                <div class="slot-content">?</div>
                <div class="slot-glow"></div>
            `;
            
            // Use a single event listener
            this.addSingleEventListener(slot, 'click', () => {
                this.clearSlot(i);
            });
            
            slots.appendChild(slot);
            this.currentGuess.push(-1);
        }
    }

    addSingleEventListener(element, event, handler) {
        // Remove any existing listener first
        const key = `${event}-${element.dataset.index || 'global'}`;
        const existingHandler = this.eventListeners.get(key);
        
        if (existingHandler) {
            element.removeEventListener(event, existingHandler);
        }
        
        // Add new listener
        element.addEventListener(event, handler);
        this.eventListeners.set(key, handler);
    }

    setupEventListeners() {
        // Clear existing listeners
        this.clearAllEventListeners();
        
        // Color palette clicks - use event delegation
        const palette = document.getElementById('color-palette');
        if (palette) {
            this.addSingleEventListener(palette, 'click', (e) => {
                const colorBtn = e.target.closest('.color-btn');
                if (colorBtn) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.addToGuess(parseInt(colorBtn.dataset.value));
                }
            });
        }

        // Number key input (0-7)
        this.addSingleEventListener(document, 'keydown', (e) => {
            if (!this.gameActive) return;
            
            const key = e.key;
            if (key >= '0' && key <= '7') {
                e.preventDefault();
                this.addToGuess(parseInt(key));
            } else if (key === 'Backspace') {
                e.preventDefault();
                this.removeLastGuess();
            } else if (key === 'Enter') {
                e.preventDefault();
                this.submitGuess();
            }
        });

        // Control buttons - use direct single listeners
        const submitBtn = document.getElementById('submit-guess');
        const clearBtn = document.getElementById('clear-guess');
        const newGameBtn = document.getElementById('new-game');
        
        if (submitBtn) {
            this.addSingleEventListener(submitBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.submitGuess();
            });
        }
        
        if (clearBtn) {
            this.addSingleEventListener(clearBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearGuess();
            });
        }
        
        if (newGameBtn) {
            this.addSingleEventListener(newGameBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.newGame();
            });
        }

        // Game options - use event delegation
        const optionButtons = document.querySelector('.option-buttons');
        if (optionButtons) {
            this.addSingleEventListener(optionButtons, 'click', (e) => {
                const optionBtn = e.target.closest('.option-button');
                if (optionBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const mode = optionBtn.dataset.mode;
                    this.setGameMode(mode);
                }
            });
        }

        // Attempts input
        const attemptsInput = document.getElementById('attempts-input');
        if (attemptsInput) {
            this.addSingleEventListener(attemptsInput, 'change', (e) => {
                this.maxAttempts = parseInt(e.target.value) || 10;
                this.updateUI();
            });
        }

        // Custom code input
        const customCodeInput = document.getElementById('custom-code');
        if (customCodeInput) {
            this.addSingleEventListener(customCodeInput, 'input', (e) => {
                const code = e.target.value.replace(/[^0-7]/g, '');
                e.target.value = code;
                if (code.length === 4) {
                    this.secretCode = code.split('').map(Number);
                }
            });
        }
        
        // Add touch event prevention for mobile
        this.addSingleEventListener(document, 'touchstart', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // setupEventListeners() {
    //     // Remove any existing listeners first to prevent duplicates
    //     this.removeEventListeners();
        
    //     // Get palette element once
    //     const palette = document.getElementById('color-palette');
    //     if (!palette) return;
        
    //     // Use event delegation with proper event handling
    //     palette.addEventListener('click', (e) => {
    //         // Only handle clicks directly on color-btn or its children
    //         const colorBtn = e.target.closest('.color-btn');
    //         if (colorBtn && this.gameActive) {
    //             // Prevent multiple triggers
    //             e.stopPropagation();
    //             e.preventDefault();
                
    //             const value = parseInt(colorBtn.dataset.value);
    //             if (!isNaN(value)) {
    //                 this.addToGuess(value);
    //             }
    //         }
    //     });

    //     // Number key input (0-7) - throttle input
    //     let lastKeyTime = 0;
    //     const keyThrottle = 200; // ms between key presses
        
    //     document.addEventListener('keydown', (e) => {
    //         if (!this.gameActive) return;
            
    //         // Throttle key presses
    //         const now = Date.now();
    //         if (now - lastKeyTime < keyThrottle) {
    //             e.preventDefault();
    //             return;
    //         }
    //         lastKeyTime = now;
            
    //         const key = e.key;
    //         if (key >= '0' && key <= '7') {
    //             e.preventDefault(); // Prevent default behavior
    //             this.addToGuess(parseInt(key));
    //         } else if (key === 'Backspace') {
    //             e.preventDefault();
    //             this.removeLastGuess();
    //         } else if (key === 'Enter') {
    //             e.preventDefault();
    //             this.submitGuess();
    //         }
    //     });

    //     // Control buttons - add debouncing
    //     this.setupButtonWithDebounce('submit-guess', () => this.submitGuess());
    //     this.setupButtonWithDebounce('clear-guess', () => this.clearGuess());
    //     this.setupButtonWithDebounce('new-game', () => this.newGame());

    //     // Game options
    //     document.querySelectorAll('.option-button').forEach(btn => {
    //         // Remove existing listeners
    //         btn.replaceWith(btn.cloneNode(true));
    //     });
        
    //     // Re-attach listeners to new button nodes
    //     document.querySelectorAll('.option-button').forEach(btn => {
    //         btn.addEventListener('click', (e) => {
    //             const mode = e.currentTarget.dataset.mode;
    //             this.setGameMode(mode);
    //         });
    //     });

    //     // Attempts input
    //     const attemptsInput = document.getElementById('attempts-input');
    //     if (attemptsInput) {
    //         attemptsInput.addEventListener('change', (e) => {
    //             this.maxAttempts = parseInt(e.target.value) || 10;
    //             this.updateUI();
    //         });
    //     }

    //     // Custom code input
    //     const customCodeInput = document.getElementById('custom-code');
    //     if (customCodeInput) {
    //         customCodeInput.addEventListener('input', (e) => {
    //             const code = e.target.value.replace(/[^0-7]/g, '');
    //             e.target.value = code;
    //             if (code.length === 4) {
    //                 this.secretCode = code.split('').map(Number);
    //             }
    //         });
    //     }
    // }

    clearAllEventListeners() {
        // Clear all tracked event listeners
        this.eventListeners.forEach((handler, key) => {
            const [event] = key.split('-');
        });
        this.eventListeners.clear();
    }

    // Helper method to remove existing listeners
    removeEventListeners() {
        // Store references for cleanup
        const palette = document.getElementById('color-palette');
        if (palette && this.paletteHandler) {
            palette.removeEventListener('click', this.paletteHandler);
        }
        
        // Store the keydown handler reference
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }

    // Setup button with debouncing to prevent double clicks
    setupButtonWithDebounce(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        // Remove existing listeners
        button.replaceWith(button.cloneNode(true));
        const newButton = document.getElementById(buttonId);
        
        let lastClick = 0;
        const debounceTime = 500; // ms
        
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const now = Date.now();
            if (now - lastClick < debounceTime) {
                return; // Ignore rapid clicks
            }
            lastClick = now;
            
            handler();
        });
    }

    addToGuess(value) {
        if (!this.gameActive) return;
        
        console.log(`Adding value ${value} to guess`);
        
        const emptySlot = this.currentGuess.indexOf(-1);
        if (emptySlot !== -1) {
            this.currentGuess[emptySlot] = value;
            this.updateCodeSlots();
            
            // Debounce: prevent multiple rapid clicks
            this.debounceAddToGuess();
        }
    }

    debounceAddToGuess() {
        // Simple debounce to prevent double clicks
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            this.debounceTimer = null;
        }, 100);
    }

    // Update the code slot click handler too
    createCodeSlots() {
        const slots = document.getElementById('code-slots');
        if (!slots) return;
        
        slots.innerHTML = '';
        this.currentGuess = [];
        
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'code-slot';
            slot.dataset.index = i;
            slot.dataset.value = '-1';
            slot.innerHTML = '?';
            
            // Add debouncing to slot clicks
            let lastClick = 0;
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const now = Date.now();
                if (now - lastClick < 300) {
                    return;
                }
                lastClick = now;
                
                this.clearSlot(i);
            });
            
            slots.appendChild(slot);
            this.currentGuess.push(-1);
        }
    }

   async loadWasmModule() {
        try {
            console.log('Attempting to load WebAssembly module...');
            
            // First, check if the WASM file exists
            const wasmUrl = './public/wasm/mastermind_wasm.js';
            console.log('Looking for WASM at:', wasmUrl);
            
            // Try to fetch the file to see if it exists
            try {
                const response = await fetch(wasmUrl);
                if (!response.ok) {
                    throw new Error(`WASM file not found (${response.status})`);
                }
                console.log('WASM file exists');
            } catch (fetchError) {
                console.error('WASM file not accessible:', fetchError);
                throw fetchError;
            }
            
            // Load WebAssembly module with better error handling
            this.wasmModule = await this.loadWasm(wasmUrl);
            
            if (!this.wasmModule) {
                throw new Error('WASM module loaded but is null');
            }
            
            console.log('WebAssembly module loaded successfully:', this.wasmModule);
            
            // Wrap C functions for easy calling
            this.wasmAPI = {
                create: this.wasmModule.cwrap('mastermind_create', 'number', []),
                destroy: this.wasmModule.cwrap('mastermind_destroy', null, ['number']),
                newRandomGame: this.wasmModule.cwrap('mastermind_new_random_game', null, ['number']),
                newCustomGame: this.wasmModule.cwrap('mastermind_new_custom_game', null, ['number', 'string']),
                checkGuess: this.wasmModule.cwrap('mastermind_check_guess', 'string', ['number', 'array']),
                getSecretCode: this.wasmModule.cwrap('mastermind_get_secret_code', 'string', ['number']),
                getAttempts: this.wasmModule.cwrap('mastermind_get_attempts', 'number', ['number']),
                isGameWon: this.wasmModule.cwrap('mastermind_is_game_won', 'number', ['number']),
                isGameOver: this.wasmModule.cwrap('mastermind_is_game_over', 'number', ['number', 'number'])
            };
            
            console.log('WASM API created:', this.wasmAPI);
            
            // Create game instance
            this.gamePtr = this.wasmAPI.create();
            console.log('Game instance created, pointer:', this.gamePtr);
            
            this.updateStatus('WASM_MODULE_LOADED');
            console.log('Mastermind WebAssembly fully loaded and ready!');
            
        } catch (error) {
            console.error('Failed to load WebAssembly module. Details:', {
                error: error.message,
                stack: error.stack,
                url: error.filename || 'unknown'
            });
            this.updateStatus('ERROR: WASM_MODULE_FAILED');
            
            // Fallback to JavaScript implementation
            this.setupFallbackGame();
        }
    }

    async loadWasm(url) {
        return new Promise((resolve, reject) => {
            console.log('Loading WASM script from:', url);
            
            // Check if already loaded
            if (window.MastermindWasm) {
                console.log('Using cached WASM module');
                resolve(window.MastermindWasm);
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            script.onload = () => {
                console.log('Script loaded, initializing module...');
                
                if (!window.MastermindWasm) {
                    reject(new Error('MastermindWasm not defined after script load'));
                    return;
                }
                
                // Initialize the module
                window.MastermindWasm().then(module => {
                    console.log('Module initialized:', module);
                    resolve(module);
                }).catch(moduleError => {
                    console.error('Module initialization failed:', moduleError);
                    reject(moduleError);
                });
            };
            
            script.onerror = (error) => {
                console.error('Script load error:', error);
                reject(new Error(`Failed to load script: ${url}`));
            };
            
            // Add to document
            document.head.appendChild(script);
            console.log('Script element added to head');
        });
    }

    setupFallbackGame() {
        // JavaScript fallback implementation
        console.log('Using JavaScript fallback implementation');
        this.updateStatus('FALLBACK_MODE_ACTIVE');
        this.useWasm = false;
    }

    newGame() {
        const mode = document.querySelector('.option-button.active')?.dataset.mode || 'random';
        this.maxAttempts = parseInt(document.getElementById('attempts-input')?.value) || 10;
        this.currentAttempt = 0;
        this.gameActive = true;
        
        if (this.gamePtr && this.wasmAPI) {
            if (mode === 'custom') {
                const customCode = document.getElementById('custom-code')?.value;
                if (customCode && customCode.length === 4) {
                    this.wasmAPI.newCustomGame(this.gamePtr, customCode);
                    this.updateStatus('CUSTOM_CODE_ACTIVE');
                } else {
                    // Fallback to random
                    this.wasmAPI.newRandomGame(this.gamePtr);
                    this.updateStatus('RANDOM_CODE_GENERATED');
                }
            } else {
                this.wasmAPI.newRandomGame(this.gamePtr);
                this.updateStatus('RANDOM_CODE_GENERATED');
            }
            
            // Get secret code for display
            this.secretCode = this.wasmAPI.getSecretCode(this.gamePtr).split('').map(Number);
        } else {
            // Fallback to JavaScript
            this.secretCode = this.generateRandomCode();
            this.updateStatus('RANDOM_CODE_GENERATED');
        }
        
        // Reset UI
        this.createCodeSlots();
        document.getElementById('guess-history').innerHTML = '';
        document.getElementById('attempts-count').textContent = this.maxAttempts;
        document.getElementById('score').textContent = '0';
        
        // Add to game log
        this.addToLog(`> NEW_GAME_STARTED`);
        this.addToLog(`> ATTEMPTS: ${this.maxAttempts}`);
        this.addToLog(`> MODE: ${mode.toUpperCase()}`);
    }

    generateRandomCode() {
        const code = [];
        for (let i = 0; i < 4; i++) {
            code.push(Math.floor(Math.random() * 8));
        }
        return code;
    }

    addToGuess(value) {
        if (!this.gameActive) return;
        
        const emptySlot = this.currentGuess.indexOf(-1);
        if (emptySlot !== -1) {
            this.currentGuess[emptySlot] = value;
            this.updateCodeSlots();
        }
    }

    removeLastGuess() {
        if (!this.gameActive) return;
        
        for (let i = this.currentGuess.length - 1; i >= 0; i--) {
            if (this.currentGuess[i] !== -1) {
                this.currentGuess[i] = -1;
                this.updateCodeSlots();
                break;
            }
        }
    }

    clearSlot(index) {
        if (!this.gameActive) return;
        
        this.currentGuess[index] = -1;
        this.updateCodeSlots();
    }

    clearGuess() {
        if (!this.gameActive) return;
        
        this.currentGuess = this.currentGuess.map(() => -1);
        this.updateCodeSlots();
    }

    updateCodeSlots() {
        const slots = document.querySelectorAll('.code-slot');
        slots.forEach((slot, index) => {
            const value = this.currentGuess[index];
            const slotContent = slot.querySelector('.slot-content');
            const slotGlow = slot.querySelector('.slot-glow');
            
            if (value !== -1) {
                slotContent.textContent = value;
                slot.dataset.value = value;
                slot.classList.add('filled', 'active');
                
                // Set color based on value
                const colors = [
                    '#00f3ff', '#ff00ff', '#00ff9d', '#b967ff',
                    '#ffff00', '#ff5500', '#00aaff', '#ff0066'
                ];
                const color = colors[value];
                
                slot.style.setProperty('--slot-color', color);
                slotGlow.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
                slotGlow.style.opacity = '0.6';
                
            } else {
                slotContent.textContent = '?';
                slot.dataset.value = '-1';
                slot.classList.remove('filled', 'active');
                slot.style.setProperty('--slot-color', 'transparent');
                slotGlow.style.opacity = '0';
            }
        });
    }

    async submitGuess() {
        if (!this.gameActive) return;
        
        // Check if guess is complete - KEEP your existing validation
        if (this.currentGuess.includes(-1)) {
            this.addToLog('> ERROR: INCOMPLETE_GUESS');
            return;
        }
        
        this.currentAttempt++;
        
        let feedback;
        if (this.gamePtr && this.wasmAPI) {
            // Use WebAssembly for game logic
            const feedbackStr = this.wasmAPI.checkGuess(this.gamePtr, this.currentGuess);
            const [correct, misplaced] = feedbackStr.split(',').map(Number);
            feedback = { correct, misplaced };
            
            this.currentAttempt = this.wasmAPI.getAttempts(this.gamePtr);
        } else {
            // Fallback to JavaScript
            feedback = this.calculateFeedback(this.currentGuess, this.secretCode);
        }
        
        this.addToHistory(this.currentGuess, feedback);
        
        this.addToLog(`> ATTEMPT ${this.currentAttempt}: ${this.currentGuess.join('')}`);
        this.addToLog(`> FEEDBACK: ${feedback.correct} correct, ${feedback.misplaced} misplaced`);
        
        if (feedback.correct === 4) {
            this.gameWin();
            return;
        }
        
        if (this.currentAttempt >= this.maxAttempts) {
            this.gameLose();
            return;
        }
        
        // Reset for next guess
        this.clearGuess();
        
        // Update attempts counter
        document.getElementById('attempts-count').textContent = this.maxAttempts - this.currentAttempt;
    }

    calculateFeedback(guess, secret) {
        let correct = 0;
        let misplaced = 0;
        
        const guessCount = [0, 0, 0, 0, 0, 0, 0, 0];
        const secretCount = [0, 0, 0, 0, 0, 0, 0, 0];
        
        // Count correct positions
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secret[i]) {
                correct++;
            } else {
                guessCount[guess[i]]++;
                secretCount[secret[i]]++;
            }
        }
        
        // Count misplaced
        for (let i = 0; i < 8; i++) {
            misplaced += Math.min(guessCount[i], secretCount[i]);
        }
        
        return { correct, misplaced };
    }

    addToHistory(guess, feedback) {
        const history = document.getElementById('guess-history');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Create guess display
        const guessDisplay = document.createElement('div');
        guessDisplay.className = 'history-guess';
        guess.forEach(value => {
            const digit = document.createElement('span');
            digit.className = 'history-digit';
            digit.textContent = value;
            digit.style.background = this.getColorForDigit(value);
            guessDisplay.appendChild(digit);
        });
        
        // Create feedback display
        const feedbackDisplay = document.createElement('div');
        feedbackDisplay.className = 'history-feedback';
        for (let i = 0; i < feedback.correct; i++) {
            const dot = document.createElement('span');
            dot.className = 'feedback-dot correct';
            feedbackDisplay.appendChild(dot);
        }
        for (let i = 0; i < feedback.misplaced; i++) {
            const dot = document.createElement('span');
            dot.className = 'feedback-dot misplaced';
            feedbackDisplay.appendChild(dot);
        }
        
        historyItem.appendChild(guessDisplay);
        historyItem.appendChild(feedbackDisplay);
        history.appendChild(historyItem);
        
        // Scroll to bottom
        history.scrollTop = history.scrollHeight;
    }

    getColorForDigit(digit) {
        const colors = [
            '#00f3ff', '#ff00ff', '#00ff9d', '#b967ff',
            '#ffff00', '#ff5500', '#00aaff', '#ff0066'
        ];
        return colors[digit] || '#333';
    }

    gameWin() {
        this.gameActive = false;
        
        // Check if won via WebAssembly
        const isWon = this.gamePtr && this.wasmAPI 
            ? this.wasmAPI.isGameWon(this.gamePtr)
            : true;
        
        if (isWon) {
            this.updateStatus('VICTORY_PROTOCOL_ACTIVATED');
            this.addToLog('> CONGRATULATIONS! CODE_CRACKED');
            this.addToLog(`> SCORE: ${this.calculateScore()}`);
            
            // Update score
            const score = this.calculateScore();
            document.getElementById('score').textContent = score;
            
            // Visual celebration
            document.querySelector('.mastermind-terminal').classList.add('victory');
        } else {
            this.gameLose();
        }
    }

    gameLose() {
        this.gameActive = false;
        this.updateStatus('GAME_OVER');
        this.addToLog('> FAILURE: MAXIMUM_ATTEMPTS_REACHED');
        
        // Get secret code from WebAssembly if available
        const secretCode = this.gamePtr && this.wasmAPI
            ? this.wasmAPI.getSecretCode(this.gamePtr)
            : this.secretCode.join('');
            
        this.addToLog(`> SECRET_CODE: ${secretCode}`);
        
        // Visual indication
        document.querySelector('.mastermind-terminal').classList.add('game-over');
    }

    calculateScore() {
        const baseScore = 1000;
        const attemptPenalty = (this.currentAttempt - 1) * 50;
        const timeBonus = 0; // Could add timer later
        return Math.max(0, baseScore - attemptPenalty + timeBonus);
    }

    setGameMode(mode) {
        // Update active button
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Show/hide custom code input
        const customGroup = document.querySelector('.custom-code-group');
        if (customGroup) {
            customGroup.style.display = mode === 'custom' ? 'block' : 'none';
        }
        
        // Reset game if changing mode
        this.newGame();
    }

    updateStatus(status) {
        const statusElement = document.getElementById('game-status');
        if (statusElement) {
            statusElement.textContent = `STATUS: ${status}`;
        }
    }

    addToLog(message) {
        const log = document.getElementById('game-log');
        if (log) {
            log.innerHTML += `<br>${message}`;
            log.scrollTop = log.scrollHeight;
        }
    }

    updateUI() {
        document.getElementById('attempts-count').textContent = this.maxAttempts;
    }

    static reset() {
        if (MastermindManager.instance) {
            MastermindManager.instance.cleanup();
            MastermindManager.instance = null;
        }
    }

    cleanup() {
        if (this.gamePtr && this.wasmAPI) {
            this.wasmAPI.destroy(this.gamePtr);
            this.gamePtr = null;
        }
        this.gameActive = false;
    }
}