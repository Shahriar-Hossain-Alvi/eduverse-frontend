import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { Link } from "react-router";
import themeStyles from "../../Utilities/themeStyles";
import { BiError } from "react-icons/bi";
import { format } from "date-fns";
import useTheme from "../../Hooks/useTheme"



const Schedules = () => {
    const axiosSecure = useAxiosSecure();
    const { theme } = useTheme();
    const { user } = useAuth();

    const { data: allClassList = [], isError, error, isPending } = useQuery({
        queryKey: ["allClassList"],
        queryFn: async () => {
            const userRole = user?.user_role;

            if (userRole === "faculty") {
                const res = await axiosSecure.get(`/classes/allAssignedCourseClasses/${user?._id}`);

                return res.data.data;
            }

            if (userRole === "admin") {
                const res = await axiosSecure.get("/classes");

                return res.data.data;
            }
            
            if(userRole === "student"){
                const res = await axiosSecure.get(`/classes/allEnrolledCourseClasses/${user?._id}`);
    
                return res.data.data;
            }


        },
        enabled: !!user && !!user._id && !!user.user_role
    });



    if (isPending) return <LoadingSpinner />


    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="All Class Schedule" />

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {/* display class schedules */}
            <div>
                {isPending && <LoadingSpinner />}

                {/* Error messages */}
                {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

                {allClassList.length === 0 && <p className="text-center text-error text-lg font-medium">Class Schedules are not added yet</p>}

                <ul className="space-y-2">
                    {allClassList.map((singleClass) => (
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
                                <div className='flex flex-wrap items-center gap-1'>
                                    <h2 className="underline font-semibold mr-1">Faculties: </h2>
                                    {(singleClass.faculty_id).map(singleFaculty =>
                                        <p key={singleFaculty._id} className='badge badge-outline'>{singleFaculty.first_name} {singleFaculty.last_name}</p>
                                    )}
                                </div>
                            </div>


                            {/* edit and delete button */}
                            <div className="flex md:block text-center items-center md:space-y-3 mt-4 md:mt-0 space-x-3 md:space-x-0">

                                {/* class details button */}
                                {
                                    user?.user_role === "student" &&
                                    <Link to={`/student/myEnrolledCourses/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-sm md:btn-md`}>Details</Link>
                                }
                                {
                                    user?.user_role === "faculty" &&
                                    <Link to={`/faculty/myCourses/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-sm md:btn-md`}>Details</Link>
                                }
                                {
                                    user?.user_role === "admin" &&
                                    <Link to={`/admin/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-sm md:btn-md`}>Details</Link>
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Schedules;