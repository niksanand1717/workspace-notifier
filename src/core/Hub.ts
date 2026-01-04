import { AsyncLocalStorage } from "node:async_hooks";
import { Scope } from "./Scope";

/**
 * The Hub manages the SDK's internal state and scope using AsyncLocalStorage.
 * It ensures that context (tags, extra data) is correctly isolated between execution contexts.
 */
export class Hub {
  private als = new AsyncLocalStorage<Scope>();

  /**
   * Run a function within a new isolated scope.
   * 
   * @param fn - The function to run
   * @returns The result of the function
   * 
   * @example
   * ```ts
   * GLOBAL_HUB.run(() => {
   *   GLOBAL_HUB.getScope().setTag("user", "123");
   *   // ...
   * });
   * ```
   */
  run<T>(fn: () => T): T {
    return this.als.run(new Scope(), fn);
  }

  /**
   * Retrieve the current active scope.
   * If no scope is active, returns a new detached scope.
   * 
   * @returns The active Scope instance
   */
  getScope(): Scope {
    return this.als.getStore() ?? new Scope();
  }
}

export const GLOBAL_HUB = new Hub();
