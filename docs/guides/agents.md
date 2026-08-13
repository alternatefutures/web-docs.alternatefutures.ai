---
description: Create and interact with chat agents on Alternate Clouds using the GraphQL API.
---

# AI Agents

::: info What ships today
Alternate Clouds agents are **chat agents**: a named agent with a system prompt, a model, and an optional linked function. You create an agent, start chats, and send messages via the GraphQL API. Deployable runtimes (Eliza, ComfyUI, custom LangChain/LangGraph) and a start/stop/logs lifecycle are on the roadmap and are not yet available.
:::

::: tip What this maps to in code
The [Agent GraphQL type and mutations](https://github.com/alternatefutures/service-cloud-api/blob/main/src/schema/typeDefs.ts) define the real surface: `Agent { id name slug description avatar systemPrompt model status }`, `CreateAgentInput { name, slug, description, systemPrompt, model, functionId }`, and the mutations `createAgent`, `createChat`, `sendMessage`, `deleteChat`.
:::

## What a chat agent is

An agent is defined by:

- **name / slug** - identity within your project
- **systemPrompt** - the instructions that shape the agent's behavior
- **model** - the model that backs the agent
- **functionId** (optional) - an Alternate Clouds function the agent can call

You then open a chat against the agent and exchange messages.

::: info Roadmap
Deployable agent runtimes — Eliza (Discord/Twitter/Telegram, characterfiles, plugins), ComfyUI (Stable Diffusion / GPU workflows), and custom LangChain/LangGraph agents — are planned but not yet part of the API.
:::

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

```graphql
mutation {
  createAgent(input: {
    name: "Support Assistant"
    slug: "support-assistant"
    description: "Answers product questions"
    systemPrompt: "You are a helpful support agent for Alternate Clouds."
    model: "claude-sonnet"
    # functionId: "<optional-function-id>"
  }) {
    id
    name
    slug
    status
  }
}
```

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

Start a chat and send a message, then delete the chat when you're done:

```graphql
mutation {
  createChat(agentId: "<agent-id>") { id }
}

mutation {
  sendMessage(chatId: "<chat-id>", content: "Hello!") { id role content }
}

mutation {
  deleteChat(chatId: "<chat-id>") { id }
}
```

::: info Roadmap
There is no start/stop/logs lifecycle for agents today — an agent is available as soon as it is created.
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

<!-- Removed: `acc agents ... --env` and `af.agents().create({ env })` — the agents CLI command, the agents() SDK client, and env/type/character fields on the agent model do not exist. -->

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

::: info Roadmap
Platform integrations (Discord, Twitter, Telegram, Slack) and configurable memory (short-term, long-term, vector DB) are planned but not represented in the current agent schema.
:::

## Next Steps

- [CLI Commands](../cli/commands.md) - Manage agents via CLI
- [SDK API](../sdk/api.md) - Programmatic agent management
- [Best Practices](./best-practices.md) - Optimization tips
