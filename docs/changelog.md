---
description: Changelog for the Alternate Futures platform, CLI, SDK, and infrastructure.
---

# Changelog

All notable changes to the Alternate Futures platform are documented here in reverse chronological order.

## February 2026

### Platform Launch (Public Beta)

**Released: February 2026**

The Alternate Futures platform enters public beta, providing decentralized cloud infrastructure for static sites, AI agents, cloud functions, and storage management.

- **Web App** - Dashboard for managing projects, sites, agents, and billing at [app.alternatefutures.ai](https://app.alternatefutures.ai)
- **Multi-Auth Support** - Sign in with email (magic link), Google, GitHub, Twitter, Discord, or Web3 wallets (MetaMask, WalletConnect, Phantom)
- **Three Storage Networks** - Deploy to IPFS, Filecoin, or Arweave from a unified interface
- **AI Agent Hosting** - Deploy and manage Eliza, ComfyUI, and custom AI agents
- **Cloud Functions** - Serverless functions on decentralized infrastructure
- **Observability** - Distributed tracing, metrics, and logging for all deployments
- **Billing** - Usage-based pricing with Stripe integration and credit system

### CLI v1.0

**Released: February 2026**

The `@alternatefutures/cli` package is now available on npm. The CLI binary is `acc`.

- `acc login` - Interactive browser-based authentication
- `acc sites init` - Initialize site configuration with framework detection
- `acc sites deploy` - Deploy to IPFS, Filecoin, or Arweave
- `acc sites list` - View all sites and deployments
- `acc storage add` - Upload files to decentralized storage
- `acc pat create` - Generate Personal Access Tokens for automation
- `acc projects list` - Manage projects and organizations
- Automatic framework detection for React, Next.js, Vue, Astro, SvelteKit, Hugo, and more
- JSON output mode for scripting and CI/CD integration
- Environment variable support (`AF_TOKEN`, `AF_PROJECT_ID`)

```bash
npm install -g @alternatefutures/cli
```

### SDK v1.0

**Released: February 2026**

The `@alternatefutures/sdk` package is now available on npm with full TypeScript support.

- `AlternateFuturesSdk` - Main SDK class with fluent API
- `PersonalAccessTokenService` - Token-based authentication
- `StaticAccessTokenService` - Static token authentication for serverless
- IPFS upload and pinning (`af.ipfs().add()`)
- Site management (`af.sites().list()`, `af.sites().get()`)
- Storage management across all three networks
- Full TypeScript type definitions
- Browser and Node.js support

```bash
npm install @alternatefutures/sdk
```

### Template Repositories

**Released: February 2026**

Starter templates for popular frameworks, pre-configured for Alternate Futures deployment:

- [template-react](https://github.com/alternatefutures/template-react) - React + Vite starter
- [template-nextjs](https://github.com/alternatefutures/template-nextjs) - Next.js static export starter
- [template-vue](https://github.com/alternatefutures/template-vue) - Vue.js + Vite starter
- [template-astro](https://github.com/alternatefutures/template-astro) - Astro starter
- [template-sveltekit](https://github.com/alternatefutures/template-sveltekit) - SvelteKit static adapter starter
- [template-hugo](https://github.com/alternatefutures/template-hugo) - Hugo static site starter
- [template-vitepress](https://github.com/alternatefutures/template-vitepress) - VitePress documentation starter

Each template includes an `acc.config.json` with the correct build command and output directory pre-configured.

### Documentation Site

**Released: February 2026**

Comprehensive documentation at [docs.alternatefutures.ai](https://docs.alternatefutures.ai) covering:

- Getting started guides and quickstart tutorial
- Framework-specific deployment guides (Next.js, React, Astro)
- CLI command reference
- SDK API reference (auto-generated from TypeDoc)
- Migration guides from Fleek, Netlify, Spheron, and Vercel
- CI/CD integration for GitHub Actions, GitLab CI, CircleCI, and Jenkins
- Infrastructure guides for the decentralized container registry
- Brand guidelines and design system

### Infrastructure

**Released: February 2026**

- **SSL Proxy** - Pingap-based SSL termination proxy on Akash Network with dedicated IP
- **Auth Service** - Hono + SQLite authentication service on Akash Network
- **Secrets Management** - Infisical deployment for secure credential storage
- **Decentralized Container Registry** - Self-hosted registry on Akash with IPFS-backed storage
- **DNS** - Multi-provider DNS configuration (Cloudflare, Google, deSEC)
