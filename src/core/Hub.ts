import { AsyncLocalStorage } from "node:async_hooks";
import { Scope } from "./Scope";

export class Hub {
  private als = new AsyncLocalStorage<Scope>();

  run<T>(fn: () => T): T {
    return this.als.run(new Scope(), fn);
  }

  getScope(): Scope {
    return this.als.getStore() ?? new Scope();
  }
}

export const GLOBAL_HUB = new Hub();
