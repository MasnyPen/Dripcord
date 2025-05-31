
export abstract class DatabaseDriver {
    private connected = false;
    
    /**
     * Establishes a connection to the Database.
     * @returns A promise that resolves to true if the connection is successfully established, false otherwise.
     */
    abstract connect(): Promise<boolean>;
  
    /**
     * Disconnects from the Database.
     * @returns A promise that resolves to true if the disconnection is successful.
     */
    abstract disconnect(): Promise<boolean>;
  
    /**
     * Indicates whether the driver is currently connected to the Database.
     */
    public isConnected(): boolean {
        return this.connected
    }

    protected setConnected(connected: boolean) {
      this.connected = connected;
    }
}