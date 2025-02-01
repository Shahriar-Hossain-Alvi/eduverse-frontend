import { Link, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import SectionHeading from "../../../Utilities/SectionHeading";
import { FaCalendarAlt, FaChalkboardTeacher, FaMedal } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import { LuBookOpenCheck } from "react-icons/lu";
import Marquee from "react-fast-marquee";
import { IoWarningOutline } from "react-icons/io5";
import CourseUpdateForm from "../../CourseUpdateForm";



const CourseDetails = () => {

    // todo: create enrollment button function
    // todo: create course update form for admin and faculty

    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: getSingleCourseDetails = [], isError, error, isPending, refetch } = useQuery({
        queryKey: ["getSingleCourseDetails", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courses/${id}`);
            if (res.data.success) return res.data.data;
        }
    })

    const { _id, assigned_faculty, cover_url, credits, description, end_date, is_active, prerequisites, start_date, title, total_available_seats } = getSingleCourseDetails;

    const currentDate = new Date().toISOString().slice(0, 16);


    const handleCourseEnrollment = () => {
        console.log(_id);
    }


    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex-1 p-3 md:p-8 mb-5">

            <SectionHeading title="Course Details" />


            {isError && <p className="text-2xl text-error text-center">{error.message}</p>}

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


                {/* marquee text */}
                <div className="lg:col-span-2">
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
                                Total Available Seats :
                            </span>
                            {total_available_seats}
                        </div>


                        {/* start date */}
                        <div className="flex items-center gap-2  text-lg">
                            <FaCalendarAlt className="h-5 w-5 text-green-600" />
                            <span className="font-medium">
                                Starts From :
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

            {/* faculty information */}
            <div>
                <SectionHeading title="Faculty Information" />

                {assigned_faculty.length === 0 &&
                    <span className="text-center text-error">Faculty Not Assigned Yet</span>
                }

                {
                    assigned_faculty.length > 0 &&
                    assigned_faculty.map(singleFaculty =>
                        <div key={singleFaculty._id}>
                            <h2 className="text-xl">
                                <span className="font-medium">Name:</span> {singleFaculty.first_name} {singleFaculty.last_name}

                            </h2>
                            <h3 className="text-xl italic">
                                <span className="font-medium not-italic">Email: </span> {singleFaculty.email}</h3>
                        </div>
                    )
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
                    prerequisites.map(singlePrerequisiteCourse => <div className="flex justify-between items-center" key={singlePrerequisiteCourse._id}>

                        <div className="flex gap-3 items-center">
                            <figure className="w-24 h-24">
                                <img className="w-full h-full" src={singlePrerequisiteCourse.cover_url} alt={singlePrerequisiteCourse.title} />
                            </figure>

                            <div className="space-y-1">
                                <h2 className="text-xl">
                                    <span className="font-medium">Title: </span> {singlePrerequisiteCourse.title}
                                </h2>


                                <h3 className="text-xl italic">
                                    <span className="font-medium not-italic">Credits: </span> {singlePrerequisiteCourse.credits}
                                </h3>
                            </div>
                        </div>
                        <Link to={`/${user.user_role}/courses/${singlePrerequisiteCourse._id}`} className="btn btn-success text-white">View Details</Link>
                    </div>
                    )}
            </div>





            {/* apply option for students */}
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



            {/* course edit option for admin and faculty */}
            {
                user.user_role !== "student" &&
                <div>
                    <div className="divider divider-info my-4"></div>

                    <SectionHeading title="Edit Course Details" />


                    <CourseUpdateForm refetch={refetch} singleCourseDetails={getSingleCourseDetails} />
                </div>
            }


        </div>
    );
};




export default CourseDetails;