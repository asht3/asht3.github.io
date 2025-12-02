export const mastermindApp = {
    name: 'Mastermind.exe',
    content: `
        <div class="mastermind-container">
            <div class="mastermind-header">
                <h2>MASTERMIND v2.0</h2>
                <p>CRACK_THE_SECRET_CODE</p>
            </div>

            <div class="mastermind-terminal">
                <div class="terminal-header">
                    <div class="terminal-title">CYBER_TERMINAL</div>
                    <div class="terminal-status" id="game-status">STATUS: READY</div>
                </div>
                
                <div class="status-display" id="game-log">
                    > SYSTEM_INITIALIZED<br>
                    > LOADING_MASTERMIND_PROTOCOL...<br>
                    > ENTER_CODE_SEQUENCE_TO_BEGIN
                </div>

                <div class="game-info">
                    <div class="info-card">
                        <h3>ATTEMPTS</h3>
                        <div class="value" id="attempts-count">10</div>
                    </div>
                    <div class="info-card">
                        <h3>CODE_LENGTH</h3>
                        <div class="value">4</div>
                    </div>
                    <div class="info-card">
                        <h3>COLORS</h3>
                        <div class="value">8</div>
                    </div>
                    <div class="info-card">
                        <h3>SCORE</h3>
                        <div class="value" id="score">0</div>
                    </div>
                </div>

                <div class="color-palette" id="color-palette">
                    <!-- Color options will be generated here -->
                </div>

                <div class="code-input-area">
                    <div class="code-slots" id="code-slots">
                        <!-- Code slots will be generated here -->
                    </div>
                    
                    <div class="input-controls">
                        <button class="cyber-button cyan" id="submit-guess">▶ SUBMIT</button>
                        <button class="cyber-button" id="clear-guess">CLEAR</button>
                        <button class="cyber-button green" id="new-game">NEW GAME</button>
                    </div>
                </div>

                <div class="guess-history" id="guess-history">
                    <!-- Previous guesses will appear here -->
                </div>

                <div class="game-options">
                    <div class="option-group">
                        <label class="option-label">CODE GENERATION:</label>
                        <div class="option-buttons">
                            <button class="option-button active" data-mode="random">RANDOM</button>
                            <button class="option-button" data-mode="custom">CUSTOM</button>
                        </div>
                    </div>
                    <div class="option-group">
                        <label class="option-label">ATTEMPTS:</label>
                        <input type="number" class="cyber-input" id="attempts-input" value="10" min="1" max="20">
                    </div>
                    <div class="option-group custom-code-group" style="display: none;">
                        <label class="option-label">CUSTOM_CODE:</label>
                        <input type="text" class="cyber-input" id="custom-code" placeholder="Enter 4 digits (0-7)" maxlength="4">
                    </div>
                </div>

                <div class="terminal-footer">
                    <div class="hint-display" id="hint-display">
                        > HINT: Use numbers 0-7 or click color palette
                    </div>
                </div>
            </div>

            <div class="mastermind-help">
                <h3>GAME_RULES:</h3>
                <ul>
                    <li>Crack the 4-digit secret code using numbers 0-7</li>
                    <li>After each guess, receive feedback:</li>
                    <li>■ Correct position & number</li>
                    <li>□ Correct number, wrong position</li>
                    <li>You have limited attempts to solve</li>
                </ul>
            </div>
        </div>
    `,
    width: 750,
    height: 600,

    async onOpen(windowElement) {
        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Import and initialize the manager
        const { MastermindManager } = await import('../mastermindManager.js');
        window.mastermindGame = new MastermindManager();
    },
    
    // Add cleanup method
    onClose() {
        if (window.mastermindGame && window.mastermindGame.cleanup) {
            window.mastermindGame.cleanup();
            window.mastermindGame = null;
        }
    }
};