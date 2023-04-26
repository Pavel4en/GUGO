import {createSlice} from "@reduxjs/toolkit"
import {
    ITask
} from "./interfaces"


const initialState = {
    entities: [] as ITask[],
    status: "loading"
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState: initialState,
    reducers: {
        todoUpdated(state, action) {
            state.entities = action.payload;
        },
        todoAdded(state, action: { payload: ITask, type: string }) {
            state.entities.push(action.payload);
        },
        todoDeleted(state, action) {
            const todoIndex = state.entities.findIndex(todo => todo._id === action.payload);

            if (todoIndex === -1)
                throw Error("TODO doesn't exist");
            else
                state.entities.splice(todoIndex, 1);
        },
        todoEdited(state, action) {
            const todo = state.entities.find(todo => todo._id === action.payload._id)

            if (todo === undefined)
                throw Error("TODO doesn't exist");

            todo.name = action.payload.name;
            todo.description = action.payload.description;
        },
        todoToggled(state, action) {
            const todo = state.entities.find(todo => todo._id === action.payload._id)

            if (todo === undefined)
                throw Error("TODO doesn't exist");

            todo.completed = !action.payload.completed;
        },
        todoLoaded(state) {
            return {
                ...state,
                status: 'OK'
            }
        },
        todoLoading(state) {
            return {
                ...state,
                status: 'loading'
            }
        }
    },
})

export const {
    todoUpdated,
    todoAdded,
    todoDeleted,
    todoEdited,
    todoLoaded,
    todoLoading,
    todoToggled
} = todoSlice.actions;

export const selectTasks = (state: any) => {
    return state.todo.entities;
};

export default todoSlice.reducer;
