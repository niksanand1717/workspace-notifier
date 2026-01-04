# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-04

### Changed
- **Branding**: Rebranded the SDK from `@workspace-observer/node` to `@gchat-notifier/node`.
- **Renaming**: 
  - `WorkspaceSDK` -> `GChatNotifier`
  - `WorkspaceEvent` -> `GChatEvent`
  - `workspaceExpress` -> `gchatExpress`
  - `workspaceFastify` -> `gchatFastify`
  - `WorkspaceExceptionFilter` -> `GChatExceptionFilter`

## [0.1.10] - 2026-01-03

### Added
- Compact request visualization: IP, Query, and Params are now grouped to prevent card clutter.
- HTML formatting for stack traces (using `<code>` tags) for better readability in Google Chat.
- Support for manual request context in `captureException(error, request)`.
- Request data includes `url`, `method`, `query`, `params`, and `headers`.
- Enhanced `normalizeError` to embed request context directly into the event.

### Fixed
- Restored `unknown` error handling with robust type guarding.
- Fixed `Normalizer` unit tests to align with the latest structured error processing.

## [0.1.6] - 2026-01-03

### Fixed
- Major type-safety refactor: replaced `any` with structured types across the SDK.
- Exporting `Severity` correctly from `index.ts`.
- Full compatibility with `exactOptionalPropertyTypes: true`.

### Added
- Comprehensive Google Chat CardsV2 type definitions in `src/types/google-chat.ts`.

## [0.1.5] - 2026-01-03

### Added
- Dedicated `captureLatency(metrics)` API for performance monitoring.
- Structured `CardBuilder` with `setHeader` and `addDecoratedText` methods.
- Specialized latency alert cards with rich UI icons and metrics.

## [0.1.0] - 2026-01-02

### Added

- Initial release of `@gchat-notifier/node` (formerly `@workspace-observer/node`)
- **Core SDK**
  - `GChatNotifier.init()` - SDK initialization with configuration
  - `GChatNotifier.captureException()` - Error capture and reporting
  - `GChatNotifier.withScope()` - Scoped context for tags and extra data
- **Framework Integrations**
  - Express error middleware with request enrichment
  - Fastify plugin with `onError` hook
  - NestJS exception filter
- **Features**
  - Rate limiting to prevent webhook flooding
  - Automatic header redaction (authorization, cookies)
  - Stack trace trimming for large errors
  - Error fingerprinting for deduplication
  - Retry logic with exponential backoff
  - HTTP and HTTPS webhook support
  - `beforeSend` hook for event filtering/transformation
- **Types**
  - Full TypeScript support with exported types
  - `WorkspaceEvent`, `SDKOptions`, `Severity` exports
