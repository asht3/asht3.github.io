#include "../include/chip8.hpp"
#include "../include/cpu.hpp"
#include "../include/memory.hpp"
#include "../include/display.hpp"
#include "../include/input.hpp"
#include <exception>
#include <iostream> // For debugging output

#ifdef __cplusplus
extern "C" {
#endif

// Global Chip8 instance
static Chip8 chip8;

void load_rom_wrapper(const char* filename) {
    chip8.load_rom(filename);
}

void emulate_cycle_wrapper() {
    chip8.emulate_cycle();
}

bool should_draw_wrapper() {
    return chip8.get_display().needs_redraw();
}

uint8_t* get_display_buffer_wrapper() {
    return chip8.get_display().get_pixel_buffer();
}

int get_display_width_wrapper() {
    return Display::WIDTH;
}

int get_display_height_wrapper() {
    return Display::HEIGHT;
}

void key_down_wrapper(int key) {
    chip8.get_input().set_key(key, true);
}

void key_up_wrapper(int key) {
    chip8.get_input().set_key(key, false);
}

void reset_wrapper() {
    chip8.reset();
}

#ifdef __cplusplus
}
#endif

Chip8::Chip8() {
    reset();
}

void Chip8::reset() {
    cpu.reset();
    memory.reset();
    display.clear();
    input.reset();
    running = false;
}

void Chip8::emulate_cycle() {
    if (cpu.is_waiting_for_key()) {
        cpu.update_timers();
        return;
    }
    cpu.execute_cycle(memory, display, input);
    cpu.update_timers();
}

void Chip8::run() {
    running = true;
    emulate_cycle();
}

void Chip8::stop() {
    running = false;
}

void Chip8::load_rom(const char* filename) {
    try {
        cpu.reset();
        memory.load_rom(filename, cpu.START_ADDRESS);
        // for (int i = 0; i < 10; ++i) {
        //     printf("Opcode at %03X: %02X%02X\n", 0x200 + i*2, memory.read(0x200 + i*2), memory.read(0x200 + i*2 + 1));
        // }
        // DEBUG: Check what was loaded
        // std::cout << "ROM loaded, dumping first 32 bytes:\n";
        // memory.dump(0x200, 32);

        // return true;
    } catch (std::exception& e) {
        std::cerr << "Load ROM error: " << e.what() << std::endl;
        throw;
        // return false;
    }
}

Display& Chip8::get_display() {
    return display;
}

Input& Chip8::get_input() {
    return input;
}

bool Chip8::is_running() {
    return running;
}

CPU& Chip8::get_cpu() {
    return cpu;
}