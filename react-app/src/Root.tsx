import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuthStatus} from "./features/authorization/hooks";


const RequireAuth = ({children}: { children?: JSX.Element }) => {
    const location = useLocation();
    const authStatus = useAuthStatus().value;

    return (
        <>{
            !authStatus &&
            location.pathname !== "/register" &&
            location.pathname !== "/login" ?
                <Navigate to={"/login"}/> : children
        }
        </>
    )
}


const Root = () => {
    const location = useLocation();

    return (
        <>
            <RequireAuth/>
            {location.pathname === '/' ? <Navigate to={"/todo"}/> : null}
            <Outlet/>
        </>
    );
}
export default Root;