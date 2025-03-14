import { FiBook, FiCalendar, FiFileText, FiUser } from "react-icons/fi";
import { GrOverview } from "react-icons/gr";
import { NavLink } from "react-router";


const StudentSidebar = () => {
    return (
        <aside className="w-32 md:w-64 bg-eduverse_primary_color text-white p-3 md:p-6">
        <h1 className="text-lg md:text-2xl font-bold mb-8">Student Portal</h1>
        <nav>
          <ul id="studentSideBar" className="space-y-4 text-sm text-center md:text-base">
            <li><NavLink to="/student/dashboard" className="flex items-center space-x-2 hover:bg-eduverse_primary_lite p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

            <li><NavLink to="/student/courses" className="flex items-center space-x-2 hover:bg-eduverse_primary_lite p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

            <li><NavLink to="/student/myEnrolledCourses" className="flex items-center space-x-2 hover:bg-eduverse_primary_lite p-2 rounded"><FiBook className="text-xl" /> <span>My Courses</span></NavLink></li>

            <li><NavLink to="/student/schedule" className="flex items-center space-x-2 hover:bg-eduverse_primary_lite p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

            <li><NavLink to="/student/grades" className="flex items-center space-x-2 hover:bg-eduverse_primary_lite p-2 rounded"><FiFileText className="text-xl" /> <span>Grades</span></NavLink></li>

            <li><NavLink to="/student/profile" className="flex items-center space-x-2 hover:bg-eduverse_primary_lite p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
          </ul>
        </nav>
      </aside>
    );
};

export default StudentSidebar;