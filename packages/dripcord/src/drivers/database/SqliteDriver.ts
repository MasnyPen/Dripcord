import sqlite3 from 'sqlite3';
import { DatabaseDriver } from './DatabaseDriver.js';

export class SQLiteDatabaseDriver extends DatabaseDriver {
  private db: sqlite3.Database;

  /**
   * Constructor for SQLiteDatabaseDriver.
   * @param dbPath The path to the SQLite database file (defaults to in-memory database if not provided).
   */
  constructor(private dbPath: string = ':memory:') {
    super();
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
      }
    });
  }

  /**
   * Connects to the SQLite database.
   * @returns Returns true if the connection is successfully established, otherwise false.
   */
  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          'CREATE TABLE IF NOT EXISTS data (key TEXT PRIMARY KEY, value TEXT)',
          (err) => {
            if (err) {
              reject(new Error(`Failed to create table: ${err.message}`));
              return;
            }
            this.setConnected(true);
            resolve(true);
          }
        );
      });
    });
  }

  /**
   * Disconnects from the SQLite database.
   * @returns Returns true if the disconnection is successful.
   */
  async disconnect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(new Error(`Failed to disconnect from SQLite database: ${err.message}`));
          return;
        }
        this.setConnected(false);
        resolve(true);
      });
    });
  }

  /**
   * Executes a query on the SQLite database.
   * @param query The SQL query to execute.
   * @param params Optional parameters for the query.
   * @returns Returns the result of the query.
   */
  async query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(new Error(`Failed to execute query: ${err.message}`));
          return;
        }
        resolve(rows);
      });
    });
  }

  /**
   * Executes an execute-type query (insert, update, delete) on the SQLite database.
   * @param query The SQL query to execute.
   * @param params Optional parameters for the query.
   * @returns Returns the number of affected rows.
   */
  async execute(query: string, params: any[] = []): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(new Error(`Failed to execute query: ${err.message}`));
          return;
        }
        resolve(this.changes);
      });
    });
  }

  /**
   * Retrieves data from the SQLite database based on the provided key.
   * @param key The key under which the data is stored.
   * @returns Returns the data if found, or null if not found.
   */
  async get(key: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value FROM data WHERE key = ?', [key], (err, row: any) => {
        if (err) {
          reject(new Error(`Failed to get value from SQLite: ${err.message}`));
          return;
        }
        if (!row) {
          resolve(null);
          return;
        }
        try {
          resolve(JSON.parse(row.value));
        } catch (error) {
          resolve(row.value); // fallback if not JSON
        }
      });
    });
  }

  /**
   * Sets a value in the SQLite database under the provided key.
   * @param key The key to store the value under.
   * @param value The value to store.
   * @returns Returns true if the operation was successful.
   */
  async set(key: string, value: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(value);
      this.db.run(
        'INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)',
        [key, data],
        function (err) {
          if (err) {
            reject(new Error(`Failed to set value in SQLite: ${err.message}`));
            return;
          }
          resolve(true);
        }
      );
    });
  }

  /**
   * Deletes data from the SQLite database based on the provided key.
   * @param key The key to delete.
   * @returns Returns true if the data was deleted.
   */
  async delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM data WHERE key = ?', [key], function (err) {
        if (err) {
          reject(new Error(`Failed to delete value from SQLite: ${err.message}`));
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  /**
   * Clears all data from the SQLite database.
   */
  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM data', [], (err) => {
        if (err) {
          reject(new Error(`Failed to clear SQLite database: ${err.message}`));
          return;
        }
        resolve();
      });
    });
  }

  /**
   * Returns all the keys from the SQLite database.
   * @returns Returns an array of keys.
   */
  async keys(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT key FROM data', [], (err, rows) => {
        if (err) {
          reject(new Error(`Failed to retrieve keys from SQLite: ${err.message}`));
          return;
        }
        resolve(rows.map((row: any) => row.key));
      });
    });
  }
}
