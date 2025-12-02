// WebAssembly wrapper for your Mastermind game
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <emscripten.h>

// Forward declarations matching your header
typedef struct {
    char code[5];
    int attempts;
    int wellplaced_pieces;
    int misplaced_pieces;
    int freq[9];
} GameState;

// WebAssembly API - simplified for your manager
EMSCRIPTEN_KEEPALIVE
GameState* mastermind_create() {
    GameState* game = (GameState*)malloc(sizeof(GameState));
    if (!game) return NULL;
    
    memset(game, 0, sizeof(GameState));
    game->attempts = 0;
    return game;
}

EMSCRIPTEN_KEEPALIVE
void mastermind_destroy(GameState* game) {
    if (game) free(game);
}

EMSCRIPTEN_KEEPALIVE
void mastermind_new_random_game(GameState* game) {
    if (!game) return;
    
    srand(time(NULL));
    for (int i = 0; i < 4; i++) {
        game->code[i] = '0' + (rand() % 8); // 0-7
    }
    game->code[4] = '\0';
    game->attempts = 0;
    game->wellplaced_pieces = 0;
    game->misplaced_pieces = 0;
    memset(game->freq, 0, sizeof(game->freq));
}

EMSCRIPTEN_KEEPALIVE
void mastermind_new_custom_game(GameState* game, const char* code) {
    if (!game || !code || strlen(code) != 4) return;
    
    strncpy(game->code, code, 5);
    game->attempts = 0;
    game->wellplaced_pieces = 0;
    game->misplaced_pieces = 0;
    memset(game->freq, 0, sizeof(game->freq));
}

// Helper function to convert int array to string
EMSCRIPTEN_KEEPALIVE
char* mastermind_guess_to_string(const int* guess) {
    static char result[5];
    for (int i = 0; i < 4; i++) {
        result[i] = '0' + guess[i];
    }
    result[4] = '\0';
    return result;
}

// Main game logic - returns feedback as "correct,misplaced"
EMSCRIPTEN_KEEPALIVE
char* mastermind_check_guess(GameState* game, const int* guess_array) {
    if (!game) return "0,0";
    
    char guess[5];
    for (int i = 0; i < 4; i++) {
        guess[i] = '0' + guess_array[i];
    }
    guess[4] = '\0';
    
    // Your existing compare_code logic
    int wellplaced = 0;
    int misplaced = 0;
    int secret_freq[8] = {0};
    int guess_freq[8] = {0};
    
    // Count well-placed
    for (int i = 0; i < 4; i++) {
        if (game->code[i] == guess[i]) {
            wellplaced++;
        } else {
            secret_freq[game->code[i] - '0']++;
            guess_freq[guess[i] - '0']++;
        }
    }
    
    // Count misplaced
    for (int i = 0; i < 8; i++) {
        int min = secret_freq[i] < guess_freq[i] ? secret_freq[i] : guess_freq[i];
        misplaced += min;
    }
    
    game->attempts++;
    game->wellplaced_pieces = wellplaced;
    game->misplaced_pieces = misplaced;
    
    // Return as "correct,misplaced"
    static char result[20];
    snprintf(result, sizeof(result), "%d,%d", wellplaced, misplaced);
    return result;
}

EMSCRIPTEN_KEEPALIVE
char* mastermind_get_secret_code(GameState* game) {
    return game ? game->code : "";
}

EMSCRIPTEN_KEEPALIVE
int mastermind_get_attempts(GameState* game) {
    return game ? game->attempts : 0;
}

EMSCRIPTEN_KEEPALIVE
int mastermind_is_game_won(GameState* game) {
    return game && game->wellplaced_pieces == 4;
}

EMSCRIPTEN_KEEPALIVE
int mastermind_is_game_over(GameState* game, int max_attempts) {
    return game && (game->attempts >= max_attempts || game->wellplaced_pieces == 4);
}