# 🔗 Integración Completa: ElevenLabs ↔ Wolkvox

## 📋 Descripción

Sistema completo que integra ElevenLabs Conversational AI con Wolkvox, incluyendo:
- ✅ Creación automática de agente virtual en Wolkvox
- ✅ Obtención de transcripciones completas desde ElevenLabs
- ✅ Descarga de audio de conversaciones
- ✅ Upload automático de audio a Wolkvox
- ✅ Registro de interacciones con audio adjunto

---

## 🏗️ Arquitectura del Flujo

```
┌─────────────────┐
│   Llamada       │
│   Telefónica    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Twilio        │
│   +1 786-902-   │
│      6810       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         ElevenLabs Conversational AI                │
│  - Saluda en español latino                         │
│  - Pide nombre completo + teléfono                  │
│  - Entiende el problema                             │
│  - Ejecuta save_context (pre-transferencia)         │
│  - Transfiere a Wolkvox: +1 786-902-6810            │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│   POST /api/elevenlabs/save-context (DURANTE)       │
│  - Guarda contexto ANTES de transferir              │
│  - Wolkvox recibe info en tiempo real               │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│   POST /api/elevenlabs/post-call-webhook (DESPUÉS)  │
│  1. Obtiene conversación completa de ElevenLabs     │
│  2. Descarga audio (MP3) si está disponible         │
│  3. Sube audio a Wolkvox (max 5MB)                  │
│  4. Registra interacción con audio adjunto          │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│              WOLKVOX STORAGE                        │
│  - Agent ID: 12XXX (agente virtual)                 │
│  - Transcript completo con timestamps               │
│  - Audio MP3 de la conversación                     │
│  - Metadata: nombre, teléfono, tipo, resumen        │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Configuración Inicial

### 1. Crear Agente Virtual en Wolkvox

Ejecuta el script automatizado:

```bash
cd ivr-unity-backend
npm run build
node dist/scripts/create-bot-agent.js
```

**Salida esperada:**
```
✅ ¡Agente creado exitosamente!
════════════════════════════════════════════════════════════
🆔 AGENT ID: 12850
👤 Nombre: ElevenLabs Bot
👨‍💻 Usuario: elevenlabs_bot
════════════════════════════════════════════════════════════
✅ Variable WOLKVOX_BOT_AGENT_ID actualizada
```

El script:
- Crea el agente virtual "ElevenLabs Bot" en Wolkvox
- Obtiene su ID numérico (ej: 12850)
- Actualiza automáticamente el archivo `.env`

### 2. Verificar Variables de Entorno

Tu archivo `.env` debe contener:

```bash
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+17869026810

# ElevenLabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_AGENT_ID=agent_1001kha14rgcfsnbpnpfxmvsp4sx

# Wolkvox
WOLKVOX_SERVER=0048
WOLKVOX_TOKEN=xxxxxxxxxxxxxxxxxxxxx
WOLKVOX_BOT_AGENT_ID=12850  # ✅ Creado automáticamente
```

### 3. Iniciar Backend

```bash
npm run build
npm start
```

---

## 📡 Endpoints Disponibles

### POST `/api/elevenlabs/save-context`

**Descripción:** Guarda contexto ANTES de transferir la llamada

**Body:**
```json
{
  "caller_phone": "3051234567",
  "caller_name": "Juan Pérez",
  "issue_type": "AUTO_ACCIDENT",
  "summary": "Accidente leve, sin heridos, llamó a policía",
  "conversation_id": "conv_abc123xyz"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Context saved successfully",
  "timestamp": "2026-02-13T08:30:00.000Z"
}
```

### POST `/api/elevenlabs/post-call-webhook`

**Descripción:** Procesa llamada completa DESPUÉS de finalizar

**Body:** (ElevenLabs lo envía automáticamente)
```json
{
  "conversation_id": "conv_abc123xyz",
  "agent_id": "agent_1001kha14rgcfsnbpnpfxmvsp4sx",
  "call_duration_ms": 120000,
  "status": "transferred",
  "transcript": [...],
  "metadata": {
    "caller_number": "+13051234567",
    "transfer_number": "+17869026810"
  }
}
```

**Proceso interno:**
1. ✅ Obtiene conversación completa de ElevenLabs API
2. ✅ Descarga audio (MP3, ~1-2MB por minuto)
3. ✅ Sube audio a Wolkvox (multipart/form-data)
4. ✅ Registra interacción con audio adjunto

---

## 🔍 Cómo Buscar los Datos en Wolkvox

### Opción 1: Filtrar por Agent ID

1. **Accede a:** Wolkvox Manager → Reportes → Interacciones
2. **Filtra por Agent ID:** `12850` (el ID de tu bot)
3. **Verás:**
   - 📞 Teléfono del cliente
   - 👤 Nombre completo
   - 🕐 Timestamp
   - 📋 Transcript completo con timestamps: `[0:45] AGENT: ¿Me das tu nombre?`
   - 🎵 Audio MP3 adjunto (si está disponible)

### Opción 2: Buscar por Teléfono

1. **Filtra por número:** `3051234567`
2. Verás todas las interacciones con ese cliente

### Opción 3: Buscar por Fecha/Hora

Útil para encontrar llamadas recientes del bot.

---

## 🎵 Descarga de Audio

### Desde ElevenLabs

El audio se obtiene automáticamente vía:
```
GET https://api.elevenlabs.io/v1/convai/conversations/{conversation_id}/audio
```

**Formato:**
- **Codec:** MP3
- **Bitrate:** 128kbps
- **Sample Rate:** 22.05kHz
- **Tamaño:** ~1-2MB por minuto de conversación

### Upload a Wolkvox

```
POST https://wv0048.wolkvox.com/api/v2/configuration.php?api=upload_audio
```

**Límites:**
- ✅ Máximo 50 archivos por request
- ✅ Máximo 5MB por archivo
- ✅ Formato: multipart/form-data

**Nombre de archivo:**
```
elevenlabs_{conversation_id}.mp3
Ejemplo: elevenlabs_conv_abc123xyz.mp3
```

---

## 🧪 Prueba Completa del Flujo

### Paso 1: Hacer una llamada de prueba

```bash
# Llama al número de Twilio
+1 (786) 902-6810
```

### Paso 2: Conversa con el bot

```
BOT: Bienvenido a Unity Financial Network, Great Deals, Greater Trust. ¿En qué puedo ayudarte hoy?

TÚ: Tuve un accidente de auto.

BOT: Entiendo que tuviste un accidente de auto. Primero lo más importante: ¿Estás bien? ¿Hay alguien herido?

TÚ: No, estoy bien.

BOT: Me alegra que estés bien. Para ayudarte, necesito algunos datos. ¿Me das tu nombre completo?

TÚ: Juan Pérez

BOT: Gracias Juan. ¿Tu número de teléfono? Los 10 dígitos.

TÚ: 3051234567

BOT: ¿Cuándo ocurrió el accidente?

TÚ: Hoy en la mañana

BOT: ¿Qué tan severo fue? ¿Leve, moderado o grave?

TÚ: Leve

BOT: ¿Llamaste a la policía?

TÚ: Sí

BOT: Perfecto Juan. Te conecto ahora mismo con un especialista en siniestros de auto.

[TRANSFERENCIA A WOLKVOX]
```

### Paso 3: Verificar los logs

```bash
tail -f logs/app.log
```

**Deberías ver:**

```
Saving conversation context before transfer
Context saved to Wolkvox successfully
ElevenLabs post-call webhook received
Fetching complete conversation from ElevenLabs
Conversation details retrieved
Downloading conversation audio from ElevenLabs
Conversation audio downloaded (1.2MB)
Uploading audio to Wolkvox
Audio uploaded successfully to Wolkvox
Complete interaction logged to Wolkvox
```

### Paso 4: Verificar en Wolkvox

1. **Accede a:** Reportes → Interacciones
2. **Filtra por Agent ID:** `12850`
3. **Última entrada:**
   - 📞 Teléfono: 3051234567
   - 👤 Nombre: Juan Pérez
   - 📝 Transcript completo con timestamps
   - 🎵 Audio: `elevenlabs_conv_abc123xyz.mp3`
   - 📋 Resumen: "AUTO_ACCIDENT - Cliente seguro, accidente leve..."

---

## 📊 Scripts Disponibles

### Listar Agentes de Wolkvox

```bash
npm run build
node dist/scripts/list-wolkvox-agents.js
```

Muestra todos los agentes con sus IDs numéricos.

### Crear Agente Virtual

```bash
npm run build
node dist/scripts/create-bot-agent.js
```

Crea el agente "ElevenLabs Bot" y actualiza `.env` automáticamente.

---

## 🔧 Archivos Clave

### Backend

```
src/
├── elevenlabs/
│   ├── conversation-client.ts      # Cliente para API de ElevenLabs
│   └── agent-client.ts             # WebSocket client (existente)
│
├── wolkvox/
│   └── wolkvox-client.ts           # Cliente extendido con:
│                                   # - createAgent()
│                                   # - uploadAudio()
│                                   # - addInteractionWithAudio()
│
├── server/
│   ├── elevenlabs-save-context.ts  # Pre-transfer context save
│   └── elevenlabs-post-call-webhook.ts # Post-call audio upload
│
└── scripts/
    ├── create-bot-agent.ts         # Crear agente virtual
    └── list-wolkvox-agents.ts      # Listar agentes
```

### Configuración

```
.env                                 # Variables de entorno
WOLKVOX_AGENT_SETUP.md              # Guía de configuración
ELEVENLABS_WOLKVOX_INTEGRATION.md   # Este archivo
```

---

## 🐛 Troubleshooting

### Error: "Failed to download conversation audio"

**Causa:** La conversación aún no está procesada o no tiene audio.

**Solución:**
- ElevenLabs procesa el audio después de la llamada
- Espera 10-30 segundos después de que termina la llamada
- Verifica que `has_audio: true` en la respuesta

### Error: "Audio file too large: 6.5MB (max 5MB)"

**Causa:** Audio supera el límite de Wolkvox.

**Solución:**
- Implementa compresión de audio antes de subir
- O divide en múltiples archivos

### Error: "Wolkvox authentication failed"

**Causa:** Token o server incorrectos.

**Solución:**
```bash
# Verifica las variables
echo $WOLKVOX_SERVER   # Debe ser "0048"
echo $WOLKVOX_TOKEN    # Debe estar configurado
```

### Error: "Agent not found"

**Causa:** El agente virtual no existe o el ID es incorrecto.

**Solución:**
```bash
# Lista todos los agentes
node dist/scripts/list-wolkvox-agents.js

# Crea el agente virtual
node dist/scripts/create-bot-agent.js
```

---

## 📈 Mejoras Futuras

### Implementadas ✅
- [x] Creación automática de agente virtual
- [x] Obtención de transcripciones completas
- [x] Descarga y upload de audio
- [x] Registro de interacciones con audio

### Por Implementar 🔜
- [ ] Compresión de audio antes de upload (si supera 5MB)
- [ ] Caché de conversaciones para evitar re-fetch
- [ ] Dashboard para visualizar estadísticas
- [ ] Notificaciones en tiempo real vía WebSocket
- [ ] Análisis de sentimiento de conversaciones
- [ ] Reportes automatizados por email

---

## 📞 Contacto y Soporte

Si tienes problemas:
1. Revisa los logs: `tail -f logs/app.log`
2. Verifica las variables de entorno
3. Ejecuta los scripts de diagnóstico

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo que:
- ✅ Crea agentes virtuales automáticamente
- ✅ Obtiene transcripciones completas de ElevenLabs
- ✅ Descarga y sube audio a Wolkvox
- ✅ Permite buscar y filtrar fácilmente en Wolkvox UI

**Filtra por Agent ID `12850` en Wolkvox y verás todos los logs del bot!** 🚀
