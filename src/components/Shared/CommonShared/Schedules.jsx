import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { Link } from "react-router";
import themeStyles from "../../Utilities/themeStyles";
import { BiError, BiSearch } from "react-icons/bi";
import { format } from "date-fns";
import useTheme from "../../Hooks/useTheme"
import { FaCalendar, FaLocationDot } from "react-icons/fa6";
import { IoMdClose, IoMdPeople } from "react-icons/io";
import { FaCaretRight, FaClock } from "react-icons/fa";
import { useState } from "react";



const Schedules = () => {
    const axiosSecure = useAxiosSecure();
    const { theme } = useTheme();
    const { user } = useAuth();
    const [searchedClassTitle, setSearchedClassTitle] = useState("");
    const [clickedTodaysScheduleButton, setClickedTodaysScheduleButton] = useState(false);
    const [dateQuery, setDateQuery] = useState(false);


    const { data: allClassList = [], isError, error, isPending } = useQuery({
        queryKey: ["allClassList", user?.user_role, user?._id, searchedClassTitle, dateQuery],
        queryFn: async () => {
            const userRole = user?.user_role;

            if (userRole === "faculty") {
                const res = await axiosSecure.get(`/classes/allAssignedCourseClasses/${user?._id}?search=${searchedClassTitle}&&todaysClass=${dateQuery}`);

                return res.data.data;
            }

            if (userRole === "admin") {
                const res = await axiosSecure.get(`/classes?search=${searchedClassTitle}&&todaysClass=${dateQuery}`);

                return res.data.data;
            }

            if (userRole === "student") {
                const res = await axiosSecure.get(`/classes/allEnrolledCourseClasses/${user?._id}?search=${searchedClassTitle}&&todaysClass=${dateQuery}`);

                return res.data.data;
            }


        },
        enabled: !!user && !!user._id && !!user.user_role
    });


    // input class title
    const handleInputChange = (e) => {
        setSearchedClassTitle(e.target.value);
    }


    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="All Class Schedule" />

            <div className="mb-5 flex gap-2">

                <label className="input input-bordered flex items-center gap-2 w-full">
                    <BiSearch />

                    <input
                        disabled={clickedTodaysScheduleButton}
                        onChange={handleInputChange}
                        value={searchedClassTitle}
                        type="text" className="grow" placeholder="Search" />
                </label>

                {
                    clickedTodaysScheduleButton ?
                        <button onClick={() => {
                            setClickedTodaysScheduleButton(false);
                            setDateQuery(false);
                        }} className="btn btn-error text-white"><IoMdClose /> Clear Filter</button>
                        :
                        <button onClick={() => {
                            setDateQuery(true);
                            setClickedTodaysScheduleButton(true);
                        }} className="btn"><FaCalendar /> Today</button>}
            </div>

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {/* display class schedules */}
            <div>
                {isPending && <LoadingSpinner />}

                {/* Error messages */}
                {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

                {allClassList.length === 0 && <p className="text-center text-error text-lg font-medium">No Class Schedules were found</p>}

                <div className="space-y-2">
                    {allClassList.map((singleClass) => (
                        <div key={singleClass._id} className={`${themeStyles.background[theme]} border-2 p-3 rounded`}>

                            <div className="space-y-2 md:space-y-1">
                                {/* title */}
                                <h3 className="font-bold text-xl">
                                    {singleClass.title}
                                </h3>

                                {/* description */}
                                <p>{singleClass.description}</p>


                                {/* time */}
                                <p className="flex items-center gap-2">
                                    <FaClock className="text-lg" />

                                    <span>
                                        {format(singleClass.scheduled_time, "yyyy-MM-dd, hh:mm a")}
                                    </span>
                                </p>


                                {/* location */}
                                <p className="flex items-center gap-2">
                                    <FaLocationDot className="text-lg" />
                                    {singleClass.location}

                                    {
                                        singleClass.location === "" &&
                                        <BiError className="inline ml-1 text-error text-base animate-pulse" />
                                    }
                                </p>


                                {/* faculty */}
                                <div className='flex flex-wrap items-center gap-2'>
                                    <IoMdPeople className="text-xl" />

                                    {(singleClass.faculty_id).map(singleFaculty =>
                                        <p key={singleFaculty._id} className='badge badge-ghost'>{singleFaculty.first_name} {singleFaculty.last_name}</p>
                                    )}
                                </div>
                            </div>



                            <div className="mt-4">

                                {/* class details button */}
                                {
                                    user?.user_role === "student" &&
                                    <Link to={`/student/myEnrolledCourses/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-block`}>Details <FaCaretRight className="text-lg" /> </Link>
                                }
                                {
                                    user?.user_role === "faculty" &&
                                    <Link to={`/faculty/myCourses/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-block`}>Details <FaCaretRight className="text-lg" /> </Link>
                                }
                                {
                                    user?.user_role === "admin" &&
                                    <Link to={`/admin/classDetails/${singleClass._id}`} className={`btn ${themeStyles.button[theme]} btn-block`}>Details <FaCaretRight className="text-lg" /> </Link>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Schedules;