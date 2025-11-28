# Native compilation
CC = g++
CXXFLAGS = -Wall -Wextra -Werror -g -Iinclude
LDFLAGS += -lSDL2

TARGET = chip8
SRCS = src/chip8.cpp src/main.cpp src/cpu.cpp src/display.cpp src/input.cpp src/memory.cpp src/sound.cpp
OBJS = $(patsubst src/%.cpp, obj/%.o, $(SRCS))

$(TARGET): $(OBJS)
	@mkdir -p obj
	$(CC) $(CXXFLAGS) -o $(TARGET) $(OBJS) $(LDFLAGS)

obj/%.o: src/%.cpp
	@mkdir -p obj
	$(CC) $(CXXFLAGS) -c $< -o $@

# WebAssembly compilation
EMCC = emcc
WASM_FLAGS = -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_SDL=2 -s ALLOW_MEMORY_GROWTH=1
# Remove the main function from exports since it might conflict
WASM_EXPORTED_FUNCTIONS = _main,_load_rom_wrapper,_emulate_cycle_wrapper,_should_draw_wrapper,_get_display_buffer_wrapper,_get_display_width_wrapper,_get_display_height_wrapper,_key_down_wrapper,_key_up_wrapper,_reset_wrapper
WASM_EXPORTED_RUNTIME_METHODS = ccall,cwrap

WASM_TARGET = wasm/chip8.js
WASM_SRCS = $(SRCS)

$(WASM_TARGET): $(WASM_SRCS)
	@mkdir -p wasm
	@echo "Building WebAssembly module..."
	EMCC_DEBUG=1 $(EMCC) $(WASM_SRCS) -o $(WASM_TARGET) $(WASM_FLAGS) \
		-s EXPORTED_FUNCTIONS='[$(WASM_EXPORTED_FUNCTIONS)]' \
		-s EXPORTED_RUNTIME_METHODS='[$(WASM_EXPORTED_RUNTIME_METHODS)]' \
		-Iinclude \
		--preload-file roms@/roms \
		-s ENVIRONMENT=web \
		-s SINGLE_FILE=0

# Build both native and WebAssembly
all: $(TARGET) $(WASM_TARGET)

# WebAssembly with fallback to Docker
wasm:
	@if command -v emcc >/dev/null 2>&1; then \
		echo "Using native Emscripten..."; \
		$(MAKE) $(WASM_TARGET); \
	else \
		echo "Emscripten not found, using Docker..."; \
		$(MAKE) wasm-docker; \
	fi

clean:
	rm -f $(TARGET) obj/*.o

fclean: clean
	rm -f $(TARGET) wasm/*.js wasm/*.wasm wasm/*.data

re: fclean all

run: $(TARGET)
	./$(TARGET)

# Run WebAssembly build
run-wasm: wasm
	@echo "WebAssembly files built in wasm/ directory"
	@echo "Serve with: python3 -m http.server 8000"
	@echo "Then open: http://localhost:8000"


.PHONY: clean fclean re run wasm run-wasm all