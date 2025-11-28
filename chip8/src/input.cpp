#include "../include/input.hpp"
#include "../include/cpu.hpp"
#include <SDL2/SDL.h>
#include <algorithm>
#include <iostream> // Debug

Input::Input() {
    reset();  // Initialize with no keys pressed
}

void Input::reset() {
    std::fill(std::begin(keys), std::end(keys), false);
    waiting_for_key = false;
    wait_register = 0xFF; // Invalid register index
}

void Input::handle_input_sdl(const SDL_Event& event, Input& chip8_input) {
    if (event.type == SDL_KEYDOWN || event.type == SDL_KEYUP) {
        bool pressed = (event.type == SDL_KEYDOWN);
        
        switch (event.key.keysym.sym) {
            // Row 1: 1 2 3 4
            case SDLK_1: chip8_input.set_key(0x1, pressed); break;
            case SDLK_2: chip8_input.set_key(0x2, pressed); break;
            case SDLK_3: chip8_input.set_key(0x3, pressed); break;
            case SDLK_4: chip8_input.set_key(0xC, pressed); break;
            
            // Row 2: Q W E R
            case SDLK_q: chip8_input.set_key(0x4, pressed); break;
            case SDLK_w: chip8_input.set_key(0x5, pressed); break;
            case SDLK_e: chip8_input.set_key(0x6, pressed); break;
            case SDLK_r: chip8_input.set_key(0xD, pressed); break;
            
            // Row 3: A S D F
            case SDLK_a: chip8_input.set_key(0x7, pressed); break;
            case SDLK_s: chip8_input.set_key(0x8, pressed); break;
            case SDLK_d: chip8_input.set_key(0x9, pressed); break;
            case SDLK_f: chip8_input.set_key(0xE, pressed); break;
            
            // Row 4: Z X C V
            case SDLK_z: chip8_input.set_key(0xA, pressed); break;
            case SDLK_x: chip8_input.set_key(0x0, pressed); break;
            case SDLK_c: chip8_input.set_key(0xB, pressed); break;
            case SDLK_v: chip8_input.set_key(0xF, pressed); break;
        }
    }
}

void Input::set_key(uint8_t key, bool pressed) {
    if (key < 16) {
        keys[key] = pressed;
    }
}

bool Input::is_pressed(int key) {
    if (key < 0 || key >= 16) {
        return false;
    }
    return keys[key];
}