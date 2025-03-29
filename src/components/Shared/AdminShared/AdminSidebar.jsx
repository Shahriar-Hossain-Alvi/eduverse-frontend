import { FiBook, FiCalendar, FiPieChart, FiUser, FiUsers } from 'react-icons/fi';
import { GrOverview } from 'react-icons/gr';
import { IoMdPersonAdd } from 'react-icons/io';
import { LuBookPlus } from 'react-icons/lu';
import { NavLink } from 'react-router';
import { GiHamburgerMenu } from "react-icons/gi";



const AdminSidebar = () => {
    return (
        <aside>
            {/* sidebar for large device */}
            <div className="w-32 md:w-64 bg-indigo-700 text-white p-3 md:p-6 hidden lg:block min-h-screen">
                <h1 className="text-lg md:text-2xl font-bold mb-8">Admin Portal</h1>


                <nav>
                    <ul id="adminSideBar" className="space-y-4 text-sm text-center md:text-base">
                        <li><NavLink to="/admin/dashboard" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

                        <li><NavLink to="/admin/users" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Users</span></NavLink></li>

                        <li><NavLink to="/admin/courses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

                        <li><NavLink to="/admin/schedule" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

                        <li><NavLink to="/admin/reports" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiPieChart className="text-xl" /> <span>Reports</span></NavLink></li>

                        <li><NavLink to="/admin/createAccounts" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><IoMdPersonAdd className="text-xl" /> <span>Create Accounts</span></NavLink></li>

                        <li><NavLink to="/admin/addNewCourse" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><LuBookPlus className="text-xl" /> <span>Add new Course</span></NavLink></li>

                        <li><NavLink to="/admin/profile" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
                    </ul>
                </nav>
            </div>



            {/* sidebar toggle for small and medium devices */}
            <div className="drawer fixed top-3 left-1
             lg:hidden z-50 text-white">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary btn-sm">
                    <GiHamburgerMenu />
                    </label>
                </div>

                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                    <ul id="adminSideBar" className="space-y-4 text-sm text-center md:text-base menu bg-indigo-700 min-h-full w-80 p-4">
                        <li><NavLink to="/admin/dashboard" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

                        <li><NavLink to="/admin/users" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Users</span></NavLink></li>

                        <li><NavLink to="/admin/courses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

                        <li><NavLink to="/admin/schedule" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

                        <li><NavLink to="/admin/reports" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiPieChart className="text-xl" /> <span>Reports</span></NavLink></li>

                        <li><NavLink to="/admin/createAccounts" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><IoMdPersonAdd className="text-xl" /> <span>Create Accounts</span></NavLink></li>

                        <li><NavLink to="/admin/addNewCourse" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><LuBookPlus className="text-xl" /> <span>Add new Course</span></NavLink></li>

                        <li><NavLink to="/admin/profile" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;