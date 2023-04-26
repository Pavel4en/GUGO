import {
    ITask
} from "./interfaces";

import {sendPostOnURL} from "../../utils/webUtils"
import {IAPIAnswer} from "../../utils/webInterfaces";

const todoAPI_URL = 'http://localhost:5000'


export const todoAPI = {
    getCompletedTasks: () => {
        return sendPostOnURL<ITask[]>(todoAPI_URL + '/completed_tasks');
    },
    getIncompletedTasks: () => {
        return sendPostOnURL<ITask[]>(todoAPI_URL + '/completed_tasks');
    },
    addTask: (data: { name: string, description: string }) => {
        return sendPostOnURL<IAPIAnswer>(todoAPI_URL + '/add_task', data);
    }
}
