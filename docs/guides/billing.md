---
description: Track usage, manage costs, credits, and payment methods for your Alternate Futures deployments. Supports crypto and fiat payments.
---

# Billing & Usage

::: warning Web App Coming Soon
The billing dashboard is currently in development. Use the CLI commands below to manage billing.
:::

Track usage, costs, and manage payment methods via the web dashboard or CLI.

## Billing Dashboard

View your billing information at [app.alternatefutures.ai/billing](https://app.alternatefutures.ai/billing):

- **Current Usage** - Real-time usage metrics
- **Monthly Spend** - Current billing period costs
- **Payment Methods** - Manage payment options
- **Transaction History** - Past charges and payments
- **Invoices** - Download past invoices

## CLI Commands

Manage billing directly from the command line:

### View Customer Information

```bash
acc billing customer
```

View your customer details including email, Stripe ID, and account status.

### List Invoices

```bash
acc billing invoices
```

View all invoices with their status, amounts, and payment details. Invoices include:
- Invoice number and status
- Amount due and paid
- Period covered
- PDF download link

### View Subscriptions

```bash
acc billing subscriptions
```

See your active subscriptions including:
- Plan type (FREE, STARTER, PRO, ENTERPRISE)
- Number of seats
- Pricing details
- Current period dates
- Cancellation status

### Check Usage

```bash
acc billing usage
```

View current billing cycle usage:
- **Storage** - GB stored and costs
- **Bandwidth** - Data transfer and costs
- **Compute** - Processing time and costs
- **Requests** - API calls and costs
- **Total** - Current period total

### Manage Payment Methods

```bash
acc billing payment-methods
```

List all payment methods on file including:
- Credit/debit cards (last 4 digits, expiration)
- Cryptocurrency wallets
- Default payment method

## Usage Tracking

### Storage Usage

Track storage across networks:

- **IPFS** - Pinned data ($/GB/month)
- **Filecoin** - Storage deals ($/GB/month)
- **Arweave** - Permanent storage (one-time $/GB)

### Bandwidth Usage

Monitor data transfer:

- **Egress** - Data delivered to users
- **Ingress** - Data uploaded to platform
- **Limits** - Current tier limits

### Compute Usage

Track agent and function execution:

- **Agent Runtime** - Active agent hours
- **Function Invocations** - Serverless function calls
- **GPU Hours** - ComfyUI processing time

## Pricing

### Storage Costs

<!-- TODO: Confirm IPFS pricing with product/finance. Sites guide, quickstart, and glossary all list ~$0.15/GB/month. Update whichever is incorrect. -->

| Network | Type | Price |
|---------|------|-------|
| IPFS | Per GB/month | ~$0.15 |
| Filecoin | Per GB/month | ~$0.03 |
| Arweave | One-time per GB | ~$6.00 |

### Bandwidth Costs

| Tier | Included | Overage |
|------|----------|---------|
| Free | 100 GB | $0.10/GB |
| Pro | 1 TB | $0.08/GB |
| Enterprise | Custom | Custom |

### Compute Costs

| Service | Price |
|---------|-------|
| Agent Runtime | $0.05/hour |
| Function Invocations | $0.20/million |
| GPU Processing | $0.50/hour |

## Payment Methods

### Cryptocurrency

Pay with crypto (preferred):

- **AR** (Arweave) - Native token
- **FIL** (Filecoin) - Storage token
- **ETH** (Ethereum) - Universal payment
- **SOL** (Solana) - Fast payments

**Benefits:**
- Lower fees (no credit card processing)
- Instant settlement
- DePIN-native experience

### Credit/Debit Cards

Pay with traditional cards (via Stripe):

- Visa, Mastercard, Amex, Discover
- 3% processing fee
- Monthly billing
- Auto-pay available

### Add Payment Method

1. Go to **Billing** → **Payment Methods**
2. Click **Add Payment Method**
3. Choose cryptocurrency or card
4. Complete the setup flow
5. Set as default (optional)

## Billing Cycle

- **Billing Period**: Monthly (1st to last day of month)
- **Invoice Date**: 1st of each month
- **Payment Due**: 7 days after invoice
- **Grace Period**: 3 days after due date

## Transaction History

View all transactions:

- **Date** - Transaction timestamp
- **Description** - What was charged
- **Amount** - Charge amount
- **Payment Method** - How paid
- **Status** - Paid, pending, failed

## Invoices

Download invoices for:
- Accounting and expense tracking
- Tax purposes
- Reimbursement

Invoices include:
- Itemized usage breakdown
- Tax information
- Payment details

## Usage Alerts

Set up alerts to avoid surprises:

1. Go to **Billing** → **Usage Alerts**
2. Configure thresholds:
   - Storage usage
   - Bandwidth usage
   - Monthly spend
3. Choose notification method (email, SMS)
4. Save settings

## Cost Optimization Tips

### Storage

- **Use Filecoin** for archival (cheaper than IPFS)
- **Use Arweave** for permanent content (no recurring cost)
- **Unpin unused IPFS content** to reduce costs
- **Compress files** before uploading

### Bandwidth

- **Enable caching** on CDN gateways
- **Optimize images** to reduce size
- **Use lazy loading** for assets

### Compute

- **Stop idle agents** when not needed
- **Optimize agent code** for efficiency
- **Use smaller models** when appropriate
- **Batch function invocations**

## Next Steps

- [Storage Management](./storage.md) - Optimize storage usage
- [Best Practices](./best-practices.md) - Cost optimization strategies
