import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import SectionHeading from "../../../Utilities/SectionHeading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import CourseCard from "./CourseCard";
import { useState } from "react";


const Courses = () => {
    const axiosSecure = useAxiosSecure();
    const [searchedCourseTitle, setSearchedCourseTitle] = useState("");
    const { data: getAllCourses = [], isError, error, isPending } = useQuery({
        queryKey: ["getAllCourses", searchedCourseTitle],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courses?search=${searchedCourseTitle}`);

            if (res.data.success) return res.data.data;
        }
    })


    const handleInputChange = (e) => {
        setSearchedCourseTitle(e.target.value);
    }


    return (
        <div className="flex-1 p-3 md:p-8">
            <div className="flex justify-between">
                <SectionHeading title="All Courses" />


                {/* search field for course title */}
                <label className="input input-bordered flex items-center gap-2">
                    <input 
                    onChange={handleInputChange} type="text" 
                    className="grow" placeholder="Search"
                    value={searchedCourseTitle}
                    />
                </label>
            </div>

            {isError && <p className="text-2xl text-error text-center">{error.message}</p>}

            {isPending && <LoadingSpinner />}

            {getAllCourses.length === 0 && <p className="text-2xl text-error text-center my-5">User List is empty</p>}

            {/* Show course cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                {
                    getAllCourses.map(singleCourse => <CourseCard key={singleCourse._id}
                        singleCourseDetails={singleCourse} />)
                }
            </div>
        </div>
    );
};

export default Courses;