import { Link, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import { format } from "date-fns";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import { FaDownload } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import PropTypes from 'prop-types';




const StudentAttendanceTab = ({ studentInfo }) => {
    const { id } = useParams(); //student id
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // fetch grades
    const { data: studentAttendance = [], isPending, isError, error } = useQuery({
        queryKey: ["studentAttendance", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classAttendance/studentAttendance/${id}`);

            return res?.data?.data;
        },
        enabled: !!id
    })

    // create grades pdf
    const generatePDF = (attendanceData) => {

        const doc = new jsPDF();

        // get student info
        // const gradesOf = `${studentInfo.first_name} ${studentInfo.last_name}`;


        // title
        doc.setFontSize(30);
        doc.text("Class Attendance Record", 45, 10);

        // student name, email, phone
        doc.setFontSize(16);
        doc.text(`Attendance of: ${studentInfo.first_name || "Unavailable"} ${studentInfo.last_name || "User"}`, 60, 20);

        doc.setFontSize(12);
        doc.text(`Email: ${studentInfo.email || "Not Found"}`, 60, 27);

        doc.setFontSize(12);
        doc.text(`Phone: ${studentInfo.phone || "Not Found"}`, 60, 32);

        // rows for attendance
        const tableData = [];


        attendanceData.forEach((record) => {
            const row = [
                record.class_info.title,
                format(new Date(record?.attendance_date), "MMMM d, yyyy"),
                record?.attendance_record?.is_present,
                record?.attendance_record?.remarks,
                `${record?.faculty_info?.first_name} ${record?.faculty_info?.last_name}`,
            ];
            tableData.push(row);
        });


        // Define the columns for the table
        autoTable(doc, {
            head: [["Class Title", "Attendance Date", "Status", "Remarks", "Recorders Name"]],
            body: tableData,
            startY: 50,
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
        })

        doc.save(`attendance of ${studentInfo.first_name}_${studentInfo.last_name}.pdf`);
    }



    if (isPending) return <LoadingSpinner />


    return (
        <div className="">
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {
                <div className="flex justify-end">
                    <button
                        disabled={studentAttendance.length === 0}
                        onClick={() => generatePDF(studentAttendance)}
                        className="btn text-white btn-sm flex btn-success"><FaDownload />
                    </button>
                </div>
            }

            {
                studentAttendance.length === 0 ?
                    <p className="text-lg text-error font-medium text-center my-2">No Attendance record available to show</p>
                    :

                    <div className="overflow-x-auto">
                        <table className="table table-xs md:table-sm">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Class Title</th>
                                    <th>Attendance Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Created By</th>
                                    <th>Acton</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    studentAttendance.length > 0 && studentAttendance?.map((record, idx) =>
                                        <tr
                                            className="hover"
                                            key={record?._id}>

                                            <th>{idx + 1}</th>
                                            {/* title */}
                                            <td>
                                                {record?.class_info?.title}
                                            </td>


                                            {/* date */}
                                            <td>{format(new Date(record?.attendance_date), "MMMM d, yyyy")}</td>


                                            {/* status */}
                                            <td className="capitalize flex items-center gap-2 text-xs md:text-base">
                                                {record?.attendance_record?.is_present}
                                                {record?.attendance_record?.is_present === "absent" && <div className="badge badge-error rounded-full badge-xs"></div>}
                                                {record?.attendance_record?.is_present === "present" && <div className="badge badge-success rounded-full badge-xs"></div>}
                                                {record?.attendance_record?.is_present === "late" && <div className="badge badge-warning rounded-full badge-xs"></div>}
                                                {record?.attendance_record?.is_present === "early leave" && <div className="badge badge-info rounded-full badge-xs"></div>}
                                            </td>


                                            {/* remarks */}
                                            <td className="text-center">
                                                {record?.attendance_record?.remarks || "-"}
                                            </td>


                                            {/* created by */}
                                            <td>
                                                {`${record?.faculty_info?.first_name} ${record?.faculty_info?.last_name}`}
                                            </td>


                                            {/* action button */}
                                            <td className="text-center">
                                                {/* for student */}
                                                {
                                                    user?.user_role === "student" && <Link to={`/student/myEnrolledCourses/classDetails/${record?.class_id}`} className="btn btn-xs md:btn-md text-[9px] md:text-xs lg:text-sm btn-success text-white">Class Details</Link>
                                                }


                                                {/* for admin and faculty */}
                                                {
                                                    user?.user_role !== "student" && <Link to={`/${user?.user_role}/classDetails/${record?.class_id}`} className="btn btn-xs md:btn-md text-[9px] md:text-xs lg:text-sm btn-success text-white">Class Details</Link>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
            }

        </div>
    );
};

// add academic info page link in course detailed page


StudentAttendanceTab.propTypes = {
    studentInfo: PropTypes.object
}

export default StudentAttendanceTab;