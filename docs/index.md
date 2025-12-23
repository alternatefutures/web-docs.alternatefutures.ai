---
layout: home

hero:
  name: ""
  text: Alternate Cloud Documentation <span class="beta-badge">BETA</span>
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
    details: Unified interface for managing decentralized storage across networks
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
      alt: Analytics
    title: Analytics
    details: Track usage and performance metrics across all your deployments
    status: in-progress
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
- [Decentralized Registry](/guides/decentralized-registry) - Self-hosted container registry with IPFS
- [Deploy Your Registry](/guides/registry-deployment) - Step-by-step Akash deployment guide

## Installation

::: code-group

```bash [CLI]
npm install -g @alternatefutures/cli
af login
```

```bash [SDK]
npm install @alternatefutures/sdk
```

:::

## Example Usage

::: code-group

```bash [CLI]
# Initialize and deploy a site
af sites init
af sites deploy

# List your sites
af sites list

# Upload files to IPFS
af storage add ./my-files
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

// Upload to IPFS
const result = await af.ipfs().add('./dist');
console.log('CID:', result.pin.cid);
```

:::
