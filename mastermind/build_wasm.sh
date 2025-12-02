#!/bin/bash
# Build Mastermind WebAssembly

set -e

echo "🔧 Building Mastermind WebAssembly..."

mkdir -p ../public/wasm
mkdir -p build

emcc src/mastermind_wasm.c \
    -I./include \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME='MastermindWasm' \
    -s EXPORTED_FUNCTIONS="['_mastermind_create', '_mastermind_destroy', '_mastermind_new_random_game', '_mastermind_new_custom_game', '_mastermind_check_guess', '_mastermind_check_guess_string', '_mastermind_get_secret_code', '_mastermind_get_attempts', '_mastermind_is_game_won', '_mastermind_is_game_over', '_malloc', '_free']" \
    -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "UTF8ToString", "allocateUTF8"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s ENVIRONMENT='web' \
    -s NO_EXIT_RUNTIME=1 \
    -O3 \
    -o ../public/wasm/mastermind_wasm.js

echo "✅ Build complete!"