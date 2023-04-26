import {configureStore} from "@reduxjs/toolkit";
import todoReducer from "../features/todo/redux/todoSlice"
import petReducer from "../features/pet/redux/petSlice"

export default configureStore({
    reducer: {
        todo: todoReducer,
        pet: petReducer
    }
})
