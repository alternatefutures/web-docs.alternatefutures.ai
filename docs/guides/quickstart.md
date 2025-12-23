# Quick Start Guide

Get started with Alternate Futures in minutes. This guide will walk you through your first deployment to decentralized infrastructure.

## What You'll Learn

By the end of this guide, you'll have:
- Installed the Alternate Futures CLI
- Authenticated with the platform
- Deployed your first site to IPFS
- Understood the basics of decentralized deployment

**Time to complete:** 5-10 minutes

## Prerequisites

Before you begin, make sure you have:

- **An Alternate Futures account** - [Sign up here](https://app.alternatefutures.ai) (free, no credit card required)
  - You can sign in with email, Google, GitHub, or a Web3 wallet
- **Node.js 18 or later** - [Download here](https://nodejs.org/en/download) if you don't have it
  - Check your version with `node --version`
- **A project to deploy** (optional for learning)
  - Any static site (HTML, CSS, JavaScript)
  - Built output folder (usually `dist`, `build`, or `public`)
  - Don't have one? We'll create a simple example below

## Using the Web App

::: warning Coming Soon
The web application is currently in development. In the meantime, you can use the CLI or SDK to access the full platform.
:::

## Installation

::: code-group

```bash [CLI]
# Install the CLI globally
npm install -g @alternatefutures/cli
```

```bash [SDK]
# Install the SDK in your project
npm install @alternatefutures/sdk
```

:::

## Step 2: Authenticate

There are two ways to authenticate with Alternate Futures:

### Option 1: Interactive Login (Recommended for Getting Started)

::: code-group

```bash [CLI]
# Login interactively
af login
```

:::

This will open your browser where you can sign in with:
- Email (magic link - no password needed)
- Google account
- GitHub account
- Web3 wallet (MetaMask, Coinbase Wallet, etc.)

After signing in, the CLI automatically saves your credentials. You're ready to deploy!

### Option 2: Personal Access Token (Recommended for CI/CD and Automation)

If you prefer tokens or need to automate deployments:

1. Log in via the CLI first: `af login`
2. Create a Personal Access Token: `af pat create --name "My Development Token"`
3. Copy the token (it starts with `pat_...`)
4. Note your project ID from `af projects list`
5. Set them as environment variables:

::: code-group

```bash [CLI]
# Set environment variables
export AF_TOKEN=pat_your_token_here
export AF_PROJECT_ID=prj_your_project_id

# Or add to your .bashrc/.zshrc for persistence
echo 'export AF_TOKEN=pat_your_token_here' >> ~/.bashrc
echo 'export AF_PROJECT_ID=prj_your_project_id' >> ~/.bashrc
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

// Initialize with personal access token
const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});
```

:::

::: security Security Best Practices
**Never commit tokens to version control.** Here's why and how to keep them safe:

**What are environment variables?**
Environment variables store sensitive information (like tokens) outside your code files. This keeps secrets safe and lets you use different tokens in development vs. production.

**How to use them:**
1. Store your token in a `.env` file:
   ```
   AF_TOKEN=pat_your_token_here
   AF_PROJECT_ID=prj_your_project_id
   ```
2. Add `.env` to your `.gitignore` file so Git doesn't track it
3. Your code reads from `process.env.AF_TOKEN` instead of hardcoding the key

**Why this matters:**
- If you commit tokens to Git, they're visible in your repository history forever
- Anyone with access to your repo could steal your tokens and rack up charges on your account
- `.gitignore` tells Git to ignore certain files (like `.env`) when committing

**New to these concepts?**
- Learn about [.env files](https://github.com/motdotla/dotenv#readme) (official dotenv documentation)
- Learn about [environment variables on Docker Docs](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- Learn about [.gitignore files](https://git-scm.com/docs/gitignore) (official Git documentation)
- See our [Glossary](./glossary.md) for more terms
:::

### Troubleshooting Authentication

**"Command not found: af"**
- Make sure you installed the CLI: `npm install -g @alternatefutures/cli`
- Try restarting your terminal
- Check installation with `npm list -g @alternatefutures/cli`

**"Login failed" or browser doesn't open**
- Try the API key method instead
- Check your internet connection
- Make sure you have an account at [https://app.alternatefutures.ai](https://app.alternatefutures.ai)

**"Invalid token"**
- Double-check you copied the entire token (starts with `pat_`)
- Make sure there are no extra spaces
- Generate a new token if needed: `af pat create --name "New Token"`

## Step 3: Deploy Your First Site

Now for the exciting part—deploying to decentralized infrastructure!

**What does "deploy" mean?** Deployment is the process of uploading your website files to a server so others can access them online. You'll upload to a **decentralized network** where your files are distributed across many computers worldwide, instead of using a traditional server (like AWS or a web hosting company).

**Why is this different?**
- **Traditional hosting:** Your site lives on one company's servers. If they go down or delete your account, your site disappears.
- **Decentralized hosting:** Your site is stored across hundreds of independent computers. No single company controls it, so it can't be taken down.

**What you'll need:** Just your website files in a folder (called the "build output" or "dist folder").

### Don't Have a Site Ready?

No problem! You have two options:

#### Option 1: Use a Starter Template (Recommended)

We provide ready-to-deploy templates for popular frameworks. Choose one that fits your project:

**React (Vite)**

```bash
# Clone the React template
git clone https://github.com/alternatefutures/template-react my-site
cd my-site

# Install dependencies
npm install

# Build for production
npm run build

# Initialize and deploy (build output is in ./dist)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-react) | [React Docs](https://react.dev/) | [Vite Docs](https://vitejs.dev/)

**Next.js (Static Export)**

```bash
# Clone the Next.js template
git clone https://github.com/alternatefutures/template-nextjs my-site
cd my-site

# Install dependencies
npm install

# Build static export
npm run build

# Initialize and deploy (build output is in ./out)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-nextjs) | [Next.js Docs](https://nextjs.org/docs)

**Vue.js (Vite)**

```bash
# Clone the Vue template
git clone https://github.com/alternatefutures/template-vue my-site
cd my-site

# Install dependencies
npm install

# Build for production
npm run build

# Initialize and deploy (build output is in ./dist)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-vue) | [Vue.js Docs](https://vuejs.org/guide/) | [Vite Docs](https://vitejs.dev/)

**Astro**

```bash
# Clone the Astro template
git clone https://github.com/alternatefutures/template-astro my-site
cd my-site

# Install dependencies
npm install

# Build for production
npm run build

# Initialize and deploy (build output is in ./dist)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-astro) | [Astro Docs](https://docs.astro.build/)

**SvelteKit (Static Adapter)**

```bash
# Clone the SvelteKit template
git clone https://github.com/alternatefutures/template-sveltekit my-site
cd my-site

# Install dependencies
npm install

# Build static export
npm run build

# Initialize and deploy (build output is in ./build)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-sveltekit) | [SvelteKit Docs](https://kit.svelte.dev/docs)

**Hugo (Static Site Generator)**

```bash
# Clone the Hugo template
git clone https://github.com/alternatefutures/template-hugo my-site
cd my-site

# Build for production (requires Hugo installed)
hugo

# Initialize and deploy (build output is in ./public)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-hugo) | [Hugo Docs](https://gohugo.io/documentation/)

**VitePress (Documentation)**

```bash
# Clone the VitePress template
git clone https://github.com/alternatefutures/template-vitepress my-site
cd my-site

# Install dependencies
npm install

# Build for production
npm run docs:build

# Initialize and deploy (build output is in ./docs/.vitepress/dist)
af sites init
af sites deploy
```

[Template Repository](https://github.com/alternatefutures/template-vitepress) | [VitePress Docs](https://vitepress.dev/)

::: tip Framework Not Listed?
Any static site generator works with Alternate Futures! Just build your site and deploy the output directory. Common output folders: `dist/`, `build/`, `out/`, `public/`.
:::

#### Option 2: Create a Simple HTML Site

If you just want to test quickly without a framework:

**Creating a basic HTML site**

```bash [Terminal]
# Create a test directory
mkdir my-first-site
cd my-first-site

# Create a simple HTML file
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My First Decentralized Site</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        h1 { color: #4A90E2; }
    </style>
</head>
<body>
    <h1>🚀 Hello Decentralized Web!</h1>
    <p>This site is hosted on IPFS using Alternate Futures.</p>
    <p>No centralized servers. No single point of failure.</p>
</body>
</html>
EOF

# Create a dist folder (where build output typically goes)
mkdir dist
cp index.html dist/
```

**Great! You now have a simple site ready to deploy.** Continue to the next section to deploy it.

### Deploy to a Storage Network

Now let's deploy your site to a decentralized storage network. You have three options:

::: tip Choosing a Storage Network
**For this tutorial, use IPFS** - it's the easiest to start with and works great for testing and learning.

**What are these networks?**
- **IPFS** (InterPlanetary File System) - Like peer-to-peer file sharing but for your website. Instead of living on one server, your site lives everywhere. **Best for:** Testing, frequently updated sites. **Cost:** ~$0.15/GB/month
- **Filecoin** - A marketplace where you rent storage from miners who compete to store your data cheaply. **Best for:** Large files, backups. **Cost:** ~$0.03/GB/month
- **Arweave** - Pay once, store forever. Your data is permanent and can never be deleted. **Best for:** NFT metadata, permanent archives. **Cost:** ~$6/GB one-time

**Want to learn more?** See our [storage network comparison guide](./sites.md#choosing-the-right-network) or [glossary entries for IPFS](./glossary.md#ipfs-interplanetary-file-system), [Filecoin](./glossary.md#filecoin), and [Arweave](./glossary.md#arweave).
:::

::: code-group

```bash [CLI]
# Initialize site configuration (creates af.config.json)
af sites init

# Follow the prompts to configure:
# - Site name
# - Build command (optional)
# - Output directory (dist, build, etc.)
# - Storage network (IPFS, Filecoin, Arweave)

# Deploy the site
af sites deploy

# You should see output like:
# ✓ Building site...
# ✓ Uploading files to IPFS...
# ✓ Deployment successful!
# ✓ CID: bafybei...
# ✓ URL: https://ipfs.io/ipfs/bafybei...
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

// Initialize the SDK
const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// Upload to IPFS
const result = await af.ipfs().add('./dist');
console.log('CID:', result.pin.cid);

// List your sites
const sites = await af.sites().list();
console.log('Sites:', sites);
```

:::

### What Just Happened?

When you deployed, Alternate Futures:

1. **Bundled your files** - Packaged all files in the `./dist` folder
2. **Uploaded to IPFS** - Sent them to the InterPlanetary File System
3. **Generated a CID** - Created a unique Content Identifier (like a fingerprint for your site)
4. **Pinned the content** - Ensured your files stay available on the network
5. **Gave you a URL** - Your site is now live and accessible worldwide!

**What's a CID?** It's a unique identifier for your content, like `bafybei...`. It's based on your content itself, so identical content always has the same CID.

### View Your Deployments

::: code-group

```bash [CLI]
# List all your sites
af sites list

# View deployments for a specific site
af sites deployments --slug my-site

# Output shows:
# - Site name and slug
# - CID
# - URL
# - Deployment date
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// List all sites
const sites = await af.sites().list();

sites.forEach(site => {
  console.log(`${site.name}: ${site.slug}`);
});
```

:::

### Troubleshooting Deployment

**"No such file or directory: ./dist"**
- Make sure the directory exists
- Use the correct path to your build output
- Try an absolute path: `af sites deploy /full/path/to/dist --network ipfs`

**"Deployment failed" or timeout errors**
- Check your internet connection
- Verify you're authenticated: `af login`
- Try again—network issues can be temporary
- Try a smaller deployment first to test

**"No files found to deploy"**
- Make sure your directory isn't empty
- Check for hidden `.gitignore` or `.npmignore` excluding files
- List the directory contents: `ls -la ./dist`

### Success! {.celebration}

Your site is now live on decentralized infrastructure! The URL works from anywhere in the world, and your content can't be taken down by any single company or server failure.

Try visiting your URL in a browser—you should see your site live!

## Understanding Storage Networks

You deployed to **IPFS**, but Alternate Futures supports three decentralized storage networks. Here's a quick comparison:

| Network | Best For | Cost | Permanence |
|---------|----------|------|------------|
| **IPFS** | Testing, frequent updates, dynamic content | ~$0.15/GB/month | While pinned |
| **Filecoin** | Large files, backups, cost-sensitive projects | ~$0.03/GB/month | Contract-based |
| **Arweave** | NFTs, archives, immutable content | ~$6/GB one-time | Permanent |

**Quick Guide:**
- Just learning? Use **IPFS**
- Building an NFT project? Use **Arweave**
- Need cheap storage for large files? Use **Filecoin**
- Production website? Use **IPFS** with **Arweave** backup

Learn more in the [Sites Guide](./sites.md) or [Storage Management Guide](./storage.md).

## Next Steps

Congratulations! You've deployed your first site to decentralized infrastructure. Here's what to explore next:

### Core Features
- **[Deploying Sites](./sites.md)** - Learn about storage networks, custom domains, and advanced deployment options
- **[Managing AI Agents](./agents.md)** - Deploy chatbots and AI assistants that run 24/7
- **[Cloud Functions](./functions.md)** - Build serverless APIs and backend logic
- **[Storage Management](./storage.md)** - Manage files across IPFS, Filecoin, and Arweave

### Configuration
- **[Authentication](./authentication.md)** - Set up multi-method auth (email, social, Web3 wallets)
- **[API Keys](./api-keys.md)** - Generate keys for programmatic access
- **[Custom Domains](./custom-domains.md)** - Connect your own domain name
- **[Projects](./projects.md)** - Organize your deployments

### Developer Tools
- **[CLI Commands](../cli/commands.md)** - Complete command reference
- **[SDK API Reference](../sdk/api.md)** - TypeScript SDK documentation
- **[CI/CD Integration](./cicd.md)** - Automate deployments with GitHub Actions, GitLab CI, etc.
- **[Best Practices](./best-practices.md)** - Optimization tips and patterns

### Advanced
- **[Decentralized Registry](./decentralized-registry.md)** - Self-hosted container registry
- **[Private Gateways](./gateways.md)** - Run your own IPFS gateway
- **[ENS Integration](./ens.md)** - Link Ethereum Name Service domains

### Need Help?

- **[Glossary](./glossary.md)** - Definitions of technical terms (coming soon)
- **GitHub Issues** - [Report bugs or request features](https://github.com/alternatefutures)
- **Community** - Join our [Discord](https://discord.gg/alternatefutures) or [Twitter](https://twitter.com/alternatefutures)

## What You Learned

In this quickstart, you:
- ✅ Installed the Alternate Futures CLI
- ✅ Authenticated with the platform
- ✅ Created a simple website
- ✅ Deployed it to IPFS
- ✅ Understood what CIDs are and how decentralized hosting works
- ✅ Got your first site live on decentralized infrastructure

**You're now ready to build on the decentralized web!** 🚀
