
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import ErrorPage from "../Layout/ErrorPage";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Main />} errorElement={<ErrorPage />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
        </Route>
    )
);

export default router;
