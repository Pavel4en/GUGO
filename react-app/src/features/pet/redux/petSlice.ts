import {createSlice} from "@reduxjs/toolkit"
import {
    IPet
} from "../interfaces"


const initialState: IPet = {
    id: "",
    name: "",
    stats: {
        satiety: 100,
        sleep: 100,
        happiness: 100
    },
    clothes: [] as string[],
    isSleeping: false
}

export const petSlice = createSlice({
    name: 'pet',
    initialState: initialState,
    reducers: {
        petSetup(state, action: {payload: IPet, type: string}) {
            state = {...state, ...action.payload};
        },
        petChangedName(state, action: {payload: {newName: string}, type: string}) {
            state.name = action.payload.newName;
        },
        petAddedSatiety(state, action: {payload: {amount: number}, type: string}) {
            state.stats.satiety += action.payload.amount;
        },
        petAddedSleep(state, action: {payload: {amount: number}, type: string}) {
            state.stats.sleep += action.payload.amount;
        },
        petAddedHappiness(state, action: {payload: {amount: number}, type: string}) {
            state.stats.happiness += action.payload.amount;
        },
        petPutOnCloth(state, action: {payload: {clothID: string}, type: string}) {
            state.clothes.push(action.payload.clothID);
        },
        petRemovedCloth(state, action: {payload: {clothID: string}, type: string}) {
            const index = state.clothes.indexOf(action.payload.clothID);

            if (index === -1)
                throw Error("Cloth not found.") //TODO

            state.clothes.splice(index);
        },
        petToggledSleep(state) {
            state.isSleeping = !state.isSleeping;
        }
    }
})

export const {
    petSetup,
    petChangedName,
    petAddedSatiety,
    petAddedHappiness,
    petAddedSleep,
    petPutOnCloth,
    petRemovedCloth,
    petToggledSleep
} = petSlice.actions;

export const selectName = (state: any) => {
    return state.pet.name;
}

export const selectCharacteristics = (state: any) => {
    return state.pet.stats;
}

export const selectClothes = (state: any) => {
    return state.pet.clothes;
};

export default petSlice.reducer;
