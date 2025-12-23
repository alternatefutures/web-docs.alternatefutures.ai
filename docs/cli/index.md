# CLI Documentation

The Alternate Futures CLI (`af`) provides a powerful command-line interface for managing your agents, sites, storage, and deployments on decentralized infrastructure.

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
af --version
```

## Quick Start

```bash
# 1. Authenticate with your account
af login

# 2. Create a new project
af projects create --name "my-website"

# 3. Initialize site configuration
af sites init

# 4. Deploy your site
af sites deploy

# 5. View your deployments
af sites list
```

## Command Groups

| Command | Description |
|---------|-------------|
| `af login` / `af logout` | Authentication |
| `af projects` | Manage projects |
| `af sites` | Deploy and manage static sites |
| `af functions` | Serverless function management |
| `af storage` | Decentralized storage operations |
| `af ipfs` | Direct IPFS operations |
| `af ipns` | IPNS record management |
| `af domains` | Custom domain configuration |
| `af ens` | ENS domain integration |
| `af gateways` | Private IPFS gateways |
| `af applications` | SDK application management |
| `af pat` | Personal access tokens |
| `af billing` | Billing and usage information |

## Getting Help

The CLI has built-in help for every command:

```bash
# General help
af --help

# Help for a command group
af sites --help

# Help for a specific command
af sites deploy --help
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
af sites init
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
af sites init
# Follow prompts: name, dist folder (./dist), network (ipfs)

# Deploy
af sites deploy
```

### Generate CI/CD Config

```bash
# Generate GitHub Actions workflow
af sites ci --provider github
```

This creates `.github/workflows/af-deploy.yml` for automatic deployments.

### Manage Multiple Projects

```bash
# List all projects
af projects list

# Switch to a different project
af projects switch --id prj_production

# All subsequent commands use the selected project
af sites list
af domains list
```

### Upload Files to IPFS

```bash
# Upload a single file
af storage add ./my-file.pdf

# Upload a directory
af storage add ./my-folder

# List stored files
af storage list
```

### Work with Custom Domains

```bash
# Add a domain to your site
af domains create --siteSlug my-site --hostname www.example.com

# Check verification status
af domains detail --hostname www.example.com

# Verify DNS configuration
af domains verify --hostname www.example.com
```
