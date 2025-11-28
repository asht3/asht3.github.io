#include <emscripten.h>

#include "chip8.hpp"

// Global instance
static Chip8 chip8;

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
void load_rom(uint8_t* data, int size) {
    printf("C++: Loading ROM from JavaScript, size: %d bytes\n", size);
    
    // Check if data is valid
    if (!data) {
        printf("ERROR: data pointer is null\n");
        return;
    }
    
    printf("Data pointer: %p\n", data);
    
    // Reset the emulator first
    chip8.reset();
    
    // Load the ROM data directly to memory
    chip8.get_memory().load_rom(data, size, chip8.get_cpu().START_ADDRESS);
    
    printf("C++: ROM loaded successfully\n");
}

EMSCRIPTEN_KEEPALIVE
void emulate_cycle() {
    chip8.emulate_cycle();
}

EMSCRIPTEN_KEEPALIVE
int should_draw() {
    return chip8.get_display().needs_redraw() ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
unsigned char* get_display_buffer() {
    return chip8.get_display().get_pixel_buffer();
}

EMSCRIPTEN_KEEPALIVE
int get_display_width() {
    return 64;
}

EMSCRIPTEN_KEEPALIVE
int get_display_height() {
    return 32;
}

EMSCRIPTEN_KEEPALIVE
void key_down(int key) {
    chip8.get_input().set_key(key, true);
}

EMSCRIPTEN_KEEPALIVE
void key_up(int key) {
    chip8.get_input().set_key(key, false);
}

EMSCRIPTEN_KEEPALIVE
void reset() {
    chip8.reset();
}

#ifdef __cplusplus
}
#endif