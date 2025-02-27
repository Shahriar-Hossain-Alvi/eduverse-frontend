import { useState } from "react";
import SectionHeading from "../Utilities/SectionHeading";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { format, parse, parseISO } from "date-fns"
import toast, { Toaster } from "react-hot-toast";
import { handleError } from "../Utilities/HandleError";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import PropTypes from "prop-types";
import { CgClose, CgSpinnerTwoAlt } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../Utilities/TanstackQueryErrorMessage";
import Swal from "sweetalert2";


const ClassScheduleForm = ({ course_id, faculty }) => {
    const axiosSecure = useAxiosSecure();


    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [showUpdateScheduleForm, setShowUpdateScheduleForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);



    // hook form
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();


    // fetch all the classes of a course
    const { data: classList = [], isPending, isError, error, refetch } = useQuery({
        queryKey: ["classList"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/${course_id}`);

            return res.data.data;
        },
        enabled: !!course_id
    })

    console.log(classList);


    // create new class schedule
    const handleScheduleSubmit = async (data) => {

        const currentDate = new Date().toISOString().slice(0, 10);

        const title = data.classTitle;
        const description = data.classDescription;

        const classScheduledDate = data.classScheduledDate;
        const classScheduledTime = data.classScheduledTime;

        if (currentDate > classScheduledDate) {
            return toast.error("Class schedule date can not be in the past", {
                duration: 2500,
                position: "top-center"
            });
        }

        const fullDateTime = (`${classScheduledDate} ${classScheduledTime}`);

        const faculty_id = faculty.map(singleFaculty => singleFaculty._id)

        const classScheduleData = {
            title, description, scheduled_time: fullDateTime, course_id, faculty_id
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
    }



    // update class schedule
    const handleScheduleUpdate = (id) => {
        setShowUpdateScheduleForm(true);

        const foundClass = classList.find(singleClass => singleClass._id === id);

        if (foundClass) {
            setValue("updateClassTitle", foundClass.title);
            setValue("updateClassDescription", foundClass.description);
            setValue("updateClassScheduledDate", foundClass.scheduled_time.split("T")[0]); // Extract date
            setValue("updateClassScheduledTime", foundClass.scheduled_time.split("T")[1]?.slice(0, 5));
        }


    }


    const handleScheduleDelete = async (id) => {
        console.log(id);

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

                if(res.data.success){
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
        <div className="mb-10">
            <Toaster />
            <SectionHeading title="Class Schedules" />


            {/* create class schedule form */}
            <div>
                {/* toggle schedule form */}
                <button
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
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


                        <button type="submit" className={`btn ${formLoading ? "btn-disabled" : "btn-success text-white font-bold"}  rounded`}>
                            {
                                formLoading ? <CgSpinnerTwoAlt className="animate-spin" /> : "Add Schedule"
                            }
                        </button>
                    </form>
                )}
            </div>



            {/* display class schedules */}
            <div>
                {isPending && <LoadingSpinner />}

                {/* Error messages */}
                {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

                <ul className="space-y-2">
                    {classList.map((singleClass) => (
                        <li key={singleClass._id} className="flex justify-between items-center bg-base-300 border p-3 rounded">

                            <div className="space-y-1">
                                <h3 className="font-semibold">{singleClass.title}</h3>

                                <p className="text-sm">{singleClass.description}</p>

                                <p className="text-sm">
                                    Class Time:

                                    <button className="badge badge-success text-white ml-2 rounded">
                                        {format(singleClass.scheduled_time, "yyyy-MM-dd, HH:MM a")}
                                    </button>
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleScheduleUpdate(singleClass._id)}
                                    className="text-blue-500 hover:text-blue-600 mr-2"
                                >
                                    <FiEdit />
                                </button>
                                <button onClick={() => handleScheduleDelete(singleClass._id)} className="text-red-500 hover:text-red-600">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
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
                    <form onSubmit={handleSubmit(handleScheduleUpdate)} className="mb-6 p-4 rounded-lg">

                        {/* class title */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="label">
                                <span className="label-text">Title: </span>
                            </div>

                            <input
                                type="text"
                                placeholder="Class Title"

                                {...register("classTitle", { required: "Class Title is Required" })}

                                className="input input-bordered mb-2 w-full rounded-lg col-span-5"
                            />

                            {errors.classTitle && <p className="text-error font-medium text-sm mb-2">{errors.classTitle.message}</p>}
                        </div>


                        {/* class description */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="label">
                                <span className="label-text">Description: </span>
                            </div>

                            <textarea
                                placeholder="Class Description"

                                {...register("classDescription", { required: "Class Description is required" })}

                                className="textarea textarea-bordered mb-2 w-full  rounded-lg col-span-5"
                            />
                            {errors.classDescription && <p className="text-error font-medium text-sm mb-2">{errors.classDescription.message}</p>}
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

                                {...register("classScheduledDate", { required: "Class Date is Required" })}

                                className="mb-2 w-full input input-bordered rounded-lg col-span-5"
                            />
                            {errors.classScheduledDate && <p className="text-error font-medium text-sm mb-2">{errors.classScheduledDate.message}</p>}
                        </div>


                        {/* class time */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="label">
                                <span className="label-text">Time: </span>
                            </div>

                            <input
                                type="time"

                                {...register("classScheduledTime", { required: "Class Time is Required" })}

                                className="mb-2 w-full input input-bordered rounded-lg col-span-5"
                            />
                            {errors.classScheduledTime && <p className="text-error font-medium text-sm mb-2">{errors.classScheduledTime.message}</p>}
                        </div>


                        <button type="submit" className={`btn ${formLoading ? "btn-disabled" : "btn-success text-white font-bold"}  rounded`}>
                            {
                                formLoading ? <CgSpinnerTwoAlt className="animate-spin" /> : "Add Schedule"
                            }
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

ClassScheduleForm.propTypes = {
    course_id: PropTypes.string,
    faculty: PropTypes.array
}

export default ClassScheduleForm;