#ifndef MASTERMIND_WASM_H
#define MASTERMIND_WASM_H

#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
    #endif

    // Opaque pointer to GameState
    typedef struct GameState GameState;

    // Game lifecycle
    GameState* mastermind_create(void);
    void mastermind_destroy(GameState* game);
    void mastermind_new_random_game(GameState* game);
    void mastermind_new_custom_game(GameState* game, const char* code);

    // Game actions
    char* mastermind_check_guess(GameState* game, const int* guess_array);
    char* mastermind_guess_to_string(const int* guess);

    // Game info
    char* mastermind_get_secret_code(GameState* game);
    int mastermind_get_attempts(GameState* game);
    int mastermind_is_game_won(GameState* game);
    int mastermind_is_game_over(GameState* game, int max_attempts);

    #ifdef __cplusplus
}
#endif

#endif