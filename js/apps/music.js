export const musicApp = {
    name: 'Music Player',
    content: `
        <h2>NEURAL_STIMULATION_PROTOCOL</h2>
        <p>Select audio frequency for enhanced productivity:</p>
        <div class="music-controls">
            <button onclick="window.musicPlayer.playSynth()">SYNTHWAVE</button>
            <button onclick="window.musicPlayer.playCyber()">CYBERPUNK</button>
            <button onclick="window.musicPlayer.stop()">STOP</button>
        </div>
        <br>
        <p>Current Track: <span id="current-track">READY</span></p>
        <br>
        <p>> AUDIO SYSTEMS: ONLINE</p>
        <p>> IMMERSION: 87%</p>
    `,
    width: 400,
    height: 300
};