/**
 * Script para listar todos los agentes de Wolkvox
 * y obtener sus IDs numéricos
 */

import { WolkvoxClient } from '../wolkvox/wolkvox-client';
import { logger } from '../utils/logger';

async function listWolkvoxAgents() {
  // Configuración desde variables de entorno
  const server = process.env.WOLKVOX_SERVER;
  const token = process.env.WOLKVOX_TOKEN;

  if (!server || !token) {
    console.error('❌ Error: WOLKVOX_SERVER y WOLKVOX_TOKEN son requeridos');
    console.error('Configura las variables de entorno primero.');
    process.exit(1);
  }

  console.log('🔍 Conectando a Wolkvox...');
  console.log(`📡 Server: wv${server}.wolkvox.com\n`);

  const wolkvox = new WolkvoxClient({
    server,
    token,
  });

  try {
    // Health check
    const isHealthy = await wolkvox.healthCheck();
    if (!isHealthy) {
      console.error('❌ Error: No se pudo conectar a Wolkvox');
      process.exit(1);
    }

    console.log('✅ Conexión exitosa\n');

    // Obtener agentes
    console.log('📋 Obteniendo lista de agentes...\n');
    const agents = await wolkvox.getRealtimeAgents();

    if (agents.length === 0) {
      console.log('⚠️  No se encontraron agentes');
      return;
    }

    console.log(`📊 Total de agentes: ${agents.length}\n`);
    console.log('═'.repeat(80));

    // Mostrar cada agente
    agents.forEach((agent, index) => {
      console.log(`\n👤 Agente #${index + 1}`);
      console.log(`   ID:     ${agent.agent_id}`);
      console.log(`   Nombre: ${agent.agent_name}`);
      console.log(`   Estado: ${agent.agent_status}`);
      console.log(`   Llamadas: ${agent.calls} (IN: ${agent.inbound}, OUT: ${agent.outbound})`);
      console.log(`   Login time: ${agent.login_time}`);
    });

    console.log('\n' + '═'.repeat(80));

    // Sugerencia de agente para bot
    console.log('\n💡 SUGERENCIA:');
    console.log('Crea un agente virtual en Wolkvox llamado "ElevenLabs Bot" o "IVR Bot"');
    console.log('y usa su agent_id numérico en el código.');
    console.log('\nPor ejemplo, si el ID es "8001", actualiza el código para usar ese número.');

    // Mostrar agentes disponibles para filtrar
    console.log('\n🔍 PARA FILTRAR EN WOLKVOX UI:');
    console.log('Usa cualquiera de estos IDs numéricos:\n');
    agents.slice(0, 5).forEach(agent => {
      console.log(`   - ${agent.agent_id} (${agent.agent_name})`);
    });

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Ejecutar
listWolkvoxAgents()
  .then(() => {
    console.log('\n✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
