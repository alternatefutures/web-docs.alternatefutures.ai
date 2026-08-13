---
description: Definitions of IPFS, Filecoin, Arweave, ENS, IPNS, and other technical terms used in the Alternate Futures platform.
---

# Glossary

A comprehensive guide to technical terms used throughout the Alternate Futures documentation.

## Core Concepts

### Decentralized Infrastructure

Infrastructure that runs across many independent computers instead of being controlled by a single company or data center. If one computer fails, others keep the service running.

**Example:** Instead of your website living on one AWS server, it's spread across hundreds of computers worldwide.

### DePIN (Decentralized Physical Infrastructure Network)

Networks of physical hardware (servers, storage, compute) operated by independent parties rather than a single company. Alternate Futures is a DePIN platform.

**Example:** Uber but for cloud infrastructure—many people provide the servers instead of one company.

### Content-Addressed Storage

A system where files are identified by their content (what's inside them) rather than their location (where they're stored). The same content always has the same identifier, regardless of who uploaded it or where it is.

**Example:** Instead of "myserver.com/file.pdf", your file is identified as "bafybei..." based on its contents.

## Storage Networks

### IPFS (InterPlanetary File System)

A peer-to-peer network for storing and sharing files. Files are identified by their content (CID) and can be retrieved from any node that has them.

**Think of it as:** BitTorrent for websites—your content is distributed across many computers instead of one server.

**Used for:** Frequently updated sites, fast content delivery, decentralized hosting.

**Learn more:** [IPFS Documentation](https://docs.ipfs.tech/) | [IPFS Website](https://ipfs.tech/)

### Filecoin

A blockchain-based marketplace where you can rent storage space from miners. You pay them to store your data and they provide cryptographic proof they're doing it.

**Think of it as:** Airbnb for hard drives—independent operators compete to store your data at the best price.

**Used for:** Long-term archival, large datasets, cost-effective storage.

**Learn more:** [Filecoin Documentation](https://docs.filecoin.io/) | [Filecoin Website](https://filecoin.io/)

### Arweave

A blockchain that offers permanent, one-time-payment storage. You pay once upfront and your data is stored forever (200+ years guarantee).

**Think of it as:** Buying a lifetime membership—pay once, stored forever, can never be deleted.

**Used for:** NFT metadata, permanent archives, immutable content.

**Learn more:** [Arweave Documentation](https://docs.arweave.org/) | [Arweave Website](https://www.arweave.org/)

## IPFS Terms

### CID (Content Identifier)

A unique fingerprint for your content. It's a long string like `bafybei...` that's generated from your file's contents. Identical files always have the same CID.

**Example:** `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`

**Why it matters:** CIDs prove your content hasn't been tampered with. If even one bit changes, you get a completely different CID.

### Pinning

The process of telling IPFS nodes to keep your content available. Without pinning, your content might disappear from the network.

**Think of it as:** Paying rent to keep your content online. Stop pinning, content eventually disappears.

**Services:** Pinata, Web3.Storage, nft.storage all offer pinning services.

**Learn more:** [Pinata](https://www.pinata.cloud/) | [Web3.Storage](https://web3.storage/) | [NFT.Storage](https://nft.storage/)

### Gateway

A web server that translates IPFS content into regular HTTP so browsers can view it. Turns `ipfs://bafybei...` into `https://ipfs.io/ipfs/bafybei...`

**Example:** `https://ipfs.io` and `https://dweb.link` are public gateways.

**Why needed:** Most browsers don't support IPFS natively yet, so gateways bridge the gap.

### IPNS (InterPlanetary Name System)

A way to create mutable pointers to IPFS content. Your IPNS name stays the same, but you can update what CID it points to.

**Think of it as:** A forwarding address—the address (IPNS) stays the same, but the house (CID) it points to can change.

**Example:** `ipns://k51qzi...` always points to your latest website version.

**Learn more:** [IPNS Documentation](https://docs.ipfs.tech/concepts/ipns/)

## Blockchain & Web3 Terms

### Blockchain

A distributed database where records (blocks) are linked together cryptographically. Each block contains a reference to the previous block, creating an unchangeable chain.

**Think of it as:** A ledger where every page is glued to the previous page. You can't rip out a page without everyone noticing.

**Used for:** Cryptocurrency, smart contracts, proof of storage (Filecoin/Arweave).

**Learn more:** [Ethereum Documentation](https://ethereum.org/en/developers/docs/) | [Blockchain Basics](https://www.blockchain.com/learning-portal/blockchain-101)

### Smart Contract

Self-executing code that runs on a blockchain. When conditions are met, the code automatically executes without needing a trusted third party.

**Example:** "If User A pays 1 ETH, automatically transfer ownership of NFT to User A."

### Wallet

Software that holds your cryptographic keys, allowing you to sign transactions and prove ownership. Can be software (MetaMask) or hardware (Ledger).

**Not actually storing crypto:** Wallets don't store cryptocurrency—they store keys that prove you own cryptocurrency on the blockchain.

**Learn more:** [MetaMask Documentation](https://docs.metamask.io/) | [Ethereum Wallets](https://ethereum.org/en/wallets/)

### Gas Fees

Transaction fees paid to blockchain miners/validators to process your transaction. Prices fluctuate based on network demand.

**Example:** On Ethereum, sending a transaction might cost $5-50 in gas fees depending on congestion.

## Alternate Futures Platform Terms

### Project

An organizational container for your sites, agents, and resources. Similar to a "workspace" in other platforms.

**Example:** You might have separate projects for "Personal", "Client Work", and "NFT Project".

### Site

A static website hosted on decentralized storage (IPFS, Filecoin, or Arweave) through Alternate Futures.

### Agent

An AI-powered bot that runs 24/7, capable of chatting, generating content, or performing tasks. Examples: Discord bots, Twitter accounts, image generators.

### Deployment

The act of publishing your site or agent to decentralized infrastructure. Each deployment creates a new version with its own CID.

### Build

The process of compiling your source code into static files that can be deployed. For example, turning React JSX into HTML/CSS/JS.

**Build folder:** The output directory (usually `dist/`, `build/`, or `public/`) containing your compiled files.

## AI & Agent Terms

### Eliza

An open-source framework for building conversational AI agents with personality, memory, and multi-platform support.

**Used for:** Creating chatbots for Discord, Twitter, Telegram with persistent memory and custom personalities.

**Learn more:** [Eliza GitHub](https://github.com/elizaos/eliza) | [Eliza Documentation](https://elizaos.github.io/eliza/)

### Character File

A JSON configuration file that defines an AI agent's personality, knowledge, and behavior.

**Contains:** Name, bio, personality traits, example conversations, knowledge base.

### LLM (Large Language Model)

An AI model trained on vast amounts of text, capable of understanding and generating human-like text. Examples: GPT-4, Claude, Llama.

### ComfyUI

A node-based interface for creating AI image and video generation workflows, especially for Stable Diffusion.

**Used for:** NFT art generation, custom image APIs, automated content creation.

**Learn more:** [ComfyUI GitHub](https://github.com/comfyanonymous/ComfyUI) | [Stable Diffusion](https://stability.ai/stable-diffusion)

## Authentication Terms

### API Key

A secret token that authenticates your application to access Alternate Futures services. Like a password but for code.

**Format:** Personal Access Tokens are formatted `af_<environment>_<random>`, e.g. `af_prod_a1b2c3...` (see [`token.service.ts`](https://github.com/alternatefutures/service-auth/blob/main/src/services/token.service.ts))

**Security:** Never commit to version control, always use environment variables.

### Personal Access Token (PAT)

Similar to an API key but tied to your user account rather than an application.

**Used for:** CLI authentication, SDK access, automation scripts.

### OAuth

A standard for allowing users to log in using existing accounts (Google, GitHub, etc.) without sharing passwords.

**Example:** "Sign in with Google" buttons use OAuth.

### Magic Link

A login method where you receive an email with a link that logs you in—no password needed.

## Container & Registry Terms

### Container

A packaged application with all its dependencies, isolated from the rest of the system. Docker is the most popular container platform.

**Think of it as:** A shipping container for software—everything it needs is packaged inside, runs the same everywhere.

### Docker

A platform for creating, deploying, and running containers. The industry standard for containerization.

**Learn more:** [Docker Documentation](https://docs.docker.com/) | [Docker Website](https://www.docker.com/)

### Registry

A storage and distribution system for container images. Docker Hub and GitHub Container Registry are examples.

**Alternate Futures offers:** A decentralized container registry backed by IPFS instead of centralized storage.

### OCI (Open Container Initiative)

A standard for container formats and runtimes. Ensures containers work across different tools and platforms.

**Why it matters:** Alternate Futures registry is OCI-compliant, meaning it works with standard Docker tools.

### Image

A snapshot of a container with all its files, dependencies, and configuration. You "pull" images to run containers.

**Example:** `nginx:latest` is an image, running it creates a container.

## Networking Terms

### CDN (Content Delivery Network)

A network of servers distributed globally that cache and deliver content from locations close to users.

**Example:** Cloudflare, Akamai

**IPFS equivalent:** Public gateways act as a CDN for IPFS content.

**Learn more:** [Cloudflare CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)

### DNS (Domain Name System)

The system that translates human-readable domain names (example.com) into IP addresses (93.184.216.34).

**Used for:** Custom domains, ENS integration, gateway configuration.

### ENS (Ethereum Name Service)

A decentralized naming system built on Ethereum. Like DNS, but owned by you via NFT.

**Example:** `mysite.eth` can point to your IPFS content.

**Learn more:** [ENS Documentation](https://docs.ens.domains/) | [ENS Website](https://ens.domains/)

### SSL/TLS Certificate

Encryption certificates that enable HTTPS for secure web connections. The lock icon in your browser.

**Alternate Futures:** Automatically provides SSL certificates for all deployments.

## Developer Terms

### CLI (Command Line Interface)

A text-based interface for interacting with software. The Alternate Futures CLI lets you deploy from your terminal.

**Example:** `acc services deploy`

### SDK (Software Development Kit)

A set of tools and libraries for developers to build applications. The Alternate Futures SDK provides programmatic access.

**Languages:** JavaScript/TypeScript (Node.js and browser)

### Environment Variables

Configuration values stored outside your code, typically for secrets or environment-specific settings.

**Example:** `AF_TOKEN=af_prod_123...`

**Storage:** `.env` files locally, platform settings in production.

### CI/CD (Continuous Integration / Continuous Deployment)

Automation that tests and deploys your code whenever you push changes. GitHub Actions and GitLab CI are examples.

**With Alternate Futures:** Automatically deploy to IPFS/Arweave on every git push.

**Learn more:** [GitHub Actions](https://docs.github.com/en/actions) | [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)

### Webhook

An HTTP callback that notifies your application when an event occurs. Like a reverse API call.

**Example:** GitHub sends a webhook when you push code, triggering an Alternate Futures deployment.

## Cost & Billing Terms

### Bandwidth

The amount of data transferred when users access your content. Usually measured in GB.

**Example:** If 100 users each download a 10MB file, that's 1GB of bandwidth.

### Egress

Data leaving a storage system to users. Some platforms charge for egress; IPFS gateways typically don't.

### Storage

The amount of disk space your files occupy, measured in GB or TB.

**Pricing varies:** IPFS ~$0.15/GB/month, Filecoin ~$0.03/GB/month, Arweave ~$6/GB one-time.

### Compute

Processing power used to run applications. Measured in CPU hours or GPU hours for AI agents.

**Example:** Running an Eliza agent 24/7 uses ~720 compute hours per month.

## Security & Privacy Terms

### Encryption

Converting data into a secret code that only authorized parties can read. Alternate Futures encrypts API keys and secrets.

**Example:** Encrypting a file means even if someone steals it, they can't read it without the decryption key.

### End-to-End Encryption

Encryption where data is encrypted on your device and only decrypted by the recipient. The service provider (servers in between) can't read it.

**Example:** Signal messages—even Signal's servers can't read your conversations.

**For Alternate Futures:** Encrypt files locally before uploading for maximum privacy.

**Learn more:** [Signal Protocol](https://signal.org/docs/) | [End-to-End Encryption Explained](https://www.cloudflare.com/learning/privacy/what-is-end-to-end-encryption/)

### Client-Side Encryption

Encrypting data in your browser/app before it leaves your device. The server only sees encrypted data.

**Why it matters:** Hosting providers, including Alternate Futures, can't see your plaintext data.

**How to do it:** Use libraries like `crypto-js` or native Web Crypto API before uploading.

**Learn more:** [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | [CryptoJS Library](https://github.com/brix/crypto-js)

### SGX (Software Guard Extensions)

Intel hardware technology that creates encrypted memory regions where code runs in isolation, even from the operating system.

**Think of it as:** A vault inside the computer—even the computer's owner can't peek inside.

**Used for:** Running cloud functions with enhanced privacy and security where not even the cloud provider can see your data.

**Learn more:** [Intel SGX](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)

### Zero-Knowledge

A system where the service provider has no knowledge of your data. They can store/process it without seeing the contents.

**Example:** ProtonMail can't read your emails, even though they store them.

**For Alternate Futures:** Combine client-side encryption with decentralized storage for zero-knowledge hosting.

**Learn more:** [ProtonMail](https://proton.me/mail) | [Zero-Knowledge Proofs](https://ethereum.org/en/zero-knowledge-proofs/)

### Censorship-Resistant

Content or applications that cannot be taken down by any single authority, government, or company.

**Why:** Decentralized hosting means no central server to seize or shut down.

**Example:** Traditional hosting: Government sends notice to AWS → Site goes down. IPFS: No single target to attack.

### Immutable

Data that cannot be changed or deleted once written. Arweave storage is immutable by design.

**Example:** Once you upload to Arweave, that exact content will exist forever and can never be altered.

**Use case:** Permanent records, evidence archives, historical preservation.

### Server Logs

Records kept by traditional hosting providers tracking who visits your site, when, and from where.

**Privacy concern:** Logs can be subpoenaed, hacked, or used for surveillance.

**With decentralized hosting:** No centralized logs exist. Public gateways may log, but you can run your own gateway.

### Tor (The Onion Router)

A network that anonymizes your internet connection by routing through multiple encrypted nodes.

**Used for:** Accessing IPFS/Arweave content anonymously without revealing your IP address.

**Example:** Use Tor Browser → access IPFS gateway → view content privately.

**Learn more:** [Tor Project](https://www.torproject.org/) | [Tor Browser](https://www.torproject.org/download/)

### Private Key

A secret cryptographic key that proves ownership. Used for wallets, signing transactions, and authentication.

**Critical:** If someone gets your private key, they control your assets. Never share it.

### Public Key

A cryptographic key that can be shared publicly, paired with a private key. Used for encryption and verification.

**Example:** Share your public key for others to encrypt messages only you can decrypt.

## Acronyms Quick Reference

| Acronym | Full Name | What It Means |
|---------|-----------|---------------|
| **API** | Application Programming Interface | How software talks to software |
| **CDN** | Content Delivery Network | Global server network for fast content |
| **CI/CD** | Continuous Integration/Deployment | Automated testing and deployment |
| **CID** | Content Identifier | Unique ID for content on IPFS |
| **CLI** | Command Line Interface | Text-based software interface |
| **DePIN** | Decentralized Physical Infrastructure | Distributed hardware networks |
| **DNS** | Domain Name System | Translates domains to IP addresses |
| **ENS** | Ethereum Name Service | Decentralized domain names |
| **HTTP** | HyperText Transfer Protocol | How web browsers communicate |
| **IPFS** | InterPlanetary File System | Peer-to-peer file storage network |
| **IPNS** | InterPlanetary Name System | Mutable names for IPFS content |
| **LLM** | Large Language Model | AI trained on massive text data |
| **NFT** | Non-Fungible Token | Unique digital asset on blockchain |
| **OCI** | Open Container Initiative | Container format standard |
| **PAT** | Personal Access Token | User-specific API authentication |
| **SDK** | Software Development Kit | Tools for building applications |
| **SGX** | Software Guard Extensions | Hardware-based security |
| **SSL/TLS** | Secure Sockets Layer/Transport Layer Security | Encryption for web traffic |

## Still Confused?

If you encounter a term not listed here:

1. Check the specific guide related to that feature
2. Search the documentation (search box in top right)
3. Ask in our [Discord community](https://discord.gg/alternatefutures)
4. [Open a GitHub issue](https://github.com/alternatefutures/docs/issues) to request clarification

We're constantly improving this glossary based on user feedback!
