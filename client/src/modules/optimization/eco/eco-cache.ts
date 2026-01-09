export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate?: number;
  public: boolean;
  immutable: boolean;
}

export const CACHE_POLICIES: Record<string, CacheConfig> = {
  static: {
    maxAge: 31536000,
    public: true,
    immutable: true,
  },
  dynamic: {
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    public: true,
    immutable: false,
  },
  api: {
    maxAge: 60,
    staleWhileRevalidate: 300,
    public: false,
    immutable: false,
  },
  html: {
    maxAge: 0,
    public: true,
    immutable: false,
  },
};

export function generateCacheHeader(policy: keyof typeof CACHE_POLICIES): string {
  const config = CACHE_POLICIES[policy];
  const parts: string[] = [];

  if (config.public) {
    parts.push('public');
  } else {
    parts.push('private');
  }

  parts.push(`max-age=${config.maxAge}`);

  if (config.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  if (config.immutable) {
    parts.push('immutable');
  }

  return parts.join(', ');
}

export interface CachedItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const memoryCache = new Map<string, CachedItem<unknown>>();

export function setCache<T>(key: string, data: T, ttlSeconds: number = 300): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlSeconds * 1000,
  });
}

export function getCache<T>(key: string): T | null {
  const item = memoryCache.get(key) as CachedItem<T> | undefined;
  
  if (!item) return null;
  
  if (Date.now() - item.timestamp > item.ttl) {
    memoryCache.delete(key);
    return null;
  }
  
  return item.data;
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  
  const regex = new RegExp(pattern);
  const keys = Array.from(memoryCache.keys());
  for (const key of keys) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}
