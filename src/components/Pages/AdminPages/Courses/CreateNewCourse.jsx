import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import SectionHeading from "../../../Utilities/SectionHeading";
import { FaCalendarAlt, FaMedal } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineNormal, MdTitle } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import { GiCharacter } from "react-icons/gi";
import useAuth from "../../../Hooks/useAuth";
import Select from 'react-select'
import useTheme from "../../../Hooks/useTheme";

const CreateNewCourse = () => {
    const { user } = useAuth();
    const { user_role } = user;
    const axiosSecure = useAxiosSecure();
    const { register, reset, formState: { errors }, handleSubmit, setValue } = useForm();
    const [selectedFaculties, setSelectedFaculties] = useState([]);
    const [selectedPrerequisiteCourses, setSelectedPrerequisiteCourses] = useState([]);
    const {theme} = useTheme();


    const { data: facultyAndPrerequisiteData = [], isPending, isError, error } = useQuery({
        queryKey: ["facultyAndPrerequisiteData"],
        queryFn: async () => {
            const res = await Promise.all([
                axiosSecure.get("/users/allFacultyNames"),
                axiosSecure.get("/courses/allCourseTitle")
            ])

            return res;
        }
    });

    const facultyNamesRes = facultyAndPrerequisiteData[0]?.data;
    const courseNamesRes = facultyAndPrerequisiteData[1]?.data;

    console.log(courseNamesRes);


    // Transform faculty data to `react-select` format
    const facultyOptions = facultyNamesRes?.data?.map(faculty => ({
        value: faculty._id,
        label: `${faculty.first_name} ${faculty.last_name} - ${faculty.email}`
    }));

    // Handle selection change
    const handleSelectedFaculty = (selectedOptions) => {
        setSelectedFaculties(selectedOptions);
        setValue("assign_faculty", selectedOptions.map(option => option.value));
    };

    // Transform faculty data to `react-select` format
    const prerequisiteCourseOptions = courseNamesRes?.data?.map(course => ({
        value: course._id,
        label: `${course.title}`
    }));

    // Handle selection change
    const handlePrerequisiteCourses = (selectedOptions) => {
        setSelectedPrerequisiteCourses(selectedOptions);
        setValue("prerequisites", selectedOptions.map(option => option.value));
    };






    if (isPending) return <LoadingSpinner />

    const handleAddNewCourse = () => {
        console.log("clicked");
    }

    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="Add a New Course" />

            {isError && <p className="text-2xl text-error text-center">{error.message}</p>}

            {/* form starts here */}
            <form onSubmit={handleSubmit(handleAddNewCourse)} className="divide-y divide-gray-200">

                {/* title */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <MdTitle className="mr-2 text-lg" /> Title
                    </label>

                    <div className="col-span-2">
                        <input type="email" {...register("title", { required: "Title is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add course title" />
                        {errors.title && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.title.message}</p>}
                    </div>
                </div>


                {/* description */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <TbFileDescription className="mr-2" /> Description
                    </label>
                    <div className="col-span-2">
                        <textarea type="text" {...register("description", { required: "Description is required" })} className="mt-1 w-full border-gray-300 rounded-md textarea focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add course description" />
                        {errors.description && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.description.message}</p>}
                    </div>
                </div>


                {/* credit */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <FaMedal
                            className="mr-2" /> Credits
                    </label>
                    <div className="col-span-2">
                        <input type="number" {...register("credits", { required: "Course credit is required" })} className="mt-1 w-full border-gray-300 rounded-md input  focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add course credits" />
                        {errors.credits && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.credits.message}</p>}
                    </div>
                </div>


                {/* seats  */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <MdOutlineAirlineSeatReclineNormal className="mr-2 text-lg" /> Seats
                    </label>

                    <div className="col-span-2">
                        <input type="number" {...register("total_available_seat", { required: "Seat number is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add seat number" />
                        {errors.total_available_seat && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.total_available_seat.message}</p>}
                    </div>
                </div>


                {/* start date */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-2 text-lg" /> Start Date
                    </label>

                    <div className="col-span-2">
                        <input type="date" min={new Date().toISOString().slice(0, 16)} {...register("start_date", { required: "Start date is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        {errors.start_date && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.start_date.message}</p>}
                    </div>
                </div>



                {/* end date */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-2 text-lg" /> End Date
                    </label>

                    <div className="col-span-2">
                        <input type="date" {...register("end_date", { required: "End date is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add course finishing date" />
                        {errors.end_date && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.end_date.message}</p>}
                    </div>
                </div>



                {/* assign faculty */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <GiCharacter className="mr-2" /> Assign a faculty
                    </label>
                    <Select
                        isMulti
                        options={facultyOptions}
                        value={selectedFaculties}
                        onChange={handleSelectedFaculty}
                        closeMenuOnSelect={false}
                        placeholder="Select Faculty..."
                        className={`basic-multi-select mt-1 w-full col-span-2 text-black`}
                        classNamePrefix="select"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                neutral80: "black",//selected text color
                                neutral60: "red", // cross and dropdown button color

                            },
                        })}
                    />

                    {errors.assign_faculty && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.assign_faculty.message}</p>}
                </div>


                {/* prerequisite courses */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <GiCharacter className="mr-2" /> Assign a faculty
                    </label>
                    <Select
                        isMulti
                        options={prerequisiteCourseOptions}
                        value={selectedPrerequisiteCourses}
                        onChange={handlePrerequisiteCourses}
                        closeMenuOnSelect={false}
                        placeholder="Select Prerequisites..."
                        className={`basic-multi-select mt-1 w-full col-span-2 text-black`}
                        classNamePrefix="select"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                neutral80: "black",//selected text color
                                neutral60: "red", // cross and dropdown button color

                            },
                        })}
                    />

                    {errors.prerequisites && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.prerequisites.message}</p>}
                </div>



                {/* submit button */}
                <div className="py-4 sm:py-5 sm:gap-4">
                    <button className="btn bg-indigo-700 text-white hover:bg-indigo-600 w-full">Create</button>
                </div>
            </form>
        </div>
    );
};

export default CreateNewCourse;