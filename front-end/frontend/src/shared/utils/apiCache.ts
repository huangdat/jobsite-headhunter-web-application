/**
 * API Response Cache Utility
 * Prevents unnecessary repeated API calls with smart caching and retry logic
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RetryState {
  attempts: number;
  lastAttempt: number;
  maxRetries: number;
  blocked: boolean;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private retryState = new Map<string, RetryState>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default cache
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds between retries
  private blockDuration = 60 * 1000; // Block for 1 minute after max retries

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      // Cache expired, remove it
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache data with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });

    // Reset retry state on successful cache
    this.retryState.delete(key);
  }

  /**
   * Check if we should retry a failed request
   */
  canRetry(key: string): boolean {
    const state = this.retryState.get(key);
    if (!state) return true;

    const now = Date.now();

    // If blocked, check if block duration has passed
    if (state.blocked) {
      if (now - state.lastAttempt > this.blockDuration) {
        // Reset after block duration
        this.retryState.delete(key);
        return true;
      }
      return false;
    }

    // Check if we've exceeded max retries
    return state.attempts < state.maxRetries;
  }

  /**
   * Record a failed attempt
   */
  recordFailure(key: string): void {
    const state = this.retryState.get(key) || {
      attempts: 0,
      lastAttempt: 0,
      maxRetries: this.maxRetries,
      blocked: false,
    };

    state.attempts += 1;
    state.lastAttempt = Date.now();

    // Block if max retries reached
    if (state.attempts >= state.maxRetries) {
      state.blocked = true;
    }

    this.retryState.set(key, state);
  }

  /**
   * Get retry state for debugging
   */
  getRetryState(key: string): RetryState | null {
    return this.retryState.get(key) || null;
  }

  /**
   * Clear specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
    this.retryState.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.retryState.clear();
  }

  /**
   * Get retry delay (can be exponential backoff)
   */
  getRetryDelay(key: string): number {
    const state = this.retryState.get(key);
    if (!state) return this.retryDelay;

    // Exponential backoff: 2s, 4s, 8s
    return this.retryDelay * Math.pow(2, state.attempts);
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

/**
 * Helper function to wrap API calls with caching and retry logic
 */
export async function cachedApiCall<T>(
  key: string,
  apiCall: () => Promise<T>,
  options?: {
    ttl?: number;
    forceRefresh?: boolean;
  }
): Promise<T> {
  const { ttl, forceRefresh = false } = options || {};

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = apiCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
  }

  // Check if we can retry
  if (!apiCache.canRetry(key)) {
    const state = apiCache.getRetryState(key);
    throw new Error(
      `Too many failed attempts for ${key}. Please try again later. (${state?.attempts}/${state?.maxRetries})`
    );
  }

  try {
    // Make API call
    const data = await apiCall();

    // Cache successful response
    apiCache.set(key, data, ttl);

    return data;
  } catch (error) {
    // Record failure
    apiCache.recordFailure(key);

    // Re-throw error
    throw error;
  }
}
