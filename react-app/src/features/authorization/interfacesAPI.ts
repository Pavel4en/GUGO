import {IAPIAnswer} from "../../utils/webInterfaces";

export interface IAPIAuth extends IAPIAnswer {
    data: {
        auth: boolean
    }
}
export interface IAPILogin extends IAPIAnswer {
    headers: {
        "Set-Cookie": string
    }
}
