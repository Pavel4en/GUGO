import {IAPIAnswer} from "../../utils/webInterfaces";
import {ITask} from "./interfaces";

export interface IAPITasks extends IAPIAnswer {
    data: ITask[]
}