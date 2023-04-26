import {IPet} from "./interfaces";

import {getJSONFromURL, sendDataOnURL} from "../../utils/webUtils";

const petAPI_URL = 'http://localhost:5000/gameapi'

export const petAPI = {
    getPet: () => {
        return getJSONFromURL<IPet>(petAPI_URL + '/get_pet_data',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            })
    },
    sendFoodEaten: (foodID: string) => {
        return sendDataOnURL(
            petAPI_URL + '/feed_pet',
            {
                foodID: foodID
            }
        );
    },
    sendHappinessAdded: () => {}, //
    sendClothesPutOn: (clothesID: string) => {
        return sendDataOnURL(
            petAPI_URL + '/put_on_item',
            {
                clothesID: clothesID
            }
        );
    },
    sendClothesRemoved: (clothesID: string) => {
        return sendDataOnURL(
            petAPI_URL + '/remove_item',
            {
                clothesID: clothesID
            }
        )
    },
    sendSleepToggled: () => {
        return sendDataOnURL(
            petAPI_URL + 'toggle_sleep',
            {}
        )
    }
}
