import { createClient, RedisClientType } from "redis";
import { CacheDriver } from "./CacheDriver";

export class RedisCacheDriver<T = any> extends CacheDriver<T> {
  private client: RedisClientType;

  /**
   * @param options Optional configuration for the Redis client (host, port, etc.).
   */
  constructor(private options?: any) {
    super();
    this.client = createClient(this.options);
  }

  async connect(): Promise<boolean> {
    try {
      await this.client.connect();
      this.setConnected(true);
      return true;
    } catch (error) {
      this.setConnected(false);
      throw new Error(`Redis connection error: \n${error}`)
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      await this.client.disconnect();
      this.setConnected(false);
      return true;
    } catch (error) {
      throw new Error(`Redis disconnect error: \n${error}`)
    }
  }

  async get(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      return data as unknown as T;
    }
  }

  async set(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const data = JSON.stringify(value);
      if (ttl && ttl > 0) {
        await this.client.set(key, data, { EX: ttl });
      } else {
        await this.client.set(key, data);
      }
      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key);
    return result > 0;
  }

  async clear(): Promise<void> {
    await this.client.flushDb();
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    return await this.client.keys(pattern);
  }
}
