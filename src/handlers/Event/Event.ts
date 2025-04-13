import { Events } from "discord.js";
import BotClient from "../../BotClient";

export enum DripcordEvents {
}
  

export abstract class Event {
    public name: string;
    public once?: boolean;
    private client: BotClient | null = null

    constructor(name: Events, once = false) {
        this.name = name;
        this.once = once;
    }

    public getClient() {
        return this.client;
    }
    public setClient(client: BotClient) {
        if (!this.client) {
            this.client = client;
            if (this.once) {
                client.once(this.name, this.execute.bind(this))
            } else {
                client.on(this.name, this.execute.bind(this))
            }
            
        }
    }

    abstract execute(...args: any[]): any;
}

