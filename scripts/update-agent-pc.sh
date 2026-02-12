#!/bin/bash

# Script para actualizar el agente de ElevenLabs con el prompt expandido de P&C
# Uso: ELEVENLABS_API_KEY=tu_api_key ./scripts/update-agent-pc.sh

set -e

AGENT_ID="agent_4801kg64ffw3f4q8vdytf5j7yz85"
PROMPT_FILE="ELEVENLABS_PROMPT_P&C_EXPANDED.txt"

if [ -z "$ELEVENLABS_API_KEY" ]; then
  echo "❌ Error: ELEVENLABS_API_KEY no está configurado"
  echo "Uso: ELEVENLABS_API_KEY=tu_api_key ./scripts/update-agent-pc.sh"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "❌ Error: No se encuentra el archivo $PROMPT_FILE"
  exit 1
fi

echo "🔄 Actualizando agente $AGENT_ID con prompt expandido de P&C..."

# Leer el prompt del archivo y escapar para JSON
PROMPT_CONTENT=$(cat "$PROMPT_FILE" | jq -Rs .)

# Crear JSON payload
cat > /tmp/update_agent_pc.json <<EOF
{
  "conversation_config": {
    "agent": {
      "prompt": {
        "prompt": $PROMPT_CONTENT
      }
    }
  }
}
EOF

# Actualizar el agente
curl -X PATCH "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/update_agent_pc.json

echo ""
echo "✅ Agente actualizado con éxito"
echo ""
echo "📋 Cambios incluidos:"
echo "  ✓ Flujos completos de siniestros HOME (incendio, robo, agua, tormenta)"
echo "  ✓ Flujos de RENTERS (inquilinos)"
echo "  ✓ Flujos de FLOOD (inundación)"
echo "  ✓ Soporte para UMBRELLA (responsabilidad extendida)"
echo "  ✓ Keywords expandidas para todos los productos P&C"
echo "  ✓ Plazos de reporte específicos por tipo de siniestro"
echo "  ✓ Validaciones de cobertura (agua interna vs externa)"
echo ""
echo "🧪 Prueba el agente llamando a: +1 (754) 273-9829"
echo "📖 Usa los casos de prueba en: tests/MOCK_DATA_PC.md"

# Limpiar archivo temporal
rm -f /tmp/update_agent_pc.json
