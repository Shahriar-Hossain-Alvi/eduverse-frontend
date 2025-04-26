import useAuth from "../../Hooks/useAuth";
import SectionHeading from "../../Utilities/SectionHeading";
import useTheme from "../../Hooks/useTheme";
import themeStyles from "../../Utilities/themeStyles"
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { format, isToday } from "date-fns";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { Link } from "react-router";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";



const StudentDashboard = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: studentOverview = {}, isPending, isError, error } = useQuery({
        queryKey: ["quickOverview", user?._id],
        queryFn: async () => {
            const res = await axiosSecure(`/quickOverview/student/${user._id}`);
            if (res.data.success) return res.data.data
        },
        enabled: user?.user_role === "student"
    });


    const formatClassTime = (timestamp) => {
        const date = new Date(timestamp);

        // check if the date prefix
        const dayPrefix = isToday(date) ? "Today" : format(date, "MMMM d, yyyy");


        // formate the time
        const timeString = format(date, "h:mm a");

        return `${dayPrefix}, ${timeString}`;
    }


    if (isPending) return <LoadingSpinner />


    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title={`Welcome, ${user?.first_name}`} />

            {isError && <TanstackQueryErrorMessage error={error.message} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* enrolled courses */}
                <div className={`${themeStyles.background[theme]} p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
                    <h3 className="text-xl font-semibold mb-2">Enrolled Courses</h3>
                    <p className="text-3xl font-bold text-blue-600">{studentOverview?.total_Enrolled_courses}</p>
                </div>


                {/* average grade */}
                <div className={`${themeStyles.background[theme]} p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
                    <h3 className="text-xl font-semibold mb-2">Average Grade</h3>
                    <p className="text-3xl font-bold text-blue-600">{studentOverview.avgPercentage}%</p>
                </div>


                {/* average attendance */}
                <div className={`${themeStyles.background[theme]} p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
                    <h3 className="text-xl font-semibold mb-2">Attendance</h3>
                    <p className="text-3xl font-bold text-blue-600">{studentOverview.avgAttendance}%</p>
                </div>
            </div>

            {/* Course List */}
            <div className={`${themeStyles.background[theme]} p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Last Enrolled Course</h3>

                {
                    Object.keys(studentOverview?.latest_Enrolled_Courses).length === 0 ?
                        <div className="flex flex-col md:flex-row items-center justify-between text-center space-y-1 md:space-y-0">
                            <span className="font-medium">
                                Not enrolled in any courses
                            </span>
                        </div>

                        :
                        <div className="flex flex-col md:flex-row items-center justify-between text-center space-y-1 md:space-y-0">
                            <span className="font-medium">{studentOverview?.latest_Enrolled_Courses?.latest_Enrolled_Course_title}</span>

                            <span className="text-sm mr-4">Starts : {format(new Date(studentOverview.latest_Enrolled_Courses.latest_Enrolled_start_date), "MMMM d, yyyy")}</span>

                            <Link to={`/student/myEnrolledCourses/${studentOverview?.latest_Enrolled_Courses?.latest_Enrolled_Course_Id}`} className={`btn btn-sm md:btn-md ${themeStyles.button[theme]}`}>View</Link>
                        </div>
                }


            </div>



            {/* Upcoming Schedule */}
            <div className={`${themeStyles.background[theme]} p-3 md:p-6 rounded-lg shadow-md mt-10`}>
                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Upcoming Schedule</h3>

                {
                    studentOverview.upcoming_classes.length === 0 
                    ? 
                        <h2 className="font-medium">No Upcoming Schedules</h2>
                    :
                        <ul className="space-y-4 text-sm md:text-base">
                            {
                                studentOverview.upcoming_classes.map(classSchedule => <li key={classSchedule._id} className="grid grid-cols-1 md:grid-cols-6 text-center md:text-left items-center justify-between space-y-2 md:space-y-0 border md:border-none p-2 md:p-0">
                                    <span className="font-medium md:col-span-3">{classSchedule.title}</span>

                                    <span className="text-sm md:col-span-2">{formatClassTime(classSchedule.scheduled_time)}</span>

                                    <Link to={`/student/myEnrolledCourses/classDetails/${classSchedule._id}`} className={`btn btn-sm md:btn-md ${themeStyles.button[theme]}`}>Details</Link>
                                </li>)
                            }
                        </ul>
                }



            </div>
        </div>
    );
};

export default StudentDashboard;