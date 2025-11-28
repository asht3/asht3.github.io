#include "../include/display.hpp"
#include <algorithm>
#include <iostream>

Display::Display() {
    clear();  // Initialize with blank display
}

void Display::clear() {
    std::fill(std::begin(pixels), std::end(pixels), false);
    draw_flag = true;
}

void Display::set_draw_flag() {
    draw_flag = true;
}

bool Display::draw_sprite(uint8_t x, uint8_t y, uint8_t* sprite, uint8_t height) {
    bool collision = false;
    for (int row = 0; row < height; row++) {
        uint8_t sprite_row = sprite[row];
        for (int col = 0; col < 8; col++) {
            if ((sprite_row & (0x80 >> col)) != 0) { // Check if the bit is set
                int px = (x + col) % WIDTH;
                int py = (y + row) % HEIGHT;
                if (xor_pixel(px, py)) {
                    collision = true; // Collision detected
                }
            }
        }
    }
    draw_flag = true;
    return collision;
}

bool Display::get_pixel(uint8_t x, uint8_t y) const {
    return pixels[x + y * WIDTH];
}

void Display::set_pixel(uint8_t x, uint8_t y, bool value) {
    pixels[x + y * WIDTH] = value;
}

bool Display::xor_pixel(uint8_t x, uint8_t y) {
    int index = x + y * WIDTH;
    bool old_value = pixels[index];
    pixels[index] = pixels[index] ^ true;  // XOR with 1
    return old_value && !pixels[index];    // Collision if was on and now off
}

void Display::flip_pixel(uint8_t x, uint8_t y) {
    pixels[x + y * WIDTH] = !pixels[x + y * WIDTH];
}

bool Display::needs_redraw() {
    return draw_flag;
}

void Display::clear_redraw_flag() {
    draw_flag = false;
}

void Display::init_sdl(const char* title = "CHIP-8", int scale = 10) {
    if (renderer) {
        SDL_DestroyRenderer(renderer);
        renderer = nullptr;
    }
    if (window) {
        SDL_DestroyWindow(window);
        window = nullptr;
    }

    SDL_Init(SDL_INIT_VIDEO);
    window = SDL_CreateWindow(title, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, WIDTH*scale, HEIGHT*scale, 0);

    if (!window) {
        std::cerr << "SDL_CreateWindow Error: " << SDL_GetError() << std::endl;
    }
    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (!renderer) {
        std::cerr << "SDL_CreateRenderer Error: " << SDL_GetError() << std::endl;
    }
}

void Display::cleanup_sdl() {
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
}

void Display::render_to_sdl(int scale = 10) {
    if (!renderer || !window) return;

    SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
    SDL_RenderClear(renderer);
    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    for (int y = 0; y < HEIGHT; ++y) {
        for (int x = 0; x < WIDTH; ++x) {
            if (pixels[y * WIDTH + x]) {
                SDL_Rect rect = { x * scale, y * scale, scale, scale };
                SDL_RenderFillRect(renderer, &rect);
            }
        }
    }
    SDL_RenderPresent(renderer);
}