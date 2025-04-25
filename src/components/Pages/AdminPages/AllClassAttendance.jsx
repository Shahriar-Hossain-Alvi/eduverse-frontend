import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import { useState } from "react";
import { format } from 'date-fns';
import { MdDeleteForever } from "react-icons/md";
import { handleError } from "../../Utilities/handleError";
import Swal from "sweetalert2";
import { Link } from "react-router";



const AllClassAttendance = () => {
    const axiosSecure = useAxiosSecure();
    const [expandedClass, setExpandedClass] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);


    const { data: allClassAttendance = [], isError, isPending, error, refetch } = useQuery({
        queryKey: ["allClassAttendance"],
        queryFn: async () => {
            const res = await axiosSecure.get("/classAttendance");

            return res.data.data;
        }
    });


    if (isPending) return <LoadingSpinner />


    const toggleExpand = (classId) => {
        setExpandedClass(expandedClass === classId ? null : classId);
    };


    // Format date function
    const formatDate = (dateString) => {
        console.log(dateString);
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            console.log(error);
            return dateString;
        }
    };


    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'present':
                return 'badge-success text-xs md:text-base text-white';
            case 'absent':
                return 'badge-error text-xs md:text-base text-white';
            case 'early leave':
                return 'badge-warning text-xs md:text-base text-black';
            case 'late':
                return 'badge-warning text-xs md:text-base text-black';
            default:
                return 'badge-primary text-xs md:text-base text-white';
        }
    };


    // delete attendance of a class
    const handleAttendanceDelete = async (id) => {
        console.log(id);
        try {
            const swalResponse = await Swal.fire({
                title: `Delete this attendance?`,
                text: "This can not be reversed!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#FF0000",
                cancelButtonColor: "#16A34A",
                confirmButtonText: "Yes"
            });

            if (swalResponse.isConfirmed) {
                try {
                    setButtonLoading(true);
                    const res = await axiosSecure.delete(`/classAttendance/${id}`);

                    if (res.data.success === true) {
                        setButtonLoading(false);
                        refetch();
                        Swal.fire({
                            title: "Deleted",
                            text: `${res.data.message}`,
                            icon: "success",
                            confirmButtonColor: "#16A34A",
                        });
                    }
                } catch (error) {
                    handleError(error, "Something went wrong! Please try again.");
                    setButtonLoading(false);
                    refetch();
                }
            }
        } catch (error) {
            handleError(error, "Assigned course could not be deleted")
        }
    }


    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">
            <SectionHeading title="All Attendance" />

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {allClassAttendance.length === 0 ? (
                <div className="text-center py-8 rounded-lg">
                    <p className="text-gray-500">No attendance records found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allClassAttendance.map((classRecord) => (
                        <div key={classRecord._id} className="border rounded-lg overflow-hidden shadow-sm">



                            {/* Class info header */}
                            <div
                                className="p-4 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleExpand(classRecord.class_id)}
                            >
                                {/* title and date */}
                                <div>
                                    <h3 className="font-medium md:text-lg">{classRecord?.class_id?.title}</h3>

                                    <p className="text-sm">{formatDate(classRecord?.attendance_date)}</p>
                                </div>

                                {/* delete button */}



                                {/* student count and arrow */}
                                <div className="flex items-center mr-4">
                                    <span className="text-xs text-center md:text-left md:text-sm mr-2">
                                        {classRecord.attendance_record.length} students
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-transform ${expandedClass === classRecord.class_id ? 'transform rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>


                            {/* Attendance details */}
                            {expandedClass === classRecord.class_id && (
                                <div className="border-t">
                                    <div className="overflow-x-auto">
                                        <table className="table table-sm md:table-md">
                                            <thead>
                                                <tr>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Student
                                                    </th>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-2 md:px-6 py-2 md:py-4 font-medium uppercase tracking-wider">
                                                        Remarks
                                                    </th>
                                                </tr>
                                            </thead>



                                            <tbody>
                                                {classRecord.attendance_record.map((record) => (
                                                    <tr key={record._id} className="hover">
                                                        {/* name and email */}
                                                        <td className="px-2 md:px-6 py-2 md:py-4">
                                                            <h2 className="text-sm font-medium">
                                                                {record.student_id.first_name} {record.student_id.last_name}
                                                            </h2>
                                                            <span className="text-xs">
                                                                {record.student_id.email}
                                                            </span>
                                                        </td>


                                                        <td className="px-2 md:px-6 py-2 md:py-4">
                                                            <span className={`badge ${getStatusBadge(record.is_present)}`}>
                                                                {record.is_present}
                                                            </span>
                                                        </td>

                                                        <td className="px-2 md:px-6 py-2 md:py-4 text-sm text-center md:text-left">
                                                            {record.remarks || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Class info footer */}
                                    <div className="px-4 py-3 text-xs border-t">
                                        <div className="flex justify-between items-center">
                                            <span>Created by: {classRecord?.created_by?.first_name || "Deleted"} {classRecord?.created_by?.last_name || "user"}</span>


                                            <div className="space-y-1 md:space-x-2">
                                                <Link
                                                    to={`/admin/classDetails/${classRecord.class_id._id}`}
                                                    className="btn btn-success text-xs md:text-sm btn-xs md:btn-sm text-white">
                                                    View Class Details
                                                </Link>

                                                <button
                                                    disabled={buttonLoading}
                                                onClick={() => handleAttendanceDelete(classRecord._id)} className="btn btn-xs md:btn-sm text-xs md:text-sm btn-error text-white">
                                                    Delete <MdDeleteForever className="text-" />
                                                </button>
                                            </div>



                                            <span>Created: {formatDate(classRecord.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllClassAttendance;