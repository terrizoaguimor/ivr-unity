# Guía de Uso - IVR Unity Financial
## Simulador de Entrenamiento para Agentes de Call Center

---

## 1. Acceso al Sistema

### URL del Simulador
```
https://ivr-unity-a6zp5.ondigitalocean.app
```

### Credenciales de Acceso
Cuando el navegador solicite autenticación:

| Campo | Valor |
|-------|-------|
| **Usuario** | `unity` |
| **Contraseña** | `UnityIVR2024!` |

---

## 2. Interfaz del Simulador

Al ingresar verás una interfaz de teléfono virtual con los siguientes elementos:

```
┌─────────────────────────────────────────┐
│            UNITY LINE                   │
│  ┌───────────────────────────────────┐  │
│  │  📶        00:00          🔋      │  │ ← Barra de estado
│  │  ─────────────────────────────────│  │
│  │  📞 Listo para llamar             │  │ ← Estado de llamada
│  │                                   │  │
│  │  Presione Llamar para iniciar     │  │ ← Pantalla LCD
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│    [1]     [2]     [3]                  │
│            ABC     DEF                  │
│                                         │
│    [4]     [5]     [6]                  │ ← Teclado numérico
│    GHI     JKL     MNO                  │
│                                         │
│    [7]     [8]     [9]                  │
│   PQRS     TUV    WXYZ                  │
│                                         │
│    [*]     [0]     [#]                  │
│             +                           │
│                                         │
│  [📞 Llamar]        [📴 Colgar]         │ ← Botones de acción
└─────────────────────────────────────────┘
```

### Paneles Laterales

| Panel | Función |
|-------|---------|
| **📝 Transcript** | Muestra el texto de cada mensaje TTS y las teclas presionadas |
| **🗺️ Navegación** | Visualiza el recorrido por el árbol IVR |
| **🔧 Estado del Sistema** | Información técnica para depuración |
| **⚙️ Controles** | Modo entrenamiento y configuración |

---

## 3. Cómo Iniciar una Llamada

### Paso 1: Hacer clic en "Llamar"
- Presiona el botón verde **📞 Llamar**
- El estado cambiará a "Conectando..."
- Después de 1 segundo escucharás el mensaje de bienvenida

### Paso 2: Escuchar el Mensaje de Bienvenida
```
"Welcome to Unity Line — Great Deals. Greater Trust.
Para español, marque dos."
```

### Paso 3: Seleccionar Idioma
- **Tecla 1**: Continuar en inglés
- **Tecla 2**: Continuar en español (recomendado para entrenamiento)

---

## 4. Navegación del Menú Principal (Español)

Después de presionar **2**, escucharás:

```
"Bienvenido a su aseguradora. ¿En qué podemos ayudarle hoy?
Presione:
1 para Salud
2 para Vida
3 para Propiedad y Accidentes
4 para PQRS o Siniestros
5 para consultar estado de póliza
0 para hablar con asesor"
```

### Opciones del Menú Principal

| Tecla | Opción | Descripción |
|-------|--------|-------------|
| **1** | Salud | Seguros de salud, cotizaciones, autorizaciones |
| **2** | Vida | Seguros de vida, beneficiarios, reclamaciones |
| **3** | P&C | Propiedad y Accidentes (auto, hogar, RC) |
| **4** | PQRS | Quejas, sugerencias, siniestros |
| **5** | Estado | Consultar estado de póliza |
| **0** | Asesor | Transferir a agente humano |
| **\*** | Atrás | Volver al menú de idiomas |

---

## 5. Submenús por Línea de Negocio

### 5.1 Menú SALUD (Tecla 1)

```
"Usted ha llegado a nuestro equipo de Salud.
1 - Cotización o afiliación
2 - Autorización o información
3 - Beneficios y coberturas
4 - Pagos o facturación
5 - Volver al menú anterior
0 - Hablar con asesor"
```

| Tecla | Acción | Cola de Destino |
|-------|--------|-----------------|
| 1 | Cotizar/Afiliar | VQ_SALUD_VENTAS |
| 2 | Autorizaciones | VQ_SALUD_SERVICIO |
| 3 | Beneficios | AUTOATENCIÓN (envío por WhatsApp) |
| 4 | Pagos | VQ_SALUD_BACKOFFICE |
| 0 | Asesor | VQ_SALUD_GENERAL |

**Asesores asignados:** Carlos, Cristian, Arnulfo, Homero, Hermes, Lina

---

### 5.2 Menú VIDA (Tecla 2)

```
"Usted ha llegado a nuestro equipo de Vida.
1 - Contratar o renovar
2 - Cambiar beneficiario o datos bancarios
3 - Información sobre su póliza
4 - Reclamaciones
5 - Volver al menú anterior
0 - Hablar con asesor"
```

| Tecla | Acción | Cola de Destino |
|-------|--------|-----------------|
| 1 | Contratar/Renovar | VQ_VIDA_VENTAS |
| 2 | Cambiar beneficiario | VQ_VIDA_SERVICIO |
| 3 | Info de póliza | AUTOATENCIÓN |
| 4 | Reclamaciones | VQ_VIDA_SERVICIO |
| 0 | Asesor | VQ_VIDA_GENERAL |

**Asesores asignados:** Juan, María, Carlos, Sebastián

---

### 5.3 Menú P&C - Propiedad y Accidentes (Tecla 3)

```
"Usted ha llegado a nuestro equipo de P&C.
1 - Cotización de auto, hogar o RC
2 - Información de su póliza
3 - Renovar póliza
4 - Reportar siniestro
5 - Volver al menú anterior
0 - Hablar con asesor"
```

| Tecla | Acción | Cola de Destino |
|-------|--------|-----------------|
| 1 | Cotizar | VQ_PYC_VENTAS |
| 2 | Info póliza | VQ_PYC_SERVICIO |
| 3 | Renovar | VQ_PYC_VENTAS |
| 4 | **Siniestro** | VQ_PYC_SINIESTRO (7x24) 🚨 |
| 0 | Asesor | VQ_PYC_GENERAL |

**Asesores asignados:** Camila, Carlos, Santiago, Lidia, Mario, Margarita

---

### 5.4 Menú PQRS (Tecla 4)

```
"Ha seleccionado PQRS y trámites.
1 - Reportar queja o reclamación
2 - Hacer sugerencia
3 - Reportar siniestro
4 - Volver al menú anterior
0 - Hablar con asesor especializado"
```

| Tecla | Acción | Cola de Destino |
|-------|--------|-----------------|
| 1 | Queja/Reclamo | VQ_PQRS_GENERAL |
| 2 | Sugerencia | VQ_PQRS_GENERAL |
| 3 | **Siniestro urgente** | VQ_SINIESTRO_URGENTE (7x24) 🚨 |
| 0 | Asesor PQRS | VQ_PQRS_GENERAL |

---

## 6. Controles del Simulador

### Durante la Llamada

| Acción | Cómo hacerlo |
|--------|--------------|
| Presionar tecla | Clic en el teclado virtual o usa el teclado físico (0-9, *, #) |
| Interrumpir audio | Presiona cualquier tecla mientras se reproduce el mensaje |
| Volver atrás | Presiona **\*** en la mayoría de menús |
| Colgar | Clic en el botón rojo **📴 Colgar** |

### Panel de Controles

| Control | Función |
|---------|---------|
| **Modo Entrenamiento** | Activa pausas más largas entre mensajes |
| **Reiniciar Simulador** | Vuelve al estado inicial |
| **API Key** | Campo para ingresar/cambiar el API key de ElevenLabs |

---

## 7. Flujo de Ejemplo: Cotización de Seguro de Salud

### Escenario
Un cliente nuevo quiere cotizar un seguro de salud.

### Pasos

1. **Clic en "Llamar"**
   - Escucha: "Welcome to Unity Line..."

2. **Presiona 2** (Español)
   - Escucha: "Bienvenido a su aseguradora..."

3. **Presiona 1** (Salud)
   - Escucha: "Usted ha llegado a nuestro equipo de Salud..."

4. **Presiona 1** (Cotización)
   - Escucha: "Ha seleccionado cotización o afiliación de salud. En un momento le transferiremos con un asesor especializado..."
   - **Transferencia a VQ_SALUD_VENTAS**

### Visualización en Panel de Navegación
```
🏠 Inicio
  └── 📋 MAIN_MENU_ES
        └── 🏥 MENU_SALUD
              └── 📝 SALUD_COTIZACION ✓
```

---

## 8. Flujo de Ejemplo: Reportar un Siniestro de Auto

### Escenario
Un cliente tuvo un accidente automovilístico.

### Pasos

1. **Clic en "Llamar"** → Presiona **2** (Español)

2. **Presiona 3** (P&C - Propiedad y Accidentes)
   - Escucha: "Usted ha llegado a nuestro equipo de P&C..."

3. **Presiona 4** (Reportar Siniestro)
   - Escucha: "Ha seleccionado reportar un siniestro. Es importante que tenga a mano los detalles del incidente. Un ajustador de nuestra línea 24/7 le atenderá de inmediato."
   - **Transferencia URGENTE a VQ_PYC_SINIESTRO** 🚨

---

## 9. Horarios de Atención por Cola

| Cola | Horario |
|------|---------|
| VQ_SALUD_* | L-V 7:00-19:00, S 8:00-13:00 |
| VQ_VIDA_* | L-V 7:00-19:00, S 8:00-13:00 |
| VQ_PYC_VENTAS/SERVICIO | L-V 7:00-19:00, S 8:00-13:00 |
| **VQ_PYC_SINIESTRO** | **24/7** 🚨 |
| VQ_PQRS_GENERAL | L-V 7:00-19:00, S 8:00-13:00 |
| **VQ_SINIESTRO_URGENTE** | **24/7** 🚨 |
| Back Office | L-V 7:00-19:00 |

---

## 10. Uso del Teclado Físico

Puedes usar el teclado de tu computadora durante la llamada:

| Tecla PC | Función IVR |
|----------|-------------|
| `1` - `9` | Opciones del menú |
| `0` | Hablar con asesor |
| `*` (Shift+8) | Volver / Cancelar |
| `#` (Shift+3) | Confirmar entrada |

---

## 11. Panel de Transcript

El panel de transcript muestra en tiempo real:

```
[17:45:23] 🔊 Welcome to Unity Line — Great Deals...
[17:45:28] 👤 Tecla presionada: 2
[17:45:29] 🔊 Bienvenido a su aseguradora...
[17:45:45] 👤 Tecla presionada: 1
[17:45:46] 🔊 Usted ha llegado a nuestro equipo de Salud...
```

Útil para:
- Verificar que el TTS reprodujo correctamente el mensaje
- Revisar la secuencia de teclas presionadas
- Documentar escenarios de prueba

---

## 12. Solución de Problemas

### El audio no se reproduce
1. Verifica que el navegador tenga permiso para reproducir audio
2. Revisa que el volumen del sistema no esté en silencio
3. Comprueba que el API key de ElevenLabs esté configurado

### El simulador no responde a las teclas
1. Asegúrate de que la llamada esté activa (botón "Colgar" habilitado)
2. Espera a que termine el audio actual o presiónalo para interrumpir
3. Intenta hacer clic directamente en el teclado virtual

### Error al generar audio
1. Verifica la conexión a internet
2. El API key de ElevenLabs puede haber expirado o tener límite
3. Revisa la consola del navegador (F12) para más detalles

---

## 13. Mejores Prácticas para Entrenamiento

### Para Supervisores
1. Activa el **Modo Entrenamiento** para pausas más largas
2. Usa el **Panel de Navegación** para explicar el árbol IVR
3. Revisa el **Transcript** después de cada ejercicio

### Para Agentes Nuevos
1. Practica cada ruta del menú al menos 3 veces
2. Memoriza las opciones numéricas de tu línea de negocio
3. Familiarízate con las transferencias a otras colas

### Ejercicios Sugeridos

| Ejercicio | Ruta |
|-----------|------|
| Cotización Salud | 2 → 1 → 1 |
| Autorización médica | 2 → 1 → 2 |
| Siniestro auto urgente | 2 → 3 → 4 |
| Queja de cliente | 2 → 4 → 1 |
| Cambio de beneficiario vida | 2 → 2 → 2 |

---

## 14. Información Técnica

| Elemento | Valor |
|----------|-------|
| **URL** | https://ivr-unity-a6zp5.ondigitalocean.app |
| **Plataforma** | DigitalOcean App Platform |
| **TTS Engine** | ElevenLabs (eleven_multilingual_v2) |
| **Voz** | Rachel (EXAVITQu4vr4xnSDxMaL) |
| **Repositorio** | github.com/terrizoaguimor/ivr-unity |

---

## Contacto y Soporte

Para reportar problemas o sugerencias sobre el simulador:
- **Email:** mario.gutierrez@unityfinancialnetwork.com
- **Equipo:** Unity IT Team

---

*Última actualización: Enero 2026*
*Versión del Simulador: 1.0*
