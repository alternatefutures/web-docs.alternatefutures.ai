---
description: The Alternate Clouds CLI (acc) lets you manage projects, deploy services from templates, inspect deployments, open a shell into a running service, and check your billing balance.
---

# CLI Documentation

The Alternate Clouds CLI (`acc`) is the command-line interface for Alternate Clouds. Use it to authenticate, manage projects, create and deploy services from templates, inspect deployments, open a shell into a running service, and check your billing balance.

## Features

- **Authenticate** - Log in via browser or email verification code
- **Manage projects** - Create, list, switch, rename, and delete projects
- **Deploy services** - Create services from templates and deploy them to decentralized compute (Akash/Phala)
- **Inspect deployments** - List and filter deployments across projects and services
- **Open a shell** - SSH into a running service
- **Check billing** - View your current credit balance

## Installation

Install the CLI globally using your preferred package manager:

::: code-group

```bash [npm]
npm install -g @alternatefutures/cli
```

```bash [pnpm]
pnpm add -g @alternatefutures/cli
```

```bash [yarn]
yarn global add @alternatefutures/cli
```

:::

Verify installation:

```bash
acc --version
```

## Quick Start

```bash
# 1. Authenticate with your account
acc login

# 2. Create a new project
acc projects create --name "my-project"

# 3. Create a service from a template (interactive)
acc services create

# 4. Deploy the service
acc services deploy

# 5. View your deployments
acc deployments list
```

## Command Groups

| Command | Description |
|---------|-------------|
| `acc login` / `acc logout` | Authenticate or end your CLI session |
| `acc projects` | Create, list, switch, rename, and delete projects |
| `acc services` | Create, deploy, inspect, and manage services |
| `acc deployments` | List and filter deployments |
| `acc ssh` | Open a shell into a running service |
| `acc billing` | View your credit balance |

> **What this maps to in code:** command registration lives in [command registration (cli.ts)](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts). `templates` and `pat` are also registered but hidden from top-level help.

## Getting Help

The CLI has built-in help for every command:

```bash
# General help
acc --help

# Help for a command group
acc services --help

# Help for a specific command
acc services deploy --help
```

## Environment Variables

For CI/CD pipelines and automation, configure authentication via environment variables:

```bash
export AF_TOKEN="your-personal-access-token"
export AF_PROJECT_ID="your-project-id"
```

| Variable | Description |
|----------|-------------|
| `AF_TOKEN` | Personal access token for authentication |
| `AF_PROJECT_ID` | Default project ID for commands |
| `AF_ORG_ID` | Default organization ID |

> **What this maps to in code:** these are the only variables the CLI reads — see [CLI environment variables (secrets.ts)](https://github.com/alternatefutures/cloud-cli/blob/main/src/secrets.ts).

## Configuration File

The CLI reads deployment configuration from an `af.config` file in your project root. It accepts `af.config.ts`, `af.config.js`, or `af.config.json`:

```json
{
  "sites": [
    {
      "slug": "my-site",
      "distDir": "./dist",
      "buildCommand": "npm run build"
    }
  ]
}
```

Create the file manually in your project root.

> **What this maps to in code:** the schema (`AlternateFuturesRootConfig` with a `sites[]` array and an optional `functions[]` block) is defined in [af.config type definition](https://github.com/alternatefutures/cloud-cli/blob/main/src/utils/configuration/types.ts).

## Documentation

- **[Installation Guide](./installation)** - Detailed installation instructions
- **[Commands Reference](./commands)** - Complete command documentation

## Requirements

- Node.js 18.18.2 or higher
- npm, pnpm, or yarn

## Examples

### Deploy a Service

```bash
# Create a service from a template (interactive prompts)
acc services create

# Deploy it
acc services deploy

# Watch its logs
acc services logs --tail 100
```

### Manage Multiple Projects

```bash
# List all projects
acc projects list

# Switch to a different project (positional project ID)
acc projects switch prj_production

# All subsequent commands use the selected project
acc services list
acc deployments list
```

### Browse Templates

```bash
# List templates, optionally filtered by category
acc templates list --category AI_ML

# Inspect a template
acc templates info <templateId>
```

<!-- ROADMAP — not yet shipped. Uncomment when implemented.

## Roadmap (not yet available)

The following capabilities are documented for reference but are **not yet implemented** in the `acc` CLI. Uncomment each section when the corresponding feature ships.

### Planned features

- **Deploy Sites** - Push static sites to IPFS, Filecoin, or Arweave
- **Manage Storage** - Upload and manage files on decentralized storage
- **Configure Domains** - Add custom domains and ENS integration
- **Serverless Functions** - Deploy and manage edge functions
- **CI/CD Integration** - Generate workflow configs for GitHub Actions, GitLab CI, and more

### Planned command groups

| Command | Description |
|---------|-------------|
| `acc sites` | Deploy and manage static sites |
| `acc functions` | Serverless function management |
| `acc storage` | Decentralized storage operations |
| `acc ipfs` | Direct IPFS operations |
| `acc ipns` | IPNS record management |
| `acc domains` | Custom domain configuration |
| `acc ens` | ENS domain integration |
| `acc gateways` | Private IPFS gateways |
| `acc agents` | AI agent deployment and management |
| `acc observability` | APM observability (traces, logs, metrics) |
| `acc applications` | SDK application management |

### Deploy a React Site

```bash
# Build your app
npm run build

# Initialize AF config
acc sites init
# Follow prompts: name, dist folder (./dist), network (ipfs)

# Deploy
acc sites deploy
```

### Generate CI/CD Config

```bash
# Generate GitHub Actions workflow
acc sites ci --provider github
```

This creates `.github/workflows/af-deploy.yml` for automatic deployments.

### Upload Files to IPFS

```bash
# Upload a single file
acc storage add ./my-file.pdf

# Upload a directory
acc storage add ./my-folder

# List stored files
acc storage list
```

### Work with Custom Domains

```bash
# Add a domain to your site
acc domains create --siteSlug my-site --hostname www.example.com

# Check verification status
acc domains detail --hostname www.example.com

# Verify DNS configuration
acc domains verify --hostname www.example.com
```

-->

