# Guía de Uso - IVR Unity Financial
## Simulador de Entrenamiento para Agentes de Call Center

---

## Índice

1. [Acceso al Sistema](#1-acceso-al-sistema)
2. [Herramientas Disponibles](#2-herramientas-disponibles)
3. [Interfaz del Simulador](#3-interfaz-del-simulador)
4. [Cómo Iniciar una Llamada](#4-cómo-iniciar-una-llamada)
5. [Navegación del Menú Principal](#5-navegación-del-menú-principal-español)
6. [Submenús por Línea de Negocio](#6-submenús-por-línea-de-negocio)
7. [Diagrama de Flujo Interactivo](#7-diagrama-de-flujo-interactivo)
8. [Controles del Simulador](#8-controles-del-simulador)
9. [Ejemplos Prácticos](#9-ejemplos-prácticos)
10. [Horarios de Atención](#10-horarios-de-atención-por-cola)
11. [Uso del Teclado Físico](#11-uso-del-teclado-físico)
12. [Solución de Problemas](#12-solución-de-problemas)
13. [Mejores Prácticas](#13-mejores-prácticas-para-entrenamiento)
14. [Información Técnica](#14-información-técnica)

---

## 1. Acceso al Sistema

### URLs del Sistema

| Herramienta | URL |
|-------------|-----|
| **Simulador IVR** | https://ivr-unity-a6zp5.ondigitalocean.app |
| **Diagrama de Flujo** | https://ivr-unity-a6zp5.ondigitalocean.app/diagrama.html |

### Credenciales de Acceso

Cuando el navegador solicite autenticación:

| Campo | Valor |
|-------|-------|
| **Usuario** | `unity` |
| **Contraseña** | `UnityIVR2024!` |

> **Nota:** El sistema de voz (TTS) ya está configurado y listo para usar. No necesitas ingresar ningún API key.

---

## 2. Herramientas Disponibles

El sistema cuenta con dos herramientas principales:

### 2.1 Simulador IVR (Página Principal)

Un teléfono virtual interactivo que simula la experiencia completa del cliente llamando al IVR de Unity Financial.

**Características:**
- Teléfono virtual con teclado numérico
- Voces realistas generadas por inteligencia artificial
- Panel de transcript en tiempo real
- Historial de navegación visual
- Modo entrenamiento con pausas extendidas

### 2.2 Diagrama de Flujo Interactivo

Una visualización gráfica de todo el árbol IVR donde puedes hacer clic en cualquier nodo para escuchar el mensaje correspondiente.

**Características:**
- Vista completa del árbol de decisiones
- Código de colores por línea de negocio
- Clic para escuchar cualquier mensaje
- Muestra las colas de destino (VQ)

---

## 3. Interfaz del Simulador

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
| **✅ Sistema TTS** | Indicador de que el sistema de voz está configurado y listo |
| **📝 Transcript** | Muestra el texto de cada mensaje TTS y las teclas presionadas |
| **🗺️ Navegación** | Visualiza el recorrido por el árbol IVR |
| **🔧 Estado del Sistema** | Información técnica para depuración (opcional) |
| **⚙️ Controles** | Modo entrenamiento y reinicio del simulador |

---

## 4. Cómo Iniciar una Llamada

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

## 5. Navegación del Menú Principal (Español)

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

## 6. Submenús por Línea de Negocio

### 6.1 Menú SALUD (Tecla 1)

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

### 6.2 Menú VIDA (Tecla 2)

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

### 6.3 Menú P&C - Propiedad y Accidentes (Tecla 3)

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

### 6.4 Menú PQRS (Tecla 4)

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

## 7. Diagrama de Flujo Interactivo

### Cómo Usar el Diagrama

1. **Accede a:** https://ivr-unity-a6zp5.ondigitalocean.app/diagrama.html
2. **Ingresa** las credenciales (unity / UnityIVR2024!)
3. **Haz clic** en cualquier nodo del diagrama para escuchar el mensaje

### Código de Colores

| Color | Línea de Negocio |
|-------|------------------|
| 🟢 Verde | Salud |
| 🟣 Morado | Vida |
| 🟠 Naranja | P&C (Propiedad y Accidentes) |
| 🔵 Azul | PQRS |
| 🔴 Rojo (borde punteado) | Transferencia a agente |

### Utilidad del Diagrama

- **Supervisores:** Explicar el flujo completo a nuevos agentes
- **Agentes:** Repasar mensajes específicos sin navegar todo el IVR
- **QA:** Verificar que los mensajes son correctos
- **Entrenamiento:** Escuchar ejemplos de cada interacción

---

## 8. Controles del Simulador

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

---

## 9. Ejemplos Prácticos

### Ejemplo 1: Cotización de Seguro de Salud

**Escenario:** Un cliente nuevo quiere cotizar un seguro de salud.

**Pasos:**

1. **Clic en "Llamar"**
   - Escucha: "Welcome to Unity Line..."

2. **Presiona 2** (Español)
   - Escucha: "Bienvenido a su aseguradora..."

3. **Presiona 1** (Salud)
   - Escucha: "Usted ha llegado a nuestro equipo de Salud..."

4. **Presiona 1** (Cotización)
   - Escucha: "Ha seleccionado cotización o afiliación de salud..."
   - **Transferencia a VQ_SALUD_VENTAS**

**Ruta rápida:** `Llamar → 2 → 1 → 1`

---

### Ejemplo 2: Reportar un Siniestro de Auto

**Escenario:** Un cliente tuvo un accidente automovilístico.

**Pasos:**

1. **Clic en "Llamar"** → **Presiona 2** (Español)

2. **Presiona 3** (P&C - Propiedad y Accidentes)
   - Escucha: "Usted ha llegado a nuestro equipo de P&C..."

3. **Presiona 4** (Reportar Siniestro)
   - Escucha: "Ha seleccionado reportar un siniestro. Es importante que tenga a mano los detalles del incidente..."
   - **Transferencia URGENTE a VQ_PYC_SINIESTRO** 🚨

**Ruta rápida:** `Llamar → 2 → 3 → 4`

---

### Ejemplo 3: Cambiar Beneficiario de Seguro de Vida

**Escenario:** Un cliente quiere actualizar el beneficiario de su póliza de vida.

**Pasos:**

1. **Llamar → 2** (Español)
2. **Presiona 2** (Vida)
3. **Presiona 2** (Cambiar beneficiario)
   - **Transferencia a VQ_VIDA_SERVICIO**

**Ruta rápida:** `Llamar → 2 → 2 → 2`

---

### Ejemplo 4: Presentar una Queja

**Escenario:** Un cliente insatisfecho quiere presentar una queja formal.

**Pasos:**

1. **Llamar → 2** (Español)
2. **Presiona 4** (PQRS)
3. **Presiona 1** (Queja/Reclamación)
   - **Transferencia a VQ_PQRS_GENERAL**

**Ruta rápida:** `Llamar → 2 → 4 → 1`

---

## 10. Horarios de Atención por Cola

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

## 11. Uso del Teclado Físico

Puedes usar el teclado de tu computadora durante la llamada:

| Tecla PC | Función IVR |
|----------|-------------|
| `1` - `9` | Opciones del menú |
| `0` | Hablar con asesor |
| `*` (Shift+8) | Volver / Cancelar |
| `#` (Shift+3) | Confirmar entrada |

---

## 12. Solución de Problemas

### El audio no se reproduce

1. ✅ Verifica que el navegador tenga permiso para reproducir audio
2. ✅ Revisa que el volumen del sistema no esté en silencio
3. ✅ Asegúrate de ver el indicador verde "Sistema TTS configurado y listo"
4. ✅ Prueba refrescando la página (F5)

### El simulador no responde a las teclas

1. ✅ Asegúrate de que la llamada esté activa (botón "Colgar" habilitado)
2. ✅ Espera a que termine el audio actual o presiona una tecla para interrumpir
3. ✅ Intenta hacer clic directamente en el teclado virtual

### La página no carga

1. ✅ Verifica que ingresaste las credenciales correctas (unity / UnityIVR2024!)
2. ✅ Intenta en modo incógnito del navegador
3. ✅ Limpia la caché del navegador

### El diagrama no reproduce audio

1. ✅ Verifica que el indicador muestre "Sistema TTS configurado y listo"
2. ✅ Haz clic directamente sobre el nodo, no en el texto
3. ✅ Espera a que termine un audio antes de reproducir otro

---

## 13. Mejores Prácticas para Entrenamiento

### Para Supervisores

1. ✅ Activa el **Modo Entrenamiento** para pausas más largas
2. ✅ Usa el **Diagrama de Flujo** para explicar el árbol IVR visualmente
3. ✅ Revisa el **Panel de Transcript** después de cada ejercicio
4. ✅ Asigna rutas específicas a cada agente según su línea de negocio

### Para Agentes Nuevos

1. ✅ Practica cada ruta del menú al menos 3 veces
2. ✅ Memoriza las opciones numéricas de tu línea de negocio
3. ✅ Familiarízate con las transferencias a otras colas
4. ✅ Usa el diagrama para repasar los mensajes

### Ejercicios Sugeridos

| Ejercicio | Ruta | Cola Destino |
|-----------|------|--------------|
| Cotización Salud | 2 → 1 → 1 | VQ_SALUD_VENTAS |
| Autorización médica | 2 → 1 → 2 | VQ_SALUD_SERVICIO |
| Contratar seguro de vida | 2 → 2 → 1 | VQ_VIDA_VENTAS |
| Cambio de beneficiario | 2 → 2 → 2 | VQ_VIDA_SERVICIO |
| Cotización auto/hogar | 2 → 3 → 1 | VQ_PYC_VENTAS |
| Siniestro auto urgente | 2 → 3 → 4 | VQ_PYC_SINIESTRO 🚨 |
| Queja de cliente | 2 → 4 → 1 | VQ_PQRS_GENERAL |
| Siniestro urgente general | 2 → 4 → 3 | VQ_SINIESTRO_URGENTE 🚨 |

### Checklist de Competencias

- [ ] Conoce el mensaje de bienvenida completo
- [ ] Puede navegar al menú de su línea de negocio
- [ ] Identifica cuándo transferir a siniestros urgentes
- [ ] Sabe usar la tecla * para volver atrás
- [ ] Puede explicar las opciones al cliente si pregunta

---

## 14. Información Técnica

| Elemento | Valor |
|----------|-------|
| **URL Simulador** | https://ivr-unity-a6zp5.ondigitalocean.app |
| **URL Diagrama** | https://ivr-unity-a6zp5.ondigitalocean.app/diagrama.html |
| **Plataforma** | DigitalOcean App Platform |
| **TTS Engine** | ElevenLabs (eleven_multilingual_v2) |
| **Voz** | Rachel (EXAVITQu4vr4xnSDxMaL) |
| **Autenticación** | HTTP Basic Auth (htpasswd) |

---

## Navegación Rápida

| Desde el Simulador | Desde el Diagrama |
|--------------------|-------------------|
| 📊 [Ver Diagrama de Flujo](diagrama.html) | 📞 [Ir al Simulador](index.html) |

---

## Contacto y Soporte

Para reportar problemas o sugerencias sobre el simulador:

| Tipo | Contacto |
|------|----------|
| **Email** | mario.gutierrez@unityfinancialnetwork.com |
| **Equipo** | Unity IT Team |

---

**Unity Financial** - *Great Deals. Greater Trust.*

---

*Última actualización: Enero 2026*
*Versión del Simulador: 1.1*
