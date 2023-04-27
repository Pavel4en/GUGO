import {sendPostOnURL} from "../../utils/webUtils";
import {IAPIAuth} from "./interfacesAPI";

const authAPI_URL = 'https://localhost:5000/todoapi'

export const authAPI = {
    getAuth: () => {
        return sendPostOnURL<IAPIAuth>(authAPI_URL + '/get_auth');
    }
}