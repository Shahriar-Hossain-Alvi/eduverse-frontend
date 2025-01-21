import useAuth from "../../Hooks/useAuth";
import SectionHeading from "../../Utilities/SectionHeading";


const FacultyDashboard = () => {
  const { user } = useAuth();

  //todo:
  // show the number of courses teaching
  // show total students enrolled in the teaching courses
  // show total class+course materials shared number
  // show 3 recently assigned courses list
  // show 2 upcoming schedule

  return (
    <div className="flex-1 p-3 md:p-8">
      <SectionHeading title={`Welcome, ${user?.first_name}`} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* course teaching */}
        <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Courses Teaching</h3>
          <p className="text-3xl font-bold text-green-600">4</p>
        </div>

        {/* total students */}
        <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">120</p>
        </div>
      </div>


      {/* recently assigned courses  */}
      <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Recently Assigned Courses</h3>

        <ul className="space-y-4">
          <li className="flex flex-col md:flex-row items-center justify-between text-center md:text-left border-b pb-2">
            <span className="font-medium">Advanced Database Systems</span>
            <span className="text-sm text-gray-500 mr-4">40 students</span>
          </li>
        </ul>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-base-300 p-3 md:p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Upcoming Schedule</h3>


        <ul className="space-y-4 text-sm md:text-base">
          <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between">
            <span className="font-medium">Advanced Database Systems</span>
            <span className="text-sm text-gray-500">Today, 2:00 PM - 3:30 PM</span>
          </li>

          <li className="flex flex-col md:flex-row text-center md:text-left items-center justify-between">
            <span className="font-medium">Machine Learning Fundamentals</span>
            <span className="text-sm text-gray-500">Tomorrow, 10:00 AM - 11:30 AM</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FacultyDashboard;