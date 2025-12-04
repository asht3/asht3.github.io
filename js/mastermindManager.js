export class MastermindManager {
    static instance = null;
    
    constructor() {
        // Singleton pattern
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
        
        // Track initialization state
        this.initialized = false;
        this.initializing = false;
        
        // Store as singleton
        MastermindManager.instance = this;
        window.mastermindManager = this; // Also store globally
        
        console.log('MastermindManager constructed (not initialized yet)');
    }

    async initialize() {
        if (this.initialized || this.initializing) {
            console.log('Already initialized or initializing');
            return;
        }
        
        this.initializing = true;
        console.log('Starting MastermindManager initialization...');
        
        try {
            // Setup UI
            this.setupUI();
            
            // Load WebAssembly
            await this.loadWasmModule();
            
            // Start new game
            this.newGame();
            
            this.initialized = true;
            console.log('MastermindManager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize MastermindManager:', error);
            throw error;
        } finally {
            this.initializing = false;
        }
    }

    setupUI() {
        console.log('🎨 Setting up Mastermind UI');
        
        // Always recreate these elements
        this.createColorPalette();
        this.createCodeSlots();
        this.setupEventListeners();
        
        // Ensure other elements exist
        this.ensureUIElements();
    }

    ensureUIElements() {
        // Check for and create missing essential elements
        const requiredIds = [
            'color-palette',
            'code-slots', 
            'submit-guess',
            'clear-guess',
            'new-game',
            'game-status',
            'game-log',
            'guess-history',
            'attempts-count'
        ];
        
        requiredIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Missing element: #${id}`);
                
                // Try to find parent container
                const container = document.querySelector('.mastermind-container') || 
                                document.querySelector('.mastermind-terminal');
                
                if (container && id === 'color-palette') {
                    // Create palette if missing
                    this.createColorPalette();
                }
            }
        });
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
        if (!slots) {
            console.error('No code-slots element found!');
            return;
        }
        
        slots.innerHTML = '';
        this.currentGuess = [];
        
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'code-slot cyber-slot'; // Use both classes
            slot.dataset.index = i;
            slot.dataset.value = '-1';
            slot.innerHTML = `
                <div class="slot-content">?</div>
                <div class="slot-glow"></div>
            `;
            
            // Use a direct event listener
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearSlot(i);
            });
            
            slots.appendChild(slot);
            this.currentGuess.push(-1);
        }
        
        console.log('Created code slots:', this.currentGuess);
    }

    addSingleEventListener(element, event, handler, keySuffix = '') {
        // Create a unique key for this listener
        const key = `${event}-${element.id || element.tagName || 'global'}${keySuffix}`;
        
        // Remove any existing listener first
        const existingHandler = this.eventListeners.get(key);
        if (existingHandler) {
            element.removeEventListener(event, existingHandler);
        }
        
        // Add new listener
        element.addEventListener(event, handler);
        this.eventListeners.set(key, handler);
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // REMOVE ALL existing listeners first by replacing elements
        this.replaceInteractiveElements();
        
        const palette = document.getElementById('color-palette');
        if (palette) {
            console.log('Setting up palette click handler');
            
            // Use a single function reference
            const handlePaletteClick = (e) => {
                // Find the actual color button
                const colorBtn = e.target.closest('.color-btn');
                if (!colorBtn || !this.gameActive) return;
                
                console.log('Color button clicked:', colorBtn.dataset.value);
                
                e.stopImmediatePropagation();
                e.preventDefault();
                
                // Add visual feedback to prevent double clicks
                colorBtn.style.pointerEvents = 'none';
                setTimeout(() => {
                    colorBtn.style.pointerEvents = '';
                }, 300);
                
                const value = parseInt(colorBtn.dataset.value);
                if (!isNaN(value)) {
                    this.addToGuess(value);
                }
            };
            
            // Add with capture phase to catch early
            palette.addEventListener('click', handlePaletteClick, true);
            this.eventListeners.set('palette-click', handlePaletteClick);
        }
        
        const handleKeyDown = (e) => {
            // Don't handle if we're in an input field (for custom code)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            if (!this.gameActive) return;
            
            const key = e.key;
            
            // Prevent default for all game keys
            if (key >= '0' && key <= '7' || key === 'Backspace' || key === 'Enter') {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            
            // Handle with debouncing
            if (key >= '0' && key <= '7') {
                // Use requestAnimationFrame to ensure single execution
                requestAnimationFrame(() => {
                    this.addToGuess(parseInt(key));
                });
            } else if (key === 'Backspace') {
                requestAnimationFrame(() => {
                    this.removeLastGuess();
                });
            } else if (key === 'Enter') {
                requestAnimationFrame(() => {
                    this.submitGuess();
                });
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        this.eventListeners.set('keydown', handleKeyDown);
        
        this.setupControlButton('submit-guess', () => this.submitGuess());
        this.setupControlButton('clear-guess', () => this.clearGuess());
        this.setupControlButton('new-game', () => this.newGame());
        
        const optionContainer = document.querySelector('.option-buttons') || document.querySelector('.game-options');
        if (optionContainer) {
            const handleOptionClick = (e) => {
                const optionBtn = e.target.closest('.option-button');
                if (optionBtn) {
                    e.stopPropagation();
                    const mode = optionBtn.dataset.mode;
                    this.setGameMode(mode);
                }
            };
            optionContainer.addEventListener('click', handleOptionClick);
            this.eventListeners.set('options-click', handleOptionClick);
        }
        
        const attemptsInput = document.getElementById('attempts-input');
        if (attemptsInput) {
            const handleAttemptsChange = (e) => {
                this.maxAttempts = parseInt(e.target.value) || 10;
                this.updateUI();
            };
            attemptsInput.addEventListener('change', handleAttemptsChange);
            this.eventListeners.set('attempts-change', handleAttemptsChange);
        }
        
        const customCodeInput = document.getElementById('custom-code');
        if (customCodeInput) {
            // Don't replace this element or it loses focus/value
            const handleCustomCodeInput = (e) => {
                const code = e.target.value.replace(/[^0-7]/g, '');
                e.target.value = code;
                if (code.length === 4) {
                    this.secretCode = code.split('').map(Number);
                    console.log('Custom code set:', this.secretCode);
                }
            };
            
            // Remove any existing listener first
            customCodeInput.removeEventListener('input', handleCustomCodeInput);
            customCodeInput.addEventListener('input', handleCustomCodeInput);
            this.eventListeners.set('custom-code-input', handleCustomCodeInput);
            
            // Also handle custom mode activation
            const handleCustomMode = () => {
                console.log('Custom mode activated');
                // Enable the input
                customCodeInput.disabled = false;
                customCodeInput.focus();
            };
            
            // Find custom mode button and add handler
            const customModeBtn = document.querySelector('.option-button[data-mode="custom"]');
            if (customModeBtn) {
                customModeBtn.addEventListener('click', handleCustomMode);
                this.eventListeners.set('custom-mode-click', handleCustomMode);
            }
        }
    }

    replaceInteractiveElements() {
        console.log('Replacing interactive elements to remove old listeners');
        
        // List of elements to replace
        const elementsToReplace = [
            'color-palette',
            'submit-guess',
            'clear-guess',
            'new-game',
            'attempts-input',
            'custom-code'
        ];
        
        elementsToReplace.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            }
        });
        
        // Also replace option buttons
        document.querySelectorAll('.option-button').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        // Also replace code slots
        this.createCodeSlots();
    }

    setupControlButton(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        // Create a new handler with debouncing
        let lastClick = 0;
        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Debounce: prevent clicks within 300ms
            const now = Date.now();
            if (now - lastClick < 300) return;
            lastClick = now;
            
            // Visual feedback
            button.style.pointerEvents = 'none';
            setTimeout(() => {
                button.style.pointerEvents = '';
            }, 300);
            
            handler();
        };
        
        button.addEventListener('click', handleClick);
        this.eventListeners.set(`${buttonId}-click`, handleClick);
    }

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
        // Prevent rapid double inputs
        const now = Date.now();
        if (now - this.lastInputTime < this.inputCooldown) {
            console.log('⏸️ Input too fast, skipping');
            return;
        }
        
        // Also prevent same value being added twice in quick succession
        if (value === this.lastKeyPressed && now - this.lastKeyTime < 500) {
            console.log('⏸️ Same key pressed too quickly');
            return;
        }
        
        console.log(`➕ Adding value ${value} to guess`);
        
        // Track this input
        this.lastInputTime = now;
        this.lastKeyPressed = value;
        this.lastKeyTime = now;
        
        // Find first empty slot
        const emptySlot = this.currentGuess.indexOf(-1);
        if (emptySlot !== -1) {
            this.currentGuess[emptySlot] = value;
            console.log('Updated guess array:', this.currentGuess);
            this.updateCodeSlots();
        } else {
            console.log('No empty slots available');
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

    createCodeSlots() {
        const slots = document.getElementById('code-slots');
        if (!slots) {
            console.error('No code-slots element found!');
            return;
        }
        
        slots.innerHTML = '';
        this.currentGuess = [];
        
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'code-slot cyber-slot';
            slot.dataset.index = i;
            slot.dataset.value = '-1';
            
            const content = document.createElement('div');
            content.className = 'slot-content';
            
            // Create glow element
            const glow = document.createElement('div');
            glow.className = 'slot-glow';
            
            slot.appendChild(content);
            slot.appendChild(glow);
            
            // Use a direct event listener
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearSlot(i);
            });
            
            slots.appendChild(slot);
            this.currentGuess.push(-1);
        }
        
        this.updateCodeSlots();
        console.log('Created code slots:', this.currentGuess);
    }

    testWasmLogic() {
        if (!this.wasmAPI || !this.gamePtr) {
            console.log('WASM not available for testing');
            return;
        }
        
        console.group('🧪 Testing WASM Logic');
        
        // Test 1: Create a fresh game with known code
        const testCode = "0123";
        this.wasmAPI.newCustomGame(this.gamePtr, testCode);
        
        // Test 2: Check different guesses
        const testCases = [
            { guess: [0, 1, 2, 3], expected: "4,0" },
            { guess: [0, 1, 2, 4], expected: "3,0" },
            { guess: [4, 5, 6, 7], expected: "0,0" },
            { guess: [1, 0, 2, 3], expected: "2,2" }
        ];
        
        testCases.forEach((test, i) => {
            console.log(`Test ${i + 1}: Guess ${test.guess} against ${testCode}`);
            const result = this.wasmAPI.checkGuess(this.gamePtr, test.guess);
            console.log(`  Result: ${result}, Expected: ${test.expected}`);
            console.log(`  Match: ${result === test.expected ? '✅' : '❌'}`);
        });
        
        console.groupEnd();
    }

   async loadWasmModule() {
        try {
            console.log('Attempting to load WebAssembly module...');
            
            const wasmUrl = './public/wasm/mastermind_wasm.js';
            
            // Try to fetch the file
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
            
            // Load WebAssembly module
            this.wasmModule = await this.loadWasm(wasmUrl);
            
            if (!this.wasmModule) {
                throw new Error('WASM module loaded but is null');
            }
            
            console.log('WebAssembly module loaded successfully');
            
            // Wrap C functions
            this.wasmAPI = {
                create: this.wasmModule.cwrap('mastermind_create', 'number', []),
                destroy: this.wasmModule.cwrap('mastermind_destroy', null, ['number']),
                newRandomGame: this.wasmModule.cwrap('mastermind_new_random_game', null, ['number']),
                newCustomGame: this.wasmModule.cwrap('mastermind_new_custom_game', null, ['number', 'string']),
                checkGuess: (gamePtr, guessArray) => {
                    const guessStr = guessArray.join('');
                    return this.wasmModule.ccall('mastermind_check_guess', 
                        'string', ['number', 'string'], [gamePtr, guessStr]);
                },
                getSecretCode: this.wasmModule.cwrap('mastermind_get_secret_code', 'string', ['number']),
                getAttempts: this.wasmModule.cwrap('mastermind_get_attempts', 'number', ['number']),
                isGameOver: this.wasmModule.cwrap('mastermind_is_game_over', 'number', ['number', 'number']),
                // Optional: keep debug for manual testing but don't auto-run
                debugState: this.wasmModule._mastermind_debug_state ? 
                    this.wasmModule.cwrap('mastermind_debug_state', 'string', ['number']) : null
            };
            
            // Create game instance
            this.gamePtr = this.wasmAPI.create();
            
            console.log('✅ WASM API created');
            
            this.updateStatus('WASM_MODULE_LOADED');            
        } catch (error) {
            console.error('Failed to load WebAssembly module:', error);
            this.updateStatus('ERROR: WASM_MODULE_FAILED');
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
        
        console.log(`Starting new game in ${mode} mode`);
        
        if (mode === 'custom') {
            const customInput = document.getElementById('custom-code');
            const customCode = customInput?.value || '';
            
            if (customCode && customCode.length === 4) {
                console.log(`Using custom code: ${customCode}`);
                
                if (this.gamePtr && this.wasmAPI) {
                    this.wasmAPI.newCustomGame(this.gamePtr, customCode);
                    this.secretCode = this.wasmAPI.getSecretCode(this.gamePtr).split('').map(Number);
                } else {
                    this.secretCode = customCode.split('').map(Number);
                }
                
                this.gameActive = true;
                this.updateStatus('CUSTOM_CODE_ACTIVE');
                
                // Clear and show confirmation message
                this.clearGameLog();
                this.addToLog(`> CUSTOM CODE CONFIRMED`);
                this.addToLog(`> GAME STARTED`);
                this.addToLog(`> ATTEMPTS: ${this.maxAttempts}`);
                this.addToLog(`> BREAK THE CODE!`);
                
            } else {
                // No valid code yet - show instructions
                this.gameActive = false;
                this.updateStatus('AWAITING_CUSTOM_CODE');
                
                this.clearGameLog();
                this.addToLog('> CUSTOM MODE SELECTED');
                this.addToLog('> ENTER 4-DIGIT CODE (0-7)');
                this.addToLog('> PRESS ENTER TO CONFIRM');
                
                if (customInput) {
                    customInput.focus();
                    customInput.select();
                    
                    // Set up Enter key handler
                    if (this.customCodeEnterHandler) {
                        customInput.removeEventListener('keydown', this.customCodeEnterHandler);
                    }
                    
                    this.customCodeEnterHandler = (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            
                            if (customInput.value.length === 4) {
                                // Remove handler to prevent multiple binds
                                customInput.removeEventListener('keydown', this.customCodeEnterHandler);
                                this.customCodeEnterHandler = null;
                                
                                // Start the game
                                setTimeout(() => {
                                    this.newGame();
                                }, 50);
                            } else {
                                this.addToLog('> ERROR: CODE MUST BE 4 DIGITS');
                                this.addToLog('> TRY AGAIN');
                            }
                        }
                    };
                    
                    customInput.addEventListener('keydown', this.customCodeEnterHandler);
                }
                
                return;
            }
        } else {
            // Random mode
            if (this.gamePtr && this.wasmAPI) {
                this.wasmAPI.newRandomGame(this.gamePtr);
                this.secretCode = this.wasmAPI.getSecretCode(this.gamePtr).split('').map(Number);
            } else {
                this.secretCode = this.generateRandomCode();
            }
            
            this.gameActive = true;
            this.updateStatus('RANDOM_CODE_GENERATED');
            
            this.clearGameLog();
            this.addToLog(`> RANDOM CODE GENERATED`);
            this.addToLog(`> GAME STARTED`);
            this.addToLog(`> ATTEMPTS: ${this.maxAttempts}`);
            this.addToLog(`> BREAK THE CODE!`);
        }
        
        // Reset UI
        if (this.gameActive) {
            this.createCodeSlots();
            
            const historyElement = document.getElementById('guess-history');
            if (historyElement) historyElement.innerHTML = '';
            
            const attemptsCount = document.getElementById('attempts-count');
            if (attemptsCount) attemptsCount.textContent = this.maxAttempts;
        }
    }

    clearGameLog() {
        const log = document.getElementById('game-log');
        if (log) {
            log.innerHTML = `
                <div class="log-entry system">> MASTERMIND.EXE v2.0</div>
                <div class="log-entry system">> CODE BREAKING PROTOCOL</div>
            `;
        }
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
        console.log(`Updating ${slots.length} code slots`);
        
        slots.forEach((slot, index) => {
            const value = this.currentGuess[index];
            const contentElement = slot.querySelector('.slot-content');
            
            if (!contentElement) {
                console.error(`No content element in slot ${index}`);
                return;
            }
            
            if (value !== -1 && value !== undefined) {
                // Update the slot
                slot.dataset.value = value;
                slot.classList.add('filled', 'active');
                
                contentElement.textContent = value;
                
                // Set the color
                const colors = [
                    '#00f3ff', '#ff00ff', '#00ff9d', '#b967ff',
                    '#ffff00', '#ff5500', '#00aaff', '#ff0066'
                ];
                const color = colors[value] || '#ffffff';
                
                // Set CSS custom property
                slot.style.setProperty('--slot-color', color);
                
                // Set background
                slot.style.background = color;
                
                // Set text color for contrast
                const textColor = this.getTextColorForBackground(color);
                contentElement.style.color = textColor;
                
            } else {
                // Clear the slot - show "?"
                slot.dataset.value = '-1';
                slot.classList.remove('filled', 'active');
                
                contentElement.textContent = '?';
                contentElement.style.color = ''; // Reset text color
                
                // Reset styles
                slot.style.background = 'rgba(0, 243, 255, 0.1)';
                slot.style.setProperty('--slot-color', 'transparent');
                
                // Ensure question mark is visible
                contentElement.style.opacity = '1';
            }
        });
    }

    showDebugInfo() {
        if (!window.location.hostname.includes('localhost') && 
            !window.location.hostname.includes('127.0.0.1')) {
            return; // Don't show debug in production
        }
        let debugPanel = document.getElementById('mastermind-debug');
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'mastermind-debug';
            debugPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.95);
                color: #0f0;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                border: 2px solid #0f0;
                border-radius: 5px;
                z-index: 9999;
                max-width: 350px;
                max-height: 500px;
                overflow: auto;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
                backdrop-filter: blur(5px);
            `;
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: transparent;
                color: #f00;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0 5px;
            `;
            closeBtn.onclick = () => debugPanel.remove();
            debugPanel.appendChild(closeBtn);
            
            document.body.appendChild(debugPanel);
        }
        
        // Update content
        const info = `
            <h4 style="margin:0 0 10px 0;color:#0ff;border-bottom:1px solid #0ff;padding-bottom:5px;">
                🔍 Mastermind Debug
            </h4>
            <div><strong>Game State:</strong> ${this.gameActive ? 'ACTIVE' : 'INACTIVE'}</div>
            <div><strong>Current Guess:</strong> ${JSON.stringify(this.currentGuess)}</div>
            <div><strong>Secret Code:</strong> ${JSON.stringify(this.secretCode)}</div>
            <div><strong>Attempt:</strong> ${this.currentAttempt}/${this.maxAttempts}</div>
            <div><strong>WASM Loaded:</strong> ${!!this.wasmModule ? '✅' : '❌'}</div>
            <div><strong>Game Mode:</strong> ${document.querySelector('.option-button.active')?.dataset.mode || 'random'}</div>
            <hr style="border:none;border-top:1px solid #333;margin:10px 0;">
            <div style="color:#ff0;"><strong>Last Action:</strong></div>
            <div id="debug-log" style="font-size:11px;margin-top:5px;"></div>
        `;
        
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = info;
        
        // Replace old content (but keep close button)
        const oldContent = debugPanel.querySelector('div:not(button)');
        if (oldContent) oldContent.remove();
        
        // Insert after close button
        debugPanel.insertBefore(contentDiv, debugPanel.children[1]);
    }

    getTextColorForBackground(backgroundColor) {
        // Convert hex to RGB
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    async submitGuess() {
        if (!this.gameActive) return;
        
        // Check if guess is complete
        if (this.currentGuess.includes(-1)) {
            this.addToLog('> ERROR: INCOMPLETE_GUESS');
            return;
        }
        
        console.log('=== SUBMITTING GUESS ===');
        console.log('Guess:', this.currentGuess);
        console.log('Current attempt BEFORE:', this.currentAttempt);
        
        // DON'T increment here yet - let WASM or feedback logic handle it
        
        let feedback;
        if (this.gamePtr && this.wasmAPI) {
            console.log('Using WebAssembly for feedback');
            
            try {
                const guessStr = this.currentGuess.join('');
                const feedbackStr = this.wasmAPI.checkGuess(this.gamePtr, this.currentGuess);
                console.log('WASM feedback:', feedbackStr);
                
                const parts = feedbackStr.split(',');
                const correct = parseInt(parts[0]);
                const misplaced = parseInt(parts[1]);
                
                feedback = { correct, misplaced };
                
                // Get current attempts from WASM
                this.currentAttempt = this.wasmAPI.getAttempts(this.gamePtr);
                console.log('Attempts from WASM:', this.currentAttempt);
                
            } catch (wasmError) {
                console.error('WASM failed:', wasmError);
                feedback = this.calculateFeedback(this.currentGuess, this.secretCode);
                this.currentAttempt++; // Only increment here for JS fallback
            }
        } else {
            console.log('Using JavaScript for feedback');
            feedback = this.calculateFeedback(this.currentGuess, this.secretCode);
            this.currentAttempt++; // Increment for JS fallback
        }
        
        console.log('Current attempt AFTER:', this.currentAttempt);
        
        this.addToHistory(this.currentGuess, feedback);
        this.addToLog(`> ATTEMPT ${this.currentAttempt}: ${this.currentGuess.join('')}`);
        this.addToLog(`> FEEDBACK: ${feedback.correct} correct, ${feedback.misplaced} misplaced`);
        
        // Check win condition FIRST
        if (feedback.correct === 4) {
            this.gameWin();
            return; // Don't continue if won
        }
        
        // Then check lose condition
        if (this.currentAttempt >= this.maxAttempts) {
            this.gameLose();
            return;
        }
        
        // Reset for next guess
        this.clearGuess();
        
        // Update attempts counter
        const attemptsCount = document.getElementById('attempts-count');
        if (attemptsCount) {
            attemptsCount.textContent = this.maxAttempts - this.currentAttempt;
        }
    }

    // calculateFeedback(guess, secret) {
    //     if (!guess || !secret || guess.length !== 4 || secret.length !== 4) {
    //         console.error('Invalid input to calculateFeedback:', { guess, secret });
    //         return { correct: 0, misplaced: 0 };
    //     }
        
    //     let correct = 0;
    //     let misplaced = 0;
        
    //     // Create copies to mark used positions
    //     const guessCopy = [...guess];
    //     const secretCopy = [...secret];
        
    //     // First pass: count correct positions
    //     for (let i = 0; i < 4; i++) {
    //         if (guessCopy[i] === secretCopy[i]) {
    //             correct++;
    //             guessCopy[i] = -1; // Mark as used
    //             secretCopy[i] = -2; // Mark as used
    //         }
    //     }
        
    //     // Second pass: count misplaced
    //     for (let i = 0; i < 4; i++) {
    //         if (guessCopy[i] !== -1) { // Not already counted as correct
    //             const matchIndex = secretCopy.indexOf(guessCopy[i]);
    //             if (matchIndex !== -1 && secretCopy[matchIndex] !== -2) { // Found and not used
    //                 misplaced++;
    //                 secretCopy[matchIndex] = -2; // Mark as used
    //             }
    //         }
    //     }
        
    //     console.log(`Feedback calculation: guess=${guess}, secret=${secret}, result={correct:${correct}, misplaced:${misplaced}}`);
        
    //     return { correct, misplaced };
    // }
    calculateFeedback(guess, secret) {
        if (!guess || !secret || guess.length !== 4 || secret.length !== 4) {
            console.error('Invalid input to calculateFeedback:', { guess, secret });
            return { correct: 0, misplaced: 0 };
        }
        
        let correct = 0;
        let misplaced = 0;
        
        // Create tracking arrays
        const secretChecked = new Array(4).fill(false);
        const guessChecked = new Array(4).fill(false);
        
        // Count exact matches (correct position)
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secret[i]) {
                correct++;
                secretChecked[i] = true;  // Mark this position as used
                guessChecked[i] = true;   // Mark this position as used
            }
        }
        
        // Count misplaced (correct number, wrong position)
        for (let i = 0; i < 4; i++) {
            if (!guessChecked[i]) {  // Skip if already counted as correct
                for (let j = 0; j < 4; j++) {
                    // Check if this secret position hasn't been used AND matches the guess
                    if (!secretChecked[j] && guess[i] === secret[j]) {
                        misplaced++;
                        secretChecked[j] = true;  // Mark this secret position as used
                        guessChecked[i] = true;   // Mark this guess position as used
                        break;  // Found a match, move to next guess
                    }
                }
            }
        }
        
        console.log(`Feedback: Secret=${secret}, Guess=${guess}, Result: ${correct} correct, ${misplaced} misplaced`);
        
        return { correct, misplaced };
    }

    // addToHistory(guess, feedback) {
    //     const history = document.getElementById('guess-history');
    //     const historyItem = document.createElement('div');
    //     historyItem.className = 'history-item';
        
    //     // Create guess display
    //     const guessDisplay = document.createElement('div');
    //     guessDisplay.className = 'history-guess';
    //     guess.forEach(value => {
    //         const digit = document.createElement('span');
    //         digit.className = 'history-digit';
    //         digit.textContent = value;
    //         digit.style.background = this.getColorForDigit(value);
    //         guessDisplay.appendChild(digit);
    //     });
        
    //     // Create feedback display
    //     const feedbackDisplay = document.createElement('div');
    //     feedbackDisplay.className = 'history-feedback';
    //     for (let i = 0; i < feedback.correct; i++) {
    //         const dot = document.createElement('span');
    //         dot.className = 'feedback-dot correct';
    //         feedbackDisplay.appendChild(dot);
    //     }
    //     for (let i = 0; i < feedback.misplaced; i++) {
    //         const dot = document.createElement('span');
    //         dot.className = 'feedback-dot misplaced';
    //         feedbackDisplay.appendChild(dot);
    //     }
        
    //     historyItem.appendChild(guessDisplay);
    //     historyItem.appendChild(feedbackDisplay);
    //     history.appendChild(historyItem);
        
    //     // Scroll to bottom
    //     history.scrollTop = history.scrollHeight;
    // }

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
        
        // DEBUG: Log what feedback we're getting
        console.log(`Feedback for guess ${guess}: correct=${feedback.correct}, misplaced=${feedback.misplaced}`);
        
        for (let i = 0; i < feedback.correct; i++) {
            const dot = document.createElement('span');
            dot.className = 'feedback-dot correct';
            feedbackDisplay.appendChild(dot);
            console.log(`  Added correct dot #${i+1}`);
        }
        
        for (let i = 0; i < feedback.misplaced; i++) {
            const dot = document.createElement('span');
            dot.className = 'feedback-dot misplaced';
            feedbackDisplay.appendChild(dot);
            console.log(`  Added misplaced dot #${i+1}`);
        }
        
        const totalFeedbackDots = feedback.correct + feedback.misplaced;
        for (let i = totalFeedbackDots; i < 4; i++) {
            const empty = document.createElement('span');
            empty.className = 'feedback-dot empty';
            empty.style.opacity = '0.3';
            feedbackDisplay.appendChild(empty);
            console.log(`  Added empty placeholder #${i+1}`);
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
        this.updateStatus('VICTORY_PROTOCOL_ACTIVATED');
        
        this.clearGameLog();
        
        this.addToLog('■■■■■■■■■■■■ SUCCESS: CODE CRACKED ■■■■■■■■■■■■');
        this.addToLog('');
        this.addToLog(`> SECRET CODE: ${this.secretCode.join('')}`);
        this.addToLog(`> ATTEMPTS: ${this.currentAttempt}/${this.maxAttempts}`);
        this.addToLog('');
        this.addToLog('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
        
        document.querySelector('.mastermind-terminal').classList.add('victory');
    }

    gameLose() {
        this.gameActive = false;
        this.updateStatus('SYSTEM_FAILURE');
        
        this.clearGameLog();
        
        this.addToLog('▓▓▓▓▓▓▓▓▓▓▓▓▓ ERROR: SYSTEM FAILURE ▓▓▓▓▓▓▓▓▓▓▓▓');
        this.addToLog('');
        this.addToLog(`> FINAL CODE: ${this.secretCode.join('')}`);
        this.addToLog(`> ATTEMPTS: ${this.currentAttempt}`);
        this.addToLog('');
        this.addToLog('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
        
        this.revealSecretCode();
        document.querySelector('.mastermind-terminal').classList.add('game-over');
    }

    setGameMode(mode) {
        console.log(`Setting game mode to: ${mode}`);
        
        // Update active button
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Show/hide custom code input
        const customGroup = document.querySelector('.custom-code-group');
        if (customGroup) {
            customGroup.style.display = mode === 'custom' ? 'block' : 'none';
        }
        
        // If switching to custom mode, focus the input
        if (mode === 'custom') {
            const customInput = document.getElementById('custom-code');
            if (customInput) {
                setTimeout(() => {
                    customInput.focus();
                    customInput.select();
                }, 100);
            }
        }
        
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

    refreshUI() {
        console.log('Refreshing Mastermind UI');
        
        // Force recreate all UI elements
        this.setupUI();
        
        // Reset game state before starting new game
        this.currentGuess = [];
        this.currentAttempt = 0;
        this.gameActive = false;

        this.clearGameLog();
        
        // Clear guess history
        const historyElement = document.getElementById('guess-history');
        if (historyElement) {
            historyElement.innerHTML = '';
        }
        
        // Reset attempts display
        const attemptsCount = document.getElementById('attempts-count');
        if (attemptsCount) {
            attemptsCount.textContent = this.maxAttempts;
        }
        
        this.newGame();
        console.log('UI refreshed and new game started');
    }

    revealSecretCode() {
        console.log('Revealing secret code:', this.secretCode);
        
        // Update the secret code display
        const codeDisplay = document.querySelector('.secret-code-display') || 
                            document.getElementById('secret-code-display');
        
        if (codeDisplay) {
            codeDisplay.innerHTML = '';
            
            this.secretCode.forEach((digit, i) => {
                const peg = document.createElement('div');
                peg.className = `code-peg digit-${digit}`;
                peg.textContent = digit;
                
                const colors = [
                    '#00f3ff', '#ff00ff', '#00ff9d', '#b967ff',
                    '#ffff00', '#ff5500', '#00aaff', '#ff0066'
                ];
                peg.style.background = colors[digit] || '#ffffff';
                peg.style.color = this.getTextColorForBackground(colors[digit]);
                
                codeDisplay.appendChild(peg);
            });
        }
        
        this.addToLog(`> SECRET CODE: ${this.secretCode.join('')}`);
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