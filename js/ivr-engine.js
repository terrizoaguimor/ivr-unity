/**
 * IVR Unity Financial - IVR Engine
 * State machine for IVR navigation and control
 */

class IVREngine {
  constructor(flow = IVR_FLOW, initialState = IVR_INITIAL_STATE) {
    this.flow = flow;
    this.initialState = initialState;
    this.currentState = null;
    this.previousStates = [];
    this.retryCount = 0;
    this.maxRetries = IVR_CONFIG.maxRetries;
    this.inputTimeout = IVR_CONFIG.inputTimeout;
    this.trainingMode = IVR_CONFIG.trainingMode;
    this.timeoutHandle = null;
    this.isActive = false;
    this.inputBuffer = '';

    // Callbacks
    this.onStateChange = null;
    this.onMessage = null;
    this.onTransfer = null;
    this.onTimeout = null;
    this.onError = null;
    this.onKeyPress = null;
  }

  /**
   * Initialize the IVR engine
   */
  init() {
    console.log('[IVREngine] Initialized');
    this.reset();
  }

  /**
   * Start the IVR flow
   */
  start() {
    console.log('[IVREngine] Starting IVR flow');
    this.isActive = true;
    this.transitionTo(this.initialState);
  }

  /**
   * Stop the IVR flow
   */
  stop() {
    console.log('[IVREngine] Stopping IVR flow');
    this.isActive = false;
    this.clearTimeout();
    this.reset();
  }

  /**
   * Reset the engine to initial state
   */
  reset() {
    this.currentState = null;
    this.previousStates = [];
    this.retryCount = 0;
    this.inputBuffer = '';
    this.clearTimeout();
  }

  /**
   * Get the current node
   * @returns {Object|null}
   */
  getCurrentNode() {
    if (!this.currentState) return null;
    return this.flow[this.currentState] || null;
  }

  /**
   * Transition to a new state
   * @param {string} stateName - Name of the state to transition to
   */
  transitionTo(stateName) {
    if (!this.isActive) return;

    const node = this.flow[stateName];
    if (!node) {
      console.error('[IVREngine] Invalid state:', stateName);
      if (this.onError) {
        this.onError(`Estado inválido: ${stateName}`);
      }
      return;
    }

    // Save previous state for navigation history
    if (this.currentState) {
      this.previousStates.push(this.currentState);
    }

    this.currentState = stateName;
    this.retryCount = 0;
    this.inputBuffer = '';

    console.log('[IVREngine] Transitioned to:', stateName);

    // Notify state change
    if (this.onStateChange) {
      this.onStateChange(node, this.previousStates);
    }

    // Play the message
    if (this.onMessage) {
      this.onMessage(node.message, node.language, node);
    }

    // Set up timeout for input if not a terminal node
    if (node.type !== 'terminal') {
      this.startInputTimeout();
    } else if (node.action === 'transfer') {
      // Handle transfer action
      if (this.onTransfer) {
        this.onTransfer(node);
      }
    }
  }

  /**
   * Handle key press input
   * @param {string} key - The key pressed (0-9, *, #)
   */
  handleKeyPress(key) {
    if (!this.isActive || !this.currentState) return;

    console.log('[IVREngine] Key pressed:', key);

    // Notify key press
    if (this.onKeyPress) {
      this.onKeyPress(key);
    }

    const node = this.getCurrentNode();
    if (!node) return;

    // Clear timeout as we got input
    this.clearTimeout();

    // For input type nodes, buffer the input
    if (node.type === 'input') {
      if (key === '#') {
        // Submit input
        this.processInput(this.inputBuffer);
        this.inputBuffer = '';
      } else if (key === '*') {
        // Clear input or go back
        this.inputBuffer = '';
        if (node.transitions['*']) {
          this.transitionTo(node.transitions['*']);
        }
      } else {
        this.inputBuffer += key;
        this.startInputTimeout();
      }
      return;
    }

    // Check for specific key transition
    if (node.transitions[key]) {
      this.transitionTo(node.transitions[key]);
    } else if (node.transitions['default']) {
      // Use default transition
      this.transitionTo(node.transitions['default']);
    } else {
      // Invalid input, retry
      this.handleInvalidInput();
    }
  }

  /**
   * Process buffered input (for input type nodes)
   * @param {string} input - The buffered input
   */
  processInput(input) {
    const node = this.getCurrentNode();
    if (!node) return;

    console.log('[IVREngine] Processing input:', input);

    // Check if there's a # transition (submit)
    if (node.transitions['#']) {
      this.transitionTo(node.transitions['#']);
    } else if (node.transitions['default']) {
      this.transitionTo(node.transitions['default']);
    }
  }

  /**
   * Handle invalid input
   */
  handleInvalidInput() {
    this.retryCount++;

    console.log('[IVREngine] Invalid input, retry count:', this.retryCount);

    if (this.retryCount >= this.maxRetries) {
      // Max retries reached, transfer to agent
      console.log('[IVREngine] Max retries reached, transferring to agent');
      this.transitionTo('TRANSFER_AGENT');
    } else {
      // Repeat current message
      const node = this.getCurrentNode();
      if (node && this.onMessage) {
        this.onMessage(
          "Opción no válida. " + node.message,
          node.language,
          node
        );
      }
      this.startInputTimeout();
    }
  }

  /**
   * Start input timeout
   */
  startInputTimeout() {
    this.clearTimeout();

    const timeout = this.trainingMode
      ? this.inputTimeout + IVR_CONFIG.trainingDelay
      : this.inputTimeout;

    this.timeoutHandle = setTimeout(() => {
      this.handleTimeout();
    }, timeout);
  }

  /**
   * Handle input timeout
   */
  handleTimeout() {
    if (!this.isActive) return;

    const node = this.getCurrentNode();
    if (!node) return;

    console.log('[IVREngine] Input timeout');

    // Notify timeout
    if (this.onTimeout) {
      this.onTimeout();
    }

    // Check for timeout transition
    if (node.transitions['timeout']) {
      this.retryCount++;
      if (this.retryCount >= this.maxRetries) {
        this.transitionTo('TRANSFER_AGENT');
      } else {
        // Repeat message
        if (this.onMessage) {
          this.onMessage(node.message, node.language, node);
        }
        this.startInputTimeout();
      }
    }
  }

  /**
   * Clear the timeout
   */
  clearTimeout() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  /**
   * Go back to previous state
   */
  goBack() {
    if (this.previousStates.length > 0) {
      const prevState = this.previousStates.pop();
      this.currentState = null; // Clear current to avoid double-adding to history
      this.transitionTo(prevState);
    }
  }

  /**
   * Set training mode
   * @param {boolean} enabled
   */
  setTrainingMode(enabled) {
    this.trainingMode = enabled;
    console.log('[IVREngine] Training mode:', enabled);
  }

  /**
   * Get navigation history
   * @returns {Array}
   */
  getHistory() {
    const history = [...this.previousStates];
    if (this.currentState) {
      history.push(this.currentState);
    }
    return history.map(stateName => this.flow[stateName]);
  }

  /**
   * Get available transitions from current state
   * @returns {Object}
   */
  getAvailableTransitions() {
    const node = this.getCurrentNode();
    if (!node) return {};

    return Object.keys(node.transitions)
      .filter(key => key !== 'timeout' && key !== 'default')
      .reduce((acc, key) => {
        acc[key] = this.flow[node.transitions[key]];
        return acc;
      }, {});
  }

  /**
   * Check if engine is active
   * @returns {boolean}
   */
  getIsActive() {
    return this.isActive;
  }

  /**
   * Get current state name
   * @returns {string|null}
   */
  getCurrentStateName() {
    return this.currentState;
  }

  /**
   * Get retry count
   * @returns {number}
   */
  getRetryCount() {
    return this.retryCount;
  }

  // Callback setters
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }

  setOnMessage(callback) {
    this.onMessage = callback;
  }

  setOnTransfer(callback) {
    this.onTransfer = callback;
  }

  setOnTimeout(callback) {
    this.onTimeout = callback;
  }

  setOnError(callback) {
    this.onError = callback;
  }

  setOnKeyPress(callback) {
    this.onKeyPress = callback;
  }
}

// Create global instance
const ivrEngine = new IVREngine();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IVREngine, ivrEngine };
}
