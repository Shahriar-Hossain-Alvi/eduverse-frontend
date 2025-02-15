import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";

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


        </div>
    );
};

export default FacultyAssignedCourses;