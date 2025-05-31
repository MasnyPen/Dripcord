import { CacheDriver } from "./CacheDriver.js";

interface CacheEntry<T> {
    value: T;
    expiresAt?: number;
  }
  
export class LocalCacheDriver<T = any> extends CacheDriver<T> {
    private cache = new Map<string, CacheEntry<T>>();


    async connect(): Promise<boolean> {
        this.setConnected(true);
        return true;
    }

    async disconnect(): Promise<boolean> {
        this.cache.clear();
        this.setConnected(false);
        return true;
    }

    async get(key: string): Promise<T | null> {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        return null;
        }
        return entry.value;
    }

    async set(key: string, value: T, ttl?: number): Promise<boolean> {
        let expiresAt: number | undefined;
        if (ttl && ttl > 0) {
            expiresAt = Date.now() + ttl * 1000;
        }
        this.cache.set(key, { value, expiresAt });
        return true;
    }

    async delete(key: string): Promise<boolean> {
        return this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }

    async keys(pattern: string = '*'): Promise<string[]> {
        if (pattern === '*') {
        return Array.from(this.cache.keys());
        }
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return Array.from(this.cache.keys()).filter(key => regex.test(key));
    }
}
  