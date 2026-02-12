import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },

  // ElevenLabs
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    agentId: process.env.ELEVENLABS_AGENT_ID || '',
    wsUrl: 'wss://api.elevenlabs.io/v1/convai/conversation',
  },

  // Audio settings
  audio: {
    telnyxSampleRate: 8000,
    elevenLabsSampleRate: 16000,
    telnyxCodec: 'PCMU', // μ-law
    elevenLabsFormat: 'pcm_16000', // 16-bit PCM at 16kHz
  },

  // Wolkvox
  wolkvox: {
    server: process.env.WOLKVOX_SERVER || '0048',
    token: process.env.WOLKVOX_TOKEN || '',
    baseUrl: process.env.WOLKVOX_BASE_URL,
    pollingIntervalMs: parseInt(process.env.WOLKVOX_POLLING_INTERVAL || '5000', 10),
    defaultSkillId: process.env.WOLKVOX_DEFAULT_SKILL_ID,
    maxCallDurationMs: parseInt(process.env.WOLKVOX_MAX_CALL_DURATION || '300000', 10), // 5 minutos por defecto
    sip: {
      username: process.env.WOLKVOX_SIP_USERNAME || 'inb-unity-elevenlabs',
      password: process.env.WOLKVOX_SIP_PASSWORD || '',
      host: process.env.WOLKVOX_SIP_HOST || '',
      transport: (process.env.WOLKVOX_SIP_TRANSPORT || 'udp') as 'udp' | 'tcp',
    },
  },

  // Queue mappings for transfers
  queues: {
    SALUD: {
      ventas: 'VQ_SALUD_VENTAS',
      servicio: 'VQ_SALUD_SERVICIO',
      backoffice: 'VQ_SALUD_BACKOFFICE',
      general: 'VQ_SALUD_GENERAL',
    },
    VIDA: {
      ventas: 'VQ_VIDA_VENTAS',
      servicio: 'VQ_VIDA_SERVICIO',
      general: 'VQ_VIDA_GENERAL',
    },
    PC: {
      ventas: 'VQ_PYC_VENTAS',
      servicio: 'VQ_PYC_SERVICIO',
      siniestro: 'VQ_PYC_SINIESTRO',
      general: 'VQ_PYC_GENERAL',
    },
    PQRS: {
      general: 'VQ_PQRS_GENERAL',
    },
    SINIESTRO: {
      urgente: 'VQ_SINIESTRO_URGENTE',
    },
  },
} as const;

export type Config = typeof config;
