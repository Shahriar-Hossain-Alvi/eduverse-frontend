import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SectionHeading from "../../Utilities/SectionHeading";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import PropTypes from "prop-types";
import { Link } from "react-router";
import useAuth from "../../Hooks/useAuth";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";


const SingleCourseEnrollmentList = ({ id }) => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: singleCourseEnrollmentList = [], isError, error, isPending } = useQuery({
        queryKey: ["singleCourseAndStudentEnrollments", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseStudentEnrollment/enrollmentList/${id}`);

            if (res.data.success === true) return res.data.data;
        }
    });


    return (
        <div>
            <div className="divider divider-info my-4"></div>

            <SectionHeading title="Enrolled Students" />

            {isPending && <LoadingSpinner />}

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            <div className="overflow-x-auto">
                <table className="table border border-gray-400">
                    {/* head */}
                    <thead>
                        <tr className="border border-gray-400">
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            {user.user_role === "admin" && <th>Profile</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            singleCourseEnrollmentList.map((singleStudent, index) => (
                                <tr key={singleStudent._id} className="hover border-gray-400">
                                    <th>{index+1}</th>
                                    <td>{singleStudent.users_id.first_name} {singleStudent.users_id.last_name}</td>
                                    <td>{singleStudent.users_id.email}</td>
                                    {
                                        user.user_role === "admin" && <td>
                                        <Link to={`/admin/users/${singleStudent.users_id._id}`} className="btn btn-sm btn-success text-white">View Profile</Link>
                                    </td>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

SingleCourseEnrollmentList.propTypes = {
    id: PropTypes.string,
}

export default SingleCourseEnrollmentList;