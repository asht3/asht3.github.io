#pragma once
#include <cstdint>
#include "../include/memory.hpp"
#include "../include/display.hpp"
#include "../include/input.hpp"

class CPU {
    private:
        uint8_t V[16];        // Registers V0 to VF
        uint16_t I;           // Index register
        uint16_t PC;          // Program counter
        uint8_t delay_timer;  // Delay timer
        uint8_t sound_timer;  // Sound timer
        uint16_t stack[16];   // Stack for subroutine calls
        uint8_t SP;           // Stack pointer
        bool waiting_for_key; // Flag for waiting for key press
        uint8_t key_register;  // Register to store the key press

        uint16_t fetch_opcode(Memory& memory);

        // Opcode handlers
        void OP_00E0(Display& display);                   // Clear screen
        void OP_00EE();                                   // Return from subroutine
        void OP_1nnn(uint16_t opcode);                    // Jump to address
        void OP_2nnn(uint16_t opcode);                    // Call subroutine
        void OP_3xkk(uint16_t opcode);                    // Skip if Vx == kk
        void OP_4xkk(uint16_t opcode);                    // Skip if Vx != kk
        void OP_5xy0(uint16_t opcode);                    // Skip if Vx == Vy
        void OP_6xkk(uint16_t opcode);                    // Set Vx = kk
        void OP_7xkk(uint16_t opcode);                    // Add kk to Vx
        void OP_8xy0(uint16_t opcode);                    // Set Vx = Vy
        void OP_8xy1(uint16_t opcode);                    // Set Vx = Vx OR Vy
        void OP_8xy2(uint16_t opcode);                    // Set Vx = Vx AND Vy
        void OP_8xy3(uint16_t opcode);                    // Set Vx = Vx XOR Vy
        void OP_8xy4(uint16_t opcode);                    // Add Vy to Vx (with carry)
        void OP_8xy5(uint16_t opcode);                    // Subtract Vy from Vx
        void OP_8xy6(uint16_t opcode);                    // Shift Vx right
        void OP_8xy7(uint16_t opcode);                    // Set Vx = Vy - Vx
        void OP_8xyE(uint16_t opcode);                    // Shift Vx left
        void OP_9xy0(uint16_t opcode);                    // Skip if Vx != Vy
        void OP_Annn(uint16_t opcode);                    // Set I = nnn
        void OP_Bnnn(uint16_t opcode);                    // Jump to V0 + nnn
        void OP_Cxkk(uint16_t opcode);                    // Set Vx = random byte AND kk
        void OP_Dxyn(Memory& memory, Display& display, uint16_t opcode);  // Draw sprite
        void OP_Ex9E(uint16_t opcode, Input& keys);        // Skip if key pressed
        void OP_ExA1(uint16_t opcode, Input& keys);        // Skip if key not pressed
        void OP_Fx07(uint16_t opcode);                    // Set Vx = delay timer
        void OP_Fx0A(uint16_t opcode, Input& keys);        // Wait for key press
        void OP_Fx15(uint16_t opcode);                    // Set delay timer = Vx
        void OP_Fx18(uint16_t opcode);                    // Set sound timer = Vx
        void OP_Fx1E(uint16_t opcode);                    // Set I = I + Vx
        void OP_Fx29(uint16_t opcode);                    // Set I to sprite address for character in Vx
        void OP_Fx33(uint16_t opcode, Memory& memory);   // Store BCD representation of Vx in memory
        void OP_Fx55(uint16_t opcode, Memory& memory);   // Store registers V0 through Vx in memory
        void OP_Fx65(uint16_t opcode, Memory& memory);   // Read registers V0 through Vx from memory

    public:
        const unsigned int START_ADDRESS = 0x200;

        CPU();
        void reset();
        void execute_cycle(Memory& memory, Display& display, Input& keys);
        void update_timers();
        uint8_t get_sound_timer() const;
        uint16_t get_pc() const;
        void set_pc(uint16_t address);
        void add_to_pc(uint16_t offset);
        void set_V(uint8_t index, uint8_t value);
        void push_stack(uint16_t address);
        uint16_t pop_stack();
        bool is_waiting_for_key() const;
        void handle_key_press(uint8_t key);
};