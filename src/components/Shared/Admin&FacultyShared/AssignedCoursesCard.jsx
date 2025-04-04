import useTheme from "../../Hooks/useTheme"
import themeStyles from '../../Utilities/themeStyles';
import { Link } from 'react-router';
import { format } from 'date-fns';
import PropTypes from 'prop-types';



const AssignedCoursesCard = ({ assignedCourses }) => {
    console.log(assignedCourses);

    const { theme } = useTheme();

    return (
        <div>
            <div className="grid grid-cols-1 gap-6">
                {assignedCourses.map((assignedCourse) => (
                    // card
                    <div key={assignedCourse._id} className={`${themeStyles.background[theme]} overflow-hidden shadow-lg rounded-lg grid md:grid-cols-6 gap-3 p-3`}>

                        {/* cover image */}
                        <div className="md:flex rounded-md md:col-span-2">
                            <img
                                className="w-full rounded-md object-fill"
                                src={assignedCourse.course_id.cover_url}
                                alt={assignedCourse.course_id.title}
                            />
                        </div>


                        <div className="md:col-span-4">
                            <h2 className="text-xl font-bold  mb-2">{assignedCourse.course_id.title}</h2>

                            {/* three badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="badge badge-primary text-white font-medium">{assignedCourse.course_id.credits} Credits</div>

                                <div className="badge badge-secondary text-white font-medium">{assignedCourse.course_id.total_available_seats} Seats</div>

                                {assignedCourse.course_id.is_active ? (
                                    <div className="badge bg-green-600 text-white font-medium border-none">Active</div>
                                ) : (
                                    <div className="badge badge-error text-white font-medium">Inactive</div>
                                )}
                            </div>

                            {/* Date and co-faculty */}
                            <div className="flex gap-5">
                                {/* Dates */}
                                <div className="mb-4 ">
                                    <h3 className="text-lg font-semibold mb-2 ">Course Dates</h3>

                                    <p className="text-sm">
                                        Start: {format(new Date(assignedCourse.course_id.start_date), "MMMM d, yyyy")}
                                    </p>

                                    <p className="text-sm">
                                        End: {format(new Date(assignedCourse.course_id.end_date), "MMMM d, yyyy")}
                                    </p>
                                </div>

                                {/* Co-Faculty */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">Faculty</h3>

                                    <ul className="space-y-1">
                                        {assignedCourse.users_id.map((user) => (
                                            <li key={user._id} className="text-sm">
                                                {user.first_name} {user.last_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* view details button */}
                            <div className="flex justify-end">
                                <Link to={`/faculty/myCourses/${assignedCourse._id}`} className={`btn border btn-block ${themeStyles.button[theme]}`}>View </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

AssignedCoursesCard.propTypes = {
    assignedCourses: PropTypes.array
}

export default AssignedCoursesCard;


// **
//
//
// * /