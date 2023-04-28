import {createSlice} from "@reduxjs/toolkit"

import {
    IPet
} from "../interfaces"

import {IAPIPet} from "../API/interfacesAPI";

import petClassic from '../images/pet-pet/m-classic.png'

const initialState: IPet = {
    id: "",
    name: "",
    stats: {
        satiety: 100,
        caffeine: 100,
        happiness: 100
    },
    clothes: [] as string[],
    isSleeping: false,
    mood: petClassic
}

export const petSlice = createSlice({
    name: 'pet',
    initialState: initialState,
    reducers: {
        petSetup(state, action: { payload: IAPIPet, type: string }) {
            state = {...state, ...action.payload};
        },
        petChangedName(state, action: { payload: { newName: string }, type: string }) {
            state.name = action.payload.newName;
        },
        petAddedSatiety(state, action: { payload: { amount: number }, type: string }) {
            state.stats.satiety += action.payload.amount;
        },
        petAddedSleep(state, action: { payload: { amount: number }, type: string }) {
            state.stats.caffeine += action.payload.amount;
        },
        petAddedHappiness(state, action: { payload: { amount: number }, type: string }) {
            state.stats.happiness += action.payload.amount;
        },
        petReducedSatiety(state, action: { payload: { amount: number }, type: string }) {
            state.stats.satiety -= action.payload.amount;
        },
        petReducedSleep(state, action: { payload: { amount: number }, type: string }) {
            state.stats.caffeine -= action.payload.amount;
        },
        petReducedHappiness(state, action: { payload: { amount: number }, type: string }) {
            state.stats.happiness -= action.payload.amount;
        },
        petPutOnCloth(state, action: { payload: { clothID: string }, type: string }) {
            state.clothes.push(action.payload.clothID);
        },
        petRemovedCloth(state, action: { payload: { clothID: string }, type: string }) {
            const index = state.clothes.indexOf(action.payload.clothID);

            if (index === -1)
                throw Error("Cloth not found.") //TODO

            state.clothes.splice(index);
        },
        petToggledSleep(state) {
            state.isSleeping = !state.isSleeping;
        },
        petChangedMood(state, action: { payload: { newMood: string }, type: string }) {
            state.mood = action.payload.newMood;
        }
    }
})

export const {
    petSetup,
    petChangedName,
    petAddedSatiety,
    petAddedHappiness,
    petAddedSleep,
    petReducedSatiety,
    petReducedHappiness,
    petReducedSleep,
    petPutOnCloth,
    petRemovedCloth,
    petToggledSleep,
    petChangedMood
} = petSlice.actions;

export const selectName = (state: any) => {
    return state.pet.name;
}

export const selectStats = (state: any) => {
    return state.pet.stats;
}

export const selectClothes = (state: any) => {
    return state.pet.clothes;
};

export const selectMood = (state: any) => {
    return state.pet.mood;
}

export default petSlice.reducer;
