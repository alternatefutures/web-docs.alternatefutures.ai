# CLI Commands Reference

Complete reference for all Alternate Futures CLI (`af`) commands.

## Command Structure

```bash
af <command> [subcommand] [options]
```

## Authentication

### `af login`

Authenticate your CLI session.

```bash
af login              # Opens browser for authentication
af login --email      # Login via email verification (no browser)
```

**Options:**

| Option | Description |
|--------|-------------|
| `-e, --email` | Login via email verification (no browser required) |
| `--auth-url <url>` | Override auth service URL (for testing) |

### `af logout`

End your active CLI session.

```bash
af logout
```

### `af signup`

Create a new Alternate Futures account using email verification.

```bash
af signup
```

---

## Projects

Manage your projects and switch between them.

### `af projects list`

Display all projects where you are a member.

```bash
af projects list
```

### `af projects create`

Create a new project.

```bash
af projects create --name "my-project"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the new project |

### `af projects switch`

Switch to a different project.

```bash
af projects switch --id prj_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <projectId>` | Project ID to switch to |

---

## Sites

Deploy and manage static sites on decentralized infrastructure.

### `af sites init`

Initialize a new Alternate Futures site in the current directory. Creates an `af.config.json` file.

```bash
af sites init
```

### `af sites deploy`

Deploy your site to decentralized storage.

```bash
af sites deploy
af sites deploy --ipfs       # Deploy to IPFS
af sites deploy --arweave    # Deploy to Arweave
```

**Options:**

| Option | Description |
|--------|-------------|
| `--ipfs` | Deploy to IPFS network |
| `--arweave` | Deploy to Arweave network |

### `af sites list`

Display all sites in your project.

```bash
af sites list
```

### `af sites deployments`

Show deployment history for a site.

```bash
af sites deployments --slug my-site
```

**Options:**

| Option | Description |
|--------|-------------|
| `--slug <siteSlug>` | Site slug to show deployments for |

### `af sites ci`

Generate CI/CD configuration files.

```bash
af sites ci --provider github    # GitHub Actions
af sites ci --provider gitlab    # GitLab CI
```

**Options:**

| Option | Description |
|--------|-------------|
| `--provider <provider>` | CI provider (github, gitlab) |

---

## Storage

Manage files on decentralized storage (IPFS + Filecoin/Arweave backup).

### `af storage add`

Upload files or directories to storage.

```bash
af storage add ./my-file.pdf
af storage add ./my-folder
```

### `af storage list`

List all files in your project's storage.

```bash
af storage list
```

### `af storage get`

Retrieve a file by name or CID.

```bash
af storage get --name my-file.pdf
af storage get --cid QmXxx...
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | File name to retrieve |
| `--cid <cid>` | Content identifier (CID) to retrieve |

### `af storage delete`

Delete a file from storage.

```bash
af storage delete --name my-file.pdf
af storage delete --cid QmXxx...
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | File name to delete |
| `--cid <cid>` | Content identifier (CID) to delete |

---

## IPFS

Direct IPFS operations for decentralized content storage.

### `af ipfs add`

Upload a file directly to IPFS.

```bash
af ipfs add ./my-file.pdf
af ipfs add ./my-folder
```

Returns the content identifier (CID) for the uploaded content.

---

## IPNS

InterPlanetary Naming System for mutable content addressing.

### `af ipns create`

Create a new IPNS record.

```bash
af ipns create --name my-website
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the IPNS record |

### `af ipns publish`

Publish an IPFS hash to an IPNS name.

```bash
af ipns publish --name my-website --hash QmXxx...
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | IPNS name to publish to |
| `--hash <hash>` | IPFS CID to publish |

### `af ipns list`

List all IPNS records in your project.

```bash
af ipns list
```

### `af ipns resolve`

Resolve an IPNS name to its current IPFS hash.

```bash
af ipns resolve k51qzi5uqu5...
```

### `af ipns delete`

Delete an IPNS record.

```bash
af ipns delete --name my-website
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | IPNS name to delete |

---

## Functions

Deploy serverless functions to decentralized infrastructure.

### `af functions create`

Create a new function.

```bash
af functions create --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the function |

### `af functions deploy`

Deploy a function.

```bash
af functions deploy --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function to deploy |

### `af functions list`

List all functions in your project.

```bash
af functions list
```

### `af functions update`

Update an existing function.

```bash
af functions update --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function to update |

### `af functions delete`

Delete a function.

```bash
af functions delete --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function to delete |

### `af functions deployments`

Show deployment history for a function.

```bash
af functions deployments --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function |

---

## Domains

Manage custom domains for your sites and gateways.

### `af domains list`

List all domains in your project.

```bash
af domains list
```

### `af domains create`

Add a custom domain to a site or gateway.

```bash
af domains create --siteSlug my-site --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--siteSlug <slug>` | Site to attach domain to |
| `--hostname <hostname>` | Domain hostname |

### `af domains detail`

Show detailed information about a domain.

```bash
af domains detail --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hostname <hostname>` | Domain hostname |

### `af domains verify`

Verify DNS configuration for a domain.

```bash
af domains verify --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hostname <hostname>` | Domain to verify |

### `af domains delete`

Remove a custom domain.

```bash
af domains delete --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hostname <hostname>` | Domain to delete |

---

## ENS

Ethereum Name Service integration for .eth domains.

### `af ens create`

Create an ENS record linking a .eth domain to your site.

```bash
af ens create --domain myapp.eth --siteSlug my-site
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain name |
| `--siteSlug <slug>` | Site to link |

### `af ens list`

List all ENS records in your project.

```bash
af ens list
```

### `af ens detail`

Show detailed information about an ENS record.

```bash
af ens detail --domain myapp.eth
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain |

### `af ens verify`

Verify ENS configuration.

```bash
af ens verify --domain myapp.eth
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain to verify |

### `af ens delete`

Remove an ENS record.

```bash
af ens delete --domain myapp.eth
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain to delete |

---

## Gateways

Manage private IPFS gateways for your content.

### `af gateways list`

List all private gateways in your project.

```bash
af gateways list
```

### `af gateways create`

Create a new private gateway.

```bash
af gateways create --name my-gateway
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the gateway |

### `af gateways detail`

Show detailed information about a gateway.

```bash
af gateways detail --id gw_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <gatewayId>` | Gateway ID |

### `af gateways delete`

Delete a private gateway.

```bash
af gateways delete --id gw_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <gatewayId>` | Gateway ID to delete |

---

## Applications

Manage SDK application Client IDs.

### `af applications list`

List all application Client IDs in your project.

```bash
af applications list
```

### `af applications create`

Generate a new Client ID for an SDK application.

```bash
af applications create --name "My App"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Application name |

### `af applications update`

Update an existing application.

```bash
af applications update --id app_abc123 --name "New Name"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <appId>` | Application ID |
| `--name <name>` | New application name |

### `af applications delete`

Delete an application Client ID.

```bash
af applications delete --id app_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <appId>` | Application ID to delete |

---

## Personal Access Tokens

Manage tokens for API and CLI authentication.

### `af pat list`

List all personal access tokens.

```bash
af pat list
```

### `af pat create`

Generate a new personal access token.

```bash
af pat create --name "CI/CD Token"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Token name |

### `af pat delete`

Revoke a personal access token.

```bash
af pat delete pat_abc123
```

---

## Billing

View billing information and usage metrics.

### `af billing customer`

View customer billing information.

```bash
af billing customer
```

### `af billing subscriptions`

List active subscriptions.

```bash
af billing subscriptions
```

### `af billing invoices`

List billing invoices.

```bash
af billing invoices
af billing invoices --limit 10
```

**Options:**

| Option | Description |
|--------|-------------|
| `--limit <number>` | Number of invoices to show |

### `af billing usage`

View current usage metrics.

```bash
af billing usage
```

### `af billing payment-methods`

List payment methods on file.

```bash
af billing payment-methods
```

---

## Global Options

Available for all commands:

| Option | Description |
|--------|-------------|
| `--debug` | Enable debug output |
| `-V, --version` | Show CLI version |
| `-h, --help` | Show help for command |

## Getting Help

```bash
# General help
af --help

# Help for a command group
af sites --help

# Help for a specific subcommand
af sites deploy --help
```

## Environment Variables

For CI/CD and automation:

| Variable | Description |
|----------|-------------|
| `AF_TOKEN` | Personal access token for authentication |
| `AF_PROJECT_ID` | Default project ID |
| `AF_BASE_URL` | Override API endpoint (for testing) |

Example:

```bash
export AF_TOKEN="your-personal-access-token"
export AF_PROJECT_ID="prj_abc123"

# Commands now use these credentials
af sites deploy
```
