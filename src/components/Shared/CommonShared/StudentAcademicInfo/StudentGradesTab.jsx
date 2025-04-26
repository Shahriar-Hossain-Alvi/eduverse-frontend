import { useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import { format } from "date-fns";


const StudentGradesTab = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    // fetch grades
    const { data: studentAcademicInfo = [], isPending, isError, error } = useQuery({
        queryKey: [],
        queryFn: async () => {
            const res = await axiosSecure.get(`/studentGrades/student/${id}`);

            return res.data.data;
        },
        enabled: !!id
    })

    console.log(studentAcademicInfo);

    if (isPending) return <LoadingSpinner />

    return (
        <div>
            Tab 1: Grades Table (download pdf)

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

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
                            studentAcademicInfo.map((record, idx) =>
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
        </div>
    );
};

export default StudentGradesTab;