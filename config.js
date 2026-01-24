/**
 * IVR Unity Financial - Configuration
 * API Key is injected via environment variable at build time
 */
const ELEVENLABS_CONFIG = {
  // API Key loaded from environment or localStorage
  apiKey: window.ELEVENLABS_API_KEY || '',

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
