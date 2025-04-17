import BotClient from "../BotClient.js";

export interface Plugin {
    name: string;
    version: string;
    author: string;
    description?: string;
    init(client: BotClient): void;
    shutdown?(client: BotClient): void;
}