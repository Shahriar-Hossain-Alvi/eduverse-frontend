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
import CreateAccounts from "../Pages/AdminPages/CreateAccounts";
import FacultyLayout from "../Layout/FacultyLayout";
import StudentLayout from "../Layout/StudentLayout";
import AdminLayout from "../Layout/AdminLayout";
import ManageUsers from "../Pages/AdminPages/ManageUsers";
import EditUserDetails from "../Pages/AdminPages/EditUserDetails";


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

            {/* admin routes start */}
            <Route path="admin" element={<AdminLayout />} errorElement={<ErrorPage />}
            >
                <Route
                    index
                    element={
                        <RoleBasedRedirect />
                    }
                />

                <Route
                    path="dashboard"
                    element={
                        <PrivateRoute role="admin">
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="createAccounts"
                    element={
                        <PrivateRoute role="admin">
                            <CreateAccounts />
                        </PrivateRoute>
                    }
                />

                <Route path="users" element={
                    <PrivateRoute role="admin">
                        <ManageUsers />
                    </PrivateRoute>
                } />

                <Route
                    path="users/:id"
                    element={
                        <PrivateRoute role="admin">
                            <EditUserDetails />
                        </PrivateRoute>
                    }
                />
            </Route>
            {/* admin routes end */}



            {/* faculty routes */}
            < Route path="faculty" element={< FacultyLayout />} errorElement={< ErrorPage />}>

                {/* for auto redirects */}
                < Route
                    index
                    element={
                        < RoleBasedRedirect />
                    }
                />

                < Route
                    path="dashboard"
                    element={
                        < PrivateRoute role="faculty" >
                            <FacultyDashboard />
                        </PrivateRoute >
                    }
                />

                < Route
                    path="profile"
                    element={
                        < PrivateRoute role="faculty" >
                            <FacultyProfile />
                        </PrivateRoute >
                    }
                />

            </Route >




            {/* student routes */}
            < Route path="student" element={< StudentLayout />} errorElement={< ErrorPage />}>
                {/* for auto redirects */}
                < Route
                    index
                    element={
                        < RoleBasedRedirect />
                    }
                />


                < Route
                    path="dashboard"
                    element={
                        < PrivateRoute role="student" >
                            <StudentDashboard />
                        </PrivateRoute >
                    }
                />


                < Route
                    path="profile"
                    element={
                        < PrivateRoute role="student" >
                            <StudentProfile />
                        </PrivateRoute >
                    }
                />
            </Route >

        </Route >
    )
);

export default router;
