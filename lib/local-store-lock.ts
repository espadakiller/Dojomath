let pending: Promise<unknown> = Promise.resolve();

export function withLocalStoreLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.then(operation, operation);
  pending = result.catch(() => undefined);
  return result;
}
