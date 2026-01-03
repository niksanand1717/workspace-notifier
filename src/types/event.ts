import type { Severity } from "./severity";
export type { Severity };

export interface WorkspaceEvent {
  id: string;
  timestamp: number;
  level: Severity;
  message: string;
  fingerprint?: string;

  error?: {
    name: string;
    message: string;
    stack?: string;
  };

  request?: {
    method?: string;
    url?: string;
    ip?: string;
    headers?: Record<string, string>;
  };

  tags?: Record<string, string>;
  extra?: Record<string, unknown>;

  environment?: string;
  service?: string;
  release?: string;
}
