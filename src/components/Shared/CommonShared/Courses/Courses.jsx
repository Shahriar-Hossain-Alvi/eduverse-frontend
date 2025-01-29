import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import SectionHeading from "../../../Utilities/SectionHeading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import CourseCard from "./CourseCard";


const Courses = () => {
    const axiosSecure = useAxiosSecure();
    const { data: getAllCourses = [], isError, error, isPending } = useQuery({
        queryKey: ["getAllCourses"],
        queryFn: async () => {
            const res = await axiosSecure.get("/courses");

            if (res.data.success) return res.data.data;
        }
    })

    if (isPending) return <LoadingSpinner />


    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="All Courses" />

            {isError && <p className="text-2xl text-error text-center">{error.message}</p>}


            {getAllCourses.length === 0 && <p className="text-2xl text-error text-center my-5">User List is empty</p>}

            {/* Show course cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {
                    getAllCourses.map(singleCourse => <CourseCard key={singleCourse._id}
                        singleCourseDetails={singleCourse} />)
                }
            </div>
        </div>
    );
};

export default Courses;