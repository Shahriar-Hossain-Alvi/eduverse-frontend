import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import ErrorPage from "../Layout/ErrorPage";
import Main from "../Layout/Main";
import SignIn from "../Pages/Auth/SignIn";
import RoleBasedRedirect from "./RoleBasedRedirect";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import FacultyDashboard from "../Pages/Dashboard/FacultyDashboard";
import StudentDashboard from "../Pages/Dashboard/StudentDashboard";
import UserProfile from "../Pages/Auth/UserProfile";
import Signup from "../Pages/Auth/Signup";



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Main />} errorElement={<ErrorPage />}>

            {/* Public Routes */}
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<Signup />} />

            {/* Conditional Redirect Route */}
            <Route
                index
                element={
                    <RoleBasedRedirect />
                }
            />


           {/* Common Private Route */}
            <Route
                path="userProfile"
                element={
                    <PrivateRoute>
                        <UserProfile />
                    </PrivateRoute>
                }
            />

             {/* Role-Based Protected Routes */}

            {/* admin routes */}
            <Route
                path="admin/dashboard"
                element={
                    <PrivateRoute role="admin">
                        <AdminDashboard />
                    </PrivateRoute>
                }
            />




            {/* faculty routes */}
            <Route
                path="faculty/dashboard"
                element={
                    <PrivateRoute role="faculty">
                        <FacultyDashboard />
                    </PrivateRoute>
                }
            />



            {/* student routes */}
            <Route
                path="student/dashboard"
                element={
                    <PrivateRoute role="student">
                        <StudentDashboard />
                    </PrivateRoute>
                }
            />


        </Route>
    )
);

export default router;
