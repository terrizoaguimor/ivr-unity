import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

// Voice IDs
const MARTIN_VOICE_ID = 'fLBIPozdalGjWI2TZRy2'; // Martín Tuiran
const FIRST_MESSAGE = 'Bienvenido a Unity Financial Network, Great Deals, Greater Trust. ¿Ya eres cliente de Unity o es tu primera vez llamando?';

async function updateAgent() {
  console.log('🔧 Actualizando agente de ElevenLabs a v3.0...');
  console.log(`Agent ID: ${AGENT_ID}\n`);

  try {
    // 1. Get current agent configuration
    console.log('📋 Obteniendo configuración actual...');
    const getResponse = await axios.get(
      `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    const currentAgent = getResponse.data;
    console.log(`   Agente: ${currentAgent.name}`);
    console.log(`   Voz actual: ${currentAgent.conversation_config?.tts?.voice_id || 'N/A'}\n`);

    // 2. Read new prompt from file
    console.log('📄 Cargando prompt v3.0...');
    const promptPath = path.join(__dirname, '../../prompts/unity-agent-prompt-v3.md');
    const newPrompt = fs.readFileSync(promptPath, 'utf-8');
    console.log(`   Prompt cargado: ${newPrompt.length} caracteres\n`);

    // 3. Update agent configuration
    console.log('🚀 Actualizando configuración...');

    // Clean up conflicting fields
    const cleanAgent = { ...currentAgent };
    delete cleanAgent.version_id;
    delete cleanAgent.branch_id;
    delete cleanAgent.main_branch_id;
    delete cleanAgent.procedure_versions;
    delete cleanAgent.procedures_enabled;
    delete cleanAgent.access_info;
    delete cleanAgent.tags;
    delete cleanAgent.metadata;
    delete cleanAgent.platform_settings;
    delete cleanAgent.phone_numbers;
    delete cleanAgent.whatsapp_accounts;
    delete cleanAgent.workflow;

    const updatedConfig = {
      ...cleanAgent,
      conversation_config: {
        ...cleanAgent.conversation_config,
        tts: {
          ...cleanAgent.conversation_config.tts,
          voice_id: MARTIN_VOICE_ID, // Change to Martin's voice
        },
        agent: {
          ...cleanAgent.conversation_config.agent,
          first_message: FIRST_MESSAGE,
          prompt: {
            ...cleanAgent.conversation_config.agent.prompt,
            prompt: newPrompt,
            // Clean up tool_ids if both tools and tool_ids exist
            tool_ids: [],
          },
        },
      },
    };

    const updateResponse = await axios.patch(
      `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`,
      updatedConfig,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Agente actualizado exitosamente!\n');

    console.log('📊 CAMBIOS APLICADOS:');
    console.log('   ✅ Voz cambiada a: Martín Tuiran');
    console.log('   ✅ Prompt actualizado a v3.0');
    console.log('   ✅ Primer mensaje actualizado\n');

    console.log('🎯 MEJORAS INCLUIDAS:');
    console.log('   ✅ Validación de cliente existente al inicio');
    console.log('   ✅ Recopilación OBLIGATORIA de nombre + teléfono');
    console.log('   ✅ Llamada a save_context ANTES de transferir');
    console.log('   ✅ P&C completamente especificado (Auto, Home, Renters, Flood, Umbrella)');
    console.log('   ✅ Enrutamiento por contexto (siniestros, ventas, servicio, PQRS)');
    console.log('   ✅ Flujos específicos para clientes existentes vs nuevos\n');

    return updateResponse.data;
  } catch (error: any) {
    console.error('❌ Error actualizando agente:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('\nDetalles del error:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

updateAgent()
  .then(() => {
    console.log('✅ Actualización completada');
    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('   1. Haz una llamada de prueba a: +1 (786) 902-6810');
    console.log('   2. Verifica que escuchas la voz de Martín');
    console.log('   3. Confirma que pide nombre y teléfono antes de transferir');
    console.log('   4. Valida que llama save_context correctamente\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Actualización fallida');
    process.exit(1);
  });
