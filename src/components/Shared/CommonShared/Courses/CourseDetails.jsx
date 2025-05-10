import { Link, useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import SectionHeading from "../../../Utilities/SectionHeading";
import { FaCalendarAlt, FaChalkboardTeacher, FaMedal, FaTrash } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import { LuBookOpenCheck } from "react-icons/lu";
import Marquee from "react-fast-marquee";
import { IoWarningOutline } from "react-icons/io5";
import CourseUpdateForm from "../../Admin&FacultyShared/CourseUpdateForm";
import Swal from "sweetalert2";
import { RiUserAddFill } from "react-icons/ri";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import AssignFaculty from "../../../Pages/AdminPages/Courses/AssignFaculty";
import toast, { Toaster } from "react-hot-toast";
import SingleCourseEnrollmentList from "../../Admin&FacultyShared/SingleCourseEnrollmentList";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";



const CourseDetails = () => {


    const navigate = useNavigate();
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [showFacultyAssignmentForm, setShowFacultyAssignmentForm] = useState(false);


    const { data: getSingleCourseDetails = [], isError, error, isPending, refetch } = useQuery({
        queryKey: ["getSingleCourseDetails", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courses/${id}`);

            if (res.data.success) return res.data.data;
        }
    });


    const { _id, assigned_faculty, cover_url, credits, description, end_date, is_active, prerequisites, start_date, title, total_available_seats } = getSingleCourseDetails;


    const currentDate = new Date().toISOString().slice(0, 16);


    // course delete button for admin and faculty
    const handleCourseDeleteButton = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#008000",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                const courseDeleteRes = await axiosSecure.delete(`/courses/${_id}`)

                if (courseDeleteRes.data.success === true) {
                    navigate(`/${user.user_role}/courses`)
                    Swal.fire({
                        title: "Deleted!",
                        text: `${title} deleted successfully`,
                        icon: "success"
                    });
                }
            }
        });
    }


    // course enrollment apply button function
    const handleCourseEnrollment = async () => {
        const users_id = user._id;
        const course_id = _id;

        const result = await Swal.fire({
            title: "Confirm Enrollment?",
            text: "Check the necessary information carefully before enrolling in the course!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#006400",
            cancelButtonColor: "#d33",
            confirmButtonText: "Enroll"
        })


        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.post("/courseStudentEnrollment", { users_id, course_id });
                refetch();
                if (res.data.success === true) {
                    Swal.fire({
                        title: "Enrolled!",
                        text: `You have successfully enrolled in ${title}`,
                        icon: "success"
                    });
                }
            } catch (error) {
                console.log(error);
                const errorMessage = error.response?.data?.message || "Something went wrong";

                toast.error(errorMessage, { duration: 3000, position: "top-center" });
            }
        }
    }


    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex-1 p-3 md:p-8 mb-5 overflow-hidden">
            <Toaster />
            <SectionHeading title="Course Details" />


            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {/* course info */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* cover image */}
                <figure className="w-full h-72 lg:h-64 my-auto relative">
                    <img className="w-full h-full object-fill" src={cover_url} alt={title} />

                    <div className={`absolute -top-2 right-2 badge badge-lg animate-bounce font-medium text-white ${(total_available_seats > 0 && is_active && start_date > currentDate) ? "badge-success" : "badge-error"}`}>
                        {
                            (total_available_seats > 0 && is_active && start_date > currentDate) ?
                                "Enrollment : On Going"
                                :
                                "Enrollment : Closed"
                        }
                    </div>
                </figure>


                <div className="lg:col-span-2">
                    {/* marquee text */}
                    {
                        (total_available_seats > 0 && is_active && start_date > currentDate) &&
                        <div className="text-success">
                            <Marquee autoFill={true} pauseOnHover={true}>
                                <span className="mx-5">Scroll Down to apply</span>
                            </Marquee>
                        </div>
                    }

                    {/* title */}
                    <h2 className="text-2xl my-2"><span className="font-medium">Course Title:</span> {title}</h2>

                    {/* description */}
                    <p className="text-lg my-2"><span className="font-medium">Description:</span> {description}</p>

                    <div className="divider my-2"></div>


                    {/* other details */}
                    <div className="mt-4 grid lg:grid-cols-2 space-y-2">
                        {/* credits */}
                        <div className="flex items-center gap-2  text-lg">
                            <FaMedal className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                                Credits :
                            </span>
                            {credits}
                        </div>


                        {/* seats */}
                        <div className="flex items-center gap-2  text-lg">
                            <MdOutlineAirlineSeatReclineNormal className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                            Available Seats :
                            </span>
                            {total_available_seats}
                        </div>


                        {/* start date */}
                        <div className="flex items-center gap-2  text-lg">
                            <FaCalendarAlt className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                                Starts :
                            </span>
                            {new Date(start_date).toLocaleDateString()}
                        </div>


                        {/* end date */}
                        <div className="flex items-center gap-2  text-lg">
                            <FaCalendarAlt className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                                Ends :
                            </span>
                            {new Date(end_date).toLocaleDateString()}
                        </div>


                        {/* total faculty */}
                        <div className="flex items-center gap-2  text-lg">
                            <FaChalkboardTeacher className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                                Faculty Assigned :
                            </span>
                            {assigned_faculty.length}
                        </div>


                        {/* prerequisite */}
                        <div className="flex items-center gap-2  text-lg">
                            <LuBookOpenCheck className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                                Prerequisite Courses :
                            </span>
                            {prerequisites.length}
                        </div>
                    </div>
                </div>
            </div>


            <div className="divider divider-info my-4"></div>

            {/* faculty information and edit faculty */}
            <div>
                <div className="flex justify-between">
                    <SectionHeading title="Faculty Information" />


                    {/* assign/remove faculty button */}
                    {
                        user.user_role === "admin" && <button onClick={() => setShowFacultyAssignmentForm(!showFacultyAssignmentForm)} className={`mt-1 btn btn-sm ${showFacultyAssignmentForm ? "btn-error" : "btn-success"} text-white text-xs md:text-sm lg:text-base`}>
                            {
                                !showFacultyAssignmentForm ? <><RiUserAddFill /> Assign/Remove</> : <><IoMdClose /> Close</>
                            }</button>
                    }
                </div>


                {/* if no faculty is assigned */}
                {assigned_faculty.length === 0 &&
                    <span className="text-center text-error">Faculty Not Assigned Yet</span>
                }


                {/* show assigned faculty */}
                {
                    !showFacultyAssignmentForm && assigned_faculty.length > 0 &&
                    assigned_faculty.map((singleFaculty, index) =>
                        <div className="my-2 flex gap-1" key={singleFaculty._id}>
                            <h1 className="text-xl font-medium">{index + 1}.</h1>
                            <div>
                                <h2 className="text-xl">
                                    <span className="font-medium">Name:</span> {singleFaculty.first_name} {singleFaculty.last_name}

                                </h2>
                                <h3 className="text-xl italic">
                                    <span className="font-medium not-italic">Email: </span> {singleFaculty.email}
                                </h3>
                            </div>
                        </div>
                    )
                }


                {/* faculty assignment option */}
                {
                    showFacultyAssignmentForm && <AssignFaculty
                        courseId={id} assigned_faculty={assigned_faculty}
                        setShowFacultyAssignmentForm={setShowFacultyAssignmentForm}
                        refetch={refetch}

                    />
                }
            </div>

            <div className="divider divider-info my-4"></div>


            {/* prerequisites information */}
            <div>
                <SectionHeading title="Prerequisite Courses Information" />

                {prerequisites.length === 0 &&
                    <span className="text-center text-error">No prerequisite courses necessary</span>
                }

                {
                    prerequisites.length > 0 &&
                    prerequisites.map(singlePrerequisiteCourse => <div className="flex justify-between items-center my-2 border p-2 rounded-md" key={singlePrerequisiteCourse._id}>

                        <div className="flex gap-3 items-center">
                            <figure className="w-32 h-24">
                                <img className="w-full h-full" src={singlePrerequisiteCourse.cover_url} alt={singlePrerequisiteCourse.title} />
                            </figure>

                            <div className="space-y-1">
                                <h2 className="text-sm md:text-base lg::text-xl">
                                    <span className="font-medium">Title: </span> {singlePrerequisiteCourse.title}
                                </h2>


                                <h3 className="text-sm md:text-base lg::text-xl italic">
                                    <span className="font-medium not-italic">Credits: </span> {singlePrerequisiteCourse.credits}
                                </h3>
                            </div>
                        </div>
                        <Link to={`/${user.user_role}/courses/${singlePrerequisiteCourse._id}`} className="btn btn-sm md:btn-md btn-success text-white">Details</Link>
                    </div>
                    )}
            </div>



            {/* Course Enrollment */}
            <div>
                {/* apply button */}
                {
                    (user.user_role === "student" && is_active && total_available_seats > 0 && start_date > currentDate) &&
                    <div>
                        <div className="divider divider-info my-4"></div>

                        <SectionHeading title="Course Enrollment" />

                        <div className="alert alert-warning shadow-lg my-5">
                            <IoWarningOutline className="text-xl" />
                            <p>Warning: Check the course details, Faculty Information and Prerequisite courses before enrolling in this course </p>
                        </div>

                        <button onClick={handleCourseEnrollment} className="text-white btn btn-success w-full">Apply</button>
                    </div>
                }


                {/* if course enrollment is off */}
                {
                    (user.user_role === "student" && is_active && total_available_seats > 0 && start_date < currentDate) &&
                    <div>
                        <div className="divider divider-info my-4"></div>

                        <SectionHeading title="Course Enrollment" />

                        <div className="alert alert-error text-white text-xl font-medium shadow-lg my-5">
                            <IoWarningOutline className="text-xl" />
                            <p>Note: Even though there are seats available but the classes for this course have already started on {new Date(start_date).toISOString().slice(0, 10)}. So the enrollment is closed.  </p>
                        </div>
                    </div>
                }
            </div>



            {/* course edit and delete option for admin and faculty */}
            {
                user.user_role !== "student" &&
                <div>
                    <div className="divider divider-info my-4"></div>

                    <SectionHeading title="Edit Course Details" />


                    <CourseUpdateForm refetch={refetch} singleCourseDetails={getSingleCourseDetails} />


                    {/* delete course */}
                    <button onClick={handleCourseDeleteButton} className="btn btn-sm md:btn-md btn-error text-white mt-4"><FaTrash /> Delete This Course</button>
                </div>
            }



            {/* show a list of enrolled student for this course */}
            {
                user.user_role !== "student" &&
                <SingleCourseEnrollmentList id={id} />
            }
        </div>
    );
};




export default CourseDetails;