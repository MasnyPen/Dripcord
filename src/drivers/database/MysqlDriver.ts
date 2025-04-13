import mysql from 'mysql2/promise';
import { DatabaseDriver } from './DatabaseDriver.js';

export class MySQLDatabaseDriver extends DatabaseDriver {
  private connection: mysql.Connection | null = null;
  private config: mysql.ConnectionOptions;

  constructor(config: mysql.ConnectionOptions) {
    super();
    this.config = config;
  }

  /**
   * Establishes a connection to the MySQL Database.
   * @returns A promise that resolves to true if the connection is successful.
   */
  async connect(): Promise<boolean> {
    try {
      this.connection = await mysql.createConnection(this.config);
      this.setConnected(true);
      console.log('MySQL connected successfully!');
      return true;
    } catch (error) {
      console.error('Failed to connect to MySQL:', error);
      this.setConnected(false);
      return false;
    }
  }

  /**
   * Disconnects from the MySQL Database.
   * @returns A promise that resolves to true if the disconnection is successful.
   */
  async disconnect(): Promise<boolean> {
    if (this.connection) {
      try {
        await this.connection.end();
        this.setConnected(false);
        console.log('MySQL disconnected successfully!');
        return true;
      } catch (error) {
        console.error('Failed to disconnect from MySQL:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Executes a MySQL query.
   * @param query The SQL query string.
   * @param params Optional parameters for query placeholders.
   * @returns The result of the query.
   */
  async query(query: string, params?: any[]): Promise<any> {
    if (!this.isConnected()) {
      throw new Error('Not connected to the database.');
    }
    try {
      const [rows] = await this.connection!.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  /**
   * Executes a MySQL prepared statement (similar to query but with more security and efficiency).
   * @param query The SQL query string with placeholders.
   * @param params The parameters to replace the placeholders in the query.
   * @returns The result of the execution.
   */
  async execute(query: string, params: any[]): Promise<any> {
    if (!this.isConnected()) {
      throw new Error('Not connected to the database.');
    }
    try {
      const [result] = await this.connection!.execute(query, params);
      return result;
    } catch (error) {
      console.error('Error executing statement:', error);
      throw error;
    }
  }
}
