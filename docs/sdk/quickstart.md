# Quick Reference

## Installation

```bash
npm install @alternatefutures/sdk
```

## Basic Usage

```typescript
import { AlternateFutures } from '@alternatefutures/sdk';

const af = new AlternateFutures({ apiKey: process.env.AF_API_KEY });

// Use the SDK
const agents = await af.agents.list();
```

For complete API documentation, see the [API Reference](./api.md).
