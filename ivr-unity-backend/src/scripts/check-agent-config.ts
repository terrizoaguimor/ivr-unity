import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

async function checkAgentConfiguration() {
  console.log('🔍 Checking ElevenLabs agent configuration...');
  console.log(`Agent ID: ${AGENT_ID}\n`);

  try {
    const response = await axios.get(
      `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    const agent = response.data;

    console.log('📋 Agent Details:');
    console.log(`Name: ${agent.name}`);
    console.log(`Conversation Config ID: ${agent.conversation_config_id}\n`);

    // Show raw agent object for debugging
    console.log('🔍 Raw Agent Object Keys:');
    console.log(Object.keys(agent).join(', '));
    console.log('\n📦 Full Agent Data:');
    console.log(JSON.stringify(agent, null, 2));

    // Check webhook configuration
    console.log('\n🔗 Webhook Configuration:');
    if (agent.webhook) {
      console.log(`✅ Webhook URL: ${agent.webhook.url}`);
      console.log(`   Events: ${agent.webhook.events?.join(', ') || 'All events'}`);
    } else {
      console.log('❌ NO WEBHOOK CONFIGURED');
    }

    // Check client tools
    console.log('\n🛠️  Client Tools:');
    if (agent.client_tools && agent.client_tools.length > 0) {
      agent.client_tools.forEach((tool: any, index: number) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   URL: ${tool.url || 'NOT SET'}`);
        console.log(`   Description: ${tool.description || 'N/A'}`);
      });
    } else {
      console.log('❌ NO CLIENT TOOLS CONFIGURED');
    }

    // Expected configuration
    console.log('\n✨ Expected Configuration:');
    console.log('Post-call webhook should be:');
    console.log('  https://ivr-unity-a6zp5.ondigitalocean.app/api/elevenlabs/post-call-webhook');
    console.log('\nsave_context tool should be:');
    console.log('  https://ivr-unity-a6zp5.ondigitalocean.app/api/elevenlabs/save-context');

    return agent;
  } catch (error: any) {
    console.error('❌ Error fetching agent configuration:', error.response?.data || error.message);
    throw error;
  }
}

checkAgentConfiguration()
  .then(() => {
    console.log('\n✅ Configuration check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Configuration check failed');
    process.exit(1);
  });
