import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure"
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";
import { format } from "date-fns";
import ClassMaterialFormAndList from "./ClassMaterialFormAndList";
import EnrolledStudentsClassAttendanceForm from "./EnrolledStudentsClassAttendanceForm";



const SingleClassDetails = () => {
    const { id } = useParams(); // class id
    const axiosSecure = useAxiosSecure();

    const { data: singleClassDetails = {}, isError, isPending, error } = useQuery({
        queryKey: ["singleClassDetails", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/${id}`);

            return res.data.data;
        },
        enabled: !!id
    })


    const { course_id, description, faculty_id, is_active, location, scheduled_time, title } = singleClassDetails

    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex-1 p-3 md:p-8">
            {/* error message */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {/* title and description */}
            <SectionHeading title={title} />

            <p className="font-medium text-lg mb-5">{description}</p>

            {/* time and location */}
            <div className="flex items-center py-5">
                <div className="w-2/5 space-y-2">

                    <p className="font-medium">
                        <span className="underline mr-1">Date:</span>

                        {format(new Date(scheduled_time), "MMMM d, yyyy")}
                    </p>


                    <p className="font-medium">
                        <span className="underline mr-1">Time:</span>

                        {format(new Date(scheduled_time), "hh:mm a")}
                    </p>
                </div>

                <div className="divider divider-horizontal divider-success w-1/5"></div>

                <p className="text-lg w-2/5"><span className="font-medium underline">Location:</span> {location}</p>
            </div>

            <ClassMaterialFormAndList class_id={id} />

            <EnrolledStudentsClassAttendanceForm course_id={course_id} class_id={id} />
            <div>

                Attendance

                Grades


            </div>

        </div>
    );
};

export default SingleClassDetails;