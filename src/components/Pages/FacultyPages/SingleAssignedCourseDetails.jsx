import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SectionHeading from "../../Utilities/SectionHeading";
import EnrolledStudentList from "../../Shared/Admin&FacultyShared/EnrolledStudentList";
import CourseMaterialFormAndList from "../../Shared/Admin&FacultyShared/CourseMaterialFormAndList";
import { format } from "date-fns";
import ClassScheduleFormAndList from "./Classes/ClassScheduleFormAndList";
import useAuth from "../../Hooks/useAuth";
import { handleError } from "../../Utilities/handleError";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useState } from "react";
import StudentGradeFormAndList from "../../Shared/Admin&FacultyShared/StudentGradeFormAndList ";



const SingleAssignedCourseDetails = () => {

    const { id } = useParams(); // courseFacultyAssignments id
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [buttonLoading, setButtonLoading] = useState(false);


    // fetch single assigned course details using courseFacultyAssignments id
    const { data: singleAssignedCourse = {}, isError, error, isPending, refetch } = useQuery({
        queryKey: ["singleAssignedCourse", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseFacultyAssignments/${id}`)

            return res.data.data;
        }
    });



    const { _id,
        course_id, // oject
        is_active,
        users_id, // array
    } = singleAssignedCourse;



    // handle is_active field
    const handleCourseDisableButton = async () => {
        let updatedDoc = {};

        if (is_active) updatedDoc.is_active = false;
        if (!is_active) updatedDoc.is_active = true;

        if (Object.keys(updatedDoc).length === 0) return toast.error("Is Active is not changed", {
            duration: 1500,
            position: "top-center"
        })

        const swalResponse = await Swal.fire({
            title: `${is_active ? "Disable" : "Enable"} this assigned course?`,
            text: "Some functionalities may be unavailable on this page",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#16A34A",
            confirmButtonText: "Yes"
        });

        if (swalResponse.isConfirmed) {
            try {
                setButtonLoading(true);
                const res = await axiosSecure.patch(`/courseFacultyAssignments/${_id}`, updatedDoc);

                if (res.data.success === true) {
                    setButtonLoading(false);
                    refetch();
                    Swal.fire({
                        title: updatedDoc.is_active ? "Enabled" : "Disabled",
                        text: "This course assignment has been disabled.",
                        icon: "success",
                        confirmButtonColor: "#16A34A",
                    });
                }
            } catch (error) {
                handleError(error, "Something went wrong! Please try again.");
                setButtonLoading(false);
            }
        }
    }


    if (isPending) return <LoadingSpinner />



    return (
        <div className="flex-1 p-3 md:p-8">
            {/* Error messages */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <h1 className="text-center font-semibold text-3xl md:text-4xl mb-8 underline">COURSE DETAILS</h1>

            {/* title and description */}
            <SectionHeading title={`Title: ${course_id?.title}`} />

            <p className="font-medium md:text-lg mb-5">{course_id.description}</p>

            <div className="flex md:gap-3 items-center mt-5">
                <h4>
                    <span className="font-medium mr-1">
                        Start:
                    </span>
                    {format(new Date(course_id.start_date), "MMMM d, yyyy")}
                </h4>

                <div className="divider divider-horizontal"></div>

                <h4>
                    <span className="font-medium mr-1">
                        End:
                    </span>
                    {format(new Date(course_id.end_date), "MMMM d, yyyy")}
                </h4>

                <div className="divider divider-horizontal"></div>

                <h4>
                    <span className="font-medium mr-1">
                        Credits:
                    </span>
                    {course_id.credits}
                </h4>
            </div>


            {/* class schedules form*/}
            <ClassScheduleFormAndList course_id={course_id?._id} faculty={users_id} isCourseAssignmentActive={is_active} />


            {/* upload course materials */}
            <div className="overflow-hidden">
                <CourseMaterialFormAndList course_id={course_id?._id} isCourseAssignmentActive={is_active} />
            </div>



            {/* enrolled student list */}
            <EnrolledStudentList course_id={course_id?._id} />



            {/* student grade form and list */}
            <StudentGradeFormAndList course_id={course_id?._id} />


            {/* disable button */}
            {
                user.user_role === "admin" &&
                <div className="mt-10">
                    <div className="divider divider-error">Danger Zone</div>

                    <div className="space-x-2">
                        <span className="font-medium text-lg">
                            {
                                is_active ? "Disable this Assigned Course:" : "Enable this Assigned Course:"
                            }
                        </span>

                        {
                            is_active ?
                                <button onClick={() => handleCourseDisableButton()} disabled={buttonLoading} className="btn btn-error text-white btn-sm">Disable</button>
                                :
                                <button onClick={() => handleCourseDisableButton()} disabled={buttonLoading} className="btn btn-success text-white btn-sm">Enable</button>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default SingleAssignedCourseDetails;