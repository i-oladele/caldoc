import { CalculatorConfig } from '../app/calculator/config/calculator';

interface CacheEntry {
  config: CalculatorConfig;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const cache: Record<string, CacheEntry> = {};

const getCachedConfig = (id: string): CalculatorConfig | null => {
  const entry = cache[id];
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.config;
  }
  return null;
};

const setCachedConfig = (id: string, config: CalculatorConfig): void => {
  cache[id] = {
    config,
    timestamp: Date.now(),
  };
};

const clearExpiredCache = (): void => {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    if (now - cache[key].timestamp >= CACHE_DURATION) {
      delete cache[key];
    }
  });
};

// Clean up expired cache periodically
setInterval(clearExpiredCache, CACHE_DURATION);

export {
  getCachedConfig,
  setCachedConfig,
  clearExpiredCache,
};
