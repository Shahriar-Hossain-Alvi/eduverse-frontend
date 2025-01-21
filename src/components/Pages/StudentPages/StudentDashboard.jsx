import useAuth from "../../Hooks/useAuth";
import SectionHeading from "../../Utilities/SectionHeading";


const StudentDashboard = () => {
    const {user} = useAuth();
    // todo:
    // show total enrolled courses number
    // show attendance percentage
    // show a list of 3 recently enrolled courses (course name - faculty name
    // show 2 upcoming class schedule (course name - time)
    //
    //

    return (
        <div className="min-h-screen flex-1 p-3 md:p-8">
           <SectionHeading title={`Welcome, ${user?.first_name}`} />

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* enrolled courses */}
                <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Enrolled Courses</h3>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                </div>


                {/* average grade */}
                <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Average Grade</h3>
                    <p className="text-3xl font-bold text-blue-600">A-</p>
                </div>
            </div>

            {/* Course List */}
            <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">My Courses</h3>

                <ul className="space-y-4">
                    <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between border-b pb-2">
                        <span className="font-medium">Introduction to Computer Science</span>
                        <span className="text-sm text-gray-500">Prof. Smith</span>
                    </li>
                    <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between border-b pb-2">
                        <span className="font-medium">Data Structures and Algorithms</span>
                        <span className="text-sm text-gray-500">Prof. Johnson</span>
                    </li>
                    <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between border-b pb-2">
                        <span className="font-medium">Web Development Fundamentals</span>
                        <span className="text-sm text-gray-500">Prof. Williams</span>
                    </li>
                </ul>
            </div>



            {/* Upcoming Schedule */}
            <div className="mt-8 bg-base-300 p-3 md:p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Upcoming Schedule</h3>
                
                <ul className="space-y-4">
                    <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between">
                        <span className="font-medium">Introduction to Computer Science</span>
                        <span className="text-sm text-gray-500">Today, 2:00 PM - 3:30 PM</span>
                    </li>
                    <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between">
                        <span className="font-medium">Data Structures and Algorithms</span>
                        <span className="text-sm text-gray-500">Tomorrow, 10:00 AM - 11:30 AM</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;