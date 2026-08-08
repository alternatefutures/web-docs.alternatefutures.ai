---
description: Automate Alternate Futures deployments with GitHub Actions, GitLab CI, and other CI/CD pipelines.
---

# CI/CD Integration

Automate deployments with continuous integration and delivery pipelines.

## GitHub Actions

### Basic Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Alternate Futures

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Alternate Futures
        run: npx @alternatefutures/cli sites deploy ./dist --network ipfs
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
```

### Add API Key Secret

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `AF_TOKEN`
4. Value: Your API key from [app.alternatefutures.ai/api-keys](https://app.alternatefutures.ai/api-keys)
5. Click **Add secret**

### Multi-Environment Workflow

Deploy to staging and production:

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install and build
        run: |
          npm install
          npm run build

      - name: Deploy to Staging
        if: github.ref == 'refs/heads/staging'
        run: npx @alternatefutures/cli sites deploy ./dist --network ipfs --name staging
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN_STAGING }}

      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: npx @alternatefutures/cli sites deploy ./dist --network arweave --name production
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN_PROD }}
```

## GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
image: node:20

stages:
  - build
  - deploy

cache:
  paths:
    - node_modules/

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  only:
    - main
  script:
    - npm install -g @alternatefutures/cli
    - acc sites deploy ./dist --network ipfs
  variables:
    AF_TOKEN: $AF_TOKEN
```

Add `AF_TOKEN` in GitLab project settings:
- **Settings** → **CI/CD** → **Variables**

## CircleCI

Create `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  deploy:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout

      - restore_cache:
          keys:
            - deps-{{ checksum "package-lock.json" }}

      - run:
          name: Install dependencies
          command: npm install

      - save_cache:
          key: deps-{{ checksum "package-lock.json" }}
          paths:
            - node_modules

      - run:
          name: Build
          command: npm run build

      - run:
          name: Deploy
          command: |
            npm install -g @alternatefutures/cli
            acc sites deploy ./dist --network ipfs

workflows:
  deploy:
    jobs:
      - deploy:
          filters:
            branches:
              only: main
```

Add `AF_TOKEN` in CircleCI project settings.

## Vercel Integration

Deploy from Vercel to Alternate Futures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "ignoreCommand": "echo 'Building on Vercel'"
}
```

Then add deployment hook:

```json
{
  "scripts": {
    "vercel-build": "npm run build && npm run deploy:af",
    "deploy:af": "npx @alternatefutures/cli sites deploy ./dist --network ipfs"
  }
}
```

Set `AF_TOKEN` in Vercel environment variables.

## Jenkins

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any

    environment {
        AF_TOKEN = credentials('af-token')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm install -g @alternatefutures/cli'
                sh 'acc sites deploy ./dist --network ipfs'
            }
        }
    }
}
```

Add `af-token` credential in Jenkins credentials manager.

## CLI Options

Common deployment options:

```bash
# Deploy with custom name
acc sites deploy ./dist --name "My Site" --network ipfs

# Deploy with metadata
acc sites deploy ./dist --description "Production v1.2.0"

# Deploy to specific network
acc sites deploy ./dist --network arweave  # or ipfs, filecoin

# Wait for deployment completion
acc sites deploy ./dist --wait

# Get deployment URL in JSON
acc sites deploy ./dist --json | jq -r '.url'
```

## Environment Variables

CLI reads these environment variables:

- `AF_TOKEN` - API key for authentication
- `AF_SITE_ID` - Default site ID (optional)
- `AF_NETWORK` - Default network (optional)

## Best Practices

### Security

- ✅ Use secrets/encrypted variables for API keys
- ✅ Use separate keys for staging and production
- ✅ Rotate keys regularly
- ✅ Set minimal permissions on API keys
- ❌ Never commit API keys to repository

### Performance

- ✅ Cache dependencies between runs
- ✅ Only deploy on specific branches
- ✅ Use build artifacts to pass between jobs
- ✅ Deploy to IPFS for staging (faster)
- ✅ Deploy to Arweave for production (permanent)

### Reliability

- ✅ Add status checks before deploying
- ✅ Run tests before deployment
- ✅ Use `--wait` flag for deployment confirmation
- ✅ Monitor deployment success/failure
- ✅ Set up notifications for failed deployments

## Deployment Notifications

### Slack

Send deployment notifications:

```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "🚀 Deployed to ${{ secrets.DEPLOY_URL }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Discord

```yaml
- name: Notify Discord
  if: success()
  run: |
    curl -X POST ${{ secrets.DISCORD_WEBHOOK }} \
      -H "Content-Type: application/json" \
      -d '{"content": "🚀 Deployed to production!"}'
```

## Next Steps

- [API Keys](./api-keys.md) - Generate API keys for CI/CD
- [Best Practices](./best-practices.md) - Optimization strategies
- [CLI Commands](../cli/commands.md) - Full CLI reference
