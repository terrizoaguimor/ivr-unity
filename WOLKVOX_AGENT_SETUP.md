# 🤖 Configuración del Agente Virtual de Wolkvox para ElevenLabs Bot

## 📋 Problema Identificado

El filtro de "Agent ID" en la interfaz de Wolkvox **requiere IDs numéricos**, no strings como "elevenlabs_pre_transfer".

Los agent_id en Wolkvox son numéricos (ejemplo: 12721, 12725, etc.).

## ✅ Solución

Necesitas crear un **agente virtual dedicado** en Wolkvox para el bot de ElevenLabs.

---

## 🔧 Paso 1: Crear el Agente Virtual en Wolkvox

### Opción A: Desde la interfaz de Wolkvox Manager

1. **Accede a tu panel de Wolkvox Manager**
   - URL: https://wv0048.wolkvox.com (o tu servidor específico)

2. **Navega a Configuración → Agentes**

3. **Crear nuevo agente:**
   - Haz clic en "Agregar Agente" o "Nuevo Agente"
   - **Nombre:** `ElevenLabs Bot` (o `IVR Bot`)
   - **Usuario:** `elevenlabs_bot`
   - **Tipo:** Virtual o de servicio
   - **Estado inicial:** Puede estar inactivo
   - **Skills/Colas:** Asigna según sea necesario

4. **Guarda y copia el Agent ID numérico**
   - Wolkvox asignará un ID numérico (ejemplo: **12800**)
   - **Copia este número**, lo necesitarás en el siguiente paso

### Opción B: Via API (si tienes acceso)

Si tienes permisos para crear agentes vía API, contacta a tu administrador de Wolkvox.

---

## 🔧 Paso 2: Configurar el Backend

### Actualizar archivo `.env`

Abre el archivo `.env` en `ivr-unity-backend/` y agrega:

```bash
# ID numérico del agente virtual para el bot de ElevenLabs
# Crea un agente en Wolkvox llamado "ElevenLabs Bot" y usa su ID aquí
WOLKVOX_BOT_AGENT_ID=12800
```

**⚠️ IMPORTANTE:** Reemplaza `12800` con el **ID real** que obtuviste en el paso anterior.

### Reiniciar el backend

```bash
cd ivr-unity-backend
npm run build
npm start
```

---

## 🔍 Paso 3: Verificar en Wolkvox

### Listar agentes disponibles

Ejecuta este script para ver todos los agentes con sus IDs:

```bash
cd ivr-unity-backend
npm run build
node dist/scripts/list-wolkvox-agents.js
```

Deberías ver algo como:

```
👤 Agente #1
   ID:     12800
   Nombre: ElevenLabs Bot
   Estado: Ready
   Llamadas: 0 (IN: 0, OUT: 0)
```

### Buscar en la interfaz de Wolkvox

1. **Accede a Reportes → Interacciones**
2. **Filtra por Agent ID:** `12800` (el ID de tu bot)
3. Verás todos los logs del bot de ElevenLabs

---

## 📊 Agentes Actuales en tu Sistema

Según el último escaneo, estos son los agentes que tienes:

```
12721 - JHON LONDOÑO LONDOÑO (1007522612)
12725 - JOSE DAVID TELLEZ PARDO (1020792424)
12637 - JUAN FELIPE HERNANDEZ CASTAÑO (1000951241)
12726 - MARYLU LONDOÑO (42825453)
12740 - SEBASTIAN LOPEZ GOMEZ (1000206903)
12724 - WILSON ENRIQUE MORENO MATOS (1047409364)
```

**NO uses estos IDs** - son agentes reales. Crea uno nuevo dedicado para el bot.

---

## 🧪 Prueba Completa

1. **Llama al número de Twilio:** `+1 (786) 902-6810`

2. **El bot debería:**
   - Saludarte en español latino
   - Preguntarte tu nombre completo
   - Preguntarte tu número de teléfono (10 dígitos)
   - Preguntar qué necesitas
   - Guardar el contexto (ejecutar `save_context`)
   - Transferir la llamada

3. **En Wolkvox:**
   - Ve a **Reportes → Interacciones**
   - Filtra por **Agent ID = 12800** (tu bot)
   - Deberías ver:
     - 📞 Teléfono del cliente
     - 📝 Nombre completo
     - 📋 Resumen de la conversación
     - ⏰ Timestamp

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar un agente existente temporalmente?

**No recomendado.** Los logs del bot se mezclarán con las llamadas reales del agente humano.

### ¿El agente virtual debe estar "logueado"?

No necesariamente. Solo usamos su ID para identificar logs del bot.

### ¿Qué pasa si no configuro WOLKVOX_BOT_AGENT_ID?

El código usará un string vacío `''` y Wolkvox podría rechazar el log o no indexarlo correctamente.

### ¿Cómo sé que está funcionando?

Verifica los logs del backend:

```bash
tail -f logs/app.log
```

Deberías ver:

```
Saving conversation context before transfer
Context saved to Wolkvox successfully
```

---

## 🔗 Referencias

- Script de listado: `ivr-unity-backend/src/scripts/list-wolkvox-agents.ts`
- Endpoint save-context: `ivr-unity-backend/src/server/elevenlabs-save-context.ts`
- Endpoint post-call: `ivr-unity-backend/src/server/elevenlabs-post-call-webhook.ts`

---

## 📞 Contacto

Si tienes problemas para crear el agente virtual en Wolkvox, contacta a tu administrador de plataforma o al soporte de Wolkvox.
