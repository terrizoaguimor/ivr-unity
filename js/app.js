/**
 * IVR Unity Financial - Main Application
 * Coordinates all components and handles UI interactions
 */

class IVRApp {
  constructor() {
    // Components
    this.audioManager = audioManager;
    this.ttsClient = elevenLabsClient;
    this.ivrEngine = ivrEngine;

    // UI Elements
    this.elements = {};

    // State
    this.isCallActive = false;
    this.callStartTime = null;
    this.callTimerInterval = null;
    this.isSpeaking = false;

    // Bind methods
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleHangup = this.handleHangup.bind(this);
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('[IVRApp] Initializing...');

    // Cache DOM elements
    this.cacheElements();

    // Initialize components
    this.audioManager.init(this.elements.audioPlayer);
    this.ttsClient.init();
    this.ivrEngine.init();

    // Set up event listeners
    this.setupEventListeners();

    // Set up IVR callbacks
    this.setupIVRCallbacks();

    // Load saved API key
    this.loadApiKey();

    // Update time display
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    console.log('[IVRApp] Initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Phone elements
      audioPlayer: document.getElementById('audioPlayer'),
      callStatus: document.getElementById('callStatus'),
      menuDisplay: document.getElementById('menuDisplay'),
      callTimer: document.getElementById('callTimer'),
      currentTime: document.getElementById('currentTime'),

      // Buttons
      btnCall: document.getElementById('btnCall'),
      btnHangup: document.getElementById('btnHangup'),
      btnReset: document.getElementById('btnReset'),
      btnClearTranscript: document.getElementById('btnClearTranscript'),
      btnSaveKey: document.getElementById('btnSaveKey'),
      btnToggleKey: document.getElementById('btnToggleKey'),

      // Inputs
      apiKeyInput: document.getElementById('apiKeyInput'),
      toggleTrainingMode: document.getElementById('toggleTrainingMode'),
      toggleDebug: document.getElementById('toggleDebug'),

      // Panels
      transcriptContent: document.getElementById('transcriptContent'),
      navigationHistory: document.getElementById('navigationHistory'),
      debugContent: document.getElementById('debugContent'),
      debugState: document.getElementById('debugState'),
      debugNode: document.getElementById('debugNode'),
      debugLastKey: document.getElementById('debugLastKey'),
      debugRetries: document.getElementById('debugRetries'),

      // Keys
      keys: document.querySelectorAll('.key'),

      // Phone container
      phone: document.querySelector('.phone')
    };
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Call buttons
    this.elements.btnCall.addEventListener('click', this.handleCall);
    this.elements.btnHangup.addEventListener('click', this.handleHangup);

    // Keypad
    this.elements.keys.forEach(key => {
      key.addEventListener('click', () => {
        const keyValue = key.dataset.key;
        this.handleKeyPress(keyValue);
      });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!this.isCallActive) return;

      const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];
      if (validKeys.includes(e.key)) {
        this.handleKeyPress(e.key);
        // Visual feedback
        const keyBtn = document.querySelector(`[data-key="${e.key}"]`);
        if (keyBtn) {
          keyBtn.classList.add('pressed');
          setTimeout(() => keyBtn.classList.remove('pressed'), 150);
        }
      }
    });

    // Reset button
    this.elements.btnReset.addEventListener('click', () => {
      this.reset();
    });

    // Clear transcript
    this.elements.btnClearTranscript.addEventListener('click', () => {
      this.clearTranscript();
    });

    // API key management
    this.elements.btnSaveKey.addEventListener('click', () => {
      this.saveApiKey();
    });

    this.elements.btnToggleKey.addEventListener('click', () => {
      const input = this.elements.apiKeyInput;
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    // Training mode toggle
    this.elements.toggleTrainingMode.addEventListener('change', (e) => {
      this.ivrEngine.setTrainingMode(e.target.checked);
    });

    // Debug toggle
    this.elements.toggleDebug.addEventListener('change', (e) => {
      this.elements.debugContent.style.display = e.target.checked ? 'block' : 'none';
    });

    // Audio events
    this.audioManager.setOnPlayStart(() => {
      this.isSpeaking = true;
      this.elements.phone.classList.add('speaking');
      this.updateCallStatus('Reproduciendo...', 'speaking');
    });

    this.audioManager.setOnPlayEnd(() => {
      this.isSpeaking = false;
      this.elements.phone.classList.remove('speaking');
      this.elements.phone.classList.add('waiting-input');
      this.updateCallStatus('Esperando entrada...', 'waiting');
    });
  }

  /**
   * Set up IVR engine callbacks
   */
  setupIVRCallbacks() {
    this.ivrEngine.setOnStateChange((node, history) => {
      this.updateMenuDisplay(node);
      this.updateNavigationHistory(history, node);
      this.updateDebugPanel();
    });

    this.ivrEngine.setOnMessage(async (message, language, node) => {
      this.addTranscriptEntry('system', message);

      try {
        // Generate and play TTS
        const audioBlob = await this.ttsClient.textToSpeechCached(
          message,
          language,
          this.audioManager
        );
        await this.audioManager.play(audioBlob);
      } catch (error) {
        console.error('[IVRApp] TTS error:', error);
        this.showError('Error al generar audio: ' + error.message);
      }
    });

    this.ivrEngine.setOnTransfer((node) => {
      this.updateCallStatus('Transfiriendo...', 'transferring');
      this.addTranscriptEntry('system', `[Transferencia a: ${node.queue || 'agente'}]`);

      // Simulate transfer (in a real system, this would connect to a queue)
      setTimeout(() => {
        this.updateCallStatus('En cola de espera', 'on-hold');
        this.elements.phone.classList.add('on-hold');
      }, 2000);
    });

    this.ivrEngine.setOnTimeout(() => {
      this.addTranscriptEntry('system', '[Tiempo de espera agotado]');
    });

    this.ivrEngine.setOnKeyPress((key) => {
      this.addTranscriptEntry('user', `Tecla presionada: ${key}`);
      this.updateDebugPanel(key);
    });

    this.ivrEngine.setOnError((error) => {
      this.showError(error);
    });
  }

  /**
   * Handle call button click
   */
  async handleCall() {
    if (this.isCallActive) return;

    // Check API key
    if (!this.ttsClient.checkReady()) {
      this.showError('Por favor configure su API key de ElevenLabs');
      return;
    }

    console.log('[IVRApp] Starting call...');

    this.isCallActive = true;
    this.callStartTime = Date.now();

    // Update UI
    this.elements.btnCall.disabled = true;
    this.elements.btnHangup.disabled = false;
    this.elements.phone.classList.add('on-call');
    this.elements.callTimer.style.display = 'flex';

    // Enable keypad
    this.elements.keys.forEach(key => key.disabled = false);

    // Start call timer
    this.startCallTimer();

    // Update status
    this.updateCallStatus('Conectando...', 'calling');
    this.elements.phone.classList.add('calling');

    // Clear previous session
    this.clearTranscript();
    this.elements.navigationHistory.innerHTML = '';

    // Start IVR
    setTimeout(() => {
      this.elements.phone.classList.remove('calling');
      this.updateCallStatus('En llamada', 'active');
      this.ivrEngine.start();
    }, 1000);
  }

  /**
   * Handle hangup button click
   */
  handleHangup() {
    if (!this.isCallActive) return;

    console.log('[IVRApp] Ending call...');

    this.isCallActive = false;

    // Stop IVR and audio
    this.ivrEngine.stop();
    this.audioManager.stop();
    this.audioManager.clearQueue();

    // Update UI
    this.elements.btnCall.disabled = false;
    this.elements.btnHangup.disabled = true;
    this.elements.phone.classList.remove('on-call', 'speaking', 'waiting-input', 'on-hold', 'calling');
    this.elements.callTimer.style.display = 'none';

    // Stop timer
    this.stopCallTimer();

    // Update status and display
    this.updateCallStatus('Llamada finalizada', 'ended');
    this.elements.menuDisplay.innerHTML = '<p class="welcome-text">Presione <strong>Llamar</strong> para iniciar</p>';

    // Add to transcript
    this.addTranscriptEntry('system', '[Llamada finalizada]');

    // Reset status after delay
    setTimeout(() => {
      this.updateCallStatus('Listo para llamar', 'ready');
    }, 2000);
  }

  /**
   * Handle key press
   * @param {string} key
   */
  handleKeyPress(key) {
    if (!this.isCallActive) return;

    // Stop current audio if speaking
    if (this.isSpeaking) {
      this.audioManager.stop();
      this.audioManager.clearQueue();
    }

    // Visual feedback
    const keyBtn = document.querySelector(`[data-key="${key}"]`);
    if (keyBtn) {
      keyBtn.classList.add('pressed');
      setTimeout(() => keyBtn.classList.remove('pressed'), 150);
    }

    // Play DTMF tone (optional)
    this.playDTMFTone(key);

    // Send to IVR engine
    this.ivrEngine.handleKeyPress(key);

    this.elements.phone.classList.remove('waiting-input');
  }

  /**
   * Play DTMF tone for key
   * @param {string} key
   */
  playDTMFTone(key) {
    // Simple DTMF tone generation using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };

      const [low, high] = frequencies[key] || [0, 0];
      if (low && high) {
        const duration = 0.15;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.1;
        gainNode.connect(audioContext.destination);

        [low, high].forEach(freq => {
          const osc = audioContext.createOscillator();
          osc.frequency.value = freq;
          osc.connect(gainNode);
          osc.start();
          osc.stop(audioContext.currentTime + duration);
        });
      }
    } catch (e) {
      // DTMF is optional, ignore errors
    }
  }

  /**
   * Update call status display
   * @param {string} text
   * @param {string} state
   */
  updateCallStatus(text, state) {
    const statusText = this.elements.callStatus.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = text;
    }
  }

  /**
   * Update menu display
   * @param {Object} node
   */
  updateMenuDisplay(node) {
    if (!node) return;

    const displayText = node.displayText || node.message;
    const lines = displayText.split('\n');

    let html = `<div class="menu-title">${node.icon || ''} ${lines[0]}</div>`;
    if (lines.length > 1) {
      html += '<div class="menu-options">';
      lines.slice(1).forEach(line => {
        if (line.trim()) {
          html += `<div class="menu-option">${line}</div>`;
        }
      });
      html += '</div>';
    }

    this.elements.menuDisplay.innerHTML = html;
  }

  /**
   * Update navigation history panel
   * @param {Array} history
   * @param {Object} currentNode
   */
  updateNavigationHistory(history, currentNode) {
    let html = '<div class="nav-tree">';

    // Add start node
    html += `
      <div class="nav-node start ${history.length === 0 && !currentNode ? 'active' : 'visited'}">
        <span class="node-icon">🏠</span>
        <span class="node-text">Inicio</span>
      </div>
    `;

    // Add history nodes
    history.forEach((stateName, index) => {
      const node = IVR_FLOW[stateName];
      if (node) {
        html += `
          <div class="nav-node visited">
            <span class="node-icon">${node.icon || '📍'}</span>
            <span class="node-text">${node.id}</span>
          </div>
        `;
      }
    });

    // Add current node
    if (currentNode) {
      html += `
        <div class="nav-node active">
          <span class="node-icon">${currentNode.icon || '📍'}</span>
          <span class="node-text">${currentNode.id}</span>
        </div>
      `;
    }

    html += '</div>';
    this.elements.navigationHistory.innerHTML = html;
  }

  /**
   * Update debug panel
   * @param {string} lastKey
   */
  updateDebugPanel(lastKey = null) {
    this.elements.debugState.textContent = this.isCallActive ? 'ACTIVE' : 'IDLE';
    this.elements.debugNode.textContent = this.ivrEngine.getCurrentStateName() || '-';
    this.elements.debugRetries.textContent = this.ivrEngine.getRetryCount();

    if (lastKey !== null) {
      this.elements.debugLastKey.textContent = lastKey;
    }
  }

  /**
   * Add entry to transcript
   * @param {string} type - 'system' or 'user'
   * @param {string} text
   */
  addTranscriptEntry(type, text) {
    // Remove placeholder if present
    const placeholder = this.elements.transcriptContent.querySelector('.placeholder-text');
    if (placeholder) {
      placeholder.remove();
    }

    const time = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const entry = document.createElement('div');
    entry.className = `transcript-entry ${type}`;
    entry.innerHTML = `
      <span class="transcript-timestamp">[${time}]</span>
      <span class="transcript-text">${text}</span>
    `;

    this.elements.transcriptContent.appendChild(entry);
    this.elements.transcriptContent.scrollTop = this.elements.transcriptContent.scrollHeight;
  }

  /**
   * Clear transcript
   */
  clearTranscript() {
    this.elements.transcriptContent.innerHTML = '<p class="placeholder-text">El transcript aparecerá aquí durante la llamada...</p>';
  }

  /**
   * Start call timer
   */
  startCallTimer() {
    const timerText = this.elements.callTimer.querySelector('.timer-text');

    this.callTimerInterval = setInterval(() => {
      const elapsed = Date.now() - this.callStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  /**
   * Stop call timer
   */
  stopCallTimer() {
    if (this.callTimerInterval) {
      clearInterval(this.callTimerInterval);
      this.callTimerInterval = null;
    }
  }

  /**
   * Update time display
   */
  updateTime() {
    const now = new Date();
    this.elements.currentTime.textContent = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Show error message
   * @param {string} message
   */
  showError(message) {
    console.error('[IVRApp] Error:', message);
    alert('Error: ' + message);
  }

  /**
   * Save API key to localStorage
   */
  saveApiKey() {
    const apiKey = this.elements.apiKeyInput.value.trim();
    if (apiKey) {
      localStorage.setItem('elevenlabs_api_key', apiKey);
      this.ttsClient.setApiKey(apiKey);
      alert('API key guardada correctamente');
    }
  }

  /**
   * Load API key from localStorage
   */
  loadApiKey() {
    const savedKey = localStorage.getItem('elevenlabs_api_key');
    if (savedKey) {
      this.elements.apiKeyInput.value = savedKey;
      this.ttsClient.setApiKey(savedKey);
    } else if (ELEVENLABS_CONFIG.apiKey && ELEVENLABS_CONFIG.apiKey !== 'TU_API_KEY_AQUI') {
      // Use config key if available
      this.elements.apiKeyInput.value = ELEVENLABS_CONFIG.apiKey;
    }
  }

  /**
   * Reset the application
   */
  reset() {
    this.handleHangup();
    this.clearTranscript();
    this.elements.navigationHistory.innerHTML = `
      <div class="nav-tree">
        <div class="nav-node start">
          <span class="node-icon">🏠</span>
          <span class="node-text">Inicio</span>
        </div>
      </div>
    `;
    this.updateDebugPanel();
    console.log('[IVRApp] Reset complete');
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new IVRApp();
  app.init();

  // Expose for debugging
  window.ivrApp = app;
});
