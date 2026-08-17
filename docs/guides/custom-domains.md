---
description: Connect custom domains from any registrar to your Alternate Futures sites with SSL certificates and DNS configuration.
---

# Custom Domains

Bring your own domain from any registrar (GoDaddy, Namecheap, Cloudflare, etc.) and point it to your Alternate Futures site.

## Overview

By default, sites are accessible via:

- **IPFS**: `https://gateway.ipfs.io/ipfs/{CID}`
- **Arweave**: `https://arweave.net/{TX_ID}`
- **Filecoin**: `https://ipfs.io/ipfs/{CID}`

Custom domains provide:
- Branded URLs (e.g., `https://example.com`)
- Easier to remember and share
- SEO benefits
- Professional appearance
- Automatic SSL/TLS certificates via Let's Encrypt

::: tip What this maps to in code
- SDK methods live in the [`domains.ts` client](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/domains.ts) (`createCustomDomain`, `verifyCustomDomain`, `provisionSsl`, `setPrimaryDomain`, `removeCustomDomain`).
- The authoritative GraphQL surface (Domain type, mutations, `CreateDomainInput`) is in [`typeDefs.ts`](https://github.com/alternatefutures/alternate-clouds-api/blob/main/src/schema/typeDefs.ts).
- Verification and SSL status fields are backed by the [Prisma `Domain` model](https://github.com/alternatefutures/alternate-clouds-api/blob/main/prisma/schema.prisma).
:::

## Adding a Custom Domain

### Step 1: Create Domain

::: code-group

```bash [CLI]
# Add a custom domain to your site
acc domains create --siteSlug my-site --hostname example.com

# The CLI will return the verification details
# including any DNS records you need to configure
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// Add a custom domain
const domain = await af.domains().createCustomDomain({
  siteId: 'site_abc123',
  hostname: 'example.com',
  verificationMethod: 'TXT',
});

console.log('Domain created:', domain.hostname);
console.log('Verification status:', domain.isVerified);
```

```graphql [GraphQL (Advanced)]
mutation {
  createDomain(input: {
    hostname: "example.com"
    siteId: "site-123"
    verificationMethod: "TXT"
  }) {
    id
    hostname
    txtVerificationToken
    verified
  }
}
```

:::

**Verification Methods:**
- `TXT` - TXT record verification (works with root domains and subdomains)
- `CNAME` - CNAME record verification (subdomains only)
- `A` - A record verification (points to platform IP)

### Step 2: Configure DNS Records

Based on your chosen verification method, add the appropriate DNS record at your domain registrar:

## DNS Configuration Methods

### Method 1: TXT Record Verification (Recommended)

Add a TXT record to verify domain ownership:

```
Type: TXT
Name: @  (or your hostname)
Value: af-site-verification=xxxxx  (from createDomain response)
TTL: 3600
```

**Example:**
```graphql
mutation {
  createDomain(input: {
    hostname: "example.com"
    siteId: "site-123"
    verificationMethod: "TXT"
  }) {
    id
    txtVerificationToken  # Use this value
  }
}
```

**Pros:**
- Works with root domains and subdomains
- Non-intrusive (doesn't affect current DNS)
- Easy to verify

**Use Case:** Best for initial verification before changing DNS routing

### Method 2: CNAME Record Verification

Point your subdomain to the platform:

```
Type: CNAME
Name: www  (or subdomain)
Value: cname.alternatefutures.ai
TTL: 3600
```

**Example:**
```graphql
mutation {
  createDomain(input: {
    hostname: "www.example.com"
    siteId: "site-123"
    verificationMethod: "CNAME"
  }) {
    id
    dnsConfigs  # Contains the CNAME target to set at your registrar
  }
}
```

**Pros:**
- Verifies and routes traffic in one step
- Automatic deployment updates
- CDN benefits

**Cons:**
- Only works with subdomains (not root domains)

**Use Case:** Best for `www.example.com` or other subdomains

### Method 3: A Record Verification

Point directly to the platform IP:

```
Type: A
Name: @  (for root domain)
Value: [Platform IP Address]
TTL: 3600
```

**Example:**
```graphql
mutation {
  createDomain(input: {
    hostname: "example.com"
    siteId: "site-123"
    verificationMethod: "A"
  }) {
    id
    dnsConfigs  # Contains the A-record target IP to set at your registrar
  }
}
```

**Pros:**
- Works with root domains
- Verifies and routes in one step
- Fast DNS resolution

**Use Case:** Best for apex/root domains like `example.com`

### Step 3: Verify Domain

After adding DNS records, verify your domain:

::: code-group

```bash [CLI]
# Verify DNS configuration for your domain
acc domains verify --hostname example.com

# Check domain details
acc domains detail --hostname example.com
```

```typescript [SDK]
// Verify DNS configuration
const verified = await af.domains().verifyCustomDomain({ domainId: domain.id });
console.log('Verified:', verified);
```

```graphql [GraphQL (Advanced)]
mutation {
  verifyDomain(domainId: "domain-123")
}

# Check verification status:
query {
  domain(id: "domain-123") {
    id
    hostname
    verified
    txtVerificationStatus
    dnsCheckAttempts
    lastDnsCheck
  }
}
```

:::

This checks DNS propagation and updates the domain status. You may need to wait a few minutes for DNS changes to propagate globally.

## SSL/TLS Certificates

Once your domain is verified, provision an SSL certificate:

```graphql
mutation {
  provisionSsl(
    domainId: "domain-123"
    email: "admin@example.com"
  ) {
    id
    sslStatus
    sslIssuedAt
    sslExpiresAt
  }
}
```

**SSL Features:**
- Automatic Let's Encrypt certificate provisioning
- Auto-renewal 30 days before expiry
- HTTP-01 and DNS-01 ACME challenges supported
- Free SSL for all domains

**Certificate Process:**
1. Domain must be verified first
2. Request SSL certificate via `provisionSsl` mutation
3. Wait 5-10 minutes for Let's Encrypt validation
4. Certificate automatically installed and renewed

## Domain Status

**Verification Status:**
- `PENDING` - DNS not yet propagated
- `VERIFIED` - Domain ownership confirmed
- `FAILED` - DNS misconfigured or verification failed

**SSL Status:**
- `NONE` - No certificate requested
- `PENDING` - Certificate being provisioned
- `ACTIVE` - SSL certificate active and working
- `FAILED` - Certificate provisioning failed

**Check status:**
```graphql
query {
  domain(id: "domain-123") {
    verified
    txtVerificationStatus
    sslStatus
    sslExpiresAt
  }
}
```

## Managing Multiple Domains

### List All Domains

Get all domains for a site:

```graphql
query {
  site(id: "site-123") {
    id
    domains {
      id
      hostname
      verified
      sslStatus
      createdAt
    }
  }
}
```

### Set Primary Domain

Set a verified domain as the primary domain for your site:

```graphql
mutation {
  # setPrimaryDomain returns Boolean!
  setPrimaryDomain(siteId: "site-123", domainId: "domain-123")
}
```

**Requirements:**
- Domain must be verified
- Only verified domains can be primary

### Remove Domain

Remove a custom domain:

```graphql
mutation {
  deleteDomain(id: "domain-123")
}
```

**Note:** Cannot remove a domain that is set as primary. Set a different primary domain first.

### Common Multi-Domain Setup

Add multiple domains for different purposes:

- **Primary domain**: `example.com`
- **WWW subdomain**: `www.example.com`
- **Regional domains**: `example.co.uk`, `example.ca`
- **Staging domains**: `staging.example.com`

Each domain can have its own SSL certificate and verification method.

## Troubleshooting

### Verification Failing

**1. Check DNS propagation:**
```bash
dig example.com TXT
dig www.example.com CNAME
dig example.com A
```

DNS changes can take 5 minutes to 48 hours to propagate globally.

**2. Verify correct DNS values:**

For TXT verification:
```bash
dig example.com TXT | grep "af-site-verification"
```

For CNAME verification:
```bash
dig www.example.com CNAME
# Should show: cname.alternatefutures.ai
```

For A record verification:
```bash
dig example.com A
# Should show platform IP
```

**3. Common verification issues:**
- DNS not propagated yet (wait 5-60 minutes)
- Wrong record type (TXT vs CNAME vs A)
- Incorrect hostname (@ vs www vs subdomain)
- Typo in verification token
- TTL too high (recommended: 3600 seconds)

**4. Check verification attempts:**
```graphql
query {
  domain(id: "domain-123") {
    dnsCheckAttempts
    lastDnsCheck
    txtVerificationStatus
  }
}
```

If attempts > 10 and still failing, double-check DNS configuration.

### SSL Certificate Issues

**Check certificate status:**
```graphql
query {
  domain(id: "domain-123") {
    sslStatus
    sslIssuedAt
    sslExpiresAt
  }
}
```

**Common issues:**

1. **Domain not verified**
   - Error: "Domain must be verified before provisioning SSL"
   - Solution: Complete DNS verification first

2. **Certificate provisioning stuck on PENDING**
   - DNS not fully propagated
   - CAA records blocking Let's Encrypt
   - Port 80/443 not accessible for HTTP-01 challenge
   - Wait 10-15 minutes and check again

3. **Certificate expired**
   - Certificates auto-renew 30 days before expiry
   - Check: `sslExpiresAt` field
   - Re-provision if needed: Run `provisionSsl` mutation again

**Test SSL certificate:**
```bash
curl -vI https://example.com
openssl s_client -connect example.com:443 -servername example.com
```

### DNS Provider Specific Issues

**Cloudflare:**
- Disable "orange cloud" proxy for verification
- Use "DNS only" (grey cloud) mode initially
- Re-enable proxy after verification completes

**GoDaddy:**
- DNS propagation can be slow (24-48 hours)
- Use shorter TTL values (600-3600 seconds)

**Namecheap:**
- Use `@` for root domain TXT records
- Use `www` for CNAME records (not `www.example.com`)

**Google Domains / Cloud DNS:**
- Include trailing dot in CNAME if required
- Example: `cname.alternatefutures.ai.`

## Supported DNS Providers

Custom domains work with any DNS provider that supports standard TXT, CNAME, and A records, including:

- **Cloudflare**
- **Namecheap**
- **GoDaddy**
- **Google Domains / Cloud DNS**
- **AWS Route53**
- **DigitalOcean DNS**
- **Vercel DNS**

Propagation time depends entirely on your provider and the TTL you set — it can range from a few minutes to several hours. All major providers support the TXT, CNAME, and A records needed for domain verification.

## Web3 Domains

### ArNS (Arweave Name System)

Register permanent domains on Arweave:

```graphql
mutation {
  registerArns(
    domainId: "domain-123"
    arnsName: "my-site"
    contentId: "<ipfs-or-arweave-content-id>"
  ) {
    id
    arnsName
  }
}
```

**Features:**
- Permanent, immutable domains
- Stored on Arweave blockchain
- Access via: `my-site.arweave.net`

### ENS (Ethereum Name System)

Link ENS domains to your content using the SDK's ENS client. See the dedicated [ENS guide](./ens.md) for the full flow (`af.ens().create(...)`, setting the content hash, and verification).

**Features:**
- Ethereum-based domain names
- Decentralized DNS alternative
- Access via ENS-compatible browsers

### IPNS (IPFS Name System)

Create mutable IPNS pointers using the SDK's IPNS client. See the [IPNS guide](./ipns.md) for `af.ipns().createRecordForSite(...)` and publishing updates.

**Features:**
- Mutable pointers to IPFS content
- Update content without changing address
- Access via: `/ipns/{hash}`

## Complete Example Workflow

Here's a complete example of adding a custom domain with SSL:

```graphql
# Step 1: Create domain with TXT verification
mutation CreateDomain {
  createDomain(input: {
    hostname: "example.com"
    siteId: "site-abc123"
    verificationMethod: "TXT"
  }) {
    id
    hostname
    txtVerificationToken
  }
}

# Response:
# {
#   "id": "domain-xyz789",
#   "hostname": "example.com",
#   "txtVerificationToken": "af-site-verification=abc123def456"
# }

# Step 2: Add DNS TXT record at your registrar
# Type: TXT
# Name: @
# Value: af-site-verification=abc123def456
# TTL: 3600

# Step 3: Wait 5-60 minutes for DNS propagation
# Test with: dig example.com TXT

# Step 4: Verify domain
mutation VerifyDomain {
  verifyDomain(domainId: "domain-xyz789")
}

# Step 5: Check verification status
query CheckDomain {
  domain(id: "domain-xyz789") {
    verified
    txtVerificationStatus
  }
}

# Step 6: Provision SSL certificate
mutation ProvisionSSL {
  provisionSsl(
    domainId: "domain-xyz789"
    email: "admin@example.com"
  ) {
    sslStatus
    sslIssuedAt
    sslExpiresAt
  }
}

# Step 7: Wait 5-10 minutes for Let's Encrypt
# Your site is now live at https://example.com!

# Step 8: Set as primary domain (optional) — returns Boolean
mutation SetPrimary {
  setPrimaryDomain(siteId: "site-abc123", domainId: "domain-xyz789")
}
```

## API Reference

### Mutations

**createDomain** - Add a custom domain
- Input: `CreateDomainInput`
- Returns: `Domain`

**verifyDomain** - Verify domain ownership
- Input: `domainId: ID!`
- Returns: `Boolean`

**provisionSsl** - Request SSL certificate
- Input: `domainId: ID!`, `email: String!`
- Returns: `Domain`

**setPrimaryDomain** - Set primary domain for site
- Input: `siteId: ID!`, `domainId: ID!`
- Returns: `Boolean`

**deleteDomain** - Remove custom domain
- Input: `id: ID!`
- Returns: `Boolean`

### Queries

**domain** - Get domain by ID
- Input: `id: ID!`
- Returns: `Domain`

**Site.domains** - List all domains for a site
- Accessed via the `site(id: ID!) { domains { ... } }` query (there is no top-level `domains` root query)
- Returns: `[Domain!]!`

## Next Steps

- [Deploying Sites](./sites.md) - Deploy your site first
- [CI/CD Integration](./cicd.md) - Automate deployments
- [Best Practices](./best-practices.md) - Optimization tips
- [ENS Domains](./ens.md) - Web3 domain integration
- [IPNS](./ipns.md) - IPFS Name System
