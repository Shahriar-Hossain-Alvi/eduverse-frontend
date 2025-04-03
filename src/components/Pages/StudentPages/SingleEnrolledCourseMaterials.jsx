import PropTypes from "prop-types";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const SingleEnrolledCourseMaterials = ({ courseID }) => {
    const course_id = courseID
    const axiosSecure = useAxiosSecure();

    const { data: enrolledCoursesMaterials = [], isPending, isError, error } = useQuery({
        queryKey: ["enrolledCoursesMaterials"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseMaterials/getMaterialByCourseId/${course_id}`);

            return res.data.data;
        },
        enabled: !!course_id
    })


    return (
        <div className='mt-10'>

            <SectionHeading title="Course Materials" />

            {isPending && <LoadingSpinner />}

            {/* Error messages */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <div>
                {enrolledCoursesMaterials.length === 0 && <p className="text-center text-error text-lg font-medium">Course Materials are not added yet</p>}
            </div>


            {/* table */}
            {enrolledCoursesMaterials.length > 0 &&
                <div className="overflow-x-auto">
                    <table className="table table-sm md:table-md">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Uploader</th>
                                <th>Resource</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                enrolledCoursesMaterials.map((material) =>
                                    <tr key={material._id}>

                                        <td className="text-xs md:text-base">{material.title}</td>

                                        <td className="text-xs md:text-base">{material.description}</td>

                                        <td className="text-xs md:text-base">{material.created_by.first_name} {material.created_by.last_name}</td>

                                        <td>
                                            <a href={material.material_url}
                                                target="_blank" rel="noreferrer"
                                                className="btn btn-sm md:btn-md text-xs btn-success text-white md:text-sm">
                                                Get Resource
                                            </a>
                                        </td>
                                    </tr>

                                )}
                        </tbody>
                    </table>
                </div>
            }

        </div>
    );
};


SingleEnrolledCourseMaterials.propTypes = {
    courseID: PropTypes.string
}

export default SingleEnrolledCourseMaterials;