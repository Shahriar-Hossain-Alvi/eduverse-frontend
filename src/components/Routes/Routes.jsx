
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import ErrorPage from "../Layout/ErrorPage";
import Main from "../Layout/Main";
import SignIn from "../Pages/Auth/SignIn";



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/"
            element={<Main />}
            errorElement={<ErrorPage />}
        >

            {/* Public Routes */}
            <Route path="signin" element={<SignIn />} />


        </Route>
    )
);

export default router;
