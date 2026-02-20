import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function listVoices() {
  console.log('🎤 Listando voces disponibles en ElevenLabs...\n');

  try {
    const response = await axios.get(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    const voices = response.data.voices;

    console.log(`Total de voces: ${voices.length}\n`);

    // Filter for Spanish/Latino voices
    console.log('🌎 VOCES EN ESPAÑOL / LATINO:\n');

    voices.forEach((voice: any) => {
      const labels = voice.labels || {};
      const isSpanish = labels.language?.toLowerCase().includes('spanish') ||
                       labels.accent?.toLowerCase().includes('spanish') ||
                       labels.accent?.toLowerCase().includes('latin') ||
                       voice.name.toLowerCase().includes('martin');

      if (isSpanish || voice.name.toLowerCase().includes('martin')) {
        console.log(`Name: ${voice.name}`);
        console.log(`ID: ${voice.voice_id}`);
        console.log(`Labels:`, labels);
        console.log(`Description: ${voice.description || 'N/A'}`);
        console.log('---');
      }
    });

    // Show all voices
    console.log('\n📋 TODAS LAS VOCES:\n');
    voices.forEach((voice: any, index: number) => {
      console.log(`${index + 1}. ${voice.name} (ID: ${voice.voice_id})`);
    });

    return voices;
  } catch (error: any) {
    console.error('❌ Error fetching voices:', error.response?.data || error.message);
    throw error;
  }
}

listVoices()
  .then(() => {
    console.log('\n✅ Voice listing complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Voice listing failed');
    process.exit(1);
  });
