# Observability & APM

Monitor your applications with distributed tracing, metrics, and logging. The Alternate Futures Observability platform provides full APM (Application Performance Monitoring) capabilities for your deployed services.

## Overview

The observability platform enables you to:

- **Traces** - Track requests as they flow through your distributed systems
- **Metrics** - Collect and query performance metrics
- **Logs** - Centralized logging with search capabilities
- **Service Maps** - Visualize dependencies between services
- **Usage Analytics** - Monitor ingestion and costs

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your Applications                            │
│  (AF Functions, Node.js, Python, Go, etc.)                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │ OTLP (OpenTelemetry Protocol)
                          │ + X-AF-Project-ID header
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OTEL Collector                                │
│  - Multi-tenant routing                                         │
│  - Sampling & filtering                                         │
│  - Data transformation                                          │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ClickHouse Storage                            │
│  - Traces, Metrics, Logs                                        │
│  - Per-project partitioning                                     │
│  - Configurable retention                                       │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Query via SDK, CLI, or GraphQL API                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install the SDK with OpenTelemetry

```bash
npm install @alternatefutures/sdk \
  @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/exporter-logs-otlp-http
```

### 2. Initialize Instrumentation

Create an `instrumentation.ts` file that runs before your application:

```typescript
// instrumentation.ts
import { initInstrumentation } from '@alternatefutures/sdk/instrumentation';

const sdk = await initInstrumentation({
  projectId: 'your-project-id',
  projectSlug: 'your-project-slug',
  serviceName: 'my-api-service',
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await sdk.shutdown();
  process.exit(0);
});
```

### 3. Run Your Application

```bash
# Node.js 18+
node --import ./instrumentation.ts ./app.ts

# Or with ts-node
node -r ts-node/register --import ./instrumentation.ts ./app.ts
```

That's it! Your application is now sending traces, metrics, and logs to the Alternate Futures platform.

---

## Instrumentation Setup

### Node.js Auto-Instrumentation

The SDK provides automatic instrumentation for common Node.js libraries:

```typescript
import { initInstrumentation } from '@alternatefutures/sdk/instrumentation';

const sdk = await initInstrumentation({
  // Required
  projectId: process.env.AF_PROJECT_ID!,
  projectSlug: process.env.AF_PROJECT_SLUG!,
  serviceName: 'api-gateway',

  // Optional
  serviceVersion: '1.0.0',
  environment: 'production',

  // OTEL endpoint (defaults to Alternate Futures collector)
  otlpEndpoint: 'https://otel.alternatefutures.ai',

  // Custom resource attributes
  resourceAttributes: {
    'deployment.region': 'us-east-1',
    'team.name': 'platform',
  },

  // Configure auto-instrumentations
  instrumentationConfig: {
    '@opentelemetry/instrumentation-http': {
      ignoreIncomingPaths: ['/health', '/ready'],
    },
  },
});
```

**Automatically instrumented libraries:**

- HTTP/HTTPS requests (incoming and outgoing)
- Express, Fastify, Koa, Hapi
- PostgreSQL, MySQL, MongoDB, Redis
- gRPC
- AWS SDK
- GraphQL
- And many more...

### Custom Spans

Add custom spans to trace specific operations:

```typescript
import { withSpan } from '@alternatefutures/sdk/instrumentation';

// Wrap a function with automatic span creation
const processOrder = withSpan(
  async (orderId: string) => {
    // Your business logic here
    const order = await fetchOrder(orderId);
    await validateOrder(order);
    await chargePayment(order);
    return order;
  },
  'processOrder',
  { 'order.type': 'standard' }
);

// Use it normally
const result = await processOrder('order-123');
```

### Manual Spans

For more control, create spans manually:

```typescript
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service');

async function complexOperation() {
  return tracer.startActiveSpan('complexOperation', async (span) => {
    try {
      // Add attributes
      span.setAttribute('user.id', userId);
      span.setAttribute('operation.type', 'batch');

      // Add events
      span.addEvent('Starting batch processing', {
        'batch.size': items.length,
      });

      const result = await processBatch(items);

      span.addEvent('Batch complete', {
        'processed.count': result.count,
      });

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Logging Integration

Send structured logs to the observability platform:

```typescript
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

const logger = logs.getLogger('my-service');

// Log with severity levels
logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: 'INFO',
  body: 'User logged in successfully',
  attributes: {
    'user.id': '12345',
    'user.email': 'user@example.com',
    'login.method': 'oauth',
  },
});

// Error logging with exception
logger.emit({
  severityNumber: SeverityNumber.ERROR,
  severityText: 'ERROR',
  body: 'Failed to process payment',
  attributes: {
    'error.type': 'PaymentError',
    'error.message': 'Card declined',
    'order.id': 'order-456',
  },
});
```

---

## Querying Data

### Using the SDK

::: code-group

```typescript [Query Traces]
import { AlternateFuturesSdk } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  personalAccessToken: process.env.AF_TOKEN,
});

// Query traces from the last hour
const traces = await af.observability().queryTraces({
  projectId: 'prj_abc123',
  startTime: new Date(Date.now() - 60 * 60 * 1000),
  endTime: new Date(),
  serviceName: 'api-gateway',  // optional filter
  minDurationMs: 100,          // optional: only slow traces
  limit: 50,
});

// Display results
traces.forEach(trace => {
  console.log(`Trace: ${trace.traceId}`);
  console.log(`  Service: ${trace.serviceName}`);
  console.log(`  Duration: ${trace.durationMs}ms`);
  console.log(`  Spans: ${trace.spanCount}`);
  console.log(`  Error: ${trace.hasError ? 'Yes' : 'No'}`);
});
```

```typescript [Get Trace Details]
// Get full trace with all spans
const trace = await af.observability().getTrace(
  'prj_abc123',
  'abc123def456...'
);

console.log(`Trace ID: ${trace.traceId}`);
console.log(`Total Duration: ${trace.durationMs}ms`);
console.log(`Span Count: ${trace.spans.length}`);

// Analyze spans
trace.spans.forEach(span => {
  const indent = '  '.repeat(getSpanDepth(span));
  console.log(`${indent}${span.spanName} (${span.durationMs}ms)`);
  console.log(`${indent}  Kind: ${span.spanKind}`);
  console.log(`${indent}  Status: ${span.statusCode}`);

  // Show events
  span.events?.forEach(event => {
    console.log(`${indent}  Event: ${event.name}`);
  });
});
```

```typescript [Query Logs]
// Query logs with filters
const logs = await af.observability().queryLogs({
  projectId: 'prj_abc123',
  startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endTime: new Date(),
  severityText: 'ERROR',         // Filter by severity
  bodyContains: 'payment',       // Search in log body
  serviceName: 'checkout-service',
  limit: 100,
});

logs.forEach(log => {
  console.log(`[${log.timestamp}] [${log.severityText}] ${log.body}`);
  if (log.traceId) {
    console.log(`  Trace: ${log.traceId}`);
  }
});
```

```typescript [Query Metrics]
// Query metrics with aggregation
const metrics = await af.observability().queryMetrics({
  projectId: 'prj_abc123',
  startTime: new Date(Date.now() - 60 * 60 * 1000),
  endTime: new Date(),
  metricName: 'http.server.duration',
  aggregation: 'avg',
  groupBy: ['http.route', 'http.status_code'],
});

metrics.forEach(series => {
  console.log(`Metric: ${series.name}`);
  console.log(`Labels: ${JSON.stringify(series.labels)}`);
  series.dataPoints.forEach(point => {
    console.log(`  ${point.timestamp}: ${point.value}`);
  });
});
```

```typescript [Service Statistics]
// Get service-level statistics
const services = await af.observability().getServices(
  'prj_abc123',
  new Date(Date.now() - 24 * 60 * 60 * 1000),
  new Date()
);

console.log('Service Performance Summary:');
console.log('─'.repeat(80));

services.forEach(service => {
  const errorRate = (service.errorCount / service.spanCount * 100).toFixed(2);

  console.log(`\n${service.serviceName}`);
  console.log(`  Traces: ${service.traceCount.toLocaleString()}`);
  console.log(`  Spans: ${service.spanCount.toLocaleString()}`);
  console.log(`  Errors: ${service.errorCount.toLocaleString()} (${errorRate}%)`);
  console.log(`  Latency:`);
  console.log(`    Avg: ${service.avgDurationMs.toFixed(2)}ms`);
  console.log(`    P50: ${service.p50DurationMs.toFixed(2)}ms`);
  console.log(`    P95: ${service.p95DurationMs.toFixed(2)}ms`);
  console.log(`    P99: ${service.p99DurationMs.toFixed(2)}ms`);
});
```

:::

### Using the CLI

::: code-group

```bash [List Traces]
# List recent traces
af observability traces

# Filter by service
af observability traces --service api-gateway

# Filter by status (errors only)
af observability traces --status ERROR

# Filter by duration (slow requests)
af observability traces --min-duration 500

# Look back further in time
af observability traces --hours 24 --limit 100
```

```bash [Get Trace Details]
# View specific trace
af observability trace abc123def456...

# Output shows:
# Trace Details:
#   Trace ID:    abc123def456...
#   Service:     api-gateway
#   Duration:    234.56ms
#   Span Count:  12
#   Has Error:   No
#   Start Time:  12/29/2025, 10:30:15 AM
#
# Spans:
# ┌────────────────────────────┬────────┬────────────┬────────┬──────────────┐
# │ Span Name                  │ Kind   │ Duration   │ Status │ Service      │
# ├────────────────────────────┼────────┼────────────┼────────┼──────────────┤
# │ HTTP GET /api/users        │ SERVER │ 234.56ms   │ OK     │ api-gateway  │
# │ PostgreSQL SELECT          │ CLIENT │ 45.23ms    │ OK     │ api-gateway  │
# │ Redis GET                  │ CLIENT │ 2.34ms     │ OK     │ api-gateway  │
# └────────────────────────────┴────────┴────────────┴────────┴──────────────┘
```

```bash [Query Logs]
# Recent logs
af observability logs

# Filter by severity
af observability logs --severity ERROR
af observability logs --severity WARN

# Search in log body
af observability logs --search "connection failed"

# Filter by service
af observability logs --service database-worker

# Combine filters
af observability logs \
  --service checkout-service \
  --severity ERROR \
  --hours 4
```

```bash [Service Statistics]
# Get service performance overview
af observability services

# Look at last 7 days
af observability services --hours 168

# Output shows:
# Found 5 service(s) with telemetry data:
#
# ┌────────────────────┬─────────┬──────────┬────────┬────────────┬──────────┬──────────┬──────────┬──────────┐
# │ Service            │ Traces  │ Spans    │ Errors │ Error Rate │ Avg (ms) │ P50 (ms) │ P95 (ms) │ P99 (ms) │
# ├────────────────────┼─────────┼──────────┼────────┼────────────┼──────────┼──────────┼──────────┼──────────┤
# │ api-gateway        │ 15,234  │ 45,702   │ 123    │ 0.3%       │ 45.23    │ 32.10    │ 156.78   │ 423.45   │
# │ user-service       │ 8,456   │ 16,912   │ 45     │ 0.3%       │ 23.45    │ 18.90    │ 67.89    │ 145.67   │
# │ checkout-service   │ 3,234   │ 12,936   │ 234    │ 1.8%       │ 156.78   │ 123.45   │ 456.78   │ 890.12   │
# │ notification-svc   │ 12,345  │ 24,690   │ 12     │ 0.0%       │ 12.34    │ 10.00    │ 34.56    │ 67.89    │
# │ analytics-worker   │ 1,234   │ 3,702    │ 0      │ 0.0%       │ 234.56   │ 200.00   │ 567.89   │ 890.12   │
# └────────────────────┴─────────┴──────────┴────────┴────────────┴──────────┴──────────┴──────────┴──────────┘
```

```bash [Check Usage & Cost]
# View telemetry usage for billing period
af observability usage

# Look at specific period
af observability usage --days 7

# Output shows:
# Telemetry Usage Summary:
#
#   Period:         12/1/2025 - 12/29/2025
#   Project ID:     prj_abc123
#
# ┌───────────────────────┬───────────────────┐
# │ Metric                │ Value             │
# ├───────────────────────┼───────────────────┤
# │ Spans Ingested        │ 1,234,567         │
# │ Metrics Ingested      │ 456,789           │
# │ Logs Ingested         │ 789,012           │
# │ Total Data Ingested   │ 2.34 GB           │
# │ Estimated Cost        │ $0.82             │
# └───────────────────────┴───────────────────┘
#
# Pricing: $0.35 per GB ingested
```

```bash [View/Update Settings]
# View current settings
af observability settings

# Enable/disable telemetry types
af observability settings:update --traces true --metrics false

# Adjust sampling rate (0.0 to 1.0)
af observability settings:update --sample-rate 0.5

# Change retention periods
af observability settings:update --trace-retention 14 --log-retention 30
```

:::

---

## Observability Settings

Configure per-project observability settings:

::: code-group

```typescript [SDK]
// Get current settings
const settings = await af.observability().getSettings('prj_abc123');

console.log('Observability Settings:');
console.log(`  Traces: ${settings.tracesEnabled ? 'Enabled' : 'Disabled'}`);
console.log(`  Metrics: ${settings.metricsEnabled ? 'Enabled' : 'Disabled'}`);
console.log(`  Logs: ${settings.logsEnabled ? 'Enabled' : 'Disabled'}`);
console.log(`  Sample Rate: ${settings.sampleRate * 100}%`);
console.log(`  Trace Retention: ${settings.traceRetention} days`);
console.log(`  Metric Retention: ${settings.metricRetention} days`);
console.log(`  Log Retention: ${settings.logRetention} days`);

// Update settings
await af.observability().updateSettings('prj_abc123', {
  tracesEnabled: true,
  metricsEnabled: true,
  logsEnabled: true,
  sampleRate: 0.5,        // Sample 50% of traces
  traceRetention: 14,     // Keep traces for 14 days
  logRetention: 30,       // Keep logs for 30 days
});
```

```bash [CLI]
# View settings
af observability settings

# Update individual settings
af observability settings:update --sample-rate 0.5
af observability settings:update --trace-retention 14
af observability settings:update --logs false
```

:::

### Settings Reference

| Setting | Description | Default |
|---------|-------------|---------|
| `tracesEnabled` | Enable trace collection | `true` |
| `metricsEnabled` | Enable metrics collection | `true` |
| `logsEnabled` | Enable log collection | `true` |
| `sampleRate` | Sampling rate (0.0-1.0) | `1.0` (100%) |
| `traceRetention` | Trace retention in days | `7` |
| `metricRetention` | Metric retention in days | `30` |
| `logRetention` | Log retention in days | `7` |
| `maxBytesPerHour` | Rate limit (bytes/hour) | `null` (unlimited) |

---

## AF Functions Integration

When using Alternate Futures Functions, observability is automatically configured. Your functions receive telemetry context from incoming requests.

```javascript
// functions/api.js - Traces are automatically created
export default async function handler(request) {
  const url = new URL(request.url);

  // This request is automatically traced
  const userData = await fetch('https://api.example.com/users/123');

  // Log events are captured
  console.log('Fetched user data');

  return new Response(JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

To add custom spans within your function:

```javascript
import { trace } from '@opentelemetry/api';

export default async function handler(request) {
  const tracer = trace.getTracer('my-function');

  return tracer.startActiveSpan('processRequest', async (span) => {
    try {
      span.setAttribute('request.path', new URL(request.url).pathname);

      const result = await processData();

      span.setStatus({ code: 1 }); // OK
      return new Response(JSON.stringify(result));
    } catch (error) {
      span.setStatus({ code: 2, message: error.message }); // ERROR
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

---

## Pricing

Observability is billed based on data ingested:

| Metric | Price |
|--------|-------|
| Data Ingestion | **$0.35 per GB** |

Includes:
- Traces, metrics, and logs
- Unlimited queries
- API access
- CLI tools

### Estimating Costs

Use the CLI to check current usage:

```bash
af observability usage --days 30
```

**Typical data sizes:**
- Span: ~500 bytes average
- Metric point: ~100 bytes
- Log entry: ~1KB average

**Example calculation:**
- 1 million spans/day = ~500MB/day = ~15GB/month = **~$5.25/month**

### Reducing Costs

1. **Adjust sampling rate** - Sample 50% or 10% of traces for high-volume services
2. **Disable unused telemetry** - Turn off metrics or logs if not needed
3. **Shorter retention** - Reduce retention periods
4. **Filter at source** - Don't instrument health checks or internal endpoints

```typescript
// Configure sampling
await initInstrumentation({
  projectId: 'prj_abc123',
  projectSlug: 'my-project',
  serviceName: 'high-volume-service',
  instrumentationConfig: {
    '@opentelemetry/instrumentation-http': {
      // Don't trace health checks
      ignoreIncomingPaths: ['/health', '/ready', '/metrics'],
    },
  },
});

// Or set sampling via settings
await af.observability().updateSettings('prj_abc123', {
  sampleRate: 0.1, // Only sample 10%
});
```

---

## Best Practices

### Span Naming

Use consistent, descriptive span names:

```typescript
// Good - descriptive and consistent
'HTTP GET /api/users/:id'
'PostgreSQL SELECT users'
'Redis GET session:*'
'processPayment'
'sendNotification'

// Bad - too generic or inconsistent
'request'
'database'
'do_thing'
```

### Attributes

Add meaningful attributes for filtering and analysis:

```typescript
span.setAttribute('user.id', userId);
span.setAttribute('order.id', orderId);
span.setAttribute('order.total', orderTotal);
span.setAttribute('payment.method', 'credit_card');
span.setAttribute('feature.flag', 'new-checkout-flow');
```

### Error Handling

Always record exceptions and set error status:

```typescript
try {
  await riskyOperation();
} catch (error) {
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error.message,
  });
  span.recordException(error);

  // Log the error too
  logger.emit({
    severityNumber: SeverityNumber.ERROR,
    body: `Operation failed: ${error.message}`,
    attributes: {
      'error.type': error.name,
      'error.stack': error.stack,
    },
  });

  throw error;
}
```

### Context Propagation

Ensure trace context is propagated across service boundaries:

```typescript
import { context, propagation } from '@opentelemetry/api';

// When making outbound requests
const headers = {};
propagation.inject(context.active(), headers);

const response = await fetch('https://other-service/api', {
  headers: {
    ...headers,
    'Content-Type': 'application/json',
  },
});
```

---

## Troubleshooting

### No Data Appearing

1. **Check project ID** - Ensure `X-AF-Project-ID` header is set correctly
2. **Verify endpoint** - Confirm OTLP endpoint is reachable
3. **Check sampling** - Sampling rate might be set too low
4. **Review settings** - Telemetry type might be disabled

```bash
# Check settings
af observability settings

# Verify connectivity
curl -X POST https://otel.alternatefutures.ai/v1/traces \
  -H "Content-Type: application/json" \
  -H "X-AF-Project-ID: your-project-id" \
  -d '{}'
```

### Missing Spans

1. **Ensure spans are ended** - Always call `span.end()`
2. **Check async context** - Use `startActiveSpan` for automatic propagation
3. **Verify flush** - SDK might not have flushed before process exit

```typescript
// Ensure graceful shutdown
process.on('SIGTERM', async () => {
  await sdk.shutdown(); // Flushes pending telemetry
  process.exit(0);
});
```

### High Cardinality Warning

Avoid high-cardinality attributes that create too many unique combinations:

```typescript
// Bad - creates millions of unique series
span.setAttribute('request.id', requestId);  // Unique per request!
span.setAttribute('timestamp', Date.now());  // Always different!

// Good - limited cardinality
span.setAttribute('http.method', 'GET');
span.setAttribute('http.status_code', 200);
span.setAttribute('user.tier', 'premium');
```

---

## Next Steps

- [Cloud Functions](./functions.md) - Deploy serverless functions with built-in observability
- [Best Practices](./best-practices.md) - General platform best practices
- [Billing](./billing.md) - Understand billing and manage costs
- [CLI Commands](/cli/commands.md) - Full CLI reference
