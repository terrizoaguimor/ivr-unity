import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL || 'https://ivr-unity-a6zp5.ondigitalocean.app';

async function createWebhook() {
  console.log('🔧 Creating ElevenLabs webhook...\n');

  try {
    // Create webhook
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/convai/webhooks',
      {
        name: 'Unity IVR Post-Call Webhook',
        url: `${BACKEND_URL}/api/elevenlabs/post-call-webhook`,
        events: ['conversation.end'],
        send_audio: true,
        send_transcript: true,
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const webhook = response.data;
    console.log('✅ Webhook created successfully!');
    console.log(`Webhook ID: ${webhook.webhook_id || webhook.id}`);
    console.log(`URL: ${webhook.url}`);
    console.log(`Events: ${webhook.events?.join(', ')}\n`);

    return webhook;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log('❌ Webhooks endpoint not found.');
      console.log('   Trying alternative approach...\n');

      // Try alternative endpoint structure
      try {
        const altResponse = await axios.post(
          'https://api.elevenlabs.io/v1/webhooks',
          {
            name: 'Unity IVR Post-Call Webhook',
            url: `${BACKEND_URL}/api/elevenlabs/post-call-webhook`,
            event_types: ['conversation.end'],
          },
          {
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('✅ Webhook created via alternative endpoint!');
        console.log(JSON.stringify(altResponse.data, null, 2));
        return altResponse.data;
      } catch (altError: any) {
        console.error('❌ Alternative endpoint also failed:', altError.response?.data || altError.message);
        throw altError;
      }
    }

    console.error('❌ Error creating webhook:', error.response?.data || error.message);
    throw error;
  }
}

createWebhook()
  .then(() => {
    console.log('\n✅ Webhook creation complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Webhook creation failed');
    console.log('\n💡 Webhooks may need to be configured via ElevenLabs dashboard:');
    console.log('   1. Go to https://elevenlabs.io/app/conversational-ai');
    console.log('   2. Select your agent');
    console.log('   3. Go to Settings > Integrations');
    console.log(`   4. Add webhook: ${BACKEND_URL}/api/elevenlabs/post-call-webhook`);
    console.log('   5. Enable events: conversation.end');
    console.log('   6. Enable "Send audio" and "Send transcript"');
    process.exit(1);
  });
