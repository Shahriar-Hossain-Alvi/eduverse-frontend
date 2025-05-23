import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";
import { format } from "date-fns";
import EnrolledCoursesClassSchedule from "./EnrolledCoursesClassSchedule";
import SingleEnrolledCourseMaterials from "./SingleEnrolledCourseMaterials";
import StudentGradeFormAndList from "../../Shared/CommonShared/StudentGradeFormAndList ";



const SingleEnrolledCourseDetails = () => {
    const { id } = useParams(); // course student enrollment id
    const axiosSecure = useAxiosSecure();


    const { data: singleEnrolledCourse = [], isPending, isError, error } = useQuery({
        queryKey: ["singleEnrolledCourse", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseStudentEnrollment/${id}`);

            return [res.data.data];
        },
        enabled: !!id
    });

    const singleEnrolledCourseObject = singleEnrolledCourse[0] || {};


    const { course_id } = singleEnrolledCourseObject;

    if (isPending) return <LoadingSpinner />


    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <h1 className="text-center font-semibold text-3xl md:text-4xl mb-8 underline">COURSE DETAILS</h1>

            <SectionHeading title={`Title: ${course_id.title}`} />

            <p className="md:text-lg font-medium">{course_id.description}</p>

            <div className="flex items-center md:gap-3 mt-5">
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
                     {course_id.credits}</h4>
            </div>


            {/* CLass schedules */}
            <EnrolledCoursesClassSchedule courseID={course_id._id} />


            {/* Course Materials */}
            <SingleEnrolledCourseMaterials courseID={course_id._id} />


            {/* student grades */}
            <StudentGradeFormAndList course_id={course_id?._id} />
        </div>
    );
};

export default SingleEnrolledCourseDetails;