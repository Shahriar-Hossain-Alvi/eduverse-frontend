import { useState } from "react";
import SectionHeading from "../Utilities/SectionHeading";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { format, parse, parseISO } from "date-fns"
import toast, { Toaster } from "react-hot-toast";
import { handleError } from "../Utilities/HandleError";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import PropTypes from "prop-types";


const ClassScheduleForm = ({ course_id, faculty }) => {
    const axiosSecure = useAxiosSecure();

    const [schedules, setSchedules] = useState([])
    const [showScheduleForm, setShowScheduleForm] = useState(false);



    // hook form
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


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

        console.log(classScheduleData);

        try {
            const res = await axiosSecure.post("/classes", classScheduleData);

            if (res.data.success) {
                reset();
                toast.success(res.data.message, {
                    duration: 2500,
                    position: "top-center"
                })
            }
        } catch (error) {
            handleError(error, "Something went wrong, try again later!");
        }

        setShowScheduleForm(false);
    }




    const handleScheduleDelete = (id) => {
        setSchedules(schedules.filter((schedule) => schedule.id !== id))
    }

    const handleScheduleUpdate = (id) => {
        const scheduleToUpdate = schedules.find((schedule) => schedule.id === id);

        setShowScheduleForm(true)
    }



    return (
        <div>
            <Toaster />
            <SectionHeading title="Class Schedules" />

            {/* toggle schedule form */}
            <button
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className="mb-4 btn bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg"
            >
                <FiPlus className="mr-2" /> Add New Schedule
            </button>


            {/* form */}
            {showScheduleForm && (
                <form onSubmit={handleSubmit(handleScheduleSubmit)} className="mb-6 p-4 rounded-lg">

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


                    <button type="submit" className="btn btn-success text-white font-bold  rounded">
                        Add Schedule
                    </button>
                </form>
            )}



            {/* display class schedules */}
            <ul className="space-y-2">
                {schedules.map((schedule) => (
                    <li key={schedule.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                        <div>
                            <h3 className="font-semibold">{schedule.title}</h3>
                            <p className="text-sm text-gray-600">{schedule.description}</p>
                            <p className="text-sm text-gray-500">{new Date(schedule.scheduled_time).toLocaleString()}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleScheduleUpdate(schedule.id)}
                                className="text-blue-500 hover:text-blue-600 mr-2"
                            >
                                <FiEdit />
                            </button>
                            <button onClick={() => handleScheduleDelete(schedule.id)} className="text-red-500 hover:text-red-600">
                                <FiTrash2 />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

ClassScheduleForm.propTypes = {
    course_id: PropTypes.string,
    faculty: PropTypes.array
}

export default ClassScheduleForm;