#include "../include/my_mastermind.h"

void set_random_code(GameState* game) {
    srand(time(NULL));

    //generate 4 digit secret code
    for (int i = 0; i < 4; i++) {
        //generates a digit between 0 and 8 then converts it to its ASCII value
        game->code[i] = rand() % 9 + '0';
    }

    game->code[4] = '\0';
}

void set_user_code(GameState* game, char* user_input) {
    strncpy(game->code, user_input, 4);
    game->code[4] = '\0';
}

void set_attempts(GameState* game, int num) {
    game->attempts = num;
}

char* get_code(GameState* game) {
    return game->code;
}

int get_attempts(GameState* game) {
    return game->attempts;
}

int get_wellplaced_pieces(GameState* game) {
    return game->wellplaced_pieces;
}

int get_misplaced_pieces(GameState* game) {
    return game->misplaced_pieces;
}

void print_message(char* message, int size) {
    write(1, message, size);
}

void clean() {
    //Clears remaining user input from stdin
    char c;
    while(read(0, &c, 1) > 0 && c != '\n') {}
}

void find_freq(GameState* game){
    //initializes array elements to 0
    
    for (int i = 0; i < FREQ_ARR_SIZE; i++) {
        game->freq[i] = 0;
    }

    //gets the frequency of each digit in secret code
    for (int i = 0; i < VALID_CODE_LENGTH; i++) {
        int index = get_code(game)[i] - '0';
        game->freq[index]++;
    }
}

int win_status(GameState *game) {
    //secret code was found
    if (get_wellplaced_pieces(game) == VALID_CODE_LENGTH) {
        return 1;
    }

    return 0;
}
