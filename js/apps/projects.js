export const projectsApp = {
    name: 'Projects',
    content: `
        <h2>PROJECT DATABASE</h2>
        <p>Accessing encrypted project files...</p>
        <div class="project-grid">
            <div class="project-card" data-project="chip8">
                <h3>CHIP-8 Emulator</h3>
                <p>CHIP-8 emulator written in C++, link to the GitHub repository is below.</p>
                <p>The emulator is hosted on this site and edited to be cross-platform. It uses the original code with WebAssembly support.</p>
                <br>
                <p><strong>Tech:</strong> C++, WebAssembly, SDL2, Emscripten</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/chip8', '_blank')">View GitHub Repository</button>
                    <button class="project-link cyber-button" onclick="window.desktop.openApp('chip8')">▶ LAUNCH EMULATOR</button>
                </div>
            </div>
            <div class="project-card">
                <h3>ZSH</h3>
                <p>Implementation of a UNIX shell that supports multiple system calls and shell built-ins. Utilizes custom utility functions.</p>
                <br>
                <p><strong>Tech:</strong> C</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/zsh', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card">
                <h3>My Sqlite</h3>
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
    width: 700,
    height: 500
};