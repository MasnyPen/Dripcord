import { Pool, PoolConfig } from 'pg';
import { DatabaseDriver } from './DatabaseDriver.js';

export class PgDatabaseDriver extends DatabaseDriver {
  private pool: Pool;

  constructor(private config: PoolConfig) {
    super();
    this.pool = new Pool(this.config);
  }

  /**
   * Establishes a connection to the Postgres Database.
   * @returns A promise that resolves to true if the connection is successful.
   */
  async connect(): Promise<boolean> {
    try {
      await this.pool.connect();
      this.setConnected(true);
      return true;
    } catch (error) {
      console.error('PostgreSQL connection error:', error);
      this.setConnected(false);
      return false;
    }
  }

  /**
   * Disconnects from the Postgres Database.
   * @returns A promise that resolves to true if the disconnection is successful.
   */
  async disconnect(): Promise<boolean> {
    try {
      await this.pool.end();
      this.setConnected(false);
      return true;
    } catch (error) {
      console.error('PostgreSQL disconnection error:', error);
      return false;
    }
  }

  getClient(): Pool {
    return this.pool;
  }
}
