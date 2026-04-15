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

void Input::handle_input_sdl(const SDL_Event& event) {
    if (event.type == SDL_KEYDOWN || event.type == SDL_KEYUP) {
        bool pressed = (event.type == SDL_KEYDOWN);
        
        switch (event.key.keysym.sym) {
            case SDLK_1: set_key(0x1, pressed); break;
            case SDLK_2: set_key(0x2, pressed); break;
            case SDLK_3: set_key(0x3, pressed); break;
            case SDLK_4: set_key(0xC, pressed); break;
            case SDLK_q: set_key(0x4, pressed); break;
            case SDLK_w: set_key(0x5, pressed); break;
            case SDLK_e: set_key(0x6, pressed); break;
            case SDLK_r: set_key(0xD, pressed); break;
            case SDLK_a: set_key(0x7, pressed); break;
            case SDLK_s: set_key(0x8, pressed); break;
            case SDLK_d: set_key(0x9, pressed); break;
            case SDLK_f: set_key(0xE, pressed); break;
            case SDLK_z: set_key(0xA, pressed); break;
            case SDLK_x: set_key(0x0, pressed); break;
            case SDLK_c: set_key(0xB, pressed); break;
            case SDLK_v: set_key(0xF, pressed); break;
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