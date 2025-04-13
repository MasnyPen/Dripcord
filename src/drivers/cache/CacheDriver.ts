/**
 * The CacheDriver interface defines the basic methods to interact with a caching system.
 * It supports connecting to a backend (e.g., Redis or an in-memory cache using Map),
 * performing CRUD operations on cached values, and optionally retrieving keys by pattern.
 */
export abstract class CacheDriver<T = any> {
    private connected = false;



    /**
     * Establishes a connection to the cache backend.
     * @returns A promise that resolves to true if the connection is successfully established, false otherwise.
     */
    abstract connect(): Promise<boolean>;
  
    /**
     * Disconnects from the cache backend.
     * @returns A promise that resolves to true if the disconnection is successful.
     */
    abstract disconnect(): Promise<boolean>;
  
    /**
     * Indicates whether the driver is currently connected to the cache backend.
     */
    public isConnected(): boolean {
        return this.connected
    }

    public setConnected(connected: boolean) {
      this.connected = connected;
    }
  
    /**
     * Retrieves the value for the given key from the cache.
     * @param key - The key associated with the cached value.
     * @returns A promise that resolves to the value of type T, or null if the key does not exist.
     */
    abstract get(key: string): Promise<T | null>;
  
    /**
     * Stores a value in the cache under the specified key.
     * @param key - The key under which the value should be stored.
     * @param value - The value to store.
     * @param ttl - (Optional) Time-to-live for the cache entry, in seconds.
     * @returns A promise that resolves to true if the operation was successful.
     */
    abstract set(key: string, value: T, ttl?: number): Promise<boolean>;
  
    /**
     * Deletes the value associated with the given key from the cache.
     * @param key - The key to delete.
     * @returns A promise that resolves to true if the deletion was successful.
     */
    abstract delete(key: string): Promise<boolean>;
  
    /**
     * Clears all entries from the cache.
     * @returns A promise that resolves once the cache has been cleared.
     */
    abstract clear(): Promise<void>;
  
    /**
     * (Optional) Retrieves an array of keys matching the given pattern.
     * This method can be useful for backends such as Redis.
     * @param pattern - (Optional) A pattern to match against keys.
     * @returns A promise that resolves to an array of matching keys.
     */
    keys?(pattern?: string): Promise<string[]>;
  }
  