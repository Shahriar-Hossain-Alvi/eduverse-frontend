import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import { useState } from "react";
import { format } from 'date-fns';
import useTheme from "../../Hooks/useTheme"
import themeStyles from "../../Utilities/themeStyles";




const AllClassAttendance = () => {
    const axiosSecure = useAxiosSecure();
    const { theme } = useTheme();
    const [expandedClass, setExpandedClass] = useState(null);


    const { data: allClassAttendance = [], isError, isPending, error } = useQuery({
        queryKey: ["allClassAttendance"],
        queryFn: async () => {
            const res = await axiosSecure.get("/classAttendance");

            return res.data.data;
        }
    });

    console.log(allClassAttendance);

    if (isPending) return <LoadingSpinner />


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


    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'present':
                return 'badge-success text-white';
            case 'absent':
                return 'badge-error text-white';
            case 'early leave':
                return 'badge-warning text-black';
            case 'late':
                return 'badge-warning text-black';
            default:
                return 'badge-primary text-white';
        }
    };

    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="All Attendance" />

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {allClassAttendance.length === 0 ? (
                <div className="text-center py-8 rounded-lg">
                    <p className="text-gray-500">No attendance records found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allClassAttendance.map((classRecord, index) => (
                        <div key={index} className={`border rounded-lg overflow-hidden shadow-sm ${themeStyles.background[theme]}`}>
                            {/* Class info header */}
                            <div
                                className="p-4 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleExpand(classRecord.class_id)}
                            >
                                <div>
                                    <h3 className="font-medium text-lg">{classRecord?.class_id?.title}</h3>
                                    <p className="text-sm">{formatDate(classRecord?.attendance_date)}</p>
                                </div>


                                {/* student count and arrow */}
                                <div className="flex items-center">
                                    <span className="text-sm mr-2">
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
                                        <table className="min-w-full divide-y">
                                            <thead className={`${themeStyles.background[theme]}`}>
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                        Student
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                        Remarks
                                                    </th>
                                                </tr>
                                            </thead>



                                            <tbody className={`${themeStyles.background[theme]} divide-y`}>
                                                {classRecord.attendance_record.map((record) => (
                                                    <tr key={record._id} className="hover">
                                                        {/* name and email */}
                                                        <td className="px-6 py-4">
                                                            <h2 className="text-sm font-medium">
                                                                {record.student_id.first_name} {record.student_id.last_name}
                                                            </h2>
                                                            <span className="text-xs">
                                                                {record.student_id.email}
                                                            </span>
                                                        </td>


                                                        <td className="px-6 py-4">
                                                            <span className={`badge ${getStatusBadge(record.is_present)}`}>
                                                                {record.is_present}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4 text-sm">
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
                                            <span>Created by: {classRecord?.created_by.first_name} {classRecord?.created_by.last_name}</span>
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