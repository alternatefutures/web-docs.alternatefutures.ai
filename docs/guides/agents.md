---
description: Deploy and manage Eliza, ComfyUI, and custom AI agents on decentralized infrastructure with Alternate Futures.
---

# Managing AI Agents

::: warning Web App Under Development
The web interface for managing agents is currently under development. Use the [CLI](../cli/) or [SDK](../sdk/) to deploy and manage AI agents.
:::

Deploy and manage AI agents on decentralized infrastructure using the CLI or SDK.

## Agent Types

### Eliza

Autonomous AI agents with personality and memory:

- Conversational AI with persistent memory
- Multi-platform support (Discord, Twitter, Telegram)
- Custom personality configuration via characterfile
- Plugin ecosystem for extended capabilities

### ComfyUI

AI image and video generation workflows:

- Stable Diffusion image generation
- Custom workflow support
- GPU-accelerated processing
- API access for programmatic generation

### Custom

Build your own AI agents:

- Deploy custom LangChain/LangGraph agents
- Full control over agent logic
- Connect to external APIs and services
- Custom runtime environments

## Creating an Agent

<!--
### From Web Dashboard (Coming Soon)

1. Go to **Agents** → **Create Agent**
2. Choose **From Template**
3. Select a template (ChatBot, Image Generator, etc.)
4. Configure name and settings
5. Click **Deploy**

### Upload Characterfile (Coming Soon)

For Eliza agents:

1. Go to **Agents** → **Create Agent**
2. Choose **Upload Characterfile**
3. Upload your `character.json` file
4. Review configuration
5. Click **Deploy**

### Build from Scratch (Coming Soon)

1. Go to **Agents** → **Create Agent**
2. Choose **Build from Scratch**
3. Select agent type
4. Configure step-by-step:
   - Name and description
   - Model selection (GPT-4, Claude, etc.)
   - Memory settings
   - Platform integrations
   - Environment variables
5. Click **Deploy**
-->

::: code-group

```bash [CLI]
# Create an Eliza agent
acc agents create --name "My Agent" --type eliza --character ./character.json

# List agents
acc agents list

# Get agent status
acc agents status <agent-id>
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: '<your-token>',
    projectId: '<your-project-id>',
  }),
});

// Create an agent
const agent = await af.agents().create({
  name: 'My Agent',
  type: 'eliza',
  config: {
    // Agent configuration
  }
});
```

:::

## Managing Agents

<!--
### Agent Dashboard (Coming Soon)

Each agent will have a dashboard showing:

- **Status** - Running, stopped, error
- **Usage** - API calls, tokens, costs
- **Logs** - Real-time agent logs
- **Metrics** - Performance statistics

### Agent Actions (Coming Soon)

- **Start/Stop** - Control agent execution
- **Edit** - Update configuration
- **Chat** - Test agent interactively
- **View Logs** - Debug and monitor
- **Delete** - Remove agent permanently
-->

::: code-group

```bash [CLI]
# Start an agent
acc agents start <agent-id>

# Stop an agent
acc agents stop <agent-id>

# View logs
acc agents logs <agent-id>

# Delete an agent
acc agents delete <agent-id>
```

```typescript [SDK]
// Start an agent
await af.agents().start(agentId);

// Stop an agent
await af.agents().stop(agentId);

// Get logs
const logs = await af.agents().logs(agentId);

// Delete an agent
await af.agents().delete(agentId);
```

:::

## Agent Configuration

### Environment Variables

Environment variables allow you to configure your agents with API keys, model settings, and other sensitive information without hardcoding them.

#### Using .env Files

Create a `.env` file in your project directory:

```bash
# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Model Configuration
MODEL=gpt-4
TEMPERATURE=0.7
MAX_TOKENS=2000

# Platform Credentials
DISCORD_BOT_TOKEN=...
TWITTER_API_KEY=...
```

#### Using CLI Flags

Pass environment variables directly when creating or updating agents:

::: code-group

```bash [CLI]
# Set variables during agent creation
acc agents create \
  --name "My Agent" \
  --type eliza \
  --env OPENAI_API_KEY=sk-... \
  --env MODEL=gpt-4

# Update existing agent variables
acc agents update <agent-id> \
  --env TEMPERATURE=0.8
```

```typescript [SDK]
// Set variables during agent creation
const agent = await af.agents().create({
  name: 'My Agent',
  type: 'eliza',
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MODEL: 'gpt-4',
    TEMPERATURE: '0.7'
  }
});

// Update existing agent variables
await af.agents().update(agentId, {
  env: {
    TEMPERATURE: '0.8'
  }
});
```

:::

#### Using Character Files

For Eliza agents, include environment variables in your `character.json`:

```json
{
  "name": "My Agent",
  "modelProvider": "openai",
  "settings": {
    "env": {
      "OPENAI_API_KEY": "sk-...",
      "MODEL": "gpt-4"
    }
  }
}
```

#### Best Practices

::: security Security
- **Never commit** `.env` files or API keys to version control
- Add `.env` to your `.gitignore` file
- Use separate keys for development and production
- Rotate keys regularly
:::

::: warning
Environment variables are stored securely and encrypted at rest. However, they will be accessible to your running agent, so only use trusted code.
:::

### Platform Integrations

Connect agents to:

- **Discord** - Bot token and permissions
- **Twitter** - OAuth credentials
- **Telegram** - Bot token
- **Slack** - Webhook URL

### Memory Settings

Configure agent memory:

- **Short-term** - Conversation context
- **Long-term** - Persistent knowledge
- **Vector DB** - Embeddings storage

## Next Steps

- [CLI Commands](../cli/commands.md) - Manage agents via CLI
- [SDK API](../sdk/api.md) - Programmatic agent management
- [Best Practices](./best-practices.md) - Optimization tips
