export const assetsApp = {
    name: 'Assets & Credits.txt',
    content: `
        <div class="assets-container">
            <div class="assets-header">
                <h2>ASSETS & CREDITS DATABASE</h2>
                <p>External resources used in this system:</p>
            </div>

            <div class="credits-section">
                <h3>> ICON ASSETS</h3>
                <div class="credit-item">
                    <div class="credit-title">GitHub Logo</div>
                    <div class="credit-description">Official GitHub octocat logo</div>
                    <div class="credit-source">Source: GitHub Inc.</div>
                    <div class="credit-license">License: GitHub Terms</div>
                </div>
            </div>

            <div class="credits-section">
                <h3>> PROFILE CHARACTERS</h3>
                <div class="credit-item">
                    <div class="credit-title">Astronaut Character</div>
                    <div class="credit-description">Free astronaut character by <a href="https://itch.io/profile/floatingkites">Fly</a></div>
                    <div class="credit-source">Source: <a href="https://floatingkites.itch.io/cute-astronaut">Itch.io</a></div>
                </div>
            </div>

            <div class="credits-section">
                <h3>> FONT ASSETS</h3>
                <div class="credit-item">
                    <div class="credit-title">Orbitron Font</div>
                    <div class="credit-description">Geometric sans-serif typeface for headlines and technical elements</div>
                    <div class="credit-source">Source: Google Fonts</div>
                    <div class="credit-license">License: Open Font License</div>
                    <div class="credit-link" onclick="window.open('https://fonts.google.com/specimen/Orbitron', '_blank')">▶ VIEW FONT</div>
                </div>
                
                <div class="credit-item">
                    <div class="credit-title">Rajdhani Font</div>
                    <div class="credit-description">Clean, technical sans-serif for body text</div>
                    <div class="credit-source">Source: Google Fonts</div>
                    <div class="credit-license">License: Open Font License</div>
                    <div class="credit-link" onclick="window.open('https://fonts.google.com/specimen/Rajdhani', '_blank')">▶ VIEW FONT</div>
                </div>
            </div>

            <div class="credits-section">
                <h3>> CODE & LIBRARIES</h3>
                <div class="credit-item">
                    <div class="credit-title">WebAssembly (Emscripten)</div>
                    <div class="credit-description">C++ to WebAssembly compilation for CHIP-8 emulator</div>
                    <div class="credit-source">Source: Emscripten Project</div>
                    <div class="credit-license">License: MIT</div>
                </div>
                
                <div class="credit-item">
                    <div class="credit-title">CHIP-8 ROMs</div>
                    <div class="credit-description">Classic CHIP-8 games and demos</div>
                    <div class="credit-source">Source: Public Domain / Various Authors</div>
                    <div class="credit-source">
                        <a href="https://johnearnest.github.io/chip8Archive/?sort=platform">Chip-8 Archive,</a>
                        <a href="https://github.com/Timendus/chip8-test-suite">Chip-8 Test Suite,</a>
                        <a href="https://github.com/kripod/chip8-roms">Roms Repo</a>
                    </div>
                </div>
            </div>

            <div class="assets-footer">
                <div class="legal-notice">
                    ⚠️ ALL ASSETS USED IN COMPLIANCE WITH THEIR RESPECTIVE LICENSES
                </div>
            </div>
        </div>
    `,
    width: 650,
    height: 600
};