import { useState } from "react";
import SectionHeading from "../../../Utilities/SectionHeading";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { format } from "date-fns"
import toast, { Toaster } from "react-hot-toast";
import { handleError } from "../../../Utilities/handleError";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PropTypes from "prop-types";
import { CgClose, CgSpinnerTwoAlt } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import Swal from "sweetalert2";
import { BiError } from "react-icons/bi";
import { Link } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useTheme from "../../../Hooks/useTheme";
import themeStyles from "../../../Utilities/themeStyles";




const ClassScheduleFormAndList = ({ course_id, faculty }) => {
    const {theme} = useTheme();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [showUpdateScheduleForm, setShowUpdateScheduleForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [originalClassData, setOriginalClassData] = useState(null);



    // hook form
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();


    // fetch all the classes of a course for a faculty
    const { data: classList = [], isPending, isError, error, refetch } = useQuery({
        queryKey: ["classList"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/courseId/${course_id}`);

            return res.data.data;
        },
        enabled: !!course_id
    });



    // create new class schedule
    const handleScheduleSubmit = async (data) => {

        const currentDate = new Date().toISOString().slice(0, 10);

        const title = data.classTitle;
        const description = data.classDescription;
        const location = data.classLocation;
        console.log(location);

        const classScheduledDate = (data.classScheduledDate);
        const classScheduledTime = (data.classScheduledTime);

        if (currentDate > classScheduledDate) {
            return toast.error("Class schedule date can not be in the past", {
                duration: 2500,
                position: "top-center"
            });
        }

        const fullDateTime = new Date(`${classScheduledDate}T${classScheduledTime}:00.000+06:00`).toISOString();

        const faculty_id = faculty.map(singleFaculty => singleFaculty._id)

        const classScheduleData = {
            title, description, scheduled_time: fullDateTime, course_id, faculty_id, location
        }

        try {
            setFormLoading(true);
            const res = await axiosSecure.post("/classes", classScheduleData);

            if (res.data.success) {
                reset();
                setFormLoading(false);
                toast.success(res.data.message, {
                    duration: 2500,
                    position: "top-center"
                });
                refetch();
            }
        } catch (error) {
            handleError(error, "Something went wrong, try again later!");
            setFormLoading(false);
        }

        setShowScheduleForm(false);
        setShowUpdateScheduleForm(false);
    }


    // get class schedule data when clicked edit button
    const handleScheduleEditButton = (id) => {
        setShowUpdateScheduleForm(true);

        const foundClass = classList.find(singleClass => singleClass._id === id);


        if (foundClass) {
            setOriginalClassData(foundClass);

            setValue("updateClassTitle", foundClass.title);
            setValue("updateClassDescription", foundClass.description);
            setValue("updateClassLocation", foundClass.location);
            setValue("updateClassScheduledDate", foundClass.scheduled_time.split("T")[0]); // Extract date

            // convert UTC to local time
            const localTime = new Date(foundClass.scheduled_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            setValue("updateClassScheduledTime", localTime)
        }
    }


    // update class schedule
    const handleScheduleUpdate = async (data) => {
        if (!originalClassData) return;
        const id = originalClassData._id;

        const updateClassScheduleData = {};

        if (data.updateClassTitle !== originalClassData.title) {
            updateClassScheduleData.title = data.updateClassTitle;
        }

        if (data.updateClassDescription !== originalClassData.description) {
            updateClassScheduleData.description = data.updateClassDescription;
        }

        if (data.updateClassLocation !== originalClassData.location) {
            updateClassScheduleData.location = data.updateClassLocation;
        }

        const newScheduleDate = data.updateClassScheduledDate;
        const newScheduleTime = data.updateClassScheduledTime;

        const newScheduled_time = new Date(`${newScheduleDate}T${newScheduleTime}:00.000+06:00`).toISOString();

        if (newScheduled_time !== originalClassData.scheduled_time) {
            updateClassScheduleData.scheduled_time = newScheduled_time;
        }



        if (Object.keys(updateClassScheduleData).length > 0) {
            try {
                setFormLoading(true);
                const res = await axiosSecure.patch(`/classes/${id}`, updateClassScheduleData);

                if (res.data.success) {
                    setFormLoading(false);
                    refetch();
                    setShowUpdateScheduleForm(false);
                    toast.success(res.data.message, {
                        duration: 2500,
                        position: "top-center"
                    })
                }

            } catch (error) {
                setFormLoading(false);
                setShowUpdateScheduleForm(false);
                handleError(error, "Class schedule update failed.")
            }
        }
        else {
            setFormLoading(false);
            setShowUpdateScheduleForm(false);
            toast.error("No changes detected", {
                duration: 2500,
                position: "top-center"
            })
        }
    }



    // delete a class
    const handleScheduleDelete = async (id) => {

        const swalResponse = await Swal.fire({
            title: "Do you want to delete this class schedule?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#16A34A",
            confirmButtonText: "Yes, delete it!",
        })


        if (swalResponse.isConfirmed) {

            try {
                const res = await axiosSecure.delete(`/classes/${id}`);

                if (res.data.success) {
                    refetch();
                    Swal.fire({
                        title: "Deleted!",
                        text: "This class schedule has been deleted.",
                        icon: "success",
                        confirmButtonColor: "#16A34A",
                    });
                }

            } catch (error) {
                handleError(error, "Something went wrong, Class Schedule could not be deleted. Try again later.");
            }
        }

    }





    return (
        <div className="my-10">
            <Toaster />
            <SectionHeading title="Class Schedules" />


            {/* create class schedule form */}
            <div>
                {/* toggle schedule form */}
                <button
                    onClick={() => {
                        setShowScheduleForm(!showScheduleForm);

                        if (showUpdateScheduleForm) {
                            setShowUpdateScheduleForm(false);
                        };
                    }}
                    className={`mb-4 btn ${showScheduleForm ? "bg-error hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold rounded-lg`}
                >
                    {
                        showScheduleForm ? <>
                            <CgClose className="mr-2" /> Cancel </> : <>
                            <FiPlus className="mr-2" /> Add New Schedule</>
                    }
                </button>


                {/* form */}
                {showScheduleForm && (
                    <div>
                        <SectionHeading title="Add New Class Schedule" />

                        <form onSubmit={handleSubmit(handleScheduleSubmit)} className="mb-6 p-4 rounded-lg">

                            {/* class title */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Title: </span>
                                </div>

                                <div className="col-span-5">
                                    <input
                                        type="text"
                                        placeholder="Class Title"

                                        {...register("classTitle", { required: "Class Title is Required" })}

                                        className="input input-bordered mb-2 w-full rounded-lg "
                                    />

                                    {errors.classTitle && <p className="text-error font-medium text-sm mb-2">{errors.classTitle.message}</p>}
                                </div>
                            </div>


                            {/* class description */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Description: </span>
                                </div>

                                <div className="col-span-5">
                                    <textarea
                                        placeholder="Class Description"

                                        {...register("classDescription", { required: "Class Description is required" })}

                                        className="textarea textarea-bordered mb-2 w-full rounded-lg "
                                    />
                                    {errors.classDescription && <p className="text-error font-medium text-sm mb-2">{errors.classDescription.message}</p>}
                                </div>
                            </div>


                            {/* class date */}
                            <div className="grid grid-cols-6 gap-2
                    ">
                                <div className="label">
                                    <span className="label-text">Date: </span>
                                </div>

                                <div className="col-span-5">
                                    <input
                                        type="date"

                                        min={new Date().toISOString().slice(0, 10)}

                                        {...register("classScheduledDate", { required: "Class Date is Required" })}

                                        className="mb-2 w-full input input-bordered rounded-lg"
                                    />
                                    {errors.classScheduledDate && <p className="text-error font-medium text-sm mb-2">{errors.classScheduledDate.message}</p>}
                                </div>
                            </div>


                            {/* class time */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Time: </span>
                                </div>

                                <div className="col-span-5">
                                    <input
                                        type="time"

                                        {...register("classScheduledTime", { required: "Class Time is Required" })}

                                        className="mb-2 w-full input input-bordered rounded-lg"
                                    />
                                    {errors.classScheduledTime && <p className="text-error font-medium text-sm mb-2">{errors.classScheduledTime.message}</p>}
                                </div>
                            </div>


                            {/* class location */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Location: </span>
                                </div>

                                <div className="col-span-5">
                                    <input
                                        type="text"
                                        placeholder="Class Location"

                                        {...register("classLocation")}

                                        className="input input-bordered mb-2 w-full rounded-lg "
                                    />

                                    {errors.classLocation && <p className="text-error font-medium text-sm mb-2">{errors?.classLocation?.message}</p>}
                                </div>
                            </div>



                            {/* submit button */}
                            <button type="submit" className={`btn ${formLoading ? "btn-disabled" : "btn-success text-white font-bold"}  rounded`}>
                                {
                                    formLoading ? <CgSpinnerTwoAlt className="animate-spin" /> : "Add Schedule"
                                }
                            </button>
                        </form>

                    </div>
                )}
            </div>


            {/* update class schedule form */}
            <div>
                {/* toggle update schedule form */}
                {
                    showUpdateScheduleForm && <button
                        onClick={() => setShowUpdateScheduleForm(false)}
                        className="mb-4 btn btn-error text-white font-bold rounded-lg mt-5"
                    >
                        <CgClose className="mr-2" /> Cancel
                    </button>
                }


                {showUpdateScheduleForm && (
                    <div>
                        <SectionHeading title="Update Class Schedule" />

                        <form onSubmit={handleSubmit(handleScheduleUpdate)} className="mb-6 p-4 rounded-lg">

                            {/* class title */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Title: </span>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Class Title"

                                    {...register("updateClassTitle")}

                                    className="input input-bordered mb-2 w-full rounded-lg col-span-5"
                                />

                                {errors.updateClassTitle && <p className="text-error font-medium text-sm mb-2">{errors.updateClassTitle.message}</p>}
                            </div>


                            {/* class description */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Description: </span>
                                </div>

                                <textarea
                                    placeholder="Class Description"

                                    {...register("updateClassDescription")}

                                    className="textarea textarea-bordered mb-2 w-full  rounded-lg col-span-5"
                                />
                                {errors.updateClassDescription && <p className="text-error font-medium text-sm mb-2">{errors.updateClassDescription.message}</p>}
                            </div>


                            {/* class date */}
                            <div className="grid grid-cols-6 gap-2
">
                                <div className="label">
                                    <span className="label-text">Date: </span>
                                </div>

                                <input
                                    type="date"

                                    min={new Date().toISOString().slice(0, 10)}

                                    {...register("updateClassScheduledDate")}

                                    className="mb-2 w-full input input-bordered rounded-lg col-span-5"
                                />
                                {errors.updateClassScheduledDate && <p className="text-error font-medium text-sm mb-2">{errors.updateClassScheduledDate.message}</p>}
                            </div>


                            {/* class time */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Time: </span>
                                </div>

                                <input
                                    type="time"

                                    {...register("updateClassScheduledTime")}

                                    className="mb-2 w-full input input-bordered rounded-lg col-span-5"
                                />
                                {errors.updateClassScheduledTime && <p className="text-error font-medium text-sm mb-2">{errors.updateClassScheduledTime.message}</p>}
                            </div>


                            {/* class location */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="label">
                                    <span className="label-text">Location: </span>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Class Location"

                                    {...register("updateClassLocation")}

                                    className="input input-bordered mb-2 w-full rounded-lg col-span-5"
                                />

                                {errors.updateClassLocation && <p className="text-error font-medium text-sm mb-2">{errors.updateClassLocation.message}</p>}
                            </div>


                            <button type="submit" className={`btn ${formLoading ? "btn-disabled" : "btn-success text-white font-bold"}  rounded`}>
                                {
                                    formLoading ? <CgSpinnerTwoAlt className="animate-spin" /> : "Update Schedule"
                                }
                            </button>
                        </form>
                    </div>
                )}
            </div>



            {/* display class schedules */}
            <div>
                {isPending && <LoadingSpinner />}

                {/* Error messages */}
                {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

                {classList.length === 0 && <p className="text-center text-error text-lg font-medium">Class Schedules are not added yet</p>}

                <ul className="space-y-2">
                    {classList.map((singleClass) => (
                        <li key={singleClass._id} className={`${themeStyles.background[theme]} flex flex-col md:flex-row justify-between items-center border p-3 rounded`}>

                            <div className="space-y-2 md:space-y-1">
                                {/* title */}
                                <h3 className="font-semibold">
                                    <span className="underline mr-1">Title:</span> {singleClass.title}</h3>

                                {/* description */}
                                <p className="text-sm">{singleClass.description}</p>


                                {/* time */}
                                <p className="text-sm">
                                    <span className="font-semibold underline">
                                    Class Time:
                                    </span>

                                    <button className="badge badge-success text-white ml-2 rounded">
                                        {format(singleClass.scheduled_time, "yyyy-MM-dd, hh:mm a")}
                                    </button>
                                </p>


                                {/* location */}
                                <p className="text-sm">
                                    <span className="mr-1 underline font-semibold">
                                        Location:
                                    </span>
                                    {singleClass.location}

                                    {
                                        singleClass.location === "" &&
                                        <BiError className="inline ml-1 text-error text-base animate-pulse" />
                                    }
                                </p>


                                {/* faculty */}
                                <div className='flex gap-1'>
                                    <h2 className="underline font-semibold mr-1">Faculties: </h2>
                                    {(singleClass.faculty_id).map(singleFaculty =>
                                        <p key={singleFaculty._id} className='badge badge-outline'>{singleFaculty.first_name} {singleFaculty.last_name}</p>
                                    )}
                                </div>
                            </div>


                            {/* edit and delete button */}
                            <div className="flex md:block text-center items-center md:space-y-3 mt-4 md:mt-0 space-x-3 md:space-x-0">
                                <div>
                                    {/* edit button */}
                                    <button
                                        onClick={() => {
                                            handleScheduleEditButton(singleClass._id);

                                            if (showScheduleForm) {
                                                setShowScheduleForm(false);
                                            }
                                        }}
                                        className="text-blue-500 hover:text-blue-600 mr-2"
                                    >
                                        <FiEdit />
                                    </button>

                                    {/* delete button */}
                                    <button
                                        onClick={() => handleScheduleDelete(singleClass._id)} className="text-red-500 hover:text-red-600">
                                        <FiTrash2 />
                                    </button>
                                </div>

                                {/* class details button */}
                                {
                                    user.user_role !== "student" &&
                                    <Link to={`/faculty/myCourses/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-sm md:btn-md`}>Details</Link>
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

ClassScheduleFormAndList.propTypes = {
    course_id: PropTypes.string,
    faculty: PropTypes.array
}

export default ClassScheduleFormAndList;