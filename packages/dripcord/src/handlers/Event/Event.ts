import { Events } from "discord.js";
import {Bot} from "../../interfaces/Bot.js";

export enum DripcordEvents {
}
  

export abstract class Event {
    public name: string;
    public once?: boolean;
    private client!: Bot

    constructor(name: Events, once = false) {
        this.name = name;
        this.once = once;
    }

    public getClient() {
        return this.client;
    }
    public setClient(client: Bot) {
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

