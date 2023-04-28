import {sendPostOnURL} from "../../../utils/webUtils";
import {IAPIPet} from "./interfacesAPI";

const petAPI_URL = 'http://localhost:5000/todoapi'

export const petAPI = {
    getPet: (): Promise<IAPIPet> => {
        return sendPostOnURL<IAPIPet>(petAPI_URL + '/get_pet')
    },
    sendFeedPet: (foodID: string) => {
        return sendPostOnURL(
            petAPI_URL + '/feed_pet',
            {
                foodID: foodID
            }
        );
    },
    sendAddHappiness: () => {
        return sendPostOnURL(
            petAPI_URL + '/add_happiness',
            {}
        )
    },
    sendToggleSleep: () => {
        return sendPostOnURL(
            petAPI_URL + '/toggle_sleep',
            {}
        )
    },
    sendPutOnClothes: (clothesID: string) => {
        return sendPostOnURL(
            petAPI_URL + '/put_on_cloth',
            {
                clothesID: clothesID
            }
        );
    },
    sendRemoveClothes: (clothesID: string) => {
        return sendPostOnURL(
            petAPI_URL + '/remove_cloth',
            {
                clothesID: clothesID
            }
        )
    },
    sendChangeName: (newName: string) => {
        return sendPostOnURL(
            petAPI_URL + '/change_name',
            {
                newName: newName
            }
        )
    }
}
