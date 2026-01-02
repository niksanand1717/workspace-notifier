# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-02

### Added

- Initial release of `@workspace-observer/node`
- **Core SDK**
  - `WorkspaceSDK.init()` - SDK initialization with configuration
  - `WorkspaceSDK.captureException()` - Error capture and reporting
  - `WorkspaceSDK.withScope()` - Scoped context for tags and extra data
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
