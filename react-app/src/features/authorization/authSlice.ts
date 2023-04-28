import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    session: ''
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setSession(state, action: {payload: {session: string}, type: string}) {
            state.session = action.payload.session;
        }
    }
})

export const selectSession = (state: any) => {
    return state.auth.session;
}

export const {
    setSession
} = authSlice.actions;

export default authSlice.reducer;