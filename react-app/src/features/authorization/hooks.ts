import {useEffect, useState} from "react";
import {authAPI} from "./authAPI";

export const useAuthStatus = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = () => {
        return authAPI.getAuth()
            .then((answer) => setIsAuth(answer.data.auth));
    }

    const authProps = {
        value: isAuth,
        checkAuth: checkAuth
    }

    return authProps;
}

