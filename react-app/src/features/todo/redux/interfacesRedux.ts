// Redux interfaces
import {ITask} from "../interfaces";

export interface IUpdateTasks {
    type: "todo/todoUpdated",
    payload: ITask[]
}
