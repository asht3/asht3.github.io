#include "../include/my_mastermind.h"

void initialize_game(GameState* game, int argc, char* argv[]) {
    if (argc > 1) {
        //sets a specified secret code
        if (strcmp("-c", argv[1]) == 0) {
            set_user_code(game, argv[2]);
            set_attempts(game, DEFAULT_NUM_OF_ATTEMPTS);
        }
        //sets a specified number of attempts
        else if (strcmp("-t", argv[1]) == 0) {
            set_random_code(game);
            set_attempts(game, atoi(argv[2]));
        }
    }
    else {
        set_random_code(game);
        set_attempts(game, DEFAULT_NUM_OF_ATTEMPTS);
    }

    update_wellplaced_pieces(game, 0);
    update_misplaced_pieces(game, 0);
    find_freq(game); //find the frequency of each digit in secret code
}

void update_wellplaced_pieces(GameState* game, int num) {
    game->wellplaced_pieces = num;
}

void update_misplaced_pieces(GameState* game, int num) {
    game->misplaced_pieces = num;
}

char* get_guess(GameState* game, char* buffer, ssize_t* bytes_read) {
    *bytes_read = 0; // stores num of bytes read from user

    for (int i = 0; i < BUFFER_SIZE; i++) {
        ssize_t bytes = read(0, &buffer[i], 1);

        //handles EOF
        if (bytes == 0) {
            return NULL;
        }

        //null terminates string
        if (buffer[*bytes_read] == '\n') {
            buffer[i] = '\0';
            break;
        }

        (*bytes_read)++;
    }

    if (!check_guess_validity(buffer, *bytes_read)) {
        return get_guess(game, buffer, bytes_read);
    }
    else {
        compare_code(game, buffer);
    }
    
    return buffer;
}

int check_guess_validity(char* buffer, ssize_t bytes_read) {
    int isValid = 1;

    //Check if user input is valid
    for (int i = 0; i < bytes_read; i++) {
        if (buffer[i] < '0' || buffer[i] > '9') {
            isValid = 0;
        }
    }

    //Print error message
    if (!isValid || bytes_read != VALID_CODE_LENGTH) {
        print_message(ERROR_MESSAGE, ERROR_MSG_SIZE);

        //cleans stdin for long inputs
        if (bytes_read > 4) {
            clean();
        }

        return 0;
    }
    
    return 1;
}

void compare_code(GameState* game, char* buffer) {
    int pieces[VALID_CODE_LENGTH]; //stores misplaced/wellplaced pieces at an index
    int user_freq[FREQ_ARR_SIZE]; //stores the frequency of each digit in user's guess
    int wp = 0; //stores number of wellplaced pieces for current guess
    int mp = 0; //stores number of misplaced pieces for current guess

    int i = 0;

    while (i < FREQ_ARR_SIZE) {
        user_freq[i] = 0;
        i++;
    }

    i = 0;

    //gets frequency of each digit in user input
    while (i < BUFFER_SIZE) {
        int index = buffer[i] - '0';
        user_freq[index]++;
        i++;
    }

    i = 0;

    //initialize pieces
    while (i < VALID_CODE_LENGTH) {
        pieces[i] = -1;
        i++;
    }

    i = 0;

    //iterate through user input
    while (i < VALID_CODE_LENGTH) {
        int index = get_code(game)[i] - '0';

        if (buffer[i] == get_code(game)[i]) {
            pieces[i] = 1; //wellplaced piece at index
            user_freq[index]--;
            wp++;
        }

        i++;
    }

    i = 0;

    //iterate through secret code to find num of misplaced pieces
    while (i < VALID_CODE_LENGTH) {
        int index = get_code(game)[i] - '0';

        if (pieces[i] != 1) {
            if (user_freq[index] > 0 && game->freq[index] > 0) {
                pieces[i] = 0; //misplaced piece at index
                mp++;
                user_freq[index]--;
            }
        }

        i++;
    }

    //updates number of wellplaced and misplaced pieces for current guess
    update_wellplaced_pieces(game, wp);
    update_misplaced_pieces(game, mp);

}
