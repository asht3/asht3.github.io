#include "../include/chip8.hpp"
#include "../include/display.hpp"
#include "../include/input.hpp"
#include "../include/sound.hpp"
#include <thread>

int main() {
    // Load Chip8 ROM
    Chip8 chip8;
    // chip8.load_rom("./roms/br8kout.ch8");
    chip8.load_rom("./roms/4-flags.ch8");
    // chip8.load_rom("./roms/5-quirks.ch8");
    // chip8.load_rom("./roms/6-keypad.ch8");

    chip8.get_display().init_sdl("CHIP-8", 10);
    
    // Initialize sound
    Sound sound;
    sound.init();

    // Start emulation
    chip8.run();
    SDL_Event event;

    while (chip8.is_running()) {
        if (!chip8.get_cpu().is_waiting_for_key()) {
            chip8.emulate_cycle();
        } else {
            chip8.get_cpu().update_timers();
        }

        if (chip8.get_cpu().get_sound_timer() > 0) {
            sound.beep();
        } else {
            sound.stop();
        }
        
        if (chip8.get_display().needs_redraw()) {
            chip8.get_display().render_to_sdl(10);
            chip8.get_display().clear_redraw_flag();
            // Delay to see display
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }

        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                chip8.stop();
            } else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE) {
                chip8.stop();
            } 
            else {
                if (event.type == SDL_KEYDOWN && chip8.get_cpu().is_waiting_for_key()) {
                    uint8_t chip8_key = 0xFF;
                    switch (event.key.keysym.sym) {
                        case SDLK_1: chip8_key = 0x1; break;
                        case SDLK_2: chip8_key = 0x2; break;
                        case SDLK_3: chip8_key = 0x3; break;
                        case SDLK_4: chip8_key = 0xC; break;
                        case SDLK_q: chip8_key = 0x4; break;
                        case SDLK_w: chip8_key = 0x5; break;
                        case SDLK_e: chip8_key = 0x6; break;
                        case SDLK_r: chip8_key = 0xD; break;
                        case SDLK_a: chip8_key = 0x7; break;
                        case SDLK_s: chip8_key = 0x8; break;
                        case SDLK_d: chip8_key = 0x9; break;
                        case SDLK_f: chip8_key = 0xE; break;
                        case SDLK_z: chip8_key = 0xA; break;
                        case SDLK_x: chip8_key = 0x0; break;
                        case SDLK_c: chip8_key = 0xB; break;
                        case SDLK_v: chip8_key = 0xF; break;
                    }
                    
                    if (chip8_key != 0xFF) {
                        chip8.get_cpu().handle_key_press(chip8_key);
                    }
                } else chip8.get_input().handle_input_sdl(event, chip8.get_input());
            }
        }
    }

    chip8.get_display().cleanup_sdl();
    return 0;
}