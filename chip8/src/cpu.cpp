#include "../include/cpu.hpp"
#include <algorithm>
#include <stdexcept>
// #include <iostream> // For debugging output
// #include <thread> // debug

CPU::CPU() {
    reset();
}

void CPU::reset() {
    std::fill(std::begin(V), std::end(V), 0);
    I = 0;
    PC = START_ADDRESS;
    delay_timer = 0;
    sound_timer = 0;
    std::fill(std::begin(stack), std::end(stack), 0);
    SP = 0;
    waiting_for_key = false;
    key_register = 0xFF; // Invalid register index
}

void CPU::push_stack(uint16_t address) {
    if (SP >= 16) {
        throw std::runtime_error("Stack overflow on push");
    }
    stack[SP++] = address;
}

uint16_t CPU::pop_stack() {
    if (SP == 0) {
        throw std::runtime_error("Stack underflow on pop");
    }
    return stack[--SP];
}

// Fetch, decode, and execute opcode
void CPU::execute_cycle(Memory& memory, Display& display, Input& keys) {
    uint16_t opcode = fetch_opcode(memory);
    PC += 2; // Move to next instruction

    switch (opcode & 0xF000) {
        case 0x0000:
            switch (opcode & 0x00FF) {
                case 0x00E0: OP_00E0(display); break;
                case 0x00EE: OP_00EE(); break;
                default: throw std::runtime_error("Unknown opcode: " + std::to_string(opcode));
            }
            break;
        case 0x1000: OP_1nnn(opcode); break;
        case 0x2000: OP_2nnn(opcode); break;
        case 0x3000: OP_3xkk(opcode); break;
        case 0x4000: OP_4xkk(opcode); break;
        case 0x5000: OP_5xy0(opcode); break;
        case 0x6000: OP_6xkk(opcode); break;
        case 0x7000: OP_7xkk(opcode); break;
        case 0x8000:
            switch (opcode & 0x000F) {
                case 0x0000: OP_8xy0(opcode); break;
                case 0x0001: OP_8xy1(opcode); break;
                case 0x0002: OP_8xy2(opcode); break;
                case 0x0003: OP_8xy3(opcode); break;
                case 0x0004: OP_8xy4(opcode); break;
                case 0x0005: OP_8xy5(opcode); break;
                case 0x0006: OP_8xy6(opcode); break;
                case 0x0007: OP_8xy7(opcode); break;
                case 0x000E: OP_8xyE(opcode); break;
                default: throw std::runtime_error("Unknown opcode: " + std::to_string(opcode));
            }
            break;
        case 0x9000: OP_9xy0(opcode); break;
        case 0xA000: OP_Annn(opcode); break;
        case 0xB000: OP_Bnnn(opcode); break;
        case 0xC000: OP_Cxkk(opcode); break;
        case 0xD000: OP_Dxyn(memory, display, opcode); break;
        case 0xE000:
            switch (opcode & 0x00FF) {
                case 0x009E: OP_Ex9E(opcode, keys); break;
                case 0x00A1: OP_ExA1(opcode, keys); break;
                default: throw std::runtime_error("Unknown opcode: " + std::to_string(opcode));
            }
            break;
        case 0xF000:
            switch (opcode & 0x00FF) {
                case 0x0007: OP_Fx07(opcode); break;
                case 0x000A: OP_Fx0A(opcode, keys); break;
                case 0x0015: OP_Fx15(opcode); break;
                case 0x0018: OP_Fx18(opcode); break;
                case 0x001E: OP_Fx1E(opcode); break;
                case 0x0029: OP_Fx29(opcode); break;
                case 0x0033: OP_Fx33(opcode, memory); break;
                case 0x0055: OP_Fx55(opcode, memory); break;
                case 0x0065: OP_Fx65(opcode, memory); break;
                default: throw std::runtime_error("Unknown opcode: " + std::to_string(opcode));
            }
            break;
        default: throw std::runtime_error("Unknown opcode: " + std::to_string(opcode));
    }
}


uint16_t CPU::fetch_opcode(Memory& memory) {
    return (memory.read(PC) << 8) | memory.read(PC + 1);
}

void CPU::update_timers() {
    if (delay_timer > 0) --delay_timer;
    if (sound_timer > 0) --sound_timer;
}

void CPU::OP_00E0(Display& display) {
    display.clear();
}

void CPU::OP_00EE() {
    if (SP == 0) {
        throw std::runtime_error("Stack underflow on RET");
    }
    PC = pop_stack();
}

void CPU::OP_1nnn(uint16_t opcode) {
    PC = opcode & 0x0FFF;
}

void CPU::OP_2nnn(uint16_t opcode) {
    if (SP >= 16) {
        throw std::runtime_error("Stack overflow on CALL");
    }
    push_stack(PC);
    PC = opcode & 0x0FFF;
}

void CPU::OP_3xkk(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t kk = opcode & 0x00FF;
    if (V[Vx] == kk) {
        PC += 2;
    } 
}

void CPU::OP_4xkk(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t kk = opcode & 0x00FF;
    if (V[Vx] != kk) {
        PC += 2;
    }
}

void CPU::OP_5xy0(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    if (V[Vx] == V[Vy]) {
        PC += 2;
    } 
}

void CPU::OP_6xkk(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t kk = opcode & 0x00FF;
    V[Vx] = kk;
}

void CPU::OP_7xkk(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t kk = opcode & 0x00FF;
    V[Vx] += kk;
}

void CPU::OP_8xy0(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    V[Vx] = V[Vy];
}

void CPU::OP_8xy1(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    V[Vx] = V[Vx] | V[Vy];
    V[0xF] = 0;
}

void CPU::OP_8xy2(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    V[Vx] = V[Vx] & V[Vy];
    V[0xF] = 0;
}

void CPU::OP_8xy3(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    V[Vx] = V[Vx] ^ V[Vy];
    V[0xF] = 0;
}

void CPU::OP_8xy4(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;

    uint8_t original_Vx = V[Vx];
    uint8_t original_Vy = V[Vy];
    
    uint16_t sum = original_Vx + original_Vy;
    
    V[Vx] = sum & 0xFF; // Keep only the lower 8 bits
    V[0xF] = (sum > 0xFF) ? 1 : 0; // Set carry flag
}

void CPU::OP_8xy5(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    uint8_t original_Vx = V[Vx];
    uint8_t original_Vy = V[Vy];
    
    // V[0xF] = (original_Vx > original_Vy) ? 1 : 0;
    V[0xF] = (original_Vx >= original_Vy) ? 1 : 0;
    V[Vx] = original_Vx - original_Vy;

    // V[0xF] = (V[Vx] > V[Vy]) ? 1 : 0;
    // V[Vx] -= V[Vy];
}

void CPU::OP_8xy6(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    // uint8_t Vy = (opcode & 0x00F0) >> 4;

    // Original
    V[0xF] = V[Vx] & 0x1; // Store LSB of Vx in VF
    V[Vx] >>= 1; // Shift right by 1 (divide by 2)
    
    // Modern
    // V[0xF] = V[Vy] & 0x1;
    // V[Vx] = V[Vy] >> 1;
}

void CPU::OP_8xy7(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    V[Vx] = V[Vy] - V[Vx];
    V[0xF] = (V[Vy] > V[Vx]) ? 1 : 0;
}

void CPU::OP_8xyE(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    // uint8_t Vy = (opcode & 0x00F0) >> 4;

    // Original
    V[0xF] = (V[Vx] & 0x80) >> 7; // Store MSB of Vx in VF
    V[Vx] <<= 1; // Shift left by 1 (multiply by 2)

    // Modern
    // V[0xF] = (V[Vy] & 0x80) >> 7;
    // V[Vx] = V[Vy] << 1;
}

void CPU::OP_9xy0(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    if (V[Vx] != V[Vy]) {
        PC += 2;
    } 
}

void CPU::OP_Annn(uint16_t opcode) {
    I = opcode & 0x0FFF;
}

void CPU::OP_Bnnn(uint16_t opcode) {
    uint16_t nnn = opcode & 0x0FFF;
    PC = V[0] + nnn;
}

void CPU::OP_Cxkk(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t kk = opcode & 0x00FF;
    V[Vx] = (rand() % 256) & kk;
}

void CPU::OP_Dxyn(Memory& memory, Display& display, uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t Vy = (opcode & 0x00F0) >> 4;
    uint8_t height = opcode & 0x000F;
    
    uint8_t x = V[Vx] % 64;
    uint8_t y = V[Vy] % 32;
    
    V[0xF] = 0;  // Reset collision flag

    for (int row = 0; row < height; row++) {
        uint8_t sprite_byte = memory.read(I + row);
        
        for (int col = 0; col < 8; col++) {
            if ((sprite_byte & (0x80 >> col)) != 0) {
                uint8_t pixel_x = (x + col) % 64;
                uint8_t pixel_y = (y + row) % 32;
                // Check if pixel is currently set
                if (display.get_pixel(pixel_x, pixel_y)) {
                    V[0xF] = 1;  // Collision detected
                }
                
                display.flip_pixel(pixel_x, pixel_y);
            }
        }
    }
    display.set_draw_flag();
}

void CPU::OP_Ex9E(uint16_t opcode, Input& keys) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    // Check if key is valid and pressed
    if (V[Vx] < 16 && keys.is_pressed(V[Vx])) {
        PC += 2;
    } 
}

void CPU::OP_ExA1(uint16_t opcode, Input& keys) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    if (V[Vx] < 16 && !keys.is_pressed(V[Vx])) {
        PC += 2;
    } 
}

void CPU::OP_Fx07(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    V[Vx] = delay_timer;
}

void CPU::OP_Fx0A(uint16_t opcode, Input& keys) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    keys.reset();
    waiting_for_key = true;
    key_register = Vx;
    PC -= 2; // Stay on this instruction until a key is pressed
    // If no key is pressed, do not advance the PC
}

void CPU::OP_Fx15(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    delay_timer = V[Vx];
}

void CPU::OP_Fx18(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    sound_timer = V[Vx];
}

void CPU::OP_Fx1E(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    I = (I + V[Vx]) & 0x0FFF; // I stays within 12 bits
}

void CPU::OP_Fx29(uint16_t opcode) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    uint8_t character = V[Vx] & 0x0F; // Only 0-F are valid characters
    I = character * 5; // Each character is 5 bytes
}

void CPU::OP_Fx33(uint16_t opcode, Memory& memory) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    memory.write(I, V[Vx] / 100);
    memory.write(I + 1, (V[Vx] / 10) % 10);
    memory.write(I + 2, V[Vx] % 10);
}

void CPU::OP_Fx55(uint16_t opcode, Memory& memory) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    for (uint8_t i = 0; i <= Vx; i++) {
        memory.write(I + i, V[i]);
    }
    I += Vx + 1;
}

void CPU::OP_Fx65(uint16_t opcode, Memory& memory) {
    uint8_t Vx = (opcode & 0x0F00) >> 8;
    for (uint8_t i = 0; i <= Vx; i++) {
        V[i] = memory.read(I + i);
    }
    I += Vx + 1;
}

uint8_t CPU::get_sound_timer() const {
    return sound_timer;
}

uint16_t CPU::get_pc() const {
    return PC;
}

void CPU::set_pc(uint16_t address) {
    PC = address;
}

void CPU::add_to_pc(uint16_t offset) {
    PC += offset;
}

void CPU::set_V(uint8_t index, uint8_t value) {
    if (index < 16) {
        V[index] = value;
    } else {
        throw std::out_of_range("Register index out of range");
    }
}

bool CPU::is_waiting_for_key() const { 
    return waiting_for_key;
}

void CPU::handle_key_press(uint8_t key) {
    if (waiting_for_key) {
        V[key_register] = key;
        waiting_for_key = false;
        PC += 2;  // Advance to next instruction
    }
}