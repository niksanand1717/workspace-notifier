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
    method?: string | undefined;
    url?: string | undefined;
    ip?: string | undefined;
    headers?: Record<string, string> | undefined;
    query?: Record<string, any> | undefined;
    params?: Record<string, any> | undefined;
    body?: any | undefined;
  };

  tags?: Record<string, string>;
  extra?: Record<string, unknown>;

  environment?: string;
  service?: string;
  release?: string;
}
