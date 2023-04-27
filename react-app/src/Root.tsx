import {Outlet, redirect} from "react-router-dom";
import {authAPI} from "./features/authorization/authAPI";
import {useEffect} from "react";

const Root = () => {
    useEffect(
        () => {
            authAPI.getAuth()
                .then((answer) => {
                    if (!answer.data.auth)
                        redirect('/register');
                });
        }
    , []);
    return (
        <>
            <Outlet/>
        </>
    );
}
export default Root;