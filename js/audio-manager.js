/**
 * IVR Unity Financial - Audio Manager
 * Handles audio playback, queue management, and caching
 */

class AudioManager {
  constructor() {
    this.audioElement = null;
    this.audioQueue = [];
    this.isPlaying = false;
    this.cache = new Map();
    this.onPlayStart = null;
    this.onPlayEnd = null;
    this.onError = null;
    this.currentSource = null;
  }

  /**
   * Initialize the audio manager
   * @param {HTMLAudioElement} audioElement - The audio element to use for playback
   */
  init(audioElement) {
    this.audioElement = audioElement;
    this.setupEventListeners();
    console.log('[AudioManager] Initialized');
  }

  /**
   * Set up audio element event listeners
   */
  setupEventListeners() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('ended', () => {
      console.log('[AudioManager] Playback ended');
      this.isPlaying = false;
      this.currentSource = null;
      if (this.onPlayEnd) {
        this.onPlayEnd();
      }
      this.playNext();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('[AudioManager] Playback error:', e);
      this.isPlaying = false;
      this.currentSource = null;
      if (this.onError) {
        this.onError(e);
      }
      this.playNext();
    });

    this.audioElement.addEventListener('play', () => {
      console.log('[AudioManager] Playback started');
      this.isPlaying = true;
      if (this.onPlayStart) {
        this.onPlayStart();
      }
    });
  }

  /**
   * Play audio from a blob or URL
   * @param {Blob|string} source - Audio blob or URL
   * @param {boolean} priority - If true, play immediately (clear queue)
   * @returns {Promise<void>}
   */
  async play(source, priority = false) {
    if (priority) {
      this.stop();
      this.audioQueue = [];
    }

    return new Promise((resolve, reject) => {
      this.audioQueue.push({ source, resolve, reject });

      if (!this.isPlaying) {
        this.playNext();
      }
    });
  }

  /**
   * Play the next item in the queue
   */
  async playNext() {
    if (this.audioQueue.length === 0 || this.isPlaying) {
      return;
    }

    const { source, resolve, reject } = this.audioQueue.shift();

    try {
      let audioUrl;

      if (source instanceof Blob) {
        audioUrl = URL.createObjectURL(source);
        this.currentSource = audioUrl;
      } else if (typeof source === 'string') {
        audioUrl = source;
        this.currentSource = source;
      } else {
        throw new Error('Invalid audio source');
      }

      this.audioElement.src = audioUrl;

      // Wait for the audio to be ready
      await new Promise((res, rej) => {
        const onCanPlay = () => {
          this.audioElement.removeEventListener('canplaythrough', onCanPlay);
          this.audioElement.removeEventListener('error', onError);
          res();
        };
        const onError = (e) => {
          this.audioElement.removeEventListener('canplaythrough', onCanPlay);
          this.audioElement.removeEventListener('error', onError);
          rej(e);
        };
        this.audioElement.addEventListener('canplaythrough', onCanPlay);
        this.audioElement.addEventListener('error', onError);
        this.audioElement.load();
      });

      await this.audioElement.play();

      // Wait for playback to complete
      await new Promise((res) => {
        const onEnded = () => {
          this.audioElement.removeEventListener('ended', onEnded);
          // Clean up blob URL if necessary
          if (source instanceof Blob) {
            URL.revokeObjectURL(audioUrl);
          }
          res();
        };
        this.audioElement.addEventListener('ended', onEnded);
      });

      resolve();
    } catch (error) {
      console.error('[AudioManager] Error playing audio:', error);
      reject(error);
    }
  }

  /**
   * Stop current playback
   */
  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isPlaying = false;
    this.currentSource = null;
  }

  /**
   * Clear the audio queue
   */
  clearQueue() {
    this.audioQueue = [];
  }

  /**
   * Check if audio is currently playing
   * @returns {boolean}
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  /**
   * Get cached audio by key
   * @param {string} key - Cache key
   * @returns {Blob|null}
   */
  getFromCache(key) {
    return this.cache.get(key) || null;
  }

  /**
   * Add audio to cache
   * @param {string} key - Cache key
   * @param {Blob} audioBlob - Audio data
   */
  addToCache(key, audioBlob) {
    // Limit cache size to prevent memory issues
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, audioBlob);
  }

  /**
   * Clear the audio cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Set callback for when playback starts
   * @param {Function} callback
   */
  setOnPlayStart(callback) {
    this.onPlayStart = callback;
  }

  /**
   * Set callback for when playback ends
   * @param {Function} callback
   */
  setOnPlayEnd(callback) {
    this.onPlayEnd = callback;
  }

  /**
   * Set callback for playback errors
   * @param {Function} callback
   */
  setOnError(callback) {
    this.onError = callback;
  }

  /**
   * Get audio duration
   * @returns {number}
   */
  getDuration() {
    return this.audioElement ? this.audioElement.duration : 0;
  }

  /**
   * Get current playback time
   * @returns {number}
   */
  getCurrentTime() {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }
}

// Create global instance
const audioManager = new AudioManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioManager, audioManager };
}
