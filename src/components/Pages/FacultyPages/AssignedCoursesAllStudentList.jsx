import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router";


const AssignedCoursesAllStudentList = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [searchedCourseTitle, setSearchedCourseTitle] = useState("");
    const [expandedClass, setExpandedClass] = useState(null);


    const { data: assignedCoursesAllStudentList = [], isError, error, isPending } = useQuery({
        queryKey: ["assignedCoursesAllStudentList", user._id, searchedCourseTitle],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseStudentEnrollment/allEnrolledStudentForFaculty/${user._id}?search=${searchedCourseTitle}`);

            return res.data.data;
        },
        enabled: !!user._id
    })

    const toggleExpand = (classId) => {
        setExpandedClass(expandedClass === classId ? null : classId);
    };

    // Format date function
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            console.log(error);
            return dateString;
        }
    };

    const handleInputChange = (e) => {
        setSearchedCourseTitle(e.target.value);
    }



    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">
            <SectionHeading title="Enrolled Students by Assigned Courses" />

            {/* search field for course title */}
            <div className="flex items-center gap-2 mb-5 flex-row-reverse">
                <label className="label label-text max-w-28">
                    Search By Title:
                </label>
                <input
                    onChange={handleInputChange} type="text"
                    className="grow input input-bordered max-w-72" placeholder="Search"
                    value={searchedCourseTitle}
                />
            </div>


            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {isPending && <LoadingSpinner />}


            {
                assignedCoursesAllStudentList.length === 0
                    ?
                    <p className="text-lg text-error font-medium text-center">No student is enrolled in your courses or No Courses are assigned to you yet</p>

                    :

                    <div className="space-y-6">
                        {assignedCoursesAllStudentList.map((singleRecord, idx) => (
                            <div key={idx} className="border rounded-lg overflow-hidden shadow-sm">

                                {/* Class info header */}
                                <div
                                    className="p-4 cursor-pointer md:grid md:grid-cols-6 items-center gap-3"
                                    onClick={() => toggleExpand(idx)}
                                >
                                    {/* title and image */}
                                    <div className="grid grid-cols-3 md:grid-cols-10 items-center gap-2 md:col-span-4">
                                        <img src={singleRecord.cover_url} alt={singleRecord.title}
                                            className="md:col-span-4 w-full object-fill"
                                        />

                                        <div className="col-spn-2 md:col-span-6">
                                            <h3 className="font-medium md:text-lg">{singleRecord?.title}</h3>

                                            <span>Duration: {formatDate(singleRecord.start_date)} - {formatDate(singleRecord.end_date)}</span>
                                        </div>
                                    </div>

                                    {/* student count and arrow */}
                                    <div className="flex items-center w-full md:col-span-2 justify-center mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0">
                                        <span className="text-xs text-center md:text-left md:text-sm mr-2">
                                            Enrolled students: {singleRecord.students.length}
                                        </span>
                                        <svg
                                            className={`w-5 h-5 transition-transform ${expandedClass === idx ? 'transform rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>


                                {/* Attendance details */}
                                {expandedClass === idx && (
                                    <div className="overflow-x-auto border-t">
                                        <table className="table table-sm md:table-md">
                                            <thead>
                                                <tr>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Phone
                                                    </th>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>



                                            <tbody>
                                                {singleRecord.students.map((record) => (
                                                    <tr key={record._id} className="hover">
                                                        {/* name */}
                                                        <td className="px-2 md:px-6 py-2 md:py-4">
                                                            <h2 className="text-xs md:text-sm font-medium">
                                                                {record.first_name} {record.last_name}
                                                            </h2>
                                                        </td>

                                                        {/* email */}
                                                        <td className="px-2 md:px-6 py-2 md:py-4">
                                                            <h2 className="text-xs md:text-sm font-medium">
                                                                {record.email}
                                                            </h2>
                                                        </td>

                                                        {/* phone */}
                                                        <td className="px-2 md:px-6 py-2 md:py-4">
                                                            <h2 className="text-xs md:text-sm font-medium">
                                                                {record.phone}
                                                            </h2>
                                                        </td>


                                                        <td>
                                                            <Link to={`/${user?.user_role}/studentAcademicInfo/${record._id}`} className=" btn btn-success text-white btn-xs md:btn-sm">
                                                                Profile
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
            }
        </div>
    );
};

export default AssignedCoursesAllStudentList;