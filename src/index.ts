// Core SDK
export { WorkspaceSDK } from "./core/Client";
export { Scope } from "./core/Scope";

// Integrations
export { workspaceExpress } from "./integrations/express";
export { workspaceFastify } from "./integrations/fastify";
export { WorkspaceExceptionFilter } from "./integrations/nest";

// Types
export type { WorkspaceEvent, Severity } from "./types/event";
export type { SDKOptions } from "./types/options";
export type { ErrorCardData, LatencyCardData } from "./cards/types";
