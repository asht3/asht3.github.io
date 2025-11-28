export const projectsApp = {
    name: 'Projects',
    content: `
        <h2>PROJECT DATABASE</h2>
        <p>Accessing encrypted project files...</p>
        <div class="project-grid">
            <div class="project-card" data-project="chip8">
                <h3>CHIP-8 Emulator</h3>
                <p>Cross-platform CHIP-8 emulator written in C++ with WebAssembly support</p>
                <p><strong>Tech:</strong> C++, WebAssembly, SDL2, Emscripten</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/chip8', '_blank')">GitHub Repository</button>
                    <button class="project-link cyber-button" onclick="window.desktop.openApp('chip8')">▶ LAUNCH EMULATOR</button>
                </div>
            </div>
            <div class="project-card">
                <h3>Neural Network Sim</h3>
                <p>Interactive AI visualization tool with real-time learning display</p>
                <p><strong>Tech:</strong> React, TensorFlow.js, Three.js</p>
            </div>
            <div class="project-card">
                <h3>Cyber Market</h3>
                <p>E-commerce platform with augmented reality product preview</p>
                <p><strong>Tech:</strong> Vue.js, Node.js, WebGL</p>
            </div>
            <div class="project-card">
                <h3>Data Stream</h3>
                <p>Real-time data visualization dashboard for IoT networks</p>
                <p><strong>Tech:</strong> D3.js, Socket.io, MongoDB</p>
            </div>
        </div>
    `,
    width: 700,
    height: 500
};