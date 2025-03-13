import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";
import { Link } from "react-router";
import { format } from "date-fns";


const StudentEnrolledCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: singleStudentEnrolledCourses = [], isPending, isError, error } = useQuery({
        queryKey: ["singleStudentEnrolledCourses"],
        queryFn: async () => {
            const student_id = user._id;
            const res = await axiosSecure.get(`/courseStudentEnrollment/myEnrolledCourses/${student_id}`);

            return res.data.data;
        }
    });

    console.log(singleStudentEnrolledCourses);

    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex-1 p-3 md:p-8">

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            <div>
                <SectionHeading title="My Assigned Courses" />

                <div className="grid grid-cols-1 gap-6">
                    {singleStudentEnrolledCourses.map((enrolledCourse) => (
                        // card
                        <div key={enrolledCourse._id} className="bg-blue-600 overflow-hidden shadow-lg rounded-lg grid grid-cols-6 gap-3 p-3">

                            {/* cover image */}
                            <div className="flex rounded-md col-span-2">
                                <img
                                    className="w-full rounded-md object-fill"
                                    src={enrolledCourse.course_id.cover_url}
                                    alt={enrolledCourse.course_id.title}
                                />
                            </div>


                            <div className="col-span-4">
                                <h2 className="text-xl font-bold text-white mb-2">{enrolledCourse.course_id.title}</h2>

                                {/* three badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="badge badge-primary text-white font-medium">{enrolledCourse.course_id.credits} Credits</div>

                                    <div className="badge badge-secondary text-white font-medium">{enrolledCourse.course_id.total_available_seats} Seats</div>

                                    {enrolledCourse.course_id.is_active ? (
                                        <div className="badge badge-success text-white font-medium">Active</div>
                                    ) : (
                                        <div className="badge badge-error text-white font-medium">Inactive</div>
                                    )}
                                </div>

                                {/* Date and co-faculty */}
                                <div className="flex gap-5">
                                    {/* Dates */}
                                    <div className="mb-4 text-white">
                                        <h3 className="text-lg font-semibold mb-2 ">Course Dates</h3>

                                        <p className="text-sm">
                                            Start: {format(new Date(enrolledCourse.course_id.start_date), "MMMM d, yyyy")}
                                        </p>

                                        <p className="text-sm">
                                            End: {format(new Date(enrolledCourse.course_id.end_date), "MMMM d, yyyy")}
                                        </p>
                                    </div>

                                    {/* Faculty */}
                                    <div className="mb-4 text-white">
                                        <h3 className="text-lg font-semibold mb-2">Faculty</h3>

                                        <ul className="space-y-1">
                                            {enrolledCourse.course_id.assigned_faculty.map((faculty) => (
                                                <li key={faculty._id} className="text-sm">
                                                    {faculty.first_name} {faculty.last_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* view details button */}
                                <div className="flex justify-end">
                                    <Link to={`/faculty/myCourses/${enrolledCourse._id}`} className="btn btn-block btn-success text-white">View </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default StudentEnrolledCourses;