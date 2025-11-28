export const chip8App = {
    name: 'CHIP-8 Emulator',
    content: `
        <div class="chip8-container">
            <div class="chip8-header">
                <h2>CHIP-8 EMULATOR v1.0</h2>
                <div class="chip8-controls">
                    <button id="chip8-load" class="cyber-button">LOAD ROM (COMING SOON)</button>
                    <!-- <button id="chip8-pause" class="cyber-button">PAUSE</button> -->
                    <select id="chip8-rom-select" class="cyber-select">
                        <option value="">Select ROM...</option>
                        <option value="Pong (1 player)">Pong</option>
                        <option value="Space Invaders [David Winter]">Space Invaders</option>
                        <option value="1-chip8-logo">Chip 8 Logo</option>
                        <option value="br8kout">Breakout</option>
                        <option value="2-ibm-logo">IBM Logo</option>
                    </select>
                </div>
            </div>
            
            <div class="chip8-display-container">
                <canvas id="chip8-canvas" width="640" height="320"></canvas>
                <div class="chip8-status" id="chip8-status">
                    STATUS: READY
                </div>
            </div>
            
            <div class="chip8-info">
                <h3>> CONTROLS:</h3>
                <div class="controls-grid">
                    <div>1 2 3 4</div>
                    <div>Q W E R</div>
                    <div>A S D F</div>
                    <div>Z X C V</div>
                </div>
                <div class="chip8-instructions">
                    <p>▶ Use keyboard for CHIP-8 input</p>
                    <p>▶ Load ROM from dropdown or file</p>
                    <p>▶ ESC to exit fullscreen</p>
                </div>
            </div>
        </div>
    `,
    width: 700,
    height: 600
};