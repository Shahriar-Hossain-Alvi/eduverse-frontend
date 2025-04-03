import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SectionHeading from "../../Utilities/SectionHeading";
import EnrolledStudentList from "../../Shared/Admin&FacultyShared/EnrolledStudentList";
import ClassScheduleFormAndList from "../../Shared/Admin&FacultyShared/ClassScheduleFormAndList"
import CourseMaterialFormAndList from "../../Shared/Admin&FacultyShared/CourseMaterialFormAndList";
import { format } from "date-fns";



const SingleAssignedCourseDetails = () => {

    const { id } = useParams(); // courseFacultyAssignments id
    const axiosSecure = useAxiosSecure();


    // fetch single assigned course details using courseFacultyAssignments id
    const { data: singleAssignedCourse = {}, isError, error, isPending } = useQuery({
        queryKey: ["singleAssignedCourse", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseFacultyAssignments/${id}`)

            return res.data.data;
        }
    });



    const { course_id, // oject
        is_active,
        users_id, // array
    } = singleAssignedCourse;




    if (isPending) return <LoadingSpinner />



    return (
        <div className="flex-1 p-3 md:p-8">
            {/* Error messages */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <h1 className="text-center font-semibold text-3xl md:text-4xl mb-8 underline">COURSE DETAILS</h1>

            {/* title and description */}
            <SectionHeading title={`Title: ${course_id.title}`} />

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
            <ClassScheduleFormAndList course_id={course_id._id} faculty={users_id} />


            {/* upload course materials */}
            <div className="overflow-hidden">
                <CourseMaterialFormAndList course_id={course_id._id} />
            </div>



            {/* enrolled student list */}
            <EnrolledStudentList course_id={course_id._id} />

        </div>
    );
};

export default SingleAssignedCourseDetails;