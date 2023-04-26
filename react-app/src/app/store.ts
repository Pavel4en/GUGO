import {configureStore} from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice"
import petReducer from "../features/pet/petSlice"

export default configureStore({
    reducer: {
        todo: todoReducer,
        pet: petReducer
    }
})
