import {Bot} from "./Bot";

export interface Plugin {
    name: string;
    version: string;
    author: string;
    description?: string;
    init(client: Bot): void;
    shutdown?(client: Bot): void;
}