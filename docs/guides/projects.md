---
description: Organize your sites, functions, storage, and team members with Alternate Futures projects.
---

# Projects

Projects are the top-level organizational unit in Alternate Futures, containing all your sites, functions, storage, and other resources.

## What are Projects?

A project is a workspace that groups related resources:

- **Sites** - Static sites and deployments
- **Functions** - Serverless edge functions
- **Storage** - IPFS pins and files
- **Domains** - Custom domains and DNS
- **Gateways** - Private IPFS gateways
- **Team Members** - Collaborators and permissions

## Creating a Project

::: code-group

```bash [CLI]
# Create a new project
acc projects create

# You'll be prompted for:
# - Project name
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// Create a project
const project = await af.projects().create({
  name: 'My Awesome Project'
});

console.log('Project created:', project.name);
console.log('Project ID:', project.id);
```

:::

## Listing Projects

::: code-group

```bash [CLI]
# List all projects
acc projects list
```

```typescript [SDK]
// List all projects
const projects = await af.projects().list();

projects.forEach(project => {
  console.log(`${project.name} (${project.id})`);
  console.log(`Created: ${project.createdAt}`);
});
```

:::

## Switching Projects

When working with multiple projects, switch between them:

::: code-group

```bash [CLI]
# Switch active project
acc projects switch

# You'll be prompted to select which project to use

# Or specify directly
acc projects switch <project-id>
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

// The SDK works with project context from your token
// To work with a specific project, use the project ID
const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: 'specific-project-id',
  }),
});
```

:::

## Project Settings

### Basic Settings

Configure project basics:

- **Name** - Project display name
- **Avatar** - Project logo/icon
- **Description** - What the project is for

### Storage Settings

::: info What this maps to in code
- **CLI:** [projects command](https://github.com/alternatefutures/alternate-clouds-cli/blob/main/src/commands/projects/index.ts) — `list`, `create`, `update` (rename only), `switch`, `delete`.
- **SDK:** [projects client](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/projects.ts) — backup toggles via `update({ where, data: { backupStorageOnArweave, backupStorageOnFilecoin } })`.
- **API:** [Project data model](https://github.com/alternatefutures/alternate-clouds-api/blob/main/prisma/schema.prisma).
:::

Backup storage is configured through the SDK. The CLI `acc projects update` only renames a project.

::: code-group

```typescript [SDK]
// Update project settings
await af.projects().update({
  where: { id: 'project-id' },
  data: {
    name: 'Updated Name',
    backupStorageOnArweave: true,
    backupStorageOnFilecoin: true
  }
});
```

:::

### Backup Storage Options

**Arweave:**
- Permanent storage
- One-time payment
- Best for: Archives, permanent records

**Filecoin:**
- Long-term storage
- Deal-based storage
- Best for: Large datasets, backups

## Project Organization

### Recommended Structure

Organize projects by:

**1. By Application**
```
- myapp-prod (Production)
- myapp-staging (Staging)
- myapp-dev (Development)
```

**2. By Client/Customer**
```
- client-acme
- client-globex
- client-initech
```

**3. By Team/Department**
```
- marketing-websites
- engineering-tools
- product-demos
```

### Multi-Environment Setup

Create separate projects for different environments:

```bash
# Production project
acc projects create --name "MyApp Production"
export PROD_PROJECT_ID=<project-id>

# Staging project
acc projects create --name "MyApp Staging"
export STAGING_PROJECT_ID=<project-id>

# Development project
acc projects create --name "MyApp Development"
export DEV_PROJECT_ID=<project-id>
```

Use in CI/CD:
```yaml
# .github/workflows/deploy.yml
deploy-staging:
  env:
    AF_PROJECT_ID: ${{ secrets.STAGING_PROJECT_ID }}
  steps:
    - run: acc services deploy

deploy-production:
  env:
    AF_PROJECT_ID: ${{ secrets.PROD_PROJECT_ID }}
  steps:
    - run: acc services deploy
```

## Team Collaboration

Projects support team collaboration (feature coming soon):

- **Owner** - Full control, billing
- **Admin** - Manage resources, invite members
- **Developer** - Deploy, configure
- **Viewer** - Read-only access

## Project Resources

View all resources in a project:

### Services
```bash
acc services list
```

### Deployments
```bash
acc deployments list --project <project-id>
```

## Project Limits

Resource limits depend on your plan. Check your current account with `acc billing balance`. Specific per-tier limits are intentionally not listed here to avoid publishing numbers that may be out of date.

## Billing

Billing today uses a single credit balance for your account. Per-project invoices, separate payment methods, and per-project budgets are not yet available.

Access billing:
```bash
# View your credit balance
acc billing balance
```

## Migrating Between Projects

Move resources between projects:

### Move a service to another project
```bash
# Switch to the target project
acc projects switch <target-project-id>

# Recreate the service from a template, then deploy
acc services create
acc services deploy
```

## Project API Access

Each project can have dedicated API keys:

```bash
# Create a personal access token
acc pat create --name "Project API Key"

# Use in applications (scope to a project via AF_PROJECT_ID)
export AF_TOKEN=<personal-access-token>
export AF_PROJECT_ID=<project-id>
```

## Monitoring

Monitor project-wide metrics:

- **Total bandwidth** - Across all sites and functions
- **Storage usage** - IPFS, Arweave, Filecoin
- **Request count** - API calls and page views
- **Error rates** - Failed deployments or requests

## Project Deletion

Delete a project and all its resources:

::: warning Danger
Deleting a project is permanent and will delete all:
- Sites and deployments
- Functions
- Storage pins
- Domains
- Gateways
- Configuration

This action cannot be undone.
:::

```bash
# Delete project (requires confirmation)
acc projects delete --project-id <project-id>
```

Before deleting:
1. Export any important data
2. Backup configurations
3. Move resources to other projects
4. Download storage content
5. Update DNS records

## Use Cases

### Agency/Freelancer

Create a project per client:
```
- client-a-website
- client-b-webapp
- client-c-ecommerce
```

Benefits:
- Isolated billing
- Separate team access
- Clear organization
- Easy handoff

### SaaS Platform

Create projects by environment:
```
- production
- staging
- testing
- development
```

Benefits:
- Environment isolation
- Safe testing
- Production protection
- Clear promotion path

### Personal Projects

Organize by purpose:
```
- personal-blog
- portfolio-site
- side-projects
- experiments
```

Benefits:
- Keep costs separate
- Different configurations
- Independent management

## Best Practices

::: tip Best Practices
- **One project per application** - Keep related resources together
- **Separate environments** - Use different projects for prod/staging/dev
- **Descriptive names** - Make projects easy to identify
- **Regular cleanup** - Delete unused projects
- **Document structure** - Keep README of project organization
- **Set up monitoring** - Track usage and costs per project
:::

## Environment Variables

Set project context via environment variables:

```bash
# Set active project
export AF_PROJECT_ID=<project-id>

# All CLI commands use this project
acc services list
acc deployments list
```

In CI/CD:
```yaml
env:
  AF_TOKEN: ${{ secrets.AF_TOKEN }}
  AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

## Troubleshooting

### Wrong Project Active

**Problem:** Commands affecting wrong project

**Solution:**
```bash
# Switch to the correct project
acc projects switch <correct-id>

# Or set it explicitly for the session
export AF_PROJECT_ID=<correct-id>
```

### Can't Access Project

**Problem:** Permission denied for project

**Solution:**
- Verify you're a member of the project
- Check your API token has project access
- Contact project owner for invitation
- Ensure you're logged in: `acc login`

### Project Not Found

**Problem:** CLI can't find project

**Solution:**
```bash
# List all accessible projects
acc projects list

# Verify project ID is correct
# Check you have permissions
```

## Next Steps

- [Sites](./sites.md) - Deploy sites to your project
- [Functions](./functions.md) - Create edge functions
- [Storage](./storage.md) - Manage project storage
- [API Keys](./api-keys.md) - Create project API keys
- **Team Management** - Add team members and manage permissions (coming soon)
