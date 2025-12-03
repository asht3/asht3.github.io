export const projectsApp = {
    name: 'Projects',
    content: `
        <h2>PROJECT DATABASE</h2>
        <p>Accessing encrypted project files...</p>
        <div class="project-grid">
            <div class="project-card" data-project="chip8">
                <h3>CHIP-8 Emulator</h3>
                <p>CHIP-8 emulator written in C++ using SDL2 for graphics and input handling.
                This emulator is hosted on this site and has been adapted for cross-platform use, leveraging the original code with WebAssembly support. 
                The Github repository to the original project is linked below.</p>
                <br>
                <p><strong>Tech:</strong> C++, WebAssembly, SDL2, Emscripten</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/chip8', '_blank')">View GitHub Repository</button>
                    <button class="project-link cyber-button" onclick="window.desktop.openApp('chip8')">LAUNCH EMULATOR</button>
                </div>
            </div>
            <div class="project-card">
                <h3>Mastermind</h3>
                <p>An implementation of the Mastermind game where the user has a certain number of attempts to guess the secret code. 
                The game is customizable, allowing users to set their own code and alter the number of allowed attempts to guess it. 
                The link below leads to the repository of the original implementation. The code was ported using WebAssembly so a demo could be hosted on this site, adding a UI and altering the game slightly.
                </p>
                <br>
                <p><strong>Tech:</strong> C, WebAssembly, Emscripten, JavaScript (demo)</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/mastermind', '_blank')">View GitHub Repository</button>
                    <button class="project-link cyber-button" onclick="window.desktop.openApp('mastermind')">LAUNCH DEMO</button>
                </div>
            </div>
            <div class="project-card">
                <h3>My Zsh</h3>
                <p>Implementation of a UNIX shell that supports multiple system calls and shell built-ins. Utilizes custom utility functions.</p>
                <br>
                <p><strong>Tech:</strong> C</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/zsh', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card">
                <h3>My SQLite</h3>
                <p>A lightweight SQLite database implementation with a command-line interface. Contains basic functionalities for select, from, join, where, order, insert, values, update, set, and delete.</p>
                <br>
                <p><strong>Tech:</strong> Ruby</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/my-sqlite', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card">
                <h3>My Curl</h3>
                <p>A command similar to the UNIX curl that fetches and displays HTML content from web servers using only basic socket operations and HTTP protocol handling.</p>
                <br>
                <p><strong>Tech:</strong> C</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/my-curl', '_blank')">View GitHub Repository</button>
                </div>
            </div>
        </div>
    `,
    width: 800,
    height: 500
};