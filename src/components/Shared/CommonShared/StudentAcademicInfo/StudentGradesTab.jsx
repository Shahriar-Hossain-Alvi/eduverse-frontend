import autoTable from "jspdf-autotable";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import { format } from "date-fns";
import PropTypes from 'prop-types';
import jsPDF from "jspdf";
import { FaDownload } from "react-icons/fa";




const StudentGradesTab = ({ studentGrades = [], studentGradesIsPending, studentGradesIsError, studentGradesError }) => {



    // create grades pdf
    const generatePDF = (gradesData) => {

        const doc = new jsPDF();

        // get student info
        const gradesOf = gradesData[0]?.student_id;


        // title
        doc.setFontSize(30);
        doc.text("Grades of completed courses", 45, 10);

        // student name, email, phone
        doc.setFontSize(16);
        doc.text(`Grades of: ${gradesOf.first_name || "Deleted"} ${gradesOf.last_name || "User"}`, 60, 20);

        doc.setFontSize(12);
        doc.text(`Email: ${gradesOf.email || "Not Found"}`, 60, 27);

        doc.setFontSize(12);
        doc.text(`Phone: ${gradesOf.phone || "Not Found"}`, 60, 32);

        // rows for attendance
        const tableData = [];


        gradesData.forEach((record) => {
            const row = [
                record.course_id.title,
                format(new Date(record?.course_id?.start_date), "MMMM d, yyyy") + " - " + format(new Date(record?.course_id?.end_date), "MMMM d, yyyy")
                ,
                record.full_marks,
                record.obtained_marks,
                record.percentage.toFixed(2),
                record.remarks,
                record.faculty_id.first_name + " " + record.faculty_id.last_name,

            ];
            tableData.push(row);
        });


        // Define the columns for the table
        autoTable(doc, {
            head: [["Course Name", "Duration", "Full Marks", "Obtained Marks", "Percentage", "Remarks", "Graded By"]],
            body: tableData,
            startY: 50,
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
        })

        doc.save(`grades of ${gradesOf.first_name}_${gradesOf.last_name}.pdf`);
    }


    if (studentGradesIsPending) return <LoadingSpinner />

    return (
        <div>
            {studentGradesIsError && <TanstackQueryErrorMessage errorMessage={studentGradesError.message} />}

            {
                <div className="flex justify-end">
                    <button
                        disabled={studentGrades.length === 0}
                        onClick={() => generatePDF(studentGrades)}
                        className="btn text-white btn-sm flex btn-success"><FaDownload />
                    </button>
                </div>
            }

            {
                studentGrades.length === 0 ?
                    <p className="text-lg text-error font-medium text-center my-2">No Grades available to show</p>
                    :

                    <div className="overflow-x-auto">
                        <table className="table table-xs md:table-sm">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Course name</th>
                                    <th>Duration</th>
                                    <th>Full Marks</th>
                                    <th>Obtained Marks</th>
                                    <th>Percentage</th>
                                    <th>Remarks</th>
                                    <th>Graded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    studentGrades.length > 0 && studentGrades?.map((record, idx) =>
                                        <tr
                                            className="hover"
                                            key={record?._id}>
                                            <th>{idx + 1}</th>

                                            <td>{record?.course_id?.title}</td>

                                            <td>{format(new Date(record?.course_id?.start_date), "MMMM d, yyyy")} - {format(new Date(record?.course_id?.end_date), "MMMM d, yyyy")}</td>

                                            <td className="text-center">{record?.full_marks}</td>

                                            <td className="text-center">{record?.obtained_marks}</td>

                                            <td className="text-center">{record?.percentage.toFixed(2)}%</td>

                                            <td className="text-center">{record?.remarks}</td>

                                            <td className="text-center">{record?.faculty_id?.first_name} {record?.faculty_id?.last_name}</td>
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

StudentGradesTab.propTypes = {
    studentGrades: PropTypes.array,
    studentGradesIsPending: PropTypes.bool,
    studentGradesIsError: PropTypes.bool,
    studentGradesError: PropTypes.func
}

export default StudentGradesTab;