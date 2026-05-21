const inFlightRegistry = globalThis as typeof globalThis & {
  __joocareInFlightRequests__?: Map<string, Promise<unknown>>;
};

function getInFlightRequests() {
  if (!inFlightRegistry.__joocareInFlightRequests__) {
    inFlightRegistry.__joocareInFlightRequests__ = new Map();
  }

  return inFlightRegistry.__joocareInFlightRequests__;
}

export function runWithInFlightDedupe<T>(
  key: string,
  factory: () => Promise<T>,
): Promise<T> {
  const requests = getInFlightRequests();
  const existing = requests.get(key) as Promise<T> | undefined;

  if (existing) {
    return existing;
  }

  const next = factory().finally(() => {
    requests.delete(key);
  });

  requests.set(key, next);
  return next;
}

