export class Scope {
  private tags = new Map<string, string>();
  private extra = new Map<string, unknown>();

  setTag(key: string, value: string) {
    this.tags.set(key, value);
  }

  setExtra(key: string, value: unknown) {
    this.extra.set(key, value);
  }

  serialize() {
    return {
      tags: Object.fromEntries(this.tags),
      extra: Object.fromEntries(this.extra),
    };
  }
}
