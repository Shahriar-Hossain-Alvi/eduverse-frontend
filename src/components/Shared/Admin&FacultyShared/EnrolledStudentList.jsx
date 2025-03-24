import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import { Link } from "react-router";
import PropTypes from 'prop-types';
import SectionHeading from "../../Utilities/SectionHeading";


const EnrolledStudentList = ({ course_id }) => {
    const axiosSecure = useAxiosSecure();

    // fetch enrolled students using course id
    const { data: singleAssignedCourseEnrollmentList = [], isError, error, isPending } = useQuery({
        queryKey: ["singleAssignedCourseEnrollmentList", course_id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseStudentEnrollment/enrollmentList/${course_id}`) // fetch enrolled students using course id

            return res.data.data;
        },
        enabled: !!course_id // Runs only when course_id is available
    }); 


    if (isPending) return <LoadingSpinner />


    return (
        <div>
            <SectionHeading title="Enrolled Students" />

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {/* table */}
            <div className="overflow-x-auto mb-20">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {singleAssignedCourseEnrollmentList.map((student, index) => (
                            <tr className="hover" key={student._id}>
                                <th>{index + 1}</th>
                                <td>{student.users_id.first_name} {student.users_id.last_name}</td>
                                <td>{student.users_id.email}</td>
                                <td><Link to={`/StudentAcademicInfo/${student.users_id._id}`} className="btn btn-success btn-sm text-white">Profile</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

EnrolledStudentList.propTypes = {
    course_id: PropTypes.string
}

export default EnrolledStudentList;