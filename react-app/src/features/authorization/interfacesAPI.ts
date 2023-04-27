import {IAPIAnswer} from "../../utils/webInterfaces";

export interface IAPIAuth extends IAPIAnswer {
    data: {
        auth: boolean
    }
}