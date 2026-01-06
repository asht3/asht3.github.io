export const projectsApp = {
    name: 'Projects',
    content: `
        <h2>PROJECT DATABASE</h2>
        <p>Accessing encrypted project files...</p>
        <div class="project-grid">
            <div class="project-card" data-project="portfolio">
                <img src="./assets/project-imgs/portfolio.png">
                <h3>Interactive Portfolio: About This Site</h3>
                <p><strong>Tech:</strong> Javascript, HTML, CSS</p>
                <div class="description-container">
                    <p class="project-description collapsed">
                        This portfolio is a Cyberpunk-themed, custom-built interactive experience. It's built to simulate a desktop environment, 
                        complete with a real-time clock widget and animated background to enhance the immersive, thematic user experience.
                        Explore the window controls, toggle the background, and launch the app icons to see my work in action. Play demos of my 
                        previous projects in-browser by clicking on the app icons or launching them from this projects menu.
                    <br><br>
                        This site was built using Javascript, HTML, and CSS. The Chip-8 Emulator and Mastermind were built in C++/C then incorporated
                        onto the site using WebAssembly and Emscripten.
                    </p>
                    <div class="view-more-container">
                        <a href="javascript:void(0)" class="view-toggle">View More</a>
                    </div>
                    <div class="view-less-container" style="display: none;">
                        <a href="javascript:void(0)" class="view-toggle-less">View Less</a>
                    </div>
                </div>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/asht3.github.io', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card" data-project="negative-film-restorer">
                <img src="./assets/project-imgs/neg-film-restorer.png">
                <h3>Negative Film Restorer</h3>
                <p><strong>Tech:</strong> Node.js, Express, Sharp.js, Docker</p>
                <div class="description-container">
                    <p class="project-description collapsed">
                        A REST API that converts photo film negatives to digital images using Node.js, Express, and color 
                        matrices, featuring real-time processing, and before/after comparisons. Corrects orange mask 
                        compensation and white balance. Containerized with Docker and secured with rate-limiting.
                    </p>
                    <div class="view-more-container">
                        <a href="javascript:void(0)" class="view-toggle">View More</a>
                    </div>
                    <div class="view-less-container" style="display: none;">
                        <a href="javascript:void(0)" class="view-toggle-less">View Less</a>
                    </div>
                </div>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/negative-film-restorer', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card" data-project="chip8">
                <img src="./assets/project-imgs/chip8.png">
                <h3>CHIP-8 Emulator</h3>
                <p><strong>Tech:</strong> C++, WebAssembly, SDL2, Emscripten</p>
                <div class="description-container">
                    <p class="project-description collapsed">
                        CHIP-8 emulator written in C++ using SDL2 for graphics and input handling.
                        This emulator is hosted on this site and has been adapted for cross-platform use, 
                        leveraging the original code with WebAssembly support. 
                        The Github repository to the original project is linked below.
                    </p>
                    <div class="view-more-container">
                        <a href="javascript:void(0)" class="view-toggle">View More</a>
                    </div>
                    <div class="view-less-container" style="display: none;">
                        <a href="javascript:void(0)" class="view-toggle-less">View Less</a>
                    </div>
                </div>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/chip8', '_blank')">View GitHub Repository</button>
                    <button class="project-link cyber-button" onclick="window.desktop.openApp('chip8')">LAUNCH EMULATOR</button>
                </div>
            </div>
            <div class="project-card" data-project="mastermind">
                <img src="./assets/project-imgs/mastermind.png">
                <h3>Mastermind</h3>
                <p><strong>Tech:</strong> C, WebAssembly, Emscripten, JS (demo)</p>
                <div class="description-container">
                    <p class="project-description collapsed">
                        An implementation of the Mastermind game where the user has a certain number of attempts to guess the secret code. 
                        The game is customizable, allowing users to set their own code and alter the number of allowed attempts to guess it. 
                        The link below leads to the repository of the original implementation. The code was ported using WebAssembly so a demo could be hosted on this site, 
                        adding a UI and altering the game slightly.
                    </p>
                    <div class="view-more-container">
                        <a href="javascript:void(0)" class="view-toggle">View More</a>
                    </div>
                    <div class="view-less-container" style="display: none;">
                        <a href="javascript:void(0)" class="view-toggle-less">View Less</a>
                    </div>
                </div>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/mastermind', '_blank')">View GitHub Repository</button>
                    <button class="project-link cyber-button" onclick="window.desktop.openApp('mastermind')">LAUNCH DEMO</button>
                </div>
            </div>
            <div class="project-card">
                <img src="./assets/project-imgs/zsh.png">
                <h3>My Zsh</h3>
                <p><strong>Tech:</strong> C</p>
                <p>Implementation of a UNIX shell that supports multiple system calls and shell built-ins. Utilizes custom utility functions.</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/zsh', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card">
                <img src="./assets/project-imgs/my-sqlite.png">
                <h3>My SQLite</h3>
                <p><strong>Tech:</strong> Ruby</p>
                <div class="description-container">
                    <p class="project-description collapsed">
                        A lightweight SQLite database implementation with a command-line interface. 
                        Contains basic functionalities for select, from, join, where, order, insert, values, update, set, and delete.
                    </p>
                    <div class="view-more-container">
                        <a href="javascript:void(0)" class="view-toggle">View More</a>
                    </div>
                    <div class="view-less-container" style="display: none;">
                        <a href="javascript:void(0)" class="view-toggle-less">View Less</a>
                    </div>
                </div>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/my-sqlite', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card">
                <img src="./assets/project-imgs/tar.png">
                <h3>My Tar</h3>
                <p><strong>Tech:</strong> C</p>
                <div class="description-container">
                    <p class="project-description collapsed">
                        An implementation of the tar command-line utility in C, supporting basic functionalities such as creating, listing, updating, and extracting files from a tar archive. 
                        Manages file archives while maintaining file integrity.
                    </p>
                    <div class="view-more-container">
                        <a href="javascript:void(0)" class="view-toggle">View More</a>
                    </div>
                    <div class="view-less-container" style="display: none;">
                        <a href="javascript:void(0)" class="view-toggle-less">View Less</a>
                    </div>
                </div>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/my-tar', '_blank')">View GitHub Repository</button>
                </div>
            </div>
            <div class="project-card">
                <img src="./assets/project-imgs/curl.png">
                <h3>My Curl</h3>
                <p><strong>Tech:</strong> C</p>
                <p>A command similar to the UNIX curl that fetches and displays HTML content from web servers using only basic socket operations and HTTP protocol handling.</p>
                <div class="project-links">
                    <button class="project-link cyber-button" onclick="window.open('https://github.com/asht3/my-curl', '_blank')">View GitHub Repository</button>
                </div>
            </div>
        </div>
    `,
    width: 800,
    height: 500
};