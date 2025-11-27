export const githubApp = {
    name: 'GitHub Access',
    content: `
        <h2>EXTERNAL_REPOSITORY_ACCESS</h2>
        <p>Connecting to GitHub network...</p>
        <br>
        <div style="text-align: center; margin: 20px 0;">
            <div class="profile-image-container">
                <div class="profile-image">
                    <div class="image-placeholder"><img src="assets/astronaut.png"></div>
                    <div class="scan-line"></div>
                </div>
                <div class="online-status">
                    <span class="status-indicator"></span>
                    <br><br>
                    STATUS: ONLINE
                </div>
                <br><br>
            </div>
            <button onclick="window.open('https://github.com/asht3', '_blank')" 
                    style="background: var(--neon-blue); color: var(--dark-bg); border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: 'Orbitron';">
                INITIATE_CONNECTION
            </button>
        </div>
        <br>
        <p>> SECURITY: ENCRYPTED</p>
        <p>> STATUS: READY</p>
    `,
    width: 400,
    height: 350
};