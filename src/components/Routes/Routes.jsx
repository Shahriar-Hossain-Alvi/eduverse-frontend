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
import CreateNewCourse from "../Pages/AdminPages/Courses/CreateNewCourse";
import FacultyAssignedCourses from "../Pages/FacultyPages/FacultyAssignedCourses";
import SingleAssignedCourseDetails from "../Pages/FacultyPages/SingleAssignedCourseDetails";
import StudentAcademicInfo from "../Shared/CommonShared/StudentAcademicInfo/StudentAcademicInfo";
import StudentEnrolledCourses from "../Pages/StudentPages/StudentEnrolledCourses";
import SingleEnrolledCourseDetails from "../Pages/StudentPages/SingleEnrolledCourseDetails";
import SingleClassDetails from "../Shared/Admin&FacultyShared/SingleClassDetails";
import EnrolledCoursesClassDetails from "../Pages/StudentPages/EnrolledCoursesClassDetails";
import Schedules from "../Shared/CommonShared/Schedules";


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


            {/* visit users profile */}
            <Route
                path="StudentAcademicInfo/:id"
                element={
                    <StudentAcademicInfo />
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

                {/* visit users profile */}
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

                <Route
                    path="schedules"
                    element={
                        <PrivateRoute role="admin">
                            <Schedules />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="addNewCourse"
                    element={
                        <PrivateRoute role="admin">
                            <CreateNewCourse />
                        </PrivateRoute>
                    }
                />

            </Route>
            {/* admin routes end */}



            {/* =============== faculty routes ========= */}
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

                <Route
                    path="addNewCourse"
                    element={
                        <PrivateRoute role="faculty">
                            <CreateNewCourse />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="myCourses"
                    element={
                        <PrivateRoute role="faculty">
                            <FacultyAssignedCourses />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="myCourses/classDetails/:id"
                    element={
                        <PrivateRoute role="faculty">
                            <SingleClassDetails />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="myCourses/:id"
                    element={
                        <PrivateRoute role="faculty">
                            <SingleAssignedCourseDetails />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="schedules"
                    element={
                        <PrivateRoute role="faculty">
                            <Schedules />
                        </PrivateRoute>
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




            {/* ============ student routes =========== */}
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


                <Route
                    path="myEnrolledCourses"
                    element={
                        <PrivateRoute role="student">
                            <StudentEnrolledCourses />
                        </PrivateRoute>
                    }

                />

                <Route
                    path="myEnrolledCourses/:id"
                    element={
                        <PrivateRoute role="student">
                            <SingleEnrolledCourseDetails />
                        </PrivateRoute>
                    }

                />

                <Route
                    path="myEnrolledCourses/classDetails/:id"
                    element={
                        <PrivateRoute role="student">
                            <EnrolledCoursesClassDetails />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="schedules"
                    element={
                        <PrivateRoute role="student">
                            <Schedules />
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
