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
import AdminProfile from "../Pages/AdminPages/AdminProfile";
import ManageUsers from "../Pages/AdminPages/ManageUsers/ManageUsers";
import EditUserDetails from "../Pages/AdminPages/ManageUsers/EditUserDetails";
import Courses from "../Shared/CommonShared/Courses/Courses";
import CourseDetails from "../Shared/CommonShared/Courses/CourseDetails";



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

                < Route
                    path="profile"
                    element={
                        < PrivateRoute role="admin" >
                            <AdminProfile />
                        </PrivateRoute >
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

                <Route
                    path="courses"
                    element={
                        <PrivateRoute role="admin">
                            <Courses />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="courses/:id"
                    element={
                        <PrivateRoute role="admin">
                            <CourseDetails />
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

                <Route
                    path="courses"
                    element={
                        <PrivateRoute role="faculty">
                            <Courses />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="courses/:id"
                    element={
                        <PrivateRoute role="faculty">
                            <CourseDetails />
                        </PrivateRoute>
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


                <Route
                    path="courses"
                    element={
                        <PrivateRoute role="student">
                            <Courses />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="courses/:id"
                    element={
                        <PrivateRoute role="student">
                            <CourseDetails />
                        </PrivateRoute>
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
