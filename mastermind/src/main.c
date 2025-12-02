#include "../include/my_mastermind.h"

int main(int argc, char* argv[]) {
    GameState game;

    initialize_game(&game, argc, argv);

    char buffer[BUFFER_SIZE];
    ssize_t bytes_read;

    print_message(START_MESSAGE, START_MSG_SIZE);
    print_message(PROMPT, PROMPT_SIZE);

    for (int i = 0; i < get_attempts(&game); i++) {
        printf("---\nRound%d\n", i);
        
        if (get_guess(&game, buffer, &bytes_read) == NULL) {
            return 0;
        }

        if (win_status(&game)) {
            print_message(WIN_MESSAGE, WIN_MSG_SIZE);
            break;
        }
        else {
            printf("Well placed pieces: %d\n", get_wellplaced_pieces(&game));
            printf("Misplaced pieces: %d\n", get_misplaced_pieces(&game));
        }
    }

    if (!win_status(&game)) {
        printf("Game Over. You are out of attempts.\n");
    }

    return 0;
}
