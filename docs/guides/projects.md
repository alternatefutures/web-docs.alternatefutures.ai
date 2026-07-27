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
acc projects switch --project-id <project-id>

# Check current project
acc projects current
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

Configure backup storage:

::: code-group

```bash [CLI]
# Enable Arweave backup
acc projects update \
  --project-id <project-id> \
  --backup-arweave true

# Enable Filecoin backup
acc projects update \
  --project-id <project-id> \
  --backup-filecoin true
```

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
    - run: acc sites deploy

deploy-production:
  env:
    AF_PROJECT_ID: ${{ secrets.PROD_PROJECT_ID }}
  steps:
    - run: acc sites deploy
```

## Team Collaboration

Projects support team collaboration (feature coming soon):

- **Owner** - Full control, billing
- **Admin** - Manage resources, invite members
- **Developer** - Deploy, configure
- **Viewer** - Read-only access

## Project Resources

View all resources in a project:

### Sites
```bash
acc sites list --project-id <project-id>
```

### Functions
```bash
acc functions list --project-id <project-id>
```

### Storage
```bash
acc storage list --project-id <project-id>
```

### Domains
```bash
acc domains list --project-id <project-id>
```

## Project Limits

Each project includes:

| Resource | Free Tier | Pro Tier |
|----------|-----------|----------|
| **Sites** | 10 | Unlimited |
| **Functions** | 5 | Unlimited |
| **Storage** | 10 GB | 100 GB+ |
| **Bandwidth** | 100 GB/mo | 1 TB/mo+ |
| **Custom Domains** | 3 | Unlimited |
| **Team Members** | 1 | 10+ |

## Billing

Each project has independent billing:

- Separate usage tracking
- Individual payment methods
- Per-project invoices
- Custom limits and budgets

Access billing:
```bash
# View project billing (coming soon)
acc billing status --project-id <project-id>
```

## Migrating Between Projects

Move resources between projects:

### Export Configuration
```bash
# Export site configuration
acc sites export --site-id <site-id> > site-config.json
```

### Import to New Project
```bash
# Switch to target project
acc projects switch --project-id <target-project-id>

# Create new site from config
acc sites create --config site-config.json
```

## Project API Access

Each project can have dedicated API keys:

```bash
# Create project-scoped API key
acc pat create \
  --name "Project API Key" \
  --project-id <project-id> \
  --permissions read,write

# Use in applications
export AF_TOKEN=<project-api-key>
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
acc sites list
acc functions deploy
acc storage upload
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
# Check current project
acc projects current

# Switch to correct project
acc projects switch --project-id <correct-id>

# Or set explicitly
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
