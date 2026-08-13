---
layout: home

hero:
  name: ""
  text: Alternate Clouds Documentation <span class="beta-badge">BETA</span>
  tagline: Deploy AI agents, cloud functions and sites to decentralized infrastructure
  actions:
    - theme: brand
      text: Get Started
      link: /guides/
    - theme: alt
      text: CLI Docs
      link: /cli/
    - theme: alt
      text: SDK Docs
      link: /sdk/

features:
  - icon:
      src: /icons/robot.svg
      alt: AI Agents
    title: AI Agents
    details: Deploy and manage Eliza, ComfyUI, and custom AI agents with ease
    link: /guides/agents
    linkText: Learn more
  - icon:
      src: /icons/globe.svg
      alt: Static Sites
    title: Static Sites
    details: Host websites on IPFS, Filecoin, or Arweave with one command
    link: /guides/sites
    linkText: Learn more
  - icon:
      src: /icons/database.svg
      alt: Storage
    title: Storage Management
    details: Manage decentralized storage across IPFS, Filecoin, and Arweave from the SDK
    link: /guides/storage
    linkText: Learn more
  - icon:
      src: /icons/code.svg
      alt: Developer Tools
    title: Developer Tools
    details: Powerful CLI and SDK for programmatic access to the platform
    link: /cli/
    linkText: View CLI docs
  - icon:
      src: /icons/cloud.svg
      alt: Cloud Functions
    title: Cloud Functions
    details: Deploy serverless functions on decentralized infrastructure
    link: /guides/functions
    linkText: Learn more
  - icon:
      src: /icons/chart.svg
      alt: Observability
    title: Observability & APM
    details: Distributed tracing, metrics, and logging for all your deployments
    link: /guides/observability
    linkText: Learn more
  - icon:
      src: /icons/credit-card.svg
      alt: Billing
    title: Billing
    details: Manage costs, credits, and payment methods for your services
    link: /guides/billing
    linkText: Learn more
  - icon:
      src: /icons/shield.svg
      alt: Multi-Auth
    title: Multi-Auth
    details: Email, SMS, Web3 wallets, and social login support
    link: /guides/authentication
    linkText: Learn more
  - icon:
      src: /icons/package.svg
      alt: Container Registry
    title: Decentralized Registry
    details: Self-hosted container registry on Akash with IPFS storage - zero vendor lock-in
    link: /guides/decentralized-registry
    linkText: Learn more
  - icon:
      src: /icons/server.svg
      alt: Infrastructure
    title: Infrastructure
    details: Deploy your own registry, DNS, and compute on decentralized networks
    link: /guides/registry-deployment
    linkText: Get started
---

## Quick Links

- [Quick Start Guide](/guides/quickstart) - Deploy your first site in 5 minutes
- [CLI Commands](/cli/commands) - Complete CLI reference
- [SDK API Reference](/sdk/api) - TypeScript SDK documentation
- [Authentication](/guides/authentication) - Multi-method authentication guide
- [Migrate from Fleek](/guides/migrate-from-fleek) - Moving from Fleek? Start here
- [Migrate from Netlify](/guides/migrate-from-netlify) - Moving from Netlify? Start here
- [Migrate from Spheron](/guides/migrate-from-spheron) - Moving from Spheron? Start here
- [Migrate from Vercel](/guides/migrate-from-vercel) - Moving from Vercel? Start here

## Installation

::: code-group

```bash [CLI]
npm install -g @alternatefutures/cli
acc login
```

```bash [SDK]
npm install @alternatefutures/sdk
```

:::

## Example Usage

::: code-group

```bash [CLI]
# Log in (opens your browser)
acc login

# Create and deploy a service
acc services create
acc services deploy

# List services and view deployments
acc services list
acc deployments
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

// List your sites
const sites = await af.sites().list();
console.log('Sites:', sites);

// Upload a build directory to IPFS
const [result] = await af.ipfs().addFromPath('./dist');
console.log('CID:', result.cid.toString());
```

:::

::: tip What this maps to in code
CLI commands are registered in [`src/cli.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts). The SDK's `ipfs().add()` / `addFromPath()` methods live in [`src/clients/ipfs.ts`](https://github.com/alternatefutures/package-cloud-sdk/blob/main/src/clients/ipfs.ts).
:::
