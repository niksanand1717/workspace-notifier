<p align="center">
  <img src="https://raw.githubusercontent.com/niksanand1717/workspace-notifierr/main/assets/logo.png" width="200" alt="@gchat-notifier/node logo">
</p>

# @gchat-notifier/node

Error capturing SDK for Node.js that sends notifications to Google Chat via webhook cards.

## Features

- 🚨 **Automatic error capture** - Catch and report exceptions with stack traces
- ⏱️ **Latency monitoring** - Track and alert on endpoint performance
- 🔗 **Framework integrations** - Built-in support for Express, Fastify, and NestJS
- 🏷️ **Context enrichment** - Add tags, extra data, and request info to events
- 🛡️ **Privacy-aware** - Automatic redaction of sensitive headers
- ⚡ **Rate limiting** - Prevent webhook flooding
- 🎯 **TypeScript-first** - Full type safety and IntelliSense support

## Installation

```bash
npm install @gchat-notifier/node
```

- **Framework support**: Express, Fastify, and NestJS integrations built-in.
- **Deduplication**: Error fingerprinting prevents message flooding.
- **Security**: Automatic header redaction for sensitive data.

[Read Full API Documentation →](https://niksanand1717.github.io/workspace-notifierr)

## Quick Start

### Error Capturing
```typescript
import { GChatNotifier } from "@gchat-notifier/node";

GChatNotifier.init({
  webhookUrl: "https://chat.googleapis.com/v1/spaces/...",
});

// Capture an error with optional request context
try {
  throw new Error("API Timeout");
} catch (error) {
  GChatNotifier.captureException(error, {
    url: "/api/v1/data",
    method: "POST"
  });
}
```

### Latency Monitoring
```typescript
GChatNotifier.captureLatency({
  endpoint: "/api/v1/users",
  durationMs: 450,
  thresholdMs: 300 // Optional: shows threshold in the card
});
```

## Configuration Options

```typescript
interface SDKOptions {
  /** Google Chat webhook URL (required) */
  webhookUrl: string;
  
  /** Service/application name */
  service?: string;
  
  /** Environment (e.g., 'production', 'staging') */
  environment?: string;
  
  /** Application version/release */
  release?: string;
  
  /** Enable debug logging to console */
  debug?: boolean;
  
  /** Maximum events per minute (default: 30) */
  maxEventsPerMinute?: number;
  
  /** Transform or filter events before sending */
  beforeSend?: (event: GChatEvent) => GChatEvent | null;
}
```

## Enriching Events with Context

Use `withScope` to add contextual information to captured events:

```typescript
GChatNotifier.withScope((scope) => {
  scope.setTag("userId", "12345");
  scope.setTag("feature", "checkout");
  scope.setExtra("cart", { items: 3, total: 99.99 });
  
  GChatNotifier.captureException(error);
});
```

## Framework Integrations

### Express

```typescript
import express from "express";
import { GChatNotifier, gchatExpress } from "@gchat-notifier/node";

const app = express();

GChatNotifier.init({ webhookUrl: "..." });

// Your routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Error handler - must be after all routes
app.use(gchatExpress());

app.listen(3000);
```

### Fastify

```typescript
import Fastify from "fastify";
import { GChatNotifier, gchatFastify } from "@gchat-notifier/node";

const fastify = Fastify();

GChatNotifier.init({ webhookUrl: "..." });

// Register the plugin
await fastify.register(gchatFastify);

fastify.listen({ port: 3000 });
```

### NestJS

```typescript
import { Module, APP_FILTER } from "@nestjs/core";
import { GChatNotifier, GChatExceptionFilter } from "@gchat-notifier/node";

GChatNotifier.init({ webhookUrl: "..." });

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GChatExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## Filtering Events

Use `beforeSend` to filter or modify events before they're sent:

```typescript
GChatNotifier.init({
  webhookUrl: "...",
  beforeSend: (event) => {
    // Don't send 404 errors
    if (event.message.includes("Not Found")) {
      return null;
    }
    
    // Add custom data
    event.extra = {
      ...event.extra,
      serverVersion: process.env.VERSION,
    };
    
    return event;
  },
});
```

## Types

The package exports the following types for TypeScript users:

```typescript
import type { 
  GChatEvent, 
  SDKOptions, 
  Severity 
} from "@gchat-notifier/node";
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
