# Chip-8 Emulator
This project is an implementation of a Chip-8 emulator written in C++. The emulator supports ROM loading, CPU emulation, graphics rendering, input handling, and sound playback. Integrated SDL2 for key mapping, graphics, and sound.

## Chip-8 Intro
The Chip-8 was developed by Joseph Weisbecker in the 1970s. It's an interpreted programming language initially used on the COSMAC VIP and Telmac 1800 8-bit microcomupters.

## Installation
This emulator uses SDL2 to render the display, output sound, and map the input keys. To install SDL, follow [this guide](https://wiki.libsdl.org/SDL2/Installation).

Once SDL is installed, clone the repository and move into the chip8 directory
```
git clone git@github.com:asht3/chip8.git
cd chip8
```
Compile and run the code
```
make
./chip8
```

FOR WEBASSEMBLY:
To compile the code and display hte program with Javascript on a webpage, use this command while in the chip8/ directory
```
make wasm
```

## ROMs
The emulator was tested using test ROMs from this [Chip-8 test suite](https://github.com/Timendus/chip8-test-suite).

Game ROMs used in this project are from the [Chip-8 archive](https://johnearnest.github.io/chip8Archive/?sort=platform) and a [repo with a selection of games](https://github.com/kripod/chip8-roms).

Implementation Note: This implementation uses the original behavior for compatibility with games like Space Invaders. The [Chip-8 quirks test](https://github.com/Timendus/chip8-test-suite) checks for the modern behavior.

Games that are known to be compatible with this emulator are in the roms folder.

## How To Change ROMs
Find src/main.cpp. At the beginning of the main loop, look for a line of code loading in a ROM. It will look something like this:
```
chip8.load_rom("./roms/rom-name.ch8");
```
You can change the name of the ROM to any of the roms in the roms folder. Or you can change the path to wherever you have your own games stored. 

## Input
SDL was used to implement the key mapping. The emulator uses a QWERTY keyboard for input. The keys are mapped below from left to right (1->1, 2->2, 3->3, C->4, etc):

QWERTY Key     | CHIP 8 Key |
----------- | ---------- |
1 2 3 4     | 1 2 3 C    |
Q W E R     | 4 5 6 D    |  
A S D F     | 7 8 9 E    |
Z X C V     | A 0 B F    |

Clicking on the 'X' of the window will exit the emulator. You can also press the ESC key on your keyboard.

## Work In Progress
Progress will be tracked here.
- Investigating and fixing existing bugs
- Updating documentation
- Refactoring code
- Improving test coverage
- Working on compatibility with more roms

## References

### Chip-8 Specific:
1. https://austinmorlan.com/posts/chip8_emulator/
2. https://tobiasvl.github.io/blog/write-a-chip-8-emulator/
3. https://multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/
4. https://www.emulationonline.com/systems/chip8/control-flow-and-graphics/
5. https://jordanemme.com/posts/writing-a-chip8-emulator/#the-display
6. https://deepwiki.com/tavito/chip8/6-sdl-integration

### ROM Loading:
1. https://codepal.ai/code-generator/query/vA7y78Lb/n64-rom-reading-emulation