import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const BACKEND_URL = process.env.BACKEND_URL || 'https://ivr-unity-a6zp5.ondigitalocean.app';

async function configureAgentWebhooks() {
  console.log('🔧 Configuring ElevenLabs agent webhooks...');
  console.log(`Agent ID: ${AGENT_ID}`);
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  try {
    // First, get current agent configuration
    const getResponse = await axios.get(
      `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    const currentAgent = getResponse.data;
    console.log('📋 Current agent:', currentAgent.name);

    // Prepare updated configuration
    const updatedConfig = {
      ...currentAgent,
      webhook: {
        url: `${BACKEND_URL}/api/elevenlabs/post-call-webhook`,
        events: ['conversation_end'],
      },
      client_tools: [
        ...(currentAgent.client_tools || []),
        {
          name: 'save_context',
          description: 'Saves important customer information before transferring the call to a human agent. MUST be called before transferring.',
          parameters: {
            type: 'object',
            properties: {
              customer_name: {
                type: 'string',
                description: 'Full name of the customer'
              },
              phone_number: {
                type: 'string',
                description: 'Customer phone number'
              },
              reason: {
                type: 'string',
                description: 'Reason for the call or transfer'
              },
              summary: {
                type: 'string',
                description: 'Brief summary of the conversation so far'
              }
            },
            required: ['customer_name', 'phone_number', 'reason', 'summary']
          },
          url: `${BACKEND_URL}/api/elevenlabs/save-context`,
        }
      ],
    };

    // Update the agent
    console.log('\n🚀 Updating agent configuration...');
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

    console.log('✅ Agent updated successfully!\n');

    console.log('🔗 Configured webhooks:');
    console.log(`   Post-call: ${updatedConfig.webhook.url}`);
    console.log(`   Events: ${updatedConfig.webhook.events.join(', ')}`);

    console.log('\n🛠️  Configured client tools:');
    updatedConfig.client_tools.forEach((tool: any, index: number) => {
      console.log(`   ${index + 1}. ${tool.name}`);
      console.log(`      URL: ${tool.url}`);
    });

    console.log('\n✅ Configuration complete! Make a test call now.');

    return updateResponse.data;
  } catch (error: any) {
    console.error('❌ Error updating agent configuration:', error.response?.data || error.message);
    throw error;
  }
}

configureAgentWebhooks()
  .then(() => {
    console.log('\n✅ Webhook configuration complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Webhook configuration failed');
    process.exit(1);
  });
