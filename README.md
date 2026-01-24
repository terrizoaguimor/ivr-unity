# IVR Unity Financial - Simulador Didáctico

Simulador interactivo de sistema IVR (Interactive Voice Response) para entrenamiento de agentes de call center de Unity Financial.

## Características

- **Teléfono virtual realista** con teclado numérico interactivo
- **Síntesis de voz** en tiempo real usando ElevenLabs API
- **Soporte bilingüe** (inglés para bienvenida, español para menús)
- **Panel de transcript** para seguimiento de la conversación
- **Historial de navegación** visual del árbol IVR
- **Modo entrenamiento** con pausas extendidas
- **Panel de depuración** para desarrollo

## Estructura del Menú IVR

```
WELCOME (Bienvenida bilingüe)
├── 1 → English Menu
└── 2 → Menú Español
    ├── 1 → Salud
    │   ├── 1 → Cotización/Afiliación
    │   ├── 2 → Autorización/Información
    │   ├── 3 → Beneficios/Coberturas
    │   ├── 4 → Pagos/Facturación
    │   ├── 5 → Menú anterior
    │   └── 0 → Hablar con asesor
    ├── 2 → Vida
    │   ├── 1 → Contratar/Renovar
    │   ├── 2 → Cambiar beneficiario
    │   ├── 3 → Info de póliza
    │   ├── 4 → Reclamaciones
    │   ├── 5 → Menú anterior
    │   └── 0 → Hablar con asesor
    ├── 3 → Propiedad y Accidentes
    │   ├── 1 → Cotización
    │   ├── 2 → Info de póliza
    │   ├── 3 → Renovar
    │   ├── 4 → Reportar siniestro
    │   ├── 5 → Menú anterior
    │   └── 0 → Hablar con asesor
    ├── 4 → PQRS
    │   ├── 1 → Queja/Reclamación
    │   ├── 2 → Sugerencia
    │   ├── 3 → Reportar siniestro
    │   ├── 5 → Menú anterior
    │   └── 0 → Hablar con asesor
    ├── 5 → Estado de póliza
    └── 0 → Hablar con asesor
```

## Instalación

1. Clone o descargue este repositorio
2. No requiere instalación de dependencias (proyecto 100% frontend)

## Configuración

### API Key de ElevenLabs

1. Cree una cuenta en [ElevenLabs](https://elevenlabs.io)
2. Obtenga su API key desde el dashboard
3. Ingrese la API key de una de estas formas:
   - **Opción A**: Edite `config.js` y reemplace `'TU_API_KEY_AQUI'`
   - **Opción B**: Use el campo "API Key" en el panel de controles

La API key se guarda automáticamente en localStorage.

## Uso

### Iniciar una llamada

1. Abra `index.html` en un navegador moderno (Chrome, Firefox, Safari)
2. Haga clic en el botón **Llamar**
3. Escuche el mensaje de bienvenida
4. Navegue usando el teclado numérico:
   - **1-9, 0**: Seleccionar opciones del menú
   - **\***: Volver al menú anterior
   - **#**: Confirmar entrada (para campos de texto)

### Controles

- **Llamar**: Inicia la simulación de llamada
- **Colgar**: Finaliza la llamada actual
- **Reiniciar Simulador**: Resetea todo el estado
- **Modo Entrenamiento**: Activa pausas más largas entre mensajes

### Navegación por teclado

También puede usar el teclado físico durante la llamada:
- Teclas `0-9` para opciones
- Tecla `*` para asterisco
- Tecla `#` para numeral

## Compatibilidad

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## Desarrollo

### Estructura de archivos

```
/ivr-unity/
├── index.html          # Página principal
├── config.js           # Configuración (API key, timeouts)
├── css/
│   └── styles.css      # Estilos del teléfono y UI
├── js/
│   ├── app.js          # Aplicación principal
│   ├── ivr-flow.js     # Árbol de decisiones IVR
│   ├── ivr-engine.js   # Máquina de estados
│   ├── elevenlabs.js   # Cliente API ElevenLabs
│   └── audio-manager.js # Gestión de audio
└── assets/
    └── images/         # Recursos gráficos
```

### Personalización del flujo IVR

Edite `js/ivr-flow.js` para modificar:
- Mensajes de texto (TTS)
- Transiciones entre menús
- Nuevos nodos del árbol

Cada nodo tiene esta estructura:

```javascript
NOMBRE_NODO: {
  id: 'NOMBRE_NODO',
  type: 'menu' | 'message' | 'input' | 'terminal',
  language: 'es' | 'en',
  message: "Texto que se reproducirá como voz",
  displayText: "Texto que se muestra en pantalla",
  transitions: {
    '1': 'OTRO_NODO',    // Tecla 1 va a OTRO_NODO
    '0': 'TRANSFER',     // Tecla 0 transfiere
    '*': 'MENU_ANTERIOR',
    'timeout': 'MISMO_NODO'  // En caso de timeout
  },
  icon: '📋'
}
```

## Notas técnicas

- El proyecto es 100% frontend (sin backend)
- Las llamadas a ElevenLabs se hacen directamente desde el navegador
- Los audios generados se cachean para reducir llamadas API
- Para producción, se recomienda un proxy backend para proteger la API key

## Licencia

Uso interno - Unity Financial
