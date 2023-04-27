// Pet API interfaces
import {IAPIAnswer} from "../../../utils/webInterfaces";
import {IPet} from "../interfaces";

export interface IAPIPet extends IAPIAnswer {
    _id: string,
    gems: number,
    inventory: string[],
    data: {
        "name": string,
        "hunger": number,
        "hungerPerSec": number,
        "caffeine": number,
        "caffeinePerSec": number,
        "happiness": number,
        "happinessPerSec": number,
        "lastUpdateUnixtime": number,
        "isSleepingNow": boolean,
        "wornThingsIds": string[]
    }
}
