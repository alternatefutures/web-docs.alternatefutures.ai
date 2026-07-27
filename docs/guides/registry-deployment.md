---
description: Deploy your own OpenRegistry and IPFS container registry stack on Akash Network with this step-by-step guide.
---

# Deploying the Decentralized Registry

This guide walks you through deploying your own OpenRegistry + IPFS stack on Akash Network.

## Prerequisites

Before you begin, ensure you have:

- **Akash CLI** installed (`brew install akash-provider-services`)
- **Akash wallet** with at least 5 AKT tokens
- **Domain** with DNS management access (Namecheap, Cloudflare, etc.)
- **Docker** installed locally

## Architecture Overview

You'll be deploying three services on Akash:

```
┌──────────── Akash Deployment ────────────┐
│                                           │
│  PostgreSQL (metadata)                    │
│  ├─ Port: 5432 (internal)                │
│  └─ Storage: 20GB                         │
│                                           │
│  IPFS Node (storage)                      │
│  ├─ API: 5001 (internal)                 │
│  ├─ Gateway: 8080 (public)                │
│  ├─ Swarm: 4001 (P2P)                     │
│  └─ Storage: 100GB                        │
│                                           │
│  OpenRegistry (OCI API)                   │
│  ├─ Port: 5000 (public)                   │
│  └─ Storage: 10GB                         │
│                                           │
└───────────────────────────────────────────┘
```

## Step 1: Setup Akash CLI

### Install Akash CLI

**macOS:**
```bash
brew tap akash-network/tap
brew install akash-provider-services
```

**Linux:**
```bash
curl -sSfL https://raw.githubusercontent.com/akash-network/node/master/install.sh | sh
```

### Verify Installation

```bash
akash version
# Should output: v0.x.x
```

### Configure Environment

```bash
export AKASH_NODE=https://rpc.akash.network:443
export AKASH_CHAIN_ID=akashnet-2
export AKASH_GAS=auto
export AKASH_GAS_ADJUSTMENT=1.5
export AKASH_GAS_PRICES=0.025uakt
```

Add these to your `~/.bashrc` or `~/.zshrc` to make them permanent.

## Step 2: Create Akash Wallet

### Generate New Wallet

```bash
akash keys add registry-wallet

# Save the mnemonic phrase securely!
```

### Or Import Existing Wallet

```bash
akash keys add registry-wallet --recover
# Enter your mnemonic phrase
```

### Get Your Address

```bash
export AKASH_ACCOUNT_ADDRESS=$(akash keys show registry-wallet -a)
echo $AKASH_ACCOUNT_ADDRESS
```

### Fund Your Wallet

You need at least 5 AKT tokens:

- **Buy AKT**: [Exchanges](https://akash.network/token)
- **Testnet Faucet**: [https://faucet.akash.network](https://faucet.akash.network)

### Check Balance

```bash
akash query bank balances $AKASH_ACCOUNT_ADDRESS --node $AKASH_NODE
```

## Step 3: Configure Deployment

### Download SDL File

Download the deployment configuration:

```bash
curl -O https://raw.githubusercontent.com/alternatefutures/backend/main/deploy-registry.yaml
```

### Edit Configuration

Open `deploy-registry.yaml` and update these values:

```yaml
services:
  postgres:
    env:
      # Change this password!
      - POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE

  registry:
    env:
      # Change this JWT secret (min 32 characters)
      - OPEN_REGISTRY_SIGNING_SECRET=YOUR_JWT_SECRET_MIN_32_CHARS_HERE

      # Match PostgreSQL password
      - OPEN_REGISTRY_DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

      # Your registry domain
      - OPEN_REGISTRY_DOMAIN=registry.yourdomain.com

    expose:
      - port: 5000
        as: 80
        to:
          - global: true
        accept:
          # Change to your domain
          - registry.yourdomain.com

  ipfs:
    expose:
      - port: 8080
        as: 8080
        to:
          - global: true
        accept:
          # Change to your domain
          - ipfs.yourdomain.com
```

### Generate Secure Passwords

```bash
# Generate secure password
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 48
```

## Step 4: Deploy to Akash

### Create Deployment

```bash
akash tx deployment create deploy-registry.yaml \
  --from registry-wallet \
  --node $AKASH_NODE \
  --chain-id $AKASH_CHAIN_ID \
  --fees 5000uakt
```

### Get Deployment ID

Save the DSEQ (deployment sequence) from the output:

```bash
export AKASH_DSEQ=<your-dseq-number>
```

### Wait for Bids

Providers will send bids for your deployment (usually takes 30-60 seconds):

```bash
akash query market bid list \
  --owner $AKASH_ACCOUNT_ADDRESS \
  --node $AKASH_NODE \
  --dseq $AKASH_DSEQ
```

### Accept a Bid

Choose a provider and create a lease:

```bash
export AKASH_PROVIDER=<provider-address-from-bid>

akash tx market lease create \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE \
  --chain-id $AKASH_CHAIN_ID \
  --fees 5000uakt
```

### Send Manifest

```bash
akash provider send-manifest deploy-registry.yaml \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE
```

### Get Service Endpoints

```bash
akash provider lease-status \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE
```

Note the `forwarded_ports` - these are your public IPs and ports!

## Step 5: Configure DNS

### Get Provider IP

From the lease status, note the provider's IP address.

### Add DNS Records

**Using Namecheap:**

1. Log into Namecheap
2. Go to Domain List → Manage → Advanced DNS
3. Add A Records:

```
Type: A Record
Host: registry
Value: <provider-ip>
TTL: Automatic

Type: A Record
Host: ipfs
Value: <provider-ip>
TTL: Automatic
```

**Using Cloudflare:**

```bash
# Add DNS records via CLI
curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/dns_records" \
  -H "Authorization: Bearer <api-token>" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "registry",
    "content": "<provider-ip>",
    "ttl": 1,
    "proxied": false
  }'

curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/dns_records" \
  -H "Authorization: Bearer <api-token>" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "ipfs",
    "content": "<provider-ip>",
    "ttl": 1,
    "proxied": false
  }'
```

### Wait for DNS Propagation

DNS changes can take 5-60 minutes to propagate. Check status:

```bash
dig registry.yourdomain.com
dig ipfs.yourdomain.com
```

## Step 6: Test Your Registry

### Test OCI API

```bash
curl https://registry.yourdomain.com/v2/
# Should return: {}
```

### Test IPFS Gateway

```bash
curl https://ipfs.yourdomain.com/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn
# Should return: hello worlds
```

### Push First Image

```bash
# Build a simple image
echo "FROM alpine:latest" > Dockerfile
echo "CMD echo 'Hello from decentralized registry!'" >> Dockerfile
docker build -t test-image .

# Tag for your registry
docker tag test-image registry.yourdomain.com/test-image:latest

# Push
docker push registry.yourdomain.com/test-image:latest
```

### Pull Image

```bash
docker pull registry.yourdomain.com/test-image:latest
docker run registry.yourdomain.com/test-image:latest
# Should output: Hello from decentralized registry!
```

## Step 7: Monitor Your Deployment

### View Logs

**Registry logs:**
```bash
akash provider lease-logs \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE \
  --service registry \
  --follow
```

**IPFS logs:**
```bash
akash provider lease-logs \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE \
  --service ipfs \
  --follow
```

### Check Service Status

```bash
akash provider service-status \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE
```

### IPFS Stats

Check IPFS node storage:

```bash
curl http://ipfs.yourdomain.com:5001/api/v0/repo/stat | jq
```

## Costs and Billing

### Estimated Monthly Cost

- **Compute**: ~$30-50/month
- **Storage (130GB total)**: Included in compute cost
- **Bandwidth**: Pay-as-you-go

**Total**: ~$40-70/month for production-ready registry

### Monitoring Spending

Check your deployment cost:

```bash
akash query market lease list \
  --owner $AKASH_ACCOUNT_ADDRESS \
  --node $AKASH_NODE \
  --dseq $AKASH_DSEQ
```

### Funding Your Deployment

Deposits are deducted every block. Ensure your wallet has sufficient balance.

Top up if needed:

```bash
akash tx deployment deposit 5000000uakt \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --node $AKASH_NODE
```

## Updating Your Deployment

### Update Configuration

1. Edit `deploy-registry.yaml`
2. Update the deployment:

```bash
akash tx deployment update deploy-registry.yaml \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --node $AKASH_NODE
```

3. Send updated manifest:

```bash
akash provider send-manifest deploy-registry.yaml \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE
```

## Troubleshooting

### Deployment Fails

**Check SDL validation:**
```bash
akash deployment validate deploy-registry.yaml
```

**Common issues:**
- Insufficient balance
- Invalid SDL syntax
- Port conflicts

### No Bids Received

**Possible causes:**
- Price too low
- Resource requirements too high
- No providers available

**Solution**: Increase bid price in SDL:

```yaml
pricing:
  registry:
    amount: 2000  # Increase from 1000
```

### Services Not Starting

**Check logs:**
```bash
akash provider lease-logs \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --node $AKASH_NODE \
  --follow
```

**Common issues:**
- Environment variables not set
- Database connection failures
- IPFS initialization errors

### DNS Not Resolving

**Check DNS propagation:**
```bash
dig registry.yourdomain.com +trace
```

**Verify A record:**
```bash
nslookup registry.yourdomain.com
```

**Clear DNS cache:**
```bash
# macOS
sudo dscacheutil -flushcache

# Linux
sudo systemctl restart systemd-resolved
```

## Security Best Practices

### 1. Use Strong Passwords

Generate cryptographically secure passwords:

```bash
openssl rand -base64 32
```

### 2. Enable TLS

Akash providers typically include Let's Encrypt automatically. Verify:

```bash
curl -I https://registry.yourdomain.com
# Look for: SSL certificate from Let's Encrypt
```

### 3. Regular Backups

Backup PostgreSQL database:

```bash
# Enter the postgres container
akash provider lease-shell \
  --dseq $AKASH_DSEQ \
  --from registry-wallet \
  --provider $AKASH_PROVIDER \
  --service postgres

# Inside container
pg_dump -U postgres open_registry > backup.sql
```

### 4. Monitor Access

Review registry access logs regularly:

```bash
akash provider lease-logs \
  --dseq $AKASH_DSEQ \
  --service registry | grep "POST\|GET"
```

## Next Steps

- [Use Your Registry](/guides/decentralized-registry) - Push and pull images
- [CLI Integration](/cli/commands) - Add registry commands to CLI
- **Monitoring** - Set up alerts and dashboards (guide coming soon)

## Support

Need help deploying?

- [Discord Community](https://discord.gg/alternatefutures)
- [Akash Discord](https://discord.gg/akash)
- [GitHub Issues](https://github.com/alternatefutures/backend/issues)
