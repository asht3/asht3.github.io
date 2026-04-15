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
    
    // Wrap starting position
    int start_x = x % WIDTH;
    int start_y = y % HEIGHT;
    
    for (int row = 0; row < height; row++) {
        uint8_t sprite_row = sprite[row];
        int pixel_y = start_y + row;
        
        // Stop if below screen
        if (pixel_y >= HEIGHT) {
            break;
        }
        // Skip if above screen
        if (pixel_y < 0) {
            continue;
        }
        
        for (int col = 0; col < 8; col++) {
            // Check if the current pixel (from left to right) should be drawn
            if ((sprite_row & (0x80 >> col)) != 0) {
                int pixel_x = start_x + col;
                
                // Stop if beyond right edge
                if (pixel_x >= WIDTH) {
                    break;
                }
                // Skip if left of screen
                if (pixel_x < 0) {
                    continue;
                }
                
                if (xor_pixel(pixel_x, pixel_y)) {
                    collision = true;
                }
            }
        }
    }
    
    draw_flag = true;
    return collision;
}

bool Display::get_pixel(uint8_t x, uint8_t y) const {
    if (x >= WIDTH || y >= HEIGHT) {
        return false;
    }
    return pixels[x + y * WIDTH] != 0;
}

void Display::set_pixel(uint8_t x, uint8_t y, bool value) {
    if (x >= WIDTH || y >= HEIGHT) {
        return;
    }
    pixels[x + y * WIDTH] = value ? 255 : 0;
}

bool Display::xor_pixel(uint8_t x, uint8_t y) {
    if (x >= WIDTH || y >= HEIGHT) {
        return false;
    }
    int index = x + y * WIDTH;
    bool was_set = pixels[index] != 0;  // Collision if pixel was already on
    if (was_set) {
        pixels[index] = 0;
    } else {
        pixels[index] = 255;
    }
    return was_set;  // Return true if there was a collision (pixel was on and turned off)
}

void Display::flip_pixel(uint8_t x, uint8_t y) {
    if (x >= WIDTH || y >= HEIGHT) {
        return;
    }
    uint8_t& pixel = pixels[x + y * WIDTH];
    pixel = (pixel == 0) ? 255 : 0;
}

bool Display::needs_redraw() {
    return draw_flag;
}

void Display::clear_redraw_flag() {
    draw_flag = false;
}

void Display::set_vblank() {
    vblank_ready = true;
    frame_blocked = false;
}

bool Display::consume_vblank() {
    if (vblank_ready) {
        vblank_ready = false;
        return true;
    }
    frame_blocked = true;
    return false;
}

bool Display::is_frame_blocked() {
    return frame_blocked;
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