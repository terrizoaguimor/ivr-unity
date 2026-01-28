import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Telnyx
  telnyx: {
    apiKey: process.env.TELNYX_API_KEY || '',
    publicKey: process.env.TELNYX_PUBLIC_KEY || '',
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
