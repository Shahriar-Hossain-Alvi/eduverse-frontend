import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Select from 'react-select'
import LoadingSpinner from '../../Utilities/LoadingSpinner';
import { CiEdit } from "react-icons/ci";
import { GiCancel } from 'react-icons/gi';
import { CgSpinnerTwoAlt } from "react-icons/cg";
import toast, { Toaster } from 'react-hot-toast';
import { isEqual } from 'lodash';
import axios from 'axios';
import TanstackQueryErrorMessage from '../../Utilities/TanstackQueryErrorMessage';



const CourseUpdateForm = ({ singleCourseDetails, refetch }) => {
    const myCloudName = import.meta.env.VITE_Cloudinary_Cloud_Name;
    const myUploadPreset = import.meta.env.VITE_Cloudinary_Upload_Preset;


    const axiosSecure = useAxiosSecure();
    const { register, formState: { errors }, reset, handleSubmit, setValue } = useForm({
        defaultValues: { ...singleCourseDetails }
    });

    // form loading
    const [formSubmissionLoading, setFormSubmissionLoading] = useState(false);

    // to enable/disable edit button
    const [isEditing, setIsEditing] = useState(false);


    // get prerequisite from the form
    const [selectedPrerequisiteCourses, setSelectedPrerequisiteCourses] = useState([]);



    const { data: prerequisiteData = [], isPending, isError, error } = useQuery({
        queryKey: ["prerequisiteData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/courses/allCourseTitle")
            
            return res.data.data;
        }
    });


    // Transform faculty data to `react-select` format
    const prerequisiteCourseOptions = prerequisiteData?.map(course => ({
        value: course._id,
        label: `${course.title}`
    }));

    // Handle selection change
    const handlePrerequisiteCourses = (selectedOptions) => {
        setSelectedPrerequisiteCourses(selectedOptions);
        setValue("prerequisites", selectedOptions.map(option => option.value));
    };




    // update function
    const handleUpdateCourse = async (data) => {
        let updatedCoverUrl = "";


        if (data.photo && Array.isArray(data.photo) && (data.photo.length > 0)) {
            const cover_photo_file = data.photo[0];
            const formData = new FormData();
            formData.append("file", cover_photo_file);
            formData.append("upload_preset", myUploadPreset);

            try {
                setFormSubmissionLoading(true);
                const cloudinaryRes = await axios.post(`https://api.cloudinary.com/v1_1/${myCloudName}/image/upload`, formData);
                updatedCoverUrl = cloudinaryRes.data.secure_url;
            } catch (error) {
                console.log(error);
                const errorMessage = error.response?.data?.message || "Image upload failed.";
                setFormSubmissionLoading(false);
                toast.error(errorMessage, { duration: 3000, position: "top-center" });
                return;
            }
        }

        const updateCourseData = {};

        // Check and add only changed fields
        if (data.title && data.title !== singleCourseDetails?.title) updateCourseData.title = data.title;

        if (data.description && data.description !== singleCourseDetails?.description) updateCourseData.description = data.description;

        if (!isNaN(parseFloat(data.credits)) && parseFloat(data.credits) !== singleCourseDetails?.credits) updateCourseData.credits = parseFloat(data.credits);

        if (!isNaN(parseInt(data.total_available_seats)) && parseInt(data.total_available_seats) !== singleCourseDetails?.total_available_seats) updateCourseData.total_available_seats = parseInt(data.total_available_seats);


        if (data.start_date && data.start_date !== singleCourseDetails?.start_date) {
            if (new Date() > new Date(data.start_date)) {
                return toast.error("Start date cannot be a past date!", {
                    duration: 3500, position: "top-center"
                });
            }

            if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
                return toast.error("Start date cannot be later than the end date!", {
                    duration: 3500, position: "top-center"
                });
            }

            updateCourseData.start_date = data.start_date;
        }


        if (data.end_date && data.end_date !== singleCourseDetails?.end_date) {
            if (new Date() > new Date(data.end_date)) {
                return toast.error("End date cannot be a past date!", {
                    duration: 3500, position: "top-center"
                });
            }

            if (data.start_date && new Date(data.start_date) > new Date(data.end_date)) {
                return toast.error("End date cannot be before the start date!", {
                    duration: 3500, position: "top-center"
                });
            }

            updateCourseData.end_date = data.end_date;
        }



        if (data.is_active !== singleCourseDetails?.is_active) updateCourseData.is_active = data.is_active;


        if (data.prerequisites && !isEqual(data.prerequisites, singleCourseDetails?.prerequisites)) {
            updateCourseData.prerequisites = data.prerequisites;
        }

        if (updatedCoverUrl && updatedCoverUrl !== singleCourseDetails?.cover_url) {
            updateCourseData.cover_url = updatedCoverUrl;
        }



        // Prevent API call if no changes were made
        if (Object.keys(updateCourseData).length === 0) {
            toast.error("No changes detected", { duration: 3000, position: "top-center" });
            setFormSubmissionLoading(false);
            return;
        }

        try {
            const courseUpdateRes = await axiosSecure.patch(`/courses/${singleCourseDetails?._id}`, updateCourseData);

            if(courseUpdateRes.data.success === true){
                setSelectedPrerequisiteCourses([]);
                reset();
                refetch();
                setFormSubmissionLoading(false);
                setIsEditing(false);
                toast.success(`${courseUpdateRes.data.message}`, {
                    duration: 1500, position: "top-center"
                });
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Update failed.";
            setFormSubmissionLoading(false);
            toast.error(errorMessage, { duration: 3000, position: "top-center" });
        }
    };



    return (
        <div>
            <Toaster />
            <button onClick={() => setIsEditing(!isEditing)} className={`btn text-white font-medium ${isEditing ? "btn-error" : "btn-success"}`}>
                {isEditing ?
                    <>
                        <GiCancel className='inline text-lg mr-1' />
                        Cancel Edit
                    </> :
                    <>
                        <CiEdit className='inline text-lg mr-1' />
                        Edit Course
                    </>}
            </button>

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {isPending && <LoadingSpinner />}

            {isEditing && (
                <form onSubmit={handleSubmit(handleUpdateCourse)} className="divide-y divide-gray-200">

                    {/* Title */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">Title</label>

                        <div className='col-span-2'>
                            <input type="text" {...register("title")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                        </div>
                    </div>



                    {/* Description */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">Description</label>

                        <div className='col-span-2'>
                            <textarea {...register("description")}
                                className="mt-1 w-full border-gray-300 rounded-md textarea focus:ring-indigo-500 focus:border-indigo-500"></textarea>

                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                        </div>
                    </div>



                    {/* Cover Photo */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">
                            Cover Photo
                        </label>
                        <div className="col-span-2">
                            <div className='grid grid-cols-3 justify-between gap-1'>
                                <img className='w-full h-full order-2' src={singleCourseDetails.cover_url} alt={singleCourseDetails.title} />

                                <input type="file" {...register("photo")} className="mt-1  border-gray-300 rounded-md file-input w-full col-span-2  focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            {errors.photo && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.photo.message}</p>}
                        </div>
                    </div>



                    {/* Credits */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">Credits</label>

                        <div className='col-span-2'>
                            <input type="number" {...register("credits")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.credits && <p className="text-red-500">{errors.credits.message}</p>}
                        </div>
                    </div>



                    {/* Available Seats */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">Total Available Seats</label>

                        <div className='col-span-2'>
                            <input type="number" {...register("total_available_seats")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.total_available_seats && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.total_available_seats.message}</p>}
                        </div>
                    </div>



                    {/* Start Date */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">Start Date</label>

                        <div className='col-span-2'>
                            <input type="date" {...register("start_date")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.start_date && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.start_date.message}</p>}
                        </div>
                    </div>



                    {/* End Date */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">End Date</label>

                        <div className='col-span-2'>
                            <input type="date" {...register("end_date")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.end_date && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.end_date.message}</p>}
                        </div>
                    </div>



                    {/* prerequisite course */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="text-sm font-medium text-gray-500 flex items-center">
                            Prerequisite
                        </label>
                        <Select
                            isMulti
                            options={prerequisiteCourseOptions}
                            value={selectedPrerequisiteCourses}
                            onChange={handlePrerequisiteCourses}
                            closeMenuOnSelect={true}
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



                    {/* Active Status */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="font-medium text-gray-500 flex items-center">Course Active</label>
                        <input type="checkbox" {...register("is_active")} defaultChecked={singleCourseDetails.is_active} />
                    </div>

                    {
                        formSubmissionLoading ? 
                        <button className="btn btn-disabled border-none w-full mb-2 "><CgSpinnerTwoAlt className="animate-spin" /></button>
                        :
                        <button type="submit" className="btn btn-success text-white w-full mt-3 border-none">
                        Update Course
                    </button>
                    }
                </form>
            )}


            {
                isEditing && <button onClick={() => setIsEditing(false)} className="btn text-white font-medium w-full mt-2 btn-error">
                    <GiCancel className='inline text-lg mr-1' />
                    Cancel Edit
                </button>
            }

        </div>
    );
};

CourseUpdateForm.propTypes = {
    singleCourseDetails: PropTypes.object,
    refetch: PropTypes.func,
}

export default CourseUpdateForm;