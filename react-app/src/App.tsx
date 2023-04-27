import React from "react";

import PetApp from "./features/pet/Pet";
import TodoApp from "./features/todo/Todo";
import LoginApp from "./features/authorization/Login";
import RegistrationApp from "./features/authorization/Registration";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Root from "./Root"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <div>jostkiy oshibka da??</div>, //TODO
        children: [
            {
                path: "/registration",
                element: <RegistrationApp/>
            },
            {
                path: "/login",
                element: <LoginApp/>
            },
            {
                path: "/pet",
                element: <PetApp/>
            },
            {
                path: "/todo",
                element: <TodoApp/>
            }
        ],
    },
]);

const App = () => {
    return (
        <RouterProvider router={router}/>
    );
}
export default App;