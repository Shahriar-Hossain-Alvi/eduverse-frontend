import { FiBook, FiCalendar, FiFileText, FiUser, FiUsers } from "react-icons/fi";
import { GrOverview } from "react-icons/gr";
import { NavLink } from "react-router";


const FacultySidebar = () => {
    return (
        <aside className="w-32 md:w-64 bg-green-700 text-white p-3 md:p-6">
        <h1 className="text-lg md:text-2xl font-bold mb-8">Faculty Portal</h1>

        
        <nav>
          <ul id="facultySideBar" className="space-y-4 text-sm text-center md:text-base">
            <li><NavLink to="/faculty/dashboard" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

            <li><NavLink to="/faculty/myCourses" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiBook className="text-xl" /> <span>My Courses</span></NavLink></li>

            <li><NavLink to="/faculty/schedule" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

            <li><NavLink to="/faculty/students" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Students</span></NavLink></li>

            <li><NavLink to="/faculty/grades" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiFileText className="text-xl" /> <span>Grades</span></NavLink></li>

            <li><NavLink to="/faculty/profile" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
          </ul>
        </nav>
      </aside>
    );
};

export default FacultySidebar;