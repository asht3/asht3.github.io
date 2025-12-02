# Portfolio

## FOR REVIEWERS
Open index.html in VS Code and click on the "Show Preview" button on the top right hand corner top view the site. Make sure Microsoft's Live Preview extension is installed for VS Code.

If there are issues with the Chip-8 program on the site: To run the Chip-8 Emulator, install WebAssembly and Emscripten to your device. Then navigate to the Chip-8 folder and run `make wasm`

Ensure that the `chip8.data` file is outside the chip8 folder but stil in dev-portfolio. The chip8 folder should have a wasm folder taht was created after compiling the code. This should contain a chip8.js file.

More info on the Chip8 can be found in the README within the folder.

If there are issues with the Mastermind program, move to the mastermind directory and run `./build_wasm.sh`.

## FEATURES
- Resizable, draggable windows with z-index management
- Pre-opened profile window on load
- Functional music player with synthwave/cyberpunk sounds
- Interactive taskbar with app management
- Glitch effects for immersion
- Responsive design
- Toggle Button: Screen icon in system tray to toggle background effect
- Performance Mode: Disables binary rain animation completely to save resources. Switches to a static wallpaper.
- The windows will maintain their position and size when minimized and restored, providing a proper desktop-like experience.

#### CHIP-8 Emulator
Integrated a funcitonal Chip-8 emulator written in C++ into the web page.

## USAGE
- Double-click desktop icons to open apps
- Drag windows by their header
- Resize from bottom-right corner
- Use window controls (minimize, maximize, close)
    - Click the taskbar app button to restore a minimized window
    - Click the taskbar app button again to minimize a restored window

#### Binary Rain Wallpaper:

Click the screen icon in the taskbar to toggle between binary rain and static background

Binary Rain ON: Animated falling code with glow effects

Binary Rain OFF: Static cyberpunk gradient background (better performance)

#### CHIP-8 Emulator
Controls are shown in the Chip-8 app.
SDL was used to implement the key mapping. The emulator uses a QWERTY keyboard for input. The keys are mapped below from left to right (1->1, 2->2, 3->3, C->4, etc):

QWERTY Key     | CHIP 8 Key |
----------- | ---------- |
1 2 3 4     | 1 2 3 C    |
Q W E R     | 4 5 6 D    |  
A S D F     | 7 8 9 E    |
Z X C V     | A 0 B F    |