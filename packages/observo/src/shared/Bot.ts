import { BotStatus } from "./BotStatus"

export interface Bot {
    img: string 
    name: string 
    status: BotStatus
    presence: string
    clientId: string
}