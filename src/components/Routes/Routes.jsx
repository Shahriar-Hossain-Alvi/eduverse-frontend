import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import ErrorPage from "../Layout/ErrorPage";
import Main from "../Layout/Main";
import SignIn from "../Pages/Auth/SignIn";
import RoleBasedRedirect from "./RoleBasedRedirect";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../Pages/AdminPages/AdminDashboard";
import FacultyDashboard from "../Pages/FacultyPages/FacultyDashboard";
import StudentDashboard from "../Pages/StudentPages/StudentDashboard";
import FacultyProfile from "../Pages/FacultyPages/FacultyProfile";
import StudentProfile from "../Pages/StudentPages/StudentProfile";


const router = createBrowserRouter(

    createRoutesFromElements(
        <Route path="/" element={<Main />} errorElement={<ErrorPage />}>

            {/* Public Routes */}
            <Route path="signin" element={<SignIn />} />

            {/* Conditional Redirect Route */}
            <Route
                index
                element={
                    <RoleBasedRedirect />
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

            <Route
                path="faculty/profile"
                element={
                    <PrivateRoute role="faculty">
                        <FacultyProfile />
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


            <Route
                path="student/profile"
                element={
                    <PrivateRoute role="student">
                        <StudentProfile />
                    </PrivateRoute>
                }
            />

        </Route>
    )
);

export default router;
