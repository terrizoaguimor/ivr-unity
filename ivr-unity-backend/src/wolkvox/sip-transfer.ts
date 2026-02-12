/**
 * Wolkvox SIP Transfer Module
 *
 * Handles call transfers from Twilio to Wolkvox via SIP
 */

import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Wolkvox SIP Configuration
 */
export interface WolkvoxSIPConfig {
  username: string;
  password: string;
  host: string; // Will be obtained from Wolkvox
  transport: 'udp' | 'tcp';
}

/**
 * Department to Wolkvox skill mapping
 */
const DEPARTMENT_TO_SKILL: Record<string, string> = {
  'ventas': '101',        // Extension for VQ_PYC_VENTAS
  'servicio': '102',      // Extension for VQ_PYC_SERVICIO
  'siniestros': '103',    // Extension for VQ_PYC_SINIESTRO
  'siniestro': '103',     // Alias
  'general': '100',       // Extension for general queue
  'pqrs': '104',          // Extension for PQRS
};

/**
 * Generate TwiML for SIP transfer to Wolkvox
 */
export function generateWolkvoxSIPTransfer(
  department: string,
  callContext?: string
): string {
  const extension = DEPARTMENT_TO_SKILL[department.toLowerCase()] || DEPARTMENT_TO_SKILL['general'];

  // SIP URI format for Wolkvox
  // This will be configured based on Wolkvox's actual SIP endpoint
  const sipUri = `sip:${extension}@WOLKVOX_SIP_HOST`;

  logger.info('Generating SIP transfer to Wolkvox', {
    department,
    extension,
    sipUri,
  });

  // TwiML for SIP dial with authentication
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${callContext ? `<Say language="es-MX">${callContext}</Say>` : ''}
  <Dial>
    <Sip username="${config.wolkvox.sip.username}" password="${config.wolkvox.sip.password}">
      ${sipUri}
    </Sip>
  </Dial>
</Response>`;
}

/**
 * Transfer call using Twilio SDK
 */
export async function transferCallToWolkvoxSIP(
  callSid: string,
  department: string,
  summary?: string
): Promise<void> {
  try {
    const twilio = require('twilio');
    const client = twilio(config.twilio.accountSid, config.twilio.authToken);

    const extension = DEPARTMENT_TO_SKILL[department.toLowerCase()] || DEPARTMENT_TO_SKILL['general'];
    const sipUri = `sip:${extension}@${config.wolkvox.sip.host}`;

    logger.info('Transferring call to Wolkvox via SIP', {
      callSid,
      department,
      extension,
      sipUri,
    });

    // Update the call to transfer to SIP
    await client.calls(callSid).update({
      twiml: generateWolkvoxSIPTransfer(department, summary),
    });

    logger.info('Call transferred successfully', {
      callSid,
      department,
    });

  } catch (error) {
    logger.error('Failed to transfer call to Wolkvox', {
      callSid,
      department,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get SIP endpoint URL for Wolkvox skill
 */
export function getWolkvoxSIPEndpoint(department: string): string {
  const extension = DEPARTMENT_TO_SKILL[department.toLowerCase()] || DEPARTMENT_TO_SKILL['general'];
  return `sip:${extension}@${config.wolkvox.sip.host};transport=${config.wolkvox.sip.transport}`;
}
