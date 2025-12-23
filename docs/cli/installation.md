# CLI Installation

Complete guide to installing and configuring the Alternate Futures CLI.

## Requirements

- **Node.js 18.0.0 or higher** - [Download here](https://nodejs.org/)
- **npm, pnpm, or yarn** - Package manager

Check your Node.js version:

```bash
node --version  # Should be v18.0.0 or higher
```

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
af --version
```

You should see the version number displayed. If you see "command not found", try:

1. Restart your terminal
2. Check that npm's global bin directory is in your PATH
3. Run `npm list -g @alternatefutures/cli` to confirm installation

## Authentication

Before using the CLI, you need to authenticate with your Alternate Futures account.

### Interactive Login (Recommended)

```bash
af login
```

This opens your browser where you can sign in with:
- Email (magic link)
- Google account
- GitHub account
- Web3 wallet (MetaMask, Coinbase Wallet, etc.)

After signing in, the CLI automatically saves your credentials.

### Email Login (No Browser)

For environments without a browser (SSH, containers):

```bash
af login --email
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
4. Copy the token (starts with `pat_`)

## Configuration

### Project Selection

If you have multiple projects, select one:

```bash
# List available projects
af projects list

# Switch to a project
af projects switch --id prj_abc123
```

### Site Configuration

Initialize a site configuration file in your project:

```bash
cd my-project
af sites init
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

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AF_TOKEN` | Personal access token | `pat_abc123...` |
| `AF_PROJECT_ID` | Default project ID | `prj_def456...` |
| `AF_BASE_URL` | Override API endpoint | `https://api.custom.com` |

### Setting Environment Variables

**Linux/macOS:**
```bash
# Temporary (current session)
export AF_TOKEN="pat_abc123..."

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export AF_TOKEN="pat_abc123..."' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**
```powershell
# Temporary
$env:AF_TOKEN = "pat_abc123..."

# Permanent
[Environment]::SetEnvironmentVariable("AF_TOKEN", "pat_abc123...", "User")
```

**Windows (Command Prompt):**
```cmd
set AF_TOKEN=pat_abc123...
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
        run: af sites deploy
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
          AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

Or generate it automatically:

```bash
af sites ci --provider github
```

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
    - af sites deploy
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

### "Command not found: af"

- Ensure the global npm directory is in your PATH
- Try restarting your terminal
- Run `npm list -g @alternatefutures/cli` to confirm installation
- Try reinstalling: `npm uninstall -g @alternatefutures/cli && npm install -g @alternatefutures/cli`

### "Login failed" or browser doesn't open

- Try email-based login: `af login --email`
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
