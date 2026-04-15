#include <emscripten/emscripten.h>
#include "chip8.hpp"
#include <stdlib.h>  // For malloc/free
#include <string.h>

static Chip8 chip8;
static bool needs_draw = false;

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
void load_rom(uint8_t* data, int size) {
    printf("C++: load_rom called with size %d\n", size);
    
    if (!data) {
        printf("ERROR: data is NULL\n");
        return;
    }
    
    // Print first few bytes for debugging
    printf("First 4 bytes: %02X %02X %02X %02X\n", data[0], data[1], data[2], data[3]);
    
    // Reset everything
    chip8.reset();
    
    Memory& memory = chip8.get_memory();
    CPU& cpu = chip8.get_cpu();
    
    // Load ROM at START_ADDRESS (usually 0x200)
    for (int i = 0; i < size && i < 4096 - cpu.START_ADDRESS; i++) {
        memory.write(cpu.START_ADDRESS + i, data[i]);
    }
    
    // Reset PC to START_ADDRESS
    cpu.set_pc(cpu.START_ADDRESS);
    
    // Clear draw flag to force first frame
    chip8.get_display().set_draw_flag();
    needs_draw = true;
    
    printf("C++: ROM loaded successfully, PC set to 0x%X\n", cpu.START_ADDRESS);
}

EMSCRIPTEN_KEEPALIVE
void emulate_cycle() {
    static int cycle_count = 0;

    // Set vblank every 10 cycles (matches 10 cycles/frame at 60fps in chip8Manager.js)
    if (cycle_count % 10 == 0) {
        chip8.get_display().set_vblank();
    }

    // Debug: Print every 1000 cycles
    if (cycle_count % 1000 == 0) {
        printf("Cycle %d: PC = 0x%X\n", cycle_count, chip8.get_cpu().get_pc());
    }

    // Call Chip8's emulate_cycle
    chip8.emulate_cycle();

    cycle_count++;

    // Check if we need to redraw
    if (chip8.get_display().needs_redraw()) {
        needs_draw = true;
        chip8.get_display().clear_redraw_flag();
        printf("Draw flag set at cycle %d\n", cycle_count);
    }
}

EMSCRIPTEN_KEEPALIVE
int should_draw() {
    return needs_draw ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
unsigned char* get_display_buffer() {
    // Return pointer to the actual display pixels directly
    Display& display = chip8.get_display();

    // Access the raw pixel data from Display
    uint8_t* raw_pixels = display.get_raw_pixels();

    if (!raw_pixels) {
        printf("ERROR: get_raw_pixels() returned NULL\n");
        return nullptr;
    }

    needs_draw = false;
    return raw_pixels;
}

EMSCRIPTEN_KEEPALIVE
int get_display_width() { return 64; }

EMSCRIPTEN_KEEPALIVE
int get_display_height() { return 32; }

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
    needs_draw = false;
}

#ifdef __cplusplus
}
#endif