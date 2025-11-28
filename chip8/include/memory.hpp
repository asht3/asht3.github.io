#pragma once
#include <cstdint>
#include <string>

class Memory {
    private:
        uint8_t memory[4096]; // 4K memory
        // const unsigned int FONTSET_SIZE = 80;
        static constexpr unsigned int FONTSET_SIZE = 80;

    public:
        Memory();
        void reset();
        uint8_t read(uint16_t address) const;
        void write(uint16_t address, uint8_t value);
        void load_rom(const std::string& filename, uint16_t start_address);
        void load_fontset();

        // For debugging
        // void dump(uint16_t start, uint16_t length) const;
};