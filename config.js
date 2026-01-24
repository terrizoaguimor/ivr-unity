/**
 * IVR Unity Financial - Configuration
 * Replace 'TU_API_KEY_AQUI' with your ElevenLabs API key
 */
const ELEVENLABS_CONFIG = {
  apiKey: 'sk_dd91fb09de472750ce3e99df73978cdff4f2614f7d6c1cd9',

  // Voice IDs from ElevenLabs
  voices: {
    spanish: 'EXAVITQu4vr4xnSDxMaL',  // Rachel - natural Spanish
    english: 'EXAVITQu4vr4xnSDxMaL'   // Same voice for consistency
  },

  // Model configuration
  modelId: 'eleven_multilingual_v2',

  // Voice settings
  stability: 0.5,
  similarityBoost: 0.75,

  // API endpoint
  apiUrl: 'https://api.elevenlabs.io/v1/text-to-speech'
};

// IVR Configuration
const IVR_CONFIG = {
  // Timeout in milliseconds before repeating message
  inputTimeout: 8000,

  // Maximum retries before transferring to agent
  maxRetries: 3,

  // Delay between menu options (ms)
  optionDelay: 300,

  // Training mode - slower pace
  trainingMode: false,
  trainingDelay: 1500
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ELEVENLABS_CONFIG, IVR_CONFIG };
}
