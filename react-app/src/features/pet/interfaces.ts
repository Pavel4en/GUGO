// Interfaces
import {IAPIAnswer} from "../../utils/webInterfaces";

export interface IStats {
    satiety: number,
    sleep: number,
    happiness: number,
}

export interface IPet {
    id: string,
    name: string,
    stats: IStats,
    clothes: string[],
    isSleeping: boolean
}
