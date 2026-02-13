/**
 * Script para crear el agente virtual "ElevenLabs Bot" en Wolkvox
 */

import { WolkvoxClient } from '../wolkvox/wolkvox-client';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function createBotAgent() {
  const server = process.env.WOLKVOX_SERVER;
  const token = process.env.WOLKVOX_TOKEN;

  if (!server || !token) {
    console.error('❌ Error: WOLKVOX_SERVER y WOLKVOX_TOKEN son requeridos');
    process.exit(1);
  }

  console.log('🤖 Creando agente virtual en Wolkvox...');
  console.log(`📡 Server: wv${server}.wolkvox.com\n`);

  const wolkvox = new WolkvoxClient({
    server,
    token,
  });

  try {
    // Verificar conexión
    const isHealthy = await wolkvox.healthCheck();
    if (!isHealthy) {
      console.error('❌ Error: No se pudo conectar a Wolkvox');
      process.exit(1);
    }

    console.log('✅ Conexión exitosa\n');

    // Crear agente virtual
    console.log('📝 Creando agente virtual "ElevenLabs Bot"...');

    const result = await wolkvox.createAgent({
      agentName: 'ElevenLabs Bot',
      agentUser: 'elevenlabs_bot',
      // No se proporciona password - Wolkvox asignará uno aleatorio
    });

    console.log('\n✅ ¡Agente creado exitosamente!');
    console.log('═'.repeat(60));
    console.log(`\n🆔 AGENT ID: ${result.agentId}`);
    console.log(`👤 Nombre: ElevenLabs Bot`);
    console.log(`👨‍💻 Usuario: elevenlabs_bot\n`);
    console.log('═'.repeat(60));

    // Actualizar archivo .env
    console.log('\n📝 Actualizando archivo .env...');

    const envPath = path.join(__dirname, '../../.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Verificar si ya existe la variable
    if (envContent.includes('WOLKVOX_BOT_AGENT_ID=')) {
      // Reemplazar valor existente
      envContent = envContent.replace(
        /WOLKVOX_BOT_AGENT_ID=.*/,
        `WOLKVOX_BOT_AGENT_ID=${result.agentId}`
      );
      console.log('✅ Variable WOLKVOX_BOT_AGENT_ID actualizada');
    } else {
      // Agregar nueva variable
      if (!envContent.endsWith('\n')) {
        envContent += '\n';
      }
      envContent += `\n# ID del agente virtual para ElevenLabs Bot\n`;
      envContent += `WOLKVOX_BOT_AGENT_ID=${result.agentId}\n`;
      console.log('✅ Variable WOLKVOX_BOT_AGENT_ID agregada');
    }

    fs.writeFileSync(envPath, envContent);

    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('1. Reinicia el backend: npm start');
    console.log('2. Filtra en Wolkvox UI por Agent ID:', result.agentId);
    console.log('3. Verás todos los logs del bot de ElevenLabs\n');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('\n💡 El agente ya existe. Lista los agentes para obtener su ID:');
      console.log('   npm run build && node dist/scripts/list-wolkvox-agents.js');
    }

    process.exit(1);
  }
}

// Ejecutar
createBotAgent()
  .then(() => {
    console.log('✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
