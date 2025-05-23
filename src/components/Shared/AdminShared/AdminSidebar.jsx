import { FiBook, FiCalendar, FiUser, FiUsers } from 'react-icons/fi';
import { GrOverview } from 'react-icons/gr';
import { IoMdPersonAdd } from 'react-icons/io';
import { LuBookPlus } from 'react-icons/lu';
import { NavLink } from 'react-router';
import { FaAnglesLeft, FaAnglesRight, FaRegCalendarCheck } from 'react-icons/fa6';



const AdminSidebar = () => {
    return (
        <aside>
            {/* sidebar for large device */}
            <div className="w-32 md:w-64 bg-indigo-700 text-white p-3 md:p-6 hidden lg:block min-h-screen h-full">
                <h1 className="text-lg md:text-2xl font-bold mb-8">Admin Portal</h1>


                <nav>
                    <ul id="adminSideBar" className="space-y-4 text-sm text-center md:text-base">
                        <li><NavLink to="/admin/dashboard" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

                        <li><NavLink to="/admin/users" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Users</span></NavLink></li>

                        <li><NavLink to="/admin/courses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiBook className="text-xl" /> <span>All Courses</span></NavLink></li>

                        <li><NavLink to="/admin/schedules" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Class Schedules</span></NavLink></li>

                        <li><NavLink to="/admin/assignedCourses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiBook className="text-xl" /> <span>Assigned Courses</span></NavLink></li>

                        <li><NavLink to="/admin/allClassAttendance" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FaRegCalendarCheck className="text-xl" /> <span>Class Attendance</span></NavLink></li>

                        <li><NavLink to="/admin/createAccounts" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><IoMdPersonAdd className="text-xl" /> <span>Create Accounts</span></NavLink></li>

                        <li><NavLink to="/admin/addNewCourse" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><LuBookPlus className="text-xl" /> <span>Add new Course</span></NavLink></li>

                        <li><NavLink to="/admin/profile" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
                    </ul>
                </nav>
            </div>



            {/* sidebar toggle for small and medium devices */}
            <div className="drawer fixed top-3
             lg:hidden z-50 text-white w-10">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button rounded-none text-white btn bg-indigo-600 btn-sm border border-gray-600">
                        <FaAnglesRight />
                    </label>
                </div>

                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                    <div className='min-h-full w-80 p-4 menu text-white  bg-indigo-700'>

                        {/* sidebar close button */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Admin Portal</h2>
                            <label htmlFor="my-drawer-4" className="btn btn-sm btn-circle text-white btn-error">
                                <FaAnglesLeft className="text-xl" />
                            </label>
                        </div>

                        <ul id="adminSideBar" className="space-y-4 text-sm text-center md:text-base">
                            <li><NavLink to="/admin/dashboard" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

                            <li><NavLink to="/admin/users" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Users</span></NavLink></li>

                            <li><NavLink to="/admin/courses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiBook className="text-xl" /> <span>All Courses</span></NavLink></li>

                            <li><NavLink to="/admin/schedules" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Class Schedules</span></NavLink></li>

                            <li><NavLink to="/admin/assignedCourses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Assigned Courses</span></NavLink></li>

                            <li><NavLink to="/admin/allClassAttendance" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FaRegCalendarCheck className="text-xl" /> <span>Class Attendance</span></NavLink></li>

                            <li><NavLink to="/admin/createAccounts" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><IoMdPersonAdd className="text-xl" /> <span>Create Accounts</span></NavLink></li>

                            <li><NavLink to="/admin/addNewCourse" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><LuBookPlus className="text-xl" /> <span>Add new Course</span></NavLink></li>

                            <li><NavLink to="/admin/profile" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUser className="text-xl" /> <span>Profile</span></NavLink></li>
                        </ul>
                    </div>


                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;