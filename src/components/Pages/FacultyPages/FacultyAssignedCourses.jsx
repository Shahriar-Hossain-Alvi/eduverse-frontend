import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";
import AssignedCoursesCard from "../../Shared/Admin&FacultyShared/AssignedCoursesCard"



const FacultyAssignedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: singleFacultyAssignedCoursesData = [], isPending, isError, error } = useQuery({
        queryKey: ["singleFacultyAssignedCoursesData", user._id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseFacultyAssignments/myAssignedCourses/${user._id}`);

            return res.data.data;
        }
    });

    if (isPending) return <LoadingSpinner />



    return (
        <div className="flex-1 p-3 md:p-8">

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            <div>
                <SectionHeading title="My Assigned Courses" />

                {
                    singleFacultyAssignedCoursesData.length === 0 ?
                        <h2 className="text-error text-3xl text-center font-medium">No Courses Assigned to you yet</h2>
                        :
                        <AssignedCoursesCard assignedCourses={singleFacultyAssignedCoursesData} />
                }


            </div>

        </div>
    );
};

export default FacultyAssignedCourses;