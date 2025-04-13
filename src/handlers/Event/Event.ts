import { Events } from "discord.js";
import BotClient from "../../BotClient";

export enum DripcordEvents {
}
  

export abstract class Event {
    name: string;
    once?: boolean;
    client: BotClient | null = null

    constructor(name: Events, once = false) {
        this.name = name;
        this.once = once;
    }

    getClient() {
        return this.client;
    }
    setClient(client: BotClient) {
        if (!this.client) {
            this.client = client;
            if (this.once) {
                client.once(this.name, this.execute)
            } else {
                client.on(this.name, this.execute)
            }
            
        }
    }

    abstract execute(...args: any[]): any;
}

