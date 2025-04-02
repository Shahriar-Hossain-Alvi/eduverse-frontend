import { FiBook, FiCalendar, FiFileText, FiUser, FiUsers, FiX } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrOverview } from "react-icons/gr";
import { LuBookPlus } from "react-icons/lu";
import { NavLink } from "react-router";


const FacultySidebar = () => {
  return (
    <aside>
      {/* sidebar for large devices */}
      <div className="w-32 md:w-64 bg-green-700 text-white p-3 md:p-6 hidden lg:block min-h-screen h-full
      ">
        <h1 className="text-lg md:text-2xl font-bold mb-8">Faculty Portal</h1>


        <nav>
          <ul id="facultySideBar" className="space-y-4 text-sm text-center md:text-base">
            <li><NavLink to="/faculty/dashboard" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

            <li><NavLink to="/faculty/courses" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

            <li><NavLink to="/faculty/myCourses" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiBook className="text-xl" /> <span>My Courses</span></NavLink></li>

            <li><NavLink to="/faculty/schedule" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

            <li><NavLink to="/faculty/students" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Students</span></NavLink></li>

            <li><NavLink to="/faculty/grades" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiFileText className="text-xl" /> <span>Grades</span></NavLink></li>

            <li><NavLink to="/faculty/addNewCourse" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><LuBookPlus className="text-xl" /> <span>Add new Course</span></NavLink></li>

            <li><NavLink to="/faculty/profile" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
          </ul>
        </nav>
      </div>




      {/* sidebar toggle for small and medium devices */}
      <div className="drawer fixed top-3 left-0 lg:hidden z-50 text-white w-10">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4" className="drawer-button rounded-none text-white btn bg-green-600 btn-sm border border-gray-600">
            <GiHamburgerMenu />
          </label>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>



          <div className="min-h-full w-80 p-4 menu bg-green-700 text-white">

            {/* sidebar close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Faculty Portal</h2>
              <label htmlFor="my-drawer-4" className="btn btn-sm btn-circle text-white btn-error">
                <FiX className="text-xl" />
              </label>
            </div>



            {/* Links to other pages */}
            <ul id="facultySideBar" className="space-y-4 text-sm text-center md:text-base">
              <li><NavLink to="/faculty/dashboard" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

              <li><NavLink to="/faculty/courses" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

              <li><NavLink to="/faculty/myCourses" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiBook className="text-xl" /> <span>My Courses</span></NavLink></li>

              <li><NavLink to="/faculty/schedule" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

              <li><NavLink to="/faculty/students" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Students</span></NavLink></li>

              <li><NavLink to="/faculty/grades" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiFileText className="text-xl" /> <span>Grades</span></NavLink></li>

              <li><NavLink to="/faculty/addNewCourse" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><LuBookPlus className="text-xl" /> <span>Add new Course</span></NavLink></li>

              <li><NavLink to="/faculty/profile" className="flex items-center space-x-2 hover:bg-green-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
            </ul>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default FacultySidebar;