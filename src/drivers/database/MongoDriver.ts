import mongoose, { ConnectOptions } from 'mongoose';
import { DatabaseDriver } from './DatabaseDriver.js';

export class MongoDatabaseDriver extends DatabaseDriver {
  constructor(private uri: string, private options: ConnectOptions = {}) {
    super();
  }

  /**
   * Establishes a connection to the Mongo Database.
   * @returns A promise that resolves to true if the connection is successful.
   */
  async connect(): Promise<boolean> {
    try {
      await mongoose.connect(this.uri, this.options);
      this.setConnected(true);
      return true;
    } catch (error) {
      console.error('Mongoose connection error:', error);
      this.setConnected(false);
      return false;
    }
  }

  /**
   * Disconnects from the Mongo Database.
   * @returns A promise that resolves to true if the disconnection is successful.
   */
  async disconnect(): Promise<boolean> {
    try {
      await mongoose.disconnect();
      this.setConnected(false);
      return true;
    } catch (error) {
      console.error('Mongoose disconnection error:', error);
      return false;
    }
  }

  getClient(): typeof mongoose {
    return mongoose;
  }
}
