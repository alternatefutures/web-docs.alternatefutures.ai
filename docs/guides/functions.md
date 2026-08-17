---
description: Deploy serverless functions on decentralized infrastructure, with an optional SGX flag, using Alternate Futures Cloud Functions.
---

# Cloud Functions

Deploy serverless functions on decentralized infrastructure with Alternate Futures Cloud Functions.

## What are Cloud Functions?

Cloud Functions are serverless compute that runs on decentralized infrastructure. Use them to build:

- **API Endpoints** - Create backend APIs without managing servers
- **Dynamic Content** - Generate personalized content at the edge
- **Data Processing** - Transform and process data on-demand
- **Webhooks** - Handle incoming webhook events
- **Form Handling** - Process form submissions

## Function Runtime

Functions run in a JavaScript/TypeScript runtime with:

- Node.js-compatible APIs
- Web APIs (`fetch`, `Request`, `Response`)
- An optional SGX (Software Guard Extensions) deployment flag for workloads that need extra isolation

::: info What this maps to in code
- **SDK:** [functions client](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/functions.ts) — `create`, `deploy`, `list`, `listDeployments`, `update`, `delete`.
- **API:** [`AFFunction` data model](https://github.com/alternatefutures/alternate-clouds-api/blob/main/prisma/schema.prisma) and [`AFFunction` GraphQL type](https://github.com/alternatefutures/alternate-clouds-api/blob/main/src/schema/typeDefs.ts) — exposes `invokeUrl`, `routes`, `status`.
:::

::: tip CLI
There is no `acc functions` command. Functions are created and deployed through the **SDK / GraphQL API** and served as services via `acc services`. The examples below use the SDK.
:::

## Creating a Function

::: code-group

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// Create a function
const func = await af.functions().create({
  name: 'my-function',
  siteId: 'site-id', // optional
  routes: {
    '/api/*': 'index.js' // route patterns
  }
});

console.log('Function created:', func.name);
console.log('Function ID:', func.id);
```

:::

## Writing Function Code

Create an `index.js` file with your function logic:

```javascript
// Simple API endpoint
export default async function handler(request) {
  const url = new URL(request.url);

  // Handle different routes
  if (url.pathname === '/api/hello') {
    return new Response(JSON.stringify({
      message: 'Hello from Alternate Futures!'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Default response
  return new Response('Not Found', { status: 404 });
}
```

### Advanced Example

```javascript
// Function with database and external API
export default async function handler(request) {
  const url = new URL(request.url);

  // Parse request body
  if (request.method === 'POST') {
    const data = await request.json();

    // Call external API
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
```

## Deploying a Function

::: code-group

```typescript [SDK]
// First, upload your built function bundle to storage to get a CID.
// (Use the storage client's upload method; it returns a CID.)
const { cid } = await af.storage().uploadContent(/* your bundle */);

// Deploy the function using that CID
const deployment = await af.functions().deploy({
  functionId: 'function-id',
  cid,
  sgx: true, // optional: request an SGX-enabled deployment
  blake3Hash: 'hash', // optional: for verification
  assetsCid: 'assets-cid' // optional: static assets
});

console.log('Deployment ID:', deployment.id);
```

:::

## Listing Functions

::: code-group

```typescript [SDK]
// List all functions
const functions = await af.functions().list();

functions.forEach(func => {
  console.log(`${func.name} (${func.slug})`);
  console.log(`Status: ${func.status}`);
  console.log(`URL: ${func.invokeUrl}`); // e.g. https://crooked-bland-jackal.dev.on-af-functions.app
});
```

:::

## Viewing Function Deployments

::: code-group

```typescript [SDK]
// List function deployments
const deployments = await af.functions().listDeployments({
  functionId: 'function-id'
});

deployments.forEach(dep => {
  console.log(`Deployment ${dep.id}`);
  console.log(`CID: ${dep.cid}`);
  console.log(`Created: ${dep.createdAt}`);
});
```

:::

## Updating a Function

::: code-group

```typescript [SDK]
// Update function
await af.functions().update({
  id: 'function-id',
  name: 'New Name',
  routes: {
    '/api/v2/*': 'handler.js'
  },
  status: 'ACTIVE' // or 'INACTIVE'
});
```

:::

## Deleting a Function

::: code-group

```typescript [SDK]
// Delete a function
await af.functions().delete({ id: 'function-id' });
```

:::

## Route Configuration

Functions support flexible route matching:

```typescript
{
  routes: {
    '/api/*': 'api.js',           // Wildcard matching
    '/users/:id': 'users.js',     // Path parameters
    '/blog/**': 'blog.js',        // Recursive wildcard
    '/exact': 'exact.js'          // Exact match
  }
}
```

## Environment Variables

Set environment variables for your functions:

```javascript
export default async function handler(request) {
  const apiKey = process.env.API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  // Use environment variables
  const response = await fetch('https://api.example.com', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  return new Response(await response.text());
}
```

Set variables during deployment or in your build process.

## SGX (Software Guard Extensions)

Request an SGX-enabled deployment with the `sgx` flag:

```typescript
await af.functions().deploy({
  functionId: 'function-id',
  cid,
  sgx: true,
});
```

SGX is an optional deployment flag that requests your function run in an SGX-enabled environment for additional isolation of sensitive workloads. Exact guarantees and availability depend on the target provider.

## Function URLs

Access your functions via:

- **Default URL**: returned by the API as `func.invokeUrl` (pattern `https://<function-slug>.<env>.on-af-functions.app`)
- **Custom Domain**: Configure custom domains for your functions
- **Site Integration**: Mount functions on specific routes within your site

## Use Cases

### API Backend

```javascript
// REST API endpoint
export default async function handler(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const data = await fetchFromDatabase(id);

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Form Processing

```javascript
// Contact form handler
export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const formData = await request.formData();
  const email = formData.get('email');
  const message = formData.get('message');

  // Send email or store in database
  await sendEmail({ to: 'contact@example.com', email, message });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Image Processing

```javascript
// Dynamic image resizing
export default async function handler(request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');
  const width = url.searchParams.get('width');

  const response = await fetch(imageUrl);
  const image = await response.arrayBuffer();

  // Resize image
  const resized = await resizeImage(image, { width });

  return new Response(resized, {
    headers: { 'Content-Type': 'image/jpeg' }
  });
}
```

### Authentication Middleware

```javascript
// JWT authentication
export default async function handler(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const user = await verifyToken(token);

    return new Response(JSON.stringify({ user }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response('Invalid Token', { status: 401 });
  }
}
```

## Best Practices

::: tip
- **Keep functions small** - One function per route or feature
- **Use caching** - Cache responses when possible
- **Handle errors** - Always return appropriate status codes
- **Set CORS headers** - Allow cross-origin requests when needed
- **Monitor performance** - Track function execution time and errors
- **Use environment variables** - Never hardcode secrets
:::

## Performance Tips

1. **Minimize dependencies** - Only import what you need
2. **Use streaming** - Stream large responses
3. **Cache responses** - Set appropriate Cache-Control headers
4. **Optimize cold starts** - Keep initialization code minimal
5. **Use edge caching** - Leverage CDN caching

## Troubleshooting

### Function Not Responding

**Problem:** Function returns 500 or times out

**Solutions:**
- Check function logs for errors
- Verify all dependencies are included
- Test function locally first
- Check external API availability

### CORS Errors

**Problem:** Browser blocks requests to function with errors like:
- "Access to fetch has been blocked by CORS policy"
- "No 'Access-Control-Allow-Origin' header is present"
- "CORS preflight request failed"

**What is CORS?**

CORS (Cross-Origin Resource Sharing) is a security feature that browsers use to prevent websites from making requests to different domains without permission. When your web app (e.g., `myapp.com`) tries to call your function (e.g., `function.on-af-functions.app`), the browser blocks it unless your function explicitly allows it.

**Solution 1: Basic CORS Headers**

Add CORS headers to all responses:

```javascript
export default async function handler(request) {
  const data = { message: 'Hello' };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',  // Allow all origins
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
```

**Solution 2: Handle Preflight Requests**

Browsers send an OPTIONS request before the actual request (called "preflight"). You must handle this:

```javascript
export default async function handler(request) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
      }
    });
  }

  // Handle actual request
  const data = { message: 'Hello' };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
```

**Solution 3: Specific Origin (Recommended for Production)**

Instead of allowing all origins (`*`), specify your domain:

```javascript
const allowedOrigins = [
  'https://myapp.com',
  'https://staging.myapp.com',
  'http://localhost:3000' // For development
];

export default async function handler(request) {
  const origin = request.headers.get('Origin');
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Handle actual request
  const data = { message: 'Hello' };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
```

**Solution 4: Helper Function**

Create a reusable helper:

```javascript
function corsResponse(body, options = {}) {
  return new Response(body, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...options.headers
    }
  });
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return corsResponse(null, { status: 204 });
  }

  const data = { message: 'Hello' };
  return corsResponse(JSON.stringify(data));
}
```

**Common CORS Headers Explained:**

- `Access-Control-Allow-Origin`: Which domains can access your function
  - `*` = all domains (use for public APIs)
  - `https://myapp.com` = specific domain (use for private APIs)
- `Access-Control-Allow-Methods`: Which HTTP methods are allowed (GET, POST, etc.)
- `Access-Control-Allow-Headers`: Which headers the client can send
- `Access-Control-Max-Age`: How long (in seconds) to cache the preflight response

::: security Security Note
For production, always specify exact origins instead of using `*`. This prevents unauthorized websites from calling your functions.
:::

### Slow Performance

**Problem:** Function execution is slow

**Solutions:**
- Optimize database queries
- Add caching layer
- Reduce payload size
- Use connection pooling

## Next Steps

- [Sites](./sites.md) - Deploy static sites
- [Storage](./storage.md) - Store function data
- [Custom Domains](./custom-domains.md) - Add custom domains
- [Best Practices](./best-practices.md) - Optimization tips
