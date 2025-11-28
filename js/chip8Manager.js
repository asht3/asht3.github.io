// export class Chip8Manager {
//     constructor() {
//         this.module = null;
//         this.isRunning = false;
//         this.isPaused = false;
//         this.canvas = null;
//         this.ctx = null;
//         this.init();
//     }

//     async init() {
//         // Initialize canvas context
//         this.canvas = document.getElementById('chip8-canvas');
//         this.ctx = this.canvas.getContext('2d');
        
//         // Set up event listeners
//         this.setupEventListeners();
        
//         // Load WebAssembly module
//         await this.loadWasmModule();
//     }

//     setupEventListeners() {
//         // ROM selection
//         document.getElementById('chip8-rom-select')?.addEventListener('change', (e) => {
//             if (e.target.value) {
//                 this.loadRom(e.target.value);
//             }
//         });

//         // Control buttons
//         document.getElementById('chip8-load')?.addEventListener('click', () => {
//             this.loadRomDialog();
//         });

//         document.getElementById('chip8-pause')?.addEventListener('click', () => {
//             this.togglePause();
//         });

//         document.getElementById('chip8-reset')?.addEventListener('click', () => {
//             this.reset();
//         });

//         // Keyboard input
//         document.addEventListener('keydown', (e) => this.handleKeyDown(e));
//         document.addEventListener('keyup', (e) => this.handleKeyUp(e));
//     }

//     async loadWasmModule() {
//         try {
//             // Load your compiled WebAssembly module
//             this.module = await import('../wasm/chip8.js');
            
//             // Initialize the module
//             await this.module.default();
            
//             this.updateStatus('WASM MODULE LOADED - READY');
//             console.log('CHIP-8 WebAssembly module loaded successfully');
//         } catch (error) {
//             console.error('Failed to load CHIP-8 WebAssembly module:', error);
//             this.updateStatus('ERROR: WASM MODULE FAILED TO LOAD');
//         }
//     }

//     async loadRom(romName) {
//         if (!this.module) {
//             this.updateStatus('ERROR: WASM MODULE NOT LOADED');
//             return;
//         }

//         try {
//             this.updateStatus(`LOADING ROM: ${romName}`);
            
//             // Fetch the ROM file
//             const response = await fetch(`roms/${romName}.ch8`);
//             const buffer = await response.arrayBuffer();
            
//             // Load ROM into WebAssembly memory
//             const romData = new Uint8Array(buffer);
//             this.module.load_rom(romData, romData.length);
            
//             // Start emulation
//             this.start();
            
//         } catch (error) {
//             console.error('Failed to load ROM:', error);
//             this.updateStatus(`ERROR LOADING ROM: ${romName}`);
//         }
//     }

//     loadRomDialog() {
//         // Create file input for custom ROM loading
//         const input = document.createElement('input');
//         input.type = 'file';
//         input.accept = '.ch8,.rom';
//         input.onchange = (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 this.loadCustomRom(file);
//             }
//         };
//         input.click();
//     }

//     async loadCustomRom(file) {
//         try {
//             this.updateStatus(`LOADING: ${file.name}`);
//             const buffer = await file.arrayBuffer();
//             const romData = new Uint8Array(buffer);
            
//             if (this.module) {
//                 this.module.load_rom(romData, romData.length);
//                 this.start();
//             }
//         } catch (error) {
//             console.error('Failed to load custom ROM:', error);
//             this.updateStatus('ERROR LOADING CUSTOM ROM');
//         }
//     }

//     start() {
//         if (!this.isRunning && this.module) {
//             this.isRunning = true;
//             this.isPaused = false;
//             this.updateStatus('RUNNING');
//             this.emulationLoop();
//         }
//     }

//     togglePause() {
//         this.isPaused = !this.isPaused;
//         this.updateStatus(this.isPaused ? 'PAUSED' : 'RUNNING');
//     }

//     reset() {
//         if (this.module) {
//             this.module.reset();
//             this.isPaused = false;
//             this.updateStatus('RESET - READY');
//             this.clearDisplay();
//         }
//     }

//     emulationLoop() {
//         if (!this.isRunning || this.isPaused || !this.module) return;

//         // Emulate one cycle
//         this.module.emulate_cycle();

//         // Update display if needed
//         if (this.module.should_draw()) {
//             this.updateDisplay();
//         }

//         // Continue loop
//         requestAnimationFrame(() => this.emulationLoop());
//     }

//     updateDisplay() {
//         if (!this.module || !this.canvas) return;

//         // Get display buffer from WebAssembly
//         const displayBuffer = this.module.get_display_buffer();
//         const width = this.module.get_display_width();
//         const height = this.module.get_display_height();

//         // Create ImageData from buffer
//         const imageData = new ImageData(width, height);
        
//         // Convert CHIP-8 display to canvas (1-bit to RGBA)
//         for (let i = 0; i < displayBuffer.length; i++) {
//             const pixel = displayBuffer[i];
//             const baseIndex = i * 4;
            
//             if (pixel) {
//                 // Pixel on - neon green (classic CHIP-8)
//                 imageData.data[baseIndex] = 0;     // R
//                 imageData.data[baseIndex + 1] = 255; // G
//                 imageData.data[baseIndex + 2] = 0;   // B
//                 imageData.data[baseIndex + 3] = 255; // A
//             } else {
//                 // Pixel off - black
//                 imageData.data[baseIndex] = 0;
//                 imageData.data[baseIndex + 1] = 0;
//                 imageData.data[baseIndex + 2] = 0;
//                 imageData.data[baseIndex + 3] = 255;
//             }
//         }

//         // Scale and draw to canvas
//         this.ctx.putImageData(imageData, 0, 0);
//     }

//     clearDisplay() {
//         if (this.ctx) {
//             this.ctx.fillStyle = '#000';
//             this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//         }
//     }

//     // handleKeyDown(event) {
//     //     if (!this.module) return;
        
//     //     const keyMap = this.getKeyMap(event.key);
//     //     if (keyMap !== -1) {
//     //         this.module.key_down(keyMap);
//     //         event.preventDefault();
//     //     }
//     // }

//     // handleKeyUp(event) {
//     //     if (!this.module) return;
        
//     //     const keyMap = this.getKeyMap(event.key);
//     //     if (keyMap !== -1) {
//     //         this.module.key_up(keyMap);
//     //         event.preventDefault();
//     //     }
//     // }

//     // getKeyMap(key) {
//     //     const keyMapping = {
//     //         '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
//     //         'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
//     //         'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
//     //         'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
//     //     };
        
//     //     return keyMapping[key.toLowerCase()] ?? -1;
//     // }

//     updateStatus(message) {
//         const statusElement = document.getElementById('chip8-status');
//         if (statusElement) {
//             statusElement.textContent = `STATUS: ${message}`;
//         }
//     }

//     destroy() {
//         this.isRunning = false;
//         this.isPaused = false;
//         // Clean up WebAssembly resources if needed
//     }
// }

export class Chip8Manager {
    constructor() {
        this.module = null;
        this.isRunning = false;
        this.isPaused = false;
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    async init() {
        // Initialize canvas context
        this.canvas = document.getElementById('chip8-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set up event listeners (excluding key handling)
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

        document.getElementById('chip8-reset')?.addEventListener('click', () => {
            this.reset();
        });

        // Let C++ handle keyboard input directly via SDL or your existing input system
        // No JavaScript key listeners needed if C++ handles input
    }

    async loadWasmModule() {
        try {
            // Load your compiled WebAssembly module
            this.module = await import('../wasm/chip8.js');
            
            // Initialize the module
            await this.module.default();
            
            this.updateStatus('WASM MODULE LOADED - READY');
            console.log('CHIP-8 WebAssembly module loaded successfully');
        } catch (error) {
            console.error('Failed to load CHIP-8 WebAssembly module:', error);
            this.updateStatus('ERROR: WASM MODULE FAILED TO LOAD');
        }
    }

    async loadRom(romName) {
        if (!this.module) {
            this.updateStatus('ERROR: WASM MODULE NOT LOADED');
            return;
        }

        try {
            this.updateStatus(`LOADING ROM: ${romName}`);
            
            // Fetch the ROM file
            const response = await fetch(`roms/${romName}.ch8`);
            const buffer = await response.arrayBuffer();
            
            // Load ROM into WebAssembly memory
            const romData = new Uint8Array(buffer);
            
            // Call your C++ function to load the ROM
            // This function name should match your C++ export
            this.module.load_rom(romData, romData.length);
            
            // Start emulation
            this.start();
            
        } catch (error) {
            console.error('Failed to load ROM:', error);
            this.updateStatus(`ERROR LOADING ROM: ${romName}`);
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
                // Call your C++ ROM loading function
                this.module.load_rom(romData, romData.length);
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

    reset() {
        if (this.module) {
            // Call your C++ reset function
            this.module.reset();
            this.isPaused = false;
            this.updateStatus('RESET - READY');
            this.clearDisplay();
        }
    }

    emulationLoop() {
        if (!this.isRunning || this.isPaused || !this.module) return;

        // Emulate one cycle - call your C++ function
        this.module.emulate_cycle();

        // Update display if needed - your C++ should have a draw flag
        if (this.module.should_draw()) {
            this.updateDisplay();
        }

        // Continue loop
        requestAnimationFrame(() => this.emulationLoop());
    }

    updateDisplay() {
        if (!this.module || !this.canvas) return;

        // Get display buffer from your C++ code
        const displayBuffer = this.module.get_display_buffer();
        const width = this.module.get_display_width();
        const height = this.module.get_display_height();

        // Create ImageData from buffer
        const imageData = new ImageData(width, height);
        
        // Convert CHIP-8 display to canvas (1-bit to RGBA)
        for (let i = 0; i < displayBuffer.length; i++) {
            const pixel = displayBuffer[i];
            const baseIndex = i * 4;
            
            if (pixel) {
                // Pixel on - use your preferred color (neon green for classic look)
                imageData.data[baseIndex] = 0;     // R
                imageData.data[baseIndex + 1] = 255; // G
                imageData.data[baseIndex + 2] = 0;   // B
                imageData.data[baseIndex + 3] = 255; // A
            } else {
                // Pixel off
                imageData.data[baseIndex] = 0;
                imageData.data[baseIndex + 1] = 0;
                imageData.data[baseIndex + 2] = 0;
                imageData.data[baseIndex + 3] = 255;
            }
        }

        // Draw to canvas
        this.ctx.putImageData(imageData, 0, 0);
    }

    clearDisplay() {
        if (this.ctx) {
            this.ctx.fillStyle = '#000';
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
        // Clean up WebAssembly resources if needed
    }
}