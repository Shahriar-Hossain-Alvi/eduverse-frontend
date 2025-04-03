import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { FiBook, FiCalendar, FiFileText, FiUser } from "react-icons/fi";
import { GrOverview } from "react-icons/gr";
import { NavLink } from "react-router";


const StudentSidebar = () => {
  return (
    <aside>
      {/* sidebar for large device */}
      <div className="w-32 md:w-64 bg-eduverse_student_primary_color text-white p-3 md:p-6 hidden lg:block min-h-screen h-full">
        <h1 className="text-lg md:text-2xl font-bold mb-8">Student Portal</h1>
        <nav>
          <ul id="studentSideBar" className="space-y-4 text-sm text-center md:text-base">
            <li><NavLink to="/student/dashboard" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

            <li><NavLink to="/student/courses" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

            <li><NavLink to="/student/myEnrolledCourses" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiBook className="text-xl" /> <span>My Courses</span></NavLink></li>

            <li><NavLink to="/student/schedules" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedules</span></NavLink></li>

            <li><NavLink to="/student/grades" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiFileText className="text-xl" /> <span>Grades</span></NavLink></li>

            <li><NavLink to="/student/profile" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
          </ul>
        </nav>
      </div>



      {/* sidebar toggle for small and medium devices */}
      <div className="drawer fixed top-3 lg:hidden z-50 text-white w-10">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4" className="drawer-button rounded-none text-white btn bg-eduverse_student_primary_color_lite btn-sm border border-gray-600">
            <FaAnglesRight />
          </label>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

          <div className='min-h-full w-80 p-4 menu text-white  bg-eduverse_student_primary_color'>

            {/* sidebar close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Student Portal</h2>
              <label htmlFor="my-drawer-4" className="btn btn-sm btn-circle text-white btn-error">
                <FaAnglesLeft className="text-xl" />
              </label>
            </div>

            <ul id="studentSideBar" className="space-y-4 text-sm text-center md:text-base">

              <li><NavLink to="/student/dashboard" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

              <li><NavLink to="/student/courses" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

              <li><NavLink to="/student/myEnrolledCourses" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiBook className="text-xl" /> <span>My Courses</span></NavLink></li>

              <li><NavLink to="/student/schedules" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedules</span></NavLink></li>

              <li><NavLink to="/student/grades" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiFileText className="text-xl" /> <span>Grades</span></NavLink></li>

              <li><NavLink to="/student/profile" className="flex items-center space-x-2 hover:bg-eduverse_student_primary_color_lite p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
            </ul>
          </div>


        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;