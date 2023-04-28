import {sendPostOnURL} from "../../utils/webUtils";
import {IAPIAuth, IAPILogin} from "./interfacesAPI";
import {IAPIAnswer} from "../../utils/webInterfaces";

const authAPI_URL = 'http://localhost:5000/todoapi'

export const authAPI = {
    getAuth: () => {
        return sendPostOnURL<IAPIAuth>(authAPI_URL + '/get_auth');
    },
    sendRegister: (data: {username: string, petname: string, password: string}) => {
        return sendPostOnURL<IAPIAnswer>(authAPI_URL + '/register', data);
    },
    sendLogin: (data: {username: string, password: string}) => {
        return sendPostOnURL<IAPILogin>(authAPI_URL + '/login', data);
    }
}