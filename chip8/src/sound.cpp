#include "../include/sound.hpp"

Sound::Sound() : device(0), sound_on(false) {}

Sound::~Sound() {
    cleanup();
}

bool Sound::init() {
    if (SDL_Init(SDL_INIT_AUDIO) < 0) {
        SDL_Log("Failed to initialize SDL audio: %s", SDL_GetError());
        return false;
    }

    SDL_AudioSpec desiredSpec;
    SDL_zero(desiredSpec);
    desiredSpec.freq = 44100;
    desiredSpec.format = AUDIO_F32SYS;
    desiredSpec.channels = 1;
    desiredSpec.samples = 2048;
    desiredSpec.callback = nullptr;

    SDL_AudioSpec obtainedSpec;
    device = SDL_OpenAudioDevice(nullptr, 0, &desiredSpec, &obtainedSpec, 0);
    if (device == 0) {
        SDL_Log("Failed to open audio device: %s", SDL_GetError());
        return false;
    }

    sound_on = true;
    SDL_PauseAudioDevice(device, 0); // Start audio playback
    return true;
}

void Sound::beep() {
    if (!sound_on) return;

    const int duration_ms = 100; // Duration of the beep
    const int sample_rate = 44100;
    const int num_samples = (duration_ms * sample_rate) / 1000;
    float* buffer = new float[num_samples];

    // Generate a simple sine wave for the beep sound
    const float frequency = 440.0f; // Frequency of the beep (A4)
    for (int i = 0; i < num_samples; ++i) {
        buffer[i] = 0.5f * sinf((2.0f * M_PI * frequency * i) / sample_rate);
    }

    SDL_QueueAudio(device, buffer, num_samples * sizeof(float));
    delete[] buffer;
}

void Sound::stop() {
    if (sound_on) {
        SDL_ClearQueuedAudio(device);
    }
}

void Sound::cleanup() {
    if (device != 0) {
        SDL_CloseAudioDevice(device);
        device = 0;
    }
    SDL_QuitSubSystem(SDL_INIT_AUDIO);
    sound_on = false;
}