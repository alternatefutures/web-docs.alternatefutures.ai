---
description: Technical deep dive into the decentralized container registry architecture built on Akash Network, OpenRegistry, and IPFS.
---

# Registry Architecture

::: warning Reference architecture
This is a technical reference for a **self-hostable** decentralized registry built from open-source components (OpenRegistry, Kubo/IPFS, PostgreSQL) on Akash. It is not a description of a running, managed Alternate Futures service. Schemas, resource profiles, environment variables, endpoints, and JWT structures below are design guidance for your own deployment — verify each value against the upstream projects and your own SDL before relying on it.
:::

Deep dive into the technical architecture of a decentralized container registry you can run yourself.

## System Overview

This registry is a **self-hostable, decentralized** container registry built on open-source components running on Akash Network with IPFS storage.

```
┌────────────────────────────────────────────────────────────┐
│              Decentralized Registry Stack                  │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │             │    │              │    │              │  │
│  │ PostgreSQL  │◄───┤ OpenRegistry │────► IPFS (Kubo) │  │
│  │             │    │              │    │              │  │
│  │  Metadata   │    │   OCI API    │    │   Storage    │  │
│  │             │    │              │    │              │  │
│  └─────────────┘    └──────────────┘    └──────────────┘  │
│        │                   │                     │          │
│        │                   │                     │          │
│        └───────────────────┴─────────────────────┘          │
│                            │                                 │
│                     Akash Network                            │
│                  (Decentralized Compute)                     │
│                                                              │
└────────────────────────────────────────────────────────────┘
                           ↕
                     DNS (Namecheap)
                           ↕
                ┌──────────────────────┐
                │  Docker Client / CLI │
                └──────────────────────┘
```

## Component Details

### 1. PostgreSQL

**Purpose**: Stores registry metadata and relationships.

**Schema**:
```sql
-- Image repositories
CREATE TABLE repositories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Image tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  repository_id INT REFERENCES repositories(id),
  name VARCHAR(255) NOT NULL,
  manifest_digest VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(repository_id, name)
);

-- Image manifests
CREATE TABLE manifests (
  digest VARCHAR(255) PRIMARY KEY,
  content_type VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blob storage (references to IPFS CIDs)
CREATE TABLE blobs (
  digest VARCHAR(255) PRIMARY KEY,
  ipfs_cid VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blob/Manifest relationships
CREATE TABLE manifest_blobs (
  manifest_digest VARCHAR(255) REFERENCES manifests(digest),
  blob_digest VARCHAR(255) REFERENCES blobs(digest),
  PRIMARY KEY (manifest_digest, blob_digest)
);
```

**Configuration**:
- **Resources**: 1 CPU, 2GB RAM, 20GB storage
- **Network**: Internal only (not exposed publicly)
- **Backup**: Automated via Akash persistent storage

### 2. OpenRegistry

**Purpose**: OCI-compliant API server handling Docker client requests.

**Technology**: Go-based HTTP server implementing [OCI Distribution Spec](https://github.com/opencontainers/distribution-spec).

**Key Endpoints**:

**Catalog API:**
```http
GET /v2/_catalog
→ Lists all repositories
```

**Tags API:**
```http
GET /v2/<name>/tags/list
→ Lists tags for a repository
```

**Manifest API:**
```http
GET /v2/<name>/manifests/<reference>
→ Returns image manifest

PUT /v2/<name>/manifests/<reference>
→ Uploads image manifest
```

**Blob API:**
```http
GET /v2/<name>/blobs/<digest>
→ Downloads blob from IPFS

POST /v2/<name>/blobs/uploads/
→ Initiates blob upload

PUT /v2/<name>/blobs/uploads/<uuid>
→ Completes blob upload to IPFS
```

**Authentication Flow**:
```
Client → GET /v2/ → 401 Unauthorized
      ← WWW-Authenticate: Bearer realm="..."

Client → POST /token (with credentials)
      ← {token: "..."}

Client → GET /v2/<name>/manifests/<tag>
Headers: Authorization: Bearer <token>
      ← 200 OK + Manifest
```

**Configuration**:
- **Resources**: 2 CPU, 4GB RAM, 10GB storage
- **Network**: Public HTTPS on port 5000
- **Environment**:
  - `OPEN_REGISTRY_DB_HOST=postgres`
  - `OPEN_REGISTRY_DFS_IPFS_API_URL=http://ipfs:5001`

### 3. IPFS Node (Kubo)

**Purpose**: Decentralized storage for container image layers (blobs).

**Technology**: [Kubo](https://github.com/ipfs/kubo) - Official IPFS implementation in Go.

**APIs Exposed**:

**Add API** (used by OpenRegistry):
```bash
curl -X POST "http://ipfs:5001/api/v0/add" \
  -F file=@layer.tar.gz
→ Returns: {"Hash": "QmXxx...", "Size": "12345"}
```

**Cat API** (retrieve content):
```bash
curl "http://ipfs:5001/api/v0/cat?arg=QmXxx..."
→ Returns: raw file content
```

**Pin API** (ensure persistence):
```bash
curl -X POST "http://ipfs:5001/api/v0/pin/add?arg=QmXxx..."
→ Pins content to prevent garbage collection
```

**Gateway** (public HTTP access):
```bash
curl "https://ipfs.alternatefutures.ai/ipfs/QmXxx..."
→ Returns: content via HTTP gateway
```

**Configuration**:
- **Resources**: 2 CPU, 4GB RAM, 100GB storage
- **Network**:
  - API (5001): Internal only
  - Gateway (8080): Public HTTPS
  - Swarm (4001): Public TCP (P2P)
- **Profile**: `server` (optimized for production)

**Storage Structure**:
```
/data/ipfs/
├── blocks/          # IPFS blocks (actual content)
│   ├── QmXxx.../
│   └── QmYyy.../
├── datastore/       # Metadata
└── config           # Node configuration
```

### 4. Akash Network

**Purpose**: Decentralized compute platform hosting all services.

**Provider Selection**:
- Providers bid on deployments
- You choose based on price, location, reputation
- Multi-provider redundancy possible

**Resource Allocation**:
```yaml
profiles:
  compute:
    postgres:      # 1 CPU, 2GB RAM, 20GB storage
    ipfs:          # 2 CPU, 4GB RAM, 100GB storage
    registry:      # 2 CPU, 4GB RAM, 10GB storage

Total: 5 CPUs, 10GB RAM, 130GB storage
Estimated cost: ~$40-70/month
```

**Persistent Storage**:
- Data persists across deployments
- Backed by provider's infrastructure
- Redundant storage recommended

## Data Flow

### Push Image Flow

```
┌──────────┐
│  Docker  │
│  Client  │
└────┬─────┘
     │ 1. docker push registry.alternatefutures.ai/app:v1
     ▼
┌──────────────┐
│ OpenRegistry │
└──────┬───────┘
       │ 2. Split into layers (blobs)
       │
       │ For each layer:
       ├─► 3. POST to IPFS /api/v0/add
       │         ▼
       │   ┌──────────┐
       │   │   IPFS   │
       │   │  (Kubo)  │
       │   └────┬─────┘
       │        │ 4. Returns CID: QmXxx...
       │        │ 5. Pin CID
       ◄────────┘
       │
       │ 6. Store mapping in PostgreSQL:
       ▼
┌──────────────┐
│  PostgreSQL  │
│              │
│  blobs:      │
│  - digest    │
│  - ipfs_cid  │
│  - size      │
└──────────────┘
```

**Example**:
```bash
# Client pushes image
docker push registry.alternatefutures.ai/app:v1

# OpenRegistry receives:
# - Config blob (JSON with metadata)
# - Layer 1: base OS
# - Layer 2: dependencies
# - Layer 3: application code
# - Manifest (references all blobs)

# For Layer 1 (100MB):
# → Upload to IPFS: POST /api/v0/add
# ← Response: QmAbc123...
# → Pin: POST /api/v0/pin/add?arg=QmAbc123...
# → Save to DB: INSERT INTO blobs VALUES (
#     'sha256:abc...', 'QmAbc123...', 104857600
#   )

# Repeat for all layers

# Store manifest referencing all layer digests
```

### Pull Image Flow

```
┌──────────┐
│  Docker  │
│  Client  │
└────┬─────┘
     │ 1. docker pull registry.alternatefutures.ai/app:v1
     ▼
┌──────────────┐
│ OpenRegistry │
└──────┬───────┘
       │ 2. Query PostgreSQL for manifest
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────┬───────┘
       │ 3. Returns: manifest with layer digests
       ▼
┌──────────────┐
│ OpenRegistry │
└──────┬───────┘
       │ 4. For each layer digest:
       │    Query PostgreSQL for IPFS CID
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────┬───────┘
       │ 5. Returns: blob.ipfs_cid = QmXxx...
       ▼
┌──────────────┐
│ OpenRegistry │
└──────┬───────┘
       │ 6. GET from IPFS /api/v0/cat?arg=QmXxx...
       ▼
┌──────────┐
│   IPFS   │
│  (Kubo)  │
└────┬─────┘
     │ 7. Returns: raw layer content
     ▼
┌──────────────┐
│ OpenRegistry │
└──────┬───────┘
       │ 8. Stream to Docker client
       ▼
┌──────────┐
│  Docker  │
│  Client  │
└──────────┘
```

## Security Architecture

### Authentication

**Token-based auth** using JWT:

```
┌─────────┐                           ┌──────────────┐
│ Client  │──1. GET /v2/──────────────►│ OpenRegistry │
│         │◄──401 + WWW-Authenticate──┤              │
│         │                            └──────────────┘
│         │
│         │──2. POST /token───────────►┌──────────────┐
│         │   (username, password)     │ Auth Service │
│         │◄──{token: "eyJhb..."}──────┤              │
│         │                            └──────────────┘
│         │
│         │──3. GET /v2/<name>/...────►┌──────────────┐
│         │   Header: Authorization    │ OpenRegistry │
│         │   Bearer eyJhb...          │              │
│         │◄──200 OK + Data───────────┤              │
└─────────┘                            └──────────────┘
```

**JWT Structure**:
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "username",
    "iss": "registry.alternatefutures.ai",
    "aud": "registry.alternatefutures.ai",
    "exp": 1709251200,
    "iat": 1709247600,
    "access": [
      {
        "type": "repository",
        "name": "myapp",
        "actions": ["pull", "push"]
      }
    ]
  }
}
```

### Network Security

**Internal Network** (service-to-service):
```
registry ──► postgres:5432  (SQL queries)
registry ──► ipfs:5001      (IPFS API)
```
Not exposed publicly.

**External Network** (public endpoints):
```
Internet ──► registry.alternatefutures.ai:443  (HTTPS)
Internet ──► ipfs.alternatefutures.ai:443      (HTTPS Gateway)
Internet ──► ipfs.alternatefutures.ai:4001     (IPFS Swarm)
```

**TLS**: Automatic via Akash provider Let's Encrypt integration.

### Data Integrity

**Content Addressing** ensures integrity:

1. Client uploads layer
2. OpenRegistry computes SHA256: `sha256:abc123...`
3. IPFS stores and returns CID: `QmXxx...` (also a hash)
4. Both hashes stored in database
5. On pull, verify SHA256 matches

**Tampering detection**: Any modification changes the hash, invalidating the image.

## Performance Optimization

### Caching Strategy

**Layer Deduplication**:
- Identical layers share the same IPFS CID
- Only stored once, referenced multiple times
- Saves storage and bandwidth

Example:
```
Image A: ubuntu:22.04 (200MB) + app1 (50MB)
Image B: ubuntu:22.04 (200MB) + app2 (60MB)

Storage:
- ubuntu:22.04 → QmUbuntu... (200MB) [shared]
- app1 → QmApp1... (50MB)
- app2 → QmApp2... (60MB)

Total: 310MB (not 510MB!)
```

### IPFS Optimization

**Pinning Strategy**:
- All blobs pinned immediately on upload
- Prevents garbage collection
- Ensures availability

**Blockstore settings**:
```json
{
  "Datastore": {
    "StorageMax": "100GB",
    "StorageGCWatermark": 90,  // GC at 90% full
    "GCPeriod": "1h"
  }
}
```

### Database Indexing

```sql
-- Fast lookups by repository name
CREATE INDEX idx_repos_name ON repositories(name);

-- Fast tag lookups
CREATE INDEX idx_tags_repo_name ON tags(repository_id, name);

-- Fast manifest lookups
CREATE INDEX idx_manifests_digest ON manifests(digest);

-- Fast blob lookups by IPFS CID
CREATE INDEX idx_blobs_ipfs_cid ON blobs(ipfs_cid);
```

## Monitoring & Observability

### Metrics to Track

**Registry Metrics**:
- Requests per second
- Push/pull latency
- Error rates
- Active connections

**IPFS Metrics**:
- Repository size
- Pin count
- Bandwidth usage
- Peer connections

**Database Metrics**:
- Query latency
- Connection pool usage
- Storage usage

### Health Checks

```bash
# Registry health
curl https://registry.alternatefutures.ai/v2/

# IPFS health
curl http://ipfs:5001/api/v0/id

# Database health
psql -c "SELECT 1"
```

### Logging

**Structured logs** in JSON format:

```json
{
  "timestamp": "2025-01-15T10:30:45Z",
  "level": "info",
  "service": "registry",
  "event": "blob_upload",
  "repository": "myapp",
  "digest": "sha256:abc...",
  "ipfs_cid": "QmXxx...",
  "size": 104857600,
  "duration_ms": 1234
}
```

## Scalability

### Horizontal Scaling

**Multiple Registry Instances**:
```yaml
deployment:
  registry:
    count: 3  # 3 registry instances
```

All instances share:
- Same PostgreSQL database
- Same IPFS node
- Load balanced via Akash

### Storage Scaling

**Increase IPFS storage**:
```yaml
ipfs:
  resources:
    storage:
      size: 500Gi  # Scale from 100Gi to 500Gi
```

### Geographic Distribution

Deploy multiple stacks in different regions:
- US: `registry-us.alternatefutures.ai`
- EU: `registry-eu.alternatefutures.ai`
- Asia: `registry-asia.alternatefutures.ai`

Use GeoDNS to route clients to nearest instance.

## Comparison with Centralized Registries

| Feature | Docker Hub | Self-Hosted Decentralized Registry |
|---------|------------|-------------------------------------|
| **Storage** | Centralized S3 | Decentralized IPFS |
| **Compute** | AWS/GCP | Akash Network |
| **Control** | Docker, Inc. | You |
| **Censorship** | Possible | Resistant |
| **Cost** | $7/user/month | ~$40-70/month total |
| **Downtime Risk** | Single point of failure | Multi-provider redundancy |
| **Privacy** | Controlled by Docker | You control all data |
| **Open Source** | Proprietary | 100% FOSS |

## Future Enhancements

### Planned Features

1. **IPFS Cluster**: Multi-node IPFS for redundancy
2. **Image Signing**: Cosign integration for verification
3. **Vulnerability Scanning**: Trivy integration
4. **Replication**: Cross-region sync
5. **Analytics**: Usage dashboards
6. **Webhook**: Notifications on push/pull events

## Technical References

- **OCI Distribution Spec**: [https://github.com/opencontainers/distribution-spec](https://github.com/opencontainers/distribution-spec)
- **OpenRegistry**: [https://github.com/containerish/OpenRegistry](https://github.com/containerish/OpenRegistry)
- **IPFS Kubo**: [https://github.com/ipfs/kubo](https://github.com/ipfs/kubo)
- **Akash Network**: [https://akash.network](https://akash.network)
- **Docker Registry HTTP API V2**: [https://docs.docker.com/registry/spec/api/](https://docs.docker.com/registry/spec/api/)

## Next Steps

- [Deploy Your Registry](/guides/registry-deployment)
- [Use the Registry](/guides/decentralized-registry)
- [Monitor & Maintain](/guides/observability)
