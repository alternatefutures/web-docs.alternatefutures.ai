---
description: Deploy static sites to IPFS, Filecoin, or Arweave using the Alternate Futures CLI or SDK. Supports React, Next.js, Vue, Astro, and more.
---

# Deploying Sites

Deploy static sites to decentralized storage networks (IPFS, Filecoin, Arweave).

## Deployment Methods

::: warning Web App Coming Soon
The web application interface (GitHub Integration and Upload Folder methods) is currently in development. In the meantime, use the CLI or SDK methods below to deploy your sites.
:::

### GitHub Integration

::: warning Coming Soon
This feature will be available once the web app launches.
:::

Deploy directly from a GitHub repository:

1. Go to **Sites** → **Deploy Site**
2. Choose **GitHub**
3. Connect your GitHub account
4. Select repository and branch
5. Configure build settings
6. Choose storage network
7. Click **Deploy**

Auto-deploys on every push to the selected branch.

### Upload Folder

::: warning Coming Soon
This feature will be available once the web app launches.
:::

Deploy a local build folder:

1. Go to **Sites** → **Deploy Site**
2. Choose **Upload Folder**
3. Drag and drop your build folder (or browse)
4. Choose storage network
5. Click **Deploy**

### CLI Deployment (Available Now)

Deploy via command line:

```bash
# Deploy to IPFS
acc sites deploy ./dist --network ipfs

# Deploy to Arweave
acc sites deploy ./dist --network arweave

# Deploy to Filecoin
acc sites deploy ./dist --network filecoin
```

## Storage Networks

Alternate Futures supports three decentralized storage networks. Each has different strengths, costs, and use cases.

### Choosing the Right Network

Not sure which network to use? Use this decision guide:

#### Quick Decision Tree

```
Are you building an NFT project or need permanent, immutable storage?
  → YES: Use Arweave
  → NO: Continue...

Is this a production website that updates regularly?
  → YES: Use IPFS (with optional Arweave backup)
  → NO: Continue...

Do you have large files (100GB+) and need low cost?
  → YES: Use Filecoin
  → NO: Use IPFS (easiest to start)
```

#### By Use Case

**Personal Portfolio (Developer/Designer)**
- **Primary:** IPFS (~$0.01/month for 100MB) or Arweave (~$0.60 one-time)
- **Why:** Show off your work with a unique, decentralized URL
- **Like:** GitHub Pages but with custom domains and decentralized
- **Bonus:** Content can't be taken down, great conversation starter

**React/Vue/Svelte App (SPA)**
- **Primary:** IPFS (~$0.15/month for 1GB)
- **Why:** Fast global CDN, frequent updates, easy deployments
- **Like:** Vercel or Netlify but decentralized
- **Perfect for:** SaaS frontends, admin dashboards, web apps

**Static Blog (Astro/Hugo/Jekyll)**
- **Primary:** IPFS with Arweave backup
- **Why:** Fast loading (IPFS) + permanent archive (Arweave)
- **Cost:** ~$0.05/month + ~$1.50 one-time for 250MB
- **Like:** Medium or Ghost but you own everything forever

**Landing Page (Marketing Site)**
- **Primary:** IPFS (~$0.02/month for 50MB)
- **Why:** Frequent A/B testing, fast worldwide delivery
- **Like:** Netlify but potentially cheaper for static content
- **Perfect for:** Product launches, email capture, announcements

**Documentation Site (Vitepress/Docusaurus/MkDocs)**
- **Primary:** IPFS (~$0.08/month for 500MB)
- **Why:** Regular updates, versioning, fast search
- **Like:** Read the Docs but decentralized with version history
- **Bonus:** Every deployment gets a permanent CID for version linking

**E-commerce Storefront (Headless Commerce)**
- **Primary:** IPFS (~$0.20/month for 2GB)
- **Why:** Fast product pages, frequent inventory updates
- **Like:** Shopify frontend on Vercel, but decentralized
- **Perfect for:** Headless Shopify, product catalogs, storefronts

**Company Website (Corporate Site)**
- **Primary:** IPFS with custom domain (~$0.10/month for 1GB)
- **Why:** Professional presence, SSL included, global CDN
- **Like:** Any traditional web host but censorship-resistant
- **Perfect for:** About pages, team bios, contact forms

**NFT Collection Website**
- **Primary:** Arweave (~$0.60 one-time for 100MB)
- **Why:** Must be permanent, immutable, and verifiable
- **Cost:** ~$0.60 one-time for 100MB of metadata/images
- **Industry standard** for NFT projects (OpenSea expects Arweave)

**Conference/Event Site (Temporary)**
- **Primary:** IPFS (~$0.05/month for 500MB)
- **Why:** Short-term hosting, then can unpin to stop costs
- **Like:** Quick landing page for events, cheaper than keeping domain alive
- **Bonus:** Keep it pinned forever as a historical record for ~$0 more

**Large Media Archive (500GB Videos/Photos)**
- **Primary:** Filecoin (~$15/month)
- **Why:** Most cost-effective for large datasets
- **Cost:** $15/month vs ~$75/month on IPFS or $3,000 on Arweave
- **Perfect for:** Video galleries, photo archives, backups

**Open Source Project Demos**
- **Primary:** IPFS (~$0.05/month for 200MB)
- **Why:** Each PR can have its own CID for preview deploys
- **Like:** Vercel preview deployments but with permanent CIDs
- **Perfect for:** Interactive demos that need to stay accessible

**Whistleblower/Leak Platform**
- **Primary:** Arweave (~$3 one-time for 500MB)
- **Why:** Permanent, immutable, no server logs, no centralized control
- **Like:** WikiLeaks-style platforms but truly uncensorable
- **Perfect for:** Document dumps, investigative journalism, transparency initiatives
- **Bonus:** Content-addressing means identical documents have same CID (deduplication)

**Activist/Political Campaign Site**
- **Primary:** IPFS (~$0.05/month for 300MB)
- **Why:** Can't be seized, no single hosting company to pressure
- **Like:** Traditional website but immune to takedown requests
- **Perfect for:** Protest organizing, political dissidents, human rights advocacy
- **Bonus:** Mirror across multiple gateways for resilience

**Privacy-Focused Blog (Anonymous Author)**
- **Primary:** IPFS (~$0.03/month for 150MB) or Arweave (~$1 one-time)
- **Why:** No server logs tracking visitors, no centralized owner
- **Like:** Medium but without corporate surveillance
- **Perfect for:** Journalists in dangerous regions, anonymous researchers
- **Security tip:** Use Tor + IPFS gateway for true anonymity

**Encrypted Document Archive**
- **Primary:** Filecoin (~$3/month for 100GB) + client-side encryption
- **Why:** Cheap long-term storage, data encrypted before upload
- **Like:** Encrypted cloud backup but decentralized
- **Perfect for:** Legal documents, medical records, sensitive research
- **Security:** Encrypt files locally before uploading (server never sees plaintext)

**Alternative Social Network/Forum**
- **Primary:** IPFS (~$0.20/month for 2GB)
- **Why:** No central authority can ban users or censor content
- **Like:** Reddit/Mastodon but without moderators or corporate control
- **Perfect for:** Free speech platforms, controversial discussions
- **Note:** Frontend is decentralized, but consider decentralized backend too

**Government/Corporate Watchdog Site**
- **Primary:** Arweave (~$6 one-time for 1GB)
- **Why:** Permanent record that can't be altered or deleted
- **Like:** Archive.org but immutable and censorship-proof
- **Perfect for:** Tracking policy changes, preserving deleted tweets/posts
- **Bonus:** Every version has verifiable timestamp on blockchain

### Network Comparison

| Feature | IPFS | Filecoin | Arweave |
|---------|------|----------|---------|
| **Cost Structure** | Monthly | Monthly | One-time |
| **Price** | ~$0.15/GB/month | ~$0.03/GB/month | ~$6/GB once |
| **Update Frequency** | ✅ High | ⚠️ Moderate | ❌ Immutable |
| **Speed** | ✅ Fast | ⚠️ Moderate | ✅ Fast |
| **Permanence** | While pinned | Contract-based | ♾️ Forever |
| **Best File Size** | Any | Large (100GB+) | Any |
| **Mutability** | ✅ Via IPNS | ✅ New deals | ❌ Immutable |
| **NFT-Ready** | ⚠️ Needs pinning | ⚠️ Needs pinning | ✅ Perfect |

### Understanding the Networks

#### IPFS (InterPlanetary File System)

**What it is:** A peer-to-peer network where files are identified by their content, not location.

**How it works:**
1. Your files get a unique ID (CID) based on their content
2. Files are "pinned" to ensure they stay available
3. Content is retrieved from the nearest available node
4. Like BitTorrent, but for websites

**Pros:**
- ✅ Fast global distribution via CDN gateways
- ✅ Easy to update (IPNS support)
- ✅ Most similar to traditional hosting
- ✅ Great ecosystem and tooling

**Cons:**
- ❌ Requires active pinning (monthly cost)
- ❌ Content disappears if unpinned
- ❌ Not truly permanent

**Best for:** Frequently updated sites, fast propagation

**Pricing:** ~$0.15/GB/month

**Real Example:**
A 500MB React app costs ~$0.08/month. If you update it weekly, IPFS makes sense because updates are easy.

#### Filecoin

**What it is:** A blockchain-based storage marketplace where you make "deals" with storage providers.

**How it works:**
1. You create a storage deal with a miner
2. The miner stores your data and provides cryptographic proofs
3. You pay for the storage duration
4. Compatible with IPFS for retrieval

**Pros:**
- ✅ 5x cheaper than IPFS for large files
- ✅ Cryptographic proof your data is stored
- ✅ Decentralized marketplace
- ✅ IPFS-compatible

**Cons:**
- ❌ Slower than IPFS for small files
- ❌ More complex setup
- ❌ Deal negotiation required

**Best for:** Long-term archival, data preservation, large datasets

**Pricing:** ~$0.03/GB/month

**Real Example:**
A 200GB video archive costs ~$6/month on Filecoin vs ~$30/month on IPFS.

#### Arweave

**What it is:** A blockchain that offers permanent, pay-once storage that lasts forever.

**How it works:**
1. You pay a one-time fee upfront
2. Your data is stored permanently on the "blockweave"
3. Economic incentives ensure miners store it forever
4. Cannot be updated or deleted

**Pros:**
- ✅ Truly permanent (200+ year guarantee)
- ✅ One-time payment (no recurring costs)
- ✅ Built-in CDN
- ✅ Perfect for NFTs and archives
- ✅ Censorship-resistant

**Cons:**
- ❌ Higher upfront cost
- ❌ Cannot update or delete content
- ❌ Not suitable for frequently changing sites

**Best for:** Permanent storage, immutable content, NFTs

**Pricing:** One-time fee (~$6/GB)

**Real Example:**
NFT metadata (1MB) costs ~$0.006 once and is stored forever. If a traditional CDN costs $0.01/month, Arweave pays for itself in 7 months and then it's free forever.

### Cost Comparison Examples

Here's what different project sizes cost across networks:

#### Small Blog (100MB)
- **IPFS:** $0.015/month → $0.18/year
- **Filecoin:** $0.003/month → $0.036/year
- **Arweave:** $0.60 once (free after that)
- **Winner:** IPFS for frequent updates, Arweave for long-term

#### Medium Website (1GB)
- **IPFS:** $0.15/month → $1.80/year
- **Filecoin:** $0.03/month → $0.36/year
- **Arweave:** $6 once
- **Winner:** Filecoin after year 1, Arweave after ~3 years

#### Large Archive (100GB)
- **IPFS:** $15/month → $180/year
- **Filecoin:** $3/month → $36/year
- **Arweave:** $600 once
- **Winner:** Filecoin for almost all cases

#### NFT Collection (500MB metadata)
- **IPFS:** $0.075/month → Needs permanent pinning
- **Filecoin:** $0.015/month → Needs permanent deals
- **Arweave:** $3 once → Permanent, immutable, verifiable
- **Winner:** Arweave (industry standard for NFTs)

## Build Configuration

### Framework Detection

Automatic detection for:

- **React/Vite** - `dist/`
- **Next.js** - `.next/`
- **SvelteKit** - `.svelte-kit/output/client/`
- **Nuxt** - `.output/public/`
- **Astro** - `dist/`
- **Hugo** - `public/`

### Custom Build

Specify custom build settings:

```yaml
build:
  command: npm run build
  output: dist
  environment:
    NODE_ENV: production
```

## Custom Domains

::: warning Coming Soon
Custom domain management via the web interface is in development. For now, see [Custom Domains](./custom-domains.md) for manual DNS configuration.
:::

Point your domain to your deployment:

1. Go to site settings
2. Click **Add Custom Domain**
3. Enter your domain (e.g., `example.com`)
4. Configure DNS:
   - **A Record**: Point to gateway IP
   - **CNAME**: Point to deployment URL
   - **DNSLink**: Point to IPFS CID
5. Wait for propagation (~24 hours)

See [Custom Domains](./custom-domains.md) for detailed instructions.

## Deployment History

::: warning Coming Soon
Deployment history viewing via the web interface is in development. Use the CLI to view deployment history: `acc sites list --history`
:::

View all deployments for a site:

- **CID/Transaction ID** - Unique identifier
- **Timestamp** - When deployed
- **Status** - Success, failed, pending
- **Size** - Total deployment size
- **Cost** - Deployment cost

Roll back to any previous deployment with one click.

## Next Steps

- [Storage Management](./storage.md) - Manage storage across networks
- [Custom Domains](./custom-domains.md) - Configure DNS
- [CI/CD Integration](./cicd.md) - Automate deployments
