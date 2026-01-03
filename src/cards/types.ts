import type { Severity } from "../types/event";

export interface BaseCardData {
    service: string;
    environment: string;
    level: Severity;
    timestamp: number;
}

export interface ErrorCardData extends BaseCardData {
    message: string;
    errorName?: string;
    stackTrace?: string;
}

export interface LatencyCardData extends BaseCardData {
    endpoint: string;
    durationMs: number;
    thresholdMs?: number;
    ip?: string;
}
