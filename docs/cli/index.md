---
description: The Alternate Futures CLI (af) lets you deploy sites, manage storage, configure domains, and run AI agents from the command line.
---

# CLI Documentation

The Alternate Futures CLI (`acc`) provides a powerful command-line interface for managing your agents, sites, storage, and deployments on decentralized infrastructure.

## Features

- **Deploy Sites** - Push static sites to IPFS, Filecoin, or Arweave
- **Manage Storage** - Upload and manage files on decentralized storage
- **Configure Domains** - Add custom domains and ENS integration
- **Serverless Functions** - Deploy and manage edge functions
- **CI/CD Integration** - Generate workflow configs for GitHub Actions, GitLab CI, and more
- **Billing & Usage** - Monitor costs and resource consumption

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
acc projects create --name "my-website"

# 3. Initialize site configuration
acc sites init

# 4. Deploy your site
acc sites deploy

# 5. View your deployments
acc sites list
```

## Command Groups

| Command | Description |
|---------|-------------|
| `acc login` / `acc logout` | Authentication |
| `acc projects` | Manage projects |
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
| `acc pat` | Personal access tokens |
| `acc billing` | Billing and usage information |

## Getting Help

The CLI has built-in help for every command:

```bash
# General help
acc --help

# Help for a command group
acc sites --help

# Help for a specific command
acc sites deploy --help
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
| `AF_BASE_URL` | Override API endpoint (for testing) |

## Configuration File

The CLI uses `af.config.json` for site configuration:

```json
{
  "name": "my-site",
  "buildCommand": "npm run build",
  "distDir": "./dist",
  "storage": {
    "type": "ipfs"
  }
}
```

Create one with:

```bash
acc sites init
```

## Documentation

- **[Installation Guide](./installation)** - Detailed installation instructions
- **[Commands Reference](./commands)** - Complete command documentation

## Requirements

- Node.js 18.0.0 or higher
- npm, pnpm, or yarn

## Examples

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

### Manage Multiple Projects

```bash
# List all projects
acc projects list

# Switch to a different project
acc projects switch --id prj_production

# All subsequent commands use the selected project
acc sites list
acc domains list
```

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
