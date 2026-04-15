#include "../include/chip8.hpp"
#include "../include/cpu.hpp"
#include "../include/memory.hpp"
#include "../include/display.hpp"
#include "../include/input.hpp"
#include <exception>
// #include <iostream> // For debugging output
#include <chrono>
#include <thread>

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
    SDL_Event event;
    
    // Frame-based loop at 60 FPS
    const int TARGET_FPS = 60;
    const int CYCLES_PER_FRAME = 15;
    const auto FRAME_DURATION = std::chrono::nanoseconds(1000000000 / TARGET_FPS);  // 16,666,667 ns = 16,666.66... ms
    
    auto next_frame_time = std::chrono::steady_clock::now();
    
    while (running) {
        // Set vblank ready at start of each frame
        display.set_vblank();
        
        // Process input
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                running = false;
                break;
            } else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE) {
                running = false;
                break;
            } else {
                input.handle_input_sdl(event);
            }
        }
        
        if (!running) break;

        for (int cycle = 0; cycle < CYCLES_PER_FRAME; cycle++) {
            cpu.execute_cycle(memory, display, input);
            if (display.is_frame_blocked()) { // Only render one sprite per frame
                break;
            }
        }
        
        // Update timers once per frame
        cpu.update_timers();
        
        if (cpu.get_sound_timer() > 0) {
            sound->beep();
        } else {
            sound->stop();
        }
        
        if (display.needs_redraw()) {
            display.render_to_sdl(10);
            display.clear_redraw_flag();
        }
        
        // Sleep until next tick
        next_frame_time += FRAME_DURATION;
        std::this_thread::sleep_until(next_frame_time);
    }
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

void Chip8::set_sound(Sound* snd) {
    sound = snd;
}