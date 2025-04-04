import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import SectionHeading from "../../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import AssignedCoursesCard from "../../../Shared/Admin&FacultyShared/AssignedCoursesCard";

const AllAssignedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: allAssignedCourses = [], isError, isPending, error } = useQuery({
        queryKey: ["allAssignedCourses", user._id],
        queryFn: async () => {
            const res = await axiosSecure.get("/courseFacultyAssignments");

            return res.data.data;
        },
        enabled: user.user_role === "admin"
    });

    console.log(allAssignedCourses);

    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="All Assigned Courses" />

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {
                allAssignedCourses.length === 0 ?
                    <h2 className="text-error text-3xl text-center font-medium">No Courses are Assigned yet</h2>
                    :
                    <AssignedCoursesCard assignedCourses={allAssignedCourses} />
            }
        </div>
    );
};

export default AllAssignedCourses;