import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from '../../Utilities/LoadingSpinner';
import TanstackQueryErrorMessage from '../../Utilities/TanstackQueryErrorMessage';
import SectionHeading from '../../Utilities/SectionHeading';
import { format } from 'date-fns';
import { BiError } from "react-icons/bi";

// todo: crate class details btn functionality

const EnrolledCoursesClassSchedule = ({ courseID }) => {
    const course_id = courseID
    const axiosSecure = useAxiosSecure();

    const { data: enrolledCoursesClassSchedule = [], isPending, isError, error } = useQuery({
        queryKey: ["enrolledCoursesClassSchedule"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/${course_id}`);

            return res.data.data;
        },
        enabled: !!course_id
    })



    return (
        <div className='mt-10'>

            <SectionHeading title="Class Schedules" />

            {isPending && <LoadingSpinner />}

            {/* Error messages */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            {enrolledCoursesClassSchedule.length === 0 && <p className="text-center text-error text-lg font-medium">Class Schedules are not added yet</p>}

            <div className="space-y-2">
                {enrolledCoursesClassSchedule.map((singleClass) => (
                    <div key={singleClass._id} className="flex justify-between items-center bg-base-300 border p-3 rounded">
                        <div className="space-y-1">

                            {/* title */}
                            <h3 className="font-semibold">{singleClass.title}</h3>

                            {/* description */}
                            <p className="text-sm">{singleClass.description}</p>


                            {/* time */}
                            <p className="text-sm">
                                Class Time:

                                <button className="badge badge-success text-white ml-2 rounded">
                                    {format(singleClass.scheduled_time, "yyyy-MM-dd, hh:mm a")}
                                </button>
                            </p>

                            {/* location */}
                            <p className="text-sm">
                                <span className="mr-1">
                                    Location:
                                </span>
                                {singleClass.location}

                                {
                                    singleClass.location === "" &&
                                    <BiError className="inline ml-1 text-error text-base animate-pulse" />
                                }
                            </p>


                            {/* faculty */}
                            <div className='flex gap-1'>
                                <h2>Faculties: </h2>
                                {(singleClass.faculty_id).map(singleFaculty =>
                                    <p key={singleFaculty._id} className='badge badge-outline'>{singleFaculty.first_name} {singleFaculty.last_name}</p>
                                )}
                            </div>
                        </div>

                        <button className="btn btn-success text-white">Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};


EnrolledCoursesClassSchedule.propTypes = {
    courseID: PropTypes.string
}


export default EnrolledCoursesClassSchedule;