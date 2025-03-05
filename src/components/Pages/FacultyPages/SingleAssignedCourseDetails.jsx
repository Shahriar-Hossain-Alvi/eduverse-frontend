import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SectionHeading from "../../Utilities/SectionHeading";
import EnrolledStudentList from "../../Shared/Admin&FacultyShared/EnrolledStudentList";
import ClassScheduleFormAndList from "../../Shared/Admin&FacultyShared/ClassScheduleFormAndList"
import CourseMaterialFormAndList from "../../Shared/Admin&FacultyShared/CourseMaterialFormAndList";

// todo:
//     <h1>Show list of total enrolled students.</h1>
//     <h1>Show/option to create/schedule a class for this course (admin & faculty).</h1>
//     <h1>Show/option to upload course materials (admin & faculty)</h1>


const SingleAssignedCourseDetails = () => {

    const { id } = useParams(); // courseFacultyAssignments id
    const axiosSecure = useAxiosSecure();


    // fetch single assigned course details using courseFacultyAssignments id
    const { data: singleAssignedCourse = [], isError, error, isPending } = useQuery({
        queryKey: ["singleAssignedCourse", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseFacultyAssignments/${id}`)

            return [res.data.data];
        }
    });

    const singleAssignedCourseObject = singleAssignedCourse[0] || {};

    const { course_id, // oject
        is_active,
        users_id, // array
    } = singleAssignedCourseObject;


    if (isPending) return <LoadingSpinner />



    return (
        <div className="flex-1 p-3 md:p-8">
            {/* Error messages */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {/* title and description */}
            <SectionHeading title={course_id.title} />

            <p className="font-medium text-lg mb-5">{course_id.description}</p>


            {/* class schedules form*/}
            <ClassScheduleFormAndList course_id={course_id._id} faculty={users_id} />


            {/* upload course materials */}
            <CourseMaterialFormAndList />



            {/* enrolled student list */}
            <EnrolledStudentList course_id={course_id._id} />

        </div>
    );
};

export default SingleAssignedCourseDetails;