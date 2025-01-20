

const FacultyDashboard = () => {

  //todo:
  // show the number of courses teaching
  // show total students enrolled in the teaching courses
  // show total class+course materials shared number
  // show 3 recently assigned courses list
  // show 2 upcoming schedule

  return (
    <div className="min-h-screen flex-1 p-8">
      <h2 className="text-3xl font-semibold mb-6">Welcome, Prof. Jane Smith</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-base-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Courses Teaching</h3>
          <p className="text-3xl font-bold text-green-600">4</p>
        </div>
        <div className="bg-base-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">120</p>
        </div>
        <div className="bg-base-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Upcoming Classes</h3>
          <p className="text-3xl font-bold text-green-600">3</p>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-base-300 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Recently Assigned Courses</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Advanced Database Systems</span>
            <div>
              <span className="text-sm text-gray-500 mr-4">40 students</span>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Manage</button>
            </div>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Machine Learning Fundamentals</span>
            <div>
              <span className="text-sm text-gray-500 mr-4">35 students</span>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Manage</button>
            </div>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Software Engineering Principles</span>
            <div>
              <span className="text-sm text-gray-500 mr-4">45 students</span>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Manage</button>
            </div>
          </li>
        </ul>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-base-300 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Upcoming Schedule</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span className="font-medium">Advanced Database Systems</span>
            <span className="text-sm text-gray-500">Today, 2:00 PM - 3:30 PM</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-medium">Machine Learning Fundamentals</span>
            <span className="text-sm text-gray-500">Tomorrow, 10:00 AM - 11:30 AM</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-medium">Software Engineering Principles</span>
            <span className="text-sm text-gray-500">Thursday, 1:00 PM - 2:30 PM</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FacultyDashboard;