#pragma once
#include <cstdint>
#include <SDL2/SDL.h>

class Display {
    private:
        // static const int WIDTH = 64;
        // static const int HEIGHT = 32;
        uint8_t pixels[64 * 32];
        bool draw_flag;
        SDL_Window* window = nullptr;
        SDL_Renderer* renderer = nullptr;

    public:
        Display();
        void clear();
        void set_draw_flag();
        bool draw_sprite(uint8_t x, uint8_t y, uint8_t* sprite, uint8_t height);
        bool get_pixel(uint8_t x, uint8_t y) const;
        void set_pixel(uint8_t x, uint8_t y, bool value);
        bool xor_pixel(uint8_t x, uint8_t y);
        void flip_pixel(uint8_t x, uint8_t y);
        bool needs_redraw();
        void clear_redraw_flag();

        // For SDL rendering
        void init_sdl(const char* title, int scale);
        void cleanup_sdl();
        void render_to_sdl(int scale);

        // For WebAssembly
        uint8_t* get_pixel_buffer() { return pixels; }
        static const int WIDTH = 64;
        static const int HEIGHT = 32;
};