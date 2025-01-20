import { FiBook, FiCalendar, FiPieChart, FiUsers } from 'react-icons/fi';
import { GrOverview } from 'react-icons/gr';
import { IoMdPersonAdd } from 'react-icons/io';
import { NavLink } from 'react-router';

const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-indigo-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
            <nav>
                <ul id="adminSideBar" className="space-y-4">
                    <li><NavLink to="/admin/dashboard" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><GrOverview className="text-xl" /> <span>Overview</span></NavLink></li>

                    <li><NavLink to="/admin/users" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiUsers className="text-xl" /> <span>Users</span></NavLink></li>

                    <li><NavLink to="/admin/courses" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiBook className="text-xl" /> <span>Courses</span></NavLink></li>

                    <li><NavLink to="/admin/schedule" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiCalendar className="text-xl" /> <span>Schedule</span></NavLink></li>

                    <li><NavLink to="/admin/reports" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><FiPieChart className="text-xl" /> <span>Reports</span></NavLink></li>

                    <li><NavLink to="/admin/createAccounts" className="flex items-center space-x-2 hover:bg-indigo-600 p-2 rounded"><IoMdPersonAdd className="text-xl" /> <span>Create Accounts</span></NavLink></li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;