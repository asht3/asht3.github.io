#pragma once
#include <cstdint>
#include <SDL2/SDL.h>
#include <chrono>
#include <thread>

class Display {
    private:
        static const int WIDTH = 64;
        static const int HEIGHT = 32;
        uint8_t pixels[WIDTH * HEIGHT];
        bool draw_flag;
        SDL_Window* window = nullptr;
        SDL_Renderer* renderer = nullptr;

        bool vblank_ready = false;
        bool frame_blocked = false; // Prevents multiple draws per frame

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
        void set_vblank();
        bool consume_vblank();
        bool is_frame_blocked();

        // For SDL rendering
        void init_sdl(const char* title, int scale);
        void cleanup_sdl();
        void render_to_sdl(int scale);

        // For Emscripten
        bool get_pixel(int x, int y) const {
            if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return false;
            return pixels[x + y * WIDTH];
        }

        // Direct access to raw pixel data
        uint8_t* get_raw_pixels() {
            return pixels;
        }
};