/**
 * TwiML Generator for Twilio
 * Generates TwiML responses for voice calls and audio streaming
 */

export interface StreamParams {
  callSid: string;
  caller: string;
  calledNumber: string;
}

/**
 * Generate TwiML for bidirectional audio streaming
 */
export function generateStreamTwiML(wsUrl: string, params: StreamParams): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Start>
    <Stream url="${wsUrl}">
      <Parameter name="callSid" value="${params.callSid}" />
      <Parameter name="caller" value="${params.caller}" />
      <Parameter name="calledNumber" value="${params.calledNumber}" />
    </Stream>
  </Start>
  <Pause length="3600"/>
</Response>`;
}

/**
 * Generate TwiML for transferring call
 */
export function generateTransferTwiML(destination: string, timeout: number = 30): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="${timeout}">
    <Number>${destination}</Number>
  </Dial>
</Response>`;
}

/**
 * Generate TwiML for ending call
 */
export function generateHangupTwiML(message?: string): string {
  if (message) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-MX">${message}</Say>
  <Hangup/>
</Response>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`;
}

/**
 * Generate TwiML for playing message
 */
export function generateSayTwiML(message: string, language: string = 'es-MX'): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="${language}">${message}</Say>
</Response>`;
}
