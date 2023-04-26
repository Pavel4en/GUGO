import {IPet} from "../interfaces";

import {sendPostOnURL} from "../../../utils/webUtils";

const petAPI_URL = 'http://localhost:5000/gameapi'

export const petAPI = {
    getPet: () => {
        return sendPostOnURL<IPet>(petAPI_URL + '/get_pet_data')
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
