/**
 * Contextual data (tags and extra info) serialized from a Scope.
 */
export interface ScopeData {
  /** Key-value pairs for filtering and categorization. */
  tags?: Record<string, string>;
  /** Supplemental structured data related to the event. */
  extra?: Record<string, unknown>;
}
