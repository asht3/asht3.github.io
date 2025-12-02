#ifndef MY_MASTERMIND_H
#define MY_MASTERMIND_H

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

#define DEFAULT_NUM_OF_ATTEMPTS 10
#define BUFFER_SIZE 5
#define VALID_CODE_LENGTH 4
#define FREQ_ARR_SIZE 9
#define START_MSG_SIZE 32
#define PROMPT_SIZE 27
#define ERROR_MSG_SIZE 13
#define WIN_MSG_SIZE 22
#define GAME_OVER_MSG_SIZE 11
#define START_MESSAGE "Will you find the secret code?\n"
#define PROMPT "Please enter a valid guess\n"
#define ERROR_MESSAGE "Wrong Input!\n"
#define WIN_MESSAGE "Congratz! You did it!\n"
#define GAME_OVER_MESSAGE "Game Over!\n"

typedef struct {
    char code[5];
    int attempts;
    int wellplaced_pieces;
    int misplaced_pieces;
    int freq[FREQ_ARR_SIZE];
} GameState;

void set_random_code(GameState* game);
void set_user_code(GameState* game, char* user_input);
char* get_code(GameState* game);
void initialize_game(GameState* game, int argc, char* argv[]);
void set_attempts(GameState* game, int num);
int get_attempts(GameState* game);
void update_wellplaced_pieces(GameState* game, int num);
void update_misplaced_pieces(GameState* game, int num);
int get_wellplaced_pieces(GameState* game);
int get_misplaced_pieces(GameState* game);
char* get_guess(GameState* game, char* buffer, ssize_t* bytes_read);
int check_guess_validity(char* buffer, ssize_t bytes_read);
void clean();
void print_message(char* message, int size);
void compare_code(GameState* game, char* buffer);
int win_status(GameState* game);
void find_freq(GameState* game);

#endif
