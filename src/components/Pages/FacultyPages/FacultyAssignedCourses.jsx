import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import { format } from "date-fns"
import SectionHeading from "../../Utilities/SectionHeading";
import { Link } from "react-router";

const FacultyAssignedCourses = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    console.log(user._id);

    const { data: singleFacultyAssignedCoursesData = [], isPending, isError, error } = useQuery({
        queryKey: ["singleFacultyAssignedCoursesData", user._id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseFacultyAssignments/myAssignedCourses/${user._id}`);

            return res.data.data;
        }
    })

    if (isPending) return <LoadingSpinner />

    console.log(singleFacultyAssignedCoursesData);

    return (
        <div className="flex-1 p-3 md:p-8">

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            <div>
                <SectionHeading title="My Assigned Courses" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {singleFacultyAssignedCoursesData.map((assignedCourse) => (
                        <div key={assignedCourse._id} className="bg-green-700 overflow-hidden shadow-lg rounded-lg">
                            <div className="relative pb-48">
                                <img
                                    className="absolute h-full w-full object-fill"
                                    src={assignedCourse.course_id.cover_url}
                                    alt={assignedCourse.course_id.title}
                                />
                            </div>

                            <div className="p-6">
                                <h2 className="text-xl font-bold text-white mb-2">{assignedCourse.course_id.title}</h2>

                                {/* three badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="badge badge-primary text-white font-medium">{assignedCourse.course_id.credits} Credits</div>

                                    <div className="badge badge-secondary text-white font-medium">{assignedCourse.course_id.total_available_seats} Seats</div>

                                    {assignedCourse.course_id.is_active ? (
                                        <div className="badge badge-success text-white font-medium">Active</div>
                                    ) : (
                                        <div className="badge badge-error text-white font-medium">Inactive</div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="mb-4 text-white">
                                    <h3 className="text-lg font-semibold mb-2 ">Course Dates</h3>

                                    <p className="text-sm">
                                        Start: {format(new Date(assignedCourse.course_id.start_date), "MMMM d, yyyy")}
                                    </p>

                                    <p className="text-sm">
                                        End: {format(new Date(assignedCourse.course_id.end_date), "MMMM d, yyyy")}
                                    </p>
                                </div>

                                {/* Co-Faculty */}
                                <div className="mb-4 text-white">
                                    <h3 className="text-lg font-semibold mb-2">Co-faculty</h3>

                                    <ul className="space-y-1">
                                        {assignedCourse.users_id.map((user) => (
                                            <li key={user._id} className="text-sm">
                                                {user.first_name} {user.last_name} ({user.email})
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* prerequisites */}
                                <div className="text-white mb-3">
                                    <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>

                                    {assignedCourse.course_id.prerequisites.length === 0 && <span className="text-center text-error font-semibold uppercase text-lg">None</span>}

                                    {assignedCourse.course_id.prerequisites.map((prerequisite) => (
                                        <div key={prerequisite._id} className=" text-white flex justify-between gap-2 items-center border p-2 rounded-lg">
                                            <div className="space-y-1">
                                                <h2>{prerequisite.title}</h2>
                                                <button className="badge badge-success text-white">{prerequisite.credits} Credits</button>
                                            </div>
                                            <Link to={`/${user.user_role}/courses/${prerequisite._id}`} className="btn btn-success text-white btn-sm">View</Link>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <button className="btn btn-primary">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FacultyAssignedCourses;