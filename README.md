# Portfolio

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

#### Mastermind Game
Type or click the numbers on the screen. More instructions are at the bottom of the window. To set custom game modes, make sure to press 'ENTER' after typing in the secret code or number of attempts.