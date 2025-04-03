import useAuth from "../../Hooks/useAuth";
import SectionHeading from "../../Utilities/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { format, isToday } from "date-fns"
import useTheme from "../../Hooks/useTheme";
import themeStyles from "../../Utilities/themeStyles";
import { Link } from "react-router";


const FacultyDashboard = () => {
  //todo:
  // show total class+course materials shared number
  // show 3 recently assigned courses list

  const { theme } = useTheme();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: facultyOverview = {}, isPending, isError, error } = useQuery({
    queryKey: ["facultyOverview"],
    queryFn: async () => {
      const id = user._id
      const res = await axiosSecure.get(`/quickOverview/faculty/${id}`);

      return res.data.data;
    },
    enabled: user?.user_role === "faculty"
  })


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

      {isError && <p>{error.message}</p>}

      <SectionHeading title={`Welcome, ${user?.first_name} ${user?.last_name}`} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* course teaching */}
        <div className={`p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${themeStyles.background[theme]}`}>
          <h3 className="text-xl font-semibold mb-2">Courses Teaching</h3>
          <p className="text-3xl font-bold text-green-600">{facultyOverview.total_courses_teaching}</p>
        </div>

        {/* total students */}
        <div className={`p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${themeStyles.background[theme]}`}>
          <h3 className="text-xl font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">{facultyOverview.total_enrolled_students_for_this_faculty}</p>
        </div>
      </div>


      {/* recently assigned courses  */}
      <div className={`p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${themeStyles.background[theme]} mb-8`}>
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Recently Assigned Courses</h3>

        <div className="flex flex-col md:flex-row items-center justify-between text-center space-y-1 md:space-y-0">
          <span className="font-medium">{facultyOverview?.latest_Assigned_Course?.latest_Assigned_Course_title}</span>

          <span className="text-sm text-gray-500 mr-4">Starts : {format(new Date(facultyOverview.latest_Assigned_Course.latest_Assigned_Course_start_date), "MMMM d, yyyy")}</span>

          <Link to={`/faculty/myCourses/${facultyOverview?.latest_Assigned_Course?.latest_Assigned_Course_Id}`} className={`btn btn-sm md:btn-md ${themeStyles.button[theme]}`}>View</Link>
        </div>
      </div>



      {/* Upcoming Schedule */}
      <div className={`${themeStyles.background[theme]} p-3 md:p-6 rounded-lg shadow-md`}>
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Upcoming Schedule</h3>


        <ul className="space-y-4 text-sm md:text-base">
          {
            facultyOverview.upcoming_Class_Schedules.map(classSchedule => <li key={classSchedule._id} className="grid grid-cols-1 md:grid-cols-6 text-center md:text-left items-center justify-between space-y-2 md:space-y-0 border md:border-none p-2 md:p-0">
              <span className="font-medium md:col-span-3">{classSchedule.title}</span>

              <span className="text-sm md:col-span-2">{formatClassTime(classSchedule.scheduled_time)}</span>

              <Link to={`/faculty/myCourses/classDetails/${classSchedule._id}`} className={`btn btn-sm md:btn-md ${themeStyles.button[theme]}`}>Details</Link>
            </li>)
          }
        </ul>
      </div>
    </div>
  );
};

export default FacultyDashboard;