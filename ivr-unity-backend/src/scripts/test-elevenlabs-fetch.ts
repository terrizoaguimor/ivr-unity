/**
 * Script de prueba para obtener conversación y audio de ElevenLabs
 *
 * Uso: node dist/scripts/test-elevenlabs-fetch.js <conversation_id>
 */

import { ElevenLabsConversationClient } from '../elevenlabs/conversation-client';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function testElevenLabsFetch() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const conversationId = process.argv[2];

  if (!apiKey) {
    console.error('❌ Error: ELEVENLABS_API_KEY es requerida');
    process.exit(1);
  }

  if (!conversationId) {
    console.error('❌ Error: Proporciona un conversation_id');
    console.error('Uso: node dist/scripts/test-elevenlabs-fetch.js <conversation_id>');
    process.exit(1);
  }

  console.log('🔍 Obteniendo conversación de ElevenLabs...');
  console.log(`📋 Conversation ID: ${conversationId}\n`);

  const client = new ElevenLabsConversationClient({
    apiKey,
  });

  try {
    // Paso 1: Obtener detalles de la conversación
    console.log('1️⃣ Obteniendo detalles de la conversación...');
    const conversation = await client.getConversation(conversationId);

    console.log('\n✅ Detalles obtenidos:');
    console.log('═'.repeat(60));
    console.log(`🆔 ID: ${conversation.conversation_id}`);
    console.log(`🤖 Agent: ${conversation.agent_name} (${conversation.agent_id})`);
    console.log(`📊 Status: ${conversation.status}`);
    console.log(`⏱️  Duration: ${conversation.call_duration_secs}s (${Math.floor(conversation.call_duration_secs / 60)}m ${conversation.call_duration_secs % 60}s)`);
    console.log(`💰 Cost: $${conversation.cost.toFixed(4)}`);
    console.log(`🎵 Has Audio: ${conversation.has_audio ? 'YES' : 'NO'}`);
    console.log(`🗣️  Transcript Entries: ${conversation.transcript?.length || 0}`);
    console.log('═'.repeat(60));

    // Paso 2: Obtener transcripción formateada
    console.log('\n2️⃣ Obteniendo transcripción formateada...');
    const formattedTranscript = await client.getFormattedTranscript(conversationId);

    console.log('\n📝 TRANSCRIPCIÓN:\n');
    console.log(formattedTranscript);
    console.log('\n' + '═'.repeat(60));

    // Paso 3: Descargar audio si está disponible
    if (conversation.has_audio) {
      console.log('\n3️⃣ Descargando audio...');
      const audioBuffer = await client.getConversationAudio(conversationId);

      const audioFileName = `elevenlabs_${conversationId}.mp3`;
      const audioPath = path.join(__dirname, '../../temp', audioFileName);

      // Crear directorio temp si no existe
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(audioPath, audioBuffer);

      console.log(`\n✅ Audio guardado:`);
      console.log(`📂 Ubicación: ${audioPath}`);
      console.log(`📊 Tamaño: ${(audioBuffer.length / 1024).toFixed(2)} KB (${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`🎵 Formato: MP3`);
    } else {
      console.log('\n⚠️  Audio no disponible para esta conversación');
    }

    // Paso 4: Resumen
    console.log('\n4️⃣ Resumen completo:');
    const summary = await client.getConversationSummary(conversationId);

    console.log('\n📊 MÉTRICAS:');
    console.log(`   Duration: ${summary.duration}s`);
    console.log(`   Cost: $${summary.cost.toFixed(4)}`);
    console.log(`   Successful: ${summary.successful ? 'YES' : 'NO'}`);
    if (summary.summary) {
      console.log(`   Summary: ${summary.summary}`);
    }

    console.log('\n✅ Prueba completada exitosamente!');

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.log('\n💡 Conversación no encontrada. Verifica el conversation_id.');
      } else if (error.message.includes('401')) {
        console.log('\n💡 Error de autenticación. Verifica ELEVENLABS_API_KEY.');
      }
    }

    process.exit(1);
  }
}

// Ejecutar
testElevenLabsFetch()
  .then(() => {
    console.log('\n✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
