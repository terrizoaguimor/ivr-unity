# IVR Unity Backend

Backend middleware para el sistema IVR conversacional de Unity Financial usando Wolkvox + Twilio + ElevenLabs Conversational AI.

## Arquitectura

```
┌──────────────┐    ┌─────────────────┐    ┌─────────────────────────────────┐
│   Llamada    │───▶│    Wolkvox      │───▶│     Twilio                      │
│   Entrante   │    │  Contact Center │    │   +1 754 273 9829               │
└──────────────┘    └─────────────────┘    └────────┬────────────────────────┘
                                                     │ Transfer
                                                     │ (TwiML)
                                                     ▼
                                           ┌─────────────────────────────────┐
                                           │  Node.js Backend (DO)            │
                                           │                                  │
                                           │  ┌────────────────────────────┐  │
                                           │  │    Audio Bridge            │  │
                                           │  │    (Twilio ↔ ElevenLabs)   │  │
                                           │  └─────────────┬──────────────┘  │
                                           │                │                  │
                                           │                ▼                  │
                                           │  ┌────────────────────────────┐  │
                    ┌─────────────────┐    │  │  ElevenLabs Conversational │  │
                    │  Twilio         │◀──▶│  │  AI Agent (Stefani)        │  │
                    │  Media Stream   │    │  │                            │  │
                    └─────────────────┘    │  │  - STT integrado           │  │
                                           │  │  - LLM reasoning           │  │
                                           │  │  - TTS integrado           │  │
                                           │  │  - Voice Tags V3           │  │
                                           │  └────────────┬───────────────┘  │
                                           │               │                   │
                                           │  ┌────────────▼───────────────┐  │
                                           │  │  Wolkvox API Integration   │  │
                                           │  │  - Log interactions        │  │
                                           │  │  - Agent status tracking   │  │
                                           │  │  - Transfer coordination   │  │
                                           │  └────────────────────────────┘  │
                                           └─────────────────────────────────┘
                                                     │ Transfer back
                                                     ▼
                                           ┌─────────────────────┐
                                           │  Wolkvox Skills     │
                                           │  - VQ_PYC_VENTAS    │
                                           │  - VQ_PYC_SERVICIO  │
                                           │  - VQ_PYC_SINIESTRO │
                                           └─────────────────────┘
```

## Requisitos

- Node.js 20+
- Cuenta de Twilio con número de teléfono (+1 754 273 9829)
- Cuenta de ElevenLabs con Conversational AI Agent
- Cuenta de Wolkvox con API access (Server 0048)

## Configuración

1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configurar las variables de entorno:
```bash
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# ElevenLabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_AGENT_ID=agent_xxxxxxxxxxxxxxxxxxxxxxx

# Wolkvox
WOLKVOX_SERVER=0048
WOLKVOX_TOKEN=your_wolkvox_token
WOLKVOX_POLLING_INTERVAL=5000
WOLKVOX_DEFAULT_SKILL_ID=
WOLKVOX_MAX_CALL_DURATION=300000

# Wolkvox SIP
WOLKVOX_SIP_USERNAME=inb-unity-elevenlabs
WOLKVOX_SIP_PASSWORD=your_password
WOLKVOX_SIP_HOST=XX.XX.XX.XX
WOLKVOX_SIP_TRANSPORT=udp

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

### HTTP Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/ready` | GET | Readiness check |
| `/twilio/voice` | POST | Webhook para llamadas entrantes Twilio |
| `/twilio/status` | POST | Status callbacks de Twilio |
| `/api/wolkvox/status` | GET | Estado del orchestrator y Wolkvox |
| `/api/wolkvox/active-calls` | GET | Llamadas activas |
| `/api/wolkvox/agents` | GET | Estado de agentes Wolkvox |
| `/api/wolkvox/transfer` | POST | Forzar transfer manual |

### WebSocket

| Endpoint | Protocolo | Descripción |
|----------|-----------|-------------|
| `/stream` | WS | Streaming de audio bidireccional Twilio |

## Configuración de Twilio

1. Ir a Twilio Console → Phone Numbers
2. Seleccionar el número `+1 754 273 9829`
3. Configurar **Voice & Fax**:
   - **A CALL COMES IN**: `https://tu-dominio.ondigitalocean.app/twilio/voice` (POST)
   - **CALL STATUS CHANGES**: `https://tu-dominio.ondigitalocean.app/twilio/status` (POST)

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
