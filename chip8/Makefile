# Native compilation
CC = g++
CXXFLAGS = -Wall -Wextra -Werror -g -Iinclude
LDFLAGS += -lSDL2

TARGET = chip8
SRCS = src/chip8.cpp src/main.cpp src/cpu.cpp src/display.cpp src/input.cpp src/memory.cpp src/sound.cpp src/exports.cpp
OBJS = $(patsubst src/%.cpp, obj/%.o, $(SRCS))

$(TARGET): $(OBJS)
	@mkdir -p obj
	$(CC) $(CXXFLAGS) -o $(TARGET) $(OBJS) $(LDFLAGS)

obj/%.o: src/%.cpp
	@mkdir -p obj
	$(CC) $(CXXFLAGS) -c $< -o $@

# WebAssembly compilation
# WebAssembly compilation
EMCC = emcc
WASM_FLAGS = -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_SDL=2 -s ALLOW_MEMORY_GROWTH=1 -s NO_DISABLE_EXCEPTION_CATCHING -s EXCEPTION_CATCHING_ALLOWED=all

WASM_EXPORTED_FUNCTIONS = ['_load_rom','_emulate_cycle','_should_draw','_get_display_buffer','_get_display_width','_get_display_height','_key_down','_key_up','_reset']
WASM_EXPORTED_RUNTIME_METHODS = ['ccall','cwrap']

WASM_TARGET = wasm/chip8.js
WASM_SRCS = src/chip8.cpp src/cpu.cpp src/display.cpp src/input.cpp src/memory.cpp src/sound.cpp src/exports.cpp  # Remove main.cpp for WebAssembly

$(WASM_TARGET): $(WASM_SRCS)
	@mkdir -p wasm
	@echo "Building WebAssembly module..."
	EMCC_DEBUG=1 $(EMCC) $(WASM_SRCS) -o $(WASM_TARGET) $(WASM_FLAGS) \
		-s EXPORTED_FUNCTIONS=$(WASM_EXPORTED_FUNCTIONS) \
		-s EXPORTED_RUNTIME_METHODS=$(WASM_EXPORTED_RUNTIME_METHODS) \
		-Iinclude \
		-s ENVIRONMENT=web \
		-s SINGLE_FILE=1

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