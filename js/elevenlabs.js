/**
 * IVR Unity Financial - ElevenLabs TTS Client
 * Handles text-to-speech conversion using ElevenLabs API
 */

class ElevenLabsClient {
  constructor(config = ELEVENLABS_CONFIG) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl;
    this.modelId = config.modelId;
    this.stability = config.stability;
    this.similarityBoost = config.similarityBoost;
    this.voices = config.voices;
    this.isReady = false;
  }

  /**
   * Initialize the client
   */
  init() {
    this.isReady = this.apiKey && this.apiKey !== 'TU_API_KEY_AQUI';
    console.log('[ElevenLabs] Client initialized, ready:', this.isReady);
    return this.isReady;
  }

  /**
   * Update the API key
   * @param {string} apiKey - New API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.isReady = apiKey && apiKey.length > 0;
    console.log('[ElevenLabs] API key updated, ready:', this.isReady);
  }

  /**
   * Get voice ID based on language
   * @param {string} language - 'en' or 'es'
   * @returns {string}
   */
  getVoiceId(language = 'es') {
    return language === 'en' ? this.voices.english : this.voices.spanish;
  }

  /**
   * Convert text to speech
   * @param {string} text - Text to convert
   * @param {string} language - Language code ('en' or 'es')
   * @returns {Promise<Blob>} - Audio blob
   */
  async textToSpeech(text, language = 'es') {
    if (!this.isReady) {
      throw new Error('ElevenLabs client not configured. Please set API key.');
    }

    const voiceId = this.getVoiceId(language);
    const url = `${this.apiUrl}/${voiceId}`;

    console.log('[ElevenLabs] Converting text to speech:', text.substring(0, 50) + '...');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: this.modelId,
          voice_settings: {
            stability: this.stability,
            similarity_boost: this.similarityBoost
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const audioBlob = await response.blob();
      console.log('[ElevenLabs] Audio generated, size:', audioBlob.size);

      return audioBlob;
    } catch (error) {
      console.error('[ElevenLabs] TTS error:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech with caching
   * @param {string} text - Text to convert
   * @param {string} language - Language code
   * @param {AudioManager} audioManager - Audio manager for caching
   * @returns {Promise<Blob>}
   */
  async textToSpeechCached(text, language = 'es', cacheManager = null) {
    const cacheKey = `${language}:${text}`;

    // Check cache first
    if (cacheManager) {
      const cached = cacheManager.getFromCache(cacheKey);
      if (cached) {
        console.log('[ElevenLabs] Using cached audio');
        return cached;
      }
    }

    // Generate new audio
    const audioBlob = await this.textToSpeech(text, language);

    // Cache the result
    if (cacheManager) {
      cacheManager.addToCache(cacheKey, audioBlob);
    }

    return audioBlob;
  }

  /**
   * Test the API connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    if (!this.isReady) {
      return false;
    }

    try {
      const testBlob = await this.textToSpeech('Test', 'en');
      return testBlob.size > 0;
    } catch (error) {
      console.error('[ElevenLabs] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available voices (for future expansion)
   * @returns {Promise<Array>}
   */
  async getVoices() {
    if (!this.isReady) {
      throw new Error('ElevenLabs client not configured');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('[ElevenLabs] Error fetching voices:', error);
      throw error;
    }
  }

  /**
   * Check if the client is ready
   * @returns {boolean}
   */
  checkReady() {
    return this.isReady;
  }
}

// Create global instance
const elevenLabsClient = new ElevenLabsClient();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ElevenLabsClient, elevenLabsClient };
}
