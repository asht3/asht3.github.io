export class Chip8Manager {
    constructor() {
        this.module = null;
        this.isRunning = false;
        this.isPaused = false;
        this.canvas = null;
        this.ctx = null;
        this.romBasePath = '../chip8/roms/';
        this.init();
    }

    async init() {
        // Initialize canvas context
        this.canvas = document.getElementById('chip8-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Clear canvas initially
        this.clearDisplay();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load WebAssembly module
        await this.loadWasmModule();
    }

    setupEventListeners() {
        // ROM selection
        document.getElementById('chip8-rom-select')?.addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadRom(e.target.value);
            }
        });

        // Control buttons
        document.getElementById('chip8-load')?.addEventListener('click', () => {
            this.loadRomDialog();
        });

        document.getElementById('chip8-pause')?.addEventListener('click', () => {
            this.togglePause();
        });

        // Keyboard input for CHIP-8
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Ensure the canvas can receive focus if needed
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.addEventListener('click', () => {
            this.canvas.focus();
        });
    }

    async loadWasmModule() {
        try {
            this.module = await import('../chip8/wasm/chip8.js');
            
            // Initialize the module and wait for it to be ready
            const instance = await this.module.default();
            
            // The functions are on the instance, not the module
            this.instance = instance;
            
            // Log ALL properties to see what's available
            console.log('All instance properties:', Object.keys(instance));
            const relevantFunctions = Object.keys(instance).filter(key => 
                key.includes('load') || 
                key.includes('rom') || 
                key.includes('emulate') || 
                key.includes('draw') ||
                key.includes('display') ||
                key.includes('key')
            );
            console.log('Relevant functions:', relevantFunctions);
            
            this.updateStatus('WASM MODULE LOADED - READY');
        } catch (error) {
            console.error('Failed to load CHIP-8 WebAssembly module:', error);
            this.updateStatus('ERROR: WASM MODULE FAILED TO LOAD');
        }
    }

    async loadRom(romName) {
        if (!this.instance) {
            this.updateStatus('ERROR: WASM INSTANCE NOT LOADED');
            return;
        }

        try {
            this.updateStatus(`LOADING ROM: ${romName}`);
            
            const romPath = `${this.romBasePath}${romName}.ch8`;
            console.log('Loading ROM from:', romPath);
            
            const response = await fetch(romPath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const buffer = await response.arrayBuffer();
            console.log('ROM loaded, size:', buffer.byteLength, 'bytes');
            
            const romData = new Uint8Array(buffer);
            
            // Allocate memory in WebAssembly and copy the ROM data
            const romDataPtr = this.instance._malloc(romData.length);
            this.instance.HEAPU8.set(romData, romDataPtr);
            
            console.log('Calling _load_rom with allocated memory');
            this.instance._load_rom(romDataPtr, romData.length);
            
            // Free the memory after use
            this.instance._free(romDataPtr);
            
            this.start();
            
        } catch (error) {
            console.error('Failed to load ROM:', error);
            this.updateStatus(`ERROR: ${error.message}`);
        }
    }

    loadRomDialog() {
        // Create file input for custom ROM loading
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ch8,.rom';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadCustomRom(file);
            }
        };
        input.click();
    }

    async loadCustomRom(file) {
        try {
            this.updateStatus(`LOADING: ${file.name}`);
            const buffer = await file.arrayBuffer();
            const romData = new Uint8Array(buffer);
            
            if (this.module) {
                if (this.module._load_rom) {
                    this.module._load_rom(romData, romData.length);
                } else if (this.module.load_rom) {
                    this.module.load_rom(romData, romData.length);
                }
                this.start();
            }
        } catch (error) {
            console.error('Failed to load custom ROM:', error);
            this.updateStatus('ERROR LOADING CUSTOM ROM');
        }
    }

    start() {
        if (!this.isRunning && this.module) {
            this.isRunning = true;
            this.isPaused = false;
            this.updateStatus('RUNNING');
            this.emulationLoop();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.updateStatus(this.isPaused ? 'PAUSED' : 'RUNNING');
    }

    emulationLoop() {
        if (!this.isRunning || this.isPaused || !this.instance) return;

        try {
            // Emulate multiple cycles per frame for faster execution
            const cyclesPerFrame = 10; // Adjust this number to control speed
            
            for (let i = 0; i < cyclesPerFrame; i++) {
                this.instance._emulate_cycle();
            }

            let shouldDraw = this.instance._should_draw();
            
            if (shouldDraw) {
                this.updateDisplay();
            }

            setTimeout(() => this.emulationLoop(), 16); // ~60Hz for timer updates

        } catch (error) {
            console.error('Error in emulation loop:', error);
            this.isRunning = false;
            this.updateStatus('EMULATION ERROR');
        }
    }

    updateDisplay() {
        if (!this.instance || !this.canvas) return;

        try {
            console.log('Getting display data...');
            
            // Get the display buffer pointer and dimensions
            const displayBufferPtr = this.instance._get_display_buffer();
            const width = this.instance._get_display_width();
            const height = this.instance._get_display_height();
            
            console.log('Display buffer pointer:', displayBufferPtr);
            console.log('Dimensions:', width, 'x', height);

            if (!displayBufferPtr || !width || !height) {
                console.log('No display data available');
                return;
            }

            // Access the WebAssembly memory to get the actual pixel data
            const displayBuffer = new Uint8Array(this.instance.HEAPU8.buffer, displayBufferPtr, width * height);
            
            console.log('Actual pixel data:', displayBuffer);
            console.log('First few pixels:', Array.from(displayBuffer.slice(0, 10)));

            // Scale up for better visibility
            const scaleX = this.canvas.width / width;
            const scaleY = this.canvas.height / height;

            // Clear canvas
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw pixels
            this.ctx.fillStyle = '#00d9ffff';


            let pixelsDrawn = 0;
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = y * width + x;
                    if (displayBuffer[index] !== 0) { // Check if pixel is non-zero
                        this.ctx.fillRect(
                            x * scaleX,
                            y * scaleY,
                            Math.ceil(scaleX),
                            Math.ceil(scaleY)
                        );
                        pixelsDrawn++;
                    }
                }
            }
            
            console.log('Pixels drawn:', pixelsDrawn);

        } catch (error) {
            console.error('Error updating display:', error);
        }
    }

    handleKeyDown(event) {
        if (!this.instance) return;
        
        const keyMap = this.getKeyMap(event.key);
        console.log('Key down:', event.key, '-> CHIP-8 key:', keyMap);
        
        if (keyMap !== -1) {
            if (this.instance._key_down) {
                this.instance._key_down(keyMap);
            }
            event.preventDefault();
        }
    }

    handleKeyUp(event) {
        if (!this.instance) return;
        
        const keyMap = this.getKeyMap(event.key);
        console.log('Key up:', event.key, '-> CHIP-8 key:', keyMap);
        
        if (keyMap !== -1) {
            if (this.instance._key_up) {
                this.instance._key_up(keyMap);
            }
            event.preventDefault();
        }
    }

    // getKeyMap(key) {
    //     const keyMapping = {
    //         '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
    //         'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
    //         'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
    //         'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
    //     };
        
    //     return keyMapping[key.toLowerCase()] ?? -1;
    // }

    getKeyMap(key) {
        const keyMapping = {            
            '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
            'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
            'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
            'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF,
        };
        
        const mapped = keyMapping[key.toLowerCase()] ?? -1;
        console.log(`Key mapping: "${key}" -> 0x${mapped.toString(16)}`);
        return mapped;
    }

    clearDisplay() {
        if (this.ctx) {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('chip8-status');
        if (statusElement) {
            statusElement.textContent = `STATUS: ${message}`;
        }
    }

    destroy() {
        this.isRunning = false;
        this.isPaused = false;
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}