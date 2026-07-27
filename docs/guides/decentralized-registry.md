---
description: Store and distribute Docker images on a fully decentralized container registry running on Akash Network with IPFS storage.
---

# Decentralized Container Registry

## Overview

Alternate Futures provides a **fully decentralized container registry** for storing and distributing Docker images. Unlike centralized services like Docker Hub, your container images are stored on your own infrastructure running on Akash Network with IPFS storage.

## Architecture

```
┌───────────────── Akash Network ─────────────────┐
│                                                  │
│  PostgreSQL  →  OpenRegistry  →  IPFS Node      │
│  (metadata)     (OCI API)        (storage)      │
│                                                  │
└──────────────────────────────────────────────────┘
         ↓                    ↓
registry.alternatefutures.ai  ipfs.alternatefutures.ai
```

### Components

**PostgreSQL**: Stores registry metadata (image names, tags, manifests)

**OpenRegistry**: OCI-compliant container registry providing Docker-compatible API

**IPFS Node (Kubo)**: Decentralized storage for container image layers

**Akash Network**: Decentralized compute platform hosting all services

## Why Use a Decentralized Registry?

### Complete Sovereignty
- **No Docker Hub**: Eliminate dependency on centralized registries
- **No Third Parties**: No Pinata, Filebase, or other IPFS services
- **You Control the Data**: Full ownership of your container images
- **Censorship Resistant**: Images stored on IPFS cannot be taken down

### Cost Savings
- **Traditional Stack**: $77-307/month (Docker Hub + IPFS service + cloud hosting)
- **Decentralized Stack**: $40-70/month (Akash only)
- **Savings**: 40-85% cost reduction

### Performance
- **Global Distribution**: IPFS enables P2P delivery
- **Persistent Storage**: 100GB+ storage on Akash
- **Fast Pulls**: Content-addressed retrieval
- **High Availability**: Multi-provider redundancy on Akash

### Developer Benefits
- **OCI Compatible**: Works with Docker, containerd, Kubernetes, etc.
- **Standard Workflow**: `docker push` and `docker pull` just work
- **CI/CD Ready**: Integrate with GitHub Actions, GitLab CI, etc.
- **Web3 Native**: Aligns with decentralization mission

## Quick Start

### Push Your First Image

```bash
# Tag your image with the registry domain
docker tag myapp:latest registry.alternatefutures.ai/myapp:latest

# Push to the decentralized registry
docker push registry.alternatefutures.ai/myapp:latest
```

The image layers are automatically stored on IPFS and distributed across the network!

### Pull an Image

```bash
# Pull from the decentralized registry
docker pull registry.alternatefutures.ai/myapp:latest

# Run it
docker run registry.alternatefutures.ai/myapp:latest
```

### Use in Akash Deployments

```yaml
# deploy.yaml
services:
  app:
    image: registry.alternatefutures.ai/myapp:latest
    expose:
      - port: 8080
        to:
          - global: true
```

## How It Works

### 1. Image Push Flow

```
Developer → Docker CLI → OpenRegistry → IPFS Node
                              ↓
                         Stores layers
                              ↓
                         Returns CID
                              ↓
                    PostgreSQL (metadata)
```

When you push an image:
1. Docker client sends image layers to OpenRegistry
2. OpenRegistry splits image into layers
3. Each layer is stored on IPFS node
4. IPFS returns content identifier (CID) for each layer
5. OpenRegistry stores mapping in PostgreSQL
6. Image is pinned to ensure persistence

### 2. Image Pull Flow

```
User → Docker CLI → OpenRegistry → IPFS Node
                         ↓
                  Fetches layers
                         ↓
                   Returns image
```

When you pull an image:
1. Docker client requests image from OpenRegistry
2. OpenRegistry looks up layer CIDs in PostgreSQL
3. Fetches layers from IPFS node
4. Returns layers to Docker client
5. Docker assembles the image

### 3. IPFS Storage

All container layers are stored on IPFS with these benefits:

- **Content Addressing**: Layers are identified by their hash (CID)
- **Deduplication**: Identical layers are stored once
- **Distributed**: Layers can be fetched from multiple peers
- **Immutable**: Content cannot be tampered with
- **Verifiable**: CID proves authenticity

## Storage Management

### IPFS Node Details

- **Storage**: 100GB persistent volume on Akash
- **API**: Port 5001 (internal only)
- **Gateway**: Port 8080 (public at `ipfs.alternatefutures.ai`)
- **Swarm**: Port 4001 (P2P connections)

### Viewing IPFS Content

Access any layer directly via IPFS gateway:

```
https://ipfs.alternatefutures.ai/ipfs/<CID>
```

### Storage Limits

- **Per Image**: No limit (automatically managed)
- **Total Storage**: 100GB initially (expandable)
- **Garbage Collection**: Automatic cleanup of unused layers

## CLI Commands

### List Images

```bash
acc registry list
```

Shows all your container images with:
- Repository name
- Tags
- Size
- IPFS CIDs
- Created date

### Image Details

```bash
acc registry info myapp:latest
```

Displays:
- Manifest
- Layer CIDs
- Total size
- Build date
- Digest

### Push Image

```bash
acc registry push myapp:latest
```

Tags and pushes to `registry.alternatefutures.ai/myapp:latest`

### Pull Image

```bash
acc registry pull myapp:latest
```

Pulls from decentralized registry

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build image
        run: docker build -t myapp .

      - name: Login to registry
        run: docker login registry.alternatefutures.ai
        env:
          REGISTRY_USERNAME: ${{ secrets.REGISTRY_USER }}
          REGISTRY_PASSWORD: ${{ secrets.REGISTRY_TOKEN }}

      - name: Push to decentralized registry
        run: |
          docker tag myapp registry.alternatefutures.ai/myapp:latest
          docker push registry.alternatefutures.ai/myapp:latest
```

### GitLab CI

```yaml
build:
  stage: build
  script:
    - docker build -t myapp .
    - docker login registry.alternatefutures.ai
    - docker tag myapp registry.alternatefutures.ai/myapp:latest
    - docker push registry.alternatefutures.ai/myapp:latest
```

## Best Practices

### Image Naming

Use semantic naming:
```
registry.alternatefutures.ai/<project>/<app>:<tag>
```

Examples:
- `registry.alternatefutures.ai/myorg/api:v1.0.0`
- `registry.alternatefutures.ai/myorg/frontend:latest`
- `registry.alternatefutures.ai/myorg/worker:staging`

### Tagging Strategy

Use multiple tags:
```bash
# Version tag
docker tag myapp registry.alternatefutures.ai/myapp:v1.2.3

# Environment tag
docker tag myapp registry.alternatefutures.ai/myapp:production

# Latest tag
docker tag myapp registry.alternatefutures.ai/myapp:latest

# Push all
docker push registry.alternatefutures.ai/myapp --all-tags
```

### Image Optimization

Reduce storage costs:

**Multi-stage builds:**
```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

**Use Alpine images:**
```dockerfile
FROM node:18-alpine  # ~50MB instead of ~1GB
```

**Clean up in single layer:**
```dockerfile
RUN apt-get update && \
    apt-get install -y packages && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

## Security

### Authentication

Token-based authentication is enabled:

```bash
# Login
docker login registry.alternatefutures.ai
Username: your-username
Password: your-token
```

### Access Control

Images are private by default. Access requires:
- Valid authentication token
- Proper permissions

### Image Scanning

Scan images for vulnerabilities before pushing:

```bash
# Using Docker Scout
docker scout cve myapp:latest

# Using Trivy
trivy image myapp:latest
```

## Monitoring

### Registry Health

Check registry status:
```bash
curl https://registry.alternatefutures.ai/v2/
# Returns: {}
```

### IPFS Health

Check IPFS node:
```bash
curl https://ipfs.alternatefutures.ai/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn
```

### Storage Usage

View IPFS storage stats via API:
```bash
curl http://ipfs.alternatefutures.ai:5001/api/v0/repo/stat
```

## Troubleshooting

### Push Fails

**Symptom**: `denied: requested access to the resource is denied`

**Solution**: Login first
```bash
docker login registry.alternatefutures.ai
```

### Slow Pulls

**Symptom**: Image pull takes a long time

**Possible Causes**:
- Large image size
- IPFS node syncing
- Network latency

**Solutions**:
- Optimize image size (use Alpine, multi-stage builds)
- Pre-pull common base images
- Use layer caching

### Image Not Found

**Symptom**: `manifest unknown`

**Solution**: Verify image name and tag
```bash
acc registry list  # Check available images
```

## Next Steps

- [Deploy Your Own Registry](/guides/registry-deployment) - Self-host the entire stack
- [Container Registry API](/guides/registry-api) - Integrate with your applications
- [Storage Management](/guides/storage) - Learn about IPFS storage

## Support

Need help?
- [Discord Community](https://discord.gg/alternatefutures)
- [GitHub Issues](https://github.com/alternatefutures/registry/issues)
- [Email Support](mailto:support@alternatefutures.ai)
