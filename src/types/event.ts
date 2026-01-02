export type Severity = "fatal" | "error" | "warning" | "info";

export interface WorkspaceEvent {
  id: string;
  timestamp: number;
  level: Severity;
  message: string;

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
