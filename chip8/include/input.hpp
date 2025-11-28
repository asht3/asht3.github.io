#pragma once
#include <cstdint>
#include <SDL2/SDL.h>

class Input {
    private:
        bool keys[16];
        bool waiting_for_key;
        uint8_t wait_register;

    public:
        Input();
        void reset();
        void handle_input_sdl(const SDL_Event& event, Input& chip8_input);
        void set_key(uint8_t key, bool pressed);
        bool is_pressed(int key);
};