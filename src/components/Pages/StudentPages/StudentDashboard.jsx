

const StudentDashboard = () => {

    // todo:
    // show total enrolled courses number
    // show attendance percentage
    // show a list of 3 recently enrolled courses (course name - faculty name
    // show 2 upcoming class schedule (course name - time)
    //
    //

    return (
        <div className="min-h-screen flex-1 p-8">
            <h2 className="text-3xl font-semibold mb-6">Welcome, John Doe</h2>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-base-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Enrolled Courses</h3>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-base-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Upcoming Assignments</h3>
                    <p className="text-3xl font-bold text-blue-600">3</p>
                </div>
                <div className="bg-base-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Average Grade</h3>
                    <p className="text-3xl font-bold text-blue-600">A-</p>
                </div>
            </div>

            {/* Course List */}
            <div className="bg-base-300 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">My Courses</h3>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">Introduction to Computer Science</span>
                        <span className="text-sm text-gray-500">Prof. Smith</span>
                    </li>
                    <li className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">Data Structures and Algorithms</span>
                        <span className="text-sm text-gray-500">Prof. Johnson</span>
                    </li>
                    <li className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">Web Development Fundamentals</span>
                        <span className="text-sm text-gray-500">Prof. Williams</span>
                    </li>
                </ul>
            </div>

            {/* Upcoming Schedule */}
            <div className="mt-8 bg-base-300 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Upcoming Schedule</h3>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                        <span className="font-medium">Introduction to Computer Science</span>
                        <span className="text-sm text-gray-500">Today, 2:00 PM - 3:30 PM</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="font-medium">Data Structures and Algorithms</span>
                        <span className="text-sm text-gray-500">Tomorrow, 10:00 AM - 11:30 AM</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;