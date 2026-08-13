---
description: Install and configure the Alternate Futures CLI on macOS, Linux, or Windows with npm, pnpm, or yarn.
---

# CLI Installation

Complete guide to installing and configuring the Alternate Futures CLI.

## Requirements

- **Node.js 18.18.2 or higher** - [Download here](https://nodejs.org/)
- **npm, pnpm, or yarn** - Package manager

Check your Node.js version:

```bash
node --version  # Should be v18.18.2 or higher
```

> **What this maps to in code:** the engine range and package name are declared in [package.json engines / bin](https://github.com/alternatefutures/cloud-cli/blob/main/package.json).

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

## Verify Installation

After installation, verify the CLI is working:

```bash
acc --version
```

You should see the version number displayed. If you see "command not found", try:

1. Restart your terminal
2. Check that npm's global bin directory is in your PATH
3. Run `npm list -g @alternatefutures/cli` to confirm installation

## Authentication

Before using the CLI, you need to authenticate with your Alternate Futures account.

### Interactive Login (Recommended)

```bash
acc login
```

This opens the Alternate Clouds web app in your browser to sign in. The available sign-in methods (email magic link, Google, GitHub, and Web3 wallets) are provided by the web app. After signing in, the CLI automatically saves your credentials.

### Email Login (No Browser)

For environments without a browser (SSH, containers):

```bash
acc login --email
```

This sends a verification code to your email.

### Environment Variables (CI/CD)

For automated workflows, use environment variables instead of interactive login:

```bash
export AF_TOKEN="your-personal-access-token"
export AF_PROJECT_ID="your-project-id"
```

**Get your token:**
1. Log in to [app.alternatefutures.ai](https://app.alternatefutures.ai)
2. Go to Settings > API Keys
3. Create a new Personal Access Token
4. Copy the token and store it somewhere secure

## Configuration

### Project Selection

If you have multiple projects, select one:

```bash
# List available projects
acc projects list

# Switch to a project (positional project ID)
acc projects switch prj_abc123
```

### Site Configuration

Create a config file in your project root. The CLI accepts `af.config.ts`, `af.config.js`, or `af.config.json`:

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

> **What this maps to in code:** the schema (a top-level `sites[]` array, plus an optional `functions[]` block) is defined in [af.config type definition](https://github.com/alternatefutures/cloud-cli/blob/main/src/utils/configuration/types.ts).

<!-- Removed / re-architected commands (kept for reference)

These Fleek-legacy commands were removed from the CLI in cloud-cli#64 and are not planned as CLI commands in their original form. Current direction is noted per feature. Triage: cloud-cli#118.

STATUS: Removed in cloud-cli#64. Static-site hosting is now via the dashboard.

Initialize a site configuration file in your project:

```bash
cd my-project
acc sites init
```

This creates `af.config.json`:

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
-->


## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AF_TOKEN` | Personal access token | `<your-token>` |
| `AF_PROJECT_ID` | Default project ID | `prj_abc123` |
| `AF_ORG_ID` | Default organization ID | `org_abc123` |

> **What this maps to in code:** these are the only variables the CLI reads — see [env vars read by the CLI](https://github.com/alternatefutures/cloud-cli/blob/main/src/secrets.ts).

### Setting Environment Variables

**Linux/macOS:**
```bash
# Temporary (current session)
export AF_TOKEN="your-token"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export AF_TOKEN="your-token"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**
```powershell
# Temporary
$env:AF_TOKEN = "your-token"

# Permanent
[Environment]::SetEnvironmentVariable("AF_TOKEN", "your-token", "User")
```

**Windows (Command Prompt):**
```cmd
set AF_TOKEN=your-token
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Alternate Futures

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Install AF CLI
        run: npm install -g @alternatefutures/cli

      - name: Deploy
        run: acc services deploy <service-id>
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
          AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

<!-- Removed / re-architected commands (kept for reference)

STATUS: Removed in cloud-cli#64. Static-site hosting is now via the dashboard.

Or generate it automatically:

```bash
acc sites ci --provider github
```
-->

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
deploy:
  image: node:20
  stage: deploy
  script:
    - npm ci
    - npm run build
    - npm install -g @alternatefutures/cli
    - acc services deploy <service-id>
  variables:
    AF_TOKEN: $AF_TOKEN
    AF_PROJECT_ID: $AF_PROJECT_ID
  only:
    - main
```

## Updating the CLI

Keep your CLI up to date:

::: code-group

```bash [npm]
npm update -g @alternatefutures/cli
```

```bash [pnpm]
pnpm update -g @alternatefutures/cli
```

```bash [yarn]
yarn global upgrade @alternatefutures/cli
```

:::

## Troubleshooting

### "Command not found: acc"

- Ensure the global npm directory is in your PATH
- Try restarting your terminal
- Run `npm list -g @alternatefutures/cli` to confirm installation
- Try reinstalling: `npm uninstall -g @alternatefutures/cli && npm install -g @alternatefutures/cli`

### "Login failed" or browser doesn't open

- Try email-based login: `acc login --email`
- Check your internet connection
- Ensure you have an account at [app.alternatefutures.ai](https://app.alternatefutures.ai)

### "Invalid token" errors

- Verify your token hasn't expired
- Check for extra spaces or characters
- Generate a new token from the dashboard

### Permission errors during installation

Try installing with elevated permissions or use a Node version manager:

```bash
# Using sudo (not recommended)
sudo npm install -g @alternatefutures/cli

# Better: Use nvm to manage Node
nvm install 20
nvm use 20
npm install -g @alternatefutures/cli
```

## Uninstalling

To remove the CLI:

::: code-group

```bash [npm]
npm uninstall -g @alternatefutures/cli
```

```bash [pnpm]
pnpm remove -g @alternatefutures/cli
```

```bash [yarn]
yarn global remove @alternatefutures/cli
```

:::

## Next Steps

- **[Commands Reference](./commands)** - Complete command documentation
- **[Quick Start Guide](/guides/quickstart)** - Deploy your first site
- **[SDK Documentation](/sdk/)** - Programmatic access via JavaScript/TypeScript
