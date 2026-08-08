---
description: Complete reference for all Alternate Futures CLI (af) commands including sites, storage, domains, functions, agents, and more.
---

# CLI Commands Reference

Complete reference for all Alternate Futures CLI (`acc`) commands.

## Command Structure

```bash
acc <command> [subcommand] [options]
```

## Authentication

### `acc login`

Authenticate your CLI session.

```bash
acc login              # Opens browser for authentication
acc login --email      # Login via email verification (no browser)
```

**Options:**

| Option | Description |
|--------|-------------|
| `-e, --email` | Login via email verification (no browser required) |
| `--auth-url <url>` | Override auth service URL (for testing) |

### `acc logout`

End your active CLI session.

```bash
acc logout
```

### `acc signup`

Create a new Alternate Futures account using email verification.

```bash
acc signup
```

---

## Projects

Manage your projects and switch between them.

### `acc projects list`

Display all projects where you are a member.

```bash
acc projects list
```

### `acc projects create`

Create a new project.

```bash
acc projects create --name "my-project"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the new project |

### `acc projects switch`

Switch to a different project.

```bash
acc projects switch --id prj_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <projectId>` | Project ID to switch to |

---

## Sites

Deploy and manage static sites on decentralized infrastructure.

### `acc sites init`

Initialize a new Alternate Futures site in the current directory. Creates an `af.config.json` file.

```bash
acc sites init
```

### `acc sites deploy`

Deploy your site to decentralized storage.

```bash
acc sites deploy
acc sites deploy --ipfs       # Deploy to IPFS
acc sites deploy --arweave    # Deploy to Arweave
acc sites deploy --filecoin   # Deploy to Filecoin
```

**Options:**

| Option | Description |
|--------|-------------|
| `--ipfs` | Deploy to IPFS network |
| `--arweave` | Deploy to Arweave network |
| `--filecoin` | Deploy to Filecoin network |

### `acc sites list`

Display all sites in your project.

```bash
acc sites list
```

### `acc sites deployments`

Show deployment history for a site.

```bash
acc sites deployments --slug my-site
```

**Options:**

| Option | Description |
|--------|-------------|
| `--slug <siteSlug>` | Site slug to show deployments for |

### `acc sites ci`

Generate CI/CD configuration files.

```bash
acc sites ci --provider github    # GitHub Actions
acc sites ci --provider gitlab    # GitLab CI
```

**Options:**

| Option | Description |
|--------|-------------|
| `--provider <provider>` | CI provider (github, gitlab) |

---

## Storage

Manage files on decentralized storage (IPFS + Filecoin/Arweave backup).

### `acc storage add`

Upload files or directories to storage.

```bash
acc storage add ./my-file.pdf
acc storage add ./my-folder
```

### `acc storage list`

List all files in your project's storage.

```bash
acc storage list
```

### `acc storage get`

Retrieve a file by name or CID.

```bash
acc storage get --name my-file.pdf
acc storage get --cid QmXxx...
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | File name to retrieve |
| `--cid <cid>` | Content identifier (CID) to retrieve |

### `acc storage delete`

Delete a file from storage.

```bash
acc storage delete --name my-file.pdf
acc storage delete --cid QmXxx...
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | File name to delete |
| `--cid <cid>` | Content identifier (CID) to delete |

---

## IPFS

Direct IPFS operations for decentralized content storage.

### `acc ipfs add`

Upload a file directly to IPFS.

```bash
acc ipfs add ./my-file.pdf
acc ipfs add ./my-folder
```

Returns the content identifier (CID) for the uploaded content.

---

## IPNS

InterPlanetary Naming System for mutable content addressing.

### `acc ipns create`

Create a new IPNS record.

```bash
acc ipns create --name my-website
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the IPNS record |

### `acc ipns publish`

Publish an IPFS hash to an IPNS name.

```bash
acc ipns publish --name my-website --hash QmXxx...
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | IPNS name to publish to |
| `--hash <hash>` | IPFS CID to publish |

### `acc ipns list`

List all IPNS records in your project.

```bash
acc ipns list
```

### `acc ipns resolve`

Resolve an IPNS name to its current IPFS hash.

```bash
acc ipns resolve k51qzi5uqu5...
```

### `acc ipns delete`

Delete an IPNS record.

```bash
acc ipns delete --name my-website
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | IPNS name to delete |

---

## Functions

Deploy serverless functions to decentralized infrastructure.

### `acc functions create`

Create a new function.

```bash
acc functions create --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the function |

### `acc functions deploy`

Deploy a function.

```bash
acc functions deploy --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function to deploy |

### `acc functions list`

List all functions in your project.

```bash
acc functions list
```

### `acc functions update`

Update an existing function.

```bash
acc functions update --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function to update |

### `acc functions delete`

Delete a function.

```bash
acc functions delete --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function to delete |

### `acc functions deployments`

Show deployment history for a function.

```bash
acc functions deployments --name my-function
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name of function |

---

## Domains

Manage custom domains for your sites and gateways.

### `acc domains list`

List all domains in your project.

```bash
acc domains list
```

### `acc domains create`

Add a custom domain to a site or gateway.

```bash
acc domains create --siteSlug my-site --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--siteSlug <slug>` | Site to attach domain to |
| `--hostname <hostname>` | Domain hostname |

### `acc domains detail`

Show detailed information about a domain.

```bash
acc domains detail --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hostname <hostname>` | Domain hostname |

### `acc domains verify`

Verify DNS configuration for a domain.

```bash
acc domains verify --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hostname <hostname>` | Domain to verify |

### `acc domains delete`

Remove a custom domain.

```bash
acc domains delete --hostname www.example.com
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hostname <hostname>` | Domain to delete |

---

## ENS

Ethereum Name Service integration for .eth domains.

### `acc ens create`

Create an ENS record linking a .eth domain to your site.

```bash
acc ens create --domain myapp.eth --siteSlug my-site
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain name |
| `--siteSlug <slug>` | Site to link |

### `acc ens list`

List all ENS records in your project.

```bash
acc ens list
```

### `acc ens detail`

Show detailed information about an ENS record.

```bash
acc ens detail --domain myapp.eth
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain |

### `acc ens verify`

Verify ENS configuration.

```bash
acc ens verify --domain myapp.eth
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain to verify |

### `acc ens delete`

Remove an ENS record.

```bash
acc ens delete --domain myapp.eth
```

**Options:**

| Option | Description |
|--------|-------------|
| `--domain <domain>` | ENS domain to delete |

---

## Gateways

Manage private IPFS gateways for your content.

### `acc gateways list`

List all private gateways in your project.

```bash
acc gateways list
```

### `acc gateways create`

Create a new private gateway.

```bash
acc gateways create --name my-gateway
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the gateway |

### `acc gateways detail`

Show detailed information about a gateway.

```bash
acc gateways detail --id gw_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <gatewayId>` | Gateway ID |

### `acc gateways delete`

Delete a private gateway.

```bash
acc gateways delete --id gw_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <gatewayId>` | Gateway ID to delete |

---

## Applications

Manage SDK application Client IDs.

### `acc applications list`

List all application Client IDs in your project.

```bash
acc applications list
```

### `acc applications create`

Generate a new Client ID for an SDK application.

```bash
acc applications create --name "My App"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Application name |

### `acc applications update`

Update an existing application.

```bash
acc applications update --id app_abc123 --name "New Name"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <appId>` | Application ID |
| `--name <name>` | New application name |

### `acc applications delete`

Delete an application Client ID.

```bash
acc applications delete --id app_abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <appId>` | Application ID to delete |

---

## Personal Access Tokens

Manage tokens for API and CLI authentication.

### `acc pat list`

List all personal access tokens.

```bash
acc pat list
```

### `acc pat create`

Generate a new personal access token.

```bash
acc pat create --name "CI/CD Token"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Token name |

### `acc pat delete`

Revoke a personal access token.

```bash
acc pat delete pat_abc123
```

---

## Observability

Query and manage APM observability data (traces, logs, metrics). Use `acc observability` or the short alias `acc obs`.

### `acc observability traces`

List recent traces with optional filtering.

```bash
# List recent traces
acc observability traces

# Filter by service name
acc observability traces --service api-gateway

# Filter by status (OK, ERROR, UNSET)
acc observability traces --status ERROR

# Filter by minimum duration (slow requests only)
acc observability traces --min-duration 500

# Look back more hours
acc observability traces --hours 24

# Limit results
acc observability traces --limit 100

# Combine filters
acc obs traces --service checkout --status ERROR --hours 4
```

**Options:**

| Option | Description |
|--------|-------------|
| `--service <name>` | Filter by service name |
| `--status <code>` | Filter by status (OK, ERROR, UNSET) |
| `--min-duration <ms>` | Minimum duration in milliseconds |
| `--hours <number>` | Look back N hours (default: 1) |
| `--limit <number>` | Maximum traces to return (default: 20) |

### `acc observability trace <traceId>`

Get detailed information about a specific trace, including all spans.

```bash
acc observability trace abc123def456789...

# Short alias
acc obs trace abc123def456789...
```

**Output includes:**
- Trace metadata (ID, service, duration, span count)
- List of all spans with timing and status
- Span relationships (parent/child)

### `acc observability logs`

Query logs with filtering options.

```bash
# Recent logs
acc observability logs

# Filter by service
acc observability logs --service database-worker

# Filter by severity level
acc observability logs --severity ERROR
acc observability logs --severity WARN

# Search in log body
acc observability logs --search "connection refused"

# Combine filters
acc obs logs --service checkout-service --severity ERROR --search payment --hours 12

# Adjust time range and limit
acc obs logs --hours 24 --limit 200
```

**Options:**

| Option | Description |
|--------|-------------|
| `--service <name>` | Filter by service name |
| `--severity <level>` | Filter by severity (DEBUG, INFO, WARN, ERROR) |
| `--search <text>` | Search text in log body |
| `--hours <number>` | Look back N hours (default: 1) |
| `--limit <number>` | Maximum logs to return (default: 50) |

### `acc observability services`

List all services with performance statistics.

```bash
# Get service statistics for last 24 hours
acc observability services

# Look at a longer period
acc observability services --hours 168  # 7 days

# Short alias
acc obs services --hours 48
```

**Options:**

| Option | Description |
|--------|-------------|
| `--hours <number>` | Look back N hours (default: 24) |

**Output includes:**
- Service name
- Trace and span counts
- Error count and error rate
- Latency percentiles (avg, p50, p95, p99)

### `acc observability usage`

Show telemetry usage and estimated cost for billing period.

```bash
# Usage for last 30 days
acc observability usage

# Custom period
acc observability usage --days 7
acc obs usage --days 90
```

**Options:**

| Option | Description |
|--------|-------------|
| `--days <number>` | Look back N days (default: 30) |

**Output includes:**
- Spans, metrics, and logs ingested
- Total data volume
- Estimated cost ($0.35/GB)

### `acc observability settings`

View current observability settings for the project.

```bash
acc observability settings
acc obs settings
```

**Output includes:**
- Enabled telemetry types (traces, metrics, logs)
- Sampling rate
- Retention periods
- Rate limits

### `acc observability settings:update`

Update observability settings for the project.

```bash
# Enable/disable telemetry types
acc observability settings:update --traces true
acc observability settings:update --metrics false
acc observability settings:update --logs true

# Adjust sampling rate (0.0 to 1.0)
acc observability settings:update --sample-rate 0.5

# Change retention periods
acc observability settings:update --trace-retention 14
acc observability settings:update --log-retention 30

# Multiple updates at once
acc obs settings:update --sample-rate 0.1 --trace-retention 7 --log-retention 7
```

**Options:**

| Option | Description |
|--------|-------------|
| `--traces <boolean>` | Enable or disable trace collection |
| `--metrics <boolean>` | Enable or disable metrics collection |
| `--logs <boolean>` | Enable or disable log collection |
| `--sample-rate <rate>` | Sampling rate from 0.0 to 1.0 |
| `--trace-retention <days>` | Trace retention in days |
| `--log-retention <days>` | Log retention in days |

---

## Agents

Deploy and manage AI agents on decentralized infrastructure. Supported agent types include Eliza (conversational AI), ComfyUI (image generation), and custom agents.

### `acc agents create`

Create a new AI agent.

```bash
acc agents create --name "My Agent" --type eliza --character ./character.json
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Name for the agent |
| `--type <type>` | Agent type: `eliza`, `comfyui`, or `custom` |
| `--character <path>` | Path to character file (Eliza agents) |
| `--env <KEY=VALUE>` | Set environment variable (can be repeated) |

### `acc agents list`

List all agents in your project.

```bash
acc agents list
```

### `acc agents status`

Get the current status of an agent.

```bash
acc agents status <agent-id>
```

### `acc agents start`

Start a stopped agent.

```bash
acc agents start <agent-id>
```

### `acc agents stop`

Stop a running agent.

```bash
acc agents stop <agent-id>
```

### `acc agents update`

Update an agent's configuration or environment variables.

```bash
acc agents update <agent-id> --env TEMPERATURE=0.8
acc agents update <agent-id> --name "New Name"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Update agent name |
| `--env <KEY=VALUE>` | Update environment variable (can be repeated) |

### `acc agents logs`

View logs for a running agent.

```bash
acc agents logs <agent-id>
acc agents logs <agent-id> --follow
acc agents logs <agent-id> --tail 100
```

**Options:**

| Option | Description |
|--------|-------------|
| `--follow` | Stream logs in real time |
| `--tail <number>` | Number of recent log lines to show |

### `acc agents delete`

Delete an agent permanently.

```bash
acc agents delete <agent-id>
```

---

## Billing

View billing information and usage metrics.

### `acc billing customer`

View customer billing information.

```bash
acc billing customer
```

### `acc billing subscriptions`

List active subscriptions.

```bash
acc billing subscriptions
```

### `acc billing invoices`

List billing invoices.

```bash
acc billing invoices
acc billing invoices --limit 10
```

**Options:**

| Option | Description |
|--------|-------------|
| `--limit <number>` | Number of invoices to show |

### `acc billing usage`

View current usage metrics.

```bash
acc billing usage
```

### `acc billing payment-methods`

List payment methods on file.

```bash
acc billing payment-methods
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
acc --help

# Help for a command group
acc sites --help

# Help for a specific subcommand
acc sites deploy --help
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
acc sites deploy
```
