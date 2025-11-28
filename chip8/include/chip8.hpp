#include "display.hpp"
#include "memory.hpp"
#include "cpu.hpp"
#include "input.hpp"

class Chip8 {
    private:
        CPU cpu;
        Memory memory;
        Display display;
        Input input;
        bool running;

    public:
        Chip8();
        void reset();
        void emulate_cycle();
        void run();
        void stop();
        void load_rom(const char* filename);
        Display& get_display();
        Input& get_input();
        bool is_running();
        CPU& get_cpu();
        Memory& get_memory();
};