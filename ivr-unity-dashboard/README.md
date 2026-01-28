# IVR Unity Dashboard

Dashboard de administracion para el sistema IVR de Unity Financial.

## Caracteristicas

- **Monitoreo en tiempo real** de llamadas activas
- **Transcripciones** de conversaciones via ElevenLabs API
- **Gestion de agentes AI** de ElevenLabs Conversational AI
- **Configuracion** de credenciales y ajustes
- **Autenticacion** segura con JWT
- **Tema oscuro/claro** con soporte de sistema

## Stack Tecnologico

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + Framer Motion
- **Design**: Google Material Design 3
- **Auth**: JWT con jose
- **State**: React hooks

## Requisitos

- Node.js 18+
- Cuenta de ElevenLabs (para transcripciones)
- Backend IVR corriendo (para llamadas en tiempo real)

## Instalacion

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Configurar variables en .env
# - AUTH_SECRET: Clave secreta para JWT (min 32 chars)
# - ADMIN_USERNAME: Usuario administrador
# - ADMIN_PASSWORD: Contrasena administrador
# - ELEVENLABS_API_KEY: API key de ElevenLabs
# - ELEVENLABS_AGENT_ID: ID del agente
# - BACKEND_URL: URL del backend IVR

# Iniciar en desarrollo
npm run dev
```

## Estructura

```
src/
├── app/
│   ├── (auth)/login/          # Pagina de login
│   ├── (dashboard)/           # Paginas del dashboard
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── calls/             # Llamadas en tiempo real
│   │   ├── transcripts/       # Historial de transcripciones
│   │   ├── agents/            # Gestion de agentes AI
│   │   └── settings/          # Configuracion
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # Componentes reutilizables
│   ├── dashboard/             # Componentes del dashboard
│   └── calls/                 # Componentes de llamadas
├── hooks/                     # Custom React hooks
├── lib/                       # Utilidades y servicios
└── types/                     # TypeScript definitions
```

## Paginas

| Ruta | Descripcion |
|------|-------------|
| `/login` | Inicio de sesion |
| `/` | Dashboard con stats y llamadas activas |
| `/calls` | Lista y monitoreo de llamadas |
| `/transcripts` | Historial de transcripciones de ElevenLabs |
| `/transcripts/[id]` | Detalle de una transcripcion |
| `/agents` | Gestion de agentes AI |
| `/settings` | Configuracion de credenciales |

## API Endpoints

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/api/auth/login` | POST | Iniciar sesion |
| `/api/auth/logout` | POST | Cerrar sesion |
| `/api/settings` | GET/POST | Obtener/guardar configuracion |

## Conexion en Tiempo Real

El dashboard se conecta al backend via WebSocket para recibir actualizaciones en tiempo real:

```typescript
// El hook useRealtimeCalls maneja la conexion
const { calls, activeCalls, connected } = useRealtimeCalls();
```

Eventos soportados:
- `call:new` - Nueva llamada entrante
- `call:update` - Actualizacion de estado
- `call:ended` - Llamada terminada
- `calls:list` - Lista inicial de llamadas

## Deployment

### DigitalOcean App Platform

```bash
doctl apps create --spec .do/app.yaml
```

### Docker

```bash
docker build -t ivr-unity-dashboard .
docker run -p 3001:3001 --env-file .env ivr-unity-dashboard
```

## Seguridad

- Autenticacion requerida para todas las rutas (excepto `/login`)
- Tokens JWT con expiracion de 24h y refresh automatico
- Credenciales API nunca expuestas al frontend
- Headers de seguridad via middleware
