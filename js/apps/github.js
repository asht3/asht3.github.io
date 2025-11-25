export const githubApp = {
    name: 'GitHub Access',
    content: `
        <h2>EXTERNAL_REPOSITORY_ACCESS</h2>
        <p>Connecting to GitHub network...</p>
        <br>
        <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🔗</div>
            <button onclick="window.open('https://github.com/yourusername', '_blank')" 
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