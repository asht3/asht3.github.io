#pragma once
#include <SDL2/SDL.h>

class Sound {
private:
    SDL_AudioDeviceID device;
    bool sound_on;
    
public:
    Sound();
    ~Sound();
    
    bool init();
    void beep();
    void stop();
    void cleanup();
};