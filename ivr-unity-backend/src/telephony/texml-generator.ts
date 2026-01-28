/**
 * TeXML Generator for Telnyx responses
 */

export interface StreamParams {
  callId: string;
  caller: string;
  calledNumber?: string;
}

export interface TransferParams {
  destination: string;
  callerId?: string;
  timeout?: number;
}

/**
 * Generate TeXML response to stream audio via WebSocket
 */
export function generateStreamTeXML(wsUrl: string, params: StreamParams): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Stream url="${escapeXml(wsUrl)}" bidirectionalMode="rtp" codec="PCMU">
    <Parameter name="call_id" value="${escapeXml(params.callId)}" />
    <Parameter name="caller" value="${escapeXml(params.caller)}" />
    ${params.calledNumber ? `<Parameter name="called_number" value="${escapeXml(params.calledNumber)}" />` : ''}
  </Stream>
</Response>`;
}

/**
 * Generate TeXML response for call transfer
 */
export function generateTransferTeXML(params: TransferParams): string {
  const timeout = params.timeout || 30;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="${timeout}" ${params.callerId ? `callerId="${escapeXml(params.callerId)}"` : ''}>
    <Sip>${escapeXml(params.destination)}</Sip>
  </Dial>
</Response>`;
}

/**
 * Generate TeXML for hangup
 */
export function generateHangupTeXML(reason?: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${reason ? `<Say>${escapeXml(reason)}</Say>` : ''}
  <Hangup />
</Response>`;
}

/**
 * Generate TeXML for playing a message then streaming
 */
export function generateSayThenStreamTeXML(
  message: string,
  wsUrl: string,
  params: StreamParams
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Mia-Neural" language="es-MX">${escapeXml(message)}</Say>
  <Stream url="${escapeXml(wsUrl)}" bidirectionalMode="rtp" codec="PCMU">
    <Parameter name="call_id" value="${escapeXml(params.callId)}" />
    <Parameter name="caller" value="${escapeXml(params.caller)}" />
  </Stream>
</Response>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
