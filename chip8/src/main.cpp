#include "../include/chip8.hpp"
#include "../include/display.hpp"
#include "../include/input.hpp"
#include "../include/sound.hpp"

int main() {
    Chip8 chip8;
    chip8.load_rom("./roms/Tetris [Fran Dachille, 1991].ch8");
    // chip8.load_rom("./roms/2-ibm-logo.ch8");

    chip8.get_display().init_sdl("CHIP-8", 10);
    
    Sound sound;
    sound.init();
    chip8.set_sound(&sound);

    chip8.run();
    sound.cleanup();
    chip8.get_display().cleanup_sdl();

    return 0;
}