import type { ScopeData } from "../types/scope";

/**
 * Holds contextual data (tags and extra info) that can be attached to events.
 * Scopes can be nested using `GChatNotifier.withScope`.
 */
export class Scope {
  private tags = new Map<string, string>();
  private extra = new Map<string, unknown>();

  /**
   * Add a tag to the scope. Tags are searchable key-value pairs.
   * 
   * @param key - Tag key
   * @param value - Tag value
   */
  setTag(key: string, value: string) {
    this.tags.set(key, value);
  }

  /**
   * Add extra data to the scope. Extra data is supplemental structured information.
   * 
   * @param key - Extra data key
   * @param value - Extra data value (serializable object)
   */
  setExtra(key: string, value: unknown) {
    this.extra.set(key, value);
  }

  serialize(): ScopeData {
    return {
      tags: Object.fromEntries(this.tags),
      extra: Object.fromEntries(this.extra),
    };
  }
}
