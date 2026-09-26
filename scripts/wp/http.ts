const UA = "Mozilla/5.0 (compatible; VianeiMigration/1.0; +https://vianei.org.br)";

/** fetch with retries and backoff; the old host is slow and resets connections. */
export async function get(url: string, attempts = 4): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
      if (res.ok) return res;
      if (res.status < 500 && res.status !== 429) throw new Error(`HTTP ${res.status} ${url}`);
      lastError = new Error(`HTTP ${res.status} ${url}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
  }
  throw lastError;
}

export async function getJson<T>(url: string): Promise<{ data: T; headers: Headers }> {
  const res = await get(url);
  return { data: (await res.json()) as T, headers: res.headers };
}

/** Runs `fn` over items with bounded concurrency (be gentle with the old server). */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}
