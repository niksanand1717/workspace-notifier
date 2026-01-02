const MAX_STACK_LENGTH = 3000;

export function trimStack(stack?: string): string | undefined {
  if (!stack) return;
  return stack.length > MAX_STACK_LENGTH
    ? stack.slice(0, MAX_STACK_LENGTH) + "…"
    : stack;
}
