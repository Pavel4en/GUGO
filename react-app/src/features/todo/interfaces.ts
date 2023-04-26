import {
    IAPIAnswer
} from "../../utils/webInterfaces";
// import {IPet} from "../pet/interfaces";

export interface ITask {
    _id: string,
    coins: number,
    completed: boolean,
    description: string,
    difficulty: number,
    name: string
}

