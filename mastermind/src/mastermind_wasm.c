#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <emscripten.h>

typedef struct {
    char code[5];
    int attempts;
} GameState;

// Helper function that accepts string (easier for JS)
EMSCRIPTEN_KEEPALIVE
char* mastermind_check_guess_string(GameState* game, const char* guess_str) {
    if (!game || !guess_str) return "0,0";
    
    printf("DEBUG: Checking '%s' vs '%s'\n", guess_str, game->code);
    
    int correct = 0;
    int misplaced = 0;
    
    // 1. Count correct positions
    for (int i = 0; i < 4; i++) {
        if (game->code[i] == guess_str[i]) {
            correct++;
        }
    }
    
    // 2. Count misplaced
    int secret_count[8] = {0};
    int guess_count[8] = {0};
    
    for (int i = 0; i < 4; i++) {
        if (game->code[i] != guess_str[i]) {
            secret_count[game->code[i] - '0']++;
            guess_count[guess_str[i] - '0']++;
        }
    }
    
    for (int i = 0; i < 8; i++) {
        int min = secret_count[i] < guess_count[i] ? secret_count[i] : guess_count[i];
        misplaced += min;
    }
    
    game->attempts++;
    
    static char result[10];
    snprintf(result, sizeof(result), "%d,%d", correct, misplaced);
    
    printf("DEBUG: Result: %s\n", result);
    return result;
}

EMSCRIPTEN_KEEPALIVE
char* mastermind_check_guess(GameState* game, const char* guess_str) {
    if (!game || !guess_str) return "0,0";
    
    printf("DEBUG: Checking '%s' vs '%s' (current attempts: %d)\n", 
           guess_str, game->code, game->attempts);
    
    int correct = 0;
    int misplaced = 0;
    
    // Count correct positions
    for (int i = 0; i < 4; i++) {
        if (game->code[i] == guess_str[i]) {
            correct++;
        }
    }
    
    // Count misplaced
    int secret_count[8] = {0};
    int guess_count[8] = {0};
    
    for (int i = 0; i < 4; i++) {
        if (game->code[i] != guess_str[i]) {
            secret_count[game->code[i] - '0']++;
            guess_count[guess_str[i] - '0']++;
        }
    }
    
    for (int i = 0; i < 8; i++) {
        int min = secret_count[i] < guess_count[i] ? secret_count[i] : guess_count[i];
        misplaced += min;
    }
    
    // IMPORTANT: Increment attempts here, not in get_attempts
    game->attempts++;
    
    printf("DEBUG: Result: %d,%d (attempts now: %d)\n", 
           correct, misplaced, game->attempts);
    
    static char result[10];
    snprintf(result, sizeof(result), "%d,%d", correct, misplaced);
    
    return result;
}

// Rest of your functions (keep as is):
EMSCRIPTEN_KEEPALIVE
GameState* mastermind_create() {
    GameState* game = (GameState*)malloc(sizeof(GameState));
    if (!game) return NULL;
    
    memset(game, 0, sizeof(GameState));
    game->attempts = 0;
    strcpy(game->code, "0000");
    
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
        game->code[i] = '0' + (rand() % 8);
    }
    game->code[4] = '\0';
    game->attempts = 0;
    
    printf("DEBUG: Random code: %s\n", game->code);
}

EMSCRIPTEN_KEEPALIVE
void mastermind_new_custom_game(GameState* game, const char* code) {
    if (!game || !code) return;
    
    strncpy(game->code, code, 4);
    game->code[4] = '\0';
    game->attempts = 0;
    
    printf("DEBUG: Custom code: %s\n", game->code);
}

EMSCRIPTEN_KEEPALIVE
char* mastermind_get_secret_code(GameState* game) {
    return game ? game->code : "";
}

EMSCRIPTEN_KEEPALIVE
int mastermind_get_attempts(GameState* game) {
    if (!game) return 0;
    printf("DEBUG: get_attempts returning: %d\n", game->attempts);
    return game->attempts;
}

EMSCRIPTEN_KEEPALIVE
int mastermind_is_game_won(GameState* game) {
    // Simplified - always check via feedback
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int mastermind_is_game_over(GameState* game, int max_attempts) {
    return game && game->attempts >= max_attempts;
}