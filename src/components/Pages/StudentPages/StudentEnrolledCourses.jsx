import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";


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
    })

    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex-1 p-3 md:p-8">
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            <SectionHeading title="My Enrolled Courses" />

            {
                singleStudentEnrolledCourses.length === 0 && <p className="text-error font-medium text-lg text-center">You have not enrolled in any courses yet</p>
            }

            <div>
                
            </div>
        </div>
    );
};

export default StudentEnrolledCourses;