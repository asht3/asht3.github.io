#include "../include/memory.hpp"
#include <algorithm>
#include <stdexcept>
#include <fstream>
#include <iostream> // For debugging output
#include <iomanip>  // For std::setw and std::setfill
#include <cstring>

Memory::Memory() {
    reset();
}

void Memory::reset() {
    // Initialize memory to zero
    std::fill(std::begin(memory), std::end(memory), 0);
    load_fontset();
}

// void Memory::dump(uint16_t start, uint16_t length) const {
//     std::cout << "Memory dump from 0x" << std::hex << start << ":\n";
//     for (uint16_t i = start; i < start + length; i++) {
//         if ((i - start) % 16 == 0) {
//             std::cout << "\n0x" << std::hex << i << ": ";
//         }
//         std::cout << std::hex << std::setw(2) << std::setfill('0') 
//                   << static_cast<int>(memory[i]) << " ";
//     }
//     std::cout << std::endl;
// }

uint8_t Memory::read(uint16_t address) const {
    if (address >= 4096) {
        throw std::out_of_range("Memory read out of bounds");
    }
    return memory[address];
}

void Memory::write(uint16_t address, uint8_t value) {
    if (address >= 4096) {
        throw std::out_of_range("Memory write out of bounds");
    }
    memory[address] = value;
}
void Memory::load_rom(const std::string& filename, uint16_t start_address) {
    // std::cout << "Opening: " << filename << std::endl;
    
    FILE* file = fopen(filename.c_str(), "rb");
    if (!file) {
        throw std::runtime_error("Failed to open file: " + std::string(strerror(errno)));
    }
    
    // Get file size
    fseek(file, 0, SEEK_END);
    long unsigned int file_size = ftell(file);
    rewind(file);
    
    std::cout << "File size: " << file_size << " bytes" << std::endl; // Debug
    
    if (start_address + file_size > sizeof(memory)) {
        fclose(file);
        throw std::runtime_error("ROM too large for memory");
    }
    
    // Read the file
    long unsigned int bytes_read = fread(&memory[start_address], 1, file_size, file);
    fclose(file);
    
    std::cout << "Bytes actually read: " << bytes_read << std::endl; // Debug
    
    if (bytes_read != file_size) {
        throw std::runtime_error("Failed to read complete file. Read " + 
                               std::to_string(bytes_read) + " of " + 
                               std::to_string(file_size));
    }
    
    // Verify the load
    // std::cout << "First 32 bytes of ROM:" << std::endl;
    // for (int i = 0; i < 32; i++) {
    //     std::cout << std::hex << std::setw(2) << std::setfill('0') 
    //               << static_cast<int>(memory[start_address + i]) << " ";
    //     if (i % 16 == 15) std::cout << std::endl;
    // }
}

void Memory::load_fontset() {
    uint8_t fontset[FONTSET_SIZE] = {
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    };

    // Start loading fontset at memory location 0x50 (80)
    for (unsigned int i = 0; i < FONTSET_SIZE; ++i) {
        memory[0x50 + i] = fontset[i];
    }
}