# IVR Unity Backend

Backend para el sistema IVR conversacional de Unity Financial usando Telnyx + ElevenLabs Conversational AI.

## Arquitectura

```
┌──────────────┐    ┌─────────────────┐    ┌─────────────────────────────────┐
│   Llamada    │───▶│     Telnyx      │───▶│     Node.js Backend (DO)        │
│   Entrante   │    │   SIP Trunk     │    │                                  │
└──────────────┘    │   + TeXML       │    │  ┌────────────────────────────┐  │
                    └────────┬────────┘    │  │    Audio Bridge            │  │
                             │             │  │    (Telnyx ↔ ElevenLabs)   │  │
                             │ Audio       │  └─────────────┬──────────────┘  │
                             │ Stream      │                │                  │
                             │ (WS)        │                ▼                  │
                             ▼             │  ┌────────────────────────────┐  │
                    ┌─────────────────┐    │  │  ElevenLabs Conversational │  │
                    │  Telnyx         │◀──▶│  │  AI Agent (WebSocket)      │  │
                    │  WebSocket      │    │  │                            │  │
                    └─────────────────┘    │  │  - STT integrado           │  │
                                           │  │  - LLM (Claude/GPT)        │  │
                                           │  │  - TTS integrado           │  │
                                           │  │  - Tools/Functions         │  │
                                           │  └────────────────────────────┘  │
                                           └─────────────────────────────────┘
```

## Requisitos

- Node.js 18+
- Cuenta de Telnyx con número de teléfono
- Cuenta de ElevenLabs con Conversational AI Agent

## Configuración

1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configurar las variables de entorno:
```bash
# Telnyx
TELNYX_API_KEY=tu_api_key
TELNYX_PUBLIC_KEY=tu_public_key

# ElevenLabs
ELEVENLABS_API_KEY=tu_api_key
ELEVENLABS_AGENT_ID=tu_agent_id

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/ready` | GET | Readiness check |
| `/telnyx/voice` | POST | Webhook para eventos de voz Telnyx |
| `/stream` | WS | WebSocket para streaming de audio |

## Configuración de Telnyx

1. Crear una TeXML Application en Telnyx
2. Configurar el Voice Webhook URL: `https://tu-dominio.com/telnyx/voice`
3. Asignar un número de teléfono a la aplicación

## Configuración de ElevenLabs Agent

El agente de ElevenLabs se configura con:
- **Voz**: Rachel (EXAVITQu4vr4xnSDxMaL)
- **Modelo TTS**: eleven_flash_v2_5 (baja latencia)
- **Idioma**: Español (con soporte inglés)

### Tools Disponibles

| Tool | Descripción |
|------|-------------|
| `transfer_call` | Transfiere la llamada a un departamento |
| `lookup_policy` | Busca información de póliza por ID |
| `end_call` | Termina la llamada |

## Deployment en DigitalOcean

```bash
# Usando doctl
doctl apps create --spec .do/app.yaml
```

## Estructura del Proyecto

```
src/
├── index.ts                    # Entry point
├── config/
│   └── index.ts               # Configuración
├── server/
│   ├── http.ts                # Express server
│   └── websocket.ts           # WebSocket server
├── telephony/
│   ├── telnyx-handler.ts      # Manejo de webhooks
│   └── texml-generator.ts     # Generación de TeXML
├── elevenlabs/
│   ├── agent-client.ts        # Cliente Conversational AI
│   └── tools.ts               # Handlers para tools
├── bridge/
│   ├── audio-bridge.ts        # Bridge Telnyx ↔ ElevenLabs
│   └── call-session.ts        # Sesión de llamada
└── utils/
    ├── audio-converter.ts     # Conversión μ-law ↔ PCM
    └── logger.ts              # Logging
```

## Flujo de Audio

1. **Telnyx** envía audio en μ-law (PCMU) a 8kHz
2. **Audio Bridge** convierte a PCM 16-bit a 16kHz
3. **ElevenLabs** procesa y responde con audio PCM
4. **Audio Bridge** convierte a μ-law 8kHz
5. **Telnyx** reproduce al usuario

## Departamentos y Colas

| Departamento | Colas |
|--------------|-------|
| SALUD | VQ_SALUD_VENTAS, VQ_SALUD_SERVICIO, VQ_SALUD_BACKOFFICE |
| VIDA | VQ_VIDA_VENTAS, VQ_VIDA_SERVICIO |
| PC | VQ_PYC_VENTAS, VQ_PYC_SERVICIO, VQ_PYC_SINIESTRO |
| PQRS | VQ_PQRS_GENERAL |
| SINIESTRO | VQ_SINIESTRO_URGENTE (24/7) |
