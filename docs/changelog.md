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

### CLI v0.2 ([`@alternatefutures/cli` package.json](https://github.com/alternatefutures/cloud-cli/blob/main/package.json))

**Released: February 2026**

The `@alternatefutures/cli` package is now available on npm. The CLI binary is `acc`.

- `acc login` / `acc logout` - Interactive browser-based authentication
- `acc projects` - Manage projects and organizations
- `acc services` - Create, list, deploy, tail logs for, close, and delete services
- `acc deployments` - View deployment history
- `acc billing balance` - Check your credit balance
- `acc ssh` - Manage SSH access
- `acc pat create` - Generate Personal Access Tokens for automation
- JSON output mode for scripting and CI/CD integration
- Environment variable support (`AF_TOKEN`, `AF_PROJECT_ID`)

See the full [command registration in `src/cli.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts).

```bash
npm install -g @alternatefutures/cli
```

### SDK v0.2 ([`@alternatefutures/sdk` package.json](https://github.com/alternatefutures/package-cloud-sdk/blob/main/package.json))

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

- [template-cloud-react](https://github.com/alternatefutures/template-cloud-react) - React + Vite starter
- [template-cloud-nextjs](https://github.com/alternatefutures/template-cloud-nextjs) - Next.js static export starter
- [template-cloud-vue](https://github.com/alternatefutures/template-cloud-vue) - Vue.js + Vite starter
- [template-cloud-astro](https://github.com/alternatefutures/template-cloud-astro) - Astro starter
- [template-cloud-hugo](https://github.com/alternatefutures/template-cloud-hugo) - Hugo static site starter

Each template ships with its framework config (e.g. `vite.config.ts`, `next.config.js`, `astro.config.mjs`) and a ready-to-build `package.json`.

### Documentation Site

**Released: February 2026**

Comprehensive documentation at [docs.alternatefutures.ai](https://docs.alternatefutures.ai) covering:

- Getting started guides and quickstart tutorial
- Framework-specific deployment guides (Next.js, React, Astro)
- CLI command reference
- SDK API reference
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
