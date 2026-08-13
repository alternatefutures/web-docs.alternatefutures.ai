---
description: Complete reference for the Alternate Clouds CLI (acc) — authentication, projects, services, deployments, SSH, personal access tokens, templates, and billing.
---

# CLI Commands

Complete reference for the commands the Alternate Clouds CLI (`acc`) ships today. Every command below is verified against the `cloud-cli` source.

::: tip New to the CLI?
Start with the [CLI overview](./index) for installation, quick start, environment variables, and the `af.config` file. This page is the per-command reference.
:::

Get help for any command directly from your terminal:

```bash
acc --help                 # Top-level help
acc services --help        # Help for a command group
acc services deploy --help # Help for a single command
```

## Command Groups

| Command | Description |
|---------|-------------|
| [`acc login`](#acc-login) / [`acc logout`](#acc-logout) | Authenticate or end your CLI session |
| [`acc projects`](#acc-projects) | Create, list, switch, rename, and delete projects |
| [`acc services`](#acc-services) | Create, deploy, inspect, and manage services |
| [`acc deployments`](#acc-deployments) | List and filter deployments |
| [`acc ssh`](#acc-ssh) | Open an interactive shell in a running deployment |
| [`acc pat`](#acc-pat) | Manage personal access tokens |
| [`acc templates`](#acc-templates) | Browse service templates |
| [`acc billing`](#acc-billing) | View your credit balance |
| [`acc version`](#acc-version) | Print the installed CLI version |

## Authentication

### `acc login`

Log in to Alternate Clouds. By default this opens your browser to the web UI to complete authentication. Pass `--email` to authenticate with an email verification code instead — useful on headless machines with no browser.

```bash
acc login              # Browser-based login (default)
acc login --email      # Email verification code (no browser)
```

| Option | Description |
|--------|-------------|
| `-e, --email` | Log in via email verification instead of a browser |
| `--auth-url <url>` | Override the auth service URL (e.g. `http://localhost:3001`) |

> **What this maps to in code:** the command is registered in [`cli.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts). Browser login runs [`login.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/auth/login.ts); `--email` runs [`loginEmail.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/auth/loginEmail.ts).

### `acc logout`

End your CLI session and clear stored credentials.

```bash
acc logout
```

> **What this maps to in code:** registered in [`cli.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts), handled by [`logout.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/auth/logout.ts).

## Projects

Manage your projects. Running `acc projects` with no subcommand lists your projects.

### `acc projects`

```bash
acc projects           # Same as `acc projects list`
```

#### `acc projects list`

List all projects.

```bash
acc projects list
```

#### `acc projects create`

Create a new project. If `--name` is omitted, the CLI prompts for one.

```bash
acc projects create
acc projects create --name "my-project"
```

| Option | Description |
|--------|-------------|
| `--name <string>` | Project name |

#### `acc projects update`

Rename a project. Pass the project ID as a positional argument, or run without one to select interactively.

```bash
acc projects update
acc projects update prj_abc123
```

#### `acc projects switch`

Switch the active project. Subsequent commands use the selected project by default.

```bash
acc projects switch
acc projects switch prj_abc123
```

#### `acc projects delete`

Delete a project and all of its services.

```bash
acc projects delete
acc projects delete prj_abc123
```

> **What this maps to in code:** all `projects` subcommands are wired up in [`projects/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/projects/index.ts).

## Services

Services are the deploy path for Alternate Clouds. Create a service from a template, then deploy it to decentralized compute. Running `acc services` with no subcommand lists services in the current (or selected) project.

All `services` subcommands accept a `-p, --project <id-or-name>` flag to target a specific project instead of the active one.

### `acc services`

```bash
acc services                        # List services in the active project
acc services -p my-project          # List services in a specific project
```

#### `acc services list`

List all services in the project.

```bash
acc services list
```

#### `acc services create`

Create a new service from a template. Runs interactive prompts to choose the template and configure the service.

```bash
acc services create
```

#### `acc services info`

Show details for a service. Pass a service ID or select interactively.

```bash
acc services info
acc services info svc_abc123
```

#### `acc services deploy`

Deploy (or redeploy) a service.

```bash
acc services deploy
acc services deploy svc_abc123
```

#### `acc services logs`

Fetch logs for a service.

```bash
acc services logs
acc services logs svc_abc123 --tail 100
```

| Option | Description |
|--------|-------------|
| `--tail <n>` | Number of log lines to show (default: `50`) |

#### `acc services close`

Close the active deployment on a service (stops it without deleting the service).

```bash
acc services close
acc services close svc_abc123
```

#### `acc services delete`

Delete a service. If a deployment is running, it is closed first.

```bash
acc services delete
acc services delete svc_abc123
```

> **What this maps to in code:** every `services` subcommand — including the `deploy` path — is registered in [`services/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/services/index.ts); the deploy handler lives in [`services/deploy.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/services/deploy.ts).

## Deployments

List and view deployments across all projects and services. Running `acc deployments` with no subcommand lists deployments; `acc deployments list` does the same.

By default only active deployments (`ACTIVE`, `DEPLOYING`, `INITIALIZING`, `QUEUED`, `BUILDING`) are shown. Pass `--all` to include closed and old deployments.

### `acc deployments`

```bash
acc deployments                          # Active deployments only
acc deployments --all                    # Include closed/old deployments
acc deployments --project my-project     # Filter by project
acc deployments --service api            # Filter by service (name or ID)
acc deployments --status failed          # Filter by status
acc deployments --limit 100              # Cap the number of rows
```

| Option | Description |
|--------|-------------|
| `--project <name-or-id>` | Filter by project |
| `--service <name-or-id>` | Filter by service |
| `--status <status>` | Filter by status (e.g. `active`, `failed`, `closed`) |
| `--all` | Include closed and old deployments |
| `-l, --limit <n>` | Max deployments to show (default: `50`) |

#### `acc deployments list`

Alias for the above; accepts the same options.

```bash
acc deployments list --status active
```

> **What this maps to in code:** the `deployments` group and its filtering logic are in [`deployments/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/deployments/index.ts).

## SSH

### `acc ssh`

Open an interactive shell in a running deployment. The service ID is required.

```bash
acc ssh svc_abc123
acc ssh svc_abc123 --command "/bin/sh"
acc ssh svc_abc123 --service worker      # For multi-service deployments
```

| Argument / Option | Description |
|-------------------|-------------|
| `<serviceId>` | Service to connect to (required) |
| `--service <name>` | SDL service name, for multi-service deployments |
| `--command <cmd>` | Command to run (default: `/bin/bash`) |

> **What this maps to in code:** registered in [`ssh/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/ssh/index.ts).

## Personal Access Tokens

Manage personal access tokens (PATs) for CI/CD and automation. Use a PAT with the `AF_TOKEN` environment variable to authenticate non-interactively.

### `acc pat list`

List your personal access tokens.

```bash
acc pat list
```

### `acc pat create`

Create a new personal access token.

```bash
acc pat create
acc pat create --name "ci-pipeline"
```

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Name for the new token |

### `acc pat delete`

Delete a personal access token by ID.

```bash
acc pat delete <personalAccessTokenId>
```

> **What this maps to in code:** the `pat` group is defined in [`pat/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/pat/index.ts).

## Templates

Browse the service templates available for `acc services create`. Running `acc templates` with no subcommand lists all templates.

### `acc templates list`

List available templates, optionally filtered by category.

```bash
acc templates list
acc templates list --category AI_ML
```

| Option | Description |
|--------|-------------|
| `-c, --category <category>` | Filter by category: `AI_ML`, `WEB_SERVER`, `GAME_SERVER`, `DATABASE`, `DEVTOOLS`, `CUSTOM` |

### `acc templates info`

Show detailed information for a template.

```bash
acc templates info <templateId>
```

> **What this maps to in code:** the `templates` group is defined in [`templates/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/templates/index.ts).

## Billing

### `acc billing balance`

Show your current credit balance.

```bash
acc billing balance
```

::: info Only `balance` is available today
`acc billing` currently implements a single subcommand: `balance`. Additional billing commands are planned but not yet shipped.
:::

> **What this maps to in code:** the `billing` group is registered in [`billing/index.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/billing/index.ts), with the handler in [`billing/balance.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/billing/balance.ts).

## Version

### `acc version`

Print the installed CLI version. `acc --version` prints the same value.

```bash
acc version
acc --version
```

> **What this maps to in code:** the `version` command and `--version` flag are wired up in [`cli.ts`](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts).

<!-- ROADMAP — not yet shipped. Uncomment each section as the feature ships.

## Removed / re-architected commands (kept for reference)

These Fleek-legacy commands were removed from the CLI in cloud-cli#64 and are not planned as CLI commands in their original form. Current direction is noted per feature. Triage: cloud-cli#118.

### `acc signup`

STATUS: Handler exists but is not registered in cli.ts.

Create a new Alternate Futures account using email verification.

```bash
acc signup
```

## Sites

STATUS: Removed in cloud-cli#64. Static-site hosting is now via the dashboard.

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

STATUS: Removed. Object storage is now the rustfs S3 BUCKET service template (`acc services create`).

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

STATUS: Removed as a standalone command. IPFS pinning is internal to the deploy pipeline / dashboard.

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

STATUS: Removed from the CLI. Handled via the DNS / custom-domain flow (backend WIP).

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

STATUS: No longer a standalone group. Now a 'Function' kind inside `acc services create` (coming soon there).

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

STATUS: Removed. Custom domains are managed in the dashboard.

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

STATUS: Removed from the CLI. ENS backend is planned (service-cloud-api#64).

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

STATUS: Removed from the CLI. Private-gateway backend is not yet built.

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

STATUS: Removed (Fleek-legacy). Product intent under review.

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


## Observability

STATUS: No longer a separate group. Use `acc services logs`, plus SDK/API observability.

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

STATUS: Not a deployable-runtime CLI group. Deployable agents are templates via `acc services`/templates; `acc chat` provides chat orchestration.

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

STATUS: Only `acc billing balance` ships; the other billing subcommands are not implemented.

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


-->
